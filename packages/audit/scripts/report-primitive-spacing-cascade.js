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
const jsonOutput = path.join(outputDir, "primitive-spacing-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-spacing-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const spacingSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/spacing.json");
const spacingContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/spacing.md");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const depthReportFile = path.join(root, "docs/audits/foundation-depth-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const breakpointsReportFile = path.join(root, "docs/audits/primitive-breakpoints-cascade-audit.json");
const densityReportFile = path.join(root, "docs/audits/primitive-density-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["inline", "component", "section", "page", "grid", "density"];
const requiredFoundations = ["Frame", "Depth", "State", "Accessibility"];
const requiredCoordinatedPrimitives = ["Density", "Breakpoints"];
const requiredTokenDependencies = [
  "ref.frame.space.*",
  "sys.frame.*",
  "sys.depth.*",
  "sys.state.*",
  "sys.accessibility.*",
  "density.*",
  "breakpoint.*",
  "spacing.*",
];
const requiredTokenAliases = [
  "--sys-space-0",
  "--sys-space-micro",
  "--sys-space-2xs",
  "--sys-space-1",
  "--sys-space-2",
  "--sys-space-3",
  "--sys-space-4",
  "--sys-space-5",
  "--sys-space-6",
  "--sys-space-8",
  "--sys-space-10",
  "--sys-space-12",
  "--sys-space-16",
  "--sys-space-20",
  "--sys-space-24",
  "--sys-space-32",
  "--sys-space-xs",
  "--sys-space-sm",
  "--sys-space-md",
  "--sys-space-lg",
  "--sys-space-xl",
  "--sys-space-2xl",
  "--sys-spacing-inline-xs",
  "--sys-spacing-inline-sm",
  "--sys-spacing-component-sm",
  "--sys-spacing-component-md",
  "--sys-spacing-component-lg",
  "--sys-spacing-section",
  "--sys-spacing-page",
];
const requiredComponentAliases = [
  "--component-control-min-size",
  "--component-focus-ring-offset",
  "--component-field-gap",
  "--component-offset-xs",
  "--component-inline-size-xs",
  "--component-inline-size-sm",
  "--component-inline-size-md",
  "--component-inline-size-lg",
  "--component-block-size-sm",
  "--component-block-size-md",
  "--component-block-size-lg",
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

function findConsumerRefFrameSpace(files) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--ref-frame-space-[a-z0-9-]+\)/g;
    while ((match = pattern.exec(source))) {
      const relative = rel(file);
      const isReferenceLayer = relative.includes("00-foundations-")
        || relative.includes("03a-reference-core-")
        || relative.includes("03b-foundation-reference-")
        || relative.includes("03c-motion-reference-");
      if (isReferenceLayer) continue;
      findings.push({
        file: relative,
        line: lineNumber(source, match.index),
        value: match[0],
      });
    }
  }
  return findings;
}

