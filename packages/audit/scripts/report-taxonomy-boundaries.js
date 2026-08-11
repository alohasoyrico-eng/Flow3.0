#!/usr/bin/env node

const { fs, path, readJson, root, result } = require("./audit-context.js");
const { checkTaxonomyBoundaries } = require("./audit-taxonomy-boundaries.js");

const checkMode = process.argv.includes("--check");
const taxonomyFile = path.join(root, "packages/content/content/taxonomy-boundaries.json");
const templateBlueprintsFile = path.join(root, "packages/content/content/template-blueprints.json");
const templateCatalogFile = path.join(root, "packages/content/content/catalog/templates.json");
const artifactRoot = path.join(root, "packages/specs/specs/unison-system/artifacts");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "taxonomy-boundaries-audit.json");
const markdownOutput = path.join(outputDir, "taxonomy-boundaries-audit.md");
const artifactLayers = ["foundations", "primitives", "components", "patterns", "templates"];
const layerNames = {
  foundations: "Foundation",
  primitives: "Primitive",
  components: "Component",
  patterns: "Pattern",
  templates: "Template",
};

function taxonomyPolicyIssues(taxonomy) {
  const issues = [];
  if (!Array.isArray(taxonomy.approvedCrossLayerArtifactIds)) {
    issues.push("approvedCrossLayerArtifactIds must be an array");
  }
  for (const id of taxonomy.approvedCrossLayerArtifactIds ?? []) {
    if (typeof id !== "string" || !/^[a-z0-9-]+$/.test(id)) {
      issues.push(`invalid approvedCrossLayerArtifactId: ${id}`);
    }
  }
  if (!taxonomy.expectedInventory || typeof taxonomy.expectedInventory !== "object") {
    issues.push("expectedInventory must be an object");
  }
  for (const [key, expected] of Object.entries(taxonomy.expectedInventory ?? {})) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key) || !Number.isInteger(expected) || expected < 0) {
      issues.push(`invalid expectedInventory entry: ${key}`);
    }
  }
  return issues;
}

function layerCounts(decisions) {
  return decisions.reduce((counts, decision) => ({
    ...counts,
    [decision.layer]: (counts[decision.layer] ?? 0) + 1,
  }), {});
}

function duplicateIds(decisions) {
  const ids = decisions.map((decision) => decision.id);
  return ids.filter((id, index) => ids.indexOf(id) !== index);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleFromId(id) {
  return id.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function artifactRows() {
  return artifactLayers.flatMap((artifactLayer) => {
    const dir = path.join(artifactRoot, artifactLayer);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const id = path.basename(file, ".json");
        const artifactFile = path.join(dir, file);
        const json = readJson(artifactFile) ?? {};
        const record = json.artifacts?.[artifactLayer]?.[id] ?? null;
        const declaredLayer = record?.layer ?? null;
        const expectedLayer = layerNames[artifactLayer];
        const errors = [
          ...(!record ? ["missing nested artifact record"] : []),
          ...(record && declaredLayer !== expectedLayer ? [`declared layer "${declaredLayer}" should be "${expectedLayer}"`] : []),
        ];
        return {
          id,
          artifactLayer,
          expectedLayer,
          declaredLayer,
          file: path.relative(root, artifactFile),
          hasNestedRecord: Boolean(record),
          errors,
        };
      });
  }).sort((a, b) => `${a.id}:${a.artifactLayer}`.localeCompare(`${b.id}:${b.artifactLayer}`));
}

