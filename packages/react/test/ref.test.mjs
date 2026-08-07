import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const { cleanup, render } = await import("@testing-library/react");
const reactComponents = await import("../src/index.js");
const { componentContracts } = await import("@design-system/components/contracts");

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
  if (["dialog", "drawer"].includes(id)) props.open = true;
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
    case "rowKey":
      return "id";
    case "rows":
      return [{ id: "row-1", name: "Row one" }];
    case "steps":
      return [{ key: "one", label: "One" }, { key: "two", label: "Two" }];
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

  const ref = React.createRef();
  try {
    render(React.createElement(Component, {
      ...fixtureForContract(id, contract),
      ref,
    }));
    assert.ok(ref.current instanceof HTMLElement, `${componentName} did not forward ref to an HTMLElement`);
  } catch (error) {
    failures.push(`${componentName}: ${error.message}`);
  } finally {
    cleanup();
  }
}

assert.deepEqual(failures, []);
console.log(`react ref forwarding tests passed for ${Object.keys(componentContracts).length} components`);
