#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const inputFile = path.join(root, "docs/forensics/system-remediation-matrix.json");
const outputDir = path.join(root, "docs/forensics");
const jsonOutput = path.join(outputDir, "system-p0-forensic-detail.json");
const markdownOutput = path.join(outputDir, "system-p0-forensic-detail.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function pascal(slug) {
  return String(slug)
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("");
}

function classifySurface(file) {
  const base = path.basename(file);
  if (file.includes("/styles/") || base.endsWith(".css")) return "docs-css-visual-surface";
  if (base.includes("interaction") || base === "doc-interactions.js" || base === "shell-controls.js") return "docs-dom-interaction";
  if (base === "docs-chrome.js" || base === "docs-layout.js" || base === "navigation.js" || base === "index.html") return "docs-shell";
  if (base.startsWith("gold-")) return "docs-component-detail-renderer";
  if (base.startsWith("pattern-")) return "docs-pattern-detail-renderer";
  if (base.startsWith("foundation-")) return "docs-foundation-detail-renderer";
  if (base.startsWith("primitive-")) return "docs-primitive-detail-renderer";
  if (base.includes("template")) return "docs-template-detail-renderer";
  if (base.includes("reference")) return "docs-reference-renderer";
  if (base.includes("home")) return "docs-home-renderer";
  return "docs-misc-surface";
}

function absoluteFromReportPath(file) {
  if (file.startsWith("../FlowDocs/")) {
    return path.resolve(root, file);
  }
  return path.resolve(root, file);
}

function lineEvidence(ticket, file) {
  const absolute = absoluteFromReportPath(file);
  if (!fs.existsSync(absolute)) return [];
  const needles = [
    ticket.slug,
    pascal(ticket.slug),
    ticket.slug.replace(/-/g, " "),
  ].map((value) => value.toLowerCase());
  return fs.readFileSync(absolute, "utf8")
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter((entry) => needles.some((needle) => entry.text.toLowerCase().includes(needle)))
    .slice(0, 3)
    .map((entry) => ({
      ...entry,
      text: entry.text.length > 180 ? `${entry.text.slice(0, 180)}...` : entry.text
    }));
}

function summarizeCategories(surfaces) {
  return surfaces.reduce((acc, surface) => {
    acc[surface.category] = (acc[surface.category] || 0) + 1;
    return acc;
  }, {});
}

function detailTicket(ticket) {
  const surfaces = ticket.docsHandSurfaceFiles.map((file) => ({
    file,
    category: classifySurface(file),
    evidence: lineEvidence(ticket, file)
  }));
  const categoryCounts = summarizeCategories(surfaces);
  const riskFlags = [
    ...(categoryCounts["docs-dom-interaction"] ? ["parallel DOM behavior risk"] : []),
    ...(categoryCounts["docs-css-visual-surface"] ? ["docs-only visual surface risk"] : []),
    ...(categoryCounts["docs-shell"] ? ["docs shell dependency risk"] : []),
    ...(ticket.layer === "primitive" && !ticket.runtime.flowJs ? ["missing primitive runtime"] : []),
    ...(ticket.layer !== "foundation" && !ticket.runtime.tsSource ? ["missing TypeScript source"] : [])
  ];
  return {
    id: ticket.id,
    layer: ticket.layer,
    slug: ticket.slug,
    priority: ticket.priority,
    status: ticket.status,
    docsHandSurfaceCount: ticket.docsHandSurfaceCount,
    categoryCounts,
    riskFlags,
    dependencies: ticket.dependencies,
    requiredWork: ticket.requiredWork,
    surfaces
  };
}

