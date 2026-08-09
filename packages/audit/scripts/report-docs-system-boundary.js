#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const docsRoot = fs.existsSync(path.join(root, "../FlowDocs"))
  ? path.join(root, "../FlowDocs")
  : path.join(root, "apps/docs/../..");
const docsPackageFile = path.join(docsRoot, "package.json");
const docsAppDir = path.join(docsRoot, "apps/docs");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "docs-system-boundary-audit.json");
const markdownOutput = path.join(outputDir, "docs-system-boundary-audit.md");

const requiredFlowAliases = [
  "#design-system/components",
  "#design-system/react",
  "#design-system/components-css",
  "#design-system/tokens-css",
  "#design-system/content/catalog",
  "#design-system/content/component-docs",
  "#design-system/content/component-copy",
  "#design-system/content/pattern-copy",
  "#design-system/content/component-implementation-status",
  "#design-system/content/foundation-copy",
  "#design-system/content/primitive-copy",
  "#design-system/content/reference-copy",
  "#design-system/content/template-blueprints",
  "#design-system/content/home",
  "#design-system/content/i18n-ui",
  "#design-system/specs/system",
  "#design-system/specs/foundations/*",
  "#design-system/specs/primitives/*",
];

const expectedInventory = {
  sourceFilesScanned: 203,
  generatedFiles: 192,
  flowDependencyPresent: 1,
  flowBoundaryAliases: 18,
  missingFlowAliases: 0,
  localFlowImportViolations: 0,
  docsComponentTokenDefinitions: 0,
  docsComponentTokenDefinitionFiles: 0,
  generatedComponentCssPresent: 1,
  generatedTokenCssPresent: 1,
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(file, predicate));
    else if (predicate(file)) out.push(file);
  }
  return out.sort();
}

function relative(file) {
  return path.relative(root, file);
}

function isGeneratedOrVendor(file) {
  return file.includes(`${path.sep}generated${path.sep}`) || file.includes(`${path.sep}vendor${path.sep}`);
}

function sourceFiles() {
  return walkFiles(docsAppDir, (file) => /\.(?:js|css|html)$/.test(file) && !isGeneratedOrVendor(file));
}

function generatedFiles() {
  return walkFiles(path.join(docsAppDir, "generated"), (file) => fs.statSync(file).isFile());
}

function componentTokenDefinitions(files) {
  const definitions = [];
  for (const file of files.filter((item) => item.endsWith(".css"))) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/--comp-[a-z0-9-]+\s*:/g)) {
      definitions.push({
        file: relative(file),
        line: text.slice(0, match.index).split("\n").length,
        token: match[0].replace(":", ""),
      });
    }
  }
  return definitions;
}

function localFlowImportViolations(files) {
  const violations = [];
  const forbidden = /(?:\.\.\/Flow3\.0|packages\/(?:components|react|tokens|specs|content)|#design-system\/docs)/g;
  for (const file of files.filter((item) => /\.(?:js|html)$/.test(item))) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(forbidden)) {
      violations.push({
        file: relative(file),
        line: text.slice(0, match.index).split("\n").length,
        value: match[0],
      });
    }
  }
  return violations;
}

function createReport() {
  const pkg = readJson(docsPackageFile) ?? {};
  const imports = pkg.imports ?? {};
  const scanned = sourceFiles();
  const generated = generatedFiles();
  const missingFlowAliases = requiredFlowAliases.filter((alias) => !imports[alias]);
  const nonFlowAliases = Object.entries(imports)
    .filter(([alias, target]) => alias.startsWith("#design-system/") && typeof target === "string" && !target.startsWith("flow/"))
    .map(([alias, target]) => ({ alias, target }));
  const tokenDefinitions = componentTokenDefinitions(scanned);
  const importViolations = localFlowImportViolations(scanned);
  const inventory = {
    sourceFilesScanned: scanned.length,
    generatedFiles: generated.length,
    flowDependencyPresent: pkg.dependencies?.flow ? 1 : 0,
    flowBoundaryAliases: Object.entries(imports).filter(([alias, target]) => alias.startsWith("#design-system/") && typeof target === "string" && target.startsWith("flow/")).length,
    missingFlowAliases: missingFlowAliases.length,
    localFlowImportViolations: importViolations.length + nonFlowAliases.length,
    docsComponentTokenDefinitions: tokenDefinitions.length,
    docsComponentTokenDefinitionFiles: new Set(tokenDefinitions.map((item) => item.file)).size,
    generatedComponentCssPresent: fs.existsSync(path.join(docsAppDir, "generated/components.css")) ? 1 : 0,
    generatedTokenCssPresent: fs.existsSync(path.join(docsAppDir, "generated/tokens.css")) ? 1 : 0,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  return {
    status: baselineMismatches.length ? "fail" : "pass",
    audit: "docs system boundary",
    principle: "FlowDocs must consume Flow through package exports and generated assets; any docs-owned component tokens or missing aliases are tracked debt, not invisible system behavior.",
    docsRoot: relative(docsRoot),
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    missingFlowAliases,
    nonFlowAliases,
    localFlowImportViolations: importViolations,
    docsComponentTokenDefinitions: tokenDefinitions,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const missingAliasRows = report.missingFlowAliases.map((alias) => `| ${alias} |`);
  const tokenRows = report.docsComponentTokenDefinitions
    .slice(0, 80)
    .map((item) => `| ${item.file}:${item.line} | ${item.token} |`);
  return [
    "# Docs System Boundary Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Docs root: ${report.docsRoot}`,
    `- Source files scanned: ${report.inventory.sourceFilesScanned}`,
    `- Generated files: ${report.inventory.generatedFiles}`,
    `- Flow dependency present: ${report.inventory.flowDependencyPresent}`,
    `- Flow boundary aliases: ${report.inventory.flowBoundaryAliases}`,
    `- Missing Flow aliases: ${report.inventory.missingFlowAliases}`,
    `- Local Flow import violations: ${report.inventory.localFlowImportViolations}`,
    `- Docs component token definitions: ${report.inventory.docsComponentTokenDefinitions}`,
    `- Docs component token definition files: ${report.inventory.docsComponentTokenDefinitionFiles}`,
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
    "## Missing Flow Aliases",
    "",
    "| Alias |",
    "| --- |",
    ...(missingAliasRows.length ? missingAliasRows : ["| None |"]),
    "",
    "## Docs Component Token Definitions",
    "",
    "| Location | Token |",
    "| --- | --- |",
    ...(tokenRows.length ? tokenRows : ["| None | None |"]),
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
      console.error("Docs system boundary report is stale. Run: node packages/audit/scripts/report-docs-system-boundary.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    sourceFilesScanned: report.inventory.sourceFilesScanned,
    generatedFiles: report.inventory.generatedFiles,
    missingFlowAliases: report.inventory.missingFlowAliases,
    docsComponentTokenDefinitions: report.inventory.docsComponentTokenDefinitions,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
