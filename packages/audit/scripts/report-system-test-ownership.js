#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-test-ownership.json");
const markdownOutput = path.join(outputDir, "system-test-ownership.md");

const requiredReports = [
  {
    layer: "components",
    planIteration: 15,
    file: "docs/audits/system-component-artifact-tests.json",
    statusKey: "status",
    debtKey: "componentArtifactTestDebt",
    testedKey: "testedComponents",
    passingKey: "passingComponents",
    failingKey: "failingComponents",
  },
  {
    layer: "patterns",
    planIteration: 16,
    file: "docs/audits/system-pattern-artifact-tests.json",
    statusKey: "status",
    debtKey: "patternArtifactTestDebt",
    testedKey: "testedPatterns",
    passingKey: "passingPatterns",
    failingKey: "failingPatterns",
  },
  {
    layer: "templates",
    planIteration: 17,
    file: "docs/audits/system-template-artifact-tests.json",
    statusKey: "status",
    debtKey: "templateArtifactTestDebt",
    testedKey: "testedTemplates",
    passingKey: "passingTemplates",
    failingKey: "failingTemplates",
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function statusOf(report, key) {
  return String(report?.[key] ?? "").toLowerCase();
}

function inventoryOf(report) {
  return report.inventory ?? {};
}

function rowFor(definition) {
  const fullPath = path.join(root, definition.file);
  if (!fs.existsSync(fullPath)) {
    return {
      ...definition,
      status: "missing",
      tested: 0,
      passing: 0,
      failing: 1,
      debt: 1,
      issues: [`missing report: ${definition.file}`],
    };
  }
  const report = readJson(definition.file);
  const inventory = inventoryOf(report);
  const status = statusOf(report, definition.statusKey);
  const tested = Number(inventory[definition.testedKey] ?? 0);
  const passing = Number(inventory[definition.passingKey] ?? 0);
  const failing = Number(inventory[definition.failingKey] ?? 0);
  const debt = Number(inventory[definition.debtKey] ?? 0);
  const issues = [
    ...(status === "pass" ? [] : [`status is ${status || "unknown"}`]),
    ...(report.planIteration === definition.planIteration ? [] : [`planIteration expected ${definition.planIteration}, got ${report.planIteration ?? "missing"}`]),
    ...(tested > 0 ? [] : ["tested count is zero"]),
    ...(tested === passing ? [] : [`tested/passing mismatch: ${tested}/${passing}`]),
    ...(failing === 0 ? [] : [`failing count is ${failing}`]),
    ...(debt === 0 ? [] : [`${definition.debtKey} is ${debt}`]),
  ];
  return {
    ...definition,
    status,
    tested,
    passing,
    failing,
    debt,
    issues,
  };
}

function createReport() {
  const rows = requiredReports.map(rowFor);
  const inventory = {
    ownershipReports: rows.length,
    passingOwnershipReports: rows.filter((row) => row.status === "pass" && row.issues.length === 0).length,
    coveredPlanIterations: rows.map((row) => row.planIteration).join(","),
    testedArtifacts: rows.reduce((total, row) => total + row.tested, 0),
    passingArtifacts: rows.reduce((total, row) => total + row.passing, 0),
    failingArtifacts: rows.reduce((total, row) => total + row.failing, 0),
    componentArtifacts: rows.find((row) => row.layer === "components")?.tested ?? 0,
    patternArtifacts: rows.find((row) => row.layer === "patterns")?.tested ?? 0,
    templateArtifacts: rows.find((row) => row.layer === "templates")?.tested ?? 0,
    artifactTestDebt: rows.reduce((total, row) => total + row.debt, 0),
    ownershipIssues: rows.reduce((total, row) => total + row.issues.length, 0),
  };
  inventory.testOwnershipDebt = inventory.artifactTestDebt
    + inventory.ownershipIssues
    + (inventory.ownershipReports - inventory.passingOwnershipReports);
  return {
    status: inventory.testOwnershipDebt ? "fail" : "pass",
    audit: "system test ownership",
    planIteration: 18,
    principle: "Every public artifact layer must have a one-to-one test ownership report before runtime-public verification continues.",
    inventory,
    rows: rows.map((row) => ({
      layer: row.layer,
      planIteration: row.planIteration,
      report: row.file,
      status: row.status,
      tested: row.tested,
      passing: row.passing,
      failing: row.failing,
      debt: row.debt,
      issues: row.issues,
    })),
  };
}

function toMarkdown(report) {
  const rows = report.rows.map((row) => `| ${row.layer} | ${row.planIteration} | ${row.report} | ${row.status} | ${row.tested} | ${row.passing} | ${row.failing} | ${row.debt} | ${row.issues.join("; ") || "None"} |`);
  return [
    "# System Test Ownership",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Ownership reports: ${report.inventory.ownershipReports}`,
    `- Passing ownership reports: ${report.inventory.passingOwnershipReports}`,
    `- Covered plan iterations: ${report.inventory.coveredPlanIterations}`,
    `- Tested artifacts: ${report.inventory.testedArtifacts}`,
    `- Passing artifacts: ${report.inventory.passingArtifacts}`,
    `- Failing artifacts: ${report.inventory.failingArtifacts}`,
    `- Component artifacts: ${report.inventory.componentArtifacts}`,
    `- Pattern artifacts: ${report.inventory.patternArtifacts}`,
    `- Template artifacts: ${report.inventory.templateArtifacts}`,
    `- Artifact test debt: ${report.inventory.artifactTestDebt}`,
    `- Ownership issues: ${report.inventory.ownershipIssues}`,
    `- Test ownership debt: ${report.inventory.testOwnershipDebt}`,
    "",
    "## Ownership Matrix",
    "",
    "| Layer | Iteration | Report | Status | Tested | Passing | Failing | Debt | Issues |",
    "| --- | ---: | --- | --- | ---: | ---: | ---: | ---: | --- |",
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
      console.error("System test ownership report is stale. Run: node packages/audit/scripts/report-system-test-ownership.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    testedArtifacts: report.inventory.testedArtifacts,
    passingArtifacts: report.inventory.passingArtifacts,
    testOwnershipDebt: report.inventory.testOwnershipDebt,
    json: "docs/audits/system-test-ownership.json",
    markdown: "docs/audits/system-test-ownership.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
