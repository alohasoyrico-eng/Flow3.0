#!/usr/bin/env node

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-template-interaction-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-template-interaction-governance-audit.md");
const testFile = path.join(root, "packages/react/test/template-interaction.test.mjs");
const packageFile = path.join(root, "packages/react/package.json");

const templateContracts = [
  {
    id: "settings-workspace",
    componentName: "SettingsWorkspace",
    sourceFile: "packages/react/src/templates/SettingsWorkspace.js",
    typeFile: "packages/react/src/templates/SettingsWorkspace.d.ts",
    selectedProp: "selectedSection",
    defaultProp: "defaultSelectedSection",
    callbackProp: "onSelectedSectionChange",
    selectedAttribute: "data-selected-section",
    internalState: "internalSelectedSection",
    internalSetter: "setInternalSelectedSection",
    resolvedSelection: "resolvedSelectedSection",
    handler: "handleSectionSelect",
    eventForwarding: "onSelectedSectionChange?.(key, section, event)",
    defaultValue: "profile",
    controlledTarget: "notifications",
    targetSelector: 'data-template-section="notifications"',
    requiresDrawer: false,
  },
  {
    id: "internal-operations-console",
    componentName: "InternalOperationsConsole",
    sourceFile: "packages/react/src/templates/InternalOperationsConsole.js",
    typeFile: "packages/react/src/templates/InternalOperationsConsole.d.ts",
    selectedProp: "selectedModule",
    defaultProp: "defaultSelectedModule",
    callbackProp: "onSelectedModuleChange",
    selectedAttribute: "data-selected-module",
    internalState: "internalSelectedModule",
    internalSetter: "setInternalSelectedModule",
    resolvedSelection: "resolvedSelectedModule",
    handler: "handleRouteSelect",
    eventForwarding: "onSelectedModuleChange?.(key, route, event)",
    defaultValue: "cases",
    controlledTarget: "tickets",
    requiresDrawer: true,
  },
  {
    id: "agent-workspace",
    componentName: "AgentWorkspace",
    sourceFile: "packages/react/src/templates/AgentWorkspace.js",
    typeFile: "packages/react/src/templates/AgentWorkspace.d.ts",
    selectedProp: "selectedConversation",
    defaultProp: "defaultSelectedConversation",
    callbackProp: "onSelectedConversationChange",
    selectedAttribute: "data-selected-conversation",
    internalState: "internalSelectedConversation",
    internalSetter: "setInternalSelectedConversation",
    resolvedSelection: "resolvedSelectedConversation",
    handler: "handleConversationSelect",
    eventForwarding: "onSelectedConversationChange?.(key, conversation, event)",
    defaultValue: "handoff",
    controlledTarget: "route-help",
    targetSelector: 'data-template-conversation="route-help"',
    requiresDrawer: false,
  },
  {
    id: "configuration-console",
    componentName: "ConfigurationConsole",
    sourceFile: "packages/react/src/templates/ConfigurationConsole.js",
    typeFile: "packages/react/src/templates/ConfigurationConsole.d.ts",
    selectedProp: "selectedModule",
    defaultProp: "defaultSelectedModule",
    callbackProp: "onSelectedModuleChange",
    selectedAttribute: "data-selected-module",
    internalState: "internalSelectedModule",
    internalSetter: "setInternalSelectedModule",
    resolvedSelection: "resolvedSelectedModule",
    handler: "handleRouteSelect",
    eventForwarding: "onSelectedModuleChange?.(key, route, event)",
    defaultValue: "permissions",
    controlledTarget: "drivers",
    requiresDrawer: true,
  },
  {
    id: "driver-card-wallet",
    componentName: "DriverCardWallet",
    sourceFile: "packages/react/src/templates/DriverCardWallet.js",
    typeFile: "packages/react/src/templates/DriverCardWallet.d.ts",
    selectedProp: "selectedSection",
    defaultProp: "defaultSelectedSection",
    callbackProp: "onSelectedSectionChange",
    selectedAttribute: "data-selected-section",
    internalState: "internalSelectedSection",
    internalSetter: "setInternalSelectedSection",
    resolvedSelection: "resolvedSelectedSection",
    handler: "handleSectionSelect",
    eventForwarding: "onSelectedSectionChange?.(key, event)",
    defaultValue: "card",
    controlledTarget: "help",
    targetSelector: 'data-template-section="help"',
    requiresDrawer: false,
  },
  {
    id: "driver-mobile-app",
    componentName: "DriverMobileApp",
    sourceFile: "packages/react/src/templates/DriverMobileApp.js",
    typeFile: "packages/react/src/templates/DriverMobileApp.d.ts",
    selectedProp: "selectedTab",
    defaultProp: "defaultSelectedTab",
    callbackProp: "onSelectedTabChange",
    selectedAttribute: "data-selected-tab",
    internalState: "internalSelectedTab",
    internalSetter: "setInternalSelectedTab",
    resolvedSelection: "resolvedSelectedTab",
    handler: "handleTabSelect",
    eventForwarding: "onSelectedTabChange?.(key, event)",
    defaultValue: "home",
    controlledTarget: "support",
    targetSelector: 'data-template-tab="support"',
    requiresDrawer: false,
  },
  {
    id: "fleet-dashboard-suite",
    componentName: "FleetDashboardSuite",
    sourceFile: "packages/react/src/templates/FleetDashboardSuite.js",
    typeFile: "packages/react/src/templates/FleetDashboardSuite.d.ts",
    selectedProp: "selectedDashboard",
    defaultProp: "defaultSelectedDashboard",
    callbackProp: "onSelectedDashboardChange",
    selectedAttribute: "data-selected-dashboard",
    internalState: "internalSelectedDashboard",
    internalSetter: "setInternalSelectedDashboard",
    resolvedSelection: "resolvedSelectedDashboard",
    handler: "handleRouteSelect",
    eventForwarding: "onSelectedDashboardChange?.(key, route, event)",
    defaultValue: "overview",
    controlledTarget: "finance",
    requiresDrawer: true,
  },
  {
    id: "fleet-manager-desktop",
    componentName: "FleetManagerDesktop",
    sourceFile: "packages/react/src/templates/FleetManagerDesktop.js",
    typeFile: "packages/react/src/templates/FleetManagerDesktop.d.ts",
    selectedProp: "selectedDashboard",
    defaultProp: "defaultSelectedDashboard",
    callbackProp: "onSelectedDashboardChange",
    selectedAttribute: "data-selected-dashboard",
    internalState: "internalSelectedDashboard",
    internalSetter: "setInternalSelectedDashboard",
    resolvedSelection: "resolvedSelectedDashboard",
    handler: "handleRouteSelect",
    eventForwarding: "onSelectedDashboardChange?.(key, route, event)",
    defaultValue: "overview",
    controlledTarget: "fuel",
    requiresDrawer: true,
  },
  {
    id: "routes-and-stations",
    componentName: "RoutesAndStations",
    sourceFile: "packages/react/src/templates/RoutesAndStations.js",
    typeFile: "packages/react/src/templates/RoutesAndStations.d.ts",
    selectedProp: "selectedStationKey",
    defaultProp: "defaultSelectedStationKey",
    callbackProp: "onSelectedStationChange",
    selectedAttribute: "data-selected-station",
    internalState: "internalSelectedStationKey",
    internalSetter: "setInternalSelectedStationKey",
    resolvedSelection: "resolvedSelectedStationKey",
    handler: "handleStationSelect",
    eventForwarding: "onSelectedStationChange?.(key, station, event)",
    defaultValue: "centro",
    controlledTarget: "industrial",
    requiresDrawer: false,
  },
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function includesNeedle(source, needle) {
  return source.includes(needle);
}

function checkNeedle(issues, source, needle, label, file) {
  if (!includesNeedle(source, needle)) {
    issues.push(`${label} missing in ${rel(file)}: ${needle}`);
    return false;
  }
  return true;
}

function checkPattern(issues, source, pattern, label, file) {
  if (!pattern.test(source)) {
    issues.push(`${label} missing in ${rel(file)}: ${pattern}`);
    return false;
  }
  return true;
}

function testBlock(testSource, helperName, componentName) {
  const marker = `${helperName}({`;
  let index = testSource.indexOf(marker);
  while (index !== -1) {
    const end = testSource.indexOf("});", index);
    const block = testSource.slice(index, end === -1 ? index + 1200 : end + 3);
    if (block.includes(`Component: ${componentName}`)) return block;
    index = testSource.indexOf(marker, index + marker.length);
  }
  return "";
}

function forbiddenMatches(source) {
  return [
    /\bdocument\.(?!createElement\b)/g,
    /\bwindow\.(?!requestAnimationFrame\b|cancelAnimationFrame\b)/g,
    /\bquerySelector(All)?\s*\(/g,
    /\binnerHTML\b/g,
    /\binsertAdjacentHTML\b/g,
    /\baddEventListener\s*\(/g,
    /\bremoveEventListener\s*\(/g,
    /apps\/docs/g,
    /docs-demo/g,
  ].flatMap((pattern) => [...source.matchAll(pattern)].map((match) => match[0]));
}

const packageSource = read(packageFile);
const testSource = read(testFile);
const packageJson = packageSource ? JSON.parse(packageSource) : {};
const issues = [];
const rows = templateContracts.map((contract) => {
  const sourcePath = path.join(root, contract.sourceFile);
  const typePath = path.join(root, contract.typeFile);
  const source = read(sourcePath);
  const types = read(typePath);
  const uncontrolledBlock = testBlock(testSource, "assertUncontrolledSelection", contract.componentName);
  const controlledBlock = testBlock(testSource, "assertControlledSelection", contract.componentName);
  const drawerBlock = contract.requiresDrawer
    ? testBlock(testSource, "assertDrawerClose", contract.componentName)
    : "";
  const rowIssues = [];

  if (!source) rowIssues.push(`Missing source file: ${contract.sourceFile}`);
  if (!types) rowIssues.push(`Missing type file: ${contract.typeFile}`);
  if (!uncontrolledBlock) rowIssues.push(`Missing uncontrolled interaction test for ${contract.componentName}.`);
  if (!controlledBlock) rowIssues.push(`Missing controlled interaction test for ${contract.componentName}.`);
  if (contract.requiresDrawer && !drawerBlock) rowIssues.push(`Missing drawer close interaction test for ${contract.componentName}.`);

  [
    [contract.selectedProp, "controlled selected prop"],
    [contract.defaultProp, "default selected prop"],
    [contract.callbackProp, "selection callback prop"],
    [contract.selectedAttribute, "selected root attribute"],
    [contract.internalState, "internal selection state"],
    [contract.internalSetter, "internal selection setter"],
    [contract.resolvedSelection, "resolved selection value"],
    [contract.handler, "selection handler"],
    [`useState(${contract.defaultProp})`, "default selection state seed"],
    [`${contract.resolvedSelection} = ${contract.selectedProp} ?? ${contract.internalState}`, "controlled/uncontrolled resolver"],
    [contract.eventForwarding, "selection callback event forwarding"],
  ].forEach(([needle, label]) => checkNeedle(rowIssues, source, needle, label, sourcePath));

  checkPattern(
    rowIssues,
    source,
    new RegExp(`if\\s*\\(\\s*${contract.selectedProp}\\s*===\\s*undefined\\s*\\)\\s*${contract.internalSetter}\\s*\\(\\s*key\\s*\\)`),
    "controlled selection mutation guard",
    sourcePath,
  );

  [
    `${contract.selectedProp}?`,
    `${contract.defaultProp}?`,
    `${contract.callbackProp}?`,
  ].forEach((needle) => checkNeedle(rowIssues, types, needle, "type prop contract", typePath));

  [
    [`id: "${contract.id}"`, "test template id"],
    [`selectedAttribute: "${contract.selectedAttribute}"`, "test selected attribute"],
    [`defaultProp: "${contract.defaultProp}"`, "test default prop"],
    [`initial: "${contract.defaultValue}"`, "test uncontrolled initial value"],
    [`expected: "${contract.controlledTarget}"`, "test expected selected target"],
  ].forEach(([needle, label]) => checkNeedle(rowIssues, uncontrolledBlock, needle, label, testFile));

  [
    [`id: "${contract.id}"`, "controlled test template id"],
    [`selectedAttribute: "${contract.selectedAttribute}"`, "controlled test selected attribute"],
    [`selectedProp: "${contract.selectedProp}"`, "controlled test selected prop"],
    [`initial: "${contract.defaultValue}"`, "controlled test initial value"],
    [`expected: "${contract.controlledTarget}"`, "controlled test expected value"],
  ].forEach(([needle, label]) => checkNeedle(rowIssues, controlledBlock, needle, label, testFile));

  if (contract.targetSelector) {
    checkNeedle(rowIssues, uncontrolledBlock, contract.targetSelector, "uncontrolled target selector", testFile);
    checkNeedle(rowIssues, controlledBlock, contract.targetSelector, "controlled target selector", testFile);
  }

  if (contract.requiresDrawer) {
    [
      ["drawerOpen", "drawer controlled prop"],
      ["defaultDrawerOpen", "drawer default prop"],
      ["onDrawerOpenChange", "drawer callback prop"],
      ["internalDrawerOpen", "internal drawer state"],
      ["setInternalDrawerOpen", "internal drawer setter"],
      ["resolvedDrawerOpen = drawerOpen ?? internalDrawerOpen", "controlled drawer resolver"],
      ["if (drawerOpen === undefined) setInternalDrawerOpen(open)", "controlled drawer mutation guard"],
      ["onDrawerOpenChange?.(open, event)", "drawer callback event forwarding"],
    ].forEach(([needle, label]) => checkNeedle(rowIssues, source, needle, label, sourcePath));

    [
      ["drawerOpen?", "drawer type prop"],
      ["defaultDrawerOpen?", "drawer default type prop"],
      ["onDrawerOpenChange?", "drawer callback type prop"],
    ].forEach(([needle, label]) => checkNeedle(rowIssues, types, needle, label, typePath));

    checkNeedle(rowIssues, drawerBlock, `id: "${contract.id}"`, "drawer test template id", testFile);
  }

  const forbidden = forbiddenMatches(source);
  if (forbidden.length) {
    rowIssues.push(`Forbidden DOM/docs references in ${rel(sourcePath)}: ${[...new Set(forbidden)].join(", ")}`);
  }

  issues.push(...rowIssues);
  return {
    id: contract.id,
    componentName: contract.componentName,
    selectedProp: contract.selectedProp,
    defaultProp: contract.defaultProp,
    callbackProp: contract.callbackProp,
    selectedAttribute: contract.selectedAttribute,
    requiresDrawer: contract.requiresDrawer,
    sourceContract: rowIssues.length === 0 ? "pass" : "fail",
    issues: rowIssues,
  };
});

const helperNeedles = [
  "fireEvent.click",
  "waitFor(() => assert.equal",
  "view.rerender(React.createElement",
  "assert.equal(templateRoot(view, id).getAttribute(selectedAttribute), initial);",
  "assert.equal(events.at(-1)?.[1], \"click\");",
];
helperNeedles.forEach((needle) => checkNeedle(issues, testSource, needle, "shared interaction helper evidence", testFile));

if (!packageJson.scripts?.test?.includes("node test/template-interaction.test.mjs")) {
  issues.push("packages/react test script does not include node test/template-interaction.test.mjs.");
}

const drawerTemplates = templateContracts.filter((contract) => contract.requiresDrawer);
const templatesWithoutIssues = rows.filter((row) => row.issues.length === 0).length;
const forbiddenFindings = rows.reduce((total, row) => total + row.issues.filter((issue) => issue.includes("Forbidden DOM/docs references")).length, 0);
const inventory = {
  templatesAudited: templateContracts.length,
  sourceFiles: templateContracts.filter((contract) => fs.existsSync(path.join(root, contract.sourceFile))).length,
  typeFiles: templateContracts.filter((contract) => fs.existsSync(path.join(root, contract.typeFile))).length,
  interactionTestFiles: fs.existsSync(testFile) ? 1 : 0,
  packageTestScriptReferences: packageJson.scripts?.test?.includes("node test/template-interaction.test.mjs") ? 1 : 0,
  templatesWithPassingInteractionContracts: templatesWithoutIssues,
  uncontrolledSelectionCases: rows.filter((row) => testBlock(testSource, "assertUncontrolledSelection", row.componentName)).length,
  controlledSelectionCases: rows.filter((row) => testBlock(testSource, "assertControlledSelection", row.componentName)).length,
  drawerCloseCases: drawerTemplates.filter((contract) => testBlock(testSource, "assertDrawerClose", contract.componentName)).length,
  templatesWithSelectionState: rows.filter((row) => !row.issues.some((issue) => issue.includes("internal selection state"))).length,
  templatesWithSelectionCallbacks: rows.filter((row) => !row.issues.some((issue) => issue.includes("selection callback"))).length,
  templatesWithControlledSelectionGuard: rows.filter((row) => !row.issues.some((issue) => issue.includes("controlled selection mutation guard"))).length,
  templatesWithDrawerCallbacks: drawerTemplates.filter((contract) => {
    const row = rows.find((item) => item.id === contract.id);
    return row && !row.issues.some((issue) => issue.includes("drawer callback"));
  }).length,
  templatesWithControlledDrawerGuard: drawerTemplates.filter((contract) => {
    const row = rows.find((item) => item.id === contract.id);
    return row && !row.issues.some((issue) => issue.includes("controlled drawer mutation guard"));
  }).length,
  testSelectorAssertions: rows.filter((row) => !row.issues.some((issue) => issue.includes("selected attribute"))).length,
  testMutationGuards: rows.filter((row) => !row.issues.some((issue) => issue.includes("controlled selection mutation guard"))).length,
  docsRuntimeReferences: forbiddenFindings,
  vanillaDomReferences: forbiddenFindings,
  interactionContractGaps: issues.length,
  reactTemplateInteractionGovernanceDebt: issues.length,
};

const report = {
  status: issues.length ? "fail" : "pass",
  title: "React template interaction governance audit",
  generatedAt: new Date().toISOString(),
  summary: issues.length
    ? `${issues.length} React template interaction governance gaps remain.`
    : "React template interaction contracts pass for all required templates.",
  inventory,
  templates: rows,
  issues,
};

function markdown(report) {
  const lines = [
    "# React template interaction governance audit",
    "",
    `Status: ${report.status}`,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Templates",
    "",
    "| Template | Selection | Callback | Drawer | Status |",
    "| --- | --- | --- | --- | --- |",
    ...report.templates.map((row) => `| ${row.id} | ${row.selectedProp}/${row.defaultProp} | ${row.callbackProp} | ${row.requiresDrawer ? "controlled" : "n/a"} | ${row.sourceContract} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-react-template-interaction-governance.mjs.`);
  }
}

fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, markdown(report));

if (report.status !== "pass") {
  throw new Error(report.summary);
}

console.log(JSON.stringify({
  status: report.status,
  check: "react template interaction governance",
  inventory: report.inventory,
}, null, 2));
