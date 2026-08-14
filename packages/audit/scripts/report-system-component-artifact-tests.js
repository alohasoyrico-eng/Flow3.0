#!/usr/bin/env node

const {
  fs,
  goldComponents,
  path,
  rel,
  root,
} = require("./audit-context.js");
const { pathToFileURL } = require("url");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { componentContracts } = require("../../components/src/contracts.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-component-artifact-tests.json");
const markdownOutput = path.join(outputDir, "system-component-artifact-tests.md");
const reactDistIndex = path.join(root, "packages/react/dist/index.js");
const reactDistDir = path.join(root, "packages/react/dist");

function componentNameFromFactory(factory) {
  const slug = String(factory ?? "").split("/").pop();
  return slug
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function kebab(value) {
  return String(value).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function valueForProp(name) {
  switch (name) {
    case "actions":
      return [{ key: "save", label: "Save", variant: "primary" }];
    case "ariaLabel":
      return "Reference action";
    case "body":
      return "Reference message";
    case "code":
      return "export const ready = true;";
    case "columns":
      return [{ key: "name", label: "Name" }];
    case "description":
      return "Reference description";
    case "fallback":
      return "Use your passcode";
    case "getPageLabel":
      return (page) => `Reference page ${page}`;
    case "icon":
      return "check";
    case "items":
      return [
        { id: "one", key: "one", label: "One", title: "One", content: "One content", value: "one" },
        { id: "two", key: "two", label: "Two", title: "Two", content: "Two content", value: "two" },
      ];
    case "label":
      return "Reference";
    case "name":
      return "reference";
    case "nodes":
      return [{ key: "root", label: "Root", children: [{ key: "child", label: "Child" }] }];
    case "options":
      return [{ label: "One", value: "one", meta: "Option" }];
    case "page":
      return 1;
    case "pageCount":
      return 3;
    case "previousLabel":
      return "Previous reference page";
    case "nextLabel":
      return "Next reference page";
    case "rowKey":
      return "id";
    case "rows":
      return [{ id: "row-1", name: "Row one" }];
    case "steps":
      return [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
    case "title":
      return "Reference";
    case "triggerLabel":
      return "Open reference";
    case "value":
      return "Reference";
    case "values":
      return [1, 2, 3];
    case "labels":
      return ["One", "Two", "Three"];
    default:
      return "Reference";
  }
}

function fixtureForContract(id, contract) {
  const props = {};
  for (const prop of contract.props ?? []) {
    if (prop.required) props[prop.name] = valueForProp(prop.name);
  }
  if (id === "button") props.label = "Reference";
  if (id === "chatMessage") props.body = "Reference message";
  if (id === "chartPanel") {
    props.values = [1, 2, 3];
    props.labels = ["One", "Two", "Three"];
  }
  if (id === "codeBlock") props.code = "export const ready = true;";
  if (id === "iconButton") props.ariaLabel = "Reference action";
  if (["dialog", "drawer", "popover", "tooltip"].includes(id)) props.open = true;
  return props;
}

function contractProp(contract, name) {
  return (contract.props ?? []).find((prop) => prop.name === name);
}

function stateSample(contract) {
  const prop = contractProp(contract, "state");
  if (!prop) return null;
  const values = String(prop.type ?? "").match(/"([^"]+)"/g)?.map((value) => value.replace(/"/g, "")) ?? [];
  return values.find((value) => value !== "default") ?? values[0] ?? "default";
}

function hasA11ySignal(markup, contract) {
  const element = contract.element;
  const props = new Set((contract.props ?? []).map((prop) => prop.name));
  if (props.has("label") && /Reference/.test(markup)) return true;
  if (props.has("ariaLabel") && /aria-label="Reference action"/.test(markup)) return true;
  if (props.has("title") && /Reference/.test(markup)) return true;
  if (/role=|aria-|<button|<input|<select|<textarea|<nav|<table|<figure/.test(markup)) return true;
  if (!["button", "input", "select", "textarea", "nav", "table", "figure"].includes(element)) return true;
  return false;
}

