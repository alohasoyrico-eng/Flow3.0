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
    description: "Component behavior default; allowed when normalized through component state.",
    pattern: /\bstate\s*=\s*["']default["']/,
  },
  {
    id: "variant-default",
    description: "Component composition default; allowed when constrained by the component contract.",
    pattern: /\bvariant\s*=\s*["'][a-z-]+["']/,
  },
  {
    id: "tone-default",
    description: "Component tone fallback; allowed when constrained by the component contract.",
    pattern: /\btone\s*=\s*["'][a-z-]+["']/,
  },
  {
    id: "intent-default",
    description: "Action intent fallback; allowed when constrained by the component contract.",
    pattern: /\bintent\s*=\s*["'][a-z-]+["']/,
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
    .filter((rule) => rule.pattern.test(line))
    .map((rule) => ({
      component: path.basename(file, ".js"),
      file: rel(file),
      line: index + 1,
      rule: rule.id,
      description: rule.description,
      text: line.trim(),
    })));
}

function createReport() {
  const files = sourceFiles();
  const prohibitedDefaults = files.flatMap((file) => lineMatches(file, prohibitedRules));
  const semanticDefaults = files.flatMap((file) => lineMatches(file, semanticRules));
  const semanticByRule = semanticRules.map((rule) => ({
    rule: rule.id,
    description: rule.description,
    count: semanticDefaults.filter((match) => match.rule === rule.id).length,
  }));
  return {
    status: prohibitedDefaults.length ? "fail" : "pass",
    audit: "react default governance",
    principle: "Platform defaults such as density, size, and theme must come from the Flow cascade; component-level semantic defaults may exist only as visible contract decisions.",
    inventory: {
      components: files.length,
      prohibitedDefaults: prohibitedDefaults.length,
      semanticDefaults: semanticDefaults.length,
      semanticByRule,
    },
    prohibitedDefaults,
    semanticDefaults,
  };
}

function toMarkdown(report) {
  const prohibitedRows = report.prohibitedDefaults.map((match) => `| ${match.component} | ${match.rule} | ${match.file}:${match.line} | \`${match.text.replaceAll("|", "\\|")}\` |`);
  const semanticRows = report.semanticDefaults.map((match) => `| ${match.component} | ${match.rule} | ${match.file}:${match.line} | \`${match.text.replaceAll("|", "\\|")}\` |`);
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
    "## Visible Semantic Defaults",
    "",
    "| Component | Rule | Location | Source |",
    "| --- | --- | --- | --- |",
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
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
