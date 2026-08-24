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
const { Card, EmptyState, Skeleton, Surface, Table } = await import("../dist/index.js");

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
      composition: "standard",
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
    assert.equal(card.dataset.composition, "standard");
    assert.equal(card.dataset.state, "selected");
    assert.equal(card.dataset.density, "lg");
    assert.equal(card.dataset.fullWidth, "true");
    assert.equal(card.dataset.interactive, "true");
    assert.equal(card.getAttribute("aria-pressed"), "true");
    assert.equal(card.tabIndex, 0);
    assert.match(view.getByText("97").textContent, /97/);

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
      title: "Header actions card",
      detail: "Actions belong to the card object header.",
      actionPlacement: "header",
      actions: [
        { key: "share", label: "Share", icon: "share", iconOnly: true },
        { key: "archive", label: "Archive", variant: "secondary" },
      ],
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }));
    const article = view.getByRole("article");
    const header = view.container.querySelector(".card__header");
    const headerActions = header.querySelector(".card__actions");

    assert.equal(article.dataset.actionPlacement, "header");
    assert.equal(headerActions.dataset.placement, "header");
    assert.equal(view.container.querySelectorAll(".card > .card__actions").length, 0);
    assert.equal(view.getAllByRole("button").length, 2);

    await user.click(view.getByRole("button", { name: /share/i }));
    await user.click(view.getByRole("button", { name: /archive/i }));
    assert.deepEqual(actions.map((entry) => entry.key), ["share", "archive"]);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const view = render(React.createElement(Card, {
      interactive: true,
      actionKey: "open-custom-card",
      density: "sm",
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }, React.createElement("div", null,
      React.createElement("strong", null, "Custom governed content"),
      React.createElement("p", null, "Card can act as a surface container without demo-only anatomy."),
    )));
    const card = view.getByRole("button", { name: /custom governed content/i });

    assert.equal(card.dataset.density, "sm");
    assert.equal(card.dataset.interactive, "true");
    assert.equal(view.container.querySelector(".card__header"), null);
    assert.match(card.textContent, /surface container/);

    await user.click(card);
    card.focus();
    await user.keyboard("{Enter}");
    assert.deepEqual(actions.map((entry) => entry.key), ["open-custom-card", "open-custom-card"]);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const view = render(React.createElement(Card, {
      title: "Shipment exception",
      status: "Review",
      density: "md",
      actions: [
        { key: "resolve", label: "Resolve", variant: "primary" },
        { key: "more", label: "More actions", icon: "more_horiz", iconOnly: true },
      ],
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }, React.createElement("p", null, "Custom body stays inside the governed Card surface.")));

    const article = view.getByRole("article");
    assert.equal(article.dataset.density, "md");
    assert.equal(view.getByRole("heading", { name: /shipment exception/i }).className, "card__title");
    assert.equal(view.getByText("Review").className, "card__status");
    assert.match(article.textContent, /custom body/i);
    assert.equal(view.getAllByRole("button").length, 2);

    await user.click(view.getByRole("button", { name: /resolve/i }));
    await user.click(view.getByRole("button", { name: /more actions/i }));
    assert.deepEqual(actions.map((entry) => entry.key), ["resolve", "more"]);
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

  {
    const user = createUser();
    const actions = [];
    const view = render(React.createElement(Card, {
      title: "Compact decision",
      detail: "Dense card keeps status and actions usable.",
      status: "4",
      composition: "compact",
      density: "sm",
      actions: [
        { key: "open", label: "Open", variant: "secondary" },
      ],
      onAction: (key, action, event) => actions.push({ key, action: action?.key ?? null, eventType: event.type }),
    }));
    const article = view.getByRole("article");

    assert.equal(article.dataset.composition, "compact");
    assert.equal(article.dataset.density, "sm");
    assert.equal(view.getByText("4").className, "card__status");
    await user.click(view.getByRole("button", { name: /open/i }));
    assert.deepEqual(actions.map((entry) => entry.key), ["open"]);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Card, {
      title: "Media custom body",
      media: "route.png",
      mediaAlt: "Route preview",
      composition: "media",
    }, React.createElement("p", null, "Custom media body keeps image and governed body frame.")));
    const article = view.getByRole("article");
    const body = view.container.querySelector(".card__body");

    assert.equal(article.dataset.composition, "media");
    assert.equal(view.getByAltText("Route preview").className, "card__media");
    assert.ok(body, "media composition must wrap content in card__body");
    assert.match(body.textContent, /custom media body/i);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Card, {
      title: "Table shell",
      detail: "Card owns the object frame; Table owns tabular data.",
    }, React.createElement(Table, {
      label: "Card table recipe",
      columns: [{ key: "driver", label: "Driver" }, { key: "status", label: "Status" }],
      rows: [{ id: "ana", driver: "Ana Sosa", status: "Active" }],
      density: "sm",
    })));
    const article = view.getByRole("article");

    assert.equal(article.className, "card");
    assert.equal(article.dataset.composition, "standard");
    assert.equal(view.container.querySelector(".table")?.dataset.density, "sm");
    assert.match(article.textContent, /Ana Sosa/);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Card, {
      title: "Empty state shell",
    }, React.createElement(EmptyState, {
      title: "No cards yet",
      description: "Create a card to start tracking fleet spend.",
      icon: "credit_card",
      action: { key: "create-card", label: "Create card" },
      fullWidth: true,
    })));
    const article = view.getByRole("article");

    assert.equal(article.className, "card");
    assert.equal(article.dataset.composition, "standard");
    assert.ok(view.container.querySelector(".empty-state"));
    assert.equal(view.getByRole("button", { name: /create card/i }).className.includes("button"), true);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Card, {
      title: "Skeleton shell",
      state: "loading",
    }, React.createElement(Skeleton, {
      label: "Card content loading",
      variant: "card",
      rows: 3,
      fullWidth: true,
    })));
    const article = view.getByRole("article");

    assert.equal(article.className, "card");
    assert.equal(article.dataset.composition, "standard");
    assert.equal(article.dataset.state, "loading");
    assert.ok(view.container.querySelector(".skeleton"));
    assert.doesNotMatch(article.outerHTML, /data-composition="table"|data-composition="empty"|data-composition="skeleton"/);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 surface/display production evidence passed");
} catch (error) {
  console.error(error);
  cleanup();
  process.exit(1);
}
