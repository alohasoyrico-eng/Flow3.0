const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const auditsDir = path.join(root, "docs/audits");
const jsonOut = path.join(auditsDir, "flowdocs-safe-cleanup-plan.json");
const mdOut = path.join(auditsDir, "flowdocs-safe-cleanup-plan.md");

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

function severityRank(value) {
  return { high: 0, medium: 1, low: 2 }[value] ?? 3;
}

const runtime = readJson("flowdocs-runtime-inventory.json");
const stale = readJson("flowdocs-stale-audit-classification.json");
const template = readJson("flowdocs-template-boundary.json");
const shell = readJson("flowdocs-shell-decision.json");
const demo = readJson("flowdocs-demo-boundary.json");
const content = readJson("flowdocs-content-source-of-truth.json");

const runtimeRows = runtime.rows ?? [];
const unreferencedRows = runtimeRows.filter((row) => row.reachable === false);
const flowDocsAppsRoot = path.resolve(root, "../FlowDocs/apps/docs");
const flowDocsRoot = path.resolve(root, "../FlowDocs");
const flowDocsTextFiles = runtimeRows
  .filter((row) => /\.(?:js|mjs|json|html|css|svg)$/.test(row.file))
  .map((row) => path.join(flowDocsAppsRoot, row.file))
  .filter((file) => fs.existsSync(file));

function walkTextFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkTextFiles(full);
    return /\.(?:js|mjs|json|html|css|svg|md)$/.test(full) ? [full] : [];
  });
}

const auditTextFiles = [
  ...walkTextFiles(path.join(flowDocsRoot, "audit")),
  ...walkTextFiles(path.join(root, "packages/audit/scripts")),
];
const flowDocsText = [...flowDocsTextFiles, ...auditTextFiles].map((file) => fs.readFileSync(file, "utf8")).join("\n");

function hasStringReference(file) {
  const basename = path.basename(file);
  return flowDocsText.includes(file) || flowDocsText.includes(basename);
}

const immediateDeleteCandidates = unreferencedRows
  .filter((row) => ["asset-unreferenced", "vendor-unreferenced", "generated-unreferenced", "source-orphan"].includes(row.status))
  .filter((row) => !hasStringReference(row.file))
  .map((row) => ({
    file: `../FlowDocs/apps/docs/${row.file}`,
    reason: row.status,
    action: row.status === "source-orphan" ? "verify owner, then remove or archive outside runtime" : "remove after one runtime smoke proves unused",
  }));

const protectedStringReferencedCandidates = unreferencedRows
  .filter((row) => ["asset-unreferenced", "vendor-unreferenced", "generated-unreferenced", "source-orphan"].includes(row.status))
  .filter((row) => hasStringReference(row.file))
  .map((row) => ({
    file: `../FlowDocs/apps/docs/${row.file}`,
    reason: row.status,
    action: "keep; referenced by runtime/build/audit string outside import graph",
  }));

const runtimeKeepRows = runtimeRows
  .filter((row) => row.reachable === true)
  .map((row) => ({
    file: `../FlowDocs/apps/docs/${row.file}`,
    reason: row.status,
    action: "keep for now; can only be changed through replacement by Flow consumer contract",
  }));

const htmlBoundaryFiles = template.flowdocsBoundary?.htmlBoundaryFiles ?? [];
const localRendererFiles = template.flowdocsBoundary?.localRendererFiles ?? [];
const localRendererByFile = new Map(localRendererFiles.map((row) => [row.file, row]));

const legacyQuarantineCandidates = htmlBoundaryFiles
  .filter((row) => {
    const runtimeRow = runtimeRows.find((candidate) => candidate.file === row.file);
    return runtimeRow?.reachable === true;
  })
  .map((row) => {
    const renderer = localRendererByFile.get(row.file);
    return {
      file: `../FlowDocs/apps/docs/${row.file}`,
      signals: row.total,
      owner: renderer?.exportedRenderers?.length ? "page-renderer" : "html-adapter",
      action: "rename/mark as LegacyHtmlPageSlot or LegacyHtmlTabSlot before replacement",
    };
  })
  .sort((a, b) => b.signals - a.signals);

const gateRewriteCandidates = [
  ...(stale.blockingFindings ?? []).map((item) => ({
    file: item.gate,
    severity: "high",
    issue: item.issue,
    action: item.action,
  })),
  ...(stale.classifications ?? [])
    .filter((item) => item.classification === "rewrite-before-gating")
    .map((item) => ({
      file: item.file,
      severity: "medium",
      issue: item.smells.join(", ") || item.classification,
      action: item.action,
    })),
].sort((a, b) => severityRank(a.severity) - severityRank(b.severity) || a.file.localeCompare(b.file));

