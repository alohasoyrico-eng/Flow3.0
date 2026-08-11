#!/usr/bin/env node

const {
  fs,
  foundations,
  path,
  patternArtifacts: patternIds,
  primitiveNames,
  readJson,
  root,
  slug,
  templateArtifacts: templateIds,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const packageFile = path.join(root, "package.json");
const tokenFile = path.join(root, "packages/tokens/tokens.json");
const tokenCssFile = path.join(root, "packages/tokens/styles/tokens.css");
const governanceFile = path.join(root, "packages/content/content/foundation-primitive-export-governance.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "foundation-primitive-export-contract-audit.json");
const markdownOutput = path.join(outputDir, "foundation-primitive-export-contract-audit.md");

const governance = readJson(governanceFile) ?? {};
const expectedInventory = governance.expectedInventory && typeof governance.expectedInventory === "object"
  ? governance.expectedInventory
  : {};
const requiredPackageExports = Array.isArray(governance.requiredPackageExports)
  ? governance.requiredPackageExports
  : [];

function exportGovernanceIssues() {
  const issues = [];
  if (typeof governance.principle !== "string" || !governance.principle.trim()) {
    issues.push("principle must describe why JSON exportability is required");
  }
  if (!Array.isArray(governance.requiredPackageExports) || !governance.requiredPackageExports.length) {
    issues.push("requiredPackageExports must not be empty");
  }
  for (const exportPath of requiredPackageExports) {
    if (typeof exportPath !== "string" || !exportPath.startsWith("./")) {
      issues.push(`invalid requiredPackageExport: ${exportPath}`);
    }
  }
  if (!governance.expectedInventory || typeof governance.expectedInventory !== "object") {
    issues.push("expectedInventory must be an object");
  }
  for (const [key, expected] of Object.entries(expectedInventory)) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key) || !Number.isInteger(expected) || expected < 0) {
      issues.push(`invalid expectedInventory entry: ${key}`);
    }
  }
  return issues;
}

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

function validateArtifactIds(layer, ids) {
  return ids.map((id) => {
    const file = artifactPath(layer, id);
    const exists = fs.existsSync(file);
    const record = exists ? artifactRecord(layer, id) : null;
    const shapeErrors = [];
    if (!exists) shapeErrors.push("missing artifact file");
    if (exists && !record) shapeErrors.push("missing nested artifact record");
    if (record && record.layer?.toLowerCase() !== layer.replace(/s$/, "")) shapeErrors.push("artifact layer does not match artifact directory");
    if (record && !record.purpose) shapeErrors.push("missing purpose");
    return {
      id,
      name: record?.name ?? id,
      file: path.relative(root, file),
      exists,
      shapeErrors,
    };
  });
}

function exportTargetFor(packageExports, subpath) {
  if (typeof packageExports[subpath] === "string") return packageExports[subpath];
  if (packageExports[subpath]?.default) return packageExports[subpath].default;
  for (const [exportPath, target] of Object.entries(packageExports)) {
    if (!exportPath.includes("*")) continue;
    const [prefix, suffix = ""] = exportPath.split("*");
    if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue;
    const wildcard = subpath.slice(prefix.length, subpath.length - suffix.length);
    if (!wildcard) continue;
    const rawTarget = typeof target === "string" ? target : target?.default;
    if (!rawTarget?.includes("*")) continue;
    return rawTarget.replace("*", wildcard);
  }
  return null;
}

