#!/usr/bin/env node

const {
  docsAppDir,
  docsStyleModuleFiles,
  fs,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-iconography-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-iconography-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const componentSourceDir = path.join(root, "packages/components/src");
const docsIndexFile = path.join(docsAppDir, "index.html");
const materialSymbolsCssFile = path.join(docsAppDir, "vendor/material-symbols/material-symbols-rounded.css");
const materialSymbolsFontFiles = [
  "material-symbols-rounded-400.ttf",
  "material-symbols-rounded-500.ttf",
  "material-symbols-rounded-600.ttf",
  "material-symbols-rounded-700.ttf",
].map((file) => path.join(docsAppDir, "vendor/material-symbols", file));
const iconographySpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/iconography.json");
const iconographyContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/iconography.md");
const foundationReports = {
  iconography: path.join(root, "docs/audits/foundation-iconography-cascade-audit.json"),
  symbol: path.join(root, "docs/audits/foundation-symbol-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
  state: path.join(root, "docs/audits/foundation-state-cascade-audit.json"),
  energy: path.join(root, "docs/audits/foundation-energy-cascade-audit.json"),
};
const coordinatedPrimitiveReports = {
  "library-sources": path.join(root, "docs/audits/primitive-library-sources-cascade-audit.json"),
  density: path.join(root, "docs/audits/primitive-density-cascade-audit.json"),
  focus: path.join(root, "docs/audits/primitive-focus-cascade-audit.json"),
  disabled: path.join(root, "docs/audits/primitive-disabled-cascade-audit.json"),
};

const requiredRoles = ["action", "navigation", "status", "object", "decorative"];
const requiredFoundations = ["Iconography", "Symbol", "Accessibility", "State", "Energy"];
const requiredCoordinatedPrimitives = ["Library Sources", "Density", "Focus", "Disabled"];
const requiredTokenDependencies = [
  "ref.symbol.*",
  "sys.iconography.*",
  "sys.symbol.*",
  "sys.accessibility.*",
  "sys.state.*",
  "sys.energy.*",
  "library.*",
  "density.*",
  "focus.*",
  "disabled.*",
  "icon.*",
  "Material Symbols Rounded",
];
const requiredTokenAliases = [
  "--sys-icon-family",
  "--sys-icon-variation-filled",
  "--sys-icon-variation-filled-strong",
  "--sys-icon-variation-outline-strong",
  "--sys-icon-size-sm",
  "--sys-icon-size-sm-plus",
  "--sys-icon-size-md",
  "--sys-icon-size-md-plus",
  "--sys-icon-size-lg",
  "--sys-icon-size-lg-plus",
  "--sys-icon-size-marker",
  "--sys-icon-size-station",
  "--sys-icon-size-display-sm",
  "--sys-icon-size-display-md",
  "--sys-icon-color-action",
  "--sys-icon-color-navigation",
  "--sys-icon-color-status",
  "--sys-icon-color-warning",
  "--sys-icon-color-danger",
  "--sys-icon-color-muted",
  "--sys-icon-color-disabled",
  "--sys-icon-touch-target-min",
  "--sys-icon-focus-ring",
  "--sys-icon-focus-offset",
];
const requiredComponentAliases = [
  "--component-icon-family",
  "--component-icon-variation-filled",
  "--component-icon-variation-filled-strong",
  "--component-icon-variation-outline-strong",
  "--component-icon-size-sm",
  "--component-icon-size-md",
  "--component-icon-size-lg",
  "--component-icon-color-action",
  "--component-icon-color-navigation",
  "--component-icon-color-status",
  "--component-icon-color-warning",
  "--component-icon-color-danger",
  "--component-icon-color-muted",
  "--component-icon-color-disabled",
];

function rel(file) {
  return path.relative(root, file);
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function collectDeclarations(css) {
  const map = new Map();
  for (const match of css.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    if (!map.has(match.groups.name)) map.set(match.groups.name, match.groups.value.trim());
  }
  return map;
}

function findDirectFoundationIconographyUses(files) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--sys-iconography-[a-z0-9-]+\)/g;
    while ((match = pattern.exec(source))) {
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match[0],
      });
    }
  }
  return findings;
}

function collectJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectJsFiles(file));
    if (entry.isFile() && entry.name.endsWith(".js")) files.push(file);
  }
  return files;
}

function findDirectGlyphAssignments(files) {
  const findings = [];
  const pattern = /\.(?:textContent|innerText)\s*=\s*(?:icon\b|item\.icon\b|.*Icon\b|"(?:expand_more|chevron_right|check|close|more_horiz|warning|error|smartphone|ac_unit|contactless)")/g;
  for (const file of files) {
    if (file.endsWith("primitives/iconography.js")) continue;
    const source = readIfExists(file);
    let match;
    while ((match = pattern.exec(source))) {
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match[0],
      });
    }
  }
  return findings;
}

function foundationStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return report?.status ?? "missing";
}