function rootTag(markup) {
  return markup.match(/^<[^>]+>/)?.[0] ?? "";
}

function checkRender({ Component, contract, id, componentName, props }) {
  const markup = renderToStaticMarkup(React.createElement(Component, {
    ...props,
    className: "flow-artifact-test-hook",
    density: "lg",
    "data-artifact-test": id,
    contentEditable: true,
    dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
    style: { color: "rgb(255, 0, 0)", marginTop: 77 },
    suppressContentEditableWarning: true,
    suppressHydrationWarning: true,
  }));
  const tag = rootTag(markup);
  const issues = [];
  if (!markup.length) issues.push("empty render");
  if ((markup.match(/flow-artifact-test-hook/g)?.length ?? 0) !== 1) issues.push("className is not exposed exactly once on root integration surface");
  if (contractProp(contract, "density") && !/data-density="lg"/.test(tag)) issues.push("density is not exposed on root integration surface");
  if (!new RegExp(`data-artifact-test="${id}"`).test(tag)) issues.push("consumer data attribute is not exposed on root integration surface");
  if (/rgb\(255,\s*0,\s*0\)|margin-top:\s*77px/i.test(markup)) issues.push("external style prop leaked into markup");
  if (/Injected markup|contenteditable=/i.test(markup)) issues.push("external DOM escape prop leaked into markup");
  if (/apps\/docs|docs-demo|gold-/i.test(markup)) issues.push("docs-only markup leaked into React artifact");
  if (!hasA11ySignal(markup, contract)) issues.push("missing basic accessibility signal");
  return {
    status: issues.length ? "fail" : "pass",
    component: componentName,
    markupLength: markup.length,
    rootTag: tag,
    issues,
  };
}

function checkVariantState({ Component, contract, id, props }) {
  const state = stateSample(contract);
  const densityApplicable = Boolean(contractProp(contract, "density"));
  const stateApplicable = Boolean(state);
  const checks = [];
  if (densityApplicable) {
    const markup = renderToStaticMarkup(React.createElement(Component, { ...props, density: "sm" }));
    checks.push({
      id: "density",
      status: /data-density="sm"/.test(rootTag(markup)) ? "pass" : "fail",
      expected: "root data-density=sm",
    });
  } else {
    checks.push({ id: "density", status: "not-applicable" });
  }
  if (stateApplicable) {
    const markup = renderToStaticMarkup(React.createElement(Component, { ...props, state }));
    checks.push({
      id: "state",
      status: markup.length && !/apps\/docs|docs-demo|gold-/i.test(markup) ? "pass" : "fail",
      expected: `render state=${state}`,
    });
  } else {
    checks.push({ id: "state", status: "not-applicable" });
  }
  if (contractProp(contract, "theme")) {
    const markup = renderToStaticMarkup(React.createElement(Component, { ...props, theme: "dark" }));
    checks.push({
      id: "theme",
      status: markup.length && !/apps\/docs|docs-demo|gold-/i.test(markup) ? "pass" : "fail",
      expected: "render theme=dark",
    });
  } else {
    checks.push({ id: "theme", status: "not-applicable" });
  }
  return checks;
}

