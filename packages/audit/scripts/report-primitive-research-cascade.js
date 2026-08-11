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
const jsonOutput = path.join(outputDir, "primitive-research-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-research-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const researchSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/research.json");
const researchContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/research.md");
const growthReportFile = path.join(root, "docs/audits/foundation-growth-cascade-audit.json");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const voiceReportFile = path.join(root, "docs/audits/foundation-voice-cascade-audit.json");
const chartsReportFile = path.join(root, "docs/audits/primitive-charts-cascade-audit.json");
const measurementReportFile = path.join(root, "docs/audits/primitive-measurement-cascade-audit.json");
const messageReportFile = path.join(root, "docs/audits/primitive-message-cascade-audit.json");
const componentContractDir = path.join(root, "packages/content/content/component-contracts/components");
const componentCopyDir = path.join(root, "packages/content/content/component-copy/components");
const patternContractDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const patternCopyDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["question", "hypothesis", "context", "evidence", "confidence"];
const requiredFoundations = ["Growth", "Tone", "Accessibility", "Voice"];
const requiredCoordinatedPrimitives = ["Measurement", "Message", "Charts"];
const requiredTokenAliases = [
  "--sys-research-question-font",
  "--sys-research-question-weight",
  "--sys-research-hypothesis-color",
  "--sys-research-context-color",
  "--sys-research-evidence-color",
  "--sys-research-confidence-low-color",
  "--sys-research-confidence-medium-color",
  "--sys-research-confidence-high-color",
  "--sys-research-risk-color",
  "--sys-research-decision-link-color",
  "--sys-research-readable-line-height",
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

function groupIdForFile(file) {
  if (file.startsWith(componentCopyDir)) return `component:${path.relative(componentCopyDir, file).split(path.sep)[0]}`;
  if (file.startsWith(componentContractDir)) return `component:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
  if (file.startsWith(patternCopyDir)) return `pattern:${path.relative(patternCopyDir, file).split(path.sep)[0]}`;
  if (file.startsWith(patternContractDir)) return `pattern:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
  if (file.startsWith(templateDir)) return `template:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
  return `file:${rel(file)}`;
}

function collectArtifactRefs(dir, pattern) {
  const ids = new Set();
  const sampleFiles = [];
  for (const file of walkFiles(dir, (item) => /\.(?:md|json)$/.test(item))) {
    const source = readIfExists(file);
    pattern.lastIndex = 0;
    if (!pattern.test(source)) continue;
    ids.add(artifactId(file, dir));
    if (sampleFiles.length < 16) sampleFiles.push(rel(file));
  }
  return { count: ids.size, ids: [...ids].sort(), sampleFiles };
}

function findResearchClaimsWithoutEvidence(files) {
  const groups = new Map();
  const claimPattern = /\b(?:research|hypothesis|validate|validated|evidence|learning|confidence|assumption|tested|study|usability|interview|survey|field data|decision)\b/i;
  const evidencePattern = /\b(?:evidence|telemetry|support|shadowing|survey|interview|usability|field data|metric|measurement|confidence|risk|decision|outcome|learning|follow-up|follow up)\b/i;
  for (const file of files) {
    const source = readIfExists(file);
    if (!claimPattern.test(source)) continue;
    const id = groupIdForFile(file);
    const existing = groups.get(id) ?? { id, files: [], source: "" };
    existing.files.push(rel(file));
    existing.source += `\n${source}`;
    groups.set(id, existing);
  }
  return [...groups.values()]
    .filter((group) => !evidencePattern.test(group.source))
    .map((group) => ({ id: group.id, sampleFiles: group.files.slice(0, 6) }));
}

function foundationStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return report?.status ?? "missing";
}

function reportStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return { status: report?.status ?? "missing", gaps: report?.gaps ?? [] };
}

const tokenCss = readIfExists(tokenCssFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const specWrapper = readJson(researchSpecFile);
const spec = specWrapper.artifacts?.primitives?.research ?? specWrapper;
const contractSource = readIfExists(researchContractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const filesToScan = [
  ...walkFiles(componentContractDir, (file) => file.endsWith(".md")),
  ...walkFiles(componentCopyDir, (file) => file.endsWith(".json")),
  ...walkFiles(patternContractDir, (file) => /\.(?:md|json)$/.test(file)),
  ...walkFiles(patternCopyDir, (file) => file.endsWith(".json")),
  ...walkFiles(templateDir, (file) => file.endsWith(".json")),
];

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const references = {
  componentContracts: collectArtifactRefs(componentContractDir, /(?:research|hypothesis|evidence|confidence|learning|decision|tested|validated)/i),
  componentCopy: collectArtifactRefs(componentCopyDir, /(?:research|hypothesis|evidence|confidence|learning|decision|tested|validated)/i),
  patterns: collectArtifactRefs(patternContractDir, /(?:research|hypothesis|evidence|confidence|learning|decision|tested|validated|assumption)/i),
  patternCopy: collectArtifactRefs(patternCopyDir, /(?:research|hypothesis|evidence|confidence|learning|decision|tested|validated|assumption)/i),
  templates: collectArtifactRefs(templateDir, /(?:research|hypothesis|evidence|confidence|learning|decision|tested|validated|assumption)/i),
};
const review = {
  claimsWithoutEvidence: findResearchClaimsWithoutEvidence(filesToScan),
};
const foundationGate = {
  growth: { status: foundationStatus(growthReportFile) },
  tone: { status: foundationStatus(toneReportFile) },
  accessibility: { status: foundationStatus(accessibilityReportFile) },
  voice: { status: foundationStatus(voiceReportFile) },
};
const primitiveGate = {
  measurement: { ...reportStatus(measurementReportFile), relationship: "lateral-coordination" },
  message: { ...reportStatus(messageReportFile), relationship: "lateral-coordination" },
  charts: { ...reportStatus(chartsReportFile), relationship: "lateral-coordination" },
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitive) => !coordinatedPrimitives.includes(primitive));
if (!contractSource.includes("Research sits between foundations and components")) {
  gaps.push("Primitive contract must state the Research bridge role.");
}
if (!contractSource.includes("Use measurement signals to decide follow-up after ship")) {
  gaps.push("Research contract must explicitly coordinate with Measurement follow-up.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
if (tokenAliases.missing.length) gaps.push(`Missing sys-research aliases: ${tokenAliases.missing.join(", ")}.`);
if (!references.patterns.count && !references.patternCopy.count) gaps.push("No pattern references research/evidence/decision language.");
if (!references.templates.count) gaps.push("No template references evidence, confidence, learning, or decision language.");
if (review.claimsWithoutEvidence.length) {
  gaps.push(`Research/decision claims without evidence language: ${review.claimsWithoutEvidence.length}.`);
}
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
for (const [name, gate] of Object.entries(primitiveGate)) {
  if (gate.relationship?.startsWith("upstream") && gate.status !== "pass") {
    gaps.push(`Primitive dependency gate is not pass: ${name} is ${gate.status}.`);
  }
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Research",
  principle: "Research consumes Growth, Tone, Accessibility, Voice, and Measurement so decisions carry question, hypothesis, evidence, confidence, risk, and follow-up instead of undocumented taste.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: { required: requiredCoordinatedPrimitives, present: coordinatedPrimitives, missing: missingCoordinatedPrimitives },
  tokenAliases,
  references,
  review,
  foundationGate,
  primitiveGate,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Research Cascade Audit",
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
    `- Component contract refs: ${report.references.componentContracts.count}`,
    `- Pattern refs: ${report.references.patterns.count + report.references.patternCopy.count}`,
    `- Template refs: ${report.references.templates.count}`,
    `- Claims without evidence language: ${report.review.claimsWithoutEvidence.length}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status} (${gate.relationship})`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Research cascade audit is stale. Run npm run audit:primitive:research.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Research cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Research cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Research cascade audit passed: ${jsonOutput}`);
}

writeReport();
