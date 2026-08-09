#!/usr/bin/env node

const { fs, path, readJson, root, slug } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const packageFile = path.join(root, "package.json");
const tokenFile = path.join(root, "packages/tokens/tokens.json");
const tokenCssFile = path.join(root, "packages/tokens/styles/tokens.css");
const foundationsMetaFile = path.join(root, "packages/specs/specs/unison-system/meta/foundations.json");
const primitivesMetaFile = path.join(root, "packages/specs/specs/unison-system/meta/primitivefamilies.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "foundation-primitive-export-contract-audit.json");
const markdownOutput = path.join(outputDir, "foundation-primitive-export-contract-audit.md");

const expectedInventory = {
  foundations: 11,
  primitives: 22,
  tokenCount: 1078,
  missingFoundationArtifacts: 0,
  missingPrimitiveArtifacts: 0,
  artifactShapeErrors: 0,
  missingPackageExports: 0,
  requirementFailures: 0,
  baselineMismatches: 0,
  foundationPrimitiveExportDebt: 0,
};

const requiredPackageExports = [
  "./tokens.json",
  "./tokens/styles.css",
  "./specs/system",
  "./specs/foundations/*",
  "./specs/primitives/*",
  "./content/foundation-copy",
  "./content/primitive-copy",
];

function artifactPath(layer, id) {
  return path.join(root, `packages/specs/specs/unison-system/artifacts/${layer}/${id}.json`);
}

function artifactRecord(layer, id) {
  const file = artifactPath(layer, id);
  const json = readJson(file);
  return json?.artifacts?.[layer]?.[id] ?? null;
}

function validateArtifacts(layer, names) {
  return names.map((name) => {
    const id = slug(name);
    const file = artifactPath(layer, id);
    const exists = fs.existsSync(file);
    const record = exists ? artifactRecord(layer, id) : null;
    const shapeErrors = [];
    if (!exists) shapeErrors.push("missing artifact file");
    if (exists && !record) shapeErrors.push("missing nested artifact record");
    if (record && record.name !== name) shapeErrors.push("artifact name does not match meta inventory");
    if (record && !record.layer) shapeErrors.push("missing layer");
    if (record && !Array.isArray(record.requiredSections)) shapeErrors.push("missing requiredSections array");
    return {
      id,
      name,
      file: path.relative(root, file),
      exists,
      shapeErrors,
    };
  });
}

function createReport() {
  const pkg = readJson(packageFile) ?? {};
  const tokenContract = readJson(tokenFile) ?? {};
  const foundations = readJson(foundationsMetaFile)?.foundations ?? [];
  const primitives = readJson(primitivesMetaFile)?.primitiveFamilies ?? [];
  const foundationArtifacts = validateArtifacts("foundations", foundations);
  const primitiveArtifacts = validateArtifacts("primitives", primitives);
  const packageExports = pkg.exports ?? {};
  const missingPackageExports = requiredPackageExports.filter((exportPath) => !packageExports[exportPath]);
  const tokenNames = Object.keys(tokenContract.tokens ?? {});
  const tokenShapeErrors = tokenNames.filter((name) => {
    const token = tokenContract.tokens[name];
    return !token || token.value === undefined || !token.type || !token.cssVariable;
  });
  const inventory = {
    foundations: foundations.length,
    primitives: primitives.length,
    tokenCount: tokenNames.length,
    missingFoundationArtifacts: foundationArtifacts.filter((item) => !item.exists).length,
    missingPrimitiveArtifacts: primitiveArtifacts.filter((item) => !item.exists).length,
    artifactShapeErrors: [...foundationArtifacts, ...primitiveArtifacts].filter((item) => item.shapeErrors.length).length + tokenShapeErrors.length,
    missingPackageExports: missingPackageExports.length,
    requirementFailures: 0,
    baselineMismatches: 0,
  };
  const requirements = {
    tokenFormat: tokenContract.format === "flow-token-contract@1",
    styleDictionaryCompatible: Array.isArray(tokenContract.compatibleWith) && tokenContract.compatibleWith.includes("style-dictionary"),
    tokenJsonExists: fs.existsSync(tokenFile),
    tokenCssExists: fs.existsSync(tokenCssFile),
    packageIncludesSpecs: Array.isArray(pkg.files) && pkg.files.includes("packages/specs/specs"),
    packageIncludesTokens: Array.isArray(pkg.files) && pkg.files.includes("packages/tokens/tokens.json"),
    publicExportsPresent: missingPackageExports.length === 0,
  };
  const requirementFailures = Object.entries(requirements)
    .filter(([, passed]) => !passed)
    .map(([key]) => key);
  inventory.requirementFailures = requirementFailures.length;
  inventory.foundationPrimitiveExportDebt = inventory.missingFoundationArtifacts
    + inventory.missingPrimitiveArtifacts
    + inventory.artifactShapeErrors
    + inventory.missingPackageExports
    + inventory.requirementFailures;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "baselineMismatches" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  inventory.baselineMismatches = baselineMismatches.length;
  inventory.foundationPrimitiveExportDebt += inventory.baselineMismatches;
  const status = inventory.foundationPrimitiveExportDebt ? "fail" : "pass";
  return {
    status,
    audit: "foundation primitive export contract",
    principle: "Foundations and primitives must be exportable as platform-agnostic JSON contracts, not only as CSS variables or documentation views. The actionable debt metric is foundationPrimitiveExportDebt.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    requirements,
    requirementFailures,
    requiredPackageExports,
    missingPackageExports,
    tokenContract: {
      file: path.relative(root, tokenFile),
      format: tokenContract.format ?? null,
      compatibleWith: tokenContract.compatibleWith ?? [],
      tokens: tokenNames.length,
      tokenShapeErrors: tokenShapeErrors.length,
    },
    foundations: foundationArtifacts,
    primitives: primitiveArtifacts,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const requirementRows = Object.entries(report.requirements)
    .map(([key, passed]) => `| ${key} | ${passed ? "pass" : "fail"} |`);
  const exportRows = report.requiredPackageExports
    .map((exportPath) => `| ${exportPath} | ${report.missingPackageExports.includes(exportPath) ? "missing" : "present"} |`);
  const artifactRows = [...report.foundations, ...report.primitives]
    .map((item) => `| ${item.id} | ${item.name} | ${item.exists ? "yes" : "no"} | ${item.shapeErrors.length ? item.shapeErrors.join("; ") : "None"} |`);
  return [
    "# Foundation Primitive Export Contract Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Foundations: ${report.inventory.foundations}`,
    `- Primitives: ${report.inventory.primitives}`,
    `- Tokens: ${report.inventory.tokenCount}`,
    `- Missing foundation artifacts: ${report.inventory.missingFoundationArtifacts}`,
    `- Missing primitive artifacts: ${report.inventory.missingPrimitiveArtifacts}`,
    `- Artifact shape errors: ${report.inventory.artifactShapeErrors}`,
    `- Missing package exports: ${report.inventory.missingPackageExports}`,
    `- Requirement failures: ${report.inventory.requirementFailures}`,
    `- Baseline mismatches: ${report.inventory.baselineMismatches}`,
    `- Foundation primitive export debt: ${report.inventory.foundationPrimitiveExportDebt}`,
    "",
    "## Baseline Budget",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...baselineRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(mismatchRows.length ? mismatchRows : ["| None | None | None |"]),
    "",
    "## Requirements",
    "",
    "| Requirement | Status |",
    "| --- | --- |",
    ...requirementRows,
    "",
    "## Package Exports",
    "",
    "| Export | Status |",
    "| --- | --- |",
    ...exportRows,
    "",
    "## Artifacts",
    "",
    "| Id | Name | Exists | Shape Errors |",
    "| --- | --- | --- | --- |",
    ...artifactRows,
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
      console.error("Foundation primitive export contract report is stale. Run: node packages/audit/scripts/report-foundation-primitive-export-contract.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    foundations: report.inventory.foundations,
    primitives: report.inventory.primitives,
    tokens: report.inventory.tokenCount,
    missingPackageExports: report.inventory.missingPackageExports,
    artifactShapeErrors: report.inventory.artifactShapeErrors,
    requirementFailures: report.inventory.requirementFailures,
    foundationPrimitiveExportDebt: report.inventory.foundationPrimitiveExportDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
