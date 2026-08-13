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
const jsonOutput = path.join(outputDir, "primitive-density-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-density-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const tokenContextCssFile = path.join(root, "packages/tokens/styles/token-contexts.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const densitySpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/density.json");
const densityContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/density.md");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const voiceReportFile = path.join(root, "docs/audits/foundation-voice-cascade-audit.json");
const coordinatedPrimitiveReports = {
  Spacing: path.join(root, "docs/audits/primitive-spacing-cascade-audit.json"),
  Typography: path.join(root, "docs/audits/primitive-typography-cascade-audit.json"),
  Iconography: path.join(root, "docs/audits/primitive-iconography-cascade-audit.json"),
  Focus: path.join(root, "docs/audits/primitive-focus-cascade-audit.json"),
  Loading: path.join(root, "docs/audits/primitive-loading-cascade-audit.json"),
  Disabled: path.join(root, "docs/audits/primitive-disabled-cascade-audit.json"),
  Breakpoints: path.join(root, "docs/audits/primitive-breakpoints-cascade-audit.json"),
  Radius: path.join(root, "docs/audits/primitive-radius-cascade-audit.json"),
};
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["sm", "md", "lg"];
const requiredFoundations = ["Frame", "Accessibility", "Voice"];
const requiredCoordinates = ["Spacing", "Typography", "Iconography", "Focus", "Loading", "Disabled", "Breakpoints", "Radius"];
const requiredTokenDependencies = [
  "sys.frame.*",
  "sys.voice.*",
  "sys.accessibility.*",
  "spacing.*",
  "typography.*",
  "icon.*",
  "focus.*",
  "loading.*",
  "disabled.*",
  "breakpoint.*",
  "radius.*",
  "density.sm/md/lg",
];
const requiredSysAliases = [
  "--sys-density-control-height",
  "--sys-density-control-padding-x",
  "--sys-density-control-padding-y",
  "--sys-density-panel-padding",
  "--sys-density-card-padding",
  "--sys-density-surface-padding",
  "--sys-density-component-gap",
  "--sys-density-component-gap-lg",
  "--sys-density-subsection-gap",
  "--sys-density-section-gap",
  "--sys-density-page-gap",
  "--sys-density-row-height",
  "--sys-density-doc-heading-size",
  "--sys-density-doc-subheading-size",
  "--sys-density-doc-heading-line-height",
  "--sys-density-doc-body-size",
  "--sys-density-doc-body-line-height",
  "--sys-density-doc-label-size",
  "--sys-density-doc-card-title-size",
  "--sys-density-doc-card-body-size",
  "--sys-density-doc-card-min-block",
  "--sys-density-doc-example-min-block",
];
const legacyAliases = requiredSysAliases.map((alias) => alias.replace("--sys-", "--"));
const requiredContextFields = [
  "--sys-density-control-height",
  "--sys-density-control-padding-x",
  "--sys-density-control-padding-y",
  "--sys-density-panel-padding",
  "--sys-density-card-padding",
  "--sys-density-component-gap",
  "--sys-density-row-height",
  "--sys-density-doc-heading-size",
  "--sys-density-doc-body-size",
  "--sys-density-doc-label-size",
];
const requiredComponentAliases = [
  "--component-density-control-height",
  "--component-density-control-padding-x",
  "--component-density-control-padding-y",
  "--component-density-row-height",
  "--component-density-card-padding",
  "--component-density-component-gap",
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

function findLegacyDensityDeclarations(files) {
  const findings = [];
  for (const file of files) {
    const relative = rel(file);
    if (relative.includes("generated/")) continue;
    const isReferenceLayer = relative.includes("03a-reference-core-") || relative.includes("03b-foundation-reference-");
    const source = readIfExists(file);
    let match;
    const pattern = /--density-[a-z0-9-]+(?=\s*:)/g;
    while ((match = pattern.exec(source))) {
      if (file === tokenCssFile || isReferenceLayer) continue;
      findings.push({
        file: relative,
        line: lineNumber(source, match.index),
        token: match[0],
      });
    }
  }
  return findings;
}

function extractBlock(source, selector) {
  const index = source.indexOf(selector);
  if (index < 0) return "";
  const open = source.indexOf("{", index);
  if (open < 0) return "";
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, i);
  }
  return "";
}

