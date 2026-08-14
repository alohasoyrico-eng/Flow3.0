#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-section-indexes-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-react-section-indexes-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const sourceRuntimeHeader = [
  "/* @generated from packages/react/src TypeScript source.",
  " * Do not edit this compatibility runtime directly.",
  " * Authored source of truth is the paired .ts/.tsx file.",
  " */",
  "",
].join("\n");

const targets = [
  {
    id: "patterns",
    sourceFile: "packages/react/src/patterns/index.ts",
    runtimeFile: "packages/react/src/patterns/index.js",
    declarationFile: "packages/react/src/patterns/index.d.ts",
  },
  {
    id: "templates",
    sourceFile: "packages/react/src/templates/index.ts",
    runtimeFile: "packages/react/src/templates/index.js",
    declarationFile: "packages/react/src/templates/index.d.ts",
  },
];

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function compileExpectedRuntime(target) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), `flow-react-${target.id}-index-ts-audit-`));
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
    absolute(target.sourceFile),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  const compiledFile = path.join(outDir, target.id, "index.js");
  const expectedRuntime = result.status === 0 && fs.existsSync(compiledFile)
    ? `${sourceRuntimeHeader}${fs.readFileSync(compiledFile, "utf8")}`
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

function analyzeTarget(target) {
  const compiled = compileExpectedRuntime(target);
  const hasSource = exists(target.sourceFile);
  const hasRuntime = exists(target.runtimeFile);
  const hasDeclaration = exists(target.declarationFile);
  const source = hasSource ? read(target.sourceFile) : "";
  const runtime = hasRuntime ? read(target.runtimeFile) : "";
  const declaration = hasDeclaration ? read(target.declarationFile) : "";
  const sourceExports = exportNames(source);
  const runtimeExports = exportNames(runtime);
  const declarationExports = exportNames(declaration);
  const staleRuntime = !hasRuntime || compiled.expectedRuntime == null || runtime !== compiled.expectedRuntime;
  const gates = [
    gate(
      `${target.id}-index-has-ts-source-runtime-and-declaration`,
      hasSource && hasRuntime && hasDeclaration,
      { hasSource, hasRuntime, hasDeclaration },
      `${target.id} index must have TypeScript source, generated JavaScript runtime, and declaration file.`,
    ),
    gate(
      `${target.id}-index-runtime-generated-from-ts`,
      compiled.status === 0 && !staleRuntime,
      { compileStatus: compiled.status, stderr: compiled.stderr, staleRuntime },
      `${target.id} index runtime is stale. Run npm run build:react.`,
    ),
    gate(
      `${target.id}-index-runtime-export-parity`,
      JSON.stringify(sourceExports) === JSON.stringify(runtimeExports),
      { sourceExports: sourceExports.length, runtimeExports: runtimeExports.length },
      `${target.id} index generated runtime must preserve all value exports from the TypeScript source.`,
    ),
    gate(
      `${target.id}-index-declaration-export-parity`,
      JSON.stringify(sourceExports) === JSON.stringify(declarationExports),
      { sourceExports: sourceExports.length, declarationExports: declarationExports.length },
      `${target.id} index declarations must preserve all value exports from the TypeScript source.`,
    ),
    gate(
      `${target.id}-index-owns-type-exports-in-ts-source`,
      typeExportCount(source) > 0 && typeExportCount(source) === typeExportCount(declaration),
      { sourceTypeExportGroups: typeExportCount(source), declarationTypeExportGroups: typeExportCount(declaration) },
      `${target.id} index TypeScript source must own type export groups, not only the declaration file.`,
    ),
  ];
  return {
    ...target,
    gates,
    inventory: {
      sourceExports: sourceExports.length,
      runtimeExports: runtimeExports.length,
      declarationExports: declarationExports.length,
      sourceTypeExportGroups: typeExportCount(source),
      declarationTypeExportGroups: typeExportCount(declaration),
      staleRuntimeFiles: staleRuntime ? 1 : 0,
      debt: gates.filter((item) => item.status !== "PASS").length + (staleRuntime ? 1 : 0),
    },
  };
}

function renderMarkdown(report) {
  return [
    "# System React section indexes TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs React section barrels. TypeScript is the maintained export source for patterns/templates indexes, JavaScript is generated runtime, and declaration files remain compatible during incremental migration.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Section indexes audited: ${report.inventory.sectionIndexesAudited}`,
    `- Source exports: ${report.inventory.sourceExports}`,
    `- Runtime exports: ${report.inventory.runtimeExports}`,
    `- Declaration type export groups: ${report.inventory.declarationTypeExportGroups}`,
    `- Stale runtime files: ${report.inventory.staleRuntimeFiles}`,
    `- React section index TypeScript surface debt: ${report.inventory.reactSectionIndexTypescriptSurfaceDebt}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Detail |",
    "| --- | --- | --- |",
    ...report.targets.flatMap((target) => target.gates.map((item) => `| ${item.id} | ${item.status} | ${item.failMessage ?? "OK"} |`)),
    "",
  ].join("\n");
}

function main() {
  const targetReports = targets.map(analyzeTarget);
  const gates = targetReports.flatMap((target) => target.gates);
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-react-section-indexes-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    targets: targetReports.map((target) => ({
      id: target.id,
      sourceFile: target.sourceFile,
      runtimeFile: target.runtimeFile,
      declarationFile: target.declarationFile,
      gates: target.gates,
      inventory: target.inventory,
    })),
    inventory: {
      sectionIndexesAudited: targetReports.length,
      sourceExports: targetReports.reduce((total, target) => total + target.inventory.sourceExports, 0),
      runtimeExports: targetReports.reduce((total, target) => total + target.inventory.runtimeExports, 0),
      declarationExports: targetReports.reduce((total, target) => total + target.inventory.declarationExports, 0),
      sourceTypeExportGroups: targetReports.reduce((total, target) => total + target.inventory.sourceTypeExportGroups, 0),
      declarationTypeExportGroups: targetReports.reduce((total, target) => total + target.inventory.declarationTypeExportGroups, 0),
      staleRuntimeFiles: targetReports.reduce((total, target) => total + target.inventory.staleRuntimeFiles, 0),
      reactSectionIndexTypescriptSurfaceDebt: targetReports.reduce((total, target) => total + target.inventory.debt, 0),
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    sectionIndexesAudited: report.inventory.sectionIndexesAudited,
    sourceExports: report.inventory.sourceExports,
    runtimeExports: report.inventory.runtimeExports,
    reactSectionIndexTypescriptSurfaceDebt: report.inventory.reactSectionIndexTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
