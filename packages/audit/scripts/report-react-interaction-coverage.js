#!/usr/bin/env node

const {
  fs,
  path,
  add,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { governedReactPrimitiveIds } = require("./audit-react-primary-inventory.js");
const {
  accessibilityCriticalRequirementsPolicy,
  reactSecondaryExpectedInventory,
} = require("./react-primary-governance-policy.js");

const reactSrcDir = path.join(root, "packages/react/src");
const reactTestDir = path.join(root, "packages/react/test");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-interaction-coverage-audit.json");
const markdownOutput = path.join(outputDir, "react-interaction-coverage-audit.md");
const checkMode = process.argv.includes("--check");
function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function reactComponentNames() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .filter((file) => !governedReactPrimitiveIds.has(kebab(path.basename(file, ".js"))))
    .map((file) => path.basename(file, ".js"))
    .sort();
}

function kebab(value) {
  return String(value).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function testSource() {
  if (!fs.existsSync(reactTestDir)) return "";
  return fs.readdirSync(reactTestDir)
    .filter((file) => /\.(?:mjs|js|tsx?|jsx)$/.test(file))
    .map((file) => read(path.join(reactTestDir, file)))
    .join("\n");
}

function declaredCallbacks(typeSource) {
  const callbacks = [];
  for (const match of typeSource.matchAll(/^\s+(on[A-Z][A-Za-z0-9_]*)\??:\s*([^;\n]+)/gm)) {
    const [, name, type] = match;
    if (/\)\s*=>|=>\s*/.test(type)) callbacks.push({ name, type: type.trim() });
  }
  return [...new Map(callbacks.map((callback) => [callback.name, callback])).values()]
    .sort((left, right) => left.name.localeCompare(right.name));
}

function sourceUsesCallback(source, callback) {
  return new RegExp(`\\b${callback}\\b`).test(source);
}

function testCoversCallback(tests, component, callback) {
  const nearComponentThenCallback = new RegExp(`\\b${component}\\b[\\s\\S]{0,1600}\\b${callback}\\b`);
  const nearCallbackThenComponent = new RegExp(`\\b${callback}\\b[\\s\\S]{0,1600}\\b${component}\\b`);
  return nearComponentThenCallback.test(tests) || nearCallbackThenComponent.test(tests);
}

const requiredKeyboardContracts = [
  { component: "Combobox", keys: ["ArrowDown", "ArrowUp", "Enter", "Escape"], assertions: ["aria-activedescendant", "aria-expanded", "data-selected", "disabled"] },
  { component: "Select", keys: ["ArrowDown", "ArrowUp", "Enter", "Escape"], assertions: ["aria-activedescendant", "aria-expanded", "data-active", "disabled"] },
  { component: "CountrySelector", keys: ["ArrowDown", "ArrowUp", "Enter", "Escape"], assertions: ["aria-activedescendant", "aria-expanded", "data-selected", "disabled"] },
  { component: "Menu", keys: ["ArrowDown", "ArrowUp", "Home", "End", "Enter", "Escape"], assertions: ["aria-expanded", "activeElement", "focus"] },
  { component: "Dialog", keys: ["Escape"], assertions: ["aria-modal", "aria-expanded", "activeElement"] },
  { component: "Drawer", keys: ["Escape"], assertions: ["aria-modal", "aria-expanded", "activeElement"] },
  { component: "Popover", keys: ["Escape", "Tab"], assertions: ["aria-expanded", "focus"] },
  { component: "Tooltip", keys: ["Escape"], assertions: ["aria-describedby"] },
  { component: "Tabs", keys: ["ArrowRight", "ArrowLeft", "Home", "End"], assertions: ["aria-selected", "disabled"] },
  { component: "TreeView", keys: ["ArrowDown", "ArrowUp", "Enter"], assertions: ["aria-selected", "data-selected"] },
];

const requiredStateSemanticsContracts = [
  { component: "Button", assertions: ["data-state", "aria-busy", "button--danger", "button--warning"] },
  { component: "Input", assertions: ["data-state", "aria-busy", "field__icon--loading", "success", "warning"] },
  { component: "Select", assertions: ["data-active", "data-selected", "aria-activedescendant", "aria-expanded"] },
  { component: "Combobox", assertions: ["data-active", "data-selected", "aria-activedescendant", "aria-expanded"] },
];

