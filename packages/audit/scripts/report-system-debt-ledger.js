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

const expectedStrategicCategories = [
  "anti-duplication",
  "cascade",
  "docs-system-boundary",
  "foundations-primitives",
  "quality",
  "react-primary",
  "taxonomy",
];

const categoryReportMinimums = {
  "anti-duplication": 1,
  cascade: 4,
  "docs-system-boundary": 2,
  "foundations-primitives": 1,
  quality: 1,
  "react-primary": 10,
  taxonomy: 1,
};

const categoryPrinciples = {
  "anti-duplication": "One visual or conceptual source per system concept.",
  cascade: "Component styling must cascade from exported system contracts.",
  "docs-system-boundary": "FlowDocs must consume Flow instead of owning system behavior.",
  "foundations-primitives": "Foundations and primitives must be exportable beyond CSS.",
  quality: "Component coverage must prove production readiness, not just presence.",
  "react-primary": "React must be the primary implementation with real contracts.",
  taxonomy: "Components, primitives, patterns, and templates must stay separated.",
};

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
  const mappedReportFiles = Object.keys(reportCategories).sort();
  const staleCategoryMappings = mappedReportFiles.filter((file) => !files.includes(file));
  const minimumCategoryNames = Object.keys(categoryReportMinimums).sort();
  const principleCategoryNames = Object.keys(categoryPrinciples).sort();
  const categoriesMissingMinimums = expectedStrategicCategories
    .filter((category) => !minimumCategoryNames.includes(category))
    .sort();
  const unexpectedCategoryMinimums = minimumCategoryNames
    .filter((category) => !expectedStrategicCategories.includes(category))
    .sort();
  const categoriesMissingPrinciples = expectedStrategicCategories
    .filter((category) => !principleCategoryNames.includes(category))
    .sort();
  const unexpectedCategoryPrinciples = principleCategoryNames
    .filter((category) => !expectedStrategicCategories.includes(category))
    .sort();
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
  const categoryNames = [...expectedStrategicCategories].sort();
  const categories = categoryNames.map((category) => {
    const categoryReports = reports.filter((report) => report.category === category);
    const categoryDebtMetrics = categoryReports.flatMap((report) => report.debtEntries);
    const totalCategoryDebt = categoryDebtMetrics.reduce((total, entry) => total + (entry.numericValue ?? 0), 0);
    const minimumReports = categoryReportMinimums[category] ?? 1;
    const coverageGap = Math.max(0, minimumReports - categoryReports.length);
    return {
      category,
      principle: categoryPrinciples[category] ?? "",
      reports: categoryReports.length,
      minimumReports,
      coverageGap,
      debtMetrics: categoryDebtMetrics.length,
      totalDebt: totalCategoryDebt,
    };
  });
  const uncategorizedReports = reports
    .filter((report) => report.category === "uncategorized")
    .map((report) => report.file);
  const mappedCategories = [...new Set(reports.map((report) => report.category).filter((category) => category !== "uncategorized"))].sort();
  const unexpectedCategories = mappedCategories.filter((category) => !expectedStrategicCategories.includes(category));
  const missingStrategicCategories = expectedStrategicCategories.filter((category) => !mappedCategories.includes(category));
  const emptyStrategicCategories = categories
    .filter((category) => category.reports === 0)
    .map((category) => category.category);
  const undercoveredStrategicCategories = categories
    .filter((category) => category.coverageGap > 0)
    .map((category) => ({
      category: category.category,
      reports: category.reports,
      minimumReports: category.minimumReports,
      coverageGap: category.coverageGap,
    }));
  const categoryDebt = categories.reduce((total, category) => total + category.totalDebt, 0);
  const categoryMinimumDebt = categories.reduce((total, category) => total + category.coverageGap, 0);
  const categoryCoverageDebt = uncategorizedReports.length
    + unexpectedCategories.length
    + missingStrategicCategories.length
    + emptyStrategicCategories.length
    + staleCategoryMappings.length
    + categoryMinimumDebt
    + categoriesMissingMinimums.length
    + unexpectedCategoryMinimums.length
    + categoriesMissingPrinciples.length
    + unexpectedCategoryPrinciples.length;
  return {
    status: totalDebt || missingDebtReports.length || nonNumericDebtEntries.length || categoryCoverageDebt ? "fail" : "pass",
    audit: "system debt ledger",
    principle: "Every audit report must expose numeric actionable debt, and the aggregate system debt must stay at 0 before Flow is considered product-ready.",
    inventory: {
      reports: reports.length,
      categoryMappings: mappedReportFiles.length,
      staleCategoryMappings: staleCategoryMappings.length,
      reportsWithDebtMetrics: reports.length - missingDebtReports.length,
      debtMetrics: debtEntries.length,
      categories: categories.length,
      categoryMinimums: minimumCategoryNames.length,
      categoryPrinciples: principleCategoryNames.length,
      categoryMinimumDebt,
      categoriesMissingMinimums: categoriesMissingMinimums.length,
      unexpectedCategoryMinimums: unexpectedCategoryMinimums.length,
      categoriesMissingPrinciples: categoriesMissingPrinciples.length,
      unexpectedCategoryPrinciples: unexpectedCategoryPrinciples.length,
      categoriesWithDebt: categories.filter((category) => category.totalDebt > 0).length,
      undercoveredStrategicCategories: undercoveredStrategicCategories.length,
      uncategorizedReports: uncategorizedReports.length,
      unexpectedCategories: unexpectedCategories.length,
      missingStrategicCategories: missingStrategicCategories.length,
      emptyStrategicCategories: emptyStrategicCategories.length,
      nonNumericDebtMetrics: nonNumericDebtEntries.length,
      totalDebt,
      categoryDebt,
      categoryCoverageDebt,
      systemDebt: totalDebt + missingDebtReports.length + nonNumericDebtEntries.length + categoryCoverageDebt,
    },
    missingDebtReports,
    nonNumericDebtEntries,
    uncategorizedReports,
    staleCategoryMappings,
    categoriesMissingMinimums,
    unexpectedCategoryMinimums,
    categoriesMissingPrinciples,
    unexpectedCategoryPrinciples,
    unexpectedCategories,
    missingStrategicCategories,
    emptyStrategicCategories,
    undercoveredStrategicCategories,
    categories,
    reports,
  };
}

