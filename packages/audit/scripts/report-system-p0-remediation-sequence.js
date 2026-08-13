#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const inputFile = path.join(root, "docs/audits/system-p0-owner-decision-matrix.json");
const tokenSourceGatesFile = path.join(root, "docs/audits/system-p0-token-source-gates.json");
const primitiveRuntimeMatrixFile = path.join(root, "docs/audits/system-p0-primitive-runtime-matrix.json");
const shellPatternContractGovernanceFile = path.join(root, "docs/audits/shell-pattern-contract-governance-audit.json");
const flowDocsP0ShellCleanupEvidenceFile = path.join(root, "docs/audits/flowdocs-p0-shell-cleanup-evidence.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-p0-remediation-sequence.json");
const markdownOutput = path.join(outputDir, "system-p0-remediation-sequence.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function hasAction(ticket, action) {
  return Object.prototype.hasOwnProperty.call(ticket.surfaceActions, action);
}

function ticketIds(tickets) {
  return tickets.map((ticket) => ticket.id).sort();
}

function hotspotFiles(hotspots, matcher, limit = 20) {
  return hotspots
    .filter(matcher)
    .slice(0, limit)
    .map((hotspot) => ({
      file: hotspot.file,
      ticketCount: hotspot.ticketCount,
      recommendedActions: hotspot.recommendedActions
    }));
}

function phase(id, name, tickets, blockers, exitCriteria, hotspots = [], statusOverride) {
  return {
    id,
    name,
    status: statusOverride ?? (blockers.length ? "blocked" : "complete"),
    tickets: ticketIds(tickets),
    ticketCount: tickets.length,
    blockers,
    exitCriteria,
    hotspots
  };
}

function shellPatternsHaveTypedSource() {
  return ["Search", "Sidebar", "Topbar"].every((name) => {
    const source = path.join(root, "packages/react/src/patterns", `${name}.ts`);
    const tsxSource = path.join(root, "packages/react/src/patterns", `${name}.tsx`);
    return fs.existsSync(source) || fs.existsSync(tsxSource);
  });
}

function renderHotspots(hotspots) {
  if (!hotspots.length) return "None";
  return hotspots
    .map((hotspot) => `${hotspot.file} (${hotspot.ticketCount})`)
    .join("<br>");
}

function renderMarkdown(report) {
  const phaseRows = report.phases
    .map((item) => `| ${item.id} | ${item.name} | ${item.status} | ${item.ticketCount} | ${item.blockers.join("<br>") || "None"} | ${item.exitCriteria.join("<br>")} | ${renderHotspots(item.hotspots)} |`)
    .join("\n");
  const iterationRows = report.iterations
    .map((item) => `| ${item.iteration} | ${item.phase} | ${item.scope} | ${item.doneWhen.join("<br>")} |`)
    .join("\n");
  return [
    "# System P0 remediation sequence",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This sequence is the remediation order implied by the forensic evidence. It is not an implementation patch.",
    "",
    "## Why this order",
    "",
    "FlowDocs cleanup depends on shell patterns, shell patterns depend on components/primitives, and primitives depend on token/foundation source. P0.1-P0.3 are measured by source gates and primitive runtime gates; FlowDocs remains blocked until shell patterns and docs ownership are resolved.",
    "",
    "## Phases",
    "",
    "| Phase | Name | Status | Tickets | Blockers | Exit criteria | Hotspot files |",
    "| --- | --- | --- | ---: | --- | --- | --- |",
    phaseRows,
    "",
    "## Iteration plan",
    "",
    "| Iteration | Phase | Scope | Done when |",
    "| ---: | --- | --- | --- |",
    iterationRows,
    "",
    "## Non-negotiable gates before FlowDocs changes",
    "",
    "- Style Dictionary dependency and config exist.",
    "- Canonical token source is JSON, not CSS-derived.",
    "- Foundation outputs generate CSS variables and typed JS/TS exports.",
    "- Primitive runtime exists in TypeScript for P0 primitives, especially `surface`, `color`, `density`, `radius`, `elevation`, `focus`, `spacing`, `typography`.",
    "- `topbar`, `sidebar`, and `search` have stable Flow React contracts before docs shell consumes them.",
    "",
  ].join("\n");
}

