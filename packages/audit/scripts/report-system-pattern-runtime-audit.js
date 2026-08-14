#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-pattern-runtime-audit.json");
const markdownOutput = path.join(outputDir, "system-pattern-runtime-audit.md");

const sourceReports = {
  artifactTests: "docs/audits/system-pattern-artifact-tests.json",
  behaviorGovernance: "docs/audits/react-pattern-behavior-governance-audit.json",
  compositionGovernance: "docs/audits/react-pattern-composition-governance-audit.json",
  contractGovernance: "docs/audits/pattern-contract-governance-audit.json",
  readiness: "docs/audits/pattern-readiness-audit.json",
  reactMigration: "docs/audits/pattern-react-migration-audit.json",
  architecture: "docs/audits/pattern-1to1-architecture-audit.json",
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function normalizeId(value) {
  return String(value ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function indexBy(rows, getKey) {
  const map = new Map();
  for (const row of rows ?? []) map.set(normalizeId(getKey(row)), row);
  return map;
}

function statusIsPass(value) {
  return String(value ?? "").toLowerCase() === "pass";
}

function checkObjectIsPass(checks) {
  return Object.values(checks ?? {}).every((value) => value === true || value === "pass" || value === "not-applicable");
}

function createReport() {
  const reports = Object.fromEntries(
    Object.entries(sourceReports).map(([key, file]) => [key, readJson(file)])
  );

  const behaviorById = indexBy(reports.behaviorGovernance.patterns, (row) => row.patternId);
  const compositionById = indexBy(reports.compositionGovernance.patterns, (row) => row.patternId);
  const migrationById = indexBy(reports.reactMigration.recommendedOrder, (row) => row.pattern);
  const architectureById = indexBy(reports.architecture.patterns, (row) => row.id);
  const formalArtifactIds = new Set((reports.readiness.formalArtifactIds ?? []).map(normalizeId));
  const approvedDocsInfrastructure = new Set(
    (reports.readiness.approvedFormalArtifactsMissingCatalog ?? []).map((row) => normalizeId(row.id))
  );
  const catalogMissing = new Set((reports.readiness.formalArtifactsMissingCatalog ?? []).map(normalizeId));
  const requiredContractIds = new Set((reports.readiness.requiredPatternContracts ?? []).map(normalizeId));

  const patterns = (reports.artifactTests.patterns ?? []).map((pattern) => {
    const id = normalizeId(pattern.patternId);
    const behavior = behaviorById.get(id);
    const composition = compositionById.get(id);
    const migration = migrationById.get(id);
    const architecture = architectureById.get(id);
    const catalogMissingButApproved = catalogMissing.has(id) && approvedDocsInfrastructure.has(id);
    const artifactChecksPass = pattern.status === "pass" && checkObjectIsPass(pattern.checks);
    const issues = [
      ...(artifactChecksPass ? [] : ["artifact runtime checks failed"]),
      ...(behavior ? [] : ["missing behavior governance row"]),
      ...(composition ? [] : ["missing composition governance row"]),
      ...(migration ? [] : ["missing React migration row"]),
      ...(architecture ? [] : ["missing architecture row"]),
      ...(formalArtifactIds.has(id) ? [] : ["missing formal pattern artifact"]),
      ...(catalogMissing.has(id) && !catalogMissingButApproved ? ["formal artifact missing catalog without approval"] : []),
      ...(requiredContractIds.has(id) || pattern.evidence?.artifact ? [] : ["missing required contract evidence"]),
      ...(pattern.evidence?.runtime ? [] : ["missing runtime export evidence"]),
      ...(pattern.evidence?.types ? [] : ["missing type evidence"]),
      ...(pattern.evidence?.source ? [] : ["missing source evidence"]),
    ];
    return {
      id,
      pattern: pattern.pattern,
      artifactTests: artifactChecksPass ? "pass" : "fail",
      behaviorGovernance: behavior ? "pass" : "missing",
      compositionGovernance: composition ? "pass" : "missing",
      readiness: formalArtifactIds.has(id) && (!catalogMissing.has(id) || catalogMissingButApproved) ? "pass" : "fail",
      reactMigration: migration ? "pass" : "missing",
      architecture: architecture ? "pass" : "missing",
      catalogStatus: catalogMissing.has(id) ? "approved-docs-infrastructure" : "cataloged",
      metrics: {
        callbacks: pattern.metrics?.callbacks ?? 0,
        testedCallbacks: pattern.metrics?.testedCallbacks ?? 0,
        slots: pattern.metrics?.slots ?? 0,
        slotUses: pattern.metrics?.slotUses ?? 0,
        dependencies: pattern.metrics?.dependencies ?? 0,
        runtimeImports: pattern.metrics?.runtimeImports ?? 0,
      },
      runtimeEvidence: {
        artifact: pattern.evidence?.artifact ?? null,
        source: pattern.evidence?.source ?? null,
        runtime: pattern.evidence?.runtime ?? null,
        types: pattern.evidence?.types ?? null,
      },
      issues,
      status: issues.length ? "fail" : "pass",
    };
  });

  const sourceReportIssues = Object.entries(reports).flatMap(([key, report]) => (
    statusIsPass(report.status) ? [] : [`${key} status is ${report.status ?? "unknown"}`]
  ));

  const inventory = {
    patterns: patterns.length,
    runtimeAuditedPatterns: patterns.filter((pattern) => pattern.runtimeEvidence.runtime && pattern.runtimeEvidence.types && pattern.runtimeEvidence.source).length,
    passingRuntimePatterns: patterns.filter((pattern) => pattern.status === "pass").length,
    failingRuntimePatterns: patterns.filter((pattern) => pattern.status === "fail").length,
    productCatalogPatterns: patterns.filter((pattern) => pattern.catalogStatus === "cataloged").length,
    documentationInfrastructurePatterns: patterns.filter((pattern) => pattern.catalogStatus === "approved-docs-infrastructure").length,
    sourceReports: Object.keys(sourceReports).length,
    passingSourceReports: Object.values(reports).filter((report) => statusIsPass(report.status)).length,
    sourceReportIssues: sourceReportIssues.length,
    patternRuntimeDebt: 0,
  };
  inventory.patternRuntimeDebt = inventory.failingRuntimePatterns
    + inventory.sourceReportIssues
    + Math.max(0, inventory.patterns - inventory.runtimeAuditedPatterns);

  return {
    status: inventory.patternRuntimeDebt ? "fail" : "pass",
    audit: "system pattern runtime audit",
    planIteration: 20,
    principle: "Every public pattern must pass runtime artifact tests, behavior governance, composition governance, readiness, React migration, and architecture coverage as one auditable boundary.",
    sourceReports,
    inventory,
    sourceReportIssues,
    patterns,
  };
}

function toMarkdown(report) {
  const rows = report.patterns.map((pattern) => `| ${pattern.id} | ${pattern.pattern} | ${pattern.artifactTests} | ${pattern.behaviorGovernance} | ${pattern.compositionGovernance} | ${pattern.readiness} | ${pattern.reactMigration} | ${pattern.architecture} | ${pattern.status} | ${pattern.issues.join("; ") || "None"} |`);
  return [
    "# System Pattern Runtime Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Patterns: ${report.inventory.patterns}`,
    `- Runtime audited patterns: ${report.inventory.runtimeAuditedPatterns}`,
    `- Passing runtime patterns: ${report.inventory.passingRuntimePatterns}`,
    `- Failing runtime patterns: ${report.inventory.failingRuntimePatterns}`,
    `- Product catalog patterns: ${report.inventory.productCatalogPatterns}`,
    `- Documentation infrastructure patterns: ${report.inventory.documentationInfrastructurePatterns}`,
    `- Source reports: ${report.inventory.sourceReports}`,
    `- Passing source reports: ${report.inventory.passingSourceReports}`,
    `- Source report issues: ${report.inventory.sourceReportIssues}`,
    `- Pattern runtime debt: ${report.inventory.patternRuntimeDebt}`,
    "",
    "## Source Reports",
    "",
    ...Object.entries(report.sourceReports).map(([key, file]) => `- ${key}: ${file}`),
    "",
    "## Pattern Runtime Matrix",
    "",
    "| Pattern ID | React pattern | Artifact tests | Behavior | Composition | Readiness | Migration | Architecture | Status | Issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
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
      console.error("System pattern runtime audit is stale. Run: node packages/audit/scripts/report-system-pattern-runtime-audit.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    patterns: report.inventory.patterns,
    passingRuntimePatterns: report.inventory.passingRuntimePatterns,
    patternRuntimeDebt: report.inventory.patternRuntimeDebt,
    json: "docs/audits/system-pattern-runtime-audit.json",
    markdown: "docs/audits/system-pattern-runtime-audit.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
