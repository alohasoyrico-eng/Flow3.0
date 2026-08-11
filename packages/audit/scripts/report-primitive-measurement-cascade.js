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
const jsonOutput = path.join(outputDir, "primitive-measurement-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-measurement-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const measurementSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/measurement.json");
const measurementContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/measurement.md");
const growthReportFile = path.join(root, "docs/audits/foundation-growth-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const chartsReportFile = path.join(root, "docs/audits/primitive-charts-cascade-audit.json");
const messageReportFile = path.join(root, "docs/audits/primitive-message-cascade-audit.json");
const researchReportFile = path.join(root, "docs/audits/primitive-research-cascade-audit.json");
const componentDir = path.join(root, "packages/content/content/component-contracts/components");
const componentCopyDir = path.join(root, "packages/content/content/component-copy/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["event", "metric", "analytics", "hypothesis", "guardrail"];
const requiredFoundations = ["Growth", "State", "Accessibility", "Tone"];
const requiredCoordinatedPrimitives = ["Charts", "Message", "Research"];
const requiredTokenAliases = [
  "--sys-measurement-event-font",
  "--sys-measurement-event-color",
  "--sys-measurement-metric-font",
  "--sys-measurement-metric-weight",
  "--sys-measurement-metric-color",
  "--sys-measurement-analytics-color",
  "--sys-measurement-hypothesis-color",
  "--sys-measurement-guardrail-color",
  "--sys-measurement-guardrail-background",
  "--sys-measurement-privacy-color",
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

function artifactId(file, baseDir) {
  const relative = path.relative(baseDir, file).split(path.sep)[0];
  return relative.replace(/\.(?:json|md|js)$/, "");
}

function groupIdForFile(file) {
  const componentCopyRoot = path.join(root, "packages/content/content/component-copy/components");
  const componentContractRoot = path.join(root, "packages/content/content/component-contracts/components");
  const patternRoot = path.join(root, "packages/content/content/pattern-contracts/patterns");
  const templateRoot = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
  if (file.startsWith(componentCopyRoot)) return `component:${path.relative(componentCopyRoot, file).split(path.sep)[0]}`;
  if (file.startsWith(componentContractRoot)) return `component:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
  if (file.startsWith(patternRoot)) return `pattern:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
  if (file.startsWith(templateRoot)) return `template:${path.basename(file).replace(/\.(?:md|json)$/, "")}`;
  return `file:${rel(file)}`;
}

function collectArtifactRefs(dir, pattern) {
  const ids = new Set();
  const sampleFiles = [];
  for (const file of walkFiles(dir, (item) => /\.(?:json|md|js)$/.test(item))) {
    const source = readIfExists(file);
    pattern.lastIndex = 0;
    if (!pattern.test(source)) continue;
    ids.add(artifactId(file, dir));
    if (sampleFiles.length < 12) sampleFiles.push(rel(file));
  }
  return { count: ids.size, ids: [...ids].sort(), sampleFiles };
}

function findIncompleteAnalyticsEvents(files) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /data-analytics-event\s*=\s*["'`][^"'`]+["'`]/g;
    while ((match = pattern.exec(source))) {
      const window = source.slice(Math.max(0, match.index - 900), Math.min(source.length, match.index + 900));
      const hasStage = /data-growth-stage|growthStage|growth-stage/i.test(window);
      const hasObject = /object|surface|trigger|result|aria-label|label|slug/i.test(window);
      if (!hasStage || !hasObject) {
        findings.push({
          file: rel(file),
          line: lineNumber(source, match.index),
          event: match[0],
          missing: [
            ...(!hasStage ? ["growth stage"] : []),
            ...(!hasObject ? ["object/surface/trigger/result context"] : []),
          ],
        });
      }
    }
  }
  return findings;
}

function findAnalyticsWithoutDecision(files) {
  const groups = new Map();
  const analyticsPattern = /\b(?:analytics|dashboard|chart|metric|kpi|funnel|cohort|trend|telemetry)\b/i;
  const decisionPattern = /\b(?:decision|owner|action|result|outcome|recovery|friction|support|quality|guardrail|privacy|hypothesis|blocked|stale|validated)\b/i;
  for (const file of files) {
    const source = readIfExists(file);
    if (!analyticsPattern.test(source)) continue;
    const groupId = groupIdForFile(file);
    const existing = groups.get(groupId) ?? { id: groupId, files: [], source: "" };
    existing.files.push(rel(file));
    existing.source += `\n${source}`;
    groups.set(groupId, existing);
  }
  return [...groups.values()]
    .filter((group) => !decisionPattern.test(group.source))
    .map((group) => ({ id: group.id, sampleFiles: group.files.slice(0, 6) }));
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
const tokenDeclarations = collectDeclarations(tokenCss);
const specWrapper = readJson(measurementSpecFile);
const spec = specWrapper.artifacts?.primitives?.measurement ?? specWrapper;
const contractSource = readIfExists(measurementContractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const filesToScan = [
  ...walkFiles(componentDir, (file) => /\.(?:md|json)$/.test(file)),
  ...walkFiles(componentCopyDir, (file) => /\.(?:json)$/.test(file)),
  ...walkFiles(patternDir, (file) => /\.(?:md|json)$/.test(file)),
  ...walkFiles(templateDir, (file) => /\.(?:json)$/.test(file)),
];

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const references = {
  measurement: collectArtifactRefs(componentDir, /(?:sys\.measurement|measurement\.)/i),
  analytics: collectArtifactRefs(componentCopyDir, /\b(?:analytics|dashboard|chart|metric|kpi|funnel|cohort|trend|telemetry)\b/i),
  guardrail: collectArtifactRefs(componentCopyDir, /\b(?:guardrail|privacy|dark pattern|vanity|manipulative)\b/i),
};
const review = {
  incompleteAnalyticsEvents: findIncompleteAnalyticsEvents(walkFiles(docsAppDir, (file) => file.endsWith(".js"))),
  analyticsWithoutDecision: findAnalyticsWithoutDecision(filesToScan),
};
const foundationGate = {
  growth: { status: foundationStatus(growthReportFile) },
  state: { status: foundationStatus(stateReportFile) },
  accessibility: { status: foundationStatus(accessibilityReportFile) },
  tone: { status: foundationStatus(toneReportFile) },
};
const primitiveGate = {
  charts: reportStatus(chartsReportFile),
  message: reportStatus(messageReportFile),
  research: reportStatus(researchReportFile),
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitiveName) => !coordinatedPrimitives.includes(primitiveName),
);
if (!contractSource.includes("Measurement sits between foundations and components")) {
  gaps.push("Primitive contract must state the Measurement bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (tokenAliases.missing.length) gaps.push(`Missing sys-measurement aliases: ${tokenAliases.missing.join(", ")}.`);
if (references.measurement.count < 1) gaps.push("No component contract references sys.measurement or measurement roles.");
if (references.analytics.count < 1) gaps.push("No product/component copy references analytics, dashboard, chart, metric, or KPI measurement language.");
if (references.guardrail.count < 1) gaps.push("No product/component copy references measurement guardrails or privacy.");
if (review.incompleteAnalyticsEvents.length) {
  gaps.push(`Incomplete analytics event declarations: ${review.incompleteAnalyticsEvents.length}.`);
}
if (review.analyticsWithoutDecision.length) {
  gaps.push(`Analytics/metric references without decision language: ${review.analyticsWithoutDecision.length}.`);
}
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}
if (primitiveGate.message.status !== "pass") {
  gaps.push(`Primitive dependency gate is not pass: message is ${primitiveGate.message.status}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Measurement",
  principle: "Measurement consumes Growth, State, Accessibility, and Tone, then coordinates Charts, Message, and Research so events, metrics, analytics, hypotheses, and guardrails remain product-owned instead of decorative dashboard copy.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: {
    required: requiredCoordinatedPrimitives,
    present: coordinatedPrimitives,
    missing: missingCoordinatedPrimitives,
  },
  tokenAliases,
  references,
  review,
  foundationGate,
  primitiveGate: {
    charts: { ...primitiveGate.charts, relationship: "lateral-coordination" },
    message: { ...primitiveGate.message, relationship: "upstream-feedback" },
    research: { ...primitiveGate.research, relationship: "lateral-coordination" },
  },
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Measurement Cascade Audit",
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
    `- Component measurement refs: ${report.references.measurement.count}`,
    `- Analytics refs: ${report.references.analytics.count}`,
    `- Guardrail refs: ${report.references.guardrail.count}`,
    `- Incomplete analytics events: ${report.review.incompleteAnalyticsEvents.length}`,
    `- Analytics refs without decision language: ${report.review.analyticsWithoutDecision.length}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Measurement cascade audit is stale. Run npm run audit:primitive:measurement.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Measurement cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Measurement cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Measurement cascade audit passed: ${jsonOutput}`);
}

writeReport();