function exportedArtifactRows(layer, names, packageExports) {
  return names.map((name) => {
    const id = slug(name);
    const subpath = `./specs/${layer}/${id}`;
    const target = exportTargetFor(packageExports, subpath);
    const expectedSuffix = `packages/specs/specs/unison-system/artifacts/${layer}/${id}.json`;
    const absoluteTarget = target ? path.join(root, target) : null;
    const json = absoluteTarget && fs.existsSync(absoluteTarget) ? readJson(absoluteTarget) : null;
    const record = json?.artifacts?.[layer]?.[id] ?? null;
    const errors = [];
    if (!target) errors.push("missing package subpath export");
    if (target && target.replace(/^\.\//, "") !== expectedSuffix) errors.push(`export target must resolve to ${expectedSuffix}`);
    if (target && !fs.existsSync(absoluteTarget)) errors.push("export target file missing");
    if (json && !record) errors.push("exported JSON missing nested artifact record");
    if (record && record.name !== name) errors.push("exported artifact name does not match meta inventory");
    return {
      id,
      name,
      subpath,
      target,
      valid: errors.length === 0,
      errors,
    };
  });
}

function exportedArtifactIdRows(layer, ids, packageExports) {
  return ids.map((id) => {
    const subpath = `./specs/${layer}/${id}`;
    const target = exportTargetFor(packageExports, subpath);
    const expectedSuffix = `packages/specs/specs/unison-system/artifacts/${layer}/${id}.json`;
    const absoluteTarget = target ? path.join(root, target) : null;
    const json = absoluteTarget && fs.existsSync(absoluteTarget) ? readJson(absoluteTarget) : null;
    const record = json?.artifacts?.[layer]?.[id] ?? null;
    const errors = [];
    if (!target) errors.push("missing package subpath export");
    if (target && target.replace(/^\.\//, "") !== expectedSuffix) errors.push(`export target must resolve to ${expectedSuffix}`);
    if (target && !fs.existsSync(absoluteTarget)) errors.push("export target file missing");
    if (json && !record) errors.push("exported JSON missing nested artifact record");
    if (record && record.layer?.toLowerCase() !== layer.replace(/s$/, "")) errors.push("exported artifact layer does not match subpath layer");
    return {
      id,
      name: record?.name ?? id,
      subpath,
      target,
      valid: errors.length === 0,
      errors,
    };
  });
}

function createReport() {
  const pkg = readJson(packageFile) ?? {};
  const tokenContract = readJson(tokenFile) ?? {};
  const foundationArtifacts = validateArtifacts("foundations", foundations);
  const primitiveArtifacts = validateArtifacts("primitives", primitiveNames);
  const patternArtifacts = validateArtifactIds("patterns", patternIds);
  const templateArtifacts = validateArtifactIds("templates", templateIds);
  const packageExports = pkg.exports ?? {};
  const foundationSubpathExports = exportedArtifactRows("foundations", foundations, packageExports);
  const primitiveSubpathExports = exportedArtifactRows("primitives", primitiveNames, packageExports);
  const patternSubpathExports = exportedArtifactIdRows("patterns", patternIds, packageExports);
  const templateSubpathExports = exportedArtifactIdRows("templates", templateIds, packageExports);
  const missingPackageExports = requiredPackageExports.filter((exportPath) => !packageExports[exportPath]);
  const tokenNames = Object.keys(tokenContract.tokens ?? {});
  const tokenEntries = Object.entries(tokenContract.tokens ?? {});
  const tokenShapeErrors = tokenNames.filter((name) => {
    const token = tokenContract.tokens[name];
    return !token || token.value === undefined || !token.type || !token.cssVariable;
  });
  const tokenTypes = [...new Set(tokenEntries.map(([, token]) => token?.type).filter(Boolean))].sort();
  const tokenScopes = [...new Set(tokenEntries.map(([, token]) => token?.scope).filter(Boolean))].sort();
  const invalidTokenTransformFields = tokenEntries.filter(([name, token]) => {
    if (!token?.scope) return true;
    if (!/^--[a-z0-9-]+$/.test(token?.cssVariable ?? "")) return true;
    if (token.cssVariable !== `--${name}`) return true;
    if (token.cssReference && !/^--[a-z0-9-]+$/.test(token.cssReference)) return true;
    return false;
  });
  const invalidTokenTypeValues = tokenEntries.filter(([name, token]) => {
    const value = String(token?.value ?? "");
    if (token?.type === "unknown") return true;
    if (token?.type === "color" && /\b(solid|dashed|dotted)\b/.test(value)) return true;
    if (token?.type === "color" && /(?:^|-)offset(?:-|$)/.test(name)) return true;
    if (token?.type === "number" && /(?:px|rem|em|%|vh|vw|deg|m?s)$/.test(value)) return true;
    if (token?.type === "duration" && !/(?:^var\(--|m?s$|^calc\()/.test(value)) return true;
    if (token?.type === "border" && !/(?:^var\(--|\b(solid|dashed|dotted)\b)/.test(value)) return true;
    if (token?.type === "fontVariationSettings" && !/(?:^var\(--|"[A-Z]{4}")/.test(value)) return true;
    return false;
  });
  const inventory = {
    foundations: foundations.length,
    primitives: primitiveNames.length,
    patterns: patternIds.length,
    templates: templateIds.length,
    tokenCount: tokenNames.length,
    tokenTypes: tokenTypes.length,
    tokenScopes: tokenScopes.length,
    tokensWithScope: tokenEntries.filter(([, token]) => token?.scope).length,
    tokensWithCssVariable: tokenEntries.filter(([, token]) => token?.cssVariable).length,
    tokensWithCssReference: tokenEntries.filter(([, token]) => token?.cssReference).length,
    unknownTokenTypes: tokenEntries.filter(([, token]) => token?.type === "unknown").length,
    invalidTokenTransformFields: invalidTokenTransformFields.length,
    invalidTokenTypeValues: invalidTokenTypeValues.length,
    missingFoundationArtifacts: foundationArtifacts.filter((item) => !item.exists).length,
    missingPrimitiveArtifacts: primitiveArtifacts.filter((item) => !item.exists).length,
    missingPatternArtifacts: patternArtifacts.filter((item) => !item.exists).length,
    missingTemplateArtifacts: templateArtifacts.filter((item) => !item.exists).length,
    missingFoundationSubpathExports: foundationSubpathExports.filter((item) => !item.target).length,
    missingPrimitiveSubpathExports: primitiveSubpathExports.filter((item) => !item.target).length,
    missingPatternSubpathExports: patternSubpathExports.filter((item) => !item.target).length,
    missingTemplateSubpathExports: templateSubpathExports.filter((item) => !item.target).length,
    invalidFoundationSubpathExports: foundationSubpathExports.filter((item) => item.target && item.errors.length).length,
    invalidPrimitiveSubpathExports: primitiveSubpathExports.filter((item) => item.target && item.errors.length).length,
    invalidPatternSubpathExports: patternSubpathExports.filter((item) => item.target && item.errors.length).length,
    invalidTemplateSubpathExports: templateSubpathExports.filter((item) => item.target && item.errors.length).length,
    artifactShapeErrors: [...foundationArtifacts, ...primitiveArtifacts, ...patternArtifacts, ...templateArtifacts].filter((item) => item.shapeErrors.length).length + tokenShapeErrors.length + invalidTokenTransformFields.length + invalidTokenTypeValues.length,
    missingPackageExports: missingPackageExports.length,
    requirementFailures: 0,
    baselineMismatches: 0,
    unexpectedInventoryMetrics: 0,
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
  const governanceIssues = exportGovernanceIssues();
  inventory.requirementFailures = requirementFailures.length;
  inventory.exportGovernanceIssues = governanceIssues.length;
  inventory.foundationPrimitiveExportDebt = inventory.missingFoundationArtifacts
    + inventory.missingPrimitiveArtifacts
    + inventory.missingPatternArtifacts
    + inventory.missingTemplateArtifacts
    + inventory.missingFoundationSubpathExports
    + inventory.missingPrimitiveSubpathExports
    + inventory.missingPatternSubpathExports
    + inventory.missingTemplateSubpathExports
    + inventory.invalidFoundationSubpathExports
    + inventory.invalidPrimitiveSubpathExports
    + inventory.invalidPatternSubpathExports
    + inventory.invalidTemplateSubpathExports
    + inventory.unknownTokenTypes
    + inventory.artifactShapeErrors
    + inventory.missingPackageExports
    + inventory.requirementFailures
    + inventory.exportGovernanceIssues;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "baselineMismatches" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  inventory.baselineMismatches = baselineMismatches.length;
  inventory.unexpectedInventoryMetrics = unexpectedInventoryMetrics.length;
  inventory.foundationPrimitiveExportDebt += inventory.baselineMismatches + inventory.unexpectedInventoryMetrics;
  const status = inventory.foundationPrimitiveExportDebt ? "fail" : "pass";
  return {
    status,
    audit: "foundation primitive export contract",
    principle: `${governance.principle ?? "Foundations, primitives, patterns, and templates must be exportable as platform-agnostic JSON contracts, not only as CSS variables, internal files, or documentation views."} The actionable debt metric is foundationPrimitiveExportDebt.`,
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    requirements,
    requirementFailures,
    exportGovernance: {
      file: path.relative(root, governanceFile),
      issues: governanceIssues,
    },
    requiredPackageExports,
    missingPackageExports,
    foundationSubpathExports,
    primitiveSubpathExports,
    patternSubpathExports,
    templateSubpathExports,
    tokenContract: {
      file: path.relative(root, tokenFile),
      format: tokenContract.format ?? null,
      compatibleWith: tokenContract.compatibleWith ?? [],
      tokens: tokenNames.length,
      types: tokenTypes,
      scopes: tokenScopes,
      tokenShapeErrors: tokenShapeErrors.length,
      invalidTransformFields: invalidTokenTransformFields.map(([name]) => name),
      invalidTypeValues: invalidTokenTypeValues.map(([name]) => name),
    },
    foundations: foundationArtifacts,
    primitives: primitiveArtifacts,
    patterns: patternArtifacts,
    templates: templateArtifacts,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const requirementRows = Object.entries(report.requirements)
    .map(([key, passed]) => `| ${key} | ${passed ? "pass" : "fail"} |`);
  const exportRows = report.requiredPackageExports
    .map((exportPath) => `| ${exportPath} | ${report.missingPackageExports.includes(exportPath) ? "missing" : "present"} |`);
  const subpathRows = [...report.foundationSubpathExports, ...report.primitiveSubpathExports, ...report.patternSubpathExports, ...report.templateSubpathExports]
    .map((item) => `| ${item.subpath} | ${item.target ?? "missing"} | ${item.valid ? "pass" : item.errors.join("; ")} |`);
  const artifactRows = [...report.foundations, ...report.primitives, ...report.patterns, ...report.templates]
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
    `- Patterns: ${report.inventory.patterns}`,
    `- Templates: ${report.inventory.templates}`,
    `- Tokens: ${report.inventory.tokenCount}`,
    `- Token types: ${report.inventory.tokenTypes}`,
    `- Token scopes: ${report.inventory.tokenScopes}`,
    `- Tokens with scope: ${report.inventory.tokensWithScope}`,
    `- Tokens with CSS variable: ${report.inventory.tokensWithCssVariable}`,
    `- Tokens with CSS reference: ${report.inventory.tokensWithCssReference}`,
    `- Unknown token types: ${report.inventory.unknownTokenTypes}`,
    `- Invalid token transform fields: ${report.inventory.invalidTokenTransformFields}`,
    `- Invalid token type values: ${report.inventory.invalidTokenTypeValues}`,
    `- Missing foundation artifacts: ${report.inventory.missingFoundationArtifacts}`,
    `- Missing primitive artifacts: ${report.inventory.missingPrimitiveArtifacts}`,
    `- Missing pattern artifacts: ${report.inventory.missingPatternArtifacts}`,
    `- Missing template artifacts: ${report.inventory.missingTemplateArtifacts}`,
    `- Missing foundation subpath exports: ${report.inventory.missingFoundationSubpathExports}`,
    `- Missing primitive subpath exports: ${report.inventory.missingPrimitiveSubpathExports}`,
    `- Missing pattern subpath exports: ${report.inventory.missingPatternSubpathExports}`,
    `- Missing template subpath exports: ${report.inventory.missingTemplateSubpathExports}`,
    `- Invalid foundation subpath exports: ${report.inventory.invalidFoundationSubpathExports}`,
    `- Invalid primitive subpath exports: ${report.inventory.invalidPrimitiveSubpathExports}`,
    `- Invalid pattern subpath exports: ${report.inventory.invalidPatternSubpathExports}`,
    `- Invalid template subpath exports: ${report.inventory.invalidTemplateSubpathExports}`,
    `- Artifact shape errors: ${report.inventory.artifactShapeErrors}`,
    `- Missing package exports: ${report.inventory.missingPackageExports}`,
    `- Requirement failures: ${report.inventory.requirementFailures}`,
    `- Export governance issues: ${report.inventory.exportGovernanceIssues}`,
    `- Baseline mismatches: ${report.inventory.baselineMismatches}`,
    `- Unexpected inventory metrics: ${report.inventory.unexpectedInventoryMetrics}`,
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
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None |"]),
    "",
    "## Requirements",
    "",
    "| Requirement | Status |",
    "| --- | --- |",
    ...requirementRows,
    "",
    "## Token Transform Contract",
    "",
    "Every token must remain JSON-transformable: stable `type`, explicit `scope`, and a CSS variable name matching the token id. Unknown token types and obvious type/value mismatches are actionable debt.",
    "",
    `- Format: ${report.tokenContract.format}`,
    `- Compatible with: ${report.tokenContract.compatibleWith.join(", ") || "None"}`,
    `- Types: ${report.tokenContract.types.join(", ") || "None"}`,
    `- Scopes: ${report.tokenContract.scopes.join(", ") || "None"}`,
    `- Invalid transform fields: ${report.tokenContract.invalidTransformFields.length}`,
    `- Invalid type values: ${report.tokenContract.invalidTypeValues.length}`,
    "",
    "## Package Exports",
    "",
    `Governance file: ${report.exportGovernance.file}. Issues: ${report.exportGovernance.issues.length}.`,
    "",
    "| Export | Status |",
    "| --- | --- |",
    ...exportRows,
    "",
    "## Artifact Subpath Exports",
    "",
    "| Subpath | Target | Status |",
    "| --- | --- | --- |",
    ...subpathRows,
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
    patterns: report.inventory.patterns,
    templates: report.inventory.templates,
    tokens: report.inventory.tokenCount,
    missingPackageExports: report.inventory.missingPackageExports,
    artifactShapeErrors: report.inventory.artifactShapeErrors,
    missingFoundationSubpathExports: report.inventory.missingFoundationSubpathExports,
    missingPrimitiveSubpathExports: report.inventory.missingPrimitiveSubpathExports,
    missingPatternSubpathExports: report.inventory.missingPatternSubpathExports,
    missingTemplateSubpathExports: report.inventory.missingTemplateSubpathExports,
    invalidFoundationSubpathExports: report.inventory.invalidFoundationSubpathExports,
    invalidPrimitiveSubpathExports: report.inventory.invalidPrimitiveSubpathExports,
    invalidPatternSubpathExports: report.inventory.invalidPatternSubpathExports,
    invalidTemplateSubpathExports: report.inventory.invalidTemplateSubpathExports,
    requirementFailures: report.inventory.requirementFailures,
    foundationPrimitiveExportDebt: report.inventory.foundationPrimitiveExportDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