function findSpacingFallbacks(file, source) {
  const findings = [];
  const pattern = /(?<prop>\b(?:padding|padding-block|padding-inline|padding-block-start|padding-block-end|padding-inline-start|padding-inline-end|margin|margin-block|margin-inline|margin-block-start|margin-block-end|margin-inline-start|margin-inline-end|gap|inset|inset-block|inset-inline|inset-block-start|inset-block-end|inset-inline-start|inset-inline-end|top|right|bottom|left|inline-size|block-size|min-inline-size|min-block-size|max-inline-size|max-block-size))\s*:\s*(?<value>[^;]+);/g;
  let match;
  while ((match = pattern.exec(source))) {
    const value = match.groups.value.trim();
    const hasRawFallback = /var\(--[a-z0-9-]+,\s*[-+]?\d*\.?\d+(?:px|rem|em)\)/.test(value);
    const hasLiteralValue = /(^|[\s(,+-])[-+]?\d*\.?\d+(?:px|rem|em)\b/.test(value)
      && !/var\(--(?:sys-|component-|comp-|pattern-|density-|ref-frame-content|ref-frame-height|ref-frame-width)/.test(value);
    const isAllowedZero = /(^|[\s(])0(?:px|rem|em)?(?:[\s),;]|$)/.test(value);
    const isReferenceLayer = rel(file).includes("00-foundations-")
      || rel(file).includes("03a-reference-core-")
      || rel(file).includes("03b-foundation-reference-")
      || rel(file).includes("03c-motion-reference-");
    if (isReferenceLayer) continue;
    if ((hasRawFallback || hasLiteralValue) && !isAllowedZero) {
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        property: match.groups.prop,
        value,
        status: "review",
        reason: "Spacing declarations should resolve through Spacing/Frame tokens, not raw length fallbacks.",
      });
    }
  }
  return findings;
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    `# Primitive Spacing Cascade Audit`,
    ``,
    `Status: **${report.status}**`,
    ``,
    report.principle,
    ``,
    `## Gaps`,
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    ``,
    `## Signals`,
    `- Token aliases: ${report.tokenAliases.present.length}/${report.tokenAliases.required.length}`,
    `- Component bridge aliases: ${report.componentBridge.present.length}/${report.componentBridge.required.length}`,
    `- Component spacing alias uses: ${report.componentBridge.spacingAliasUseCount}`,
    `- Docs spacing alias uses: ${report.docsSignal.spacingAliasUseCount}`,
    `- Direct ref-frame-space consumer uses: ${report.docsSignal.directRefFrameSpaceConsumerUses.length + report.componentBridge.directRefFrameSpaceConsumerUses.length}`,
    `- Raw spacing fallback review items: ${report.review.rawSpacingFallbacks.length}`,
    ``,
    `## Foundation Gate`,
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    ``,
    `## Primitive Gate`,
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Spacing cascade report is stale. Run npm run audit:primitive:spacing.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Spacing cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Spacing cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Spacing cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const spacingSpec = readJson(spacingSpecFile)?.artifacts?.primitives?.spacing;
  const contract = readIfExists(spacingContractFile);
  const frameReport = readJson(frameReportFile);
  const depthReport = readJson(depthReportFile);
  const stateReport = readJson(stateReportFile);
  const accessibilityReport = readJson(accessibilityReportFile);
  const breakpointsReport = readJson(breakpointsReportFile);
  const densityReport = readJson(densityReportFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);

  const roleIds = new Set((spacingSpec?.roles ?? []).map((role) => role.id));
  const coordinatesPrimitives = Array.isArray(spacingSpec?.coordinatesPrimitives) ? spacingSpec.coordinatesPrimitives : [];
  const tokenDependencies = Array.isArray(spacingSpec?.tokenDependencies) ? spacingSpec.tokenDependencies : [];
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(spacingSpec?.governingFoundations) ? spacingSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitive) => !coordinatesPrimitives.includes(primitive));
  const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
  const missingTokenAliases = requiredTokenAliases.filter((alias) => !tokenDecls.has(alias));
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const componentDirectRefFrame = findConsumerRefFrameSpace([componentCssFile]);
  const docsDirectRefFrame = findConsumerRefFrameSpace(docsCssFiles);
  const rawSpacingFallbacks = [
    ...findSpacingFallbacks(componentCssFile, componentCss),
    ...docsCssFiles.flatMap((file) => findSpacingFallbacks(file, readIfExists(file))),
  ];
  const componentSpacingAliasUseCount = countMatches(componentCss, /var\(--(?:sys-space|sys-spacing|sys-frame-gap|component-[a-z0-9-]*(?:space|gap|padding|offset|size)|comp-[a-z0-9-]*(?:space|gap|padding|offset|size))[a-z0-9-]*/g);
  const docsSpacingAliasUseCount = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-space|sys-spacing|sys-frame-gap|density-|docs-[a-z0-9-]*(?:space|gap|padding|offset|size)|comp-[a-z0-9-]*(?:space|gap|padding|offset|size)|pattern-[a-z0-9-]*(?:space|gap|padding|offset|size))[a-z0-9-]*/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /"Spacing"|Spacing|spacing\.(?:inline|component|section|page|grid|density)|sys\.frame|Frame/i);
  const patternRefs = collectArtifactRefs(patternDir, /Spacing|sys\.frame|Frame|layout rhythm|density/i);
  const templateRefs = collectArtifactRefs(templateDir, /Spacing|sys\.frame|Frame|layout|density/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Spacing primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Spacing primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Spacing primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenDependencies.length) gaps.push(`Spacing primitive is missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
  if (missingTokenAliases.length) gaps.push(`Token package is missing required Spacing primitive aliases: ${missingTokenAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Spacing bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (componentDirectRefFrame.length) gaps.push("Component package still consumes ref-frame-space directly instead of the Spacing primitive.");
  if (docsDirectRefFrame.length) gaps.push("Docs consumers still use ref-frame-space directly outside the foundation/reference layer.");
  if (!contract.includes("Generated portable primitive contract for Design System.")) gaps.push("Spacing Markdown contract is missing or not generated.");
  if (frameReport.status !== "pass") gaps.push("Spacing cannot pass while the Frame foundation cascade report is not pass.");
  if (depthReport.status !== "pass") gaps.push("Spacing cannot pass while the Depth foundation cascade report is not pass.");
  if (stateReport.status !== "pass") gaps.push("Spacing cannot pass while the State foundation cascade report is not pass.");
  if (accessibilityReport.status !== "pass") gaps.push("Spacing cannot pass while the Accessibility foundation cascade report is not pass.");
  if (breakpointsReport.status !== "pass") gaps.push("Spacing cannot pass while the Breakpoints primitive cascade report is not pass.");
  if (densityReport.status !== "pass") gaps.push("Spacing cannot pass while the Density primitive cascade report is not pass.");
  if (componentSpacingAliasUseCount < 40) gaps.push("Component package does not show enough Spacing/Frame alias usage to prove cascade into components.");
  if (componentRefs.count < 10) gaps.push("Component specs do not show enough Spacing primitive coverage.");

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Spacing",
    status: gaps.length ? "fail" : "pass",
    principle: "Spacing converts Frame, Density, Depth, State, and Accessibility into layout-ready gaps, insets, and size relationships so components do not reach into raw frame reference values.",
    specContract: {
      file: rel(spacingSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      coordinatesPrimitives,
      foundationInputs: spacingSpec?.foundationInputs ?? [],
      tokenDependencies,
      missingTokenDependencies,
    },
    markdownContract: {
      file: rel(spacingContractFile),
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
      spacingAliasUseCount: componentSpacingAliasUseCount,
      directRefFrameSpaceConsumerUses: componentDirectRefFrame,
    },
    foundationGate: {
      frame: {
        report: rel(frameReportFile),
        status: frameReport.status,
        gaps: frameReport.gaps ?? [],
      },
      depth: {
        report: rel(depthReportFile),
        status: depthReport.status,
        gaps: depthReport.gaps ?? [],
      },
      state: {
        report: rel(stateReportFile),
        status: stateReport.status,
        gaps: stateReport.gaps ?? [],
      },
      accessibility: {
        report: rel(accessibilityReportFile),
        status: accessibilityReport.status,
        gaps: accessibilityReport.gaps ?? [],
      },
    },
    primitiveGate: {
      breakpoints: {
        report: rel(breakpointsReportFile),
        status: breakpointsReport.status,
        gaps: breakpointsReport.gaps ?? [],
      },
      density: {
        report: rel(densityReportFile),
        status: densityReport.status,
        gaps: densityReport.gaps ?? [],
      },
    },
    docsSignal: {
      scannedFiles: docsCssFiles.map(rel),
      spacingAliasUseCount: docsSpacingAliasUseCount,
      directRefFrameSpaceConsumerUses: docsDirectRefFrame,
      note: "Docs consumers must use Spacing/Frame system aliases. Direct ref-frame-space is allowed only in foundation/reference pages that expose the raw scale.",
    },
    review: {
      rawSpacingFallbacks,
      note: "Review items are visible debt. They do not fail the first Spacing gate unless they bypass ref-frame directly, because some are optical offsets or viewport caps that need one-by-one migration.",
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
