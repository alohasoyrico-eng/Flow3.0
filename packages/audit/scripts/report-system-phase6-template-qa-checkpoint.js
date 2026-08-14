#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase6-template-qa-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase6-template-qa-checkpoint.md");

const templateIds = [
  "agent-workspace",
  "configuration-console",
  "driver-card-wallet",
  "driver-mobile-app",
  "fleet-dashboard-suite",
  "fleet-manager-desktop",
  "internal-operations-console",
  "routes-and-stations",
  "settings-workspace",
];

const requiredReports = [
  {
    id: "template-runtime",
    file: "docs/audits/react-template-runtime-governance-audit.json",
    debtKey: "reactTemplateRuntimeGovernanceDebt",
    expected: {
      templatesAudited: 9,
      renderCases: 72,
      passingRenderCases: 72,
      densityCases: 3,
      stateCases: 7,
      docsRuntimeReferences: 0,
      vanillaDomReferences: 0,
      forbiddenDirectComponentImports: 0,
      forbiddenMarkupFindings: 0,
      exportGaps: 0,
      typeContractGaps: 0,
      reactTemplateRuntimeGovernanceDebt: 0,
    },
  },
  {
    id: "template-visual",
    file: "docs/audits/react-template-visual-governance-audit.json",
    debtKey: "reactTemplateVisualGovernanceDebt",
    expected: {
      templatesAudited: 9,
      visualCases: 27,
      passingVisualCases: 27,
      screenshotsCaptured: 27,
      viewportProfiles: 2,
      densityCases: 3,
      stateCases: 3,
      horizontalOverflowFindings: 0,
      blankOrShallowRenderFindings: 0,
      zeroSizeFindings: 0,
      slotOverlapFindings: 0,
      missingSlotOrModuleFindings: 0,
      reactTemplateVisualGovernanceDebt: 0,
    },
  },
  {
    id: "template-interaction",
    file: "docs/audits/react-template-interaction-governance-audit.json",
    debtKey: "reactTemplateInteractionGovernanceDebt",
    expected: {
      templatesAudited: 9,
      templatesWithPassingInteractionContracts: 9,
      uncontrolledSelectionCases: 9,
      controlledSelectionCases: 9,
      drawerCloseCases: 4,
      templatesWithSelectionState: 9,
      templatesWithSelectionCallbacks: 9,
      templatesWithControlledSelectionGuard: 9,
      templatesWithDrawerCallbacks: 4,
      templatesWithControlledDrawerGuard: 4,
      testSelectorAssertions: 9,
      testMutationGuards: 9,
      docsRuntimeReferences: 0,
      vanillaDomReferences: 0,
      interactionContractGaps: 0,
      reactTemplateInteractionGovernanceDebt: 0,
    },
  },
  {
    id: "template-composition",
    file: "docs/audits/react-template-composition-governance-audit.json",
    debtKey: "reactTemplateCompositionGovernanceDebt",
    expected: {
      templatesAudited: 17,
      templatesWithPassingComposition: 17,
      formalPatternDependencies: 60,
      runtimePatternImports: 60,
      missingDeclaredPatternImports: 0,
      undeclaredPatternImports: 0,
      formalModuleMarkers: 37,
      runtimeModuleMarkers: 43,
      missingFormalModuleMarkers: 0,
      undeclaredRuntimeModuleMarkers: 0,
      unapprovedDirectComponentImports: 0,
      surfacePrimitiveImports: 17,
      compositionContractGaps: 0,
      reactTemplateCompositionGovernanceDebt: 0,
    },
  },
  {
    id: "template-cascade",
    file: "docs/audits/template-cascade-governance-audit.json",
    debtKey: "templateCascadeGovernanceDebt",
    expected: {
      templates: 17,
      templatesWithSurfacePrimitive: 17,
      templatesWithDensityPrimitive: 17,
      templatePatternDependencies: 60,
      requiredReactTemplateRuntimes: 9,
      templatesWithReactRuntime: 17,
      templateReactRuntimeBacklog: 0,
      missingRequiredReactTemplateRuntimes: 0,
      missingRequiredTemplateSurfaceRoots: 0,
      missingRequiredTemplateExports: 0,
      requiredTemplateControlledStateGaps: 0,
      templateDocsRuntimeReferences: 0,
      templateVanillaDomReferences: 0,
      missingRequiredSections: 0,
      missingFoundationTokens: 0,
      missingPrimitiveTokens: 0,
      templateCascadeGovernanceDebt: 0,
    },
  },
];

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return fallback;
  }
}