function testCoversKeyboardContract(tests, contract) {
  const windows = [];
  const componentPattern = new RegExp(`\\b${contract.component}\\b`, "g");
  for (const match of tests.matchAll(componentPattern)) {
    const start = Math.max(0, match.index - 800);
    const end = Math.min(tests.length, match.index + 5000);
    windows.push(tests.slice(start, end));
  }
  const missingKeys = contract.keys.filter((key) => !windows.some((scoped) => scoped.includes(key)));
  const missingAssertions = contract.assertions.filter((assertion) => !windows.some((scoped) => scoped.includes(assertion)));
  return {
    ...contract,
    covered: missingKeys.length === 0 && missingAssertions.length === 0,
    missingKeys,
    missingAssertions,
  };
}

function testCoversStateSemanticsContract(tests, contract) {
  const windows = [];
  const componentPattern = new RegExp(`\\b${contract.component}\\b`, "g");
  for (const match of tests.matchAll(componentPattern)) {
    const start = Math.max(0, match.index - 800);
    const end = Math.min(tests.length, match.index + 5000);
    windows.push(tests.slice(start, end));
  }
  const missingAssertions = contract.assertions.filter((assertion) => !windows.some((scoped) => scoped.includes(assertion)));
  return {
    ...contract,
    covered: missingAssertions.length === 0,
    missingAssertions,
  };
}

