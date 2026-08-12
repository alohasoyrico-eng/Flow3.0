#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const gatesFile = path.join(root, "docs/audits/system-forensic-gates.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-remediation-matrix.json");
const markdownOutput = path.join(outputDir, "system-remediation-matrix.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function priorityFor(entity) {
  if (entity.layer === "foundation" || entity.layer === "primitive") return "P0";
  if (entity.layer === "pattern" && ["topbar", "sidebar", "search"].includes(entity.slug)) return "P0";
  if (entity.layer === "template") return "P1";
  if (entity.gates.docsHandSurfaceCount >= 100) return "P1";
  if (!entity.gates.hasTypescriptSource) return "P1";
  return "P2";
}

function ownerDecisionOptions(entity) {
  const common = [
    "system_owned",
    "docs_owned",
    "merge_into_existing_system_entity",
    "remove_duplicate_surface",
    "block_until_dependency_ready"
  ];
  if (entity.layer === "foundation") return ["style_dictionary_source", "typed_foundation_contract", ...common];
  if (entity.layer === "primitive") return ["primitive_runtime_source", "primitive_token_source", ...common];
  return common;
}

function dependencyChain(entity) {
  if (entity.layer === "foundation") return ["style-dictionary-real", "typescript-source-real"];
  if (entity.layer === "primitive") return ["style-dictionary-real", "typescript-source-real", "foundation-contracts"];
  if (entity.layer === "component") return ["style-dictionary-real", "typescript-source-real", "primitive-cascade-runtime"];
  if (entity.layer === "pattern") return ["style-dictionary-real", "typescript-source-real", "primitive-cascade-runtime", "component-runtime-contracts"];
  if (entity.layer === "template") return ["style-dictionary-real", "typescript-source-real", "primitive-cascade-runtime", "component-runtime-contracts", "pattern-runtime-contracts"];
  return [];
}

function requiredWork(entity) {
  const work = [];
  if (!entity.gates.hasRuntime) {
    if (entity.layer === "foundation") work.push("define canonical token/foundation source; no ad hoc docs-only visual behavior");
    else work.push("create or promote Flow runtime for this entity");
  }
  if (!entity.gates.hasTypescriptSource) work.push("convert implementation contract to real TypeScript source, not JS plus .d.ts");
  if (entity.gates.docsHandSurfaceCount > 0) work.push("classify each docs hand-authored surface as consume Flow, docs-only content, merge, or delete");
  if (!entity.gates.hasDocsGeneratedRuntime && ["component", "pattern", "template"].includes(entity.layer)) {
    work.push("ensure FlowDocs generated runtime consumes Flow export");
  }
  if (entity.layer === "primitive") work.push("map foundation/token dependency before component consumption");
  if (entity.layer === "pattern") work.push("prove composition uses Flow primitives/components without parallel DOM behavior");
  if (entity.layer === "template") work.push("prove complete cascade foundation -> primitive -> component -> pattern -> template");
  return work;
}

function statusFor(entity) {
  if (!entity.gates.hasRuntime || !entity.gates.hasTypescriptSource) return "blocked";
  if (entity.gates.docsHandSurfaceCount > 0) return "needs_owner_decision";
  return "ready_for_verification";
}

function ticketFor(entity) {
  return {
    id: `${entity.layer}:${entity.slug}`,
    layer: entity.layer,
    slug: entity.slug,
    priority: priorityFor(entity),
    status: statusFor(entity),
    sourceOfTruth: entity.sourceOfTruth,
    runtime: entity.runtime,
    duplicateSurfaces: entity.duplicateSurfaces,
    docsHandSurfaceCount: entity.gates.docsHandSurfaceCount,
    docsHandSurfaceFiles: entity.gates.docsHandSurfaceFiles || [],
    dependencies: dependencyChain(entity),
    ownerDecision: "undecided",
    ownerDecisionOptions: ownerDecisionOptions(entity),
    requiredWork: requiredWork(entity),
    acceptanceCriteria: [
      "source of truth is explicit",
      "no second visual/conceptual implementation remains without owner decision",
      "TypeScript source exists where runtime exists",
      "docs consume Flow or are explicitly marked docs-owned content",
      "gate can be rerun and produce stable evidence"
    ]
  };
}

