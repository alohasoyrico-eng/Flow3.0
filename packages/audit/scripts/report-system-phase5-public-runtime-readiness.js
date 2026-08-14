#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase5-public-runtime-readiness.json");
const markdownOutput = path.join(outputDir, "system-phase5-public-runtime-readiness.md");

const sourceReports = [
  {
    id: "public-runtime-boundary",
    file: "docs/audits/system-public-runtime-boundary.json",
    debtKeys: ["publicRuntimeBoundaryDebt"],
    required: {
      status: "pass",
      "inventory.runtimeArtifacts": 151,
      "inventory.passingRuntimeArtifacts": 151,
      "inventory.failingRuntimeArtifacts": 0,
    },
  },
  {
    id: "consumer-boundary-checkpoint",
    file: "docs/audits/system-consumer-boundary-checkpoint.json",
    debtKeys: ["consumerBoundaryCheckpointDebt"],
    required: {
      status: "pass",
      "inventory.reports": 7,
      "inventory.passingReports": 7,
      "inventory.publishedReactSrcFiles": 0,
      "inventory.distImportLeaks": 0,
      "inventory.buildCheckStatus": 0,
    },
  },
  {
    id: "consumer-runtime-smoke",
    file: "docs/audits/system-consumer-runtime-smoke.json",
    debtKeys: ["consumerRuntimeSmokeDebt"],
    required: {
      status: "pass",
      "inventory.resolvedExports": 16,
      "inventory.renderedArtifacts": 20,
    },
  },
  {
    id: "consumer-css-token-cascade",
    file: "docs/audits/system-consumer-css-token-cascade.json",
    debtKeys: ["consumerCssTokenCascadeDebt"],
    required: {
      status: "pass",
      "inventory.tokenMarkers": 4,
      "inventory.componentAliasMarkers": 6,
      "inventory.componentRootMarkers": 6,
      "inventory.densityMarkers": 4,
    },
  },
  {
    id: "consumer-type-smoke",
    file: "docs/audits/system-consumer-type-smoke.json",
    debtKeys: ["consumerTypeSmokeDebt"],
    required: {
      status: "pass",
      "inventory.typedComponents": 7,
      "inventory.typedPatterns": 8,
      "inventory.typedTemplates": 5,
      "inventory.negativeTypeAssertions": 4,
      "inventory.tscStatus": 0,
    },
  },
  {
    id: "react-publication-boundary",
    file: "docs/audits/system-react-publication-boundary.json",
    debtKeys: ["publicationBoundaryDebt"],
    required: {
      status: "pass",
      "inventory.publishedReactSrcFiles": 0,
      "inventory.rootReactExportTargetsToSrc": 0,
      "inventory.reactPackageExportTargetsToSrc": 0,
      "inventory.distImportLeaks": 0,
    },
  },
  {
    id: "react-export-parity",
    file: "docs/audits/system-react-export-parity.json",
    debtKeys: ["exportParityDebt"],
    required: {
      status: "pass",
      "inventory.reactExportsWithoutTypesOrDefault": 0,
      "inventory.unresolvedDirectExports": 0,
      "inventory.unresolvedWildcardExports": 0,
      "inventory.orphanReactDistRuntimeFiles": 0,
    },
  },
  {
    id: "react-build-reproducibility",
    file: "docs/audits/system-react-build-reproducibility.json",
    debtKeys: ["reactBuildReproducibilityDebt"],
    required: {
      status: "pass",
      "inventory.buildCheckStatus": 0,
      "inventory.srcRuntimeMirrorsMissingHeader": 0,
    },
  },
];

function readJson(file) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) return null;
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function getValue(object, keyPath) {
  return keyPath.split(".").reduce((value, key) => (value == null ? undefined : value[key]), object);
}

function debtValue(report, key) {
  const candidates = [
    getValue(report, key),
    getValue(report, `inventory.${key}`),
    getValue(report, `summary.${key}`),
  ];
  const value = candidates.find((candidate) => candidate !== undefined);
  return Number(value ?? 0);
}

function rowFor(definition) {
  const report = readJson(definition.file);
  if (!report) {
    return {
      id: definition.id,
      file: definition.file,
      status: "missing",
      debt: 1,
      debts: [],
      mismatches: [{ key: "file", expected: "present", actual: "missing" }],
    };
  }
  const mismatches = Object.entries(definition.required)
    .filter(([key, expected]) => getValue(report, key) !== expected)
    .map(([key, expected]) => ({ key, expected, actual: getValue(report, key) }));
  const debts = definition.debtKeys.map((key) => ({ key, value: debtValue(report, key) }));
  const debt = debts.reduce((total, item) => total + item.value, 0) + mismatches.length;
  return {
    id: definition.id,
    file: definition.file,
    status: String(report.status ?? "unknown"),
    debt,
    debts,
    mismatches,
  };
}

