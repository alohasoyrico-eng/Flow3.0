#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const auditsDir = path.join(root, "docs/audits");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-debt-ledger.json");
const markdownOutput = path.join(outputDir, "system-debt-ledger.md");

const reportCategories = {
  "anti-duplication-coverage.json": "anti-duplication",
  "component-1to1-quality-matrix.json": "quality",
  "component-css-contract-coverage.json": "cascade",
  "component-visual-cascade-audit.json": "cascade",
  "docs-component-demo-ownership.json": "docs-system-boundary",
  "docs-system-boundary-audit.json": "docs-system-boundary",
  "family-css-contract-maturity.json": "cascade",
  "foundation-primitive-export-contract-audit.json": "foundations-primitives",
  "legacy-dom-source-governance-audit.json": "react-primary",
  "package-css-root-governance-audit.json": "cascade",
  "react-accessibility-governance-audit.json": "react-primary",
  "react-class-ownership-audit.json": "react-primary",
  "react-composition-governance-audit.json": "react-primary",
  "react-contract-prop-alignment-audit.json": "react-primary",
  "react-controlled-governance-audit.json": "react-primary",
  "react-default-governance-audit.json": "react-primary",
  "react-interaction-coverage-audit.json": "react-primary",
  "react-primary-coverage-audit.json": "react-primary",
  "react-style-governance-audit.json": "react-primary",
  "taxonomy-boundaries-audit.json": "taxonomy",
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function debtEntriesForReport(file, report) {
  const containers = [
    ["topLevel", report],
    ["inventory", report.inventory ?? {}],
    ["summary", report.summary ?? {}],
  ];
  const seen = new Set();
  return containers.flatMap(([scope, container]) => Object.entries(container)
    .filter(([key]) => /(?:debt|debtMetrics)$/i.test(key))
    .map(([key, value]) => {
      const id = `${file}:${key}`;
      if (seen.has(id)) return null;
      seen.add(id);
      return {
        report: file,
        scope,
        metric: key,
        value,
        numericValue: typeof value === "number" ? value : null,
      };
    })
    .filter(Boolean));
}

function createReport() {
  const files = fs.existsSync(auditsDir)
    ? fs.readdirSync(auditsDir)
      .filter((file) => file.endsWith(".json") && file !== path.basename(jsonOutput))
      .sort()
    : [];
  const reports = files.map((file) => {
    const report = readJson(path.join(auditsDir, file));
    const debtEntries = debtEntriesForReport(file, report);
    return {
      file,
      category: reportCategories[file] ?? "uncategorized",
      status: report.status ?? "unknown",
      debtEntries,
    };
  });
  const missingDebtReports = reports
    .filter((report) => !report.debtEntries.length)
    .map((report) => report.file);
  const nonNumericDebtEntries = reports.flatMap((report) => report.debtEntries
    .filter((entry) => entry.numericValue == null)
    .map((entry) => ({
      report: entry.report,
      metric: entry.metric,
      value: entry.value,
    })));
  const debtEntries = reports.flatMap((report) => report.debtEntries);
  const totalDebt = debtEntries.reduce((total, entry) => total + (entry.numericValue ?? 0), 0);
  const categoryNames = [...new Set(Object.values(reportCategories))].sort();
  const categories = categoryNames.map((category) => {
    const categoryReports = reports.filter((report) => report.category === category);
    const categoryDebtMetrics = categoryReports.flatMap((report) => report.debtEntries);
    const totalCategoryDebt = categoryDebtMetrics.reduce((total, entry) => total + (entry.numericValue ?? 0), 0);
    return {
      category,
      reports: categoryReports.length,
      debtMetrics: categoryDebtMetrics.length,
      totalDebt: totalCategoryDebt,
    };
  });
  const uncategorizedReports = reports
    .filter((report) => report.category === "uncategorized")
    .map((report) => report.file);
  const categoryDebt = categories.reduce((total, category) => total + category.totalDebt, 0);
  return {
    status: totalDebt || missingDebtReports.length || nonNumericDebtEntries.length || uncategorizedReports.length ? "fail" : "pass",
    audit: "system debt ledger",
    principle: "Every audit report must expose numeric actionable debt, and the aggregate system debt must stay at 0 before Flow is considered product-ready.",
    inventory: {
      reports: reports.length,
      reportsWithDebtMetrics: reports.length - missingDebtReports.length,
      debtMetrics: debtEntries.length,
      categories: categories.length,
      categoriesWithDebt: categories.filter((category) => category.totalDebt > 0).length,
      uncategorizedReports: uncategorizedReports.length,
      nonNumericDebtMetrics: nonNumericDebtEntries.length,
      totalDebt,
      categoryDebt,
      systemDebt: totalDebt + missingDebtReports.length + nonNumericDebtEntries.length + uncategorizedReports.length,
    },
    missingDebtReports,
    nonNumericDebtEntries,
    uncategorizedReports,
    categories,
    reports,
  };
}

function toMarkdown(report) {
  const categoryRows = report.categories.map((item) => `| ${item.category} | ${item.reports} | ${item.debtMetrics} | ${item.totalDebt} |`);
  const reportRows = report.reports.map((item) => `| ${item.file} | ${item.category} | ${item.status} | ${item.debtEntries.map((entry) => `${entry.metric}: ${entry.value}`).join("<br>") || "None"} |`);
  const missingRows = report.missingDebtReports.map((file) => `| ${file} |`);
  const nonNumericRows = report.nonNumericDebtEntries.map((entry) => `| ${entry.report} | ${entry.metric} | ${JSON.stringify(entry.value)} |`);
  const uncategorizedRows = report.uncategorizedReports.map((file) => `| ${file} |`);
  return [
    "# System Debt Ledger",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Reports scanned: ${report.inventory.reports}`,
    `- Reports with debt metrics: ${report.inventory.reportsWithDebtMetrics}`,
    `- Debt metrics: ${report.inventory.debtMetrics}`,
    `- Categories: ${report.inventory.categories}`,
    `- Categories with debt: ${report.inventory.categoriesWithDebt}`,
    `- Uncategorized reports: ${report.inventory.uncategorizedReports}`,
    `- Non-numeric debt metrics: ${report.inventory.nonNumericDebtMetrics}`,
    `- Total numeric debt: ${report.inventory.totalDebt}`,
    `- Category debt: ${report.inventory.categoryDebt}`,
    `- System debt: ${report.inventory.systemDebt}`,
    "",
    "## Categories",
    "",
    "| Category | Reports | Debt metrics | Total debt |",
    "| --- | ---: | ---: | ---: |",
    ...categoryRows,
    "",
    "## Uncategorized Reports",
    "",
    "| Report |",
    "| --- |",
    ...(uncategorizedRows.length ? uncategorizedRows : ["| None |"]),
    "",
    "## Missing Debt Reports",
    "",
    "| Report |",
    "| --- |",
    ...(missingRows.length ? missingRows : ["| None |"]),
    "",
    "## Non-Numeric Debt Metrics",
    "",
    "| Report | Metric | Value |",
    "| --- | --- | --- |",
    ...(nonNumericRows.length ? nonNumericRows : ["| None | None | None |"]),
    "",
    "## Reports",
    "",
    "| Report | Category | Status | Debt metrics |",
    "| --- | --- | --- | --- |",
    ...reportRows,
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
      console.error("System debt ledger is stale. Run: node packages/audit/scripts/report-system-debt-ledger.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    reports: report.inventory.reports,
    debtMetrics: report.inventory.debtMetrics,
    categories: report.inventory.categories,
    totalDebt: report.inventory.totalDebt,
    systemDebt: report.inventory.systemDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
