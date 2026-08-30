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
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const {
  CardExpiryInput,
  CardNumberInput,
  CardSecurityCodeInput,
  CodeInput,
  Combobox,
  CountrySelector,
  DatePicker,
  DateRangePicker,
  PhoneInput,
  Select,
  Slider,
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

const selectOptions = [
  { label: "Fleet MX", value: "mx", meta: "MX" },
  { label: "Fleet US", value: "us", meta: "US" },
  { label: "Disabled fleet", value: "disabled", disabled: true },
];

const selectOptionsWithDisabledMiddle = [
  { label: "Fleet MX", value: "mx", meta: "MX" },
  { label: "Disabled fleet", value: "disabled", disabled: true },
  { label: "Fleet US", value: "us", meta: "US" },
];

const countries = [
  { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
  { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
];

try {
  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const view = render(React.createElement(Select, {
      label: "Fleet",
      helper: "Choose a fleet",
      name: "fleet",
      options: selectOptionsWithDisabledMiddle,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const trigger = view.getByRole("combobox", { name: /fleet/i });

    await user.click(trigger);
    assert.deepEqual(openChanges.at(-1), { open: true, eventType: "click", key: undefined });
    assert.equal(trigger.getAttribute("aria-activedescendant"), null);
    assert.equal(view.container.querySelectorAll('.select-control__option[data-active="true"]').length, 0);
    assert.equal(view.container.querySelectorAll('.select-control__option[data-selected="true"]').length, 0);
    fireEvent.keyDown(trigger, { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.equal(view.container.querySelector("[data-select-input]").value, "");
    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    await waitFor(() => assert.match(trigger.getAttribute("aria-activedescendant") || "", /option-0/));
    assert.equal(view.container.querySelectorAll('.select-control__option[data-active="true"]').length, 1);
    assert.equal(view.container.querySelectorAll('.select-control__option[data-selected="true"]').length, 0);
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    assert.match(trigger.getAttribute("aria-activedescendant") || "", /option-2/);
    assert.equal(view.getByRole("option", { name: /disabled fleet/i }).getAttribute("data-active"), "false");
    fireEvent.keyDown(trigger, { key: "Enter" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(changes.at(-1), { value: "us", meta: { label: "Fleet US", meta: "US" }, eventType: "keydown" });
    assert.equal(view.container.querySelector("[data-select-input]").value, "us");

    await user.click(trigger);
    await user.click(view.getByRole("option", { name: /disabled fleet/i }));
    assert.equal(view.container.querySelector("[data-select-input]").value, "us");
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await user.click(view.getByRole("option", { name: /fleet us/i }));
    assert.deepEqual(changes.at(-1), { value: "us", meta: { label: "Fleet US", meta: "US" }, eventType: "click" });
    assert.equal(view.container.querySelector("[data-select-input]").value, "us");

    view.rerender(React.createElement(Select, {
      label: "Fleet",
      options: selectOptionsWithDisabledMiddle,
      value: "mx",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    await user.click(trigger);
    await user.click(view.getByRole("option", { name: /fleet us/i }));
    assert.equal(changes.at(-1).value, "us");
    assert.match(trigger.textContent, /Fleet MX/);

    view.rerender(React.createElement(Select, {
      label: "Fleet",
      options: selectOptionsWithDisabledMiddle,
      disabled: true,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
    }));
    const before = openChanges.length;
    await user.click(trigger);
    assert.equal(openChanges.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const openChanges = [];
    const outsideButton = globalThis.document.createElement("button");
    outsideButton.textContent = "Outside date picker";
    globalThis.document.body.appendChild(outsideButton);
    const view = render(React.createElement(DatePicker, {
      label: "Service date",
      value: "2026-01-15",
      locale: "es-MX",
      weekdays: ["L", "M", "X", "J", "V", "S", "D"],
      monthSelectLabel: "Seleccionar mes",
      yearSelectLabel: "Seleccionar año",
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
    }));
    const trigger = view.getByRole("button", { name: /service date/i });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2026-01-15"));
    assert.equal(view.container.querySelectorAll('[data-date-picker-day]:not([tabindex="-1"])').length, 1);
    assert.deepEqual([...view.container.querySelectorAll(".date-picker__weekday")].map((node) => node.textContent), ["L", "M", "X", "J", "V", "S", "D"]);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "ArrowRight" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2026-01-16"));
    assert.equal(view.container.querySelector('[data-date-picker-day="2026-01-16"]').getAttribute("tabindex"), "0");
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Home" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2026-01-01"));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "ArrowLeft" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2025-12-31"));
    assert.match(view.container.querySelector("[data-date-picker-month]").textContent, /diciembre de 2025/i);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "End" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2025-12-31"));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "PageDown" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2026-01-31"));
    assert.match(view.container.querySelector("[data-date-picker-month]").textContent, /enero de 2026/i);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "PageDown", shiftKey: true });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2027-01-31"));
    assert.match(view.container.querySelector("[data-date-picker-month]").textContent, /enero de 2027/i);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "PageUp", shiftKey: true });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2026-01-31"));
    assert.match(view.container.querySelector("[data-date-picker-month]").textContent, /enero de 2026/i);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Tab" });
    await waitFor(() => assert.match(globalThis.document.activeElement?.getAttribute("aria-label") ?? "", /seleccionar mes/i));
    await user.tab();
    await waitFor(() => assert.match(globalThis.document.activeElement?.getAttribute("aria-label") ?? "", /seleccionar año/i));
    await user.keyboard("{Enter}");
    await waitFor(() => assert.equal(globalThis.document.activeElement?.getAttribute("aria-expanded"), "true"));
    await user.click(view.getByRole("option", { name: "2027" }));
    assert.match(view.container.querySelector("[data-date-picker-month]").textContent, /enero de 2027/i);
    view.container.querySelector('[data-date-picker-day="2027-01-31"]').focus();
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Tab", shiftKey: true });
    await waitFor(() => assert.match(globalThis.document.activeElement?.getAttribute("aria-label") ?? "", /seleccionar año/i));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Tab", shiftKey: true });
    await waitFor(() => assert.match(globalThis.document.activeElement?.getAttribute("aria-label") ?? "", /seleccionar mes/i));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Tab", shiftKey: true });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.datePickerDay, "2027-01-31"));
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Tab" });
    await waitFor(() => assert.match(globalThis.document.activeElement?.getAttribute("aria-label") ?? "", /seleccionar mes/i));
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await user.keyboard("{Escape}");
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await user.click(outsideButton);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "mousedown", key: undefined });
    outsideButton.remove();
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const outsideButton = globalThis.document.createElement("button");
    outsideButton.textContent = "Outside combobox";
    globalThis.document.body.appendChild(outsideButton);
    const view = render(React.createElement(Combobox, {
      label: "Depot",
      placeholder: "Search depots",
      clearSelectionLabel: "Clear depot",
      options: selectOptions,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("combobox", { name: /depot/i });

    await user.click(input);
    assert.deepEqual(openChanges.at(-1), { open: true, eventType: "focus", key: undefined });
    assert.equal(input.getAttribute("aria-activedescendant"), null);
    assert.equal(view.container.querySelectorAll('.combobox__option[data-active="true"]').length, 0);
    assert.equal(view.container.querySelectorAll('.combobox__option[data-selected="true"]').length, 0);
    await user.click(outsideButton);
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "mousedown", key: undefined });
    await user.click(input);
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "true"));
    fireEvent.keyDown(input, { key: "Tab" });
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "false"));
    assert.equal(input.getAttribute("aria-activedescendant"), null);
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Tab" });
    await user.click(input);
    await user.type(input, "US");
    assert.equal(changes.at(-1).value, "US");
    assert.equal(input.getAttribute("aria-activedescendant"), null);
    await user.keyboard("{ArrowDown}");
    assert.match(input.getAttribute("aria-activedescendant") || "", /option-1/);
    assert.equal(view.container.querySelectorAll('.combobox__option[data-active="true"]').length, 1);
    assert.equal(view.container.querySelectorAll('.combobox__option[data-selected="true"]').length, 0);
    await user.keyboard("{Enter}");
    assert.equal(changes.at(-1).value, "us");
    assert.equal(input.value, "Fleet US");

    await user.tab();
    assert.equal(globalThis.document.activeElement, view.getByRole("button", { name: /clear depot/i }));
    await user.keyboard("{Enter}");
    assert.equal(changes.at(-1).meta.cleared, true);
    assert.equal(globalThis.document.activeElement, input);
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "true"));
    await user.keyboard("{ArrowDown}");
    assert.match(input.getAttribute("aria-activedescendant") || "", /option-0/);
    await user.keyboard("{Escape}");
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "false"));

    view.rerender(React.createElement(Combobox, {
      label: "Depot",
      options: selectOptions,
      value: "mx",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "Fleet MX"));
    await user.click(input);
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "true"));
    fireEvent.keyDown(input, { key: "ArrowDown" });
    await waitFor(() => assert.match(input.getAttribute("aria-activedescendant") || "", /option-1/));
    fireEvent.keyDown(input, { key: "ArrowUp" });
    await waitFor(() => assert.match(input.getAttribute("aria-activedescendant") || "", /option-0/));
    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "false"));
    await user.click(input);
    await user.click(view.getByRole("option", { name: /fleet us/i }));
    await waitFor(() => assert.equal(input.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(changes.at(-1), { value: "us", meta: { label: "Fleet US", meta: "US", inputValue: "Fleet US" }, eventType: "click" });
    fireEvent.change(input, { target: { value: "free text" } });
    assert.equal(changes.at(-1).value, "free text");
    assert.equal(input.value, "free text");
    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => assert.equal(input.value, "Fleet MX"));

    view.rerender(React.createElement(Combobox, {
      label: "Depot",
      options: selectOptions,
      disabled: true,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
    }));
    const before = openChanges.length;
    await user.click(input);
    assert.equal(openChanges.length, before);
    await assertNoAxeViolations(view.container);
    outsideButton.remove();
    cleanup();
  }

  {
    const user = createUser();
    const openChanges = [];
    const outsideButton = globalThis.document.createElement("button");
    outsideButton.textContent = "Outside date range picker";
    globalThis.document.body.appendChild(outsideButton);
    const view = render(React.createElement(DateRangePicker, {
      label: "Billing window",
      value: { from: "2026-02-10", to: "" },
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
    }));
    const trigger = view.getByRole("button", { name: /billing window/i });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await waitFor(() => assert.equal(globalThis.document.activeElement?.dataset?.dateRangePickerDay, "2026-02-10"));
    assert.equal(view.container.querySelectorAll('[data-date-range-picker-day]:not([tabindex="-1"])').length, 1);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "ArrowDown" });
    assert.equal(globalThis.document.activeElement?.dataset?.dateRangePickerDay, "2026-02-17");
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Tab" });
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.equal(globalThis.document.activeElement?.classList.contains("date-picker__selector-trigger"), true);
    fireEvent.keyDown(globalThis.document.activeElement, { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Escape" });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await user.click(outsideButton);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "mousedown", key: undefined });
    outsideButton.remove();
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const outsideButton = globalThis.document.createElement("button");
    outsideButton.textContent = "Outside country selector";
    globalThis.document.body.appendChild(outsideButton);
    const view = render(React.createElement(CountrySelector, {
      label: "Country code",
      countries,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
      onValueChange: (countryCode, country, event) => changes.push({ countryCode, country, eventType: event.type }),
    }));
    const trigger = view.getByRole("combobox", { name: /country code/i });

    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.equal(trigger.getAttribute("aria-activedescendant"), null);
    await user.click(trigger);
    assert.deepEqual(openChanges.at(-1), { open: true, eventType: "click", key: undefined });
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await user.click(outsideButton);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "mousedown", key: undefined });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    await user.tab();
    const tabSearchbox = view.getByRole("searchbox", { name: /country code search/i });
    assert.equal(globalThis.document.activeElement, tabSearchbox);
    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await user.tab();
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Tab" });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const unitedStatesOption = view.getByRole("option", { name: /United States/ });
    assert.equal(trigger.getAttribute("aria-activedescendant"), unitedStatesOption.id);
    assert.equal(unitedStatesOption.getAttribute("data-active"), "true");
    fireEvent.keyDown(view.getByRole("searchbox", { name: /country code search/i }), { key: "Tab" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(openChanges.at(-1), { open: false, eventType: "keydown", key: "Tab" });

    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    const mexicoOption = view.getByRole("option", { name: /Mexico/ });
    assert.equal(trigger.getAttribute("aria-activedescendant"), mexicoOption.id);
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.equal(changes.at(-1).countryCode, "US");
    assert.equal(unitedStatesOption.getAttribute("data-selected"), "true");
    assert.equal(trigger.getAttribute("aria-activedescendant"), null);
    await user.click(trigger);
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "true"));
    const searchbox = view.getByRole("searchbox", { name: /country code search/i });
    fireEvent.change(searchbox, { target: { value: "+52" } });
    assert.equal(trigger.getAttribute("aria-activedescendant"), mexicoOption.id);
    assert.equal(mexicoOption.getAttribute("data-active"), "true");
    fireEvent.keyDown(searchbox, { key: "Enter" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.equal(globalThis.document.activeElement, trigger);
    assert.equal(changes.at(-1).countryCode, "MX");
    await user.click(trigger);
    fireEvent.keyDown(searchbox, { key: "Escape" });
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.equal(globalThis.document.activeElement, trigger);
    await user.click(trigger);
    await user.click(view.getByRole("option", { name: /United States/ }));
    await waitFor(() => assert.equal(trigger.getAttribute("aria-expanded"), "false"));
    assert.equal(globalThis.document.activeElement, trigger);
    assert.equal(changes.at(-1).countryCode, "US");
    assert.equal(view.container.querySelector("[data-country-selector]").dataset.country, "US");

    view.rerender(React.createElement(CountrySelector, {
      label: "Country code",
      countries,
      country: "MX",
      onValueChange: (countryCode, country, event) => changes.push({ countryCode, country, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(view.container.querySelector("[data-country-selector]").dataset.country, "MX"));
    await user.click(trigger);
    await user.click(view.getByRole("option", { name: /United States/ }));
    assert.equal(changes.at(-1).countryCode, "US");
    assert.equal(view.container.querySelector("[data-country-selector]").dataset.country, "MX");

    view.rerender(React.createElement(CountrySelector, {
      label: "Country code",
      countries,
      disabled: true,
      onOpenChange: (open, event) => openChanges.push({ open, eventType: event?.type, key: event?.key }),
    }));
    const before = openChanges.length;
    await user.click(trigger);
    assert.equal(openChanges.length, before);
    await assertNoAxeViolations(view.container);
    outsideButton.remove();
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const view = render(React.createElement(DatePicker, {
      label: "Service date",
      value: "2026-01-15",
      open: true,
      min: "2026-01-10",
      max: "2026-01-25",
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, event) => changes.push({ value, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /service date/i });
    const blockedDay = view.container.querySelector('[data-date-picker-day="2026-01-05"]');
    const validDay = view.container.querySelector('[data-date-picker-day="2026-01-20"]');

    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.equal(blockedDay.disabled, true);
    await user.click(validDay);
    assert.deepEqual(changes.at(-1), { value: "2026-01-20", eventType: "click" });
    assert.equal(openChanges.at(-1), false);

    view.rerender(React.createElement(DatePicker, {
      label: "Service date",
      value: "2026-01-15",
      disabled: true,
      onOpenChange: (open) => openChanges.push(open),
    }));
    const before = openChanges.length;
    await user.click(trigger);
    assert.equal(openChanges.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(DatePicker, {
      label: "Keyboard date",
      value: "2026-01-15",
      open: true,
      monthSelectLabel: "Choose month",
      yearSelectLabel: "Choose year",
      previousMonthLabel: "Previous month",
      nextMonthLabel: "Next month",
    }));
    const monthSelector = view.getByRole("button", { name: /choose month/i });
    const yearSelector = view.getByRole("button", { name: /choose year/i });

    fireEvent.keyDown(monthSelector, { key: "Enter" });
    assert.equal(monthSelector.getAttribute("aria-expanded"), "true");
    fireEvent.keyDown(monthSelector, { key: "ArrowDown" });
    assert.equal(view.container.querySelector(".date-picker__selector-option[data-active='true']")?.textContent, "February");
    fireEvent.keyDown(monthSelector, { key: "ArrowLeft" });
    assert.equal(view.container.querySelector(".date-picker__selector-option[data-active='true']")?.textContent, "January");
    fireEvent.keyDown(monthSelector, { key: "ArrowRight" });
    assert.equal(view.container.querySelector(".date-picker__selector-option[data-active='true']")?.textContent, "February");
    fireEvent.keyDown(monthSelector, { key: "Enter" });
    assert.match(view.container.querySelector("[data-date-picker-month]")?.textContent ?? "", /February 2026/);

    fireEvent.keyDown(yearSelector, { key: "Enter" });
    assert.equal(yearSelector.getAttribute("aria-expanded"), "true");
    fireEvent.keyDown(yearSelector, { key: "ArrowDown" });
    assert.equal(view.container.querySelector(".date-picker__selector-option[data-active='true']")?.textContent, "2027");
    fireEvent.keyDown(yearSelector, { key: "ArrowLeft" });
    assert.equal(view.container.querySelector(".date-picker__selector-option[data-active='true']")?.textContent, "2026");
    fireEvent.keyDown(yearSelector, { key: "ArrowRight" });
    assert.equal(view.container.querySelector(".date-picker__selector-option[data-active='true']")?.textContent, "2027");
    fireEvent.keyDown(yearSelector, { key: "Enter" });
    assert.match(view.container.querySelector("[data-date-picker-month]")?.textContent ?? "", /February 2027/);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const changes = [];
    const openChanges = [];
    const view = render(React.createElement(DateRangePicker, {
      label: "Keyboard billing window",
      value: { from: "2026-02-10", to: "" },
      open: true,
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, event) => changes.push({ value, eventType: event.type, key: event.key }),
    }));
    const endDay = view.container.querySelector('[data-date-range-picker-day="2026-02-15"]');

    fireEvent.keyDown(endDay, { key: "Enter" });
    assert.deepEqual(changes.at(-1), {
      value: { from: "2026-02-10", to: "2026-02-15" },
      eventType: "keydown",
      key: "Enter",
    });
    assert.equal(openChanges.at(-1), false);

    view.rerender(React.createElement(DateRangePicker, {
      label: "Keyboard billing window",
      value: { from: "2026-02-10", to: "" },
      open: true,
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, event) => changes.push({ value, eventType: event.type, key: event.key }),
    }));

    fireEvent.keyDown(view.container.querySelector('[data-date-range-picker-day="2026-02-15"]'), { key: " " });
    assert.deepEqual(changes.at(-1), {
      value: { from: "2026-02-10", to: "2026-02-15" },
      eventType: "keydown",
      key: " ",
    });
    assert.equal(openChanges.at(-1), false);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const view = render(React.createElement(DatePicker, {
      label: "Reporting range",
      mode: "range",
      value: { from: "2026-02-10", to: "" },
      open: true,
      presets: true,
      presetItems: [{ key: "last-7", label: "Last 7 days", days: 7 }],
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, event) => changes.push({ value, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /reporting range/i });
    const endDay = view.container.querySelector('[data-date-range-picker-day="2026-02-15"]');

    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    assert.equal(view.container.querySelector("[data-mode]")?.getAttribute("data-mode"), "range");
    assert.ok(view.container.querySelector(".date-range-picker__preset"));
    await user.click(endDay);
    assert.deepEqual(changes.at(-1), { value: { from: "2026-02-10", to: "2026-02-15" }, eventType: "click" });
    assert.equal(openChanges.at(-1), false);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const view = render(React.createElement(DateRangePicker, {
      label: "Billing window",
      value: { from: "2026-02-10", to: "" },
      open: true,
      presets: true,
      presetItems: [{ key: "last-7", label: "Last 7 days", days: 7 }],
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, event) => changes.push({ value, eventType: event.type }),
    }));
    const trigger = view.getByRole("button", { name: /billing window/i });
    const endDay = view.container.querySelector('[data-date-range-picker-day="2026-02-15"]');

    assert.equal(trigger.getAttribute("aria-expanded"), "true");
    await user.click(endDay);
    assert.deepEqual(changes.at(-1), { value: { from: "2026-02-10", to: "2026-02-15" }, eventType: "click" });
    assert.equal(openChanges.at(-1), false);

    view.rerender(React.createElement(DateRangePicker, {
      label: "Billing window",
      disabled: true,
      onOpenChange: (open) => openChanges.push(open),
    }));
    const before = openChanges.length;
    await user.click(trigger);
    assert.equal(openChanges.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const outsideButton = globalThis.document.createElement("button");
    outsideButton.textContent = "Outside phone input";
    globalThis.document.body.appendChild(outsideButton);
    const view = render(React.createElement(PhoneInput, {
      label: "Mobile phone",
      countries,
      country: "MX",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /mobile phone/i });
    const countryTrigger = view.getByRole("combobox", { name: /mobile phone/i });

    await user.type(input, "5512345678");
    assert.equal(input.value, "55 1234 5678");
    assert.equal(changes.at(-1).value, "5512345678");
    assert.equal(changes.at(-1).meta.e164, "+525512345678");

    await user.click(countryTrigger);
    await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "true"));
    await user.click(view.getByRole("option", { name: /United States/ }));
    assert.equal(changes.at(-1).meta.country, "US");
    assert.equal(changes.at(-1).meta.e164, "+15512345678");
    assert.equal(view.container.querySelector("[data-country-selector]").dataset.country, "US");

    await user.click(countryTrigger);
    await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "true"));
    fireEvent.keyDown(countryTrigger, { key: "Tab" });
    const phoneCountrySearchbox = view.getByRole("searchbox", { name: /search country or code/i });
    assert.equal(globalThis.document.activeElement, phoneCountrySearchbox);
    assert.equal(countryTrigger.getAttribute("aria-expanded"), "true");
    fireEvent.keyDown(phoneCountrySearchbox, { key: "Tab" });
    await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "false"));

    await user.click(countryTrigger);
    await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "true"));
    await user.click(outsideButton);
    await waitFor(() => assert.equal(countryTrigger.getAttribute("aria-expanded"), "false"));

    view.rerender(React.createElement(PhoneInput, {
      label: "Mobile phone",
      countries,
      value: "+525512345678",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "55 1234 5678"));
    fireEvent.change(input, { target: { value: "1199999999" } });
    assert.equal(changes.at(-1).value, "1199999999");
    assert.equal(input.value, "55 1234 5678");

    view.rerender(React.createElement(PhoneInput, {
      label: "Mobile phone",
      countries,
      disabled: true,
      value: "+525512345678",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const before = changes.length;
    await user.click(input);
    await user.keyboard("0000");
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    outsideButton.remove();
    cleanup();
  }

  {
    const changes = [];
    const view = render(React.createElement(Slider, {
      label: "Search radius",
      min: 0,
      max: 20,
      step: 2,
      name: "radius",
      unit: " km",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const slider = view.getByRole("slider", { name: /search radius/i });
    const root = view.container.querySelector(".slider");

    fireEvent.change(slider, { target: { value: "12" } });
    await waitFor(() => assert.equal(slider.value, "12"));
    assert.equal(root.dataset.value, "12");
    assert.equal(root.style.getPropertyValue("--comp-slider-percent"), "60%");
    assert.equal(view.container.querySelector("[data-slider-output]")?.nodeName, "OUTPUT");
    assert.deepEqual(changes.at(-1), {
      value: 12,
      meta: { name: "radius", min: 0, max: 20, step: 2, unit: " km" },
      eventType: "change",
    });

    fireEvent.pointerDown(slider);
    assert.equal(root.dataset.state, "pressed");
    assert.equal(root.dataset.dragging, "true");
    fireEvent.pointerUp(slider);
    await waitFor(() => assert.notEqual(root.dataset.state, "pressed"));
    await waitFor(() => assert.equal(root.dataset.dragging, undefined));

    view.rerender(React.createElement(Slider, {
      label: "Search radius",
      value: 8,
      min: 0,
      max: 20,
      step: 2,
      name: "radius",
      unit: " km",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(slider.value, "8"));
    fireEvent.change(slider, { target: { value: "16" } });
    assert.deepEqual(changes.at(-1), {
      value: 16,
      meta: { name: "radius", min: 0, max: 20, step: 2, unit: " km" },
      eventType: "change",
    });
    await waitFor(() => assert.equal(slider.value, "8"));

    view.rerender(React.createElement(Slider, {
      label: "Search radius",
      value: 99,
      min: 0,
      max: 20,
      step: 2,
      unit: " km",
    }));
    await waitFor(() => assert.equal(slider.value, "20"));
    assert.equal(root.dataset.value, "20");
    assert.equal(slider.getAttribute("aria-valuetext"), "20 km");

    view.rerender(React.createElement(Slider, {
      label: "Search radius",
      min: 0,
      max: 20,
      disabled: true,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const before = changes.length;
    assert.equal(slider.disabled, true);
    assert.equal(root.dataset.state, "disabled");
    fireEvent.change(slider, { target: { value: "14" } });
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const completions = [];
    const view = render(React.createElement(CodeInput, {
      label: "Security code",
      length: 4,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
      onComplete: (value, meta, event) => completions.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /security code/i });
    const root = view.container.querySelector(".code-input");

    await user.type(input, "12ab345");
    assert.equal(input.value, "1234");
    assert.equal(changes.at(-1).meta.complete, true);
    assert.equal(completions.at(-1).value, "1234");
    fireEvent.change(input, { target: { value: "98-76 54" } });
    assert.equal(input.value, "9876");
    assert.equal(changes.at(-1).value, "9876");
    assert.equal(completions.at(-1).value, "9876");
    assert.equal(root.dataset.state, "complete");
    assert.equal(root.dataset.focused, "true");
    assert.equal(view.container.querySelectorAll('.code-input__slot[data-filled="true"]').length, 4);
    assert.equal(view.container.querySelectorAll('.code-input__slot[data-active="true"]').length, 1);
    fireEvent.blur(input);
    assert.equal(root.dataset.focused, "false");

    view.rerender(React.createElement(CodeInput, {
      label: "Security code",
      length: 4,
      value: "9999",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "9999"));
    fireEvent.change(input, { target: { value: "1111" } });
    assert.equal(changes.at(-1).value, "1111");
    assert.equal(input.value, "9999");

    view.rerender(React.createElement(CodeInput, {
      label: "Security code",
      length: 4,
      value: "12",
      error: "Invalid security code",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "12"));
    const error = view.getByText("Invalid security code");
    assert.equal(root.dataset.state, "error");
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.equal(error.getAttribute("role"), "alert");

    view.rerender(React.createElement(CodeInput, {
      label: "Security code",
      length: 4,
      value: "9876",
      state: "success",
      helper: "Code accepted",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "9876"));
    assert.equal(root.dataset.state, "success");
    assert.equal(view.getByText("Code accepted").getAttribute("role"), "status");

    view.rerender(React.createElement(CodeInput, {
      label: "Security code",
      length: 4,
      disabled: true,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const before = changes.length;
    await user.click(input);
    await user.keyboard("2222");
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(CardNumberInput, {
      label: "Card number",
      validationMessage: "Invalid card number",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /card number/i });
    const root = view.container.querySelector(".card-number-input");

    fireEvent.change(input, { target: { value: "4111111111111111" } });
    assert.equal(input.value, "4111 1111 1111 1111");
    assert.equal(changes.at(-1).value, "4111111111111111");
    assert.equal(changes.at(-1).meta.brand, "Visa");
    assert.equal(changes.at(-1).meta.validity, "valid");
    assert.equal(root.dataset.state, "valid");
    assert.equal(root.dataset.brand, "Visa");
    assert.equal(root.dataset.validity, "valid");

    fireEvent.change(input, { target: { value: "4111111111111112" } });
    const invalidNumber = view.getByText("Invalid card number");
    assert.equal(root.dataset.state, "error");
    assert.equal(root.dataset.validity, "invalid");
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.equal(invalidNumber.getAttribute("role"), "alert");

    view.rerender(React.createElement(CardNumberInput, {
      label: "Card number",
      value: "5555555555554444",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "5555 5555 5555 4444"));
    fireEvent.change(input, { target: { value: "4111111111111111" } });
    assert.equal(changes.at(-1).value, "4111111111111111");
    assert.equal(input.value, "5555 5555 5555 4444");

    view.rerender(React.createElement(CardNumberInput, {
      label: "Card number",
      value: "5555555555554444",
      loading: true,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const beforeLoading = changes.length;
    assert.equal(input.disabled, true);
    assert.equal(root.dataset.state, "loading");
    await user.click(input);
    await user.keyboard("4111111111111111");
    assert.equal(changes.length, beforeLoading);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      validationMessage: "Invalid expiry",
      expiredMessage: "Expired",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /expiry date/i });
    const root = view.container.querySelector(".card-expiry-input");

    fireEvent.change(input, { target: { value: "1299" } });
    assert.equal(input.value, "12/99");
    assert.equal(changes.at(-1).value, "12/99");
    assert.equal(changes.at(-1).meta.validity, "valid");
    assert.equal(changes.at(-1).meta.month, "12");
    assert.equal(changes.at(-1).meta.year, "99");
    assert.equal(root.dataset.state, "valid");
    assert.equal(root.dataset.validity, "valid");

    view.rerender(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      value: "0126",
      validationMessage: "Invalid expiry",
      expiredMessage: "Expired",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "01/26"));
    fireEvent.change(input, { target: { value: "1399" } });
    assert.equal(changes.at(-1).meta.validity, "invalid");
    assert.equal(input.value, "01/26");

    view.rerender(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      value: "1326",
      validationMessage: "Invalid expiry",
      expiredMessage: "Expired",
    }));
    await waitFor(() => assert.equal(input.value, "13/26"));
    const invalidExpiry = view.getByText("Invalid expiry");
    assert.equal(root.dataset.state, "error");
    assert.equal(root.dataset.validity, "invalid");
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.equal(invalidExpiry.getAttribute("role"), "alert");

    view.rerender(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      value: "0120",
      validationMessage: "Invalid expiry",
      expiredMessage: "Expired",
    }));
    await waitFor(() => assert.equal(input.value, "01/20"));
    assert.equal(view.getByText("Expired").getAttribute("role"), "alert");
    assert.equal(root.dataset.validity, "expired");

    view.rerender(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      value: "1299",
      loading: true,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const beforeLoading = changes.length;
    assert.equal(input.disabled, true);
    assert.equal(root.dataset.state, "loading");
    await user.click(input);
    await user.keyboard("1129");
    assert.equal(changes.length, beforeLoading);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const revealChanges = [];
    const view = render(React.createElement(CardSecurityCodeInput, {
      label: "Security code",
      expectedLength: 4,
      revealLabel: "Show security code",
      hideLabel: "Hide security code",
      onRevealChange: (revealed) => revealChanges.push(revealed),
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByLabelText(/^Security code$/i);
    const root = view.container.querySelector(".card-security-code-input");

    fireEvent.change(input, { target: { value: "12a345" } });
    assert.equal(input.value, "1234");
    assert.equal(changes.at(-1).meta.complete, true);
    assert.equal(changes.at(-1).meta.expectedLength, 4);
    assert.equal(root.dataset.state, "valid");
    assert.equal(root.dataset.validity, "valid");
    assert.equal(root.dataset.length, "4");

    fireEvent.change(input, { target: { value: "12345" } });
    assert.equal(input.value, "1234");
    assert.equal(changes.at(-1).meta.complete, true);
    assert.equal(changes.at(-1).meta.expectedLength, 4);
    assert.equal(root.dataset.state, "valid");
    assert.equal(root.dataset.validity, "valid");
    assert.equal(root.dataset.length, "4");
    assert.equal(input.type, "password");
    await user.click(view.getByRole("button", { name: /show security code/i }));
    assert.equal(revealChanges.at(-1), true);
    assert.equal(input.type, "text");
    assert.equal(view.getByRole("button", { name: /hide security code/i }).getAttribute("aria-pressed"), "true");

    view.rerender(React.createElement(CardSecurityCodeInput, {
      label: "Security code",
      value: "999",
      revealed: false,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "999"));
    fireEvent.change(input, { target: { value: "111" } });
    assert.equal(changes.at(-1).value, "111");
    assert.equal(input.value, "999");

    view.rerender(React.createElement(CardSecurityCodeInput, {
      label: "Security code",
      value: "12",
      error: "Invalid security code",
      revealLabel: "Show security code",
      hideLabel: "Hide security code",
    }));
    await waitFor(() => assert.equal(input.value, "12"));
    const securityError = view.getByText("Invalid security code");
    assert.equal(root.dataset.state, "error");
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.equal(securityError.getAttribute("role"), "alert");

    view.rerender(React.createElement(CardSecurityCodeInput, {
      label: "Security code",
      value: "999",
      loading: true,
      revealed: false,
      revealLabel: "Show security code",
      hideLabel: "Hide security code",
      onRevealChange: (revealed) => revealChanges.push(revealed),
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const beforeLoading = changes.length;
    const revealButton = view.getByRole("button", { name: /show security code/i });
    assert.equal(input.disabled, true);
    assert.equal(revealButton.disabled, true);
    assert.equal(root.dataset.state, "loading");
    await user.click(revealButton);
    await user.click(input);
    await user.keyboard("111");
    assert.equal(changes.length, beforeLoading);
    await assertNoAxeViolations(view.container);
    cleanup();
  }
} finally {
  cleanup();
}

console.log("react P0 forms batch 2 production tests passed");