function crossLayerRows(artifacts, approvedCrossLayerArtifactIds) {
  const byId = artifacts.reduce((map, artifact) => {
    map.set(artifact.id, [...(map.get(artifact.id) ?? []), artifact.artifactLayer]);
    return map;
  }, new Map());
  return [...byId.entries()]
    .filter(([, layers]) => layers.length > 1)
    .map(([id, layers]) => ({
      id,
      layers: layers.sort(),
      approved: approvedCrossLayerArtifactIds.has(id),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function artifactNameSet(artifacts, artifactLayer) {
  return new Set(artifacts
    .filter((artifact) => artifact.artifactLayer === artifactLayer)
    .flatMap((artifact) => [artifact.id, artifact.id.replace(/-/g, " "), titleFromId(artifact.id)])
    .map(slug));
}

function templateRows(artifacts, decisions) {
  const templateArtifacts = artifacts.filter((artifact) => artifact.artifactLayer === "templates");
  const patternNames = artifactNameSet(artifacts, "patterns");
  const primitiveNames = artifactNameSet(artifacts, "primitives");
  const foundationNames = artifactNameSet(artifacts, "foundations");
  const templateDecisionIds = new Set(decisions
    .filter((decision) => decision.layer === "template")
    .map((decision) => decision.replacement));
  const blueprints = fs.existsSync(templateBlueprintsFile)
    ? readJson(templateBlueprintsFile)?.templates ?? {}
    : {};
  const catalogTemplates = fs.existsSync(templateCatalogFile)
    ? readJson(templateCatalogFile)?.templates ?? []
    : [];
  const catalogById = new Map(catalogTemplates.map((template) => [template.id, template]));
  const blueprintById = new Map(Object.entries(blueprints).map(([name, blueprint]) => [slug(name), {
    id: slug(name),
    name,
    blueprint,
  }]));

  return templateArtifacts.map((artifact) => {
    const template = artifact.hasNestedRecord
      ? readJson(path.join(root, artifact.file))?.artifacts?.templates?.[artifact.id] ?? {}
      : {};
    const blueprint = blueprintById.get(artifact.id);
    const patternDependencies = template.patternDependencies ?? [];
    const primitiveDependencies = template.primitiveDependencies ?? [];
    const foundationDependencies = template.governingFoundations ?? [];
    const templateModuleDependencies = template.templateModuleDependencies ?? [];
    const blueprintPatterns = blueprint?.blueprint?.patternDetails
      ? Object.keys(blueprint.blueprint.patternDetails)
      : [];
    const catalog = catalogById.get(artifact.id) ?? null;
    const catalogSyncErrors = [
      ...(JSON.stringify(catalog?.patternsUsed ?? []) === JSON.stringify(patternDependencies)
        ? []
        : ["catalog patternsUsed differs from artifact patternDependencies"]),
      ...(JSON.stringify(catalog?.templateModulesUsed ?? []) === JSON.stringify(templateModuleDependencies)
        ? []
        : ["catalog templateModulesUsed differs from artifact templateModuleDependencies"]),
    ];
    const dependencyErrors = [
      ...patternDependencies
        .filter((name) => !patternNames.has(slug(name)))
        .map((name) => `missing pattern dependency: ${name}`),
      ...primitiveDependencies
        .filter((name) => !primitiveNames.has(slug(name)))
        .map((name) => `missing primitive dependency: ${name}`),
      ...foundationDependencies
        .filter((name) => !foundationNames.has(slug(name)))
        .map((name) => `missing foundation dependency: ${name}`),
      ...blueprintPatterns
        .filter((name) => !patternNames.has(slug(name)))
        .map((name) => `blueprint references missing pattern: ${name}`),
    ];
    return {
      id: artifact.id,
      file: artifact.file,
      hasDecision: templateDecisionIds.has(artifact.id),
      hasBlueprint: Boolean(blueprint),
      patternDependencies,
      primitiveDependencies,
      foundationDependencies,
      templateModuleDependencies,
      catalogPatterns: catalog?.patternsUsed ?? null,
      catalogTemplateModules: catalog?.templateModulesUsed ?? null,
      blueprintPatterns,
      dependencyErrors,
      catalogSyncErrors,
    };
  }).sort((a, b) => a.id.localeCompare(b.id));
}

function missingBlueprintRows(artifacts) {
  const templateArtifactIds = new Set(artifacts
    .filter((artifact) => artifact.artifactLayer === "templates")
    .map((artifact) => artifact.id));
  if (!fs.existsSync(templateBlueprintsFile)) return [];
  const blueprints = readJson(templateBlueprintsFile)?.templates ?? {};
  return Object.keys(blueprints)
    .map((name) => ({
      id: slug(name),
      name,
      hasArtifact: templateArtifactIds.has(slug(name)),
    }))
    .filter((blueprint) => !blueprint.hasArtifact);
}

function singularLayer(artifactLayer) {
  return artifactLayer.replace(/s$/, "");
}

function requiredBoundaryRows(artifacts, decisions, requiredBoundaryCases) {
  const artifactById = artifacts.reduce((map, artifact) => {
    map.set(artifact.id, [...(map.get(artifact.id) ?? []), artifact]);
    return map;
  }, new Map());
  const decisionById = new Map(decisions.map((decision) => [decision.id, decision]));

  return requiredBoundaryCases.map((boundaryCase) => {
    if (boundaryCase.source === "taxonomy-decision") {
      const decision = decisionById.get(boundaryCase.id) ?? null;
      const errors = [
        ...(!decision ? ["missing taxonomy decision"] : []),
        ...(decision && decision.layer !== boundaryCase.layer ? [`decision layer "${decision.layer}" should be "${boundaryCase.layer}"`] : []),
        ...(decision && boundaryCase.replacement && decision.replacement !== boundaryCase.replacement
          ? [`decision replacement "${decision.replacement}" should be "${boundaryCase.replacement}"`]
          : []),
      ];
      return {
        ...boundaryCase,
        actualLayer: decision?.layer ?? null,
        actualSource: decision ? "taxonomy-decision" : null,
        actualReplacement: decision?.replacement ?? null,
        file: taxonomyFile ? path.relative(root, taxonomyFile) : null,
        errors,
      };
    }

    const matches = artifactById.get(boundaryCase.id) ?? [];
    const matchingArtifact = matches.find((artifact) => singularLayer(artifact.artifactLayer) === boundaryCase.layer) ?? null;
    const actualLayers = matches.map((artifact) => singularLayer(artifact.artifactLayer)).sort();
    const errors = [
      ...(!matchingArtifact ? [`missing ${boundaryCase.layer} artifact`] : []),
      ...(matches.length && !actualLayers.includes(boundaryCase.layer)
        ? [`artifact layers "${actualLayers.join(", ")}" should include "${boundaryCase.layer}"`]
        : []),
    ];
    return {
      ...boundaryCase,
      actualLayer: matchingArtifact ? singularLayer(matchingArtifact.artifactLayer) : actualLayers.join(", ") || null,
      actualSource: matchingArtifact ? "artifact" : null,
      actualReplacement: null,
      file: matchingArtifact?.file ?? null,
      errors,
    };
  }).sort((a, b) => `${a.layer}:${a.id}`.localeCompare(`${b.layer}:${b.id}`));
}

function createReport() {
  result.errors.length = 0;
  result.warnings.length = 0;
  result.info.length = 0;
  result.status = "pass";
  checkTaxonomyBoundaries();
  const taxonomy = readJson(taxonomyFile) ?? {};
  const expectedInventory = taxonomy.expectedInventory ?? {};
  const approvedCrossLayerArtifactIds = new Set(taxonomy.approvedCrossLayerArtifactIds ?? []);
  const policyIssues = taxonomyPolicyIssues(taxonomy);
  const decisions = taxonomy.decisions ?? [];
  const counts = layerCounts(decisions);
  const duplicates = duplicateIds(decisions);
  const artifacts = artifactRows();
  const crossLayerArtifacts = crossLayerRows(artifacts, approvedCrossLayerArtifactIds);
  const templates = templateRows(artifacts, decisions);
  const templateBlueprintsWithoutArtifacts = missingBlueprintRows(artifacts);
  const boundaryRows = requiredBoundaryRows(artifacts, decisions, taxonomy.requiredBoundaryCases ?? []);
  const artifactLayerMismatches = artifacts.filter((artifact) => artifact.hasNestedRecord && artifact.declaredLayer !== artifact.expectedLayer);
  const missingNestedArtifactRecords = artifacts.filter((artifact) => !artifact.hasNestedRecord);
  const inventory = {
    rules: (taxonomy.rules ?? []).length,
    decisions: decisions.length,
    patternDecisions: counts.pattern ?? 0,
    templateDecisions: counts.template ?? 0,
    nonComponentDecisions: counts["non-component"] ?? 0,
    artifactsScanned: artifacts.length,
    crossLayerArtifactIds: crossLayerArtifacts.length,
    unapprovedCrossLayerArtifactIds: crossLayerArtifacts.filter((artifact) => !artifact.approved).length,
    artifactLayerMismatches: artifactLayerMismatches.length,
    missingNestedArtifactRecords: missingNestedArtifactRecords.length,
    templateArtifactsWithoutDecisions: templates.filter((template) => !template.hasDecision).length,
    templateBlueprintsWithoutArtifacts: templateBlueprintsWithoutArtifacts.length,
    templateArtifactBlueprintMismatches: templates.filter((template) => !template.hasBlueprint).length,
    templateDependencyReferenceErrors: templates.reduce((sum, template) => sum + template.dependencyErrors.length, 0),
    templateCatalogSyncErrors: templates.reduce((sum, template) => sum + template.catalogSyncErrors.length, 0),
    requiredBoundaryCases: boundaryRows.length,
    requiredBoundaryCaseViolations: boundaryRows.reduce((sum, boundary) => sum + boundary.errors.length, 0),
    foundationBoundaryCases: boundaryRows.filter((boundary) => boundary.layer === "foundation").length,
    primitiveBoundaryCases: boundaryRows.filter((boundary) => boundary.layer === "primitive").length,
    componentBoundaryCases: boundaryRows.filter((boundary) => boundary.layer === "component").length,
    patternBoundaryCases: boundaryRows.filter((boundary) => boundary.layer === "pattern").length,
    templateBoundaryCases: boundaryRows.filter((boundary) => boundary.layer === "template").length,
    nonComponentBoundaryCases: boundaryRows.filter((boundary) => boundary.layer === "non-component").length,
    duplicateIds: duplicates.length,
    auditErrors: result.errors.length,
    taxonomyPolicyIssues: policyIssues.length,
  };
  inventory.taxonomyBoundaryDebt = inventory.duplicateIds
    + inventory.unapprovedCrossLayerArtifactIds
    + inventory.artifactLayerMismatches
    + inventory.missingNestedArtifactRecords
    + inventory.templateArtifactsWithoutDecisions
    + inventory.templateBlueprintsWithoutArtifacts
    + inventory.templateArtifactBlueprintMismatches
    + inventory.templateDependencyReferenceErrors
    + inventory.templateCatalogSyncErrors
    + inventory.requiredBoundaryCaseViolations
    + inventory.auditErrors
    + inventory.taxonomyPolicyIssues;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  inventory.taxonomyBoundaryDebt += baselineMismatches.length + unexpectedInventoryMetrics.length;
  return {
    status: inventory.taxonomyBoundaryDebt ? "fail" : "pass",
    audit: "taxonomy boundaries",
    principle: "Component, primitive, pattern, and template boundaries must stay explicit so orchestration and business surfaces do not re-enter Flow as fake components. The actionable debt metric is taxonomyBoundaryDebt.",
    taxonomyFile: path.relative(root, taxonomyFile),
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    inventory,
    rules: taxonomy.rules ?? [],
    decisions,
    approvedCrossLayerArtifactIds: [...approvedCrossLayerArtifactIds].sort(),
    taxonomyPolicyIssues: policyIssues,
    artifacts,
    crossLayerArtifacts,
    templates,
    templateBlueprintsWithoutArtifacts,
    requiredBoundaryCases: boundaryRows,
    artifactLayerMismatches,
    missingNestedArtifactRecords,
    duplicateIds: duplicates,
    errors: result.errors,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const decisionRows = report.decisions
    .map((decision) => `| ${decision.id} | ${decision.layer} | ${decision.replacement} | ${decision.reason} |`);
  const crossLayerRows = report.crossLayerArtifacts
    .map((artifact) => `| ${artifact.id} | ${artifact.layers.join(", ")} | ${artifact.approved ? "yes" : "no"} |`);
  const artifactErrorRows = report.artifacts
    .filter((artifact) => artifact.errors.length)
    .map((artifact) => `| ${artifact.file} | ${artifact.id} | ${artifact.artifactLayer} | ${artifact.errors.join("; ")} |`);
  const templateRows = report.templates
    .map((template) => `| ${template.id} | ${template.hasDecision ? "yes" : "no"} | ${template.hasBlueprint ? "yes" : "no"} | ${template.patternDependencies.join(", ") || "-"} | ${template.templateModuleDependencies.join(", ") || "-"} | ${template.primitiveDependencies.join(", ") || "-"} | ${template.foundationDependencies.join(", ") || "-"} | ${template.dependencyErrors.join("; ") || "-"} | ${template.catalogSyncErrors.join("; ") || "-"} |`);
  const missingBlueprintRows = report.templateBlueprintsWithoutArtifacts
    .map((blueprint) => `| ${blueprint.name} | ${blueprint.id} |`);
  const boundaryRows = report.requiredBoundaryCases
    .map((boundary) => `| ${boundary.id} | ${boundary.layer} | ${boundary.source} | ${boundary.actualLayer || "-"} | ${boundary.actualReplacement || "-"} | ${boundary.file || "-"} | ${boundary.errors.join("; ") || "-"} | ${boundary.reason} |`);
  const errorRows = report.errors
    .map((error) => `| ${error.file}:${error.line} | ${error.message} |`);
  return [
    "# Taxonomy Boundaries Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Taxonomy file: ${report.taxonomyFile}`,
    `- Rules: ${report.inventory.rules}`,
    `- Decisions: ${report.inventory.decisions}`,
    `- Pattern decisions: ${report.inventory.patternDecisions}`,
    `- Template decisions: ${report.inventory.templateDecisions}`,
    `- Non-component decisions: ${report.inventory.nonComponentDecisions}`,
    `- Artifacts scanned: ${report.inventory.artifactsScanned}`,
    `- Cross-layer artifact ids: ${report.inventory.crossLayerArtifactIds}`,
    `- Unapproved cross-layer artifact ids: ${report.inventory.unapprovedCrossLayerArtifactIds}`,
    `- Artifact layer mismatches: ${report.inventory.artifactLayerMismatches}`,
    `- Missing nested artifact records: ${report.inventory.missingNestedArtifactRecords}`,
    `- Template artifacts without decisions: ${report.inventory.templateArtifactsWithoutDecisions}`,
    `- Template blueprints without artifacts: ${report.inventory.templateBlueprintsWithoutArtifacts}`,
    `- Template artifact/blueprint mismatches: ${report.inventory.templateArtifactBlueprintMismatches}`,
    `- Template dependency reference errors: ${report.inventory.templateDependencyReferenceErrors}`,
    `- Template catalog sync errors: ${report.inventory.templateCatalogSyncErrors}`,
    `- Required boundary cases: ${report.inventory.requiredBoundaryCases}`,
    `- Required boundary case violations: ${report.inventory.requiredBoundaryCaseViolations}`,
    `- Foundation boundary cases: ${report.inventory.foundationBoundaryCases}`,
    `- Primitive boundary cases: ${report.inventory.primitiveBoundaryCases}`,
    `- Component boundary cases: ${report.inventory.componentBoundaryCases}`,
    `- Pattern boundary cases: ${report.inventory.patternBoundaryCases}`,
    `- Template boundary cases: ${report.inventory.templateBoundaryCases}`,
    `- Non-component boundary cases: ${report.inventory.nonComponentBoundaryCases}`,
    `- Duplicate ids: ${report.inventory.duplicateIds}`,
    `- Audit errors: ${report.inventory.auditErrors}`,
    `- Taxonomy policy issues: ${report.inventory.taxonomyPolicyIssues}`,
    `- Taxonomy boundary debt: ${report.inventory.taxonomyBoundaryDebt}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    `- Unexpected inventory metrics: ${report.baseline.unexpectedInventoryMetrics.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. Additions or removals must be reviewed as taxonomy changes, not component implementation churn.",
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
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None |"]),
    "",
    "## Decisions",
    "",
    "| Id | Layer | Replacement | Reason |",
    "| --- | --- | --- | --- |",
    ...decisionRows,
    "",
    "## Artifact Layer Scan",
    "",
    `Approved cross-layer artifact ids: ${report.approvedCrossLayerArtifactIds.join(", ") || "None"}. Policy issues: ${report.taxonomyPolicyIssues.length}.`,
    "",
    "| Id | Artifact Layers | Approved |",
    "| --- | --- | --- |",
    ...(crossLayerRows.length ? crossLayerRows : ["| None | None | None |"]),
    "",
    "## Artifact Errors",
    "",
    "| File | Id | Artifact Layer | Error |",
    "| --- | --- | --- | --- |",
    ...(artifactErrorRows.length ? artifactErrorRows : ["| None | None | None | None |"]),
    "",
    "## Template Dependency Scan",
    "",
    "| Template | Decision | Blueprint | Pattern Dependencies | Template Modules | Primitive Dependencies | Foundations | Reference Errors | Catalog Sync Errors |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...templateRows,
    "",
    "## Template Blueprints Without Artifacts",
    "",
    "| Blueprint | Expected Id |",
    "| --- | --- |",
    ...(missingBlueprintRows.length ? missingBlueprintRows : ["| None | None |"]),
    "",
    "## Required Boundary Cases",
    "",
    "These are explicit guardrails for names that commonly drift between foundations, primitives, components, patterns, and templates. Surface is intentionally primitive; Card is intentionally component.",
    "",
    "| Id | Expected Layer | Source | Actual Layer | Actual Replacement | File | Errors | Reason |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...boundaryRows,
    "",
    "## Errors",
    "",
    "| Location | Message |",
    "| --- | --- |",
    ...(errorRows.length ? errorRows : ["| None | None |"]),
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
      console.error("Taxonomy boundaries report is stale. Run: node packages/audit/scripts/report-taxonomy-boundaries.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    decisions: report.inventory.decisions,
    patternDecisions: report.inventory.patternDecisions,
    templateDecisions: report.inventory.templateDecisions,
    nonComponentDecisions: report.inventory.nonComponentDecisions,
    artifactsScanned: report.inventory.artifactsScanned,
    crossLayerArtifactIds: report.inventory.crossLayerArtifactIds,
    unapprovedCrossLayerArtifactIds: report.inventory.unapprovedCrossLayerArtifactIds,
    artifactLayerMismatches: report.inventory.artifactLayerMismatches,
    missingNestedArtifactRecords: report.inventory.missingNestedArtifactRecords,
    templateArtifactsWithoutDecisions: report.inventory.templateArtifactsWithoutDecisions,
    templateBlueprintsWithoutArtifacts: report.inventory.templateBlueprintsWithoutArtifacts,
    templateArtifactBlueprintMismatches: report.inventory.templateArtifactBlueprintMismatches,
    templateDependencyReferenceErrors: report.inventory.templateDependencyReferenceErrors,
    templateCatalogSyncErrors: report.inventory.templateCatalogSyncErrors,
    requiredBoundaryCases: report.inventory.requiredBoundaryCases,
    requiredBoundaryCaseViolations: report.inventory.requiredBoundaryCaseViolations,
    foundationBoundaryCases: report.inventory.foundationBoundaryCases,
    primitiveBoundaryCases: report.inventory.primitiveBoundaryCases,
    componentBoundaryCases: report.inventory.componentBoundaryCases,
    patternBoundaryCases: report.inventory.patternBoundaryCases,
    templateBoundaryCases: report.inventory.templateBoundaryCases,
    nonComponentBoundaryCases: report.inventory.nonComponentBoundaryCases,
    auditErrors: report.inventory.auditErrors,
    taxonomyBoundaryDebt: report.inventory.taxonomyBoundaryDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