function summarize(tickets) {
  const byLayer = {};
  for (const ticket of tickets) {
    byLayer[ticket.layer] ||= {
      total: 0,
      P0: 0,
      P1: 0,
      P2: 0,
      blocked: 0,
      needsOwnerDecision: 0,
      docsHandSurfaces: 0
    };
    const row = byLayer[ticket.layer];
    row.total += 1;
    row[ticket.priority] += 1;
    if (ticket.status === "blocked") row.blocked += 1;
    if (ticket.status === "needs_owner_decision") row.needsOwnerDecision += 1;
    row.docsHandSurfaces += ticket.docsHandSurfaceCount;
  }
  return byLayer;
}

function renderMarkdown(report) {
  const layerRows = Object.entries(report.summary.byLayer)
    .map(([layer, row]) => `| ${layer} | ${row.total} | ${row.P0} | ${row.P1} | ${row.P2} | ${row.blocked} | ${row.needsOwnerDecision} | ${row.docsHandSurfaces} |`)
    .join("\n");
  const p0Rows = report.tickets
    .filter((ticket) => ticket.priority === "P0")
    .map((ticket) => `| ${ticket.id} | ${ticket.status} | ${ticket.docsHandSurfaceCount} | ${ticket.dependencies.join(", ")} | ${ticket.requiredWork.join("<br>")} |`)
    .join("\n");
  const foundationRows = report.tickets
    .filter((ticket) => ticket.layer === "foundation")
    .map((ticket) => `| ${ticket.slug} | ${ticket.status} | ${ticket.docsHandSurfaceCount} | ${ticket.requiredWork.join("<br>")} |`)
    .join("\n");
  const primitiveRows = report.tickets
    .filter((ticket) => ticket.layer === "primitive")
    .map((ticket) => `| ${ticket.slug} | ${ticket.status} | ${ticket.runtime.flowJs ? "yes" : "no"} | ${ticket.docsHandSurfaceCount} | ${ticket.requiredWork.join("<br>")} |`)
    .join("\n");
  return [
    "# System remediation matrix",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This matrix turns the forensic gates into owner-decision tickets. It is not a remediation patch.",
    "",
    "## Summary",
    "",
    `- Total tickets: ${report.summary.totalTickets}`,
    `- P0 tickets: ${report.summary.priorities.P0}`,
    `- P1 tickets: ${report.summary.priorities.P1}`,
    `- P2 tickets: ${report.summary.priorities.P2}`,
    `- Undecided owner decisions: ${report.summary.undecidedOwnerDecisions}`,
    "",
    "## By layer",
    "",
    "| Layer | Total | P0 | P1 | P2 | Blocked | Needs owner decision | Docs hand surface files |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    layerRows,
    "",
    "## P0 queue",
    "",
    "| Ticket | Status | Docs hand files | Dependencies | Required work |",
    "| --- | --- | ---: | --- | --- |",
    p0Rows,
    "",
    "## Foundations 1:1",
    "",
    "| Foundation | Status | Docs hand files | Required work |",
    "| --- | --- | ---: | --- |",
    foundationRows,
    "",
    "## Primitives 1:1",
    "",
    "| Primitive | Status | Flow runtime | Docs hand files | Required work |",
    "| --- | --- | --- | ---: | --- |",
    primitiveRows,
    "",
    "## How to use this matrix",
    "",
    "1. Do not start remediation for an entity until `ownerDecision` is set.",
    "2. Start with P0 foundations/primitives and shell patterns because every higher layer depends on them.",
    "3. Use the JSON file for the full file-level evidence; Markdown intentionally summarizes the highest-signal queues.",
    "",
  ].join("\n");
}

function main() {
  if (!fs.existsSync(gatesFile)) {
    throw new Error("Run npm run audit:forensic-gates before report-system-remediation-matrix.js");
  }
  const gates = readJson(gatesFile);
  const tickets = gates.entities.map(ticketFor);
  const priorities = {
    P0: tickets.filter((ticket) => ticket.priority === "P0").length,
    P1: tickets.filter((ticket) => ticket.priority === "P1").length,
    P2: tickets.filter((ticket) => ticket.priority === "P2").length
  };
  const report = {
    schemaVersion: "flow-system-remediation-matrix@1",
    generatedAt: "2026-08-11",
    source: "docs/audits/system-forensic-gates.json",
    status: "planning_only",
    summary: {
      totalTickets: tickets.length,
      priorities,
      undecidedOwnerDecisions: tickets.filter((ticket) => ticket.ownerDecision === "undecided").length,
      byLayer: summarize(tickets)
    },
    gates: gates.gates,
    docsOnlyCandidates: gates.docsOnlyCandidates,
    tickets
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    totalTickets: report.summary.totalTickets,
    priorities: report.summary.priorities,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput)
    ]
  }, null, 2));
}

main();
