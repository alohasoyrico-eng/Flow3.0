#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-root-index-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-react-root-index-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const sourceFile = "packages/react/src/index.ts";
const runtimeFile = "packages/react/src/index.js";
const declarationFile = "packages/react/src/index.d.ts";

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
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-react-root-index-ts-audit-"));
  const result = spawnSync(path.join(root, "node_modules/.bin/tsc"), [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--jsx", "react",
    "--moduleResolution", "bundler",
    "--allowSyntheticDefaultImports",
    "--skipLibCheck",
    "--rootDir", absolute("packages/react/src"),
    "--outDir", outDir,
    absolute(sourceFile),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  const compiledFile = path.join(outDir, "index.js");
  const expectedRuntime = result.status === 0 && fs.existsSync(compiledFile)
    ? fs.readFileSync(compiledFile, "utf8")
    : null;
  fs.rmSync(outDir, { recursive: true, force: true });
  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    expectedRuntime,
  };
}

function exportNames(source) {
  const names = new Set();
  const re = /^export\s+\{\s*([^}]+?)\s*\}\s+from\s+["'][^"']+["'];/gm;
  for (const match of source.matchAll(re)) {
    for (const part of match[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) names.add(name);
    }
  }
  return [...names].sort();
}

function typeExportCount(source) {
  return [...source.matchAll(/^export\s+type\s+\{/gm)].length;
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
  return [
    "# System React root index TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs the root React entrypoint. TypeScript is the maintained export source, JavaScript is generated runtime, and declaration files remain compatible during incremental migration.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Runtime exports: ${report.inventory.runtimeExports}`,
    `- Source exports: ${report.inventory.sourceExports}`,
    `- Declaration type export groups: ${report.inventory.declarationTypeExportGroups}`,
    `- Stale runtime files: ${report.inventory.staleRuntimeFiles}`,
    `- React root index TypeScript surface debt: ${report.inventory.reactRootIndexTypescriptSurfaceDebt}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Detail |",
    "| --- | --- | --- |",
    ...report.gates.map((item) => `| ${item.id} | ${item.status} | ${item.failMessage ?? "OK"} |`),
    "",
  ].join("\n");
}

function main() {
  const compiled = compileExpectedRuntime();
  const hasSource = exists(sourceFile);
  const hasRuntime = exists(runtimeFile);
  const hasDeclaration = exists(declarationFile);
  const source = hasSource ? read(sourceFile) : "";
  const runtime = hasRuntime ? read(runtimeFile) : "";
  const declaration = hasDeclaration ? read(declarationFile) : "";
  const sourceExports = exportNames(source);
  const runtimeExports = exportNames(runtime);
  const declarationExports = exportNames(declaration);
  const staleRuntime = !hasRuntime || compiled.expectedRuntime == null || runtime !== compiled.expectedRuntime;
  const gates = [
    gate(
      "root-index-has-ts-source-runtime-and-declaration",
      hasSource && hasRuntime && hasDeclaration,
      { hasSource, hasRuntime, hasDeclaration },
      "React root index must have TypeScript source, generated JavaScript runtime, and declaration file.",
    ),
    gate(
      "root-index-runtime-generated-from-ts",
      compiled.status === 0 && !staleRuntime,
      { compileStatus: compiled.status, stderr: compiled.stderr, staleRuntime },
      "React root index runtime is stale. Run npm run build:react.",
    ),
    gate(
      "root-index-runtime-export-parity",
      JSON.stringify(sourceExports) === JSON.stringify(runtimeExports),
      { sourceExports: sourceExports.length, runtimeExports: runtimeExports.length },
      "React root index generated runtime must preserve all value exports from the TypeScript source.",
    ),
    gate(
      "root-index-declaration-export-parity",
      JSON.stringify(sourceExports) === JSON.stringify(declarationExports),
      { sourceExports: sourceExports.length, declarationExports: declarationExports.length },
      "React root index declarations must preserve all value exports from the TypeScript source.",
    ),
    gate(
      "root-index-owns-type-exports-in-ts-source",
      typeExportCount(source) > 0 && typeExportCount(source) === typeExportCount(declaration),
      { sourceTypeExportGroups: typeExportCount(source), declarationTypeExportGroups: typeExportCount(declaration) },
      "React root index TypeScript source must own the type export groups, not only the declaration file.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-react-root-index-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    gates,
    inventory: {
      sourceExports: sourceExports.length,
      runtimeExports: runtimeExports.length,
      declarationExports: declarationExports.length,
      sourceTypeExportGroups: typeExportCount(source),
      declarationTypeExportGroups: typeExportCount(declaration),
      staleRuntimeFiles: staleRuntime ? 1 : 0,
      reactRootIndexTypescriptSurfaceDebt: failing.length + (staleRuntime ? 1 : 0),
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    sourceExports: report.inventory.sourceExports,
    runtimeExports: report.inventory.runtimeExports,
    reactRootIndexTypescriptSurfaceDebt: report.inventory.reactRootIndexTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
