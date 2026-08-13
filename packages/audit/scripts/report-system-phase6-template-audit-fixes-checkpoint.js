#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase6-template-audit-fixes-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase6-template-audit-fixes-checkpoint.md");

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
    id: "template-cascade",
    file: "docs/audits/template-cascade-governance-audit.json",
    debtKey: "templateCascadeGovernanceDebt",
    expected: {
      templates: 9,
      templateArtifacts: 9,
      catalogTemplates: 9,
      templateBlueprints: 9,
      templatesWithSurfacePrimitive: 9,
      templatesWithDensityPrimitive: 9,
      templatePatternDependencies: 25,
      uniqueTemplatePatternDependencies: 16,
      reactPatternSources: 25,
      reactPatternTypes: 25,
      reactPatternExports: 25,
      requiredReactTemplateRuntimes: 9,
      templatesWithReactRuntime: 9,
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
  {
    id: "template-composition",
    file: "docs/audits/react-template-composition-governance-audit.json",
    debtKey: "reactTemplateCompositionGovernanceDebt",
    expected: {
      templatesAudited: 9,
      templatesWithPassingComposition: 9,
      formalPatternDependencies: 25,
      runtimePatternImports: 25,
      missingDeclaredPatternImports: 0,
      undeclaredPatternImports: 0,
      formalModuleMarkers: 37,
      approvedSupportModuleMarkers: 6,
      runtimeModuleMarkers: 43,
      missingFormalModuleMarkers: 0,
      undeclaredRuntimeModuleMarkers: 0,
      directComponentImports: 6,
      unapprovedDirectComponentImports: 0,
      surfacePrimitiveImports: 9,
      compositionContractGaps: 0,
      reactTemplateCompositionGovernanceDebt: 0,
    },
  },
  {
    id: "template-interaction",
    file: "docs/audits/react-template-interaction-governance-audit.json",
    debtKey: "reactTemplateInteractionGovernanceDebt",
    expected: {
      templatesAudited: 9,
      sourceFiles: 9,
      typeFiles: 9,
      interactionTestFiles: 1,
      packageTestScriptReferences: 1,
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
    id: "template-runtime",
    file: "docs/audits/react-template-runtime-governance-audit.json",
    debtKey: "reactTemplateRuntimeGovernanceDebt",
    expected: {
      templatesAudited: 9,
      renderCases: 72,
      passingRenderCases: 72,
      sourceFiles: 9,
      typeFiles: 9,
      sourceContractChecks: 128,
      typeContractChecks: 114,
      surfaceRootTemplates: 9,
      templatesWithControlledPrimarySelection: 9,
      templatesWithControlledDrawer: 4,
      templateSlotAssertions: 24,
      templateModuleAssertions: 40,
      childPatternAssertions: 24,
      uniqueChildPatternAssertions: 15,
      childComponentAssertions: 6,
      uniqueChildComponentAssertions: 6,
      docsRuntimeReferences: 0,
      vanillaDomReferences: 0,
      forbiddenDirectComponentImports: 0,
      forbiddenMarkupFindings: 0,
      exportGaps: 0,
      typeContractGaps: 0,
      reactTemplateRuntimeGovernanceDebt: 0,
    },
  },
];

function pascalCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

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

function templateFiles(templateId) {
  const name = pascalCase(templateId);
  return {
    artifact: `packages/specs/specs/unison-system/artifacts/templates/${templateId}.json`,
    ts: `packages/react/src/templates/${name}.ts`,
    js: `packages/react/src/templates/${name}.js`,
    types: `packages/react/src/templates/${name}.d.ts`,
  };
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function rowsByTemplate(report) {
  return Array.isArray(report.rows) ? report.rows : [];
}

function createReport() {
  const cascade = readJson("docs/audits/template-cascade-governance-audit.json");
  const cascadeRows = rowsByTemplate(cascade);
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
    const files = templateFiles(templateId);
    const fileRows = Object.entries(files).map(([kind, file]) => ({ kind, file, exists: exists(file) }));
    const cascadeRow = cascadeRows.find((row) => row.id === templateId);
    const debts = [
      ...fileRows.filter((file) => !file.exists).map((file) => `${file.kind} missing: ${file.file}`),
      ...(!cascadeRow ? [`cascade row missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.sourceExists !== true ? [`runtime source missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.typesExist !== true ? [`runtime types missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.surfaceRoot !== true ? [`surface root missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.dataFlowTemplate !== true ? [`data-flow-template missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.templateIndexExport !== true ? [`template index export missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.packageIndexExport !== true ? [`package index export missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.rootPackageExport !== true ? [`root package export missing: ${templateId}`] : []),
      ...(cascadeRow && cascadeRow.runtime?.reactPackageExport !== true ? [`react package export missing: ${templateId}`] : []),
    ];
    return {
      id: templateId,
      status: debts.length ? "fail" : "pass",
      files: fileRows,
      foundations: cascadeRow?.foundations?.length ?? 0,
      primitives: cascadeRow?.primitives?.length ?? 0,
      patterns: cascadeRow?.patterns?.length ?? 0,
      modules: cascadeRow?.modules?.length ?? 0,
      states: cascadeRow?.states?.length ?? 0,
      surfaces: cascadeRow?.surfaces?.length ?? 0,
      tokenDependencies: cascadeRow?.tokenDependencies?.length ?? 0,
      debts,
    };
  });

  const issues = [
    ...(templateIds.length === 9 ? [] : [`Expected 9 templates, got ${templateIds.length}.`]),
    ...reportRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...reportRows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...reportRows.flatMap((row) => row.mismatches.map((item) => `${item.report}.${item.key}: expected ${item.expected}, got ${item.actual}`)),
    ...templates.flatMap((template) => template.debts.map((debt) => `${template.id}: ${debt}`)),
  ];

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 6 template audit/fixes checkpoint",
    principle: "Template audit/fixes can close only when all 9 templates have formal artifacts, React TS/JS/d.ts runtime surfaces, package exports, Surface roots, data-flow-template markers, declared pattern/module/state/token contracts, controlled interaction contracts, and zero composition/runtime/cascade debt.",
    scope: "Original plan iteration 30: template audit/fixes. Visual/template QA remains for iteration 31.",
    inventory: {
      templates: templates.length,
      passingTemplates: templates.filter((template) => template.status === "pass").length,
      templateFiles: templates.length * 4,
      templateFilesPresent: templates.reduce((total, template) => total + template.files.filter((file) => file.exists).length, 0),
      requiredReports: reportRows.length,
      passingRequiredReports: reportRows.filter((row) => row.status === "pass").length,
      reportDebt: reportRows.reduce((total, row) => total + row.debt, 0),
      reportMismatches: reportRows.reduce((total, row) => total + row.mismatches.length, 0),
      patternDependencies: templates.reduce((total, template) => total + template.patterns, 0),
      modules: templates.reduce((total, template) => total + template.modules, 0),
      states: templates.reduce((total, template) => total + template.states, 0),
      surfaces: templates.reduce((total, template) => total + template.surfaces, 0),
      tokenDependencies: templates.reduce((total, template) => total + template.tokenDependencies, 0),
      templateAuditFixesDebt: issues.length,
    },
    reports: reportRows,
    templates,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 6 Template Audit/Fixes Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Templates: ${report.inventory.passingTemplates}/${report.inventory.templates}`,
    `- Template files: ${report.inventory.templateFilesPresent}/${report.inventory.templateFiles}`,
    `- Required reports: ${report.inventory.passingRequiredReports}/${report.inventory.requiredReports}`,
    `- Pattern dependencies: ${report.inventory.patternDependencies}`,
    `- Modules: ${report.inventory.modules}`,
    `- States: ${report.inventory.states}`,
    `- Surfaces: ${report.inventory.surfaces}`,
    `- Token dependencies: ${report.inventory.tokenDependencies}`,
    `- Template audit/fixes debt: ${report.inventory.templateAuditFixesDebt}`,
    "",
    "## Templates",
    "",
    "| Template | Status | Patterns | Modules | States | Tokens | Debt |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: |",
    ...report.templates.map((template) => `| ${template.id} | ${template.status} | ${template.patterns} | ${template.modules} | ${template.states} | ${template.tokenDependencies} | ${template.debts.length} |`),
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
      console.error("Phase 6 template audit/fixes checkpoint is stale. Run: node packages/audit/scripts/report-system-phase6-template-audit-fixes-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    templates: `${report.inventory.passingTemplates}/${report.inventory.templates}`,
    reports: `${report.inventory.passingRequiredReports}/${report.inventory.requiredReports}`,
    debt: report.inventory.templateAuditFixesDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
