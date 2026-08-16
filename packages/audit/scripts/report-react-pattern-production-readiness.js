#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");
const { createReport: createPatternArtifactReport } = require("./report-system-pattern-artifact-tests.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-pattern-production-readiness.json");
const markdownOutput = path.join(outputDir, "react-pattern-production-readiness.md");
const behaviorReportFile = path.join(outputDir, "react-pattern-behavior-governance-audit.json");
const compositionReportFile = path.join(outputDir, "react-pattern-composition-governance-audit.json");
const runtimeReportFile = path.join(outputDir, "system-pattern-runtime-audit.json");
const artifactReportFile = path.join(outputDir, "system-pattern-artifact-tests.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function patternRuntimeRows(report) {
  if (Array.isArray(report.patterns)) return report.patterns;
  if (Array.isArray(report.artifacts)) return report.artifacts.filter((row) => row.kind === "pattern" || row.layer === "pattern");
  if (Array.isArray(report.rows)) return report.rows.filter((row) => row.kind === "pattern" || row.layer === "pattern");
  return [];
}

function runtimeStatusFor(row) {
  if (!row) return "missing";
  if (typeof row.status === "string") return row.status;
  if (Array.isArray(row.issues) && row.issues.length) return "fail";
  return "pass";
}

async function createReport() {
  const artifactReport = await createPatternArtifactReport();
  const behaviorReport = readJson(behaviorReportFile);
  const compositionReport = readJson(compositionReportFile);
  const runtimeReport = readJson(runtimeReportFile);
  const runtimeById = new Map(patternRuntimeRows(runtimeReport).map((row) => [row.patternId ?? row.id ?? row.artifactId, row]));
  const patterns = artifactReport.patterns.map((row) => {
    const runtimeRow = runtimeById.get(row.patternId);
    const issues = [
      ...row.issues,
      ...(runtimeStatusFor(runtimeRow) === "pass" ? [] : [`runtime ${runtimeStatusFor(runtimeRow)}`]),
      ...(runtimeRow?.issues ?? []),
    ];
    const checks = {
      ...row.checks,
      runtime: runtimeStatusFor(runtimeRow),
    };
    return {
      patternId: row.patternId,
      pattern: row.pattern,
      status: issues.length ? "fail" : "ready",
      evidence: {
        ...row.evidence,
        artifactTests: rel(artifactReportFile),
        runtime: rel(runtimeReportFile),
      },
      checks,
      metrics: row.metrics,
      issues: unique(issues),
    };
  });
  const inventory = {
    publicPatternArtifacts: artifactReport.inventory.patternArtifacts,
    readyPatterns: patterns.filter((row) => row.status === "ready").length,
    failingPatterns: patterns.filter((row) => row.status !== "ready").length,
    runtimePatternExports: artifactReport.inventory.runtimePatternExports,
    testedPatterns: artifactReport.inventory.testedPatterns,
    renderedPatterns: artifactReport.inventory.renderedPatterns,
    callbackPropsDeclared: artifactReport.inventory.callbackPropsDeclared,
    callbackPropsTested: artifactReport.inventory.callbackPropsTested,
    slotCount: artifactReport.inventory.slotCount,
    slotUseCount: artifactReport.inventory.slotUseCount,
    behaviorDebt: behaviorReport.inventory.reactPatternBehaviorDebt,
    compositionDebt: compositionReport.inventory.reactPatternCompositionDebt,
    artifactTestDebt: artifactReport.inventory.patternArtifactTestDebt,
    runtimeDebt: runtimeReport.inventory?.patternRuntimeDebt ?? runtimeReport.inventory?.systemPatternRuntimeDebt ?? 0,
  };
  inventory.reactPatternProductionReadinessDebt = inventory.failingPatterns
    + inventory.behaviorDebt
    + inventory.compositionDebt
    + inventory.artifactTestDebt
    + inventory.runtimeDebt;
  return {
    status: inventory.reactPatternProductionReadinessDebt ? "fail" : "pass",
    audit: "react pattern production readiness",
    principle: "Public React patterns are production-ready only when artifact tests, behavior governance, composition governance, and runtime governance all pass through the package boundary.",
    inventory,
    evidenceSources: {
      artifactTests: rel(artifactReportFile),
      behavior: rel(behaviorReportFile),
      composition: rel(compositionReportFile),
      runtime: rel(runtimeReportFile),
    },
    patterns,
  };
}

function toMarkdown(report) {
  const rows = report.patterns.map((row) => `| ${row.patternId} | ${row.pattern} | ${row.status} | ${row.checks.render} | ${row.checks.callbacks} | ${row.checks.behavior} | ${row.checks.composition} | ${row.checks.runtime} | ${row.metrics.callbacks}/${row.metrics.testedCallbacks} | ${row.issues.join("; ") || "None"} |`);
  return [
    "# React Pattern Production Readiness",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Public pattern artifacts: ${report.inventory.publicPatternArtifacts}`,
    `- Ready patterns: ${report.inventory.readyPatterns}`,
    `- Failing patterns: ${report.inventory.failingPatterns}`,
    `- Runtime pattern exports: ${report.inventory.runtimePatternExports}`,
    `- Tested/rendered patterns: ${report.inventory.testedPatterns}/${report.inventory.renderedPatterns}`,
    `- Callback props declared/tested: ${report.inventory.callbackPropsDeclared}/${report.inventory.callbackPropsTested}`,
    `- Slot count/use count: ${report.inventory.slotCount}/${report.inventory.slotUseCount}`,
    `- Behavior debt: ${report.inventory.behaviorDebt}`,
    `- Composition debt: ${report.inventory.compositionDebt}`,
    `- Artifact test debt: ${report.inventory.artifactTestDebt}`,
    `- Runtime debt: ${report.inventory.runtimeDebt}`,
    `- React pattern production readiness debt: ${report.inventory.reactPatternProductionReadinessDebt}`,
    "",
    "## Evidence Sources",
    "",
    `- Artifact tests: ${report.evidenceSources.artifactTests}`,
    `- Behavior: ${report.evidenceSources.behavior}`,
    `- Composition: ${report.evidenceSources.composition}`,
    `- Runtime: ${report.evidenceSources.runtime}`,
    "",
    "## Pattern Matrix",
    "",
    "| Pattern id | React pattern | Status | Render | Callbacks | Behavior | Composition | Runtime | Callback coverage | Issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |",
    ...rows,
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

async function main() {
  const report = await createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("React pattern production readiness report is stale. Run: node packages/audit/scripts/report-react-pattern-production-readiness.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    readyPatterns: report.inventory.readyPatterns,
    publicPatternArtifacts: report.inventory.publicPatternArtifacts,
    reactPatternProductionReadinessDebt: report.inventory.reactPatternProductionReadinessDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { createReport };
