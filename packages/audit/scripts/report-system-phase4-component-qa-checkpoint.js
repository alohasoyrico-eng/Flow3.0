#!/usr/bin/env node

const {
  fs,
  goldComponents,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase4-component-qa-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase4-component-qa-checkpoint.md");
const componentCount = goldComponents.length;

const batchReports = [
  {
    id: "core-controls-forms",
    file: "docs/audits/system-phase4-core-controls-checkpoint.json",
    countKey: "coreControlComponents",
    passKey: "passingCoreControlComponents",
    debtKey: "coreControlsFormsDebt",
    edgeKey: "componentGateEdges",
    passingEdgeKey: "passingComponentGateEdges",
  },
  {
    id: "overlays-navigation-data",
    file: "docs/audits/system-phase4-overlays-navigation-data-checkpoint.json",
    countKey: "overlaysNavigationDataComponents",
    passKey: "passingOverlaysNavigationDataComponents",
    debtKey: "overlaysNavigationDataDebt",
    edgeKey: "componentGateEdges",
    passingEdgeKey: "passingComponentGateEdges",
  },
  {
    id: "domain-complex",
    file: "docs/audits/system-phase4-domain-complex-checkpoint.json",
    countKey: "domainComplexComponents",
    passKey: "passingDomainComplexComponents",
    debtKey: "domainComplexDebt",
    edgeKey: "componentGateEdges",
    passingEdgeKey: "passingComponentGateEdges",
  },
];

const qaReports = [
  {
    id: "react-primary",
    file: "docs/audits/react-primary-coverage-audit.json",
    debtKey: "primaryImplementationDebt",
    expected: {
      expectedComponents: componentCount,
      components: componentCount,
      pass: componentCount,
      fail: 0,
      forwardRef: componentCount,
      realTypes: componentCount,
      platformContract: componentCount,
      densityResolved: componentCount,
      restSanitized: componentCount,
      noDocsDependency: componentCount,
      noDomFactory: componentCount,
      publishedImports: componentCount,
      cssContractCoverage: componentCount,
      sourceIndexExport: componentCount,
      sourceTypesIndexExport: componentCount,
      distIndexExport: componentCount,
      distTypesIndexExport: componentCount,
      reactPrimaryGovernanceIssues: 0,
      primaryImplementationDebt: 0,
    },
  },
  {
    id: "props",
    file: "docs/audits/react-contract-prop-alignment-audit.json",
    debtKey: "propAlignmentDebt",
    expected: {
      components: componentCount,
      pass: componentCount,
      fail: 0,
      extraReactProps: 0,
      missingReactProps: 0,
      requiredMismatches: 0,
      typeValueMismatches: 0,
      unreferencedPublicProps: 0,
      reactGovernancePolicyIssues: 0,
      propAlignmentDebt: 0,
    },
  },
  {
    id: "controlled-uncontrolled",
    file: "docs/audits/react-controlled-governance-audit.json",
    debtKey: "controlledDebt",
    expected: {
      components: componentCount,
      controlledComponents: 31,
      openControlledComponents: 10,
      openSourceCovered: 10,
      openTestCovered: 10,
      controlledPropEdges: 30,
      totalControlledEdges: 40,
      testCoveredEdges: 30,
      totalTestCoveredEdges: 40,
      failures: 0,
      reactGovernancePolicyIssues: 0,
      controlledDebt: 0,
    },
  },
  {
    id: "accessibility-keyboard",
    file: "docs/audits/react-accessibility-governance-audit.json",
    debtKey: "accessibilityDebt",
    expected: {
      components: componentCount,
      criticalComponents: 10,
      criticalPassing: 10,
      totalRoles: 71,
      totalAria: 327,
      keyboardHandlers: 40,
      focusCalls: 15,
      failures: 0,
      interactionFailures: 0,
      reactGovernancePolicyIssues: 0,
      accessibilityDebt: 0,
    },
  },
  {
    id: "interaction",
    file: "docs/audits/react-interaction-coverage-audit.json",
    debtKey: "interactionDebt",
    expected: {
      components: componentCount,
      withCallbacks: 45,
      pass: componentCount,
      review: 0,
      fail: 0,
      missingTestCallbacks: 0,
      missingEventParams: 0,
      manualAccessibilityCritical: 10,
      manualAccessibilityCriticalPass: 10,
      reactGovernancePolicyIssues: 0,
      interactionDebt: 0,
    },
  },
  {
    id: "visual-dark-density-responsive",
    file: "docs/audits/component-visual-cascade-audit.json",
    debtKey: "visualCascadeDebt",
    expected: {
      components: componentCount,
      pass: componentCount,
      review: 0,
      fail: 0,
      visualCascadeDebt: 0,
    },
  },
  {
    id: "css-contract",
    file: "docs/audits/component-css-contract-coverage.json",
    debtKey: "cssContractDebt",
    expected: {
      total: componentCount,
      cssContractDebt: 0,
      direct: 57,
      family: 5,
      missing: 0,
      directRootGaps: 0,
      familyRootGaps: 0,
      familyUnexpectedRoots: 0,
      componentCssGovernanceIssues: 0,
    },
  },
  {
    id: "style",
    file: "docs/audits/react-style-governance-audit.json",
    debtKey: "styleEscapeDebt",
    expected: {
      components: componentCount,
      styleEscapeDebt: 0,
      componentsWithApprovedInlineVars: 6,
      componentsWithRuntimeVars: 1,
      approvedInlineVars: 12,
      styleProps: 10,
      setPropertyCalls: 2,
      violations: 0,
      reactGovernancePolicyIssues: 0,
    },
  },
  {
    id: "defaults",
    file: "docs/audits/react-default-governance-audit.json",
    debtKey: "defaultDebt",
    expected: {
      components: componentCount,
      defaultDebt: 0,
      prohibitedDefaults: 0,
      semanticDefaultDecisions: 119,
      contractBackedSemanticDefaultDecisions: 119,
      unbackedSemanticDefaultDecisions: 0,
      semanticDefaultDecisionContractGaps: 0,
      reactGovernancePolicyIssues: 0,
    },
  },
  {
    id: "composition",
    file: "docs/audits/react-composition-governance-audit.json",
    debtKey: "compositionDebt",
    expected: {
      components: componentCount,
      compositionDebt: 0,
      compositionalComponents: 29,
      compositionEdges: 53,
      allowedEntries: 29,
      unexpectedImports: 0,
      missingImports: 0,
      missingReasons: 0,
      duplicateAllowed: 0,
      unknownAllowed: 0,
      unknownContractOwners: 0,
    },
  },
  {
    id: "class-ownership",
    file: "docs/audits/react-class-ownership-audit.json",
    debtKey: "classOwnershipDebt",
    expected: {
      components: componentCount,
      violations: 0,
      classOwnershipDebt: 0,
    },
  },
  {
    id: "typescript-public-surface",
    file: "docs/audits/system-typescript-public-surface.json",
    debtKey: "uniqueTypescriptPublicSurfaceDebt",
    expected: {
      uniqueTypescriptPublicSurfaceDebt: 0,
      typescriptPublicSurfaceDebt: 0,
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

function statusOf(report) {
  return String(report?.status ?? "").toLowerCase();
}

function inventoryOf(report) {
  return report.inventory ?? report.summary ?? report;
}

function componentRows(report) {
  return Array.isArray(report.components) ? report.components : [];
}

function inventoryMismatches(report, expected, reportId) {
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

function createReport() {
  const expectedComponentIds = [...goldComponents].sort();
  const batchRows = batchReports.map((definition) => {
    const report = readJson(definition.file);
    const inventory = inventoryOf(report);
    const componentIds = componentRows(report).map((component) => component.id).filter(Boolean).sort();
    return {
      id: definition.id,
      file: definition.file,
      status: statusOf(report) || "missing",
      componentIds,
      components: Number(inventory[definition.countKey] ?? 0),
      passingComponents: Number(inventory[definition.passKey] ?? 0),
      componentGateEdges: Number(inventory[definition.edgeKey] ?? 0),
      passingComponentGateEdges: Number(inventory[definition.passingEdgeKey] ?? 0),
      debt: Number(inventory[definition.debtKey] ?? 0),
    };
  });

  const qaRows = qaReports.map((definition) => {
    const report = readJson(definition.file);
    const mismatches = inventoryMismatches(report, definition.expected, definition.id);
    return {
      id: definition.id,
      file: definition.file,
      status: statusOf(report) || "missing",
      debt: Number(inventoryOf(report)[definition.debtKey] ?? 0),
      mismatches,
    };
  });

  const batchComponentIds = batchRows.flatMap((row) => row.componentIds);
  const uniqueBatchComponentIds = [...new Set(batchComponentIds)].sort();
  const duplicateBatchComponentIds = uniqueBatchComponentIds.filter((id) => (
    batchComponentIds.filter((componentId) => componentId === id).length > 1
  ));
  const missingBatchComponentIds = expectedComponentIds.filter((id) => !uniqueBatchComponentIds.includes(id));
  const unexpectedBatchComponentIds = uniqueBatchComponentIds.filter((id) => !expectedComponentIds.includes(id));

  const issues = [
    ...(expectedComponentIds.length === componentCount ? [] : [`Expected component catalog to expose ${componentCount} components, got ${expectedComponentIds.length}.`]),
    ...batchRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...batchRows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...batchRows.filter((row) => row.components !== row.passingComponents).map((row) => `${row.id} has ${row.passingComponents}/${row.components} passing components.`),
    ...batchRows.filter((row) => row.componentGateEdges !== row.passingComponentGateEdges).map((row) => `${row.id} has ${row.passingComponentGateEdges}/${row.componentGateEdges} passing component gate edges.`),
    ...qaRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...qaRows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...qaRows.flatMap((row) => row.mismatches.map((item) => `${item.report}.${item.key}: expected ${item.expected}, got ${item.actual}`)),
    ...duplicateBatchComponentIds.map((id) => `Component appears in more than one Phase 4 batch: ${id}`),
    ...missingBatchComponentIds.map((id) => `Component missing from Phase 4 batch coverage: ${id}`),
    ...unexpectedBatchComponentIds.map((id) => `Unexpected component in Phase 4 batch coverage: ${id}`),
  ];

  const inventory = {
    expectedComponents: expectedComponentIds.length,
    phase4BatchReports: batchRows.length,
    passingPhase4BatchReports: batchRows.filter((row) => row.status === "pass").length,
    phase4BatchComponents: batchRows.reduce((sum, row) => sum + row.components, 0),
    passingPhase4BatchComponents: batchRows.reduce((sum, row) => sum + row.passingComponents, 0),
    uniquePhase4BatchComponents: uniqueBatchComponentIds.length,
    duplicatePhase4BatchComponents: duplicateBatchComponentIds.length,
    missingPhase4BatchComponents: missingBatchComponentIds.length,
    unexpectedPhase4BatchComponents: unexpectedBatchComponentIds.length,
    phase4ComponentGateEdges: batchRows.reduce((sum, row) => sum + row.componentGateEdges, 0),
    passingPhase4ComponentGateEdges: batchRows.reduce((sum, row) => sum + row.passingComponentGateEdges, 0),
    componentQaReports: qaRows.length,
    passingComponentQaReports: qaRows.filter((row) => row.status === "pass").length,
    componentQaInventoryMismatches: qaRows.reduce((sum, row) => sum + row.mismatches.length, 0),
    componentQaDebt: issues.length,
  };

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 4 component QA checkpoint",
    principle: `Phase 4 can close only when all ${componentCount} components are covered exactly once by the three Phase 4 batches and the QA gates for TypeScript, visual/dark/density/responsive cascade, accessibility/keyboard, interaction, props, controlled state, CSS contracts, style, defaults, composition, and class ownership have zero debt.`,
    scope: "Original plan iteration 24: component QA.",
    inventory,
    batchRows,
    qaRows,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 4 Component QA Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Expected components: ${report.inventory.expectedComponents}`,
    `- Phase 4 batch reports: ${report.inventory.passingPhase4BatchReports}/${report.inventory.phase4BatchReports}`,
    `- Phase 4 batch components: ${report.inventory.passingPhase4BatchComponents}/${report.inventory.phase4BatchComponents}`,
    `- Unique Phase 4 batch components: ${report.inventory.uniquePhase4BatchComponents}/${report.inventory.expectedComponents}`,
    `- Duplicate Phase 4 batch components: ${report.inventory.duplicatePhase4BatchComponents}`,
    `- Missing Phase 4 batch components: ${report.inventory.missingPhase4BatchComponents}`,
    `- Unexpected Phase 4 batch components: ${report.inventory.unexpectedPhase4BatchComponents}`,
    `- Phase 4 component gate edges: ${report.inventory.passingPhase4ComponentGateEdges}/${report.inventory.phase4ComponentGateEdges}`,
    `- Component QA reports: ${report.inventory.passingComponentQaReports}/${report.inventory.componentQaReports}`,
    `- Component QA inventory mismatches: ${report.inventory.componentQaInventoryMismatches}`,
    `- Component QA debt: ${report.inventory.componentQaDebt}`,
    "",
    "## Batches",
    "",
    "| Batch | Status | Components | Edges | Debt |",
    "| --- | --- | ---: | ---: | ---: |",
    ...report.batchRows.map((row) => `| ${row.id} | ${row.status} | ${row.passingComponents}/${row.components} | ${row.passingComponentGateEdges}/${row.componentGateEdges} | ${row.debt} |`),
    "",
    "## QA Gates",
    "",
    "| Gate | Status | Debt | Mismatches |",
    "| --- | --- | ---: | ---: |",
    ...report.qaRows.map((row) => `| ${row.id} | ${row.status} | ${row.debt} | ${row.mismatches.length} |`),
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
      console.error("Phase 4 component QA checkpoint is stale. Run: node packages/audit/scripts/report-system-phase4-component-qa-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    batchComponents: `${report.inventory.passingPhase4BatchComponents}/${report.inventory.phase4BatchComponents}`,
    uniqueBatchComponents: `${report.inventory.uniquePhase4BatchComponents}/${report.inventory.expectedComponents}`,
    gateEdges: `${report.inventory.passingPhase4ComponentGateEdges}/${report.inventory.phase4ComponentGateEdges}`,
    qaReports: `${report.inventory.passingComponentQaReports}/${report.inventory.componentQaReports}`,
    debt: report.inventory.componentQaDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
