import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Combobox,
  CountrySelector,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
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
  assert.equal(comboboxInput.getAttribute("aria-activedescendant"), null);
  fireEvent.input(comboboxInput, { target: { value: "Ana" } });
  assert.equal(comboboxInput.getAttribute("aria-activedescendant"), null);
  assert.equal(
    document.querySelectorAll("[data-select-listbox] [data-select-option][data-selected=\"true\"]").length,
    0,
    "Combobox compatibility wrapper must rely on Select searchable state and avoid stale selected options while typing.",
  );
  assert.equal(comboboxChanges.at(-1).value, "Ana");
  assert.equal(comboboxChanges.at(-1).meta.inputValue, "Ana");
  assert.equal(comboboxChanges.at(-1).eventType, "change");
  assert.equal(comboboxInput.getAttribute("aria-expanded"), "true");
  assert.deepEqual(comboboxOpenChanges, [{ open: true, eventType: "focus", key: undefined }]);

  fireEvent.keyDown(comboboxInput, { key: "ArrowDown" });
  await waitFor(() => assert.match(comboboxInput.getAttribute("aria-activedescendant") || "", /option-0/));
  fireEvent.keyDown(comboboxInput, { key: "ArrowUp" });
  await waitFor(() => assert.match(comboboxInput.getAttribute("aria-activedescendant") || "", /option-0/));
  fireEvent.keyDown(comboboxInput, { key: "Enter" });
  await waitFor(() => assert.equal(comboboxInput.value, "Ana Sosa"));
  assert.equal(comboboxChanges.at(-1).value, "ana");
  assert.deepEqual(comboboxOpenChanges.at(-1), { open: false, eventType: "keydown", key: "Enter" });
  fireEvent.focus(comboboxInput);
  await waitFor(() => assert.equal(comboboxInput.getAttribute("aria-expanded"), "true"));
  fireEvent.keyDown(comboboxInput, { key: "Escape" });
  await waitFor(() => assert.equal(comboboxInput.getAttribute("aria-expanded"), "false"));
  assert.equal(comboboxInput.getAttribute("aria-activedescendant"), null);
  assert.deepEqual(comboboxOpenChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

  fireEvent.click(getComboboxRole("button", { name: /clear driver/i }));
  await waitFor(() => assert.equal(comboboxInput.value, ""));

  fireEvent.click(getComboboxRole("option", { name: /ana sosa/i }));
  await waitFor(() => assert.equal(comboboxInput.value, "Ana Sosa"));
  assert.equal(comboboxChanges.at(-1).value, "ana");
  assert.deepEqual(comboboxChanges.at(-1).meta, { label: "Ana Sosa", meta: "Driver", inputValue: "Ana Sosa" });
  assert.equal(comboboxChanges.at(-1).eventType, "click");
  assert.deepEqual(comboboxOpenChanges.at(-1), { open: false, eventType: "click", key: undefined });

  fireEvent.click(getComboboxRole("button", { name: /clear driver/i }));
  await waitFor(() => assert.equal(comboboxInput.value, ""));
  assert.equal(
    document.querySelectorAll("[data-select-listbox] [data-select-option][data-selected=\"true\"]").length,
    0,
    "Combobox compatibility wrapper clear must remove Select selected option state and selected check.",
  );
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
    value: "ana",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    open: true,
  }));
  const selectedComboboxOption = getComboboxRole("option", { name: /ana sosa/i });
  assert.equal(selectedComboboxOption.getAttribute("data-selected"), "true");
  assert.equal(selectedComboboxOption.querySelector(".select-control__option-check")?.textContent, "check");
  assert.equal(
    document.querySelectorAll("[data-select-listbox] [data-select-option][data-selected=\"true\"]").length,
    1,
    "Combobox compatibility wrapper must preserve Select single-select semantics.",
  );
  rerenderCombobox(React.createElement(Combobox, {
    label: "Driver",
    state: "loading",
    loadingText: "Loading drivers",
    options: [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Driver" },
    ],
    open: true,
  }));
  assert.equal(comboboxInput.getAttribute("aria-busy"), "true");
  assert.equal(document.querySelector("[data-select-loading]")?.textContent, "Loading drivers");
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
  console.log("interaction listbox overlays passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
