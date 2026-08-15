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
const userEvent = await import("@testing-library/user-event");
const { cleanup, render } = await import("@testing-library/react");
const { Card, Surface } = await import("../dist/index.js");

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

try {
  {
    const view = render(React.createElement(Surface, {
      surfaceRole: "panel",
      state: "selected",
      density: "sm",
      elevation: "floating",
      tone: "warning",
      focusMode: "within",
      breakpoint: "lg",
      className: "custom-surface",
      "data-testid": "surface",
    }, React.createElement("p", null, "Governed surface content")));
    const surface = view.getByTestId("surface");

    assert.equal(surface.className, "surface custom-surface");
    assert.equal(surface.dataset.flowPrimitive, "surface");
    assert.equal(surface.dataset.surfaceRole, "panel");
    assert.equal(surface.dataset.surfaceState, "selected");
    assert.equal(surface.dataset.surfaceElevation, "floating");
    assert.equal(surface.dataset.surfaceTone, "warning");
    assert.equal(surface.dataset.surfaceFocusMode, "within");
    assert.equal(surface.dataset.surfaceBreakpoint, "lg");
    assert.equal(surface.dataset.state, "selected");
    assert.equal(surface.dataset.density, "sm");

    view.rerender(React.createElement(Surface, {
      surfaceRole: "unknown",
      state: "unknown",
      density: "xl",
      elevation: "unknown",
      tone: "unknown",
      focusMode: "unknown",
      breakpoint: "unknown",
      "data-state": "consumer-state",
      "data-testid": "surface",
    }, "Fallback content"));
    const fallbackSurface = view.getByTestId("surface");

    assert.equal(fallbackSurface.dataset.surfaceRole, "section");
    assert.equal(fallbackSurface.dataset.surfaceState, "default");
    assert.equal(fallbackSurface.dataset.surfaceElevation, "none");
    assert.equal(fallbackSurface.dataset.surfaceTone, "default");
    assert.equal(fallbackSurface.dataset.surfaceFocusMode, "none");
    assert.equal(fallbackSurface.dataset.surfaceBreakpoint, "base");
    assert.equal(fallbackSurface.dataset.state, "consumer-state");
    assert.equal(fallbackSurface.hasAttribute("data-density"), false);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const view = render(React.createElement(Card, {
      title: "Wallet health",
      value: "97",
      unit: "%",
      detail: "3 cards need review",
      status: "Stable",
      trend: "up",
      variant: "elevated",
      composition: "stats",
      density: "lg",
      fullWidth: true,
      selected: true,
      interactive: true,
      actionKey: "open-wallet",
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }));
    const card = view.getByRole("button", { name: /wallet health/i });

    assert.equal(card.tagName, "DIV");
    assert.equal(card.dataset.variant, "elevated");
    assert.equal(card.dataset.composition, "stats");
    assert.equal(card.dataset.state, "selected");
    assert.equal(card.dataset.density, "lg");
    assert.equal(card.dataset.fullWidth, "true");
    assert.equal(card.dataset.interactive, "true");
    assert.equal(card.getAttribute("aria-pressed"), "true");
    assert.equal(card.tabIndex, 0);
    assert.match(view.getByText("%97").textContent, /%97/);

    await user.click(card);
    card.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    assert.deepEqual(actions.map((entry) => entry.key), ["open-wallet", "open-wallet", "open-wallet"]);
    assert.deepEqual(actions.map((entry) => entry.action), [null, null, null]);

    view.rerender(React.createElement(Card, {
      title: "Wallet health",
      disabled: true,
      interactive: true,
      actionKey: "open-wallet",
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }));
    const disabledCard = view.getByText("Wallet health").closest(".card");
    assert.equal(disabledCard.dataset.state, "disabled");
    assert.equal(disabledCard.getAttribute("aria-disabled"), "true");
    assert.equal(disabledCard.dataset.interactive, "true");
    assert.equal(disabledCard.tabIndex, -1);
    await user.click(disabledCard);
    assert.equal(actions.length, 3);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const view = render(React.createElement(Card, {
      title: "Route document",
      media: "route.png",
      mediaAlt: "Route preview",
      composition: "media",
      actions: [
        { key: "view", label: "View document", variant: "primary" },
        { key: "more", label: "More actions", icon: "more_horiz", iconOnly: true },
        { key: "", label: "Invalid action" },
      ],
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }));

    assert.equal(view.getByAltText("Route preview").className, "card__media");
    assert.equal(view.getByRole("article").dataset.interactive, "false");
    assert.equal(view.getAllByRole("button").length, 2);
    await user.click(view.getByRole("button", { name: /view document/i }));
    await user.click(view.getByRole("button", { name: /more actions/i }));
    assert.deepEqual(actions.map((entry) => entry.key), ["view", "more"]);
    assert.equal(view.queryByText("Invalid action"), null);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 surface/display production evidence passed");
} catch (error) {
  console.error(error);
  cleanup();
  process.exit(1);
}