function main() {
  if (!fs.existsSync(inputFile)) {
    throw new Error("Run npm run audit:p0-owner-decisions before report-system-p0-remediation-sequence.js");
  }
  const ownerMatrix = readJson(inputFile);
  const tokenSourceGates = fs.existsSync(tokenSourceGatesFile) ? readJson(tokenSourceGatesFile) : null;
  const primitiveRuntimeMatrix = fs.existsSync(primitiveRuntimeMatrixFile) ? readJson(primitiveRuntimeMatrixFile) : null;
  const shellPatternContractGovernance = fs.existsSync(shellPatternContractGovernanceFile) ? readJson(shellPatternContractGovernanceFile) : null;
  const flowDocsP0ShellCleanupEvidence = fs.existsSync(flowDocsP0ShellCleanupEvidenceFile) ? readJson(flowDocsP0ShellCleanupEvidenceFile) : null;
  const p01Complete = tokenSourceGates?.status === "PASS";
  const p02Complete = primitiveRuntimeMatrix?.totals?.missingP0Runtime === 0;
  const p03Complete = primitiveRuntimeMatrix?.totals?.jsRuntimeOnly === 0
    && primitiveRuntimeMatrix?.totals?.policyOrNonRuntimeDecisionNeeded === 0;
  const p04ShellTypedSource = shellPatternsHaveTypedSource();
  const p04ShellGoverned = shellPatternContractGovernance?.status === "pass"
    && shellPatternContractGovernance?.inventory?.shellPatternContractDebt === 0;
  const p05FlowDocsShellCleanupComplete = flowDocsP0ShellCleanupEvidence?.status === "pass"
    && flowDocsP0ShellCleanupEvidence?.inventory?.failures === 0;
  const tickets = ownerMatrix.decisionTickets;
  const foundations = tickets.filter((ticket) => ticket.layer === "foundation");
  const primitives = tickets.filter((ticket) => ticket.layer === "primitive");
  const missingRuntimePrimitives = primitives.filter((ticket) => ticket.blockers.includes("missing primitive runtime"));
  const existingRuntimePrimitives = primitives.filter((ticket) => !ticket.blockers.includes("missing primitive runtime"));
  const shellPatterns = tickets.filter((ticket) => ticket.layer === "pattern");
  const tokenHotspots = hotspotFiles(
    ownerMatrix.fileHotspots,
    (hotspot) => Object.keys(hotspot.recommendedActions).some((action) => action === "promote_or_map_to_token_source"),
  );
  const primitiveHotspots = hotspotFiles(
    ownerMatrix.fileHotspots,
    (hotspot) => Object.keys(hotspot.recommendedActions).some((action) => action.includes("primitive")),
  );
  const shellHotspots = hotspotFiles(
    ownerMatrix.fileHotspots,
    (hotspot) => Object.keys(hotspot.recommendedActions).some((action) => action === "block_on_shell_pattern_contract" || action === "replace_with_flow_react_behavior_or_mark_docs_shell_only"),
  );
  const docsCleanupHotspots = hotspotFiles(
    ownerMatrix.fileHotspots,
    (hotspot) => Object.keys(hotspot.recommendedActions).some((action) => action.includes("delete_duplicate") || action === "replace_with_flow_visual_contract"),
  );
  const p05LowerLayersReady = p01Complete && p02Complete && p03Complete && p04ShellTypedSource && p04ShellGoverned;
  const p05RemainingHotspots = docsCleanupHotspots.length > 0;
  const p05Status = p05FlowDocsShellCleanupComplete && p05RemainingHotspots
    ? "in_progress"
    : p05FlowDocsShellCleanupComplete
      ? "complete"
      : p05LowerLayersReady
        ? "ready"
        : undefined;

  const phases = [
    phase(
      "P0.1",
      "Style Dictionary foundation source",
      foundations,
      p01Complete ? [] : ["source is bootstrapped from legacy CSS and must be curated into foundation families", "foundation contracts still need typed source ownership"],
      [
        "token source is canonical JSON",
        "foundation contracts have typed source",
        "CSS variables are generated output, not source",
        "docs visual tokens can map to generated outputs"
      ],
      tokenHotspots
    ),
    phase(
      "P0.2",
      "Typed primitive runtime for missing primitives",
      missingRuntimePrimitives,
      p02Complete ? [] : ["foundation source must exist", "zero TS source", "missing P0 primitive runtime"],
      [
        "missing primitives have TS runtime or explicit non-runtime decision",
        "surface/color/density/radius/elevation/focus/spacing/typography are available to higher layers",
        "runtime without spec is classified"
      ],
      primitiveHotspots
    ),
    phase(
      "P0.3",
      "Convert existing primitive runtimes to TS contracts",
      existingRuntimePrimitives,
      p03Complete ? [] : ["zero TS source", "asset primitive ownership unclear"],
      [
        "existing JS primitive runtimes are TS-authored or explicitly docs/asset-owned",
        "asset primitives have export/ownership policy",
        "generated types are derived from implementation"
      ]
    ),
    phase(
      "P0.4",
      "Shell pattern contracts",
      shellPatterns,
      [
        ...(!(p02Complete && p03Complete) ? ["primitive cascade must exist"] : []),
        ...(!p04ShellTypedSource ? ["zero TS source in shell patterns"] : []),
        ...(!p04ShellGoverned ? ["shell pattern contract governance must pass"] : [])
      ],
      [
        "topbar/sidebar/search contracts are TS-authored",
        "docs shell behavior can consume Flow shell contracts",
        "hamburger/search/dark-mode responsibilities are assigned to Flow or docs shell explicitly"
      ],
      shellHotspots
    ),
    phase(
      "P0.5",
      "FlowDocs P0 duplicate cleanup",
      tickets,
      (p05FlowDocsShellCleanupComplete && !p05RemainingHotspots) ? [] : [
        ...(p05LowerLayersReady ? [] : ["P0.1-P0.4 must be complete"]),
        ...(!p05FlowDocsShellCleanupComplete ? ["FlowDocs P0 shell cleanup evidence must pass"] : []),
        ...(p05FlowDocsShellCleanupComplete && p05RemainingHotspots ? ["FlowDocs non-shell duplicate/template/style hotspots remain"] : []),
      ],
      [
        "P0 docs surfaces are consume Flow, docs-owned content, merged, or removed",
        "no P0 file is hand-implementing missing lower-layer behavior",
        "forensic gates show reduced docs-hand-authored P0 count"
      ],
      docsCleanupHotspots,
      p05Status
    )
  ];

  const iterations = [
    {
      iteration: 1,
      phase: "P0.1",
      scope: "Install/configure Style Dictionary and define canonical token source shape.",
      doneWhen: ["dependency/config exists", "source direction is JSON to outputs", "old CSS-derived contract is marked transitional", "forensic gate style-dictionary-real passes"]
    },
    {
      iteration: 2,
      phase: "P0.1",
      scope: "Map foundation outputs and migrate token hotspot classes to generated token references.",
      doneWhen: ["foundation source covers color/radius/spacing/elevation/density/focus basics", "foundation gate can distinguish source vs docs content"]
    },
    {
      iteration: 3,
      phase: "P0.2",
      scope: "Create typed primitive runtime for surface, color, density, radius, elevation, focus.",
      doneWhen: ["P0 visual primitives have TS exports", "components/patterns can import primitive contracts"]
    },
    {
      iteration: 4,
      phase: "P0.2-P0.3",
      scope: "Create or type remaining P0 primitives and classify asset primitives.",
      doneWhen: ["all P0 primitives have runtime or explicit non-runtime owner decision", "country-options is resolved"]
    },
    {
      iteration: 5,
      phase: "P0.4",
      scope: "Audit and type topbar/sidebar/search Flow contracts against docs shell requirements.",
      doneWhen: ["shell pattern behavior is owned by Flow or explicitly docs-shell", "parallel DOM handlers are listed for removal/replacement"]
    },
    {
      iteration: 6,
      phase: "P0.5",
      scope: "Clean FlowDocs P0 shell and renderer duplicates only where lower-layer contracts now exist.",
      doneWhen: ["P0 owner decisions are applied", "audit:p0-owner-decisions shows reduced hotspots", "FlowDocs shell does not invent primitives/pattern behavior"]
    }
  ];

  const report = {
    schemaVersion: "flow-system-p0-remediation-sequence@1",
    generatedAt: "2026-08-11",
    source: "docs/audits/system-p0-owner-decision-matrix.json",
    status: "sequence_only",
    completedPrerequisites: {
      p01Complete,
      p02Complete,
      p03Complete,
      p04ShellTypedSource,
      p04ShellGoverned,
      p05FlowDocsShellCleanupComplete,
    },
    phaseCount: phases.length,
    iterationCount: iterations.length,
    phases,
    iterations
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    phases: report.phaseCount,
    iterations: report.iterationCount,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput)
    ]
  }, null, 2));
}

main();
