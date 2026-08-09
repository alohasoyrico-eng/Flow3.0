#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
  requiredPatternContracts,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "pattern-readiness-audit.json");
const markdownOutput = path.join(outputDir, "pattern-readiness-audit.md");
const metaFile = path.join(root, "packages/specs/specs/unison-system/meta/patterns.json");
const catalogDir = path.join(root, "packages/content/content/catalog");
const copyDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const contractsDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const artifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");

const expectedInventory = {
  metaPatterns: 51,
  catalogPatterns: 47,
  uniqueCatalogPatterns: 47,
  copyPatterns: 41,
  markdownContracts: 41,
  requiredPatternContracts: 23,
  requiredContractsPresent: 23,
  requiredCopyPresent: 23,
  formalArtifacts: 2,
  duplicateCatalogIds: 0,
  requiredContractGaps: 0,
  requiredCopyGaps: 0,
  staleMarkdownContracts: 0,
  formalArtifactBacklog: 39,
  patternReadinessDebt: 0,
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listPatternCopyIds() {
  if (!fs.existsSync(copyDir)) return [];
  return fs.readdirSync(copyDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(copyDir, id, "all.json")))
    .sort();
}

function listMarkdownContractIds() {
  if (!fs.existsSync(contractsDir)) return [];
  return fs.readdirSync(contractsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
    .sort();
}

function listFormalArtifactIds() {
  if (!fs.existsSync(artifactDir)) return [];
  return fs.readdirSync(artifactDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
}

function listCatalogIds() {
  if (!fs.existsSync(catalogDir)) return [];
  return fs.readdirSync(catalogDir)
    .filter((file) => /^patterns-.*\.json$/.test(file))
    .sort()
    .flatMap((file) => (readJson(path.join(catalogDir, file)).patterns ?? []).map((pattern) => pattern.id));
}

function duplicateValues(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))].sort();
}

function createReport() {
  const metaPatterns = readJson(metaFile).patterns ?? [];
  const catalogIds = listCatalogIds();
  const uniqueCatalogIds = [...new Set(catalogIds)].sort();
  const copyIds = listPatternCopyIds();
  const markdownIds = listMarkdownContractIds();
  const formalArtifactIds = listFormalArtifactIds();
  const requiredIds = [...requiredPatternContracts].sort();
  const duplicateCatalogIds = duplicateValues(catalogIds);
  const requiredContractGaps = requiredIds.filter((id) => !markdownIds.includes(id));
  const requiredCopyGaps = requiredIds.filter((id) => !copyIds.includes(id));
  const staleMarkdownContracts = markdownIds.filter((id) => !copyIds.includes(id));
  const formalArtifactBacklog = copyIds.filter((id) => !formalArtifactIds.includes(id));
  const catalogOnlyIds = uniqueCatalogIds.filter((id) => !copyIds.includes(id));
  const copyOnlyIds = copyIds.filter((id) => !uniqueCatalogIds.includes(id));
  const inventory = {
    metaPatterns: metaPatterns.length,
    catalogPatterns: catalogIds.length,
    uniqueCatalogPatterns: uniqueCatalogIds.length,
    copyPatterns: copyIds.length,
    markdownContracts: markdownIds.length,
    requiredPatternContracts: requiredIds.length,
    requiredContractsPresent: requiredIds.length - requiredContractGaps.length,
    requiredCopyPresent: requiredIds.length - requiredCopyGaps.length,
    formalArtifacts: formalArtifactIds.length,
    duplicateCatalogIds: duplicateCatalogIds.length,
    requiredContractGaps: requiredContractGaps.length,
    requiredCopyGaps: requiredCopyGaps.length,
    staleMarkdownContracts: staleMarkdownContracts.length,
    formalArtifactBacklog: formalArtifactBacklog.length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "patternReadinessDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  inventory.patternReadinessDebt = duplicateCatalogIds.length
    + requiredContractGaps.length
    + requiredCopyGaps.length
    + staleMarkdownContracts.length
    + baselineMismatches.length;
  return {
    status: inventory.patternReadinessDebt ? "fail" : "pass",
    audit: "pattern readiness",
    principle: "Patterns must have a governed source, portable contract, formal artifact promotion path, and explicit backlog before product teams compose them at scale.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    duplicateCatalogIds,
    requiredContractGaps,
    requiredCopyGaps,
    staleMarkdownContracts,
    formalArtifactBacklog,
    catalogOnlyIds,
    copyOnlyIds,
    formalArtifactIds,
    requiredPatternContracts: requiredIds,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const backlogRows = report.formalArtifactBacklog.map((id) => `| ${id} |`);
  const catalogOnlyRows = report.catalogOnlyIds.map((id) => `| ${id} |`);
  const copyOnlyRows = report.copyOnlyIds.map((id) => `| ${id} |`);
  const artifactRows = report.formalArtifactIds.map((id) => `| ${id} |`);
  const requiredRows = report.requiredPatternContracts.map((id) => `| ${id} |`);
  return [
    "# Pattern Readiness Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Meta patterns: ${report.inventory.metaPatterns}`,
    `- Catalog patterns: ${report.inventory.catalogPatterns}`,
    `- Unique catalog patterns: ${report.inventory.uniqueCatalogPatterns}`,
    `- Pattern copy sources: ${report.inventory.copyPatterns}`,
    `- Markdown contracts: ${report.inventory.markdownContracts}`,
    `- Required pattern contracts: ${report.inventory.requiredPatternContracts}`,
    `- Required contracts present: ${report.inventory.requiredContractsPresent}`,
    `- Required copy present: ${report.inventory.requiredCopyPresent}`,
    `- Formal artifacts: ${report.inventory.formalArtifacts}`,
    `- Formal artifact backlog: ${report.inventory.formalArtifactBacklog}`,
    `- Pattern readiness debt: ${report.inventory.patternReadinessDebt}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a pattern governance decision. Promotion backlog is visible here, but only broken required contracts, stale contracts, duplicates, or unreviewed inventory drift add readiness debt.",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...inventoryRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(mismatchRows.length ? mismatchRows : ["| None | None | None |"]),
    "",
    "## Formal Artifact Backlog",
    "",
    "| Pattern |",
    "| --- |",
    ...(backlogRows.length ? backlogRows : ["| None |"]),
    "",
    "## Formal Artifacts",
    "",
    "| Pattern |",
    "| --- |",
    ...(artifactRows.length ? artifactRows : ["| None |"]),
    "",
    "## Required Pattern Contracts",
    "",
    "| Pattern |",
    "| --- |",
    ...requiredRows,
    "",
    "## Catalog Without Copy",
    "",
    "| Pattern |",
    "| --- |",
    ...(catalogOnlyRows.length ? catalogOnlyRows : ["| None |"]),
    "",
    "## Copy Without Catalog",
    "",
    "| Pattern |",
    "| --- |",
    ...(copyOnlyRows.length ? copyOnlyRows : ["| None |"]),
    "",
  ].join("\n");
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Pattern readiness report is stale. Run: node packages/audit/scripts/report-pattern-readiness.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    copyPatterns: report.inventory.copyPatterns,
    formalArtifacts: report.inventory.formalArtifacts,
    formalArtifactBacklog: report.inventory.formalArtifactBacklog,
    patternReadinessDebt: report.inventory.patternReadinessDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
