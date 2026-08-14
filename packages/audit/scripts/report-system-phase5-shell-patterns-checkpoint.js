#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase5-shell-patterns-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase5-shell-patterns-checkpoint.md");

const shellPatternIds = ["topbar", "sidebar", "search", "toolbar", "command-palette"];
const shellPatternNames = ["Topbar", "Sidebar", "Search", "Toolbar", "Command Palette"];

const sourceFiles = [
  "packages/react/src/patterns/Topbar.ts",
  "packages/react/src/patterns/Topbar.js",
  "packages/react/src/patterns/Topbar.d.ts",
  "packages/react/src/patterns/Sidebar.ts",
  "packages/react/src/patterns/Sidebar.js",
  "packages/react/src/patterns/Sidebar.d.ts",
  "packages/react/src/patterns/Search.ts",
  "packages/react/src/patterns/Search.js",
  "packages/react/src/patterns/Search.d.ts",
  "packages/react/src/patterns/Toolbar.ts",
  "packages/react/src/patterns/Toolbar.js",
  "packages/react/src/patterns/Toolbar.d.ts",
  "packages/react/src/patterns/CommandPalette.ts",
  "packages/react/src/patterns/CommandPalette.js",
  "packages/react/src/patterns/CommandPalette.d.ts",
];

const contractFiles = [
  "packages/specs/specs/unison-system/artifacts/patterns/topbar.json",
  "packages/specs/specs/unison-system/artifacts/patterns/sidebar.json",
  "packages/specs/specs/unison-system/artifacts/patterns/search.json",
  "packages/specs/specs/unison-system/artifacts/patterns/toolbar.json",
  "packages/specs/specs/unison-system/artifacts/patterns/command-palette.json",
  "packages/content/content/pattern-contracts/patterns/topbar.md",
  "packages/content/content/pattern-contracts/patterns/sidebar.md",
  "packages/content/content/pattern-contracts/patterns/search.md",
  "packages/content/content/pattern-contracts/patterns/toolbar.md",
  "packages/content/content/pattern-contracts/patterns/command-palette.md",
];

const reports = [
  {
    id: "shell-contract-governance",
    file: "docs/audits/shell-pattern-contract-governance-audit.json",
    expected: {
      shellPatterns: 5,
      checks: 25,
      shellPatternContractDebt: 0,
    },
  },
  {
    id: "pattern-composition",
    file: "docs/audits/react-pattern-composition-governance-audit.json",
    expected: {
      reactPatternCompositionDebt: 0,
      implementedReactPatterns: 72,
      missingRequiredComponentImports: 0,
      undeclaredComponentImports: 0,
      rawDomVisuals: 0,
      docsDependencies: 0,
      workspaceDependencies: 0,
      undocumentedPatternBoundaries: 0,
      undeclaredPatternImports: 0,
      slotIssues: 0,
      tokenIssues: 0,
    },
  },
  {
    id: "pattern-behavior",
    file: "docs/audits/react-pattern-behavior-governance-audit.json",
    expected: {
      reactPatternBehaviorDebt: 0,
      implementedReactPatterns: 72,
      callbackPropsDeclared: 271,
      callbackPropsTested: 271,
      missingCallbackTests: 0,
      formalStates: 542,
      typedStates: 542,
      statesMissingFromTypes: 0,
      rawGlobalDomRefs: 0,
      missingAccessibilityImplementation: 0,
    },
  },
  {
    id: "pattern-react-migration",
    file: "docs/audits/pattern-react-migration-audit.json",
    expected: {
      patterns: 72,
      reactSources: 72,
      typeSources: 72,
      migrationAuditDebt: 0,
      callbackPropsDeclared: 271,
      callbackPropsTested: 271,
      missingCallbackTests: 0,
    },
  },
];

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return fallback;
  }
}

