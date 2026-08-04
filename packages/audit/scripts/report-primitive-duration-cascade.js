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
const jsonOutput = path.join(outputDir, "primitive-duration-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-duration-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/duration.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/duration.md");
const foundationReports = {
  momentum: path.join(root, "docs/audits/foundation-momentum-cascade-audit.json"),
  state: path.join(root, "docs/audits/foundation-state-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
};
const coordinatedPrimitiveReports = {
  motionCurves: path.join(root, "docs/audits/primitive-motion-curves-cascade-audit.json"),
  loading: path.join(root, "docs/audits/primitive-loading-cascade-audit.json"),
};

const requiredRoles = ["instant", "touch", "base", "fast", "slow", "cycle"];
const requiredFoundations = ["Momentum", "State", "Accessibility"];
const requiredCoordinatedPrimitives = ["Motion Curves", "Loading"];
const requiredTokenAliases = [
  "--sys-duration-instant",
  "--sys-duration-touch",
  "--sys-duration-base",
  "--sys-duration-fast",
  "--sys-duration-snappy",
  "--sys-duration-slow",
  "--sys-duration-press",
  "--sys-duration-enter",
  "--sys-duration-overlay",
  "--sys-duration-sheet",
  "--sys-duration-reveal",
  "--sys-duration-medium",
  "--sys-duration-cycle",
  "--sys-duration-loading-spin",
  "--sys-duration-loading-cycle",
  "--sys-duration-progress",
  "--sys-duration-pulse",
];
const requiredComponentAliases = [
  "--component-duration-fast",
  "--component-duration-snappy",
  "--component-duration-instant",
  "--component-duration-enter",
  "--component-duration-exit",
  "--component-duration-state",
  "--component-duration-overlay",
  "--component-duration-sheet",
  "--component-duration-reveal",
  "--component-duration-slow",
  "--component-duration-press",
  "--component-duration-medium",
  "--component-duration-loop",
  "--component-duration-loading-spin",
  "--component-duration-loading-cycle",
  "--component-duration-progress",
  "--component-duration-shimmer",
  "--component-duration-pulse",
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

function findDirectMomentumDurationUses(files) {
  const findings = [];
  for (const file of files) {
    if (isReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--sys-momentum-duration-[a-z0-9-]+\)/g;
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

function findRawDurations(files) {
  const findings = [];
  for (const file of files) {
    if (isReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /\b\d+(?:\.\d+)?m?s\b/g;
    while ((match = pattern.exec(source))) {
      const lineStart = source.lastIndexOf("\n", match.index) + 1;
      const lineText = source.slice(lineStart, source.indexOf("\n", match.index));
      if (/grid-template-columns|transition-delay variable|duration audit/i.test(lineText)) continue;
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

const tokenCss = readIfExists(tokenCssFile);
const componentCss = readIfExists(componentCssFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const componentDeclarations = collectDeclarations(componentCss);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.duration ?? specWrapper;
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
  primitiveUses: (componentCss.match(/var\(--sys-duration-/g) ?? []).length,
  bridgeUses: (componentCss.match(/var\(--component-duration-/g) ?? []).length,
};
const directMomentumDurationUses = findDirectMomentumDurationUses(componentAndDocsFiles);
const rawDurations = findRawDurations(componentAndDocsFiles);
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(coordinatedPrimitiveReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
if (!contractSource.includes("Duration sits between foundations and components")) {
  gaps.push("Primitive contract must state the Duration bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (tokenAliases.missing.length) gaps.push(`Missing sys-duration aliases: ${tokenAliases.missing.join(", ")}.`);
if (componentBridge.missing.length) gaps.push(`Missing component duration bridge aliases: ${componentBridge.missing.join(", ")}.`);
if (componentBridge.primitiveUses < 10) gaps.push("Component duration bridge does not consume Duration primitive roles enough.");
if (componentBridge.bridgeUses < 40) gaps.push("Component CSS does not use component duration aliases enough to prove cascade adoption.");
if (directMomentumDurationUses.length) gaps.push(`Direct sys-momentum duration uses outside token/reference layers: ${directMomentumDurationUses.length}.`);
if (rawDurations.length) gaps.push(`Raw duration literals outside token/reference layers: ${rawDurations.length}.`);
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
for (const [name, gate] of Object.entries(primitiveGate)) {
  if (gate.status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${gate.status}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Duration",
  principle: "Duration consumes Momentum, State, and Accessibility, coordinates Motion Curves and Loading, then exposes sys-duration/component-duration aliases so component timing is semantic and not hardcoded.",
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
  review: { directMomentumDurationUses, rawDurations },
  foundationGate,
  primitiveGate,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Duration Cascade Audit",
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
    `- Direct foundation duration uses outside tokens/reference: ${report.review.directMomentumDurationUses.length}`,
    `- Raw duration literals outside tokens/reference: ${report.review.rawDurations.length}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Duration cascade audit is stale. Run npm run audit:primitive:duration.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Duration cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Duration cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Duration cascade audit passed: ${jsonOutput}`);
}

writeReport();
