#!/usr/bin/env node

const {
  fs,
  goldComponents,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-primary-coverage-audit.json");
const markdownOutput = path.join(outputDir, "react-primary-coverage-audit.md");

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

function componentReport(file) {
  const component = path.basename(file, ".js");
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
  };
  const failingChecks = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
  return {
    component,
    id: kebab(component),
    source: rel(sourceFile),
    types: rel(typesFile),
    dist: rel(distFile),
    distTypes: rel(distTypesFile),
    checks,
    status: failingChecks.length ? "fail" : "pass",
    failingChecks,
  };
}

function createReport() {
  const components = componentSourceFiles().map(componentReport);
  const sourceIds = components.map((item) => item.id);
  const expectedIds = [...goldComponents].sort();
  const missingSources = expectedIds.filter((id) => !sourceIds.includes(id));
  const extraSources = sourceIds.filter((id) => !goldComponents.includes(id));
  const fail = components.filter((item) => item.status === "fail");
  return {
    status: missingSources.length || extraSources.length || fail.length ? "fail" : "pass",
    audit: "react primary coverage",
    principle: "Every accepted component must have a real React implementation contract: source, types, built artifacts, ref forwarding, platform contract, normalized density, sanitized rest props, and no docs or DOM factory dependency.",
    inventory: {
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
    },
    components,
  };
}

function toMarkdown(report) {
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
    "",
    "## Components",
    "",
    "| Component | Status | Failing checks |",
    "| --- | --- | --- |",
    ...report.components.map((item) => `| ${item.component} | ${item.status} | ${item.failingChecks.join(", ") || "None"} |`),
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
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
