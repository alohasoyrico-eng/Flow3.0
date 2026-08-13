#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "shell-pattern-contract-governance-audit.json");
const markdownOutput = path.join(outputDir, "shell-pattern-contract-governance-audit.md");
const reactPatternDir = path.join(root, "packages/react/src/patterns");

const shellPatterns = [
  {
    id: "topbar",
    name: "Topbar",
    file: path.join(reactPatternDir, "Topbar.ts"),
    checks: [
      {
        id: "typed-source",
        description: "Topbar is authored in TS as the public shell contract.",
        test: (source) => source.includes("export interface TopbarProps"),
      },
      {
        id: "navigation-action",
        description: "Topbar exposes a single navigation action slot for small viewports.",
        test: (source) => source.includes('"data-flow-slot": "navigation-action"')
          && source.includes("React.createElement(IconButton"),
      },
      {
        id: "controlled-navigation-drawer",
        description: "Topbar navigation drawer is controlled by the shell state contract.",
        test: (source) => source.includes("open: Boolean(mobile && sidebar?.drawerOpen)")
          && source.includes("onOpenChange: sidebar?.onDrawerOpenChange"),
      },
      {
        id: "navigation-action-toggle",
        description: "Topbar navigation action toggles drawer state unless the consumer prevents default.",
        test: (source) => source.includes("const handleNavigationActionClick = (event: MouseEvent<HTMLButtonElement>)")
          && source.includes("if (event.defaultPrevented) return;")
          && source.includes("sidebar.onDrawerOpenChange?.(!isNavigationDrawerOpen, event)")
          && source.includes("onClick: handleNavigationActionClick"),
      },
      {
        id: "no-default-drawer-close",
        description: "Topbar navigation drawer does not render a parallel close button by default.",
        test: (source) => source.includes("showCloseButton: sidebarDrawer?.showCloseButton ?? false"),
      },
      {
        id: "delegates-sidebar",
        description: "Topbar delegates navigation content to Sidebar instead of duplicating the shell list.",
        test: (source) => source.includes("Navigation is delegated to Sidebar.")
          && source.includes("React.createElement(Sidebar"),
      },
    ],
  },
  {
    id: "sidebar",
    name: "Sidebar",
    file: path.join(reactPatternDir, "Sidebar.ts"),
    checks: [
      {
        id: "typed-source",
        description: "Sidebar is authored in TS as the public shell navigation contract.",
        test: (source) => source.includes("export interface SidebarProps"),
      },
      {
        id: "controlled-navigation-drawer",
        description: "Sidebar drawer state is controlled through drawerOpen/onDrawerOpenChange.",
        test: (source) => source.includes("open: drawerOpen || mobileDrawer")
          && source.includes("onOpenChange: onDrawerOpenChange"),
      },
      {
        id: "no-default-drawer-close",
        description: "Sidebar drawer does not render a parallel close button by default.",
        test: (source) => source.includes("showCloseButton: drawer?.showCloseButton ?? false"),
      },
      {
        id: "route-actions-use-flow-button",
        description: "Sidebar routes compose Flow Button instead of local anchor/button markup.",
        test: (source) => source.includes("React.createElement(Button")
          && source.includes('"data-flow-slot": "route-action"'),
      },
      {
        id: "groups-use-surface-accordion",
        description: "Sidebar groups compose Surface and Accordion for structure.",
        test: (source) => source.includes("React.createElement(\n      Surface")
          && source.includes("React.createElement(Accordion"),
      },
    ],
  },
  {
    id: "search",
    name: "Search",
    file: path.join(reactPatternDir, "Search.ts"),
    checks: [
      {
        id: "typed-source",
        description: "Search is authored in TS as the public shell search contract.",
        test: (source) => source.includes("export interface SearchProps"),
      },
      {
        id: "search-role",
        description: "Search carries the semantic search role and Flow pattern marker.",
        test: (source) => source.includes('role: "search"')
          && source.includes('"data-flow-pattern": "search"'),
      },
      {
        id: "composes-flow-input",
        description: "Search composes Flow Input for query entry.",
        test: (source) => source.includes("React.createElement(Input")
          && source.includes('variant: "search"'),
      },
      {
        id: "no-dom-parallel-runtime",
        description: "Search does not own global DOM behavior directly.",
        test: (source) => !/\b(document|window)\s*\./.test(source),
      },
    ],
  },
];

function createReport() {
  const rows = shellPatterns.map((pattern) => {
    const exists = fs.existsSync(pattern.file);
    const source = exists ? read(pattern.file) : "";
    const checks = pattern.checks.map((check) => {
      const pass = exists && check.test(source);
      return {
        id: check.id,
        description: check.description,
        status: pass ? "pass" : "fail",
      };
    });
    const failures = checks.filter((check) => check.status !== "pass");
    return {
      id: pattern.id,
      name: pattern.name,
      file: rel(pattern.file),
      status: exists && failures.length === 0 ? "pass" : "fail",
      checks,
      failures,
    };
  });
  const debt = rows.reduce((total, row) => total + row.failures.length, 0);
  return {
    status: debt ? "fail" : "pass",
    audit: "shell pattern contract governance",
    principle: "FlowDocs shell dependencies must rely on governed Flow patterns. Topbar, Sidebar, and Search must expose typed contracts, controlled shell state, and no parallel mobile drawer close control by default.",
    inventory: {
      shellPatterns: rows.length,
      checks: rows.reduce((total, row) => total + row.checks.length, 0),
      shellPatternContractDebt: debt,
    },
    rows,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.inventory)
    .map(([key, value]) => `| ${key} | ${value} |`);
  const checkRows = report.rows.flatMap((row) => row.checks.map((check) => (
    `| ${row.name} | ${row.file} | ${check.id} | ${check.status} | ${check.description} |`
  )));
  return [
    "# Shell Pattern Contract Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    ...inventoryRows,
    "",
    "## Checks",
    "",
    "| Pattern | File | Check | Status | Description |",
    "| --- | --- | --- | --- | --- |",
    ...(checkRows.length ? checkRows : ["| None | None | None | None | None |"]),
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== json || currentMarkdown !== markdown) {
      throw new Error("Shell pattern contract governance report is stale. Run: node packages/audit/scripts/report-shell-pattern-contract-governance.js");
    }
    return;
  }
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
}

try {
  const report = createReport();
  writeReport(report);
  console.log(JSON.stringify({
    status: report.status,
    audit: report.audit,
    inventory: report.inventory,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
