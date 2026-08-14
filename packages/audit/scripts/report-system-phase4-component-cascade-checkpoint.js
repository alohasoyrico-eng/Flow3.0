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
const jsonOutput = path.join(outputDir, "system-phase4-component-cascade-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase4-component-cascade-checkpoint.md");
const componentCount = goldComponents.length;

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

function idsFromRows(rows = [], key = "id") {
  return rows.map((row) => row[key]).filter(Boolean).sort();
}

function missingFrom(expected, actual) {
  const actualSet = new Set(actual);
  return expected.filter((id) => !actualSet.has(id));
}

function rowsById(rows = [], key = "id") {
  return new Map(rows.map((row) => [row[key], row]));
}

const requiredReports = [
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
    id: "prop-alignment",
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
    id: "controlled",
    file: "docs/audits/react-controlled-governance-audit.json",
    debtKey: "controlledDebt",
    expected: {
      components: componentCount,
      failures: 0,
      reactGovernancePolicyIssues: 0,
      controlledDebt: 0,
    },
  },
  {
    id: "accessibility",
    file: "docs/audits/react-accessibility-governance-audit.json",
    debtKey: "accessibilityDebt",
    expected: {
      components: componentCount,
      criticalComponents: 10,
      criticalPassing: 10,
      failures: 0,
      interactionFailures: 0,
      reactGovernancePolicyIssues: 0,
      accessibilityDebt: 0,
    },
  },
  {
    id: "style",
    file: "docs/audits/react-style-governance-audit.json",
    debtKey: "styleEscapeDebt",
    expected: {
      components: componentCount,
      styleEscapeDebt: 0,
      violations: 0,
      reactGovernancePolicyIssues: 0,
    },
  },
  {
    id: "interaction",
    file: "docs/audits/react-interaction-coverage-audit.json",
    debtKey: "interactionDebt",
    expected: {
      components: componentCount,
      pass: componentCount,
      review: 0,
      fail: 0,
      missingTestCallbacks: 0,
      missingEventParams: 0,
      reactGovernancePolicyIssues: 0,
      interactionDebt: 0,
    },
  },
  {
    id: "visual-cascade",
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
      missing: 0,
      directRootGaps: 0,
      familyRootGaps: 0,
      familyUnexpectedRoots: 0,
      componentCssGovernanceIssues: 0,
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
];

