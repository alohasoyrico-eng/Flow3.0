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
const { Button, CopyButton, FloatingActionButton, IconButton, QuickAction } = await import("../dist/index.js");

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
    const clicks = [];
    const view = render(React.createElement(Button, {
      label: "Save route",
      variant: "primary",
      density: "sm",
      type: "submit",
      onClick: (event) => clicks.push(event.type),
    }));
    const button = view.getByRole("button", { name: /save route/i });

    assert.equal(button.type, "submit");
    assert.equal(button.dataset.density, "sm");
    await user.click(button);
    assert.deepEqual(clicks, ["click"]);
    button.focus();
    await user.keyboard("{Enter}");
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(Button, {
      label: "Save route",
      disabled: true,
      onClick: (event) => clicks.push(event.type),
    }));
    assert.equal(button.dataset.state, "disabled");
    await user.click(button);
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(Button, {
      label: "Save route",
      intent: "danger",
      loading: true,
      onClick: (event) => clicks.push(event.type),
    }));
    assert.match(button.className, /button--danger/);
    assert.equal(button.dataset.state, "loading");
    assert.equal(button.getAttribute("aria-busy"), "true");
    await user.click(button);
    assert.deepEqual(clicks, ["click", "click"]);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const clicks = [];
    const view = render(React.createElement(IconButton, {
      label: "Toggle density",
      icon: "grid_view",
      selected: true,
      badge: true,
      density: "lg",
      onClick: (event) => clicks.push(event.type),
    }));
    const button = view.getByRole("button", { name: /toggle density/i });

    assert.equal(button.getAttribute("aria-pressed"), "true");
    assert.equal(button.dataset.density, "lg");
    await user.click(button);
    assert.deepEqual(clicks, ["click"]);
    button.focus();
    await user.keyboard("{Enter}");
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(IconButton, {
      label: "Toggle density",
      icon: "grid_view",
      disabled: true,
      onClick: (event) => clicks.push(event.type),
    }));
    await user.click(button);
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(IconButton, {
      label: "Toggle density",
      icon: "grid_view",
      variant: "accent",
    }));
    assert.match(button.className, /icon-button--ghost/);
    assert.doesNotMatch(button.className, /icon-button--accent/);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const clicks = [];
    const view = render(React.createElement(FloatingActionButton, {
      label: "Create card",
      icon: "add",
      extended: true,
      onClick: (event) => clicks.push(event.type),
    }));
    const button = view.getByRole("button", { name: /create card/i });

    assert.equal(button.dataset.extended, "true");
    await user.click(button);
    assert.deepEqual(clicks, ["click"]);
    button.focus();
    await user.keyboard("{Enter}");
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(FloatingActionButton, {
      label: "Create card",
      loading: true,
      onClick: (event) => clicks.push(event.type),
    }));
    assert.equal(button.getAttribute("aria-busy"), "true");
    await user.click(button);
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(FloatingActionButton, {
      label: "Create card",
      variant: "secondary",
      intent: "danger",
      onClick: (event) => clicks.push(event.type),
    }));
    assert.equal(button.dataset.variant, "secondary");
    assert.equal(button.dataset.intent, "danger");

    view.rerender(React.createElement(FloatingActionButton, {
      label: "Create card",
      variant: "accent",
      intent: "destructive",
      onClick: (event) => clicks.push(event.type),
    }));
    assert.equal(button.dataset.variant, "primary");
    assert.equal(button.dataset.intent, "default");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const clicks = [];
    const view = render(React.createElement(QuickAction, {
      label: "Scan card",
      icon: "qr_code",
      badge: "2",
      onClick: (event) => clicks.push(event.type),
      onAction: (meta, event) => actions.push({ label: meta.label, variant: meta.variant, state: meta.state, eventType: event.type }),
    }));
    const button = view.getByRole("button", { name: /scan card/i });

    await user.click(button);
    assert.deepEqual(clicks, ["click"]);
    assert.deepEqual(actions, [{ label: "Scan card", variant: "standard", state: "default", eventType: "click" }]);

    view.rerender(React.createElement(QuickAction, {
      label: "Scan card",
      icon: "qr_code",
      onClick: (event) => event.preventDefault(),
      onAction: (meta) => actions.push(meta),
    }));
    await user.click(button);
    assert.equal(actions.length, 1);

    view.rerender(React.createElement(QuickAction, {
      label: "Scan card",
      disabled: true,
      onAction: (meta) => actions.push(meta),
    }));
    await user.click(button);
    assert.equal(actions.length, 1);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const clipboardWrites = [];
    const copied = [];
    const errors = [];
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          clipboardWrites.push(value);
        },
      },
    });
    const view = render(React.createElement(CopyButton, {
      value: "npm install @design-system/react",
      label: "Copy install command",
      copiedLabel: "Copied",
      feedbackDuration: 1,
      onCopied: (meta, event) => copied.push({ value: meta.value, state: meta.state, eventType: event.type }),
      onCopyError: (meta) => errors.push(meta),
    }));
    const button = view.getByRole("button", { name: /copy install command/i });

    await user.click(button);
    await waitFor(() => assert.equal(copied.at(-1).state, "copied"));
    assert.deepEqual(clipboardWrites, ["npm install @design-system/react"]);
    assert.equal(errors.length, 0);

    view.rerender(React.createElement(CopyButton, {
      value: "npm install @design-system/react",
      label: "Copy install command",
      onClick: (event) => event.preventDefault(),
      onCopied: (meta) => copied.push(meta),
    }));
    await user.click(button);
    assert.equal(copied.length, 1);

    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("clipboard denied");
        },
      },
    });
    view.rerender(React.createElement(CopyButton, {
      value: "npm install @design-system/react",
      label: "Copy install command",
      errorLabel: "Copy failed",
      onCopyError: (meta, event) => errors.push({ value: meta.value, state: meta.state, eventType: event.type }),
    }));
    fireEvent.click(button);
    await waitFor(() => assert.equal(errors.at(-1).state, "error"));
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P1 actions production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
