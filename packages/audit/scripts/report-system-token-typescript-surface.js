#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-token-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-token-typescript-surface.md");
const checkMode = process.argv.includes("--check");

const tokenPackageFile = "packages/tokens/package.json";
const tokenSourceFile = "packages/tokens/src/index.ts";
const tokenRuntimeFile = "packages/tokens/src/index.js";

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
  if (!exists(tokenSourceFile)) {
    return {
      status: 1,
      stdout: "",
      stderr: `${tokenSourceFile} is missing.`,
      expected: null,
    };
  }

  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-token-ts-audit-"));
  const tscBin = path.join(root, "node_modules/.bin/tsc");
  const result = spawnSync(tscBin, [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--moduleResolution", "bundler",
    "--skipLibCheck",
    "--outDir", outDir,
    path.join(root, tokenSourceFile),
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
  const rows = report.gates
    .map((item) => `| ${item.id} | ${item.status} | ${item.failMessage ?? "OK"} |`)
    .join("\n");
  return [
    "# System token TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report makes the tokens package public runtime auditable: TypeScript source is the maintained surface, and JavaScript remains a generated runtime export for package consumers.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Token TypeScript surface debt: ${report.tokenTypescriptSurfaceDebt}`,
    `- Public token export: ${report.publicTokenExport}`,
    `- Source file: ${report.source.file}`,
    `- Runtime file: ${report.runtime.file}`,
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
  const packageJson = readJson(tokenPackageFile);
  const compiled = compileExpectedRuntime();
  const runtimeCurrent = exists(tokenRuntimeFile) ? read(tokenRuntimeFile) : null;
  const sourceText = exists(tokenSourceFile) ? read(tokenSourceFile) : "";
  const gates = [
    gate(
      "public-export-remains-runtime-js",
      packageJson.exports?.["."] === "./src/index.js",
      { export: packageJson.exports?.["."] ?? null },
      "The tokens package public entry must remain a JS runtime export for current consumers.",
    ),
    gate(
      "typescript-source-exists",
      exists(tokenSourceFile),
      { file: tokenSourceFile, exists: exists(tokenSourceFile) },
      "The tokens public runtime must have a maintained TypeScript source file.",
    ),
    gate(
      "typescript-source-has-owned-types",
      /export type SystemTokens = typeof systemTokens;/.test(sourceText)
        && /cssVar\(name: string\)/.test(sourceText),
      { file: tokenSourceFile },
      "The tokens source must expose real TypeScript types instead of only copying JavaScript.",
    ),
    gate(
      "runtime-generated-from-typescript",
      compiled.status === 0 && runtimeCurrent === compiled.expected,
      {
        source: tokenSourceFile,
        runtime: tokenRuntimeFile,
        compileStatus: compiled.status,
        stderr: compiled.stderr,
      },
      "packages/tokens/src/index.js is stale or not generated from packages/tokens/src/index.ts. Run npm run build:tokens.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-token-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    publicTokenExport: packageJson.exports?.["."] ?? null,
    source: {
      file: tokenSourceFile,
      exists: exists(tokenSourceFile),
    },
    runtime: {
      file: tokenRuntimeFile,
      exists: exists(tokenRuntimeFile),
    },
    gates,
    inventory: {
      tokenTypescriptSurfaceDebt: failing.length,
    },
    tokenTypescriptSurfaceDebt: failing.length,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    tokenTypescriptSurfaceDebt: report.tokenTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
