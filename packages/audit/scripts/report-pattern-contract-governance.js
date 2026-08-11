#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { readPatternContractGovernance } = require("./pattern-contract-governance.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "pattern-contract-governance-audit.json");
const markdownOutput = path.join(outputDir, "pattern-contract-governance-audit.md");
const contractsDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const docsDirs = [
  path.join(root, "apps/docs"),
  path.join(root, "../FlowDocs/apps/docs"),
];
const docsFile = (fileName) => docsDirs.map((dir) => path.join(dir, fileName)).find((file) => fs.existsSync(file)) ?? path.join(docsDirs[0], fileName);
const patternTabsFile = docsFile("pattern-contract-tabs.js");
const candidatePatternDemosFile = docsFile("pattern-candidate-demos.js");
const mobilePatternDemosFile = docsFile("pattern-mobile-demos.js");
const patternSearchSlotFile = docsFile("search-slot.js");
const notificationPanelSlotFile = docsFile("notification-panel-slot.js");
const avatarMenuSlotFile = docsFile("avatar-menu-slot.js");

function markdownContractFiles() {
  if (!fs.existsSync(contractsDir)) return [];
  return fs.readdirSync(contractsDir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => path.join(contractsDir, file));
}

function demoSource() {
  return [patternTabsFile, candidatePatternDemosFile, mobilePatternDemosFile]
    .filter((file) => fs.existsSync(file))
    .map((file) => read(file))
    .join("\n");
}

function composedByDemo({ id, component, block }) {
  if (block.includes(`packageDemo("${component}"`)) return true;
  if (component === "input"
    && block.includes("searchSlotMarkup(")
    && fs.existsSync(patternSearchSlotFile)
    && read(patternSearchSlotFile).includes('patternPackageDemo("input"')) return true;
  if (id === "notification-panel"
    && block.includes("notificationPanelMarkup(")
    && fs.existsSync(notificationPanelSlotFile)
    && read(notificationPanelSlotFile).includes(`patternPackageDemo("${component}"`)) return true;
  if (id === "avatar-menu"
    && block.includes("avatarMenuMarkup(")
    && fs.existsSync(avatarMenuSlotFile)) {
    const avatarMenuSource = read(avatarMenuSlotFile);
    return (component === "menu" && avatarMenuSource.includes('patternPackageDemo("menu"'))
      || (component === "avatar" && avatarMenuSource.includes('variant: "avatar-trigger"'));
  }
  return false;
}

