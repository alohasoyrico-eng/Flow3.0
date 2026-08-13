#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase5-pattern-1to1-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase5-pattern-1to1-checkpoint.md");

const patternAuditReports = [
  {
    id: "pattern-architecture",
    file: "docs/audits/pattern-1to1-architecture-audit.json",
    debtKey: "patternArchitectureDebt",
    expected: {
      patterns: 63,
      formalArtifacts: 63,
      markdownContracts: 63,
      catalogEntries: 63,
      patternsWithDeclaredPrimitives: 63,
      patternsWithOnlyInferredPrimitives: 0,
      patternsWithUnknownComponents: 0,
      patternsWithComponentArtifactGaps: 0,
      templatePatternDependencyGaps: 0,
      templateModuleDependencyMismatches: 0,
      unknownDocsEvidenceFiles: 0,
      formalArtifactBacklog: 0,
      primitiveDeclarationBacklog: 0,
      patternArchitectureBacklog: 0,
      patternArchitectureDebt: 0,
      patternArchitectureBlockingDebt: 0,
    },
  },
  {
    id: "foundation-primitive-1to1",
    file: "docs/audits/pattern-foundation-primitive-1to1-audit.json",
    debtKey: "foundationPrimitiveBlockingDebt",
    expected: {
      formalPatternArtifacts: 63,
      primitiveArtifacts: 24,
      foundationArtifacts: 11,
      componentArtifacts: 60,
      implementedReactPatterns: 63,
      patternsWithExplicitFoundations: 63,
      patternsMissingExplicitFoundations: 0,
      patternsWithMissingPrimitiveRefs: 0,
      patternsWithMissingInferredPrimitiveArtifacts: 0,
      formalDependencyLayerErrors: 0,
      patternsWithUndeclaredComponentPrimitives: 0,
      patternsWithStructuralSurfaceDebt: 0,
      implementedReactPatternsWithArchitectureDebt: 0,
      patternsWithTaxonomyWarnings: 0,
      unclassifiedPrimitiveArtifactsUnusedByPatterns: 0,
      primitiveArtifactsUnreferencedBySystem: 0,
      primitiveArtifactsMissingGoverningFoundations: 0,
      unusedPrimitiveArtifactsRequiringPattern: 0,
      foundationArtifactsUnusedByPatterns: 0,
      readyPatterns: 63,
      blockedPatterns: 0,
      foundationPrimitiveBlockingDebt: 0,
    },
  },
  {
    id: "pattern-readiness",
    file: "docs/audits/pattern-readiness-audit.json",
    debtKey: "patternReadinessDebt",
    expected: {
      catalogPatterns: 63,
      uniqueCatalogPatterns: 63,
      copyPatterns: 63,
      markdownContracts: 63,
      requiredPatternContracts: 23,
      requiredContractsPresent: 23,
      requiredCopyPresent: 23,
      formalArtifacts: 63,
      duplicateCatalogIds: 0,
      requiredContractGaps: 0,
      requiredCopyGaps: 0,
      staleMarkdownContracts: 0,
      formalArtifactBacklog: 0,
      catalogOnlyPatterns: 0,
      unapprovedCatalogOnlyPatterns: 0,
      formalArtifactsMissingCatalog: 0,
      catalogComponentReferenceErrors: 0,
      catalogArtifactDependencyMismatches: 0,
      patternReadinessDebt: 0,
    },
  },
  {
    id: "pattern-contracts",
    file: "docs/audits/pattern-contract-governance-audit.json",
    debtKey: "patternContractGovernanceDebt",
    expected: {
      patternContractGovernanceIssues: 0,
      requiredPatternContracts: 23,
      requiredPatternContractGaps: 0,
      markdownContractsScanned: 63,
      contractsMissingRequiredSections: 0,
      missingRequiredSectionEntries: 0,
      missingRequiredDemoFunctions: 0,
      missingRequiredDemoComponentAssertions: 0,
      patternContractGovernanceDebt: 0,
    },
  },
  {
    id: "react-migration",
    file: "docs/audits/pattern-react-migration-audit.json",
    debtKey: "migrationAuditDebt",
    expected: {
      patterns: 63,
      reactSources: 63,
      typeSources: 63,
      reactContractRows: 63,
      forwardRefPatterns: 63,
      refAttributePatterns: 63,
      densityPropPatterns: 63,
      patternsWithSlots: 63,
      patternsWithFoundations: 63,
      patternsWithPrimitives: 63,
      patternsWithStateModel: 63,
      callbackPropsDeclared: 269,
      callbackPropsTested: 269,
      missingCallbackTests: 0,
      controlledPairIssues: 0,
      statesMissingFromTypes: 0,
      statesMissingFromArtifact: 0,
      densityCascadeIssues: 0,
      stateCascadeIssues: 0,
      propContractIssues: 0,
      literalContractIssues: 0,
      missingAccessibilityImplementation: 0,
      missingSurfaceSlotMarkers: 0,
      missingStructuralSurfaceUsage: 0,
      unsafeRestSpreads: 0,
      rawGlobalDomRefs: 0,
      reactBehaviorDebt: 0,
      migrationAuditDebt: 0,
    },
  },
  {
    id: "react-pattern-behavior",
    file: "docs/audits/react-pattern-behavior-governance-audit.json",
    debtKey: "reactPatternBehaviorDebt",
    expected: {
      formalPatternArtifacts: 63,
      implementedReactPatterns: 63,
      typedPatternDeclarations: 63,
      forwardRefPatterns: 63,
      patternsWithRefAttributes: 63,
      patternsWithDensityProp: 63,
      flowChildDensityCascadeIssues: 0,
      stateCascadeIssues: 0,
      flowLiteralContractIssues: 0,
      flowChildPropContractIssues: 0,
      callbackPropsDeclared: 269,
      callbackPropsTested: 269,
      missingCallbackTests: 0,
      unusedDeclaredProps: 0,
      unusedCallbackProps: 0,
      formalStates: 476,
      typedStates: 476,
      statesMissingFromTypes: 0,
      statesMissingFromArtifact: 0,
      patternContractStateIssues: 0,
      controlledPairIssues: 0,
      rawGlobalDomRefs: 0,
      forbiddenPropsDeclared: 0,
      unsafeRestSpreads: 0,
      missingSurfaceSlotMarkers: 0,
      missingStructuralSurfaceUsage: 0,
      missingAccessibilityImplementation: 0,
      missingDataFlowPattern: 0,
      patternsWithBehaviorDebt: 0,
      reactPatternBehaviorDebt: 0,
    },
  },
  {
    id: "react-pattern-composition",
    file: "docs/audits/react-pattern-composition-governance-audit.json",
    debtKey: "reactPatternCompositionDebt",
    expected: {
      formalPatternArtifacts: 63,
      implementedReactPatterns: 63,
      missingFormalArtifacts: 0,
      patternsWithDeclaredFoundations: 63,
      patternsWithDeclaredPrimitives: 63,
      missingRequiredComponentImports: 0,
      undeclaredComponentImports: 0,
      unknownComponentImports: 0,
      rawDomVisuals: 0,
      unqualifiedRawDivs: 0,
      docsDependencies: 0,
      workspaceDependencies: 0,
      visualClassLiterals: 0,
      undocumentedPatternBoundaries: 0,
      undeclaredPatternImports: 0,
      slotIssues: 0,
      slotRenderEvidenceIssues: 0,
      tokenIssues: 0,
      patternCopyComponentIssues: 0,
      patternCopyFoundationIssues: 0,
      patternCopySurfaceIssues: 0,
      patternCopyPrimitiveSlotIssues: 0,
      patternCopyPatternDependencyIssues: 0,
      patternCopyBoundaryDependencyIssues: 0,
      patternContractDependencyIssues: 0,
      patternContractSlotIssues: 0,
      missingDataFlowPattern: 0,
      reactPatternCompositionDebt: 0,
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

function patternIds(report) {
  if (!Array.isArray(report.patterns)) return [];
  return report.patterns.map((pattern) => pattern.id ?? pattern.pattern ?? pattern.name).filter(Boolean).sort();
}

function createReport() {
  const rows = patternAuditReports.map((definition) => {
    const report = readJson(definition.file);
    const mismatches = inventoryMismatches(report, definition.expected, definition.id);
    return {
      id: definition.id,
      file: definition.file,
      status: statusOf(report) || "missing",
      debt: Number(inventoryOf(report)[definition.debtKey] ?? 0),
      patternIds: patternIds(report),
      mismatches,
    };
  });

  const patternSets = rows.filter((row) => row.patternIds.length);
  const referenceIds = patternSets[0]?.patternIds ?? [];
  const patternSetIssues = patternSets.flatMap((row) => {
    const missing = referenceIds.filter((id) => !row.patternIds.includes(id));
    const unexpected = row.patternIds.filter((id) => !referenceIds.includes(id));
    return [
      ...missing.map((id) => `${row.id} missing pattern row: ${id}`),
      ...unexpected.map((id) => `${row.id} has unexpected pattern row: ${id}`),
    ];
  });

  const issues = [
    ...(referenceIds.length === 63 ? [] : [`Expected 63 pattern rows in reference report, got ${referenceIds.length}.`]),
    ...rows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...rows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...rows.flatMap((row) => row.mismatches.map((item) => `${item.report}.${item.key}: expected ${item.expected}, got ${item.actual}`)),
    ...patternSetIssues,
  ];

  const inventory = {
    patterns: referenceIds.length,
    patternAuditReports: rows.length,
    passingPatternAuditReports: rows.filter((row) => row.status === "pass").length,
    patternReportsWithRows: patternSets.length,
    patternReportsWith63Rows: patternSets.filter((row) => row.patternIds.length === 63).length,
    patternInventoryMismatches: rows.reduce((sum, row) => sum + row.mismatches.length, 0),
    patternSetIssues: patternSetIssues.length,
    patternAuditDebt: issues.length,
  };

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 5 pattern 1:1 checkpoint",
    principle: "Pattern audit 1:1 can close only when the 63 pattern architecture, readiness, contract, foundation/primitive, React migration, behavior, and composition reports agree on ownership, dependencies, state, slots, foundations, primitives, components, callbacks, and zero debt.",
    scope: "Original plan iteration 25: pattern audit 1:1.",
    inventory,
    rows,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 5 Pattern 1:1 Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Patterns: ${report.inventory.patterns}`,
    `- Pattern audit reports: ${report.inventory.passingPatternAuditReports}/${report.inventory.patternAuditReports}`,
    `- Reports with pattern rows: ${report.inventory.patternReportsWithRows}`,
    `- Reports with 63 rows: ${report.inventory.patternReportsWith63Rows}/${report.inventory.patternReportsWithRows}`,
    `- Inventory mismatches: ${report.inventory.patternInventoryMismatches}`,
    `- Pattern set issues: ${report.inventory.patternSetIssues}`,
    `- Pattern audit debt: ${report.inventory.patternAuditDebt}`,
    "",
    "## Reports",
    "",
    "| Report | Status | Patterns | Debt | Mismatches |",
    "| --- | --- | ---: | ---: | ---: |",
    ...report.rows.map((row) => `| ${row.id} | ${row.status} | ${row.patternIds.length || "-"} | ${row.debt} | ${row.mismatches.length} |`),
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
      console.error("Phase 5 pattern 1:1 checkpoint is stale. Run: node packages/audit/scripts/report-system-phase5-pattern-1to1-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    patterns: report.inventory.patterns,
    reports: `${report.inventory.passingPatternAuditReports}/${report.inventory.patternAuditReports}`,
    reportsWith63Rows: `${report.inventory.patternReportsWith63Rows}/${report.inventory.patternReportsWithRows}`,
    debt: report.inventory.patternAuditDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
