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
      options: selectOptions,
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const trigger = view.getByRole("combobox", { name: /fleet/i });

    await user.click(trigger);
    assert.equal(openChanges.at(-1), true);
    await user.click(view.getByRole("option", { name: /fleet us/i }));
    assert.deepEqual(changes.at(-1), { value: "us", meta: { label: "Fleet US", meta: "US" }, eventType: "click" });
    assert.equal(view.container.querySelector("[data-select-input]").value, "us");

    view.rerender(React.createElement(Select, {
      label: "Fleet",
      options: selectOptions,
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
      options: selectOptions,
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
    const openChanges = [];
    const view = render(React.createElement(Combobox, {
      label: "Depot",
      placeholder: "Search depots",
      clearSelectionLabel: "Clear depot",
      options: selectOptions,
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("combobox", { name: /depot/i });

    await user.click(input);
    assert.equal(openChanges.at(-1), true);
    await user.type(input, "US");
    assert.equal(changes.at(-1).value, "US");
    await user.keyboard("{Enter}");
    assert.equal(changes.at(-1).value, "us");
    assert.equal(input.value, "Fleet US");

    await user.click(view.getByRole("button", { name: /clear depot/i }));
    assert.equal(changes.at(-1).meta.cleared, true);

    view.rerender(React.createElement(Combobox, {
      label: "Depot",
      options: selectOptions,
      value: "mx",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "Fleet MX"));
    fireEvent.change(input, { target: { value: "free text" } });
    assert.equal(changes.at(-1).value, "free text");
    assert.equal(input.value, "free text");
    fireEvent.keyDown(input, { key: "Escape" });
    await waitFor(() => assert.equal(input.value, "Fleet MX"));

    view.rerender(React.createElement(Combobox, {
      label: "Depot",
      options: selectOptions,
      disabled: true,
      onOpenChange: (open) => openChanges.push(open),
    }));
    const before = openChanges.length;
    await user.click(input);
    assert.equal(openChanges.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const openChanges = [];
    const view = render(React.createElement(CountrySelector, {
      label: "Country code",
      countries,
      onOpenChange: (open) => openChanges.push(open),
      onValueChange: (countryCode, country, event) => changes.push({ countryCode, country, eventType: event.type }),
    }));
    const trigger = view.getByRole("combobox", { name: /country code/i });

    await user.click(trigger);
    assert.equal(openChanges.at(-1), true);
    await user.click(view.getByRole("option", { name: /United States/ }));
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
    const view = render(React.createElement(PhoneInput, {
      label: "Mobile phone",
      countries,
      country: "MX",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /mobile phone/i });

    await user.type(input, "5512345678");
    assert.equal(input.value, "55 1234 5678");
    assert.equal(changes.at(-1).value, "5512345678");
    assert.equal(changes.at(-1).meta.e164, "+525512345678");

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

    await user.type(input, "12ab345");
    assert.equal(input.value, "1234");
    assert.equal(changes.at(-1).meta.complete, true);
    assert.equal(completions.at(-1).value, "1234");

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
    const changes = [];
    const view = render(React.createElement(CardNumberInput, {
      label: "Card number",
      validationMessage: "Invalid card number",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /card number/i });

    fireEvent.change(input, { target: { value: "4111111111111111" } });
    assert.equal(input.value, "4111 1111 1111 1111");
    assert.equal(changes.at(-1).value, "4111111111111111");
    assert.equal(changes.at(-1).meta.brand, "Visa");
    assert.equal(changes.at(-1).meta.validity, "valid");

    view.rerender(React.createElement(CardNumberInput, {
      label: "Card number",
      value: "5555555555554444",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "5555 5555 5555 4444"));
    fireEvent.change(input, { target: { value: "4111111111111111" } });
    assert.equal(changes.at(-1).value, "4111111111111111");
    assert.equal(input.value, "5555 5555 5555 4444");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const changes = [];
    const view = render(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      validationMessage: "Invalid expiry",
      expiredMessage: "Expired",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const input = view.getByRole("textbox", { name: /expiry date/i });

    fireEvent.change(input, { target: { value: "1299" } });
    assert.equal(input.value, "12/99");
    assert.equal(changes.at(-1).value, "12/99");
    assert.equal(changes.at(-1).meta.validity, "valid");

    view.rerender(React.createElement(CardExpiryInput, {
      label: "Expiry date",
      value: "0126",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "01/26"));
    fireEvent.change(input, { target: { value: "1399" } });
    assert.equal(changes.at(-1).meta.validity, "invalid");
    assert.equal(input.value, "01/26");
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

    fireEvent.change(input, { target: { value: "12345" } });
    assert.equal(input.value, "1234");
    assert.equal(changes.at(-1).meta.complete, true);
    assert.equal(input.type, "password");
    await user.click(view.getByRole("button", { name: /show security code/i }));
    assert.equal(revealChanges.at(-1), true);
    assert.equal(input.type, "text");

    view.rerender(React.createElement(CardSecurityCodeInput, {
      label: "Security code",
      value: "999",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(input.value, "999"));
    fireEvent.change(input, { target: { value: "111" } });
    assert.equal(changes.at(-1).value, "111");
    assert.equal(input.value, "999");
    await assertNoAxeViolations(view.container);
    cleanup();
  }
} finally {
  cleanup();
}

console.log("react P0 forms batch 2 production tests passed");
