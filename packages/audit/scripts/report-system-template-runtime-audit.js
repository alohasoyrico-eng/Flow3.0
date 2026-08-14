#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-template-runtime-audit.json");
const markdownOutput = path.join(outputDir, "system-template-runtime-audit.md");

const sourceReports = {
  artifactTests: "docs/audits/system-template-artifact-tests.json",
  compositionGovernance: "docs/audits/react-template-composition-governance-audit.json",
  interactionGovernance: "docs/audits/react-template-interaction-governance-audit.json",
  runtimeGovernance: "docs/audits/react-template-runtime-governance-audit.json",
  visualGovernance: "docs/audits/react-template-visual-governance-audit.json",
  cascadeGovernance: "docs/audits/template-cascade-governance-audit.json",
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function normalizeId(value) {
  return String(value ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function indexBy(rows, getKey) {
  const map = new Map();
  for (const row of rows ?? []) map.set(normalizeId(getKey(row)), row);
  return map;
}

function groupBy(rows, getKey) {
  const map = new Map();
  for (const row of rows ?? []) {
    const key = normalizeId(getKey(row));
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  }
  return map;
}

function statusIsPass(value) {
  return String(value ?? "").toLowerCase() === "pass";
}

function checkObjectIsPass(checks) {
  return Object.values(checks ?? {}).every((value) => value === true || value === "pass" || value === "not-applicable");
}

function createReport() {
  const reports = Object.fromEntries(
    Object.entries(sourceReports).map(([key, file]) => [key, readJson(file)])
  );

  const compositionById = indexBy(reports.compositionGovernance.templates, (row) => row.id);
  const interactionById = indexBy(reports.interactionGovernance.templates, (row) => row.id);
  const runtimeSourceById = indexBy(reports.runtimeGovernance.sourceChecks, (row) => row.template);
  const runtimeRenderRowsById = groupBy(reports.runtimeGovernance.renderRows, (row) => row.template);
  const visualRowsById = groupBy(reports.visualGovernance.visualRows, (row) => row.template);
  const cascadeById = indexBy(reports.cascadeGovernance.rows, (row) => row.id);

  const templates = (reports.artifactTests.templates ?? []).map((template) => {
    const id = normalizeId(template.id);
    const composition = compositionById.get(id);
    const interaction = interactionById.get(id);
    const runtimeSource = runtimeSourceById.get(id);
    const runtimeRows = runtimeRenderRowsById.get(id) ?? [];
    const visualRows = visualRowsById.get(id) ?? [];
    const cascade = cascadeById.get(id);
    const checks = template.checks ?? {};
    const artifactChecksPass = template.status === "pass" && checkObjectIsPass(checks);
    const runtimeRequired = checks.runtime !== "not-applicable" && checks.runtime !== undefined;
    const interactionRequired = checks.interaction !== "not-applicable" && checks.interaction !== undefined;
    const visualRequired = checks.visual !== "not-applicable" && checks.visual !== undefined;
    const runtimeRowsPass = runtimeRows.every((row) => statusIsPass(row.status) && !(row.failures ?? []).length);
    const visualRowsPass = visualRows.every((row) => statusIsPass(row.status) && !(row.failures ?? []).length);
    const issues = [
      ...(artifactChecksPass ? [] : ["artifact runtime checks failed"]),
      ...(composition ? [] : ["missing composition governance row"]),
      ...(composition?.issues ?? []).map((issue) => `composition: ${issue}`),
      ...(cascade ? [] : ["missing cascade governance row"]),
      ...((cascade?.gaps ?? []).map((gap) => `cascade: ${gap}`)),
      ...(template.evidence?.artifact ? [] : ["missing formal artifact evidence"]),
      ...(template.evidence?.source ? [] : ["missing source evidence"]),
      ...(template.evidence?.types ? [] : ["missing type evidence"]),
      ...(template.evidence?.runtime ? [] : ["missing runtime export evidence"]),
      ...(interactionRequired && !interaction ? ["missing interaction governance row"] : []),
      ...(interaction?.issues ?? []).map((issue) => `interaction: ${issue}`),
      ...(runtimeRequired && !runtimeSource ? ["missing runtime governance source row"] : []),
      ...(runtimeRequired && !runtimeRows.length ? ["missing runtime render rows"] : []),
      ...(runtimeRequired && !runtimeRowsPass ? ["runtime render rows contain failures"] : []),
      ...(visualRequired && !visualRows.length ? ["missing visual governance rows"] : []),
      ...(visualRequired && !visualRowsPass ? ["visual governance rows contain failures"] : []),
    ];
    return {
      id,
      componentName: template.componentName,
      artifactTests: artifactChecksPass ? "pass" : "fail",
      compositionGovernance: composition ? "pass" : "missing",
      cascadeGovernance: cascade ? "pass" : "missing",
      interactionGovernance: interactionRequired ? (interaction ? "pass" : "missing") : "not-applicable",
      runtimeGovernance: runtimeRequired ? (runtimeSource && runtimeRowsPass ? "pass" : "fail") : "not-applicable",
      visualGovernance: visualRequired ? (visualRows.length && visualRowsPass ? "pass" : "fail") : "not-applicable",
      runtimeRequired,
      interactionRequired,
      visualRequired,
      metrics: {
        renderCases: runtimeRows.length,
        visualCases: visualRows.length,
        patternDependencies: template.metrics?.patternDependencies ?? 0,
        moduleMarkers: template.metrics?.moduleMarkers ?? 0,
      },
      runtimeEvidence: {
        artifact: template.evidence?.artifact ?? null,
        source: template.evidence?.source ?? null,
        runtime: template.evidence?.runtime ?? null,
        types: template.evidence?.types ?? null,
      },
      issues,
      status: issues.length ? "fail" : "pass",
    };
  });

  const sourceReportIssues = Object.entries(reports).flatMap(([key, report]) => (
    statusIsPass(report.status) ? [] : [`${key} status is ${report.status ?? "unknown"}`]
  ));

  const inventory = {
    templates: templates.length,
    runtimeRequiredTemplates: templates.filter((template) => template.runtimeRequired).length,
    interactionRequiredTemplates: templates.filter((template) => template.interactionRequired).length,
    visualRequiredTemplates: templates.filter((template) => template.visualRequired).length,
    runtimeAuditedTemplates: templates.filter((template) => template.runtimeEvidence.runtime && template.runtimeEvidence.types && template.runtimeEvidence.source).length,
    passingRuntimeTemplates: templates.filter((template) => template.status === "pass").length,
    failingRuntimeTemplates: templates.filter((template) => template.status === "fail").length,
    sourceReports: Object.keys(sourceReports).length,
    passingSourceReports: Object.values(reports).filter((report) => statusIsPass(report.status)).length,
    sourceReportIssues: sourceReportIssues.length,
    templateRuntimeDebt: 0,
  };
  inventory.templateRuntimeDebt = inventory.failingRuntimeTemplates
    + inventory.sourceReportIssues
    + Math.max(0, inventory.templates - inventory.runtimeAuditedTemplates);

  return {
    status: inventory.templateRuntimeDebt ? "fail" : "pass",
    audit: "system template runtime audit",
    planIteration: 21,
    principle: "Every public template must pass formal artifact, composition, cascade, runtime, interaction, and visual governance according to its declared runtime surface.",
    sourceReports,
    inventory,
    sourceReportIssues,
    templates,
  };
}

function toMarkdown(report) {
  const rows = report.templates.map((template) => `| ${template.id} | ${template.componentName} | ${template.artifactTests} | ${template.compositionGovernance} | ${template.cascadeGovernance} | ${template.runtimeGovernance} | ${template.interactionGovernance} | ${template.visualGovernance} | ${template.status} | ${template.issues.join("; ") || "None"} |`);
  return [
    "# System Template Runtime Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Templates: ${report.inventory.templates}`,
    `- Runtime required templates: ${report.inventory.runtimeRequiredTemplates}`,
    `- Interaction required templates: ${report.inventory.interactionRequiredTemplates}`,
    `- Visual required templates: ${report.inventory.visualRequiredTemplates}`,
    `- Runtime audited templates: ${report.inventory.runtimeAuditedTemplates}`,
    `- Passing runtime templates: ${report.inventory.passingRuntimeTemplates}`,
    `- Failing runtime templates: ${report.inventory.failingRuntimeTemplates}`,
    `- Source reports: ${report.inventory.sourceReports}`,
    `- Passing source reports: ${report.inventory.passingSourceReports}`,
    `- Source report issues: ${report.inventory.sourceReportIssues}`,
    `- Template runtime debt: ${report.inventory.templateRuntimeDebt}`,
    "",
    "## Source Reports",
    "",
    ...Object.entries(report.sourceReports).map(([key, file]) => `- ${key}: ${file}`),
    "",
    "## Template Runtime Matrix",
    "",
    "| Template ID | React template | Artifact tests | Composition | Cascade | Runtime | Interaction | Visual | Status | Issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
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
      console.error("System template runtime audit is stale. Run: node packages/audit/scripts/report-system-template-runtime-audit.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    templates: report.inventory.templates,
    passingRuntimeTemplates: report.inventory.passingRuntimeTemplates,
    templateRuntimeDebt: report.inventory.templateRuntimeDebt,
    json: "docs/audits/system-template-runtime-audit.json",
    markdown: "docs/audits/system-template-runtime-audit.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
