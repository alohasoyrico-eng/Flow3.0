#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-component-platform-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-component-platform-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const componentsSourceDir = "packages/components/src";
const sourceDir = "packages/components/src/platforms";

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function listFiles(dir) {
  const absoluteDir = absolute(dir);
  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(relative) : [relative];
  });
}

function compileExpectedRuntimes(files) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-component-platform-ts-audit-"));
  const result = spawnSync(path.join(root, "node_modules/.bin/tsc"), [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--moduleResolution", "bundler",
    "--skipLibCheck",
    "--rootDir", absolute(componentsSourceDir),
    "--outDir", outDir,
    ...files.map(absolute),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });

  const expected = new Map();
  if (result.status === 0) {
    for (const file of files) {
      const relative = path.relative(sourceDir, file).replace(/\.ts$/, ".js");
      const compiledFile = path.join(outDir, "platforms", relative);
      if (fs.existsSync(compiledFile)) expected.set(path.join(sourceDir, relative), fs.readFileSync(compiledFile, "utf8"));
    }
  }
  fs.rmSync(outDir, { recursive: true, force: true });
  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    expected,
  };
}

function gate(id, passed, evidence, failMessage) {
  return {
    id,
    status: passed ? "PASS" : "FAIL",
    evidence,
    failMessage: passed ? null : failMessage,
  };
}

function renderMarkdown(report) {
  const gateRows = report.gates
    .map((item) => `| ${item.id} | ${item.status} | ${item.failMessage ?? "OK"} |`)
    .join("\n");
  const staleRows = report.staleRuntimeFiles
    .slice(0, 80)
    .map((file) => `| ${file} |`)
    .join("\n");
  const missingRows = report.missingTypeScriptSources
    .slice(0, 80)
    .map((file) => `| ${file} |`)
    .join("\n");
  return [
    "# System component platform TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs component platform adapters: TypeScript files are maintained sources and JavaScript files remain generated runtime exports.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Platform runtime files: ${report.inventory.platformRuntimeFiles}`,
    `- Platform TypeScript source files: ${report.inventory.platformTypeScriptSourceFiles}`,
    `- Component platform TypeScript surface debt: ${report.inventory.componentPlatformTypescriptSurfaceDebt}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Detail |",
    "| --- | --- | --- |",
    gateRows,
    "",
    "## Stale Runtime Files",
    "",
    "| File |",
    "| --- |",
    staleRows || "| None |",
    "",
    "## Missing TypeScript Sources",
    "",
    "| File |",
    "| --- |",
    missingRows || "| None |",
    "",
  ].join("\n");
}

function main() {
  const runtimeFiles = listFiles(sourceDir).filter((file) => file.endsWith(".js")).sort();
  const sourceFiles = listFiles(sourceDir).filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts")).sort();
  const missingTypeScriptSources = runtimeFiles
    .map((file) => file.replace(/\.js$/, ".ts"))
    .filter((file) => !exists(file));
  const compiled = compileExpectedRuntimes(sourceFiles);
  const staleRuntimeFiles = runtimeFiles.filter((file) => {
    const expected = compiled.expected.get(file);
    return expected == null || read(file) !== expected;
  });
  const exportIndexSource = exists(`${sourceDir}/index.ts`) ? read(`${sourceDir}/index.ts`) : "";
  const gates = [
    gate(
      "all-platform-runtimes-have-typescript-source",
      missingTypeScriptSources.length === 0,
      { runtimeFiles: runtimeFiles.length, missingTypeScriptSources },
      "Every platform runtime .js file must have a paired .ts source.",
    ),
    gate(
      "typescript-source-count-matches-runtime-count",
      runtimeFiles.length === sourceFiles.length,
      { runtimeFiles: runtimeFiles.length, sourceFiles: sourceFiles.length },
      "Platform runtime/source counts must match 1:1.",
    ),
    gate(
      "platform-index-is-typescript-source",
      exists(`${sourceDir}/index.ts`) && /export \{[\s\S]+PlatformContract/.test(exportIndexSource),
      { file: `${sourceDir}/index.ts`, exists: exists(`${sourceDir}/index.ts`) },
      "The platform index must be maintained as a TypeScript source file.",
    ),
    gate(
      "runtime-generated-from-typescript",
      compiled.status === 0 && staleRuntimeFiles.length === 0,
      {
        compileStatus: compiled.status,
        stderr: compiled.stderr,
        staleRuntimeFiles,
      },
      "One or more platform runtime .js files are stale or not generated from .ts sources. Run npm run build:components:platforms.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-component-platform-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    gates,
    staleRuntimeFiles,
    missingTypeScriptSources,
    inventory: {
      platformRuntimeFiles: runtimeFiles.length,
      platformTypeScriptSourceFiles: sourceFiles.length,
      missingTypeScriptSources: missingTypeScriptSources.length,
      staleRuntimeFiles: staleRuntimeFiles.length,
      componentPlatformTypescriptSurfaceDebt: missingTypeScriptSources.length + staleRuntimeFiles.length + failing.length,
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    platformRuntimeFiles: report.inventory.platformRuntimeFiles,
    platformTypeScriptSourceFiles: report.inventory.platformTypeScriptSourceFiles,
    componentPlatformTypescriptSurfaceDebt: report.inventory.componentPlatformTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
