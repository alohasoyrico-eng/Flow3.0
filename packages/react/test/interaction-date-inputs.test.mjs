import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  DatePicker,
  DateRangePicker,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
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

  fireEvent.click(getDateRole("button", { name: /miércoles, 15 de julio de 2026/i }));
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

  fireEvent.click(getDateRangeRole("button", { name: /miércoles, 15 de julio de 2026/i }));
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
  console.log("interaction date inputs passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
