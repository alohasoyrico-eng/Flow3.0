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
const { cleanup, render, waitFor } = await import("@testing-library/react");
const { EmptyState, ErrorPanel, InlineValidation, ProgressIndicator, Stepper, Toast } = await import("../dist/index.js");

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
    const actions = [];
    const directActions = [];
    const view = render(React.createElement(EmptyState, {
      title: "No routes found",
      description: "Try widening the search filters.",
      icon: "search_off",
      variant: "search-empty",
      state: "search-empty",
      density: "sm",
      fullWidth: true,
      action: {
        key: "reset",
        label: "Reset filters",
        onClick: (event) => directActions.push(event.type),
      },
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    const section = view.getByRole("region", { name: /no routes found/i });
    const button = view.getByRole("button", { name: /reset filters/i });

    assert.equal(section.dataset.variant, "search-empty");
    assert.equal(section.dataset.state, "search-empty");
    assert.equal(section.dataset.density, "sm");
    assert.equal(section.dataset.fullWidth, "true");
    await user.click(button);
    assert.deepEqual(directActions, ["click"]);
    assert.deepEqual(actions, [{ key: "reset", eventType: "click" }]);

    view.rerender(React.createElement(EmptyState, {
      title: "No routes found",
      action: {
        key: "reset",
        label: "Reset filters",
        onClick: (event) => event.preventDefault(),
      },
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    await user.click(button);
    assert.equal(actions.length, 1);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const directActions = [];
    const view = render(React.createElement(ErrorPanel, {
      label: "Unable to sync cards",
      description: "Card updates could not be saved.",
      tone: "critical",
      variant: "blocking",
      state: "critical",
      density: "lg",
      fullWidth: true,
      action: {
        key: "retry",
        label: "Retry sync",
        onClick: (event) => directActions.push(event.type),
      },
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    const alert = view.getByRole("alert");
    const button = view.getByRole("button", { name: /retry sync/i });

    assert.equal(alert.dataset.variant, "blocking");
    assert.equal(alert.dataset.state, "critical");
    assert.equal(alert.dataset.density, "lg");
    assert.equal(alert.dataset.fullWidth, "true");
    await user.click(button);
    assert.deepEqual(directActions, ["click"]);
    assert.deepEqual(actions, [{ key: "retry", eventType: "click" }]);

    view.rerender(React.createElement(ErrorPanel, {
      label: "Unable to sync cards",
      state: "disabled",
      action: {
        key: "retry",
        label: "Retry sync",
      },
      onAction: (key, event) => actions.push({ key, eventType: event.type }),
    }));
    await user.click(button);
    assert.equal(actions.length, 1);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(InlineValidation, {
      label: "Driver email",
      value: "dispatch@example.com",
      message: "Use a verified company address.",
      state: "warning",
      density: "md",
      fullWidth: true,
      field: true,
      live: true,
    }));
    const input = view.getByLabelText(/driver email/i);
    const message = view.getByText(/verified company address/i);

    assert.equal(input.readOnly, true);
    assert.equal(input.getAttribute("aria-describedby"), message.id);
    assert.equal(view.container.firstElementChild.dataset.state, "warning");
    assert.equal(view.container.firstElementChild.dataset.density, "md");
    assert.equal(message.getAttribute("role"), "status");

    view.rerender(React.createElement(InlineValidation, {
      label: "Driver email",
      value: "dispatch@example.com",
      message: "Email is required.",
      state: "error",
      live: true,
    }));
    assert.equal(view.getByLabelText(/driver email/i).getAttribute("aria-invalid"), "true");
    assert.equal(view.getByText(/email is required/i).getAttribute("role"), "alert");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(ProgressIndicator, {
      label: "Sync progress",
      value: 25,
      max: 50,
      showValue: true,
      tone: "success",
      state: "active",
      density: "sm",
      fullWidth: true,
    }));
    const progress = view.getByRole("progressbar", { name: /sync progress/i });
    const progressRoot = progress.closest(".progress");

    assert.equal(progress.getAttribute("value"), "25");
    assert.equal(progress.getAttribute("max"), "50");
    assert.equal(progress.getAttribute("aria-valuenow"), "25");
    assert.equal(progress.getAttribute("aria-valuemax"), "50");
    assert.equal(progressRoot.getAttribute("aria-busy"), "true");
    assert.equal(progressRoot.dataset.tone, "success");
    assert.equal(progressRoot.dataset.state, "active");
    assert.equal(progressRoot.dataset.density, "sm");
    assert.equal(view.getByText("50%").textContent, "50%");

    view.rerender(React.createElement(ProgressIndicator, {
      label: "Sync progress",
      indeterminate: true,
      state: "indeterminate",
      ariaValueText: "Sync still running",
    }));
    assert.equal(progress.hasAttribute("value"), false);
    assert.equal(progress.getAttribute("aria-valuetext"), "Sync still running");
    assert.equal(progressRoot.dataset.indeterminate, "true");

    view.rerender(React.createElement(ProgressIndicator, {
      label: "Sync progress",
      state: "complete",
      value: 25,
      max: 50,
      showValue: true,
    }));
    assert.equal(progress.getAttribute("value"), "50");
    assert.equal(progressRoot.getAttribute("aria-busy"), null);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(ProgressIndicator, {
      label: "Battery quota",
      value: 8,
      max: 10,
      variant: "circular",
      showValue: true,
      tone: "warning",
      density: "lg",
    }));
    const progress = view.getByRole("progressbar", { name: /battery quota/i });
    const progressRoot = progress.closest(".progress");

    assert.equal(progress.getAttribute("aria-valuemin"), "0");
    assert.equal(progress.getAttribute("aria-valuemax"), "10");
    assert.equal(progress.getAttribute("aria-valuenow"), "8");
    assert.equal(progressRoot.dataset.variant, "circular");
    assert.equal(progressRoot.dataset.density, "lg");
    assert.equal(view.getByText("80%").classList.contains("progress__ring-value"), true);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Stepper, {
      label: "Driver onboarding progress",
      current: 1,
      orientation: "vertical",
      density: "lg",
      steps: [
        { id: "account", label: "Account", description: "Invite accepted" },
        { id: "documents", label: "Documents", description: "License and ID" },
        { id: "vehicle", label: "Vehicle", description: "Assign vehicle" },
      ],
    }));
    const list = view.getByRole("list", { name: /driver onboarding progress/i });
    const items = view.getAllByRole("listitem");

    assert.equal(list.dataset.orientation, "vertical");
    assert.equal(list.dataset.density, "lg");
    assert.equal(list.dataset.current, "1");
    assert.equal(items.length, 3);
    assert.equal(items[0].dataset.state, "complete");
    assert.equal(items[1].dataset.state, "active");
    assert.equal(items[1].getAttribute("aria-current"), "step");
    assert.equal(items[2].dataset.state, "pending");
    assert.equal(view.getByText("check").className, "stepper__marker");
    assert.equal(view.getByText("Documents").tagName, "STRONG");

    view.rerender(React.createElement(Stepper, {
      label: "Driver onboarding progress",
      current: 99,
      orientation: "sideways",
      steps: [
        { id: "account", label: "Account" },
        { id: "", label: "Missing id" },
        { id: "vehicle", label: "Vehicle" },
      ],
    }));
    const rerenderedList = view.getByRole("list", { name: /driver onboarding progress/i });
    const rerenderedItems = view.getAllByRole("listitem");

    assert.equal(rerenderedList.dataset.orientation, "horizontal");
    assert.equal(rerenderedList.dataset.current, "1");
    assert.equal(rerenderedItems.length, 2);
    assert.equal(rerenderedItems[1].dataset.state, "active");
    assert.equal(view.queryByText("Missing id"), null);

    view.rerender(React.createElement(Stepper, {
      label: "",
      steps: [{ id: "account", label: "Account" }],
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const dismisses = [];
    const view = render(React.createElement(Toast, {
      label: "Route saved",
      description: "The driver will see the update shortly.",
      tone: "success",
      variant: "undo",
      state: "visible",
      density: "md",
      actionLabel: "Undo",
      dismissible: true,
      dismissLabel: "Dismiss notification",
      onAction: (event) => actions.push(event.type),
      onDismiss: (event) => dismisses.push({ type: "dismiss", eventType: event.type }),
      onDismissChange: (dismissed, event) => dismisses.push({ type: "change", dismissed, eventType: event.type }),
    }));
    const status = view.getByRole("status");

    assert.equal(status.hidden, false);
    assert.equal(status.dataset.tone, "success");
    assert.equal(status.dataset.variant, "undo");
    assert.equal(status.dataset.state, "visible");
    assert.equal(status.dataset.density, "md");
    await user.click(view.getByRole("button", { name: /undo/i }));
    assert.deepEqual(actions, ["click"]);
    await user.click(view.getByRole("button", { name: /dismiss notification/i }));
    await waitFor(() => assert.equal(status.hidden, true));
    assert.deepEqual(dismisses, [
      { type: "dismiss", eventType: "click" },
      { type: "change", dismissed: true, eventType: "click" },
    ]);

    view.rerender(React.createElement(Toast, {
      label: "Route saved",
      dismissed: false,
      dismissible: true,
      dismissLabel: "Dismiss notification",
      onDismiss: (event) => event.preventDefault(),
      onDismissChange: (dismissed, event) => dismisses.push({ type: "prevented-change", dismissed, eventType: event.type }),
    }));
    await user.click(view.getByRole("button", { name: /dismiss notification/i }));
    assert.equal(dismisses.length, 2);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P1 feedback production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