function toMarkdown(report) {
  const categoryRows = report.categories.map((item) => `| ${item.category} | ${item.principle} | ${item.reports} | ${item.minimumReports} | ${item.coverageGap} | ${item.debtMetrics} | ${item.totalDebt} |`);
  const reportRows = report.reports.map((item) => `| ${item.file} | ${item.category} | ${item.status} | ${item.debtEntries.map((entry) => `${entry.metric}: ${entry.value}`).join("<br>") || "None"} |`);
  const missingRows = report.missingDebtReports.map((file) => `| ${file} |`);
  const nonNumericRows = report.nonNumericDebtEntries.map((entry) => `| ${entry.report} | ${entry.metric} | ${JSON.stringify(entry.value)} |`);
  const uncategorizedRows = report.uncategorizedReports.map((file) => `| ${file} |`);
  const staleMappingRows = report.staleCategoryMappings.map((file) => `| ${file} |`);
  const categoryGapRows = [
    ...report.categoriesMissingMinimums.map((category) => ["Missing category minimum", category]),
    ...report.unexpectedCategoryMinimums.map((category) => ["Unexpected category minimum", category]),
    ...report.categoriesMissingPrinciples.map((category) => ["Missing category principle", category]),
    ...report.unexpectedCategoryPrinciples.map((category) => ["Unexpected category principle", category]),
    ...report.unexpectedCategories.map((category) => ["Unexpected category", category]),
    ...report.missingStrategicCategories.map((category) => ["Missing strategic category", category]),
    ...report.emptyStrategicCategories.map((category) => ["Empty strategic category", category]),
    ...report.undercoveredStrategicCategories.map((item) => ["Undercovered strategic category", `${item.category} (${item.reports}/${item.minimumReports})`]),
  ].map(([gap, value]) => `| ${gap} | ${value} |`);
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
    `- Category mappings: ${report.inventory.categoryMappings}`,
    `- Stale category mappings: ${report.inventory.staleCategoryMappings}`,
    `- Reports with debt metrics: ${report.inventory.reportsWithDebtMetrics}`,
    `- Debt metrics: ${report.inventory.debtMetrics}`,
    `- Categories: ${report.inventory.categories}`,
    `- Category minimums: ${report.inventory.categoryMinimums}`,
    `- Category principles: ${report.inventory.categoryPrinciples}`,
    `- Category minimum debt: ${report.inventory.categoryMinimumDebt}`,
    `- Categories missing minimums: ${report.inventory.categoriesMissingMinimums}`,
    `- Unexpected category minimums: ${report.inventory.unexpectedCategoryMinimums}`,
    `- Categories missing principles: ${report.inventory.categoriesMissingPrinciples}`,
    `- Unexpected category principles: ${report.inventory.unexpectedCategoryPrinciples}`,
    `- Categories with debt: ${report.inventory.categoriesWithDebt}`,
    `- Undercovered strategic categories: ${report.inventory.undercoveredStrategicCategories}`,
    `- Uncategorized reports: ${report.inventory.uncategorizedReports}`,
    `- Unexpected categories: ${report.inventory.unexpectedCategories}`,
    `- Missing strategic categories: ${report.inventory.missingStrategicCategories}`,
    `- Empty strategic categories: ${report.inventory.emptyStrategicCategories}`,
    `- Non-numeric debt metrics: ${report.inventory.nonNumericDebtMetrics}`,
    `- Total numeric debt: ${report.inventory.totalDebt}`,
    `- Category debt: ${report.inventory.categoryDebt}`,
    `- Category coverage debt: ${report.inventory.categoryCoverageDebt}`,
    `- System debt: ${report.inventory.systemDebt}`,
    "",
    "## Categories",
    "",
    "| Category | Principle | Reports | Minimum reports | Coverage gap | Debt metrics | Total debt |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: |",
    ...categoryRows,
    "",
    "## Uncategorized Reports",
    "",
    "| Report |",
    "| --- |",
    ...(uncategorizedRows.length ? uncategorizedRows : ["| None |"]),
    "",
    "## Stale Category Mappings",
    "",
    "| Report |",
    "| --- |",
    ...(staleMappingRows.length ? staleMappingRows : ["| None |"]),
    "",
    "## Category Contract Gaps",
    "",
    "| Gap | Value |",
    "| --- | --- |",
    ...(categoryGapRows.length ? categoryGapRows : ["| None | None |"]),
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
