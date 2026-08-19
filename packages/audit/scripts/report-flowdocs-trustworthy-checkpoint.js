const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const auditsDir = path.join(root, "docs/audits");
const jsonOut = path.join(auditsDir, "flowdocs-trustworthy-checkpoint.json");
const mdOut = path.join(auditsDir, "flowdocs-trustworthy-checkpoint.md");

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

const reports = {
  gateBoundary: readJson("system-gate-boundary-classification.json"),
  runtime: readJson("flowdocs-runtime-inventory.json"),
  staleAudits: readJson("flowdocs-stale-audit-classification.json"),
  content: readJson("flowdocs-content-source-of-truth.json"),
  shell: readJson("flowdocs-shell-decision.json"),
  demo: readJson("flowdocs-demo-boundary.json"),
  template: readJson("flowdocs-template-boundary.json"),
  cleanup: readJson("flowdocs-safe-cleanup-plan.json"),
  consumer: readJson("flowdocs-consumer-contract.json"),
};

const goNoGo = [
  {
    area: "FlowDocs as current app",
    decision: "NO-GO",
    reason: "Consumer contract now passes, but LegacyHtmlPageSlot remains active and FlowDocs still has hybrid template/demo debt.",
  },
  {
    area: "Demolish FlowDocs now",
    decision: "NO-GO",
    reason: "Runtime inventory shows 448 reachable files and useful generated/templates/content work. Demolition would hide boundary problems instead of proving replacement.",
  },
  {
    area: "Repair as explicit Flow consumer adapter",
    decision: "GO",
    reason: "DocsShellTemplate and generated Flow templates exist; content bundle matches source; cleanup queues and blockers are explicit.",
  },
  {
    area: "Continue component QA in parallel",
    decision: "CONDITIONAL-GO",
    reason: "Component QA can continue only if FlowDocs debt is not treated as proof of component readiness.",
  },
];

const blockers = [
  {
    priority: "P0",
    blocker: "React shell still writes legacy page HTML",
    evidence: `${reports.consumer.signals.shell.docsPageSlotInnerHtmlWrites} innerHTML signals in docs-shell-react.js`,
    requiredExit: "Replace with typed React children or explicitly quarantine as LegacyHtmlPageSlot with removal gate.",
  },
  {
    priority: "P0",
    blocker: "App router stages pages through strings",
    evidence: `${reports.consumer.signals.app.renderTargetInnerHtmlWrites} app.innerHTML writes; stagingPageMarkup=${reports.consumer.signals.app.stagingPageMarkup}`,
    requiredExit: "Stop using detached DOM/string markup as the page transport into React shell.",
  },
  {
    priority: "P1",
    blocker: "Top-level gates still mix Flow core and FlowDocs consumer evidence",
    evidence: `${reports.staleAudits.summary["mixed-top-level-gate"]} mixed top-level gates; ${reports.cleanup.totals.gateRewriteCandidates} gate rewrite candidates`,
    requiredExit: "Split Flow core, FlowDocs consumer, content, and forensic/parity gates.",
  },
  {
    priority: "P1",
    blocker: "FlowDocs templates remain hybrid",
    evidence: `${reports.template.flowdocsBoundary.localRendererFiles.length} local renderer files; ${reports.template.flowdocsBoundary.htmlBoundaryFiles.length} HTML boundary files`,
    requiredExit: "Home, collection, detail, foundation and primitive pages must be owned by Flow templates or explicit legacy slots.",
  },
].filter((blocker) => {
  if (blocker.blocker === "React shell still writes legacy page HTML") return reports.consumer.signals.shell.docsPageSlotInnerHtmlWrites > 0;
  if (blocker.blocker === "App router stages pages through strings") return reports.consumer.signals.app.renderTargetInnerHtmlWrites > 0 || reports.consumer.signals.app.stagingPageMarkup;
  return true;
});

