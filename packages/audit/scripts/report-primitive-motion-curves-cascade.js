#!/usr/bin/env node

const {
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
const jsonOutput = path.join(outputDir, "primitive-motion-curves-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-motion-curves-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/motion-curves.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/motion-curves.md");
const foundationReports = {
  momentum: path.join(root, "docs/audits/foundation-momentum-cascade-audit.json"),
  state: path.join(root, "docs/audits/foundation-state-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
};
const coordinatedPrimitiveReports = {
  duration: path.join(root, "docs/audits/primitive-duration-cascade-audit.json"),
  loading: path.join(root, "docs/audits/primitive-loading-cascade-audit.json"),
};

const requiredRoles = ["touch", "enter", "exit", "move", "standard", "linear"];
const requiredFoundations = ["Momentum", "State", "Accessibility"];
const requiredCoordinatedPrimitives = ["Duration", "Loading"];
const requiredTokenAliases = [
  "--sys-motion-curve-touch",
  "--sys-motion-curve-standard",
  "--sys-motion-curve-enter",
  "--sys-motion-curve-exit",
  "--sys-motion-curve-move",
  "--sys-motion-curve-linear",
];
const requiredComponentAliases = [
  "--component-ease-standard",
  "--component-ease-emphasis",
  "--component-ease-progress",
  "--component-ease-enter",
  "--component-ease-move",
  "--component-ease-exit",
  "--component-ease-state",
  "--component-ease-press",
  "--component-ease-loading-rhythm",
  "--component-ease-linear",
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

function isReferenceLayer(file) {
  const relative = rel(file);
  return file === tokenCssFile
    || relative.includes("03c-motion-reference-");
}

function findDirectMomentumEasingUses(files) {
  const findings = [];
  for (const file of files) {
    if (isReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--sys-momentum-easing-[a-z0-9-]+\)/g;
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

function findRawCurves(files) {
  const findings = [];
  for (const file of files) {
    if (isReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /\b(?:cubic-bezier\([^)]*\)|ease(?:-in|-out|-in-out)?\b|linear\b)/g;
    while ((match = pattern.exec(source))) {
      const lineStart = source.lastIndexOf("\n", match.index) + 1;
      const lineText = source.slice(lineStart, source.indexOf("\n", match.index));
      if (/linear-gradient|text-transform|aria-label|release/i.test(lineText)) continue;
      if (/var\(--/.test(lineText) && !/cubic-bezier/.test(match[0])) continue;
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: lineText.trim(),
      });
    }
  }
  return findings;
}

function foundationStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return report?.status ?? "missing";
}

function reportStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return {
    status: report?.status ?? "missing",
    gaps: report?.gaps ?? [],
  };
}

const tokenCss = readIfExists(tokenCssFile);
const componentCss = readIfExists(componentCssFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const componentDeclarations = collectDeclarations(componentCss);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.["motion-curves"] ?? specWrapper;
const contractSource = readIfExists(contractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const componentAndDocsFiles = [componentCssFile, ...docsStyleModuleFiles];

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const componentBridge = {
  required: requiredComponentAliases,
  present: requiredComponentAliases.filter((token) => componentDeclarations.has(token)),
  missing: requiredComponentAliases.filter((token) => !componentDeclarations.has(token)),
  primitiveUses: (componentCss.match(/var\(--sys-motion-curve-/g) ?? []).length,
  bridgeUses: (componentCss.match(/var\(--component-ease-/g) ?? []).length,
};
const directMomentumEasingUses = findDirectMomentumEasingUses(componentAndDocsFiles);
const rawCurves = findRawCurves(componentAndDocsFiles);
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(coordinatedPrimitiveReports).map(([name, file]) => [name, reportStatus(file)]),
);

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
if (!contractSource.includes("Motion Curves sits between foundations and components")) {
  gaps.push("Primitive contract must state the Motion Curves bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (tokenAliases.missing.length) gaps.push(`Missing sys-motion-curve aliases: ${tokenAliases.missing.join(", ")}.`);
if (componentBridge.missing.length) gaps.push(`Missing component ease bridge aliases: ${componentBridge.missing.join(", ")}.`);
if (componentBridge.primitiveUses < requiredTokenAliases.length) gaps.push("Component ease bridge does not consume all motion curve roles.");
if (componentBridge.bridgeUses < 24) gaps.push("Component CSS does not use component ease aliases enough to prove cascade adoption.");
if (directMomentumEasingUses.length) gaps.push(`Direct sys-momentum easing uses outside token/reference layers: ${directMomentumEasingUses.length}.`);
if (rawCurves.length) gaps.push(`Raw motion curve literals outside token/reference layers: ${rawCurves.length}.`);
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
if (primitiveGate.loading.status !== "pass") {
  gaps.push(`Primitive dependency gate is not pass: loading is ${primitiveGate.loading.status}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Motion Curves",
  principle: "Motion Curves consumes Momentum, State, and Accessibility, coordinates Duration and Loading, then exposes sys-motion-curve/component-ease aliases so lifecycle, touch, move, and continuous motion are not hardcoded.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: {
    required: requiredCoordinatedPrimitives,
    present: coordinatedPrimitives,
    missing: missingCoordinatedPrimitives,
  },
  tokenAliases,
  componentBridge,
  review: { directMomentumEasingUses, rawCurves },
  foundationGate,
  primitiveGate: {
    duration: { ...primitiveGate.duration, relationship: "lateral-coordination" },
    loading: { ...primitiveGate.loading, relationship: "upstream-runtime" },
  },
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Motion Curves Cascade Audit",
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
    `- Direct foundation easing uses outside tokens/reference: ${report.review.directMomentumEasingUses.length}`,
    `- Raw motion curve literals outside tokens/reference: ${report.review.rawCurves.length}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Motion Curves cascade audit is stale. Run npm run audit:primitive:motion-curves.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Motion Curves cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Motion Curves cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Motion Curves cascade audit passed: ${jsonOutput}`);
}

writeReport();