const protectedRuntimeDebt = [
  {
    area: "Shell mutation",
    evidence: `${shell.totals?.innerHtmlWrites ?? 0} innerHTML writes, ${shell.totals?.querySelectors ?? 0} querySelector calls, ${shell.totals?.datasetMutations ?? 0} dataset mutations`,
    action: "do not delete; replace through DocsShell consumer adapter",
  },
  {
    area: "Template hybrid layer",
    evidence: `${template.flowdocsBoundary?.localRendererFiles?.length ?? 0} local renderer files and ${template.flowdocsBoundary?.htmlBoundaryFiles?.length ?? 0} HTML-boundary files`,
    action: "quarantine as legacy slots; replace page by page with template contracts",
  },
  {
    area: "Demo boundary",
    evidence: `${demo.summary?.flowdocsDemoRiskFiles ?? 0} FlowDocs demo risk files`,
    action: "keep as docs harness only; package behavior must be proven in package tests/local QA",
  },
  {
    area: "Content source",
    evidence: `${content.summary?.packageContentOutsideDocsBundle ?? 0} package content files outside docs bundle; ${content.summary?.localFlowDocsJsonFiles ?? 0} local FlowDocs JSON files`,
    action: "do not call bundle stale; classify non-docs bundle content before deletion",
  },
];

const cleanupOrder = [
  "Repair gates that reference stale or mixed ownership so cleanup results are trustworthy.",
  "Remove only unreferenced assets/generated artifacts/source orphans after one runtime smoke.",
  "Mark reachable HTML renderers as legacy adapters instead of deleting them.",
  "Replace home/collection/detail/reference templates with Flow consumer contracts.",
  "Only then remove legacy slots and local renderers.",
];

const report = {
  generatedAt: new Date().toISOString(),
  status: "action_required",
  decision: "cleanup-is-possible-but-most-debt-is-runtime-protected",
  totals: {
    immediateDeleteCandidates: immediateDeleteCandidates.length,
    protectedStringReferencedCandidates: protectedStringReferencedCandidates.length,
    runtimeKeepRows: runtimeKeepRows.length,
    legacyQuarantineCandidates: legacyQuarantineCandidates.length,
    gateRewriteCandidates: gateRewriteCandidates.length,
    protectedRuntimeDebt: protectedRuntimeDebt.length,
  },
  immediateDeleteCandidates,
  protectedStringReferencedCandidates,
  legacyQuarantineCandidates,
  gateRewriteCandidates,
  protectedRuntimeDebt,
  cleanupOrder,
};

fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = `# FlowDocs Safe Cleanup Plan

Status: **${report.status}**

Decision: **${report.decision}**

## Summary

- Immediate delete candidates: **${report.totals.immediateDeleteCandidates}**
- String-referenced candidates protected: **${report.totals.protectedStringReferencedCandidates}**
- Runtime files protected for now: **${report.totals.runtimeKeepRows}**
- Legacy quarantine candidates: **${report.totals.legacyQuarantineCandidates}**
- Gate rewrite candidates: **${report.totals.gateRewriteCandidates}**
- Protected runtime debt areas: **${report.totals.protectedRuntimeDebt}**

## Interpretation

Most FlowDocs debt is not safe to delete yet because it is still reachable runtime. The safe move is to quarantine reachable HTML renderers as explicit legacy slots, repair stale/mixed gates, and delete only unreferenced files after a smoke run.

## Cleanup Order

${cleanupOrder.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Immediate Delete Candidates

${mdTable(immediateDeleteCandidates, ["file", "reason", "action"])}

## String-Referenced Candidates Protected

${mdTable(protectedStringReferencedCandidates, ["file", "reason", "action"])}

## Legacy Quarantine Candidates

${mdTable(legacyQuarantineCandidates.slice(0, 30), ["file", "signals", "owner", "action"])}

## Gate Rewrite Candidates

${mdTable(gateRewriteCandidates, ["severity", "file", "issue", "action"])}

## Protected Runtime Debt

${mdTable(protectedRuntimeDebt, ["area", "evidence", "action"])}
`;

fs.writeFileSync(mdOut, md);

console.log(JSON.stringify({
  status: report.status,
  decision: report.decision,
  immediateDeleteCandidates: report.totals.immediateDeleteCandidates,
  protectedStringReferencedCandidates: report.totals.protectedStringReferencedCandidates,
  legacyQuarantineCandidates: report.totals.legacyQuarantineCandidates,
  gateRewriteCandidates: report.totals.gateRewriteCandidates,
  protectedRuntimeDebt: report.totals.protectedRuntimeDebt,
}, null, 2));
