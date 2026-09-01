import assert from "node:assert/strict";
import React, { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion, AnimatedMoment, AuditEvent, Avatar, Badge, BiometricPrompt, Breadcrumbs, Button, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, CardSummary, ChartPanel, Checkbox, Chip, CodeInput, Combobox, CountrySelector, DatePicker, DateRangePicker, Dialog, Drawer, EmptyState, ErrorPanel, IconButton, InlineValidation, Input, KpiTile, List, Menu, MotionBoundary, MovementRow, Pagination, PhoneInput, Popover, ProgressIndicator, RadioButton, RouteSummary, SegmentedControl, Select, Skeleton, Slider, Spinner, StationPin, Stepper, Switch, Tabs, Table, Tag, TextArea, Toast, Tooltip, TreeView } from "../dist/index.js";
import { accordionPlatformContract, animatedMomentPlatformContract, auditEventPlatformContract, avatarPlatformContract, badgePlatformContract, biometricPromptPlatformContract, breadcrumbsPlatformContract, buttonPlatformContract, cardExpiryInputPlatformContract, cardNumberInputPlatformContract, cardPlatformContract, cardSecurityCodeInputPlatformContract, cardSummaryPlatformContract, chartPanelPlatformContract, checkboxPlatformContract, chipPlatformContract, codeInputPlatformContract, comboboxPlatformContract, countrySelectorPlatformContract, datePickerPlatformContract, dateRangePickerPlatformContract, dialogPlatformContract, drawerPlatformContract, emptyStatePlatformContract, errorPanelPlatformContract, iconButtonPlatformContract, inlineValidationPlatformContract, inputPlatformContract, kpiTilePlatformContract, listPlatformContract, menuPlatformContract, motionBoundaryPlatformContract, movementRowPlatformContract, paginationPlatformContract, phoneInputPlatformContract, popoverPlatformContract, radioButtonPlatformContract, routeSummaryPlatformContract, segmentedControlPlatformContract, selectPlatformContract, skeletonPlatformContract, sliderPlatformContract, stationPinPlatformContract, stepperPlatformContract, switchPlatformContract, tabsPlatformContract, tablePlatformContract, tagPlatformContract, textAreaPlatformContract, toastPlatformContract, tooltipPlatformContract, treeViewPlatformContract } from "@design-system/components/platforms";

assert.equal(Accordion.displayName, "Accordion");
assert.equal(Accordion.platformContract, accordionPlatformContract);
assert.equal(AnimatedMoment.displayName, "AnimatedMoment");
assert.equal(AnimatedMoment.platformContract, animatedMomentPlatformContract);
assert.equal(AuditEvent.displayName, "AuditEvent");
assert.equal(AuditEvent.platformContract, auditEventPlatformContract);
assert.equal(Avatar.displayName, "Avatar");
assert.equal(Avatar.platformContract, avatarPlatformContract);
assert.equal(Badge.displayName, "Badge");
assert.equal(Badge.platformContract, badgePlatformContract);
assert.equal(BiometricPrompt.displayName, "BiometricPrompt");
assert.equal(BiometricPrompt.platformContract, biometricPromptPlatformContract);
assert.equal(Breadcrumbs.displayName, "Breadcrumbs");
assert.equal(Breadcrumbs.platformContract, breadcrumbsPlatformContract);
assert.equal(Button.displayName, "Button");
assert.equal(Button.platformContract, buttonPlatformContract);
assert.equal(Card.displayName, "Card");
assert.equal(Card.platformContract, cardPlatformContract);
assert.equal(CardExpiryInput.displayName, "CardExpiryInput");
assert.equal(CardExpiryInput.platformContract, cardExpiryInputPlatformContract);
assert.equal(CardNumberInput.displayName, "CardNumberInput");
assert.equal(CardNumberInput.platformContract, cardNumberInputPlatformContract);
assert.equal(CardSecurityCodeInput.displayName, "CardSecurityCodeInput");
assert.equal(CardSecurityCodeInput.platformContract, cardSecurityCodeInputPlatformContract);
assert.equal(CardSummary.displayName, "CardSummary");
assert.equal(CardSummary.platformContract, cardSummaryPlatformContract);
assert.equal(ChartPanel.displayName, "ChartPanel");
assert.equal(ChartPanel.platformContract, chartPanelPlatformContract);
assert.equal(Checkbox.displayName, "Checkbox");
assert.equal(Checkbox.platformContract, checkboxPlatformContract);
assert.equal(Chip.displayName, "Chip");
assert.equal(Chip.platformContract, chipPlatformContract);
assert.equal(CodeInput.displayName, "CodeInput");
assert.equal(CodeInput.platformContract, codeInputPlatformContract);
assert.equal(Combobox.displayName, "Combobox");
assert.equal(Combobox.platformContract, comboboxPlatformContract);
assert.equal(CountrySelector.displayName, "CountrySelector");
assert.equal(CountrySelector.platformContract, countrySelectorPlatformContract);
assert.equal(DatePicker.displayName, "DatePicker");
assert.equal(DatePicker.platformContract, datePickerPlatformContract);
assert.equal(DateRangePicker.displayName, "DateRangePicker");
assert.equal(DateRangePicker.platformContract, dateRangePickerPlatformContract);
assert.equal(Dialog.displayName, "Dialog");
assert.equal(Dialog.platformContract, dialogPlatformContract);
assert.equal(Drawer.displayName, "Drawer");
assert.equal(Drawer.platformContract, drawerPlatformContract);
assert.equal(EmptyState.displayName, "EmptyState");
assert.equal(EmptyState.platformContract, emptyStatePlatformContract);
assert.equal(ErrorPanel.displayName, "ErrorPanel");
assert.equal(ErrorPanel.platformContract, errorPanelPlatformContract);
assert.equal(IconButton.displayName, "IconButton");
assert.equal(IconButton.platformContract, iconButtonPlatformContract);
assert.equal(InlineValidation.displayName, "InlineValidation");
assert.equal(InlineValidation.platformContract, inlineValidationPlatformContract);
assert.equal(Input.displayName, "Input");
assert.equal(Input.platformContract, inputPlatformContract);
assert.equal(KpiTile.displayName, "KpiTile");
assert.equal(KpiTile.platformContract, kpiTilePlatformContract);
assert.equal(List.displayName, "List");
assert.equal(List.platformContract, listPlatformContract);
assert.equal(Menu.displayName, "Menu");
assert.equal(Menu.platformContract, menuPlatformContract);
assert.equal(MotionBoundary.displayName, "MotionBoundary");
assert.equal(MotionBoundary.platformContract, motionBoundaryPlatformContract);
assert.equal(MovementRow.displayName, "MovementRow");
assert.equal(MovementRow.platformContract, movementRowPlatformContract);
assert.equal(Pagination.displayName, "Pagination");
assert.equal(Pagination.platformContract, paginationPlatformContract);
assert.equal(PhoneInput.displayName, "PhoneInput");
assert.equal(PhoneInput.platformContract, phoneInputPlatformContract);
assert.equal(Popover.displayName, "Popover");
assert.equal(Popover.platformContract, popoverPlatformContract);
assert.equal(RadioButton.displayName, "RadioButton");
assert.equal(RadioButton.platformContract, radioButtonPlatformContract);
assert.equal(RouteSummary.displayName, "RouteSummary");
assert.equal(RouteSummary.platformContract, routeSummaryPlatformContract);
assert.equal(SegmentedControl.displayName, "SegmentedControl");
assert.equal(SegmentedControl.platformContract, segmentedControlPlatformContract);
assert.equal(Select.displayName, "Select");
assert.equal(Select.platformContract, selectPlatformContract);
assert.equal(Skeleton.displayName, "Skeleton");
assert.equal(Skeleton.platformContract, skeletonPlatformContract);
assert.equal(Slider.displayName, "Slider");
assert.equal(Slider.platformContract, sliderPlatformContract);
assert.equal(StationPin.displayName, "StationPin");
assert.equal(StationPin.platformContract, stationPinPlatformContract);
assert.equal(Stepper.displayName, "Stepper");
assert.equal(Stepper.platformContract, stepperPlatformContract);
assert.equal(Switch.displayName, "Switch");
assert.equal(Switch.platformContract, switchPlatformContract);
assert.equal(Tabs.displayName, "Tabs");
assert.equal(Tabs.platformContract, tabsPlatformContract);
assert.equal(Table.displayName, "Table");
assert.equal(Table.platformContract, tablePlatformContract);
assert.equal(Tag.displayName, "Tag");
assert.equal(Tag.platformContract, tagPlatformContract);
assert.equal(Toast.displayName, "Toast");
assert.equal(Toast.platformContract, toastPlatformContract);
assert.equal(Tooltip.displayName, "Tooltip");
assert.equal(Tooltip.platformContract, tooltipPlatformContract);
assert.equal(TreeView.displayName, "TreeView");
assert.equal(TreeView.platformContract, treeViewPlatformContract);
assert.equal(TextArea.displayName, "TextArea");
assert.equal(TextArea.platformContract, textAreaPlatformContract);

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

