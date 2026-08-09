#!/usr/bin/env node

const {
  fs,
  goldComponents,
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

function aliasRootEvidence(cssSource) {
  const knownRoots = [...new Set([
    ...componentClassRoots,
    ...Object.keys(classifiedNonComponentRoots),
    ...goldComponents,
  ])].sort((a, b) => b.length - a.length);
  const aliases = [...cssSource.matchAll(/--comp-([a-z][a-z0-9-]*):/g)].map((match) => match[1]);
  const evidence = aliases.map((alias) => ({
    alias,
    root: knownRoots.find((knownRoot) => alias === knownRoot || alias.startsWith(`${knownRoot}-`)) ?? null,
  }));
  return {
    aliases,
    evidence,
    roots: [...new Set(evidence.map((item) => item.root).filter(Boolean))].sort(),
    unknownAliases: evidence.filter((item) => !item.root),
  };
}

function createReport() {
  const inventory = packageCssRootInventory(root);
  const cssSource = fs.existsSync(packageCssFile) ? fs.readFileSync(packageCssFile, "utf8") : "";
  const aliasEvidence = aliasRootEvidence(cssSource);
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
    status: unclassifiedRoots.length || unobservedComponentRoots.length || aliasEvidence.unknownAliases.length ? "fail" : "pass",
    audit: "package CSS root governance",
    principle: "Every root class and --comp-* alias in the package stylesheet must map to a known component, observed React root, or explicitly classified shared primitive/bridge; unclassified, unobserved, or unknown aliases indicate accidental visual implementations.",
    inventory: {
      packageCssFile: rel(packageCssFile),
      selectors: inventory.selectors,
      componentAliases: aliasEvidence.aliases.length,
      componentAliasRoots: aliasEvidence.roots.length,
      unknownComponentAliases: aliasEvidence.unknownAliases.length,
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
    componentAliasRoots: aliasEvidence.roots,
    unknownComponentAliases: aliasEvidence.unknownAliases,
    classifiedNonComponentRoots: classified,
    unclassifiedRoots,
  };
}

function toMarkdown(report) {
  const classifiedRows = report.classifiedNonComponentRoots.map((item) => (
    `| ${item.root} | ${item.type} | ${item.owner} | ${item.reactSupport ? "yes" : "no"} | ${item.note} |`
  ));
  const aliasRootRows = report.componentAliasRoots.map((cssRoot) => `| ${cssRoot} |`);
  const unknownAliasRows = report.unknownComponentAliases.map((item) => `| ${item.alias} |`);
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
    `- Component aliases scanned: ${report.inventory.componentAliases}`,
    `- Component alias roots: ${report.inventory.componentAliasRoots}`,
    `- Unknown component aliases: ${report.inventory.unknownComponentAliases}`,
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
    "## Component Alias Roots",
    "",
    "| Root |",
    "| --- |",
    ...(aliasRootRows.length ? aliasRootRows : ["| None |"]),
    "",
    "## Unknown Component Aliases",
    "",
    "| Alias |",
    "| --- |",
    ...(unknownAliasRows.length ? unknownAliasRows : ["| None |"]),
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
    componentAliases: report.inventory.componentAliases,
    componentAliasRoots: report.inventory.componentAliasRoots,
    unknownComponentAliases: report.unknownComponentAliases,
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
