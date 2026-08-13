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
  {
    id: "toolbar",
    name: "Toolbar",
    file: path.join(reactPatternDir, "Toolbar.ts"),
    checks: [
      {
        id: "typed-source",
        description: "Toolbar is authored in TS as the public local action shell contract.",
        test: (source) => source.includes("export interface ToolbarProps"),
      },
      {
        id: "toolbar-role",
        description: "Toolbar carries the semantic toolbar role and Flow pattern marker.",
        test: (source) => source.includes('role: "toolbar"')
          && source.includes('"data-flow-pattern": "toolbar"'),
      },
      {
        id: "composes-flow-controls",
        description: "Toolbar composes Flow controls for actions, filters, status, overflow, and feedback.",
        test: (source) => [
          "React.createElement(Button",
          "React.createElement(Chip",
          "React.createElement(Badge",
          "React.createElement(Menu",
          "React.createElement(Toast",
        ].every((needle) => source.includes(needle)),
      },
      {
        id: "delegates-search-boundary",
        description: "Toolbar delegates complex query behavior to Search instead of cloning the pattern.",
        test: (source) => source.includes("search?.delegate")
          && source.includes("React.createElement(Search"),
      },
      {
        id: "delegates-topbar-boundary",
        description: "Toolbar keeps global shell actions in Topbar instead of owning them locally.",
        test: (source) => source.includes("topbar")
          && source.includes("React.createElement(Topbar"),
      },
    ],
  },
  {
    id: "command-palette",
    name: "Command Palette",
    file: path.join(reactPatternDir, "CommandPalette.ts"),
    checks: [
      {
        id: "typed-source",
        description: "Command Palette is authored in TS as the public command shell contract.",
        test: (source) => source.includes("export interface CommandPaletteProps"),
      },
      {
        id: "pattern-marker",
        description: "Command Palette carries a Flow pattern marker and explicit state model.",
        test: (source) => source.includes('"data-flow-pattern": "command-palette"')
          && source.includes("export type CommandPaletteState"),
      },
      {
        id: "composes-dialog-input-menu",
        description: "Command Palette composes Flow Dialog, Input, and Menu instead of raw overlay rows.",
        test: (source) => [
          "React.createElement(Dialog",
          "React.createElement(Input",
          "React.createElement(Menu",
        ].every((needle) => source.includes(needle)),
      },
      {
        id: "empty-and-feedback",
        description: "Command Palette owns empty recovery and feedback through Flow components.",
        test: (source) => source.includes("React.createElement(EmptyState")
          && source.includes("React.createElement(Toast"),
      },
      {
        id: "controlled-open-query-execution",
        description: "Command Palette exposes controlled open, query, command select, and primary action callbacks.",
        test: (source) => [
          "onOpenChange",
          "onQueryChange",
          "onCommandSelect",
          "onPrimaryAction",
        ].every((needle) => source.includes(needle)),
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
    principle: "FlowDocs shell dependencies must rely on governed Flow patterns. Topbar, Sidebar, Search, Toolbar, and Command Palette must expose typed contracts, controlled shell state, delegated pattern boundaries, and no parallel shell behavior by default.",
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
