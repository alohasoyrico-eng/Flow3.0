#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { createDocsComponentDemoOwnershipReport } = require("./audit-docs-component-demo-ownership.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "docs-component-demo-ownership.json");
const markdownOutput = path.join(outputDir, "docs-component-demo-ownership.md");

const expectedInventory = {
  fullModules: 8,
  functionRegions: 4,
  regions: 12,
  forbiddenPatterns: 15,
  violations: 0,
};

function createReport() {
  const report = createDocsComponentDemoOwnershipReport();
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => report.inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: report.inventory[key],
    }));
  return {
    ...report,
    status: report.status === "pass" && !baselineMismatches.length ? "pass" : "fail",
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const regionRows = report.regions
    .map((item) => `| ${item.file} | ${item.region} | ${item.mode} |`);
  const violationRows = report.violations
    .map((item) => `| ${item.file}:${item.line} | ${item.message} |`);
  return [
    "# Docs Component Demo Ownership",
    "",
    `Status: ${report.status}`,
    "",
    "FlowDocs may register and frame React-owned component demos, but it must not own component behavior through direct DOM mutation.",
    "",
    "## Inventory",
    "",
    `- Docs app scanned: ${report.docsDir ?? "none"}`,
    `- Full modules: ${report.inventory.fullModules}`,
    `- Function regions: ${report.inventory.functionRegions}`,
    `- Regions scanned: ${report.inventory.regions}`,
    `- Forbidden patterns: ${report.inventory.forbiddenPatterns}`,
    `- Violations: ${report.inventory.violations}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. FlowDocs should not silently stop scanning demo ownership regions or allow React-owned demos to mutate component DOM.",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...baselineRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(baselineMismatchRows.length ? baselineMismatchRows : ["| None | None | None |"]),
    "",
    "## Regions",
    "",
    "| File | Region | Mode |",
    "| --- | --- | --- |",
    ...regionRows,
    "",
    "## Violations",
    "",
    "| Location | Message |",
    "| --- | --- |",
    ...(violationRows.length ? violationRows : ["| None | None |"]),
    "",
  ].join("\n");
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Docs component demo ownership report is stale. Run: node packages/audit/scripts/report-docs-component-demo-ownership.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    docsDir: report.docsDir,
    regions: report.inventory.regions,
    forbiddenPatterns: report.inventory.forbiddenPatterns,
    violations: report.inventory.violations,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
