#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-date-inputs-typescript-surface.json");
const markdownOutput = path.join(outputDir, "system-react-date-inputs-typescript-surface.md");
const checkMode = process.argv.includes("--check");
const reactSourceDir = "packages/react/src";
const components = ["DatePicker", "DateRangePicker"];

function absolute(relativePath) {
  return path.join(root, relativePath);
}

function read(relativePath) {
  return fs.readFileSync(absolute(relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(absolute(relativePath));
}

function compileExpectedRuntimes() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-react-date-inputs-ts-audit-"));
  const result = spawnSync(path.join(root, "node_modules/.bin/tsc"), [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--jsx", "react",
    "--moduleResolution", "bundler",
    "--allowSyntheticDefaultImports",
    "--skipLibCheck",
    "--rootDir", absolute(reactSourceDir),
    "--outDir", outDir,
    ...components.map((component) => absolute(`${reactSourceDir}/${component}.tsx`)),
  ], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });

  const expectedByComponent = {};
  for (const component of components) {
    const compiledFile = path.join(outDir, `${component}.js`);
    expectedByComponent[component] = result.status === 0 && fs.existsSync(compiledFile)
      ? fs.readFileSync(compiledFile, "utf8")
      : null;
  }
  fs.rmSync(outDir, { recursive: true, force: true });
  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    expectedByComponent,
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
    "# System React date inputs TypeScript surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report governs the React date input TSX batch. TypeScript is the maintained source, JavaScript is generated runtime, and declaration files remain compatible during incremental migration.",
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Components audited: ${report.inventory.componentsAudited}`,
    `- Runtime files: ${report.inventory.runtimeFiles}`,
    `- TSX source files: ${report.inventory.tsxSourceFiles}`,
    `- Declaration files: ${report.inventory.declarationFiles}`,
    `- Stale runtime files: ${report.inventory.staleRuntimeFiles}`,
    `- React date inputs TypeScript surface debt: ${report.inventory.reactDateInputsTypescriptSurfaceDebt}`,
    "",
    "## Components",
    "",
    ...report.components.map((item) => `- ${item.id}: source=${item.hasSource ? "yes" : "no"}, runtime=${item.hasRuntime ? "yes" : "no"}, declaration=${item.hasDeclaration ? "yes" : "no"}, stale=${item.staleRuntime ? "yes" : "no"}`),
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
  const compiled = compileExpectedRuntimes();
  const componentReports = components.map((component) => {
    const sourceFile = `${reactSourceDir}/${component}.tsx`;
    const runtimeFile = `${reactSourceDir}/${component}.js`;
    const declarationFile = `${reactSourceDir}/${component}.d.ts`;
    const hasSource = exists(sourceFile);
    const hasRuntime = exists(runtimeFile);
    const hasDeclaration = exists(declarationFile);
    const source = hasSource ? read(sourceFile) : "";
    const declaration = hasDeclaration ? read(declarationFile) : "";
    const runtime = hasRuntime ? read(runtimeFile) : "";
    const expected = compiled.expectedByComponent[component];
    return {
      id: component,
      sourceFile,
      runtimeFile,
      declarationFile,
      hasSource,
      hasRuntime,
      hasDeclaration,
      hasComponentTypeInSource: source.includes(`export interface ${component}Component`),
      hasComponentTypeInDeclaration: declaration.includes(`export interface ${component}Component`),
      staleRuntime: !hasRuntime || expected == null || runtime !== expected,
    };
  });
  const staleRuntimeFiles = componentReports.filter((component) => component.staleRuntime).length;
  const gates = [
    gate(
      "date-inputs-have-tsx-source-runtime-and-declarations",
      componentReports.every((component) => component.hasSource && component.hasRuntime && component.hasDeclaration),
      componentReports.map(({ id, hasSource, hasRuntime, hasDeclaration }) => ({ id, hasSource, hasRuntime, hasDeclaration })),
      "Each audited date React input must have TSX source, JS runtime, and declaration file.",
    ),
    gate(
      "component-contracts-owned-in-tsx-source",
      componentReports.every((component) => component.hasComponentTypeInSource),
      componentReports.map(({ id, hasComponentTypeInSource }) => ({ id, hasComponentTypeInSource })),
      "Component contract interfaces must be present in TSX source, not only in declaration files.",
    ),
    gate(
      "declarations-remain-compatible",
      componentReports.every((component) => component.hasComponentTypeInDeclaration),
      componentReports.map(({ id, hasComponentTypeInDeclaration }) => ({ id, hasComponentTypeInDeclaration })),
      "Existing declaration imports must remain compatible while React components migrate incrementally.",
    ),
    gate(
      "runtime-generated-from-tsx",
      compiled.status === 0 && staleRuntimeFiles === 0,
      {
        compileStatus: compiled.status,
        stderr: compiled.stderr,
        staleRuntimeFiles,
      },
      "One or more date React input runtimes are stale. Run npm run build:react.",
    ),
  ];
  const failing = gates.filter((item) => item.status !== "PASS");
  const report = {
    schemaVersion: "flow-system-react-date-inputs-typescript-surface@1",
    generatedAt: "2026-08-12",
    status: failing.length ? "fail" : "pass",
    gates,
    components: componentReports,
    inventory: {
      componentsAudited: components.length,
      runtimeFiles: componentReports.filter((component) => component.hasRuntime).length,
      tsxSourceFiles: componentReports.filter((component) => component.hasSource).length,
      declarationFiles: componentReports.filter((component) => component.hasDeclaration).length,
      staleRuntimeFiles,
      reactDateInputsTypescriptSurfaceDebt: failing.length + staleRuntimeFiles,
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    componentsAudited: report.inventory.componentsAudited,
    tsxSourceFiles: report.inventory.tsxSourceFiles,
    reactDateInputsTypescriptSurfaceDebt: report.inventory.reactDateInputsTypescriptSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));

  if (checkMode && report.status !== "pass") process.exit(1);
}

main();