function createReport() {
  const { expectedInventory, governance } = reactSecondaryExpectedInventory("interaction");
  const criticalPolicy = accessibilityCriticalRequirementsPolicy();
  const tests = testSource();
  const components = reactComponentNames().map((component) => {
    const sourceFile = path.join(reactSrcDir, `${component}.js`);
    const typesFile = path.join(reactSrcDir, `${component}.d.ts`);
    const source = readIfExists(sourceFile);
    const types = readIfExists(typesFile);
    const callbacks = declaredCallbacks(types);
    const callbackNames = callbacks.map((callback) => callback.name);
    const missingEventParam = callbacks
      .filter((callback) => !/\bevent\??:/.test(callback.type))
      .map((callback) => callback.name);
    const missingInSource = callbackNames.filter((callback) => !sourceUsesCallback(source, callback));
    const missingInTests = callbackNames.filter((callback) => !testCoversCallback(tests, component, callback));
    return {
      component,
      source: rel(sourceFile),
      types: rel(typesFile),
      callbacks: callbackNames,
      callbackContracts: callbacks,
      sourceCovered: callbackNames.filter((callback) => !missingInSource.includes(callback)),
      testCovered: callbackNames.filter((callback) => !missingInTests.includes(callback)),
      missingInSource,
      missingInTests,
      missingEventParam,
      status: missingInSource.length || missingEventParam.length || missingInTests.length ? "fail" : "pass",
    };
  });
  const byComponent = new Map(components.map((component) => [component.component, component]));
  const manualAccessibilityCritical = criticalPolicy.criticalComponents.map((component) => {
    const entry = byComponent.get(component);
    const hasTestPresence = new RegExp(`\\b${component}\\b`).test(tests);
    return {
      component,
      present: Boolean(entry),
      status: entry?.status ?? "missing",
      callbacks: entry?.callbacks ?? [],
      hasInteractionTestPresence: hasTestPresence,
    };
  });
  const criticalMissing = manualAccessibilityCritical.filter((component) => !component.present || component.status !== "pass" || !component.hasInteractionTestPresence);
  const keyboardContracts = requiredKeyboardContracts.map((contract) => testCoversKeyboardContract(tests, contract));
  const missingKeyboardContracts = keyboardContracts.filter((contract) => !contract.covered);
  const stateSemanticsContracts = requiredStateSemanticsContracts.map((contract) => testCoversStateSemanticsContract(tests, contract));
  const missingStateSemanticsContracts = stateSemanticsContracts.filter((contract) => !contract.covered);
  const inventory = {
    components: components.length,
    withCallbacks: components.filter((component) => component.callbacks.length).length,
    pass: components.filter((component) => component.status === "pass").length,
    review: 0,
    fail: components.filter((component) => component.status === "fail").length,
    missingTestCallbacks: components.reduce((total, component) => total + component.missingInTests.length, 0),
    missingEventParams: components.reduce((total, component) => total + component.missingEventParam.length, 0),
    manualAccessibilityCritical: manualAccessibilityCritical.length,
    manualAccessibilityCriticalPass: manualAccessibilityCritical.filter((component) => component.present && component.status === "pass" && component.hasInteractionTestPresence).length,
    requiredKeyboardContracts: keyboardContracts.length,
    requiredKeyboardContractsPass: keyboardContracts.filter((contract) => contract.covered).length,
    missingRequiredKeyboardContracts: missingKeyboardContracts.length,
    requiredStateSemanticsContracts: stateSemanticsContracts.length,
    requiredStateSemanticsContractsPass: stateSemanticsContracts.filter((contract) => contract.covered).length,
    missingRequiredStateSemanticsContracts: missingStateSemanticsContracts.length,
    reactGovernancePolicyIssues: governance.issues.length + criticalPolicy.governance.issues.length,
  };
  inventory.interactionDebt = inventory.fail
    + inventory.missingTestCallbacks
    + inventory.missingEventParams
    + (inventory.manualAccessibilityCritical - inventory.manualAccessibilityCriticalPass)
    + inventory.missingRequiredKeyboardContracts
    + inventory.missingRequiredStateSemanticsContracts
    + inventory.reactGovernancePolicyIssues;
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  return {
    status: inventory.interactionDebt || baselineMismatches.length ? "fail" : "pass",
    audit: "react interaction coverage",
    principle: "React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots. The actionable debt metric is interactionDebt.",
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    governance: {
      ...governance,
      criticalPolicy,
    },
    inventory,
    manualAccessibilityCritical,
    keyboardContracts,
    stateSemanticsContracts,
    components,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const baselineMismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const lines = [
    "# React Interaction Coverage Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Components audited: ${report.inventory.components}`,
    `- Interaction debt: ${report.inventory.interactionDebt}`,
    `- Components with callbacks: ${report.inventory.withCallbacks}`,
    `- Pass: ${report.inventory.pass}`,
    `- Review: ${report.inventory.review}`,
    `- Fail: ${report.inventory.fail}`,
    `- Missing callback test assertions: ${report.inventory.missingTestCallbacks}`,
    `- Missing callback event params: ${report.inventory.missingEventParams}`,
    `- Manual accessibility critical pass: ${report.inventory.manualAccessibilityCriticalPass}/${report.inventory.manualAccessibilityCritical}`,
    `- Required keyboard contracts pass: ${report.inventory.requiredKeyboardContractsPass}/${report.inventory.requiredKeyboardContracts}`,
    `- Required state semantics contracts pass: ${report.inventory.requiredStateSemanticsContractsPass}/${report.inventory.requiredStateSemanticsContracts}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. interactionDebt must stay at 0; callback coverage and critical interaction coverage should only change with explicit product/API review.",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...baselineRows,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(baselineMismatchRows.length ? baselineMismatchRows : ["| None | None | None |"]),
    "",
    "## Manual Accessibility Critical Components",
    "",
    "| Component | Status | Callbacks | Interaction test presence |",
    "| --- | --- | --- | --- |",
    ...report.manualAccessibilityCritical.map((component) => `| ${component.component} | ${component.status} | ${component.callbacks.join(", ") || "None"} | ${component.hasInteractionTestPresence ? "yes" : "no"} |`),
    "",
    "## Missing Interaction Tests",
    "",
  ];

  const missing = report.components.filter((component) => component.missingInTests.length);
  if (!missing.length) {
    lines.push("- None");
  } else {
    lines.push("| Component | Missing callback coverage |");
    lines.push("| --- | --- |");
    for (const component of missing) {
      lines.push(`| ${component.component} | ${component.missingInTests.join(", ")} |`);
    }
  }

  const missingSource = report.components.filter((component) => component.missingInSource.length);
  lines.push("", "## Missing Source Usage", "");
  if (!missingSource.length) {
    lines.push("- None");
  } else {
    lines.push("| Component | Declared but not used |");
    lines.push("| --- | --- |");
    for (const component of missingSource) {
      lines.push(`| ${component.component} | ${component.missingInSource.join(", ")} |`);
    }
  }

  const missingEventParams = report.components.filter((component) => component.missingEventParam.length);
  lines.push("", "## Missing Callback Event Params", "");
  if (!missingEventParams.length) {
    lines.push("- None");
  } else {
    lines.push("| Component | Callbacks |");
    lines.push("| --- | --- |");
    for (const component of missingEventParams) {
      lines.push(`| ${component.component} | ${component.missingEventParam.join(", ")} |`);
    }
  }

  const missingKeyboardContracts = report.keyboardContracts.filter((contract) => !contract.covered);
  lines.push("", "## Required Keyboard Contracts", "");
  lines.push("| Component | Status | Keys | Assertions | Missing keys | Missing assertions |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const contract of report.keyboardContracts) {
    lines.push(`| ${contract.component} | ${contract.covered ? "pass" : "fail"} | ${contract.keys.join(", ")} | ${contract.assertions.join(", ")} | ${contract.missingKeys.join(", ") || "None"} | ${contract.missingAssertions.join(", ") || "None"} |`);
  }
  if (missingKeyboardContracts.length) {
    lines.push("", `Required keyboard contract failures: ${missingKeyboardContracts.map((contract) => contract.component).join(", ")}.`);
  }

  const missingStateSemanticsContracts = report.stateSemanticsContracts.filter((contract) => !contract.covered);
  lines.push("", "## Required State Semantics Contracts", "");
  lines.push("| Component | Status | Assertions | Missing assertions |");
  lines.push("| --- | --- | --- | --- |");
  for (const contract of report.stateSemanticsContracts) {
    lines.push(`| ${contract.component} | ${contract.covered ? "pass" : "fail"} | ${contract.assertions.join(", ")} | ${contract.missingAssertions.join(", ") || "None"} |`);
  }
  if (missingStateSemanticsContracts.length) {
    lines.push("", `Required state semantics contract failures: ${missingStateSemanticsContracts.map((contract) => contract.component).join(", ")}.`);
  }

  return `${lines.join("\n")}\n`;
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, toMarkdown(report));
}

function checkReactInteractionCoverage() {
  const report = createReport();
  const failing = report.components.filter((component) => component.missingInSource.length);
  for (const component of failing) {
    add("errors", path.join(root, component.types), 1, `${component.component} declares callbacks that are not used in React source: ${component.missingInSource.join(", ")}.`);
  }
  const missingEventParams = report.components.filter((component) => component.missingEventParam.length);
  for (const component of missingEventParams) {
    add("errors", path.join(root, component.types), 1, `${component.component} callback props must include an event parameter: ${component.missingEventParam.join(", ")}.`);
  }
  const missingTests = report.components.filter((component) => component.missingInTests.length);
  if (missingTests.length) {
    add("errors", path.join(root, "packages/react/test/interaction.test.mjs"), 1, `React interaction coverage missing for ${missingTests.length} components; see docs/audits/react-interaction-coverage-audit.md.`);
  }
  const criticalMissing = report.manualAccessibilityCritical.filter((component) => !component.present || component.status !== "pass" || !component.hasInteractionTestPresence);
  if (criticalMissing.length) {
    add("errors", path.join(root, "packages/react/test/interaction.test.mjs"), 1, `Manual accessibility critical components need passing interaction coverage: ${criticalMissing.map((component) => component.component).join(", ")}.`);
  }
  const missingKeyboardContracts = report.keyboardContracts.filter((contract) => !contract.covered);
  if (missingKeyboardContracts.length) {
    add("errors", path.join(root, "packages/react/test/interaction.test.mjs"), 1, `Required keyboard contracts missing test evidence: ${missingKeyboardContracts.map((contract) => contract.component).join(", ")}.`);
  }
  const missingStateSemanticsContracts = report.stateSemanticsContracts.filter((contract) => !contract.covered);
  if (missingStateSemanticsContracts.length) {
    add("errors", path.join(root, "packages/react/test/interaction.test.mjs"), 1, `Required state semantics contracts missing test evidence: ${missingStateSemanticsContracts.map((contract) => contract.component).join(", ")}.`);
  }
}

function main() {
  const report = createReport();
  if (checkMode) {
    const nextJson = `${JSON.stringify(report, null, 2)}\n`;
    const nextMarkdown = toMarkdown(report);
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("React interaction coverage report is stale. Run: node packages/audit/scripts/report-react-interaction-coverage.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    interactionDebt: report.inventory.interactionDebt,
    withCallbacks: report.inventory.withCallbacks,
    review: report.inventory.review,
    fail: report.inventory.fail,
    missingTestCallbacks: report.inventory.missingTestCallbacks,
    missingEventParams: report.inventory.missingEventParams,
    requiredKeyboardContracts: report.inventory.requiredKeyboardContracts,
    missingRequiredKeyboardContracts: report.inventory.missingRequiredKeyboardContracts,
    requiredStateSemanticsContracts: report.inventory.requiredStateSemanticsContracts,
    missingRequiredStateSemanticsContracts: report.inventory.missingRequiredStateSemanticsContracts,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status === "fail") process.exitCode = 1;
}

if (require.main === module) main();

module.exports = { checkReactInteractionCoverage, createReport };
