import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});

const React = await import("react");
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const { Accordion, Breadcrumbs, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, Checkbox } = await import("../src/index.js");

try {
  const expandedChanges = [];
  const { getByRole } = render(React.createElement(Accordion, {
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds) => expandedChanges.push(expandedIds),
  }));

  const overviewTrigger = getByRole("button", { name: /overview/i });
  const pricingTrigger = getByRole("button", { name: /pricing/i });

  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

  fireEvent.click(overviewTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), ["overview"]);

  fireEvent.click(pricingTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), ["pricing"]);

  cleanup();

  const clickedBreadcrumbs = [];
  const { getByRole: getBreadcrumbRole } = render(React.createElement(Breadcrumbs, {
    items: [
      {
        id: "fleet",
        label: "Fleet",
        href: "/fleet",
        onClick: (item, event) => clickedBreadcrumbs.push({
          item,
          defaultPrevented: event.defaultPrevented,
        }),
      },
      { id: "vehicle", label: "Vehicle", current: true },
    ],
  }));

  fireEvent.click(getBreadcrumbRole("link", { name: /fleet/i }));
  assert.equal(clickedBreadcrumbs.length, 1);
  assert.equal(clickedBreadcrumbs[0].item.id, "fleet");
  assert.equal(clickedBreadcrumbs[0].defaultPrevented, true);

  cleanup();

  const cardActions = [];
  const { getByRole: getCardRole } = render(React.createElement(Card, {
    title: "Wallet balance",
    value: "$8,412.50",
    interactive: true,
    actions: [],
    onAction: (...args) => cardActions.push(args),
  }));

  const interactiveCard = getCardRole("button", { name: /wallet balance/i });
  fireEvent.click(interactiveCard);
  assert.equal(cardActions.length, 1);
  assert.equal(cardActions[0][0].type, "click");

  fireEvent.keyDown(interactiveCard, { key: "Enter" });
  assert.equal(cardActions.length, 2);
  assert.equal(cardActions[1][0].key, "Enter");

  cleanup();

  const nestedCardActions = [];
  const nestedActionClicks = [];
  const { getByRole: getNestedCardRole } = render(React.createElement(Card, {
    title: "Driver card",
    actions: [
      {
        key: "freeze",
        label: "Freeze",
        onClick: (event) => nestedActionClicks.push(event.type),
      },
    ],
    onAction: (...args) => nestedCardActions.push(args),
  }));

  fireEvent.click(getNestedCardRole("button", { name: /freeze/i }));
  assert.deepEqual(nestedActionClicks, ["click"]);
  assert.equal(nestedCardActions.length, 1);
  assert.equal(nestedCardActions[0][0], "freeze");
  assert.equal(nestedCardActions[0][1].label, "Freeze");
  assert.equal(nestedCardActions[0][2].type, "click");

  cleanup();

  const expiryChanges = [];
  const { getByLabelText } = render(React.createElement(CardExpiryInput, {
    label: "Expiry date",
    onValueChange: (value, meta) => expiryChanges.push({ value, meta }),
  }));

  const expiryInput = getByLabelText(/expiry date/i);
  fireEvent.input(expiryInput, { target: { value: "1228" } });

  await waitFor(() => assert.equal(expiryInput.value, "12/28"));
  assert.equal(expiryChanges.at(-1).value, "12/28");
  assert.equal(expiryChanges.at(-1).meta.digits, "1228");
  assert.equal(expiryChanges.at(-1).meta.month, "12");
  assert.equal(expiryChanges.at(-1).meta.year, "28");
  assert.equal(expiryChanges.at(-1).meta.validity, "valid");

  cleanup();

  const cardNumberChanges = [];
  const { getByLabelText: getCardNumberLabel } = render(React.createElement(CardNumberInput, {
    label: "Card number",
    onValueChange: (digits, meta) => cardNumberChanges.push({ digits, meta }),
  }));

  const cardNumberInput = getCardNumberLabel(/card number/i);
  fireEvent.input(cardNumberInput, { target: { value: "4111111111111111" } });

  await waitFor(() => assert.equal(cardNumberInput.value, "4111 1111 1111 1111"));
  assert.equal(cardNumberChanges.at(-1).digits, "4111111111111111");
  assert.equal(cardNumberChanges.at(-1).meta.formatted, "4111 1111 1111 1111");
  assert.equal(cardNumberChanges.at(-1).meta.brand, "Visa");
  assert.equal(cardNumberChanges.at(-1).meta.validity, "valid");
  assert.equal(cardNumberChanges.at(-1).meta.luhnValid, true);

  cleanup();

  const securityCodeChanges = [];
  const { getByLabelText: getSecurityCodeLabel, getByRole: getSecurityCodeRole } = render(React.createElement(CardSecurityCodeInput, {
    label: "Security code",
    expectedLength: 4,
    onValueChange: (digits, meta) => securityCodeChanges.push({ digits, meta }),
  }));

  const securityCodeInput = getSecurityCodeLabel(/security code/i, { selector: "input" });
  fireEvent.input(securityCodeInput, { target: { value: "12345" } });

  await waitFor(() => assert.equal(securityCodeInput.value, "1234"));
  assert.equal(securityCodeChanges.at(-1).digits, "1234");
  assert.equal(securityCodeChanges.at(-1).meta.expectedLength, 4);
  assert.equal(securityCodeChanges.at(-1).meta.validity, "valid");
  assert.equal(securityCodeChanges.at(-1).meta.complete, true);

  const revealButton = getSecurityCodeRole("button", { name: /show security code/i });
  assert.equal(securityCodeInput.type, "password");
  fireEvent.click(revealButton);
  await waitFor(() => assert.equal(securityCodeInput.type, "text"));
  assert.equal(revealButton.getAttribute("aria-pressed"), "true");

  cleanup();

  const checkboxChanges = [];
  const { getByLabelText: getCheckboxLabel } = render(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    indeterminate: true,
    onCheckedChange: (checked, meta) => checkboxChanges.push({ checked, meta }),
  }));

  const checkboxInput = getCheckboxLabel(/enable fuel card/i);
  assert.equal(checkboxInput.indeterminate, true);
  assert.equal(checkboxInput.getAttribute("aria-checked"), "mixed");

  fireEvent.click(checkboxInput);
  await waitFor(() => assert.equal(checkboxInput.checked, true));
  assert.equal(checkboxInput.indeterminate, false);
  assert.equal(checkboxInput.getAttribute("aria-checked"), "true");
  assert.equal(checkboxChanges.at(-1).checked, true);
  assert.deepEqual(checkboxChanges.at(-1).meta, { indeterminate: false, value: "fuel-card" });
} finally {
  cleanup();
  dom.window.close();
}

console.log("react interaction tests passed");