const tokenCss = readIfExists(tokenCssFile);
const componentCss = readIfExists(componentCssFile);
const docsIndex = readIfExists(docsIndexFile);
const materialSymbolsCss = readIfExists(materialSymbolsCssFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const componentDeclarations = collectDeclarations(componentCss);
const specFile = readJson(iconographySpecFile);
const spec = specFile.artifacts?.primitives?.iconography ?? specFile;
const contractSource = readIfExists(iconographyContractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];
const componentAndDocsFiles = [
  componentCssFile,
  ...docsStyleModuleFiles,
];
const componentJsFiles = collectJsFiles(componentSourceDir);

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const componentBridge = {
  required: requiredComponentAliases,
  present: requiredComponentAliases.filter((token) => componentDeclarations.has(token)),
  missing: requiredComponentAliases.filter((token) => !componentDeclarations.has(token)),
  primitiveUses: (componentCss.match(/var\(--sys-icon-/g) ?? []).length,
  bridgeUses: (componentCss.match(/var\(--component-icon-/g) ?? []).length,
};
const directFoundationUses = findDirectFoundationIconographyUses(componentAndDocsFiles);
const directGlyphAssignments = findDirectGlyphAssignments(componentJsFiles);
const vendorBridge = {
  docsUsesLocalMaterialSymbols: /vendor\/material-symbols\/material-symbols-rounded\.css/.test(docsIndex),
  docsUsesRemoteMaterialSymbols: /fonts\.googleapis|fonts\.gstatic/.test(docsIndex),
  cssUsesRemoteFontSource: /fonts\.googleapis|fonts\.gstatic|https?:\/\//.test(materialSymbolsCss),
  cssDefinesMaterialSymbols: /font-family:\s*['"]Material Symbols Rounded['"]/.test(materialSymbolsCss),
  fontFilesPresent: materialSymbolsFontFiles.filter((file) => fs.existsSync(file)).map(rel),
  fontFilesMissing: materialSymbolsFontFiles.filter((file) => !fs.existsSync(file)).map(rel),
};
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(coordinatedPrimitiveReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);
const librarySourcesReport = fs.existsSync(coordinatedPrimitiveReports["library-sources"])
  ? readJson(coordinatedPrimitiveReports["library-sources"])
  : {};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
if (!contractSource.includes("Iconography sits between foundations and components")) {
  gaps.push("Primitive contract must state the Iconography bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (missingTokenDependencies.length) {
  gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
}
if (tokenAliases.missing.length) gaps.push(`Missing sys-icon aliases: ${tokenAliases.missing.join(", ")}.`);
if (componentBridge.missing.length) gaps.push(`Missing component icon bridge aliases: ${componentBridge.missing.join(", ")}.`);
if (componentBridge.primitiveUses < 8) gaps.push("Component CSS does not consume the icon primitive enough to prove cascade adoption.");
if (componentBridge.bridgeUses < 6) gaps.push("Component CSS does not expose reusable component icon bridge aliases.");
if (directFoundationUses.length) {
  gaps.push(`Direct sys-iconography use outside token/foundation layer: ${directFoundationUses.length}.`);
}
if (directGlyphAssignments.length) {
  gaps.push(`Direct icon glyph assignment outside Iconography primitive: ${directGlyphAssignments.length}.`);
}
if (!vendorBridge.docsUsesLocalMaterialSymbols) gaps.push("Docs must load Material Symbols from the local vendor bridge.");
if (vendorBridge.docsUsesRemoteMaterialSymbols) gaps.push("Docs must not depend on remote Google Fonts for Material Symbols.");
if (vendorBridge.cssUsesRemoteFontSource) gaps.push("Material Symbols vendor CSS must not reference remote font sources.");
if (!vendorBridge.cssDefinesMaterialSymbols) gaps.push("Material Symbols vendor CSS must define the expected font family.");
if (vendorBridge.fontFilesMissing.length) gaps.push(`Missing local Material Symbols font files: ${vendorBridge.fontFilesMissing.join(", ")}.`);
const librarySourceRow = (librarySourcesReport.rows ?? []).find((row) => row.id === "iconography");
if (!librarySourceRow || librarySourceRow.library !== "material-symbols") {
  gaps.push("Library Sources must register Iconography as material-symbols.");
}
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
for (const [name, gate] of Object.entries(primitiveGate)) {
  if (gate.status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${gate.status}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Iconography",
  principle: "Iconography consumes the Iconography, Symbol, Accessibility, State, and Energy foundations, then coordinates Density, Focus, and Disabled before exposing a narrow sys-icon/component-icon API for components, patterns, templates, and docs.",
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
  componentBridge,
  vendorBridge,
  librarySources: {
    row: librarySourceRow ?? null,
  },
  review: { directFoundationUses, directGlyphAssignments },
  foundationGate,
  primitiveGate,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Iconography Cascade Audit",
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
    `- Component bridge aliases: ${report.componentBridge.present.length}/${report.componentBridge.required.length}`,
    `- Component primitive token uses: ${report.componentBridge.primitiveUses}`,
    `- Component bridge token uses: ${report.componentBridge.bridgeUses}`,
    `- Local Material Symbols fonts: ${report.vendorBridge.fontFilesPresent.length}/${materialSymbolsFontFiles.length}`,
    `- Remote Material Symbols refs in docs: ${report.vendorBridge.docsUsesRemoteMaterialSymbols ? "yes" : "no"}`,
    `- Direct foundation iconography uses outside tokens/foundations: ${report.review.directFoundationUses.length}`,
    `- Direct icon glyph assignments outside primitive: ${report.review.directGlyphAssignments.length}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Iconography cascade audit is stale. Run npm run audit:primitive:iconography.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Iconography cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Iconography cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Iconography cascade audit passed: ${jsonOutput}`);
}

writeReport();
