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
const { MovementRow, RouteSummary, StationPin } = await import("../dist/index.js");

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
    const user = createUser();
    const selected = [];
    const clicks = [];
    const view = render(React.createElement(MovementRow, {
      label: "G500 Roma Norte",
      meta: "Truck 42 · Today",
      amount: "-$842.00",
      status: "Pending approval",
      category: "fuel",
      variant: "declined",
      state: "pending",
      density: "sm",
      fullWidth: true,
      type: "submit",
      onClick: (event) => clicks.push(event.type),
      onSelect: (meta, event) => selected.push({ meta, eventType: event.type }),
    }));
    const row = view.getByRole("button", { name: /g500 roma norte/i });

    assert.equal(row.tagName, "BUTTON");
    assert.equal(row.getAttribute("type"), "submit");
    assert.equal(row.dataset.variant, "declined");
    assert.equal(row.dataset.state, "pending");
    assert.equal(row.dataset.density, "sm");
    assert.equal(row.dataset.category, "fuel");
    assert.equal(row.dataset.fullWidth, "true");
    assert.equal(view.getByText("-$842.00").className, "movement-row__amount");
    assert.equal(view.getByText("Pending approval").className, "movement-row__status");
    await user.click(row);
    assert.deepEqual(clicks, ["click"]);
    assert.deepEqual(selected.at(-1), {
      meta: {
        label: "G500 Roma Norte",
        meta: "Truck 42 · Today",
        amount: "-$842.00",
        status: "Pending approval",
        category: "fuel",
        variant: "declined",
        state: "pending",
      },
      eventType: "click",
    });

    row.focus();
    assert.equal(globalThis.document.activeElement, row);
    await user.keyboard("[Enter]");
    assert.equal(selected.at(-1)?.eventType, "click");

    view.rerender(React.createElement(MovementRow, {
      label: "Refund posted",
      amount: "+$120.00",
      status: "Available",
      category: "unknown",
      variant: "unknown",
      state: "unknown",
    }));
    const staticRow = view.container.querySelector(".movement-row");
    assert.equal(staticRow?.tagName, "ARTICLE");
    assert.equal(staticRow?.dataset.category, "transfer");
    assert.equal(staticRow?.dataset.variant, "standard");
    assert.equal(staticRow?.dataset.state, "default");

    view.rerender(React.createElement(MovementRow, {
      label: "Blocked movement",
      disabled: true,
      onSelect: (meta, event) => selected.push({ meta, eventType: event.type }),
    }));
    const disabledRow = view.getByRole("button", { name: /blocked movement/i });
    const before = selected.length;
    assert.equal(disabledRow.disabled, true);
    assert.equal(disabledRow.dataset.state, "disabled");
    await user.click(disabledRow);
    assert.equal(selected.length, before);

    view.rerender(React.createElement(MovementRow, { label: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const clicks = [];
    const view = render(React.createElement(RouteSummary, {
      label: "Fast route",
      description: "18 min · avoids tolls",
      metrics: [
        { key: "eta", label: "ETA", value: "18 min" },
        { key: "distance", label: "Distance", value: "7.2 km" },
        { label: "Invalid", value: "No key" },
      ],
      actions: [
        {
          key: "start",
          label: "Start route",
          icon: "navigation",
          variant: "primary",
          onClick: (event) => clicks.push(event.type),
          onAction: (key, action, event) => actions.push({ key, label: action.label, eventType: event.type }),
        },
        {
          key: "compare",
          label: "Compare route",
          variant: "ghost",
          onAction: (key, action, event) => actions.push({ key, label: action.label, eventType: event.type }),
        },
        { key: "", label: "Invalid" },
      ],
      variant: "policy",
      state: "warning",
      tone: "info",
      density: "lg",
      selected: true,
      fullWidth: true,
    }));
    const summary = view.container.querySelector(".route-summary");
    const start = view.getByRole("button", { name: /start route/i });

    assert.equal(summary?.tagName, "ARTICLE");
    assert.equal(summary?.dataset.variant, "policy");
    assert.equal(summary?.dataset.state, "selected");
    assert.equal(summary?.dataset.tone, "info");
    assert.equal(summary?.dataset.density, "lg");
    assert.equal(summary?.dataset.fullWidth, "true");
    assert.equal(summary?.getAttribute("aria-selected"), "true");
    assert.equal(view.container.querySelectorAll(".route-summary__metrics > span").length, 2);
    assert.equal(view.container.querySelectorAll("footer button").length, 2);
    await user.click(start);
    assert.deepEqual(clicks, ["click"]);
    assert.deepEqual(actions.at(-1), { key: "start", label: "Start route", eventType: "click" });

    view.rerender(React.createElement(RouteSummary, {
      label: "Compact route",
      actions: [
        {
          key: "close",
          label: "Close route",
          icon: "close",
          variant: "legacy-hierarchy",
          onAction: (key, action, event) => actions.push({ key, label: action.label, eventType: event.type }),
        },
      ],
      variant: "compact",
      tone: "unknown",
      state: "unknown",
    }));
    const compactAction = view.getByRole("button", { name: /close route/i });
    assert.equal(view.container.querySelector(".route-summary")?.dataset.variant, "compact");
    assert.equal(view.container.querySelector(".route-summary")?.dataset.state, "default");
    assert.equal(view.container.querySelector(".route-summary")?.dataset.tone, "neutral");
    await user.click(compactAction);
    assert.deepEqual(actions.at(-1), { key: "close", label: "Close route", eventType: "click" });

    view.rerender(React.createElement(RouteSummary, {
      label: "Unavailable route",
      disabled: true,
      actions: [
        {
          key: "start",
          label: "Start route",
          onAction: (key, action, event) => actions.push({ key, label: action.label, eventType: event.type }),
        },
      ],
    }));
    const disabledSummary = view.container.querySelector(".route-summary");
    const disabledAction = view.getByRole("button", { name: /start route/i });
    const before = actions.length;
    assert.equal(disabledSummary?.dataset.state, "disabled");
    assert.equal(disabledSummary?.getAttribute("aria-disabled"), "true");
    assert.equal(disabledAction.disabled, true);
    await user.click(disabledAction);
    assert.equal(actions.length, before);

    view.rerender(React.createElement(RouteSummary, { label: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const selected = [];
    const clicks = [];
    const view = render(React.createElement(StationPin, {
      label: "G500 Roma Norte",
      value: "$23.40",
      meta: "1.8 km · 24 h",
      variant: "ev",
      state: "focus",
      density: "lg",
      selected: true,
      icon: "bolt",
      onClick: (event) => clicks.push(event.type),
      onSelect: (meta, event) => selected.push({ meta, eventType: event.type }),
    }));
    const pin = view.getByRole("button", { name: /g500 roma norte/i });

    assert.equal(pin.className, "station-pin");
    assert.equal(pin.dataset.mapPrimitive, "maps");
    assert.equal(pin.dataset.variant, "ev");
    assert.equal(pin.dataset.state, "selected");
    assert.equal(pin.dataset.density, "lg");
    assert.equal(pin.getAttribute("aria-pressed"), "true");
    assert.match(pin.getAttribute("aria-label") ?? "", /G500 Roma Norte/);
    assert.match(pin.getAttribute("aria-label") ?? "", /\$23\.40/);
    assert.match(pin.getAttribute("aria-label") ?? "", /1\.8 km/);
    assert.equal(view.container.querySelector(".station-pin__marker")?.dataset.kind, "icon");
    assert.equal(view.getByText("$23.40").className, "station-pin__value");
    await user.click(pin);
    assert.deepEqual(clicks, ["click"]);
    assert.deepEqual(selected.at(-1), {
      meta: { label: "G500 Roma Norte", value: "$23.40", variant: "ev", state: "selected" },
      eventType: "click",
    });

    view.rerender(React.createElement(StationPin, {
      label: "Station cluster",
      count: 12,
      variant: "cluster",
      state: "unknown",
      onSelect: (meta, event) => selected.push({ meta, eventType: event.type }),
    }));
    const cluster = view.getByRole("button", { name: /station cluster/i });
    assert.equal(cluster.dataset.variant, "cluster");
    assert.equal(cluster.dataset.state, "default");
    assert.equal(view.container.querySelector(".station-pin__marker")?.dataset.kind, "count");
    assert.equal(view.container.querySelector(".station-pin__marker")?.textContent, "12");
    assert.equal(view.container.querySelector(".station-pin__value"), null);

    view.rerender(React.createElement(StationPin, {
      label: "Unavailable station",
      value: "$25.10",
      unavailable: true,
      onSelect: (meta, event) => selected.push({ meta, eventType: event.type }),
    }));
    const unavailable = view.getByRole("button", { name: /unavailable station/i });
    const beforeUnavailable = selected.length;
    assert.equal(unavailable.disabled, true);
    assert.equal(unavailable.dataset.state, "unavailable");
    await user.click(unavailable);
    assert.equal(selected.length, beforeUnavailable);

    view.rerender(React.createElement(StationPin, {
      label: "",
      value: "$24.00",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 domain fleet production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
