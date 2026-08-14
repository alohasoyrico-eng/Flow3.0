#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-consumer-boundary-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-consumer-boundary-checkpoint.md");
const checkMode = process.argv.includes("--check");

const reportDefinitions = [
  {
    id: "react-source-of-truth",
    file: "docs/audits/system-react-source-of-truth.json",
    debtKeys: ["sourceTruthDebt"],
    required: {
      status: "pass",
    },
  },
  {
    id: "react-build-reproducibility",
    file: "docs/audits/system-react-build-reproducibility.json",
    debtKeys: ["reactBuildReproducibilityDebt"],
    required: {
      status: "pass",
      "inventory.buildCheckStatus": 0,
    },
  },
  {
    id: "react-export-parity",
    file: "docs/audits/system-react-export-parity.json",
    debtKeys: ["exportParityDebt"],
    required: {
      status: "pass",
      "inventory.orphanReactDistRuntimeFiles": 0,
      "inventory.reactExportsWithoutTypesOrDefault": 0,
      "inventory.unresolvedDirectExports": 0,
      "inventory.unresolvedWildcardExports": 0,
    },
  },
  {
    id: "react-publication-boundary",
    file: "docs/audits/system-react-publication-boundary.json",
    debtKeys: ["publicationBoundaryDebt"],
    required: {
      status: "pass",
      "inventory.packageFilesIncludeReactSrc": 0,
      "inventory.publishedReactSrcFiles": 0,
      "inventory.rootReactExportTargetsToSrc": 0,
      "inventory.reactPackageExportTargetsToSrc": 0,
      "inventory.distImportLeaks": 0,
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
];

function readJson(relativeFile) {
  const absolute = path.join(root, relativeFile);
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
    getValue(report, `metrics.${key}`),
    getValue(report, `summary.${key}`),
  ];
  const value = candidates.find((candidate) => candidate !== undefined);
  return Number(value ?? 0);
}

function buildReport() {
  const rows = reportDefinitions.map((definition) => {
    const report = readJson(definition.file);
    if (!report) {
      return {
        id: definition.id,
        file: definition.file,
        status: "missing",
        debt: 1,
        mismatches: [{ key: "file", expected: "present", actual: "missing" }],
      };
    }
    const mismatches = Object.entries(definition.required)
      .filter(([key, expected]) => getValue(report, key) !== expected)
      .map(([key, expected]) => ({ key, expected, actual: getValue(report, key) }));
    const debts = definition.debtKeys.map((key) => ({ key, value: debtValue(report, key) }));
    const debt = debts.reduce((total, row) => total + row.value, 0) + mismatches.length;
    return {
      id: definition.id,
      file: definition.file,
      status: String(report.status ?? "unknown"),
      debt,
      debts,
      mismatches,
    };
  });

  const sourceTruthReport = readJson("docs/audits/system-react-source-of-truth.json") ?? {};
  const runtimeReport = readJson("docs/audits/system-consumer-runtime-smoke.json") ?? {};
  const cssReport = readJson("docs/audits/system-consumer-css-token-cascade.json") ?? {};
  const typeReport = readJson("docs/audits/system-consumer-type-smoke.json") ?? {};
  const exportReport = readJson("docs/audits/system-react-export-parity.json") ?? {};
  const publicationReport = readJson("docs/audits/system-react-publication-boundary.json") ?? {};
  const buildReportJson = readJson("docs/audits/system-react-build-reproducibility.json") ?? {};

  const consumerBoundaryCheckpointDebt = rows.reduce((total, row) => total + row.debt, 0);

  return {
    schemaVersion: "flow-system-consumer-boundary-checkpoint@1",
    generatedAt: "2026-08-14",
    status: consumerBoundaryCheckpointDebt ? "fail" : "pass",
    inventory: {
      reports: rows.length,
      passingReports: rows.filter((row) => row.status === "pass" && row.debt === 0).length,
      packedFiles: getValue(runtimeReport, "inventory.packedFiles") ?? getValue(cssReport, "inventory.packedFiles") ?? getValue(typeReport, "inventory.packedFiles") ?? 0,
      resolvedExports: getValue(runtimeReport, "inventory.resolvedExports") ?? 0,
      renderedArtifacts: getValue(runtimeReport, "inventory.renderedArtifacts") ?? 0,
      typedComponents: getValue(typeReport, "inventory.typedComponents") ?? 0,
      typedPatterns: getValue(typeReport, "inventory.typedPatterns") ?? 0,
      typedTemplates: getValue(typeReport, "inventory.typedTemplates") ?? 0,
      negativeTypeAssertions: getValue(typeReport, "inventory.negativeTypeAssertions") ?? 0,
      tokenMarkers: getValue(cssReport, "inventory.tokenMarkers") ?? 0,
      componentAliasMarkers: getValue(cssReport, "inventory.componentAliasMarkers") ?? 0,
      reactExportEntries: getValue(exportReport, "inventory.reactExportEntries") ?? 0,
      exportedReactDistRuntimeFiles: getValue(exportReport, "inventory.exportedReactDistRuntimeFiles") ?? 0,
      publishedReactSrcFiles: getValue(publicationReport, "inventory.publishedReactSrcFiles") ?? 0,
      reactPrivateImportTargetsToSrc: getValue(publicationReport, "inventory.reactPrivateImportTargetsToSrc") ?? 0,
      distImportLeaks: getValue(publicationReport, "inventory.distImportLeaks") ?? 0,
      buildCheckStatus: getValue(buildReportJson, "inventory.buildCheckStatus") ?? 1,
      sourceTruthDebt: debtValue(sourceTruthReport, "sourceTruthDebt"),
      srcRuntimeMirrorCount: getValue(sourceTruthReport, "srcRuntimeMirrorCount") ?? 0,
      consumerBoundaryCheckpointDebt,
    },
    rows,
    policy: {
      publicBoundary: "Consumers must import runtime, types, tokens CSS, and component CSS through public package exports.",
      packageBoundary: "Published React dist runtime files must be exported or explicitly internal.",
      buildBoundary: "Generated runtime and declarations must be reproducible from authored TS/TSX source.",
      evidenceBoundary: "This checkpoint aggregates existing audited evidence; it does not replace visual QA or exhaustive interaction QA.",
    },
    residualRisk: [
      "The source runtime mirror still exists as generated compatibility output and is tracked as srcRuntimeMirrorCount.",
      "This checkpoint is representative for consumer runtime/type behavior, not exhaustive across every prop and interaction.",
      "This checkpoint does not claim FlowDocs visual parity, shell quality, search keyboard quality, or sidebar/topbar UX closure.",
    ],
  };
}

function renderMarkdown(report) {
  const rows = report.rows.map((row) => (
    `| ${row.id} | ${row.status} | ${row.debt} | ${row.file} |`
  )).join("\n");
  const mismatches = report.rows
    .flatMap((row) => row.mismatches.map((mismatch) => `- ${row.id}: ${mismatch.key} expected ${JSON.stringify(mismatch.expected)}, got ${JSON.stringify(mismatch.actual)}`))
    .join("\n");
  return [
    "# System consumer boundary checkpoint",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Reports: ${report.inventory.reports}`,
    `- Passing reports: ${report.inventory.passingReports}`,
    `- Packed files: ${report.inventory.packedFiles}`,
    `- Resolved exports: ${report.inventory.resolvedExports}`,
    `- Rendered artifacts: ${report.inventory.renderedArtifacts}`,
    `- Typed components: ${report.inventory.typedComponents}`,
    `- Typed patterns: ${report.inventory.typedPatterns}`,
    `- Typed templates: ${report.inventory.typedTemplates}`,
    `- Negative type assertions: ${report.inventory.negativeTypeAssertions}`,
    `- Token markers: ${report.inventory.tokenMarkers}`,
    `- Component alias markers: ${report.inventory.componentAliasMarkers}`,
    `- React export entries: ${report.inventory.reactExportEntries}`,
    `- Exported React dist runtime files: ${report.inventory.exportedReactDistRuntimeFiles}`,
    `- Published React src files: ${report.inventory.publishedReactSrcFiles}`,
    `- React private import targets to src: ${report.inventory.reactPrivateImportTargetsToSrc}`,
    `- Dist import leaks: ${report.inventory.distImportLeaks}`,
    `- Build check status: ${report.inventory.buildCheckStatus}`,
    `- Source truth debt: ${report.inventory.sourceTruthDebt}`,
    `- Source runtime mirror count: ${report.inventory.srcRuntimeMirrorCount}`,
    `- Consumer boundary checkpoint debt: ${report.inventory.consumerBoundaryCheckpointDebt}`,
    "",
    "## Reports",
    "",
    "| Report | Status | Debt | File |",
    "| --- | ---: | ---: | --- |",
    rows,
    "",
    "## Mismatches",
    "",
    mismatches || "- None.",
    "",
    "## Policy",
    "",
    `- Public boundary: ${report.policy.publicBoundary}`,
    `- Package boundary: ${report.policy.packageBoundary}`,
    `- Build boundary: ${report.policy.buildBoundary}`,
    `- Evidence boundary: ${report.policy.evidenceBoundary}`,
    "",
    "## Residual Risk",
    "",
    ...report.residualRisk.map((risk) => `- ${risk}`),
    "",
  ].join("\n");
}

function main() {
  const report = buildReport();
  if (checkMode) {
    if (!fs.existsSync(jsonOutput)) {
      console.error("Consumer boundary checkpoint report is missing. Run: node packages/audit/scripts/report-system-consumer-boundary-checkpoint.js");
      process.exit(1);
    }
    const existing = fs.readFileSync(jsonOutput, "utf8");
    const expected = `${JSON.stringify(report, null, 2)}\n`;
    if (existing !== expected) {
      console.error("Consumer boundary checkpoint report is stale. Run: node packages/audit/scripts/report-system-consumer-boundary-checkpoint.js");
      process.exit(1);
    }
    if (report.inventory.consumerBoundaryCheckpointDebt) {
      console.error(`Consumer boundary checkpoint debt detected: ${report.inventory.consumerBoundaryCheckpointDebt}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      status: report.status,
      consumerBoundaryCheckpointDebt: report.inventory.consumerBoundaryCheckpointDebt,
      passingReports: report.inventory.passingReports,
      reports: report.inventory.reports,
    }, null, 2));
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    consumerBoundaryCheckpointDebt: report.inventory.consumerBoundaryCheckpointDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (report.inventory.consumerBoundaryCheckpointDebt) process.exit(1);
}

main();
