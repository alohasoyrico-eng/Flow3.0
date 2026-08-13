#!/usr/bin/env node

const {
  fs,
  path,
  read,
  readJson,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-field-action-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-field-action-cascade-audit.md");
const packageFile = path.join(root, "package.json");
const runtimeFile = path.join(root, "packages/tokens/src/primitives/field-action.ts");
const primitiveIndexFile = path.join(root, "packages/tokens/src/primitives/index.ts");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/field-action.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/field-action.md");
const componentArtifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternArtifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const templateArtifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const foundationReports = {
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
  state: path.join(root, "docs/audits/foundation-state-cascade-audit.json"),
  frame: path.join(root, "docs/audits/foundation-frame-cascade-audit.json"),
  tone: path.join(root, "docs/audits/foundation-tone-cascade-audit.json"),
  energy: path.join(root, "docs/audits/foundation-energy-cascade-audit.json"),
};
const primitiveReports = {
  focus: path.join(root, "docs/audits/primitive-focus-cascade-audit.json"),
  message: path.join(root, "docs/audits/primitive-message-cascade-audit.json"),
  disabled: path.join(root, "docs/audits/primitive-disabled-cascade-audit.json"),
  loading: path.join(root, "docs/audits/primitive-loading-cascade-audit.json"),
  iconography: path.join(root, "docs/audits/primitive-iconography-cascade-audit.json"),
  spacing: path.join(root, "docs/audits/primitive-spacing-cascade-audit.json"),
  radius: path.join(root, "docs/audits/primitive-radius-cascade-audit.json"),
  measurement: path.join(root, "docs/audits/primitive-measurement-cascade-audit.json"),
};

const requiredRoles = ["clear", "reveal", "picker", "validate", "recover"];
const requiredStates = ["default", "hover", "focus", "pressed", "loading", "success", "error", "disabled"];
const requiredFoundations = ["Accessibility", "State", "Frame", "Tone", "Energy"];
const requiredCoordinatedPrimitives = ["Focus", "Message", "Disabled", "Loading", "Iconography", "Spacing", "Radius", "Measurement"];
const requiredTokenDependencies = [
  "component-field-*",
  "comp.input.*",
  "comp.icon-button.*",
  "sys.accessibility.*",
  "sys.state.*",
  "sys.frame.*",
  "sys.energy.*",
  "sys.tone.*",
  "focus.*",
  "message.*",
  "loading.*",
  "disabled.*",
  "field-action.*",
];

function rel(file) {
  return path.relative(root, file);
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function reportStatus(file) {
  if (!fs.existsSync(file)) return { file: rel(file), status: "missing", gaps: [] };
  const report = readJson(file) ?? {};
  return { file: rel(file), status: report.status ?? "missing", gaps: report.gaps ?? [] };
}

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

function collectReferences(dir) {
  const refs = [];
  for (const file of walkFiles(dir, (item) => item.endsWith(".json"))) {
    const source = readIfExists(file);
    if (!/(?:Field Action|field-action\.\*)/.test(source)) continue;
    refs.push(rel(file));
  }
  return refs;
}

function includesAll(present, required) {
  return required.filter((item) => !present.includes(item));
}

const runtime = readIfExists(runtimeFile);
const primitiveIndex = readIfExists(primitiveIndexFile);
const packageJson = readJson(packageFile);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.["field-action"] ?? specWrapper;
const contract = readIfExists(contractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const states = spec.states ?? [];
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const tokenDependencies = spec.tokenDependencies ?? [];
const componentRefs = collectReferences(componentArtifactsDir);
const patternRefs = collectReferences(patternArtifactsDir);
const templateRefs = collectReferences(templateArtifactsDir);
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, reportStatus(file)]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(primitiveReports).map(([name, file]) => [name, reportStatus(file)]),
);

const missingRoles = includesAll(roles, requiredRoles);
const missingStates = includesAll(states, requiredStates);
const missingFoundations = includesAll(foundations, requiredFoundations);
const missingCoordinatedPrimitives = includesAll(coordinatedPrimitives, requiredCoordinatedPrimitives);
const missingTokenDependencies = includesAll(tokenDependencies, requiredTokenDependencies);

const implementation = {
  runtimeFile: rel(runtimeFile),
  hasRuntimeSource: fs.existsSync(runtimeFile) && runtime.includes("fieldActionPrimitive"),
  marksP0RuntimeRequired: /p0RuntimeRequired:\s*true/.test(runtime),
  exportsFromPrimitiveIndex: /export \* from "\.\/field-action";/.test(primitiveIndex),
  exportsSpecSubpath: packageJson.exports?.["./specs/primitives/*"] === "./packages/specs/specs/unison-system/artifacts/primitives/*.json",
  exposesRejectIf: /rejectIf:\s*\[/.test(runtime) && /fake button/.test(runtime),
  exposesStateContract: /states:\s*\[/.test(runtime) && /pressed/.test(runtime) && /loading/.test(runtime),
};

const downstreamReferences = {
  components: {
    count: componentRefs.length,
    sampleFiles: componentRefs.slice(0, 12),
  },
  patterns: {
    count: patternRefs.length,
    sampleFiles: patternRefs.slice(0, 12),
  },
  templates: {
    count: templateRefs.length,
    sampleFiles: templateRefs.slice(0, 12),
  },
};

const gaps = [];
if (!contract.includes("Field Action sits between foundations and components")) {
  gaps.push("Primitive contract must state the Field Action bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingStates.length) gaps.push(`Missing primitive states: ${missingStates.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
if (missingTokenDependencies.length) gaps.push(`Missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
for (const [key, value] of Object.entries(implementation)) {
  if (key === "runtimeFile") continue;
  if (!value) gaps.push(`Field Action implementation signal missing: ${key}.`);
}
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
for (const [name, gate] of Object.entries(primitiveGate)) {
  if (gate.status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${gate.status}.`);
}
if (downstreamReferences.components.count < 2) {
  gaps.push(`Field Action must be referenced by field-like component specs; found ${downstreamReferences.components.count}.`);
}
if (downstreamReferences.patterns.count < 10) {
  gaps.push(`Field Action must be referenced by field-like pattern specs; found ${downstreamReferences.patterns.count}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Field Action",
  principle: "Field Action turns field-adjacent clear, reveal, picker, validation, and recovery actions into a primitive contract so components and patterns do not invent local fake controls.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  states: { required: requiredStates, present: states, missing: missingStates },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: { required: requiredCoordinatedPrimitives, present: coordinatedPrimitives, missing: missingCoordinatedPrimitives },
  tokenDependencies: {
    required: requiredTokenDependencies,
    present: requiredTokenDependencies.filter((dependency) => tokenDependencies.includes(dependency)),
    missing: missingTokenDependencies,
  },
  implementation,
  downstreamReferences,
  foundationGate,
  primitiveGate,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Field Action Cascade Audit",
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
    `- States: ${report.states.present.length}/${report.states.required.length}`,
    `- Coordinated primitives: ${report.coordinatedPrimitives.present.length}/${report.coordinatedPrimitives.required.length}`,
    `- Component references: ${report.downstreamReferences.components.count}`,
    `- Pattern references: ${report.downstreamReferences.patterns.count}`,
    `- Template references: ${report.downstreamReferences.templates.count}`,
    `- Runtime source: ${report.implementation.hasRuntimeSource ? "yes" : "no"}`,
    `- P0 runtime required: ${report.implementation.marksP0RuntimeRequired ? "yes" : "no"}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Field Action cascade audit is stale. Run: node packages/audit/scripts/report-primitive-field-action-cascade.js");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Field Action cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Field Action cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify({
    status: report.status,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
    componentReferences: report.downstreamReferences.components.count,
    patternReferences: report.downstreamReferences.patterns.count,
    gaps: report.gaps.length,
  }, null, 2));
}

writeReport();
