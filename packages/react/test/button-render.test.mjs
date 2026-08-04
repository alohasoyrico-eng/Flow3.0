import assert from "node:assert/strict";
import React, { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, Checkbox, CodeInput, DatePicker, IconButton, Input, PhoneInput, RadioButton, Select, Switch, TextArea } from "../src/index.js";
import { buttonPlatformContract, cardExpiryInputPlatformContract, cardNumberInputPlatformContract, cardSecurityCodeInputPlatformContract, checkboxPlatformContract, codeInputPlatformContract, datePickerPlatformContract, iconButtonPlatformContract, inputPlatformContract, phoneInputPlatformContract, radioButtonPlatformContract, selectPlatformContract, switchPlatformContract, textAreaPlatformContract } from "@design-system/components/platforms";

assert.equal(Button.displayName, "Button");
assert.equal(Button.platformContract, buttonPlatformContract);
assert.equal(CardExpiryInput.displayName, "CardExpiryInput");
assert.equal(CardExpiryInput.platformContract, cardExpiryInputPlatformContract);
assert.equal(CardNumberInput.displayName, "CardNumberInput");
assert.equal(CardNumberInput.platformContract, cardNumberInputPlatformContract);
assert.equal(CardSecurityCodeInput.displayName, "CardSecurityCodeInput");
assert.equal(CardSecurityCodeInput.platformContract, cardSecurityCodeInputPlatformContract);
assert.equal(Checkbox.displayName, "Checkbox");
assert.equal(Checkbox.platformContract, checkboxPlatformContract);
assert.equal(CodeInput.displayName, "CodeInput");
assert.equal(CodeInput.platformContract, codeInputPlatformContract);
assert.equal(DatePicker.displayName, "DatePicker");
assert.equal(DatePicker.platformContract, datePickerPlatformContract);
assert.equal(IconButton.displayName, "IconButton");
assert.equal(IconButton.platformContract, iconButtonPlatformContract);
assert.equal(Input.displayName, "Input");
assert.equal(Input.platformContract, inputPlatformContract);
assert.equal(PhoneInput.displayName, "PhoneInput");
assert.equal(PhoneInput.platformContract, phoneInputPlatformContract);
assert.equal(RadioButton.displayName, "RadioButton");
assert.equal(RadioButton.platformContract, radioButtonPlatformContract);
assert.equal(Select.displayName, "Select");
assert.equal(Select.platformContract, selectPlatformContract);
assert.equal(Switch.displayName, "Switch");
assert.equal(Switch.platformContract, switchPlatformContract);
assert.equal(TextArea.displayName, "TextArea");
assert.equal(TextArea.platformContract, textAreaPlatformContract);

const markup = renderToStaticMarkup(React.createElement(Button, {
  label: "Approve",
  variant: "outlined",
  density: "sm",
  state: "pressed",
  icon: "check",
  trailingIcon: "arrow_forward",
  fullWidth: true,
}));

assert.match(markup, /class="button button--outlined"/);
assert.match(markup, /data-density="sm"/);
assert.match(markup, /data-state="pressed"/);
assert.match(markup, /data-full-width="true"/);
assert.match(markup, /class="button__icon"/);
assert.match(markup, /class="button__label">Approve<\/span>/);
assert.match(markup, /button__icon--trailing/);

const loadingMarkup = renderToStaticMarkup(React.createElement(Button, {
  label: "Saving",
  loading: true,
}));