function renderMarkdown(report) {
  const summaryRows = report.tickets
    .map((ticket) => {
      const categories = Object.entries(ticket.categoryCounts)
        .map(([category, count]) => `${category}: ${count}`)
        .join("<br>");
      return `| ${ticket.id} | ${ticket.docsHandSurfaceCount} | ${ticket.riskFlags.join("<br>") || "None"} | ${categories || "None"} |`;
    })
    .join("\n");
  const shellRows = report.shellPatternTickets
    .map((ticket) => {
      const fileRows = ticket.surfaces
        .slice(0, 20)
        .map((surface) => `${surface.file} (${surface.category})`)
        .join("<br>");
      return `| ${ticket.id} | ${ticket.docsHandSurfaceCount} | ${fileRows} |`;
    })
    .join("\n");
  const foundationRows = report.foundationTickets
    .map((ticket) => `| ${ticket.id} | ${ticket.docsHandSurfaceCount} | ${ticket.riskFlags.join("<br>")} | ${Object.entries(ticket.categoryCounts).map(([category, count]) => `${category}: ${count}`).join("<br>")} |`)
    .join("\n");
  const primitiveRows = report.primitiveTickets
    .map((ticket) => `| ${ticket.id} | ${ticket.docsHandSurfaceCount} | ${ticket.riskFlags.join("<br>")} | ${Object.entries(ticket.categoryCounts).map(([category, count]) => `${category}: ${count}`).join("<br>")} |`)
    .join("\n");
  return [
    "# System P0 forensic detail",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a P0-only forensic detail report. It does not remediate implementation.",
    "",
    "## P0 summary",
    "",
    `- P0 tickets: ${report.tickets.length}`,
    `- Foundations: ${report.foundationTickets.length}`,
    `- Primitives: ${report.primitiveTickets.length}`,
    `- Shell patterns: ${report.shellPatternTickets.length}`,
    `- P0 docs hand surface files counted with duplicates per entity: ${report.totalDocsHandSurfaceRefs}`,
    "",
    "## P0 category matrix",
    "",
    "| Ticket | Docs hand files | Risk flags | Surface categories |",
    "| --- | ---: | --- | --- |",
    summaryRows,
    "",
    "## Shell pattern detail",
    "",
    "| Ticket | Docs hand files | First surface files |",
    "| --- | ---: | --- |",
    shellRows,
    "",
    "## Foundations detail",
    "",
    "| Ticket | Docs hand files | Risk flags | Surface categories |",
    "| --- | ---: | --- | --- |",
    foundationRows,
    "",
    "## Primitives detail",
    "",
    "| Ticket | Docs hand files | Risk flags | Surface categories |",
    "| --- | ---: | --- | --- |",
    primitiveRows,
    "",
    "## Read the JSON for line evidence",
    "",
    "The JSON companion includes line evidence for each listed file. Use it to classify each surface as consume Flow, docs-owned content, merge, or remove.",
    "",
  ].join("\n");
}

function main() {
  if (!fs.existsSync(inputFile)) {
    throw new Error("Run npm run audit:remediation-matrix before report-system-p0-forensic-detail.js");
  }
  const matrix = readJson(inputFile);
  const tickets = matrix.tickets.filter((ticket) => ticket.priority === "P0").map(detailTicket);
  const report = {
    schemaVersion: "flow-system-p0-forensic-detail@1",
    generatedAt: "2026-08-11",
    source: "docs/forensics/system-remediation-matrix.json",
    status: "forensic_detail_only",
    totalDocsHandSurfaceRefs: tickets.reduce((sum, ticket) => sum + ticket.docsHandSurfaceCount, 0),
    foundationTickets: tickets.filter((ticket) => ticket.layer === "foundation"),
    primitiveTickets: tickets.filter((ticket) => ticket.layer === "primitive"),
    shellPatternTickets: tickets.filter((ticket) => ticket.layer === "pattern" && ["topbar", "sidebar", "search"].includes(ticket.slug)),
    tickets
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    tickets: report.tickets.length,
    totalDocsHandSurfaceRefs: report.totalDocsHandSurfaceRefs,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput)
    ]
  }, null, 2));
}

main();
