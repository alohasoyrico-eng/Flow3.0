#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");
const { spawnSync } = require("node:child_process");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-component-runtime-audit.json");
const markdownOutput = path.join(outputDir, "system-component-runtime-audit.md");

const sourceReports = {
  artifactTests: "docs/audits/system-component-artifact-tests.json",
  controlFrame: "docs/audits/control-frame-adoption-inventory.json",
  cssContract: "docs/audits/component-css-contract-coverage.json",
  visualCascade: "docs/audits/component-visual-cascade-audit.json",
  styleGovernance: "docs/audits/react-style-governance-audit.json",
  primaryCoverage: "docs/audits/react-primary-coverage-audit.json",
};

const runtimeChecks = [
  {
    id: "control-frame-density-runtime",
    command: "node",
    args: ["packages/audit/scripts/audit-control-frame-density-runtime.mjs"],
    owns: "exact rendered control frame heights, border-box sizing, and action-vs-field radius roles",
  },
  {
    id: "choice-frame-runtime",
    command: "node",
    args: ["packages/audit/scripts/audit-choice-frame-runtime.mjs"],
    owns: "checkbox, radio, switch, slider density geometry, mark/icon scaling, motion, and light/dark choice legibility",
  },
  {
    id: "icon-button-runtime",
    command: "node",
    args: ["packages/audit/scripts/audit-icon-button-runtime.mjs"],
    owns: "IconButton density sizing, icon scale, keyboard activation, and light/dark legibility",
  },
  {
    id: "option-listbox-runtime",
    command: "node",
    args: ["packages/audit/scripts/audit-option-listbox-runtime.mjs"],
    owns: "shared select, combobox, and menu option/listbox geometry, selection, active, disabled, and contrast behavior",
  },
];

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

function statusIsPass(value) {
  return String(value ?? "").toLowerCase() === "pass";
}