function contextCompleteness(cssFile, selectors) {
  const source = readIfExists(cssFile);
  return selectors.map((selector) => {
    const block = extractBlock(source, selector);
    const missing = requiredContextFields.filter((field) => !block.includes(`${field}:`));
    return {
      selector,
      file: rel(cssFile),
      status: block && !missing.length ? "pass" : "fail",
      missing,
    };
  });
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Density Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Gaps",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    "",
    "## Signals",
    `- System density aliases: ${report.tokenAliases.present.length}/${report.tokenAliases.required.length}`,
    `- Legacy aliases mapped to system density: ${report.legacyBridge.present.length}/${report.legacyBridge.required.length}`,
    `- Component density selectors: ${report.componentBridge.densitySelectors}`,
    `- Component density token uses: ${report.componentBridge.densityTokenUses}`,
    `- Docs density token uses: ${report.docsSignal.densityTokenUses}`,
    `- Illegal legacy declarations outside token/reference layers: ${report.docsSignal.legacyDeclarations.length}`,
    "",
    "## Foundation Gate",
    `- Frame: ${report.foundationGate.frame.status}`,
    `- Accessibility: ${report.foundationGate.accessibility.status}`,
    `- Voice: ${report.foundationGate.voice.status}`,
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== `${markdown}\n`) {
      console.error("Primitive Density cascade audit is stale. Run npm run audit:primitive:density.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Density cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Density cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Density cascade audit passed: ${jsonOutput}`);
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = repoDocsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const docsScope = docsCssFiles.length ? "in-repo" : "external-not-audited";
  const docsFoundationDensityFile = docsCssFiles.find((file) => path.basename(file) === "00-foundations-03.css");
  const docsShellDensityFile = docsCssFiles.find((file) => path.basename(file) === "01-shell-02.css");
  const densitySpec = readJson(densitySpecFile)?.artifacts?.primitives?.density;
  const contract = readIfExists(densityContractFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);
  const frameReport = readJson(frameReportFile);
  const accessibilityReport = readJson(accessibilityReportFile);
  const voiceReport = readJson(voiceReportFile);
  const primitiveGate = Object.fromEntries(
    Object.entries(coordinatedPrimitiveReports).map(([name, file]) => {
      const report = fs.existsSync(file) ? readJson(file) : {};
      return [name, { report: rel(file), status: report.status ?? "missing", gaps: report.gaps ?? [] }];
    }),
  );

  const roleIds = new Set((densitySpec?.roles ?? []).map((role) => role.id));
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(densitySpec?.governingFoundations) ? densitySpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const coordinatesPrimitives = Array.isArray(densitySpec?.coordinatesPrimitives) ? densitySpec.coordinatesPrimitives : [];
  const tokenDependencies = Array.isArray(densitySpec?.tokenDependencies) ? densitySpec.tokenDependencies : [];
  const missingCoordinates = requiredCoordinates.filter((primitive) => !coordinatesPrimitives.includes(primitive));
  const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
  const missingSysAliases = requiredSysAliases.filter((alias) => !tokenDecls.has(alias));
  const brokenLegacyAliases = legacyAliases.filter((alias) => tokenDecls.get(alias) !== `var(${alias.replace("--", "--sys-")})`);
  const missingComponentAliases = requiredComponentAliases.filter((alias) => !componentDecls.has(alias));
  const componentAliasBypasses = requiredComponentAliases
    .filter((alias) => !/^var\(--sys-density-/.test(componentDecls.get(alias) ?? ""))
    .map((alias) => ({ alias, actual: componentDecls.get(alias) ?? null }));
  const contextChecks = fs.existsSync(tokenContextCssFile) ? [
    ...contextCompleteness(tokenContextCssFile, [
      ':where([data-density="sm"], [data-density-context="sm"], .density-sm)',
      ':where([data-density="md"], [data-density-context="md"], .density-md)',
      ':where([data-density="lg"], [data-density-context="lg"], .density-lg),',
    ]),
    ...contextCompleteness(tokenContextCssFile, [
      ".density-responsive",
    ]),
  ] : [];
  const docsContextDuplicates = [docsFoundationDensityFile, docsShellDensityFile]
    .filter(Boolean)
    .map((file) => ({
      file: rel(file),
      densityContextDeclarations: countMatches(readIfExists(file), /--sys-density-[a-z0-9-]+(?=\s*:)/g),
      status: "docs-duplicate-after-flow-token-context-source",
    }))
    .filter((item) => item.densityContextDeclarations > 0);
  const failingContexts = contextChecks.filter((item) => item.status !== "pass");
  const legacyDeclarations = findLegacyDensityDeclarations([componentCssFile, ...docsCssFiles]);
  const componentDensitySelectors = countMatches(componentCss, /\[data-density="(?:sm|md|lg)"\]/g);
  const componentDensityTokenUses = countMatches(componentCss, /var\(--(?:sys-density|density)-[a-z0-9-]+/g);
  const docsDensityTokenUses = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-density|density)-[a-z0-9-]+/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /Density|density\.(?:sm|md|lg)|density/i);
  const patternRefs = collectArtifactRefs(patternDir, /Density|density|compact|comfortable/i);
  const templateRefs = collectArtifactRefs(templateDir, /Density|density|desktop|mobile/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Density primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Density primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinates.length) gaps.push(`Density primitive is missing coordinated primitives: ${missingCoordinates.join(", ")}.`);
  if (missingTokenDependencies.length) gaps.push(`Density primitive is missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
  if (missingSysAliases.length) gaps.push(`Token package is missing required Density primitive aliases: ${missingSysAliases.join(", ")}.`);
  if (brokenLegacyAliases.length) gaps.push(`Legacy density aliases do not map to sys-density: ${brokenLegacyAliases.join(", ")}.`);
  if (missingComponentAliases.length) gaps.push(`Component package is missing required Density bridge aliases: ${missingComponentAliases.join(", ")}.`);
  if (componentAliasBypasses.length) gaps.push("Component package Density bridge aliases must consume sys-density aliases directly.");
  if (!fs.existsSync(tokenContextCssFile)) gaps.push("Token package is missing generated token context CSS.");
  if (failingContexts.length) gaps.push("Generated token context CSS does not expose the required spacing, type, row, and control remaps.");
  if (legacyDeclarations.length) gaps.push("Docs or components still declare legacy --density-* tokens outside the token/reference layer.");
  if (frameReport.status !== "pass") gaps.push("Density cannot pass while Frame foundation cascade report is not pass.");
  if (accessibilityReport.status !== "pass") gaps.push("Density cannot pass while Accessibility foundation cascade report is not pass.");
  if (voiceReport.status !== "pass") gaps.push("Density cannot pass while Voice foundation cascade report is not pass.");
  if (componentDensitySelectors < 30) gaps.push("Component package does not expose enough density selectors to prove cascade into components.");
  if (componentDensityTokenUses < 6) gaps.push("Component package does not consume enough Density tokens to prove cascade into components.");
  if (componentRefs.count < 20) gaps.push("Component specs do not show enough Density coverage.");

  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Density",
    status: gaps.length ? "fail" : "pass",
    principle: "Density maps Frame, Accessibility, and Voice into surface-level sm/md/lg scale decisions before components render, so components inherit rhythm instead of inventing size variants.",
    specContract: {
      file: rel(densitySpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      coordinatesPrimitives,
      missingCoordinates,
      foundationInputs: densitySpec?.foundationInputs ?? [],
      tokenDependencies,
      missingTokenDependencies,
    },
    markdownContract: {
      file: rel(densityContractFile),
      generated: contract.includes("Generated portable primitive contract for Design System."),
    },
    tokenAliases: {
      file: rel(tokenCssFile),
      required: requiredSysAliases,
      present: requiredSysAliases.filter((alias) => tokenDecls.has(alias)),
      missing: missingSysAliases,
    },
    legacyBridge: {
      file: rel(tokenCssFile),
      required: legacyAliases,
      present: legacyAliases.filter((alias) => tokenDecls.get(alias) === `var(${alias.replace("--", "--sys-")})`),
      broken: brokenLegacyAliases,
      note: "The public primitive API is sys-density. Legacy density aliases remain internal compatibility only while consumers migrate.",
    },
    contextBridge: {
      file: rel(tokenContextCssFile),
      requiredContextFields,
      checks: contextChecks,
      failing: failingContexts,
      docsDuplicates: docsContextDuplicates,
      note: "Density context evidence must come from generated Flow token contexts, not FlowDocs CSS. Docs duplicates are tracked as P0 cleanup debt.",
    },
    componentBridge: {
      file: rel(componentCssFile),
      requiredAliases: requiredComponentAliases,
      presentAliases: requiredComponentAliases.filter((alias) => componentDecls.has(alias)),
      missingAliases: missingComponentAliases,
      aliasBypasses: componentAliasBypasses,
      localDensityAliasDeclarations: [...componentDecls.keys()].filter((token) => token.startsWith("--density-")),
      densitySelectors: componentDensitySelectors,
      densityTokenUses: componentDensityTokenUses,
    },
    docsSignal: {
      scope: docsScope,
      scannedFiles: docsCssFiles.map(rel),
      densityTokenUses: docsDensityTokenUses,
      legacyDeclarations,
    },
    foundationGate: {
      frame: { report: rel(frameReportFile), status: frameReport.status, gaps: frameReport.gaps ?? [] },
      accessibility: { report: rel(accessibilityReportFile), status: accessibilityReport.status, gaps: accessibilityReport.gaps ?? [] },
      voice: { report: rel(voiceReportFile), status: voiceReport.status, gaps: voiceReport.gaps ?? [] },
    },
    primitiveGate,
    cascadeCoverage: {
      components: componentRefs,
      patterns: patternRefs,
      templates: templateRefs,
    },
    gaps,
  };
}

writeReport(createReport());
