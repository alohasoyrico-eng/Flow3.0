#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const {
  contractBodyFor,
  lowerFirst,
  reactAllowedValues,
  unionValues,
} = require("./react-contract-shared.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-default-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-default-governance-audit.md");

const expectedInventory = {
  components: 56,
  prohibitedDefaults: 0,
  semanticDefaults: 112,
  contractBackedSemanticDefaults: 112,
  unbackedSemanticDefaults: 0,
  semanticDefaultContractGaps: 0,
};

const expectedSemanticByRule = {
  "state-default": 43,
  "variant-default": 40,
  "tone-default": 14,
  "intent-default": 2,
  "status-default": 1,
  "placement-default": 2,
  "side-default": 1,
  "align-default": 2,
  "orientation-default": 1,
  "trend-default": 2,
  "composition-default": 1,
  "avatar-status-default": 1,
  "category-default": 1,
  "sort-direction-default": 1,
};

const prohibitedRules = [
  {
    id: "density-prop-default",
    description: "React components must not default density to sm/md/lg; density must cascade through normalizeFlowDensity.",
    pattern: /\bdensity\s*=\s*["'](?:sm|md|lg)["']/,
  },
  {
    id: "density-normalizer-literal",
    description: "React components must not normalize a hardcoded density literal.",
    pattern: /\bnormalizeFlowDensity\(\s*["'](?:sm|md|lg)["']/,
  },
  {
    id: "density-props-literal",
    description: "React components must not emit flowDensityProps from a hardcoded density literal.",
    pattern: /\bflowDensityProps\(\s*["'](?:sm|md|lg)["']/,
  },
  {
    id: "size-prop-default",
    description: "React components must not reintroduce size as a parallel density API.",
    pattern: /\b(?:size|componentSize)\s*=\s*["'](?:xs|sm|md|lg|xl|small|medium|large)["']/,
  },
  {
    id: "theme-prop-default",
    description: "React components must not default theme/colorScheme; theme must come from the system cascade.",
    pattern: /\b(?:theme|colorScheme)\s*=\s*["'](?:light|dark|system)["']/,
  },
  {
    id: "theme-data-literal",
    description: "React components must not set data-theme to a hardcoded light/dark value.",
    pattern: /["']data-theme["']\s*:\s*["'](?:light|dark)["']/,
  },
];

const semanticRules = [
  {
    id: "state-default",
    prop: "state",
    description: "Component behavior default; allowed when normalized through component state.",
    pattern: /\bstate\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "variant-default",
    prop: "variant",
    description: "Component composition default; allowed when constrained by the component contract.",
    pattern: /\bvariant\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "tone-default",
    prop: "tone",
    description: "Component tone fallback; allowed when constrained by the component contract.",
    pattern: /\btone\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "intent-default",
    prop: "intent",
    description: "Action intent fallback; allowed when constrained by the component contract.",
    pattern: /\bintent\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "status-default",
    prop: "status",
    description: "Component status fallback; allowed when constrained by the component contract.",
    pattern: /\bstatus\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "placement-default",
    prop: "placement",
    description: "Overlay placement fallback; allowed when constrained by the component contract.",
    pattern: /\bplacement\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "side-default",
    prop: "side",
    description: "Surface side fallback; allowed when constrained by the component contract.",
    pattern: /\bside\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "align-default",
    prop: "align",
    description: "Alignment fallback; allowed when constrained by the component contract.",
    pattern: /\balign\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "orientation-default",
    prop: "orientation",
    description: "Layout orientation fallback; allowed when constrained by the component contract.",
    pattern: /\borientation\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "trend-default",
    prop: "trend",
    description: "Trend fallback; allowed when constrained by the component contract.",
    pattern: /\btrend\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "composition-default",
    prop: "composition",
    description: "Composition fallback; allowed when constrained by the component contract.",
    pattern: /\bcomposition\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "avatar-status-default",
    prop: "avatarStatus",
    description: "Avatar status fallback; allowed when constrained by the component contract.",
    pattern: /\bavatarStatus\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "category-default",
    prop: "category",
    description: "Category fallback; allowed when constrained by the component contract.",
    pattern: /\bcategory\s*=\s*["']([^"']+)["']/,
  },
  {
    id: "sort-direction-default",
    prop: "sortDir",
    description: "Sort direction fallback; allowed when constrained by the component contract.",
    pattern: /\bsortDir\s*=\s*["']([^"']+)["']/,
  },
];

function sourceFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
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
  const files = sourceFiles();
  const contractsSource = fs.existsSync(contractsFile) ? read(contractsFile) : "";
  const prohibitedDefaults = files.flatMap((file) => lineMatches(file, prohibitedRules));
  const semanticDefaults = files.flatMap((file) => lineMatches(file, semanticRules));
  const semanticDefaultContractEvidence = semanticContractEvidence(semanticDefaults, contractsSource);
  const semanticDefaultContractGaps = semanticDefaultContractEvidence.filter((match) => match.status === "fail");
  const contractBackedSemanticDefaults = semanticDefaultContractEvidence.filter((match) => match.contractBacked).length;
  const unbackedSemanticDefaults = semanticDefaultContractEvidence.length - contractBackedSemanticDefaults;
  const semanticByRule = semanticRules.map((rule) => ({
    rule: rule.id,
    description: rule.description,
    count: semanticDefaults.filter((match) => match.rule === rule.id).length,
    contractBacked: semanticDefaultContractEvidence.filter((match) => match.rule === rule.id && match.contractBacked).length,
    unbacked: semanticDefaultContractEvidence.filter((match) => match.rule === rule.id && !match.contractBacked).length,
  }));
  const inventory = {
    components: files.length,
    prohibitedDefaults: prohibitedDefaults.length,
    semanticDefaults: semanticDefaults.length,
    contractBackedSemanticDefaults,
    unbackedSemanticDefaults,
    semanticDefaultContractGaps: semanticDefaultContractGaps.length,
    semanticByRule,
  };
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
    status: prohibitedDefaults.length || semanticDefaultContractGaps.length || baselineMismatches.length || semanticRuleBaselineMismatches.length ? "fail" : "pass",
    audit: "react default governance",
    principle: "Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic defaults may exist only as visible contract decisions.",
    baseline: {
      inventory: expectedInventory,
      semanticByRule: expectedSemanticByRule,
      mismatches: baselineMismatches,
      semanticRuleMismatches: semanticRuleBaselineMismatches,
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
    `- Prohibited platform defaults: ${report.inventory.prohibitedDefaults}`,
    `- Visible semantic defaults: ${report.inventory.semanticDefaults}`,
    `- Contract-backed semantic defaults: ${report.inventory.contractBackedSemanticDefaults}`,
    `- Unbacked semantic defaults: ${report.inventory.unbackedSemanticDefaults}`,
    `- Semantic default contract gaps: ${report.inventory.semanticDefaultContractGaps}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    `- Rule baseline mismatches: ${report.baseline.semanticRuleMismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. Update the baseline only when the new defaults are intentionally reviewed and contract-backed.",
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
    "## Semantic Default Summary",
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
    "## Semantic Default Contract Gaps",
    "",
    "| Component | Prop | Default value | React type values | System contract values | Location |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(semanticGapRows.length ? semanticGapRows : ["| None | None | None | None | None | None |"]),
    "",
    "## Semantic Default Contract Evidence",
    "",
    "| Component | Rule | Prop | Default value | React type | System contract | Contract-backed | Location |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...semanticEvidenceRows,
    "",
    "## Visible Semantic Defaults",
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
    semanticDefaults: report.inventory.semanticDefaults,
    contractBackedSemanticDefaults: report.inventory.contractBackedSemanticDefaults,
    unbackedSemanticDefaults: report.inventory.unbackedSemanticDefaults,
    semanticDefaultContractGaps: report.inventory.semanticDefaultContractGaps,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
