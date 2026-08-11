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
const jsonOutput = path.join(outputDir, "primitive-radius-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-radius-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const radiusSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/radius.json");
const radiusContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/radius.md");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const depthReportFile = path.join(root, "docs/audits/foundation-depth-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const focusReportFile = path.join(root, "docs/audits/primitive-focus-cascade-audit.json");
const densityReportFile = path.join(root, "docs/audits/primitive-density-cascade-audit.json");
const spacingReportFile = path.join(root, "docs/audits/primitive-spacing-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["control", "container", "surface", "pill"];
const requiredFoundations = ["Frame", "Depth", "State"];
const requiredCoordinatedPrimitives = ["Focus", "Density", "Spacing"];
const requiredTokenAliases = [
  "--sys-radius-0",
  "--sys-radius-sm",
  "--sys-radius-xs",
  "--sys-radius-md",
  "--sys-radius-lg",
  "--sys-radius-xl",
  "--sys-radius-full",
  "--sys-radius-control",
  "--sys-radius-container",
  "--sys-radius-surface",
  "--sys-radius-pill",
  "--sys-frame-radius-control",
  "--sys-frame-radius-container",
  "--sys-frame-radius-surface",
  "--sys-frame-radius-full",
];
const requiredComponentAliases = [
  "--component-radius-pill",
  "--component-radius-control",
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
  if (!fs.existsSync(file)) return { report: rel(file), status: "missing", gaps: [] };
  const report = readJson(file) ?? {};
  return { report: rel(file), status: report.status ?? "missing", gaps: report.gaps ?? [] };
}

function isReferenceLayer(file) {
  const relative = rel(file);
  return relative.includes("00-foundations-")
    || relative.includes("03a-reference-core-")
    || relative.includes("03b-foundation-reference-")
    || relative.includes("03c-motion-reference-");
}

function findConsumerRefFrameRadius(files) {
  const findings = [];
  for (const file of files) {
    if (isReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--ref-frame-radius-[a-z0-9-]+\)/g;
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

function findRawRadius(file, source) {
  if (isReferenceLayer(file)) return [];
  const findings = [];
  let match;
  const pattern = /border-radius\s*:\s*(?<value>[^;]+);/g;
  while ((match = pattern.exec(source))) {
    const value = match.groups.value.trim();
    const hasToken = /var\(--(?:sys-radius|sys-frame-radius|component-radius|comp-[a-z0-9-]+-radius|pattern-[a-z0-9-]+-radius)/.test(value);
    const hasRawLength = /(^|[\s(,+-])[-+]?\d*\.?\d+(?:px|rem|em)\b/.test(value);
    const isZero = /^(?:0|0px|0rem|0em)(?:\s+(?:0|0px|0rem|0em))*$/.test(value);
    if (hasRawLength && !hasToken && !isZero) {
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value,
        status: "fail",
        reason: "Radius must resolve through Radius/Frame tokens, not raw lengths.",
      });
    }
  }
  return findings;
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Radius Cascade Audit",
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
    `- Component radius alias uses: ${report.componentBridge.radiusAliasUseCount}`,
    `- Docs radius alias uses: ${report.docsSignal.radiusAliasUseCount}`,
    `- Direct ref-frame-radius consumer uses: ${report.docsSignal.directRefFrameRadiusConsumerUses.length + report.componentBridge.directRefFrameRadiusConsumerUses.length}`,
    `- Raw radius failures: ${report.componentBridge.rawRadius.length + report.docsSignal.rawRadius.length}`,
    "",
    "## Foundation Gates",
    `- Frame: ${report.foundationGate.frame.status}`,
    `- Depth: ${report.foundationGate.depth.status}`,
    `- State: ${report.foundationGate.state.status}`,
    "",
    "## Primitive Gate",
    `- Focus: ${report.primitiveGate.focus.status}`,
    `- Density: ${report.primitiveGate.density.status}`,
    `- Spacing: ${report.primitiveGate.spacing.status}`,
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Radius cascade report is stale. Run npm run audit:primitive:radius.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Radius cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Radius cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Radius cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const radiusSpec = readJson(radiusSpecFile)?.artifacts?.primitives?.radius;
  const contract = readIfExists(radiusContractFile);
  const frameReport = readJson(frameReportFile);
  const depthReport = readJson(depthReportFile);
  const stateReport = readJson(stateReportFile);
  const focusReport = reportStatus(focusReportFile);
  const densityReport = reportStatus(densityReportFile);
  const spacingReport = reportStatus(spacingReportFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);

  const roleIds = new Set((radiusSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(radiusSpec?.governingFoundations) ? radiusSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const coordinatedPrimitives = Array.isArray(radiusSpec?.coordinatesPrimitives) ? radiusSpec.coordinatesPrimitives : [];
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitiveName) => !coordinatedPrimitives.includes(primitiveName));
  const missingTokenAliases = requiredTokenAliases.filter((alias) => !tokenDecls.has(alias));
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const componentDirectRefFrame = findConsumerRefFrameRadius([componentCssFile]);
  const docsDirectRefFrame = findConsumerRefFrameRadius(docsCssFiles);
  const componentRawRadius = findRawRadius(componentCssFile, componentCss);
  const docsRawRadius = docsCssFiles.flatMap((file) => findRawRadius(file, readIfExists(file)));
  const componentRadiusAliasUseCount = countMatches(componentCss, /var\(--(?:sys-radius|sys-frame-radius|component-radius|comp-[a-z0-9-]+-radius)[a-z0-9-]*/g);
  const docsRadiusAliasUseCount = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-radius|sys-frame-radius|component-radius|comp-[a-z0-9-]+-radius|pattern-[a-z0-9-]+-radius)[a-z0-9-]*/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /"Radius"|Radius|radius\.(?:control|container|surface|full)|sys\.frame\.radius|Frame/i);
  const patternRefs = collectArtifactRefs(patternDir, /Radius|sys\.frame|Frame|surface shape|shape role/i);
  const templateRefs = collectArtifactRefs(templateDir, /Radius|sys\.frame|Frame|surface|panel/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Radius primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Radius primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Radius primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenAliases.length) gaps.push(`Token package is missing required Radius primitive aliases: ${missingTokenAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Radius bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (componentDirectRefFrame.length) gaps.push("Component package still consumes ref-frame-radius directly instead of Radius.");
  if (docsDirectRefFrame.length) gaps.push("Docs consumers still use ref-frame-radius directly outside the foundation/reference layer.");
  if (componentRawRadius.length || docsRawRadius.length) gaps.push("Raw border-radius values still appear outside tokens.");
  if (!contract.includes("Generated portable primitive contract for Design System.")) gaps.push("Radius Markdown contract is missing or not generated.");
  if (frameReport.status !== "pass" || depthReport.status !== "pass" || stateReport.status !== "pass") gaps.push("Radius cannot pass while Frame, Depth, or State foundation reports are not pass.");
  if (densityReport.status !== "pass") gaps.push("Radius cannot pass while Density primitive report is not pass.");
  if (spacingReport.status !== "pass") gaps.push("Radius cannot pass while Spacing primitive report is not pass.");
  if (componentRadiusAliasUseCount < 50) gaps.push("Component package does not show enough Radius/Frame alias usage to prove cascade into components.");
  if (componentRefs.count < 10) gaps.push("Component specs do not show enough Radius primitive coverage.");

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Radius",
    status: gaps.length ? "fail" : "pass",
    principle: "Radius converts Frame shape roles into implementation-ready control, container, surface, and pill curves so components do not invent one-off shape values.",
    specContract: {
      file: rel(radiusSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      foundationInputs: radiusSpec?.foundationInputs ?? [],
      tokenDependencies: radiusSpec?.tokenDependencies ?? [],
    },
    coordinatedPrimitives: {
      required: requiredCoordinatedPrimitives,
      present: coordinatedPrimitives,
      missing: missingCoordinatedPrimitives,
    },
    markdownContract: {
      file: rel(radiusContractFile),
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
      radiusAliasUseCount: componentRadiusAliasUseCount,
      directRefFrameRadiusConsumerUses: componentDirectRefFrame,
      rawRadius: componentRawRadius,
    },
    foundationGate: {
      frame: { report: rel(frameReportFile), status: frameReport.status, gaps: frameReport.gaps ?? [] },
      depth: { report: rel(depthReportFile), status: depthReport.status, gaps: depthReport.gaps ?? [] },
      state: { report: rel(stateReportFile), status: stateReport.status, gaps: stateReport.gaps ?? [] },
    },
    primitiveGate: {
      focus: { ...focusReport, relationship: "lateral-coordination" },
      density: { ...densityReport, relationship: "upstream-gate" },
      spacing: { ...spacingReport, relationship: "upstream-gate" },
    },
    docsSignal: {
      scannedFiles: docsCssFiles.map(rel),
      radiusAliasUseCount: docsRadiusAliasUseCount,
      directRefFrameRadiusConsumerUses: docsDirectRefFrame,
      rawRadius: docsRawRadius,
      note: "Docs consumers must use Radius/Frame system aliases. Direct ref-frame-radius is allowed only in foundation/reference pages that expose the raw scale.",
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
