#!/usr/bin/env node

const { fs, path, readJson, root, result } = require("./audit-context.js");
const { checkTaxonomyBoundaries } = require("./audit-taxonomy-boundaries.js");

const checkMode = process.argv.includes("--check");
const taxonomyFile = path.join(root, "packages/content/content/taxonomy-boundaries.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "taxonomy-boundaries-audit.json");
const markdownOutput = path.join(outputDir, "taxonomy-boundaries-audit.md");

const expectedInventory = {
  rules: 5,
  decisions: 11,
  patternDecisions: 10,
  templateDecisions: 0,
  nonComponentDecisions: 1,
  duplicateIds: 0,
  auditErrors: 0,
};

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

function createReport() {
  result.errors.length = 0;
  result.warnings.length = 0;
  result.info.length = 0;
  result.status = "pass";
  checkTaxonomyBoundaries();
  const taxonomy = readJson(taxonomyFile) ?? {};
  const decisions = taxonomy.decisions ?? [];
  const counts = layerCounts(decisions);
  const duplicates = duplicateIds(decisions);
  const inventory = {
    rules: (taxonomy.rules ?? []).length,
    decisions: decisions.length,
    patternDecisions: counts.pattern ?? 0,
    templateDecisions: counts.template ?? 0,
    nonComponentDecisions: counts["non-component"] ?? 0,
    duplicateIds: duplicates.length,
    auditErrors: result.errors.length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  return {
    status: result.errors.length || baselineMismatches.length ? "fail" : "pass",
    audit: "taxonomy boundaries",
    principle: "Component, primitive, pattern, and template boundaries must stay explicit so orchestration and business surfaces do not re-enter Flow as fake components.",
    taxonomyFile: path.relative(root, taxonomyFile),
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    inventory,
    rules: taxonomy.rules ?? [],
    decisions,
    duplicateIds: duplicates,
    errors: result.errors,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const decisionRows = report.decisions
    .map((decision) => `| ${decision.id} | ${decision.layer} | ${decision.replacement} | ${decision.reason} |`);
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
    `- Duplicate ids: ${report.inventory.duplicateIds}`,
    `- Audit errors: ${report.inventory.auditErrors}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
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
    "## Decisions",
    "",
    "| Id | Layer | Replacement | Reason |",
    "| --- | --- | --- | --- |",
    ...decisionRows,
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
    nonComponentDecisions: report.inventory.nonComponentDecisions,
    auditErrors: report.inventory.auditErrors,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
