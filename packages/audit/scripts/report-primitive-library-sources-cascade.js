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
const jsonOutput = path.join(outputDir, "primitive-library-sources-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-library-sources-cascade-audit.md");
const componentIndexFile = resolveBoundaryPath("#design-system/components-js", "packages/components/src/index.js");
const componentPackageFile = path.join(root, "packages/components/package.json");
const librarySourcesSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/library-sources.json");
const librarySourcesContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/library-sources.md");
const librarySourcesPrimitiveFile = path.join(root, "packages/components/src/primitives/library-sources.js");
const primitiveFamiliesFile = path.join(root, "packages/specs/specs/unison-system/meta/primitivefamilies.json");

const libraryPrimitives = [
  {
    id: "iconography",
    library: "material-symbols",
    audit: "primitive-iconography-cascade-audit.json",
    spec: "iconography.json",
    contract: "iconography.md",
    exports: ["setIconGlyph"],
    vendorFiles: ["material-symbols/material-symbols-rounded.css", "material-symbols/material-symbols-rounded-400.ttf"],
    dependency: null,
    consumptionPattern: /(?:setIconGlyph|iconGlyph)\(/,
  },
  {
    id: "country-flags",
    library: "country-flag-icons",
    audit: "primitive-country-flags-cascade-audit.json",
    spec: "country-flags.json",
    contract: "country-flags.md",
    exports: ["createCountryFlag", "countryFlagAssetPath", "hasCountryFlag", "listCountryFlags"],
    vendorFiles: ["country-flag-icons/LICENSE", "country-flag-icons/3x2/MX.svg"],
    dependency: "country-flag-icons",
    consumptionPattern: /createCountryFlag\(/,
  },
  {
    id: "animation-assets",
    library: "lottie-web",
    audit: "primitive-animation-assets-cascade-audit.json",
    spec: "animation-assets.json",
    contract: "animation-assets.md",
    exports: ["createAnimationAsset", "resolveAnimationRuntime", "prefersReducedAnimation"],
    vendorFiles: ["lottie-web/lottie.min.js", "lottie-web/LICENSE.md"],
    dependency: "lottie-web",
    consumptionPattern: /createAnimationAsset\(/,
  },
  {
    id: "illustration-assets",
    library: "open-doodles",
    audit: "primitive-illustration-assets-cascade-audit.json",
    spec: "illustration-assets.json",
    contract: "illustration-assets.md",
    exports: ["createIllustrationAsset", "hasIllustrationSource", "listIllustrationSources"],
    vendorFiles: ["open-doodles/manifest.json", "open-doodles/LICENSE.md"],
    dependency: null,
    consumptionPattern: /createIllustrationAsset\(/,
  },
  {
    id: "charts",
    library: "echarts",
    audit: "primitive-charts-cascade-audit.json",
    spec: "charts.json",
    contract: "charts.md",
    exports: ["createChartsPrimitive"],
    vendorFiles: ["echarts.esm.min.js", "echarts.LICENSE"],
    generatedVendorFiles: ["echarts.esm.min.js"],
    dependency: "echarts",
    consumptionPattern: /createChartsPrimitive\(/,
  },
  {
    id: "maps",
    library: "maplibre-gl",
    audit: "primitive-maps-cascade-audit.json",
    spec: "maps.json",
    contract: "maps.md",
    exports: ["createMapsPrimitive"],
    vendorFiles: ["maplibre-gl/maplibre-gl.js", "maplibre-gl/maplibre-gl.css", "maplibre-gl/LICENSE.txt"],
    dependency: "maplibre-gl",
    consumptionPattern: /createMapsPrimitive\(/,
  },
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
const docsIndexFile = repoDocsAppDir ? path.join(repoDocsAppDir, "index.html") : null;
const docsVendorDir = repoDocsAppDir ? path.join(repoDocsAppDir, "vendor") : null;
const docsGeneratedVendorDir = repoDocsAppDir ? path.join(repoDocsAppDir, "generated/vendor") : null;

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

const componentIndex = readIfExists(componentIndexFile);
const componentPackage = readJson(componentPackageFile);
const docsIndex = readIfExists(docsIndexFile);
const librarySourcesSpec = fs.existsSync(librarySourcesSpecFile) ? readJson(librarySourcesSpecFile) : {};
const librarySourcesContract = readIfExists(librarySourcesContractFile);
const librarySourcesPrimitive = readIfExists(librarySourcesPrimitiveFile);
const primitiveFamilies = fs.existsSync(primitiveFamiliesFile) ? readJson(primitiveFamiliesFile).primitiveFamilies ?? [] : [];
const componentSources = walkFiles(path.join(root, "packages/components/src"), (file) => file.endsWith(".js"))
  .filter((file) => !file.includes(`${path.sep}primitives${path.sep}`))
  .map(readIfExists)
  .join("\n");
const reactSources = walkFiles(path.join(root, "packages/react/src"), (file) => file.endsWith(".js"))
  .map(readIfExists)
  .join("\n");
const docsSources = repoDocsAppDir
  ? walkFiles(repoDocsAppDir, (file) => file.endsWith(".js") && !file.includes(`${path.sep}generated${path.sep}`))
  .map(readIfExists)
  .join("\n")
  : "";
const nonPrimitiveSources = `${componentSources}\n${reactSources}\n${docsSources}`;

const rows = libraryPrimitives.map((primitive) => {
  const auditFile = path.join(outputDir, primitive.audit);
  const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives", primitive.spec);
  const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives", primitive.contract);
  const primitiveFile = path.join(root, "packages/components/src/primitives", `${primitive.id}.js`);
  const audit = fs.existsSync(auditFile) ? readJson(auditFile) : {};
  const contract = readIfExists(contractFile);
  const spec = fs.existsSync(specFile) ? readJson(specFile) : {};
  const vendorPresent = repoDocsAppDir
    ? primitive.vendorFiles.every((file) => fs.existsSync(path.join(docsVendorDir, file)))
    : null;
  const generatedVendorPresent = repoDocsAppDir
    ? (primitive.generatedVendorFiles ?? []).every((file) => fs.existsSync(path.join(docsGeneratedVendorDir, file)))
    : null;
  const dependencyVersion = primitive.dependency
    ? componentPackage.dependencies?.[primitive.dependency] ?? componentPackage.devDependencies?.[primitive.dependency] ?? null
    : null;
  const exportsPresent = primitive.exports.every((name) => componentIndex.includes(name));
  const consumed = primitive.consumptionPattern.test(nonPrimitiveSources);
  const docsLoadsVendor = repoDocsAppDir
    ? primitive.vendorFiles.some((file) => docsIndex.includes(file)) || primitive.id === "charts" || primitive.id === "country-flags" || primitive.id === "illustration-assets"
    : null;
  return {
    id: primitive.id,
    library: primitive.library,
    docsScope,
    status: audit.status ?? "missing",
    spec: fs.existsSync(specFile),
    contract: fs.existsSync(contractFile) && contract.includes(primitive.id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")),
    primitive: fs.existsSync(primitiveFile),
    exported: exportsPresent,
    dependency: primitive.dependency ? Boolean(dependencyVersion) : true,
    dependencyVersion,
    vendor: vendorPresent,
    generatedVendor: generatedVendorPresent,
    consumed,
    docsLoadsVendor,
    foundations: spec.artifacts?.primitives?.[primitive.id]?.governingFoundations ?? spec.governingFoundations ?? [],
  };
});

const self = {
  id: "library-sources",
  spec: fs.existsSync(librarySourcesSpecFile),
  contract: fs.existsSync(librarySourcesContractFile) && librarySourcesContract.includes("# Library Sources"),
  primitive: fs.existsSync(librarySourcesPrimitiveFile),
  exported: ["listLibrarySources", "hasLibrarySource", "getLibrarySource"].every((name) => componentIndex.includes(name)),
  indexed: primitiveFamilies.includes("Library Sources"),
  governingFoundations: librarySourcesSpec.artifacts?.primitives?.["library-sources"]?.governingFoundations ?? [],
  coordinatedPrimitives: librarySourcesSpec.artifacts?.primitives?.["library-sources"]?.coordinatesPrimitives ?? [],
  records: [...librarySourcesPrimitive.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]),
};

const gaps = [];
if (!self.spec) gaps.push("library-sources is missing a primitive spec.");
if (!self.contract) gaps.push("library-sources is missing a generated primitive contract.");
if (!self.primitive) gaps.push("library-sources is missing a primitive implementation.");
if (!self.exported) gaps.push("library-sources registry API is not exported from the component package index.");
if (!self.indexed) gaps.push("library-sources is missing from primitiveFamilies.");
if (!self.governingFoundations.length) gaps.push("library-sources does not declare governing foundations.");
if (self.coordinatedPrimitives.length < libraryPrimitives.length) gaps.push("library-sources does not coordinate every library-backed primitive.");
for (const primitive of libraryPrimitives) {
  if (!self.records.includes(primitive.id)) gaps.push(`library-sources registry is missing ${primitive.id}.`);
}
for (const row of rows) {
  if (!row.spec) gaps.push(`${row.id} is missing a primitive spec.`);
  if (!row.contract) gaps.push(`${row.id} is missing a primitive contract signal.`);
  if (!row.primitive) gaps.push(`${row.id} is missing a primitive implementation.`);
  if (!row.exported) gaps.push(`${row.id} is not exported from the component package index.`);
  if (!row.dependency) gaps.push(`${row.id} is missing package dependency for ${row.library}.`);
  if (repoDocsAppDir && !row.vendor) gaps.push(`${row.id} is missing local vendor/source files for ${row.library}.`);
  if (repoDocsAppDir && !row.generatedVendor) gaps.push(`${row.id} is missing generated vendor bridge files.`);
  if (repoDocsAppDir && !row.docsLoadsVendor) gaps.push(`${row.id} runtime/source is not reachable by Docs.`);
  if (!row.foundations.length) gaps.push(`${row.id} does not declare governing foundations.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  principle: "Library primitives are the only boundary where third-party visual/runtime sources enter Flow; components, patterns, templates, and Docs must consume the primitive API instead of duplicating vendors or drawing assets ad hoc.",
  gaps,
  docsScope,
  self,
  rows,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Library Sources Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Gaps",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    "",
    "## Self Gate",
    `- Docs scope: ${report.docsScope}`,
    `- library-sources: spec ${report.self.spec ? "yes" : "no"}; contract ${report.self.contract ? "yes" : "no"}; exported ${report.self.exported ? "yes" : "no"}; records ${report.self.records.length}`,
    "",
    "## Library Primitives",
    ...report.rows.map((row) => `- ${row.id}: ${row.status}; library ${row.library}; exported ${row.exported ? "yes" : "no"}; vendor ${row.vendor ? "yes" : "no"}; consumed ${row.consumed ? "yes" : "no"}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Library Sources cascade audit is stale. Run node packages/audit/scripts/report-primitive-library-sources-cascade.js.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Library Sources cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Library Sources cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Library Sources cascade audit passed: ${jsonOutput}`);
}

writeReport();
