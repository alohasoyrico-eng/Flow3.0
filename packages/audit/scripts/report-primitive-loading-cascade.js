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
const jsonOutput = path.join(outputDir, "primitive-loading-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-loading-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const spinnerModuleFile = path.join(root, "packages/react/src/Spinner.js");
const buttonModuleFile = path.join(root, "packages/react/src/Button.js");
const progressIndicatorModuleFile = path.join(root, "packages/react/src/ProgressIndicator.js");
const loadingSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/loading.json");
const loadingContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/loading.md");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const momentumReportFile = path.join(root, "docs/audits/foundation-momentum-cascade-audit.json");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const durationReportFile = path.join(root, "docs/audits/primitive-duration-cascade-audit.json");
const motionCurvesReportFile = path.join(root, "docs/audits/primitive-motion-curves-cascade-audit.json");
const disabledReportFile = path.join(root, "docs/audits/primitive-disabled-cascade-audit.json");
const focusReportFile = path.join(root, "docs/audits/primitive-focus-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["skeleton", "stale", "sync", "progress", "busy"];
const requiredFoundations = ["State", "Momentum", "Tone", "Accessibility"];
const requiredCoordinatedPrimitives = ["Duration", "Motion Curves", "Disabled", "Focus"];
const requiredTokenAliases = [
  "--sys-loading-spin-duration",
  "--sys-loading-cycle-duration",
  "--sys-loading-progress-duration",
  "--sys-loading-pulse-duration",
  "--sys-loading-easing-rhythm",
  "--sys-loading-easing-linear",
  "--sys-loading-skeleton-surface",
  "--sys-loading-skeleton-highlight",
  "--sys-loading-spinner-track",
  "--sys-loading-spinner-tone",
  "--sys-loading-progress-track",
  "--sys-loading-progress-fill",
  "--sys-loading-stale-opacity",
  "--sys-loading-busy-cursor",
];
const requiredComponentAliases = [
  "--component-loading-spin-duration",
  "--component-loading-cycle-duration",
  "--component-loading-progress-duration",
  "--component-loading-pulse-duration",
  "--component-loading-easing-rhythm",
  "--component-loading-easing-linear",
  "--component-loading-skeleton-surface",
  "--component-loading-skeleton-highlight",
  "--component-loading-spinner-track",
  "--component-loading-spinner-tone",
  "--component-loading-progress-track",
  "--component-loading-progress-fill",
  "--component-loading-stale-opacity",
  "--component-loading-busy-cursor",
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

function isInsideRoot(file) {
  const relative = path.relative(root, file);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

const repoDocsStyleModuleFiles = docsStyleModuleFiles.filter(isInsideRoot);


function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function artifactId(file, baseDir) {
  return path.relative(baseDir, file).split(path.sep)[0].replace(/\.(?:json|md)$/, "");
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function collectArtifactRefs(dir, pattern) {
  const ids = new Set();
  const sampleFiles = [];
  for (const file of walkFiles(dir, (item) => /\.(?:json|md)$/.test(item))) {
    const source = readIfExists(file);
    pattern.lastIndex = 0;
    if (!pattern.test(source)) continue;
    ids.add(artifactId(file, dir));
    if (sampleFiles.length < 12) sampleFiles.push(rel(file));
  }
  return { count: ids.size, ids: [...ids].sort(), sampleFiles };
}

function collectDeclarations(css) {
  const map = new Map();
  for (const match of css.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    if (!map.has(match.groups.name)) map.set(match.groups.name, match.groups.value.trim());
  }
  return map;
}

function reportStatus(file) {
  if (!fs.existsSync(file)) return { file: rel(file), status: "missing", gaps: [] };
  const report = readJson(file) ?? {};
  return { file: rel(file), status: report.status ?? "missing", gaps: report.gaps ?? [] };
}

function isFoundationOrReferenceLayer(file) {
  const relative = rel(file);
  return file === tokenCssFile
    || relative.includes("00-foundations-")
    || relative.includes("03a-reference-core-")
    || relative.includes("03b-foundation-reference-")
    || relative.includes("03c-motion-reference-");
}

function findDirectFoundationLoadingUses(files) {
  const findings = [];
  for (const file of files) {
    if (isFoundationOrReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--(?:sys-state-loading-spin|sys-momentum-duration-loading-(?:spin|cycle)|sys-momentum-duration-progress|sys-momentum-duration-pulse)\)/g;
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

function findRawLoadingDurations(files) {
  const findings = [];
  for (const file of files) {
    if (isFoundationOrReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /animation(?:-duration)?\s*:\s*(?<value>\d+(?:\.\d+)?m?s\b|[^;]*\b\d+(?:\.\d+)?m?s\b[^;]*);/g;
    while ((match = pattern.exec(source))) {
      const value = match.groups.value.trim();
      const lineStart = source.lastIndexOf("\n", match.index) + 1;
      const line = source.slice(lineStart, source.indexOf("\n", match.index));
      if (/loading|spinner|skeleton|shimmer|progress|busy/i.test(line) && !/var\(--/.test(value)) {
        findings.push({
          file: rel(file),
          line: lineNumber(source, match.index),
          value,
        });
      }
    }
  }
  return findings;
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Loading Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Gaps",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    "",
    "## Signals",
    `- Token aliases: ${report.tokenAliases.present.length}/${report.tokenAliases.required.length}`,
    `- Component bridge aliases: ${report.componentBridge.present.length}/${report.componentBridge.required.length}`,
    `- Component loading token uses: ${report.componentBridge.loadingTokenUses}`,
    `- Docs loading token uses: ${report.docsSignal.loadingTokenUses}`,
    `- Direct foundation loading uses outside foundations: ${report.review.directFoundationLoadingUses.length}`,
    `- Raw loading durations: ${report.review.rawLoadingDurations.length}`,
    `- aria-busy uses: ${report.accessibility.ariaBusyUses}`,
    `- status/progressbar roles: ${report.accessibility.statusRoleUses}/${report.accessibility.progressbarRoleUses}`,
    "",
    "## Foundation Gate",
    `- Accessibility: ${report.foundationGate.accessibility.status}`,
    `- State: ${report.foundationGate.state.status}`,
    `- Momentum: ${report.foundationGate.momentum.status}`,
    `- Tone: ${report.foundationGate.tone.status}`,
    "",
    "## Primitive Gate",
    `- Duration: ${report.primitiveGate.duration.status}`,
    `- Motion Curves: ${report.primitiveGate.motionCurves.status}`,
    `- Disabled: ${report.primitiveGate.disabled.status}`,
    `- Focus: ${report.primitiveGate.focus.status}`,
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Loading cascade audit is stale. Run npm run audit:primitive:loading.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Loading cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Loading cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Loading cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const spinnerSource = readIfExists(spinnerModuleFile);
  const buttonSource = readIfExists(buttonModuleFile);
  const progressIndicatorSource = readIfExists(progressIndicatorModuleFile);
  const docsCssFiles = repoDocsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const loadingSpec = readJson(loadingSpecFile)?.artifacts?.primitives?.loading;
  const contract = readIfExists(loadingContractFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);
  const accessibilityReport = readJson(accessibilityReportFile);
  const stateReport = readJson(stateReportFile);
  const momentumReport = readJson(momentumReportFile);
  const toneReport = readJson(toneReportFile);
  const durationReport = reportStatus(durationReportFile);
  const motionCurvesReport = reportStatus(motionCurvesReportFile);
  const disabledReport = reportStatus(disabledReportFile);
  const focusReport = reportStatus(focusReportFile);
  const scannedCss = [componentCssFile, ...docsCssFiles];

  const roleIds = new Set((loadingSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(loadingSpec?.governingFoundations) ? loadingSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const coordinatedPrimitives = Array.isArray(loadingSpec?.coordinatesPrimitives) ? loadingSpec.coordinatesPrimitives : [];
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitiveName) => !coordinatedPrimitives.includes(primitiveName));
  const missingTokenAliases = requiredTokenAliases.filter((alias) => !tokenDecls.has(alias));
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const directFoundationLoadingUses = findDirectFoundationLoadingUses(scannedCss);
  const rawLoadingDurations = findRawLoadingDurations(scannedCss);
  const componentLoadingTokenUses = countMatches(componentCss, /var\(--(?:sys-loading|component-loading|component-duration-loading|component-duration-shimmer|component-duration-progress|component-ease-loading)[a-z0-9-]*/g);
  const docsLoadingTokenUses = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-loading|component-loading|component-duration-loading|component-duration-shimmer|component-duration-progress|component-ease-loading|comp-[a-z0-9-]+-loading)[a-z0-9-]*/g), 0);
  const loadingComponentSource = [spinnerSource, buttonSource, progressIndicatorSource].join("\n");
  const ariaBusyUses = countMatches(loadingComponentSource, /aria-busy/g);
  const statusRoleUses = countMatches(loadingComponentSource, /role:\s*isDecorative\s*\?\s*undefined\s*:\s*"status"|role",\s*"status"|role', 'status'/g);
  const progressbarRoleUses = countMatches(loadingComponentSource, /role:\s*"progressbar"|role",\s*"progressbar"|role', 'progressbar'/g);
  const componentRefs = collectArtifactRefs(componentDir, /Loading|loading|skeleton|stale|sync|progress|aria-busy/i);
  const patternRefs = collectArtifactRefs(patternDir, /Loading|loading|skeleton|stale|sync|progress|aria-busy/i);
  const templateRefs = collectArtifactRefs(templateDir, /Loading|loading|skeleton|stale|sync|progress|aria-busy/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Loading primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Loading primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Loading primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenAliases.length) gaps.push(`Token package is missing required Loading primitive aliases: ${missingTokenAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Loading bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (directFoundationLoadingUses.length) gaps.push("Loading consumers still read State/Momentum loading aliases directly outside foundations.");
  if (rawLoadingDurations.length) gaps.push("Raw loading durations still appear outside tokens/foundations.");
  if (componentLoadingTokenUses < 12) gaps.push("Component CSS has too few Loading primitive token uses.");
  if (ariaBusyUses < 2) gaps.push("Loading implementation has too few aria-busy signals.");
  if (statusRoleUses < 1) gaps.push("Loading implementation must expose status for announced loading.");
  if (progressbarRoleUses < 1) gaps.push("Loading implementation must expose progressbar for known progress.");
  if (accessibilityReport?.status !== "pass") gaps.push("Accessibility foundation gate is not passing.");
  if (stateReport?.status !== "pass") gaps.push("State foundation gate is not passing.");
  if (momentumReport?.status !== "pass") gaps.push("Momentum foundation gate is not passing.");
  if (toneReport?.status !== "pass") gaps.push("Tone foundation gate is not passing.");
  if (disabledReport?.status !== "pass") gaps.push("Disabled primitive gate is not passing.");
  if (focusReport?.status !== "pass") gaps.push("Focus primitive gate is not passing.");
  if (!/Spinner with no label/.test(contract)) gaps.push("Loading contract must reject unlabeled spinner usage.");

  return {
    primitive: "loading",
    status: gaps.length ? "fail" : "pass",
    principle: "Loading consumes State, Momentum, Tone, and Accessibility, then exposes a narrow API for skeleton, stale, sync, progress, and busy behavior without duplicating spinner or progress semantics.",
    sourceOfTruth: {
      spec: rel(loadingSpecFile),
      contract: rel(loadingContractFile),
    },
    roles: {
      required: requiredRoles,
      present: [...roleIds].filter((role) => requiredRoles.includes(role)).sort(),
      missing: missingRoles,
    },
    foundations: {
      required: requiredFoundations,
      present: governingFoundations,
      missing: missingFoundations,
    },
    coordinatedPrimitives: {
      required: requiredCoordinatedPrimitives,
      present: coordinatedPrimitives,
      missing: missingCoordinatedPrimitives,
    },
    tokenAliases: {
      required: requiredTokenAliases,
      present: requiredTokenAliases.filter((alias) => tokenDecls.has(alias)),
      missing: missingTokenAliases,
    },
    componentBridge: {
      required: requiredComponentAliases,
      present: requiredComponentAliases.filter((alias) => componentDecls.has(alias)),
      missing: missingComponentAliases,
      loadingTokenUses: componentLoadingTokenUses,
    },
    docsSignal: {
      loadingTokenUses: docsLoadingTokenUses,
    },
    accessibility: {
      ariaBusyUses,
      statusRoleUses,
      progressbarRoleUses,
    },
    review: {
      directFoundationLoadingUses,
      rawLoadingDurations,
    },
    foundationGate: {
      accessibility: { status: accessibilityReport?.status ?? "missing", file: rel(accessibilityReportFile) },
      state: { status: stateReport?.status ?? "missing", file: rel(stateReportFile) },
      momentum: { status: momentumReport?.status ?? "missing", file: rel(momentumReportFile) },
      tone: { status: toneReport?.status ?? "missing", file: rel(toneReportFile) },
    },
    primitiveGate: {
      duration: { ...durationReport, relationship: "lateral-coordination" },
      motionCurves: { ...motionCurvesReport, relationship: "lateral-coordination" },
      disabled: { ...disabledReport, relationship: "lateral-coordination" },
      focus: { ...focusReport, relationship: "lateral-coordination" },
    },
    cascadeRefs: {
      components: componentRefs,
      patterns: patternRefs,
      templates: templateRefs,
    },
    gaps,
  };
}

writeReport(createReport());
