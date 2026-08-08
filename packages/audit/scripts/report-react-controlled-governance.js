#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const reactInteractionTestFile = path.join(root, "packages/react/test/interaction.test.mjs");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-controlled-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-controlled-governance-audit.md");

const controlledMarkers = [
  { marker: "isValueControlled", prop: "value" },
  { marker: "isCheckedControlled", prop: "checked" },
  { marker: "isSelectedKeyControlled", prop: "selectedKey" },
  { marker: "isSortControlled", prop: "sortKey" },
  { marker: "isExpandedKeyControlled", prop: "expandedKey" },
  { marker: "isExpandedIdsControlled", prop: "expandedIds" },
  { marker: "isPageControlled", prop: "page" },
];

function componentFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function pascal(value) {
  const words = String(value).match(/[A-Z]?[a-z0-9]+|[A-Z]+(?![a-z])/g) ?? [String(value)];
  return words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join("");
}

function openContractComponents() {
  const contractsSource = fs.existsSync(contractsFile) ? read(contractsFile) : "";
  const components = [];
  for (const match of contractsSource.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, contractKey, body] = match;
    if (!body.includes('{ name: "open"') || !body.includes('{ name: "onOpenChange"')) continue;
    components.push(pascal(contractKey));
  }
  return new Set(components);
}

function testHasOpenCoverage(tests, component) {
  const componentRender = new RegExp(`render\\(React\\.createElement\\(${component}\\b`);
  const controlledRerender = new RegExp(`rerender${component}[\\s\\S]{0,900}\\bopen:\\s*true[\\s\\S]{0,900}rerender${component}[\\s\\S]{0,900}\\bopen:\\s*false`);
  return componentRender.test(tests) && controlledRerender.test(tests);
}

function testHasPropCoverage(tests, component, prop) {
  const controlledRerender = new RegExp(`rerender\\w*\\(React\\.createElement\\(${component}\\b[\\s\\S]{0,900}\\b${prop}:\\s*`);
  return controlledRerender.test(tests);
}

function createReport() {
  const tests = fs.existsSync(reactInteractionTestFile) ? read(reactInteractionTestFile) : "";
  const openContracts = openContractComponents();
  const components = componentFiles().map((file) => {
    const component = path.basename(file, ".js");
    const source = read(file);
    const controlledProps = controlledMarkers
      .filter((item) => source.includes(item.marker))
      .map((item) => ({
        prop: item.prop,
        marker: item.marker,
        sourceControlled: source.includes(item.marker),
        testCovered: testHasPropCoverage(tests, component, item.prop),
      }));
    const openControlled = {
      contractControlled: openContracts.has(component),
      sourceControlled: /isOpenControlled|openProp !== undefined/.test(source),
      testCovered: openContracts.has(component) ? testHasOpenCoverage(tests, component) : false,
    };
    const failures = [
      ...(openControlled.contractControlled && !openControlled.sourceControlled ? ["open source"] : []),
      ...(openControlled.contractControlled && !openControlled.testCovered ? ["open test"] : []),
      ...controlledProps.flatMap((item) => [
        ...(!item.sourceControlled ? [`${item.prop} source`] : []),
        ...(!item.testCovered ? [`${item.prop} test`] : []),
      ]),
    ];
    return {
      component,
      file: rel(file),
      openControlled,
      controlledProps,
      failures,
      status: failures.length ? "fail" : "pass",
    };
  });
  const controlledComponents = components.filter((component) => component.openControlled.contractControlled || component.controlledProps.length);
  return {
    status: components.some((component) => component.status === "fail") ? "fail" : "pass",
    audit: "react controlled governance",
    principle: "Controlled React props must be explicit in source and covered by external rerender tests so product code can own state without hidden uncontrolled drift.",
    inventory: {
      components: components.length,
      controlledComponents: controlledComponents.length,
      openControlledComponents: components.filter((component) => component.openControlled.contractControlled).length,
      controlledPropEdges: components.reduce((total, component) => total + component.controlledProps.length, 0),
      testCoveredEdges: components.reduce((total, component) => total + component.controlledProps.filter((item) => item.testCovered).length, 0),
      failures: components.reduce((total, component) => total + component.failures.length, 0),
    },
    components,
  };
}

function toMarkdown(report) {
  const componentRows = report.components
    .filter((component) => component.openControlled.contractControlled || component.controlledProps.length || component.failures.length)
    .map((component) => `| ${component.component} | ${component.status} | ${component.openControlled.contractControlled ? "yes" : "no"} | ${component.openControlled.sourceControlled ? "yes" : "no"} | ${component.openControlled.testCovered ? "yes" : "no"} | ${component.controlledProps.map((item) => `${item.prop}:${item.testCovered ? "tested" : "missing"}`).join(", ") || "None"} | ${component.failures.join(", ") || "None"} |`);
  return [
    "# React Controlled Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Controlled components: ${report.inventory.controlledComponents}`,
    `- Open-controlled components: ${report.inventory.openControlledComponents}`,
    `- Controlled prop edges: ${report.inventory.controlledPropEdges}`,
    `- Tested controlled prop edges: ${report.inventory.testCoveredEdges}`,
    `- Failures: ${report.inventory.failures}`,
    "",
    "## Components",
    "",
    "| Component | Status | Open contract | Open source | Open test | Controlled props | Failures |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...(componentRows.length ? componentRows : ["| None | pass | no | no | no | None | None |"]),
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
      console.error("React controlled governance report is stale. Run: node packages/audit/scripts/report-react-controlled-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    controlledComponents: report.inventory.controlledComponents,
    openControlledComponents: report.inventory.openControlledComponents,
    controlledPropEdges: report.inventory.controlledPropEdges,
    failures: report.inventory.failures,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
