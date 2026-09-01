import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Input,
  InputAmount,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
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
  await waitFor(() => assert.equal(limitAmountInput.value, "3,000.00"));
  fireEvent.input(limitAmountInput, { target: { value: "50" } });
  assert.equal(inputAmountChanges.at(-1).value, "50");
  assert.equal(limitAmountInput.value, "50");
  fireEvent.blur(limitAmountInput);
  await waitFor(() => assert.equal(limitAmountInput.value, "3,000.00"));

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
  console.log("interaction text fields passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
