#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-kit-runtime-coverage-audit.json");
const markdownOutput = path.join(outputDir, "zip-kit-runtime-coverage-audit.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function byId(rows, key) {
  return new Map((rows ?? []).map((row) => [row[key], row]));
}

function templateRuntimeRows(report, templateId) {
  return (report.renderRows ?? []).filter((row) => row.template === templateId);
}

function templateVisualRows(report, templateId) {
  return (report.visualRows ?? []).filter((row) => row.template === templateId);
}

function patternIssues(patternId, behaviorMap, compositionMap) {
  const behavior = behaviorMap.get(patternId);
  const composition = compositionMap.get(patternId);
  return [
    ...(behavior ? [] : [`pattern ${patternId} missing behavior audit row.`]),
    ...(composition ? [] : [`pattern ${patternId} missing composition audit row.`]),
    ...(behavior?.hasDataFlowPattern ? [] : [`pattern ${patternId} missing runtime marker.`]),
    ...(behavior?.hasDensityProp ? [] : [`pattern ${patternId} missing density prop.`]),
    ...((behavior?.debts ?? []).map((debt) => `pattern ${patternId} behavior debt: ${debt}.`)),
    ...((behavior?.missingCallbackTests ?? []).map((callback) => `pattern ${patternId} missing callback test ${callback}.`)),
    ...((composition?.slotIssues ?? []).map((issue) => `pattern ${patternId} slot issue: ${issue}.`)),
    ...((composition?.slotRenderEvidenceIssues ?? []).map((issue) => `pattern ${patternId} slot render issue: ${issue}.`)),
    ...((composition?.missingRequiredComponentImports ?? []).map((item) => `pattern ${patternId} missing component import ${item}.`)),
    ...((composition?.undeclaredComponentImports ?? []).map((item) => `pattern ${patternId} undeclared component import ${item}.`)),
    ...((composition?.rawDomVisuals ?? []).map((item) => `pattern ${patternId} raw DOM visual ${item}.`)),
    ...(composition?.hasDataFlowPattern ? [] : [`pattern ${patternId} composition missing runtime marker.`]),
  ];
}

function templateIssues(templateId, runtimeReport, visualReport, compositionMap, interactionMap) {
  const runtimeRows = templateRuntimeRows(runtimeReport, templateId);
  const visualRows = templateVisualRows(visualReport, templateId);
  const composition = compositionMap.get(templateId);
  const interaction = interactionMap.get(templateId);
  return [
    ...(runtimeRows.length ? [] : [`template ${templateId} missing runtime render cases.`]),
    ...(runtimeRows.length >= 8 ? [] : [`template ${templateId} expected at least 8 runtime cases, got ${runtimeRows.length}.`]),
    ...runtimeRows.flatMap((row) => (row.failures ?? []).map((failure) => `template ${templateId} runtime ${row.id}: ${failure}.`)),
    ...(visualRows.length ? [] : [`template ${templateId} missing visual cases.`]),
    ...(visualRows.length >= 3 ? [] : [`template ${templateId} expected at least 3 visual cases, got ${visualRows.length}.`]),
    ...visualRows.flatMap((row) => (row.failures ?? []).map((failure) => `template ${templateId} visual ${row.case}: ${failure}.`)),
    ...(composition ? [] : [`template ${templateId} missing composition audit row.`]),
    ...((composition?.issues ?? []).map((issue) => `template ${templateId} composition issue: ${issue}.`)),
    ...(interaction ? [] : [`template ${templateId} missing interaction audit row.`]),
    ...((interaction?.issues ?? []).map((issue) => `template ${templateId} interaction issue: ${issue}.`)),
  ];
}

