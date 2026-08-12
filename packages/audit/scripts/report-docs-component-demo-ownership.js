#!/usr/bin/env node

const { fs, path, readJson, root } = require("./audit-context.js");
const { createDocsComponentDemoOwnershipReport } = require("./audit-docs-component-demo-ownership.js");

const checkMode = process.argv.includes("--check");
const docsBoundaryFile = path.join(root, "packages/content/content/docs-system-boundary.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "docs-component-demo-ownership.json");
const markdownOutput = path.join(outputDir, "docs-component-demo-ownership.md");

const docsBoundaryPolicy = readJson(docsBoundaryFile) ?? {};
const expectedInventory = docsBoundaryPolicy.docsComponentDemoOwnershipExpectedInventory
  && typeof docsBoundaryPolicy.docsComponentDemoOwnershipExpectedInventory === "object"
  ? docsBoundaryPolicy.docsComponentDemoOwnershipExpectedInventory
  : {};

function docsDemoOwnershipPolicyIssues() {
  const issues = [];
  if (!docsBoundaryPolicy.docsComponentDemoOwnershipExpectedInventory || typeof docsBoundaryPolicy.docsComponentDemoOwnershipExpectedInventory !== "object") {
    issues.push("docsComponentDemoOwnershipExpectedInventory must be an object");
  }
  for (const [key, expected] of Object.entries(expectedInventory)) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key) || !Number.isInteger(expected) || expected < 0) {
      issues.push(`invalid docsComponentDemoOwnershipExpectedInventory entry: ${key}`);
    }
  }
  return issues;
}

function createReport() {
  const report = createDocsComponentDemoOwnershipReport();
  if (!report.docsDir) {
    return {
      ...report,
      status: "skipped",
      principle: "FlowDocs may register and frame React-owned component demos, but Flow3 does not audit external Docs sources in CI.",
      baseline: {
        inventory: expectedInventory,
        mismatches: [],
      },
      governance: {
        file: path.relative(root, docsBoundaryFile),
        issues: [],
      },
    };
  }
  const policyIssues = docsDemoOwnershipPolicyIssues();
  const inventory = {
    ...report.inventory,
    docsDemoOwnershipPolicyIssues: policyIssues.length,
    docsDemoOwnershipDebt: report.inventory.violations + policyIssues.length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  return {
    ...report,
    inventory,
    status: !inventory.docsDemoOwnershipDebt && report.status === "pass" && !baselineMismatches.length ? "pass" : "fail",
    principle: "FlowDocs may register and frame React-owned component demos, but it must not own component behavior through direct DOM mutation. The actionable debt metric is docsDemoOwnershipDebt.",
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    governance: {
      file: path.relative(root, docsBoundaryFile),
      issues: policyIssues,
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
    report.principle,
    "",
    "## Inventory",
    "",
    `- Docs app scanned: ${report.docsDir ?? "none"}`,
    `- Full modules: ${report.inventory.fullModules}`,
    `- Function regions: ${report.inventory.functionRegions}`,
    `- Regions scanned: ${report.inventory.regions}`,
    `- Forbidden patterns: ${report.inventory.forbiddenPatterns}`,
    `- Violations: ${report.inventory.violations}`,
    `- Docs demo ownership debt: ${report.inventory.docsDemoOwnershipDebt}`,
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
    if (report.status === "skipped") {
      console.log("Docs component demo ownership report skipped: docs app is external to Flow3.");
      return;
    }
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
    docsDemoOwnershipDebt: report.inventory.docsDemoOwnershipDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