function inventoryOf(report) {
  return report.inventory ?? report.summary ?? report;
}

function statusOf(report) {
  return String(report?.status ?? "").toLowerCase();
}

function mismatchesFor(report, expected, reportId) {
  const inventory = inventoryOf(report);
  return Object.entries(expected)
    .filter(([key, expectedValue]) => inventory[key] !== expectedValue)
    .map(([key, expectedValue]) => ({
      report: reportId,
      key,
      expected: expectedValue,
      actual: inventory[key],
    }));
}

function countBy(rows, key) {
  return rows.reduce((counts, row) => {
    const value = row[key];
    if (!value) return counts;
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function uniqueValues(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))].sort();
}

function createReport() {
  const runtime = readJson("docs/audits/react-template-runtime-governance-audit.json");
  const visual = readJson("docs/audits/react-template-visual-governance-audit.json");
  const interaction = readJson("docs/audits/react-template-interaction-governance-audit.json");

  const runtimeRows = Array.isArray(runtime.renderRows) ? runtime.renderRows : [];
  const visualRows = Array.isArray(visual.visualRows) ? visual.visualRows : [];
  const interactionRows = Array.isArray(interaction.templates) ? interaction.templates : [];
  const runtimeByTemplate = countBy(runtimeRows, "template");
  const visualByTemplate = countBy(visualRows, "template");
  const interactionByTemplate = Object.fromEntries(interactionRows.map((row) => [row.id, row]));

  const reportRows = requiredReports.map((definition) => {
    const report = readJson(definition.file);
    const mismatches = mismatchesFor(report, definition.expected, definition.id);
    return {
      id: definition.id,
      file: definition.file,
      status: statusOf(report) || "missing",
      debt: Number(inventoryOf(report)[definition.debtKey] ?? 0),
      mismatches,
    };
  });

  const templates = templateIds.map((templateId) => {
    const runtimeCases = runtimeRows.filter((row) => row.template === templateId);
    const visualCases = visualRows.filter((row) => row.template === templateId);
    const interactionContract = interactionByTemplate[templateId];
    const failures = [
      ...(runtimeByTemplate[templateId] === 8 ? [] : [`expected 8 runtime cases, got ${runtimeByTemplate[templateId] ?? 0}`]),
      ...(runtimeCases.every((row) => row.status === "pass" && row.failures.length === 0) ? [] : ["runtime failures present"]),
      ...(visualByTemplate[templateId] === 3 ? [] : [`expected 3 visual cases, got ${visualByTemplate[templateId] ?? 0}`]),
      ...(visualCases.every((row) => row.status === "pass" && row.screenshotCaptured === true && row.failures.length === 0) ? [] : ["visual failures present"]),
      ...(interactionContract?.sourceContract === "pass" && interactionContract.issues.length === 0 ? [] : ["interaction contract is not pass"]),
    ];
    return {
      id: templateId,
      status: failures.length ? "fail" : "pass",
      runtimeCases: runtimeByTemplate[templateId] ?? 0,
      visualCases: visualByTemplate[templateId] ?? 0,
      interactionContract: interactionContract?.sourceContract ?? "missing",
      states: uniqueValues([...runtimeCases, ...visualCases], "state"),
      densities: uniqueValues([...runtimeCases, ...visualCases], "density"),
      viewports: uniqueValues(visualCases, "viewport"),
      screenshotsCaptured: visualCases.filter((row) => row.screenshotCaptured === true).length,
      failures,
    };
  });

  const issues = [
    ...reportRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...reportRows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...reportRows.flatMap((row) => row.mismatches.map((item) => `${item.report}.${item.key}: expected ${item.expected}, got ${item.actual}`)),
    ...templates.flatMap((template) => template.failures.map((failure) => `${template.id}: ${failure}`)),
  ];

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 6 template QA checkpoint",
    principle: "Template QA can close Phase 6 only when all 9 templates pass real runtime, visual, responsive, density, state, interaction, composition, and cascade gates with screenshots and zero governed debt.",
    scope: "Original plan iteration 31: template QA and Phase 6 closure. FlowDocs remains blocked until this checkpoint is pass.",
    inventory: {
      templates: templates.length,
      passingTemplates: templates.filter((template) => template.status === "pass").length,
      runtimeCases: runtimeRows.length,
      passingRuntimeCases: runtimeRows.filter((row) => row.status === "pass").length,
      visualCases: visualRows.length,
      passingVisualCases: visualRows.filter((row) => row.status === "pass").length,
      screenshotsCaptured: visualRows.filter((row) => row.screenshotCaptured === true).length,
      viewportProfiles: inventoryOf(visual).viewportProfiles ?? 0,
      densityCases: Math.max(inventoryOf(runtime).densityCases ?? 0, inventoryOf(visual).densityCases ?? 0),
      stateCases: Math.max(inventoryOf(runtime).stateCases ?? 0, inventoryOf(visual).stateCases ?? 0),
      interactionContracts: interactionRows.length,
      passingInteractionContracts: interactionRows.filter((row) => row.sourceContract === "pass" && row.issues.length === 0).length,
      requiredReports: reportRows.length,
      passingRequiredReports: reportRows.filter((row) => row.status === "pass").length,
      reportDebt: reportRows.reduce((total, row) => total + row.debt, 0),
      reportMismatches: reportRows.reduce((total, row) => total + row.mismatches.length, 0),
      horizontalOverflowFindings: inventoryOf(visual).horizontalOverflowFindings ?? 0,
      blankOrShallowRenderFindings: inventoryOf(visual).blankOrShallowRenderFindings ?? 0,
      zeroSizeFindings: inventoryOf(visual).zeroSizeFindings ?? 0,
      slotOverlapFindings: inventoryOf(visual).slotOverlapFindings ?? 0,
      templateQaDebt: issues.length,
    },
    reports: reportRows,
    templates,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 6 Template QA Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Templates: ${report.inventory.passingTemplates}/${report.inventory.templates}`,
    `- Runtime cases: ${report.inventory.passingRuntimeCases}/${report.inventory.runtimeCases}`,
    `- Visual cases: ${report.inventory.passingVisualCases}/${report.inventory.visualCases}`,
    `- Screenshots captured: ${report.inventory.screenshotsCaptured}`,
    `- Viewport profiles: ${report.inventory.viewportProfiles}`,
    `- Density cases: ${report.inventory.densityCases}`,
    `- State cases: ${report.inventory.stateCases}`,
    `- Interaction contracts: ${report.inventory.passingInteractionContracts}/${report.inventory.interactionContracts}`,
    `- Required reports: ${report.inventory.passingRequiredReports}/${report.inventory.requiredReports}`,
    `- Template QA debt: ${report.inventory.templateQaDebt}`,
    "",
    "## Templates",
    "",
    "| Template | Status | Runtime | Visual | Screenshots | Interaction | States | Densities | Viewports | Debt |",
    "| --- | --- | ---: | ---: | ---: | --- | --- | --- | --- | ---: |",
    ...report.templates.map((template) => `| ${template.id} | ${template.status} | ${template.runtimeCases} | ${template.visualCases} | ${template.screenshotsCaptured} | ${template.interactionContract} | ${template.states.join(", ")} | ${template.densities.join(", ")} | ${template.viewports.join(", ")} | ${template.failures.length} |`),
    "",
    "## Reports",
    "",
    "| Report | Status | Debt | Mismatches |",
    "| --- | --- | ---: | ---: |",
    ...report.reports.map((row) => `| ${row.id} | ${row.status} | ${row.debt} | ${row.mismatches.length} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Phase 6 template QA checkpoint is stale. Run: node packages/audit/scripts/report-system-phase6-template-qa-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    templates: `${report.inventory.passingTemplates}/${report.inventory.templates}`,
    runtimeCases: `${report.inventory.passingRuntimeCases}/${report.inventory.runtimeCases}`,
    visualCases: `${report.inventory.passingVisualCases}/${report.inventory.visualCases}`,
    debt: report.inventory.templateQaDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
