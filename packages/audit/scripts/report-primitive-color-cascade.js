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
const jsonOutput = path.join(outputDir, "primitive-color-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-color-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const colorSpecFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/color.json");
const colorContractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/color.md");
const energyReportFile = path.join(root, "docs/audits/foundation-energy-cascade-audit.json");
const stateReportFile = path.join(root, "docs/audits/foundation-state-cascade-audit.json");
const toneReportFile = path.join(root, "docs/audits/foundation-tone-cascade-audit.json");
const accessibilityReportFile = path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json");
const chartsReportFile = path.join(root, "docs/audits/primitive-charts-cascade-audit.json");
const disabledReportFile = path.join(root, "docs/audits/primitive-disabled-cascade-audit.json");
const focusReportFile = path.join(root, "docs/audits/primitive-focus-cascade-audit.json");
const iconographyReportFile = path.join(root, "docs/audits/primitive-iconography-cascade-audit.json");
const mapsReportFile = path.join(root, "docs/audits/primitive-maps-cascade-audit.json");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const patternDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");

const requiredRoles = ["action", "status", "surface", "border", "text", "data"];
const requiredFoundations = ["Energy", "State", "Tone", "Accessibility"];
const requiredCoordinatedPrimitives = ["Focus", "Disabled", "Iconography", "Charts", "Maps"];
const requiredTokenDependencies = [
  "ref.energy.*",
  "sys.energy.*",
  "sys.state.*",
  "sys.tone.*",
  "sys.accessibility.*",
  "focus.*",
  "disabled.*",
  "icon.*",
  "chart.*",
  "map.*",
  "color.*",
];
const requiredAliases = [
  ["--sys-color-surface", "var(--sys-energy-surface-primary)"],
  ["--sys-color-surface-raised", "var(--sys-energy-surface-secondary)"],
  ["--sys-color-surface-muted", "var(--sys-energy-surface-sunken)"],
  ["--sys-color-text", "var(--sys-energy-text-primary)"],
  ["--sys-color-text-muted", "var(--sys-energy-text-secondary)"],
  ["--sys-color-text-subtle", "var(--sys-energy-text-tertiary)"],
  ["--sys-color-border", "var(--sys-energy-border-default)"],
  ["--sys-color-border-strong", "var(--sys-energy-border-strong)"],
  ["--sys-color-action", "var(--sys-energy-action-primary)"],
  ["--sys-color-action-hover", "var(--sys-energy-action-hover)"],
  ["--sys-color-action-text", "var(--sys-energy-text-on-action)"],
  ["--sys-color-focus", "var(--sys-energy-action-primary)"],
  ["--sys-color-success", "var(--sys-energy-status-success)"],
  ["--sys-color-warning", "var(--sys-energy-status-warning)"],
  ["--sys-color-danger", "var(--sys-energy-status-error)"],
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

function collectTokenDeclarations(css) {
  const map = new Map();
  for (const match of css.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    if (!map.has(match.groups.name)) map.set(match.groups.name, match.groups.value.trim());
  }
  return map;
}

function findDocsOwnedColorAliases(files) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /--sys-color-[a-z0-9-]+(?=\s*:)/g;
    while ((match = pattern.exec(source))) {
      const isThemeOverride = path.basename(file) === "00-foundations-03.css";
      if (isThemeOverride) continue;
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        token: match[0],
        status: "fail",
        reason: "Docs must consume Color primitive aliases from the token package, not redefine them.",
      });
    }
  }
  return findings;
}

function findDirectRefEnergyOutsideTokenPackage(files) {
  const findings = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const pattern = /var\(--ref-energy-[a-z0-9-]+\)/g;
    while ((match = pattern.exec(source))) {
      const isFoundationReferenceGallery = rel(file).includes("03a-reference-core-03.css")
        || rel(file).includes("03a-reference-core-02.css")
        || rel(file).includes("00-foundations-03.css");
      if (isFoundationReferenceGallery) continue;
      findings.push({
        file: rel(file),
        line: lineNumber(source, match.index),
        value: match[0],
        status: "fail",
        reason: "Consumers must not use ref-energy ramps directly; map through Energy or Color aliases.",
      });
    }
  }
  return findings;
}

