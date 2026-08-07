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
const { Accordion, Breadcrumbs, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, Checkbox, Chip, CodeInput, Combobox, CountrySelector, DatePicker, DateRangePicker, Dialog, Drawer, EmptyState, ErrorPanel, Input, Menu, MovementRow, Pagination, PhoneInput, Popover } = await import("../src/index.js");

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
  const { getByLabelText: getCodeLabel } = render(React.createElement(CodeInput, {
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

  cleanup();

  const comboboxChanges = [];
  const { getByRole: getComboboxRole } = render(React.createElement(Combobox, {
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

  cleanup();

  const countryChanges = [];
  const countries = [
    { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
    { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  ];
  const { getByRole: getCountryRole } = render(React.createElement(CountrySelector, {
    label: "Country",
    country: "MX",
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

  cleanup();

  const dateValues = [];
  const dateOpenChanges = [];
  const { getByRole: getDateRole } = render(React.createElement(DatePicker, {
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

  cleanup();

  const dateRangeValues = [];
  const dateRangeOpenChanges = [];
  const { getByRole: getDateRangeRole } = render(React.createElement(DateRangePicker, {
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

  cleanup();

  const dialogOpenChanges = [];
  const dialogActions = [];
  const { getByRole: getDialogRole } = render(React.createElement(Dialog, {
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

  cleanup();

  const drawerOpenChanges = [];
  const drawerActions = [];
  const { getByRole: getDrawerRole } = render(React.createElement(Drawer, {
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
  const { getByLabelText: getInputLabel } = render(React.createElement(Input, {
    label: "Amount",
    variant: "currency",
    value: "0",
    onValueChange: (value, meta) => inputChanges.push({ value, meta }),
  }));

  const amountInput = getInputLabel(/amount/i);
  fireEvent.input(amountInput, { target: { value: "$1,234.50" } });
  assert.equal(inputChanges.at(-1).value, "1234.50");
  assert.equal(inputChanges.at(-1).meta.numericValue, 1234.5);
  assert.equal(inputChanges.at(-1).meta.displayValue, "$1,234.50");
  assert.equal(inputChanges.at(-1).meta.rawValue, "$1,234.50");

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
  const { getByRole: getMenuRole } = render(React.createElement(Menu, {
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
    page: 3,
    pageCount: 12,
    label: "Results pages",
    onPageChange: (page) => pageChanges.push(page),
  }));

  const pageThreeButton = getPaginationRole("button", { name: /page 3/i });
  assert.equal(pageThreeButton.getAttribute("aria-current"), "page");
  fireEvent.click(getPaginationRole("button", { name: /page 4/i }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /page 4/i }).getAttribute("aria-current"), "page"));
  assert.deepEqual(pageChanges, [4]);

  fireEvent.click(getPaginationRole("button", { name: /next page/i }));
  await waitFor(() => assert.equal(getPaginationRole("button", { name: /page 5/i }).getAttribute("aria-current"), "page"));
  assert.deepEqual(pageChanges, [4, 5]);

  rerenderPagination(React.createElement(Pagination, {
    page: 5,
    pageCount: 12,
    label: "Results pages",
    disabled: true,
    onPageChange: (page) => pageChanges.push(page),
  }));

  fireEvent.click(getPaginationRole("button", { name: /page 6/i }));
  assert.deepEqual(pageChanges, [4, 5]);

  cleanup();

  const phoneChanges = [];
  const phoneCountries = [
    { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
    { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  ];
  const { getByLabelText: getPhoneLabel, getByRole: getPhoneRole } = render(React.createElement(PhoneInput, {
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

  cleanup();

  const popoverOpenChanges = [];
  const popoverActions = [];
  const { getByRole: getPopoverRole } = render(React.createElement(Popover, {
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

  fireEvent.click(popoverTrigger);
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.keyDown(getPopoverRole("dialog", { name: /filter routes/i }), { key: "Escape" });
  await waitFor(() => assert.equal(popoverTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(popoverOpenChanges, [true, false, true, false]);
} finally {
  cleanup();
  dom.window.close();
}

console.log("react interaction tests passed");
