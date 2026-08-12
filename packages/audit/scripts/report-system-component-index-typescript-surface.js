#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-component-index-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-component-index-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const componentsSourceDir = "packages/components/src";
const sourceFile = "packages/components/src/index.ts";
const runtimeFile = "packages/components/src/index.js";

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function compileExpectedRuntime() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-component-index-ts-audit-"));
  const result = spawnSync(path.join(root, "node_modules/.bin/tsc"), [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--moduleResolution", "bundler",
    "--skipLibCheck",
    "--rootDir", absolute(componentsSourceDir),
    "--outDir", outDir,
    absolute(sourceFile),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });

  const compiledFile = path.join(outDir, "index.js");
  const expected = result.status === 0 && fs.existsSync(compiledFile)
    ? fs.readFileSync(compiledFile, "utf8")
    : null;
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
  return [
    "# System component index TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs the public components package index: TypeScript is the maintained source and JavaScript remains the generated runtime export.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Index runtime files: ${report.inventory.indexRuntimeFiles}`,
    `- Index TypeScript source files: ${report.inventory.indexTypeScriptSourceFiles}`,
    `- Component index TypeScript surface debt: ${report.inventory.componentIndexTypescriptSurfaceDebt}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Detail |",
    "| --- | --- | --- |",
    gateRows,
    "",
  ].join("\n");
}

function main() {
  const compiled = compileExpectedRuntime();
  const hasSource = exists(sourceFile);
  const hasRuntime = exists(runtimeFile);
  const source = hasSource ? read(sourceFile) : "";
  const runtime = hasRuntime ? read(runtimeFile) : "";
  const staleRuntime = !hasRuntime || compiled.expected == null || runtime !== compiled.expected;
  const gates = [
    gate(
      "component-index-runtime-has-typescript-source",
      hasSource && hasRuntime,
      { sourceFile, runtimeFile, hasSource, hasRuntime },
      "The public components index runtime must have a paired TypeScript source.",
    ),
    gate(
      "component-index-source-has-no-cachebuster-imports",
      !/\.js\?v=/.test(source),
      { sourceFile },
      "The TypeScript source for the public components index must use package-safe module specifiers without cachebuster query strings.",
    ),
    gate(
      "component-index-exports-owned-surfaces",
      source.includes("./primitives/charts.js")
        && source.includes("./platforms/index.js")
        && source.includes("./registry.js")
        && source.includes("componentDemoProps"),
      { sourceFile },
      "The public components index must re-export primitives, platform contracts, and the demo registry from owned source boundaries.",
    ),
    gate(
      "runtime-generated-from-typescript",
      compiled.status === 0 && !staleRuntime,
      {
        compileStatus: compiled.status,
        stderr: compiled.stderr,
        staleRuntime,
      },
      "The public components index runtime is stale or not generated from index.ts. Run npm run build:components:index.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-component-index-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    gates,
    inventory: {
      indexRuntimeFiles: hasRuntime ? 1 : 0,
      indexTypeScriptSourceFiles: hasSource ? 1 : 0,
      staleRuntimeFiles: staleRuntime ? 1 : 0,
      componentIndexTypescriptSurfaceDebt: failing.length + (staleRuntime ? 1 : 0),
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    indexRuntimeFiles: report.inventory.indexRuntimeFiles,
    indexTypeScriptSourceFiles: report.inventory.indexTypeScriptSourceFiles,
    componentIndexTypescriptSurfaceDebt: report.inventory.componentIndexTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
