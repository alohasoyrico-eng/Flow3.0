#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { componentCssContractCoverage } = require("./audit-component-css-contracts.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "component-css-contract-coverage.json");
const markdownOutput = path.join(outputDir, "component-css-contract-coverage.md");

function renderMarkdown(report) {
  const rows = report.components
    .map((item) => `| ${item.component} | ${item.coverage} | ${item.contract ?? "missing"} |`)
    .join("\n");
  return [
    "# Component CSS Contract Coverage",
    "",
    `Status: ${report.status}`,
    "",
    `- Components: ${report.total}`,
    `- Direct contracts: ${report.direct}`,
    `- Family contracts: ${report.family}`,
    `- Missing contracts: ${report.missing.length}`,
    "",
    "| Component | Coverage | Contract |",
    "| --- | --- | --- |",
    rows,
    "",
  ].join("\n");
}

function main() {
  const coverage = componentCssContractCoverage();
  const report = {
    status: coverage.missing.length ? "fail" : "pass",
    ...coverage,
  };

  if (!checkMode) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(markdownOutput, renderMarkdown(report));
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.total,
    direct: report.direct,
    family: report.family,
    missing: report.missing,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
