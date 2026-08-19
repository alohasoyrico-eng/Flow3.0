const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const flowDocsRoot = path.resolve(root, "../FlowDocs");
const docsRoot = path.join(flowDocsRoot, "apps/docs");
const auditsDir = path.join(root, "docs/audits");
const jsonOut = path.join(auditsDir, "flowdocs-consumer-contract.json");
const mdOut = path.join(auditsDir, "flowdocs-consumer-contract.md");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function exists(file) {
  return fs.existsSync(file);
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function mdTable(rows, columns) {
  if (!rows.length) return "_No rows._";
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(row[column] ?? "").replaceAll("\n", "<br>")).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

function check(id, title, pass, severity, evidence, requiredAction) {
  return {
    id,
    title,
    status: pass ? "pass" : severity === "high" ? "fail" : "warn",
    severity,
    evidence,
    requiredAction: pass ? "" : requiredAction,
  };
}

const shellFile = path.join(docsRoot, "docs-shell-react.js");
const appFile = path.join(docsRoot, "app.js");
const flowDocsPackageFile = path.join(flowDocsRoot, "package.json");
const runtime = readJson(path.join(auditsDir, "flowdocs-runtime-inventory.json"));
const content = readJson(path.join(auditsDir, "flowdocs-content-source-of-truth.json"));
const shellDecision = readJson(path.join(auditsDir, "flowdocs-shell-decision.json"));
const templateBoundary = readJson(path.join(auditsDir, "flowdocs-template-boundary.json"));
const safeCleanup = readJson(path.join(auditsDir, "flowdocs-safe-cleanup-plan.json"));

const shellSource = read(shellFile);
const appSource = read(appFile);
const flowDocsPackage = exists(flowDocsPackageFile) ? readJson(flowDocsPackageFile) : { scripts: {} };

const criticalRoutes = [
  "#/home",
  "#/components/button",
  "#/components/input",
  "#/components/select",
  "#/patterns/agent-conversation",
  "#/templates/agent-workspace",
  "#/foundations/energy",
  "#/primitives/color",
];

const shellSignals = {
  importsDocsShellTemplate: /import\s+\{\s*DocsShellTemplate\s*\}\s+from\s+["']\.\/generated\/react\/templates\/DocsShellTemplate\.js/.test(shellSource),
  usesReactCreateRoot: /createRoot\(/.test(shellSource),
  ownsTopbarProps: /function\s+topbarProps/.test(shellSource),
  ownsSidebarProps: /function\s+sidebarProps/.test(shellSource),
  legacyHtmlPageSlotNamed: /function\s+LegacyHtmlPageSlot/.test(shellSource) && /data-legacy-html-slot["']:\s*["']page/.test(shellSource),
  docsPageSlotInnerHtmlWrites: count(shellSource, /innerHTML/g),
  documentQuerySelectors: count(shellSource, /document\.querySelector/g),
  documentListeners: count(shellSource, /document\.addEventListener/g),
  bodyDatasetMutations: count(shellSource, /document\.body\.dataset/g),
};

const appSignals = {
  stagingPageMarkup: /pageRenderTarget/.test(appSource) && /pageMarkup/.test(appSource),
  renderTargetInnerHtmlWrites: count(appSource, /app\.innerHTML/g),
  tabPanelInnerHtmlWrites: count(appSource, /#tabPanel"\)\.innerHTML|tabPanel.*innerHTML/g),
  legacyHtmlTabSlotNamed: /legacyHtmlSlot\s*[:=]\s*["']tab/.test(appSource) && /legacyHtmlExit\s*[:=]\s*["']typed-react-tab-children/.test(appSource),
  importsLocalRenderers: [
    "docs-layout",
    "home-stack-renderers",
    "reference-layout",
    "detail-tabs",
    "gold-component-docs",
  ].filter((name) => appSource.includes(`./${name}.js`)),
};

const contractChecks = [
  check(
    "flowdocs-validate-script",
    "FlowDocs has an executable consumer validation script",
    Boolean(flowDocsPackage.scripts?.["validate:docs"]),
    "high",
    flowDocsPackage.scripts?.["validate:docs"] ?? "missing",
    "Restore FlowDocs validate:docs as build + typecheck + docs audits.",
  ),
  check(
    "docs-shell-template-import",
    "Docs shell imports generated Flow DocsShellTemplate",
    shellSignals.importsDocsShellTemplate && shellSignals.usesReactCreateRoot,
    "high",
    `importsDocsShellTemplate=${shellSignals.importsDocsShellTemplate}; usesReactCreateRoot=${shellSignals.usesReactCreateRoot}`,
    "FlowDocs shell must mount DocsShellTemplate from generated Flow runtime through React.",
  ),
  check(
    "topbar-sidebar-props",
    "Topbar and sidebar are supplied through Flow template props",
    shellSignals.ownsTopbarProps && shellSignals.ownsSidebarProps,
    "medium",
    `topbarProps=${shellSignals.ownsTopbarProps}; sidebarProps=${shellSignals.ownsSidebarProps}`,
    "Expose topbar/sidebar behavior through DocsShellTemplate props, not disconnected DOM chrome.",
  ),
  check(
    "legacy-page-slot-quarantined",
    "React shell page HTML bridge is explicitly quarantined",
    shellSignals.docsPageSlotInnerHtmlWrites === 0 || shellSignals.legacyHtmlPageSlotNamed,
    "high",
    `${shellSignals.docsPageSlotInnerHtmlWrites} innerHTML signal(s); legacyHtmlPageSlotNamed=${shellSignals.legacyHtmlPageSlotNamed}`,
    "Replace DocsPageSlot innerHTML bridge with typed React children or mark it explicitly as LegacyHtmlPageSlot with removal gate.",
  ),
  check(
    "no-app-page-staging-innerhtml",
    "App router does not stage pages through detached innerHTML",
    appSignals.renderTargetInnerHtmlWrites === 0 && !appSignals.stagingPageMarkup,
    "high",
    `${appSignals.renderTargetInnerHtmlWrites} app.innerHTML writes; stagingPageMarkup=${appSignals.stagingPageMarkup}`,
    "Stop rendering pages into detached DOM/string markup before passing to React shell.",
  ),
  check(
    "legacy-tab-slot-quarantined",
    "Detail tab HTML bridge is explicitly quarantined",
    appSignals.tabPanelInnerHtmlWrites === 0 || appSignals.legacyHtmlTabSlotNamed,
    "high",
    `${appSignals.tabPanelInnerHtmlWrites} tab panel innerHTML write(s); legacyHtmlTabSlotNamed=${appSignals.legacyHtmlTabSlotNamed}`,
    "Move selected tab body into DocsArtifactDetailTemplate state/props or quarantine as LegacyHtmlTabSlot.",
  ),
  check(
    "content-bundle-source-match",
    "Docs content bundle matches package source inputs",
    content.summary?.bundleMatchesSource === true,
    "high",
    `bundleMatchesSource=${content.summary?.bundleMatchesSource}`,
    "Regenerate FlowDocs content from package content sources before claiming consumer truth.",
  ),
  check(
    "runtime-graph-complete",
    "Runtime graph has no missing dependencies",
    (runtime.missingDependencies ?? []).length === 0,
    "high",
    `missingDependencies=${(runtime.missingDependencies ?? []).length}`,
    "Fix missing runtime imports/assets before consumer QA can be trusted.",
  ),
  check(
    "legacy-cleanup-explicit",
    "Known legacy cleanup queues are explicit",
    safeCleanup.totals?.legacyQuarantineCandidates > 0
      && (safeCleanup.totals?.immediateDeleteCandidates > 0 || safeCleanup.totals?.protectedStringReferencedCandidates > 0),
    "medium",
    `legacyQuarantineCandidates=${safeCleanup.totals?.legacyQuarantineCandidates}; immediateDeleteCandidates=${safeCleanup.totals?.immediateDeleteCandidates}; protectedStringReferencedCandidates=${safeCleanup.totals?.protectedStringReferencedCandidates ?? 0}`,
    "Keep safe cleanup queues visible until legacy slots are replaced and deleted.",
  ),
];

const statusCounts = contractChecks.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] ?? 0) + 1;
  return acc;
}, {});

const hardFailures = contractChecks.filter((item) => item.status === "fail");
const warnings = contractChecks.filter((item) => item.status === "warn");

const report = {
  generatedAt: new Date().toISOString(),
  status: hardFailures.length ? "blocked" : warnings.length ? "action_required" : "pass",
  decision: hardFailures.length
    ? "flowdocs-is-a-react-shell-consumer-but-not-yet-a-trustworthy-flow-consumer"
    : "flowdocs-consumer-contract-is-currently-satisfied",
  consumerContract: {
    criticalRoutes,
    requiredCommand: "cd ../FlowDocs && npm run validate:docs",
    blockingRule: "validate:docs passing is required but not sufficient while LegacyHtmlPageSlot/LegacyHtmlTabSlot remain.",
  },
  signals: {
    shell: shellSignals,
    app: appSignals,
    shellDecision: shellDecision.decision,
    templateDecision: templateBoundary.decision,
  },
  checks: contractChecks,
  summary: {
    checks: contractChecks.length,
    ...statusCounts,
    hardFailures: hardFailures.length,
    warnings: warnings.length,
  },
};

fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = `# FlowDocs Consumer Contract

Status: **${report.status}**

Decision: **${report.decision}**

## Summary

- Checks: **${report.summary.checks}**
- Pass: **${report.summary.pass ?? 0}**
- Warn: **${report.summary.warn ?? 0}**
- Fail: **${report.summary.fail ?? 0}**
- Required command: \`${report.consumerContract.requiredCommand}\`

## Contract Rule

${report.consumerContract.blockingRule}

## Critical Routes

${criticalRoutes.map((route) => `- \`${route}\``).join("\n")}

## Checks

${mdTable(contractChecks, ["status", "severity", "id", "title", "evidence", "requiredAction"])}

## Shell Signals

${mdTable(Object.entries(shellSignals).map(([signal, value]) => ({ signal, value })), ["signal", "value"])}

## App Router Signals

${mdTable(Object.entries(appSignals).map(([signal, value]) => ({ signal, value: Array.isArray(value) ? value.join(", ") : value })), ["signal", "value"])}
`;

fs.writeFileSync(mdOut, md);

console.log(JSON.stringify({
  status: report.status,
  decision: report.decision,
  checks: report.summary.checks,
  pass: report.summary.pass ?? 0,
  warn: report.summary.warn ?? 0,
  fail: report.summary.fail ?? 0,
}, null, 2));
