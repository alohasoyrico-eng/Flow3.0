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
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const { Accordion, Breadcrumbs, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, ChatComposer, ChatMessage, ChatThread, Checkbox, Chip, CodeInput, Combobox, CopyButton, CountrySelector, DatePicker, DateRangePicker, Dialog, Drawer, EmptyState, ErrorPanel, Input, InputAmount, KpiTile, List, Menu, MovementRow, Pagination, PhoneInput, Popover, QuickAction, RadioButton, RouteSummary, SegmentedControl, Select, Slider, StationPin, Switch, Table, Tabs, TextArea, Toast, Tooltip, TreeView } = await import("../dist/index.js");

try {
  const expandedChanges = [];
  const { getByRole, rerender: rerenderAccordion } = render(React.createElement(Accordion, {
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => expandedChanges.push({ expandedIds, eventType: event.type }),
  }));

  const overviewTrigger = getByRole("button", { name: /overview/i });
  const pricingTrigger = getByRole("button", { name: /pricing/i });

  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

  fireEvent.click(overviewTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), { expandedIds: ["overview"], eventType: "click" });

  fireEvent.click(pricingTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), { expandedIds: ["pricing"], eventType: "click" });

  rerenderAccordion(React.createElement(Accordion, {
    expandedIds: ["overview"],
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => expandedChanges.push({ expandedIds, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

  fireEvent.click(pricingTrigger);
  assert.deepEqual(expandedChanges.at(-1), { expandedIds: ["pricing"], eventType: "click" });
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");
  rerenderAccordion(React.createElement(Accordion, {
    expandedIds: ["pricing"],
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => expandedChanges.push({ expandedIds, eventType: event.type }),
  }));
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "true");
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const multipleExpandedChanges = [];
  const { getByRole: getMultipleAccordionRole } = render(React.createElement(Accordion, {
    variant: "multiple",
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => multipleExpandedChanges.push({ expandedIds, eventType: event.type }),
  }));

  const multipleOverviewTrigger = getMultipleAccordionRole("button", { name: /overview/i });
  const multiplePricingTrigger = getMultipleAccordionRole("button", { name: /pricing/i });
  fireEvent.click(multipleOverviewTrigger);
  fireEvent.click(multiplePricingTrigger);
  await waitFor(() => assert.equal(multipleOverviewTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(multiplePricingTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(multipleExpandedChanges.at(-1), { expandedIds: ["overview", "pricing"], eventType: "click" });

  cleanup();

  const preventedAccordionChanges = [];
  const accordionTriggerClicks = [];
  const { getByRole: getPreventedAccordionRole } = render(React.createElement(Accordion, {
    items: [
      {
        id: "prevented",
        title: "Prevented",
        content: "Blocked content",
        onClick: (event) => {
          accordionTriggerClicks.push(event.type);
          event.preventDefault();
        },
      },
    ],
    onExpandedChange: (expandedIds) => preventedAccordionChanges.push(expandedIds),
  }));

  const preventedAccordionTrigger = getPreventedAccordionRole("button", { name: /prevented/i });
  fireEvent.click(preventedAccordionTrigger);
  assert.deepEqual(accordionTriggerClicks, ["click"]);
  assert.equal(preventedAccordionTrigger.getAttribute("aria-expanded"), "false");
  assert.deepEqual(preventedAccordionChanges, []);

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
    actionKey: "wallet-balance",
    actions: [],
    onAction: (...args) => cardActions.push(args),
  }));

  const interactiveCard = getCardRole("button", { name: /wallet balance/i });
  fireEvent.click(interactiveCard);
  assert.equal(cardActions.length, 1);
  assert.equal(cardActions[0][0], "wallet-balance");
  assert.equal(cardActions[0][1], undefined);
  assert.equal(cardActions[0][2].type, "click");

  fireEvent.keyDown(interactiveCard, { key: "Enter" });
  assert.equal(cardActions.length, 2);
  assert.equal(cardActions[1][0], "wallet-balance");
  assert.equal(cardActions[1][1], undefined);
  assert.equal(cardActions[1][2].key, "Enter");

  cleanup();

  const preventedCardActions = [];
  const { getByRole: getPreventedCardRole } = render(React.createElement(Card, {
    title: "Prevented wallet",
    value: "$8,412.50",
    interactive: true,
    actionKey: "prevented-wallet",
    onClick: (event) => event.preventDefault(),
    onKeyDown: (event) => event.preventDefault(),
    onAction: (...args) => preventedCardActions.push(args),
  }));

  const preventedCard = getPreventedCardRole("button", { name: /prevented wallet/i });
  fireEvent.click(preventedCard);
  fireEvent.keyDown(preventedCard, { key: "Enter" });
  assert.deepEqual(preventedCardActions, []);

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

  const preventedNestedCardActions = [];
  const { getByRole: getPreventedNestedCardRole } = render(React.createElement(Card, {
    title: "Driver card",
    actions: [
      {
        key: "freeze",
        label: "Freeze",
        onClick: (event) => event.preventDefault(),
      },
    ],
    onAction: (...args) => preventedNestedCardActions.push(args),
  }));

  fireEvent.click(getPreventedNestedCardRole("button", { name: /freeze/i }));
  assert.deepEqual(preventedNestedCardActions, []);

  cleanup();

  const expiryChanges = [];
  const { getByLabelText, rerender: rerenderExpiry } = render(React.createElement(CardExpiryInput, {
    label: "Expiry date",
    onValueChange: (value, meta, event) => expiryChanges.push({ value, meta, eventType: event.type }),
  }));

  const expiryInput = getByLabelText(/expiry date/i);
  fireEvent.input(expiryInput, { target: { value: "1228" } });

  await waitFor(() => assert.equal(expiryInput.value, "12/28"));
  assert.equal(expiryChanges.at(-1).value, "12/28");
  assert.equal(expiryChanges.at(-1).meta.digits, "1228");
  assert.equal(expiryChanges.at(-1).meta.month, "12");
  assert.equal(expiryChanges.at(-1).meta.year, "28");
  assert.equal(expiryChanges.at(-1).meta.validity, "valid");
  assert.equal(expiryChanges.at(-1).eventType, "change");

  rerenderExpiry(React.createElement(CardExpiryInput, {
    label: "Expiry date",
    value: "1029",
    onValueChange: (value, meta, event) => expiryChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(expiryInput.value, "10/29"));
  fireEvent.input(expiryInput, { target: { value: "1129" } });
  assert.equal(expiryChanges.at(-1).value, "11/29");
  await waitFor(() => assert.equal(expiryInput.value, "10/29"));
  rerenderExpiry(React.createElement(CardExpiryInput, {
    label: "Expiry date",
    value: "1129",
    onValueChange: (value, meta, event) => expiryChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(expiryInput.value, "11/29"));

  cleanup();

  const cardNumberChanges = [];
  const { getByLabelText: getCardNumberLabel, rerender: rerenderCardNumber } = render(React.createElement(CardNumberInput, {
    label: "Card number",
    onValueChange: (digits, meta, event) => cardNumberChanges.push({ digits, meta, eventType: event.type }),
  }));

  const cardNumberInput = getCardNumberLabel(/card number/i);
  fireEvent.input(cardNumberInput, { target: { value: "4111111111111111" } });

  await waitFor(() => assert.equal(cardNumberInput.value, "4111 1111 1111 1111"));
  assert.equal(cardNumberChanges.at(-1).digits, "4111111111111111");
  assert.equal(cardNumberChanges.at(-1).meta.formatted, "4111 1111 1111 1111");
  assert.equal(cardNumberChanges.at(-1).meta.brand, "Visa");
  assert.equal(cardNumberChanges.at(-1).meta.validity, "valid");
  assert.equal(cardNumberChanges.at(-1).meta.luhnValid, true);
  assert.equal(cardNumberChanges.at(-1).eventType, "change");

  rerenderCardNumber(React.createElement(CardNumberInput, {
    label: "Card number",
    value: "5555555555554444",
    onValueChange: (digits, meta, event) => cardNumberChanges.push({ digits, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(cardNumberInput.value, "5555 5555 5555 4444"));
  fireEvent.input(cardNumberInput, { target: { value: "4111111111111111" } });
  assert.equal(cardNumberChanges.at(-1).digits, "4111111111111111");
  await waitFor(() => assert.equal(cardNumberInput.value, "5555 5555 5555 4444"));
  rerenderCardNumber(React.createElement(CardNumberInput, {
    label: "Card number",
    value: "4111111111111111",
    onValueChange: (digits, meta, event) => cardNumberChanges.push({ digits, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(cardNumberInput.value, "4111 1111 1111 1111"));

  cleanup();

  const securityCodeChanges = [];
  const { getByLabelText: getSecurityCodeLabel, getByRole: getSecurityCodeRole, rerender: rerenderSecurityCode } = render(React.createElement(CardSecurityCodeInput, {
    label: "Security code",
    expectedLength: 4,
    revealLabel: "Reveal CVC",
    hideLabel: "Conceal CVC",
    onValueChange: (digits, meta, event) => securityCodeChanges.push({ digits, meta, eventType: event.type }),
  }));

  const securityCodeInput = getSecurityCodeLabel(/security code/i, { selector: "input" });
  fireEvent.input(securityCodeInput, { target: { value: "12345" } });

  await waitFor(() => assert.equal(securityCodeInput.value, "1234"));
  assert.equal(securityCodeChanges.at(-1).digits, "1234");
  assert.equal(securityCodeChanges.at(-1).meta.expectedLength, 4);
  assert.equal(securityCodeChanges.at(-1).meta.validity, "valid");
  assert.equal(securityCodeChanges.at(-1).meta.complete, true);
  assert.equal(securityCodeChanges.at(-1).eventType, "change");

  const revealButton = getSecurityCodeRole("button", { name: /reveal cvc/i });
  assert.equal(securityCodeInput.type, "password");
  fireEvent.click(revealButton);
  await waitFor(() => assert.equal(securityCodeInput.type, "text"));
  assert.equal(revealButton.getAttribute("aria-pressed"), "true");

  rerenderSecurityCode(React.createElement(CardSecurityCodeInput, {
    label: "Security code",
    expectedLength: 4,
    value: "9876",
    revealed: false,
    revealLabel: "Reveal CVC",
    hideLabel: "Conceal CVC",
    onValueChange: (digits, meta, event) => securityCodeChanges.push({ digits, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(securityCodeInput.value, "9876"));
  await waitFor(() => assert.equal(securityCodeInput.type, "password"));

  cleanup();

  const revealChanges = [];
  const { getByLabelText: getControlledSecurityLabel, getByRole: getControlledSecurityRole, rerender: rerenderControlledSecurity } = render(React.createElement(CardSecurityCodeInput, {
    label: "Controlled security code",
    value: "123",
    revealed: false,
    revealLabel: "Reveal controlled CVC",
    hideLabel: "Conceal controlled CVC",
    onValueChange: (digits, meta, event) => securityCodeChanges.push({ digits, meta, eventType: event.type }),
    onRevealChange: (revealed, event) => revealChanges.push({ revealed, eventType: event.type }),
  }));

  const controlledSecurityInput = getControlledSecurityLabel(/controlled security code/i, { selector: "input" });
  const controlledRevealButton = getControlledSecurityRole("button", { name: /reveal controlled cvc/i });
  fireEvent.input(controlledSecurityInput, { target: { value: "999" } });
  assert.equal(securityCodeChanges.at(-1).digits, "999");
  await waitFor(() => assert.equal(controlledSecurityInput.value, "123"));
  rerenderControlledSecurity(React.createElement(CardSecurityCodeInput, {
    label: "Controlled security code",
    value: "999",
    revealed: false,
    revealLabel: "Reveal controlled CVC",
    hideLabel: "Conceal controlled CVC",
    onValueChange: (digits, meta, event) => securityCodeChanges.push({ digits, meta, eventType: event.type }),
    onRevealChange: (revealed, event) => revealChanges.push({ revealed, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(controlledSecurityInput.value, "999"));
  fireEvent.click(controlledRevealButton);
  assert.deepEqual(revealChanges, [{ revealed: true, eventType: "click" }]);
  assert.equal(controlledSecurityInput.type, "password");
  assert.equal(controlledRevealButton.getAttribute("aria-pressed"), "false");

  cleanup();

  const checkboxChanges = [];
  const { getByLabelText: getCheckboxLabel, rerender: rerenderCheckbox } = render(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    indeterminate: true,
    onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
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
  assert.equal(checkboxChanges.at(-1).eventType, "change");

  rerenderCheckbox(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    checked: false,
    onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(checkboxInput.checked, false));
  await waitFor(() => assert.equal(checkboxInput.getAttribute("aria-checked"), "false"));
  fireEvent.click(checkboxInput);
  assert.equal(checkboxChanges.at(-1).checked, true);
  await waitFor(() => assert.equal(checkboxInput.checked, false));
  rerenderCheckbox(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    checked: true,
    onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(checkboxInput.checked, true));

  cleanup();

  const removedChips = [];
  const { getByRole: getChipRole } = render(React.createElement(Chip, {
    label: "Active",
    removable: true,
    onRemoveLabel: "Remove Active",
    onRemove: (label, event) => removedChips.push({ label, eventType: event.type }),
  }));

  fireEvent.click(getChipRole("button", { name: /remove active/i }));
  assert.deepEqual(removedChips, [{ label: "Active", eventType: "click" }]);

  cleanup();

  const selectedChips = [];
  const { getByRole: getSelectableChipRole } = render(React.createElement(Chip, {
    label: "EV",
    selected: false,
    onSelectedChange: (selected, event) => selectedChips.push({ selected, eventType: event.type }),
  }));

  const selectableChip = getSelectableChipRole("button", { name: /ev/i });
  assert.equal(selectableChip.getAttribute("aria-pressed"), "false");
  fireEvent.click(selectableChip);
  assert.deepEqual(selectedChips, [{ selected: true, eventType: "click" }]);

  cleanup();

  const preventedChipChanges = [];
  const { getByRole: getPreventedChipRole } = render(React.createElement(Chip, {
    label: "Prevented",
    onClick: (event) => event.preventDefault(),
    onSelectedChange: (selected) => preventedChipChanges.push(selected),
  }));

  fireEvent.click(getPreventedChipRole("button", { name: /prevented/i }));
  assert.deepEqual(preventedChipChanges, []);

  cleanup();

  const codeValues = [];
  const completedCodes = [];
  const { getByLabelText: getCodeLabel, rerender: rerenderCodeInput } = render(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    onValueChange: (value, meta, event) => codeValues.push({ value, meta, eventType: event.type }),
    onComplete: (value, meta, event) => completedCodes.push({ value, meta, eventType: event.type }),
  }));

  const codeInput = getCodeLabel(/sms code/i);
  fireEvent.focus(codeInput);
  fireEvent.input(codeInput, { target: { value: "12a34" } });

  await waitFor(() => assert.equal(codeInput.value, "1234"));
  assert.deepEqual(codeValues, [{ value: "1234", meta: { value: "1234", length: 4, complete: true }, eventType: "change" }]);
  assert.deepEqual(completedCodes, [{ value: "1234", meta: { value: "1234", length: 4, complete: true }, eventType: "change" }]);

  rerenderCodeInput(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    value: "9876",
    onValueChange: (value, meta, event) => codeValues.push({ value, meta, eventType: event.type }),
    onComplete: (value, meta, event) => completedCodes.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(codeInput.value, "9876"));
  fireEvent.input(codeInput, { target: { value: "1111" } });
  assert.deepEqual(codeValues.at(-1), { value: "1111", meta: { value: "1111", length: 4, complete: true }, eventType: "change" });
  await waitFor(() => assert.equal(codeInput.value, "9876"));
  rerenderCodeInput(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    value: "1111",
    onValueChange: (value, meta, event) => codeValues.push({ value, meta, eventType: event.type }),
    onComplete: (value, meta, event) => completedCodes.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(codeInput.value, "1111"));

  cleanup();

  const codeInputFocusEvents = [];
  const { container: preventedCodeInputContainer, getByLabelText: getPreventedCodeLabel } = render(React.createElement(CodeInput, {
    label: "Prevented SMS code",
    length: 4,
    onFocus: (event) => {
      codeInputFocusEvents.push(event.type);
      event.preventDefault();
    },
    onBlur: (event) => {
      codeInputFocusEvents.push(event.type);
      event.preventDefault();
    },
  }));

  const preventedCodeInput = getPreventedCodeLabel(/prevented sms code/i);
  fireEvent.focus(preventedCodeInput);
  assert.deepEqual(codeInputFocusEvents, ["focus"]);
  assert.equal(preventedCodeInputContainer.querySelector(".code-input")?.getAttribute("data-focused"), "false");
  fireEvent.blur(preventedCodeInput);
  assert.deepEqual(codeInputFocusEvents, ["focus", "blur"]);
  assert.equal(preventedCodeInputContainer.querySelector(".code-input")?.getAttribute("data-focused"), "false");

  cleanup();

  const comboboxChanges = [];
  const comboboxOpenChanges = [];
  const { getByRole: getComboboxRole, rerender: rerenderCombobox } = render(React.createElement(Combobox, {
    label: "Driver",
    optionsLabel: "Driver options",
    clearSelectionLabel: "Clear driver",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onValueChange: (value, meta, event) => comboboxChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => comboboxOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const comboboxInput = getComboboxRole("combobox", { name: /driver/i });
  fireEvent.focus(comboboxInput);
  assert.deepEqual(comboboxOpenChanges, [{ open: true, eventType: "focus", key: undefined }]);
  fireEvent.input(comboboxInput, { target: { value: "Ana" } });
  assert.equal(comboboxChanges.at(-1).value, "Ana");
  assert.equal(comboboxChanges.at(-1).meta.inputValue, "Ana");
  assert.equal(comboboxChanges.at(-1).eventType, "change");
  assert.deepEqual(comboboxOpenChanges, [
    { open: true, eventType: "focus", key: undefined },
    { open: true, eventType: "change", key: undefined },
  ]);

  fireEvent.click(getComboboxRole("option", { name: /ana sosa/i }));
  await waitFor(() => assert.equal(comboboxInput.value, "Ana Sosa"));
  assert.equal(comboboxChanges.at(-1).value, "ana");
  assert.deepEqual(comboboxChanges.at(-1).meta, { label: "Ana Sosa", meta: "Driver", inputValue: "Ana Sosa" });
  assert.equal(comboboxChanges.at(-1).eventType, "click");
  assert.deepEqual(comboboxOpenChanges.at(-1), { open: false, eventType: "click", key: undefined });

  fireEvent.click(getComboboxRole("button", { name: /clear driver/i }));
  await waitFor(() => assert.equal(comboboxInput.value, ""));
  assert.equal(comboboxChanges.at(-1).value, "");
  assert.deepEqual(comboboxChanges.at(-1).meta, { label: "", meta: "", inputValue: "", cleared: true });
  assert.equal(comboboxChanges.at(-1).eventType, "click");
  assert.deepEqual(comboboxOpenChanges.at(-1), { open: true, eventType: "click", key: undefined });

  rerenderCombobox(React.createElement(Combobox, {
    label: "Driver",
    optionsLabel: "Driver options",
    clearSelectionLabel: "Clear driver",
    value: "luis",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onValueChange: (value, meta, event) => comboboxChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => comboboxOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(comboboxInput.value, "Luis Perez"));
  fireEvent.focus(comboboxInput);
  fireEvent.input(comboboxInput, { target: { value: "Ana" } });
  assert.equal(comboboxInput.value, "Ana");
  fireEvent.click(getComboboxRole("option", { name: /ana sosa/i }));
  assert.deepEqual(comboboxChanges.at(-1), { value: "ana", meta: { label: "Ana Sosa", meta: "Driver", inputValue: "Ana Sosa" }, eventType: "click" });
  await waitFor(() => assert.equal(comboboxInput.value, "Luis Perez"));
  rerenderCombobox(React.createElement(Combobox, {
    label: "Driver",
    optionsLabel: "Driver options",
    clearSelectionLabel: "Clear driver",
    value: "ana",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onValueChange: (value, meta, event) => comboboxChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => comboboxOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(comboboxInput.value, "Ana Sosa"));

  rerenderCombobox(React.createElement(Combobox, {
    label: "Driver",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    open: true,
  }));
  await waitFor(() => assert.equal(comboboxInput.getAttribute("aria-expanded"), "true"));
  rerenderCombobox(React.createElement(Combobox, {
    label: "Driver",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    open: false,
  }));
  await waitFor(() => assert.equal(comboboxInput.getAttribute("aria-expanded"), "false"));

  cleanup();

  const comboboxInputEvents = [];
  const { getByRole: getNativeComboboxRole } = render(React.createElement(Combobox, {
    label: "Native driver",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onFocus: (event) => comboboxInputEvents.push(event.type),
    onKeyDown: (event) => comboboxInputEvents.push(event.key),
  }));

  const nativeComboboxInput = getNativeComboboxRole("combobox", { name: /native driver/i });
  fireEvent.focus(nativeComboboxInput);
  fireEvent.keyDown(nativeComboboxInput, { key: "Escape" });
  assert.deepEqual(comboboxInputEvents, ["focus", "Escape"]);
  assert.equal(nativeComboboxInput.getAttribute("aria-expanded"), "false");

  cleanup();

  const preventedComboboxInputEvents = [];
  const { getByRole: getPreventedComboboxRole } = render(React.createElement(Combobox, {
    label: "Prevented driver",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onFocus: (event) => {
      preventedComboboxInputEvents.push(event.type);
      event.preventDefault();
    },
    onKeyDown: (event) => {
      preventedComboboxInputEvents.push(event.key);
      event.preventDefault();
    },
  }));

  const preventedComboboxInput = getPreventedComboboxRole("combobox", { name: /prevented driver/i });
  fireEvent.focus(preventedComboboxInput);
  fireEvent.keyDown(preventedComboboxInput, { key: "ArrowDown" });
  assert.deepEqual(preventedComboboxInputEvents, ["focus", "ArrowDown"]);
  assert.equal(preventedComboboxInput.getAttribute("aria-expanded"), "false");

  cleanup();

  const countryChanges = [];
  const countryOpenChanges = [];
  const countries = [
    { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
    { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  ];
  const { getByRole: getCountryRole, rerender: rerenderCountrySelector } = render(React.createElement(CountrySelector, {
    label: "Country",
    countries,
    onValueChange: (countryCode, option, event) => countryChanges.push({ countryCode, option, eventType: event.type }),
    onOpenChange: (open, event) => countryOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const countryTrigger = getCountryRole("combobox", { name: /country/i });
  assert.equal(countryTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(countryTrigger);
  assert.equal(countryTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(countryOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  fireEvent.click(getCountryRole("option", { name: /united states/i }));
  await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "false"));
  assert.equal(countryChanges.at(-1).countryCode, "US");
  assert.equal(countryChanges.at(-1).option.label, "United States");
  assert.equal(countryChanges.at(-1).option.callingCode, "+1");
  assert.equal(countryChanges.at(-1).eventType, "click");
  assert.deepEqual(countryOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  rerenderCountrySelector(React.createElement(CountrySelector, {
    label: "Country",
    value: "MX",
    countries,
    onValueChange: (countryCode, option, event) => countryChanges.push({ countryCode, option, eventType: event.type }),
    onOpenChange: (open, event) => countryOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(countryTrigger.textContent.includes("+52"), true));
  fireEvent.click(countryTrigger);
  fireEvent.click(getCountryRole("option", { name: /united states/i }));
  assert.equal(countryChanges.at(-1).countryCode, "US");
  await waitFor(() => assert.equal(countryTrigger.textContent.includes("+52"), true));
  rerenderCountrySelector(React.createElement(CountrySelector, {
    label: "Country",
    value: "US",
    countries,
    onValueChange: (countryCode, option, event) => countryChanges.push({ countryCode, option, eventType: event.type }),
    onOpenChange: (open, event) => countryOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(countryTrigger.textContent.includes("+1"), true));

  rerenderCountrySelector(React.createElement(CountrySelector, {
    label: "Country",
    countries,
    open: true,
  }));
  await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "true"));
  rerenderCountrySelector(React.createElement(CountrySelector, {
    label: "Country",
    countries,
    open: false,
  }));
  await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const dateValues = [];
  const dateOpenChanges = [];
  const { getByRole: getDateRole, rerender: rerenderDatePicker } = render(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-13",
    locale: "es-MX",
    min: "2026-07-01",
    max: "2026-07-31",
    onValueChange: (value, event) => dateValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const dateTrigger = getDateRole("button", { name: /service date/i });
  assert.equal(dateTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(dateTrigger);
  assert.equal(dateTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(dateOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  fireEvent.click(getDateRole("gridcell", { name: /miércoles, 15 de julio de 2026/i }));
  await waitFor(() => assert.equal(dateTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dateValues, [{ value: "2026-07-15", eventType: "click" }]);
  assert.equal(dateTrigger.textContent.includes("13 jul 2026"), true);
  assert.deepEqual(dateOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  rerenderDatePicker(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-20",
    locale: "es-MX",
    min: "2026-07-01",
    max: "2026-07-31",
    onValueChange: (value, event) => dateValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(dateTrigger.textContent.includes("20 jul 2026"), true));

  rerenderDatePicker(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-20",
    locale: "es-MX",
    min: "2026-07-01",
    max: "2026-07-31",
    open: true,
    onValueChange: (value, event) => dateValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(dateTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDatePicker(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-20",
    locale: "es-MX",
    min: "2026-07-01",
    max: "2026-07-31",
    open: false,
    onValueChange: (value, event) => dateValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(dateTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const dateTriggerEvents = [];
  const { getByRole: getNativeDateRole } = render(React.createElement(DatePicker, {
    label: "Native service date",
    value: "2026-07-13",
    locale: "es-MX",
    onClick: (event) => dateTriggerEvents.push(event.type),
    onKeyDown: (event) => dateTriggerEvents.push(event.key),
  }));

  const nativeDateTrigger = getNativeDateRole("button", { name: /native service date/i });
  fireEvent.click(nativeDateTrigger);
  fireEvent.keyDown(nativeDateTrigger, { key: "Escape" });
  assert.deepEqual(dateTriggerEvents, ["click", "Escape"]);
  assert.equal(nativeDateTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const preventedDateTriggerEvents = [];
  const { getByRole: getPreventedDateRole } = render(React.createElement(DatePicker, {
    label: "Prevented service date",
    value: "2026-07-13",
    locale: "es-MX",
    onClick: (event) => {
      preventedDateTriggerEvents.push(event.type);
      event.preventDefault();
    },
    onKeyDown: (event) => {
      preventedDateTriggerEvents.push(event.key);
      event.preventDefault();
    },
  }));

  const preventedDateTrigger = getPreventedDateRole("button", { name: /prevented service date/i });
  fireEvent.click(preventedDateTrigger);
  fireEvent.keyDown(preventedDateTrigger, { key: "ArrowDown" });
  assert.deepEqual(preventedDateTriggerEvents, ["click", "ArrowDown"]);
  assert.equal(preventedDateTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const dateRangeValues = [];
  const dateRangeOpenChanges = [];
  const { getByRole: getDateRangeRole, rerender: rerenderDateRangePicker } = render(React.createElement(DateRangePicker, {
    label: "Service range",
    from: "2026-07-01",
    locale: "es-MX",
    presets: false,
    onValueChange: (value, event) => dateRangeValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateRangeOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const dateRangeTrigger = getDateRangeRole("button", { name: /service range/i });
  fireEvent.click(dateRangeTrigger);
  assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(dateRangeOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  fireEvent.click(getDateRangeRole("gridcell", { name: /miércoles, 15 de julio de 2026/i }));
  await waitFor(() => assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dateRangeValues, [{ value: { from: "2026-07-01", to: "2026-07-15" }, eventType: "click" }]);
  assert.equal(dateRangeTrigger.textContent.includes("01 jul 2026 - ..."), true);
  assert.deepEqual(dateRangeOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  rerenderDateRangePicker(React.createElement(DateRangePicker, {
    label: "Service range",
    value: { from: "2026-07-10", to: "2026-07-20" },
    locale: "es-MX",
    presets: false,
    onValueChange: (value, event) => dateRangeValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateRangeOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(dateRangeTrigger.textContent.includes("10 jul 2026 - 20 jul 2026"), true));

  rerenderDateRangePicker(React.createElement(DateRangePicker, {
    label: "Service range",
    value: { from: "2026-07-10", to: "2026-07-20" },
    locale: "es-MX",
    presets: false,
    open: true,
    onValueChange: (value, event) => dateRangeValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateRangeOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDateRangePicker(React.createElement(DateRangePicker, {
    label: "Service range",
    value: { from: "2026-07-10", to: "2026-07-20" },
    locale: "es-MX",
    presets: false,
    open: false,
    onValueChange: (value, event) => dateRangeValues.push({ value, eventType: event.type }),
    onOpenChange: (open, event) => dateRangeOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const dateRangeTriggerEvents = [];
  const { getByRole: getNativeDateRangeRole } = render(React.createElement(DateRangePicker, {
    label: "Native service range",
    from: "2026-07-01",
    locale: "es-MX",
    presets: false,
    onClick: (event) => dateRangeTriggerEvents.push(event.type),
    onKeyDown: (event) => dateRangeTriggerEvents.push(event.key),
  }));

  const nativeDateRangeTrigger = getNativeDateRangeRole("button", { name: /native service range/i });
  fireEvent.click(nativeDateRangeTrigger);
  fireEvent.keyDown(nativeDateRangeTrigger, { key: "Escape" });
  assert.deepEqual(dateRangeTriggerEvents, ["click", "Escape"]);
  assert.equal(nativeDateRangeTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const preventedDateRangeTriggerEvents = [];
  const { getByRole: getPreventedDateRangeRole } = render(React.createElement(DateRangePicker, {
    label: "Prevented service range",
    from: "2026-07-01",
    locale: "es-MX",
    presets: false,
    onClick: (event) => {
      preventedDateRangeTriggerEvents.push(event.type);
      event.preventDefault();
    },
    onKeyDown: (event) => {
      preventedDateRangeTriggerEvents.push(event.key);
      event.preventDefault();
    },
  }));

  const preventedDateRangeTrigger = getPreventedDateRangeRole("button", { name: /prevented service range/i });
  fireEvent.click(preventedDateRangeTrigger);
  fireEvent.keyDown(preventedDateRangeTrigger, { key: "ArrowDown" });
  assert.deepEqual(preventedDateRangeTriggerEvents, ["click", "ArrowDown"]);
  assert.equal(preventedDateRangeTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const dialogOpenChanges = [];
  const dialogActions = [];
  const dialogActionClicks = [];
  const { getByRole: getDialogRole, rerender: rerenderDialog } = render(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm", onClick: (event) => dialogActionClicks.push(event.type) }],
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key, event) => dialogActions.push({ key, eventType: event.type }),
  }));

  const dialogTrigger = getDialogRole("button", { name: /open review/i });
  fireEvent.click(dialogTrigger);
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getDialogRole("dialog", { name: /confirm route/i }).hidden, false);
  assert.deepEqual(dialogOpenChanges, [{ open: true, eventType: "click" }]);

  fireEvent.click(getDialogRole("button", { name: /confirm/i }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dialogActionClicks, ["click"]);
  assert.deepEqual(dialogActions, [{ key: "confirm", eventType: "click" }]);
  assert.deepEqual(dialogOpenChanges, [{ open: true, eventType: "click" }, { open: false, eventType: "click" }]);

  const preventedDialogActions = [];
  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm", onClick: (event) => event.preventDefault() }],
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => preventedDialogActions.push(key),
  }));
  fireEvent.click(dialogTrigger);
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getDialogRole("button", { name: /confirm/i }));
  assert.deepEqual(preventedDialogActions, []);
  assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true");

  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm" }],
    open: true,
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => dialogActions.push(key),
  }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm" }],
    open: false,
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => dialogActions.push(key),
  }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(dialogTrigger.closest(".dialog").dataset.state, "closed"));
  fireEvent.click(dialogTrigger);
  assert.equal(dialogOpenChanges.at(-1).open, true);
  assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(dialogTrigger.closest(".dialog").dataset.state, "closed");

  cleanup();

  const drawerOpenChanges = [];
  const drawerActions = [];
  const { getByRole: getDrawerRole, rerender: rerenderDrawer } = render(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save" }],
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key, event) => drawerActions.push({ key, eventType: event.type }),
  }));

  const drawerTrigger = getDrawerRole("button", { name: /open details/i });
  fireEvent.click(drawerTrigger);
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getDrawerRole("dialog", { name: /vehicle details/i }).hidden, false);
  assert.deepEqual(drawerOpenChanges, [{ open: true, eventType: "click" }]);

  fireEvent.click(getDrawerRole("button", { name: /save/i }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(drawerActions, [{ key: "save", eventType: "click" }]);
  assert.deepEqual(drawerOpenChanges, [{ open: true, eventType: "click" }, { open: false, eventType: "click" }]);

  const preventedDrawerActions = [];
  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save", onClick: (event) => event.preventDefault() }],
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => preventedDrawerActions.push(key),
  }));
  fireEvent.click(drawerTrigger);
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getDrawerRole("button", { name: /save/i }));
  assert.deepEqual(preventedDrawerActions, []);
  assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true");

  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save" }],
    open: true,
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => drawerActions.push(key),
  }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save" }],
    open: false,
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => drawerActions.push(key),
  }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(drawerTrigger.closest(".drawer").dataset.state, "closed"));
  fireEvent.click(drawerTrigger);
  assert.equal(drawerOpenChanges.at(-1).open, true);
  assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(drawerTrigger.closest(".drawer").dataset.state, "closed");

  cleanup();

  const emptyStateActions = [];
  const emptyStateClicks = [];
  const { getByRole: getEmptyStateRole } = render(React.createElement(EmptyState, {
    title: "No vehicles match",
    action: {
      key: "clear-filters",
      label: "Clear filters",
      onClick: (event) => emptyStateClicks.push(event.type),
    },
    onAction: (key, event) => emptyStateActions.push({ key, eventType: event.type }),
  }));

  fireEvent.click(getEmptyStateRole("button", { name: /clear filters/i }));
  assert.deepEqual(emptyStateClicks, ["click"]);
  assert.deepEqual(emptyStateActions, [{ key: "clear-filters", eventType: "click" }]);

  cleanup();

  const preventedEmptyStateActions = [];
  const { getByRole: getPreventedEmptyStateRole } = render(React.createElement(EmptyState, {
    title: "No vehicles match",
    action: {
      key: "clear-filters",
      label: "Clear filters",
      onClick: (event) => event.preventDefault(),
    },
    onAction: (key) => preventedEmptyStateActions.push(key),
  }));

  fireEvent.click(getPreventedEmptyStateRole("button", { name: /clear filters/i }));
  assert.deepEqual(preventedEmptyStateActions, []);

  cleanup();

  const errorPanelActions = [];
  const errorPanelClicks = [];
  const { getByRole: getErrorPanelRole } = render(React.createElement(ErrorPanel, {
    label: "Sync failed",
    action: {
      key: "retry",
      label: "Retry",
      onClick: (event) => errorPanelClicks.push(event.type),
    },
    onAction: (key, event) => errorPanelActions.push({ key, eventType: event.type }),
  }));

  fireEvent.click(getErrorPanelRole("button", { name: /retry/i }));
  assert.deepEqual(errorPanelClicks, ["click"]);
  assert.deepEqual(errorPanelActions, [{ key: "retry", eventType: "click" }]);

  cleanup();

  const preventedErrorPanelActions = [];
  const { getByRole: getPreventedErrorPanelRole } = render(React.createElement(ErrorPanel, {
    label: "Sync failed",
    action: {
      key: "retry",
      label: "Retry",
      onClick: (event) => event.preventDefault(),
    },
    onAction: (key) => preventedErrorPanelActions.push(key),
  }));

  fireEvent.click(getPreventedErrorPanelRole("button", { name: /retry/i }));
  assert.deepEqual(preventedErrorPanelActions, []);

  cleanup();

  const inputChanges = [];
  const { getByLabelText: getInputLabel, rerender: rerenderInput } = render(React.createElement(Input, {
    label: "Amount",
    variant: "currency",
    onValueChange: (value, meta, event) => inputChanges.push({ value, meta, eventType: event.type }),
  }));

  const amountInput = getInputLabel(/amount/i);
  fireEvent.input(amountInput, { target: { value: "$1,234.50" } });
  assert.equal(inputChanges.at(-1).value, "1234.50");
  assert.equal(inputChanges.at(-1).meta.numericValue, 1234.5);
  assert.equal(inputChanges.at(-1).meta.displayValue, "$1,234.50");
  assert.equal(inputChanges.at(-1).meta.rawValue, "$1,234.50");
  assert.equal(inputChanges.at(-1).eventType, "change");

  rerenderInput(React.createElement(Input, {
    label: "Amount",
    variant: "currency",
    value: "9876.5",
    onValueChange: (value, meta, event) => inputChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(amountInput.value, "9,876.50"));
  fireEvent.input(amountInput, { target: { value: "10.00" } });
  assert.equal(inputChanges.at(-1).value, "10.00");
  await waitFor(() => assert.equal(amountInput.value, "9,876.50"));
  rerenderInput(React.createElement(Input, {
    label: "Amount",
    variant: "currency",
    value: "10",
    onValueChange: (value, meta, event) => inputChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(amountInput.value, "10.00"));

  cleanup();

  const inputAmountChanges = [];
  const { getByLabelText: getInputAmountLabel, rerender: rerenderInputAmount } = render(React.createElement(InputAmount, {
    label: "Limit amount",
    currency: "USD",
    locale: "en-US",
    onValueChange: (value, meta, event) => inputAmountChanges.push({ value, meta, eventType: event.type }),
  }));

  const limitAmountInput = getInputAmountLabel(/limit amount/i);
  fireEvent.input(limitAmountInput, { target: { value: "$2,450.75" } });
  assert.equal(inputAmountChanges.at(-1).value, "2450.75");
  assert.equal(inputAmountChanges.at(-1).meta.numericValue, 2450.75);
  assert.equal(inputAmountChanges.at(-1).meta.currency, "USD");
  assert.equal(inputAmountChanges.at(-1).meta.formatted, "$2,450.75");
  assert.equal(inputAmountChanges.at(-1).eventType, "change");

  rerenderInputAmount(React.createElement(InputAmount, {
    label: "Limit amount",
    currency: "MXN",
    value: "3000",
    onValueChange: (value, meta, event) => inputAmountChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(limitAmountInput.value, "3000"));
  fireEvent.input(limitAmountInput, { target: { value: "50" } });
  assert.equal(inputAmountChanges.at(-1).value, "50");
  await waitFor(() => assert.equal(limitAmountInput.value, "3000"));

  cleanup();

  const inputRevealChanges = [];
  const { getByLabelText: getPasswordLabel, getByRole: getPasswordRole, rerender: rerenderPasswordInput } = render(React.createElement(Input, {
    label: "Password",
    variant: "password",
    value: "secret",
    revealLabel: "Reveal secret",
    hideLabel: "Conceal secret",
    onRevealChange: (revealed, event) => inputRevealChanges.push({ revealed, eventType: event.type }),
  }));

  const passwordInput = getPasswordLabel(/password/i);
  assert.equal(passwordInput.type, "password");
  const revealPasswordButton = getPasswordRole("button", { name: /reveal secret/i });
  fireEvent.click(revealPasswordButton);
  await waitFor(() => assert.equal(passwordInput.type, "text"));
  assert.equal(revealPasswordButton.getAttribute("aria-pressed"), "true");
  assert.deepEqual(inputRevealChanges, [{ revealed: true, eventType: "click" }]);

  rerenderPasswordInput(React.createElement(Input, {
    label: "Password",
    variant: "password",
    value: "secret",
    revealed: false,
    revealLabel: "Reveal secret",
    hideLabel: "Conceal secret",
    onRevealChange: (revealed, event) => inputRevealChanges.push({ revealed, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(passwordInput.type, "password"));
  fireEvent.click(getPasswordRole("button", { name: /reveal secret/i }));
  assert.deepEqual(inputRevealChanges.at(-1), { revealed: true, eventType: "click" });
  assert.equal(passwordInput.type, "password");
  rerenderPasswordInput(React.createElement(Input, {
    label: "Password",
    variant: "password",
    value: "secret",
    revealed: true,
    revealLabel: "Reveal secret",
    hideLabel: "Conceal secret",
    onRevealChange: (revealed, event) => inputRevealChanges.push({ revealed, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(passwordInput.type, "text"));

  cleanup();

  const menuOpenChanges = [];
  const menuSelections = [];
  const { getByRole: getMenuRole, rerender: rerenderMenu } = render(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    onOpenChange: (open, event) => menuOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
    onSelect: (item, event) => menuSelections.push({ key: item.key, eventType: event.type }),
  }));

  const menuTrigger = getMenuRole("button", { name: /actions/i });
  assert.equal(menuTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(menuTrigger);
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(menuOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  const archiveItem = getMenuRole("menuitem", { name: /archive/i });
  fireEvent.click(archiveItem);
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(menuSelections, [{ key: "archive", eventType: "click" }]);
  assert.deepEqual(menuOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  fireEvent.keyDown(menuTrigger, { key: "ArrowDown" });
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.keyDown(getMenuRole("menu", { name: /row actions/i }), { key: "Escape" });
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(menuOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
    { open: true, eventType: "keydown", key: "ArrowDown" },
    { open: false, eventType: "keydown", key: "Escape" },
  ]);

  rerenderMenu(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    open: true,
    onOpenChange: (open, event) => menuOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
    onSelect: (item, event) => menuSelections.push({ key: item.key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));

  rerenderMenu(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    open: false,
    onOpenChange: (open, event) => menuOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
    onSelect: (item, event) => menuSelections.push({ key: item.key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(menuTrigger.closest(".menu").dataset.state, "default"));
  fireEvent.click(menuTrigger);
  assert.equal(menuOpenChanges.at(-1).open, true);
  assert.equal(menuTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(menuTrigger.closest(".menu").dataset.state, "default");

  cleanup();

  const preventedMenuOpenChanges = [];
  const preventedMenuSelections = [];
  const preventedMenuClicks = [];
  const { getByRole: getPreventedMenuRole } = render(React.createElement(Menu, {
    label: "Prevented actions",
    triggerLabel: "More actions",
    items: [
      {
        key: "archive",
        label: "Archive",
        onClick: (event) => {
          preventedMenuClicks.push(event.type);
          event.preventDefault();
        },
      },
    ],
    onOpenChange: (open, event) => preventedMenuOpenChanges.push({ open, eventType: event?.type }),
    onSelect: (item) => preventedMenuSelections.push(item.key),
  }));

  const preventedMenuTrigger = getPreventedMenuRole("button", { name: /more actions/i });
  fireEvent.click(preventedMenuTrigger);
  await waitFor(() => assert.equal(preventedMenuTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getPreventedMenuRole("menuitem", { name: /archive/i }));
  assert.deepEqual(preventedMenuClicks, ["click"]);
  assert.deepEqual(preventedMenuSelections, []);
  assert.equal(preventedMenuTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(preventedMenuOpenChanges, [{ open: true, eventType: "click" }]);

  cleanup();

  const selectedMovements = [];
  const movementClicks = [];
  const { getByRole: getMovementRole, rerender: rerenderMovement } = render(React.createElement(MovementRow, {
    label: "Fuel charge",
    meta: "Station 24",
    amount: "-$42.00",
    status: "Pending",
    category: "fuel",
    variant: "standard",
    onClick: (event) => movementClicks.push(event.type),
    onSelect: (meta, event) => selectedMovements.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getMovementRole("button", { name: /fuel charge/i }));
  assert.equal(movementClicks.length, 1);
  assert.equal(selectedMovements.length, 1);
  assert.equal(selectedMovements[0].meta.label, "Fuel charge");
  assert.equal(selectedMovements[0].meta.status, "Pending");
  assert.equal(selectedMovements[0].meta.category, "fuel");
  assert.equal(selectedMovements[0].meta.state, "default");
  assert.equal(selectedMovements[0].eventType, "click");

  rerenderMovement(React.createElement(MovementRow, {
    label: "Fuel charge",
    disabled: true,
    onClick: (event) => movementClicks.push(event.type),
    onSelect: (meta, event) => selectedMovements.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getMovementRole("button", { name: /fuel charge/i }));
  assert.equal(movementClicks.length, 1);
  assert.equal(selectedMovements.length, 1);

  cleanup();

  const preventedMovements = [];
  const { getByRole: getPreventedMovementRole } = render(React.createElement(MovementRow, {
    label: "Refund",
    onClick: (event) => event.preventDefault(),
    onSelect: (meta) => preventedMovements.push(meta),
  }));

  fireEvent.click(getPreventedMovementRole("button", { name: /refund/i }));
  assert.deepEqual(preventedMovements, []);

  cleanup();

  const pageChanges = [];
  const { getByRole: getPaginationRole, rerender: rerenderPagination } = render(React.createElement(Pagination, {
    pageCount: 12,
    label: "Results pages",
    previousLabel: "Previous results page",
    nextLabel: "Next results page",
    getPageLabel: (page) => `Results page ${page}`,
    onPageChange: (page, event) => pageChanges.push({ page, eventType: event.type }),
  }));

  const pageOneButton = getPaginationRole("button", { name: /^results page 1$/i });
  assert.equal(pageOneButton.getAttribute("aria-current"), "page");

  fireEvent.click(getPaginationRole("button", { name: /next results page/i }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /^results page 2$/i }).getAttribute("aria-current"), "page"));
  assert.deepEqual(pageChanges, [{ page: 2, eventType: "click" }]);

  fireEvent.click(getPaginationRole("button", { name: /next results page/i }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /^results page 3$/i }).getAttribute("aria-current"), "page"));
  assert.deepEqual(pageChanges, [{ page: 2, eventType: "click" }, { page: 3, eventType: "click" }]);

  rerenderPagination(React.createElement(Pagination, {
    page: 5,
    pageCount: 12,
    label: "Results pages",
    previousLabel: "Previous results page",
    nextLabel: "Next results page",
    getPageLabel: (page) => `Results page ${page}`,
    disabled: true,
    onPageChange: (page, event) => pageChanges.push({ page, eventType: event.type }),
  }));

  await waitFor(() => assert.equal(getPaginationRole("button", { name: /^results page 5$/i }).getAttribute("aria-current"), "page"));
  fireEvent.click(getPaginationRole("button", { name: /results page 6/i }));
  assert.deepEqual(pageChanges, [{ page: 2, eventType: "click" }, { page: 3, eventType: "click" }]);

  rerenderPagination(React.createElement(Pagination, {
    page: 5,
    pageCount: 12,
    label: "Results pages",
    previousLabel: "Previous results page",
    nextLabel: "Next results page",
    getPageLabel: (page) => `Results page ${page}`,
    onPageChange: (page, event) => pageChanges.push({ page, eventType: event.type }),
  }));
  fireEvent.click(getPaginationRole("button", { name: /results page 6/i }));
  assert.deepEqual(pageChanges.at(-1), { page: 6, eventType: "click" });
  assert.equal(getPaginationRole("button", { name: /^results page 5$/i }).getAttribute("aria-current"), "page");
  rerenderPagination(React.createElement(Pagination, {
    page: 6,
    pageCount: 12,
    label: "Results pages",
    previousLabel: "Previous results page",
    nextLabel: "Next results page",
    getPageLabel: (page) => `Results page ${page}`,
    onPageChange: (page, event) => pageChanges.push({ page, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /^results page 6$/i }).getAttribute("aria-current"), "page"));

  cleanup();

  const phoneChanges = [];
  const phoneCountries = [
    { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
    { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  ];
  const { getByLabelText: getPhoneLabel, getByRole: getPhoneRole, rerender: rerenderPhoneInput } = render(React.createElement(PhoneInput, {
    label: "Phone number",
    country: "MX",
    countries: phoneCountries,
    onValueChange: (value, meta, event) => phoneChanges.push({ value, meta, eventType: event.type }),
  }));

  const phoneInput = getPhoneLabel(/phone number/i, { selector: "input" });
  fireEvent.input(phoneInput, { target: { value: "5512345678" } });
  await waitFor(() => assert.equal(phoneInput.value, "55 1234 5678"));
  assert.equal(phoneChanges.at(-1).value, "5512345678");
  assert.deepEqual(phoneChanges.at(-1).meta, {
    country: "MX",
    callingCode: "+52",
    e164: "+525512345678",
    nationalNumber: "5512345678",
  });
  assert.equal(phoneChanges.at(-1).eventType, "change");

  const phoneCountryTrigger = getPhoneRole("combobox", { name: /phone number/i });
  fireEvent.click(phoneCountryTrigger);
  assert.equal(phoneCountryTrigger.getAttribute("aria-expanded"), "true");
  fireEvent.click(getPhoneRole("option", { name: /united states/i }));
  await waitFor(() => assert.equal(phoneCountryTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(phoneChanges.at(-1).meta, {
    country: "US",
    callingCode: "+1",
    e164: "+15512345678",
    nationalNumber: "5512345678",
  });
  assert.equal(phoneChanges.at(-1).eventType, "click");

  rerenderPhoneInput(React.createElement(PhoneInput, {
    label: "Phone number",
    value: "+525598765432",
    country: "MX",
    countries: phoneCountries,
    onValueChange: (value, meta, event) => phoneChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(phoneInput.value, "55 9876 5432"));
  await waitFor(() => assert.equal(phoneCountryTrigger.textContent.includes("+52"), true));
  fireEvent.input(phoneInput, { target: { value: "5511112222" } });
  assert.equal(phoneChanges.at(-1).value, "5511112222");
  await waitFor(() => assert.equal(phoneInput.value, "55 9876 5432"));
  rerenderPhoneInput(React.createElement(PhoneInput, {
    label: "Phone number",
    value: "+525511112222",
    country: "MX",
    countries: phoneCountries,
    onValueChange: (value, meta, event) => phoneChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(phoneInput.value, "55 1111 2222"));
  fireEvent.click(phoneCountryTrigger);
  fireEvent.click(getPhoneRole("option", { name: /united states/i }));
  assert.deepEqual(phoneChanges.at(-1).meta, {
    country: "US",
    callingCode: "+1",
    e164: "+15511112222",
    nationalNumber: "5511112222",
  });
  await waitFor(() => assert.equal(phoneCountryTrigger.textContent.includes("+52"), true));

  cleanup();

  const popoverOpenChanges = [];
  const popoverActions = [];
  const { getByRole: getPopoverRole, rerender: rerenderPopover } = render(React.createElement(Popover, {
    triggerLabel: "Open filters",
    title: "Filter routes",
    description: "Adjust visible routes.",
    variant: "action",
    actions: [{ key: "apply", label: "Apply", variant: "primary" }],
    onOpenChange: (open, event) => popoverOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key, event) => popoverActions.push({ key, eventType: event.type }),
  }));

  const popoverTrigger = getPopoverRole("button", { name: /open filters/i });
  assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(popoverTrigger);
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getPopoverRole("dialog", { name: /filter routes/i }).hidden, false);
  assert.deepEqual(popoverOpenChanges, [{ open: true, eventType: "click" }]);

  fireEvent.click(getPopoverRole("button", { name: /apply/i }));
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(popoverActions, [{ key: "apply", eventType: "click" }]);
  assert.deepEqual(popoverOpenChanges, [{ open: true, eventType: "click" }, { open: false, eventType: "click" }]);

  const preventedPopoverActions = [];
  rerenderPopover(React.createElement(Popover, {
    triggerLabel: "Open filters",
    title: "Filter routes",
    description: "Adjust visible routes.",
    variant: "action",
    actions: [{ key: "apply", label: "Apply", variant: "primary", onClick: (event) => event.preventDefault() }],
    onOpenChange: (open, event) => popoverOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => preventedPopoverActions.push(key),
  }));
  fireEvent.click(popoverTrigger);
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getPopoverRole("button", { name: /apply/i }));
  assert.deepEqual(preventedPopoverActions, []);
  assert.equal(popoverTrigger.getAttribute("aria-expanded"), "true");

  rerenderPopover(React.createElement(Popover, {
    triggerLabel: "Open filters",
    title: "Filter routes",
    description: "Adjust visible routes.",
    variant: "action",
    actions: [{ key: "apply", label: "Apply", variant: "primary" }],
    open: true,
    onOpenChange: (open, event) => popoverOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => popoverActions.push(key),
  }));
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "true"));

  rerenderPopover(React.createElement(Popover, {
    triggerLabel: "Open filters",
    title: "Filter routes",
    description: "Adjust visible routes.",
    variant: "action",
    actions: [{ key: "apply", label: "Apply", variant: "primary" }],
    open: false,
    onOpenChange: (open, event) => popoverOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => popoverActions.push(key),
  }));
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(popoverTrigger.closest(".popover").dataset.state, "default"));

  fireEvent.click(popoverTrigger);
  await waitFor(() => assert.deepEqual(popoverOpenChanges, [
    { open: true, eventType: "click" },
    { open: false, eventType: "click" },
    { open: true, eventType: "click" },
    { open: true, eventType: "click" },
  ]));
  assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(popoverTrigger.closest(".popover").dataset.state, "default");

  cleanup();

  const quickActions = [];
  const quickActionClicks = [];
  const { getByRole: getQuickActionRole, rerender: rerenderQuickAction } = render(React.createElement(QuickAction, {
    label: "Scan card",
    icon: "qr_code_scanner",
    tone: "danger",
    onClick: (event) => quickActionClicks.push(event.type),
    onAction: (meta, event) => quickActions.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getQuickActionRole("button", { name: /scan card/i }));
  assert.deepEqual(quickActionClicks, ["click"]);
  assert.deepEqual(quickActions, [{ meta: { label: "Scan card", variant: "destructive", state: "default" }, eventType: "click" }]);

  rerenderQuickAction(React.createElement(QuickAction, {
    label: "Scan card",
    icon: "qr_code_scanner",
    loading: true,
    onClick: (event) => quickActionClicks.push(event.type),
    onAction: (meta, event) => quickActions.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getQuickActionRole("button", { name: /scan card/i }));
  assert.deepEqual(quickActionClicks, ["click"]);
  assert.deepEqual(quickActions, [{ meta: { label: "Scan card", variant: "destructive", state: "default" }, eventType: "click" }]);

  cleanup();

  const preventedQuickActions = [];
  const { getByRole: getPreventedQuickActionRole } = render(React.createElement(QuickAction, {
    label: "Prevent scan",
    icon: "qr_code_scanner",
    onClick: (event) => event.preventDefault(),
    onAction: (meta) => preventedQuickActions.push(meta),
  }));

  fireEvent.click(getPreventedQuickActionRole("button", { name: /prevent scan/i }));
  assert.deepEqual(preventedQuickActions, []);

  cleanup();

  const radioChanges = [];
  const { getByLabelText: getRadioLabel, rerender: rerenderRadio } = render(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));

  const radioInput = getRadioLabel(/card payment/i);
  assert.equal(radioInput.checked, false);
  fireEvent.click(radioInput);
  await waitFor(() => assert.equal(radioInput.checked, true));
  assert.deepEqual(radioChanges, [{ checked: true, meta: { value: "card" }, eventType: "change" }]);

  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: false,
    disabled: true,
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));

  await waitFor(() => assert.equal(radioInput.checked, false));
  fireEvent.click(getRadioLabel(/card payment/i));
  assert.deepEqual(radioChanges, [{ checked: true, meta: { value: "card" }, eventType: "change" }]);
  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: false,
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));
  fireEvent.click(radioInput);
  assert.deepEqual(radioChanges.at(-1), { checked: true, meta: { value: "card" }, eventType: "change" });
  await waitFor(() => assert.equal(radioInput.checked, false));
  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: true,
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(radioInput.checked, true));

  cleanup();

  const routeClicks = [];
  const routeActions = [];
  const { container: routeContainer, getByRole: getRouteRole } = render(React.createElement(RouteSummary, {
    label: "Route 24",
    description: "Centro to Norte",
    metrics: [{ label: "ETA", value: "18 min" }],
    actions: [{ key: "assign", label: "Assign", onAction: (...args) => routeActions.push(args) }],
    onClick: (event) => routeClicks.push(event.type),
  }));

  const routeSummary = routeContainer.querySelector(".route-summary");
  fireEvent.click(routeSummary);
  assert.deepEqual(routeClicks, ["click"]);

  fireEvent.click(getRouteRole("button", { name: /assign/i }));
  assert.equal(routeActions.length, 1);
  assert.equal(routeActions[0][0], "assign");
  assert.equal(routeActions[0][1].label, "Assign");
  assert.equal(routeActions[0][2].type, "click");
  assert.deepEqual(routeClicks, ["click"]);

  cleanup();

  const preventedRouteActions = [];
  const { getByRole: getPreventedRouteRole } = render(React.createElement(RouteSummary, {
    label: "Route 25",
    metrics: [{ key: "eta", label: "ETA", value: "22 min" }],
    actions: [{
      key: "assign",
      label: "Assign",
      onClick: (event) => event.preventDefault(),
      onAction: (...args) => preventedRouteActions.push(args),
    }],
  }));

  fireEvent.click(getPreventedRouteRole("button", { name: /assign/i }));
  assert.deepEqual(preventedRouteActions, []);

  cleanup();

  const kpiClicks = [];
  const kpiSelections = [];
  const { getByRole: getKpiRole } = render(React.createElement(KpiTile, {
    label: "Cards at risk",
    value: "18",
    variant: "drill-in",
    onClick: (event) => kpiClicks.push(event.type),
    onSelect: (meta, event) => kpiSelections.push({ meta, eventType: event.type }),
  }));

  const kpiTile = getKpiRole("button", { name: /cards at risk 18/i });
  fireEvent.click(kpiTile);
  assert.deepEqual(kpiClicks, ["click"]);
  assert.deepEqual(kpiSelections, [{ meta: { label: "Cards at risk", value: "18", delta: "", tone: "neutral", variant: "drill-in" }, eventType: "click" }]);

  cleanup();

  const listSelections = [];
  const { getByRole: getListRole, rerender: rerenderList } = render(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key, event) => listSelections.push({ key, eventType: event.type }),
  }));

  const documentsRow = getListRole("button", { name: /documents/i });
  const fuelRow = getListRole("button", { name: /fuel card/i });
  assert.equal(documentsRow.getAttribute("aria-current"), null);
  fireEvent.click(documentsRow);
  await waitFor(() => assert.equal(documentsRow.getAttribute("aria-current"), "true"));
  assert.deepEqual(listSelections, [{ key: "docs", eventType: "click" }]);

  rerenderList(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    selectedKey: "fuel",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key, event) => listSelections.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(fuelRow.getAttribute("aria-current"), "true"));
  assert.equal(documentsRow.getAttribute("aria-current"), null);
  fireEvent.click(documentsRow);
  assert.deepEqual(listSelections.at(-1), { key: "docs", eventType: "click" });
  assert.equal(documentsRow.getAttribute("aria-current"), null);
  rerenderList(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    selectedKey: "docs",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key, event) => listSelections.push({ key, eventType: event.type }),
  }));
  assert.equal(documentsRow.getAttribute("aria-current"), "true");
  assert.equal(fuelRow.getAttribute("aria-current"), null);

  cleanup();

  const preventedListSelections = [];
  const preventedListClicks = [];
  const { getByRole: getPreventedListRole } = render(React.createElement(List, {
    label: "Prevented tasks",
    variant: "action",
    items: [
      {
        key: "docs",
        label: "Documents",
        onClick: (event) => {
          preventedListClicks.push(event.type);
          event.preventDefault();
        },
      },
    ],
    onSelect: (key) => preventedListSelections.push(key),
  }));

  const preventedDocumentsRow = getPreventedListRole("button", { name: /documents/i });
  fireEvent.click(preventedDocumentsRow);
  assert.deepEqual(preventedListClicks, ["click"]);
  assert.equal(preventedDocumentsRow.getAttribute("aria-current"), null);
  assert.deepEqual(preventedListSelections, []);

  cleanup();

  const segmentChanges = [];
  const { getByRole: getSegmentRole, rerender: rerenderSegmentedControl } = render(React.createElement(SegmentedControl, {
    label: "View mode",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key, event) => segmentChanges.push({ key, eventType: event.type }),
  }));

  const listSegment = getSegmentRole("tab", { name: /list/i });
  const timelineSegment = getSegmentRole("tab", { name: /timeline/i });
  assert.equal(listSegment.getAttribute("aria-selected"), "true");
  fireEvent.click(timelineSegment);
  await waitFor(() => assert.equal(timelineSegment.getAttribute("aria-selected"), "true"));
  assert.deepEqual(segmentChanges, [{ key: "timeline", eventType: "click" }]);

  fireEvent.keyDown(listSegment, { key: "ArrowRight" });
  assert.deepEqual(segmentChanges, [{ key: "timeline", eventType: "click" }, { key: "list", eventType: "keydown" }]);

  rerenderSegmentedControl(React.createElement(SegmentedControl, {
    label: "View mode",
    selectedKey: "list",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key, event) => segmentChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(listSegment.getAttribute("aria-selected"), "true"));
  fireEvent.click(timelineSegment);
  assert.deepEqual(segmentChanges.at(-1), { key: "timeline", eventType: "click" });
  assert.equal(timelineSegment.getAttribute("aria-selected"), "false");
  rerenderSegmentedControl(React.createElement(SegmentedControl, {
    label: "View mode",
    selectedKey: "timeline",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key, event) => segmentChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(timelineSegment.getAttribute("aria-selected"), "true"));

  cleanup();

  const preventedSegmentChanges = [];
  const preventedSegmentEvents = [];
  const { getByRole: getPreventedSegmentRole } = render(React.createElement(SegmentedControl, {
    label: "Prevented view mode",
    items: [
      { key: "list", label: "List" },
      {
        key: "timeline",
        label: "Timeline",
        onClick: (event) => {
          preventedSegmentEvents.push(event.type);
          event.preventDefault();
        },
        onKeyDown: (event) => {
          preventedSegmentEvents.push(event.key);
          event.preventDefault();
        },
      },
    ],
    onValueChange: (key, event) => preventedSegmentChanges.push({ key, eventType: event.type }),
  }));

  const preventedTimelineSegment = getPreventedSegmentRole("tab", { name: /timeline/i });
  fireEvent.click(preventedTimelineSegment);
  fireEvent.keyDown(preventedTimelineSegment, { key: "ArrowLeft" });
  assert.deepEqual(preventedSegmentEvents, ["click", "ArrowLeft"]);
  assert.deepEqual(preventedSegmentChanges, []);

  cleanup();

  const selectChanges = [];
  const selectOpenChanges = [];
  const { getByRole: getSelectRole, rerender: rerenderSelect } = render(React.createElement(Select, {
    label: "Country",
    value: "mx",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta, event) => selectChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const selectTrigger = getSelectRole("combobox", { name: /country/i });
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(selectTrigger);
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(selectOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  fireEvent.click(getSelectRole("option", { name: /canada/i }));
  assert.deepEqual(selectChanges, []);

  fireEvent.click(getSelectRole("option", { name: /united states/i }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(selectChanges, [{ value: "us", meta: { label: "United States", meta: "+1" }, eventType: "click" }]);
  assert.equal(selectTrigger.textContent.includes("Mexico"), true);
  assert.deepEqual(selectOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  rerenderSelect(React.createElement(Select, {
    label: "Country",
    value: "mx",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta, event) => selectChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(selectTrigger.textContent.includes("Mexico"), true));
  rerenderSelect(React.createElement(Select, {
    label: "Country",
    value: "us",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta, event) => selectChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(selectTrigger.textContent.includes("United States"), true));

  rerenderSelect(React.createElement(Select, {
    label: "Country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    open: true,
  }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "true"));
  rerenderSelect(React.createElement(Select, {
    label: "Country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    open: false,
  }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const selectTriggerEvents = [];
  const { getByRole: getNativeSelectRole } = render(React.createElement(Select, {
    label: "Native country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onClick: (event) => selectTriggerEvents.push(event.type),
    onKeyDown: (event) => selectTriggerEvents.push(event.key),
  }));

  const nativeSelectTrigger = getNativeSelectRole("combobox", { name: /native country/i });
  fireEvent.click(nativeSelectTrigger);
  fireEvent.keyDown(nativeSelectTrigger, { key: "Escape" });
  assert.deepEqual(selectTriggerEvents, ["click", "Escape"]);
  assert.equal(nativeSelectTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const preventedSelectTriggerEvents = [];
  const { getByRole: getPreventedSelectRole } = render(React.createElement(Select, {
    label: "Prevented country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onClick: (event) => {
      preventedSelectTriggerEvents.push(event.type);
      event.preventDefault();
    },
    onKeyDown: (event) => {
      preventedSelectTriggerEvents.push(event.key);
      event.preventDefault();
    },
  }));

  const preventedSelectTrigger = getPreventedSelectRole("combobox", { name: /prevented country/i });
  fireEvent.click(preventedSelectTrigger);
  fireEvent.keyDown(preventedSelectTrigger, { key: "ArrowDown" });
  assert.deepEqual(preventedSelectTriggerEvents, ["click", "ArrowDown"]);
  assert.equal(preventedSelectTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const sliderChanges = [];
  const { getByRole: getSliderRole, getByText: getSliderText, rerender: rerenderSlider } = render(React.createElement(Slider, {
    label: "Search radius",
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));

  const sliderInput = getSliderRole("slider", { name: /search radius/i });
  fireEvent.input(sliderInput, { target: { value: "12" } });
  await waitFor(() => assert.equal(sliderInput.value, "12"));
  getSliderText("12 km");
  assert.deepEqual(sliderChanges, [{ value: 12, meta: { name: "radius", min: 0, max: 20, step: 1, unit: " km" }, eventType: "change" }]);

  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 12,
    min: 0,
    max: 20,
    disabled: true,
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));

  fireEvent.input(getSliderRole("slider", { name: /search radius/i }), { target: { value: "14" } });
  assert.equal(sliderChanges.length, 1);
  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 12,
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));
  fireEvent.input(sliderInput, { target: { value: "14" } });
  assert.deepEqual(sliderChanges.at(-1), { value: 14, meta: { name: "radius", min: 0, max: 20, step: 1, unit: " km" }, eventType: "change" });
  await waitFor(() => assert.equal(sliderInput.value, "12"));
  getSliderText("12 km");
  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 14,
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(sliderInput.value, "14"));
  getSliderText("14 km");

  cleanup();

  const stationSelections = [];
  const stationClicks = [];
  const { getByRole: getStationRole, rerender: rerenderStation } = render(React.createElement(StationPin, {
    label: "Station 24",
    value: "Open",
    meta: "2.4 km",
    variant: "ev",
    onClick: (event) => stationClicks.push(event.type),
    onSelect: (meta, event) => stationSelections.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getStationRole("button", { name: /station 24/i }));
  assert.deepEqual(stationClicks, ["click"]);
  assert.deepEqual(stationSelections, [{ meta: { label: "Station 24", value: "Open", variant: "ev", state: "default" }, eventType: "click" }]);

  rerenderStation(React.createElement(StationPin, {
    label: "Station 24",
    value: "Open",
    unavailable: true,
    onClick: (event) => stationClicks.push(event.type),
    onSelect: (meta, event) => stationSelections.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getStationRole("button", { name: /station 24/i }));
  assert.deepEqual(stationClicks, ["click"]);
  assert.deepEqual(stationSelections, [{ meta: { label: "Station 24", value: "Open", variant: "ev", state: "default" }, eventType: "click" }]);

  cleanup();

  const preventedStationSelections = [];
  const { getByRole: getPreventedStationRole } = render(React.createElement(StationPin, {
    label: "Station 25",
    value: "Closed",
    onClick: (event) => event.preventDefault(),
    onSelect: (meta) => preventedStationSelections.push(meta),
  }));

  fireEvent.click(getPreventedStationRole("button", { name: /station 25/i }));
  assert.deepEqual(preventedStationSelections, []);

  cleanup();

  const switchChanges = [];
  const { getByRole: getSwitchRole, rerender: rerenderSwitch } = render(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));

  const switchInput = getSwitchRole("switch", { name: /enable notifications/i });
  assert.equal(switchInput.getAttribute("aria-checked"), "false");
  fireEvent.click(switchInput);
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "true"));
  assert.deepEqual(switchChanges, [{ checked: true, meta: { name: "notifications" }, eventType: "change" }]);

  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: false,
    disabled: true,
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));

  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "false"));
  fireEvent.click(getSwitchRole("switch", { name: /enable notifications/i }));
  assert.equal(switchChanges.length, 1);
  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: false,
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));
  fireEvent.click(switchInput);
  assert.deepEqual(switchChanges.at(-1), { checked: true, meta: { name: "notifications" }, eventType: "change" });
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "false"));
  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: true,
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "true"));

  cleanup();

  const tableColumns = [
    { key: "plate", label: "Plate" },
    { key: "driver", label: "Driver" },
  ];
  const tableRows = [
    { id: "unit-24", plate: "ABC-123", driver: "Ana" },
    { id: "unit-31", plate: "XYZ-789", driver: "Luis" },
  ];
  const rowSelections = [];
  const { container: selectableTableContainer, rerender: rerenderTable } = render(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key, event) => rowSelections.push({ key, eventType: event.type }),
  }));

  fireEvent.click(selectableTableContainer.querySelector('tr[data-key="unit-31"]'));
  assert.deepEqual(rowSelections, [{ key: "unit-31", eventType: "click" }]);
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "true");

  rerenderTable(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    selectedKey: "unit-24",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key, event) => rowSelections.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-24"]').getAttribute("data-selected"), "true"));
  fireEvent.click(selectableTableContainer.querySelector('tr[data-key="unit-31"]'));
  assert.deepEqual(rowSelections.at(-1), { key: "unit-31", eventType: "click" });
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "false");
  rerenderTable(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    selectedKey: "unit-31",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key, event) => rowSelections.push({ key, eventType: event.type }),
  }));
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "true");

  cleanup();

  const sortChanges = [];
  const { getByRole: getSortableTableRole, rerender: rerenderSortableTable } = render(React.createElement(Table, {
    label: "Sortable vehicles",
    variant: "sortable",
    columns: [
      { key: "plate", label: "Plate", sortable: true },
      { key: "driver", label: "Driver", sortable: true },
    ],
    rows: tableRows,
    onSortChange: (sort, event) => sortChanges.push({ sort, eventType: event.type }),
  }));

  fireEvent.click(getSortableTableRole("button", { name: /plate/i }));
  assert.deepEqual(sortChanges, [{ sort: { key: "plate", direction: "ascending" }, eventType: "click" }]);

  rerenderSortableTable(React.createElement(Table, {
    label: "Sortable vehicles",
    variant: "sortable",
    sortKey: "driver",
    sortDir: "descending",
    columns: [
      { key: "plate", label: "Plate", sortable: true },
      { key: "driver", label: "Driver", sortable: true },
    ],
    rows: tableRows,
    onSortChange: (sort, event) => sortChanges.push({ sort, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(getSortableTableRole("columnheader", { name: /driver/i }).getAttribute("aria-sort"), "descending"));
  fireEvent.click(getSortableTableRole("button", { name: /plate/i }));
  assert.deepEqual(sortChanges.at(-1), { sort: { key: "plate", direction: "ascending" }, eventType: "click" });
  assert.equal(getSortableTableRole("columnheader", { name: /plate/i }).getAttribute("aria-sort"), "none");
  rerenderSortableTable(React.createElement(Table, {
    label: "Sortable vehicles",
    variant: "sortable",
    sortKey: "plate",
    sortDir: "ascending",
    columns: [
      { key: "plate", label: "Plate", sortable: true },
      { key: "driver", label: "Driver", sortable: true },
    ],
    rows: tableRows,
    onSortChange: (sort, event) => sortChanges.push({ sort, eventType: event.type }),
  }));
  assert.equal(getSortableTableRole("columnheader", { name: /plate/i }).getAttribute("aria-sort"), "ascending");

  cleanup();

  const expandedRows = [];
  const { getByRole: getTableRole, rerender: rerenderExpandedTable } = render(React.createElement(Table, {
    label: "Vehicle details",
    getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
    variant: "expandable",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key, event) => expandedRows.push({ key, eventType: event.type }),
  }));

  const expandUnit24 = getTableRole("button", { name: /open abc-123/i });
  assert.equal(expandUnit24.getAttribute("aria-expanded"), "false");
  fireEvent.click(expandUnit24);
  await waitFor(() => assert.equal(expandUnit24.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(expandedRows, [{ key: "unit-24", eventType: "click" }]);

  fireEvent.click(expandUnit24);
  await waitFor(() => assert.equal(expandUnit24.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(expandedRows, [{ key: "unit-24", eventType: "click" }, { key: "", eventType: "click" }]);

  rerenderExpandedTable(React.createElement(Table, {
    label: "Vehicle details",
    getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
    variant: "expandable",
    expandedKey: "unit-31",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key, event) => expandedRows.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(getTableRole("button", { name: /close xyz-789/i }).getAttribute("aria-expanded"), "true"));
  fireEvent.click(getTableRole("button", { name: /open abc-123/i }));
  assert.deepEqual(expandedRows.at(-1), { key: "unit-24", eventType: "click" });
  assert.equal(getTableRole("button", { name: /open abc-123/i }).getAttribute("aria-expanded"), "false");
  rerenderExpandedTable(React.createElement(Table, {
    label: "Vehicle details",
    getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
    variant: "expandable",
    expandedKey: "unit-24",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key, event) => expandedRows.push({ key, eventType: event.type }),
  }));
  assert.equal(getTableRole("button", { name: /close abc-123/i }).getAttribute("aria-expanded"), "true");

  cleanup();

  const tabChanges = [];
  const { getByRole: getTabsRole, rerender: rerenderTabs } = render(React.createElement(Tabs, {
    label: "Component sections",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key, event) => tabChanges.push({ key, eventType: event.type }),
  }));

  const overviewTab = getTabsRole("tab", { name: /overview/i });
  const buildTab = getTabsRole("tab", { name: /build/i });
  assert.equal(overviewTab.getAttribute("aria-selected"), "true");
  fireEvent.click(buildTab);
  await waitFor(() => assert.equal(buildTab.getAttribute("aria-selected"), "true"));
  assert.deepEqual(tabChanges, [{ key: "build", eventType: "click" }]);

  fireEvent.keyDown(overviewTab, { key: "ArrowRight" });
  assert.deepEqual(tabChanges, [{ key: "build", eventType: "click" }, { key: "overview", eventType: "keydown" }]);
  const tabsRoot = getTabsRole("tablist", { name: /component sections/i });
  assert.match(tabsRoot.style.getPropertyValue("--comp-tabs-indicator-left"), /px$/);
  assert.match(tabsRoot.style.getPropertyValue("--comp-tabs-indicator-width"), /px$/);

  const preventedTabChanges = [];
  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    items: [
      { key: "overview", label: "Overview" },
      { key: "build", label: "Build", onClick: (event) => event.preventDefault(), onKeyDown: (event) => event.preventDefault() },
    ],
    onValueChange: (key, event) => preventedTabChanges.push({ key, eventType: event.type }),
  }));
  const preventedBuildTab = getTabsRole("tab", { name: /build/i });
  fireEvent.click(preventedBuildTab);
  fireEvent.keyDown(preventedBuildTab, { key: "ArrowLeft" });
  assert.deepEqual(preventedTabChanges, []);

  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    selectedKey: "overview",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key, event) => tabChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(overviewTab.getAttribute("aria-selected"), "true"));
  fireEvent.click(buildTab);
  assert.deepEqual(tabChanges.at(-1), { key: "build", eventType: "click" });
  assert.equal(buildTab.getAttribute("aria-selected"), "false");
  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    selectedKey: "build",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key, event) => tabChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(buildTab.getAttribute("aria-selected"), "true"));

  cleanup();

  const textAreaChanges = [];
  const { getByLabelText: getTextAreaLabel, getByText: getTextAreaText, rerender: rerenderTextArea } = render(React.createElement(TextArea, {
    label: "Notes",
    maxLength: 20,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));

  const notesTextArea = getTextAreaLabel(/notes/i);
  fireEvent.change(notesTextArea, { target: { value: "Route ready" } });
  await waitFor(() => assert.equal(notesTextArea.value, "Route ready"));
  getTextAreaText("11/20");
  assert.deepEqual(textAreaChanges, [{ value: "Route ready", meta: { maxLength: 20, length: 11 }, eventType: "change" }]);

  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Route ready",
    loading: true,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));

  fireEvent.change(getTextAreaLabel(/notes/i), { target: { value: "Blocked" } });
  assert.equal(textAreaChanges.length, 1);

  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Externally updated",
    maxLength: 30,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(notesTextArea.value, "Externally updated"));
  getTextAreaText("18/30");
  fireEvent.change(notesTextArea, { target: { value: "Local draft" } });
  assert.equal(textAreaChanges.at(-1).value, "Local draft");
  await waitFor(() => assert.equal(notesTextArea.value, "Externally updated"));
  getTextAreaText("18/30");
  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Local draft",
    maxLength: 30,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(notesTextArea.value, "Local draft"));
  getTextAreaText("11/30");

  cleanup();

  const toastActions = [];
  const toastDismissals = [];
  const toastDismissChanges = [];
  const { getByRole: getToastRole } = render(React.createElement(Toast, {
    label: "Route saved",
    description: "Changes are available.",
    actionLabel: "Undo",
    dismissible: true,
    dismissLabel: "Dismiss route saved",
    onAction: (event) => toastActions.push(event.type),
    onDismiss: (event) => toastDismissals.push(event.type),
    onDismissChange: (dismissed, event) => toastDismissChanges.push({ dismissed, eventType: event.type }),
  }));

  const toastRegion = getToastRole("status");
  assert.equal(toastRegion.hidden, false);
  fireEvent.click(getToastRole("button", { name: /undo/i }));
  assert.deepEqual(toastActions, ["click"]);

  fireEvent.click(getToastRole("button", { name: /dismiss route saved/i }));
  assert.deepEqual(toastDismissals, ["click"]);
  assert.deepEqual(toastDismissChanges, [{ dismissed: true, eventType: "click" }]);
  assert.equal(toastRegion.hidden, true);

  cleanup();

  const preventedToastDismissals = [];
  const { getByRole: getPreventedToastRole } = render(React.createElement(Toast, {
    label: "Route pending",
    dismissible: true,
    dismissLabel: "Keep route pending",
    onDismiss: (event) => {
      preventedToastDismissals.push(event.type);
      event.preventDefault();
    },
  }));

  const preventedToastRegion = getPreventedToastRole("status");
  fireEvent.click(getPreventedToastRole("button", { name: /keep route pending/i }));
  assert.deepEqual(preventedToastDismissals, ["click"]);
  assert.equal(preventedToastRegion.hidden, false);

  cleanup();

  const controlledToastDismissChanges = [];
  const { getByRole: getControlledToastRole, rerender: rerenderControlledToast } = render(React.createElement(Toast, {
    label: "Route synced",
    dismissible: true,
    dismissLabel: "Dismiss synced route",
    dismissed: false,
    onDismissChange: (dismissed, event) => controlledToastDismissChanges.push({ dismissed, eventType: event.type }),
  }));

  const controlledToastRegion = getControlledToastRole("status");
  fireEvent.click(getControlledToastRole("button", { name: /dismiss synced route/i }));
  assert.deepEqual(controlledToastDismissChanges, [{ dismissed: true, eventType: "click" }]);
  assert.equal(controlledToastRegion.hidden, false);
  rerenderControlledToast(React.createElement(Toast, {
    label: "Route synced",
    dismissible: true,
    dismissLabel: "Dismiss synced route",
    dismissed: true,
    onDismissChange: (dismissed, event) => controlledToastDismissChanges.push({ dismissed, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(controlledToastRegion.hidden, true));

  cleanup();

  const tooltipOpenChanges = [];
  const { getByRole: getTooltipRole, rerender: rerenderTooltip } = render(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    onOpenChange: (open, event) => tooltipOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const tooltipTrigger = getTooltipRole("button", { name: /help/i });
  const tooltipBubble = getTooltipRole("tooltip", { hidden: true });
  assert.equal(tooltipBubble.hidden, true);
  fireEvent.mouseEnter(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));
  assert.deepEqual(tooltipOpenChanges, [{ open: true, eventType: "mouseenter", key: undefined }]);

  fireEvent.mouseLeave(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));
  assert.deepEqual(tooltipOpenChanges, [
    { open: true, eventType: "mouseenter", key: undefined },
    { open: false, eventType: "mouseleave", key: undefined },
  ]);

  fireEvent.focus(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));
  fireEvent.keyDown(tooltipTrigger, { key: "Escape" });
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));
  assert.deepEqual(tooltipOpenChanges, [
    { open: true, eventType: "mouseenter", key: undefined },
    { open: false, eventType: "mouseleave", key: undefined },
    { open: true, eventType: "focus", key: undefined },
    { open: false, eventType: "keydown", key: "Escape" },
  ]);

  rerenderTooltip(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    open: true,
    onOpenChange: (open, event) => tooltipOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));

  rerenderTooltip(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    open: false,
    onOpenChange: (open, event) => tooltipOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));

  cleanup();

  const treeSelections = [];
  const treeExpandedChanges = [];
  const { getByRole: getTreeRole, rerender: rerenderTreeView } = render(React.createElement(TreeView, {
    label: "Docs navigation",
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: false, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key, event) => treeSelections.push({ key, eventType: event.type }),
    onExpandedChange: (keys, event) => treeExpandedChanges.push({ keys, eventType: event.type }),
  }));

  const componentsTreeItem = getTreeRole("treeitem", { name: /components/i });
  assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "false");
  fireEvent.click(componentsTreeItem);
  await waitFor(() => assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(treeSelections, [{ key: "components", eventType: "click" }]);
  assert.deepEqual(treeExpandedChanges, [{ keys: ["components"], eventType: "click" }]);

  fireEvent.keyDown(componentsTreeItem, { key: "ArrowLeft" });
  await waitFor(() => assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(treeExpandedChanges, [{ keys: ["components"], eventType: "click" }, { keys: [], eventType: "keydown" }]);

  rerenderTreeView(React.createElement(TreeView, {
    label: "Docs navigation",
    selectedKey: "input",
    expandedKeys: ["components"],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: true, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key, event) => treeSelections.push({ key, eventType: event.type }),
    onExpandedChange: (keys, event) => treeExpandedChanges.push({ keys, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(document.querySelector('[data-key="input"] [role="treeitem"]').getAttribute("aria-selected"), "true"));
  fireEvent.click(document.querySelector('[data-key="button"] [role="treeitem"]'));
  assert.deepEqual(treeSelections.at(-1), { key: "button", eventType: "click" });
  assert.equal(document.querySelector('[data-key="button"] [role="treeitem"]').getAttribute("aria-selected"), "false");
  rerenderTreeView(React.createElement(TreeView, {
    label: "Docs navigation",
    selectedKey: "button",
    expandedKeys: ["components"],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: true, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key, event) => treeSelections.push({ key, eventType: event.type }),
    onExpandedChange: (keys, event) => treeExpandedChanges.push({ keys, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(document.querySelector('[data-key="button"] [role="treeitem"]').getAttribute("aria-selected"), "true"));

  cleanup();

  const controlledTreeExpandedChanges = [];
  const { getByRole: getControlledTreeRole, rerender: rerenderControlledTreeView } = render(React.createElement(TreeView, {
    label: "Controlled docs navigation",
    expandedKeys: [],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: false, icon: "category" },
      { key: "button", label: "Button", level: 2 },
    ],
    onExpandedChange: (keys, event) => controlledTreeExpandedChanges.push({ keys, eventType: event.type }),
  }));

  const controlledComponentsTreeItem = getControlledTreeRole("treeitem", { name: /components/i });
  fireEvent.click(controlledComponentsTreeItem);
  assert.deepEqual(controlledTreeExpandedChanges, [{ keys: ["components"], eventType: "click" }]);
  assert.equal(controlledComponentsTreeItem.getAttribute("aria-expanded"), "false");
  rerenderControlledTreeView(React.createElement(TreeView, {
    label: "Controlled docs navigation",
    expandedKeys: ["components"],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: false, icon: "category" },
      { key: "button", label: "Button", level: 2 },
    ],
    onExpandedChange: (keys, event) => controlledTreeExpandedChanges.push({ keys, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(controlledComponentsTreeItem.getAttribute("aria-expanded"), "true"));

  cleanup();

  const preventedTreeSelections = [];
  const preventedTreeExpandedChanges = [];
  const preventedTreeEvents = [];
  const { getByRole: getPreventedTreeRole } = render(React.createElement(TreeView, {
    label: "Prevented docs navigation",
    nodes: [
      {
        key: "components",
        label: "Components",
        level: 1,
        expanded: false,
        onClick: (event) => {
          preventedTreeEvents.push(event.type);
          event.preventDefault();
        },
        onKeyDown: (event) => {
          preventedTreeEvents.push(event.key);
          event.preventDefault();
        },
      },
    ],
    onSelect: (key) => preventedTreeSelections.push(key),
    onExpandedChange: (keys) => preventedTreeExpandedChanges.push(keys),
  }));

  const preventedTreeItem = getPreventedTreeRole("treeitem", { name: /components/i });
  fireEvent.click(preventedTreeItem);
  fireEvent.keyDown(preventedTreeItem, { key: "ArrowRight" });
  assert.deepEqual(preventedTreeEvents, ["click", "ArrowRight"]);
  assert.equal(preventedTreeItem.getAttribute("aria-expanded"), "false");
  assert.deepEqual(preventedTreeSelections, []);
  assert.deepEqual(preventedTreeExpandedChanges, []);

  cleanup();

  const chatComposerEvents = [];
  const { getByRole: getChatComposerRole, rerender: rerenderChatComposer } = render(React.createElement(ChatComposer, {
    label: "Reply",
    value: "Draft",
    attachLabel: "Attach file",
    onValueChange: (value, meta, event) => chatComposerEvents.push(["onValueChange", value, meta.length, event.type]),
    onSend: (value, event) => chatComposerEvents.push(["onSend", value, event.type]),
    onAttach: (event) => chatComposerEvents.push(["onAttach", event.type]),
  }));

  const replyTextArea = getChatComposerRole("textbox", { name: /reply/i });
  assert.equal(replyTextArea.value, "Draft");
  fireEvent.change(replyTextArea, { target: { value: "Next draft" } });
  assert.deepEqual(chatComposerEvents.at(-1), ["onValueChange", "Next draft", 10, "change"]);
  assert.equal(replyTextArea.value, "Draft");
  fireEvent.click(getChatComposerRole("button", { name: /send/i }));
  assert.deepEqual(chatComposerEvents.at(-1), ["onSend", "Draft", "click"]);
  fireEvent.click(getChatComposerRole("button", { name: /attach file/i }));
  assert.deepEqual(chatComposerEvents.at(-1), ["onAttach", "click"]);
  rerenderChatComposer(React.createElement(ChatComposer, {
    label: "Reply",
    value: "Next draft",
    attachLabel: "Attach file",
    onValueChange: (value, meta, event) => chatComposerEvents.push(["onValueChange", value, meta.length, event.type]),
    onSend: (value, event) => chatComposerEvents.push(["onSend", value, event.type]),
    onAttach: (event) => chatComposerEvents.push(["onAttach", event.type]),
  }));
  await waitFor(() => assert.equal(replyTextArea.value, "Next draft"));

  cleanup();

  const chatMessageActions = [];
  const { getByRole: getChatMessageRole } = render(React.createElement(ChatMessage, {
    author: "agent",
    body: "Message failed",
    state: "failed",
    action: {
      label: "Retry message",
      onClick: (event) => chatMessageActions.push(["onClick", event.type]),
    },
  }));

  fireEvent.click(getChatMessageRole("button", { name: /retry message/i }));
  assert.deepEqual(chatMessageActions, [["onClick", "click"]]);

  cleanup();

  const chatThreadActions = [];
  const { getByRole: getChatThreadRole } = render(React.createElement(ChatThread, {
    label: "Support thread",
    messages: [
      {
        id: "failed-message",
        author: "agent",
        body: "Message failed",
        state: "failed",
        action: {
          label: "Retry message",
          onClick: (event) => chatThreadActions.push(["onAction", event.type]),
        },
      },
    ],
    onMessageAction: (key, event) => chatThreadActions.push(["onMessageAction", key, event.type]),
  }));

  fireEvent.click(getChatThreadRole("button", { name: /retry message/i }));
  assert.deepEqual(chatThreadActions, [["onAction", "click"], ["onMessageAction", "failed-message", "click"]]);

  cleanup();

  const copiedEvents = [];
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (value) => copiedEvents.push(["writeText", value]),
    },
  });
  const { getByRole: getCopyButtonRole } = render(React.createElement(CopyButton, {
    value: "npm install @alohasoyrico-eng/flow",
    label: "Copy install command",
    onCopied: (meta, event) => copiedEvents.push(["onCopied", meta.value, meta.state, event.type]),
    onCopyError: (meta, event) => copiedEvents.push(["onCopyError", meta.value, meta.state, event.type]),
  }));

  fireEvent.click(getCopyButtonRole("button", { name: /copy install command/i }));
  await waitFor(() => assert.deepEqual(copiedEvents, [
    ["writeText", "npm install @alohasoyrico-eng/flow"],
    ["onCopied", "npm install @alohasoyrico-eng/flow", "copied", "click"],
  ]));

  cleanup();

  const copyErrorEvents = [];
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async () => {
        throw new Error("blocked");
      },
    },
  });
  const { getByRole: getCopyErrorButtonRole } = render(React.createElement(CopyButton, {
    value: "--sys-energy-surface-primary",
    label: "Copy token path",
    onCopied: (meta, event) => copyErrorEvents.push(["onCopied", meta.value, meta.state, event.type]),
    onCopyError: (meta, event) => copyErrorEvents.push(["onCopyError", meta.value, meta.state, event.type]),
  }));

  fireEvent.click(getCopyErrorButtonRole("button", { name: /copy token path/i }));
  await waitFor(() => assert.deepEqual(copyErrorEvents, [
    ["onCopyError", "--sys-energy-surface-primary", "error", "click"],
  ]));
} finally {
  cleanup();
  dom.window.close();
}

console.log("react interaction tests passed");
