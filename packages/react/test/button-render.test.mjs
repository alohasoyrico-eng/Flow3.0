import assert from "node:assert/strict";
import React, { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion, Avatar, Badge, Button, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, Checkbox, Chip, CodeInput, DatePicker, DateRangePicker, EmptyState, ErrorPanel, IconButton, Input, PhoneInput, RadioButton, Select, Skeleton, Slider, Switch, Tag, TextArea, Toast, Tooltip } from "../src/index.js";
import { accordionPlatformContract, avatarPlatformContract, badgePlatformContract, buttonPlatformContract, cardExpiryInputPlatformContract, cardNumberInputPlatformContract, cardSecurityCodeInputPlatformContract, checkboxPlatformContract, chipPlatformContract, codeInputPlatformContract, datePickerPlatformContract, dateRangePickerPlatformContract, emptyStatePlatformContract, errorPanelPlatformContract, iconButtonPlatformContract, inputPlatformContract, phoneInputPlatformContract, radioButtonPlatformContract, selectPlatformContract, skeletonPlatformContract, sliderPlatformContract, switchPlatformContract, tagPlatformContract, textAreaPlatformContract, toastPlatformContract, tooltipPlatformContract } from "@design-system/components/platforms";

assert.equal(Accordion.displayName, "Accordion");
assert.equal(Accordion.platformContract, accordionPlatformContract);
assert.equal(Avatar.displayName, "Avatar");
assert.equal(Avatar.platformContract, avatarPlatformContract);
assert.equal(Badge.displayName, "Badge");
assert.equal(Badge.platformContract, badgePlatformContract);
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
assert.equal(Chip.displayName, "Chip");
assert.equal(Chip.platformContract, chipPlatformContract);
assert.equal(CodeInput.displayName, "CodeInput");
assert.equal(CodeInput.platformContract, codeInputPlatformContract);
assert.equal(DatePicker.displayName, "DatePicker");
assert.equal(DatePicker.platformContract, datePickerPlatformContract);
assert.equal(DateRangePicker.displayName, "DateRangePicker");
assert.equal(DateRangePicker.platformContract, dateRangePickerPlatformContract);
assert.equal(EmptyState.displayName, "EmptyState");
assert.equal(EmptyState.platformContract, emptyStatePlatformContract);
assert.equal(ErrorPanel.displayName, "ErrorPanel");
assert.equal(ErrorPanel.platformContract, errorPanelPlatformContract);
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
assert.equal(Skeleton.displayName, "Skeleton");
assert.equal(Skeleton.platformContract, skeletonPlatformContract);
assert.equal(Slider.displayName, "Slider");
assert.equal(Slider.platformContract, sliderPlatformContract);
assert.equal(Switch.displayName, "Switch");
assert.equal(Switch.platformContract, switchPlatformContract);
assert.equal(Tag.displayName, "Tag");
assert.equal(Tag.platformContract, tagPlatformContract);
assert.equal(Toast.displayName, "Toast");
assert.equal(Toast.platformContract, toastPlatformContract);
assert.equal(Tooltip.displayName, "Tooltip");
assert.equal(Tooltip.platformContract, tooltipPlatformContract);
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

const accordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  density: "sm",
  items: [
    { id: "docs", title: "Documents", content: "Insurance", open: true, icon: "description", meta: "3 of 4" },
    { id: "limits", title: "Limits", content: "Daily limit", icon: "speed", meta: "2 rules" },
  ],
}));
assert.match(accordionMarkup, /class="accordion"/);
assert.match(accordionMarkup, /data-density="sm"/);
assert.match(accordionMarkup, /data-multiple="false"/);
assert.match(accordionMarkup, /data-accordion-trigger=""/);
assert.match(accordionMarkup, /aria-expanded="true"/);
assert.match(accordionMarkup, /aria-controls="[^"]+-docs"/);
assert.match(accordionMarkup, /class="accordion__icon"/);
assert.match(accordionMarkup, /class="accordion__title">Documents<\/span>/);
assert.match(accordionMarkup, /class="accordion__meta">3 of 4<\/span>/);
assert.match(accordionMarkup, /class="accordion__chevron"/);
assert.match(accordionMarkup, /class="accordion__panel"/);
assert.match(accordionMarkup, /role="region"/);
assert.match(accordionMarkup, /class="accordion__panel-body">Insurance<\/div>/);
assert.match(accordionMarkup, /hidden="">/);
assert.doesNotMatch(loadingMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(loadingMarkup, /class="spinner"/);
assert.match(loadingMarkup, /class="spinner__svg"/);
assert.match(loadingMarkup, /class="spinner__arc"/);

const avatarMarkup = renderToStaticMarkup(React.createElement(Avatar, {
  name: "Ana Sosa",
  status: "online",
  density: "lg",
}));
assert.match(avatarMarkup, /^<span/);
assert.match(avatarMarkup, /class="avatar avatar--lg"/);
assert.match(avatarMarkup, /aria-label="Ana Sosa"/);
assert.match(avatarMarkup, /data-status="online"/);
assert.match(avatarMarkup, /data-state="online"/);
assert.match(avatarMarkup, /data-color-index=/);
assert.match(avatarMarkup, /class="avatar__initials"/);
assert.match(avatarMarkup, />AS<\/span>/);
assert.match(avatarMarkup, /class="avatar__status"/);

const imageAvatarMarkup = renderToStaticMarkup(React.createElement(Avatar, {
  name: "Luis Vera",
  src: "/avatars/luis.png",
  state: "disabled",
}));
assert.match(imageAvatarMarkup, /class="avatar avatar--md"/);
assert.match(imageAvatarMarkup, /data-state="disabled"/);
assert.match(imageAvatarMarkup, /src="\/avatars\/luis.png"/);
assert.match(imageAvatarMarkup, /alt="Luis Vera"/);

const badgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "3",
  variant: "count",
  tone: "danger",
  live: true,
  ariaLabel: "3 alerts",
}));
assert.match(badgeMarkup, /class="badge"/);
assert.match(badgeMarkup, /data-variant="count"/);
assert.match(badgeMarkup, /data-tone="danger"/);
assert.match(badgeMarkup, /data-state="default"/);
assert.match(badgeMarkup, /role="status"/);
assert.match(badgeMarkup, /aria-live="polite"/);
assert.match(badgeMarkup, /aria-label="3 alerts"/);
assert.match(badgeMarkup, /data-live="true"/);
assert.match(badgeMarkup, /class="badge__live"/);
assert.match(badgeMarkup, /class="badge__label">3<\/span>/);

const iconBadgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "!",
  variant: "icon",
  tone: "warning",
  icon: "priority_high",
  state: "focus",
}));
assert.match(iconBadgeMarkup, /data-variant="icon"/);
assert.match(iconBadgeMarkup, /data-state="focus"/);
assert.match(iconBadgeMarkup, /class="badge__icon"/);

const dotBadgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "Unread",
  variant: "dot",
  ariaLabel: "Unread updates",
}));
assert.match(dotBadgeMarkup, /data-variant="dot"/);
assert.match(dotBadgeMarkup, /aria-label="Unread updates"/);
assert.match(dotBadgeMarkup, /class="badge__label"><\/span>/);

const hiddenBadgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "0",
  hidden: true,
}));
assert.match(hiddenBadgeMarkup, /hidden=""/);
assert.match(hiddenBadgeMarkup, /data-state="hidden"/);

const chipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Active",
  variant: "filter",
  tone: "warning",
  selected: true,
  removable: true,
  icon: "filter_alt",
  onRemoveLabel: "Remove Active",
}));
assert.match(chipMarkup, /^<button/);
assert.match(chipMarkup, /class="chip"/);
assert.match(chipMarkup, /data-variant="filter"/);
assert.match(chipMarkup, /data-tone="warning"/);
assert.match(chipMarkup, /data-state="selected"/);
assert.match(chipMarkup, /data-selected="true"/);
assert.match(chipMarkup, /data-chip-remove="true"/);
assert.match(chipMarkup, /aria-pressed="true"/);
assert.match(chipMarkup, /aria-label="Remove Active"/);
assert.match(chipMarkup, /class="chip__icon"/);
assert.match(chipMarkup, /class="chip__label">Active<\/span>/);
assert.match(chipMarkup, /class="chip__remove"/);

const staticChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Suggested",
  variant: "suggestion",
}));
assert.match(staticChipMarkup, /^<span/);
assert.match(staticChipMarkup, /data-variant="suggestion"/);
assert.doesNotMatch(staticChipMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /aria-pressed/);

const tagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Policy",
  variant: "link",
  tone: "info",
  state: "focus",
  icon: "verified",
}));
assert.match(tagMarkup, /^<button/);
assert.match(tagMarkup, /class="tag"/);
assert.match(tagMarkup, /data-variant="link"/);
assert.match(tagMarkup, /data-tone="info"/);
assert.match(tagMarkup, /data-state="focus"/);
assert.match(tagMarkup, /data-interactive="true"/);
assert.match(tagMarkup, /class="tag__icon"/);
assert.match(tagMarkup, /class="tag__label">Policy<\/span>/);

const staticTagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Mobile",
  variant: "platform",
  tone: "neutral",
}));
assert.match(staticTagMarkup, /^<span/);
assert.match(staticTagMarkup, /data-variant="platform"/);

const skeletonMarkup = renderToStaticMarkup(React.createElement(Skeleton, {
  label: "Table loading",
  variant: "table",
  rows: 2,
  columns: 3,
  fullWidth: true,
}));
assert.match(skeletonMarkup, /class="skeleton skeleton--table"/);
assert.match(skeletonMarkup, /role="status"/);
assert.match(skeletonMarkup, /aria-busy="true"/);
assert.match(skeletonMarkup, /aria-label="Table loading"/);
assert.match(skeletonMarkup, /data-variant="table"/);
assert.match(skeletonMarkup, /data-rows="2"/);
assert.match(skeletonMarkup, /data-columns="3"/);
assert.match(skeletonMarkup, /--skeleton-columns:3/);
assert.equal((skeletonMarkup.match(/class="skeleton__row"/g) ?? []).length, 2);
assert.equal((skeletonMarkup.match(/class="skeleton__bone skeleton__cell"/g) ?? []).length, 6);

const sliderMarkup = renderToStaticMarkup(React.createElement(Slider, {
  label: "Search radius",
  value: 9,
  min: 0,
  max: 12,
  step: 1,
  unit: " km",
  variant: "stepped",
  state: "focus",
  density: "lg",
  name: "radius",
}));
assert.match(sliderMarkup, /class="slider"/);
assert.match(sliderMarkup, /data-variant="stepped"/);
assert.match(sliderMarkup, /data-state="focus"/);
assert.match(sliderMarkup, /data-density="lg"/);
assert.match(sliderMarkup, /data-value="9"/);
assert.match(sliderMarkup, /data-unit=" km"/);
assert.match(sliderMarkup, /data-pct="75"/);
assert.match(sliderMarkup, /class="slider__label">Search radius<\/span>/);
assert.match(sliderMarkup, /class="slider__value" data-slider-output="">9 km<\/output>/);
assert.match(sliderMarkup, /type="range"/);
assert.match(sliderMarkup, /class="slider__input"/);
assert.match(sliderMarkup, /name="radius"/);
assert.match(sliderMarkup, /min="0"/);
assert.match(sliderMarkup, /max="12"/);
assert.match(sliderMarkup, /step="1"/);
assert.match(sliderMarkup, /aria-valuetext="9 km"/);
assert.match(sliderMarkup, /class="slider__track"/);
assert.match(sliderMarkup, /class="slider__fill"/);
assert.match(sliderMarkup, /class="slider__thumb"/);

const emptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "No vehicles match",
  description: "Adjust search or status filters.",
  icon: "search_off",
  variant: "search-empty",
  state: "action",
  density: "sm",
  fullWidth: true,
  action: { label: "Clear filters", variant: "secondary", icon: "filter_alt_off" },
}));
assert.match(emptyStateMarkup, /^<section/);
assert.match(emptyStateMarkup, /class="empty-state"/);
assert.match(emptyStateMarkup, /aria-labelledby=/);
assert.match(emptyStateMarkup, /data-variant="search-empty"/);
assert.match(emptyStateMarkup, /data-state="action"/);
assert.match(emptyStateMarkup, /data-density="sm"/);
assert.match(emptyStateMarkup, /data-full-width="true"/);
assert.match(emptyStateMarkup, /class="empty-state__icon"/);
assert.match(emptyStateMarkup, />search_off<\/span>/);
assert.match(emptyStateMarkup, /class="empty-state__title"/);
assert.match(emptyStateMarkup, />No vehicles match<\/h3>/);
assert.match(emptyStateMarkup, /class="empty-state__description"/);
assert.match(emptyStateMarkup, /class="button button--secondary"/);

const loadingEmptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "Loading vehicles",
  state: "loading",
}));
assert.match(loadingEmptyStateMarkup, /data-state="loading"/);
assert.match(loadingEmptyStateMarkup, /class="spinner"/);

const errorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Sync failed",
  description: "We could not load the latest card data.",
  tone: "warning",
  variant: "blocking",
  state: "warning",
  density: "sm",
  fullWidth: true,
  action: { label: "Try again", icon: "refresh" },
}));
assert.match(errorPanelMarkup, /^<section/);
assert.match(errorPanelMarkup, /class="error-panel error-panel--warning"/);
assert.match(errorPanelMarkup, /role="status"/);
assert.match(errorPanelMarkup, /data-variant="blocking"/);
assert.match(errorPanelMarkup, /data-state="warning"/);
assert.match(errorPanelMarkup, /data-density="sm"/);
assert.match(errorPanelMarkup, /data-full-width="true"/);
assert.match(errorPanelMarkup, /class="error-panel__icon"/);
assert.match(errorPanelMarkup, />warning<\/span>/);
assert.match(errorPanelMarkup, /class="error-panel__content"/);
assert.match(errorPanelMarkup, /<strong>Sync failed<\/strong>/);
assert.match(errorPanelMarkup, /<p>We could not load the latest card data\.<\/p>/);
assert.match(errorPanelMarkup, /class="button button--secondary"/);

const loadingErrorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Loading recovery",
  state: "loading",
  action: { label: "Wait" },
}));
assert.match(loadingErrorPanelMarkup, /data-state="loading"/);
assert.match(loadingErrorPanelMarkup, /role="status"/);
assert.match(loadingErrorPanelMarkup, /class="spinner"/);
assert.match(loadingErrorPanelMarkup, /aria-busy="true"/);
assert.doesNotMatch(staticTagMarkup, /data-interactive/);

const disabledTagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Disabled",
  variant: "link",
  state: "disabled",
}));
assert.match(disabledTagMarkup, /disabled=""/);
assert.match(disabledTagMarkup, /data-state="disabled"/);

const toastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Route updated",
  description: "The driver received the new route.",
  tone: "success",
  variant: "undo",
  state: "action",
  density: "sm",
  actionLabel: "Undo",
  dismissible: true,
}));
assert.match(toastMarkup, /^<article/);
assert.match(toastMarkup, /class="toast"/);
assert.match(toastMarkup, /role="status"/);
assert.match(toastMarkup, /aria-live="polite"/);
assert.match(toastMarkup, /data-tone="success"/);
assert.match(toastMarkup, /data-variant="undo"/);
assert.match(toastMarkup, /data-state="action"/);
assert.match(toastMarkup, /data-density="sm"/);
assert.match(toastMarkup, /class="toast__icon"/);
assert.match(toastMarkup, />check_circle<\/span>/);
assert.match(toastMarkup, /class="toast__content"/);
assert.match(toastMarkup, /<strong>Route updated<\/strong>/);
assert.match(toastMarkup, /<p>The driver received the new route\.<\/p>/);
assert.match(toastMarkup, /class="button button--ghost toast__action"/);
assert.match(toastMarkup, /data-toast-action=""/);
assert.match(toastMarkup, /class="icon-button icon-button--ghost toast__dismiss"/);
assert.match(toastMarkup, /data-toast-dismiss=""/);

const warningToastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Policy conflict",
  tone: "warning",
}));
assert.match(warningToastMarkup, /role="alert"/);
assert.match(warningToastMarkup, /aria-live="assertive"/);

const hiddenToastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Hidden",
  state: "default",
}));
assert.match(hiddenToastMarkup, /hidden=""/);

const tooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerLabel: "Info",
  content: "Short contextual help",
  id: "tip-react",
  placement: "right",
  density: "sm",
}));
assert.match(tooltipMarkup, /class="tooltip"/);
assert.match(tooltipMarkup, /data-placement="right"/);
assert.match(tooltipMarkup, /data-density="sm"/);
assert.match(tooltipMarkup, /data-open="false"/);
assert.match(tooltipMarkup, /class="tooltip__trigger"/);
assert.match(tooltipMarkup, /role="tooltip"/);
assert.match(tooltipMarkup, /hidden=""/);

const openTooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerLabel: "Cost",
  content: "Cost per km",
  id: "tip-cost",
  variant: "metric",
  state: "open",
}));
assert.match(openTooltipMarkup, /data-variant="metric"/);
assert.match(openTooltipMarkup, /data-open="true"/);
assert.match(openTooltipMarkup, /aria-describedby="tip-cost"/);
assert.doesNotMatch(openTooltipMarkup, /hidden=""/);

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

const dateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
  helper: "One bounded date range.",
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
assert.match(dateRangePickerMarkup, /data-date-range-picker-from=""/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-to=""/);
assert.match(dateRangePickerMarkup, /class="date-picker__panel date-range-picker__panel"/);
assert.match(dateRangePickerMarkup, /role="dialog"/);
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
