#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { componentCssContractCoverage } = require("./audit-component-css-contracts.js");
const { componentCssGovernance } = require("./component-css-governance-policy.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "component-css-contract-coverage.json");
const markdownOutput = path.join(outputDir, "component-css-contract-coverage.md");

function compareStringArrays(actual = [], expected = []) {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  return actualSorted.length === expectedSorted.length
    && actualSorted.every((value, index) => value === expectedSorted[index]);
}

function familyContractMismatches(groups = [], expectedFamilyContracts = []) {
  const mismatches = [];
  if (groups.length !== expectedFamilyContracts.length) {
    mismatches.push({
      contract: "family-contract-count",
      expected: expectedFamilyContracts.length,
      actual: groups.length,
    });
  }
  for (const expected of expectedFamilyContracts) {
    const actual = groups.find((group) => group.contract === expected.contract);
    if (!actual) {
      mismatches.push({
        contract: expected.contract,
        expected: "present",
        actual: "missing",
      });
      continue;
    }
    for (const key of ["components", "requiredRoots", "allowedExtensionRoots"]) {
      if (!compareStringArrays(actual[key], expected[key])) {
        mismatches.push({
          contract: expected.contract,
          key,
          expected: expected[key],
          actual: actual[key] ?? [],
        });
      }
    }
  }
  for (const actual of groups) {
    if (!expectedFamilyContracts.some((expected) => expected.contract === actual.contract)) {
      mismatches.push({
        contract: actual.contract,
        expected: "not present",
        actual: "present",
      });
    }
  }
  return mismatches;
}

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
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.baseline.actual[key]} |`)
    .join("\n");
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`)
    .join("\n");
  const familyBaselineRows = report.baseline.familyContracts
    .map((item) => `| ${item.contract} | ${item.requiredRoots.join(", ")} | ${item.allowedExtensionRoots.join(", ") || "None"} | ${item.components.join(", ")} |`)
    .join("\n");
  const familyMismatchRows = report.baseline.familyContractMismatches
    .map((item) => `| ${item.contract} | ${item.key ?? "contract"} | ${Array.isArray(item.expected) ? item.expected.join(", ") : item.expected} | ${Array.isArray(item.actual) ? item.actual.join(", ") : item.actual} |`)
    .join("\n");
  return [
    "# Component CSS Contract Coverage",
    "",
    `Status: ${report.status}`,
    "",
    `- Components: ${report.total}`,
    `- CSS contract debt: ${report.cssContractDebt}`,
    `- Direct contracts: ${report.direct}`,
    `- Family contracts: ${report.family}`,
    `- Missing contracts: ${report.missing.length}`,
    `- Direct root gaps: ${report.directRootGaps.length}`,
    `- Family root gaps: ${report.familyRootGaps.length}`,
    `- Undeclared family extension roots: ${report.familyUnexpectedRoots.length}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    `- Family baseline mismatches: ${report.baseline.familyContractMismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. cssContractDebt must stay at 0; a new family contract or reduced direct coverage must be reviewed instead of silently widening cascade behavior.",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    baselineRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    baselineMismatchRows || "| None | None | None |",
    "",
    "## Family Contract Baseline",
    "",
    "| Shared contract | Required React root | Allowed extension roots | Components covered |",
    "| --- | --- | --- | --- |",
    familyBaselineRows || "| None | None | None | None |",
    "",
    "## Family Contract Baseline Mismatches",
    "",
    "| Contract | Field | Expected | Actual |",
    "| --- | --- | --- | --- |",
    familyMismatchRows || "| None | None | None | None |",
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
  const { expectedInventory, expectedFamilyContracts, governance } = componentCssGovernance();
  const coverage = componentCssContractCoverage();
  const actualInventory = {
    total: coverage.total,
    cssContractDebt: coverage.missing.length
      + coverage.directRootGaps.length
      + coverage.familyRootGaps.length
      + coverage.familyUnexpectedRoots.length,
    direct: coverage.direct,
    family: coverage.family,
    missing: coverage.missing.length,
    directRootGaps: coverage.directRootGaps.length,
    familyRootGaps: coverage.familyRootGaps.length,
    familyUnexpectedRoots: coverage.familyUnexpectedRoots.length,
    componentCssGovernanceIssues: governance.issues.length,
  };
  actualInventory.cssContractDebt += actualInventory.componentCssGovernanceIssues;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => actualInventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: actualInventory[key],
    }));
  const familyBaselineMismatches = familyContractMismatches(coverage.familyContractPolicy.groups, expectedFamilyContracts);
  const report = {
    status: coverage.missing.length
      || coverage.directRootGaps.length
      || coverage.familyRootGaps.length
      || coverage.familyUnexpectedRoots.length
      || governance.issues.length
      || baselineMismatches.length
      || familyBaselineMismatches.length
      ? "fail"
      : "pass",
    inventory: actualInventory,
    baseline: {
      inventory: expectedInventory,
      actual: actualInventory,
      mismatches: baselineMismatches,
      familyContracts: expectedFamilyContracts,
      familyContractMismatches: familyBaselineMismatches,
    },
    governance,
    cssContractDebt: actualInventory.cssContractDebt,
    ...coverage,
  };
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = renderMarkdown(report);

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Component CSS contract coverage report is stale. Run: node packages/audit/scripts/report-component-css-contract-coverage.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
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
    cssContractDebt: report.cssContractDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