function runRuntimeCheck(check) {
  const child = spawnSync(check.command, check.args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const stdout = String(child.stdout ?? "");
  const stderr = String(child.stderr ?? "");
  return {
    ...check,
    commandLine: [check.command, ...check.args].join(" "),
    status: child.status === 0 ? "pass" : "fail",
    exitCode: child.status,
    stdoutTail: stdout.split("\n").filter(Boolean).slice(-12),
    stderrTail: stderr.split("\n").filter(Boolean).slice(-12),
  };
}

function createReport() {
  const reports = Object.fromEntries(
    Object.entries(sourceReports).map(([key, file]) => [key, readJson(file)])
  );

  const cssById = indexBy(reports.cssContract.components, (row) => row.component);
  const visualById = indexBy(reports.visualCascade.components, (row) => row.id);
  const styleByName = indexBy(reports.styleGovernance.components, (row) => row.component);
  const primaryById = indexBy(reports.primaryCoverage.components, (row) => row.id ?? row.component);

  const components = (reports.artifactTests.components ?? []).map((component) => {
    const id = normalizeId(component.id);
    const name = component.component;
    const css = cssById.get(id);
    const visual = visualById.get(id);
    const style = styleByName.get(normalizeId(name));
    const primary = primaryById.get(id);
    const renderChecks = component.checks ?? [];
    const failedRenderChecks = renderChecks.filter((check) => !statusIsPass(check.status) && check.status !== "not-applicable");
    const issues = [
      ...(component.status === "fail" || failedRenderChecks.length
        ? [`artifact test failed: ${failedRenderChecks.map((check) => check.id ?? check.status).join(", ") || "render"}`]
        : []),
      ...(css ? [] : ["missing CSS contract row"]),
      ...(css && css.requiredRootObserved === false ? [`CSS root not observed: ${css.requiredRoot}`] : []),
      ...(visual ? [] : ["missing visual cascade row"]),
      ...(visual && visual.status && !statusIsPass(visual.status) ? [`visual cascade status is ${visual.status}`] : []),
      ...(style ? [] : ["missing style governance row"]),
      ...(style && !statusIsPass(style.status) ? [`style governance status is ${style.status}`] : []),
      ...(style?.violations?.length ? [`style violations: ${style.violations.length}`] : []),
      ...(primary ? [] : ["missing primary coverage row"]),
      ...(primary && !statusIsPass(primary.status) ? [`primary coverage status is ${primary.status}`] : []),
      ...(primary?.checks && Object.entries(primary.checks).filter(([, value]) => !value).length
        ? [`primary coverage checks failed: ${Object.entries(primary.checks).filter(([, value]) => !value).map(([key]) => key).join(", ")}`]
        : []),
    ];
    return {
      id,
      component: name,
      artifactStatus: failedRenderChecks.length ? "fail" : "pass",
      cssContract: css?.coverage ?? "missing",
      cssRoot: css?.requiredRoot ?? null,
      visualCascade: visual ? (visual.status ?? "pass") : "missing",
      styleGovernance: style?.status ?? "missing",
      primaryCoverage: primary?.status ?? "missing",
      runtimeEvidence: {
        contract: component.evidence?.contract ?? primary?.source ?? null,
        runtime: component.evidence?.runtime ?? primary?.dist ?? null,
        types: component.evidence?.types ?? primary?.distTypes ?? null,
      },
      issues,
      status: issues.length ? "fail" : "pass",
    };
  });

  const sourceReportIssues = Object.entries(reports).flatMap(([key, report]) => (
    statusIsPass(report.status) ? [] : [`${key} status is ${report.status ?? "unknown"}`]
  ));
  const runtimeResults = runtimeChecks.map(runRuntimeCheck);
  const runtimeCheckIssues = runtimeResults
    .filter((check) => !statusIsPass(check.status))
    .map((check) => `${check.id} status is ${check.status}`);

  const inventory = {
    components: components.length,
    runtimeAuditedComponents: components.filter((component) => component.runtimeEvidence.runtime && component.runtimeEvidence.types).length,
    passingRuntimeComponents: components.filter((component) => component.status === "pass").length,
    failingRuntimeComponents: components.filter((component) => component.status === "fail").length,
    sourceReports: Object.keys(sourceReports).length,
    passingSourceReports: Object.values(reports).filter((report) => statusIsPass(report.status)).length,
    sourceReportIssues: sourceReportIssues.length,
    runtimeChecks: runtimeResults.length,
    passingRuntimeChecks: runtimeResults.filter((check) => statusIsPass(check.status)).length,
    runtimeCheckIssues: runtimeCheckIssues.length,
    componentRuntimeDebt: 0,
  };
  inventory.componentRuntimeDebt = inventory.failingRuntimeComponents
    + inventory.sourceReportIssues
    + inventory.runtimeCheckIssues
    + Math.max(0, inventory.components - inventory.runtimeAuditedComponents);

  return {
    status: inventory.componentRuntimeDebt ? "fail" : "pass",
    audit: "system component runtime audit",
    planIteration: 19,
    principle: "Every public component must pass runtime rendering, CSS contract, visual cascade, style governance, and primary React coverage as one auditable boundary.",
    sourceReports,
    inventory,
    sourceReportIssues,
    runtimeChecks: runtimeResults,
    runtimeCheckIssues,
    components,
  };
}

function toMarkdown(report) {
  const rows = report.components.map((component) => `| ${component.id} | ${component.component} | ${component.artifactStatus} | ${component.cssContract} | ${component.visualCascade} | ${component.styleGovernance} | ${component.primaryCoverage} | ${component.status} | ${component.issues.join("; ") || "None"} |`);
  return [
    "# System Component Runtime Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Components: ${report.inventory.components}`,
    `- Runtime audited components: ${report.inventory.runtimeAuditedComponents}`,
    `- Passing runtime components: ${report.inventory.passingRuntimeComponents}`,
    `- Failing runtime components: ${report.inventory.failingRuntimeComponents}`,
    `- Source reports: ${report.inventory.sourceReports}`,
    `- Passing source reports: ${report.inventory.passingSourceReports}`,
    `- Source report issues: ${report.inventory.sourceReportIssues}`,
    `- Runtime checks: ${report.inventory.runtimeChecks}`,
    `- Passing runtime checks: ${report.inventory.passingRuntimeChecks}`,
    `- Runtime check issues: ${report.inventory.runtimeCheckIssues}`,
    `- Component runtime debt: ${report.inventory.componentRuntimeDebt}`,
    "",
    "## Source Reports",
    "",
    ...Object.entries(report.sourceReports).map(([key, file]) => `- ${key}: ${file}`),
    "",
    "## Runtime Checks",
    "",
    "| Check | Status | Command | Owns |",
    "| --- | --- | --- | --- |",
    ...report.runtimeChecks.map((check) => `| ${check.id} | ${check.status} | \`${check.commandLine}\` | ${check.owns} |`),
    "",
    "## Runtime Check Issues",
    "",
    ...(report.runtimeCheckIssues.length ? report.runtimeCheckIssues.map((issue) => `- ${issue}`) : ["- None"]),
    "",
    "## Component Runtime Matrix",
    "",
    "| Component ID | React component | Artifact tests | CSS contract | Visual cascade | Style governance | Primary coverage | Status | Issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
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
      console.error("System component runtime audit is stale. Run: node packages/audit/scripts/report-system-component-runtime-audit.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    passingRuntimeComponents: report.inventory.passingRuntimeComponents,
    componentRuntimeDebt: report.inventory.componentRuntimeDebt,
    json: "docs/audits/system-component-runtime-audit.json",
    markdown: "docs/audits/system-component-runtime-audit.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
