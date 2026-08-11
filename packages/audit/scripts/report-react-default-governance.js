#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { governedReactPrimitiveIds } = require("./audit-react-primary-inventory.js");
const {
  contractBodyFor,
  lowerFirst,
  reactAllowedValues,
  unionValues,
} = require("./react-contract-shared.js");
const {
  defaultGovernanceRulesPolicy,
  reactSecondaryExpectedInventory,
  semanticDefaultExpectedByRulePolicy,
} = require("./react-primary-governance-policy.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-default-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-default-governance-audit.md");

function sourceFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .filter((file) => !governedReactPrimitiveIds.has(kebab(path.basename(file, ".js"))))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function kebab(value) {
  return String(value).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function lineMatches(file, rules) {
  const source = read(file);
  return source.split("\n").flatMap((line, index) => rules
    .map((rule) => ({ rule, match: line.match(rule.pattern) }))
    .filter(({ match }) => match)
    .map(({ rule, match }) => ({
      component: path.basename(file, ".js"),
      file: rel(file),
      line: index + 1,
      rule: rule.id,
      prop: rule.prop,
      value: match[1],
      description: rule.description,
      text: line.trim(),
    })));
}

function contractPropTypeExpression(contractsSource, component, propName) {
  const contractBody = contractBodyFor(contractsSource, lowerFirst(component));
  const escapedProp = propName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return contractBody.match(new RegExp(`\\{ name: "${escapedProp}", type: "((?:\\\\.|[^"])*)", required: (?:true|false) \\}`))?.[1] ?? "";
}

function contractNamedValues(contractsSource, component, propName) {
  const contractBody = contractBodyFor(contractsSource, lowerFirst(component));
  const fieldByProp = {
    intent: "intents",
    status: "statuses",
    state: "states",
    tone: "intents",
    variant: "variants",
  };
  const field = fieldByProp[propName];
  if (!field) return [];
  const valuesExpression = contractBody.match(new RegExp(`\\b${field}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "";
  return unionValues(valuesExpression);
}

function publicPropAllowedValues(component, propName) {
  const typesFile = path.join(reactSrcDir, `${component}.d.ts`);
  if (!fs.existsSync(typesFile)) return [];
  return reactAllowedValues(read(typesFile), component, propName);
}

function contractAllowedValues(contractsSource, component, propName) {
  const propValues = unionValues(contractPropTypeExpression(contractsSource, component, propName));
  return propValues.length ? propValues : contractNamedValues(contractsSource, component, propName);
}

function semanticContractEvidence(semanticDefaults, contractsSource) {
  return semanticDefaults.map((match) => {
    const publicAllowedValues = publicPropAllowedValues(match.component, match.prop);
    const contractAllowedValuesForProp = contractAllowedValues(contractsSource, match.component, match.prop);
    const publicContractStatus = publicAllowedValues.includes(match.value) ? "pass" : "fail";
    const systemContractStatus = contractAllowedValuesForProp.includes(match.value) ? "pass" : "fail";
    return {
      ...match,
      publicAllowedValues,
      contractAllowedValues: contractAllowedValuesForProp,
      publicContractStatus,
      systemContractStatus,
      contractBacked: publicContractStatus === "pass" && systemContractStatus === "pass",
      status: publicContractStatus === "pass" && systemContractStatus === "pass" ? "pass" : "fail",
    };
  });
}

function createReport() {
  const { expectedInventory, governance } = reactSecondaryExpectedInventory("defaults");
  const semanticByRulePolicy = semanticDefaultExpectedByRulePolicy();
  const defaultRulesPolicy = defaultGovernanceRulesPolicy();
  const { prohibitedRules, semanticRules } = defaultRulesPolicy;
  const expectedSemanticByRule = semanticByRulePolicy.expectedSemanticByRule;
  const files = sourceFiles();
  const contractsSource = fs.existsSync(contractsFile) ? read(contractsFile) : "";
  const prohibitedDefaults = files.flatMap((file) => lineMatches(file, prohibitedRules));
  const semanticDefaults = files.flatMap((file) => lineMatches(file, semanticRules));
  const semanticDefaultContractEvidence = semanticContractEvidence(semanticDefaults, contractsSource);
  const semanticDefaultContractGaps = semanticDefaultContractEvidence.filter((match) => match.status === "fail");
  const contractBackedSemanticDefaults = semanticDefaultContractEvidence.filter((match) => match.contractBacked).length;
  const unbackedSemanticDefaults = semanticDefaultContractEvidence.length - contractBackedSemanticDefaults;
  const defaultDebt = prohibitedDefaults.length + unbackedSemanticDefaults + semanticDefaultContractGaps.length;
  const semanticByRule = semanticRules.map((rule) => ({
    rule: rule.id,
    description: rule.description,
    count: semanticDefaults.filter((match) => match.rule === rule.id).length,
    contractBacked: semanticDefaultContractEvidence.filter((match) => match.rule === rule.id && match.contractBacked).length,
    unbacked: semanticDefaultContractEvidence.filter((match) => match.rule === rule.id && !match.contractBacked).length,
  }));
  const inventory = {
    components: files.length,
    defaultDebt,
    prohibitedDefaults: prohibitedDefaults.length,
    semanticDefaultDecisions: semanticDefaults.length,
    contractBackedSemanticDefaultDecisions: contractBackedSemanticDefaults,
    unbackedSemanticDefaultDecisions: unbackedSemanticDefaults,
    semanticDefaultDecisionContractGaps: semanticDefaultContractGaps.length,
    reactGovernancePolicyIssues: governance.issues.length
      + semanticByRulePolicy.governance.issues.length
      + defaultRulesPolicy.governance.issues.length,
    semanticByRule,
  };
  inventory.defaultDebt += inventory.reactGovernancePolicyIssues;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  const semanticRuleBaselineMismatches = semanticByRule
    .filter((item) => item.count !== expectedSemanticByRule[item.rule])
    .map((item) => ({
      rule: item.rule,
      expected: expectedSemanticByRule[item.rule],
      actual: item.count,
    }));
  return {
    status: inventory.defaultDebt || baselineMismatches.length || semanticRuleBaselineMismatches.length ? "fail" : "pass",
    audit: "react default governance",
    principle: "Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic default decisions may exist only when visible and contract-backed. The actionable debt metric is defaultDebt.",
    baseline: {
      inventory: expectedInventory,
      semanticByRule: expectedSemanticByRule,
      mismatches: baselineMismatches,
      semanticRuleMismatches: semanticRuleBaselineMismatches,
    },
    governance: {
      ...governance,
      semanticByRulePolicy,
      defaultRulesPolicy,
    },
    inventory,
    prohibitedDefaults,
    semanticDefaults,
    semanticDefaultContractEvidence,
    semanticDefaultContractGaps,
  };
}

function toMarkdown(report) {
  const prohibitedRows = report.prohibitedDefaults.map((match) => `| ${match.component} | ${match.rule} | ${match.file}:${match.line} | \`${match.text.replaceAll("|", "\\|")}\` |`);
  const semanticRows = report.semanticDefaults.map((match) => `| ${match.component} | ${match.rule} | ${match.prop} | ${match.value} | ${match.file}:${match.line} | \`${match.text.replaceAll("|", "\\|")}\` |`);
  const semanticEvidenceRows = report.semanticDefaultContractEvidence.map((match) => `| ${match.component} | ${match.rule} | ${match.prop} | ${match.value} | ${match.publicContractStatus} | ${match.systemContractStatus} | ${match.contractBacked ? "Yes" : "No"} | ${match.file}:${match.line} |`);
  const semanticGapRows = report.semanticDefaultContractGaps.map((match) => `| ${match.component} | ${match.prop} | ${match.value} | ${match.publicAllowedValues.join(", ") || "None"} | ${match.contractAllowedValues.join(", ") || "None"} | ${match.file}:${match.line} |`);
  const semanticSummaryRows = report.inventory.semanticByRule.map((item) => `| ${item.rule} | ${item.count} | ${item.contractBacked} | ${item.unbacked} | ${item.description} |`);
  const baselineRows = Object.entries(report.baseline.inventory).map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const baselineMismatchRows = report.baseline.mismatches.map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const semanticRuleBaselineRows = report.inventory.semanticByRule.map((item) => `| ${item.rule} | ${report.baseline.semanticByRule[item.rule]} | ${item.count} |`);
  const semanticRuleMismatchRows = report.baseline.semanticRuleMismatches.map((item) => `| ${item.rule} | ${item.expected} | ${item.actual} |`);
  return [
    "# React Default Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Default debt: ${report.inventory.defaultDebt}`,
    `- Prohibited platform defaults: ${report.inventory.prohibitedDefaults}`,
    `- Visible semantic default decisions: ${report.inventory.semanticDefaultDecisions}`,
    `- Contract-backed semantic default decisions: ${report.inventory.contractBackedSemanticDefaultDecisions}`,
    `- Unbacked semantic default decisions: ${report.inventory.unbackedSemanticDefaultDecisions}`,
    `- Semantic default decision contract gaps: ${report.inventory.semanticDefaultDecisionContractGaps}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    `- Rule baseline mismatches: ${report.baseline.semanticRuleMismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. defaultDebt must stay at 0; semantic decision counts may change only when the new defaults are intentionally reviewed and contract-backed.",
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
    "## Rule Baseline Budget",
    "",
    "| Rule | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...semanticRuleBaselineRows,
    "",
    "## Rule Baseline Mismatches",
    "",
    "| Rule | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(semanticRuleMismatchRows.length ? semanticRuleMismatchRows : ["| None | None | None |"]),
    "",
    "## Semantic Default Decision Summary",
    "",
    "| Rule | Count | Contract-backed | Unbacked | Meaning |",
    "| --- | ---: | ---: | ---: | --- |",
    ...semanticSummaryRows,
    "",
    "## Prohibited Defaults",
    "",
    "| Component | Rule | Location | Source |",
    "| --- | --- | --- | --- |",
    ...(prohibitedRows.length ? prohibitedRows : ["| None | None | None | None |"]),
    "",
    "## Semantic Default Decision Contract Gaps",
    "",
    "| Component | Prop | Default value | React type values | System contract values | Location |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(semanticGapRows.length ? semanticGapRows : ["| None | None | None | None | None | None |"]),
    "",
    "## Semantic Default Decision Contract Evidence",
    "",
    "| Component | Rule | Prop | Default value | React type | System contract | Contract-backed | Location |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...semanticEvidenceRows,
    "",
    "## Visible Semantic Default Decisions",
    "",
    "| Component | Rule | Prop | Default value | Location | Source |",
    "| --- | --- | --- | --- | --- | --- |",
    ...semanticRows,
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
      console.error("React default governance report is stale. Run: node packages/audit/scripts/report-react-default-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    prohibitedDefaults: report.inventory.prohibitedDefaults,
    defaultDebt: report.inventory.defaultDebt,
    semanticDefaultDecisions: report.inventory.semanticDefaultDecisions,
    contractBackedSemanticDefaultDecisions: report.inventory.contractBackedSemanticDefaultDecisions,
    unbackedSemanticDefaultDecisions: report.inventory.unbackedSemanticDefaultDecisions,
    semanticDefaultDecisionContractGaps: report.inventory.semanticDefaultDecisionContractGaps,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
