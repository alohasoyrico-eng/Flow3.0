#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase4-core-controls-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase4-core-controls-checkpoint.md");

const coreControlIds = [
  "button",
  "icon-button",
  "input",
  "select",
  "checkbox",
  "radio-button",
  "switch",
  "text-area",
  "combobox",
  "country-selector",
  "code-input",
  "copy-button",
  "phone-input",
  "input-amount",
  "card-number-input",
  "card-expiry-input",
  "card-security-code-input",
  "date-picker",
  "date-range-picker",
  "segmented-control",
  "slider",
  "stepper",
];

const gateDefinitions = [
  ["react-primary", "docs/audits/react-primary-coverage-audit.json"],
  ["prop-alignment", "docs/audits/react-contract-prop-alignment-audit.json"],
  ["controlled", "docs/audits/react-controlled-governance-audit.json"],
  ["accessibility", "docs/audits/react-accessibility-governance-audit.json"],
  ["interaction", "docs/audits/react-interaction-coverage-audit.json"],
  ["visual-cascade", "docs/audits/component-visual-cascade-audit.json"],
  ["css-contract", "docs/audits/component-css-contract-coverage.json"],
  ["style", "docs/audits/react-style-governance-audit.json"],
];

function pascal(id) {
  return id.split("-").map((part) => (
    part === "kpi" ? "Kpi" : part.charAt(0).toUpperCase() + part.slice(1)
  )).join("");
}

function kebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return fallback;
  }
}

function statusOf(report) {
  return String(report?.status ?? "").toLowerCase();
}

function componentRows(report) {
  return Array.isArray(report.components) ? report.components : Array.isArray(report.rows) ? report.rows : [];
}

function rowId(row) {
  return row.id ?? row.component ?? row.name ?? kebab(row.componentName ?? "");
}

function rowsByKebab(report) {
  return new Map(componentRows(report).map((row) => [kebab(rowId(row)), row]));
}

function tsSurfaceFor(componentId) {
  const component = pascal(componentId);
  const sourceFile = `packages/react/src/${component}.tsx`;
  const runtimeFile = `packages/react/src/${component}.js`;
  const declarationFile = `packages/react/src/${component}.d.ts`;
  return {
    component,
    sourceFile,
    runtimeFile,
    declarationFile,
    hasSource: fs.existsSync(path.join(root, sourceFile)),
    hasRuntime: fs.existsSync(path.join(root, runtimeFile)),
    hasDeclaration: fs.existsSync(path.join(root, declarationFile)),
  };
}

function createReport() {
  const gates = gateDefinitions.map(([id, file]) => {
    const report = readJson(file);
    return {
      id,
      file,
      status: statusOf(report) || "missing",
      rows: rowsByKebab(report),
    };
  });

  const components = coreControlIds.map((id) => {
    const ts = tsSurfaceFor(id);
    const gateResults = gates.map((gate) => {
      const row = gate.rows.get(id);
      const status = row ? String(row.status ?? "pass").toLowerCase() : "missing";
      return {
        gate: gate.id,
        status,
        covered: gate.status === "pass" && status === "pass",
      };
    });
    const failures = [
      ...(ts.hasSource ? [] : ["missing TSX source"]),
      ...(ts.hasRuntime ? [] : ["missing JS runtime"]),
      ...(ts.hasDeclaration ? [] : ["missing declaration file"]),
      ...gateResults.filter((gate) => !gate.covered).map((gate) => `${gate.gate} is ${gate.status}`),
    ];
    return {
      id,
      component: ts.component,
      ts,
      gateResults,
      status: failures.length ? "fail" : "pass",
      failures,
    };
  });

  const issues = [
    ...gates.filter((gate) => gate.status !== "pass").map((gate) => `${gate.file} is not pass.`),
    ...components.flatMap((component) => component.failures.map((failure) => `${component.id}: ${failure}`)),
  ];

  const inventory = {
    coreControlComponents: coreControlIds.length,
    passingCoreControlComponents: components.filter((component) => component.status === "pass").length,
    gateReports: gates.length,
    passingGateReports: gates.filter((gate) => gate.status === "pass").length,
    tsxSources: components.filter((component) => component.ts.hasSource).length,
    runtimeFiles: components.filter((component) => component.ts.hasRuntime).length,
    declarationFiles: components.filter((component) => component.ts.hasDeclaration).length,
    componentGateEdges: components.reduce((sum, component) => sum + component.gateResults.length, 0),
    passingComponentGateEdges: components.reduce((sum, component) => sum + component.gateResults.filter((gate) => gate.covered).length, 0),
    coreControlsFormsDebt: issues.length,
  };

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 4 core controls/forms checkpoint",
    principle: "Core controls and form components must pass TypeScript source/runtime/declaration checks plus React primary, props, controlled state, accessibility, interaction, visual cascade, CSS contract, and style governance before later component batches build on them.",
    scope: "Original plan iteration 21: component fixes batch 1, core controls/forms.",
    inventory,
    gates: gates.map(({ id, file, status }) => ({ id, file, status })),
    components,
    issues,
  };
}

function toMarkdown(report) {
  const componentRows = report.components.map((component) => (
    `| ${component.id} | ${component.status} | ${component.ts.hasSource ? "yes" : "no"} | ${component.ts.hasRuntime ? "yes" : "no"} | ${component.ts.hasDeclaration ? "yes" : "no"} | ${component.gateResults.filter((gate) => gate.covered).length}/${component.gateResults.length} | ${component.failures.join("<br>") || "None"} |`
  ));
  return [
    "# Phase 4 Core Controls/Forms Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Core control components: ${report.inventory.passingCoreControlComponents}/${report.inventory.coreControlComponents}`,
    `- Gate reports: ${report.inventory.passingGateReports}/${report.inventory.gateReports}`,
    `- TSX sources: ${report.inventory.tsxSources}/${report.inventory.coreControlComponents}`,
    `- Runtime files: ${report.inventory.runtimeFiles}/${report.inventory.coreControlComponents}`,
    `- Declaration files: ${report.inventory.declarationFiles}/${report.inventory.coreControlComponents}`,
    `- Component gate edges: ${report.inventory.passingComponentGateEdges}/${report.inventory.componentGateEdges}`,
    `- Core controls/forms debt: ${report.inventory.coreControlsFormsDebt}`,
    "",
    "## Components",
    "",
    "| Component | Status | TSX | Runtime | Declarations | Gates | Failures |",
    "| --- | --- | --- | --- | --- | ---: | --- |",
    ...componentRows,
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Phase 4 core controls/forms checkpoint is stale. Run: node packages/audit/scripts/report-system-phase4-core-controls-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: `${report.inventory.passingCoreControlComponents}/${report.inventory.coreControlComponents}`,
    gates: `${report.inventory.passingGateReports}/${report.inventory.gateReports}`,
    gateEdges: `${report.inventory.passingComponentGateEdges}/${report.inventory.componentGateEdges}`,
    debt: report.inventory.coreControlsFormsDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
