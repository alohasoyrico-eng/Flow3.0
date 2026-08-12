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
const jsonOutput = path.join(outputDir, "primitive-illustration-assets-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-illustration-assets-cascade-audit.md");
const primitiveFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/primitives/illustration-assets.js");
const componentIndexFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/index.js");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/illustration-assets.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/illustration-assets.md");
const coordinatedPrimitiveReports = {
  librarySources: path.join(root, "docs/audits/primitive-library-sources-cascade-audit.json"),
  animationAssets: path.join(root, "docs/audits/primitive-animation-assets-cascade-audit.json"),
  iconography: path.join(root, "docs/audits/primitive-iconography-cascade-audit.json"),
  density: path.join(root, "docs/audits/primitive-density-cascade-audit.json"),
  breakpoints: path.join(root, "docs/audits/primitive-breakpoints-cascade-audit.json"),
};
const foundationReports = {
  symbol: path.join(root, "docs/audits/foundation-symbol-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
  energy: path.join(root, "docs/audits/foundation-energy-cascade-audit.json"),
  frame: path.join(root, "docs/audits/foundation-frame-cascade-audit.json"),
  voice: path.join(root, "docs/audits/foundation-voice-cascade-audit.json"),
};

const requiredRoles = ["source", "format", "purpose", "theme", "fallback"];
const requiredFoundations = ["Symbol", "Accessibility", "Energy", "Frame", "Voice"];
const requiredCoordinatedPrimitives = ["Library Sources", "Animation Assets", "Iconography", "Density", "Breakpoints"];
const requiredTokenDependencies = [
  "illustration.*",
  "library.*",
  "sys.symbol.*",
  "sys.energy.*",
  "sys.frame.*",
  "sys.voice.*",
  "sys.accessibility.*",
];

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
const docsAppFile = repoDocsAppDir ? path.join(repoDocsAppDir, "app.js") : null;
const docsHomeIllustrationsFile = repoDocsAppDir ? path.join(repoDocsAppDir, "home-illustrations.js") : null;
const docsHomeFile = repoDocsAppDir ? path.join(repoDocsAppDir, "home-stack-renderers.js") : null;
const vendorManifestFile = repoDocsAppDir ? path.join(repoDocsAppDir, "vendor/open-doodles/manifest.json") : null;
const vendorLicenseFile = repoDocsAppDir ? path.join(repoDocsAppDir, "vendor/open-doodles/LICENSE.md") : null;

function reportStatus(file) {
  return fs.existsSync(file) ? readJson(file)?.status ?? "missing" : "missing";
}

const primitive = readIfExists(primitiveFile);
const index = readIfExists(componentIndexFile);
const css = readIfExists(componentCssFile);
const contract = readIfExists(contractFile);
const docsApp = readIfExists(docsAppFile);
const docsHomeIllustrations = readIfExists(docsHomeIllustrationsFile);
const docsHome = readIfExists(docsHomeFile);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.["illustration-assets"] ?? specWrapper;
const vendorManifest = vendorManifestFile && fs.existsSync(vendorManifestFile) ? readJson(vendorManifestFile) : {};
const vendorLicense = readIfExists(vendorLicenseFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, reportStatus(file)]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(coordinatedPrimitiveReports).map(([name, file]) => [name, reportStatus(file)]),
);
const librarySourcesReport = fs.existsSync(coordinatedPrimitiveReports.librarySources)
  ? readJson(coordinatedPrimitiveReports.librarySources)
  : {};