const unnamedTextAreaMarkup = renderToStaticMarkup(React.createElement(TextArea));
assert.doesNotMatch(unnamedTextAreaMarkup, /aria-label="Text area"/);
assert.doesNotMatch(unnamedTextAreaMarkup, /class="field"|class="text-area"/);

const ref = createRef();
React.createElement(Button, { ref, label: "Ref" });

const iconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "Open notifications",
  icon: "notifications",
  variant: "secondary",
  intent: "warning",
  state: "pressed",
  density: "lg",
  selected: true,
  badge: true,
}));

assert.match(iconButtonMarkup, /class="icon-button icon-button--secondary"/);
assert.match(iconButtonMarkup, /aria-label="Open notifications"/);
assert.match(iconButtonMarkup, /aria-pressed="true"/);
assert.match(iconButtonMarkup, /data-intent="warning"/);
assert.match(iconButtonMarkup, /data-state="selected"/);
assert.match(iconButtonMarkup, /data-density="lg"/);
assert.match(iconButtonMarkup, /class="icon-button__icon"/);
assert.match(iconButtonMarkup, /class="icon-button__badge"/);

const loadingIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "Sync utilities",
  icon: "sync",
  variant: "primary",
  intent: "danger",
  loading: true,
}));
assert.match(loadingIconButtonMarkup, /class="icon-button icon-button--primary"/);
assert.match(loadingIconButtonMarkup, /data-intent="danger"/);
assert.match(loadingIconButtonMarkup, /data-state="loading"/);
assert.match(loadingIconButtonMarkup, /disabled=""/);
assert.match(loadingIconButtonMarkup, /aria-busy="true"/);
assert.match(loadingIconButtonMarkup, /class="spinner/);
assert.doesNotMatch(loadingIconButtonMarkup, /class="icon-button__icon"/);

const inheritedIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "More actions",
  icon: "more_horiz",
}));
assert.doesNotMatch(inheritedIconButtonMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  icon: "settings",
}));
assert.equal(unnamedIconButtonMarkup, "");

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

const passwordInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Password",
  value: "secret",
  variant: "password",
  revealLabel: "Reveal password",
  hideLabel: "Hide password",
}));
assert.match(passwordInputMarkup, /data-masked-value="true"/);

const emptyPasswordInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Password",
  placeholder: "Password",
  variant: "password",
  revealLabel: "Reveal password",
  hideLabel: "Hide password",
}));
assert.doesNotMatch(emptyPasswordInputMarkup, /data-masked-value="true"/);

const revealedPasswordInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Password",
  value: "secret",
  variant: "password",
  revealed: true,
  revealLabel: "Reveal password",
  hideLabel: "Hide password",
}));
assert.doesNotMatch(revealedPasswordInputMarkup, /data-masked-value="true"/);

const inheritedInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Driver",
  value: "Alex",
}));
assert.doesNotMatch(inheritedInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedRevealInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  revealable: true,
}));
assert.doesNotMatch(unnamedRevealInputMarkup, /aria-label="Show value"/);
assert.doesNotMatch(unnamedRevealInputMarkup, /aria-label="Hide value"/);
assert.doesNotMatch(unnamedRevealInputMarkup, /data-field-action="reveal"/);
assert.doesNotMatch(unnamedRevealInputMarkup, /class="field"|class="input"/);

const loadingInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Amount",
  loading: true,
}));
assert.match(loadingInputMarkup, /class="spinner/);
assert.doesNotMatch(loadingInputMarkup, /Amount loading|Loading/);

const inlineValidationMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  label: "Driver email",
  value: "ana@",
  message: "Enter a complete email address.",
  state: "error",
  density: "sm",
  live: true,
}));
assert.match(inlineValidationMarkup, /^<div/);
assert.match(inlineValidationMarkup, /class="inline-validation"/);
assert.match(inlineValidationMarkup, /data-state="error"/);
assert.match(inlineValidationMarkup, /data-density="sm"/);
assert.match(inlineValidationMarkup, /data-field="true"/);
assert.match(inlineValidationMarkup, /aria-invalid="true"/);
assert.match(inlineValidationMarkup, /role="alert"/);
assert.match(inlineValidationMarkup, /class="field"/);
assert.match(inlineValidationMarkup, /data-density="sm"/);

const inheritedInlineValidationMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  label: "Inherited inline density",
  value: "Alex",
}));
assert.doesNotMatch(inheritedInlineValidationMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedInlineValidationMarkup.match(/<label[^>]+class="field"[^>]*>/)?.[0] ?? "", /data-density=/);
const unnamedInlineValidationMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  value: "Alex",
}));
assert.doesNotMatch(unnamedInlineValidationMarkup, /aria-label="Input"/);
const explicitInlineValidationFieldMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  value: "Alex",
  field: true,
}));
assert.doesNotMatch(explicitInlineValidationFieldMarkup, /class="field"/);
assert.match(explicitInlineValidationFieldMarkup, /data-field="false"/);

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
assert.match(cardNumberInputMarkup, /class="field__suffix card-number-input__brand payment-brand-mark"/);
assert.match(cardNumberInputMarkup, /data-payment-brand="visa"/);
assert.match(cardNumberInputMarkup, /data-payment-brand-library="svg-credit-card-payment-icons"/);
assert.match(cardNumberInputMarkup, /data-payment-brand-license="Apache-2.0"/);
assert.match(cardNumberInputMarkup, /src=".\/vendor\/payment-card-icons\/logo\/visa.svg"/);

const inheritedCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  value: "5231000000000000",
}));
assert.doesNotMatch(inheritedCardNumberInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput));
assert.doesNotMatch(unnamedCardNumberInputMarkup, /aria-label="Card number"/);
assert.doesNotMatch(unnamedCardNumberInputMarkup, /placeholder="5231 0000 0000 0000"/);
assert.doesNotMatch(unnamedCardNumberInputMarkup, /field card-number-input|card-number-input__input|credit_card/);

const loadingCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  loading: true,
}));
assert.match(loadingCardNumberInputMarkup, /class="spinner/);
assert.doesNotMatch(loadingCardNumberInputMarkup, /Card number loading|Loading/);

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
  validationMessage: "Check the expiry date.",
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

const unnamedCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput));
assert.doesNotMatch(unnamedCardExpiryInputMarkup, /aria-label="Expiry date"/);
assert.doesNotMatch(unnamedCardExpiryInputMarkup, /placeholder="MM\/YY"/);
assert.doesNotMatch(unnamedCardExpiryInputMarkup, /field card-expiry-input|card-expiry-input__input|calendar_month/);

const loadingCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  loading: true,
}));
assert.match(loadingCardExpiryInputMarkup, /class="spinner/);
assert.doesNotMatch(loadingCardExpiryInputMarkup, /Expiry date loading|Loading/);

const cardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  helper: "Use the code printed on the card.",
  value: "48a2",
  density: "sm",
  revealLabel: "Reveal CVC",
  hideLabel: "Conceal CVC",
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
assert.match(cardSecurityCodeInputMarkup, /data-masked-value="true"/);
assert.match(cardSecurityCodeInputMarkup, /class="field-action card-security-code-input__action"/);
assert.match(cardSecurityCodeInputMarkup, /aria-pressed="false"/);

const revealedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  value: "1234",
  expectedLength: 4,
  revealed: true,
  revealLabel: "Reveal CVC",
  hideLabel: "Conceal CVC",
}));
assert.match(revealedCardSecurityCodeInputMarkup, /data-expected-length="4"/);
assert.match(revealedCardSecurityCodeInputMarkup, /type="text"/);
assert.doesNotMatch(revealedCardSecurityCodeInputMarkup, /maxlength=|maxLength=/);
assert.doesNotMatch(revealedCardSecurityCodeInputMarkup, /data-masked-value="true"/);
assert.match(revealedCardSecurityCodeInputMarkup, /aria-pressed="true"/);

const emptyCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  placeholder: "CVC",
  revealLabel: "Reveal CVC",
  hideLabel: "Conceal CVC",
}));
assert.doesNotMatch(emptyCardSecurityCodeInputMarkup, /data-masked-value="true"/);

const inheritedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  value: "482",
}));
assert.doesNotMatch(inheritedCardSecurityCodeInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput));
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /aria-label="Security code"/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /placeholder="CVC"/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /Show security code|Hide security code/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /data-card-security-code-reveal/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /field card-security-code-input|card-security-code-input__input|pin/);

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

const successCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Approved code",
  value: "123456",
  state: "success",
  helper: "Code accepted",
}));
assert.match(successCodeInputMarkup, /data-state="success"/);
assert.match(successCodeInputMarkup, /role="status"/);

const inheritedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Security code",
  value: "123",
}));
assert.doesNotMatch(inheritedCodeInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput));
assert.doesNotMatch(unnamedCodeInputMarkup, /digit code/);
assert.doesNotMatch(unnamedCodeInputMarkup, /digits/);
assert.doesNotMatch(unnamedCodeInputMarkup, /field code-input|code-input__input|code-input__slots/);

const countrySelectorMarkup = renderToStaticMarkup(React.createElement(CountrySelector, {
  label: "Country",
  country: "MX",
  density: "sm",
  inline: true,
}));
assert.match(countrySelectorMarkup, /class="select-control select-control--inline country-selector"/);
assert.match(countrySelectorMarkup, /data-country="MX"/);
assert.match(countrySelectorMarkup, /data-density="sm"/);
assert.match(countrySelectorMarkup, /role="combobox"/);
assert.match(countrySelectorMarkup, /aria-expanded="false"/);
assert.match(countrySelectorMarkup, /country-flag-icons\/3x2\/MX.svg/);
assert.match(countrySelectorMarkup, /class="country-selector__label"/);
assert.match(countrySelectorMarkup, /Mexico/);
assert.match(countrySelectorMarkup, /class="select-control__code country-selector__code"/);
assert.match(countrySelectorMarkup, /\+52/);
assert.match(countrySelectorMarkup, /role="listbox"/);
assert.match(countrySelectorMarkup, /class="select-control__option country-selector__option"/);
const consumerDefaultCountrySelectorMarkup = renderToStaticMarkup(React.createElement(CountrySelector, {
  label: "Country",
  countries: [{ country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 }],
}));
assert.match(consumerDefaultCountrySelectorMarkup, /data-country="BR"/);
assert.doesNotMatch(consumerDefaultCountrySelectorMarkup, /data-country="MX"/);

const phoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  helper: "Used for OTP and support recovery.",
  value: "+52 55 1842 9011",
  country: "MX",
  placeholder: "55 1234 5678",
  density: "sm",
}));
assert.match(phoneInputMarkup, /class="field phone-input"/);
assert.match(phoneInputMarkup, /data-density="sm"/);
assert.match(phoneInputMarkup, /data-variant="country-code"/);
assert.match(phoneInputMarkup, /class="field__control phone-input__control"/);
assert.match(phoneInputMarkup, /class="select-control select-control--inline country-selector phone-input__country"/);
assert.match(phoneInputMarkup, /data-country="MX"/);
assert.match(phoneInputMarkup, /class="country-flag"/);
assert.match(phoneInputMarkup, /country-flag-icons\/3x2\/MX.svg/);
assert.match(phoneInputMarkup, /class="select-control__code country-selector__code"/);
assert.match(phoneInputMarkup, /\+52/);
assert.match(phoneInputMarkup, /class="select-control__listbox country-selector__overlay"/);
assert.match(phoneInputMarkup, /class="country-selector__listbox"/);
assert.match(phoneInputMarkup, /data-country-selector-search=""/);
assert.match(phoneInputMarkup, /class="select-control__option country-selector__option"/);
assert.match(phoneInputMarkup, /class="input phone-input__input"/);
assert.match(phoneInputMarkup, /type="tel"/);
assert.match(phoneInputMarkup, /autoComplete="tel-national"|autocomplete="tel-national"/);
assert.match(phoneInputMarkup, /placeholder="55 1234 5678"/);
assert.match(phoneInputMarkup, /value="55 1842 9011"/);
assert.match(phoneInputMarkup, /class="field__helper"/);
const consumerDefaultPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  countries: [{ country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 }],
}));
assert.match(consumerDefaultPhoneInputMarkup, /data-country="BR"/);
assert.doesNotMatch(consumerDefaultPhoneInputMarkup, /data-country="MX"/);

const inheritedPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  value: "5518429011",
  country: "MX",
}));
assert.doesNotMatch(inheritedPhoneInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput));
assert.equal(unnamedPhoneInputMarkup, "");
assert.doesNotMatch(unnamedPhoneInputMarkup, /Phone input/);
assert.doesNotMatch(unnamedPhoneInputMarkup, /Country options/);
assert.doesNotMatch(unnamedPhoneInputMarkup, /Country code/);

const datePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
  locale: "es-MX",
  weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  helper: "One operational date.",
  min: "2026-01-01",
  max: "2026-12-31",
  calendarLabel: "Service date calendar",
  monthSelectLabel: "Select service month",
  yearSelectLabel: "Select service year",
  previousYearLabel: "Previous service year",
  previousMonthLabel: "Previous service month",
  nextMonthLabel: "Next service month",
  nextYearLabel: "Next service year",
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
assert.match(datePickerMarkup, /aria-label="Service date calendar"/);
assert.match(datePickerMarkup, /aria-label="Select service month"/);
assert.match(datePickerMarkup, /aria-label="Select service year"/);
assert.match(datePickerMarkup, /class="date-picker__selector date-picker__selector--month"/);
assert.match(datePickerMarkup, /class="date-picker__selector date-picker__selector--year"/);
assert.match(datePickerMarkup, /aria-label="Previous service year"/);
assert.match(datePickerMarkup, /aria-label="Previous service month"/);
assert.match(datePickerMarkup, /aria-label="Next service month"/);
assert.match(datePickerMarkup, /aria-label="Next service year"/);
assert.match(datePickerMarkup, /keyboard_double_arrow_left/);
assert.match(datePickerMarkup, /keyboard_double_arrow_right/);
assert.match(datePickerMarkup, /class="date-picker__grid"/);
assert.match(datePickerMarkup, /role="grid"/);
assert.match(datePickerMarkup, /class="date-picker__weekday"/);
assert.match(datePickerMarkup, /data-date-picker-day="2026-07-13"/);
assert.match(datePickerMarkup, /aria-pressed="true"/);
assert.match(datePickerMarkup, /class="field__helper date-picker__helper"/);

const datePickerRangeMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Reporting range",
  mode: "range",
  value: { from: "2026-07-01", to: "2026-07-15" },
  locale: "es-MX",
  weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  presetItems: [{ key: "last-7", label: "Last 7 days", days: 7 }],
  open: true,
}));
assert.match(datePickerRangeMarkup, /class="field date-picker date-range-picker"/);
assert.match(datePickerRangeMarkup, /data-mode="range"/);
assert.match(datePickerRangeMarkup, /data-from="2026-07-01"/);
assert.match(datePickerRangeMarkup, /data-to="2026-07-15"/);
assert.match(datePickerRangeMarkup, /class="date-range-picker__presets"/);
assert.match(datePickerRangeMarkup, /data-key="last-7"/);
assert.match(datePickerRangeMarkup, /data-date-range-picker-day="2026-07-01"/);
assert.match(datePickerRangeMarkup, /data-range-edge="start"/);
assert.match(datePickerRangeMarkup, /data-range-edge="end"/);
assert.match(datePickerRangeMarkup, /data-in-range="true"/);

const inheritedDatePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
}));
assert.doesNotMatch(inheritedDatePickerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedDatePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker));
assert.equal(unnamedDatePickerMarkup, "");
const datePickerWithoutNavLabelsMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
}));
assert.doesNotMatch(datePickerWithoutNavLabelsMarkup, /class="date-picker__nav"/);

const dateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
  locale: "es-MX",
  weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  helper: "One bounded date range.",
  presetItems: [
    { key: "last-7", label: "Last 7 days", days: 7 },
    { key: "last-30", label: "Last 30 days", days: 30 },
  ],
  calendarLabel: "Reporting range calendar",
  previousMonthLabel: "Previous reporting month",
  nextMonthLabel: "Next reporting month",
  density: "sm",
  state: "selected",
}));
assert.match(dateRangePickerMarkup, /class="field date-picker date-range-picker"/);
assert.match(dateRangePickerMarkup, /data-density="sm"/);
assert.match(dateRangePickerMarkup, /data-state="selected"/);
assert.match(dateRangePickerMarkup, /data-open="false"/);
assert.match(dateRangePickerMarkup, /data-from="2026-07-01"/);
assert.match(dateRangePickerMarkup, /data-to="2026-07-15"/);
assert.match(dateRangePickerMarkup, /class="field__label date-picker__label date-range-picker__label"/);
assert.match(dateRangePickerMarkup, /class="field__control date-picker__control date-range-picker__control"/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-trigger=""/);
assert.match(dateRangePickerMarkup, /aria-haspopup="dialog"/);
assert.match(dateRangePickerMarkup, /aria-expanded="false"/);
assert.match(dateRangePickerMarkup, /class="field__icon date-picker__icon date-range-picker__icon"/);
assert.match(dateRangePickerMarkup, /date_range/);
assert.match(dateRangePickerMarkup, /class="date-picker__value date-range-picker__value"/);
assert.match(dateRangePickerMarkup, /01 jul 2026 - 15 jul 2026/);
assert.match(dateRangePickerMarkup, /data-key="last-7"/);
const unstablePresetDateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  presetItems: [{ label: "Last 7 days", days: 7 }],
}));
assert.doesNotMatch(unstablePresetDateRangePickerMarkup, /class="date-range-picker__preset"|data-key="Last 7 days-7"/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-from=""/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-to=""/);
assert.match(dateRangePickerMarkup, /class="date-picker__panel date-range-picker__panel"/);
assert.match(dateRangePickerMarkup, /role="dialog"/);
assert.match(dateRangePickerMarkup, /aria-label="Reporting range calendar"/);
assert.match(dateRangePickerMarkup, /aria-label="Previous reporting month"/);
assert.match(dateRangePickerMarkup, /aria-label="Next reporting month"/);
assert.match(dateRangePickerMarkup, /class="date-range-picker__presets"/);
assert.match(dateRangePickerMarkup, /class="date-range-picker__preset"/);
assert.match(dateRangePickerMarkup, /class="date-picker__grid date-range-picker__grid"/);
assert.match(dateRangePickerMarkup, /role="grid"/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-day="2026-07-01"/);
assert.match(dateRangePickerMarkup, /data-range-edge="start"/);
assert.match(dateRangePickerMarkup, /data-range-edge="end"/);
assert.match(dateRangePickerMarkup, /data-in-range="true"/);
assert.match(dateRangePickerMarkup, /class="field__helper date-picker__helper date-range-picker__helper"/);

const inheritedDateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
}));
assert.doesNotMatch(inheritedDateRangePickerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);

const emptyDateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  placeholder: "Select date range",
}));
assert.match(emptyDateRangePickerMarkup, /class="date-picker__value date-range-picker__value"/);
assert.match(emptyDateRangePickerMarkup, />Select date range<\/span>/);
assert.match(emptyDateRangePickerMarkup, /data-from=""/);
assert.match(emptyDateRangePickerMarkup, /data-to=""/);

const unnamedDateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker));
assert.equal(unnamedDateRangePickerMarkup, "");
const dateRangePickerWithoutNavLabelsMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
}));
assert.doesNotMatch(dateRangePickerWithoutNavLabelsMarkup, /class="date-picker__nav"/);

const closedDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Freeze card?",
  description: "Driver cannot spend until review ends.",
  triggerLabel: "Open review",
  density: "sm",
}));
assert.match(closedDialogMarkup, /^<div/);
assert.match(closedDialogMarkup, /class="dialog dialog--neutral"/);
assert.match(closedDialogMarkup, /data-open="false"/);
assert.match(closedDialogMarkup, /data-state="closed"/);
assert.match(closedDialogMarkup, /data-density="sm"/);
assert.match(closedDialogMarkup, /class="button button--secondary dialog__trigger"/);
assert.match(closedDialogMarkup, /aria-haspopup="dialog"/);
assert.match(closedDialogMarkup, /aria-expanded="false"/);
assert.match(closedDialogMarkup, /data-overlay-open=""/);
assert.match(closedDialogMarkup, /class="dialog__overlay"/);
assert.match(closedDialogMarkup, /hidden=""/);

const openDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Freeze card?",
  description: "Driver cannot spend until review ends.",
  closeLabel: "Close freeze card dialog",
  variant: "destructive",
  tone: "danger",
  state: "open",
  open: true,
  density: "lg",
  actions: [{ key: "cancel", label: "Cancel", variant: "ghost" }, { key: "confirm", label: "Confirm", variant: "danger" }],
}));
assert.match(openDialogMarkup, /class="dialog dialog--danger"/);
assert.match(openDialogMarkup, /data-variant="destructive"/);
assert.match(openDialogMarkup, /data-open="true"/);
assert.match(openDialogMarkup, /data-state="open"/);
assert.match(openDialogMarkup, /role="dialog"/);
assert.match(openDialogMarkup, /aria-modal="true"/);
assert.match(openDialogMarkup, /aria-labelledby=/);
assert.match(openDialogMarkup, /class="dialog__icon"/);
assert.match(openDialogMarkup, />warning<\/span>/);
assert.match(openDialogMarkup, /class="icon-button icon-button--ghost dialog__close"/);
assert.match(openDialogMarkup, /data-overlay-close=""/);
assert.match(openDialogMarkup, /data-key="confirm"/);
const successDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Saved",
  variant: "success",
  open: true,
}));
assert.match(successDialogMarkup, /class="dialog dialog--success"/);
assert.match(successDialogMarkup, /data-tone="success"/);
assert.match(successDialogMarkup, />check_circle<\/span>/);
const defaultDialogActionsMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Confirm route",
  open: true,
  actions: [{ key: "cancel", label: "Cancel" }, { key: "confirm", label: "Confirm" }],
}));
assert.match(defaultDialogActionsMarkup, /data-key="cancel"[^>]*class="button button--secondary"/);
assert.match(defaultDialogActionsMarkup, /data-key="confirm"[^>]*class="button button--primary"/);
const unstableDialogActionMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Confirm route",
  open: true,
  actions: [{ label: "Confirm" }],
}));
assert.doesNotMatch(unstableDialogActionMarkup, /data-key="Confirm"|class="button/);
const dialogChildrenMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Invite team",
  open: true,
}, React.createElement("div", { "data-dialog-child": "true" }, "Short composed body")));
assert.match(dialogChildrenMarkup, /class="dialog__body"/);
assert.match(dialogChildrenMarkup, /data-dialog-child="true"/);
assert.match(dialogChildrenMarkup, /Short composed body/);

const formDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Edit driver",
  closeLabel: "Close edit driver dialog",
  variant: "form",
  open: true,
  fields: [{ name: "driver", label: "Driver", value: "Ana Sosa" }, { value: "Empty field" }],
}));
assert.match(formDialogMarkup, /data-variant="form"/);
assert.match(formDialogMarkup, /class="dialog__body dialog__fields"/);
assert.match(formDialogMarkup, /class="field"/);
assert.doesNotMatch(formDialogMarkup, /Empty field/);
assert.doesNotMatch(formDialogMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const unstableDialogFieldMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Edit driver",
  open: true,
  fields: [{ label: "Driver", value: "Ana Sosa" }],
}));
assert.doesNotMatch(unstableDialogFieldMarkup, /class="dialog__body dialog__fields"|Driver|Ana Sosa/);

const unnamedDialogMarkup = renderToStaticMarkup(React.createElement(Dialog));
assert.equal(unnamedDialogMarkup, "");
assert.doesNotMatch(unnamedDialogMarkup, /aria-label="Open dialog"/);
assert.doesNotMatch(unnamedDialogMarkup, /aria-label="Dialog"/);
assert.doesNotMatch(unnamedDialogMarkup, /aria-label="Close dialog"/);
assert.doesNotMatch(unnamedDialogMarkup, /class="button button--secondary dialog__trigger"/);
assert.doesNotMatch(unnamedDialogMarkup, /class="icon-button icon-button--ghost dialog__close"/);

const dialogWithoutTriggerMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Review route",
}));
assert.doesNotMatch(dialogWithoutTriggerMarkup, /data-overlay-open=""/);
assert.doesNotMatch(dialogWithoutTriggerMarkup, /class="button button--secondary dialog__trigger"/);

const closedDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Card controls",
  description: "Review limits.",
  triggerLabel: "Open controls",
  density: "sm",
  side: "left",
}));
assert.match(closedDrawerMarkup, /^<div/);
assert.match(closedDrawerMarkup, /class="drawer drawer--neutral"/);
assert.match(closedDrawerMarkup, /data-open="false"/);
assert.match(closedDrawerMarkup, /data-state="closed"/);
assert.match(closedDrawerMarkup, /data-density="sm"/);
assert.match(closedDrawerMarkup, /data-side="left"/);
assert.match(closedDrawerMarkup, /class="button button--secondary drawer__trigger"/);
assert.match(closedDrawerMarkup, /aria-haspopup="dialog"/);
assert.match(closedDrawerMarkup, /aria-expanded="false"/);
assert.match(closedDrawerMarkup, /data-overlay-open=""/);
assert.match(closedDrawerMarkup, /class="drawer__overlay"/);
assert.match(closedDrawerMarkup, /hidden=""/);

const openDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Ana Sosa",
  closeLabel: "Close Ana Sosa details",
  variant: "detail",
  tone: "info",
  state: "open",
  open: true,
  density: "md",
  content: [
    { key: "status", type: "badge", label: "En ruta", tone: "success", live: true },
    { key: "documents", type: "progress", label: "Documentos", value: 75, max: 100, showValue: true },
  ],
  actions: [{ key: "close", label: "Cerrar", variant: "ghost" }, { key: "save", label: "Guardar" }],
}));
assert.match(openDrawerMarkup, /class="drawer drawer--info"/);
assert.match(openDrawerMarkup, /data-variant="detail"/);
assert.match(openDrawerMarkup, /data-open="true"/);
assert.match(openDrawerMarkup, /data-state="open"/);
assert.match(openDrawerMarkup, /role="dialog"/);
assert.match(openDrawerMarkup, /aria-modal="true"/);
assert.match(openDrawerMarkup, /aria-labelledby=/);
assert.match(openDrawerMarkup, /class="icon-button icon-button--ghost drawer__close"/);
assert.match(openDrawerMarkup, /class="drawer__status-row"/);
assert.match(openDrawerMarkup, /class="badge__label">En ruta<\/span>/);
assert.match(openDrawerMarkup, /class="drawer__progress-row"/);
assert.match(openDrawerMarkup, /class="progress"/);
assert.match(openDrawerMarkup, /<progress class="progress__meter" max="100" value="75"/);
assert.match(openDrawerMarkup, /data-overlay-close=""/);
assert.match(openDrawerMarkup, /data-key="save"/);
const defaultDrawerActionsMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Vehicle details",
  open: true,
  actions: [{ key: "cancel", label: "Cancel" }, { key: "save", label: "Save" }],
}));
assert.match(defaultDrawerActionsMarkup, /data-key="cancel"[^>]*class="button button--secondary"/);
assert.match(defaultDrawerActionsMarkup, /data-key="save"[^>]*class="button button--primary"/);
const unstableDrawerActionMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Vehicle details",
  open: true,
  actions: [{ label: "Guardar" }],
}));
assert.doesNotMatch(unstableDrawerActionMarkup, /data-key="Guardar"|class="button/);

const formDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Filter routes",
  closeLabel: "Close route filters",
  variant: "filter",
  open: true,
  fields: [{ name: "region", label: "Region" }, { name: "fuel", label: "Fuel type", value: "Diesel" }, { value: "Empty drawer field" }],
}));
assert.match(formDrawerMarkup, /data-variant="filter"/);
assert.match(formDrawerMarkup, /class="drawer__body"/);
assert.match(formDrawerMarkup, /class="field"/);
assert.doesNotMatch(formDrawerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(formDrawerMarkup, /value="Diesel"/);
assert.doesNotMatch(formDrawerMarkup, /Empty drawer field/);
const unstableDrawerFieldMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Filter routes",
  open: true,
  fields: [{ label: "Fuel type", value: "Diesel" }],
}));
assert.doesNotMatch(unstableDrawerFieldMarkup, /class="field"|Fuel type|Diesel/);

const emptyContentDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Details",
  open: true,
  content: [{ type: "badge" }, { type: "progress", value: 75 }, { type: "text" }],
}));
assert.doesNotMatch(emptyContentDrawerMarkup, /drawer__status-row|drawer__progress-row|drawer__supporting-copy/);
const unstableContentDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Details",
  open: true,
  content: [{ type: "badge", label: "En ruta" }, { type: "progress", label: "Documentos", value: 75 }, { type: "text", copy: "Support copy" }],
}));
assert.doesNotMatch(unstableContentDrawerMarkup, /drawer__status-row|drawer__progress-row|drawer__supporting-copy|En ruta|Documentos|Support copy/);

const unnamedDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer));
assert.equal(unnamedDrawerMarkup, "");
assert.doesNotMatch(unnamedDrawerMarkup, /aria-label="Open drawer"/);
assert.doesNotMatch(unnamedDrawerMarkup, /aria-label="Drawer"/);
assert.doesNotMatch(unnamedDrawerMarkup, /aria-label="Close drawer"/);
assert.doesNotMatch(unnamedDrawerMarkup, /class="button button--secondary drawer__trigger"/);
assert.doesNotMatch(unnamedDrawerMarkup, /class="icon-button icon-button--ghost drawer__close"/);

const drawerWithoutTriggerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Route filters",
}));
assert.doesNotMatch(drawerWithoutTriggerMarkup, /data-overlay-open=""/);
assert.doesNotMatch(drawerWithoutTriggerMarkup, /class="button button--secondary drawer__trigger"/);

const comboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  helper: "Search by plate, driver, or fleet",
  optionsLabel: "Vehicle options",
  clearSelectionLabel: "Clear vehicle",
  value: "mx-4821",
  density: "sm",
  state: "open",
  options: [
    { label: "MX-4821 - Ana Gomez", value: "mx-4821", meta: "Driver" },
    { label: "MX-8840 - Luis Perez", value: "mx-8840", meta: "Vehicle" },
  ],
}));
assert.match(comboboxMarkup, /^<span/);
assert.match(comboboxMarkup, /class="field"/);
assert.match(comboboxMarkup, /data-combobox-compat=""/);
assert.match(comboboxMarkup, /data-density="sm"/);
assert.match(comboboxMarkup, /class="select-control"/);
assert.match(comboboxMarkup, /data-open="true"/);
assert.match(comboboxMarkup, /data-select-control=""/);
assert.match(comboboxMarkup, /role="combobox"/);
assert.match(comboboxMarkup, /aria-autocomplete="list"/);
assert.match(comboboxMarkup, /aria-expanded="true"/);
assert.match(comboboxMarkup, /aria-controls="[^"]+-listbox"/);
assert.match(comboboxMarkup, /class="select-control__icon"/);
assert.match(comboboxMarkup, /class="select-control__input"/);
assert.match(comboboxMarkup, /class="field-action select-control__clear"/);
assert.match(comboboxMarkup, /class="select-control__chevron"/);
assert.match(comboboxMarkup, /class="select-control__listbox"/);
assert.match(comboboxMarkup, /role="listbox"/);
assert.match(comboboxMarkup, /class="select-control__option"/);
assert.match(comboboxMarkup, /aria-selected="true"/);
assert.match(comboboxMarkup, /data-active="false"/);
assert.match(comboboxMarkup, /class="select-control__option-code">Driver<\/span>/);
assert.match(comboboxMarkup, /class="field__helper"/);

const emptyComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  optionsLabel: "Vehicle options",
  clearSelectionLabel: "Clear vehicle",
  value: "zz",
  emptyText: "No matching options",
  options: [{ label: "MX-4821 - Ana Gomez", value: "mx-4821" }],
}));
assert.match(emptyComboboxMarkup, /data-state="empty"/);
assert.match(emptyComboboxMarkup, /class="select-control__empty"/);
assert.match(emptyComboboxMarkup, />No matching options<\/span>/);

const unnamedComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox));
assert.equal(unnamedComboboxMarkup, "");
assert.doesNotMatch(unnamedComboboxMarkup, /aria-label="Combobox"/);
assert.doesNotMatch(unnamedComboboxMarkup, /class="combobox"|role="combobox"|role="listbox"|data-combobox-clear/);

const unnamedClearComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  value: "mx-4821",
  options: [{ label: "MX-4821", value: "mx-4821" }],
}));
assert.doesNotMatch(unnamedClearComboboxMarkup, /data-select-clear|class="field-action select-control__clear"/);
assert.doesNotMatch(unnamedComboboxMarkup, /aria-label="Options"/);
assert.doesNotMatch(unnamedComboboxMarkup, /aria-label="Clear selection"/);

const unstableOptionComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  state: "open",
  options: [
    { label: "MX-4821 - Ana Gomez" },
    { value: "mx-8840" },
  ],
}));
assert.equal(unstableOptionComboboxMarkup, "");
assert.doesNotMatch(unstableOptionComboboxMarkup, /role="option"/);
assert.doesNotMatch(unstableOptionComboboxMarkup, /data-value="MX-4821|data-label="mx-8840"/);

const motionBoundaryMarkup = renderToStaticMarkup(React.createElement(MotionBoundary, {
  label: "Panel transition",
  description: "Route content enters as a bounded region.",
  variant: "route",
  state: "entering",
  reducedMotion: true,
  stateLabel: "Reduced motion",
}));
assert.match(motionBoundaryMarkup, /^<div/);
assert.match(motionBoundaryMarkup, /class="motion-boundary"/);
assert.match(motionBoundaryMarkup, /data-variant="route"/);
assert.match(motionBoundaryMarkup, /data-state="reduced-motion"/);
assert.match(motionBoundaryMarkup, /data-reduced-motion="true"/);
assert.match(motionBoundaryMarkup, /role="group"/);
assert.match(motionBoundaryMarkup, /aria-labelledby="[^"]+-label"/);
assert.match(motionBoundaryMarkup, /aria-describedby="[^"]+-description [^"]+-state"/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__icon material-symbol"/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__content"/);
assert.match(motionBoundaryMarkup, /Panel transition/);
assert.match(motionBoundaryMarkup, /Route content enters as a bounded region/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__state"[^>]*>Reduced motion<\/span>/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__cue" data-motion-cue=""/);
const unnamedMotionBoundaryMarkup = renderToStaticMarkup(React.createElement(MotionBoundary, {
  label: "Consumer boundary",
  state: "active",
}));
assert.doesNotMatch(unnamedMotionBoundaryMarkup, /Idle|Entering|Active|Exiting|Reduced motion|Disabled/);
const unlabeledMotionBoundaryMarkup = renderToStaticMarkup(React.createElement(MotionBoundary, {
  description: "No boundary identity",
  stateLabel: "Active",
}));
assert.doesNotMatch(unlabeledMotionBoundaryMarkup, /motion-boundary|role="group"|No boundary identity|Active/);

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

const unnamedSelectMarkup = renderToStaticMarkup(React.createElement(Select));
assert.equal(unnamedSelectMarkup, "");
assert.doesNotMatch(unnamedSelectMarkup, /aria-label="Select"/);
assert.doesNotMatch(unnamedSelectMarkup, /aria-label="Options"/);
assert.doesNotMatch(unnamedSelectMarkup, /select-control|role="combobox"|role="listbox"/);

const unselectedSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  placeholder: "Choose fleet",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
  ],
}));
assert.match(unselectedSelectMarkup, /class="select-control__value select-control__placeholder"/);
assert.match(unselectedSelectMarkup, /data-select-placeholder=""/);
assert.match(unselectedSelectMarkup, />Choose fleet<\/span>/);
assert.match(unselectedSelectMarkup, /class="select-control"[^>]*data-value=""/);
assert.doesNotMatch(unselectedSelectMarkup, /aria-activedescendant=/);
assert.doesNotMatch(unselectedSelectMarkup, /aria-selected="true"/);

const unstableOptionSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  value: "North",
  options: [
    { label: "North" },
    { value: "south" },
  ],
}));
assert.equal(unstableOptionSelectMarkup, "");
assert.doesNotMatch(unstableOptionSelectMarkup, /role="option"/);
assert.doesNotMatch(unstableOptionSelectMarkup, /data-value="North"|class="select-control__value"|>North<\/span>/);

console.log("react action and field component render tests passed");
