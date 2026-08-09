#!/usr/bin/env node

const {
  fs,
  path,
  add,
  read,
  rel,
  root,
} = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");
const reactTestDir = path.join(root, "packages/react/test");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-interaction-coverage-audit.json");
const markdownOutput = path.join(outputDir, "react-interaction-coverage-audit.md");
const checkMode = process.argv.includes("--check");
const expectedInventory = {
  components: 56,
  withCallbacks: 40,
  pass: 56,
  review: 0,
  fail: 0,
  missingTestCallbacks: 0,
  missingEventParams: 0,
  manualAccessibilityCritical: 10,
  manualAccessibilityCriticalPass: 10,
};
const manualAccessibilityCriticalComponents = [
  "Dialog",
  "Drawer",
  "Menu",
  "Popover",
  "Tooltip",
  "Select",
  "Combobox",
  "CountrySelector",
  "DatePicker",
  "DateRangePicker",
];

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function reactComponentNames() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .map((file) => path.basename(file, ".js"))
    .sort();
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

function createReport() {
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
  const manualAccessibilityCritical = manualAccessibilityCriticalComponents.map((component) => {
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
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({
      key,
      expected,
      actual: inventory[key],
    }));
  return {
    status: components.some((component) => component.status === "fail") || criticalMissing.length || baselineMismatches.length ? "fail" : "pass",
    audit: "react interaction coverage",
    principle: "React components that declare callback props must use them in source and must have explicit interaction coverage, not only static render snapshots.",
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
    },
    inventory,
    manualAccessibilityCritical,
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
    `- Components with callbacks: ${report.inventory.withCallbacks}`,
    `- Pass: ${report.inventory.pass}`,
    `- Review: ${report.inventory.review}`,
    `- Fail: ${report.inventory.fail}`,
    `- Missing callback test assertions: ${report.inventory.missingTestCallbacks}`,
    `- Missing callback event params: ${report.inventory.missingEventParams}`,
    `- Manual accessibility critical pass: ${report.inventory.manualAccessibilityCriticalPass}/${report.inventory.manualAccessibilityCritical}`,
    `- Inventory baseline mismatches: ${report.baseline.mismatches.length}`,
    "",
    "## Baseline Budget",
    "",
    "Changing these numbers is a contract decision. Callback coverage and critical interaction coverage should only change with explicit product/API review.",
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
    withCallbacks: report.inventory.withCallbacks,
    review: report.inventory.review,
    fail: report.inventory.fail,
    missingTestCallbacks: report.inventory.missingTestCallbacks,
    missingEventParams: report.inventory.missingEventParams,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status === "fail") process.exitCode = 1;
}

if (require.main === module) main();

module.exports = { checkReactInteractionCoverage, createReport };
