#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const {
  contractBodyFor,
  inheritedReactPropNames,
  lowerFirst,
  ownReactPropsFor,
  reactAllowedValues,
  semanticInheritedPropsFor,
  unionValues,
} = require("./react-contract-shared.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-contract-prop-alignment-audit.json");
const markdownOutput = path.join(outputDir, "react-contract-prop-alignment-audit.md");

function contractPropsFor(contractBody) {
  return [...contractBody.matchAll(/\{ name: "([^"]+)", type: "((?:\\.|[^"])*)", required: (true|false) \}/g)]
    .map((match) => ({ name: match[1], type: match[2], required: match[3] === "true" }));
}

function contractNamedValues(contractBody, propName) {
  const fieldByProp = {
    intent: "intents",
    status: "statuses",
    state: "states",
    tone: "intents",
    variant: "variants",
  };
  const field = fieldByProp[propName];
  if (!field) return [];
  const valuesExpression = contractBody.match(new RegExp(`\\b${field}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "";
  return unionValues(valuesExpression);
}

function contractAllowedValues(contractBody, contractProp) {
  const propValues = unionValues(contractProp.type);
  return propValues.length ? propValues : contractNamedValues(contractBody, contractProp.name);
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function sameValues(left, right) {
  const leftValues = sortedUnique(left);
  const rightValues = sortedUnique(right);
  return leftValues.length === rightValues.length && leftValues.every((value, index) => value === rightValues[index]);
}

function componentFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function createReport() {
  const contractsSource = fs.existsSync(contractsFile) ? read(contractsFile) : "";
  const components = componentFiles().map((sourceFile) => {
    const component = path.basename(sourceFile, ".js");
    const typesFile = path.join(reactSrcDir, `${component}.d.ts`);
    const types = fs.existsSync(typesFile) ? read(typesFile) : "";
    const contractKey = lowerFirst(component);
    const contractBody = contractBodyFor(contractsSource, contractKey);
    const contractProps = contractPropsFor(contractBody);
    const ownReactProps = ownReactPropsFor(types, component);
    const publicReactProps = ownReactProps.filter((prop) => !inheritedReactPropNames.has(prop.name));
    const semanticInheritedProps = semanticInheritedPropsFor(component)
      .filter((propName) => new RegExp(`\\b${propName}\\??:`).test(types));
    const reactPublicPropNames = publicReactProps.map((prop) => prop.name);
    const contractPropNames = contractProps.map((prop) => prop.name);
    const reactExposesProp = (propName) => (
      reactPublicPropNames.includes(propName)
      || new RegExp(`\\b${propName}\\??:`).test(types)
    );
    const semanticInheritedMissingFromContract = semanticInheritedProps.filter((propName) => !contractPropNames.includes(propName));
    const extraReactProps = reactPublicPropNames.filter((propName) => !contractPropNames.includes(propName));
    const inheritedContractProps = contractPropNames
      .filter((propName) => inheritedReactPropNames.has(propName))
      .filter((propName) => !reactExposesProp(propName));
    const missingReactProps = contractPropNames.filter((propName) => (
      !reactExposesProp(propName)
      && !semanticInheritedProps.includes(propName)
      && !inheritedContractProps.includes(propName)
    ));
    const requiredMismatches = contractProps
      .filter((contractProp) => {
        const reactProp = ownReactProps.find((item) => item.name === contractProp.name);
        return reactProp && reactProp.required !== contractProp.required;
      })
      .map((contractProp) => contractProp.name);
    const typeValueMismatches = contractProps
      .filter((contractProp) => reactExposesProp(contractProp.name))
      .map((contractProp) => ({
        prop: contractProp.name,
        contractValues: contractAllowedValues(contractBody, contractProp),
        reactValues: reactAllowedValues(types, component, contractProp.name),
      }))
      .filter((item) => item.contractValues.length && item.reactValues.length && !sameValues(item.contractValues, item.reactValues));
    const failures = [
      ...extraReactProps.map((prop) => `extra React prop ${prop}`),
      ...semanticInheritedMissingFromContract.map((prop) => `semantic inherited prop missing from contract ${prop}`),
      ...missingReactProps.map((prop) => `contract prop missing from React ${prop}`),
      ...requiredMismatches.map((prop) => `required mismatch ${prop}`),
      ...typeValueMismatches.map((item) => `type values mismatch ${item.prop}`),
    ];
    return {
      component,
      contractKey,
      source: rel(sourceFile),
      types: rel(typesFile),
      contractProps,
      publicReactProps,
      semanticInheritedProps,
      inheritedContractProps,
      extraReactProps,
      missingReactProps,
      semanticInheritedMissingFromContract,
      requiredMismatches,
      typeValueMismatches,
      failures,
      status: failures.length ? "fail" : "pass",
    };
  });
  return {
    status: components.some((component) => component.status === "fail") ? "fail" : "pass",
    audit: "react contract prop alignment",
    principle: "The public React prop surface must stay aligned with componentContracts so product teams can trust generated docs, types, and platform metadata as one contract.",
    inventory: {
      components: components.length,
      pass: components.filter((component) => component.status === "pass").length,
      fail: components.filter((component) => component.status === "fail").length,
      contractProps: components.reduce((total, component) => total + component.contractProps.length, 0),
      publicReactProps: components.reduce((total, component) => total + component.publicReactProps.length, 0),
      semanticInheritedProps: components.reduce((total, component) => total + component.semanticInheritedProps.length, 0),
      inheritedContractProps: components.reduce((total, component) => total + component.inheritedContractProps.length, 0),
      extraReactProps: components.reduce((total, component) => total + component.extraReactProps.length, 0),
      missingReactProps: components.reduce((total, component) => total + component.missingReactProps.length, 0),
      requiredMismatches: components.reduce((total, component) => total + component.requiredMismatches.length, 0),
      typeValueMismatches: components.reduce((total, component) => total + component.typeValueMismatches.length, 0),
    },
    components,
  };
}

function toMarkdown(report) {
  const componentRows = report.components.map((component) => `| ${component.component} | ${component.status} | ${component.contractProps.length} | ${component.publicReactProps.length} | ${component.extraReactProps.join(", ") || "None"} | ${component.missingReactProps.join(", ") || "None"} | ${component.requiredMismatches.join(", ") || "None"} | ${component.typeValueMismatches.map((item) => item.prop).join(", ") || "None"} |`);
  const failureRows = report.components.flatMap((component) => component.failures.map((failure) => `| ${component.component} | ${failure} |`));
  const typeValueRows = report.components.flatMap((component) => component.typeValueMismatches.map((item) => `| ${component.component} | ${item.prop} | ${item.contractValues.join(", ")} | ${item.reactValues.join(", ")} |`));
  return [
    "# React Contract Prop Alignment Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Pass: ${report.inventory.pass}`,
    `- Fail: ${report.inventory.fail}`,
    `- Contract props: ${report.inventory.contractProps}`,
    `- Public React props: ${report.inventory.publicReactProps}`,
    `- Semantic inherited props: ${report.inventory.semanticInheritedProps}`,
    `- Contract props satisfied by React DOM inheritance: ${report.inventory.inheritedContractProps}`,
    `- Extra React props: ${report.inventory.extraReactProps}`,
    `- Missing React props: ${report.inventory.missingReactProps}`,
    `- Required mismatches: ${report.inventory.requiredMismatches}`,
    `- Type value mismatches: ${report.inventory.typeValueMismatches}`,
    "",
    "## Components",
    "",
    "| Component | Status | Contract props | React props | Extra React props | Missing React props | Required mismatches | Type value mismatches |",
    "| --- | --- | ---: | ---: | --- | --- | --- | --- |",
    ...componentRows,
    "",
    "## Type Value Mismatches",
    "",
    "| Component | Prop | Contract values | React values |",
    "| --- | --- | --- | --- |",
    ...(typeValueRows.length ? typeValueRows : ["| None | None | None | None |"]),
    "",
    "## Failures",
    "",
    "| Component | Failure |",
    "| --- | --- |",
    ...(failureRows.length ? failureRows : ["| None | None |"]),
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
      console.error("React contract prop alignment report is stale. Run: node packages/audit/scripts/report-react-contract-prop-alignment.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    pass: report.inventory.pass,
    fail: report.inventory.fail,
    extraReactProps: report.inventory.extraReactProps,
    missingReactProps: report.inventory.missingReactProps,
    requiredMismatches: report.inventory.requiredMismatches,
    typeValueMismatches: report.inventory.typeValueMismatches,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
