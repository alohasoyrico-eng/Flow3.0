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
const jsonOutput = path.join(outputDir, "primitive-focus-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-focus-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const focusSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/focus.json");
const focusContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/focus.md");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const disabledReportFile = path.join(root, "docs/audits/primitive-disabled-cascade-audit.json");
const radiusReportFile = path.join(root, "docs/audits/primitive-radius-cascade-audit.json");
const spacingReportFile = path.join(root, "docs/audits/primitive-spacing-cascade-audit.json");
const motionCurvesReportFile = path.join(root, "docs/audits/primitive-motion-curves-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["visible", "restore", "trap", "roving", "skip"];
const requiredFoundations = ["Accessibility", "State", "Frame"];
const requiredCoordinatedPrimitives = ["Disabled", "Radius", "Spacing", "Motion Curves"];
const requiredTokenDependencies = [
  "sys.accessibility.focus.*",
  "sys.state.focus.*",
  "disabled.*",
  "radius.*",
  "spacing.*",
  "motionCurve.*",
  "focus.*",
];
const requiredAccessibilityAliases = [
  "--sys-accessibility-focus-ring",
  "--sys-accessibility-focus-offset",
];
const requiredTokenAliases = [
  "--sys-focus-ring",
  "--sys-focus-ring-offset",
  "--sys-focus-visible-ring",
  "--sys-focus-visible-offset",
  "--sys-focus-trap-z-index",
  "--sys-focus-skip-target-offset",
  "--sys-focus-roving-ring",
  "--sys-focus-restore-ring",
];
const requiredComponentAliases = [
  "--component-focus-ring",
  "--component-focus-ring-width",
  "--component-focus-ring-offset",
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

function collectDeclarations(css) {
  const map = new Map();
  for (const match of css.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    if (!map.has(match.groups.name)) map.set(match.groups.name, match.groups.value.trim());
  }
  return map;
}

function reportStatus(file) {
  if (!fs.existsSync(file)) return { report: rel(file), status: "missing", gaps: [] };
  const report = readJson(file) ?? {};
  return { report: rel(file), status: report.status ?? "missing", gaps: report.gaps ?? [] };
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function artifactId(file, baseDir) {
  return path.relative(baseDir, file).split(path.sep)[0].replace(/\.(?:json|md)$/, "");
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

function findUndefinedSysFocusUses(files, tokenDecls) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /var\((--sys-focus-[a-z0-9-]+)/g;
    while ((match = pattern.exec(source))) {
      if (tokenDecls.has(match[1])) continue;
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[1],
      });
    }
  }
  return findings;
}

function findInvalidFocusOutlines(files) {
  const findings = [];
  const blockPattern = /(?<selector>[^{}]+:(?:focus-visible|focus-within|focus)[^{]*)\{(?<body>[^}]+)\}/g;
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    while ((match = blockPattern.exec(source))) {
      const body = match.groups.body;
      if (/outline\s*:\s*(?:none|0)\s*;/.test(body)) {
        findings.push({
          file: rel(file),
          line: lineNumber(source, match.index),
          selector: match.groups.selector.trim().replace(/\s+/g, " "),
          reason: "Focus state disables outline.",
        });
      }
      if (/box-shadow\s*:\s*var\(--[a-z0-9-]*focus-ring/.test(body)) {
        findings.push({
          file: rel(file),
          line: lineNumber(source, match.index),
          selector: match.groups.selector.trim().replace(/\s+/g, " "),
          reason: "Focus ring token is used as box-shadow.",
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
    "# Primitive Focus Cascade Audit",
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
    `- Component focus-visible selectors: ${report.componentBridge.focusVisibleSelectors}`,
    `- Docs focus-visible selectors: ${report.docsSignal.focusVisibleSelectors}`,
    `- Undefined sys-focus uses: ${report.review.undefinedSysFocusUses.length}`,
    `- Invalid focus outlines: ${report.review.invalidFocusOutlines.length}`,
    "",
    "## Foundation Gate",
    `- Accessibility: ${report.foundationGate.accessibility.status}`,
    `- State: ${report.foundationGate.state.status}`,
    `- Frame: ${report.foundationGate.frame.status}`,
    "",
    "## Primitive Gate",
    `- Disabled: ${report.primitiveGate.disabled.status}`,
    `- Radius: ${report.primitiveGate.radius.status}`,
    `- Spacing: ${report.primitiveGate.spacing.status}`,
    `- Motion Curves: ${report.primitiveGate.motionCurves.status}`,
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Focus cascade audit is stale. Run npm run audit:primitive:focus.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Focus cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Focus cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Focus cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = repoDocsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const focusSpec = readJson(focusSpecFile)?.artifacts?.primitives?.focus;
  const contract = readIfExists(focusContractFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);
  const accessibilityReport = readJson(accessibilityReportFile);
  const stateReport = readJson(stateReportFile);
  const frameReport = readJson(frameReportFile);
  const disabledReport = reportStatus(disabledReportFile);
  const radiusReport = reportStatus(radiusReportFile);
  const spacingReport = reportStatus(spacingReportFile);
  const motionCurvesReport = reportStatus(motionCurvesReportFile);
  const scannedCss = [componentCssFile, ...docsCssFiles];

  const roleIds = new Set((focusSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(focusSpec?.governingFoundations) ? focusSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const coordinatedPrimitives = Array.isArray(focusSpec?.coordinatesPrimitives) ? focusSpec.coordinatesPrimitives : [];
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitiveName) => !coordinatedPrimitives.includes(primitiveName));
  const tokenDependencies = Array.isArray(focusSpec?.tokenDependencies) ? focusSpec.tokenDependencies : [];
  const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
  const missingAccessibilityAliases = requiredAccessibilityAliases.filter((alias) => !tokenDecls.has(alias));
  const missingTokenAliases = requiredTokenAliases.filter((alias) => !tokenDecls.has(alias));
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const undefinedSysFocusUses = findUndefinedSysFocusUses(scannedCss, tokenDecls);
  const invalidFocusOutlines = findInvalidFocusOutlines(scannedCss);
  const componentFocusVisibleSelectors = countMatches(componentCss, /:focus-visible/g);
  const docsFocusVisibleSelectors = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /:focus-visible/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /Focus|focus\.(?:visible|restore|trap|roving|skip)|focus-visible|roving|restore focus|trap/i);
  const patternRefs = collectArtifactRefs(patternDir, /Focus|focus-visible|roving|restore focus|trap|skip/i);
  const templateRefs = collectArtifactRefs(templateDir, /Focus|focus-visible|keyboard|trap|restore/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Focus primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Focus primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Focus primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenDependencies.length) gaps.push(`Focus primitive is missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
  if (missingAccessibilityAliases.length) gaps.push(`Token package is missing canonical Accessibility aliases for Focus: ${missingAccessibilityAliases.join(", ")}.`);
  if (missingTokenAliases.length) gaps.push(`Token package is missing required Focus primitive aliases: ${missingTokenAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Focus bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (undefinedSysFocusUses.length) gaps.push("CSS consumes undefined sys-focus tokens.");
  if (invalidFocusOutlines.length) gaps.push("Some focus states disable outline or use focus rings as box-shadow.");
  if (accessibilityReport.status !== "pass") gaps.push("Focus cannot pass while Accessibility foundation cascade report is not pass.");
  if (stateReport.status !== "pass") gaps.push("Focus cannot pass while State foundation cascade report is not pass.");
  if (frameReport.status !== "pass") gaps.push("Focus cannot pass while Frame foundation cascade report is not pass.");
  if (spacingReport.status !== "pass") gaps.push("Focus cannot pass while Spacing primitive cascade report is not pass.");
  if (componentFocusVisibleSelectors < 30) gaps.push("Component package does not expose enough focus-visible coverage.");
  if (componentRefs.count < 20) gaps.push("Component specs do not show enough Focus primitive coverage.");

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Focus",
    status: gaps.length ? "fail" : "pass",
    principle: "Focus turns Accessibility, State, and Frame into visible rings, offsets, roving, trap, skip, and restore behavior without one-off focus styling.",
    specContract: {
      file: rel(focusSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      foundationInputs: focusSpec?.foundationInputs ?? [],
      tokenDependencies,
      missingTokenDependencies,
    },
    coordinatedPrimitives: {
      required: requiredCoordinatedPrimitives,
      present: coordinatedPrimitives,
      missing: missingCoordinatedPrimitives,
    },
    markdownContract: {
      file: rel(focusContractFile),
      generated: contract.includes("Generated portable primitive contract for Design System."),
    },
    tokenAliases: {
      file: rel(tokenCssFile),
      requiredAccessibilityAliases,
      presentAccessibilityAliases: requiredAccessibilityAliases.filter((alias) => tokenDecls.has(alias)),
      missingAccessibilityAliases,
      required: requiredTokenAliases,
      present: requiredTokenAliases.filter((alias) => tokenDecls.has(alias)),
      missing: missingTokenAliases,
    },
    componentBridge: {
      file: rel(componentCssFile),
      required: requiredComponentAliases,
      present: requiredComponentAliases.filter((alias) => componentDecls.has(alias)),
      missing: missingComponentAliases,
      focusVisibleSelectors: componentFocusVisibleSelectors,
    },
    docsSignal: {
      scannedFiles: docsCssFiles.map(rel),
      focusVisibleSelectors: docsFocusVisibleSelectors,
    },
    foundationGate: {
      accessibility: { report: rel(accessibilityReportFile), status: accessibilityReport.status, gaps: accessibilityReport.gaps ?? [] },
      state: { report: rel(stateReportFile), status: stateReport.status, gaps: stateReport.gaps ?? [] },
      frame: { report: rel(frameReportFile), status: frameReport.status, gaps: frameReport.gaps ?? [] },
    },
    primitiveGate: {
      disabled: { ...disabledReport, relationship: "lateral-coordination" },
      radius: { ...radiusReport, relationship: "lateral-coordination" },
      spacing: { ...spacingReport, relationship: "upstream-gate" },
      motionCurves: { ...motionCurvesReport, relationship: "lateral-coordination" },
    },
    review: {
      undefinedSysFocusUses,
      invalidFocusOutlines,
    },
    cascadeCoverage: {
      components: componentRefs,
      patterns: patternRefs,
      templates: templateRefs,
    },
    gaps,
  };
}

writeReport(createReport());
