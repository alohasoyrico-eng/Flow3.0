#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { componentCssContractCoverage } = require("./audit-component-css-contracts.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "component-css-contract-coverage.json");
const markdownOutput = path.join(outputDir, "component-css-contract-coverage.md");

function renderMarkdown(report) {
  const rows = report.components
    .map((item) => `| ${item.component} | ${item.coverage} | ${item.contract ?? "missing"} | ${item.requiredRoot ?? "n/a"} | ${item.requiredRootObserved == null ? "n/a" : String(item.requiredRootObserved)} | ${(item.allowedExtensionRoots ?? []).join(", ") || "n/a"} | ${(item.unexpectedRoots ?? []).join(", ") || "None"} |`)
    .join("\n");
  const familyRows = report.familyContractPolicy.groups
    .map((item) => `| ${item.contract} | ${item.requiredRoots.join(", ")} | ${item.allowedExtensionRoots.join(", ") || "None"} | ${item.components.join(", ")} |`)
    .join("\n");
  const familyGapRows = report.familyRootGaps
    .map((item) => `| ${item.component} | ${item.contract} | ${item.requiredRoot} | ${item.observedRoots.join(", ") || "None"} |`)
    .join("\n");
  const directGapRows = report.directRootGaps
    .map((item) => `| ${item.component} | ${item.contract} | ${item.requiredRoot} | ${item.observedRoots.join(", ") || "None"} |`)
    .join("\n");
  const familyUnexpectedRootRows = report.familyUnexpectedRoots
    .map((item) => `| ${item.component} | ${item.contract} | ${item.requiredRoot} | ${item.allowedExtensionRoots.join(", ") || "None"} | ${item.observedRoots.join(", ") || "None"} | ${item.unexpectedRoots.join(", ") || "None"} |`)
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
    `- Direct root gaps: ${report.directRootGaps.length}`,
    `- Family root gaps: ${report.familyRootGaps.length}`,
    `- Undeclared family extension roots: ${report.familyUnexpectedRoots.length}`,
    "",
    "## Family Contract Policy",
    "",
    report.familyContractPolicy.principle,
    "",
    "| Shared contract | Required React root | Allowed extension roots | Components covered |",
    "| --- | --- | --- | --- |",
    familyRows || "| None | None | None | None |",
    "",
    "## Direct Root Gaps",
    "",
    "| Component | Contract | Required root | Observed roots |",
    "| --- | --- | --- | --- |",
    directGapRows || "| None | None | None | None |",
    "",
    "## Family Root Gaps",
    "",
    "| Component | Contract | Required root | Observed roots |",
    "| --- | --- | --- | --- |",
    familyGapRows || "| None | None | None | None |",
    "",
    "## Undeclared Family Extension Roots",
    "",
    "| Component | Contract | Required root | Allowed extensions | Observed roots | Unexpected roots |",
    "| --- | --- | --- | --- | --- | --- |",
    familyUnexpectedRootRows || "| None | None | None | None | None | None |",
    "",
    "| Component | Coverage | Contract | Required root | Required root observed | Allowed extension roots | Unexpected roots |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    rows,
    "",
  ].join("\n");
}

function main() {
  const coverage = componentCssContractCoverage();
  const report = {
    status: coverage.missing.length || coverage.directRootGaps.length || coverage.familyRootGaps.length || coverage.familyUnexpectedRoots.length ? "fail" : "pass",
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
    directRootGaps: report.directRootGaps,
    familyRootGaps: report.familyRootGaps,
    familyUnexpectedRoots: report.familyUnexpectedRoots,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
