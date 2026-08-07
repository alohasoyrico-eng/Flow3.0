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
const { Accordion, Breadcrumbs, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, Checkbox, Chip, CodeInput, Combobox, CountrySelector, DatePicker, DateRangePicker, Dialog, Drawer, EmptyState, ErrorPanel, Input, List, Menu, MovementRow, Pagination, PhoneInput, Popover, QuickAction, RadioButton, RouteSummary, SegmentedControl, Select, Slider, StationPin, Switch, Table, Tabs, TextArea, Toast, Tooltip, TreeView } = await import("../src/index.js");

try {
  const expandedChanges = [];
  const { getByRole, rerender: rerenderAccordion } = render(React.createElement(Accordion, {
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

  rerenderAccordion(React.createElement(Accordion, {
    expandedIds: ["overview"],
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds) => expandedChanges.push(expandedIds),
  }));
  await waitFor(() => assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

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
  const { getByLabelText, rerender: rerenderExpiry } = render(React.createElement(CardExpiryInput, {
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

  rerenderExpiry(React.createElement(CardExpiryInput, {
    label: "Expiry date",
    value: "1029",
    onValueChange: (value, meta) => expiryChanges.push({ value, meta }),
  }));
  await waitFor(() => assert.equal(expiryInput.value, "10/29"));

  cleanup();

  const cardNumberChanges = [];
  const { getByLabelText: getCardNumberLabel, rerender: rerenderCardNumber } = render(React.createElement(CardNumberInput, {
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

  rerenderCardNumber(React.createElement(CardNumberInput, {
    label: "Card number",
    value: "5555555555554444",
    onValueChange: (digits, meta) => cardNumberChanges.push({ digits, meta }),
  }));
  await waitFor(() => assert.equal(cardNumberInput.value, "5555 5555 5555 4444"));

  cleanup();

  const securityCodeChanges = [];
  const { getByLabelText: getSecurityCodeLabel, getByRole: getSecurityCodeRole, rerender: rerenderSecurityCode } = render(React.createElement(CardSecurityCodeInput, {
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

  rerenderSecurityCode(React.createElement(CardSecurityCodeInput, {
    label: "Security code",
    expectedLength: 4,
    value: "9876",
    revealed: false,
    onValueChange: (digits, meta) => securityCodeChanges.push({ digits, meta }),
  }));
  await waitFor(() => assert.equal(securityCodeInput.value, "9876"));
  await waitFor(() => assert.equal(securityCodeInput.type, "password"));

  cleanup();

  const checkboxChanges = [];
  const { getByLabelText: getCheckboxLabel, rerender: rerenderCheckbox } = render(React.createElement(Checkbox, {
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

  rerenderCheckbox(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    checked: false,
    onCheckedChange: (checked, meta) => checkboxChanges.push({ checked, meta }),
  }));
  await waitFor(() => assert.equal(checkboxInput.checked, false));
  await waitFor(() => assert.equal(checkboxInput.getAttribute("aria-checked"), "false"));

  cleanup();

  const removedChips = [];
  const { getByRole: getChipRole } = render(React.createElement(Chip, {
    label: "Active",
    removable: true,
    onRemoveLabel: "Remove Active",
    onRemove: (label) => removedChips.push(label),
  }));

  fireEvent.click(getChipRole("button", { name: /remove active/i }));
  assert.deepEqual(removedChips, ["Active"]);

  cleanup();

  const selectedChips = [];
  const { getByRole: getSelectableChipRole } = render(React.createElement(Chip, {
    label: "EV",
    selected: false,
    onSelectedChange: (selected) => selectedChips.push(selected),
  }));

  const selectableChip = getSelectableChipRole("button", { name: /ev/i });
  assert.equal(selectableChip.getAttribute("aria-pressed"), "false");
  fireEvent.click(selectableChip);
  assert.deepEqual(selectedChips, [true]);

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
    onValueChange: (value) => codeValues.push(value),
    onComplete: (value) => completedCodes.push(value),
  }));

  const codeInput = getCodeLabel(/sms code/i);
  fireEvent.focus(codeInput);
  fireEvent.input(codeInput, { target: { value: "12a34" } });

  await waitFor(() => assert.equal(codeInput.value, "1234"));
  assert.deepEqual(codeValues, ["1234"]);
  assert.deepEqual(completedCodes, ["1234"]);

  rerenderCodeInput(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    value: "9876",
    onValueChange: (value) => codeValues.push(value),
    onComplete: (value) => completedCodes.push(value),
  }));
  await waitFor(() => assert.equal(codeInput.value, "9876"));

  cleanup();

  const comboboxChanges = [];
  const { getByRole: getComboboxRole, rerender: rerenderCombobox } = render(React.createElement(Combobox, {
    label: "Driver",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onValueChange: (value, meta) => comboboxChanges.push({ value, meta }),
  }));

  const comboboxInput = getComboboxRole("combobox", { name: /driver/i });
  fireEvent.focus(comboboxInput);
  fireEvent.input(comboboxInput, { target: { value: "Ana" } });
  assert.equal(comboboxChanges.at(-1).value, "Ana");
  assert.equal(comboboxChanges.at(-1).meta.inputValue, "Ana");

  fireEvent.click(getComboboxRole("option", { name: /ana sosa/i }));
  await waitFor(() => assert.equal(comboboxInput.value, "Ana Sosa"));
  assert.equal(comboboxChanges.at(-1).value, "ana");
  assert.deepEqual(comboboxChanges.at(-1).meta, { label: "Ana Sosa", meta: "Driver", inputValue: "Ana Sosa" });

  fireEvent.click(getComboboxRole("button", { name: /clear selection/i }));
  await waitFor(() => assert.equal(comboboxInput.value, ""));
  assert.equal(comboboxChanges.at(-1).value, "");
  assert.deepEqual(comboboxChanges.at(-1).meta, { label: "", meta: "", inputValue: "", cleared: true });

  rerenderCombobox(React.createElement(Combobox, {
    label: "Driver",
    value: "luis",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    onValueChange: (value, meta) => comboboxChanges.push({ value, meta }),
  }));
  await waitFor(() => assert.equal(comboboxInput.value, "Luis Perez"));

  cleanup();

  const countryChanges = [];
  const countries = [
    { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
    { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  ];
  const { getByRole: getCountryRole, rerender: rerenderCountrySelector } = render(React.createElement(CountrySelector, {
    label: "Country",
    countries,
    onValueChange: (countryCode, option) => countryChanges.push({ countryCode, option }),
  }));

  const countryTrigger = getCountryRole("combobox", { name: /country/i });
  assert.equal(countryTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(countryTrigger);
  assert.equal(countryTrigger.getAttribute("aria-expanded"), "true");

  fireEvent.click(getCountryRole("option", { name: /united states/i }));
  await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "false"));
  assert.equal(countryChanges.at(-1).countryCode, "US");
  assert.equal(countryChanges.at(-1).option.label, "United States");
  assert.equal(countryChanges.at(-1).option.callingCode, "+1");

  rerenderCountrySelector(React.createElement(CountrySelector, {
    label: "Country",
    value: "MX",
    countries,
    onValueChange: (countryCode, option) => countryChanges.push({ countryCode, option }),
  }));
  await waitFor(() => assert.equal(countryTrigger.textContent.includes("+52"), true));

  cleanup();

  const dateValues = [];
  const dateOpenChanges = [];
  const { getByRole: getDateRole, rerender: rerenderDatePicker } = render(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-13",
    min: "2026-07-01",
    max: "2026-07-31",
    onValueChange: (value) => dateValues.push(value),
    onOpenChange: (open) => dateOpenChanges.push(open),
  }));

  const dateTrigger = getDateRole("button", { name: /service date/i });
  assert.equal(dateTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(dateTrigger);
  assert.equal(dateTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(dateOpenChanges, [true]);

  fireEvent.click(getDateRole("gridcell", { name: /miércoles, 15 de julio de 2026/i }));
  await waitFor(() => assert.equal(dateTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dateValues, ["2026-07-15"]);
  assert.deepEqual(dateOpenChanges, [true, false]);

  rerenderDatePicker(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-20",
    min: "2026-07-01",
    max: "2026-07-31",
    onValueChange: (value) => dateValues.push(value),
    onOpenChange: (open) => dateOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(dateTrigger.textContent.includes("20 jul 2026"), true));

  rerenderDatePicker(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-20",
    min: "2026-07-01",
    max: "2026-07-31",
    open: true,
    onValueChange: (value) => dateValues.push(value),
    onOpenChange: (open) => dateOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(dateTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDatePicker(React.createElement(DatePicker, {
    label: "Service date",
    value: "2026-07-20",
    min: "2026-07-01",
    max: "2026-07-31",
    open: false,
    onValueChange: (value) => dateValues.push(value),
    onOpenChange: (open) => dateOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(dateTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const dateRangeValues = [];
  const dateRangeOpenChanges = [];
  const { getByRole: getDateRangeRole, rerender: rerenderDateRangePicker } = render(React.createElement(DateRangePicker, {
    label: "Service range",
    from: "2026-07-01",
    presets: false,
    onValueChange: (value) => dateRangeValues.push(value),
    onOpenChange: (open) => dateRangeOpenChanges.push(open),
  }));

  const dateRangeTrigger = getDateRangeRole("button", { name: /service range/i });
  fireEvent.click(dateRangeTrigger);
  assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(dateRangeOpenChanges, [true]);

  fireEvent.click(getDateRangeRole("gridcell", { name: /miércoles, 15 de julio de 2026/i }));
  await waitFor(() => assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dateRangeValues, [{ from: "2026-07-01", to: "2026-07-15" }]);
  assert.deepEqual(dateRangeOpenChanges, [true, false]);

  rerenderDateRangePicker(React.createElement(DateRangePicker, {
    label: "Service range",
    value: { from: "2026-07-10", to: "2026-07-20" },
    presets: false,
    onValueChange: (value) => dateRangeValues.push(value),
    onOpenChange: (open) => dateRangeOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(dateRangeTrigger.textContent.includes("10 jul 2026 - 20 jul 2026"), true));

  rerenderDateRangePicker(React.createElement(DateRangePicker, {
    label: "Service range",
    value: { from: "2026-07-10", to: "2026-07-20" },
    presets: false,
    open: true,
    onValueChange: (value) => dateRangeValues.push(value),
    onOpenChange: (open) => dateRangeOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDateRangePicker(React.createElement(DateRangePicker, {
    label: "Service range",
    value: { from: "2026-07-10", to: "2026-07-20" },
    presets: false,
    open: false,
    onValueChange: (value) => dateRangeValues.push(value),
    onOpenChange: (open) => dateRangeOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(dateRangeTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const dialogOpenChanges = [];
  const dialogActions = [];
  const { getByRole: getDialogRole, rerender: rerenderDialog } = render(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    actions: [{ key: "confirm", label: "Confirm" }],
    onOpenChange: (open) => dialogOpenChanges.push(open),
    onAction: (key) => dialogActions.push(key),
  }));

  const dialogTrigger = getDialogRole("button", { name: /open review/i });
  fireEvent.click(dialogTrigger);
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getDialogRole("dialog", { name: /confirm route/i }).hidden, false);
  assert.deepEqual(dialogOpenChanges, [true]);

  fireEvent.click(getDialogRole("button", { name: /confirm/i }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dialogActions, ["confirm"]);
  assert.deepEqual(dialogOpenChanges, [true, false]);

  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    actions: [{ key: "confirm", label: "Confirm" }],
    open: true,
    onOpenChange: (open) => dialogOpenChanges.push(open),
    onAction: (key) => dialogActions.push(key),
  }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    actions: [{ key: "confirm", label: "Confirm" }],
    open: false,
    onOpenChange: (open) => dialogOpenChanges.push(open),
    onAction: (key) => dialogActions.push(key),
  }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false"));

  cleanup();

  const drawerOpenChanges = [];
  const drawerActions = [];
  const { getByRole: getDrawerRole, rerender: rerenderDrawer } = render(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    actions: [{ key: "save", label: "Save" }],
    onOpenChange: (open) => drawerOpenChanges.push(open),
    onAction: (key) => drawerActions.push(key),
  }));

  const drawerTrigger = getDrawerRole("button", { name: /open details/i });
  fireEvent.click(drawerTrigger);
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getDrawerRole("dialog", { name: /vehicle details/i }).hidden, false);
  assert.deepEqual(drawerOpenChanges, [true]);

  fireEvent.click(getDrawerRole("button", { name: /save/i }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(drawerActions, ["save"]);
  assert.deepEqual(drawerOpenChanges, [true, false]);

  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    actions: [{ key: "save", label: "Save" }],
    open: true,
    onOpenChange: (open) => drawerOpenChanges.push(open),
    onAction: (key) => drawerActions.push(key),
  }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    actions: [{ key: "save", label: "Save" }],
    open: false,
    onOpenChange: (open) => drawerOpenChanges.push(open),
    onAction: (key) => drawerActions.push(key),
  }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false"));

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
    onAction: (key) => emptyStateActions.push(key),
  }));

  fireEvent.click(getEmptyStateRole("button", { name: /clear filters/i }));
  assert.deepEqual(emptyStateClicks, ["click"]);
  assert.deepEqual(emptyStateActions, ["clear-filters"]);

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
    onAction: (key) => errorPanelActions.push(key),
  }));

  fireEvent.click(getErrorPanelRole("button", { name: /retry/i }));
  assert.deepEqual(errorPanelClicks, ["click"]);
  assert.deepEqual(errorPanelActions, ["retry"]);

  cleanup();

  const inputChanges = [];
  const { getByLabelText: getInputLabel, rerender: rerenderInput } = render(React.createElement(Input, {
    label: "Amount",
    variant: "currency",
    onValueChange: (value, meta) => inputChanges.push({ value, meta }),
  }));

  const amountInput = getInputLabel(/amount/i);
  fireEvent.input(amountInput, { target: { value: "$1,234.50" } });
  assert.equal(inputChanges.at(-1).value, "1234.50");
  assert.equal(inputChanges.at(-1).meta.numericValue, 1234.5);
  assert.equal(inputChanges.at(-1).meta.displayValue, "$1,234.50");
  assert.equal(inputChanges.at(-1).meta.rawValue, "$1,234.50");

  rerenderInput(React.createElement(Input, {
    label: "Amount",
    variant: "currency",
    value: "9876.5",
    onValueChange: (value, meta) => inputChanges.push({ value, meta }),
  }));
  await waitFor(() => assert.equal(amountInput.value, "9,876.50"));

  cleanup();

  const { getByLabelText: getPasswordLabel, getByRole: getPasswordRole } = render(React.createElement(Input, {
    label: "Password",
    variant: "password",
    value: "secret",
  }));

  const passwordInput = getPasswordLabel(/password/i);
  assert.equal(passwordInput.type, "password");
  const revealPasswordButton = getPasswordRole("button", { name: /show value/i });
  fireEvent.click(revealPasswordButton);
  await waitFor(() => assert.equal(passwordInput.type, "text"));
  assert.equal(revealPasswordButton.getAttribute("aria-pressed"), "true");

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
    onOpenChange: (open) => menuOpenChanges.push(open),
    onSelect: (item) => menuSelections.push(item.key),
  }));

  const menuTrigger = getMenuRole("button", { name: /actions/i });
  assert.equal(menuTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(menuTrigger);
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(menuOpenChanges, [true]);

  const archiveItem = getMenuRole("menuitem", { name: /archive/i });
  fireEvent.click(archiveItem);
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(menuSelections, ["archive"]);
  assert.deepEqual(menuOpenChanges, [true, false]);

  fireEvent.keyDown(menuTrigger, { key: "ArrowDown" });
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.keyDown(getMenuRole("menu", { name: /row actions/i }), { key: "Escape" });
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(menuOpenChanges, [true, false, true, false]);

  rerenderMenu(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    open: true,
    onOpenChange: (open) => menuOpenChanges.push(open),
    onSelect: (item) => menuSelections.push(item.key),
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
    onOpenChange: (open) => menuOpenChanges.push(open),
    onSelect: (item) => menuSelections.push(item.key),
  }));
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));

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
    onSelect: (meta) => selectedMovements.push(meta),
  }));

  fireEvent.click(getMovementRole("button", { name: /fuel charge/i }));
  assert.equal(movementClicks.length, 1);
  assert.equal(selectedMovements.length, 1);
  assert.equal(selectedMovements[0].label, "Fuel charge");
  assert.equal(selectedMovements[0].status, "Pending");
  assert.equal(selectedMovements[0].category, "fuel");
  assert.equal(selectedMovements[0].state, "default");

  rerenderMovement(React.createElement(MovementRow, {
    label: "Fuel charge",
    disabled: true,
    onClick: (event) => movementClicks.push(event.type),
    onSelect: (meta) => selectedMovements.push(meta),
  }));

  fireEvent.click(getMovementRole("button", { name: /fuel charge/i }));
  assert.equal(movementClicks.length, 1);
  assert.equal(selectedMovements.length, 1);

  cleanup();

  const pageChanges = [];
  const { getByRole: getPaginationRole, rerender: rerenderPagination } = render(React.createElement(Pagination, {
    pageCount: 12,
    label: "Results pages",
    onPageChange: (page) => pageChanges.push(page),
  }));

  const pageOneButton = getPaginationRole("button", { name: /^page 1$/i });
  assert.equal(pageOneButton.getAttribute("aria-current"), "page");

  fireEvent.click(getPaginationRole("button", { name: /next page/i }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /^page 2$/i }).getAttribute("aria-current"), "page"));
  assert.deepEqual(pageChanges, [2]);

  fireEvent.click(getPaginationRole("button", { name: /next page/i }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /^page 3$/i }).getAttribute("aria-current"), "page"));
  assert.deepEqual(pageChanges, [2, 3]);

  rerenderPagination(React.createElement(Pagination, {
    page: 5,
    pageCount: 12,
    label: "Results pages",
    disabled: true,
    onPageChange: (page) => pageChanges.push(page),
  }));

  fireEvent.click(getPaginationRole("button", { name: /page 6/i }));
  assert.deepEqual(pageChanges, [2, 3]);

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
    onValueChange: (value, meta) => phoneChanges.push({ value, meta }),
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

  const phoneCountryTrigger = getPhoneRole("combobox", { name: /phone number country code/i });
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

  rerenderPhoneInput(React.createElement(PhoneInput, {
    label: "Phone number",
    value: "+525598765432",
    country: "MX",
    countries: phoneCountries,
    onValueChange: (value, meta) => phoneChanges.push({ value, meta }),
  }));
  await waitFor(() => assert.equal(phoneInput.value, "55 9876 5432"));
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
    onOpenChange: (open) => popoverOpenChanges.push(open),
    onAction: (key) => popoverActions.push(key),
  }));

  const popoverTrigger = getPopoverRole("button", { name: /open filters/i });
  assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(popoverTrigger);
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getPopoverRole("dialog", { name: /filter routes/i }).hidden, false);
  assert.deepEqual(popoverOpenChanges, [true]);

  fireEvent.click(getPopoverRole("button", { name: /apply/i }));
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(popoverActions, ["apply"]);
  assert.deepEqual(popoverOpenChanges, [true, false]);

  rerenderPopover(React.createElement(Popover, {
    triggerLabel: "Open filters",
    title: "Filter routes",
    description: "Adjust visible routes.",
    variant: "action",
    actions: [{ key: "apply", label: "Apply", variant: "primary" }],
    open: true,
    onOpenChange: (open) => popoverOpenChanges.push(open),
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
    onOpenChange: (open) => popoverOpenChanges.push(open),
    onAction: (key) => popoverActions.push(key),
  }));
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false"));

  fireEvent.click(popoverTrigger);
  await waitFor(() => assert.deepEqual(popoverOpenChanges, [true, false, true]));
  assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const quickActions = [];
  const quickActionClicks = [];
  const { getByRole: getQuickActionRole, rerender: rerenderQuickAction } = render(React.createElement(QuickAction, {
    label: "Scan card",
    icon: "qr_code_scanner",
    tone: "danger",
    onClick: (event) => quickActionClicks.push(event.type),
    onAction: (meta) => quickActions.push(meta),
  }));

  fireEvent.click(getQuickActionRole("button", { name: /scan card/i }));
  assert.deepEqual(quickActionClicks, ["click"]);
  assert.deepEqual(quickActions, [{ label: "Scan card", variant: "destructive", state: "default" }]);

  rerenderQuickAction(React.createElement(QuickAction, {
    label: "Scan card",
    icon: "qr_code_scanner",
    loading: true,
    onClick: (event) => quickActionClicks.push(event.type),
    onAction: (meta) => quickActions.push(meta),
  }));

  fireEvent.click(getQuickActionRole("button", { name: /scan card/i }));
  assert.deepEqual(quickActionClicks, ["click"]);
  assert.deepEqual(quickActions, [{ label: "Scan card", variant: "destructive", state: "default" }]);

  cleanup();

  const radioChanges = [];
  const { getByLabelText: getRadioLabel, rerender: rerenderRadio } = render(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    onCheckedChange: (checked, meta) => radioChanges.push({ checked, meta }),
  }));

  const radioInput = getRadioLabel(/card payment/i);
  assert.equal(radioInput.checked, false);
  fireEvent.click(radioInput);
  await waitFor(() => assert.equal(radioInput.checked, true));
  assert.deepEqual(radioChanges, [{ checked: true, meta: { value: "card" } }]);

  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: false,
    disabled: true,
    onCheckedChange: (checked, meta) => radioChanges.push({ checked, meta }),
  }));

  await waitFor(() => assert.equal(radioInput.checked, false));
  fireEvent.click(getRadioLabel(/card payment/i));
  assert.deepEqual(radioChanges, [{ checked: true, meta: { value: "card" } }]);

  cleanup();

  const routeClicks = [];
  const routeActions = [];
  const { container: routeContainer, getByRole: getRouteRole } = render(React.createElement(RouteSummary, {
    label: "Route 24",
    description: "Centro to Norte",
    metrics: [{ label: "ETA", value: "18 min" }],
    actions: [{ key: "assign", label: "Assign", onAction: () => routeActions.push("assign") }],
    onClick: (event) => routeClicks.push(event.type),
  }));

  const routeSummary = routeContainer.querySelector(".route-summary");
  fireEvent.click(routeSummary);
  assert.deepEqual(routeClicks, ["click"]);

  fireEvent.click(getRouteRole("button", { name: /assign/i }));
  assert.deepEqual(routeActions, ["assign"]);
  assert.deepEqual(routeClicks, ["click"]);

  cleanup();

  const listSelections = [];
  const { getByRole: getListRole, rerender: rerenderList } = render(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key) => listSelections.push(key),
  }));

  const documentsRow = getListRole("button", { name: /documents/i });
  const fuelRow = getListRole("button", { name: /fuel card/i });
  assert.equal(documentsRow.getAttribute("aria-current"), null);
  fireEvent.click(documentsRow);
  await waitFor(() => assert.equal(documentsRow.getAttribute("aria-current"), "true"));
  assert.deepEqual(listSelections, ["docs"]);

  rerenderList(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    selectedKey: "fuel",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key) => listSelections.push(key),
  }));
  await waitFor(() => assert.equal(fuelRow.getAttribute("aria-current"), "true"));
  assert.equal(documentsRow.getAttribute("aria-current"), null);

  cleanup();

  const segmentChanges = [];
  const { getByRole: getSegmentRole, rerender: rerenderSegmentedControl } = render(React.createElement(SegmentedControl, {
    label: "View mode",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key) => segmentChanges.push(key),
  }));

  const listSegment = getSegmentRole("tab", { name: /list/i });
  const timelineSegment = getSegmentRole("tab", { name: /timeline/i });
  assert.equal(listSegment.getAttribute("aria-selected"), "true");
  fireEvent.click(timelineSegment);
  await waitFor(() => assert.equal(timelineSegment.getAttribute("aria-selected"), "true"));
  assert.deepEqual(segmentChanges, ["timeline"]);

  fireEvent.keyDown(listSegment, { key: "ArrowRight" });
  assert.deepEqual(segmentChanges, ["timeline", "list"]);

  rerenderSegmentedControl(React.createElement(SegmentedControl, {
    label: "View mode",
    selectedKey: "list",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key) => segmentChanges.push(key),
  }));
  await waitFor(() => assert.equal(listSegment.getAttribute("aria-selected"), "true"));

  cleanup();

  const selectChanges = [];
  const { getByRole: getSelectRole, rerender: rerenderSelect } = render(React.createElement(Select, {
    label: "Country",
    value: "mx",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta) => selectChanges.push({ value, meta }),
  }));

  const selectTrigger = getSelectRole("combobox", { name: /country/i });
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(selectTrigger);
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "true");

  fireEvent.click(getSelectRole("option", { name: /canada/i }));
  assert.deepEqual(selectChanges, []);

  fireEvent.click(getSelectRole("option", { name: /united states/i }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(selectChanges, [{ value: "us", meta: { label: "United States", meta: "+1" } }]);

  rerenderSelect(React.createElement(Select, {
    label: "Country",
    value: "mx",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta) => selectChanges.push({ value, meta }),
  }));
  await waitFor(() => assert.equal(selectTrigger.textContent.includes("Mexico"), true));

  cleanup();

  const sliderChanges = [];
  const { getByRole: getSliderRole, getByText: getSliderText, rerender: rerenderSlider } = render(React.createElement(Slider, {
    label: "Search radius",
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta) => sliderChanges.push({ value, meta }),
  }));

  const sliderInput = getSliderRole("slider", { name: /search radius/i });
  fireEvent.input(sliderInput, { target: { value: "12" } });
  await waitFor(() => assert.equal(sliderInput.value, "12"));
  getSliderText("12 km");
  assert.deepEqual(sliderChanges, [{ value: 12, meta: { name: "radius", min: 0, max: 20, step: 1, unit: " km" } }]);

  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 12,
    min: 0,
    max: 20,
    disabled: true,
    onValueChange: (value, meta) => sliderChanges.push({ value, meta }),
  }));

  fireEvent.input(getSliderRole("slider", { name: /search radius/i }), { target: { value: "14" } });
  assert.equal(sliderChanges.length, 1);

  cleanup();

  const stationSelections = [];
  const stationClicks = [];
  const { getByRole: getStationRole, rerender: rerenderStation } = render(React.createElement(StationPin, {
    label: "Station 24",
    value: "Open",
    meta: "2.4 km",
    variant: "ev",
    onClick: (event) => stationClicks.push(event.type),
    onSelect: (meta) => stationSelections.push(meta),
  }));

  fireEvent.click(getStationRole("button", { name: /station 24/i }));
  assert.deepEqual(stationClicks, ["click"]);
  assert.deepEqual(stationSelections, [{ label: "Station 24", value: "Open", variant: "ev", state: "default" }]);

  rerenderStation(React.createElement(StationPin, {
    label: "Station 24",
    value: "Open",
    unavailable: true,
    onClick: (event) => stationClicks.push(event.type),
    onSelect: (meta) => stationSelections.push(meta),
  }));

  fireEvent.click(getStationRole("button", { name: /station 24/i }));
  assert.deepEqual(stationClicks, ["click"]);
  assert.deepEqual(stationSelections, [{ label: "Station 24", value: "Open", variant: "ev", state: "default" }]);

  cleanup();

  const switchChanges = [];
  const { getByRole: getSwitchRole, rerender: rerenderSwitch } = render(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    onCheckedChange: (checked, meta) => switchChanges.push({ checked, meta }),
  }));

  const switchInput = getSwitchRole("switch", { name: /enable notifications/i });
  assert.equal(switchInput.getAttribute("aria-checked"), "false");
  fireEvent.click(switchInput);
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "true"));
  assert.deepEqual(switchChanges, [{ checked: true, meta: { name: "notifications" } }]);

  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: false,
    disabled: true,
    onCheckedChange: (checked, meta) => switchChanges.push({ checked, meta }),
  }));

  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "false"));
  fireEvent.click(getSwitchRole("switch", { name: /enable notifications/i }));
  assert.equal(switchChanges.length, 1);

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
    onRowSelect: (key) => rowSelections.push(key),
  }));

  fireEvent.click(selectableTableContainer.querySelector('tr[data-key="unit-31"]'));
  assert.deepEqual(rowSelections, ["unit-31"]);
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "true");

  rerenderTable(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    selectedKey: "unit-24",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key) => rowSelections.push(key),
  }));
  await waitFor(() => assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-24"]').getAttribute("data-selected"), "true"));

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
    onSortChange: (sort) => sortChanges.push(sort),
  }));

  fireEvent.click(getSortableTableRole("button", { name: /plate/i }));
  assert.deepEqual(sortChanges, [{ key: "plate", direction: "ascending" }]);

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
    onSortChange: (sort) => sortChanges.push(sort),
  }));
  await waitFor(() => assert.equal(getSortableTableRole("columnheader", { name: /driver/i }).getAttribute("aria-sort"), "descending"));

  cleanup();

  const expandedRows = [];
  const { getByRole: getTableRole, rerender: rerenderExpandedTable } = render(React.createElement(Table, {
    label: "Vehicle details",
    variant: "expandable",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key) => expandedRows.push(key),
  }));

  const expandUnit24 = getTableRole("button", { name: /expand abc-123/i });
  assert.equal(expandUnit24.getAttribute("aria-expanded"), "false");
  fireEvent.click(expandUnit24);
  await waitFor(() => assert.equal(expandUnit24.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(expandedRows, ["unit-24"]);

  fireEvent.click(expandUnit24);
  await waitFor(() => assert.equal(expandUnit24.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(expandedRows, ["unit-24", ""]);

  rerenderExpandedTable(React.createElement(Table, {
    label: "Vehicle details",
    variant: "expandable",
    expandedKey: "unit-31",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key) => expandedRows.push(key),
  }));
  await waitFor(() => assert.equal(getTableRole("button", { name: /collapse xyz-789/i }).getAttribute("aria-expanded"), "true"));

  cleanup();

  const tabChanges = [];
  const { getByRole: getTabsRole, rerender: rerenderTabs } = render(React.createElement(Tabs, {
    label: "Component sections",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key) => tabChanges.push(key),
  }));

  const overviewTab = getTabsRole("tab", { name: /overview/i });
  const buildTab = getTabsRole("tab", { name: /build/i });
  assert.equal(overviewTab.getAttribute("aria-selected"), "true");
  fireEvent.click(buildTab);
  await waitFor(() => assert.equal(buildTab.getAttribute("aria-selected"), "true"));
  assert.deepEqual(tabChanges, ["build"]);

  fireEvent.keyDown(overviewTab, { key: "ArrowRight" });
  assert.deepEqual(tabChanges, ["build", "overview"]);
  assert.equal(getTabsRole("tablist", { name: /component sections/i }).dataset.indicatorSynced, "true");

  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    selectedKey: "overview",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key) => tabChanges.push(key),
  }));
  await waitFor(() => assert.equal(overviewTab.getAttribute("aria-selected"), "true"));

  cleanup();

  const textAreaChanges = [];
  const { getByLabelText: getTextAreaLabel, getByText: getTextAreaText, rerender: rerenderTextArea } = render(React.createElement(TextArea, {
    label: "Notes",
    maxLength: 20,
    onChange: (value, meta) => textAreaChanges.push({ value, meta }),
  }));

  const notesTextArea = getTextAreaLabel(/notes/i);
  fireEvent.change(notesTextArea, { target: { value: "Route ready" } });
  await waitFor(() => assert.equal(notesTextArea.value, "Route ready"));
  getTextAreaText("11/20");
  assert.deepEqual(textAreaChanges, [{ value: "Route ready", meta: { maxLength: 20, length: 11 } }]);

  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Route ready",
    loading: true,
    onChange: (value, meta) => textAreaChanges.push({ value, meta }),
  }));

  fireEvent.change(getTextAreaLabel(/notes/i), { target: { value: "Blocked" } });
  assert.equal(textAreaChanges.length, 1);

  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Externally updated",
    maxLength: 30,
    onChange: (value, meta) => textAreaChanges.push({ value, meta }),
  }));
  await waitFor(() => assert.equal(notesTextArea.value, "Externally updated"));
  getTextAreaText("18/30");

  cleanup();

  const toastActions = [];
  const toastDismissals = [];
  const { getByRole: getToastRole } = render(React.createElement(Toast, {
    label: "Route saved",
    description: "Changes are available.",
    actionLabel: "Undo",
    dismissible: true,
    onAction: () => toastActions.push("undo"),
    onDismiss: () => toastDismissals.push("dismiss"),
  }));

  const toastRegion = getToastRole("status");
  assert.equal(toastRegion.hidden, false);
  fireEvent.click(getToastRole("button", { name: /undo/i }));
  assert.deepEqual(toastActions, ["undo"]);

  fireEvent.click(getToastRole("button", { name: /dismiss notification/i }));
  assert.deepEqual(toastDismissals, ["dismiss"]);
  assert.equal(toastRegion.hidden, true);

  cleanup();

  const tooltipOpenChanges = [];
  const { getByRole: getTooltipRole, rerender: rerenderTooltip } = render(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    onOpenChange: (open) => tooltipOpenChanges.push(open),
  }));

  const tooltipTrigger = getTooltipRole("button", { name: /help/i });
  const tooltipBubble = getTooltipRole("tooltip", { hidden: true });
  assert.equal(tooltipBubble.hidden, true);
  fireEvent.mouseEnter(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));
  assert.deepEqual(tooltipOpenChanges, [true]);

  fireEvent.mouseLeave(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));
  assert.deepEqual(tooltipOpenChanges, [true, false]);

  fireEvent.focus(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));
  fireEvent.keyDown(tooltipTrigger, { key: "Escape" });
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));
  assert.deepEqual(tooltipOpenChanges, [true, false, true, false]);

  rerenderTooltip(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    open: true,
    onOpenChange: (open) => tooltipOpenChanges.push(open),
  }));
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));

  rerenderTooltip(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    open: false,
    onOpenChange: (open) => tooltipOpenChanges.push(open),
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
    onSelect: (key) => treeSelections.push(key),
    onExpandedChange: (keys) => treeExpandedChanges.push(keys),
  }));

  const componentsTreeItem = getTreeRole("treeitem", { name: /components/i });
  assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "false");
  fireEvent.click(componentsTreeItem);
  await waitFor(() => assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(treeSelections, ["components"]);
  assert.deepEqual(treeExpandedChanges, [["components"]]);

  fireEvent.keyDown(componentsTreeItem, { key: "ArrowLeft" });
  await waitFor(() => assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(treeExpandedChanges, [["components"], []]);

  rerenderTreeView(React.createElement(TreeView, {
    label: "Docs navigation",
    selectedKey: "input",
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: true, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key) => treeSelections.push(key),
    onExpandedChange: (keys) => treeExpandedChanges.push(keys),
  }));
  await waitFor(() => assert.equal(document.querySelector('[data-key="input"] [role="treeitem"]').getAttribute("aria-selected"), "true"));
} finally {
  cleanup();
  dom.window.close();
}

console.log("react interaction tests passed");
