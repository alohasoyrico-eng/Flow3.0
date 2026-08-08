#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-default-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-default-governance-audit.md");

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

function aliasUnionValues(types, aliasName) {
  const escapedAlias = aliasName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const aliasMatch = types.match(new RegExp(`export type ${escapedAlias}\\s*=\\s*([^;]+);`));
  return aliasMatch ? unionValues(aliasMatch[1]) : [];
}

function propTypeExpression(types, componentName, propName) {
  const propsBody = types.match(new RegExp(`export interface ${componentName}Props[^\\{]*\\{([\\s\\S]*?)\\n\\}`))?.[1]
    ?? types.match(new RegExp(`export type ${componentName}Props\\s*=\\s*[\\s\\S]*?&\\s*\\{([\\s\\S]*?)\\n\\};`))?.[1]
    ?? "";
  const escapedProp = propName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return propsBody.match(new RegExp(`^\\s*${escapedProp}\\??:\\s*([^;]+);`, "m"))?.[1]?.trim() ?? "";
}

function unionValues(typeExpression) {
  return [...typeExpression.replaceAll('\\"', '"').matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function lowerFirst(value) {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function contractBodyFor(source, contractKey) {
  if (!source) return "";
  const match = source.match(new RegExp(`^\\s+${contractKey}:\\s*\\{([\\s\\S]*?)(?=^\\s+[a-z][A-Za-z0-9]*:\\s*\\{|\\n\\};)`, "m"));
  return match?.[1] ?? "";
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
  const types = read(typesFile);
  const typeExpression = propTypeExpression(types, component, propName);
  const inlineValues = unionValues(typeExpression);
  if (inlineValues.length) return inlineValues;
  const aliasName = typeExpression.match(/\b[A-Z][A-Za-z0-9]*\b/)?.[0];
  return aliasName ? aliasUnionValues(types, aliasName) : [];
}

function contractAllowedValues(contractsSource, component, propName) {
  const propValues = unionValues(contractPropTypeExpression(contractsSource, component, propName));
  return propValues.length ? propValues : contractNamedValues(contractsSource, component, propName);
}

function semanticContractGaps(semanticDefaults, contractsSource) {
  return semanticDefaults
    .map((match) => {
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
        status: publicContractStatus === "pass" && systemContractStatus === "pass" ? "pass" : "fail",
      };
    })
    .filter((match) => match.status === "fail");
}

function createReport() {
  const files = sourceFiles();
  const contractsSource = fs.existsSync(contractsFile) ? read(contractsFile) : "";
  const prohibitedDefaults = files.flatMap((file) => lineMatches(file, prohibitedRules));
  const semanticDefaults = files.flatMap((file) => lineMatches(file, semanticRules));
  const semanticDefaultContractGaps = semanticContractGaps(semanticDefaults, contractsSource);
  const semanticByRule = semanticRules.map((rule) => ({
    rule: rule.id,
    description: rule.description,
    count: semanticDefaults.filter((match) => match.rule === rule.id).length,
  }));
  return {
    status: prohibitedDefaults.length || semanticDefaultContractGaps.length ? "fail" : "pass",
    audit: "react default governance",
    principle: "Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic defaults may exist only as visible contract decisions.",
    inventory: {
      components: files.length,
      prohibitedDefaults: prohibitedDefaults.length,
      semanticDefaults: semanticDefaults.length,
      semanticDefaultContractGaps: semanticDefaultContractGaps.length,
      semanticByRule,
    },
    prohibitedDefaults,
    semanticDefaults,
    semanticDefaultContractGaps,
  };
}

function toMarkdown(report) {
  const prohibitedRows = report.prohibitedDefaults.map((match) => `| ${match.component} | ${match.rule} | ${match.file}:${match.line} | \`${match.text.replaceAll("|", "\\|")}\` |`);
  const semanticRows = report.semanticDefaults.map((match) => `| ${match.component} | ${match.rule} | ${match.prop} | ${match.value} | ${match.file}:${match.line} | \`${match.text.replaceAll("|", "\\|")}\` |`);
  const semanticGapRows = report.semanticDefaultContractGaps.map((match) => `| ${match.component} | ${match.prop} | ${match.value} | ${match.publicAllowedValues.join(", ") || "None"} | ${match.contractAllowedValues.join(", ") || "None"} | ${match.file}:${match.line} |`);
  const semanticSummaryRows = report.inventory.semanticByRule.map((item) => `| ${item.rule} | ${item.count} | ${item.description} |`);
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
    `- Semantic default contract gaps: ${report.inventory.semanticDefaultContractGaps}`,
    "",
    "## Semantic Default Summary",
    "",
    "| Rule | Count | Meaning |",
    "| --- | ---: | --- |",
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
    semanticDefaultContractGaps: report.inventory.semanticDefaultContractGaps,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
