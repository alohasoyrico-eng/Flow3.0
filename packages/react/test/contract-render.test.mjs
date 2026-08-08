import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as reactComponents from "../src/index.js";
import { componentContracts } from "@design-system/components/contracts";

function componentNameFromFactory(factory) {
  const slug = String(factory ?? "").split("/").pop();
  return slug
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function fixtureForContract(id, contract) {
  const props = {};
  for (const prop of contract.props ?? []) {
    if (!prop.required) continue;
    props[prop.name] = valueForRequiredProp(prop.name);
  }
  if (id === "button") props.label = "Reference";
  if (id === "iconButton") props.ariaLabel = "Reference action";
  if (["dialog", "drawer", "popover", "tooltip"].includes(id)) props.open = true;
  return props;
}

function valueForRequiredProp(name) {
  switch (name) {
    case "ariaLabel":
      return "Reference action";
    case "columns":
      return [{ key: "name", label: "Name" }];
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
    default:
      return "Reference";
  }
}

const failures = [];

for (const [id, contract] of Object.entries(componentContracts)) {
  const componentName = componentNameFromFactory(contract.factory);
  const Component = reactComponents[componentName];
  if (!Component) {
    failures.push(`${id}: missing React export ${componentName}`);
    continue;
  }

  try {
    const markup = renderToStaticMarkup(React.createElement(Component, {
      ...fixtureForContract(id, contract),
      className: "flow-external-hook",
      "data-contract-render": id,
      contentEditable: true,
      dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
      style: { color: "rgb(255, 0, 0)", marginTop: 77 },
      suppressContentEditableWarning: true,
      suppressHydrationWarning: true,
    }));
    assert.ok(markup.length > 0, `${componentName} rendered empty markup`);
    assert.equal(markup.match(/flow-external-hook/g)?.length ?? 0, 1, `${componentName} must expose className once on the root integration surface`);
    assert.doesNotMatch(markup, /rgb\(255,\s*0,\s*0\)|margin-top:\s*77px/i, `${componentName} leaked external style prop`);
    assert.doesNotMatch(markup, /Injected markup|contenteditable=/i, `${componentName} leaked external DOM escape props`);
    assert.doesNotMatch(markup, /apps\/docs|docs-demo|gold-/i, `${componentName} leaked docs-only markup`);
  } catch (error) {
    failures.push(`${componentName}: ${error.message}`);
  }
}

assert.deepEqual(failures, []);
console.log(`react contract render tests passed for ${Object.keys(componentContracts).length} components`);
