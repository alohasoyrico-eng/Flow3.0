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
const { Checkbox, Input, RadioButton, Slider, Switch, TextArea } = await import("../dist/index.js");

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
    const view = render(React.createElement(Input, {
      label: "Vehicle plate",
      helper: "Use fleet format",
      name: "plate",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const field = view.getByRole("textbox", { name: /vehicle plate/i });

    await user.type(field, "MX-900");
    assert.equal(field.value, "MX-900");
    assert.equal(changes.at(-1).value, "MX-900");
    assert.equal(changes.at(-1).meta.rawValue, "MX-900");
    assert.equal(changes.at(-1).eventType, "change");

    view.rerender(React.createElement(Input, {
      label: "Vehicle plate",
      name: "plate",
      value: "LOCKED",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(field.value, "LOCKED"));
    fireEvent.change(field, { target: { value: "FREE" } });
    assert.equal(changes.at(-1).value, "FREE");
    assert.equal(field.value, "LOCKED");

    view.rerender(React.createElement(Input, {
      label: "Vehicle plate",
      disabled: true,
      value: "DISABLED",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    assert.equal(view.container.querySelector(".field")?.dataset.state, "disabled");
    await user.click(field);
    await user.keyboard("X");
    assert.equal(field.value, "DISABLED");

    view.rerender(React.createElement(Input, {
      label: "Vehicle plate",
      loading: true,
      value: "SAVING",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    assert.equal(view.container.querySelector(".field")?.dataset.state, "loading");
    assert.equal(field.disabled, true);
    assert.equal(field.getAttribute("aria-busy"), "true");
    assert.equal(view.container.querySelector(".spinner")?.classList.contains("field__icon--loading"), true);
    assert.notEqual(view.container.querySelector(".field")?.dataset.state, "disabled");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Input, {
      label: "Driver email",
      helper: "Looks good",
      state: "success",
      value: "driver@example.com",
      live: true,
    }));
    const field = view.getByRole("textbox", { name: /driver email/i });
    const message = view.getByText("Looks good");

    assert.equal(field.getAttribute("aria-invalid"), null);
    assert.equal(field.getAttribute("aria-describedby"), message.id);
    assert.equal(message.getAttribute("data-state"), "success");
    assert.equal(message.getAttribute("role"), "status");

    view.rerender(React.createElement(Input, {
      label: "Driver email",
      helper: "Domain is unusual",
      state: "warning",
      value: "driver@example.test",
      live: true,
    }));
    const warning = view.getByText("Domain is unusual");
    assert.equal(field.getAttribute("aria-invalid"), null);
    assert.equal(warning.getAttribute("data-state"), "warning");
    assert.equal(warning.getAttribute("role"), "status");

    view.rerender(React.createElement(Input, {
      label: "Driver email",
      helper: "We will verify this address",
      state: "info",
      value: "driver@example.test",
    }));
    const info = view.getByText("We will verify this address");
    assert.equal(field.getAttribute("aria-invalid"), null);
    assert.equal(info.getAttribute("data-state"), "info");
    assert.equal(info.getAttribute("role"), null);

    view.rerender(React.createElement(Input, {
      label: "Driver email",
      error: "Use a valid company email",
      value: "driver@example.test",
    }));
    const error = view.getByText("Use a valid company email");
    assert.equal(field.getAttribute("aria-invalid"), "true");
    assert.equal(error.getAttribute("data-state"), "error");
    assert.equal(error.getAttribute("role"), "alert");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(TextArea, {
      label: "Driver notes",
      helper: "Visible to operations",
      maxLength: 30,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const field = view.getByRole("textbox", { name: /driver notes/i });

    await user.type(field, "Ready");
    assert.equal(field.value, "Ready");
    assert.deepEqual(changes.at(-1), { value: "Ready", meta: { maxLength: 30, length: 5 }, eventType: "change" });
    assert.match(view.getByText("5/30").textContent, /5\/30/);

    view.rerender(React.createElement(TextArea, {
      label: "Driver notes",
      value: "Controlled",
      maxLength: 30,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(field.value, "Controlled"));
    fireEvent.change(field, { target: { value: "Next" } });
    assert.equal(changes.at(-1).value, "Next");
    assert.equal(field.value, "Controlled");

    view.rerender(React.createElement(TextArea, {
      label: "Driver notes",
      disabled: true,
      value: "Disabled",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    fireEvent.change(field, { target: { value: "Ignored" } });
    assert.equal(field.value, "Disabled");
    assert.notEqual(changes.at(-1).value, "Ignored");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(Checkbox, {
      label: "Enable fuel card",
      description: "Applies to this driver",
      value: "fuel-card",
      indeterminate: true,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    const field = view.getByRole("checkbox", { name: /enable fuel card/i });

    assert.equal(field.getAttribute("aria-checked"), "mixed");
    await user.click(field);
    assert.deepEqual(changes.at(-1), { checked: true, meta: { indeterminate: false, value: "fuel-card" }, eventType: "change" });
    assert.equal(field.checked, true);
    assert.equal(field.getAttribute("aria-checked"), "true");

    view.rerender(React.createElement(Checkbox, {
      label: "Enable fuel card",
      value: "fuel-card",
      checked: false,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(field.checked, false));
    field.focus();
    await user.keyboard("{Space}");
    assert.equal(changes.at(-1).checked, true);
    assert.equal(field.checked, false);

    view.rerender(React.createElement(Checkbox, {
      label: "Enable fuel card",
      value: "fuel-card",
      disabled: true,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    const before = changes.length;
    await user.click(field);
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(RadioButton, {
      label: "Card payment",
      name: "payment",
      value: "card",
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    const field = view.getByRole("radio", { name: /card payment/i });

    await user.click(field);
    assert.deepEqual(changes.at(-1), { checked: true, meta: { value: "card" }, eventType: "change" });
    assert.equal(field.checked, true);

    view.rerender(React.createElement(RadioButton, {
      label: "Card payment",
      name: "payment",
      value: "card",
      checked: false,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(field.checked, false));
    field.focus();
    await user.keyboard("{Space}");
    assert.equal(changes.at(-1).checked, true);
    assert.equal(field.checked, false);

    view.rerender(React.createElement(RadioButton, {
      label: "Card payment",
      name: "payment",
      value: "card",
      disabled: true,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    const before = changes.length;
    await user.click(field);
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const view = render(React.createElement(Switch, {
      label: "Enable notifications",
      description: "Send route updates",
      name: "notifications",
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    const field = view.getByRole("switch", { name: /enable notifications/i });

    await user.click(field);
    assert.deepEqual(changes.at(-1), { checked: true, meta: { name: "notifications" }, eventType: "change" });
    assert.equal(field.getAttribute("aria-checked"), "true");

    view.rerender(React.createElement(Switch, {
      label: "Enable notifications",
      name: "notifications",
      checked: false,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(field.getAttribute("aria-checked"), "false"));
    field.focus();
    await user.keyboard("{Space}");
    assert.equal(changes.at(-1).checked, true);
    assert.equal(field.getAttribute("aria-checked"), "false");

    view.rerender(React.createElement(Switch, {
      label: "Enable notifications",
      name: "notifications",
      disabled: true,
      onCheckedChange: (checked, meta, event) => changes.push({ checked, meta, eventType: event.type }),
    }));
    const before = changes.length;
    await user.click(field);
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const changes = [];
    const view = render(React.createElement(Slider, {
      label: "Search radius",
      name: "radius",
      min: 0,
      max: 20,
      step: 1,
      unit: " km",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const field = view.getByRole("slider", { name: /search radius/i });

    fireEvent.input(field, { target: { value: "12" } });
    await waitFor(() => assert.equal(field.value, "12"));
    assert.deepEqual(changes.at(-1), { value: 12, meta: { name: "radius", min: 0, max: 20, step: 1, unit: " km" }, eventType: "change" });
    assert.equal(field.getAttribute("aria-valuetext"), "12 km");

    view.rerender(React.createElement(Slider, {
      label: "Search radius",
      name: "radius",
      value: 8,
      min: 0,
      max: 20,
      step: 1,
      unit: " km",
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    await waitFor(() => assert.equal(field.value, "8"));
    fireEvent.input(field, { target: { value: "14" } });
    assert.equal(changes.at(-1).value, 14);
    assert.equal(field.value, "8");

    view.rerender(React.createElement(Slider, {
      label: "Search radius",
      name: "radius",
      disabled: true,
      value: 8,
      onValueChange: (value, meta, event) => changes.push({ value, meta, eventType: event.type }),
    }));
    const before = changes.length;
    fireEvent.input(field, { target: { value: "16" } });
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }
} finally {
  cleanup();
}

console.log("react P0 forms batch 1 production tests passed");
