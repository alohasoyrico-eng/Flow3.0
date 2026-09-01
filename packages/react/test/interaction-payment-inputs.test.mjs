import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  CardExpiryInput,
  CardNumberInput,
  CardSecurityCodeInput,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
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
  console.log("interaction payment inputs passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