function inventoryMismatches(report, expected, reportId) {
  const inventory = report.inventory ?? report.summary ?? {};
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
  const reportRows = requiredReports.map((definition) => {
    const report = readJson(definition.file);
    const mismatches = inventoryMismatches(report, definition.expected, definition.id);
    return {
      ...definition,
      report,
      status: statusOf(report) || "missing",
      mismatches,
      debt: Number(report.inventory?.[definition.debtKey] ?? report.summary?.[definition.debtKey] ?? 0),
    };
  });

  const primary = reportRows.find((row) => row.id === "react-primary")?.report ?? {};
  const primaryComponentIds = idsFromRows(primary.components, "id");
  const primaryById = rowsById(primary.components, "id");
  const matrix = readJson("docs/audits/component-1to1-quality-matrix.json");
  const matrixComponentIds = idsFromRows(matrix.components, "id");
  const legacyMatrixMissingComponents = missingFrom(expectedComponentIds, matrixComponentIds);
  const legacyMatrixMissingCoveredByCurrentGates = legacyMatrixMissingComponents.filter((id) => (
    primaryById.get(id)?.status === "pass"
  ));

  const issues = [
    ...(expectedComponentIds.length === componentCount ? [] : [`Expected component catalog to expose ${componentCount} components, got ${expectedComponentIds.length}.`]),
    ...reportRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...reportRows.flatMap((row) => row.mismatches.map((item) => `${item.report}.${item.key}: expected ${item.expected}, got ${item.actual}`)),
    ...missingFrom(expectedComponentIds, primaryComponentIds).map((id) => `React primary coverage is missing component: ${id}`),
    ...missingFrom(primaryComponentIds, expectedComponentIds).map((id) => `React primary coverage has unexpected component: ${id}`),
    ...(legacyMatrixMissingCoveredByCurrentGates.length === legacyMatrixMissingComponents.length
      ? []
      : legacyMatrixMissingComponents
        .filter((id) => !legacyMatrixMissingCoveredByCurrentGates.includes(id))
        .map((id) => `Legacy matrix missing component is not covered by current gates: ${id}`)),
  ];

  const inventory = {
    expectedComponents: expectedComponentIds.length,
    currentComponentGateReports: reportRows.length,
    passingCurrentComponentGateReports: reportRows.filter((row) => row.status === "pass").length,
    currentGateInventoryMismatches: reportRows.reduce((sum, row) => sum + row.mismatches.length, 0),
    reactPrimaryComponents: primaryComponentIds.length,
    reactPrimaryPass: primary.components?.filter((component) => component.status === "pass").length ?? 0,
    legacyMatrixComponents: matrixComponentIds.length,
    legacyMatrixPass: matrix.components?.filter((component) => component.status === "pass").length ?? 0,
    legacyMatrixMissingComponents: legacyMatrixMissingComponents.length,
    legacyMatrixMissingCoveredByCurrentGates: legacyMatrixMissingCoveredByCurrentGates.length,
    componentCascadeAuditDebt: issues.length,
  };

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 4 component cascade checkpoint",
    principle: `Component cascade work can proceed only when the current ${componentCount}-component React, contract, state, accessibility, style, interaction, visual, and CSS gates agree. Legacy 1:1 matrices may remain as historical evidence only when their gaps are explicitly covered by current gates.`,
    scope: "Original plan iteration 20: component cascade audit 1:1.",
    inventory,
    expectedComponentIds,
    currentGateReports: reportRows.map((row) => ({
      id: row.id,
      file: row.file,
      status: row.status,
      debtKey: row.debtKey,
      debt: row.debt,
      mismatches: row.mismatches,
    })),
    legacyMatrix: {
      file: "docs/audits/component-1to1-quality-matrix.json",
      status: statusOf(matrix) || "missing",
      components: matrixComponentIds.length,
      missingComponents: legacyMatrixMissingComponents,
      missingComponentsCoveredByCurrentGates: legacyMatrixMissingCoveredByCurrentGates,
    },
    issues,
  };
}

function toMarkdown(report) {
  const gateRows = report.currentGateReports.map((row) => (
    `| ${row.id} | ${row.status} | ${row.debtKey} | ${row.debt} | ${row.mismatches.length} |`
  ));
  return [
    "# Phase 4 Component Cascade Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Expected components: ${report.inventory.expectedComponents}`,
    `- Current gate reports: ${report.inventory.passingCurrentComponentGateReports}/${report.inventory.currentComponentGateReports}`,
    `- Current gate inventory mismatches: ${report.inventory.currentGateInventoryMismatches}`,
    `- React primary components: ${report.inventory.reactPrimaryComponents}`,
    `- React primary pass: ${report.inventory.reactPrimaryPass}`,
    `- Legacy matrix components: ${report.inventory.legacyMatrixComponents}`,
    `- Legacy matrix pass: ${report.inventory.legacyMatrixPass}`,
    `- Legacy matrix missing components: ${report.inventory.legacyMatrixMissingComponents}`,
    `- Legacy matrix missing covered by current gates: ${report.inventory.legacyMatrixMissingCoveredByCurrentGates}`,
    `- Component cascade audit debt: ${report.inventory.componentCascadeAuditDebt}`,
    "",
    "## Current Gates",
    "",
    "| Gate | Status | Debt key | Debt | Inventory mismatches |",
    "| --- | --- | --- | ---: | ---: |",
    ...gateRows,
    "",
    "## Legacy Matrix Gap",
    "",
    `- File: ${report.legacyMatrix.file}`,
    `- Components: ${report.legacyMatrix.components}`,
    `- Missing components: ${report.legacyMatrix.missingComponents.join(", ") || "None"}`,
    `- Missing components covered by current gates: ${report.legacyMatrix.missingComponentsCoveredByCurrentGates.join(", ") || "None"}`,
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
      console.error("Phase 4 component cascade checkpoint is stale. Run: node packages/audit/scripts/report-system-phase4-component-cascade-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    expectedComponents: report.inventory.expectedComponents,
    currentGates: `${report.inventory.passingCurrentComponentGateReports}/${report.inventory.currentComponentGateReports}`,
    legacyMatrixMissingComponents: report.legacyMatrix.missingComponents,
    debt: report.inventory.componentCascadeAuditDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
