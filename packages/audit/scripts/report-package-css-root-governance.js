#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");
const { componentClassRoots } = require("./audit-anti-duplication.js");

const checkMode = process.argv.includes("--check");
const packageCssFile = path.join(root, "packages/components/styles/components.css");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "package-css-root-governance-audit.json");
const markdownOutput = path.join(outputDir, "package-css-root-governance-audit.md");

const classifiedNonComponentRoots = {
  "animation-asset": {
    type: "primitive-asset",
    owner: "packages/components/src/primitives/animation-assets.js",
    note: "Reusable animation asset primitive consumed by AnimatedMoment.",
  },
  "docs-package-demo": {
    type: "docs-layout-bridge",
    owner: "../FlowDocs/apps/docs",
    note: "Temporary docs layout hook for package-backed demos; tracked so it cannot multiply silently.",
  },
  "field-action": {
    type: "shared-control-primitive",
    owner: "field",
    note: "Shared field action affordance consumed by Input, Combobox, and card field inputs.",
  },
  "field-control": {
    type: "legacy-field-shell",
    owner: "field",
    note: "Legacy-compatible field shell selector covered by the Field CSS contract.",
  },
  "field-input": {
    type: "legacy-field-input",
    owner: "field",
    note: "Legacy-compatible field input selector covered by the Field CSS contract.",
  },
  "illustration-asset": {
    type: "primitive-asset",
    owner: "packages/components/src/primitives/illustration-assets.js",
    note: "Reusable illustration asset primitive.",
  },
  input: {
    type: "shared-control-primitive",
    owner: "field",
    note: "Shared native input surface consumed by field-family React components.",
  },
  "material-symbol": {
    type: "iconography-hook",
    owner: "packages/components/src/primitives/iconography.js",
    note: "Material Symbols font hook used by icon-bearing components.",
  },
};

function selectorBlocks(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [];
  let selectorStart = 0;
  for (let index = 0; index < withoutComments.length; index += 1) {
    const char = withoutComments[index];
    if (char === "{") {
      const selector = withoutComments.slice(selectorStart, index).trim();
      if (selector && !selector.startsWith("@")) selectors.push(selector);
      continue;
    }
    if (char === "}") selectorStart = index + 1;
  }
  return selectors;
}

function rootsFromSelector(selector) {
  const roots = new Set();
  for (const match of selector.matchAll(/\.([a-z][a-z0-9-]*(?:__[a-z0-9-]+|--[a-z0-9-]+)?)/g)) {
    const token = match[1];
    roots.add(token.split(/__|--/)[0]);
  }
  return [...roots].sort();
}

function createReport() {
  const source = fs.existsSync(packageCssFile) ? fs.readFileSync(packageCssFile, "utf8") : "";
  const selectors = selectorBlocks(source);
  const roots = [...new Set(selectors.flatMap((selector) => rootsFromSelector(selector)))].sort();
  const componentRoots = roots.filter((cssRoot) => componentClassRoots.has(cssRoot));
  const classifiedRoots = roots.filter((cssRoot) => !componentClassRoots.has(cssRoot) && classifiedNonComponentRoots[cssRoot]);
  const unclassifiedRoots = roots.filter((cssRoot) => !componentClassRoots.has(cssRoot) && !classifiedNonComponentRoots[cssRoot]);
  const classified = classifiedRoots.map((cssRoot) => ({
    root: cssRoot,
    ...classifiedNonComponentRoots[cssRoot],
  }));

  return {
    status: unclassifiedRoots.length ? "fail" : "pass",
    audit: "package CSS root governance",
    principle: "Every root class in the package stylesheet must be a known component root or an explicitly classified shared primitive/bridge; unclassified roots indicate accidental visual implementations.",
    inventory: {
      packageCssFile: rel(packageCssFile),
      selectors: selectors.length,
      cssRoots: roots.length,
      componentRoots: componentRoots.length,
      classifiedNonComponentRoots: classifiedRoots.length,
      unclassifiedRoots: unclassifiedRoots.length,
    },
    componentRoots,
    classifiedNonComponentRoots: classified,
    unclassifiedRoots,
  };
}

function toMarkdown(report) {
  const classifiedRows = report.classifiedNonComponentRoots.map((item) => (
    `| ${item.root} | ${item.type} | ${item.owner} | ${item.note} |`
  ));
  const unclassifiedRows = report.unclassifiedRoots.map((cssRoot) => `| ${cssRoot} |`);
  return [
    "# Package CSS Root Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Package CSS: ${report.inventory.packageCssFile}`,
    `- Selectors scanned: ${report.inventory.selectors}`,
    `- CSS roots: ${report.inventory.cssRoots}`,
    `- Component roots: ${report.inventory.componentRoots}`,
    `- Classified non-component roots: ${report.inventory.classifiedNonComponentRoots}`,
    `- Unclassified roots: ${report.inventory.unclassifiedRoots}`,
    "",
    "## Classified Non-Component Roots",
    "",
    "| Root | Type | Owner | Note |",
    "| --- | --- | --- | --- |",
    ...(classifiedRows.length ? classifiedRows : ["| None | None | None | None |"]),
    "",
    "## Unclassified Roots",
    "",
    "| Root |",
    "| --- |",
    ...(unclassifiedRows.length ? unclassifiedRows : ["| None |"]),
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
      console.error("Package CSS root governance report is stale. Run: node packages/audit/scripts/report-package-css-root-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    cssRoots: report.inventory.cssRoots,
    componentRoots: report.inventory.componentRoots,
    classifiedNonComponentRoots: report.inventory.classifiedNonComponentRoots,
    unclassifiedRoots: report.unclassifiedRoots,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
