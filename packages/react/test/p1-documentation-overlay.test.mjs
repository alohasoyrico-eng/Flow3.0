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
const { CodeBlock, Tooltip } = await import("../dist/index.js");

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
    const writes = [];
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => writes.push(value),
      },
    });
    const code = "import { Button } from '@design-system/react';";
    const view = render(React.createElement(CodeBlock, {
      code,
      label: "Install example",
      filename: "example.tsx",
      language: "tsx",
      helper: "React usage",
      variant: "specimen",
      state: "scrollable",
      density: "sm",
      copyable: true,
      copyAction: {
        ariaLabel: "Copy example snippet",
        copiedLabel: "Copied example",
        feedbackDuration: 1,
      },
      wrap: false,
    }));
    const figure = view.container.querySelector(".code-block");
    const button = view.getByRole("button", { name: /copy example snippet/i });
    const codeNode = view.container.querySelector("code.language-tsx");

    assert.equal(figure.dataset.variant, "specimen");
    assert.equal(figure.dataset.state, "scrollable");
    assert.equal(figure.dataset.density, "sm");
    assert.equal(figure.dataset.wrap, "false");
    assert.equal(figure.dataset.language, "tsx");
    assert.equal(codeNode.textContent, code);
    await user.click(button);
    await waitFor(() => assert.deepEqual(writes, [code]));
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const writes = [];
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => writes.push(value),
      },
    });
    const view = render(React.createElement(CodeBlock, {
      code: "pnpm test",
      label: "Disabled command",
      copyable: true,
      disabled: true,
    }));
    const figure = view.container.querySelector(".code-block");
    const button = view.getByRole("button", { name: /copy disabled command/i });

    assert.equal(figure.dataset.state, "disabled");
    assert.equal(figure.getAttribute("aria-disabled"), "true");
    assert.equal(button.disabled, true);
    await user.click(button);
    assert.deepEqual(writes, []);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(Tooltip, {
      triggerLabel: "Help",
      content: "Use a company email address.",
      id: "tip-email",
      placement: "right",
      variant: "icon-help",
      density: "lg",
      onOpenChange: (open, event) => changes.push({ open, eventType: event?.type }),
    }));
    const root = view.container.querySelector(".tooltip");
    const trigger = view.getByRole("button", { name: /help/i });
    const bubble = view.getByRole("tooltip", { hidden: true });

    assert.equal(root.dataset.placement, "right");
    assert.equal(root.dataset.variant, "icon-help");
    assert.equal(root.dataset.density, "lg");
    assert.equal(root.dataset.open, "false");
    assert.equal(bubble.hidden, true);

    trigger.focus();
    fireEvent.focus(trigger);
    await waitFor(() => assert.equal(root.dataset.open, "true"));
    assert.equal(trigger.getAttribute("aria-describedby"), "tip-email");
    assert.deepEqual(changes.at(-1), { open: true, eventType: "focus" });

    fireEvent.keyDown(trigger, { key: "Escape" });
    await waitFor(() => assert.equal(root.dataset.open, "false"));
    assert.deepEqual(changes.at(-1), { open: false, eventType: "keydown" });

    fireEvent.mouseEnter(trigger);
    await waitFor(() => assert.equal(root.dataset.open, "true"));
    assert.deepEqual(changes.at(-1), { open: true, eventType: "mouseenter" });
    fireEvent.mouseLeave(trigger);
    assert.equal(root.dataset.open, "false");
    fireEvent.blur(trigger);
    assert.equal(root.dataset.state, "default");

    view.rerender(React.createElement(Tooltip, {
      triggerLabel: "Help",
      content: "Use a company email address.",
      id: "tip-email",
      open: true,
      state: "open",
      onOpenChange: (open, event) => changes.push({ open, eventType: event?.type }),
    }));
    assert.equal(root.dataset.open, "true");
    assert.equal(trigger.getAttribute("aria-describedby"), "tip-email");
    fireEvent.keyDown(trigger, { key: "Escape" });
    assert.equal(root.dataset.open, "true");
    assert.deepEqual(changes.at(-1), { open: false, eventType: "keydown" });

    view.rerender(React.createElement(Tooltip, {
      triggerLabel: "Help",
      content: "Use a company email address.",
      disabled: true,
    }));
    assert.equal(trigger.disabled, true);
    assert.equal(root.dataset.state, "disabled");
    await user.click(trigger);
    assert.equal(root.dataset.open, "false");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P1 documentation/overlay production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
