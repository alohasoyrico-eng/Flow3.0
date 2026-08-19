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
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const { Dialog, Drawer, Menu, Popover, Tabs } = await import("../dist/index.js");

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
    const openChanges = [];
    const actions = [];
    const actionClicks = [];
    const view = render(React.createElement(Dialog, {
      label: "Confirm route",
      description: "Review before assigning.",
      triggerLabel: "Open review",
      closeLabel: "Close review",
      actions: [{ key: "cancel", label: "Cancel" }, { key: "confirm", label: "Confirm", onClick: (event) => actionClicks.push(event.type) }],
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /open review/i });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    assert.equal(view.getByRole("dialog", { name: /confirm route/i }).hidden, false);

    fireEvent.keyDown(view.container.querySelector(".dialog__overlay"), { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

    await user.click(trigger);
    await user.click(view.getByRole("button", { name: /confirm/i }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(actionClicks, ["click"]);
    assert.deepEqual(actions.at(-1), { key: "confirm", eventType: "click" });

    view.rerender(React.createElement(Dialog, {
      label: "Confirm route",
      description: "Review before assigning.",
      triggerLabel: "Open review",
      closeLabel: "Close review",
      actions: [{ key: "confirm", label: "Confirm" }],
      open: true,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type }),
    }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await user.click(view.getByRole("button", { name: /close review/i }));
    assert.equal(openChanges.at(-1).open, false);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const openChanges = [];
    const actions = [];
    const view = render(React.createElement(Drawer, {
      label: "Vehicle details",
      description: "Review route documents.",
      triggerLabel: "Open details",
      closeLabel: "Close details",
      actions: [{ key: "save", label: "Save" }],
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /open details/i });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    assert.equal(view.getByRole("dialog", { name: /vehicle details/i }).hidden, false);
    await user.click(view.getByRole("button", { name: /save/i }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(actions.at(-1), { key: "save", eventType: "click" });

    await user.click(trigger);
    fireEvent.keyDown(view.container.querySelector(".drawer__overlay"), { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

    view.rerender(React.createElement(Drawer, {
      label: "Vehicle details",
      description: "Review route documents.",
      triggerLabel: "Open details",
      closeLabel: "Close details",
      actions: [{ key: "save", label: "Save" }],
      open: true,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type }),
    }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await user.click(view.getByRole("button", { name: /close details/i }));
    assert.equal(openChanges.at(-1).open, false);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const openChanges = [];
    const actions = [];
    const view = render(React.createElement(Popover, {
      triggerLabel: "Open filters",
      title: "Filter routes",
      description: "Adjust visible routes.",
      actions: [{ key: "apply", label: "Apply" }],
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /open filters/i });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    assert.equal(view.getByRole("dialog", { name: /filter routes/i }).hidden, false);
    fireEvent.keyDown(view.getByRole("dialog", { name: /filter routes/i }), { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

    await user.click(trigger);
    await user.click(view.getByRole("button", { name: /apply/i }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(actions.at(-1), { key: "apply", eventType: "click" });

    view.rerender(React.createElement(Popover, {
      triggerLabel: "Open filters",
      title: "Filter routes",
      description: "Adjust visible routes.",
      actions: [{ key: "apply", label: "Apply" }],
      open: false,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type }),
      onAction: (key) => actions.push({ key }),
    }));
    await user.click(trigger);
    assert.equal(openChanges.at(-1).open, true);
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const openChanges = [];
    const selections = [];
    const view = render(React.createElement(Menu, {
      label: "Row actions",
      triggerLabel: "Actions",
      items: [
        { key: "edit", label: "Edit" },
        { key: "archive", label: "Archive" },
      ],
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onSelect: (item, event) => selections.push({ key: item.key, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /actions/i });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    const menu = view.getByRole("menu", { name: /row actions/i });
    assert.equal(menu.hidden, false);
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    assert.equal(globalThis.document.activeElement?.textContent, "Archive");
    fireEvent.keyDown(menu, { key: "Home" });
    assert.equal(globalThis.document.activeElement?.textContent, "Edit");
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    assert.equal(globalThis.document.activeElement?.textContent, "Archive");
    fireEvent.keyDown(menu, { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

    await user.click(trigger);
    await user.click(view.getByRole("menuitem", { name: /archive/i }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(selections.at(-1), { key: "archive", eventType: "click" });

    view.rerender(React.createElement(Menu, {
      label: "Row actions",
      triggerLabel: "Actions",
      items: [
        { key: "edit", label: "Edit" },
        { key: "archive", label: "Archive" },
      ],
      open: true,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type }),
    }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    fireEvent.keyDown(view.getByRole("menu", { name: /row actions/i }), { key: "Escape" });
    assert.equal(openChanges.at(-1).open, false);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(Tabs, {
      label: "Component sections",
      items: [
        { key: "overview", label: "Overview" },
        { key: "design", label: "Design", disabled: true },
        { key: "build", label: "Build" },
      ],
      onValueChange: (key, event) => changes.push({ key, eventType: event.type }),
    }));
    const overview = view.getByRole("tab", { name: /overview/i });
    const build = view.getByRole("tab", { name: /build/i });

    assert.equal(overview.getAttribute("aria-selected"), "true");
    await user.click(build);
    await waitFor(() => assert.equal(build.getAttribute("aria-selected"), "true"));
    assert.deepEqual(changes.at(-1), { key: "build", eventType: "click" });

    fireEvent.keyDown(build, { key: "ArrowLeft" });
    await waitFor(() => assert.equal(overview.getAttribute("aria-selected"), "true"));
    assert.deepEqual(changes.at(-1), { key: "overview", eventType: "keydown" });
    fireEvent.keyDown(overview, { key: "End" });
    assert.deepEqual(changes.at(-1), { key: "build", eventType: "keydown" });

    view.rerender(React.createElement(Tabs, {
      label: "Component sections",
      selectedKey: "overview",
      items: [
        { key: "overview", label: "Overview" },
        { key: "build", label: "Build" },
      ],
      onValueChange: (key, event) => changes.push({ key, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(overview.getAttribute("aria-selected"), "true"));
    await user.click(build);
    assert.equal(changes.at(-1).key, "build");
    assert.equal(build.getAttribute("aria-selected"), "false");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P0 overlays/navigation production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
