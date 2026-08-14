#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-public-runtime-boundary.json");
const markdownOutput = path.join(outputDir, "system-public-runtime-boundary.md");

const layerReports = [
  {
    layer: "components",
    planIteration: 19,
    file: "docs/audits/system-component-runtime-audit.json",
    totalKey: "components",
    auditedKey: "runtimeAuditedComponents",
    passingKey: "passingRuntimeComponents",
    failingKey: "failingRuntimeComponents",
    debtKey: "componentRuntimeDebt",
    rowsKey: "components",
  },
  {
    layer: "patterns",
    planIteration: 20,
    file: "docs/audits/system-pattern-runtime-audit.json",
    totalKey: "patterns",
    auditedKey: "runtimeAuditedPatterns",
    passingKey: "passingRuntimePatterns",
    failingKey: "failingRuntimePatterns",
    debtKey: "patternRuntimeDebt",
    rowsKey: "patterns",
  },
  {
    layer: "templates",
    planIteration: 21,
    file: "docs/audits/system-template-runtime-audit.json",
    totalKey: "templates",
    auditedKey: "runtimeAuditedTemplates",
    passingKey: "passingRuntimeTemplates",
    failingKey: "failingRuntimeTemplates",
    debtKey: "templateRuntimeDebt",
    rowsKey: "templates",
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function statusIsPass(value) {
  return String(value ?? "").toLowerCase() === "pass";
}

function layerRow(definition) {
  const fullPath = path.join(root, definition.file);
  if (!fs.existsSync(fullPath)) {
    return {
      ...definition,
      status: "missing",
      artifacts: 0,
      runtimeAudited: 0,
      passing: 0,
      failing: 1,
      debt: 1,
      issues: [`missing report: ${definition.file}`],
    };
  }
  const report = readJson(definition.file);
  const inventory = report.inventory ?? {};
  const artifacts = Number(inventory[definition.totalKey] ?? 0);
  const runtimeAudited = Number(inventory[definition.auditedKey] ?? 0);
  const passing = Number(inventory[definition.passingKey] ?? 0);
  const failing = Number(inventory[definition.failingKey] ?? 0);
  const debt = Number(inventory[definition.debtKey] ?? 0);
  const rowFailures = (report[definition.rowsKey] ?? []).filter((row) => row.status && !statusIsPass(row.status));
  const issues = [
    ...(statusIsPass(report.status) ? [] : [`status is ${report.status ?? "unknown"}`]),
    ...(report.planIteration === definition.planIteration ? [] : [`planIteration expected ${definition.planIteration}, got ${report.planIteration ?? "missing"}`]),
    ...(artifacts > 0 ? [] : ["artifact count is zero"]),
    ...(runtimeAudited === artifacts ? [] : [`runtime audited mismatch: ${runtimeAudited}/${artifacts}`]),
    ...(passing === artifacts ? [] : [`passing mismatch: ${passing}/${artifacts}`]),
    ...(failing === 0 ? [] : [`failing count is ${failing}`]),
    ...(debt === 0 ? [] : [`${definition.debtKey} is ${debt}`]),
    ...(rowFailures.length ? [`row failures: ${rowFailures.length}`] : []),
  ];
  return {
    ...definition,
    status: report.status,
    artifacts,
    runtimeAudited,
    passing,
    failing,
    debt,
    issues,
  };
}

function createReport() {
  const layers = layerReports.map(layerRow);
  const inventory = {
    publicRuntimeLayers: layers.length,
    passingRuntimeLayers: layers.filter((layer) => statusIsPass(layer.status) && layer.issues.length === 0).length,
    runtimeArtifacts: layers.reduce((total, layer) => total + layer.artifacts, 0),
    runtimeAuditedArtifacts: layers.reduce((total, layer) => total + layer.runtimeAudited, 0),
    passingRuntimeArtifacts: layers.reduce((total, layer) => total + layer.passing, 0),
    failingRuntimeArtifacts: layers.reduce((total, layer) => total + layer.failing, 0),
    componentRuntimeArtifacts: layers.find((layer) => layer.layer === "components")?.artifacts ?? 0,
    patternRuntimeArtifacts: layers.find((layer) => layer.layer === "patterns")?.artifacts ?? 0,
    templateRuntimeArtifacts: layers.find((layer) => layer.layer === "templates")?.artifacts ?? 0,
    layerRuntimeDebt: layers.reduce((total, layer) => total + layer.debt, 0),
    runtimeBoundaryIssues: layers.reduce((total, layer) => total + layer.issues.length, 0),
    publicRuntimeBoundaryDebt: 0,
  };
  inventory.publicRuntimeBoundaryDebt = inventory.layerRuntimeDebt
    + inventory.runtimeBoundaryIssues
    + (inventory.publicRuntimeLayers - inventory.passingRuntimeLayers)
    + Math.max(0, inventory.runtimeArtifacts - inventory.runtimeAuditedArtifacts)
    + Math.max(0, inventory.runtimeArtifacts - inventory.passingRuntimeArtifacts);

  return {
    status: inventory.publicRuntimeBoundaryDebt ? "fail" : "pass",
    audit: "system public runtime boundary",
    planIteration: 22,
    principle: "The public Flow runtime is only trustworthy when components, patterns, and templates are all verified together as one installable boundary.",
    inventory,
    layers: layers.map((layer) => ({
      layer: layer.layer,
      planIteration: layer.planIteration,
      report: layer.file,
      status: layer.status,
      artifacts: layer.artifacts,
      runtimeAudited: layer.runtimeAudited,
      passing: layer.passing,
      failing: layer.failing,
      debt: layer.debt,
      issues: layer.issues,
    })),
  };
}

function toMarkdown(report) {
  const rows = report.layers.map((layer) => `| ${layer.layer} | ${layer.planIteration} | ${layer.report} | ${layer.status} | ${layer.artifacts} | ${layer.runtimeAudited} | ${layer.passing} | ${layer.failing} | ${layer.debt} | ${layer.issues.join("; ") || "None"} |`);
  return [
    "# System Public Runtime Boundary",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Public runtime layers: ${report.inventory.publicRuntimeLayers}`,
    `- Passing runtime layers: ${report.inventory.passingRuntimeLayers}`,
    `- Runtime artifacts: ${report.inventory.runtimeArtifacts}`,
    `- Runtime audited artifacts: ${report.inventory.runtimeAuditedArtifacts}`,
    `- Passing runtime artifacts: ${report.inventory.passingRuntimeArtifacts}`,
    `- Failing runtime artifacts: ${report.inventory.failingRuntimeArtifacts}`,
    `- Component runtime artifacts: ${report.inventory.componentRuntimeArtifacts}`,
    `- Pattern runtime artifacts: ${report.inventory.patternRuntimeArtifacts}`,
    `- Template runtime artifacts: ${report.inventory.templateRuntimeArtifacts}`,
    `- Layer runtime debt: ${report.inventory.layerRuntimeDebt}`,
    `- Runtime boundary issues: ${report.inventory.runtimeBoundaryIssues}`,
    `- Public runtime boundary debt: ${report.inventory.publicRuntimeBoundaryDebt}`,
    "",
    "## Layer Matrix",
    "",
    "| Layer | Iteration | Report | Status | Artifacts | Runtime audited | Passing | Failing | Debt | Issues |",
    "| --- | ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ...rows,
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
      console.error("System public runtime boundary is stale. Run: node packages/audit/scripts/report-system-public-runtime-boundary.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    runtimeArtifacts: report.inventory.runtimeArtifacts,
    passingRuntimeArtifacts: report.inventory.passingRuntimeArtifacts,
    publicRuntimeBoundaryDebt: report.inventory.publicRuntimeBoundaryDebt,
    json: "docs/audits/system-public-runtime-boundary.json",
    markdown: "docs/audits/system-public-runtime-boundary.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