function createReport() {
  const rows = sourceReports.map(rowFor);
  const publicRuntime = readJson("docs/audits/system-public-runtime-boundary.json") ?? {};
  const consumerBoundary = readJson("docs/audits/system-consumer-boundary-checkpoint.json") ?? {};
  const runtimeSmoke = readJson("docs/audits/system-consumer-runtime-smoke.json") ?? {};
  const typeSmoke = readJson("docs/audits/system-consumer-type-smoke.json") ?? {};
  const cssCascade = readJson("docs/audits/system-consumer-css-token-cascade.json") ?? {};
  const exportParity = readJson("docs/audits/system-react-export-parity.json") ?? {};
  const publication = readJson("docs/audits/system-react-publication-boundary.json") ?? {};
  const build = readJson("docs/audits/system-react-build-reproducibility.json") ?? {};

  const readinessDebt = rows.reduce((total, row) => total + row.debt, 0);
  return {
    status: readinessDebt ? "fail" : "pass",
    audit: "system phase 5 public runtime readiness",
    planIteration: 23,
    principle: "Phase 5 is closed only when the public runtime boundary is installable, importable, typed, tokenized, reproducible, and publication-safe for consumers.",
    inventory: {
      reports: rows.length,
      passingReports: rows.filter((row) => row.status === "pass" && row.debt === 0).length,
      runtimeArtifacts: getValue(publicRuntime, "inventory.runtimeArtifacts") ?? 0,
      passingRuntimeArtifacts: getValue(publicRuntime, "inventory.passingRuntimeArtifacts") ?? 0,
      resolvedExports: getValue(runtimeSmoke, "inventory.resolvedExports") ?? 0,
      renderedArtifacts: getValue(runtimeSmoke, "inventory.renderedArtifacts") ?? 0,
      packedFiles: getValue(consumerBoundary, "inventory.packedFiles") ?? 0,
      typedComponents: getValue(typeSmoke, "inventory.typedComponents") ?? 0,
      typedPatterns: getValue(typeSmoke, "inventory.typedPatterns") ?? 0,
      typedTemplates: getValue(typeSmoke, "inventory.typedTemplates") ?? 0,
      negativeTypeAssertions: getValue(typeSmoke, "inventory.negativeTypeAssertions") ?? 0,
      tokenMarkers: getValue(cssCascade, "inventory.tokenMarkers") ?? 0,
      componentAliasMarkers: getValue(cssCascade, "inventory.componentAliasMarkers") ?? 0,
      reactExportEntries: getValue(exportParity, "inventory.reactExportEntries") ?? 0,
      exportedReactDistRuntimeFiles: getValue(exportParity, "inventory.exportedReactDistRuntimeFiles") ?? 0,
      publishedReactSrcFiles: getValue(publication, "inventory.publishedReactSrcFiles") ?? 0,
      distImportLeaks: getValue(publication, "inventory.distImportLeaks") ?? 0,
      buildCheckStatus: getValue(build, "inventory.buildCheckStatus") ?? 1,
      phase5PublicRuntimeReadinessDebt: readinessDebt,
    },
    rows,
    residualRisk: [
      "This checkpoint proves consumer readiness for the public runtime package boundary, not FlowDocs UX quality.",
      "Runtime smoke and type smoke are representative gates; exhaustive prop and interaction coverage remains owned by artifact-level tests.",
      "Visual parity against previous FlowDocs or ZIP references remains a separate remediation track.",
    ],
  };
}

function toMarkdown(report) {
  const rows = report.rows.map((row) => `| ${row.id} | ${row.status} | ${row.debt} | ${row.file} | ${row.mismatches.map((mismatch) => `${mismatch.key}: expected ${JSON.stringify(mismatch.expected)}, got ${JSON.stringify(mismatch.actual)}`).join("<br>") || "None"} |`);
  return [
    "# System Phase 5 Public Runtime Readiness",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Reports: ${report.inventory.reports}`,
    `- Passing reports: ${report.inventory.passingReports}`,
    `- Runtime artifacts: ${report.inventory.runtimeArtifacts}`,
    `- Passing runtime artifacts: ${report.inventory.passingRuntimeArtifacts}`,
    `- Resolved exports: ${report.inventory.resolvedExports}`,
    `- Rendered artifacts: ${report.inventory.renderedArtifacts}`,
    `- Packed files: ${report.inventory.packedFiles}`,
    `- Typed components: ${report.inventory.typedComponents}`,
    `- Typed patterns: ${report.inventory.typedPatterns}`,
    `- Typed templates: ${report.inventory.typedTemplates}`,
    `- Negative type assertions: ${report.inventory.negativeTypeAssertions}`,
    `- Token markers: ${report.inventory.tokenMarkers}`,
    `- Component alias markers: ${report.inventory.componentAliasMarkers}`,
    `- React export entries: ${report.inventory.reactExportEntries}`,
    `- Exported React dist runtime files: ${report.inventory.exportedReactDistRuntimeFiles}`,
    `- Published React src files: ${report.inventory.publishedReactSrcFiles}`,
    `- Dist import leaks: ${report.inventory.distImportLeaks}`,
    `- Build check status: ${report.inventory.buildCheckStatus}`,
    `- Phase 5 public runtime readiness debt: ${report.inventory.phase5PublicRuntimeReadinessDebt}`,
    "",
    "## Source Matrix",
    "",
    "| Gate | Status | Debt | Report | Mismatches |",
    "| --- | --- | ---: | --- | --- |",
    ...rows,
    "",
    "## Residual Risk",
    "",
    ...report.residualRisk.map((risk) => `- ${risk}`),
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
      console.error("System phase 5 public runtime readiness is stale. Run: node packages/audit/scripts/report-system-phase5-public-runtime-readiness.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    runtimeArtifacts: report.inventory.runtimeArtifacts,
    passingRuntimeArtifacts: report.inventory.passingRuntimeArtifacts,
    phase5PublicRuntimeReadinessDebt: report.inventory.phase5PublicRuntimeReadinessDebt,
    json: "docs/audits/system-phase5-public-runtime-readiness.json",
    markdown: "docs/audits/system-phase5-public-runtime-readiness.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