function createReport() {
  const tokenCss = readIfExists(tokenCssFile);
  const componentCss = readIfExists(componentCssFile);
  const docsCssFiles = docsStyleModuleFiles.filter((file) => !rel(file).includes("generated/"));
  const consumerCssFiles = [componentCssFile, ...docsCssFiles].filter((file) => fs.existsSync(file));
  const tokenDecls = collectTokenDeclarations(tokenCss);
  const colorSpec = readJson(colorSpecFile)?.artifacts?.primitives?.color;
  const contract = readIfExists(colorContractFile);
  const energyReport = readJson(energyReportFile);
  const stateReport = readJson(stateReportFile);
  const toneReport = readJson(toneReportFile);
  const accessibilityReport = readJson(accessibilityReportFile);
  const chartsReport = readJson(chartsReportFile);
  const disabledReport = readJson(disabledReportFile);
  const focusReport = readJson(focusReportFile);
  const iconographyReport = readJson(iconographyReportFile);
  const mapsReport = readJson(mapsReportFile);

  const roleIds = new Set((colorSpec?.roles ?? []).map((role) => role.id));
  const coordinatesPrimitives = Array.isArray(colorSpec?.coordinatesPrimitives) ? colorSpec.coordinatesPrimitives : [];
  const tokenDependencies = Array.isArray(colorSpec?.tokenDependencies) ? colorSpec.tokenDependencies : [];
  const missingRoles = requiredRoles.filter((role) => !roleIds.has(role));
  const governingFoundations = Array.isArray(colorSpec?.governingFoundations) ? colorSpec.governingFoundations : [];
  const missingFoundations = requiredFoundations.filter((foundation) => !governingFoundations.includes(foundation));
  const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter((primitive) => !coordinatesPrimitives.includes(primitive));
  const missingTokenDependencies = requiredTokenDependencies.filter((dependency) => !tokenDependencies.includes(dependency));
  const aliasGaps = requiredAliases
    .filter(([alias, value]) => tokenDecls.get(alias) !== value)
    .map(([alias, expected]) => ({ alias, expected, actual: tokenDecls.get(alias) ?? null }));
  const docsOwnedColorAliases = findDocsOwnedColorAliases(docsCssFiles);
  const directRefEnergyUses = findDirectRefEnergyOutsideTokenPackage(consumerCssFiles);
  const componentColorAliasUse = countMatches(componentCss, /var\(--(?:sys-color|component-[a-z0-9-]*(?:color|surface|border|text|action|danger|warning|success)|comp-[a-z0-9-]+-(?:color|bg|background|border|surface|text|tone|status|danger|warning|success|action))[a-z0-9-]*/g);
  const docsColorAliasUse = docsCssFiles.reduce((total, file) => total + countMatches(readIfExists(file), /var\(--(?:sys-color|component-[a-z0-9-]*(?:color|surface|border|text|action|danger|warning|success)|comp-[a-z0-9-]+-(?:color|bg|background|border|surface|text|tone|status|danger|warning|success|action)|pattern-[a-z0-9-]*(?:color|surface|border|text|action))[a-z0-9-]*/g), 0);
  const componentRefs = collectArtifactRefs(componentDir, /"Color"|Color|primitiveDependencies[\s\S]{0,400}Color|color\.(?:action|status|surface|border|text|data)|sys\.energy/i);
  const patternRefs = collectArtifactRefs(patternDir, /Color|sys\.energy|sys\.state|semantic color|contrast|color-only/i);
  const templateRefs = collectArtifactRefs(templateDir, /Color|sys\.energy|semantic color|contrast|color-only/i);

  const gaps = [];
  if (missingRoles.length) gaps.push(`Color primitive spec is missing roles: ${missingRoles.join(", ")}.`);
  if (missingFoundations.length) gaps.push(`Color primitive is missing governing foundations: ${missingFoundations.join(", ")}.`);
  if (missingCoordinatedPrimitives.length) gaps.push(`Color primitive is missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
  if (missingTokenDependencies.length) gaps.push(`Color primitive is missing token dependencies: ${missingTokenDependencies.join(", ")}.`);
  if (aliasGaps.length) gaps.push("Token package is missing required Color primitive aliases or maps them incorrectly.");
  if (!contract.includes("Generated portable primitive contract for Design System.")) gaps.push("Color Markdown contract is missing or not generated.");
  if (energyReport.status !== "pass") gaps.push("Color cannot pass while the Energy foundation cascade report is not pass.");
  if (stateReport.status !== "pass") gaps.push("Color cannot pass while the State foundation cascade report is not pass.");
  if (toneReport.status !== "pass") gaps.push("Color cannot pass while the Tone foundation cascade report is not pass.");
  if (accessibilityReport.status !== "pass") gaps.push("Color cannot pass while the Accessibility foundation cascade report is not pass.");
  if (chartsReport.status !== "pass") gaps.push("Color cannot pass while the Charts primitive cascade report is not pass.");
  if (disabledReport.status !== "pass") gaps.push("Color cannot pass while the Disabled primitive cascade report is not pass.");
  if (focusReport.status !== "pass") gaps.push("Color cannot pass while the Focus primitive cascade report is not pass.");
  if (iconographyReport.status !== "pass") gaps.push("Color cannot pass while the Iconography primitive cascade report is not pass.");
  if (mapsReport.status !== "pass") gaps.push("Color cannot pass while the Maps primitive cascade report is not pass.");
  if ((energyReport.colorDeclarations?.failures ?? []).length) gaps.push("Energy raw color failures block Color primitive readiness.");
  if (docsOwnedColorAliases.length) gaps.push("Docs redeclare Color primitive aliases instead of consuming package-owned aliases.");
  if (directRefEnergyUses.length) gaps.push("Consumers still use ref-energy ramps directly outside the token/foundation reference layer.");
  if (componentColorAliasUse < 20) gaps.push("Component package does not show enough Color/component alias usage to prove cascade into components.");
  if (componentRefs.count < 10) gaps.push("Component specs do not show enough Color primitive coverage.");

  const status = gaps.length ? "fail" : "pass";
  return {
    schemaVersion: "1.0.0",
    auditedAt: new Date(0).toISOString(),
    primitive: "Color",
    status,
    principle: "Color converts Energy, State, Tone, and Accessibility into implementation-ready semantic aliases so components do not choose raw colors or mutate Flow color foundations for reference parity.",
    specContract: {
      file: rel(colorSpecFile),
      roles: [...roleIds].sort(),
      missingRoles,
      governingFoundations,
      missingFoundations,
      coordinatesPrimitives,
      missingCoordinatedPrimitives,
      foundationInputs: colorSpec?.foundationInputs ?? [],
      tokenDependencies,
      missingTokenDependencies,
    },
    markdownContract: {
      file: rel(colorContractFile),
      generated: contract.includes("Generated portable primitive contract for Design System."),
    },
    tokenAliases: {
      file: rel(tokenCssFile),
      requiredAliases: requiredAliases.map(([alias, expected]) => ({ alias, expected, actual: tokenDecls.get(alias) ?? null })),
      gaps: aliasGaps,
      docsOwnedColorAliases,
    },
    foundationGate: {
      energy: {
        report: rel(energyReportFile),
        status: energyReport.status,
        rawColorFailures: energyReport.colorDeclarations?.failures?.length ?? null,
        colorTraceReviews: energyReport.colorDeclarations?.reviews?.length ?? null,
      },
      state: {
        report: rel(stateReportFile),
        status: stateReport.status,
      },
      tone: {
        report: rel(toneReportFile),
        status: toneReport.status,
      },
      accessibility: {
        report: rel(accessibilityReportFile),
        status: accessibilityReport.status,
      },
    },
    primitiveGate: {
      charts: {
        report: rel(chartsReportFile),
        status: chartsReport.status,
        gaps: chartsReport.gaps ?? [],
      },
      disabled: {
        report: rel(disabledReportFile),
        status: disabledReport.status,
        gaps: disabledReport.gaps ?? [],
      },
      focus: {
        report: rel(focusReportFile),
        status: focusReport.status,
        gaps: focusReport.gaps ?? [],
      },
      iconography: {
        report: rel(iconographyReportFile),
        status: iconographyReport.status,
        gaps: iconographyReport.gaps ?? [],
      },
      maps: {
        report: rel(mapsReportFile),
        status: mapsReport.status,
        gaps: mapsReport.gaps ?? [],
      },
    },
    consumerCss: {
      scannedFiles: consumerCssFiles.map(rel),
      componentColorAliasUse,
      docsColorAliasUse,
      directRefEnergyUses,
    },
    cascadeCoverage: {
      components: componentRefs,
      patterns: patternRefs,
      templates: templateRefs,
    },
    gaps,
    nextActions: [
      "Fix fail-level Color alias, foundation gate, or direct ref-energy consumer gaps before moving to Typography.",
      "Keep ZIP color influence as semantic mapping evidence; do not change Flow Energy tokens for visual mimicry.",
      "When auditing each component 1:1, verify rendered color through Color/Energy aliases and non-color state evidence.",
    ],
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Color Primitive Cascade Audit");
  lines.push("");
  lines.push(`Status: **${report.status}**`);
  lines.push("");
  lines.push(report.principle);
  lines.push("");
  lines.push("## Foundation Gate");
  lines.push("");
  for (const [foundation, gate] of Object.entries(report.foundationGate)) {
    lines.push(`- ${foundation}: ${gate.status}`);
  }
  lines.push(`- Energy raw color failures: ${report.foundationGate.energy.rawColorFailures}`);
  lines.push(`- Energy color trace reviews: ${report.foundationGate.energy.colorTraceReviews}`);
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
  lines.push("## Coverage");
  lines.push("");
  lines.push("| Layer | Count | Evidence |");
  lines.push("| --- | ---: | --- |");
  lines.push(`| Component refs | ${report.cascadeCoverage.components.count} | ${report.cascadeCoverage.components.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.components.count > 18 ? "..." : ""} |`);
  lines.push(`| Pattern refs | ${report.cascadeCoverage.patterns.count} | ${report.cascadeCoverage.patterns.ids.slice(0, 18).join(", ")}${report.cascadeCoverage.patterns.count > 18 ? "..." : ""} |`);
  lines.push(`| Template refs | ${report.cascadeCoverage.templates.count} | ${report.cascadeCoverage.templates.ids.join(", ") || "none"} |`);
  lines.push(`| Component CSS alias uses | ${report.consumerCss.componentColorAliasUse} | packages/components/styles/components.css |`);
  lines.push(`| Docs CSS alias uses | ${report.consumerCss.docsColorAliasUse} | apps/docs/styles |`);
  lines.push("");
  lines.push("## Gaps");
  lines.push("");
  if (report.gaps.length) {
    for (const gap of report.gaps) lines.push(`- ${gap}`);
  } else {
    lines.push("- No fail-level Color primitive cascade gaps detected.");
  }
  lines.push("");
  lines.push("## Direct Ref Energy Uses");
  lines.push("");
  if (report.consumerCss.directRefEnergyUses.length) {
    lines.push("| File | Line | Value |");
    lines.push("| --- | ---: | --- |");
    for (const finding of report.consumerCss.directRefEnergyUses.slice(0, 40)) {
      lines.push(`| ${finding.file} | ${finding.line} | \`${finding.value}\` |`);
    }
  } else {
    lines.push("- No direct ref-energy consumer use outside token/foundation reference layer.");
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
      console.error("Color primitive cascade audit is stale. Run: node packages/audit/scripts/report-primitive-color-cascade.js");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Color primitive cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
  if (report.status !== "pass") {
    console.error(`Color primitive cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify({
    status: report.status,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
    gaps: report.gaps.length,
    componentColorAliasUse: report.consumerCss.componentColorAliasUse,
    docsColorAliasUse: report.consumerCss.docsColorAliasUse,
    directRefEnergyUses: report.consumerCss.directRefEnergyUses.length,
    foundationGate: Object.fromEntries(Object.entries(report.foundationGate).map(([name, gate]) => [name, gate.status])),
  }, null, 2));
}

main();
