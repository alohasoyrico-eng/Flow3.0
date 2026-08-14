#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-internal-props-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-react-internal-props-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const reactSourceDir = "packages/react/src";
const sourceFile = "packages/react/src/internal/props.ts";
const runtimeFile = "packages/react/src/internal/props.js";
const declarationFile = "packages/react/src/internal/props.d.ts";
const sourceRuntimeHeader = [
  "/* @generated from packages/react/src TypeScript source.",
  " * Do not edit this compatibility runtime directly.",
  " * Authored source of truth is the paired .ts/.tsx file.",
  " */",
  "",
].join("\n");

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
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-react-internal-props-ts-audit-"));
  const result = spawnSync(path.join(root, "node_modules/.bin/tsc"), [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--moduleResolution", "bundler",
    "--skipLibCheck",
    "--rootDir", absolute(reactSourceDir),
    "--outDir", outDir,
    absolute(sourceFile),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });

  const compiledFile = path.join(outDir, "internal/props.js");
  const expected = result.status === 0 && fs.existsSync(compiledFile)
    ? `${sourceRuntimeHeader}${fs.readFileSync(compiledFile, "utf8")}`
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
    "# System React internal props TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs the shared React props helper: TypeScript is the maintained source and JavaScript remains the generated runtime used by React components.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Runtime files: ${report.inventory.runtimeFiles}`,
    `- TypeScript source files: ${report.inventory.typeScriptSourceFiles}`,
    `- React internal props TypeScript surface debt: ${report.inventory.reactInternalPropsTypescriptSurfaceDebt}`,
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
  const hasDeclaration = exists(declarationFile);
  const source = hasSource ? read(sourceFile) : "";
  const declaration = hasDeclaration ? read(declarationFile) : "";
  const runtime = hasRuntime ? read(runtimeFile) : "";
  const staleRuntime = !hasRuntime || compiled.expected == null || runtime !== compiled.expected;
  const gates = [
    gate(
      "react-internal-props-runtime-has-typescript-source",
      hasSource && hasRuntime,
      { sourceFile, runtimeFile, hasSource, hasRuntime },
      "The shared React props helper runtime must have a paired TypeScript source.",
    ),
    gate(
      "flow-data-attributes-contract-owned-in-typescript",
      /export type FlowDataAttributes/.test(source),
      { sourceFile },
      "FlowDataAttributes must be owned in the TypeScript source, not only in a declaration file.",
    ),
    gate(
      "declaration-imports-remain-compatible",
      hasDeclaration && /FlowDataAttributes/.test(declaration),
      { declarationFile, hasDeclaration },
      "Existing declaration imports must remain compatible while React components are migrated incrementally.",
    ),
    gate(
      "runtime-generated-from-typescript",
      compiled.status === 0 && !staleRuntime,
      {
        compileStatus: compiled.status,
        stderr: compiled.stderr,
        staleRuntime,
      },
      "The shared React props runtime is stale or not generated from props.ts. Run npm run build:react:internal-props.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-react-internal-props-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    gates,
    inventory: {
      runtimeFiles: hasRuntime ? 1 : 0,
      typeScriptSourceFiles: hasSource ? 1 : 0,
      declarationFiles: hasDeclaration ? 1 : 0,
      staleRuntimeFiles: staleRuntime ? 1 : 0,
      reactInternalPropsTypescriptSurfaceDebt: failing.length + (staleRuntime ? 1 : 0),
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    runtimeFiles: report.inventory.runtimeFiles,
    typeScriptSourceFiles: report.inventory.typeScriptSourceFiles,
    reactInternalPropsTypescriptSurfaceDebt: report.inventory.reactInternalPropsTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