assert.match(loadingMarkup, /disabled=""/);
assert.match(loadingMarkup, /aria-busy="true"/);
assert.doesNotMatch(loadingMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(loadingMarkup, /class="spinner"/);
assert.match(loadingMarkup, /class="spinner__svg"/);
assert.match(loadingMarkup, /class="spinner__arc"/);

const checkboxMarkup = renderToStaticMarkup(React.createElement(Checkbox, {
  label: "Enable fuel card",
  description: "Applies to active drivers.",
  checked: true,
  density: "sm",
  variant: "descriptive",
}));
assert.match(checkboxMarkup, /class="choice checkbox"/);
assert.match(checkboxMarkup, /data-density="sm"/);
assert.match(checkboxMarkup, /data-variant="descriptive"/);
assert.match(checkboxMarkup, /data-state="checked"/);
assert.match(checkboxMarkup, /type="checkbox"/);
assert.match(checkboxMarkup, /aria-checked="true"/);
assert.match(checkboxMarkup, /class="choice__mark"/);
assert.match(checkboxMarkup, /class="choice__indicator material-symbol"/);
assert.match(checkboxMarkup, /class="choice__label">Enable fuel card<\/span>/);
assert.match(checkboxMarkup, /class="choice__description"/);

const radioButtonMarkup = renderToStaticMarkup(React.createElement(RadioButton, {
  label: "Fastest route",
  description: "Prioritize arrival time.",
  checked: true,
  density: "sm",
  name: "route",
  value: "fastest",
}));
assert.match(radioButtonMarkup, /class="choice radio"/);
assert.match(radioButtonMarkup, /data-density="sm"/);
assert.match(radioButtonMarkup, /data-state="selected"/);
assert.match(radioButtonMarkup, /type="radio"/);
assert.match(radioButtonMarkup, /name="route"/);
assert.match(radioButtonMarkup, /class="choice__mark"/);
assert.match(radioButtonMarkup, /class="choice__label">Fastest route<\/span>/);
assert.match(radioButtonMarkup, /class="choice__description"/);

const switchMarkup = renderToStaticMarkup(React.createElement(Switch, {
  label: "Route alerts",
  description: "Notify drivers before changes.",
  checked: true,
  density: "sm",
  name: "route-alerts",
}));
assert.match(switchMarkup, /class="switch"/);
assert.match(switchMarkup, /data-density="sm"/);
assert.match(switchMarkup, /data-state="on"/);
assert.match(switchMarkup, /type="checkbox"/);
assert.match(switchMarkup, /role="switch"/);
assert.match(switchMarkup, /aria-checked="true"/);
assert.match(switchMarkup, /class="switch__track"/);
assert.match(switchMarkup, /class="switch__thumb"/);
assert.match(switchMarkup, /class="switch__label">Route alerts<\/span>/);
assert.match(switchMarkup, /class="switch__description"/);

const textAreaMarkup = renderToStaticMarkup(React.createElement(TextArea, {
  label: "Driver notes",
  helper: "Visible to assigned driver.",
  value: "Customer requests child seat.",
  density: "sm",
  rows: 3,
  maxLength: 120,
}));
assert.match(textAreaMarkup, /class="field"/);
assert.match(textAreaMarkup, /data-density="sm"/);
assert.match(textAreaMarkup, /data-state="filled"/);
assert.match(textAreaMarkup, /class="text-area__surface"/);
assert.match(textAreaMarkup, /data-has-counter="true"/);
assert.match(textAreaMarkup, /class="text-area"/);
assert.match(textAreaMarkup, /class="text-area__counter"/);
assert.match(textAreaMarkup, /29\/120/);
assert.match(textAreaMarkup, /aria-describedby="[^"]+-helper [^"]+-counter"/);

const ref = createRef();
React.createElement(Button, { ref, label: "Ref" });

const iconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "Open notifications",
  icon: "notifications",
  variant: "tonal",
  density: "lg",
  selected: true,
  badge: true,
}));

assert.match(iconButtonMarkup, /class="icon-button icon-button--tonal"/);
assert.match(iconButtonMarkup, /aria-label="Open notifications"/);
assert.match(iconButtonMarkup, /aria-pressed="true"/);
assert.match(iconButtonMarkup, /data-density="lg"/);
assert.match(iconButtonMarkup, /class="icon-button__icon"/);
assert.match(iconButtonMarkup, /class="icon-button__badge"/);

const inheritedIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "More actions",
  icon: "more_horiz",
}));
assert.doesNotMatch(inheritedIconButtonMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);

const inputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Amount",
  helper: "Use settlement currency.",
  value: "2400",
  variant: "currency",
  density: "sm",
  suffix: "MXN",
  icon: "payments",
  state: "focus",
}));

assert.match(inputMarkup, /class="field"/);
assert.match(inputMarkup, /data-density="sm"/);
assert.match(inputMarkup, /data-variant="currency"/);
assert.match(inputMarkup, /data-align="end"/);
assert.match(inputMarkup, /class="field__label"/);
assert.match(inputMarkup, /class="field__control"/);
assert.match(inputMarkup, /class="field__icon"/);
assert.match(inputMarkup, /class="input"/);
assert.match(inputMarkup, /inputMode="decimal"|inputmode="decimal"/);
assert.match(inputMarkup, /class="field__suffix"/);
assert.match(inputMarkup, /class="field__helper"/);

const inheritedInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Driver",
  value: "Alex",
}));
assert.doesNotMatch(inheritedInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const cardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  helper: "Use the number printed on the front of the card.",
  value: "4111111111111111",
  density: "sm",
}));
assert.match(cardNumberInputMarkup, /class="field card-number-input"/);
assert.match(cardNumberInputMarkup, /data-density="sm"/);
assert.match(cardNumberInputMarkup, /data-state="valid"/);
assert.match(cardNumberInputMarkup, /data-validity="valid"/);
assert.match(cardNumberInputMarkup, /data-brand="Visa"/);
assert.match(cardNumberInputMarkup, /class="field__control card-number-input__control"/);
assert.match(cardNumberInputMarkup, /class="input card-number-input__input"/);
assert.match(cardNumberInputMarkup, /autoComplete="cc-number"|autocomplete="cc-number"/);
assert.match(cardNumberInputMarkup, /value="4111 1111 1111 1111"/);
assert.match(cardNumberInputMarkup, /class="field__suffix card-number-input__brand"/);
assert.match(cardNumberInputMarkup, /Visa/);

const inheritedCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  value: "5231000000000000",
}));
assert.doesNotMatch(inheritedCardNumberInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const cardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  helper: "Use the expiry printed on the card.",
  value: "1228",
  density: "sm",
}));
assert.match(cardExpiryInputMarkup, /class="field card-expiry-input"/);
assert.match(cardExpiryInputMarkup, /data-density="sm"/);
assert.match(cardExpiryInputMarkup, /data-state="valid"/);
assert.match(cardExpiryInputMarkup, /data-validity="valid"/);
assert.match(cardExpiryInputMarkup, /data-month="12"/);
assert.match(cardExpiryInputMarkup, /data-year="28"/);
assert.match(cardExpiryInputMarkup, /class="field__control card-expiry-input__control"/);
assert.match(cardExpiryInputMarkup, /class="input card-expiry-input__input"/);
assert.match(cardExpiryInputMarkup, /autoComplete="cc-exp"|autocomplete="cc-exp"/);
assert.match(cardExpiryInputMarkup, /value="12\/28"/);

const invalidCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  value: "1328",
}));
assert.match(invalidCardExpiryInputMarkup, /data-state="error"/);
assert.match(invalidCardExpiryInputMarkup, /data-validity="invalid"/);
assert.match(invalidCardExpiryInputMarkup, /aria-invalid="true"/);
assert.match(invalidCardExpiryInputMarkup, /Check the expiry date\./);

const inheritedCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  value: "1228",
}));
assert.doesNotMatch(inheritedCardExpiryInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const cardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  helper: "Use the code printed on the card.",
  value: "48a2",
  density: "sm",
}));
assert.match(cardSecurityCodeInputMarkup, /class="field card-security-code-input"/);
assert.match(cardSecurityCodeInputMarkup, /data-density="sm"/);
assert.match(cardSecurityCodeInputMarkup, /data-state="valid"/);
assert.match(cardSecurityCodeInputMarkup, /data-validity="valid"/);
assert.match(cardSecurityCodeInputMarkup, /data-length="3"/);
assert.match(cardSecurityCodeInputMarkup, /data-expected-length="3"/);
assert.match(cardSecurityCodeInputMarkup, /class="field__control card-security-code-input__control"/);
assert.match(cardSecurityCodeInputMarkup, /class="input card-security-code-input__input"/);
assert.match(cardSecurityCodeInputMarkup, /autoComplete="cc-csc"|autocomplete="cc-csc"/);
assert.match(cardSecurityCodeInputMarkup, /type="password"/);
assert.match(cardSecurityCodeInputMarkup, /value="482"/);
assert.match(cardSecurityCodeInputMarkup, /class="field-action card-security-code-input__action"/);
assert.match(cardSecurityCodeInputMarkup, /aria-pressed="false"/);

const revealedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  value: "1234",
  expectedLength: 4,
  revealed: true,
}));
assert.match(revealedCardSecurityCodeInputMarkup, /data-expected-length="4"/);
assert.match(revealedCardSecurityCodeInputMarkup, /type="text"/);
assert.match(revealedCardSecurityCodeInputMarkup, /maxlength="4"|maxLength="4"/);
assert.match(revealedCardSecurityCodeInputMarkup, /aria-pressed="true"/);

const inheritedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  value: "482",
}));
assert.doesNotMatch(inheritedCardSecurityCodeInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const codeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Security code",
  helper: "Code expires in 00:42",
  value: "a428195",
  length: 6,
  variant: "sms",
  density: "sm",
}));
assert.match(codeInputMarkup, /class="field code-input"/);
assert.match(codeInputMarkup, /data-density="sm"/);
assert.match(codeInputMarkup, /data-state="complete"/);
assert.match(codeInputMarkup, /data-variant="sms"/);
assert.match(codeInputMarkup, /class="code-input__control"/);
assert.match(codeInputMarkup, /class="code-input__input"/);
assert.match(codeInputMarkup, /autoComplete="one-time-code"|autocomplete="one-time-code"/);
assert.match(codeInputMarkup, /value="428195"/);
assert.match(codeInputMarkup, /class="code-input__slots"/);
assert.match(codeInputMarkup, /data-code-slot=""/);
assert.match(codeInputMarkup, /aria-hidden="true"/);
assert.match(codeInputMarkup, /class="field__helper"/);

const maskedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Passcode",
  value: "123456",
  variant: "masked",
}));
assert.match(maskedCodeInputMarkup, /data-masked="true"/);

const inheritedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Security code",
  value: "123",
}));
assert.doesNotMatch(inheritedCodeInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const phoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  helper: "Used for OTP and support recovery.",
  value: "+52 55 1842 9011",
  country: "MX",
  density: "sm",
}));
assert.match(phoneInputMarkup, /class="field phone-input"/);
assert.match(phoneInputMarkup, /data-density="sm"/);
assert.match(phoneInputMarkup, /data-variant="country-code"/);
assert.match(phoneInputMarkup, /class="field__control phone-input__control"/);
assert.match(phoneInputMarkup, /class="select-control select-control--inline country-selector phone-input__country"/);
assert.match(phoneInputMarkup, /data-country="MX"/);
assert.match(phoneInputMarkup, /class="country-flag phone-input__flag"/);
assert.match(phoneInputMarkup, /country-flag-icons\/3x2\/MX.svg/);
assert.match(phoneInputMarkup, /class="select-control__code country-selector__code phone-input__prefix"/);
assert.match(phoneInputMarkup, /\+52/);
assert.match(phoneInputMarkup, /class="select-control__listbox country-selector__listbox phone-input__country-listbox"/);
assert.match(phoneInputMarkup, /class="select-control__option country-selector__option phone-input__country-option"/);
assert.match(phoneInputMarkup, /class="input phone-input__input"/);
assert.match(phoneInputMarkup, /type="tel"/);
assert.match(phoneInputMarkup, /autoComplete="tel-national"|autocomplete="tel-national"/);
assert.match(phoneInputMarkup, /value="55 1842 9011"/);
assert.match(phoneInputMarkup, /class="field__helper"/);

const inheritedPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  value: "5518429011",
  country: "MX",
}));
assert.doesNotMatch(inheritedPhoneInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const datePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
  helper: "One operational date.",
  min: "2026-01-01",
  max: "2026-12-31",
  density: "lg",
  state: "focus",
}));
assert.match(datePickerMarkup, /class="field date-picker"/);
assert.match(datePickerMarkup, /data-density="lg"/);
assert.match(datePickerMarkup, /data-state="focus"/);
assert.match(datePickerMarkup, /data-open="false"/);
assert.match(datePickerMarkup, /class="field__label date-picker__label"/);
assert.match(datePickerMarkup, /class="field__control date-picker__control"/);
assert.match(datePickerMarkup, /data-date-picker-trigger=""/);
assert.match(datePickerMarkup, /aria-haspopup="dialog"/);
assert.match(datePickerMarkup, /aria-expanded="false"/);
assert.match(datePickerMarkup, /class="field__icon date-picker__icon"/);
assert.match(datePickerMarkup, /calendar_month/);
assert.match(datePickerMarkup, /class="date-picker__value"/);
assert.match(datePickerMarkup, /13 jul 2026/);
assert.match(datePickerMarkup, /type="date"/);
assert.match(datePickerMarkup, /data-date-picker-input=""/);
assert.match(datePickerMarkup, /min="2026-01-01"/);
assert.match(datePickerMarkup, /max="2026-12-31"/);
assert.match(datePickerMarkup, /class="date-picker__panel"/);
assert.match(datePickerMarkup, /role="dialog"/);
assert.match(datePickerMarkup, /aria-modal="false"/);
assert.match(datePickerMarkup, /class="date-picker__grid"/);
assert.match(datePickerMarkup, /role="grid"/);
assert.match(datePickerMarkup, /class="date-picker__weekday"/);
assert.match(datePickerMarkup, /data-date-picker-day="2026-07-13"/);
assert.match(datePickerMarkup, /aria-pressed="true"/);
assert.match(datePickerMarkup, /class="field__helper date-picker__helper"/);

const inheritedDatePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
}));
assert.doesNotMatch(inheritedDatePickerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);

const selectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  helper: "Choose a fleet.",
  value: "north",
  name: "fleet",
  density: "sm",
  icon: "local_taxi",
  state: "focus",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
  ],
}));
assert.match(selectMarkup, /class="field"/);
assert.match(selectMarkup, /data-density="sm"/);
assert.match(selectMarkup, /class="select-control"/);
assert.match(selectMarkup, /data-select-control=""/);
assert.match(selectMarkup, /role="combobox"/);
assert.match(selectMarkup, /class="select-control__icon"/);
assert.match(selectMarkup, /class="select-control__value"/);
assert.match(selectMarkup, /class="select-control__chevron"/);
assert.match(selectMarkup, /class="select-control__listbox"/);
assert.match(selectMarkup, /data-select-option=""/);
assert.match(selectMarkup, /type="hidden"/);

const inheritedSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Country code",
  value: "MX",
  options: [
    { label: "Mexico", value: "MX", meta: "+52" },
    { label: "Cuba", value: "CU", meta: "+53" },
  ],
}));
assert.doesNotMatch(inheritedSelectMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedSelectMarkup.match(/^<span[^>]+class="field"[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedSelectMarkup.match(/<span class="select-control"[^>]+>/)?.[0] ?? "", /data-density=/);

console.log("react action and field component render tests passed");