function createReport() {
  const governance = readPatternContractGovernance();
  const contractFileIds = new Set(markdownContractFiles().map((file) => path.basename(file, ".md")));
  const contractRows = markdownContractFiles().map((file) => {
    const markdown = read(file);
    const missingSections = governance.requiredMarkdownSections
      .filter((section) => !markdown.includes(section));
    return {
      pattern: path.basename(file, ".md"),
      file: rel(file),
      missingSections,
    };
  });
  const source = demoSource();
  const demoRows = Object.entries(governance.requiredDemos).map(([id, contract]) => {
    const start = source.indexOf(`function ${contract.fn}()`);
    const nextFunction = start === -1 ? -1 : source.indexOf("\nfunction ", start + 1);
    const block = start === -1 ? "" : source.slice(start, nextFunction === -1 ? source.length : nextFunction);
    const missingComponents = start === -1
      ? contract.components
      : contract.components.filter((component) => !composedByDemo({ id, component, block }));
    return {
      pattern: id,
      function: contract.fn,
      present: start !== -1,
      requiredComponents: contract.components,
      missingComponents,
    };
  });
  const requiredContractGaps = governance.requiredPatternContracts
    .filter((id) => !contractFileIds.has(id));
  const demoIds = new Set(Object.keys(governance.requiredDemos));
  const demoExemptionIds = new Set(Object.keys(governance.requiredDemoExemptions));
  const requiredDemoPolicyGaps = governance.requiredPatternContracts
    .filter((id) => !demoIds.has(id) && !demoExemptionIds.has(id));
  const unusedRequiredDemoExemptions = Object.keys(governance.requiredDemoExemptions)
    .filter((id) => !governance.requiredPatternContracts.includes(id) || demoIds.has(id));
  const inventory = {
    patternContractGovernanceIssues: governance.issues.length,
    requiredPatternContracts: governance.requiredPatternContracts.length,
    requiredPatternContractGaps: requiredContractGaps.length,
    requiredMarkdownSections: governance.requiredMarkdownSections.length,
    readinessExpectedInventoryMetrics: Object.keys(governance.readinessExpectedInventory).length,
    requiredDemos: Object.keys(governance.requiredDemos).length,
    requiredDemoExemptions: Object.keys(governance.requiredDemoExemptions).length,
    demoSharedHelperPolicy: governance.demoCompositionPolicy.sharedHelperNames.length,
    demoLocalControlRulePolicy: governance.demoCompositionPolicy.localControlRules.length,
    demoSpecificRulePolicy: governance.demoCompositionPolicy.specificRules.length,
    demoLocalControlPatternCoverage: new Set(governance.demoCompositionPolicy.localControlRules.flatMap((rule) => rule.ids)).size,
    requiredDemoPolicyGaps: requiredDemoPolicyGaps.length,
    unusedRequiredDemoExemptions: unusedRequiredDemoExemptions.length,
    requiredDemoComponentAssertions: demoRows.reduce((total, row) => total + row.requiredComponents.length, 0),
    markdownContractsScanned: contractRows.length,
    contractsMissingRequiredSections: contractRows.filter((row) => row.missingSections.length).length,
    missingRequiredSectionEntries: contractRows.reduce((total, row) => total + row.missingSections.length, 0),
    missingRequiredDemoFunctions: demoRows.filter((row) => !row.present).length,
    missingRequiredDemoComponentAssertions: demoRows.reduce((total, row) => total + row.missingComponents.length, 0),
  };
  const expectedInventory = governance.contractGovernanceExpectedInventory;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "patternContractGovernanceDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  inventory.patternContractGovernanceDebt = inventory.patternContractGovernanceIssues
    + inventory.requiredPatternContractGaps
    + inventory.requiredDemoPolicyGaps
    + inventory.unusedRequiredDemoExemptions
    + inventory.missingRequiredSectionEntries
    + inventory.missingRequiredDemoFunctions
    + inventory.missingRequiredDemoComponentAssertions
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length;
  return {
    status: inventory.patternContractGovernanceDebt ? "fail" : "pass",
    audit: "pattern contract governance",
    principle: "Pattern contracts and demos must be governed as portable Flow evidence: markdown carries the formal contract, and demos compose package-backed Flow components instead of local visuals.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    contractPolicyIssues: governance.issues,
    requiredPatternContractGaps: requiredContractGaps,
    requiredDemoPolicyGaps,
    requiredDemoExemptions: governance.requiredDemoExemptions,
    demoCompositionPolicy: governance.demoCompositionPolicy,
    unusedRequiredDemoExemptions,
    contractsMissingRequiredSections: contractRows.filter((row) => row.missingSections.length),
    demoRows,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.inventory).map(([key, value]) => `| ${key} | ${value} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const sectionRows = report.contractsMissingRequiredSections
    .map((row) => `| ${row.pattern} | ${row.file} | ${row.missingSections.join("<br>")} |`);
  const demoRows = report.demoRows
    .filter((row) => !row.present || row.missingComponents.length)
    .map((row) => `| ${row.pattern} | ${row.function} | ${row.present ? "yes" : "no"} | ${row.missingComponents.join(", ") || "None"} |`);
  const demoPolicyGapRows = report.requiredDemoPolicyGaps.map((id) => `| ${id} |`);
  const demoExemptionRows = Object.entries(report.requiredDemoExemptions)
    .map(([id, reason]) => `| ${id} | ${reason} |`);
  const unusedDemoExemptionRows = report.unusedRequiredDemoExemptions.map((id) => `| ${id} |`);
  const localControlRuleRows = report.demoCompositionPolicy.localControlRules
    .map((rule) => `| ${rule.ids.join(", ")} | ${rule.file} | ${rule.tags.join(", ")} | ${rule.message} |`);
  const specificRuleRows = report.demoCompositionPolicy.specificRules
    .map((rule) => `| ${rule.id} | ${rule.file} | \`${rule.pattern}\` | ${rule.message} |`);
  return [
    "# Pattern Contract Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    ...inventoryRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(mismatchRows.length ? mismatchRows : ["| None | None | None |"]),
    "",
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None |"]),
    "",
    "## Required Pattern Contract Gaps",
    "",
    "| Pattern |",
    "| --- |",
    ...(report.requiredPatternContractGaps.length ? report.requiredPatternContractGaps.map((id) => `| ${id} |`) : ["| None |"]),
    "",
    "## Required Demo Policy Gaps",
    "",
    "| Pattern |",
    "| --- |",
    ...(demoPolicyGapRows.length ? demoPolicyGapRows : ["| None |"]),
    "",
    "## Required Demo Exemptions",
    "",
    "| Pattern | Reason |",
    "| --- | --- |",
    ...(demoExemptionRows.length ? demoExemptionRows : ["| None | None |"]),
    "",
    "## Unused Demo Exemptions",
    "",
    "| Pattern |",
    "| --- |",
    ...(unusedDemoExemptionRows.length ? unusedDemoExemptionRows : ["| None |"]),
    "",
    "## Demo Composition Policy",
    "",
    `Shared helpers: ${report.demoCompositionPolicy.sharedHelperNames.join(", ") || "None"}`,
    "",
    "| Pattern ids | File group | Forbidden local tags | Message |",
    "| --- | --- | --- | --- |",
    ...(localControlRuleRows.length ? localControlRuleRows : ["| None | None | None | None |"]),
    "",
    "| Pattern | File group | Guard pattern | Message |",
    "| --- | --- | --- | --- |",
    ...(specificRuleRows.length ? specificRuleRows : ["| None | None | None | None |"]),
    "",
    "## Contract Section Gaps",
    "",
    "| Pattern | File | Missing sections |",
    "| --- | --- | --- |",
    ...(sectionRows.length ? sectionRows : ["| None | None | None |"]),
    "",
    "## Demo Composition Gaps",
    "",
    "| Pattern | Function | Present | Missing package components |",
    "| --- | --- | --- | --- |",
    ...(demoRows.length ? demoRows : ["| None | None | None | None |"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== json || currentMarkdown !== markdown) {
      throw new Error("Pattern contract governance report is stale. Run: node packages/audit/scripts/report-pattern-contract-governance.js");
    }
  } else {
    fs.writeFileSync(jsonOutput, json);
    fs.writeFileSync(markdownOutput, markdown);
  }
}

try {
  const report = createReport();
  writeReport(report);
  console.log(JSON.stringify({
    status: report.status,
    requiredDemos: report.inventory.requiredDemos,
    requiredDemoComponentAssertions: report.inventory.requiredDemoComponentAssertions,
    patternContractGovernanceDebt: report.inventory.patternContractGovernanceDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
