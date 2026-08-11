#!/usr/bin/env node

const {
  fs,
  goldComponents,
  path,
  patternArtifacts,
  primitiveArtifacts,
  rel,
  root,
  requiredPatternContracts,
} = require("./audit-context.js");
const {
  readPatternContractGovernance,
} = require("./pattern-contract-governance.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "pattern-readiness-audit.json");
const markdownOutput = path.join(outputDir, "pattern-readiness-audit.md");
const metaFile = path.join(root, "packages/specs/specs/unison-system/meta/patterns.json");
const catalogDir = path.join(root, "packages/content/content/catalog");
const copyDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const contractsDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const artifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const taxonomyFile = path.join(root, "packages/content/content/taxonomy-boundaries.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function mergeContentJson(base, next) {
  const merged = { ...base, ...next };
  for (const [key, value] of Object.entries(next)) {
    if (Array.isArray(value)) {
      merged[key] = [
        ...(Array.isArray(base[key]) ? base[key] : []),
        ...value,
      ];
    } else if (
      value
      && typeof value === "object"
      && !Array.isArray(value)
      && base[key]
      && typeof base[key] === "object"
      && !Array.isArray(base[key])
    ) {
      merged[key] = {
        ...base[key],
        ...value,
      };
    }
  }
  return merged;
}

function readContentJson(file) {
  const raw = readJson(file);
  if (!Array.isArray(raw.$systemShards)) return raw;
  const { $systemShards, ...manifest } = raw;
  return $systemShards.reduce((merged, shard) => {
    const shardFile = path.join(path.dirname(file), shard);
    return mergeContentJson(merged, readContentJson(shardFile));
  }, manifest);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

function listCatalogIds() {
  if (!fs.existsSync(catalogDir)) return [];
  return fs.readdirSync(catalogDir)
    .filter((file) => /^patterns-.*\.json$/.test(file))
    .sort()
    .flatMap((file) => (readContentJson(path.join(catalogDir, file)).patterns ?? []).map((pattern) => pattern.id));
}

function listCatalogPatterns() {
  if (!fs.existsSync(catalogDir)) return [];
  return fs.readdirSync(catalogDir)
    .filter((file) => /^patterns-.*\.json$/.test(file))
    .sort()
    .flatMap((file) => (readContentJson(path.join(catalogDir, file)).patterns ?? []).map((pattern) => ({
      ...pattern,
      catalogFile: path.join(catalogDir, file),
    })));
}

function artifactDependencyRecord(id) {
  const file = path.join(artifactDir, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  const data = readJson(file);
  return data.artifacts?.patterns?.[id] ?? null;
}

function duplicateValues(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))].sort();
}

