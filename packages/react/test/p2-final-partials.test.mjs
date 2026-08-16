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
const {
  AuditEvent,
  BiometricPrompt,
  CardSummary,
  InputAmount,
} = await import("../dist/index.js");

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
    const changes = [];
    const view = render(React.createElement(InputAmount, {
      label: "Transfer amount",
      value: "$1,250.50 MXN",
      helper: "Maximum $5,000.",
      currency: "mxn",
      locale: "es-MX",
      prefix: "$",
      suffix: "MXN",
      density: "sm",
      required: true,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const fieldRoot = view.container.querySelector(".input-amount");
    const input = view.getByRole("textbox", { name: /transfer amount/i });

    assert.equal(fieldRoot?.tagName, "LABEL");
    assert.equal(fieldRoot?.dataset.state, "filled");
    assert.equal(fieldRoot?.dataset.density, "sm");
    assert.equal(fieldRoot?.dataset.currency, "MXN");
    assert.equal(fieldRoot?.dataset.align, "end");
    assert.equal(fieldRoot?.dataset.mono, "true");
    assert.equal(input.value, "1250.50");
    assert.equal(input.inputMode, "decimal");
    assert.equal(input.required, true);
    assert.equal(view.getByText("$").className, "field__prefix input-amount__currency");
    assert.equal(view.getByText("MXN").className, "field__suffix input-amount__suffix");
    assert.equal(view.getByText("Maximum $5,000.").className, "field__helper input-amount__helper");

    view.rerender(React.createElement(InputAmount, {
      key: "editable",
      label: "Transfer amount",
      helper: "Maximum $5,000.",
      currency: "mxn",
      locale: "es-MX",
      prefix: "$",
      suffix: "MXN",
      density: "sm",
      required: true,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const editableInput = view.getByRole("textbox", { name: /transfer amount/i });
    await user.type(editableInput, "$987.65");
    assert.equal(changes.at(-1)?.value, "987.65");
    assert.equal(changes.at(-1)?.meta.numericValue, 987.65);
    assert.equal(changes.at(-1)?.meta.currency, "MXN");
    assert.match(changes.at(-1)?.meta.formatted, /\$987\.65/);
    assert.equal(changes.at(-1)?.eventType, "change");

    view.rerender(React.createElement(InputAmount, {
      label: "Locked amount",
      value: "120",
      loading: true,
      currency: "usd",
      density: "lg",
    }));
    const loadingRoot = view.container.querySelector(".input-amount");
    const loadingInput = view.getByRole("textbox", { name: /locked amount/i });
    assert.equal(loadingRoot?.dataset.state, "loading");
    assert.equal(loadingRoot?.dataset.density, "lg");
    assert.equal(loadingRoot?.dataset.currency, "USD");
    assert.equal(loadingInput.disabled, true);
    assert.equal(view.container.querySelector(".spinner")?.classList.contains("field__icon--loading"), true);

    view.rerender(React.createElement(InputAmount, {
      label: "Amount with error",
      value: "0",
      validationMessage: "Enter a larger amount.",
      state: "filled",
    }));
    const errorInput = view.getByRole("textbox", { name: /amount with error/i });
    assert.equal(view.container.querySelector(".input-amount")?.dataset.state, "error");
    assert.equal(errorInput.getAttribute("aria-invalid"), "true");
    assert.equal(view.getByText("Enter a larger amount.").getAttribute("role"), "alert");

    view.rerender(React.createElement(InputAmount, { label: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(AuditEvent, {
      label: "Fuel limit changed",
      description: "MX-4821 policy updated.",
      meta: "Ana Sosa · Admin",
      timestamp: "09:42",
      status: "Verified",
      icon: "verified",
      tone: "warning",
      state: "verified",
      density: "lg",
    }));
    const event = view.container.querySelector(".audit-event");

    assert.equal(event?.tagName, "ARTICLE");
    assert.equal(event?.dataset.state, "verified");
    assert.equal(event?.dataset.tone, "success");
    assert.equal(event?.dataset.density, "lg");
    assert.equal(view.getByText("Fuel limit changed").tagName, "STRONG");
    assert.equal(view.getByText("MX-4821 policy updated.").tagName, "P");
    assert.equal(view.getByText("Ana Sosa · Admin").tagName, "SMALL");
    assert.equal(view.getByText("09:42").className, "audit-event__time");
    assert.equal(view.getByText("Verified").tagName, "EM");
    assert.equal(view.container.querySelector(".audit-event__icon")?.getAttribute("aria-hidden"), "true");

    view.rerender(React.createElement(AuditEvent, {
      label: "Manual review",
      status: "Critical",
      tone: "unknown",
      state: "critical",
    }));
    const critical = view.container.querySelector(".audit-event");
    assert.equal(critical?.dataset.state, "critical");
    assert.equal(critical?.dataset.tone, "danger");

    view.rerender(React.createElement(AuditEvent, {
      label: "Archived event",
      state: "disabled",
      status: "Archived",
    }));
    const disabled = view.container.querySelector(".audit-event");
    assert.equal(disabled?.dataset.state, "disabled");
    assert.equal(disabled?.getAttribute("aria-disabled"), "true");

    view.rerender(React.createElement(AuditEvent, { label: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const actions = [];
    const fallbacks = [];
    const view = render(React.createElement(BiometricPrompt, {
      label: "Confirm it is you",
      description: "Use Face ID to approve this transfer.",
      variant: "face",
      state: "default",
      actionLabel: "Use Face ID",
      fallback: "Use passcode",
      density: "lg",
      fullWidth: true,
      onAction: (event) => actions.push(event.type),
      onFallback: (event) => fallbacks.push(event.type),
    }));
    const prompt = view.getByRole("group", { name: /confirm it is you/i });
    const action = view.getByRole("button", { name: /use face id/i });
    const fallback = view.getByRole("button", { name: /use passcode/i });

    assert.equal(prompt.className, "biometric-prompt");
    assert.equal(prompt.dataset.variant, "face");
    assert.equal(prompt.dataset.state, "default");
    assert.equal(prompt.dataset.density, "lg");
    assert.equal(prompt.dataset.fullWidth, "true");
    assert.equal(view.container.querySelector(".biometric-prompt__icon")?.textContent, "face");
    assert.equal(view.getByText("Use Face ID to approve this transfer.").getAttribute("role"), "status");
    assert.equal(action.disabled, false);
    assert.equal(action.dataset.biometricAction, "");
    assert.equal(fallback.dataset.biometricFallback, "");
    await user.click(action);
    await user.click(fallback);
    assert.deepEqual(actions, ["click"]);
    assert.deepEqual(fallbacks, ["click"]);

    view.rerender(React.createElement(BiometricPrompt, {
      label: "Authenticating",
      variant: "face",
      state: "authenticating",
      actionLabel: "Use Face ID",
      onAction: (event) => actions.push(event.type),
    }));
    const authenticating = view.getByRole("group", { name: /authenticating/i });
    const authenticatingAction = view.getByRole("button", { name: /use face id/i });
    assert.equal(authenticating.dataset.state, "authenticating");
    assert.equal(authenticatingAction.disabled, true);

    view.rerender(React.createElement(BiometricPrompt, {
      label: "Fallback required",
      variant: "unknown",
      state: "disabled",
      actionLabel: "Continue",
      fallback: "Use code",
      onAction: (event) => actions.push(event.type),
      onFallback: (event) => fallbacks.push(event.type),
    }));
    const disabledPrompt = view.getByRole("group", { name: /fallback required/i });
    const disabledAction = view.getByRole("button", { name: /continue/i });
    assert.equal(disabledPrompt.dataset.variant, "fingerprint");
    assert.equal(disabledPrompt.dataset.state, "disabled");
    assert.equal(disabledAction.disabled, true);
    const before = actions.length;
    await user.click(disabledAction);
    assert.equal(actions.length, before);

    view.rerender(React.createElement(BiometricPrompt, { label: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(CardSummary, {
      label: "Fleet card",
      meta: "ANA SOSA",
      number: "**** 4821",
      expires: "12/28",
      status: "Review",
      variant: "limit",
      state: "warning",
      density: "sm",
      fullWidth: true,
      metrics: [
        { key: "available", label: "Available", value: "$2,480" },
        { key: "limit", label: "Limit", value: "$5,000" },
        { label: "Ignored", value: "$999" },
      ],
    }));
    const card = view.container.querySelector(".card-summary");

    assert.equal(card?.tagName, "ARTICLE");
    assert.equal(card?.dataset.variant, "limit");
    assert.equal(card?.dataset.state, "warning");
    assert.equal(card?.dataset.density, "sm");
    assert.equal(card?.dataset.fullWidth, "true");
    assert.equal(view.getByText("Fleet card").className, "card-summary__brand");
    assert.equal(view.getByText("Review").closest(".badge")?.classList.contains("badge"), true);
    assert.equal(view.getByText("**** 4821").className, "card-summary__number");
    assert.equal(view.getByText("12/28").className, "card-summary__expires");
    assert.equal(view.getByText("ANA SOSA").className, "card-summary__holder");
    assert.equal(view.container.querySelectorAll(".card-summary__metrics > span").length, 2);

    view.rerender(React.createElement(CardSummary, {
      label: "Virtual card",
      variant: "virtual",
      state: "unknown",
      status: "Active",
      metrics: [{ key: "ignored", label: "Ignored", value: "$1" }],
    }));
    const virtual = view.container.querySelector(".card-summary");
    assert.equal(virtual?.dataset.variant, "virtual");
    assert.equal(virtual?.dataset.state, "default");
    assert.equal(view.container.querySelector(".card-summary__icon")?.textContent, "smartphone");
    assert.equal(view.container.querySelector(".card-summary__metrics"), null);

    view.rerender(React.createElement(CardSummary, {
      label: "Frozen card",
      state: "frozen",
      status: "Frozen",
    }));
    const frozen = view.container.querySelector(".card-summary");
    assert.equal(frozen?.dataset.state, "frozen");
    assert.equal(view.container.querySelector(".card-summary__frost")?.getAttribute("aria-hidden"), "true");
    assert.equal(view.container.querySelector(".card-summary__frost")?.textContent, "ac_unitFrozen");

    view.rerender(React.createElement(CardSummary, {
      label: "Disabled card",
      disabled: true,
      status: "Unavailable",
    }));
    const disabled = view.container.querySelector(".card-summary");
    assert.equal(disabled?.dataset.state, "disabled");
    assert.equal(disabled?.getAttribute("aria-disabled"), "true");

    view.rerender(React.createElement(CardSummary, { label: "" }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 final partial component evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
