#!/usr/bin/env node

const {
  fs,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-charts-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-charts-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const componentPackageFile = resolveBoundaryPath("#design-system/components-package", "packages/components/package.json");
const chartsPrimitiveFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/primitives/charts.js");
const chartPanelFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/components/commerce.js");
const chartsSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/charts.json");
const chartsContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/charts.md");
const energyReportFile = path.join(root, "docs/audits/foundation-energy-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const momentumReportFile = path.join(root, "docs/audits/foundation-momentum-cascade-audit.json");
const voiceReportFile = path.join(root, "docs/audits/foundation-voice-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const librarySourcesReportFile = path.join(root, "docs/audits/primitive-library-sources-cascade-audit.json");
const measurementReportFile = path.join(root, "docs/audits/primitive-measurement-cascade-audit.json");
const messageReportFile = path.join(root, "docs/audits/primitive-message-cascade-audit.json");
const componentContractDir = path.join(root, "packages/content/content/component-contracts/components");
const patternContractDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["series", "threshold", "legend", "summary", "empty"];
const requiredFoundations = ["Energy", "Accessibility", "Momentum", "Voice", "State"];
const requiredCoordinatedPrimitives = ["Library Sources", "Measurement", "Message"];
const requiredTokenDependencies = [
  "chart.*",
  "library.*",
  "sys.energy.*",
  "sys.momentum.*",
  "sys.voice.*",
  "sys.accessibility.*",
];
const requiredTokenAliases = [
  "--sys-chart-series-primary",
  "--sys-chart-series-secondary",
  "--sys-chart-series-tertiary",
  "--sys-chart-series-quaternary",
  "--sys-chart-threshold-warning",
  "--sys-chart-threshold-danger",
  "--sys-chart-axis-color",
  "--sys-chart-grid-color",
  "--sys-chart-legend-text-color",
  "--sys-chart-summary-font",
  "--sys-chart-summary-line-height",
  "--sys-chart-empty-color",
  "--sys-chart-tooltip-background",
  "--sys-chart-tooltip-foreground",
  "--sys-chart-focus-ring",
  "--sys-chart-motion-duration-enter",
  "--sys-chart-motion-duration-update",
  "--sys-chart-motion-easing-enter",
  "--sys-chart-motion-easing-update",
];

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const output = [];
  for (const entry of fs.readdirSync(dir)) {
    const file = path.join(dir, entry);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) output.push(...walkFiles(file, predicate));
    else if (predicate(file)) output.push(file);
  }
  return output.sort();
}

function rel(file) {
  return path.relative(root, file);
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function collectDeclarations(css) {
  const map = new Map();
  for (const match of css.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    if (!map.has(match.groups.name)) map.set(match.groups.name, match.groups.value.trim());
  }
  return map;
}

function artifactId(file, baseDir) {
  return path.relative(baseDir, file).split(path.sep)[0].replace(/\.(?:md|json)$/, "");
}

function collectArtifactRefs(dir, pattern) {
  const ids = new Set();
  const sampleFiles = [];
  for (const file of walkFiles(dir, (item) => /\.(?:md|json)$/.test(item))) {
    const source = readIfExists(file);
    pattern.lastIndex = 0;
    if (!pattern.test(source)) continue;
    ids.add(artifactId(file, dir));
    if (sampleFiles.length < 12) sampleFiles.push(rel(file));
  }
  return { count: ids.size, ids: [...ids].sort(), sampleFiles };
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function foundationStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return report?.status ?? "missing";
}

const tokenCss = readIfExists(tokenCssFile);
const componentCss = readIfExists(componentCssFile);
const chartsPrimitiveSource = readIfExists(chartsPrimitiveFile);
const chartPanelSource = readIfExists(chartPanelFile);
const packageJson = fs.existsSync(componentPackageFile) ? readJson(componentPackageFile) : {};
const tokenDeclarations = collectDeclarations(tokenCss);
const specWrapper = readJson(chartsSpecFile);
const spec = specWrapper.artifacts?.primitives?.charts ?? specWrapper;
const contractSource = readIfExists(chartsContractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const implementation = {
  packageHasEcharts: Boolean(packageJson.dependencies?.echarts || packageJson.devDependencies?.echarts),
  primitiveExportsFactory: /export function createChartsPrimitive/.test(chartsPrimitiveSource),
  primitiveCreatesEchartsOption: /echartsOption/.test(chartsPrimitiveSource),
  primitiveCreatesTextSummary: /textSummary/.test(chartsPrimitiveSource) && /createTextSummary/.test(chartsPrimitiveSource),
  primitiveCreatesTableFallback: /tableFallback/.test(chartsPrimitiveSource) && /createTableFallback/.test(chartsPrimitiveSource),
  primitiveCreatesLegendModel: /legendModel/.test(chartsPrimitiveSource),
  primitiveEnablesAria: /aria:\s*\{[\s\S]*enabled:\s*true/.test(chartsPrimitiveSource),
  primitiveDefinesDataset: /dataset:\s*\{[\s\S]*source:\s*tableFallback/.test(chartsPrimitiveSource),
  primitiveUsesSemanticMotion: /chartMotion\.(?:enterDuration|updateDuration|enterEasing|updateEasing)/.test(chartsPrimitiveSource),
  panelConsumesPrimitive: /createChartsPrimitive/.test(chartPanelSource),
  panelMarksEngine: /dataset\.chartEngine\s*=\s*"echarts-option"/.test(chartPanelSource),
  panelFigureSummary: /figure\.setAttribute\("aria-label",\s*chartPrimitive\.textSummary\)/.test(chartPanelSource),
  panelTooltipLive: /aria-live",\s*"polite"/.test(chartPanelSource) && /role",\s*"status"/.test(chartPanelSource),
  componentCssUsesChartTokens: countMatches(componentCss, /var\(--sys-chart-/g),
};
const references = {
  componentContracts: collectArtifactRefs(componentContractDir, /(?:chart\.|sys\.chart|Charts primitive|ECharts|echartsOption|tableFallback|textSummary|legendModel)/i),
  patterns: collectArtifactRefs(patternContractDir, /(?:chart|dashboard|kpi|legend|drilldown|tooltip|table fallback|data visualization)/i),
  templates: collectArtifactRefs(templateDir, /(?:chart|dashboard|kpi|metric|trend|drill-down|evidence)/i),
};
const foundationGate = {
  energy: { status: foundationStatus(energyReportFile) },
  accessibility: { status: foundationStatus(accessibilityReportFile) },
  momentum: { status: foundationStatus(momentumReportFile) },
  voice: { status: foundationStatus(voiceReportFile) },
  state: { status: foundationStatus(stateReportFile) },
};
const primitiveGate = {
  librarySources: { status: foundationStatus(librarySourcesReportFile) },
  measurement: { status: foundationStatus(measurementReportFile) },
  message: { status: foundationStatus(messageReportFile) },
};
const librarySourcesReport = fs.existsSync(librarySourcesReportFile) ? readJson(librarySourcesReportFile) : {};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitive) => !coordinatedPrimitives.includes(primitive),
);
const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
if (!contractSource.includes("Charts sits between foundations and components")) {
  gaps.push("Primitive contract must state the Charts bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (missingTokenDependencies.length) gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
if (tokenAliases.missing.length) gaps.push(`Missing sys-chart aliases: ${tokenAliases.missing.join(", ")}.`);
for (const [key, value] of Object.entries(implementation)) {
  if (key === "componentCssUsesChartTokens") continue;
  if (!value) gaps.push(`Charts implementation signal missing: ${key}.`);
}
if (implementation.componentCssUsesChartTokens < 6) {
  gaps.push("Component CSS does not consume enough sys-chart aliases.");
}
if (!references.componentContracts.ids.includes("chart-panel")) {
  gaps.push("Chart Panel contract does not reference Charts primitive behavior.");
}
if (!references.patterns.count) gaps.push("No pattern contract references chart/dashboard visualization behavior.");
if (!references.templates.count) gaps.push("No template spec references chart/dashboard/KPI evidence.");
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
for (const [name, gate] of Object.entries(primitiveGate)) {
  if (gate.status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${gate.status}.`);
}
const librarySourceRow = (librarySourcesReport.rows ?? []).find((row) => row.id === "charts");
if (!librarySourceRow || librarySourceRow.library !== "echarts") {
  gaps.push("Library Sources must register Charts as echarts.");
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Charts",
  principle: "Charts consumes Energy, Accessibility, Momentum, Voice, State, Library Sources, Measurement, and Message so chart visuals remain semantic, interactive, summarized, and recoverable while ECharts stays the rendering engine.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: {
    required: requiredCoordinatedPrimitives,
    present: coordinatedPrimitives,
    missing: missingCoordinatedPrimitives,
  },
  tokenDependencies: {
    required: requiredTokenDependencies,
    present: requiredTokenDependencies.filter((dependency) => tokenDependencies.includes(dependency)),
    missing: missingTokenDependencies,
  },
  tokenAliases,
  implementation,
  references,
  foundationGate,
  primitiveGate,
  librarySources: {
    row: librarySourceRow ?? null,
  },
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Charts Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Gaps",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    "",
    "## Signals",
    `- Roles: ${report.roles.present.length}/${report.roles.required.length}`,
    `- Coordinated primitives: ${report.coordinatedPrimitives.present.length}/${report.coordinatedPrimitives.required.length}`,
    `- Token aliases: ${report.tokenAliases.present.length}/${report.tokenAliases.required.length}`,
    `- Component sys-chart CSS uses: ${report.implementation.componentCssUsesChartTokens}`,
    `- Component contract refs: ${report.references.componentContracts.count}`,
    `- Pattern refs: ${report.references.patterns.count}`,
    `- Template refs: ${report.references.templates.count}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Charts cascade audit is stale. Run npm run audit:primitive:charts.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Charts cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Charts cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Charts cascade audit passed: ${jsonOutput}`);
}

writeReport();
