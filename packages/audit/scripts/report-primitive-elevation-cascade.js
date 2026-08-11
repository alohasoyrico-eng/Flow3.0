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
const jsonOutput = path.join(outputDir, "primitive-elevation-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-elevation-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const elevationSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/elevation.json");
const elevationContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/elevation.md");
const depthReportFile = path.join(root, "docs/audits/foundation-depth-cascade-audit.json");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const focusReportFile = path.join(root, "docs/audits/primitive-focus-cascade-audit.json");
const radiusReportFile = path.join(root, "docs/audits/primitive-radius-cascade-audit.json");
const motionCurvesReportFile = path.join(root, "docs/audits/primitive-motion-curves-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["level0", "level1", "level2", "level3", "level4"];
const requiredFoundations = ["Depth", "Frame", "State", "Accessibility"];
const requiredCoordinatedPrimitives = ["Focus", "Radius", "Motion Curves"];
const requiredTokenAliases = [
  "--sys-elevation-0",
  "--sys-elevation-1",
  "--sys-elevation-2",
  "--sys-elevation-3",
  "--sys-elevation-4",
  "--sys-elevation-card",
  "--sys-elevation-card-hover",
  "--sys-elevation-control",
  "--sys-elevation-floating",
  "--sys-elevation-popover",
  "--sys-elevation-modal",
  "--sys-elevation-sheet",
  "--sys-elevation-toast",
];
const requiredComponentAliases = [
  "--component-depth-low",
  "--component-depth-raised",
  "--component-depth-panel",
  "--component-depth-panel-strong",
  "--component-depth-sheet",
  "--component-depth-popover",
  "--component-depth-toast",
  "--component-depth-card-hover",
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

function isReferenceLayer(file) {
  const relative = rel(file);
  return relative.includes("00-foundations-")
    || relative.includes("03a-reference-core-")
    || relative.includes("03b-foundation-reference-")
    || relative.includes("03c-motion-reference-");
}

function findDirectRefDepth(files) {
  const findings = [];
  for (const file of files) {
    if (isReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--ref-depth-[a-z0-9-]+\)/g;
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

function findRawBoxShadow(file, source) {
  if (isReferenceLayer(file)) return [];
  const findings = [];
  let match;
  const pattern = /box-shadow\s*:\s*(?<value>[^;]+);/g;
  while ((match = pattern.exec(source))) {
    const value = match.groups.value.trim();
    const isNone = value === "none" || value === "0";
    const hasElevationToken = /var\(--(?:sys-depth|sys-elevation|component-depth|[a-z0-9-]+-[a-z0-9-]*(?:depth|shadow|elevation|glow|ring|halo))[a-z0-9-]*/.test(value);
    const isStateRing = /\binset\b/.test(value) || /0\s+0\s+0/.test(value);
    if (!isNone && !hasElevationToken && !isStateRing) {
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value,
        status: "fail",
        reason: "Surface elevation must resolve through Elevation/Depth tokens, not raw shadow declarations.",
      });
    }
  }
  return findings;
}

function findComponentSurfaceDepthRawAliases(componentDecls) {
  const findings = [];
  for (const [alias, value] of componentDecls.entries()) {
    if (!/^--component-depth-(low|low-soft|low-medium|raised|raised-soft|raised-strong|tooltip|panel|panel-strong|sheet|pill|popover|toast|card-hover|date-panel|danger)$/.test(alias)) continue;
    if (!/var\(--sys-elevation-/.test(value) && !/var\(--sys-depth-elevation-/.test(value)) {
      findings.push({
        alias,
        value,
        status: "fail",
        reason: "Surface depth aliases must map to Elevation primitives.",
      });
    }
  }
  return findings;
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Elevation Cascade Audit",
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
    `- Component elevation/depth uses: ${report.componentBridge.elevationAliasUseCount}`,
    `- Docs elevation/depth uses: ${report.docsSignal.elevationAliasUseCount}`,
    `- Raw shadow failures: ${report.componentBridge.rawBoxShadow.length + report.docsSignal.rawBoxShadow.length}`,
    "",
    "## Foundation Gates",
    `- Depth: ${report.foundationGate.depth.status}`,
    `- Frame: ${report.foundationGate.frame.status}`,
    `- State: ${report.foundationGate.state.status}`,
    `- Accessibility: ${report.foundationGate.accessibility.status}`,
    "",
    "## Primitive Gate",
    `- Focus: ${report.primitiveGate.focus.status}`,
    `- Radius: ${report.primitiveGate.radius.status}`,
    `- Motion Curves: ${report.primitiveGate.motionCurves.status}`,
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Elevation cascade report is stale. Run npm run audit:primitive:elevation.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Elevation cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Elevation cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Elevation cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const elevationSpec = readJson(elevationSpecFile)?.artifacts?.primitives?.elevation;
  const contract = readIfExists(elevationContractFile);
  const depthReport = readJson(depthReportFile);
  const frameReport = readJson(frameReportFile);
  const stateReport = readJson(stateReportFile);
  const accessibilityReport = readJson(accessibilityReportFile);
  const focusReport = readJson(focusReportFile);
  const radiusReport = readJson(radiusReportFile);
  const motionCurvesReport = readJson(motionCurvesReportFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);

  const roleIds = new Set((elevationSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(elevationSpec?.governingFoundations) ? elevationSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const coordinatedPrimitives = Array.isArray(elevationSpec?.coordinatesPrimitives) ? elevationSpec.coordinatesPrimitives : [];
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitiveName) => !coordinatedPrimitives.includes(primitiveName));
  const missingTokenAliases = requiredTokenAliases.filter((alias) => !tokenDecls.has(alias));
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const componentDirectRefDepth = findDirectRefDepth([componentCssFile]);
  const docsDirectRefDepth = findDirectRefDepth(docsCssFiles);
  const componentRawBoxShadow = findRawBoxShadow(componentCssFile, componentCss);
  const docsRawBoxShadow = docsCssFiles.flatMap((file) => findRawBoxShadow(file, readIfExists(file)));
  const componentSurfaceAliasGaps = findComponentSurfaceDepthRawAliases(componentDecls);
  const componentElevationAliasUseCount = countMatches(componentCss, /var\(--(?:sys-depth|sys-elevation|component-depth|comp-[a-z0-9-]+-(?:depth|shadow|ring))[a-z0-9-]*/g);
  const docsElevationAliasUseCount = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-depth|sys-elevation|component-depth|comp-[a-z0-9-]+-(?:depth|shadow|ring)|pattern-[a-z0-9-]+-(?:depth|shadow|ring))[a-z0-9-]*/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /"Elevation"|Elevation|elevation\.[0-4]|sys\.depth|Depth/i);
  const patternRefs = collectArtifactRefs(patternDir, /Elevation|sys\.depth|Depth|stacking|overlay/i);
  const templateRefs = collectArtifactRefs(templateDir, /Elevation|sys\.depth|Depth|overlay|modal/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Elevation primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Elevation primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Elevation primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenAliases.length) gaps.push(`Token package is missing required Elevation primitive aliases: ${missingTokenAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Elevation bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (componentDirectRefDepth.length) gaps.push("Component package still consumes ref-depth directly instead of Elevation.");
  if (docsDirectRefDepth.length) gaps.push("Docs consumers still use ref-depth directly outside the foundation/reference layer.");
  if (componentRawBoxShadow.length || docsRawBoxShadow.length) gaps.push("Raw surface box-shadow values still appear outside tokens.");
  if (componentSurfaceAliasGaps.length) gaps.push("Component surface depth aliases do not map to Elevation primitives.");
  if (!contract.includes("Generated portable primitive contract for Design System.")) gaps.push("Elevation Markdown contract is missing or not generated.");
  if (depthReport.status !== "pass" || frameReport.status !== "pass" || stateReport.status !== "pass" || accessibilityReport.status !== "pass") gaps.push("Elevation cannot pass while Depth, Frame, State, or Accessibility foundation reports are not pass.");
  if (focusReport.status !== "pass") gaps.push("Elevation cannot pass while Focus primitive report is not pass.");
  if (radiusReport.status !== "pass") gaps.push("Elevation cannot pass while Radius primitive report is not pass.");
  if (motionCurvesReport.status !== "pass") gaps.push("Elevation cannot pass while Motion Curves primitive report is not pass.");
  if (componentElevationAliasUseCount < 50) gaps.push("Component package does not show enough Elevation/Depth alias usage to prove cascade into components.");
  if (componentRefs.count < 10) gaps.push("Component specs do not show enough Elevation primitive coverage.");

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Elevation",
    status: gaps.length ? "fail" : "pass",
    principle: "Elevation converts Depth into named surface levels, overlay roles, and stacking contracts so components never invent arbitrary shadows or z-indexes.",
    specContract: {
      file: rel(elevationSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      foundationInputs: elevationSpec?.foundationInputs ?? [],
      tokenDependencies: elevationSpec?.tokenDependencies ?? [],
    },
    coordinatedPrimitives: {
      required: requiredCoordinatedPrimitives,
      present: coordinatedPrimitives,
      missing: missingCoordinatedPrimitives,
    },
    markdownContract: {
      file: rel(elevationContractFile),
      generated: contract.includes("Generated portable primitive contract for Design System."),
    },
    tokenAliases: {
      file: rel(tokenCssFile),
      required: requiredTokenAliases,
      present: requiredTokenAliases.filter((alias) => tokenDecls.has(alias)),
      missing: missingTokenAliases,
    },
    componentBridge: {
      file: rel(componentCssFile),
      required: requiredComponentAliases,
      present: requiredComponentAliases.filter((alias) => componentDecls.has(alias)),
      missing: missingComponentAliases,
      elevationAliasUseCount: componentElevationAliasUseCount,
      directRefDepthConsumerUses: componentDirectRefDepth,
      rawBoxShadow: componentRawBoxShadow,
      surfaceAliasGaps: componentSurfaceAliasGaps,
    },
    foundationGate: {
      depth: { report: rel(depthReportFile), status: depthReport.status, gaps: depthReport.gaps ?? [] },
      frame: { report: rel(frameReportFile), status: frameReport.status, gaps: frameReport.gaps ?? [] },
      state: { report: rel(stateReportFile), status: stateReport.status, gaps: stateReport.gaps ?? [] },
      accessibility: { report: rel(accessibilityReportFile), status: accessibilityReport.status, gaps: accessibilityReport.gaps ?? [] },
    },
    primitiveGate: {
      focus: { report: rel(focusReportFile), status: focusReport.status, gaps: focusReport.gaps ?? [] },
      radius: { report: rel(radiusReportFile), status: radiusReport.status, gaps: radiusReport.gaps ?? [] },
      motionCurves: { report: rel(motionCurvesReportFile), status: motionCurvesReport.status, gaps: motionCurvesReport.gaps ?? [] },
    },
    docsSignal: {
      scannedFiles: docsCssFiles.map(rel),
      elevationAliasUseCount: docsElevationAliasUseCount,
      directRefDepthConsumerUses: docsDirectRefDepth,
      rawBoxShadow: docsRawBoxShadow,
      note: "State rings may use inset or 0 0 0 shadows. Surface elevation must use Elevation/Depth aliases.",
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
