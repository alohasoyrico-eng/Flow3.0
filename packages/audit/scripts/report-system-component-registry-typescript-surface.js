#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-component-registry-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-component-registry-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const componentsSourceDir = "packages/components/src";
const sourceFile = "packages/components/src/registry.ts";
const runtimeFile = "packages/components/src/registry.js";

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
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-component-registry-ts-audit-"));
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

  const compiledFile = path.join(outDir, "registry.js");
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
    "# System component registry TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs the component demo registry: TypeScript is the maintained source and JavaScript remains the generated runtime export.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Registry runtime files: ${report.inventory.registryRuntimeFiles}`,
    `- Registry TypeScript source files: ${report.inventory.registryTypeScriptSourceFiles}`,
    `- Component registry TypeScript surface debt: ${report.inventory.componentRegistryTypescriptSurfaceDebt}`,
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
  const staleRuntime = !hasRuntime || compiled.expected == null || read(runtimeFile) !== compiled.expected;
  const source = hasSource ? read(sourceFile) : "";
  const gates = [
    gate(
      "registry-runtime-has-typescript-source",
      hasSource && hasRuntime,
      { sourceFile, runtimeFile, hasSource, hasRuntime },
      "The component registry runtime must have a paired TypeScript source.",
    ),
    gate(
      "registry-exports-component-demo-props-contract",
      /export type ComponentDemoPropsInput/.test(source)
        && /export type ComponentDemoPropsOutput/.test(source)
        && /export function componentDemoProps/.test(source),
      { sourceFile },
      "The registry TypeScript source must expose explicit demo input/output contracts.",
    ),
    gate(
      "runtime-generated-from-typescript",
      compiled.status === 0 && !staleRuntime,
      {
        compileStatus: compiled.status,
        stderr: compiled.stderr,
        staleRuntime,
      },
      "The component registry runtime is stale or not generated from registry.ts. Run npm run build:components:registry.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-component-registry-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    gates,
    inventory: {
      registryRuntimeFiles: hasRuntime ? 1 : 0,
      registryTypeScriptSourceFiles: hasSource ? 1 : 0,
      staleRuntimeFiles: staleRuntime ? 1 : 0,
      componentRegistryTypescriptSurfaceDebt: failing.length + (staleRuntime ? 1 : 0),
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    registryRuntimeFiles: report.inventory.registryRuntimeFiles,
    registryTypeScriptSourceFiles: report.inventory.registryTypeScriptSourceFiles,
    componentRegistryTypescriptSurfaceDebt: report.inventory.componentRegistryTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
