#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { allowedDynamicStyleKeysByComponent } = require("./react-style-contracts.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-style-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-style-governance-audit.md");

const blockedEscapePatterns = [
  { id: "rest-style", label: "rest.style merge", pattern: /\brest\.style\b/g },
  { id: "inner-html", label: "HTML string injection", pattern: /\b(?:innerHTML|insertAdjacentHTML)\b/g },
  { id: "dom-style-mutation", label: "DOM style mutation", pattern: /\.style\.(?!setProperty\()/g },
  { id: "dom-dataset-mutation", label: "DOM dataset mutation", pattern: /\.dataset\./g },
  { id: "dom-classlist-mutation", label: "DOM classList mutation", pattern: /\.classList\./g },
];

function componentFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function lineForIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

function approvedVars(source, allowedKeys) {
  return [...new Set([...source.matchAll(/["'](--comp-[^"']+)["']\s*:/g)]
    .map((match) => match[1])
    .filter((key) => allowedKeys.includes(key)))].sort();
}

function stylePropMatches(source) {
  return [...source.matchAll(/\bstyle\s*:\s*([^,\n}]+)/g)].map((match) => ({
    index: match.index,
    value: match[1].trim(),
    text: match[0].trim(),
  }));
}

function createReport() {
  const components = componentFiles().map((file) => {
    const component = path.basename(file, ".js");
    const source = read(file);
    const allowedKeys = allowedDynamicStyleKeysByComponent[component] ?? [];
    const styleProps = stylePropMatches(source);
    const vars = approvedVars(source, allowedKeys);
    const blockedEscapes = blockedEscapePatterns.flatMap((rule) => [...source.matchAll(rule.pattern)].map((match) => ({
      rule: rule.id,
      label: rule.label,
      line: lineForIndex(source, match.index),
      text: source.slice(match.index, match.index + 80).split("\n")[0].trim(),
    })));
    const unapprovedCssVars = [...new Set([...source.matchAll(/["'](--comp-[^"']+)["']\s*:/g)]
      .map((match) => match[1])
      .filter((key) => !allowedKeys.includes(key)))].sort();
    const arbitraryStyleProps = styleProps
      .filter((match) => !allowedKeys.length || (!match.value.startsWith("{") && !vars.length))
      .map((match) => ({
        rule: "style-prop-without-approved-vars",
        line: lineForIndex(source, match.index),
        text: match.text,
      }));
    const styleSetPropertyCalls = [...source.matchAll(/\.style\.setProperty\(\s*["']([^"']+)["']/g)].map((match) => ({
      property: match[1],
      line: lineForIndex(source, match.index),
    }));
    const invalidSetPropertyCalls = styleSetPropertyCalls.filter((match) => !allowedKeys.includes(match.property));
    const violations = [
      ...blockedEscapes,
      ...unapprovedCssVars.map((key) => ({ rule: "unapproved-css-var", label: "Unapproved CSS custom property", line: 1, text: key })),
      ...arbitraryStyleProps,
      ...invalidSetPropertyCalls.map((match) => ({ rule: "invalid-set-property", label: "Invalid style.setProperty target", line: match.line, text: match.property })),
    ];
    return {
      component,
      file: rel(file),
      allowedInlineStyleKeys: allowedKeys,
      approvedVars: vars,
      styleProps: styleProps.length,
      setPropertyCalls: styleSetPropertyCalls,
      violations,
      status: violations.length ? "fail" : "pass",
    };
  });
  const withApprovedVars = components.filter((item) => item.approvedVars.length || item.allowedInlineStyleKeys.length);
  const withRuntimeVars = components.filter((item) => item.setPropertyCalls.length);
  return {
    status: components.some((item) => item.status === "fail") ? "fail" : "pass",
    audit: "react style governance",
    principle: "React visual styling must flow through classes and tokens; inline style is reserved for approved dynamic CSS custom properties and DOM style/class/data mutation is blocked.",
    inventory: {
      components: components.length,
      componentsWithApprovedInlineVars: withApprovedVars.length,
      componentsWithRuntimeVars: withRuntimeVars.length,
      approvedInlineVars: components.reduce((total, item) => total + item.approvedVars.length, 0),
      styleProps: components.reduce((total, item) => total + item.styleProps, 0),
      setPropertyCalls: components.reduce((total, item) => total + item.setPropertyCalls.length, 0),
      violations: components.reduce((total, item) => total + item.violations.length, 0),
    },
    components,
  };
}

function toMarkdown(report) {
  const componentRows = report.components
    .filter((item) => item.approvedVars.length || item.allowedInlineStyleKeys.length || item.styleProps || item.setPropertyCalls.length || item.violations.length)
    .map((item) => `| ${item.component} | ${item.status} | ${item.allowedInlineStyleKeys.join(", ") || "None"} | ${item.approvedVars.join(", ") || "None"} | ${item.setPropertyCalls.map((call) => call.property).join(", ") || "None"} | ${item.styleProps} | ${item.violations.length} |`);
  const violationRows = report.components.flatMap((item) => item.violations.map((violation) => `| ${item.component} | ${violation.rule} | ${item.file}:${violation.line} | \`${String(violation.text).replaceAll("|", "\\|")}\` |`));
  return [
    "# React Style Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Components with approved inline vars: ${report.inventory.componentsWithApprovedInlineVars}`,
    `- Components with runtime CSS vars: ${report.inventory.componentsWithRuntimeVars}`,
    `- Approved inline vars observed: ${report.inventory.approvedInlineVars}`,
    `- Style props observed: ${report.inventory.styleProps}`,
    `- style.setProperty calls: ${report.inventory.setPropertyCalls}`,
    `- Violations: ${report.inventory.violations}`,
    "",
    "## Components",
    "",
    "| Component | Status | Allowed inline vars | Observed approved vars | Runtime CSS vars | Style props | Violations |",
    "| --- | --- | --- | --- | --- | ---: | ---: |",
    ...(componentRows.length ? componentRows : ["| None | pass | None | None | None | 0 | 0 |"]),
    "",
    "## Violations",
    "",
    "| Component | Rule | Location | Source |",
    "| --- | --- | --- | --- |",
    ...(violationRows.length ? violationRows : ["| None | None | None | None |"]),
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
      console.error("React style governance report is stale. Run: node packages/audit/scripts/report-react-style-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    componentsWithApprovedInlineVars: report.inventory.componentsWithApprovedInlineVars,
    approvedInlineVars: report.inventory.approvedInlineVars,
    violations: report.inventory.violations,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
