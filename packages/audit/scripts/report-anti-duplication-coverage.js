#!/usr/bin/env node

const crypto = require("crypto");
const { fs, path, readJson, root } = require("./audit-context.js");
const { antiDuplicationCoverage, checkAntiDuplicationGovernance } = require("./audit-anti-duplication.js");
const { result } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const governanceFile = path.join(root, "packages/content/content/anti-duplication-concepts.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "anti-duplication-coverage.json");
const markdownOutput = path.join(outputDir, "anti-duplication-coverage.md");

const governance = readJson(governanceFile) ?? {};
const expectedInventory = governance.expectedInventory && typeof governance.expectedInventory === "object"
  ? governance.expectedInventory
  : {};

function antiDuplicationPolicyIssues() {
  const issues = [];
  if (!governance.expectedInventory || typeof governance.expectedInventory !== "object") {
    issues.push("expectedInventory must be an object");
  }
  for (const [key, expected] of Object.entries(expectedInventory)) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key)) {
      issues.push(`invalid expectedInventory key: ${key}`);
    }
    if (!(Number.isInteger(expected) && expected >= 0) && typeof expected !== "string") {
      issues.push(`invalid expectedInventory value: ${key}`);
    }
  }
  return issues;
}

function blockedConceptClassNameCount(blockedConceptRules) {
  return blockedConceptRules.reduce((sum, rule) => sum + rule.classNames.length, 0);
}

function blockedConceptContractFingerprint(blockedConceptRules) {
  const canonical = JSON.stringify(blockedConceptRules
    .map((rule) => ({
      concept: rule.concept,
      classNames: [...rule.classNames].sort(),
      message: rule.message,
    }))
    .sort((a, b) => a.concept.localeCompare(b.concept)));
  return crypto.createHash("sha256").update(canonical).digest("hex");
}

function classRootPolicyFingerprint(policy) {
  const canonical = JSON.stringify({
    extensionRoots: [...policy.extensionRoots].sort(),
    protectedComponentRoots: [...policy.protectedComponentRoots].sort(),
    reason: policy.reason,
  });
  return crypto.createHash("sha256").update(canonical).digest("hex");
}

function docsAllowedPackageClassTokenFingerprint(entries) {
  const canonical = JSON.stringify(entries
    .map((entry) => ({
      file: entry.file,
      tokens: [...entry.tokens].sort(),
      reason: entry.reason,
    }))
    .sort((a, b) => a.file.localeCompare(b.file)));
  return crypto.createHash("sha256").update(canonical).digest("hex");
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
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`)
    .join("\n");
  return [
    "# Anti-Duplication Coverage",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    `- Component class roots protected: ${report.componentClassRoots.length}`,
    `- Accepted components with owner roots: ${report.rootRegistry.ownerRoots}/${report.rootRegistry.acceptedComponents}`,
    `- Missing owner roots: ${report.rootRegistry.missingOwnerRoots.length}`,
    `- Extension class roots: ${report.rootRegistry.extensionRoots.length}`,
    `- Protected high-risk roots: ${report.protectedComponentRoots.join(", ")}`,
    `- Class root policy fingerprint: ${report.inventory.classRootPolicyFingerprint}`,
    `- Blocked concept rules: ${report.blockedConceptRules.length}`,
    `- Blocked concept class names: ${report.inventory.blockedConceptClassNames}`,
    `- Blocked concept contract fingerprint: ${report.inventory.blockedConceptContractFingerprint}`,
    `- Live duplicate concept violations: ${report.liveDuplicateConceptViolations.length}`,
    `- Docs apps scanned: ${report.docsApps.join(", ") || "none"}`,
    `- Docs component author file exemptions: ${report.docsAllowedComponentAuthors.length}`,
    `- Docs exact package class token allowlists: ${report.docsAllowedPackageClassTokens.length}`,
    `- Docs package class token allowlist fingerprint: ${report.inventory.docsAllowedPackageClassTokenFingerprint}`,
    `- Anti-duplication debt: ${report.inventory.antiDuplicationDebt}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    `- Unexpected inventory metrics: ${report.baseline.unexpectedInventoryMetrics.length}`,
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
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    unexpectedMetricRows || "| None | None |",
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
  const policyIssues = antiDuplicationPolicyIssues();
  const actualInventory = {
    checks: coverage.checks.length,
    componentClassRoots: coverage.componentClassRoots.length,
    acceptedComponents: coverage.rootRegistry.acceptedComponents,
    ownerRoots: coverage.rootRegistry.ownerRoots,
    missingOwnerRoots: coverage.rootRegistry.missingOwnerRoots.length,
    extensionRoots: coverage.rootRegistry.extensionRoots.length,
    protectedComponentRoots: coverage.protectedComponentRoots.length,
    classRootPolicyFingerprint: classRootPolicyFingerprint(coverage.classRootPolicy),
    blockedConceptRules: coverage.blockedConceptRules.length,
    blockedConceptClassNames: blockedConceptClassNameCount(coverage.blockedConceptRules),
    blockedConceptContractFingerprint: blockedConceptContractFingerprint(coverage.blockedConceptRules),
    liveDuplicateConceptViolations: coverage.liveDuplicateConceptViolations.length,
    docsApps: coverage.docsApps.length,
    docsAllowedComponentAuthors: coverage.docsAllowedComponentAuthors.length,
    docsAllowedPackageClassTokenFiles: coverage.docsAllowedPackageClassTokens.length,
    docsAllowedPackageClassTokenFingerprint: docsAllowedPackageClassTokenFingerprint(coverage.docsAllowedPackageClassTokens),
    antiDuplicationPolicyIssues: policyIssues.length,
    antiDuplicationDebt: 0,
  };
  const baselineMismatches = [
    ...Object.entries(expectedInventory)
      .filter(([key, expected]) => actualInventory[key] !== expected)
      .map(([key, expected]) => ({
        key,
        expected,
        actual: actualInventory[key],
      })),
  ];
  const unexpectedInventoryMetrics = Object.keys(actualInventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: actualInventory[key] }));
  actualInventory.antiDuplicationDebt = result.errors.length
    + actualInventory.missingOwnerRoots
    + actualInventory.liveDuplicateConceptViolations
    + actualInventory.antiDuplicationPolicyIssues
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length;
  const report = {
    status: actualInventory.antiDuplicationDebt ? "fail" : "pass",
    errors: result.errors,
    inventory: actualInventory,
    principle: "Flow must have one visual owner per component concept; owner roots, protected roots, duplicate concept rules, and docs scans cannot drift silently. The actionable debt metric is antiDuplicationDebt.",
    governance: {
      file: path.relative(root, governanceFile),
      issues: policyIssues,
    },
    baseline: {
      inventory: expectedInventory,
      actual: actualInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
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
    classRootPolicyFingerprint: report.inventory.classRootPolicyFingerprint,
    blockedConceptRules: report.blockedConceptRules.length,
    blockedConceptClassNames: report.inventory.blockedConceptClassNames,
    blockedConceptContractFingerprint: report.inventory.blockedConceptContractFingerprint,
    liveDuplicateConceptViolations: report.liveDuplicateConceptViolations.length,
    docsAllowedComponentAuthors: report.docsAllowedComponentAuthors.length,
    docsAllowedPackageClassTokenFiles: report.docsAllowedPackageClassTokens.length,
    docsAllowedPackageClassTokenFingerprint: report.inventory.docsAllowedPackageClassTokenFingerprint,
    antiDuplicationDebt: report.inventory.antiDuplicationDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
