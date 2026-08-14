#!/usr/bin/env node

const { spawnSync } = require("child_process");
const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "flowdocs-p0-shell-cleanup-evidence.json");
const markdownOutput = path.join(outputDir, "flowdocs-p0-shell-cleanup-evidence.md");
const flowDocsRoot = path.join(root, "../FlowDocs");
const docsAppDir = path.join(flowDocsRoot, "apps/docs");

function lineOf(text, token) {
  const index = text.indexOf(token);
  return index === -1 ? 1 : text.slice(0, index).split("\n").length;
}

function git(args) {
  const result = spawnSync("git", args, { cwd: flowDocsRoot, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

function checkText(file, checks) {
  const absolute = path.join(flowDocsRoot, file);
  const exists = fs.existsSync(absolute);
  const text = exists ? read(absolute) : "";
  return checks.map((check) => {
    const passed = exists && (check.type === "forbidden" ? !text.includes(check.token) : text.includes(check.token));
    return {
      id: check.id,
      file: path.relative(root, absolute),
      line: check.type === "forbidden" && text.includes(check.token) ? lineOf(text, check.token) : 1,
      status: passed ? "pass" : "fail",
      type: check.type,
      token: check.token,
      description: check.description,
    };
  });
}

function createReport() {
  const flowDocsExists = fs.existsSync(docsAppDir);
  const checks = flowDocsExists ? [
    ...checkText("apps/docs/generated/react/patterns/Sidebar.js", [
      {
        id: "generated-sidebar-no-default-close",
        type: "required",
        token: "showCloseButton: drawer?.showCloseButton ?? false",
        description: "FlowDocs generated Sidebar bridge consumes the governed Flow default: no parallel drawer close button.",
      },
      {
        id: "generated-sidebar-no-stale-default-close",
        type: "forbidden",
        token: "showCloseButton: drawer?.showCloseButton ?? true",
        description: "FlowDocs generated Sidebar bridge must not preserve the stale close-button default.",
      },
    ]),
    ...checkText("apps/docs/generated/react/patterns/Topbar.js", [
      {
        id: "generated-topbar-no-default-close",
        type: "required",
        token: "showCloseButton: sidebarDrawer?.showCloseButton ?? false",
        description: "FlowDocs generated Topbar bridge consumes the governed Flow default: no parallel drawer close button.",
      },
      {
        id: "generated-topbar-no-stale-default-close",
        type: "forbidden",
        token: "showCloseButton: sidebarDrawer?.showCloseButton ?? true",
        description: "FlowDocs generated Topbar bridge must not preserve the stale close-button default.",
      },
    ]),
    ...checkText("apps/docs/docs-shell-react.js", [
      {
        id: "docs-shell-cachebust-template",
        type: "required",
        token: 'from "./generated/react/templates/DocsShellTemplate.js?v=2"',
        description: "FlowDocs shell imports the regenerated Docs Shell Template with a fresh cache key.",
      },
      {
        id: "docs-shell-mobile-action-attributes",
        type: "required",
        token: '"data-doc-shell-action": "contrast"',
        description: "FlowDocs shell exposes governed action attributes for responsive CSS decisions.",
      },
    ]),
    ...checkText("apps/docs/generated/react/templates/DocsShellTemplate.js", [
      {
        id: "docs-shell-template-imports-sidebar",
        type: "required",
        token: 'import { Sidebar } from "../patterns/Sidebar.js";',
        description: "Generated Docs Shell Template owns the Sidebar bridge import instead of docs-shell-react duplicating it.",
      },
      {
        id: "docs-shell-template-imports-topbar",
        type: "required",
        token: 'import { Topbar } from "../patterns/Topbar.js";',
        description: "Generated Docs Shell Template owns the Topbar bridge import instead of docs-shell-react duplicating it.",
      },
    ]),
    ...checkText("apps/docs/styles/01-shell-react.css", [
      {
        id: "docs-shell-mobile-sidebar-state",
        type: "required",
        token: 'body[data-nav-open="true"] .docs-react-shell-sidebar-mount',
        description: "FlowDocs mobile sidebar visibility is controlled by the same hamburger state.",
      },
      {
        id: "docs-shell-mobile-no-sidebar-column",
        type: "required",
        token: "grid-template-columns: minmax(0, 1fr);",
        description: "FlowDocs mobile layout removes the persistent sidebar column.",
      },
      {
        id: "docs-shell-mobile-search-space",
        type: "required",
        token: '.docs-react-shell-topbar__action[data-doc-shell-action="grid"]',
        description: "FlowDocs mobile shell hides secondary actions so search can use available width.",
      },
    ]),
    ...checkText("scripts/build-docs-assets.mjs", [
      {
        id: "docs-bridge-prunes-source-ts",
        type: "required",
        token: "function pruneSourceTypes(dir)",
        description: "FlowDocs bridge avoids copying raw TS component sources as a second source of truth.",
      },
    ]),
    ...checkText("audit/audit-docs-shell-boundary.js", [
      {
        id: "docs-audit-blocks-stale-sidebar-close-default",
        type: "required",
        token: "showCloseButton: drawer?.showCloseButton ?? true",
        description: "FlowDocs audit fails if stale Sidebar close-button defaults return.",
      },
      {
        id: "docs-audit-blocks-stale-topbar-close-default",
        type: "required",
        token: "showCloseButton: sidebarDrawer?.showCloseButton ?? true",
        description: "FlowDocs audit fails if stale Topbar close-button defaults return.",
      },
    ]),
  ] : [];
  const failures = checks.filter((check) => check.status !== "pass");
  return {
    schemaVersion: "flowdocs-p0-shell-cleanup-evidence@1",
    status: flowDocsExists && failures.length === 0 ? "pass" : "fail",
    generatedAt: "2026-08-13",
    flowDocs: {
      exists: flowDocsExists,
      root: path.relative(root, flowDocsRoot),
      head: flowDocsExists ? git(["rev-parse", "--short", "HEAD"]) : "",
      branch: flowDocsExists ? git(["branch", "--show-current"]) : "",
    },
    inventory: {
      checks: checks.length,
      failures: failures.length,
      flowDocsP0ShellCleanupDebt: failures.length,
    },
    checks,
    failures,
  };
}

function renderMarkdown(report) {
  const rows = report.checks
    .map((check) => `| ${check.status} | ${check.id} | ${check.file}:${check.line} | ${check.description} |`)
    .join("\n");
  return [
    "# FlowDocs P0 shell cleanup evidence",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `Status: ${report.status}`,
    "",
    `FlowDocs: ${report.flowDocs.root} @ ${report.flowDocs.head || "missing"}`,
    "",
    "| Status | Check | File | Description |",
    "| --- | --- | --- | --- |",
    rows || "| fail | flowdocs-missing | ../FlowDocs | FlowDocs sibling repo was not found. |",
    "",
  ].join("\n");
}

function main() {
  const report = createReport();
  fs.mkdirSync(outputDir, { recursive: true });
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = renderMarkdown(report);
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-flowdocs-p0-shell-cleanup-evidence.js.`);
    }
  } else {
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }
  console.log(JSON.stringify({
    status: report.status,
    checks: report.inventory.checks,
    failures: report.inventory.failures,
    flowDocsHead: report.flowDocs.head,
    outputs: [rel(jsonOutput), rel(markdownOutput)],
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
