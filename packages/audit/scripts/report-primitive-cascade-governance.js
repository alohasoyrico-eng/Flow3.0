#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-cascade-governance-audit.json");
const markdownOutput = path.join(outputDir, "primitive-cascade-governance-audit.md");
const governanceFile = path.join(root, "packages/content/content/primitive-cascade-governance.json");
const systemDebtGovernanceFile = path.join(root, "packages/content/content/system-debt-governance.json");
const scriptsDir = path.join(root, "packages/audit/scripts");

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function reportScriptId(file) {
  return file
    .replace(/^report-primitive-/, "")
    .replace(/-cascade\.js$/, "");
}

function createReport() {
  const governance = readJson(governanceFile, {});
  const systemDebtGovernance = readJson(systemDebtGovernanceFile, {});
  const active = Array.isArray(governance.activeCascadeReports) ? governance.activeCascadeReports : [];
  const backlog = governance.backlogCascadeReports && typeof governance.backlogCascadeReports === "object"
    ? governance.backlogCascadeReports
    : {};
  const backlogSchema = governance.backlogSchema && typeof governance.backlogSchema === "object"
    ? governance.backlogSchema
    : {};
  const allowedBlockerTypes = Array.isArray(backlogSchema.allowedBlockerTypes) ? backlogSchema.allowedBlockerTypes : [];
  const requiredBacklogFields = Array.isArray(backlogSchema.requiredFields) ? backlogSchema.requiredFields : [];
  const available = fs.readdirSync(scriptsDir)
    .filter((file) => /^report-primitive-.*-cascade\.js$/.test(file))
    .map(reportScriptId)
    .sort();
  const activeSet = new Set(active);
  const backlogIds = Object.keys(backlog).sort();
  const duplicateActive = active.filter((id, index) => active.indexOf(id) !== index);
  const unknownActive = active.filter((id) => !available.includes(id));
  const unknownBacklog = backlogIds.filter((id) => !available.includes(id));
  const activeBacklogOverlap = backlogIds.filter((id) => activeSet.has(id));
  const missingDisposition = available.filter((id) => !activeSet.has(id) && !backlogIds.includes(id));
  const invalidBacklogEntries = backlogIds.filter((id) => !backlog[id] || typeof backlog[id] !== "object" || Array.isArray(backlog[id]));
  const missingBacklogFields = backlogIds.flatMap((id) => (
    invalidBacklogEntries.includes(id)
      ? requiredBacklogFields.map((field) => `${id}.${field}`)
      : requiredBacklogFields.filter((field) => !(field in backlog[id])).map((field) => `${id}.${field}`)
  ));
  const emptyBacklogReasons = backlogIds.filter((id) => typeof backlog[id]?.reason !== "string" || !backlog[id].reason.trim());
  const invalidBacklogBlockerTypes = backlogIds.flatMap((id) => {
    const blockerTypes = backlog[id]?.blockerTypes;
    if (!Array.isArray(blockerTypes) || !blockerTypes.length) return [`${id}:missing`];
    return blockerTypes
      .filter((type) => !allowedBlockerTypes.includes(type))
      .map((type) => `${id}:${type}`);
  });
  const invalidBacklogActivationEvidence = backlogIds.filter((id) => {
    const evidence = backlog[id]?.activationEvidence;
    return !Array.isArray(evidence) || !evidence.length || evidence.some((item) => typeof item !== "string" || !item.trim());
  });
  const missingActiveLedgerCategories = active
    .map((id) => `primitive-${id}-cascade-audit.json`)
    .filter((reportFile) => systemDebtGovernance.reportCategories?.[reportFile] !== "foundations-primitives");
  const activeReportsMissingArtifacts = active
    .map((id) => `docs/audits/primitive-${id}-cascade-audit.json`)
    .filter((file) => !fs.existsSync(path.join(root, file)));

  const issues = [
    ...(typeof governance.principle === "string" && governance.principle.trim() ? [] : ["primitive-cascade-governance must define a principle."]),
    ...(active.length ? [] : ["activeCascadeReports must include at least one primitive gate."]),
    ...[...new Set(duplicateActive)].map((id) => `duplicate active primitive gate: ${id}`),
    ...unknownActive.map((id) => `unknown active primitive gate: ${id}`),
    ...unknownBacklog.map((id) => `unknown backlog primitive gate: ${id}`),
    ...activeBacklogOverlap.map((id) => `primitive gate cannot be active and backlog: ${id}`),
    ...missingDisposition.map((id) => `primitive gate has no active/backlog disposition: ${id}`),
    ...(allowedBlockerTypes.length ? [] : ["backlogSchema.allowedBlockerTypes must list at least one blocker type."]),
    ...(requiredBacklogFields.length ? [] : ["backlogSchema.requiredFields must list required backlog fields."]),
    ...invalidBacklogEntries.map((id) => `backlog primitive gate must be an object: ${id}`),
    ...missingBacklogFields.map((field) => `backlog primitive gate missing required field: ${field}`),
    ...emptyBacklogReasons.map((id) => `backlog primitive gate has no reason: ${id}`),
    ...invalidBacklogBlockerTypes.map((entry) => `backlog primitive gate has invalid blocker type: ${entry}`),
    ...invalidBacklogActivationEvidence.map((id) => `backlog primitive gate needs activation evidence: ${id}`),
    ...missingActiveLedgerCategories.map((file) => `active primitive gate missing foundations-primitives ledger category: ${file}`),
    ...activeReportsMissingArtifacts.map((file) => `active primitive gate missing audit artifact: ${file}`),
  ];

  const inventory = {
    availablePrimitiveCascadeReports: available.length,
    activePrimitiveCascadeReports: active.length,
    backlogPrimitiveCascadeReports: backlogIds.length,
    unknownActivePrimitiveCascadeReports: unknownActive.length,
    unknownBacklogPrimitiveCascadeReports: unknownBacklog.length,
    duplicateActivePrimitiveCascadeReports: [...new Set(duplicateActive)].length,
    activeBacklogOverlaps: activeBacklogOverlap.length,
    missingPrimitiveCascadeDispositions: missingDisposition.length,
    invalidBacklogEntries: invalidBacklogEntries.length,
    missingBacklogFields: missingBacklogFields.length,
    emptyBacklogReasons: emptyBacklogReasons.length,
    invalidBacklogBlockerTypes: invalidBacklogBlockerTypes.length,
    invalidBacklogActivationEvidence: invalidBacklogActivationEvidence.length,
    missingActiveLedgerCategories: missingActiveLedgerCategories.length,
    activeReportsMissingArtifacts: activeReportsMissingArtifacts.length,
  };
  inventory.primitiveCascadeGovernanceDebt = issues.length;

  return {
    status: issues.length ? "fail" : "pass",
    audit: "primitive cascade governance",
    principle: governance.principle,
    inventory,
    activeCascadeReports: active,
    backlogSchema,
    backlogCascadeReports: backlog,
    availableCascadeReports: available,
    issues,
    missingDisposition,
    missingBacklogFields,
    invalidBacklogBlockerTypes,
    invalidBacklogActivationEvidence,
    missingActiveLedgerCategories,
    activeReportsMissingArtifacts,
  };
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Cascade Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    `- Available primitive cascade reports: ${report.inventory.availablePrimitiveCascadeReports}`,
    `- Active primitive cascade reports: ${report.inventory.activePrimitiveCascadeReports}`,
    `- Backlog primitive cascade reports: ${report.inventory.backlogPrimitiveCascadeReports}`,
    `- Backlog schema violations: ${report.inventory.invalidBacklogEntries + report.inventory.missingBacklogFields + report.inventory.emptyBacklogReasons + report.inventory.invalidBacklogBlockerTypes + report.inventory.invalidBacklogActivationEvidence}`,
    `- Governance debt: ${report.inventory.primitiveCascadeGovernanceDebt}`,
    "",
    "## Active Gates",
    ...(report.activeCascadeReports.length ? report.activeCascadeReports.map((id) => `- ${id}`) : ["- None"]),
    "",
    "## Backlog Gates",
    ...(Object.entries(report.backlogCascadeReports).length
      ? Object.entries(report.backlogCascadeReports).map(([id, entry]) => `- ${id}: ${entry.reason} [${entry.blockerTypes.join(", ")}]`)
      : ["- None"]),
    "",
    "## Issues",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None"]),
  ].join("\n");

  if (checkMode) {
    if (fs.existsSync(jsonOutput) && fs.readFileSync(jsonOutput, "utf8") !== json) {
      console.error("Primitive cascade governance audit is stale. Run: node packages/audit/scripts/report-primitive-cascade-governance.js");
      process.exit(1);
    }
    if (fs.existsSync(markdownOutput) && fs.readFileSync(markdownOutput, "utf8") !== `${markdown}\n`) {
      console.error("Primitive cascade governance audit is stale. Run: node packages/audit/scripts/report-primitive-cascade-governance.js");
      process.exit(1);
    }
    if (!fs.existsSync(jsonOutput) || !fs.existsSync(markdownOutput)) {
      console.error("Primitive cascade governance audit is missing. Run: node packages/audit/scripts/report-primitive-cascade-governance.js");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive cascade governance audit failed: ${report.issues.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive cascade governance audit failed: ${report.issues.join("; ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify({
    status: report.status,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
    active: report.inventory.activePrimitiveCascadeReports,
    backlog: report.inventory.backlogPrimitiveCascadeReports,
    debt: report.inventory.primitiveCascadeGovernanceDebt,
  }, null, 2));
}

writeReport(createReport());
