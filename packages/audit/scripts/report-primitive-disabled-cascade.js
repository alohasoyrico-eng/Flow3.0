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
const jsonOutput = path.join(outputDir, "primitive-disabled-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-disabled-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const disabledSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/disabled.json");
const disabledContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/disabled.md");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const energyReportFile = path.join(root, "docs/audits/foundation-energy-cascade-audit.json");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const focusReportFile = path.join(root, "docs/audits/primitive-focus-cascade-audit.json");
const loadingReportFile = path.join(root, "docs/audits/primitive-loading-cascade-audit.json");
const iconographyReportFile = path.join(root, "docs/audits/primitive-iconography-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["unavailable", "permission", "offline", "risk", "future"];
const requiredFoundations = ["State", "Tone", "Accessibility", "Energy"];
const requiredCoordinatedPrimitives = ["Focus", "Loading", "Iconography"];
const requiredTokenAliases = [
  "--sys-disabled-opacity",
  "--sys-disabled-readable-opacity",
  "--sys-disabled-surface-opacity",
  "--sys-disabled-text-color",
  "--sys-disabled-icon-color",
  "--sys-disabled-border-color",
  "--sys-disabled-cursor",
  "--sys-disabled-pointer-events",
];
const requiredComponentAliases = [
  "--component-disabled-opacity",
  "--component-disabled-readable-opacity",
  "--component-disabled-surface-opacity",
  "--component-disabled-text",
  "--component-disabled-icon",
  "--component-disabled-border",
  "--component-disabled-cursor",
  "--component-disabled-pointer-events",
  "--component-opacity-disabled",
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

function findDirectStateDisabledUses(files) {
  const findings = [];
  for (const file of files) {
    if (isFoundationOrReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--sys-state-disabled-(?:opacity|readable-opacity)\)/g;
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

function findRawDisabledOpacity(files) {
  const findings = [];
  for (const file of files) {
    if (isFoundationOrReferenceLayer(file)) continue;
    const source = readIfExists(file);
    let match;
    const pattern = /opacity\s*:\s*(?<value>0?\.42|0?\.58)\s*;/g;
    while ((match = pattern.exec(source))) {
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match.groups.value,
      });
    }
  }
  return findings;
}

function findDisabledOpacityOnlyRules(files) {
  const findings = [];
  const blockPattern = /(?<selector>[^{}]*(?:disabled|aria-disabled)[^{]*)\{(?<body>[^}]+)\}/gi;
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    while ((match = blockPattern.exec(source))) {
      const body = match.groups.body;
      const hasOpacity = /opacity\s*:/.test(body);
      const hasSecondCue = /(color|background|border|cursor|pointer-events|filter|box-shadow)\s*:/.test(body);
      if (hasOpacity && !hasSecondCue) {
        findings.push({
          file: rel(file),
          line: lineNumber(source, match.index),
          selector: match.groups.selector.trim().replace(/\s+/g, " "),
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
    "# Primitive Disabled Cascade Audit",
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
    `- Component disabled selectors: ${report.componentBridge.disabledSelectors}`,
    `- Component disabled token uses: ${report.componentBridge.disabledTokenUses}`,
    `- Docs disabled token uses: ${report.docsSignal.disabledTokenUses}`,
    `- Direct State disabled uses outside foundations: ${report.review.directStateDisabledUses.length}`,
    `- Raw disabled opacity values: ${report.review.rawDisabledOpacity.length}`,
    `- Disabled opacity-only rules: ${report.review.opacityOnlyRules.length}`,
    "",
    "## Foundation Gate",
    `- Accessibility: ${report.foundationGate.accessibility.status}`,
    `- State: ${report.foundationGate.state.status}`,
    `- Tone: ${report.foundationGate.tone.status}`,
    `- Energy: ${report.foundationGate.energy.status}`,
    "",
    "## Primitive Gate",
    `- Focus: ${report.primitiveGate.focus.status}`,
    `- Loading: ${report.primitiveGate.loading.status}`,
    `- Iconography: ${report.primitiveGate.iconography.status}`,
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Disabled cascade audit is stale. Run: node packages/audit/scripts/report-primitive-disabled-cascade.js.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Disabled cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Disabled cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Disabled cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = repoDocsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const disabledSpec = readJson(disabledSpecFile)?.artifacts?.primitives?.disabled;
  const contract = readIfExists(disabledContractFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);
  const accessibilityReport = readJson(accessibilityReportFile);
  const stateReport = readJson(stateReportFile);
  const energyReport = readJson(energyReportFile);
  const toneReport = readJson(toneReportFile);
  const focusReport = reportStatus(focusReportFile);
  const loadingReport = reportStatus(loadingReportFile);
  const iconographyReport = reportStatus(iconographyReportFile);
  const scannedCss = [componentCssFile, ...docsCssFiles];

  const roleIds = new Set((disabledSpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(disabledSpec?.governingFoundations) ? disabledSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const coordinatedPrimitives = Array.isArray(disabledSpec?.coordinatesPrimitives) ? disabledSpec.coordinatesPrimitives : [];
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitiveName) => !coordinatedPrimitives.includes(primitiveName));
  const missingTokenAliases = requiredTokenAliases.filter((alias) => !tokenDecls.has(alias));
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const directStateDisabledUses = findDirectStateDisabledUses(scannedCss);
  const rawDisabledOpacity = findRawDisabledOpacity(scannedCss);
  const opacityOnlyRules = findDisabledOpacityOnlyRules(scannedCss);
  const componentDisabledSelectors = countMatches(componentCss, /(?:\:disabled|\[aria-disabled="true"\]|\[data-state="disabled"\])/g);
  const componentDisabledTokenUses = countMatches(componentCss, /var\(--(?:sys-disabled|component-disabled|component-opacity-disabled)[a-z0-9-]*/g);
  const docsDisabledTokenUses = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-disabled|component-disabled|component-opacity-disabled|comp-[a-z0-9-]+-disabled)[a-z0-9-]*/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /Disabled|disabled|permissionBlocked|offlineBlocked|riskBlocked|futureAvailable|disabled\./i);
  const patternRefs = collectArtifactRefs(patternDir, /Disabled|disabled|permissionBlocked|offlineBlocked|riskBlocked|futureAvailable|disabled\./i);
  const templateRefs = collectArtifactRefs(templateDir, /Disabled|disabled|permissionBlocked|offlineBlocked|riskBlocked|futureAvailable|disabled\./i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Disabled primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Disabled primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Disabled primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenAliases.length) gaps.push(`Token package is missing required Disabled primitive aliases: ${missingTokenAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Disabled bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (directStateDisabledUses.length) gaps.push("Disabled consumers still read State disabled aliases directly outside foundations.");
  if (rawDisabledOpacity.length) gaps.push("Raw disabled opacity values still appear outside tokens/foundations.");
  if (opacityOnlyRules.length) gaps.push("Some disabled rules rely on opacity as the only visual cue.");
  if (componentDisabledSelectors < 10) gaps.push("Component CSS has too few disabled selectors for the breadth of component contracts.");
  if (componentDisabledTokenUses < 10) gaps.push("Component CSS has too few Disabled primitive token uses.");
  if (accessibilityReport?.status !== "pass") gaps.push("Accessibility foundation gate is not passing.");
  if (stateReport?.status !== "pass") gaps.push("State foundation gate is not passing.");
  if (toneReport?.status !== "pass") gaps.push("Tone foundation gate is not passing.");
  if (energyReport?.status !== "pass") gaps.push("Energy foundation gate is not passing.");
  if (focusReport?.status !== "pass") gaps.push("Focus primitive gate is not passing.");
  if (!/Do not rely on opacity alone/.test(contract)) gaps.push("Disabled contract must explicitly reject opacity-only disabled states.");

  return {
    primitive: "disabled",
    status: gaps.length ? "fail" : "pass",
    principle: "Disabled consumes State, Tone, Accessibility, and Energy, then exposes a narrow disabled API so components explain unavailable behavior without relying on opacity alone.",
    sourceOfTruth: {
      spec: rel(disabledSpecFile),
      contract: rel(disabledContractFile),
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
      disabledSelectors: componentDisabledSelectors,
      disabledTokenUses: componentDisabledTokenUses,
    },
    docsSignal: {
      disabledTokenUses: docsDisabledTokenUses,
    },
    review: {
      directStateDisabledUses,
      rawDisabledOpacity,
      opacityOnlyRules,
    },
    foundationGate: {
      accessibility: { status: accessibilityReport?.status ?? "missing", file: rel(accessibilityReportFile) },
      state: { status: stateReport?.status ?? "missing", file: rel(stateReportFile) },
      tone: { status: toneReport?.status ?? "missing", file: rel(toneReportFile) },
      energy: { status: energyReport?.status ?? "missing", file: rel(energyReportFile) },
    },
    primitiveGate: {
      focus: { ...focusReport, relationship: "lateral-coordination" },
      loading: { ...loadingReport, relationship: "lateral-coordination" },
      iconography: { ...iconographyReport, relationship: "lateral-coordination" },
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
