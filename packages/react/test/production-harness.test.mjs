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
const axe = await import("axe-core");
const userEvent = await import("@testing-library/user-event");
const { cleanup, render } = await import("@testing-library/react");
const { Button } = await import("../dist/index.js");

try {
  const clicks = [];
  const user = userEvent.default.setup({ document: globalThis.document });
  const view = render(React.createElement(Button, {
    label: "Submit route",
    onClick: (event) => clicks.push(event.type),
  }));

  await user.click(view.getByRole("button", { name: /submit route/i }));
  assert.deepEqual(clicks, ["click"]);

  view.getByRole("button", { name: /submit route/i }).focus();
  await user.keyboard("{Enter}");
  assert.deepEqual(clicks, ["click", "click"]);

  const results = await axe.default.run(view.container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });
  assert.deepEqual(results.violations, []);
} finally {
  cleanup();
}

console.log("react production harness supports user-event and axe-core");
