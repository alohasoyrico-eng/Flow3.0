import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  MovementRow,
  Pagination,
  PhoneInput,
  Popover,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
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
  console.log("interaction navigation inputs passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
