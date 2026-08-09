#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");
const { componentClassRoots } = require("./audit-anti-duplication.js");
const { componentCssContractCoverage } = require("./audit-component-css-contracts.js");
const {
  classifiedNonComponentRoots,
  packageCssRootInventory,
} = require("./class-root-governance.js");

const checkMode = process.argv.includes("--check");
const packageCssFile = path.join(root, "packages/components/styles/components.css");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "package-css-root-governance-audit.json");
const markdownOutput = path.join(outputDir, "package-css-root-governance-audit.md");

function createReport() {
  const inventory = packageCssRootInventory(root);
  const cssContractCoverage = componentCssContractCoverage();
  const observedReactRoots = new Set(cssContractCoverage.components.flatMap((item) => item.observedRoots ?? []));
  const roots = [...inventory.roots].sort();
  const componentRoots = roots.filter((cssRoot) => componentClassRoots.has(cssRoot));
  const observedComponentRoots = componentRoots.filter((cssRoot) => observedReactRoots.has(cssRoot));
  const unobservedComponentRoots = componentRoots.filter((cssRoot) => !observedReactRoots.has(cssRoot));
  const classifiedRoots = roots.filter((cssRoot) => !componentClassRoots.has(cssRoot) && classifiedNonComponentRoots[cssRoot]);
  const unclassifiedRoots = roots.filter((cssRoot) => !componentClassRoots.has(cssRoot) && !classifiedNonComponentRoots[cssRoot]);
  const classified = classifiedRoots.map((cssRoot) => ({
    root: cssRoot,
    ...classifiedNonComponentRoots[cssRoot],
  }));

  return {
    status: unclassifiedRoots.length || unobservedComponentRoots.length ? "fail" : "pass",
    audit: "package CSS root governance",
    principle: "Every root class in the package stylesheet must be a known component root observed by React or an explicitly classified shared primitive/bridge; unclassified or unobserved roots indicate accidental visual implementations.",
    inventory: {
      packageCssFile: rel(packageCssFile),
      selectors: inventory.selectors,
      cssRoots: roots.length,
      componentRoots: componentRoots.length,
      observedComponentRoots: observedComponentRoots.length,
      unobservedComponentRoots: unobservedComponentRoots.length,
      classifiedNonComponentRoots: classifiedRoots.length,
      unclassifiedRoots: unclassifiedRoots.length,
    },
    componentRoots,
    observedComponentRoots,
    unobservedComponentRoots,
    classifiedNonComponentRoots: classified,
    unclassifiedRoots,
  };
}

function toMarkdown(report) {
  const classifiedRows = report.classifiedNonComponentRoots.map((item) => (
    `| ${item.root} | ${item.type} | ${item.owner} | ${item.reactSupport ? "yes" : "no"} | ${item.note} |`
  ));
  const unobservedRows = report.unobservedComponentRoots.map((cssRoot) => `| ${cssRoot} |`);
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
    `- Component roots observed by React: ${report.inventory.observedComponentRoots}`,
    `- Component roots not observed by React: ${report.inventory.unobservedComponentRoots}`,
    `- Classified non-component roots: ${report.inventory.classifiedNonComponentRoots}`,
    `- Unclassified roots: ${report.inventory.unclassifiedRoots}`,
    "",
    "## Classified Non-Component Roots",
    "",
    "| Root | Type | Owner | React support | Note |",
    "| --- | --- | --- | --- | --- |",
    ...(classifiedRows.length ? classifiedRows : ["| None | None | None | None | None |"]),
    "",
    "## Unobserved Component Roots",
    "",
    "| Root |",
    "| --- |",
    ...(unobservedRows.length ? unobservedRows : ["| None |"]),
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
    observedComponentRoots: report.inventory.observedComponentRoots,
    unobservedComponentRoots: report.unobservedComponentRoots,
    classifiedNonComponentRoots: report.inventory.classifiedNonComponentRoots,
    unclassifiedRoots: report.unclassifiedRoots,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
