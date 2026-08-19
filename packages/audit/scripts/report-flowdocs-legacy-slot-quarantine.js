const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const flowDocsRoot = path.resolve(root, "../FlowDocs/apps/docs");
const auditsDir = path.join(root, "docs/audits");
const jsonOut = path.join(auditsDir, "flowdocs-legacy-slot-quarantine.json");
const mdOut = path.join(auditsDir, "flowdocs-legacy-slot-quarantine.md");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function mdTable(rows, columns) {
  if (!rows.length) return "_No rows._";
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(row[column] ?? "").replaceAll("\n", "<br>")).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

const files = [
  {
    file: "docs-shell-react.js",
    source: read(path.join(flowDocsRoot, "docs-shell-react.js")),
  },
  {
    file: "template-react-islands.js",
    source: read(path.join(flowDocsRoot, "template-react-islands.js")),
  },
];

const slots = [
  {
    id: "LegacyHtmlPageSlot",
    kind: "page",
    file: "../FlowDocs/apps/docs/docs-shell-react.js",
    named: /function\s+LegacyHtmlPageSlot/.test(files[0].source),
    marker: /data-legacy-html-slot["']:\s*["']page/.test(files[0].source),
    exit: /typed-react-page-children/.test(files[0].source),
    activeInnerHtml: /ref\.current\.innerHTML/.test(files[0].source),
    replacement: "typed-react-page-children",
  },
  {
    id: "LegacyHtmlTabSlot",
    kind: "tab",
    file: "../FlowDocs/apps/docs/template-react-islands.js",
    named: /data-legacy-html-slot/.test(files[1].source),
    marker: /data-legacy-html-slot["']:\s*["']tab/.test(files[1].source),
    exit: /typed-react-tab-children/.test(files[1].source),
    activeInnerHtml: /dangerouslySetInnerHTML/.test(files[1].source) && /selectedBodyHtml/.test(files[1].source),
    replacement: "typed-react-tab-children",
  },
];

const rows = slots.map((slot) => ({
  ...slot,
  status: slot.named && slot.marker && slot.exit && slot.activeInnerHtml ? "quarantined-active" : "missing-quarantine",
}));

const missing = rows.filter((row) => row.status !== "quarantined-active");
const report = {
  generatedAt: new Date().toISOString(),
  status: missing.length ? "blocked" : "action_required",
  decision: missing.length
    ? "legacy-html-slots-are-not-fully-quarantined"
    : "legacy-html-slots-are-explicitly-quarantined-but-still-blocking",
  slots: rows,
  exitGate: [
    "LegacyHtmlPageSlot must be removed when app routes pass typed React children into DocsShellTemplate.",
    "LegacyHtmlTabSlot must be removed when DocsArtifactDetailTemplate owns selected tab body/state.",
    "No new data-legacy-html-slot values may be introduced without a replacement field and audit row.",
    "FlowDocs cannot be called trustworthy while any quarantined-active slot remains.",
  ],
};

fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = `# FlowDocs Legacy Slot Quarantine

Status: **${report.status}**

Decision: **${report.decision}**

## Slots

${mdTable(rows, ["status", "id", "kind", "file", "marker", "exit", "activeInnerHtml", "replacement"])}

## Exit Gate

${report.exitGate.map((item) => `- ${item}`).join("\n")}
`;

fs.writeFileSync(mdOut, md);

console.log(JSON.stringify({
  status: report.status,
  decision: report.decision,
  slots: rows.length,
  quarantined: rows.filter((row) => row.status === "quarantined-active").length,
  missing: missing.length,
}, null, 2));