function createReport() {
  const patternContractGovernance = readPatternContractGovernance();
  const expectedInventory = patternContractGovernance.readinessExpectedInventory;
  const metaPatterns = readJson(metaFile).patterns ?? [];
  const catalogPatterns = listCatalogPatterns();
  const catalogIds = listCatalogIds();
  const uniqueCatalogIds = [...new Set(catalogIds)].sort();
  const copyIds = listPatternCopyIds();
  const markdownIds = listMarkdownContractIds();
  const formalArtifactIds = [...patternArtifacts];
  const componentArtifactIds = new Set(goldComponents);
  const primitiveArtifactIds = new Set(primitiveArtifacts);
  const patternArtifactIds = new Set(formalArtifactIds);
  const catalogComponentReferenceErrors = catalogPatterns.flatMap((pattern) => (pattern.componentsUsed ?? [])
    .map((componentName) => {
      const componentId = slug(componentName);
      if (componentArtifactIds.has(componentId)) return null;
      const layer = primitiveArtifactIds.has(componentId)
        ? "primitive"
        : patternArtifactIds.has(componentId)
          ? "pattern"
          : "unknown";
      return {
        pattern: pattern.id,
        componentName,
        componentId,
        layer,
        file: path.relative(root, pattern.catalogFile),
      };
    })
    .filter(Boolean));
  const catalogArtifactDependencyMismatches = catalogPatterns.flatMap((pattern) => {
    const artifact = artifactDependencyRecord(pattern.id);
    if (!artifact) return [];
    const catalogComponents = (pattern.componentsUsed ?? []).map(slug).sort();
    const artifactComponents = (artifact.componentDependencies ?? []).map(slug).sort();
    const catalogPatternsUsed = (pattern.patternDependencies ?? []).map(slug).sort();
    const artifactPatternsUsed = (artifact.patternDependencies ?? []).map(slug).sort();
    return [
      ...(JSON.stringify(catalogComponents) === JSON.stringify(artifactComponents)
        ? []
        : [{
          pattern: pattern.id,
          field: "componentsUsed",
          catalog: catalogComponents,
          artifact: artifactComponents,
          file: path.relative(root, pattern.catalogFile),
        }]),
      ...(JSON.stringify(catalogPatternsUsed) === JSON.stringify(artifactPatternsUsed)
        ? []
        : [{
          pattern: pattern.id,
          field: "patternDependencies",
          catalog: catalogPatternsUsed,
          artifact: artifactPatternsUsed,
          file: path.relative(root, pattern.catalogFile),
        }]),
    ];
  });
  const requiredIds = [...requiredPatternContracts].sort();
  const governedRequiredIds = [...patternContractGovernance.requiredPatternContracts].sort();
  const requiredPatternContractSourceIssues = JSON.stringify(requiredIds) === JSON.stringify(governedRequiredIds)
    ? []
    : [{
      expected: governedRequiredIds,
      actual: requiredIds,
      message: "audit-context requiredPatternContracts must be sourced from pattern-contract-governance.json.",
    }];
  const duplicateCatalogIds = duplicateValues(catalogIds);
  const requiredContractGaps = requiredIds.filter((id) => !markdownIds.includes(id));
  const requiredCopyGaps = requiredIds.filter((id) => !copyIds.includes(id));
  const staleMarkdownContracts = markdownIds.filter((id) => !copyIds.includes(id));
  const formalArtifactBacklog = copyIds.filter((id) => !formalArtifactIds.includes(id));
  const catalogOnlyIds = uniqueCatalogIds.filter((id) => !copyIds.includes(id));
  const copyOnlyIds = copyIds.filter((id) => !uniqueCatalogIds.includes(id));
  const formalArtifactsMissingCatalog = formalArtifactIds.filter((id) => !uniqueCatalogIds.includes(id));
  const taxonomy = fs.existsSync(taxonomyFile) ? readJson(taxonomyFile) : {};
  const catalogOnlyDecisions = (taxonomy.decisions ?? [])
    .filter((decision) => catalogOnlyIds.includes(decision.id));
  const approvedCatalogOnlyRows = catalogOnlyDecisions
    .filter((decision) => decision.layer === "pattern" && decision.id === decision.replacement);
  const approvedCatalogOnlyIds = new Set(approvedCatalogOnlyRows.map((decision) => decision.id));
  const unapprovedCatalogOnlyPatterns = catalogOnlyIds.filter((id) => !approvedCatalogOnlyIds.has(id));
  const catalogOnlyGovernanceIssues = [
    ...catalogOnlyIds
      .filter((id) => !catalogOnlyDecisions.some((decision) => decision.id === id))
      .map((id) => ({
        id,
        message: "Catalog-only pattern must have an explicit taxonomy decision before it can remain without copy/contracts/artifacts.",
      })),
    ...catalogOnlyDecisions
      .filter((decision) => decision.layer !== "pattern")
      .map((decision) => ({
        id: decision.id,
        message: "Catalog-only taxonomy decision must stay in the pattern layer.",
      })),
    ...catalogOnlyDecisions
      .filter((decision) => decision.replacement !== decision.id)
      .map((decision) => ({
        id: decision.id,
        message: "Catalog-only pattern decision must use itself as replacement so it cannot silently redirect to another layer.",
      })),
    ...catalogOnlyDecisions
      .filter((decision) => typeof decision.reason !== "string" || decision.reason.trim().length < 80)
      .map((decision) => ({
        id: decision.id,
        message: "Catalog-only pattern decision must include a concrete taxonomy reason.",
      })),
  ];
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
    catalogOnlyPatterns: catalogOnlyIds.length,
    approvedCatalogOnlyPatterns: approvedCatalogOnlyRows.length,
    unapprovedCatalogOnlyPatterns: unapprovedCatalogOnlyPatterns.length,
    catalogOnlyGovernanceIssues: catalogOnlyGovernanceIssues.length,
    formalArtifactsMissingCatalog: formalArtifactsMissingCatalog.length,
    catalogComponentReferenceErrors: catalogComponentReferenceErrors.length,
    catalogArtifactDependencyMismatches: catalogArtifactDependencyMismatches.length,
    patternContractGovernanceIssues: patternContractGovernance.issues.length,
    requiredPatternContractSourceIssues: requiredPatternContractSourceIssues.length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "patternReadinessDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => key !== "patternReadinessDebt" && expectedInventory[key] === undefined)
    .map((key) => ({
      key,
      actual: inventory[key],
      message: "Pattern readiness inventory metric must be declared in pattern-contract-governance.json.",
    }));
  inventory.patternReadinessDebt = duplicateCatalogIds.length
    + requiredContractGaps.length
    + requiredCopyGaps.length
    + staleMarkdownContracts.length
    + unapprovedCatalogOnlyPatterns.length
    + catalogOnlyGovernanceIssues.length
    + formalArtifactsMissingCatalog.length
    + catalogComponentReferenceErrors.length
    + catalogArtifactDependencyMismatches.length
    + patternContractGovernance.issues.length
    + requiredPatternContractSourceIssues.length
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length;
  return {
    status: inventory.patternReadinessDebt ? "fail" : "pass",
    audit: "pattern readiness",
    principle: "Patterns must have a governed source, portable contract, formal artifact promotion path, and explicit backlog before product teams compose them at scale.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedMetrics: unexpectedInventoryMetrics,
    },
    patternContractGovernance: {
      file: rel(patternContractGovernance.file),
      issues: patternContractGovernance.issues,
      readinessExpectedInventoryMetrics: Object.keys(expectedInventory).length,
    },
    duplicateCatalogIds,
    requiredContractGaps,
    requiredCopyGaps,
    requiredPatternContractSourceIssues,
    unexpectedInventoryMetrics,
    staleMarkdownContracts,
    formalArtifactBacklog,
    catalogOnlyIds,
    approvedCatalogOnlyPatterns: approvedCatalogOnlyRows.map((decision) => ({
      id: decision.id,
      layer: decision.layer,
      replacement: decision.replacement,
      reason: decision.reason,
    })),
    unapprovedCatalogOnlyPatterns,
    catalogOnlyGovernanceIssues,
    copyOnlyIds,
    formalArtifactsMissingCatalog,
    catalogComponentReferenceErrors,
    catalogArtifactDependencyMismatches,
    formalArtifactIds,
    requiredPatternContracts: requiredIds,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedMetrics
    .map((item) => `| ${item.key} | ${item.actual} | ${item.message} |`);
  const backlogRows = report.formalArtifactBacklog.map((id) => `| ${id} |`);
  const catalogOnlyRows = report.catalogOnlyIds.map((id) => `| ${id} |`);
  const approvedCatalogOnlyRows = report.approvedCatalogOnlyPatterns.map((row) => `| ${row.id} | ${row.layer} | ${row.replacement} | ${row.reason} |`);
  const unapprovedCatalogOnlyRows = report.unapprovedCatalogOnlyPatterns.map((id) => `| ${id} |`);
  const catalogOnlyGovernanceIssueRows = report.catalogOnlyGovernanceIssues.map((issue) => `| ${issue.id} | ${issue.message} |`);
  const copyOnlyRows = report.copyOnlyIds.map((id) => `| ${id} |`);
  const formalArtifactsMissingCatalogRows = report.formalArtifactsMissingCatalog.map((id) => `| ${id} |`);
  const catalogComponentReferenceRows = report.catalogComponentReferenceErrors
    .map((row) => `| ${row.pattern} | ${row.componentName} | ${row.layer} | ${row.file} |`);
  const catalogArtifactDependencyRows = report.catalogArtifactDependencyMismatches
    .map((row) => `| ${row.pattern} | ${row.field} | ${row.file} | ${row.catalog.join(", ") || "-"} | ${row.artifact.join(", ") || "-"} |`);
  const artifactRows = report.formalArtifactIds.map((id) => `| ${id} |`);
  const requiredRows = report.requiredPatternContracts.map((id) => `| ${id} |`);
  const requiredSourceRows = report.requiredPatternContractSourceIssues
    .map((issue) => `| ${issue.message} | ${issue.expected.length} | ${issue.actual.length} |`);
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
    `- Catalog-only patterns: ${report.inventory.catalogOnlyPatterns}`,
    `- Approved catalog-only patterns: ${report.inventory.approvedCatalogOnlyPatterns}`,
    `- Unapproved catalog-only patterns: ${report.inventory.unapprovedCatalogOnlyPatterns}`,
    `- Catalog-only governance issues: ${report.inventory.catalogOnlyGovernanceIssues}`,
    `- Formal artifacts missing catalog: ${report.inventory.formalArtifactsMissingCatalog}`,
    `- Catalog component reference errors: ${report.inventory.catalogComponentReferenceErrors}`,
    `- Catalog/artifact dependency mismatches: ${report.inventory.catalogArtifactDependencyMismatches}`,
    `- Pattern contract governance issues: ${report.inventory.patternContractGovernanceIssues}`,
    `- Required pattern contract source issues: ${report.inventory.requiredPatternContractSourceIssues}`,
    `- Pattern readiness debt: ${report.inventory.patternReadinessDebt}`,
    "",
    "## Governance Source",
    "",
    `- Contract file: ${report.patternContractGovernance.file}`,
    `- Readiness baseline metrics: ${report.patternContractGovernance.readinessExpectedInventoryMetrics}`,
    `- Contract issues: ${report.patternContractGovernance.issues.length}`,
    `- Required contract source issues: ${report.requiredPatternContractSourceIssues.length}`,
    "",
    "| Source issue | Expected governed ids | Actual context ids |",
    "| --- | ---: | ---: |",
    ...(requiredSourceRows.length ? requiredSourceRows : ["| None | None | None |"]),
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
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual | Issue |",
    "| --- | ---: | --- |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None | None |"]),
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
    "## Approved Catalog-Only Patterns",
    "",
    "| Pattern | Layer | Replacement | Reason |",
    "| --- | --- | --- | --- |",
    ...(approvedCatalogOnlyRows.length ? approvedCatalogOnlyRows : ["| None | None | None | None |"]),
    "",
    "## Unapproved Catalog-Only Patterns",
    "",
    "| Pattern |",
    "| --- |",
    ...(unapprovedCatalogOnlyRows.length ? unapprovedCatalogOnlyRows : ["| None |"]),
    "",
    "## Catalog-Only Governance Issues",
    "",
    "| Pattern | Issue |",
    "| --- | --- |",
    ...(catalogOnlyGovernanceIssueRows.length ? catalogOnlyGovernanceIssueRows : ["| None | None |"]),
    "",
    "## Formal Artifacts Missing Catalog",
    "",
    "| Pattern |",
    "| --- |",
    ...(formalArtifactsMissingCatalogRows.length ? formalArtifactsMissingCatalogRows : ["| None |"]),
    "",
    "## Catalog Component Reference Errors",
    "",
    "| Pattern | componentsUsed item | Resolved layer | File |",
    "| --- | --- | --- | --- |",
    ...(catalogComponentReferenceRows.length ? catalogComponentReferenceRows : ["| None | None | None | None |"]),
    "",
    "## Catalog/Artifact Dependency Mismatches",
    "",
    "| Pattern | Field | File | Catalog | Artifact |",
    "| --- | --- | --- | --- | --- |",
    ...(catalogArtifactDependencyRows.length ? catalogArtifactDependencyRows : ["| None | None | None | None | None |"]),
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
