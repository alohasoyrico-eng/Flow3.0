#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-component-contract-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-component-contract-typescript-surface.md");
const checkMode = process.argv.includes("--check");

const packageFile = "packages/components/package.json";
const sourceFile = "packages/components/src/contracts.ts";
const runtimeFile = "packages/components/src/contracts.js";

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function compileExpectedRuntime() {
  if (!exists(sourceFile)) {
    return { status: 1, stdout: "", stderr: `${sourceFile} is missing.`, expected: null };
  }
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-component-contract-ts-audit-"));
  const result = spawnSync(path.join(root, "node_modules/.bin/tsc"), [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--moduleResolution", "bundler",
    "--skipLibCheck",
    "--outDir", outDir,
    path.join(root, sourceFile),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  const compiledFile = path.join(outDir, "contracts.js");
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
  const rows = report.gates
    .map((item) => `| ${item.id} | ${item.status} | ${item.failMessage ?? "OK"} |`)
    .join("\n");
  return [
    "# System component contract TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs the public component contract entrypoint: TypeScript is the maintained source and JavaScript remains the generated runtime export.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Component contract TypeScript surface debt: ${report.inventory.componentContractTypescriptSurfaceDebt}`,
    `- Public contract export: ${report.publicContractExport}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Detail |",
    "| --- | --- | --- |",
    rows,
    "",
  ].join("\n");
}

function main() {
  const packageJson = readJson(packageFile);
  const sourceText = exists(sourceFile) ? read(sourceFile) : "";
  const runtimeCurrent = exists(runtimeFile) ? read(runtimeFile) : null;
  const compiled = compileExpectedRuntime();
  const gates = [
    gate(
      "public-contract-export-remains-runtime-js",
      packageJson.exports?.["./contracts"] === "./src/contracts.js",
      { export: packageJson.exports?.["./contracts"] ?? null },
      "The component contract public export must remain JS runtime for current consumers.",
    ),
    gate(
      "typescript-source-exists",
      exists(sourceFile),
      { file: sourceFile, exists: exists(sourceFile) },
      "The component contracts runtime must have a maintained TypeScript source file.",
    ),
    gate(
      "typescript-source-has-contract-types",
      /export type ComponentContract =/.test(sourceText)
        && /satisfies Record<string, ComponentContract>/.test(sourceText)
        && /export type ComponentContractId = keyof typeof componentContracts;/.test(sourceText),
      { file: sourceFile },
      "The component contract source must expose typed contract shapes and ids.",
    ),
    gate(
      "runtime-generated-from-typescript",
      compiled.status === 0 && runtimeCurrent === compiled.expected,
      {
        source: sourceFile,
        runtime: runtimeFile,
        compileStatus: compiled.status,
        stderr: compiled.stderr,
      },
      "packages/components/src/contracts.js is stale or not generated from packages/components/src/contracts.ts. Run npm run build:components:contracts.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-component-contract-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    publicContractExport: packageJson.exports?.["./contracts"] ?? null,
    gates,
    inventory: {
      componentContractTypescriptSurfaceDebt: failing.length,
    },
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    componentContractTypescriptSurfaceDebt: report.inventory.componentContractTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
