import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.Event = dom.window.Event;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const axe = await import("axe-core");
const { cleanup, render } = await import("@testing-library/react");
const { Skeleton, Spinner } = await import("../dist/index.js");

async function assertNoAxeViolations(container) {
  const results = await axe.default.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });
  assert.deepEqual(results.violations, []);
}

try {
  {
    const view = render(React.createElement(Skeleton, {
      label: "Table loading",
      variant: "table",
      density: "sm",
      rows: 99,
      columns: 99,
      fullWidth: true,
      width: 320,
      height: "12rem",
      state: "stale",
    }));
    const skeleton = view.getByRole("status", { name: /table loading/i });

    assert.equal(skeleton.className, "skeleton skeleton--table");
    assert.equal(skeleton.getAttribute("aria-busy"), "true");
    assert.equal(skeleton.dataset.variant, "table");
    assert.equal(skeleton.dataset.state, "stale");
    assert.equal(skeleton.dataset.density, "sm");
    assert.equal(skeleton.dataset.fullWidth, "true");
    assert.equal(skeleton.dataset.rows, "8");
    assert.equal(skeleton.dataset.columns, "6");
    assert.match(skeleton.getAttribute("style") ?? "", /--comp-skeleton-current-width: 320px/);
    assert.match(skeleton.getAttribute("style") ?? "", /--comp-skeleton-current-height: 12rem/);
    assert.equal(view.container.querySelectorAll(".skeleton__row").length, 8);
    assert.equal(view.container.querySelectorAll(".skeleton__cell").length, 48);
    assert.equal(view.container.querySelector(".skeleton__cell")?.getAttribute("aria-hidden"), "true");

    view.rerender(React.createElement(Skeleton, {
      label: "Card loaded",
      variant: "unknown",
      busy: false,
      state: "loaded",
      lines: -1,
    }));
    const loaded = view.getByRole("status", { name: /card loaded/i });
    assert.equal(loaded.className, "skeleton skeleton--text");
    assert.equal(loaded.getAttribute("aria-busy"), "false");
    assert.equal(loaded.dataset.state, "loaded");
    assert.equal(view.container.querySelectorAll(".skeleton__bone").length, 1);

    view.rerender(React.createElement(Skeleton, {
      label: "",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Spinner, {
      label: "Loading route",
      density: "lg",
      tone: "warning",
      state: "subtle",
    }));
    const spinner = view.getByRole("status", { name: /loading route/i });

    assert.equal(spinner.className, "spinner");
    assert.equal(spinner.getAttribute("aria-busy"), "true");
    assert.equal(spinner.dataset.density, "lg");
    assert.equal(spinner.dataset.tone, "warning");
    assert.equal(spinner.dataset.state, "subtle");
    assert.equal(view.container.querySelector(".spinner__svg")?.getAttribute("aria-hidden"), "true");
    assert.equal(view.container.querySelector(".spinner__track")?.tagName, "circle");
    assert.equal(view.container.querySelector(".spinner__arc")?.tagName, "circle");
    assert.equal(spinner.hasAttribute("aria-valuenow"), false);
    assert.equal(spinner.hasAttribute("aria-valuemax"), false);

    view.rerender(React.createElement(Spinner, {
      label: "Decorative loading",
      decorative: true,
      tone: "unknown",
      density: "xl",
    }));
    const decorative = view.container.querySelector(".spinner");
    assert.equal(decorative.getAttribute("role"), null);
    assert.equal(decorative.getAttribute("aria-hidden"), "true");
    assert.equal(decorative.getAttribute("aria-label"), null);
    assert.equal(decorative.dataset.state, "decorative");
    assert.equal(decorative.dataset.tone, "accent");
    assert.equal(decorative.hasAttribute("data-density"), false);

    view.rerender(React.createElement(Spinner));
    const unlabeled = view.container.querySelector(".spinner");
    assert.equal(unlabeled.getAttribute("role"), null);
    assert.equal(unlabeled.getAttribute("aria-hidden"), "true");
    assert.equal(unlabeled.dataset.state, "loading");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 loading feedback production evidence passed");
} catch (error) {
  console.error(error);
  cleanup();
  process.exit(1);
}
