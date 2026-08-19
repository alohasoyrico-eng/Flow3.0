const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const auditsDir = path.join(root, "docs/audits");
const jsonOut = path.join(auditsDir, "system-gate-split.json");
const mdOut = path.join(auditsDir, "system-gate-split.md");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(auditsDir, name), "utf8"));
}

function mdTable(rows, columns) {
  if (!rows.length) return "_No rows._";
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(row[column] ?? "").replaceAll("\n", "<br>")).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

const gateBoundary = readJson("system-gate-boundary-classification.json");
const staleAudits = readJson("flowdocs-stale-audit-classification.json");
const consumer = readJson("flowdocs-consumer-contract.json");
const cleanup = readJson("flowdocs-safe-cleanup-plan.json");

const gates = [
  {
    gate: "DS release",
    command: "npm run validate:flow-core",
    owns: "Flow package release readiness: build, typecheck, React tests, package/runtime consumer gates",
    mustNotOwn: "FlowDocs layout remediation, docs visual parity, legacy docs shell debt",
    status: "authoritative",
  },
  {
    gate: "Flow core",
    command: "npm run audit:flow-core-gate",
    owns: "package/spec/token/component/pattern/react contracts",
    mustNotOwn: "FlowDocs shell, docs visual parity, ZIP narrative, generated evidence snapshots",
    status: "active",
  },
  {
    gate: "FlowDocs consumer",
    command: "npm run audit:flowdocs-consumer-gate",
    owns: "FlowDocs runtime graph, shell adapter, template boundary, legacy slot quarantine, consumer contract",
    mustNotOwn: "component API truth, package readiness, token source truth",
    status: consumer.status === "blocked" ? "blocked" : "active",
  },
  {
    gate: "Content source",
    command: "npm run audit:content-source-gate",
    owns: "package content ownership, generated docs content bundle, editorial copy location",
    mustNotOwn: "visual parity, shell runtime behavior, component interaction truth",
    status: "active",
  },
  {
    gate: "Forensic/parity",
    command: "npm run audit:forensic-gate",
    owns: "legacy evidence, stale audit classification, cleanup queues, go/no-go checkpoint",
    mustNotOwn: "release readiness on its own",
    status: "advisory",
  },
];

const retiredOrHistorical = [
  {
    command: "npm run audit",
    file: "packages/audit/scripts/audit-complete.mjs",
    status: "historical-mixed-non-authoritative",
    replacement: "Use npm run validate:flow-core for DS release readiness.",
  },
  {
    command: "npm run audit:complete",
    file: "packages/audit/scripts/audit-complete.mjs",
    status: "historical-mixed-non-authoritative",
    replacement: "Use npm run validate:flow-core for DS release readiness.",
  },
  {
    command: "node packages/audit/scripts/audit-system.js",
    file: "packages/audit/scripts/audit-system.js",
    status: "mixed-top-level",
    replacement: "Split into Flow core + FlowDocs consumer + content + forensic gates.",
  },
  {
    command: "node packages/audit/scripts/audit-integration.js",
    file: "packages/audit/scripts/audit-integration.js",
    status: "mixed-top-level",
    replacement: "Keep package checks in Flow core; move template/parity checks out.",
  },
  {
    command: "npm run audit:system",
    file: "packages/audit/scripts/audit-system-scope.js",
    status: "mixed-top-level",
    replacement: "Use npm run validate:flow-core for release; use FlowDocs commands only for docs consumer debt.",
  },
];

const blockers = [
  {
    id: "flowdocs-consumer-still-blocked",
    evidence: `${consumer.summary?.fail ?? 0} consumer contract failures remain`,
    action: "Do not mark FlowDocs trustworthy until consumer contract passes without active legacy slots.",
  },
  {
    id: "mixed-gates-still-exist",
    evidence: `${staleAudits.summary?.["mixed-top-level-gate"] ?? 0} mixed top-level gates classified`,
    action: "Do not use mixed gates as authoritative release gates.",
  },
  {
    id: "cleanup-still-protected",
    evidence: `${cleanup.totals?.legacyQuarantineCandidates ?? 0} quarantine candidates and ${cleanup.totals?.runtimeKeepRows ?? 0} runtime-protected files`,
    action: "Cleanup must follow consumer replacement order.",
  },
];

const report = {
  generatedAt: new Date().toISOString(),
  status: "action_required",
  decision: "ds-release-gate-is-authoritative-legacy-mixed-gates-are-non-authoritative",
  gates,
  retiredOrHistorical,
  blockers,
  sourceEvidence: {
    gateBoundaryStatus: gateBoundary.status,
    staleAuditStatus: staleAudits.status,
    consumerStatus: consumer.status,
  },
};

fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = `# System Gate Split

Status: **${report.status}**

Decision: **${report.decision}**

## Active Gates

${mdTable(gates, ["gate", "command", "owns", "mustNotOwn", "status"])}

## Historical / Mixed Gates

${mdTable(retiredOrHistorical, ["command", "file", "status", "replacement"])}

## Blockers

${mdTable(blockers, ["id", "evidence", "action"])}
`;

fs.writeFileSync(mdOut, md);

console.log(JSON.stringify({
  status: report.status,
  decision: report.decision,
  gates: gates.length,
  historicalMixed: retiredOrHistorical.length,
  blockers: blockers.length,
}, null, 2));