function createReport() {
  const parity = readJson("docs/audits/zip-template-parity-audit.json");
  const patternBehavior = readJson("docs/audits/react-pattern-behavior-governance-audit.json");
  const patternComposition = readJson("docs/audits/react-pattern-composition-governance-audit.json");
  const templateRuntime = readJson("docs/audits/react-template-runtime-governance-audit.json");
  const templateVisual = readJson("docs/audits/react-template-visual-governance-audit.json");
  const templateComposition = readJson("docs/audits/react-template-composition-governance-audit.json");
  const templateInteraction = readJson("docs/audits/react-template-interaction-governance-audit.json");
  const emailRenderer = readJson("docs/audits/email-channel-renderer-audit.json");
  const emailGovernance = readJson("docs/audits/email-channel-governance-audit.json");
  const behaviorMap = byId(patternBehavior.patterns, "patternId");
  const patternCompositionMap = byId(patternComposition.patterns, "patternId");
  const templateCompositionMap = byId(templateComposition.templates, "id");
  const templateInteractionMap = byId(templateInteraction.templates, "id");

  const kits = (parity.kits ?? []).map((kit) => {
    const patternIds = (kit.owners?.patterns ?? []).map((owner) => owner.id);
    const templateIds = (kit.owners?.templates ?? []).map((owner) => owner.id);
    const patternRuntimeIssues = patternIds.flatMap((patternId) => patternIssues(patternId, behaviorMap, patternCompositionMap));
    const templateRuntimeIssues = templateIds.flatMap((templateId) => templateIssues(templateId, templateRuntime, templateVisual, templateCompositionMap, templateInteractionMap));
    const emailIssues = kit.classification === "covered-separate-channel"
      ? [
        ...(emailGovernance.status === "pass" ? [] : ["email governance is not passing."]),
        ...(emailRenderer.status === "pass" ? [] : ["email renderer is not passing."]),
        ...(emailRenderer.inventory?.passingRenderCases === emailRenderer.inventory?.renderCases ? [] : ["email renderer does not pass every variant."]),
      ]
      : [];
    const blockedIssues = kit.classification === "blocked-separate-channel"
      ? [
        ...(patternIds.length === 0 && templateIds.length === 0 ? [] : ["blocked separate channel must not claim product runtime owners."]),
      ]
      : [];
    const requiredRuntimeIssues = [
      ...(kit.classification === "covered-by-template" && !templateIds.length ? ["template-covered kit lacks runtime template owner."] : []),
      ...(kit.classification === "covered-by-pattern" && !patternIds.length ? ["pattern-covered kit lacks runtime pattern owner."] : []),
      ...(kit.classification === "covered-separate-channel" && !patternIds.includes("email-template-layout") ? ["email channel kit must use Email Template Layout runtime owner."] : []),
    ];
    const issues = [
      ...requiredRuntimeIssues,
      ...templateRuntimeIssues,
      ...patternRuntimeIssues,
      ...emailIssues,
      ...blockedIssues,
    ];
    return {
      id: kit.id,
      classification: kit.classification,
      patternIds,
      templateIds,
      runtimeTemplateCases: templateIds.reduce((sum, templateId) => sum + templateRuntimeRows(templateRuntime, templateId).length, 0),
      visualTemplateCases: templateIds.reduce((sum, templateId) => sum + templateVisualRows(templateVisual, templateId).length, 0),
      patternRuntimeRows: patternIds.filter((patternId) => behaviorMap.has(patternId)).length,
      patternCompositionRows: patternIds.filter((patternId) => patternCompositionMap.has(patternId)).length,
      emailRenderCases: kit.classification === "covered-separate-channel" ? emailRenderer.inventory?.renderCases ?? 0 : 0,
      issues,
    };
  });
  const issues = kits.flatMap((kit) => kit.issues.map((issue) => `${kit.id}: ${issue}`));
  const inventory = {
    kits: kits.length,
    productTemplateKits: kits.filter((kit) => kit.classification === "covered-by-template").length,
    patternCoveredKits: kits.filter((kit) => kit.classification === "covered-by-pattern").length,
    separateChannelKits: kits.filter((kit) => kit.classification === "covered-separate-channel").length,
    blockedSeparateChannelKits: kits.filter((kit) => kit.classification === "blocked-separate-channel").length,
    templateRuntimeCases: kits.reduce((sum, kit) => sum + kit.runtimeTemplateCases, 0),
    templateVisualCases: kits.reduce((sum, kit) => sum + kit.visualTemplateCases, 0),
    patternRuntimeRows: kits.reduce((sum, kit) => sum + kit.patternRuntimeRows, 0),
    patternCompositionRows: kits.reduce((sum, kit) => sum + kit.patternCompositionRows, 0),
    emailRenderCases: kits.reduce((sum, kit) => sum + kit.emailRenderCases, 0),
    kitsWithRuntimeCoverage: kits.filter((kit) => kit.issues.length === 0).length,
    runtimeCoverageDebt: issues.length,
  };
  return {
    status: issues.length ? "fail" : "pass",
    audit: "zip kit runtime coverage",
    principle: "ZIP kits may only be considered absorbed when their Flow owners are covered by React runtime, visual, composition, interaction, or explicit separate-channel renderer audits.",
    generatedAt: new Date().toISOString(),
    inventory,
    kits,
    issues,
  };
}

function markdown(report) {
  return [
    "# ZIP kit runtime coverage audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Kits",
    "",
    "| Kit | Class | Templates | Patterns | Runtime cases | Visual cases | Pattern rows | Issues |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.kits.map((kit) => `| ${kit.id} | ${kit.classification} | ${kit.templateIds.length} | ${kit.patternIds.length} | ${kit.runtimeTemplateCases} | ${kit.visualTemplateCases} | ${kit.patternRuntimeRows}/${kit.patternCompositionRows} | ${kit.issues.length} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ].join("\n");
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-zip-kit-runtime-coverage.js.`);
  }
}
if (!checkMode) {
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);
}

if (report.status !== "pass") {
  throw new Error(`ZIP kit runtime coverage failed with ${report.issues.length} issue(s).`);
}
