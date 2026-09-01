import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Button,
  IconButton,
  assertNoAxeViolations,
  cleanup,
  close,
  createUser,
  render,
} = await createInteractionHarness();

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
      intent: "warning",
      selected: true,
      badge: true,
      density: "lg",
      onClick: (event) => clicks.push(event.type),
    }));
    const button = view.getByRole("button", { name: /toggle density/i });

    assert.equal(button.getAttribute("aria-pressed"), "true");
    assert.equal(button.dataset.intent, "warning");
    assert.equal(button.dataset.state, "selected");
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
    assert.equal(button.dataset.state, "disabled");
    await user.click(button);
    assert.deepEqual(clicks, ["click", "click"]);

    view.rerender(React.createElement(IconButton, {
      label: "Toggle density",
      icon: "grid_view",
      variant: "accent",
      intent: "destructive",
    }));
    assert.match(button.className, /icon-button--ghost/);
    assert.doesNotMatch(button.className, /icon-button--accent/);
    assert.equal(button.dataset.intent, "default");

    view.rerender(React.createElement(IconButton, {
      label: "Toggle density",
      icon: "grid_view",
      variant: "primary",
      intent: "danger",
      loading: true,
      onClick: (event) => clicks.push(event.type),
    }));
    assert.equal(button.dataset.intent, "danger");
    assert.equal(button.dataset.state, "loading");
    assert.equal(button.getAttribute("aria-busy"), "true");
    assert.equal(button.disabled, true);
    await user.click(button);
    assert.deepEqual(clicks, ["click", "click"]);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P1 actions production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