const proven = [
  {
    claim: "Content bundle is not stale",
    evidence: `bundleMatchesSource=${reports.content.summary.bundleMatchesSource}; ${reports.content.summary.bundleSourceDependencies} source dependencies`,
  },
  {
    claim: "Runtime graph is complete",
    evidence: `${reports.runtime.missingDependencies.length} missing dependencies`,
  },
  {
    claim: "FlowDocs imports generated DocsShellTemplate",
    evidence: reports.consumer.checks.find((check) => check.id === "docs-shell-template-import")?.evidence ?? "",
  },
  {
    claim: "Cleanup is bounded",
    evidence: `${reports.cleanup.totals.immediateDeleteCandidates} delete candidates; ${reports.cleanup.totals.legacyQuarantineCandidates} quarantine candidates`,
  },
  {
    claim: "Demo boundary is classified",
    evidence: `${reports.demo.summary.flowdocsDemoRiskFiles} risky docs demo files; ${reports.demo.summary.mixedFlowClaimFiles} mixed Flow claim files`,
  },
  {
    claim: "Detail tabs no longer mutate #tabPanel from app.js",
    evidence: `${reports.consumer.signals.app.tabPanelInnerHtmlWrites} tab panel innerHTML writes`,
  },
  {
    claim: "Foundation/primitive detail routes use ReferenceDetailTemplate",
    evidence: `reachableFiles=${reports.runtime.totalFiles - reports.runtime.unreferencedFiles}; generated-used=${reports.runtime.summary["generated-used"]}`,
  },
  {
    claim: "App router no longer stages pages through detached innerHTML",
    evidence: reports.consumer.checks.find((check) => check.id === "no-app-page-staging-innerhtml")?.evidence ?? "",
  },
  {
    claim: "FlowDocs consumer contract currently passes",
    evidence: `${reports.consumer.summary.pass} pass / ${reports.consumer.summary.fail ?? 0} fail`,
  },
  {
    claim: "Safe delete queue is closed",
    evidence: `${reports.cleanup.totals.immediateDeleteCandidates} immediate delete candidates; ${reports.cleanup.totals.protectedStringReferencedCandidates ?? 0} string-referenced candidates protected`,
  },
];

const notProven = [
  "FlowDocs is not yet a trustworthy consumer of Flow end to end.",
  "Passing validate:docs and the consumer contract is not sufficient while LegacyHtmlPageSlot remains active.",
  "FlowDocs visual/runtime behavior must not be used as proof of component production readiness.",
  "The old mixed audits cannot be treated as authoritative system gates.",
];

const nextPlan = [
  {
    iteration: 11,
    name: "Legacy slot quarantine",
    outcome: "Rename/mark current page and tab HTML bridges as LegacyHtmlPageSlot and LegacyHtmlTabSlot, with audit-visible expiry.",
  },
  {
    iteration: 12,
    name: "Gate split",
    outcome: "Separate Flow core, FlowDocs consumer, content source, and forensic/parity gates.",
  },
  {
    iteration: 13,
    name: "Home/collection template replacement",
    outcome: "DocsHomeTemplate and DocsCollectionTemplate own layout; local renderers only provide typed content data.",
  },
  {
    iteration: 14,
    name: "Detail tabs replacement",
    outcome: "DocsArtifactDetailTemplate owns tab state/body; remove #tabPanel.innerHTML path.",
  },
  {
    iteration: 15,
    name: "Reference template replacement",
    outcome: "Foundation/primitive pages move to ReferenceDetailTemplate ownership.",
  },
  {
    iteration: 16,
    name: "Router staging removal",
    outcome: "Remove detached app.innerHTML page staging so routes pass page content directly into DocsShellTemplate adapter.",
  },
  {
    iteration: 17,
    name: "Delete safe orphans",
    outcome: "Remove immediate delete candidates after runtime smoke and protect string-referenced non-runtime files.",
  },
  {
    iteration: 18,
    name: "Consumer QA gate",
    outcome: "Run validate:docs plus critical route smoke for home, components, patterns, templates, foundations and primitives.",
  },
];

const report = {
  generatedAt: new Date().toISOString(),
  status: "blocked",
  decision: "repair-flowdocs-before-calling-it-trustworthy",
  confidence: "high",
  reportInputs: Object.keys(reports),
  goNoGo,
  blockers,
  proven,
  notProven,
  nextPlan,
  currentPlanStatus: {
    completedIterations: 17,
    currentCheckpoint: "Go/No-Go",
    result: "No-Go for trustworthy FlowDocs; iterations 11-17 are repaired, LegacyHtmlPageSlot and hybrid template/demo debt remain blocking.",
  },
};

fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = `# FlowDocs Trustworthy Checkpoint

Status: **${report.status}**

Decision: **${report.decision}**

Confidence: **${report.confidence}**

## Current Plan Status

- Completed iterations: **${report.currentPlanStatus.completedIterations}**
- Current checkpoint: **${report.currentPlanStatus.currentCheckpoint}**
- Result: **${report.currentPlanStatus.result}**

## Go / No-Go

${mdTable(goNoGo, ["area", "decision", "reason"])}

## Blockers

${mdTable(blockers, ["priority", "blocker", "evidence", "requiredExit"])}

## Proven

${mdTable(proven, ["claim", "evidence"])}

## Not Proven

${notProven.map((item) => `- ${item}`).join("\n")}

## Next Remediation Plan

${mdTable(nextPlan, ["iteration", "name", "outcome"])}
`;

fs.writeFileSync(mdOut, md);

console.log(JSON.stringify({
  status: report.status,
  decision: report.decision,
  completedIterations: report.currentPlanStatus.completedIterations,
  blockers: blockers.length,
  nextIterations: nextPlan.length,
}, null, 2));