async function createReport() {
  const reactComponents = await import(pathToFileURL(reactDistIndex).href);
  const rows = Object.entries(componentContracts).map(([id, contract]) => {
    const componentName = componentNameFromFactory(contract.factory);
    const Component = reactComponents[componentName];
    const typeFile = path.join(reactDistDir, `${componentName}.d.ts`);
    const props = fixtureForContract(id, contract);
    const requiredProps = (contract.props ?? []).filter((prop) => prop.required).map((prop) => prop.name);
    const row = {
      id,
      component: componentName,
      factory: contract.factory,
      contractProps: (contract.props ?? []).length,
      requiredProps,
      evidence: {
        contract: "packages/components/src/contracts.js",
        runtime: "packages/react/dist/index.js",
        types: rel(typeFile),
      },
      checks: [],
      issues: [],
    };
    if (!goldComponents.includes(kebab(id))) row.issues.push("component contract is not present in goldComponents inventory");
    if (!Component) row.issues.push(`missing React export ${componentName}`);
    if (!fs.existsSync(typeFile)) row.issues.push(`missing generated type file ${rel(typeFile)}`);
    for (const propName of requiredProps) {
      if (!(propName in props)) row.issues.push(`missing fixture for required prop ${propName}`);
    }
    if (!row.issues.length) {
      try {
        const renderCheck = checkRender({ Component, contract, id, componentName, props });
        row.checks.push(renderCheck);
        row.issues.push(...renderCheck.issues);
        const variantChecks = checkVariantState({ Component, contract, id, props });
        row.checks.push(...variantChecks);
        row.issues.push(...variantChecks.filter((check) => check.status === "fail").map((check) => `${check.id} smoke failed: ${check.expected}`));
      } catch (error) {
        row.issues.push(error.message);
      }
    }
    row.status = row.issues.length ? "fail" : "pass";
    return row;
  });
  const inventory = {
    catalogComponents: goldComponents.length,
    contractComponents: Object.keys(componentContracts).length,
    testedComponents: rows.length,
    passingComponents: rows.filter((row) => row.status === "pass").length,
    failingComponents: rows.filter((row) => row.status === "fail").length,
    missingFromGoldInventory: rows.filter((row) => row.issues.includes("component contract is not present in goldComponents inventory")).length,
    componentsWithRequiredProps: rows.filter((row) => row.requiredProps.length).length,
    densityChecks: rows.flatMap((row) => row.checks).filter((check) => check.id === "density" && check.status !== "not-applicable").length,
    stateChecks: rows.flatMap((row) => row.checks).filter((check) => check.id === "state" && check.status !== "not-applicable").length,
    themeChecks: rows.flatMap((row) => row.checks).filter((check) => check.id === "theme" && check.status !== "not-applicable").length,
  };
  const baselineMismatches = [];
  if (inventory.catalogComponents !== inventory.contractComponents) {
    baselineMismatches.push(`goldComponents=${inventory.catalogComponents} but componentContracts=${inventory.contractComponents}`);
  }
  inventory.componentArtifactTestDebt = inventory.failingComponents + baselineMismatches.length;
  return {
    status: inventory.componentArtifactTestDebt ? "fail" : "pass",
    audit: "system component artifact tests",
    planIteration: 15,
    principle: "Every public React component artifact must be tested one by one from the built package boundary before pattern work continues.",
    inventory,
    baselineMismatches,
    components: rows,
  };
}

function toMarkdown(report) {
  const rows = report.components.map((row) => `| ${row.id} | ${row.component} | ${row.status} | ${row.requiredProps.join(", ") || "None"} | ${row.checks.filter((check) => check.status === "pass").length} | ${row.issues.join("; ") || "None"} |`);
  return [
    "# System Component Artifact Tests",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Catalog components: ${report.inventory.catalogComponents}`,
    `- Contract components: ${report.inventory.contractComponents}`,
    `- Tested components: ${report.inventory.testedComponents}`,
    `- Passing components: ${report.inventory.passingComponents}`,
    `- Failing components: ${report.inventory.failingComponents}`,
    `- Component artifact test debt: ${report.inventory.componentArtifactTestDebt}`,
    `- Density checks: ${report.inventory.densityChecks}`,
    `- State checks: ${report.inventory.stateChecks}`,
    `- Theme checks: ${report.inventory.themeChecks}`,
    "",
    "## Baseline Mismatches",
    "",
    ...(report.baselineMismatches.length ? report.baselineMismatches.map((item) => `- ${item}`) : ["- None"]),
    "",
    "## Component Matrix",
    "",
    "| Contract id | React component | Status | Required props | Passed checks | Issues |",
    "| --- | --- | --- | --- | ---: | --- |",
    ...rows,
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

async function main() {
  const report = await createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("System component artifact tests report is stale. Run: node packages/audit/scripts/report-system-component-artifact-tests.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    testedComponents: report.inventory.testedComponents,
    passingComponents: report.inventory.passingComponents,
    componentArtifactTestDebt: report.inventory.componentArtifactTestDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { createReport };