const implementation = {
  docsScope,
  vendorManifestPresent: repoDocsAppDir ? vendorManifest.id === "open-doodles" && vendorManifest.license === "CC0" : null,
  vendorLicensePresent: repoDocsAppDir ? /CC0|public-domain|public domain/i.test(vendorLicense) : null,
  sourceRegistry: /approvedIllustrationSources/.test(primitive) && /open-doodles/.test(primitive) && /custom-artwork/.test(primitive),
  exportsPrimitiveApi: /createIllustrationAsset/.test(index) && /listIllustrationSources/.test(index) && /hasIllustrationSource/.test(index),
  createsImageAsset: /document\.createElement\("img"\)/.test(primitive) && /illustration-asset__image/.test(primitive),
  supportsDarkAsset: /darkSrc/.test(primitive) && /illustration-asset__image--dark/.test(primitive) && /prefers-color-scheme:\s*dark/.test(css),
  supportsDocsThemeToggle: /\[data-contrast="quiet"\]/.test(css) && /dataset\.theme/.test(primitive),
  enforcesPurposeAlt: /decorative:\s*!informative/.test(primitive) && /alt:\s*informative/.test(primitive),
  supportsFallback: /illustration-asset__fallback/.test(primitive) && /onerror/.test(primitive),
  gatesSourceAndFormat: /unapprovedSource/.test(primitive) && /unsupportedFormat/.test(primitive),
  avoidsHandDrawnSvg: !/createElementNS|polygon|path\.setAttribute|setAttribute\("d"/.test(primitive),
  avoidsFixedDensityDefault: !/\bdensity\s*=\s*["']md["']/.test(primitive)
    && !/validDensities\.has\(density\)\s*\?\s*density\s*:\s*["']md["']/.test(primitive)
    && /if\s*\(resolvedDensity\)\s*figure\.dataset\.density\s*=\s*resolvedDensity/.test(primitive),
  cssTargetsAsset: /\.illustration-asset\b/.test(css) && /illustration-asset__image/.test(css),
  cssUsesComponentNamespace: /--comp-illustration-asset-max-size:/.test(css) && !/--illustration-asset-max-size:/.test(css),
  cssUsesComponentSizeAliases: /--component-illustration-asset-max-size-sm:/.test(css)
    && /--component-illustration-asset-max-size-md:/.test(css)
    && /--component-illustration-asset-max-size-lg:/.test(css)
    && /--comp-illustration-asset-max-size:\s*var\(--component-illustration-asset-max-size-md\)/.test(css),
  cssAvoidsDirectFrameInCompAlias: !/--comp-illustration-asset-max-size:\s*(?:var|min\([^;]*var)\(--sys-frame-/.test(css),
  cssUsesFoundations: /var\(--sys-frame-/.test(css) && /var\(--sys-energy-/.test(css) && /var\(--component-font-/.test(css),
  docsHeroUsesIllustrationSlot: repoDocsAppDir
    ? /data-illustration-slot="home-hero"/.test(docsHome) && !/hero-visual__image/.test(docsHome)
    : null,
  docsHydratesHeroThroughPrimitive: repoDocsAppDir
    ? /hydrateHomeHeroIllustration/.test(docsApp) && /createIllustrationAsset/.test(docsHomeIllustrations)
    : null,
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
if (!contract.includes("Illustration Assets sits between foundations and components")) {
  gaps.push("Primitive contract must state the Illustration Assets bridge role.");
}
if (!contract.includes("Open Doodles")) {
  gaps.push("Primitive contract must identify Open Doodles as the approved free source boundary.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (missingTokenDependencies.length) gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
for (const [key, value] of Object.entries(implementation)) {
  if (["docsScope", "vendorManifestPresent", "vendorLicensePresent", "docsHeroUsesIllustrationSlot", "docsHydratesHeroThroughPrimitive"].includes(key)) {
    if (repoDocsAppDir && !value) gaps.push(`Illustration Assets implementation signal missing: ${key}.`);
    continue;
  }
  if (!value) gaps.push(`Illustration Assets implementation signal missing: ${key}.`);
}
for (const [name, status] of Object.entries(foundationGate)) {
  if (status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${status}.`);
}
for (const [name, status] of Object.entries(primitiveGate)) {
  if (status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${status}.`);
}
const librarySourceRow = (librarySourcesReport.rows ?? []).find((row) => row.id === "illustration-assets");
if (!librarySourceRow || librarySourceRow.library !== "open-doodles") {
  gaps.push("Library Sources must register Illustration Assets as open-doodles.");
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Illustration Assets",
  principle: "Illustration Assets converts approved free sources into Flow-owned image behavior so illustrations never bypass source, license, accessibility, theme, frame, or fallback rules.",
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
  implementation,
  source: {
    scope: docsScope,
    approved: vendorManifest.id,
    license: vendorManifest.license,
    formats: vendorManifest.allowedFormats ?? [],
  },
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
    "# Primitive Illustration Assets Cascade Audit",
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
    `- Docs source scope: ${report.source.scope}`,
    `- Approved source: ${report.source.approved || "missing"}`,
    `- License: ${report.source.license || "missing"}`,
    `- Formats: ${(report.source.formats ?? []).join(", ") || "missing"}`,
    `- Public API exported: ${report.implementation.exportsPrimitiveApi ? "yes" : "no"}`,
    `- Hand-drawn SVG logic present: ${report.implementation.avoidsHandDrawnSvg ? "no" : "yes"}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, status]) => `- ${name}: ${status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, status]) => `- ${name}: ${status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Illustration Assets cascade audit is stale. Run npm run audit:primitive:illustration-assets.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Illustration Assets cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Illustration Assets cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Illustration Assets cascade audit passed: ${jsonOutput}`);
}

writeReport();
