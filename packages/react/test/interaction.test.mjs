import assert from "node:assert/strict";
import React from "react";
import { JSDOM } from "jsdom";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { Accordion } from "../src/index.js";

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

try {
  const expandedChanges = [];
  const { getByRole } = render(React.createElement(Accordion, {
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds) => expandedChanges.push(expandedIds),
  }));

  const overviewTrigger = getByRole("button", { name: /overview/i });
  const pricingTrigger = getByRole("button", { name: /pricing/i });

  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

  fireEvent.click(overviewTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), ["overview"]);

  fireEvent.click(pricingTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), ["pricing"]);
} finally {
  cleanup();
  dom.window.close();
}

console.log("react interaction tests passed");
