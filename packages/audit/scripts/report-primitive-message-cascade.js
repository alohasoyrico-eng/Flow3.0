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
const jsonOutput = path.join(outputDir, "primitive-message-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-message-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const messageSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/message.json");
const messageContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/message.md");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const voiceReportFile = path.join(root, "docs/audits/foundation-voice-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const focusReportFile = path.join(root, "docs/audits/primitive-focus-cascade-audit.json");
const loadingReportFile = path.join(root, "docs/audits/primitive-loading-cascade-audit.json");
const disabledReportFile = path.join(root, "docs/audits/primitive-disabled-cascade-audit.json");
const iconographyReportFile = path.join(root, "docs/audits/primitive-iconography-cascade-audit.json");
const measurementReportFile = path.join(root, "docs/audits/primitive-measurement-cascade-audit.json");
const componentContractDir = path.join(root, "packages/content/content/component-contracts/components");
const componentCopyDir = path.join(root, "packages/content/content/component-copy/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const docsAppDir = path.join(root, "apps/docs");

const requiredRoles = ["intent", "severity", "anatomy", "announcement", "localization"];
const requiredFoundations = ["Tone", "Voice", "State", "Accessibility"];
const requiredCoordinatedPrimitives = ["Focus", "Loading", "Disabled", "Iconography", "Measurement"];
const requiredTokenAliases = [
  "--sys-message-intent-neutral-color",
  "--sys-message-intent-assistive-color",
  "--sys-message-intent-success-color",
  "--sys-message-intent-warning-color",
  "--sys-message-intent-danger-color",
  "--sys-message-title-font",
  "--sys-message-title-weight",
  "--sys-message-body-font",
  "--sys-message-body-weight",
  "--sys-message-action-weight",
  "--sys-message-recovery-weight",
  "--sys-message-live-role",
  "--sys-message-alert-role",
  "--sys-message-focus-ring",
  "--sys-message-readable-line-height",
  "--sys-message-locale-max-inline-size",
];
const requiredMessageComponents = ["toast", "inline-validation", "error-panel", "empty-state", "dialog"];

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
  if (file.startsWith(patternDir)) return `pattern:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
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

function collectAnnouncementSignals(files) {
  const signals = [];
  for (const file of files) {
    const source = readIfExists(file);
    const ariaLive = (source.match(/aria-live/g) ?? []).length;
    const alertRole = (source.match(/role=["'`]alert["'`]/g) ?? []).length;
    const statusRole = (source.match(/role=["'`]status["'`]/g) ?? []).length;
    if (ariaLive || alertRole || statusRole) {
      signals.push({ file: rel(file), ariaLive, alertRole, statusRole });
    }
  }
  return signals;
}

function findDangerWithoutRecovery(files) {
  const groups = new Map();
  const dangerPattern = /\b(?:danger|blocking|destructive|error|invalid|failed)\b/i;
  const recoveryPattern = /\b(?:recovery|recover|action|next|retry|undo|resend|fallback|support|resolve|fix|cancel|close|continue|review)\b/i;
  for (const file of files) {
    const source = readIfExists(file);
    if (!dangerPattern.test(source)) continue;
    const groupId = groupIdForFile(file);
    const existing = groups.get(groupId) ?? { id: groupId, files: [], source: "" };
    existing.files.push(rel(file));
    existing.source += `\n${source}`;
    groups.set(groupId, existing);
  }
  return [...groups.values()]
    .filter((group) => !recoveryPattern.test(group.source))
    .map((group) => ({ id: group.id, sampleFiles: group.files.slice(0, 6) }));
}

function foundationStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return report?.status ?? "missing";
}

const tokenCss = readIfExists(tokenCssFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const specWrapper = readJson(messageSpecFile);
const spec = specWrapper.artifacts?.primitives?.message ?? specWrapper;
const contractSource = readIfExists(messageContractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const componentContractFiles = walkFiles(componentContractDir, (file) => file.endsWith(".md"));
const componentCopyFiles = walkFiles(componentCopyDir, (file) => file.endsWith(".json"));
const patternFiles = walkFiles(patternDir, (file) => /\.(?:md|json)$/.test(file));
const templateFiles = walkFiles(templateDir, (file) => file.endsWith(".json"));
const docsJsFiles = walkFiles(docsAppDir, (file) => file.endsWith(".js"));

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const references = {
  componentContracts: collectArtifactRefs(componentContractDir, /(?:message\.|sys\.message|helper|error|success|warning|danger|recovery|aria-live|role=.*(?:alert|status))/i),
  componentCopy: collectArtifactRefs(componentCopyDir, /(?:helper|error|success|warning|danger|recovery|empty|toast|validation|announce|aria-live|localized|locale)/i),
  patterns: collectArtifactRefs(patternDir, /(?:feedback|validation|toast|empty|error|recovery|announce|aria-live|status|alert)/i),
  templates: collectArtifactRefs(templateDir, /(?:empty|error|warning|feedback|recovery|audit|validation)/i),
};
const messageComponentCoverage = {
  required: requiredMessageComponents,
  present: requiredMessageComponents.filter((id) => references.componentContracts.ids.includes(id)),
  missing: requiredMessageComponents.filter((id) => !references.componentContracts.ids.includes(id)),
};
const accessibility = {
  announcementSignals: collectAnnouncementSignals(docsJsFiles),
};
accessibility.totalSignals = accessibility.announcementSignals.reduce(
  (sum, item) => sum + item.ariaLive + item.alertRole + item.statusRole,
  0,
);
const review = {
  dangerWithoutRecovery: findDangerWithoutRecovery([...componentContractFiles, ...componentCopyFiles, ...patternFiles, ...templateFiles]),
};
const foundationGate = {
  tone: { status: foundationStatus(toneReportFile) },
  voice: { status: foundationStatus(voiceReportFile) },
  state: { status: foundationStatus(stateReportFile) },
  accessibility: { status: foundationStatus(accessibilityReportFile) },
};
const primitiveGate = {
  focus: { status: foundationStatus(focusReportFile) },
  loading: { status: foundationStatus(loadingReportFile) },
  disabled: { status: foundationStatus(disabledReportFile) },
  iconography: { status: foundationStatus(iconographyReportFile) },
  measurement: { status: foundationStatus(measurementReportFile) },
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
if (!contractSource.includes("Message sits between foundations and components")) {
  gaps.push("Primitive contract must state the Message bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (tokenAliases.missing.length) gaps.push(`Missing sys-message aliases: ${tokenAliases.missing.join(", ")}.`);
if (messageComponentCoverage.missing.length) {
  gaps.push(`Message-bearing component contracts missing coverage: ${messageComponentCoverage.missing.join(", ")}.`);
}
if (!references.patterns.count) gaps.push("No pattern contract references feedback, validation, announcement, or recovery messaging.");
if (!references.templates.count) gaps.push("No template spec references empty, error, warning, feedback, recovery, audit, or validation messaging.");
if (!accessibility.totalSignals) gaps.push("Docs renderers expose no aria-live, status, or alert announcement signal.");
if (review.dangerWithoutRecovery.length) {
  gaps.push(`Danger/blocking/error references without recovery language: ${review.dangerWithoutRecovery.length}.`);
}
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
for (const [name, gate] of Object.entries(primitiveGate)) {
  if (gate.status !== "pass") gaps.push(`Primitive dependency gate is not pass: ${name} is ${gate.status}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Message",
  principle: "Message consumes Tone, Voice, State, and Accessibility, then coordinates Focus, Loading, Disabled, Iconography, and Measurement so feedback copy owns intent, consequence, recovery, announcement, localization, and instrumentation before a component chooses visual format.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: {
    required: requiredCoordinatedPrimitives,
    present: coordinatedPrimitives,
    missing: missingCoordinatedPrimitives,
  },
  tokenAliases,
  messageComponentCoverage,
  references,
  accessibility,
  review,
  foundationGate,
  primitiveGate,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Message Cascade Audit",
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
    `- Message component coverage: ${report.messageComponentCoverage.present.length}/${report.messageComponentCoverage.required.length}`,
    `- Component copy refs: ${report.references.componentCopy.count}`,
    `- Pattern refs: ${report.references.patterns.count}`,
    `- Template refs: ${report.references.templates.count}`,
    `- Announcement signals: ${report.accessibility.totalSignals}`,
    `- Danger/error without recovery: ${report.review.dangerWithoutRecovery.length}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Message cascade audit is stale. Run node packages/audit/scripts/report-primitive-message-cascade.js.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Message cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Message cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Message cascade audit passed: ${jsonOutput}`);
}

writeReport();
