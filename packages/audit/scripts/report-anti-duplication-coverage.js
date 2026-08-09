#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { antiDuplicationCoverage, checkAntiDuplicationGovernance } = require("./audit-anti-duplication.js");
const { result } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "anti-duplication-coverage.json");
const markdownOutput = path.join(outputDir, "anti-duplication-coverage.md");

const expectedInventory = {
  checks: 6,
  componentClassRoots: 59,
  acceptedComponents: 56,
  ownerRoots: 56,
  missingOwnerRoots: 0,
  extensionRoots: 3,
  protectedComponentRoots: 6,
  blockedConceptRules: 2,
  liveDuplicateConceptViolations: 0,
  docsApps: 1,
};

const expectedExtensionRoots = ["choice", "country-flag", "select-control"];
const expectedBlockedConceptRules = {
  search: ["pattern-topbar-search", "topbar-search", "top-search", "pattern-search-results"],
  "account menu": ["pattern-account-menu"],
};

function sameStrings(actual = [], expected = []) {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  return actualSorted.length === expectedSorted.length
    && actualSorted.every((value, index) => value === expectedSorted[index]);
}

function blockedConceptRuleMismatches(blockedConceptRules) {
  const mismatches = [];
  const expectedNames = Object.keys(expectedBlockedConceptRules);
  const actualNames = blockedConceptRules.map((item) => item.concept);
  if (!sameStrings(actualNames, expectedNames)) {
    mismatches.push({
      key: "blockedConceptRules.names",
      expected: expectedNames,
      actual: actualNames,
    });
  }
  for (const [concept, classNames] of Object.entries(expectedBlockedConceptRules)) {
    const actual = blockedConceptRules.find((item) => item.concept === concept);
    if (!actual) continue;
    if (!sameStrings(actual.classNames, classNames)) {
      mismatches.push({
        key: `blockedConceptRules.${concept}`,
        expected: classNames,
        actual: actual.classNames,
      });
    }
  }
  return mismatches;
}

function renderMarkdown(report) {
  const concepts = report.blockedConceptRules
    .map((item) => `| ${item.concept} | ${item.classNames.join(", ")} |`)
    .join("\n");
  const liveViolationRows = report.liveDuplicateConceptViolations
    .map((item) => `| ${item.concept} | ${item.className} | ${item.source}:${item.line} |`)
    .join("\n");
  const checks = report.checks.map((item) => `- ${item}`).join("\n");
  const missingOwnerRows = report.rootRegistry.missingOwnerRoots
    .map((item) => `| ${item.component} | ${item.reactComponent} | ${item.ownerRoot} |`)
    .join("\n");
  const extensionRootRows = report.rootRegistry.extensionRoots
    .map((rootToken) => `| ${rootToken} |`)
    .join("\n");
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.baseline.actual[key]} |`)
    .join("\n");
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${Array.isArray(item.expected) ? item.expected.join(", ") : item.expected} | ${Array.isArray(item.actual) ? item.actual.join(", ") : item.actual} |`)
    .join("\n");
  return [
    "# Anti-Duplication Coverage",
    "",
    `Status: ${report.status}`,
    "",
    `- Component class roots protected: ${report.componentClassRoots.length}`,
    `- Accepted components with owner roots: ${report.rootRegistry.ownerRoots}/${report.rootRegistry.acceptedComponents}`,
    `- Missing owner roots: ${report.rootRegistry.missingOwnerRoots.length}`,
    `- Extension class roots: ${report.rootRegistry.extensionRoots.length}`,
    `- Protected high-risk roots: ${report.protectedComponentRoots.join(", ")}`,
    `- Blocked concept rules: ${report.blockedConceptRules.length}`,
    `- Live duplicate concept violations: ${report.liveDuplicateConceptViolations.length}`,
    `- Docs apps scanned: ${report.docsApps.join(", ") || "none"}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. Owner roots, extension roots, protected concepts, and docs apps scanned should not shrink silently.",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    baselineRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | --- | --- |",
    baselineMismatchRows || "| None | None | None |",
    "",
    "## Checks",
    "",
    checks,
    "",
    "## Root Registry Alignment",
    "",
    "| Component | React component | Missing owner root |",
    "| --- | --- | --- |",
    missingOwnerRows || "| None | None | None |",
    "",
    "## Extension Roots",
    "",
    "| Root |",
    "| --- |",
    extensionRootRows || "| None |",
    "",
    "## Blocked Concept Rules",
    "",
    "| Concept | Blocked class names |",
    "| --- | --- |",
    concepts,
    "",
    "## Live Duplicate Concept Violations",
    "",
    "| Concept | Class | Source |",
    "| --- | --- | --- |",
    liveViolationRows || "| None | None | None |",
    "",
  ].join("\n");
}

function main() {
  checkAntiDuplicationGovernance();
  const coverage = antiDuplicationCoverage();
  const actualInventory = {
    checks: coverage.checks.length,
    componentClassRoots: coverage.componentClassRoots.length,
    acceptedComponents: coverage.rootRegistry.acceptedComponents,
    ownerRoots: coverage.rootRegistry.ownerRoots,
    missingOwnerRoots: coverage.rootRegistry.missingOwnerRoots.length,
    extensionRoots: coverage.rootRegistry.extensionRoots.length,
    protectedComponentRoots: coverage.protectedComponentRoots.length,
    blockedConceptRules: coverage.blockedConceptRules.length,
    liveDuplicateConceptViolations: coverage.liveDuplicateConceptViolations.length,
    docsApps: coverage.docsApps.length,
  };
  const baselineMismatches = [
    ...Object.entries(expectedInventory)
      .filter(([key, expected]) => actualInventory[key] !== expected)
      .map(([key, expected]) => ({
        key,
        expected,
        actual: actualInventory[key],
      })),
    ...(!sameStrings(coverage.rootRegistry.extensionRoots, expectedExtensionRoots)
      ? [{
        key: "extensionRoots",
        expected: expectedExtensionRoots,
        actual: coverage.rootRegistry.extensionRoots,
      }]
      : []),
    ...blockedConceptRuleMismatches(coverage.blockedConceptRules),
  ];
  const report = {
    status: result.errors.length || baselineMismatches.length ? "fail" : "pass",
    errors: result.errors,
    baseline: {
      inventory: expectedInventory,
      actual: actualInventory,
      extensionRoots: expectedExtensionRoots,
      blockedConceptRules: expectedBlockedConceptRules,
      mismatches: baselineMismatches,
    },
    ...coverage,
  };
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = renderMarkdown(report);

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Anti-duplication coverage report is stale. Run: node packages/audit/scripts/report-anti-duplication-coverage.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    checks: report.checks.length,
    componentClassRoots: report.componentClassRoots.length,
    acceptedComponents: report.rootRegistry.acceptedComponents,
    ownerRoots: report.rootRegistry.ownerRoots,
    missingOwnerRoots: report.rootRegistry.missingOwnerRoots.length,
    extensionRoots: report.rootRegistry.extensionRoots.length,
    protectedComponentRoots: report.protectedComponentRoots.length,
    blockedConceptRules: report.blockedConceptRules.length,
    liveDuplicateConceptViolations: report.liveDuplicateConceptViolations.length,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
