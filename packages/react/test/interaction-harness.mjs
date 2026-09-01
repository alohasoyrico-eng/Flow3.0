import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const globalKeys = [
  "window",
  "document",
  "HTMLElement",
  "Node",
  "Event",
  "KeyboardEvent",
  "MouseEvent",
  "CustomEvent",
  "getComputedStyle",
  "navigator",
  "requestAnimationFrame",
  "cancelAnimationFrame",
];

export async function createInteractionHarness(options = {}) {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: options.url ?? "http://localhost/",
  });
  const previousGlobals = new Map(globalKeys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const frameTimers = new Set();

  defineGlobal("window", dom.window);
  defineGlobal("document", dom.window.document);
  defineGlobal("HTMLElement", dom.window.HTMLElement);
  defineGlobal("Node", dom.window.Node);
  defineGlobal("Event", dom.window.Event);
  defineGlobal("KeyboardEvent", dom.window.KeyboardEvent);
  defineGlobal("MouseEvent", dom.window.MouseEvent);
  defineGlobal("CustomEvent", dom.window.CustomEvent);
  defineGlobal("getComputedStyle", dom.window.getComputedStyle.bind(dom.window));
  defineGlobal("navigator", dom.window.navigator);
  defineGlobal("requestAnimationFrame", (callback) => {
    const timer = setTimeout(() => {
      frameTimers.delete(timer);
      callback(Date.now());
    }, 0);
    timer.unref?.();
    frameTimers.add(timer);
    return timer;
  });
  defineGlobal("cancelAnimationFrame", (timer) => {
    frameTimers.delete(timer);
    clearTimeout(timer);
  });

  const React = await import("react");
  const axe = await import("axe-core");
  const userEvent = await import("@testing-library/user-event");
  const testingLibrary = await import("@testing-library/react");
  const components = await import("../dist/index.js");

  async function assertNoAxeViolations(container) {
    const results = await axe.default.run(container, {
      rules: {
        "color-contrast": { enabled: false },
        region: { enabled: false },
      },
    });
    assert.deepEqual(results.violations, []);
  }

  function createUser() {
    return userEvent.default.setup({ document: globalThis.document });
  }

  function close() {
    testingLibrary.cleanup();
    for (const timer of frameTimers) clearTimeout(timer);
    frameTimers.clear();
    dom.window.close();
    for (const [key, descriptor] of previousGlobals) {
      if (descriptor) {
        Object.defineProperty(globalThis, key, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, key);
      }
    }
  }

  return {
    ...testingLibrary,
    ...components,
    React,
    assertNoAxeViolations,
    createUser,
    close,
    dom,
  };
}

function defineGlobal(key, value) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value,
  });
}
