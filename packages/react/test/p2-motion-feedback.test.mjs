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
const { AnimatedMoment, MotionBoundary } = await import("../dist/index.js");

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
    const view = render(React.createElement(AnimatedMoment, {
      label: "Payment approved",
      description: "Receipt is ready",
      variant: "celebration",
      state: "playing",
      density: "lg",
      fullWidth: true,
      animationSource: "/animations/payment-approved.json",
      stateLabel: "Playing",
    }));
    const moment = view.getByRole("img", { name: /payment approved: playing/i });
    const asset = view.container.querySelector(".animation-asset");

    assert.equal(moment.className, "animated-moment");
    assert.equal(moment.dataset.variant, "celebration");
    assert.equal(moment.dataset.state, "playing");
    assert.equal(moment.dataset.density, "lg");
    assert.equal(moment.dataset.fullWidth, "true");
    assert.equal(asset?.dataset.animationLibrary, "lottie-web");
    assert.equal(asset?.dataset.animationRuntime, "available");
    assert.equal(asset?.dataset.renderer, "svg");
    assert.equal(asset?.getAttribute("aria-label"), "Payment approved");
    assert.equal(view.getByText("Playing").hidden, true);
    assert.equal(view.getByText("Receipt is ready").tagName, "SMALL");

    view.rerender(React.createElement(AnimatedMoment, {
      label: "Payment approved",
      variant: "unknown",
      state: "reduced-motion",
      icon: "check_circle",
      animationData: { v: "5.7.0", layers: [] },
      reducedMotionFallback: "Static confirmation",
    }));
    const reduced = view.getByRole("img", { name: /^payment approved$/i });
    const reducedAsset = view.container.querySelector(".animation-asset");
    const fallback = view.container.querySelector(".animation-asset__fallback");
    assert.equal(reduced.dataset.variant, "success");
    assert.equal(reduced.dataset.state, "reduced-motion");
    assert.equal(reducedAsset?.dataset.animationRuntime, "fallback");
    assert.equal(fallback?.hidden, false);
    const staticConfirmationCopy = view.getAllByText("Static confirmation");
    assert.equal(staticConfirmationCopy.length, 2);
    assert.equal(staticConfirmationCopy.some((node) => node.tagName === "SMALL"), true);

    view.rerender(React.createElement(AnimatedMoment, {
      label: "Sync paused",
      state: "disabled",
      reducedMotionFallback: "Animation disabled",
    }));
    const disabled = view.getByRole("img", { name: /sync paused/i });
    assert.equal(disabled.dataset.state, "disabled");
    assert.equal(disabled.getAttribute("aria-disabled"), "true");
    assert.equal(view.container.querySelector(".animation-asset")?.dataset.animationRuntime, "fallback");

    view.rerender(React.createElement(AnimatedMoment, {
      label: "",
      reducedMotionFallback: "Missing label",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(MotionBoundary, {
      label: "Route transition",
      description: "Workspace content is entering",
      variant: "route",
      state: "entering",
      density: "sm",
      icon: "route",
      stateLabel: "Entering",
    }));
    const boundary = view.getByRole("group", { name: /route transition/i });
    const describedBy = boundary.getAttribute("aria-describedby") ?? "";

    assert.equal(boundary.className, "motion-boundary");
    assert.equal(boundary.dataset.variant, "route");
    assert.equal(boundary.dataset.state, "entering");
    assert.equal(boundary.dataset.density, "sm");
    assert.equal(boundary.dataset.reducedMotion, "false");
    assert.match(describedBy, /description/);
    assert.match(describedBy, /state/);
    assert.equal(view.getByText("Workspace content is entering").tagName, "P");
    assert.equal(view.getByText("Entering").hidden, true);
    assert.equal(view.container.querySelector(".motion-boundary__icon")?.getAttribute("aria-hidden"), "true");
    assert.equal(view.container.querySelector("[data-motion-cue]")?.getAttribute("aria-hidden"), "true");

    view.rerender(React.createElement(MotionBoundary, {
      label: "Panel update",
      variant: "unknown",
      state: "active",
      reducedMotion: true,
    }));
    const reduced = view.getByRole("group", { name: /panel update/i });
    assert.equal(reduced.dataset.variant, "fade");
    assert.equal(reduced.dataset.state, "reduced-motion");
    assert.equal(reduced.dataset.reducedMotion, "true");

    view.rerender(React.createElement(MotionBoundary, {
      label: "Panel update",
      state: "disabled",
      reducedMotion: true,
    }));
    const disabled = view.getByRole("group", { name: /panel update/i });
    assert.equal(disabled.dataset.state, "disabled");
    assert.equal(disabled.dataset.reducedMotion, "true");
    assert.equal(disabled.getAttribute("aria-disabled"), "true");

    view.rerender(React.createElement(MotionBoundary, {
      label: "",
      description: "Missing label",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 motion-feedback production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
