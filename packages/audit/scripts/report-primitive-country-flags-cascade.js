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
const jsonOutput = path.join(outputDir, "primitive-country-flags-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-country-flags-cascade-audit.md");
const componentPackageFile = path.join(root, "packages/components/package.json");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const primitiveFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/primitives/country-flags.js");
const componentIndexFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/index.js");
const reactCountrySelectorFile = path.join(root, "packages/react/src/CountrySelector.js");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/country-flags.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/country-flags.md");
const vendorDir = path.join(root, "apps/docs/vendor/country-flag-icons/3x2");
const vendorLicenseFile = path.join(root, "apps/docs/vendor/country-flag-icons/LICENSE");
const primitiveReports = {
  "library-sources": path.join(root, "docs/audits/primitive-library-sources-cascade-audit.json"),
  iconography: path.join(root, "docs/audits/primitive-iconography-cascade-audit.json"),
  radius: path.join(root, "docs/audits/primitive-radius-cascade-audit.json"),
  spacing: path.join(root, "docs/audits/primitive-spacing-cascade-audit.json"),
};
const foundationReports = {
  iconography: path.join(root, "docs/audits/foundation-iconography-cascade-audit.json"),
  symbol: path.join(root, "docs/audits/foundation-symbol-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
  energy: path.join(root, "docs/audits/foundation-energy-cascade-audit.json"),
  frame: path.join(root, "docs/audits/foundation-frame-cascade-audit.json"),
};

const requiredRoles = ["asset", "mask", "identity", "fallback"];
const requiredFoundations = ["Iconography", "Symbol", "Accessibility", "Energy", "Frame"];
const requiredCoordinatedPrimitives = ["Library Sources", "Iconography", "Radius", "Spacing"];
const requiredTokenDependencies = [
  "countryFlag.*",
  "library.*",
  "sys.iconography.*",
  "sys.symbol.*",
  "sys.accessibility.*",
  "sys.energy.*",
  "sys.frame.*",
  "icon.*",
  "radius.*",
  "spacing.*",
  "country-flag-icons",
];

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function reportStatus(file) {
  return fs.existsSync(file) ? readJson(file)?.status ?? "missing" : "missing";
}

function countVendorFlags() {
  if (!fs.existsSync(vendorDir)) return 0;
  return fs.readdirSync(vendorDir).filter((file) => /^[A-Z]{2}(?:-[A-Z]{2,3})?\.svg$/.test(file)).length;
}

const packageJson = readJson(componentPackageFile);
const css = readIfExists(componentCssFile);
const primitive = readIfExists(primitiveFile);
const index = readIfExists(componentIndexFile);
const reactCountrySelector = readIfExists(reactCountrySelectorFile);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.["country-flags"] ?? specWrapper;
const contract = readIfExists(contractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];
const vendorFlagCount = countVendorFlags();
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, reportStatus(file)]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(primitiveReports).map(([name, file]) => [name, reportStatus(file)]),
);
const librarySourcesReport = fs.existsSync(primitiveReports["library-sources"])
  ? readJson(primitiveReports["library-sources"])
  : {};

const implementation = {
  packageDependency: packageJson.dependencies?.["country-flag-icons"] ?? null,
  vendorFlagCount,
  vendorLicensePresent: fs.existsSync(vendorLicenseFile),
  exportsPrimitiveApi: /createCountryFlag/.test(index) && /countryFlagAssetPath/.test(index) && /hasCountryFlag/.test(index),
  usesLibraryBridge: /country-flag-icons/.test(primitive) && /supportedCountryFlags/.test(primitive),
  createsImageAsset: /document\.createElement\("img"\)/.test(primitive) && /country-flag__asset/.test(primitive),
  supportsFallback: /country-flag__fallback/.test(primitive) && /onerror/.test(primitive),
  avoidsHandDrawnSvg: !/createElementNS|stripes|polygon|clipPath|setAttribute\("fill"/.test(primitive),
  cssTargetsAsset: /country-flag__asset/.test(css) && /object-fit:\s*cover/.test(css),
  cssTargetsFallback: /country-flag__fallback/.test(css),
  cssUsesCircularMask: /\.country-flag,\s*\n\.phone-input__flag\s*\{[\s\S]*border-radius:\s*var\(--component-radius-pill\);[\s\S]*overflow:\s*hidden;/.test(css),
  cssAssetFillsMask: /\.country-flag__asset,\s*\n\.country-flag img,\s*\n\.country-flag__fallback\s*\{[\s\S]*block-size:\s*100%;[\s\S]*inline-size:\s*100%;/.test(css),
  cssAssetAvoidsOwnBorder: !/\.country-flag__(?:asset|img)[\s\S]{0,160}border:/.test(css),
  cssNoSvgTarget: !/\.country-flag\s+svg/.test(css),
  countrySelectorConsumesPrimitive: /countryFlagAssetPath/.test(reactCountrySelector) && !/countryFlagData|createElementNS/.test(reactCountrySelector),
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitiveName) => !coordinatedPrimitives.includes(primitiveName));
const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
if (!contract.includes("Country Flags sits between foundations and components")) {
  gaps.push("Primitive contract must state the Country Flags bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
if (missingTokenDependencies.length) gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
if (!implementation.packageDependency) gaps.push("Components package must declare country-flag-icons as the flag asset dependency.");
if (implementation.vendorFlagCount < 200) gaps.push(`Docs vendor bridge must include world flag assets; found ${implementation.vendorFlagCount}.`);
if (!implementation.vendorLicensePresent) gaps.push("Docs vendor bridge must include the country-flag-icons MIT license.");
for (const [key, value] of Object.entries(implementation)) {
  if (["packageDependency", "vendorFlagCount"].includes(key)) continue;
  if (!value) gaps.push(`Country Flags implementation signal missing: ${key}.`);
}
for (const [name, status] of Object.entries(foundationGate)) {
  if (status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${status}.`);
}
for (const [name, status] of Object.entries(primitiveGate)) {
  if (status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${status}.`);
}
const librarySourceRow = (librarySourcesReport.rows ?? []).find((row) => row.id === "country-flags");
if (!librarySourceRow || librarySourceRow.library !== "country-flag-icons") {
  gaps.push("Library Sources must register Country Flags as country-flag-icons.");
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Country Flags",
  principle: "Country Flags converts a free library into Flow-owned country identity assets so Phone Input and Country Selector never draw or duplicate flags.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: { required: requiredCoordinatedPrimitives, present: coordinatedPrimitives, missing: missingCoordinatedPrimitives },
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
    "# Primitive Country Flags Cascade Audit",
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
    `- Vendor flags: ${report.implementation.vendorFlagCount}`,
    `- Package dependency: ${report.implementation.packageDependency ?? "missing"}`,
    `- CSS targets image asset: ${report.implementation.cssTargetsAsset ? "yes" : "no"}`,
    `- CSS uses circular mask: ${report.implementation.cssUsesCircularMask ? "yes" : "no"}`,
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
      console.error("Primitive Country Flags cascade audit is stale. Run npm run audit:primitive:country-flags.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Country Flags cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Country Flags cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Country Flags cascade audit passed: ${jsonOutput}`);
}

writeReport();
