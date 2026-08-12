#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const inputFile = path.join(root, "docs/audits/system-p0-forensic-detail.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-p0-owner-decision-matrix.json");
const markdownOutput = path.join(outputDir, "system-p0-owner-decision-matrix.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function actionForSurface(ticket, surface) {
  if (surface.category === "docs-css-visual-surface") {
    if (ticket.layer === "foundation" || ticket.layer === "primitive") {
      return "promote_or_map_to_token_source";
    }
    return "replace_with_flow_visual_contract";
  }
  if (surface.category === "docs-dom-interaction") return "replace_with_flow_react_behavior_or_mark_docs_shell_only";
  if (surface.category === "docs-shell") return "block_on_shell_pattern_contract";
  if (surface.category === "docs-component-detail-renderer") return "move_to_component_detail_template_slot_or_delete_duplicate";
  if (surface.category === "docs-pattern-detail-renderer") return "move_to_pattern_detail_template_slot_or_delete_duplicate";
  if (surface.category === "docs-foundation-detail-renderer") return "keep_as_docs_content_only_after_foundation_source_exists";
  if (surface.category === "docs-primitive-detail-renderer") return "keep_as_docs_content_only_after_primitive_source_exists";
  if (surface.category === "docs-template-detail-renderer") return "move_to_template_detail_template_slot_or_delete_duplicate";
  if (surface.category === "docs-reference-renderer") return "classify_as_reference_content_or_remove_visual_logic";
  if (surface.category === "docs-home-renderer") return "classify_as_docs_home_content_or_remove_visual_logic";
  return "manual_owner_decision_required";
}

function ticketOwnerDecision(ticket) {
  if (ticket.layer === "foundation") return "create_style_dictionary_foundation_source_before_docs_cleanup";
  if (ticket.layer === "primitive") return "create_typed_primitive_runtime_before_docs_cleanup";
  if (ticket.layer === "pattern" && ["topbar", "sidebar", "search"].includes(ticket.slug)) {
    return "stabilize_shell_pattern_contract_before_flowdocs_shell_cleanup";
  }
  return "manual_owner_decision_required";
}

function ticketBlockers(ticket) {
  return [
    ...ticket.riskFlags,
    ...ticket.dependencies.filter((dependency) => [
      "style-dictionary-real",
      "typescript-source-real",
      "primitive-cascade-runtime"
    ].includes(dependency)).map((dependency) => `dependency:${dependency}`)
  ];
}

function buildFileHotspots(tickets) {
  const files = new Map();
  for (const ticket of tickets) {
    for (const surface of ticket.surfaces) {
      if (!files.has(surface.file)) {
        files.set(surface.file, {
          file: surface.file,
          ticketCount: 0,
          tickets: [],
          categories: {},
          recommendedActions: {}
        });
      }
      const row = files.get(surface.file);
      row.ticketCount += 1;
      row.tickets.push(ticket.id);
      row.categories[surface.category] = (row.categories[surface.category] || 0) + 1;
      const action = actionForSurface(ticket, surface);
      row.recommendedActions[action] = (row.recommendedActions[action] || 0) + 1;
    }
  }
  return [...files.values()]
    .map((row) => ({
      ...row,
      tickets: [...new Set(row.tickets)].sort()
    }))
    .sort((a, b) => b.ticketCount - a.ticketCount || a.file.localeCompare(b.file));
}

function buildDecisionTickets(tickets) {
  return tickets.map((ticket) => {
    const surfaceActions = {};
    for (const surface of ticket.surfaces) {
      const action = actionForSurface(ticket, surface);
      surfaceActions[action] = (surfaceActions[action] || 0) + 1;
    }
    return {
      id: ticket.id,
      layer: ticket.layer,
      slug: ticket.slug,
      ownerDecision: ticketOwnerDecision(ticket),
      status: "decision_required",
      blockers: ticketBlockers(ticket),
      docsHandSurfaceCount: ticket.docsHandSurfaceCount,
      categoryCounts: ticket.categoryCounts,
      surfaceActions,
      firstFiles: ticket.surfaces.slice(0, 20).map((surface) => ({
        file: surface.file,
        category: surface.category,
        action: actionForSurface(ticket, surface),
        evidence: surface.evidence
      })),
      acceptanceBeforeRemediation: [
        "ownerDecision is no longer undecided",
        "source-of-truth layer is explicit",
        "duplicated docs surfaces have an action",
        "runtime dependency blockers are acknowledged",
        "cleanup order does not require lower-layer behavior that does not exist yet"
      ]
    };
  });
}

function renderObjectCounts(value) {
  return Object.entries(value)
    .map(([key, count]) => `${key}: ${count}`)
    .join("<br>");
}

function renderMarkdown(report) {
  const decisionRows = report.decisionTickets
    .map((ticket) => `| ${ticket.id} | ${ticket.ownerDecision} | ${ticket.docsHandSurfaceCount} | ${renderObjectCounts(ticket.surfaceActions) || "None"} |`)
    .join("\n");
  const hotspotRows = report.fileHotspots
    .slice(0, 40)
    .map((hotspot) => `| ${hotspot.file} | ${hotspot.ticketCount} | ${renderObjectCounts(hotspot.categories)} | ${renderObjectCounts(hotspot.recommendedActions)} |`)
    .join("\n");
  const shellRows = report.decisionTickets
    .filter((ticket) => ticket.layer === "pattern")
    .map((ticket) => `| ${ticket.id} | ${ticket.ownerDecision} | ${ticket.blockers.join("<br>")} | ${renderObjectCounts(ticket.surfaceActions)} |`)
    .join("\n");
  return [
    "# System P0 owner decision matrix",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report converts P0 forensic evidence into owner-decision actions. It is still analysis only.",
    "",
    "## Summary",
    "",
    `- P0 decision tickets: ${report.decisionTickets.length}`,
    `- Unique hotspot files: ${report.fileHotspots.length}`,
    `- Total surface refs: ${report.totalSurfaceRefs}`,
    "",
    "## P0 decisions",
    "",
    "| Ticket | Required owner decision | Surface refs | Surface actions |",
    "| --- | --- | ---: | --- |",
    decisionRows,
    "",
    "## Top file hotspots",
    "",
    "| File | P0 ticket refs | Categories | Recommended actions |",
    "| --- | ---: | --- | --- |",
    hotspotRows,
    "",
    "## Shell pattern decisions",
    "",
    "| Ticket | Required owner decision | Blockers | Surface actions |",
    "| --- | --- | --- | --- |",
    shellRows,
    "",
    "## Interpretation",
    "",
    "The correct next remediation order is not docs cleanup first. It is token/foundation source, primitive runtime, then shell pattern contracts, then docs shell cleanup. Otherwise FlowDocs will keep inventing missing lower-layer behavior.",
    "",
  ].join("\n");
}

function main() {
  if (!fs.existsSync(inputFile)) {
    throw new Error("Run npm run audit:p0-forensic-detail before report-system-p0-owner-decision-matrix.js");
  }
  const detail = readJson(inputFile);
  const decisionTickets = buildDecisionTickets(detail.tickets);
  const fileHotspots = buildFileHotspots(detail.tickets);
  const report = {
    schemaVersion: "flow-system-p0-owner-decision-matrix@1",
    generatedAt: "2026-08-11",
    source: "docs/audits/system-p0-forensic-detail.json",
    status: "owner_decision_required",
    totalSurfaceRefs: detail.totalDocsHandSurfaceRefs,
    decisionTickets,
    fileHotspots
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    decisionTickets: report.decisionTickets.length,
    fileHotspots: report.fileHotspots.length,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput)
    ]
  }, null, 2));
}

main();
