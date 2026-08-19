#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const docsDir = fs.existsSync(path.join(root, "../FlowDocs/apps/docs"))
  ? path.join(root, "../FlowDocs/apps/docs")
  : path.join(root, "apps/docs");
const outputDir = path.join(root, "docs/audits");
const outputJson = path.join(outputDir, "flowdocs-shell-decision.json");
const outputMd = path.join(outputDir, "flowdocs-shell-decision.md");

const shellFiles = [
  "app.js",
  "docs-shell-react.js",
  "docs-layout.js",
  "docs-chrome.js",
  "shell-controls.js",
  "styles/01-shell-01.css",
  "styles/01-shell-02.css",
  "styles/01-shell-react.css",
  "styles/02-doc-layout.css",
];

const flowTemplateFiles = [
  "packages/react/src/templates/DocsShellTemplate.ts",
  "packages/react/src/patterns/Topbar.ts",
  "packages/react/src/patterns/Sidebar.ts",
  "packages/react/src/patterns/Search.ts",
  "packages/react/src/patterns/DocumentationPageShell.ts",
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function rel(file) {
  return path.relative(root, file);
}

function lineNumber(source, pattern) {
  const index = source.search(pattern);
  if (index < 0) return null;
  return source.slice(0, index).split("\n").length;
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function classifyShellFile(relativeFile) {
  const file = path.join(docsDir, relativeFile);
  const source = read(file);
  const signals = [];
  const risks = [];

  const checks = [
    ["uses-react-shell-template", /DocsShellTemplate|data-react-component="docs-artifact-detail-template"|data-react-component="docs-shell/i],
    ["inner-html-write", /\.innerHTML\s*=|dangerouslySetInnerHTML|ref\.current\.innerHTML/],
    ["document-query-control", /document\.querySelector|querySelectorAll|\$\(/],
    ["global-dataset-state", /document\.body\.dataset|document\.documentElement\.dataset/],
    ["local-storage-state", /localStorage\./],
    ["hash-router-state", /window\.location\.hash|hashchange/],
    ["manual-event-bridge", /addEventListener|dispatchEvent|CustomEvent/],
    ["flow-generated-runtime-import", /\.\/generated\/react|\.\/generated\/components|generated\/tokens|generated\/components\.css/],
    ["legacy-render-shell", /function renderShell\(|return content;/],
    ["manual-grid-overlay", /docsGridOverlay|frameOverlayTarget|docs-grid-overlay/],
  ];

  for (const [signal, pattern] of checks) {
    if (pattern.test(source)) signals.push(signal);
  }

  if (signals.includes("inner-html-write")) risks.push("React does not own the page subtree end-to-end.");
  if (signals.includes("document-query-control")) risks.push("Shell behavior depends on DOM selectors outside Flow component APIs.");
  if (signals.includes("global-dataset-state")) risks.push("State is mirrored through global dataset mutation.");
  if (signals.includes("legacy-render-shell")) risks.push("Legacy shell renderer still participates in page composition.");
  if (signals.includes("manual-grid-overlay")) risks.push("Grid overlay is still a local docs behavior, not a Flow shell API.");

  return {
    file: rel(file),
    exists: fs.existsSync(file),
    signals,
    risks,
    evidence: {
      innerHtmlWrites: countMatches(source, /\.innerHTML\s*=|ref\.current\.innerHTML/g),
      querySelectors: countMatches(source, /querySelector(?:All)?|\$\(/g),
      addEventListeners: countMatches(source, /addEventListener/g),
      datasetMutations: countMatches(source, /dataset\.[a-zA-Z0-9_]+\s*=|delete\s+document\.(?:body|documentElement)\.dataset/g),
      firstInnerHtmlLine: lineNumber(source, /\.innerHTML\s*=|ref\.current\.innerHTML/),
      firstQuerySelectorLine: lineNumber(source, /querySelector(?:All)?|\$\(/),
    },
  };
}

function classifyFlowTemplate(relativeFile) {
  const file = path.join(root, relativeFile);
  const source = read(file);
  return {
    file: relativeFile,
    exists: fs.existsSync(file),
    signals: [
      /Topbar/.test(source) ? "topbar-composed" : null,
      /Sidebar/.test(source) ? "sidebar-composed" : null,
      /Search/.test(source) ? "search-composed" : null,
      /DocumentationPageShell/.test(source) ? "documentation-page-shell-composed" : null,
      /children/.test(source) ? "children-slot" : null,
      /Surface/.test(source) ? "surface-page-wrapper" : null,
      /background:\s*theme === "dark" \? "none" : "gradient-grid"/.test(source) ? "hardcoded-light-background-choice" : null,
    ].filter(Boolean),
    risks: [
      /Surface/.test(source) && /children/.test(source) ? "Template wraps page content in a Surface, which may conflict with the transparent editorial layout expectation." : null,
      /background:\s*theme === "dark" \? "none" : "gradient-grid"/.test(source) ? "Background policy is hardcoded in the template instead of supplied as a documented shell prop." : null,
    ].filter(Boolean),
  };
}

function buildReport() {
  const shell = shellFiles.map(classifyShellFile);
  const flowTemplates = flowTemplateFiles.map(classifyFlowTemplate);
  const totals = shell.reduce((acc, entry) => {
    acc.innerHtmlWrites += entry.evidence.innerHtmlWrites;
    acc.querySelectors += entry.evidence.querySelectors;
    acc.addEventListeners += entry.evidence.addEventListeners;
    acc.datasetMutations += entry.evidence.datasetMutations;
    return acc;
  }, { innerHtmlWrites: 0, querySelectors: 0, addEventListeners: 0, datasetMutations: 0 });

  const blockingRisks = [
    {
      severity: "high",
      file: "../FlowDocs/apps/docs/app.js",
      issue: "FlowDocs still renders pages through a temporary DOM/string pipeline before React receives the page slot.",
      evidence: "app.js assigns app.innerHTML, extracts pageMarkup, then renderDocsShell injects it into a React slot.",
      decisionImpact: "This prevents treating the shell as a clean React/Flow consumer boundary.",
    },
    {
      severity: "high",
      file: "../FlowDocs/apps/docs/docs-shell-react.js",
      issue: "DocsPageSlot mutates ref.current.innerHTML inside React.",
      evidence: "React owns the shell wrapper but not the child page tree.",
      decisionImpact: "Keyboard, focus, event, and hydration behavior can drift from Flow contracts.",
    },
    {
      severity: "medium",
      file: "../FlowDocs/apps/docs/shell-controls.js",
      issue: "Grid/theme/navigation shell state is coordinated with querySelector, localStorage, and global dataset mutation.",
      evidence: "Shell behavior is outside Flow component props/events.",
      decisionImpact: "Repair is possible, but only if these controls become Flow shell props/events or an explicit consumer adapter.",
    },
    {
      severity: "medium",
      file: "packages/react/src/templates/DocsShellTemplate.ts",
      issue: "The package template exists and composes Topbar, Sidebar, Search, DocumentationPageShell and Surface, but still imposes page surface/background policy.",
      evidence: "DocsShellTemplate can be the repair target, but its props need to own background/surface/page-slot semantics.",
      decisionImpact: "Do not demolish immediately; use it as the system boundary to harden.",
    },
  ];

  const decision = {
    result: "repair-as-explicit-consumer-adapter",
    demolishNow: false,
    rationale: [
      "Flow package primitives/patterns/templates already exist for the shell path.",
      "The broken part is the adapter layer between FlowDocs legacy string renderers and the Flow React shell.",
      "Replacing everything now would discard useful content/template work and hide the same boundary problem unless the new shell has stricter contracts.",
      "Repair is trustworthy only if the legacy DOM mutation path becomes explicitly named and then removed behind gates.",
    ],
    repairConditions: [
      "DocsShellTemplate must expose page background/surface policy as props instead of hardcoding visual policy.",
      "FlowDocs shell adapter must stop mutating the React-owned page slot with innerHTML, or it must be quarantined behind a named LegacyHtmlPageSlot with a removal gate.",
      "Topbar search, sidebar navigation, theme, language and grid controls must be driven through Flow props/events, not global querySelector/dataset side effects.",
      "The old renderShell function must either disappear or become a no-op with an audit that proves it cannot own layout/chrome.",
      "A consumer shell test must verify keyboard search navigation, sidebar route selection, Escape, focus recovery, action alignment, and mobile nav.",
    ],
  };

  const report = {
    generatedAt: new Date().toISOString(),
    status: "action_required",
    purpose: "Decide whether the current FlowDocs shell should be repaired, replaced, or treated as a trustworthy Flow consumer.",
    decision,
    totals,
    blockingRisks,
    shellFiles: shell,
    flowTemplateFiles: flowTemplates,
    nextIteration: {
      id: 6,
      name: "Demos Boundary",
      goal: "Classify demo/runtime islands so component QA demos and FlowDocs demos do not mask each other's bugs.",
    },
  };

  return report;
}

function writeMarkdown(report) {
  const lines = [
    "# FlowDocs Shell Decision",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    "",
    "## Decision",
    "",
    `- Result: ${report.decision.result}`,
    `- Demolish now: ${report.decision.demolishNow}`,
    "",
    "## Rationale",
    "",
    ...report.decision.rationale.map((item) => `- ${item}`),
    "",
    "## Repair Conditions",
    "",
    ...report.decision.repairConditions.map((item) => `- ${item}`),
    "",
    "## Totals",
    "",
    ...Object.entries(report.totals).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Blocking Risks",
    "",
    "| Severity | File | Issue | Evidence | Impact |",
    "| --- | --- | --- | --- | --- |",
    ...report.blockingRisks.map((risk) => `| ${risk.severity} | ${risk.file} | ${risk.issue} | ${risk.evidence} | ${risk.decisionImpact} |`),
    "",
    "## Shell Files",
    "",
    "| File | Signals | Risks | Evidence |",
    "| --- | --- | --- | --- |",
    ...report.shellFiles.map((entry) => {
      const evidence = `innerHTML=${entry.evidence.innerHtmlWrites}, query=${entry.evidence.querySelectors}, listeners=${entry.evidence.addEventListeners}, dataset=${entry.evidence.datasetMutations}`;
      return `| ${entry.file} | ${entry.signals.join(", ") || "none"} | ${entry.risks.join("; ") || "none"} | ${evidence} |`;
    }),
    "",
    "## Flow Template Files",
    "",
    "| File | Signals | Risks |",
    "| --- | --- | --- |",
    ...report.flowTemplateFiles.map((entry) => `| ${entry.file} | ${entry.signals.join(", ") || "none"} | ${entry.risks.join("; ") || "none"} |`),
    "",
    "## Next Iteration",
    "",
    `Iteration ${report.nextIteration.id}: ${report.nextIteration.name}. ${report.nextIteration.goal}`,
    "",
  ];
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
const report = buildReport();
fs.writeFileSync(outputJson, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(outputMd, writeMarkdown(report));
console.log(JSON.stringify({
  status: report.status,
  decision: report.decision.result,
  demolishNow: report.decision.demolishNow,
  totals: report.totals,
  blockingRisks: report.blockingRisks.length,
  output: {
    json: rel(outputJson),
    markdown: rel(outputMd),
  },
}, null, 2));