function readText(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function statusOf(report) {
  return String(report?.status ?? "").toLowerCase();
}

function inventoryOf(report) {
  return report.inventory ?? report.summary ?? report;
}

function mismatchesFor(report, expected, reportId) {
  const inventory = inventoryOf(report);
  return Object.entries(expected)
    .filter(([key, expectedValue]) => inventory[key] !== expectedValue)
    .map(([key, expectedValue]) => ({
      report: reportId,
      key,
      expected: expectedValue,
      actual: inventory[key],
    }));
}

function fileEvidence() {
  return [...sourceFiles, ...contractFiles].map((file) => ({
    file,
    exists: fs.existsSync(path.join(root, file)),
  }));
}

function shellContractRows(shellReport) {
  return Array.isArray(shellReport.rows) ? shellReport.rows : [];
}

function shellPatternEvidence(shellReport) {
  const rows = shellContractRows(shellReport);
  return shellPatternIds.map((id, index) => {
    const row = rows.find((candidate) => candidate.id === id);
    const source = sourceFiles.filter((file) => file.toLowerCase().includes(id.replace("-", "").replace("palette", "palette"))
      || (id === "command-palette" && file.includes("CommandPalette"))
      || (id !== "command-palette" && file.toLowerCase().includes(id)));
    return {
      id,
      name: shellPatternNames[index],
      status: row?.status ?? "missing",
      checks: row?.checks?.length ?? 0,
      failures: row?.failures?.length ?? 0,
      sourceFiles: source.filter((file) => fs.existsSync(path.join(root, file))),
    };
  });
}

function policyEvidence() {
  const topbar = readText("packages/react/src/patterns/Topbar.ts");
  const sidebar = readText("packages/react/src/patterns/Sidebar.ts");
  const search = readText("packages/react/src/patterns/Search.ts");
  const toolbar = readText("packages/react/src/patterns/Toolbar.ts");
  const commandPalette = readText("packages/react/src/patterns/CommandPalette.ts");

  return [
    {
      id: "single-mobile-navigation-action",
      status: topbar.includes('"data-flow-slot": "navigation-action"') && topbar.includes("showCloseButton: sidebarDrawer?.showCloseButton ?? false") ? "pass" : "fail",
    },
    {
      id: "sidebar-controlled-drawer",
      status: sidebar.includes("open: drawerOpen || mobileDrawer") && sidebar.includes("onOpenChange: onDrawerOpenChange") ? "pass" : "fail",
    },
    {
      id: "search-composes-input",
      status: search.includes("React.createElement(Input") && search.includes('variant: "search"') ? "pass" : "fail",
    },
    {
      id: "toolbar-delegates-search-topbar",
      status: toolbar.includes("React.createElement(Search") && toolbar.includes("React.createElement(Topbar") ? "pass" : "fail",
    },
    {
      id: "command-palette-composes-dialog-menu",
      status: commandPalette.includes("React.createElement(Dialog") && commandPalette.includes("React.createElement(Menu") ? "pass" : "fail",
    },
  ];
}

function createReport() {
  const reportRows = reports.map((definition) => {
    const report = readJson(definition.file);
    const mismatches = mismatchesFor(report, definition.expected, definition.id);
    return {
      id: definition.id,
      file: definition.file,
      status: statusOf(report) || "missing",
      mismatches,
    };
  });
  const shellReport = readJson("docs/audits/shell-pattern-contract-governance-audit.json");
  const shellRows = shellPatternEvidence(shellReport);
  const files = fileEvidence();
  const policies = policyEvidence();
  const issues = [
    ...reportRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...reportRows.flatMap((row) => row.mismatches.map((item) => `${item.report}.${item.key}: expected ${item.expected}, got ${item.actual}`)),
    ...files.filter((file) => !file.exists).map((file) => `${file.file} is missing.`),
    ...shellRows.filter((row) => row.status !== "pass").map((row) => `${row.id} shell row is ${row.status}.`),
    ...shellRows.filter((row) => row.failures !== 0).map((row) => `${row.id} shell failures: ${row.failures}.`),
    ...policies.filter((policy) => policy.status !== "pass").map((policy) => `${policy.id} policy evidence failed.`),
  ];

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 5 shell patterns checkpoint",
    principle: "Shell patterns close only when Topbar, Sidebar, Search, Toolbar, and Command Palette have formal artifacts, Markdown contracts, TS/JS/d.ts runtime surfaces, shell-specific governance checks, cross-pattern behavior/composition gates, and zero policy debt.",
    scope: "Original plan iteration 26: shell patterns.",
    inventory: {
      shellPatterns: shellRows.length,
      shellPatternsPassing: shellRows.filter((row) => row.status === "pass").length,
      shellPatternChecks: shellRows.reduce((total, row) => total + row.checks, 0),
      sourceFiles: sourceFiles.length,
      contractFiles: contractFiles.length,
      filesPresent: files.filter((file) => file.exists).length,
      reports: reportRows.length,
      reportsPassing: reportRows.filter((row) => row.status === "pass").length,
      policyChecks: policies.length,
      policyChecksPassing: policies.filter((policy) => policy.status === "pass").length,
      shellPatternDebt: issues.length,
    },
    shellPatterns: shellRows,
    reports: reportRows,
    policies,
    files,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 5 Shell Patterns Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Shell patterns: ${report.inventory.shellPatternsPassing}/${report.inventory.shellPatterns}`,
    `- Shell pattern checks: ${report.inventory.shellPatternChecks}`,
    `- Runtime/type/source files: ${report.inventory.filesPresent}/${report.inventory.sourceFiles + report.inventory.contractFiles}`,
    `- Audit reports: ${report.inventory.reportsPassing}/${report.inventory.reports}`,
    `- Policy checks: ${report.inventory.policyChecksPassing}/${report.inventory.policyChecks}`,
    `- Shell pattern debt: ${report.inventory.shellPatternDebt}`,
    "",
    "## Shell Patterns",
    "",
    "| Pattern | Status | Checks | Failures | Source files |",
    "| --- | --- | ---: | ---: | ---: |",
    ...report.shellPatterns.map((row) => `| ${row.name} | ${row.status} | ${row.checks} | ${row.failures} | ${row.sourceFiles.length} |`),
    "",
    "## Reports",
    "",
    "| Report | Status | Mismatches |",
    "| --- | --- | ---: |",
    ...report.reports.map((row) => `| ${row.id} | ${row.status} | ${row.mismatches.length} |`),
    "",
    "## Policy Checks",
    "",
    "| Check | Status |",
    "| --- | --- |",
    ...report.policies.map((policy) => `| ${policy.id} | ${policy.status} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Phase 5 shell patterns checkpoint is stale. Run: node packages/audit/scripts/report-system-phase5-shell-patterns-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    shellPatterns: `${report.inventory.shellPatternsPassing}/${report.inventory.shellPatterns}`,
    reports: `${report.inventory.reportsPassing}/${report.inventory.reports}`,
    policyChecks: `${report.inventory.policyChecksPassing}/${report.inventory.policyChecks}`,
    debt: report.inventory.shellPatternDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
