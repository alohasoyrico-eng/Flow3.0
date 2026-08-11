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
const jsonOutput = path.join(outputDir, "primitive-typography-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-typography-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const typographySpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/typography.json");
const typographyContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/typography.md");
const voiceReportFile = path.join(root, "docs/audits/foundation-voice-cascade-audit.json");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const frameReportFile = path.join(root, "docs/audits/foundation-frame-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const breakpointsReportFile = path.join(root, "docs/audits/primitive-breakpoints-cascade-audit.json");
const densityReportFile = path.join(root, "docs/audits/primitive-density-cascade-audit.json");
const spacingReportFile = path.join(root, "docs/audits/primitive-spacing-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["display", "heading", "numeral", "label", "paragraph", "caption", "code"];
const requiredFoundations = ["Voice", "Tone", "Frame", "Accessibility"];
const requiredCoordinatedPrimitives = ["Density", "Spacing", "Breakpoints"];
const requiredTokenDependencies = [
  "ref.voice.*",
  "sys.voice.*",
  "sys.tone.*",
  "sys.frame.*",
  "sys.accessibility.*",
  "density.*",
  "spacing.*",
  "breakpoint.*",
  "typography.*",
];
const requiredTokenAliases = [
  ["--sys-font-body", "var(--sys-voice-family-body)"],
  ["--sys-font-title", "var(--sys-voice-family-title)"],
  ["--sys-font-icon", "var(--sys-icon-family)"],
  ["--sys-voice-family-body", "var(--ref-voice-family-sans)"],
  ["--sys-voice-family-title", "var(--ref-voice-family-brand)"],
  ["--sys-voice-numeral-lg-size", "var(--ref-voice-size-9)"],
];
const requiredComponentAliases = [
  "--component-font-size-micro",
  "--component-font-size-caption",
  "--component-font-size-small",
  "--component-font-size-label",
  "--component-font-size-body-sm",
  "--component-font-size-body",
  "--component-font-size-body-md",
  "--component-font-size-body-lg",
  "--component-font-size-title-xs",
  "--component-font-size-title-sm",
  "--component-font-size-title-md",
  "--component-font-size-title-lg",
  "--component-font-size-data-lg",
  "--component-font-size-display-sm",
  "--component-font-size-display-md",
  "--component-font-family-mono",
  "--component-line-height-snug",
  "--component-letter-spacing-expanded",
  "--component-letter-spacing-normal",
  "--component-letter-spacing-wide",
  "--component-letter-spacing-widest",
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

function reportStatus(report) {
  return report?.status ?? "missing";
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

function collectUsedCustomProperties(css, prefixPattern) {
  const used = new Set();
  const pattern = new RegExp(`var\\((${prefixPattern}[a-z0-9-]+)`, "g");
  let match;
  while ((match = pattern.exec(css))) used.add(match[1]);
  return [...used].sort();
}

function findComponentRawTypography(css) {
  const findings = [];
  const declarationPattern = /(?<prop>font-size|font-weight|font-family|line-height|letter-spacing)\s*:\s*(?<value>[^;]+);/g;
  let match;
  while ((match = declarationPattern.exec(css))) {
    const { prop, value } = match.groups;
    const trimmed = value.trim();
    const isAllowedZeroSpacing = prop === "letter-spacing" && trimmed === "0";
    const isAllowedIconLine = prop === "line-height" && trimmed === "1";
    const isAllowedCollapsedText = prop === "font-size" && trimmed === "0";
    const isAllowedToken = /var\(--(?:sys-voice|sys-font|sys-symbol|sys-iconography|component-font|component-icon-family|component-line-height|component-letter-spacing|comp-[a-z0-9-]+|[a-z0-9-]+-[a-z0-9-]+-(?:font|title|body|label|caption|description|size|weight|line-height|letter-spacing))/.test(trimmed);
    const isAllowedInherit = trimmed === "inherit";
    const isAllowedIconCalc = prop === "font-size" && /^calc\(var\(--component-icon-size-/.test(trimmed);
    if (isAllowedZeroSpacing || isAllowedIconLine || isAllowedCollapsedText || isAllowedToken || isAllowedInherit || isAllowedIconCalc) continue;
    findings.push({
      file: rel(componentCssFile),
      line: lineNumber(css, match.index),
      property: prop,
      value: trimmed,
      status: "fail",
      reason: "Component package typography must resolve through Typography/Voice aliases, not raw values.",
    });
  }
  return findings;
}

function findDocsDirectRefVoice(files) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--ref-voice-[a-z0-9-]+\)/g;
    while ((match = pattern.exec(source))) {
      const relative = rel(file);
      const isFoundationReference = relative.includes("00-foundations-")
        || relative.includes("03a-reference-core-")
        || relative.includes("03b-foundation-reference-")
        || relative.includes("03c-motion-reference-");
      if (isFoundationReference) continue;
      findings.push({
        file: relative,
        line: lineNumber(source, match.index),
        value: match[0],
      });
    }
  }
  return findings;
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const typographySpec = readJson(typographySpecFile)?.artifacts?.primitives?.typography;
  const contract = readIfExists(typographyContractFile);
  const voiceReport = readJson(voiceReportFile);
  const toneReport = readJson(toneReportFile);
  const frameReport = readJson(frameReportFile);
  const accessibilityReport = readJson(accessibilityReportFile);
  const breakpointsReport = readJson(breakpointsReportFile);
  const densityReport = readJson(densityReportFile);
  const spacingReport = readJson(spacingReportFile);
  const tokenDecls = collectDeclarations(tokenCss);
  const componentDecls = collectDeclarations(componentCss);

  const roleIds = new Set((typographySpec?.roles ?? []).map((role) => role.id));
  const coordinatesPrimitives = Array.isArray(typographySpec?.coordinatesPrimitives) ? typographySpec.coordinatesPrimitives : [];
  const tokenDependencies = Array.isArray(typographySpec?.tokenDependencies) ? typographySpec.tokenDependencies : [];
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(typographySpec?.governingFoundations) ? typographySpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitive) => !coordinatesPrimitives.includes(primitive));
  const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
  const tokenAliasGaps = requiredTokenAliases
    .filter(([alias, value]) => tokenDecls.get(alias) !== value)
    .map(([alias, expected]) => ({ alias, expected, actual: tokenDecls.get(alias) ?? null }));
  const componentAliasGaps = requiredComponentAliases
    .filter((alias) => !componentDecls.has(alias))
    .map((alias) => ({ alias, actual: null }));
  const componentRefVoiceAliasGaps = requiredComponentAliases
    .filter((alias) => /var\(--ref-voice-/.test(componentDecls.get(alias) ?? ""))
    .map((alias) => ({ alias, actual: componentDecls.get(alias), reason: "Component bridge aliases must consume sys-voice roles, not ref-voice scales directly." }));
  const usedComponentAliases = collectUsedCustomProperties(componentCss, "--component-font");
  const undefinedComponentAliasUses = usedComponentAliases
    .filter((alias) => !componentDecls.has(alias))
    .map((alias) => ({ alias, status: "fail", reason: "Used Typography component alias is not declared at package root." }));
  const rawComponentTypography = findComponentRawTypography(componentCss);
  const docsDirectRefVoice = findDocsDirectRefVoice(docsCssFiles);
  const componentTypographyAliasUse = countMatches(componentCss, /var\(--(?:component-font|component-line-height|component-letter-spacing|sys-voice|sys-font)[a-z0-9-]*/g);
  const docsTypographyAliasUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:component-font|density-doc|sys-voice|sys-font|comp-[a-z0-9-]+-(?:font|title|body|label|caption|description|size|weight|line-height)|pattern-[a-z0-9-]+-(?:font|title|body|label|caption|description|size|weight|line-height))[a-z0-9-]*/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /"Typography"|Typography|typography\.(?:display|heading|numeral|label|paragraph|caption|code)|sys\.voice|Voice/i);
  const patternRefs = collectArtifactRefs(patternDir, /Typography|sys\.voice|Voice|label hierarchy|copy hierarchy|text role/i);
  const templateRefs = collectArtifactRefs(templateDir, /Typography|sys\.voice|Voice|heading|paragraph|label/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Typography primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Typography primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Typography primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenDependencies.length) gaps.push(`Typography primitive is missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
  if (tokenAliasGaps.length) gaps.push("Token package is missing required Typography primitive aliases or maps them incorrectly.");
  if (componentAliasGaps.length) gaps.push("Component package is missing required Typography bridge aliases.");
  if (componentRefVoiceAliasGaps.length) gaps.push("Component package Typography bridge aliases bypass sys-voice and point to ref-voice directly.");
  if (undefinedComponentAliasUses.length) gaps.push("Component package uses Typography aliases that are not declared.");
  if (rawComponentTypography.length) gaps.push("Component package still contains raw typography declarations.");
  if (docsDirectRefVoice.length) gaps.push("Docs consumers still use ref-voice directly outside the foundation/reference layer.");
  if (!contract.includes("Generated portable primitive contract for Design System.")) gaps.push("Typography Markdown contract is missing or not generated.");
  if (reportStatus(voiceReport) !== "pass") gaps.push("Typography cannot pass while the Voice foundation cascade report is not pass.");
  if (reportStatus(toneReport) !== "pass") gaps.push("Typography cannot pass while the Tone foundation cascade report is not pass.");
  if (reportStatus(frameReport) !== "pass") gaps.push("Typography cannot pass while the Frame foundation cascade report is not pass.");
  if (reportStatus(accessibilityReport) !== "pass") gaps.push("Typography cannot pass while the Accessibility foundation cascade report is not pass.");
  if (reportStatus(breakpointsReport) !== "pass") gaps.push("Typography cannot pass while the Breakpoints primitive cascade report is not pass.");
  if (reportStatus(densityReport) !== "pass") gaps.push("Typography cannot pass while the Density primitive cascade report is not pass.");
  if (reportStatus(spacingReport) !== "pass") gaps.push("Typography cannot pass while the Spacing primitive cascade report is not pass.");
  if (componentTypographyAliasUse < 30) gaps.push("Component package does not show enough Typography/Voice alias usage to prove cascade into components.");
  if (componentRefs.count < 10) gaps.push("Component specs do not show enough Typography primitive coverage.");

  const status = gaps.length ? "fail" : "pass";
  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Typography",
    status,
    principle: "Typography converts Voice, Tone, Frame, and Accessibility into implementation-ready text roles so components never choose raw font values or bypass Edenred/Ubuntu role ownership.",
    specContract: {
      file: rel(typographySpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      coordinatesPrimitives,
      missingCoordinatedPrimitives,
      foundationInputs: typographySpec?.foundationInputs ?? [],
      tokenDependencies,
      missingTokenDependencies,
    },
    markdownContract: {
      file: rel(typographyContractFile),
      generated: contract.includes("Generated portable primitive contract for Design System."),
    },
    tokenAliases: {
      file: rel(tokenCssFile),
      requiredAliases: requiredTokenAliases.map(([alias, expected]) => ({ alias, expected, actual: tokenDecls.get(alias) ?? null })),
      gaps: tokenAliasGaps,
    },
    componentBridge: {
      file: rel(componentCssFile),
      requiredAliases: requiredComponentAliases.map((alias) => ({ alias, actual: componentDecls.get(alias) ?? null })),
      gaps: componentAliasGaps,
      refVoiceBypassGaps: componentRefVoiceAliasGaps,
      undefinedUses: undefinedComponentAliasUses,
      rawTypography: rawComponentTypography,
      aliasUseCount: componentTypographyAliasUse,
    },
    foundationGate: {
      voice: {
        report: rel(voiceReportFile),
        status: reportStatus(voiceReport),
        gaps: voiceReport?.gaps ?? [],
      },
      tone: {
        report: rel(toneReportFile),
        status: reportStatus(toneReport),
        gaps: toneReport?.gaps ?? [],
      },
      frame: {
        report: rel(frameReportFile),
        status: reportStatus(frameReport),
        gaps: frameReport?.gaps ?? [],
      },
      accessibility: {
        report: rel(accessibilityReportFile),
        status: reportStatus(accessibilityReport),
        gaps: accessibilityReport?.gaps ?? [],
      },
    },
    primitiveGate: {
      breakpoints: {
        report: rel(breakpointsReportFile),
        status: reportStatus(breakpointsReport),
        gaps: breakpointsReport?.gaps ?? [],
      },
      density: {
        report: rel(densityReportFile),
        status: reportStatus(densityReport),
        gaps: densityReport?.gaps ?? [],
      },
      spacing: {
        report: rel(spacingReportFile),
        status: reportStatus(spacingReport),
        gaps: spacingReport?.gaps ?? [],
      },
    },
    docsSignal: {
      scannedFiles: docsCssFiles.map(rel),
      typographyAliasUseCount: docsTypographyAliasUse,
      directRefVoiceConsumerUses: docsDirectRefVoice,
      note: "Docs consumers must use Typography/Voice system aliases. Direct ref-voice is allowed only in foundation/reference pages that expose the raw scale.",
    },
    cascadeCoverage: {
      components: componentRefs,
      patterns: patternRefs,
      templates: templateRefs,
    },
    gaps,
    nextActions: [
      "Fix fail-level Typography alias, foundation gate, undefined alias, or raw component typography gaps before moving to Spacing.",
      "Keep Edenred Black/Ubuntu ownership in Voice; Typography only maps roles and bridges implementation.",
      "Use ZIP text details as role/density evidence, never as permission to mutate Flow font foundations.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Typography Primitive Cascade Audit");
  lines.push("");
  lines.push(`Status: **${report.status}**`);
  lines.push("");
  lines.push(report.principle);
  lines.push("");
  lines.push("## Foundation Gate");
  lines.push("");
  for (const [foundation, gate] of Object.entries(report.foundationGate)) {
    lines.push(`- ${foundation}: ${gate.status}; gaps ${gate.gaps.length}`);
  }
  lines.push("");
  lines.push("## Primitive Gate");
  lines.push("");
  for (const [primitive, gate] of Object.entries(report.primitiveGate)) {
    lines.push(`- ${primitive}: ${gate.status}; gaps ${gate.gaps.length}`);
  }
  lines.push("");
  lines.push("## Token Aliases");
  lines.push("");
  lines.push("| Alias | Expected | Actual |");
  lines.push("| --- | --- | --- |");
  for (const item of report.tokenAliases.requiredAliases) {
    lines.push(`| ${item.alias} | \`${item.expected}\` | \`${item.actual ?? "missing"}\` |`);
  }
  lines.push("");
  lines.push("## Component Bridge");
  lines.push("");
  lines.push("| Alias | Actual |");
  lines.push("| --- | --- |");
  for (const item of report.componentBridge.requiredAliases) {
    lines.push(`| ${item.alias} | \`${item.actual ?? "missing"}\` |`);
  }
  lines.push("");
  lines.push(`- Undefined component Typography alias uses: ${report.componentBridge.undefinedUses.length}`);
  lines.push(`- Component ref-voice bypasses: ${report.componentBridge.refVoiceBypassGaps.length}`);
  lines.push(`- Raw package Typography declarations: ${report.componentBridge.rawTypography.length}`);
  lines.push(`- Component Typography alias uses: ${report.componentBridge.aliasUseCount}`);
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  lines.push("| Layer | Count | Evidence |");
  lines.push("| --- | ---: | --- |");
  lines.push(`| Component refs | ${report.cascadeCoverage.components.count} | ${report.cascadeCoverage.components.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.components.count > 18 ? "..." : ""} |`);
  lines.push(`| Pattern refs | ${report.cascadeCoverage.patterns.count} | ${report.cascadeCoverage.patterns.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.patterns.count > 18 ? "..." : ""} |`);
  lines.push(`| Template refs | ${report.cascadeCoverage.templates.count} | ${report.cascadeCoverage.templates.ids.join(", ") || "none"} |`);
  lines.push("");
  lines.push("## Docs Signal");
  lines.push("");
  lines.push(`- Docs Typography alias uses: ${report.docsSignal.typographyAliasUseCount}`);
  lines.push(`- Docs direct ref-voice consumer uses tracked: ${report.docsSignal.directRefVoiceConsumerUses.length}`);
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) {
    for (const gap of report.gaps) lines.push(`- ${gap}`);
  } else {
    lines.push("- No fail-level Typography primitive cascade gaps detected.");
  }
  lines.push("");
  lines.push("## Next Actions");
  lines.push("");
  for (const action of report.nextActions) lines.push(`- ${action}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function stableJson(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

function main() {
  const report = createReport();
  const json = stableJson(report);
  const markdown = toMarkdown(report);
  if (checkMode) {
    const currentJson = readIfExists(jsonOutput);
    const currentMarkdown = readIfExists(markdownOutput);
    if (currentJson !== json || currentMarkdown !== markdown) {
      console.error("Typography primitive cascade audit is stale. Run: node packages/audit/scripts/report-primitive-typography-cascade.js");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Typography primitive cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
  if (report.status !== "pass") {
    console.error(`Typography primitive cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify({
    status: report.status,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
    gaps: report.gaps.length,
    componentTypographyAliasUse: report.componentBridge.aliasUseCount,
    docsTypographyAliasUse: report.docsSignal.typographyAliasUseCount,
    directRefVoiceConsumerUses: report.docsSignal.directRefVoiceConsumerUses.length,
    componentRefVoiceBypasses: report.componentBridge.refVoiceBypassGaps.length,
    foundationGate: Object.fromEntries(Object.entries(report.foundationGate).map(([name, gate]) => [name, gate.status])),
  }, null, 2));
}

main();
