#!/usr/bin/env node

const {
  fs,
  goldComponents,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { componentCssContractCoverage } = require("./audit-component-css-contracts.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const reactSrcIndexFile = path.join(reactSrcDir, "index.js");
const reactSrcTypesIndexFile = path.join(reactSrcDir, "index.d.ts");
const reactDistIndexFile = path.join(reactDistDir, "index.js");
const reactDistTypesIndexFile = path.join(reactDistDir, "index.d.ts");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-primary-coverage-audit.json");
const markdownOutput = path.join(outputDir, "react-primary-coverage-audit.md");

const expectedInventory = {
  expectedComponents: 56,
  components: 56,
  pass: 56,
  fail: 0,
  missingSources: 0,
  extraSources: 0,
  forwardRef: 56,
  realTypes: 56,
  platformContract: 56,
  densityResolved: 56,
  restSanitized: 56,
  noDocsDependency: 56,
  noDomFactory: 56,
  publishedImports: 56,
  cssContractCoverage: 56,
  directCssContracts: 52,
  familyCssContracts: 4,
  sourceIndexExport: 56,
  sourceTypesIndexExport: 56,
  distIndexExport: 56,
  distTypesIndexExport: 56,
};

function kebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function lowerFirst(value) {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function componentSourceFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir).filter((file) => /^[A-Z].*\.js$/.test(file)).sort();
}

function entrypointExports(source, component) {
  return new RegExp(`export\\s+\\{\\s*${component}\\s*\\}\\s+from\\s+["']\\./${component}\\.js["'];`).test(source);
}

function componentReport(file, cssCoverageByComponent, entrypoints) {
  const component = path.basename(file, ".js");
  const componentId = kebab(component);
  const cssCoverage = cssCoverageByComponent.get(componentId) ?? { coverage: "missing", contract: null };
  const typeFileName = `${component}.d.ts`;
  const sourceFile = path.join(reactSrcDir, file);
  const typesFile = path.join(reactSrcDir, typeFileName);
  const distFile = path.join(reactDistDir, file);
  const distTypesFile = path.join(reactDistDir, typeFileName);
  const source = readIfExists(sourceFile);
  const types = readIfExists(typesFile);
  const dist = readIfExists(distFile);
  const distTypes = readIfExists(distTypesFile);
  const contractName = `${lowerFirst(component)}PlatformContract`;
  const propsName = `${component}Props`;
  const componentName = `${component}Component`;
  const checks = {
    source: fs.existsSync(sourceFile),
    types: fs.existsSync(typesFile),
    dist: fs.existsSync(distFile),
    distTypes: fs.existsSync(distTypesFile),
    forwardRef: source.includes(`export const ${component} = forwardRef`) && source.includes("forwardRef(function"),
    realTypes: types.includes("ForwardRefExoticComponent")
      && types.includes("RefAttributes<")
      && (types.includes(`export interface ${propsName}`) || types.includes(`export type ${propsName}`))
      && types.includes(`export interface ${componentName}`),
    platformContract: source.includes(`${component}.platformContract = ${contractName}`)
      && types.includes(`platformContract: typeof ${contractName}`),
    densityResolved: source.includes("const resolvedDensity = normalizeFlowDensity(density)")
      && source.includes("flowDensityProps(resolvedDensity)")
      && !source.includes("flowDensityProps(density)")
      && !/flowDensityProps\(\s*normalizeFlowDensity\(\s*density\s*\)\s*\)/.test(source),
    restSanitized: source.includes("flowRestProps(rest)") && !/^\s*\.\.\.rest,\s*$/m.test(source),
    noDocsDependency: !/(apps\/docs|#design-system\/docs)/.test(source + types + dist + distTypes),
    noDomFactory: !/(createTransitional|create[A-Z][A-Za-z0-9]*Component\(|hydrate[A-Z][A-Za-z0-9]*\(|document\.createElement)/.test(source),
    publishedImports: !/(@design-system\/components|..\/..\/components\/src)/.test(dist + distTypes),
    cssContractCoverage: cssCoverage.coverage !== "missing"
      && cssCoverage.requiredRootObserved !== false
      && !(cssCoverage.unexpectedRoots ?? []).length,
    sourceIndexExport: entrypointExports(entrypoints.sourceIndex, component),
    sourceTypesIndexExport: entrypointExports(entrypoints.sourceTypesIndex, component),
    distIndexExport: entrypointExports(entrypoints.distIndex, component),
    distTypesIndexExport: entrypointExports(entrypoints.distTypesIndex, component),
  };
  const failingChecks = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
  return {
    component,
    id: componentId,
    source: rel(sourceFile),
    types: rel(typesFile),
    dist: rel(distFile),
    distTypes: rel(distTypesFile),
    cssContract: {
      coverage: cssCoverage.coverage,
      contract: cssCoverage.contract,
      requiredRoot: cssCoverage.requiredRoot ?? null,
      requiredRootObserved: cssCoverage.requiredRootObserved ?? null,
      allowedExtensionRoots: cssCoverage.allowedExtensionRoots ?? [],
      unexpectedRoots: cssCoverage.unexpectedRoots ?? [],
    },
    checks,
    status: failingChecks.length ? "fail" : "pass",
    failingChecks,
  };
}

function createReport() {
  const cssCoverage = componentCssContractCoverage();
  const cssCoverageByComponent = new Map(cssCoverage.components.map((item) => [item.component, item]));
  const entrypoints = {
    sourceIndex: readIfExists(reactSrcIndexFile),
    sourceTypesIndex: readIfExists(reactSrcTypesIndexFile),
    distIndex: readIfExists(reactDistIndexFile),
    distTypesIndex: readIfExists(reactDistTypesIndexFile),
  };
  const components = componentSourceFiles().map((file) => componentReport(file, cssCoverageByComponent, entrypoints));
  const sourceIds = components.map((item) => item.id);
  const expectedIds = [...goldComponents].sort();
  const missingSources = expectedIds.filter((id) => !sourceIds.includes(id));
  const extraSources = sourceIds.filter((id) => !goldComponents.includes(id));
  const fail = components.filter((item) => item.status === "fail");
  const inventory = {
    expectedComponents: expectedIds.length,
    components: components.length,
    pass: components.filter((item) => item.status === "pass").length,
    fail: fail.length,
    missingSources,
    extraSources,
    forwardRef: components.filter((item) => item.checks.forwardRef).length,
    realTypes: components.filter((item) => item.checks.realTypes).length,
    platformContract: components.filter((item) => item.checks.platformContract).length,
    densityResolved: components.filter((item) => item.checks.densityResolved).length,
    restSanitized: components.filter((item) => item.checks.restSanitized).length,
    noDocsDependency: components.filter((item) => item.checks.noDocsDependency).length,
    noDomFactory: components.filter((item) => item.checks.noDomFactory).length,
    publishedImports: components.filter((item) => item.checks.publishedImports).length,
    cssContractCoverage: components.filter((item) => item.checks.cssContractCoverage).length,
    directCssContracts: components.filter((item) => item.cssContract.coverage === "direct").length,
    familyCssContracts: components.filter((item) => item.cssContract.coverage === "family").length,
    sourceIndexExport: components.filter((item) => item.checks.sourceIndexExport).length,
    sourceTypesIndexExport: components.filter((item) => item.checks.sourceTypesIndexExport).length,
    distIndexExport: components.filter((item) => item.checks.distIndexExport).length,
    distTypesIndexExport: components.filter((item) => item.checks.distTypesIndexExport).length,
  };
  const baselineActual = {
    ...inventory,
    missingSources: inventory.missingSources.length,
    extraSources: inventory.extraSources.length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => baselineActual[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: baselineActual[key],
    }));
  return {
    status: missingSources.length || extraSources.length || fail.length || baselineMismatches.length ? "fail" : "pass",
    audit: "react primary coverage",
    principle: "Every accepted component must have a real React implementation contract: source, types, built artifacts, ref forwarding, platform contract, normalized density, sanitized rest props, and no docs or DOM factory dependency.",
    baseline: {
      inventory: expectedInventory,
      actual: baselineActual,
      mismatches: baselineMismatches,
    },
    inventory,
    components,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.baseline.actual[key]} |`);
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const lines = [
    "# React Primary Coverage Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Expected components: ${report.inventory.expectedComponents}`,
    `- React components: ${report.inventory.components}`,
    `- Pass: ${report.inventory.pass}`,
    `- Fail: ${report.inventory.fail}`,
    `- Forward ref: ${report.inventory.forwardRef}/${report.inventory.components}`,
    `- Real types: ${report.inventory.realTypes}/${report.inventory.components}`,
    `- Platform contract: ${report.inventory.platformContract}/${report.inventory.components}`,
    `- Normalized density: ${report.inventory.densityResolved}/${report.inventory.components}`,
    `- Sanitized rest props: ${report.inventory.restSanitized}/${report.inventory.components}`,
    `- No docs dependency: ${report.inventory.noDocsDependency}/${report.inventory.components}`,
    `- No DOM factory dependency: ${report.inventory.noDomFactory}/${report.inventory.components}`,
    `- Published imports stay package-safe: ${report.inventory.publishedImports}/${report.inventory.components}`,
    `- CSS contract coverage: ${report.inventory.cssContractCoverage}/${report.inventory.components}`,
    `- Direct CSS contracts: ${report.inventory.directCssContracts}`,
    `- Family CSS contracts: ${report.inventory.familyCssContracts}`,
    `- Source index exports: ${report.inventory.sourceIndexExport}/${report.inventory.components}`,
    `- Source type index exports: ${report.inventory.sourceTypesIndexExport}/${report.inventory.components}`,
    `- Dist index exports: ${report.inventory.distIndexExport}/${report.inventory.components}`,
    `- Dist type index exports: ${report.inventory.distTypesIndexExport}/${report.inventory.components}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. React only counts as the primary implementation when every accepted component keeps source, types, dist, refs, density, rest-prop sanitation, package-safe imports, and CSS contracts intact.",
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
    "## Components",
    "",
    "| Component | Status | CSS contract | Failing checks |",
    "| --- | --- | --- | --- |",
    ...report.components.map((item) => `| ${item.component} | ${item.status} | ${item.cssContract.coverage}:${item.cssContract.contract ?? "missing"} | ${item.failingChecks.join(", ") || "None"} |`),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, toMarkdown(report));
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = toMarkdown(report);

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("React primary coverage report is stale. Run: node packages/audit/scripts/report-react-primary-coverage.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    pass: report.inventory.pass,
    fail: report.inventory.fail,
    densityResolved: report.inventory.densityResolved,
    cssContractCoverage: report.inventory.cssContractCoverage,
    sourceIndexExport: report.inventory.sourceIndexExport,
    sourceTypesIndexExport: report.inventory.sourceTypesIndexExport,
    distIndexExport: report.inventory.distIndexExport,
    distTypesIndexExport: report.inventory.distTypesIndexExport,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
