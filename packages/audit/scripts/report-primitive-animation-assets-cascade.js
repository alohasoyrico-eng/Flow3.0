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
const jsonOutput = path.join(outputDir, "primitive-animation-assets-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-animation-assets-cascade-audit.md");
const componentPackageFile = path.join(root, "packages/components/package.json");
const docsIndexFile = path.join(root, "apps/docs/index.html");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const primitiveFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/primitives/animation-assets.js");
const componentIndexFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/index.js");
const motionComponentFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/components/motion.js");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/animation-assets.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/animation-assets.md");
const vendorRuntimeFile = path.join(root, "apps/docs/vendor/lottie-web/lottie.min.js");
const vendorLicenseFile = path.join(root, "apps/docs/vendor/lottie-web/LICENSE.md");
const librarySourcesReportFile = path.join(root, "docs/audits/primitive-library-sources-cascade-audit.json");
const durationReportFile = path.join(root, "docs/audits/primitive-duration-cascade-audit.json");
const motionCurvesReportFile = path.join(root, "docs/audits/primitive-motion-curves-cascade-audit.json");
const loadingReportFile = path.join(root, "docs/audits/primitive-loading-cascade-audit.json");
const foundationReports = {
  momentum: path.join(root, "docs/audits/foundation-momentum-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
  symbol: path.join(root, "docs/audits/foundation-symbol-cascade-audit.json"),
  energy: path.join(root, "docs/audits/foundation-energy-cascade-audit.json"),
  frame: path.join(root, "docs/audits/foundation-frame-cascade-audit.json"),
};

const requiredRoles = ["runtime", "source", "fallback", "lifecycle"];
const requiredFoundations = ["Momentum", "Accessibility", "Symbol", "Energy", "Frame"];
const requiredCoordinatedPrimitives = ["Library Sources", "Duration", "Motion Curves", "Loading"];
const requiredTokenDependencies = [
  "animationAsset.*",
  "library.*",
  "duration.*",
  "motionCurve.*",
  "loading.*",
  "sys.momentum.*",
  "sys.accessibility.*",
  "sys.symbol.*",
  "sys.energy.*",
  "sys.frame.*",
  "lottie-web",
];

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function reportStatus(file) {
  return fs.existsSync(file) ? readJson(file)?.status ?? "missing" : "missing";
}

const packageJson = readJson(componentPackageFile);
const docsIndex = readIfExists(docsIndexFile);
const css = readIfExists(componentCssFile);
const primitive = readIfExists(primitiveFile);
const index = readIfExists(componentIndexFile);
const motion = readIfExists(motionComponentFile);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.["animation-assets"] ?? specWrapper;
const contract = readIfExists(contractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, reportStatus(file)]),
);
const primitiveGate = {
  librarySources: reportStatus(librarySourcesReportFile),
  duration: reportStatus(durationReportFile),
  motionCurves: reportStatus(motionCurvesReportFile),
  loading: reportStatus(loadingReportFile),
};
const librarySourcesReport = fs.existsSync(librarySourcesReportFile) ? readJson(librarySourcesReportFile) : {};

const implementation = {
  packageDependency: packageJson.dependencies?.["lottie-web"] ?? null,
  vendorRuntimePresent: fs.existsSync(vendorRuntimeFile),
  vendorLicensePresent: fs.existsSync(vendorLicenseFile),
  docsLoadsLocalRuntime: /vendor\/lottie-web\/lottie\.min\.js/.test(docsIndex) && !/unpkg|jsdelivr|cdnjs/.test(docsIndex),
  exportsPrimitiveApi: /createAnimationAsset/.test(index) && /resolveAnimationRuntime/.test(index) && /prefersReducedAnimation/.test(index),
  usesLibraryBridge: /lottie-web/.test(primitive) && /loadAnimation/.test(primitive) && /resolveAnimationRuntime/.test(primitive),
  supportsReducedMotion: /prefers-reduced-motion:\s*reduce/.test(primitive) && /reduced-motion/.test(primitive),
  supportsFallback: /animation-asset__fallback/.test(primitive) && /fallbackText/.test(primitive),
  cssTargetsAsset: /\.animation-asset\b/.test(css) && /animation-asset__viewport/.test(css),
  cssTargetsFallback: /animation-asset__fallback-icon/.test(css) && /animation-asset__fallback-label/.test(css),
  animatedMomentConsumesPrimitive: /createAnimationAsset/.test(motion) && /animated-moment__asset/.test(motion),
  animatedMomentAvoidsRuntimeOwnership: !/loadAnimation|globalThis\.lottie/.test(motion),
  docsAvoidsRemoteRuntime: !/unpkg|jsdelivr|cdnjs/.test(docsIndex),
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
if (!contract.includes("Animation Assets sits between foundations and components")) {
  gaps.push("Primitive contract must state the Animation Assets bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (missingTokenDependencies.length) gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
if (!implementation.packageDependency) gaps.push("Components package must declare lottie-web as the animation runtime dependency.");
for (const [key, value] of Object.entries(implementation)) {
  if (key === "packageDependency") continue;
  if (!value) gaps.push(`Animation Assets implementation signal missing: ${key}.`);
}
for (const [name, status] of Object.entries(foundationGate)) {
  if (status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${status}.`);
}
for (const [name, status] of Object.entries(primitiveGate)) {
  if (status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${status}.`);
}
const librarySourceRow = (librarySourcesReport.rows ?? []).find((row) => row.id === "animation-assets");
if (!librarySourceRow || librarySourceRow.library !== "lottie-web") {
  gaps.push("Library Sources must register Animation Assets as lottie-web.");
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Animation Assets",
  principle: "Animation Assets converts a free runtime into Flow-owned playback, fallback, reduced-motion, and lifecycle behavior so components never own animation runtime logic.",
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
    "# Primitive Animation Assets Cascade Audit",
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
    `- Package dependency: ${report.implementation.packageDependency ?? "missing"}`,
    `- Local runtime: ${report.implementation.vendorRuntimePresent ? "yes" : "no"}`,
    `- Animated Moment consumes primitive: ${report.implementation.animatedMomentConsumesPrimitive ? "yes" : "no"}`,
    `- Animated Moment owns runtime: ${report.implementation.animatedMomentAvoidsRuntimeOwnership ? "no" : "yes"}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, status]) => `- ${name}: ${status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, status]) => `- ${name}: ${status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Animation Assets cascade audit is stale. Run npm run audit:primitive:animation-assets.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Animation Assets cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Animation Assets cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Animation Assets cascade audit passed: ${jsonOutput}`);
}

writeReport();
