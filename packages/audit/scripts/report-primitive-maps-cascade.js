#!/usr/bin/env node

const {
  docsAppDir,
  fs,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-maps-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-maps-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const tokenIndexFile = resolveBoundaryPath("#design-system/tokens-js", "packages/tokens/src/index.js");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const mapsPrimitiveFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/primitives/maps.js");
const componentIndexFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/index.js");
const stationPinReactFile = path.join(root, "packages/react/src/StationPin.js");
const mapsSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/maps.json");
const mapsContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/maps.md");
const stationPinContractFile = path.join(root, "packages/content/content/component-contracts/components/station-pin.md");
const routeSummaryContractFile = path.join(root, "packages/content/content/component-contracts/components/route-summary.md");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const energyReportFile = path.join(root, "docs/audits/foundation-energy-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const voiceReportFile = path.join(root, "docs/audits/foundation-voice-cascade-audit.json");
const momentumReportFile = path.join(root, "docs/audits/foundation-momentum-cascade-audit.json");
const depthReportFile = path.join(root, "docs/audits/foundation-depth-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const librarySourcesReportFile = path.join(root, "docs/audits/primitive-library-sources-cascade-audit.json");
const measurementReportFile = path.join(root, "docs/audits/primitive-measurement-cascade-audit.json");
const messageReportFile = path.join(root, "docs/audits/primitive-message-cascade-audit.json");
const iconographyReportFile = path.join(root, "docs/audits/primitive-iconography-cascade-audit.json");
const breakpointsReportFile = path.join(root, "docs/audits/primitive-breakpoints-cascade-audit.json");
const loadingReportFile = path.join(root, "docs/audits/primitive-loading-cascade-audit.json");
const packageJsonFile = path.join(root, "packages/components/package.json");
const requiredRoles = ["permission", "stationPin", "routeLine", "cluster", "fallbackList", "runtime"];
const requiredFoundations = ["Energy", "Accessibility", "Frame", "Voice", "Momentum", "Depth", "State"];
const requiredCoordinatedPrimitives = ["Library Sources", "Measurement", "Message", "Iconography", "Breakpoints", "Loading"];
const requiredTokenDependencies = [
  "map.*",
  "library.*",
  "sys.energy.*",
  "sys.frame.*",
  "sys.voice.*",
  "sys.momentum.*",
  "sys.depth.*",
  "sys.accessibility.*",
];
const requiredTokenAliases = [
  "--sys-map-permission-granted-color",
  "--sys-map-permission-denied-color",
  "--sys-map-permission-prompt-color",
  "--sys-map-pin-background",
  "--sys-map-pin-foreground",
  "--sys-map-pin-border",
  "--sys-map-pin-action-color",
  "--sys-map-pin-selected-background",
  "--sys-map-pin-selected-foreground",
  "--sys-map-pin-cluster-background",
  "--sys-map-pin-cluster-foreground",
  "--sys-map-route-line-color",
  "--sys-map-route-line-muted-color",
  "--sys-map-fallback-surface",
  "--sys-map-fallback-text-color",
  "--sys-map-depth-pin",
  "--sys-map-depth-selected",
  "--sys-map-depth-pin-pointer",
  "--sys-map-focus-ring",
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

function readIfExists(file) {
  if (!file) return "";
  return fs.existsSync(file) ? read(file) : "";
}

function isInsideRoot(file) {
  const relative = path.relative(root, file);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

const repoDocsAppDir = isInsideRoot(docsAppDir) ? docsAppDir : null;
const docsScope = repoDocsAppDir ? "in-repo" : "external-not-audited";
const docsIndexFile = repoDocsAppDir ? path.join(repoDocsAppDir, "index.html") : null;
const vendorRuntimeFile = repoDocsAppDir ? path.join(repoDocsAppDir, "vendor/maplibre-gl/maplibre-gl.js") : null;
const vendorCssFile = repoDocsAppDir ? path.join(repoDocsAppDir, "vendor/maplibre-gl/maplibre-gl.css") : null;
const vendorLicenseFile = repoDocsAppDir ? path.join(repoDocsAppDir, "vendor/maplibre-gl/LICENSE.txt") : null;

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
  for (const file of walkFiles(dir, (item) => /\.(?:md|json)$/.test(item))) {
    const source = readIfExists(file);
    pattern.lastIndex = 0;
    if (pattern.test(source)) ids.add(artifactId(file, dir));
  }
  return [...ids].sort();
}

function reportStatus(file) {
  return fs.existsSync(file) ? readJson(file)?.status ?? "missing" : "missing";
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

const tokenCss = readIfExists(tokenCssFile);
const tokenIndex = readIfExists(tokenIndexFile);
const componentCss = readIfExists(componentCssFile);
const mapsPrimitive = readIfExists(mapsPrimitiveFile);
const componentIndex = readIfExists(componentIndexFile);
const stationPinReact = readIfExists(stationPinReactFile);
const mapsContract = readIfExists(mapsContractFile);
const stationPinContract = readIfExists(stationPinContractFile);
const routeSummaryContract = readIfExists(routeSummaryContractFile);
const specWrapper = readJson(mapsSpecFile);
const spec = specWrapper.artifacts?.primitives?.maps ?? specWrapper;
const packageJson = readJson(packageJsonFile);
const docsIndex = readIfExists(docsIndexFile);
const vendorRuntime = readIfExists(vendorRuntimeFile);
const vendorCss = readIfExists(vendorCssFile);
const vendorLicense = readIfExists(vendorLicenseFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];
const librarySourcesReport = fs.existsSync(librarySourcesReportFile) ? readJson(librarySourcesReportFile) : {};

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};

const implementation = {
  docsScope,
  packageDependency: packageJson.dependencies?.["maplibre-gl"] ?? null,
  docsLoadsLocalRuntime: repoDocsAppDir
    ? /vendor\/maplibre-gl\/maplibre-gl\.js/.test(docsIndex) &&
      /vendor\/maplibre-gl\/maplibre-gl\.css/.test(docsIndex) &&
      !/unpkg|jsdelivr|cdnjs/.test(docsIndex)
    : null,
  vendorRuntimePresent: repoDocsAppDir ? /maplibregl/.test(vendorRuntime) && vendorRuntime.length > 500000 : null,
  vendorCssPresent: repoDocsAppDir ? /maplibre/.test(vendorCss) && vendorCss.length > 10000 : null,
  vendorLicensePresent: repoDocsAppDir ? /BSD|MapLibre/i.test(vendorLicense) : null,
  exportsFactory: /export function createMapsPrimitive/.test(mapsPrimitive),
  publicIndexExport: /export \{ createMapsPrimitive \}/.test(componentIndex),
  resolvesMapLibreRuntime: /resolveMapRuntime/.test(mapsPrimitive) && /globalThis\.maplibregl/.test(mapsPrimitive),
  createsRuntimeModel: /createMapRuntimeModel/.test(mapsPrimitive) && /mapRuntimeModel/.test(mapsPrimitive),
  gatesProviderReadiness: /providerMissing/.test(mapsPrimitive) && /tileProvider/.test(mapsPrimitive) && /mapStyle/.test(mapsPrimitive),
  requiresFallbackWithRuntime: /requiresFallback:\s*true/.test(mapsPrimitive),
  normalizesPermission: /normalizePermission/.test(mapsPrimitive) && /denied/.test(mapsPrimitive),
  normalizesPinAccessibleLabel: /accessibleLabel/.test(mapsPrimitive),
  createsFallbackList: /createFallbackList/.test(mapsPrimitive) && /Search manually/.test(mapsPrimitive),
  createsRouteSummary: /createRouteSummary/.test(mapsPrimitive) && /routeSummary/.test(mapsPrimitive),
  outputsMapLayerModel: /mapLayerModel/.test(mapsPrimitive),
  outputsStationListModel: /stationListModel/.test(mapsPrimitive),
  stationPinConsumesPrimitive: /createMapsPrimitive/.test(stationPinReact) && /"data-map-primitive":\s*"maps"/.test(stationPinReact),
  stationPinUsesPrimitiveLabel: /mapPrimitive\.mapLayerModel\.pins\[0\]\?\.accessibleLabel/.test(stationPinReact),
  stationPinCssUsesMapTokens: countMatches(componentCss, /var\(--sys-map-/g),
  tokenIndexExportsMap: /map:\s*\{[\s\S]*permission:[\s\S]*pin:[\s\S]*route:[\s\S]*fallback:/m.test(tokenIndex),
};

const references = {
  stationPinContract: /map station marker|map patterns|clustering|routing/i.test(stationPinContract),
  routeSummaryContract: /route patterns|navigation/i.test(routeSummaryContract),
  templates: collectArtifactRefs(templateDir, /(?:Maps|sys\.maps|station pins|Fallback station list|route handoff|location denial)/i),
};

const foundationGate = {
  energy: reportStatus(energyReportFile),
  accessibility: reportStatus(accessibilityReportFile),
  frame: reportStatus(frameReportFile),
  voice: reportStatus(voiceReportFile),
  momentum: reportStatus(momentumReportFile),
  depth: reportStatus(depthReportFile),
  state: reportStatus(stateReportFile),
};
const primitiveGate = {
  librarySources: reportStatus(librarySourcesReportFile),
  measurement: reportStatus(measurementReportFile),
  message: reportStatus(messageReportFile),
  iconography: reportStatus(iconographyReportFile),
  breakpoints: reportStatus(breakpointsReportFile),
  loading: reportStatus(loadingReportFile),
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
if (!mapsContract.includes("Maps sits between foundations and components")) {
  gaps.push("Primitive contract must state the Maps bridge role.");
}
if (!/MapLibre[\s\S]*Maps primitive|Maps primitive[\s\S]*MapLibre/.test(mapsContract)) {
  gaps.push("Primitive contract must state the open map runtime boundary.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (missingTokenDependencies.length) gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
if (tokenAliases.missing.length) gaps.push(`Missing sys-map aliases: ${tokenAliases.missing.join(", ")}.`);
if (implementation.packageDependency !== "5.24.0") {
  gaps.push("Components package must pin maplibre-gl to the vendored runtime version.");
}
for (const [key, value] of Object.entries(implementation)) {
  if (key === "docsScope" || key === "packageDependency") continue;
  if (["docsLoadsLocalRuntime", "vendorRuntimePresent", "vendorCssPresent", "vendorLicensePresent"].includes(key)) {
    if (repoDocsAppDir && !value) gaps.push(`Maps implementation signal missing: ${key}.`);
    continue;
  }
  if (key === "stationPinCssUsesMapTokens") continue;
  if (!value) gaps.push(`Maps implementation signal missing: ${key}.`);
}
if (implementation.stationPinCssUsesMapTokens < 8) {
  gaps.push("Station Pin CSS does not consume enough sys-map aliases.");
}
if (!references.stationPinContract) gaps.push("Station Pin contract does not preserve Maps ownership boundaries.");
if (!references.routeSummaryContract) gaps.push("Route Summary contract does not preserve route/map ownership boundaries.");
if (!references.templates.includes("routes-and-stations")) {
  gaps.push("Routes and Stations template does not reference Maps primitive behavior.");
}
for (const [name, status] of Object.entries(foundationGate)) {
  if (status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${status}.`);
}
for (const [name, status] of Object.entries(primitiveGate)) {
  if (status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${status}.`);
}
const librarySourceRow = (librarySourcesReport.rows ?? []).find((row) => row.id === "maps");
if (!librarySourceRow || librarySourceRow.library !== "maplibre-gl") {
  gaps.push("Library Sources must register Maps as maplibre-gl.");
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Maps",
  principle: "Maps governs geolocation, permission, pins, routes, fallback lists, MapLibre runtime boundaries, and accessible equivalents before components or templates draw map UI.",
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
    "# Primitive Maps Cascade Audit",
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
    `- Docs scope: ${report.implementation.docsScope}`,
    `- Runtime dependency: ${report.implementation.packageDependency || "missing"}`,
    `- Local runtime: ${report.implementation.docsLoadsLocalRuntime === null ? "not audited here" : report.implementation.docsLoadsLocalRuntime ? "yes" : "no"}`,
    `- Token aliases: ${report.tokenAliases.present.length}/${report.tokenAliases.required.length}`,
    `- Station Pin sys-map CSS uses: ${report.implementation.stationPinCssUsesMapTokens}`,
    `- Template refs: ${report.references.templates.join(", ") || "None"}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, status]) => `- ${name}: ${status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, status]) => `- ${name}: ${status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Maps cascade audit is stale. Run: node packages/audit/scripts/report-primitive-maps-cascade.js.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Maps cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Maps cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Maps cascade audit passed: ${jsonOutput}`);
}

writeReport();
