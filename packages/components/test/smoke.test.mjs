import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createAnimationAsset,
  createChartsPrimitive,
  countryFlagAssetPath,
  hasCountryFlag,
  listCountryFlags,
  resolveAnimationRuntime,
  hydrateCombobox,
  animatedMomentPlatformAdapters,
  animatedMomentPlatformContract,
  animatedMomentPlatformProps,
  auditEventPlatformAdapters,
  auditEventPlatformContract,
  auditEventPlatformProps,
  accordionPlatformAdapters,
  accordionPlatformContract,
  accordionPlatformProps,
  cardExpiryInputPlatformAdapters,
  cardPlatformAdapters,
  cardPlatformContract,
  cardPlatformProps,
  cardSummaryPlatformAdapters,
  cardSummaryPlatformContract,
  cardSummaryPlatformProps,
  chartPanelPlatformAdapters,
  chartPanelPlatformContract,
  chartPanelPlatformProps,
  avatarPlatformAdapters,
  avatarPlatformContract,
  avatarPlatformProps,
  badgePlatformAdapters,
  badgePlatformContract,
  badgePlatformProps,
  biometricPromptPlatformAdapters,
  biometricPromptPlatformContract,
  biometricPromptPlatformProps,
  breadcrumbsPlatformAdapters,
  breadcrumbsPlatformContract,
  breadcrumbsPlatformProps,
  cardExpiryInputPlatformContract,
  cardExpiryInputPlatformProps,
  cardNumberInputPlatformAdapters,
  cardNumberInputPlatformContract,
  cardNumberInputPlatformProps,
  cardSecurityCodeInputPlatformAdapters,
  cardSecurityCodeInputPlatformContract,
  cardSecurityCodeInputPlatformProps,
  codeInputPlatformAdapters,
  codeInputPlatformContract,
  codeInputPlatformProps,
  comboboxPlatformAdapters,
  comboboxPlatformContract,
  comboboxPlatformProps,
  countrySelectorPlatformAdapters,
  countrySelectorPlatformContract,
  countrySelectorPlatformProps,
  datePickerPlatformAdapters,
  datePickerPlatformContract,
  datePickerPlatformProps,
  dateRangePickerPlatformAdapters,
  dateRangePickerPlatformContract,
  dateRangePickerPlatformProps,
  dialogPlatformAdapters,
  dialogPlatformContract,
  dialogPlatformProps,
  drawerPlatformAdapters,
  drawerPlatformContract,
  drawerPlatformProps,
  emptyStatePlatformAdapters,
  emptyStatePlatformContract,
  emptyStatePlatformProps,
  errorPanelPlatformAdapters,
  errorPanelPlatformContract,
  errorPanelPlatformProps,
  floatingActionButtonPlatformAdapters,
  floatingActionButtonPlatformContract,
  floatingActionButtonPlatformProps,
  phoneInputPlatformAdapters,
  phoneInputPlatformContract,
  phoneInputPlatformProps,
  popoverPlatformAdapters,
  popoverPlatformContract,
  popoverPlatformProps,
  paginationPlatformAdapters,
  paginationPlatformContract,
  paginationPlatformProps,
  progressIndicatorPlatformAdapters,
  progressIndicatorPlatformContract,
  progressIndicatorPlatformProps,
  buttonPlatformAdapters,
  buttonPlatformContract,
  buttonPlatformProps,
  checkboxPlatformAdapters,
  checkboxPlatformContract,
  checkboxPlatformProps,
  chipPlatformAdapters,
  chipPlatformContract,
  chipPlatformProps,
  iconButtonPlatformAdapters,
  iconButtonPlatformContract,
  iconButtonPlatformProps,
  inlineValidationPlatformAdapters,
  inlineValidationPlatformContract,
  inlineValidationPlatformProps,
  inputPlatformAdapters,
  inputPlatformContract,
  inputPlatformProps,
  kpiTilePlatformAdapters,
  kpiTilePlatformContract,
  kpiTilePlatformProps,
  listPlatformAdapters,
  listPlatformContract,
  listPlatformProps,
  menuPlatformAdapters,
  menuPlatformContract,
  menuPlatformProps,
  motionBoundaryPlatformAdapters,
  motionBoundaryPlatformContract,
  motionBoundaryPlatformProps,
  movementRowPlatformAdapters,
  movementRowPlatformContract,
  movementRowPlatformProps,
  quickActionPlatformAdapters,
  quickActionPlatformContract,
  quickActionPlatformProps,
  radioButtonPlatformAdapters,
  radioButtonPlatformContract,
  radioButtonPlatformProps,
  routeSummaryPlatformAdapters,
  routeSummaryPlatformContract,
  routeSummaryPlatformProps,
  stationPinPlatformAdapters,
  stationPinPlatformContract,
  stationPinPlatformProps,
  selectPlatformAdapters,
  selectPlatformContract,
  selectPlatformProps,
  segmentedControlPlatformAdapters,
  segmentedControlPlatformContract,
  segmentedControlPlatformProps,
  skeletonPlatformAdapters,
  skeletonPlatformContract,
  skeletonPlatformProps,
  sliderPlatformAdapters,
  sliderPlatformContract,
  sliderPlatformProps,
  spinnerPlatformAdapters,
  spinnerPlatformContract,
  spinnerPlatformProps,
  stepperPlatformAdapters,
  stepperPlatformContract,
  stepperPlatformProps,
  tabsPlatformAdapters,
  tabsPlatformContract,
  tabsPlatformProps,
  tablePlatformAdapters,
  tablePlatformContract,
  tablePlatformProps,
  switchPlatformAdapters,
  switchPlatformContract,
  switchPlatformProps,
  tagPlatformAdapters,
  tagPlatformContract,
  tagPlatformProps,
  toastPlatformAdapters,
  toastPlatformContract,
  toastPlatformProps,
  tooltipPlatformAdapters,
  tooltipPlatformContract,
  tooltipPlatformProps,
  treeViewPlatformAdapters,
  treeViewPlatformContract,
  treeViewPlatformProps,
  textAreaPlatformAdapters,
  textAreaPlatformContract,
  textAreaPlatformProps,
} from "../src/index.js";
import { createCountrySelector, hydrateCountrySelector } from "../src/components/specialized-inputs.js?v=28";
import { createCombobox } from "../src/components/fields.js?v=21";
import {
  createTransitionalPaymentCardExpiryInput,
  hydrateTransitionalPaymentCardExpiryInput,
  createTransitionalPaymentCardNumberInput,
  hydrateTransitionalPaymentCardNumberInput,
  createTransitionalPaymentCardSecurityCodeInput,
  hydrateTransitionalPaymentCardSecurityCodeInput,
  createTransitionalDatePicker,
  createTransitionalDateRangePicker,
  createTransitionalPhoneInput,
  createTransitionalSecurityCodeInput,
} from "../src/components/specialized-inputs.js?v=28";
import { createTransitionalActionButton, createTransitionalActionIconButton } from "../src/components/actions.js";
import { createTransitionalChoiceRadioButton } from "../src/components/choices.js";
import { createTransitionalFieldInput, createTransitionalFieldSelect, createTransitionalFieldTextArea } from "../src/components/fields.js";

const componentsCss = readFileSync(new URL("../styles/components.css", import.meta.url), "utf8");
import { componentContractVersion, componentContracts } from "../src/contracts.js";

class TestNode {
  constructor(tagName = "") {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.alt = "";
    this.dataset = {};
    this.className = "";
    this.checked = false;
    this.disabled = false;
    this.hidden = false;
    this.id = "";
    this.href = "";
    this.indeterminate = false;
    this.maxLength = -1;
    this.max = "";
    this.min = "";
    this.name = "";
    this.required = false;
    this.rows = 0;
    this.selected = false;
    this.src = "";
    this.step = "";
    this.style = "";
    this.tabIndex = 0;
    this.textContent = "";
    this.type = "";
    this.value = "";
    this.placeholder = "";
    this.eventListeners = {};
    this.parentNode = null;
    this.offsetLeft = 0;
    this.offsetWidth = 0;
  }

  append(...nodes) {
    for (const node of nodes) {
      if (typeof node === "string") {
        const textNode = new TestText(node);
        textNode.parentNode = this;
        this.children.push(textNode);
      } else {
        node.parentNode = this;
        this.children.push(node);
      }
    }
    this.textContent = this.children.map((node) => node.textContent ?? "").join("");
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "hidden") this.hidden = true;
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  addEventListener(type, listener) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  }

  dispatchEvent(event) {
    event.target = event.target ?? this;
    event.currentTarget = this;
    for (const listener of this.eventListeners[event.type] ?? []) listener(event);
    return !event.defaultPrevented;
  }

  click() {
    this.dispatchEvent({ type: "click" });
  }

  focus() {
    globalThis.document.activeElement = this;
  }

  contains(node) {
    if (node === this) return true;
    return this.children.some((child) => child?.contains?.(node));
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (node) => {
      if (node instanceof TestText) return;
      if (selector.startsWith(".") && node.className.split(" ").includes(selector.slice(1))) {
        matches.push(node);
      } else if (!selector.startsWith(".") && node.tagName.toLowerCase() === selector.toLowerCase()) {
        matches.push(node);
      }
      for (const child of node.children) visit(child);
    };
    visit(this);
    return matches;
  }
}

class TestText {
  constructor(text) {
    this.textContent = text;
    this.parentNode = null;
  }

  contains(node) {
    return node === this;
  }
}

globalThis.document = {
  activeElement: null,
  eventListeners: {},
  addEventListener(type, listener) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(listener);
  },
  dispatchEvent(event) {
    for (const listener of this.eventListeners[event.type] ?? []) listener(event);
  },
  createElement(tagName) {
    return new TestNode(tagName);
  },
  createTextNode(text) {
    return new TestText(text);
  },
};

assert.equal(componentContractVersion, "0.1.0");
assert.deepEqual(Object.keys(componentContracts), ["button", "iconButton", "input", "cardNumberInput", "cardExpiryInput", "cardSecurityCodeInput", "select", "combobox", "card", "checkbox", "switch", "radioButton", "textArea", "badge", "chip", "tag", "tabs", "tooltip", "toast", "progressIndicator", "spinner", "accordion", "slider", "avatar", "skeleton", "dialog", "menu", "drawer", "table", "biometricPrompt", "treeView", "motionBoundary", "animatedMoment", "emptyState", "list", "kpiTile", "floatingActionButton", "breadcrumbs", "pagination", "auditEvent", "errorPanel", "inlineValidation", "stepper", "chartPanel", "stationPin", "routeSummary", "codeInput", "phoneInput", "countrySelector", "datePicker", "dateRangePicker", "segmentedControl", "popover", "cardSummary", "movementRow", "quickAction"]);
assert.equal(componentContracts.button.factory, "@design-system/react/button");
assert.equal(componentContracts.button.internalFactory, "createTransitionalActionButton");
assert.equal(buttonPlatformContract.id, "button");
assert.equal(buttonPlatformContract.source.factory, componentContracts.button.factory);
assert.deepEqual(buttonPlatformProps(), componentContracts.button.props.map((prop) => prop.name));
assert.deepEqual(buttonPlatformContract.variants, componentContracts.button.variants);
assert.deepEqual(buttonPlatformContract.states, componentContracts.button.states);
assert.deepEqual(Object.keys(buttonPlatformAdapters), ["react"]);
assert.equal(buttonPlatformAdapters.react.componentName, "Button");
assert.equal(buttonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.iconButton.factory, "@design-system/react/icon-button");
assert.equal(componentContracts.iconButton.internalFactory, "createTransitionalActionIconButton");
assert.equal(iconButtonPlatformContract.id, "icon-button");
assert.equal(iconButtonPlatformContract.source.factory, componentContracts.iconButton.factory);
assert.deepEqual(iconButtonPlatformProps(), componentContracts.iconButton.props.map((prop) => prop.name));
assert.deepEqual(iconButtonPlatformContract.variants, componentContracts.iconButton.variants);
assert.deepEqual(iconButtonPlatformContract.states, componentContracts.iconButton.states);
assert.deepEqual(Object.keys(iconButtonPlatformAdapters), ["react"]);
assert.equal(iconButtonPlatformAdapters.react.componentName, "IconButton");
assert.equal(iconButtonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.input.factory, "@design-system/react/input");
assert.equal(componentContracts.input.internalFactory, "createTransitionalFieldInput");
assert.equal(inputPlatformContract.id, "input");
assert.equal(inputPlatformContract.source.factory, componentContracts.input.factory);
assert.deepEqual(inputPlatformProps(), componentContracts.input.props.map((prop) => prop.name));
assert.deepEqual(inputPlatformContract.variants, componentContracts.input.variants);
assert.deepEqual(inputPlatformContract.states, componentContracts.input.states);
assert.deepEqual(Object.keys(inputPlatformAdapters), ["react"]);
assert.equal(inputPlatformAdapters.react.componentName, "Input");
assert.equal(inputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.cardNumberInput.factory, "@design-system/react/card-number-input");
assert.equal(componentContracts.cardNumberInput.internalFactory, "createTransitionalPaymentCardNumberInput");
assert.equal(cardNumberInputPlatformContract.id, "card-number-input");
assert.equal(cardNumberInputPlatformContract.source.factory, componentContracts.cardNumberInput.factory);
assert.deepEqual(cardNumberInputPlatformProps(), componentContracts.cardNumberInput.props.map((prop) => prop.name));
assert.deepEqual(cardNumberInputPlatformContract.variants, componentContracts.cardNumberInput.variants);
assert.deepEqual(cardNumberInputPlatformContract.states, componentContracts.cardNumberInput.states);
assert.deepEqual(Object.keys(cardNumberInputPlatformAdapters), ["react"]);
assert.equal(cardNumberInputPlatformAdapters.react.componentName, "CardNumberInput");
assert.equal(cardNumberInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.cardExpiryInput.factory, "@design-system/react/card-expiry-input");
assert.equal(componentContracts.cardExpiryInput.internalFactory, "createTransitionalPaymentCardExpiryInput");
assert.equal(cardExpiryInputPlatformContract.id, "card-expiry-input");
assert.equal(cardExpiryInputPlatformContract.source.factory, componentContracts.cardExpiryInput.factory);
assert.deepEqual(cardExpiryInputPlatformProps(), componentContracts.cardExpiryInput.props.map((prop) => prop.name));
assert.deepEqual(cardExpiryInputPlatformContract.variants, componentContracts.cardExpiryInput.variants);
assert.deepEqual(cardExpiryInputPlatformContract.states, componentContracts.cardExpiryInput.states);
assert.deepEqual(Object.keys(cardExpiryInputPlatformAdapters), ["react"]);
assert.equal(cardExpiryInputPlatformAdapters.react.componentName, "CardExpiryInput");
assert.equal(cardExpiryInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.cardSecurityCodeInput.factory, "@design-system/react/card-security-code-input");
assert.equal(componentContracts.cardSecurityCodeInput.internalFactory, "createTransitionalPaymentCardSecurityCodeInput");
assert.equal(cardSecurityCodeInputPlatformContract.id, "card-security-code-input");
assert.equal(cardSecurityCodeInputPlatformContract.source.factory, componentContracts.cardSecurityCodeInput.factory);
assert.deepEqual(cardSecurityCodeInputPlatformProps(), componentContracts.cardSecurityCodeInput.props.map((prop) => prop.name));
assert.deepEqual(cardSecurityCodeInputPlatformContract.variants, componentContracts.cardSecurityCodeInput.variants);
assert.deepEqual(cardSecurityCodeInputPlatformContract.states, componentContracts.cardSecurityCodeInput.states);
assert.deepEqual(Object.keys(cardSecurityCodeInputPlatformAdapters), ["react"]);
assert.equal(cardSecurityCodeInputPlatformAdapters.react.componentName, "CardSecurityCodeInput");
assert.equal(cardSecurityCodeInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.select.factory, "@design-system/react/select");
assert.equal(componentContracts.select.internalFactory, "createTransitionalFieldSelect");
assert.equal(selectPlatformContract.id, "select");
assert.equal(selectPlatformContract.source.factory, componentContracts.select.factory);
assert.deepEqual(selectPlatformProps(), componentContracts.select.props.map((prop) => prop.name));
assert.deepEqual(selectPlatformContract.variants, componentContracts.select.variants);
assert.deepEqual(selectPlatformContract.states, componentContracts.select.states);
assert.deepEqual(Object.keys(selectPlatformAdapters), ["react"]);
assert.equal(selectPlatformAdapters.react.componentName, "Select");
assert.equal(selectPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.switch.factory, "@design-system/react/switch");
assert.equal(switchPlatformContract.id, "switch");
assert.equal(switchPlatformContract.source.factory, componentContracts.switch.factory);
assert.deepEqual(switchPlatformProps(), componentContracts.switch.props.map((prop) => prop.name));
assert.deepEqual(switchPlatformContract.variants, componentContracts.switch.variants);
assert.deepEqual(switchPlatformContract.states, componentContracts.switch.states);
assert.deepEqual(Object.keys(switchPlatformAdapters), ["react"]);
assert.equal(switchPlatformAdapters.react.componentName, "Switch");
assert.equal(switchPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.textArea.factory, "@design-system/react/text-area");
assert.equal(componentContracts.textArea.internalFactory, "createTransitionalFieldTextArea");
assert.equal(textAreaPlatformContract.id, "text-area");
assert.equal(textAreaPlatformContract.source.factory, componentContracts.textArea.factory);
assert.deepEqual(textAreaPlatformProps(), componentContracts.textArea.props.map((prop) => prop.name));
assert.deepEqual(textAreaPlatformContract.variants, componentContracts.textArea.variants);
assert.deepEqual(textAreaPlatformContract.states, componentContracts.textArea.states);
assert.deepEqual(Object.keys(textAreaPlatformAdapters), ["react"]);
assert.equal(textAreaPlatformAdapters.react.componentName, "TextArea");
assert.equal(textAreaPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.combobox.factory, "@design-system/react/combobox");
assert.equal(componentContracts.combobox.internalFactory, "createCombobox");
assert.equal(comboboxPlatformContract.id, "combobox");
assert.equal(comboboxPlatformContract.source.factory, componentContracts.combobox.factory);
assert.deepEqual(comboboxPlatformProps(), componentContracts.combobox.props.map((prop) => prop.name));
assert.deepEqual(comboboxPlatformContract.variants, componentContracts.combobox.variants);
assert.deepEqual(comboboxPlatformContract.states, componentContracts.combobox.states);
assert.deepEqual(Object.keys(comboboxPlatformAdapters), ["react"]);
assert.equal(comboboxPlatformAdapters.react.componentName, "Combobox");
assert.equal(comboboxPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.card.factory, "@design-system/react/card");
assert.equal(componentContracts.card.internalFactory, undefined);
assert.equal(cardPlatformContract.id, "card");
assert.equal(cardPlatformContract.source.factory, componentContracts.card.factory);
assert.equal(cardPlatformContract.source.internalFactory, undefined);
assert.deepEqual(cardPlatformProps(), componentContracts.card.props.map((prop) => prop.name));
assert.deepEqual(cardPlatformContract.variants, componentContracts.card.variants);
assert.deepEqual(cardPlatformContract.states, componentContracts.card.states);
assert.deepEqual(Object.keys(cardPlatformAdapters), ["react"]);
assert.equal(cardPlatformAdapters.react.componentName, "Card");
assert.equal(cardPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.checkbox.factory, "@design-system/react/checkbox");
assert.equal(checkboxPlatformContract.id, "checkbox");
assert.equal(checkboxPlatformContract.source.factory, componentContracts.checkbox.factory);
assert.deepEqual(checkboxPlatformProps(), componentContracts.checkbox.props.map((prop) => prop.name));
assert.deepEqual(checkboxPlatformContract.variants, componentContracts.checkbox.variants);
assert.deepEqual(checkboxPlatformContract.states, componentContracts.checkbox.states);
assert.deepEqual(Object.keys(checkboxPlatformAdapters), ["react"]);
assert.equal(checkboxPlatformAdapters.react.componentName, "Checkbox");
assert.equal(checkboxPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.switch.factory, "@design-system/react/switch");
assert.equal(componentContracts.radioButton.factory, "@design-system/react/radio-button");
assert.equal(componentContracts.radioButton.internalFactory, "createTransitionalChoiceRadioButton");
assert.equal(radioButtonPlatformContract.id, "radio-button");
assert.equal(radioButtonPlatformContract.source.factory, componentContracts.radioButton.factory);
assert.deepEqual(radioButtonPlatformProps(), componentContracts.radioButton.props.map((prop) => prop.name));
assert.deepEqual(radioButtonPlatformContract.variants, componentContracts.radioButton.variants);
assert.deepEqual(radioButtonPlatformContract.states, componentContracts.radioButton.states);
assert.deepEqual(Object.keys(radioButtonPlatformAdapters), ["react"]);
assert.equal(radioButtonPlatformAdapters.react.componentName, "RadioButton");
assert.equal(radioButtonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.textArea.factory, "@design-system/react/text-area");
assert.equal(componentContracts.badge.factory, "@design-system/react/badge");
assert.equal(badgePlatformContract.id, "badge");
assert.equal(badgePlatformContract.source.factory, componentContracts.badge.factory);
assert.deepEqual(badgePlatformProps(), componentContracts.badge.props.map((prop) => prop.name));
assert.deepEqual(badgePlatformContract.variants, componentContracts.badge.variants);
assert.deepEqual(badgePlatformContract.states, componentContracts.badge.states);
assert.deepEqual(Object.keys(badgePlatformAdapters), ["react"]);
assert.equal(badgePlatformAdapters.react.componentName, "Badge");
assert.equal(badgePlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.chip.factory, "@design-system/react/chip");
assert.equal(chipPlatformContract.id, "chip");
assert.equal(chipPlatformContract.source.factory, componentContracts.chip.factory);
assert.deepEqual(chipPlatformProps(), componentContracts.chip.props.map((prop) => prop.name));
assert.deepEqual(chipPlatformContract.variants, componentContracts.chip.variants);
assert.deepEqual(chipPlatformContract.states, componentContracts.chip.states);
assert.deepEqual(Object.keys(chipPlatformAdapters), ["react"]);
assert.equal(chipPlatformAdapters.react.componentName, "Chip");
assert.equal(chipPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.tag.factory, "@design-system/react/tag");
assert.equal(tagPlatformContract.id, "tag");
assert.equal(tagPlatformContract.source.factory, componentContracts.tag.factory);
assert.deepEqual(tagPlatformProps(), componentContracts.tag.props.map((prop) => prop.name));
assert.deepEqual(tagPlatformContract.variants, componentContracts.tag.variants);
assert.deepEqual(tagPlatformContract.states, componentContracts.tag.states);
assert.deepEqual(Object.keys(tagPlatformAdapters), ["react"]);
assert.equal(tagPlatformAdapters.react.componentName, "Tag");
assert.equal(tagPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.tabs.factory, "@design-system/react/tabs");
assert.equal(tabsPlatformContract.id, "tabs");
assert.equal(tabsPlatformContract.source.factory, componentContracts.tabs.factory);
assert.deepEqual(tabsPlatformProps(), componentContracts.tabs.props.map((prop) => prop.name));
assert.deepEqual(tabsPlatformContract.variants, componentContracts.tabs.variants);
assert.deepEqual(tabsPlatformContract.states, componentContracts.tabs.states);
assert.deepEqual(Object.keys(tabsPlatformAdapters), ["react"]);
assert.equal(tabsPlatformAdapters.react.componentName, "Tabs");
assert.equal(tabsPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.breadcrumbs.factory, "@design-system/react/breadcrumbs");
assert.equal(breadcrumbsPlatformContract.id, "breadcrumbs");
assert.equal(breadcrumbsPlatformContract.source.factory, componentContracts.breadcrumbs.factory);
assert.deepEqual(breadcrumbsPlatformProps(), componentContracts.breadcrumbs.props.map((prop) => prop.name));
assert.deepEqual(breadcrumbsPlatformContract.variants, componentContracts.breadcrumbs.variants);
assert.deepEqual(breadcrumbsPlatformContract.states, componentContracts.breadcrumbs.states);
assert.deepEqual(Object.keys(breadcrumbsPlatformAdapters), ["react"]);
assert.equal(breadcrumbsPlatformAdapters.react.componentName, "Breadcrumbs");
assert.equal(breadcrumbsPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.tooltip.factory, "@design-system/react/tooltip");
assert.equal(tooltipPlatformContract.id, "tooltip");
assert.equal(tooltipPlatformContract.source.factory, componentContracts.tooltip.factory);
assert.deepEqual(tooltipPlatformProps(), componentContracts.tooltip.props.map((prop) => prop.name));
assert.deepEqual(tooltipPlatformContract.variants, componentContracts.tooltip.variants);
assert.deepEqual(tooltipPlatformContract.states, componentContracts.tooltip.states);
assert.deepEqual(Object.keys(tooltipPlatformAdapters), ["react"]);
assert.equal(tooltipPlatformAdapters.react.componentName, "Tooltip");
assert.equal(tooltipPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.toast.factory, "@design-system/react/toast");
assert.equal(toastPlatformContract.id, "toast");
assert.equal(toastPlatformContract.source.factory, componentContracts.toast.factory);
assert.deepEqual(toastPlatformProps(), componentContracts.toast.props.map((prop) => prop.name));
assert.deepEqual(toastPlatformContract.variants, componentContracts.toast.variants);
assert.deepEqual(toastPlatformContract.states, componentContracts.toast.states);
assert.deepEqual(Object.keys(toastPlatformAdapters), ["react"]);
assert.equal(toastPlatformAdapters.react.componentName, "Toast");
assert.equal(toastPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.progressIndicator.factory, "@design-system/react/progress-indicator");
assert.equal(progressIndicatorPlatformContract.id, "progress-indicator");
assert.equal(progressIndicatorPlatformContract.source.factory, componentContracts.progressIndicator.factory);
assert.deepEqual(progressIndicatorPlatformProps(), componentContracts.progressIndicator.props.map((prop) => prop.name));
assert.deepEqual(progressIndicatorPlatformContract.variants, componentContracts.progressIndicator.variants);
assert.deepEqual(progressIndicatorPlatformContract.states, componentContracts.progressIndicator.states);
assert.deepEqual(Object.keys(progressIndicatorPlatformAdapters), ["react"]);
assert.equal(progressIndicatorPlatformAdapters.react.componentName, "ProgressIndicator");
assert.equal(progressIndicatorPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.spinner.factory, "@design-system/react/spinner");
assert.equal(componentContracts.spinner.internalFactory, "createSpinner");
assert.equal(spinnerPlatformContract.id, "spinner");
assert.equal(spinnerPlatformContract.source.factory, componentContracts.spinner.factory);
assert.deepEqual(spinnerPlatformProps(), componentContracts.spinner.props.map((prop) => prop.name));
assert.deepEqual(spinnerPlatformContract.variants, componentContracts.spinner.variants);
assert.deepEqual(spinnerPlatformContract.states, componentContracts.spinner.states);
assert.deepEqual(Object.keys(spinnerPlatformAdapters), ["react"]);
assert.equal(spinnerPlatformAdapters.react.componentName, "Spinner");
assert.equal(spinnerPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.accordion.factory, "@design-system/react/accordion");
assert.equal(accordionPlatformContract.id, "accordion");
assert.equal(accordionPlatformContract.source.factory, componentContracts.accordion.factory);
assert.deepEqual(accordionPlatformProps(), componentContracts.accordion.props.map((prop) => prop.name));
assert.deepEqual(accordionPlatformContract.variants, componentContracts.accordion.variants);
assert.deepEqual(accordionPlatformContract.states, componentContracts.accordion.states);
assert.deepEqual(Object.keys(accordionPlatformAdapters), ["react"]);
assert.equal(accordionPlatformAdapters.react.componentName, "Accordion");
assert.equal(accordionPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.slider.factory, "@design-system/react/slider");
assert.equal(sliderPlatformContract.id, "slider");
assert.equal(sliderPlatformContract.source.factory, componentContracts.slider.factory);
assert.deepEqual(sliderPlatformProps(), componentContracts.slider.props.map((prop) => prop.name));
assert.deepEqual(sliderPlatformContract.variants, componentContracts.slider.variants);
assert.deepEqual(sliderPlatformContract.states, componentContracts.slider.states);
assert.deepEqual(Object.keys(sliderPlatformAdapters), ["react"]);
assert.equal(sliderPlatformAdapters.react.componentName, "Slider");
assert.equal(sliderPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.avatar.factory, "@design-system/react/avatar");
assert.equal(avatarPlatformContract.id, "avatar");
assert.equal(avatarPlatformContract.source.factory, componentContracts.avatar.factory);
assert.deepEqual(avatarPlatformProps(), componentContracts.avatar.props.map((prop) => prop.name));
assert.deepEqual(avatarPlatformContract.variants, componentContracts.avatar.variants);
assert.deepEqual(avatarPlatformContract.states, componentContracts.avatar.states);
assert.deepEqual(Object.keys(avatarPlatformAdapters), ["react"]);
assert.equal(avatarPlatformAdapters.react.componentName, "Avatar");
assert.equal(avatarPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.skeleton.factory, "@design-system/react/skeleton");
assert.equal(skeletonPlatformContract.id, "skeleton");
assert.equal(skeletonPlatformContract.source.factory, componentContracts.skeleton.factory);
assert.deepEqual(skeletonPlatformProps(), componentContracts.skeleton.props.map((prop) => prop.name));
assert.deepEqual(skeletonPlatformContract.variants, componentContracts.skeleton.variants);
assert.deepEqual(skeletonPlatformContract.states, componentContracts.skeleton.states);
assert.deepEqual(Object.keys(skeletonPlatformAdapters), ["react"]);
assert.equal(skeletonPlatformAdapters.react.componentName, "Skeleton");
assert.equal(skeletonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.dialog.factory, "@design-system/react/dialog");
assert.equal(dialogPlatformContract.id, "dialog");
assert.equal(dialogPlatformContract.source.factory, componentContracts.dialog.factory);
assert.deepEqual(dialogPlatformProps(), componentContracts.dialog.props.map((prop) => prop.name));
assert.deepEqual(dialogPlatformContract.variants, componentContracts.dialog.variants);
assert.deepEqual(dialogPlatformContract.states, componentContracts.dialog.states);
assert.deepEqual(Object.keys(dialogPlatformAdapters), ["react"]);
assert.equal(dialogPlatformAdapters.react.componentName, "Dialog");
assert.equal(dialogPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.menu.factory, "@design-system/react/menu");
assert.equal(menuPlatformContract.id, "menu");
assert.equal(menuPlatformContract.source.factory, componentContracts.menu.factory);
assert.deepEqual(menuPlatformProps(), componentContracts.menu.props.map((prop) => prop.name));
assert.deepEqual(menuPlatformContract.variants, componentContracts.menu.variants);
assert.deepEqual(menuPlatformContract.states, componentContracts.menu.states);
assert.deepEqual(Object.keys(menuPlatformAdapters), ["react"]);
assert.equal(menuPlatformAdapters.react.componentName, "Menu");
assert.equal(menuPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.drawer.factory, "@design-system/react/drawer");
assert.equal(drawerPlatformContract.id, "drawer");
assert.equal(drawerPlatformContract.source.factory, componentContracts.drawer.factory);
assert.deepEqual(drawerPlatformProps(), componentContracts.drawer.props.map((prop) => prop.name));
assert.deepEqual(drawerPlatformContract.variants, componentContracts.drawer.variants);
assert.deepEqual(drawerPlatformContract.states, componentContracts.drawer.states);
assert.deepEqual(Object.keys(drawerPlatformAdapters), ["react"]);
assert.equal(drawerPlatformAdapters.react.componentName, "Drawer");
assert.equal(drawerPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.table.factory, "@design-system/react/table");
assert.equal(tablePlatformContract.id, "table");
assert.equal(tablePlatformContract.source.factory, componentContracts.table.factory);
assert.deepEqual(tablePlatformProps(), componentContracts.table.props.map((prop) => prop.name));
assert.deepEqual(tablePlatformContract.variants, componentContracts.table.variants);
assert.deepEqual(tablePlatformContract.states, componentContracts.table.states);
assert.deepEqual(Object.keys(tablePlatformAdapters), ["react"]);
assert.equal(tablePlatformAdapters.react.componentName, "Table");
assert.equal(tablePlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.biometricPrompt.factory, "@design-system/react/biometric-prompt");
assert.equal(biometricPromptPlatformContract.id, "biometric-prompt");
assert.equal(biometricPromptPlatformContract.source.factory, componentContracts.biometricPrompt.factory);
assert.deepEqual(biometricPromptPlatformProps(), componentContracts.biometricPrompt.props.map((prop) => prop.name));
assert.deepEqual(biometricPromptPlatformContract.variants, componentContracts.biometricPrompt.variants);
assert.deepEqual(biometricPromptPlatformContract.states, componentContracts.biometricPrompt.states);
assert.deepEqual(Object.keys(biometricPromptPlatformAdapters), ["react"]);
assert.equal(biometricPromptPlatformAdapters.react.componentName, "BiometricPrompt");
assert.equal(biometricPromptPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.treeView.factory, "@design-system/react/tree-view");
assert.equal(treeViewPlatformContract.id, "tree-view");
assert.equal(treeViewPlatformContract.source.factory, componentContracts.treeView.factory);
assert.deepEqual(treeViewPlatformProps(), componentContracts.treeView.props.map((prop) => prop.name));
assert.deepEqual(Object.keys(treeViewPlatformAdapters), ["react"]);
assert.equal(treeViewPlatformAdapters.react.componentName, "TreeView");
assert.equal(treeViewPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.motionBoundary.factory, "@design-system/react/motion-boundary");
assert.equal(motionBoundaryPlatformContract.id, "motion-boundary");
assert.equal(motionBoundaryPlatformContract.source.factory, componentContracts.motionBoundary.factory);
assert.deepEqual(motionBoundaryPlatformProps(), componentContracts.motionBoundary.props.map((prop) => prop.name));
assert.deepEqual(motionBoundaryPlatformContract.variants, componentContracts.motionBoundary.variants);
assert.deepEqual(motionBoundaryPlatformContract.states, componentContracts.motionBoundary.states);
assert.deepEqual(Object.keys(motionBoundaryPlatformAdapters), ["react"]);
assert.equal(motionBoundaryPlatformAdapters.react.componentName, "MotionBoundary");
assert.equal(motionBoundaryPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.animatedMoment.factory, "@design-system/react/animated-moment");
assert.equal(animatedMomentPlatformContract.id, "animated-moment");
assert.equal(animatedMomentPlatformContract.source.factory, componentContracts.animatedMoment.factory);
assert.deepEqual(animatedMomentPlatformProps(), componentContracts.animatedMoment.props.map((prop) => prop.name));
assert.deepEqual(animatedMomentPlatformContract.variants, componentContracts.animatedMoment.variants);
assert.deepEqual(animatedMomentPlatformContract.states, componentContracts.animatedMoment.states);
assert.deepEqual(Object.keys(animatedMomentPlatformAdapters), ["react"]);
assert.equal(animatedMomentPlatformAdapters.react.componentName, "AnimatedMoment");
assert.equal(animatedMomentPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.emptyState.factory, "@design-system/react/empty-state");
assert.equal(emptyStatePlatformContract.id, "empty-state");
assert.equal(emptyStatePlatformContract.source.factory, componentContracts.emptyState.factory);
assert.deepEqual(emptyStatePlatformProps(), componentContracts.emptyState.props.map((prop) => prop.name));
assert.deepEqual(emptyStatePlatformContract.variants, componentContracts.emptyState.variants);
assert.deepEqual(emptyStatePlatformContract.states, componentContracts.emptyState.states);
assert.deepEqual(Object.keys(emptyStatePlatformAdapters), ["react"]);
assert.equal(emptyStatePlatformAdapters.react.componentName, "EmptyState");
assert.equal(emptyStatePlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.list.factory, "@design-system/react/list");
assert.equal(listPlatformContract.id, "list");
assert.equal(listPlatformContract.source.factory, componentContracts.list.factory);
assert.deepEqual(listPlatformProps(), componentContracts.list.props.map((prop) => prop.name));
assert.deepEqual(listPlatformContract.variants, componentContracts.list.variants);
assert.deepEqual(listPlatformContract.states, componentContracts.list.states);
assert.deepEqual(Object.keys(listPlatformAdapters), ["react"]);
assert.equal(listPlatformAdapters.react.componentName, "List");
assert.equal(listPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.kpiTile.factory, "@design-system/react/kpi-tile");
assert.equal(kpiTilePlatformContract.id, "kpi-tile");
assert.equal(kpiTilePlatformContract.source.factory, componentContracts.kpiTile.factory);
assert.deepEqual(kpiTilePlatformProps(), componentContracts.kpiTile.props.map((prop) => prop.name));
assert.deepEqual(kpiTilePlatformContract.variants, componentContracts.kpiTile.variants);
assert.deepEqual(kpiTilePlatformContract.states, componentContracts.kpiTile.states);
assert.deepEqual(Object.keys(kpiTilePlatformAdapters), ["react"]);
assert.equal(kpiTilePlatformAdapters.react.componentName, "KpiTile");
assert.equal(kpiTilePlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.floatingActionButton.factory, "@design-system/react/floating-action-button");
assert.equal(floatingActionButtonPlatformContract.id, "floating-action-button");
assert.equal(floatingActionButtonPlatformContract.source.factory, componentContracts.floatingActionButton.factory);
assert.deepEqual(floatingActionButtonPlatformProps(), componentContracts.floatingActionButton.props.map((prop) => prop.name));
assert.deepEqual(floatingActionButtonPlatformContract.variants, componentContracts.floatingActionButton.variants);
assert.deepEqual(floatingActionButtonPlatformContract.states, componentContracts.floatingActionButton.states);
assert.deepEqual(Object.keys(floatingActionButtonPlatformAdapters), ["react"]);
assert.equal(floatingActionButtonPlatformAdapters.react.componentName, "FloatingActionButton");
assert.equal(floatingActionButtonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.pagination.factory, "@design-system/react/pagination");
assert.equal(componentContracts.pagination.props.some((prop) => prop.name === "onPageChange"), true);
assert.equal(paginationPlatformContract.id, "pagination");
assert.equal(paginationPlatformContract.source.factory, componentContracts.pagination.factory);
assert.deepEqual(paginationPlatformProps(), componentContracts.pagination.props.map((prop) => prop.name));
assert.deepEqual(paginationPlatformContract.variants, componentContracts.pagination.variants);
assert.deepEqual(paginationPlatformContract.states, componentContracts.pagination.states);
assert.deepEqual(Object.keys(paginationPlatformAdapters), ["react"]);
assert.equal(paginationPlatformAdapters.react.componentName, "Pagination");
assert.equal(paginationPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.auditEvent.factory, "@design-system/react/audit-event");
assert.equal(auditEventPlatformContract.id, "audit-event");
assert.equal(auditEventPlatformContract.source.factory, componentContracts.auditEvent.factory);
assert.deepEqual(auditEventPlatformProps(), componentContracts.auditEvent.props.map((prop) => prop.name));
assert.deepEqual(auditEventPlatformContract.variants, componentContracts.auditEvent.variants);
assert.deepEqual(auditEventPlatformContract.states, componentContracts.auditEvent.states);
assert.deepEqual(Object.keys(auditEventPlatformAdapters), ["react"]);
assert.equal(auditEventPlatformAdapters.react.componentName, "AuditEvent");
assert.equal(auditEventPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.errorPanel.factory, "@design-system/react/error-panel");
assert.equal(errorPanelPlatformContract.id, "error-panel");
assert.equal(errorPanelPlatformContract.source.factory, componentContracts.errorPanel.factory);
assert.deepEqual(errorPanelPlatformProps(), componentContracts.errorPanel.props.map((prop) => prop.name));
assert.deepEqual(errorPanelPlatformContract.variants, componentContracts.errorPanel.variants);
assert.deepEqual(errorPanelPlatformContract.states, componentContracts.errorPanel.states);
assert.deepEqual(Object.keys(errorPanelPlatformAdapters), ["react"]);
assert.equal(errorPanelPlatformAdapters.react.componentName, "ErrorPanel");
assert.equal(errorPanelPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.inlineValidation.factory, "@design-system/react/inline-validation");
assert.equal(inlineValidationPlatformContract.id, "inline-validation");
assert.equal(inlineValidationPlatformContract.source.factory, componentContracts.inlineValidation.factory);
assert.deepEqual(inlineValidationPlatformProps(), componentContracts.inlineValidation.props.map((prop) => prop.name));
assert.deepEqual(inlineValidationPlatformContract.variants, componentContracts.inlineValidation.variants);
assert.deepEqual(inlineValidationPlatformContract.states, componentContracts.inlineValidation.states);
assert.deepEqual(Object.keys(inlineValidationPlatformAdapters), ["react"]);
assert.equal(inlineValidationPlatformAdapters.react.componentName, "InlineValidation");
assert.equal(inlineValidationPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.stepper.factory, "@design-system/react/stepper");
assert.equal(stepperPlatformContract.id, "stepper");
assert.equal(stepperPlatformContract.source.factory, componentContracts.stepper.factory);
assert.deepEqual(stepperPlatformProps(), componentContracts.stepper.props.map((prop) => prop.name));
assert.deepEqual(stepperPlatformContract.variants, componentContracts.stepper.variants);
assert.deepEqual(stepperPlatformContract.states, componentContracts.stepper.states);
assert.deepEqual(Object.keys(stepperPlatformAdapters), ["react"]);
assert.equal(stepperPlatformAdapters.react.componentName, "Stepper");
assert.equal(stepperPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.chartPanel.factory, "@design-system/react/chart-panel");
assert.equal(chartPanelPlatformContract.id, "chart-panel");
assert.equal(chartPanelPlatformContract.source.factory, componentContracts.chartPanel.factory);
assert.deepEqual(chartPanelPlatformProps(), componentContracts.chartPanel.props.map((prop) => prop.name));
assert.deepEqual(chartPanelPlatformContract.variants, componentContracts.chartPanel.variants);
assert.deepEqual(chartPanelPlatformContract.states, componentContracts.chartPanel.states);
assert.deepEqual(Object.keys(chartPanelPlatformAdapters), ["react"]);
assert.equal(chartPanelPlatformAdapters.react.componentName, "ChartPanel");
assert.equal(chartPanelPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.stationPin.factory, "@design-system/react/station-pin");
assert.equal(stationPinPlatformContract.id, "station-pin");
assert.equal(stationPinPlatformContract.source.factory, componentContracts.stationPin.factory);
assert.deepEqual(stationPinPlatformProps(), componentContracts.stationPin.props.map((prop) => prop.name));
assert.deepEqual(stationPinPlatformContract.variants, componentContracts.stationPin.variants);
assert.deepEqual(stationPinPlatformContract.states, componentContracts.stationPin.states);
assert.deepEqual(Object.keys(stationPinPlatformAdapters), ["react"]);
assert.equal(stationPinPlatformAdapters.react.componentName, "StationPin");
assert.equal(stationPinPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.routeSummary.factory, "@design-system/react/route-summary");
assert.equal(routeSummaryPlatformContract.id, "route-summary");
assert.equal(routeSummaryPlatformContract.source.factory, componentContracts.routeSummary.factory);
assert.deepEqual(routeSummaryPlatformProps(), componentContracts.routeSummary.props.map((prop) => prop.name));
assert.deepEqual(routeSummaryPlatformContract.variants, componentContracts.routeSummary.variants);
assert.deepEqual(routeSummaryPlatformContract.states, componentContracts.routeSummary.states);
assert.deepEqual(Object.keys(routeSummaryPlatformAdapters), ["react"]);
assert.equal(routeSummaryPlatformAdapters.react.componentName, "RouteSummary");
assert.equal(routeSummaryPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.codeInput.factory, "@design-system/react/code-input");
assert.equal(componentContracts.codeInput.internalFactory, "createTransitionalSecurityCodeInput");
assert.equal(codeInputPlatformContract.id, "code-input");
assert.equal(codeInputPlatformContract.source.factory, componentContracts.codeInput.factory);
assert.deepEqual(codeInputPlatformProps(), componentContracts.codeInput.props.map((prop) => prop.name));
assert.deepEqual(codeInputPlatformContract.variants, componentContracts.codeInput.variants);
assert.deepEqual(codeInputPlatformContract.states, componentContracts.codeInput.states);
assert.deepEqual(Object.keys(codeInputPlatformAdapters), ["react"]);
assert.equal(codeInputPlatformAdapters.react.componentName, "CodeInput");
assert.equal(codeInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.phoneInput.factory, "@design-system/react/phone-input");
assert.equal(componentContracts.phoneInput.internalFactory, "createTransitionalPhoneInput");
assert.equal(phoneInputPlatformContract.id, "phone-input");
assert.equal(phoneInputPlatformContract.source.factory, componentContracts.phoneInput.factory);
assert.deepEqual(phoneInputPlatformProps(), componentContracts.phoneInput.props.map((prop) => prop.name));
assert.deepEqual(phoneInputPlatformContract.variants, componentContracts.phoneInput.variants);
assert.deepEqual(phoneInputPlatformContract.states, componentContracts.phoneInput.states);
assert.deepEqual(Object.keys(phoneInputPlatformAdapters), ["react"]);
assert.equal(phoneInputPlatformAdapters.react.componentName, "PhoneInput");
assert.equal(phoneInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.countrySelector.factory, "@design-system/react/country-selector");
assert.equal(componentContracts.countrySelector.internalFactory, "createCountrySelector");
assert.equal(countrySelectorPlatformContract.id, "country-selector");
assert.equal(countrySelectorPlatformContract.source.factory, componentContracts.countrySelector.factory);
assert.deepEqual(countrySelectorPlatformProps(), componentContracts.countrySelector.props.map((prop) => prop.name));
assert.deepEqual(countrySelectorPlatformContract.variants, componentContracts.countrySelector.variants);
assert.deepEqual(countrySelectorPlatformContract.states, componentContracts.countrySelector.states);
assert.deepEqual(Object.keys(countrySelectorPlatformAdapters), ["react"]);
assert.equal(countrySelectorPlatformAdapters.react.componentName, "CountrySelector");
assert.equal(countrySelectorPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.datePicker.factory, "@design-system/react/date-picker");
assert.equal(componentContracts.datePicker.internalFactory, "createTransitionalDatePicker");
assert.equal(datePickerPlatformContract.id, "date-picker");
assert.equal(datePickerPlatformContract.source.factory, componentContracts.datePicker.factory);
assert.deepEqual(datePickerPlatformProps(), componentContracts.datePicker.props.map((prop) => prop.name));
assert.deepEqual(datePickerPlatformContract.variants, componentContracts.datePicker.variants);
assert.deepEqual(datePickerPlatformContract.states, componentContracts.datePicker.states);
assert.deepEqual(Object.keys(datePickerPlatformAdapters), ["react"]);
assert.equal(datePickerPlatformAdapters.react.componentName, "DatePicker");
assert.equal(datePickerPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.dateRangePicker.factory, "@design-system/react/date-range-picker");
assert.equal(componentContracts.dateRangePicker.internalFactory, "createTransitionalDateRangePicker");
assert.equal(dateRangePickerPlatformContract.id, "date-range-picker");
assert.equal(dateRangePickerPlatformContract.source.factory, componentContracts.dateRangePicker.factory);
assert.deepEqual(dateRangePickerPlatformProps(), componentContracts.dateRangePicker.props.map((prop) => prop.name));
assert.deepEqual(dateRangePickerPlatformContract.variants, componentContracts.dateRangePicker.variants);
assert.deepEqual(dateRangePickerPlatformContract.states, componentContracts.dateRangePicker.states);
assert.deepEqual(Object.keys(dateRangePickerPlatformAdapters), ["react"]);
assert.equal(dateRangePickerPlatformAdapters.react.componentName, "DateRangePicker");
assert.equal(dateRangePickerPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.segmentedControl.factory, "@design-system/react/segmented-control");
assert.equal(segmentedControlPlatformContract.id, "segmented-control");
assert.equal(segmentedControlPlatformContract.source.factory, componentContracts.segmentedControl.factory);
assert.deepEqual(segmentedControlPlatformProps(), componentContracts.segmentedControl.props.map((prop) => prop.name));
assert.deepEqual(segmentedControlPlatformContract.variants, componentContracts.segmentedControl.variants);
assert.deepEqual(segmentedControlPlatformContract.states, componentContracts.segmentedControl.states);
assert.deepEqual(Object.keys(segmentedControlPlatformAdapters), ["react"]);
assert.equal(segmentedControlPlatformAdapters.react.componentName, "SegmentedControl");
assert.equal(segmentedControlPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.popover.factory, "@design-system/react/popover");
assert.equal(popoverPlatformContract.id, "popover");
assert.equal(popoverPlatformContract.source.factory, componentContracts.popover.factory);
assert.deepEqual(popoverPlatformProps(), componentContracts.popover.props.map((prop) => prop.name));
assert.deepEqual(popoverPlatformContract.variants, componentContracts.popover.variants);
assert.deepEqual(popoverPlatformContract.states, componentContracts.popover.states);
assert.deepEqual(Object.keys(popoverPlatformAdapters), ["react"]);
assert.equal(popoverPlatformAdapters.react.componentName, "Popover");
assert.equal(popoverPlatformAdapters.react.sourceOfTruth, true);
assert.match(componentsCss, /\.popover__panel\[hidden\]\s*\{[^}]*display:\s*none;/);
assert.equal(componentContracts.cardSummary.factory, "@design-system/react/card-summary");
assert.equal(cardSummaryPlatformContract.id, "card-summary");
assert.equal(cardSummaryPlatformContract.source.factory, componentContracts.cardSummary.factory);
assert.deepEqual(cardSummaryPlatformProps(), componentContracts.cardSummary.props.map((prop) => prop.name));
assert.deepEqual(cardSummaryPlatformContract.variants, componentContracts.cardSummary.variants);
assert.deepEqual(cardSummaryPlatformContract.states, componentContracts.cardSummary.states);
assert.deepEqual(Object.keys(cardSummaryPlatformAdapters), ["react"]);
assert.equal(cardSummaryPlatformAdapters.react.componentName, "CardSummary");
assert.equal(cardSummaryPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.movementRow.factory, "@design-system/react/movement-row");
assert.equal(movementRowPlatformContract.id, "movement-row");
assert.equal(movementRowPlatformContract.source.factory, componentContracts.movementRow.factory);
assert.deepEqual(movementRowPlatformProps(), componentContracts.movementRow.props.map((prop) => prop.name));
assert.deepEqual(movementRowPlatformContract.variants, componentContracts.movementRow.variants);
assert.deepEqual(movementRowPlatformContract.states, componentContracts.movementRow.states);
assert.deepEqual(Object.keys(movementRowPlatformAdapters), ["react"]);
assert.equal(movementRowPlatformAdapters.react.componentName, "MovementRow");
assert.equal(movementRowPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.quickAction.factory, "@design-system/react/quick-action");
assert.equal(quickActionPlatformContract.id, "quick-action");
assert.equal(quickActionPlatformContract.source.factory, componentContracts.quickAction.factory);
assert.deepEqual(quickActionPlatformProps(), componentContracts.quickAction.props.map((prop) => prop.name));
assert.deepEqual(quickActionPlatformContract.variants, componentContracts.quickAction.variants);
assert.deepEqual(quickActionPlatformContract.states, componentContracts.quickAction.states);
assert.deepEqual(Object.keys(quickActionPlatformAdapters), ["react"]);
assert.equal(quickActionPlatformAdapters.react.componentName, "QuickAction");
assert.equal(quickActionPlatformAdapters.react.sourceOfTruth, true);
for (const contract of Object.values(componentContracts)) {
  assert.ok(contract.purpose.length > 20);
  assert.ok(contract.props.length >= 5);
  assert.ok(contract.accessibility.length >= 3);
}

const button = createTransitionalActionButton({ label: "Approve", icon: "check", trailingIcon: "arrow_forward", variant: "outlined", density: "sm", fullWidth: true, state: "pressed" });
assert.equal(button.tagName, "BUTTON");
assert.equal(button.type, "button");
assert.equal(button.disabled, false);
assert.equal(button.className, "button button--outlined");
assert.equal(button.dataset.density, "sm");
assert.equal(button.dataset.fullWidth, "true");
assert.equal(button.dataset.state, "pressed");
assert.equal(button.querySelector(".button__icon").attributes["aria-hidden"], "true");
assert.equal(button.querySelector(".button__icon--trailing").textContent, "arrow_forward");
assert.equal(button.querySelector(".button__label").textContent, "Approve");
const loadingButton = createTransitionalActionButton({ label: "Saving", loading: true });
assert.equal(loadingButton.disabled, true);
assert.equal(loadingButton.dataset.density, undefined);
assert.equal(loadingButton.attributes["aria-busy"], "true");
assert.equal(loadingButton.querySelector(".spinner").attributes["aria-hidden"], "true");
assert.equal(loadingButton.querySelector(".button__label").textContent, "Saving");

const iconButton = createTransitionalActionIconButton({ ariaLabel: "Open filters", icon: "tune", variant: "tonal", density: "sm", selected: true, badge: true });
assert.equal(iconButton.tagName, "BUTTON");
assert.equal(iconButton.className, "icon-button icon-button--tonal");
assert.equal(iconButton.attributes["aria-label"], "Open filters");
assert.equal(iconButton.attributes["aria-pressed"], "true");
assert.equal(iconButton.dataset.density, "sm");
assert.equal(iconButton.querySelector(".icon-button__icon").attributes["aria-hidden"], "true");
assert.equal(iconButton.querySelector(".icon-button__badge").attributes["aria-hidden"], "true");
const inheritedDensityIconButton = createTransitionalActionIconButton({ ariaLabel: "More actions", icon: "more_horiz" });
assert.equal(inheritedDensityIconButton.dataset.density, undefined);
assert.equal(inheritedDensityIconButton.querySelector(".icon-button__icon").textContent, "more_horiz");

const input = createTransitionalFieldInput({
  label: "Driver",
  helper: "Search by name or vehicle",
  name: "driver",
  placeholder: "Alex Rivera",
  value: "Alex",
  density: "sm",
  icon: "badge",
  suffix: "ID",
  mono: true,
});
assert.equal(input.tagName, "LABEL");
assert.equal(input.dataset.state, "filled");
assert.equal(input.dataset.density, "sm");
assert.equal(input.dataset.mono, "true");
assert.equal(input.querySelector(".field__label").textContent, "Driver");
assert.equal(input.querySelector(".field__helper").textContent, "Search by name or vehicle");
assert.equal(input.querySelector(".field__icon").attributes["aria-hidden"], "true");
assert.equal(input.querySelector(".field__suffix").attributes["aria-hidden"], "true");
assert.equal(input.querySelector(".field__suffix").textContent, "ID");
assert.equal(input.querySelector("input").className, "input");
assert.equal(input.querySelector("input").placeholder, "Alex Rivera");
assert.equal(input.querySelector("input").value, "Alex");
assert.equal(input.querySelector("input").attributes["aria-describedby"], input.querySelector(".field__helper").id);

const inputError = createTransitionalFieldInput({ label: "Plate", value: "ABC", error: "Use format ABC-123" });
assert.equal(inputError.dataset.state, "error");
assert.equal(inputError.dataset.density, undefined);
assert.equal(inputError.querySelector("input").attributes["aria-invalid"], "true");
assert.equal(inputError.querySelector(".field__helper").textContent, "Use format ABC-123");
assert.equal(inputError.querySelector(".field__helper").attributes.role, "alert");

const emailInput = createTransitionalFieldInput({ label: "Fleet admin email", value: "ops@fleet.mx", variant: "email" });
assert.equal(emailInput.dataset.variant, "email");
assert.equal(emailInput.querySelector("input").type, "email");
assert.equal(emailInput.querySelector("input").attributes.autocomplete, "email");
assert.equal(emailInput.querySelector("input").attributes.inputmode, "email");

const currencyInput = createTransitionalFieldInput({ label: "Monthly limit", value: "2400.00", variant: "currency", prefix: "$", suffix: "MXN", mono: true });
assert.equal(currencyInput.dataset.variant, "currency");
assert.equal(currencyInput.dataset.align, "end");
assert.equal(currencyInput.dataset.mono, "true");
assert.equal(currencyInput.querySelector(".field__prefix").textContent, "$");
assert.equal(currencyInput.querySelector(".field__suffix").textContent, "MXN");
assert.equal(currencyInput.querySelector("input").value, "2,400.00");
assert.equal(currencyInput.querySelector("input").attributes.inputmode, "decimal");

let currencyChangeMeta = null;
const interactiveCurrencyInput = createTransitionalFieldInput({
  label: "Monthly limit",
  variant: "currency",
  onValueChange: (value, meta) => {
    currencyChangeMeta = { value, meta };
  },
});
interactiveCurrencyInput.querySelector("input").value = "2,950.50";
interactiveCurrencyInput.querySelector("input").dispatchEvent({ type: "input" });
assert.deepEqual(currencyChangeMeta, {
  value: "2950.50",
  meta: {
    value: "2950.50",
    displayValue: "2,950.50",
    rawValue: "2,950.50",
    numericValue: 2950.5,
  },
});

const passwordInput = createTransitionalFieldInput({ label: "Password", value: "Miel2026!", variant: "password" });
const passwordField = passwordInput.querySelector("input");
const revealButton = passwordInput.querySelector(".field-action");
assert.equal(passwordField.type, "password");
assert.equal(revealButton.dataset.fieldAction, "reveal");
assert.equal(revealButton.attributes["aria-label"], "Show value");
revealButton.click();
assert.equal(passwordField.type, "text");
assert.equal(revealButton.attributes["aria-label"], "Hide value");
assert.equal(revealButton.attributes["aria-pressed"], "true");
revealButton.click();
assert.equal(passwordField.type, "password");
assert.equal(revealButton.attributes["aria-pressed"], "false");

let cardNumberMeta = null;
const cardNumberInput = createTransitionalPaymentCardNumberInput({
  label: "Card number",
  value: "4111111111111111",
  helper: "Use the number printed on the front of the card.",
  onValueChange: (digits, meta) => { cardNumberMeta = { digits, meta }; },
});
const cardField = cardNumberInput.querySelector("input");
const cardBrand = cardNumberInput.querySelector(".card-number-input__brand");
assert.equal(cardNumberInput.className, "field card-number-input");
assert.equal(cardNumberInput.dataset.state, "valid");
assert.equal(cardNumberInput.dataset.validity, "valid");
assert.equal(cardNumberInput.dataset.brand, "Visa");
assert.equal(cardNumberInput.dataset.mono, "true");
assert.equal(cardField.value, "4111 1111 1111 1111");
assert.equal(cardField.attributes.inputmode, "numeric");
assert.equal(cardField.attributes.autocomplete, "cc-number");
assert.equal(cardField.attributes.pattern, "[0-9 ]*");
assert.equal(cardField.attributes.enterkeyhint, "next");
assert.equal(cardField.attributes["aria-labelledby"], cardNumberInput.querySelector(".field__label").id);
assert.equal(cardField.attributes["aria-describedby"], cardNumberInput.querySelector(".field__helper").id);
assert.equal(cardBrand.textContent, "Visa");
assert.equal(cardBrand.hidden, false);
assert.equal(cardNumberMeta.digits, "4111111111111111");
assert.equal(cardNumberMeta.meta.luhnValid, true);

cardField.value = "4111111111111112";
cardField.dispatchEvent({ type: "input" });
assert.equal(cardNumberInput.dataset.validity, "invalid");
assert.equal(cardNumberInput.dataset.state, "error");
assert.equal(cardField.attributes["aria-invalid"], "true");
assert.equal(cardNumberInput.querySelector(".field__helper").textContent, "Check the card number.");
assert.equal(cardNumberInput.querySelector(".field__helper").attributes.role, "alert");

cardField.value = "5555555555554444";
cardField.dispatchEvent({ type: "input" });
assert.equal(cardNumberInput.dataset.validity, "valid");
assert.equal(cardNumberInput.dataset.state, "valid");
assert.equal(cardNumberInput.dataset.brand, "Mastercard");
assert.equal(cardBrand.textContent, "Mastercard");
assert.equal(cardNumberInput.querySelector(".field__helper").textContent, "Use the number printed on the front of the card.");
assert.equal(cardNumberInput.querySelector(".field__helper").attributes.role, undefined);

hydrateTransitionalPaymentCardNumberInput(cardNumberInput);
assert.equal(cardNumberInput.dataset.cardNumberHydrated, "true");

let cardExpiryMeta = null;
const cardExpiryInput = createTransitionalPaymentCardExpiryInput({
  label: "Expiry date",
  value: "1228",
  helper: "Use the expiry printed on the card.",
  onValueChange: (value, meta) => { cardExpiryMeta = { value, meta }; },
});
const expiryField = cardExpiryInput.querySelector("input");
assert.equal(cardExpiryInput.className, "field card-expiry-input");
assert.equal(cardExpiryInput.dataset.state, "valid");
assert.equal(cardExpiryInput.dataset.validity, "valid");
assert.equal(cardExpiryInput.dataset.mono, "true");
assert.equal(expiryField.value, "12/28");
assert.equal(expiryField.attributes.inputmode, "numeric");
assert.equal(expiryField.attributes.autocomplete, "cc-exp");
assert.equal(expiryField.attributes.pattern, "[0-9/ ]*");
assert.equal(expiryField.attributes.enterkeyhint, "next");
assert.equal(expiryField.attributes.maxlength, "5");
assert.equal(expiryField.maxLength, 5);
assert.equal(expiryField.attributes["aria-labelledby"], cardExpiryInput.querySelector(".field__label").id);
assert.equal(expiryField.attributes["aria-describedby"], cardExpiryInput.querySelector(".field__helper").id);
assert.equal(cardExpiryMeta.value, "12/28");
assert.equal(cardExpiryMeta.meta.month, "12");
assert.equal(cardExpiryMeta.meta.year, "28");
assert.equal(cardExpiryMeta.meta.expired, false);

expiryField.value = "1328";
expiryField.dispatchEvent({ type: "input" });
assert.equal(expiryField.value, "13/28");
assert.equal(cardExpiryInput.dataset.validity, "invalid");
assert.equal(cardExpiryInput.dataset.state, "error");
assert.equal(expiryField.attributes["aria-invalid"], "true");
assert.equal(cardExpiryInput.querySelector(".field__helper").textContent, "Check the expiry date.");
assert.equal(cardExpiryInput.querySelector(".field__helper").attributes.role, "alert");

expiryField.value = "0125";
expiryField.dispatchEvent({ type: "input" });
assert.equal(expiryField.value, "01/25");
assert.equal(cardExpiryInput.dataset.validity, "expired");
assert.equal(cardExpiryInput.dataset.state, "error");
assert.equal(cardExpiryInput.querySelector(".field__helper").textContent, "Use a card that has not expired.");

expiryField.value = "0329";
expiryField.dispatchEvent({ type: "input" });
assert.equal(expiryField.value, "03/29");
assert.equal(cardExpiryInput.dataset.validity, "valid");
assert.equal(cardExpiryInput.dataset.state, "valid");
assert.equal(expiryField.attributes["aria-invalid"], undefined);
assert.equal(cardExpiryInput.querySelector(".field__helper").textContent, "Use the expiry printed on the card.");
assert.equal(cardExpiryInput.querySelector(".field__helper").attributes.role, undefined);

hydrateTransitionalPaymentCardExpiryInput(cardExpiryInput);
assert.equal(cardExpiryInput.dataset.cardExpiryHydrated, "true");

let cardSecurityCodeMeta = null;
const cardSecurityCodeInput = createTransitionalPaymentCardSecurityCodeInput({
  label: "Security code",
  value: "48a2",
  helper: "Use the code printed on the card.",
  onValueChange: (digits, meta) => { cardSecurityCodeMeta = { digits, meta }; },
});
const securityCodeField = cardSecurityCodeInput.querySelector("input");
const securityCodeReveal = cardSecurityCodeInput.querySelector("button");
assert.equal(cardSecurityCodeInput.className, "field card-security-code-input");
assert.equal(cardSecurityCodeInput.dataset.state, "valid");
assert.equal(cardSecurityCodeInput.dataset.validity, "valid");
assert.equal(cardSecurityCodeInput.dataset.mono, "true");
assert.equal(cardSecurityCodeInput.dataset.expectedLength, "3");
assert.equal(cardSecurityCodeInput.querySelector(".card-security-code-input__icon").textContent, "pin");
assert.equal(securityCodeField.value, "482");
assert.equal(securityCodeField.type, "password");
assert.equal(securityCodeField.attributes.inputmode, "numeric");
assert.equal(securityCodeField.attributes.autocomplete, "cc-csc");
assert.equal(securityCodeField.attributes.maxlength, "3");
assert.equal(securityCodeField.attributes.pattern, "[0-9]*");
assert.equal(securityCodeField.attributes.enterkeyhint, "next");
assert.equal(securityCodeField.attributes["aria-labelledby"], cardSecurityCodeInput.querySelector(".field__label").id);
assert.equal(securityCodeField.attributes["aria-describedby"], cardSecurityCodeInput.querySelector(".field__helper").id);
assert.equal(cardSecurityCodeMeta.digits, "482");
assert.equal(cardSecurityCodeMeta.meta.complete, true);
assert.equal(cardSecurityCodeMeta.meta.expectedLength, 3);
assert.equal(securityCodeReveal.className, "field-action card-security-code-input__action");
assert.equal(securityCodeReveal.dataset.fieldAction, "reveal");
assert.equal(securityCodeReveal.querySelector(".field-action__icon").className, "field-action__icon field__icon card-security-code-input__action-icon");
assert.equal(securityCodeReveal.attributes["aria-label"], "Show security code");
assert.equal(securityCodeReveal.attributes["aria-pressed"], "false");
securityCodeReveal.click();
assert.equal(securityCodeField.type, "text");
assert.equal(securityCodeReveal.querySelector(".field-action__icon").textContent, "visibility_off");
assert.equal(securityCodeReveal.attributes["aria-label"], "Hide security code");
assert.equal(securityCodeReveal.attributes["aria-pressed"], "true");

securityCodeField.value = "12";
securityCodeField.dispatchEvent({ type: "input" });
assert.equal(cardSecurityCodeInput.dataset.validity, "incomplete");
assert.equal(cardSecurityCodeInput.dataset.state, "filled");

securityCodeField.value = "482";
securityCodeField.dispatchEvent({ type: "input" });
assert.equal(cardSecurityCodeInput.dataset.validity, "valid");
assert.equal(cardSecurityCodeInput.dataset.state, "valid");
assert.equal(securityCodeField.attributes["aria-invalid"], undefined);
assert.equal(cardSecurityCodeInput.querySelector(".field__helper").attributes.role, undefined);

const controlledSecurityCodeError = createTransitionalPaymentCardSecurityCodeInput({
  label: "Security code",
  value: "12",
  state: "error",
});
assert.equal(controlledSecurityCodeError.dataset.state, "error");
assert.equal(controlledSecurityCodeError.querySelector("input").attributes["aria-invalid"], "true");
assert.equal(controlledSecurityCodeError.querySelector(".field__helper").textContent, "Enter the security code.");
assert.equal(controlledSecurityCodeError.querySelector(".field__helper").attributes.role, "alert");

const fourDigitSecurityCode = createTransitionalPaymentCardSecurityCodeInput({
  label: "Security code",
  value: "1234",
  expectedLength: 4,
});
assert.equal(fourDigitSecurityCode.dataset.expectedLength, "4");
assert.equal(fourDigitSecurityCode.dataset.validity, "valid");
assert.equal(fourDigitSecurityCode.querySelector("input").attributes.maxlength, "4");

const disabledSecurityCode = createTransitionalPaymentCardSecurityCodeInput({ label: "Security code", value: "482", state: "disabled" });
assert.equal(disabledSecurityCode.dataset.state, "disabled");
assert.equal(disabledSecurityCode.querySelector("input").disabled, true);
assert.equal(disabledSecurityCode.querySelector("button").disabled, true);

const loadingSecurityCode = createTransitionalPaymentCardSecurityCodeInput({ label: "Security code", value: "482", state: "loading" });
assert.equal(loadingSecurityCode.dataset.state, "loading");
assert.equal(loadingSecurityCode.querySelector("input").disabled, true);
assert.equal(loadingSecurityCode.querySelector(".field__icon--loading").className.includes("spinner"), true);
assert.equal(loadingSecurityCode.querySelector(".field__icon--loading").attributes["aria-hidden"], "true");
assert.equal(securityCodeField.attributes["aria-invalid"], undefined);

hydrateTransitionalPaymentCardSecurityCodeInput(cardSecurityCodeInput);
assert.equal(cardSecurityCodeInput.dataset.cardSecurityCodeHydrated, "true");

const select = createTransitionalFieldSelect({
  label: "Fleet",
  helper: "Choose a fleet",
  icon: "local_taxi",
  name: "fleet",
  value: "north",
  density: "sm",
  state: "focus",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
  ],
});
assert.equal(select.tagName, "LABEL");
assert.equal(select.className, "field");
assert.equal(select.dataset.density, "sm");
assert.equal(select.dataset.state, "focus");
assert.equal(select.querySelector(".field__label").textContent, "Fleet");
assert.equal(select.querySelector(".field__helper").textContent, "Choose a fleet");
assert.equal(select.querySelector(".select-control").className, "select-control");
assert.equal(select.querySelector(".select-control").dataset.state, "focus");
assert.equal(select.querySelector(".select-control").dataset.density, "sm");
assert.equal(select.querySelector(".select-control__icon").textContent, "local_taxi");
assert.equal(select.querySelector(".select-control__icon").attributes["aria-hidden"], "true");
assert.equal(select.querySelector(".select-control__trigger").attributes.role, "combobox");
assert.equal(select.querySelector(".select-control__trigger").attributes["aria-expanded"], "false");
assert.equal(select.querySelector(".select-control__trigger").attributes["aria-activedescendant"], select.querySelectorAll(".select-control__option")[0].id);
assert.equal(select.querySelector(".select-control__trigger").textContent, "local_taxiNorthexpand_more");
assert.equal(select.querySelector("input").type, "hidden");
assert.equal(select.querySelector("input").name, "fleet");
assert.equal(select.querySelector("input").value, "north");
assert.equal(select.querySelectorAll(".select-control__option").length, 2);
assert.equal(select.querySelectorAll(".select-control__option")[0].dataset.selected, "true");
assert.equal(select.querySelectorAll(".select-control__option")[1].dataset.disabled, "true");
const inlineSelect = createTransitionalFieldSelect({
  label: "Country code",
  variant: "inline",
  value: "MX",
  options: [
    { label: "Mexico", value: "MX", meta: "+52" },
    { label: "Cuba", value: "CU", meta: "+53" },
  ],
});
assert.equal(inlineSelect.querySelector(".select-control").className, "select-control select-control--inline");
assert.equal(inlineSelect.querySelector(".select-control__trigger").attributes.role, "combobox");
assert.equal(inlineSelect.querySelector(".select-control__trigger").textContent, "Mexico+52expand_more");
assert.equal(inlineSelect.querySelectorAll(".select-control__option").length, 2);
assert.equal(inlineSelect.querySelector(".select-control__option").dataset.selected, "true");
assert.equal(inlineSelect.dataset.density, undefined);
assert.equal(inlineSelect.querySelector(".select-control").dataset.density, undefined);
let selectChange = null;
const interactiveSelect = createTransitionalFieldSelect({
  label: "Fleet",
  value: "north",
  onValueChange(value, meta) {
    selectChange = { value, meta };
  },
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
    { label: "West", value: "west", meta: "3" },
  ],
});
const interactiveSelectControl = interactiveSelect.querySelector(".select-control");
const interactiveSelectTrigger = interactiveSelect.querySelector(".select-control__trigger");
const interactiveSelectOptions = interactiveSelect.querySelectorAll(".select-control__option");
interactiveSelectTrigger.dispatchEvent({ type: "keydown", key: "ArrowDown", preventDefault() {} });
assert.equal(interactiveSelectControl.dataset.open, "true");
interactiveSelectOptions[0].dispatchEvent({ type: "keydown", key: "ArrowDown", preventDefault() {} });
assert.equal(interactiveSelectTrigger.attributes["aria-activedescendant"], interactiveSelectOptions[2].id);
interactiveSelectOptions[2].dispatchEvent({ type: "keydown", key: "Enter", preventDefault() {} });
assert.equal(interactiveSelect.querySelector(".select-control__value").textContent, "West");
assert.equal(selectChange.value, "west");
assert.equal(selectChange.meta.meta, "3");

let comboboxChange = null;
const combobox = createCombobox({
  label: "Vehicle",
  helper: "Search by plate or driver",
  value: "mx-4821",
  name: "vehicle",
  onValueChange(value, meta) {
    comboboxChange = { value, meta };
  },
  options: [
    { label: "MX-4821 - Ana Gomez", value: "mx-4821", meta: "Driver" },
    { label: "MX-8840 - Luis Perez", value: "mx-8840", meta: "Vehicle" },
    { label: "North Region Fleet", value: "north-region", meta: "Fleet" },
  ],
});
assert.equal(combobox.tagName, "LABEL");
assert.equal(combobox.className, "field");
assert.equal(combobox.querySelector(".field__label").textContent, "Vehicle");
assert.equal(combobox.querySelector(".field__helper").textContent, "Search by plate or driver");
assert.equal(combobox.querySelector(".combobox").dataset.value, "mx-4821");
assert.equal(combobox.querySelector(".combobox__input").attributes.role, "combobox");
assert.equal(combobox.querySelector(".combobox__input").attributes["aria-autocomplete"], "list");
assert.equal(combobox.querySelector(".combobox__input").attributes["aria-expanded"], "false");
assert.equal(combobox.querySelector(".combobox__input").attributes["aria-controls"], combobox.querySelector(".combobox__listbox").id);
assert.equal(combobox.querySelectorAll(".combobox__option").length, 3);
assert.equal(combobox.querySelector(".combobox__option").dataset.selected, "true");
const comboboxInput = combobox.querySelector(".combobox__input");
const comboboxControl = combobox.querySelector(".combobox");
comboboxInput.value = "Luis";
comboboxInput.dispatchEvent({ type: "input" });
assert.equal(comboboxControl.dataset.open, "true");
assert.equal(combobox.querySelectorAll(".combobox__option")[0].hidden, true);
assert.equal(combobox.querySelectorAll(".combobox__option")[1].hidden, false);
comboboxInput.dispatchEvent({ type: "keydown", key: "Enter", preventDefault() {} });
assert.equal(comboboxInput.value, "MX-8840 - Luis Perez");
assert.equal(comboboxChange.value, "mx-8840");
combobox.querySelector(".combobox__clear").dispatchEvent({ type: "click" });
assert.equal(comboboxInput.value, "");
assert.equal(comboboxControl.dataset.value, "");
hydrateCombobox(combobox);
assert.equal(combobox.querySelector(".combobox").__comboboxHydrated, true);

let selectedCountryMeta = null;
const countrySelector = createCountrySelector({
  label: "Country",
  value: "MX",
  onValueChange: (countryCode, meta) => { selectedCountryMeta = { countryCode, meta }; },
});
assert.equal(countrySelector.className, "select-control country-selector");
assert.equal(countrySelector.dataset.country, "MX");
assert.equal(countrySelector.querySelector(".country-selector__trigger").attributes.role, "combobox");
assert.equal(countrySelector.querySelector(".country-selector__trigger").attributes["aria-expanded"], "false");
assert.equal(countrySelector.querySelector(".country-selector__label").textContent, "Mexico");
assert.equal(countrySelector.querySelector(".country-selector__code").textContent, "+52");
assert.equal(countrySelector.querySelectorAll(".country-selector__option").length, 10);
assert.equal(countrySelector.querySelector(".country-selector__option-check").textContent, "check");
countrySelector.querySelector(".country-selector__trigger").click();
assert.equal(countrySelector.dataset.open, "true");
countrySelector.querySelector(".country-selector__search-input").value = "zzzz";
countrySelector.querySelector(".country-selector__search-input").dispatchEvent({ type: "input" });
assert.equal(countrySelector.querySelector(".country-selector__empty").hidden, false);
const cubaCountryOption = countrySelector.querySelectorAll(".country-selector__option")[9];
cubaCountryOption.dispatchEvent({ type: "keydown", key: "Enter", preventDefault() { this.defaultPrevented = true; } });
assert.equal(countrySelector.dataset.country, "CU");
assert.equal(countrySelector.dataset.value, "CU");
assert.equal(countrySelector.querySelector(".country-selector__label").textContent, "Cuba");
assert.equal(countrySelector.querySelector(".country-selector__code").textContent, "+53");
assert.equal(selectedCountryMeta.countryCode, "CU");
assert.equal(selectedCountryMeta.meta.callingCode, "+53");
hydrateCountrySelector(countrySelector);
assert.equal(countrySelector.__countrySelectorHydrated, true);

let localizedPhoneMeta = null;
const localizedPhoneInput = createTransitionalPhoneInput({
  label: "Mobile phone",
  country: "MX",
  value: "5518429011",
  helper: "Used for OTP and support recovery.",
  onValueChange: (digits, meta) => { localizedPhoneMeta = { digits, meta }; },
});
const localizedPhoneField = localizedPhoneInput.querySelector(".phone-input__input");
const localizedPhoneTrigger = localizedPhoneInput.querySelector(".phone-input__country-trigger");
const localizedPhoneListbox = localizedPhoneInput.querySelector(".phone-input__country-listbox");
const localizedPhoneOptions = localizedPhoneInput.querySelectorAll(".phone-input__country-option");
assert.equal(localizedPhoneInput.className, "field phone-input");
assert.equal(localizedPhoneInput.dataset.state, "default");
assert.equal(localizedPhoneField.type, "tel");
assert.equal(localizedPhoneField.attributes.inputmode, "tel");
assert.equal(localizedPhoneField.attributes.autocomplete, "tel-national");
assert.equal(localizedPhoneField.attributes["aria-labelledby"], `${localizedPhoneField.id}-label`);
assert.equal(localizedPhoneField.attributes["aria-describedby"], localizedPhoneInput.querySelector(".field__helper").id);
assert.equal(localizedPhoneField.value, "55 1842 9011");
assert.equal(localizedPhoneTrigger.attributes.role, "combobox");
assert.equal(localizedPhoneTrigger.attributes["aria-expanded"], "false");
assert.equal(localizedPhoneTrigger.attributes["aria-controls"], localizedPhoneListbox.id);
assert.equal(localizedPhoneTrigger.attributes["aria-label"], "Mobile phone country code, Mexico +52");
assert.equal(localizedPhoneOptions.length, 10);
assert.equal(localizedPhoneOptions[4].dataset.countryCode, "MX");
assert.equal(localizedPhoneOptions[4].dataset.selected, "true");
localizedPhoneTrigger.click();
assert.equal(localizedPhoneInput.querySelector(".phone-input__country").dataset.open, "true");
assert.equal(localizedPhoneTrigger.attributes["aria-expanded"], "true");
assert.equal(localizedPhoneTrigger.attributes["aria-activedescendant"], localizedPhoneOptions[4].id);
localizedPhoneOptions[9].dispatchEvent({ type: "keydown", key: "Enter", preventDefault() { this.defaultPrevented = true; } });
assert.equal(localizedPhoneInput.querySelector(".phone-input__country").dataset.country, "CU");
assert.equal(localizedPhoneInput.querySelector(".phone-input__prefix").textContent, "+53");
assert.equal(localizedPhoneField.value, "55 1842 90");
assert.equal(localizedPhoneMeta.digits, "55184290");
assert.equal(localizedPhoneMeta.meta.e164, "+5355184290");
localizedPhoneField.value = "+52 55 5123 4567";
localizedPhoneField.dispatchEvent({ type: "input" });
assert.equal(localizedPhoneInput.querySelector(".phone-input__country").dataset.country, "MX");
assert.equal(localizedPhoneInput.querySelector(".phone-input__prefix").textContent, "+52");
assert.equal(localizedPhoneField.value, "55 5123 4567");

const radioButton = createTransitionalChoiceRadioButton({
  label: "Weekly",
  description: "Best for operations review",
  checked: true,
  name: "cadence",
  value: "weekly",
});
assert.equal(radioButton.tagName, "LABEL");
assert.equal(radioButton.className, "choice radio");
assert.equal(radioButton.querySelector("input").type, "radio");
assert.equal(radioButton.querySelector("input").name, "cadence");
assert.equal(radioButton.querySelector("input").value, "weekly");
assert.equal(radioButton.querySelector("input").checked, true);

const textArea = createTransitionalFieldTextArea({
  label: "Driver notes",
  helper: "Visible to support",
  value: "Needs receipt",
  rows: 4,
  maxLength: 120,
  density: "lg",
  state: "filled",
});
assert.equal(textArea.tagName, "LABEL");
assert.equal(textArea.dataset.density, "lg");
assert.equal(textArea.dataset.state, "filled");
assert.equal(textArea.querySelector("textarea").className, "text-area");
assert.equal(textArea.querySelector("textarea").rows, 4);
assert.equal(textArea.querySelector("textarea").maxLength, 120);
assert.equal(textArea.querySelector("textarea").value, "Needs receipt");
assert.equal(textArea.querySelector(".text-area__surface").dataset.hasCounter, "true");
assert.ok(textArea.querySelector(".text-area__surface").contains(textArea.querySelector(".text-area__counter")));
assert.equal(textArea.querySelector("textarea").attributes["aria-describedby"], `${textArea.querySelector(".field__helper").id} ${textArea.querySelector(".text-area__counter").id}`);
assert.equal(textArea.querySelector(".text-area__counter").textContent, "13/120");

let textAreaChangeValue = "";
const interactiveTextArea = createTransitionalFieldTextArea({
  label: "Support note",
  value: "",
  maxLength: 40,
  onChange: (nextValue) => {
    textAreaChangeValue = nextValue;
  },
});
interactiveTextArea.querySelector("textarea").value = "Receipt pending.";
interactiveTextArea.querySelector("textarea").dispatchEvent({ type: "input" });
assert.equal(textAreaChangeValue, "Receipt pending.");
assert.equal(interactiveTextArea.querySelector(".text-area__counter").textContent, "16/40");

const textAreaError = createTransitionalFieldTextArea({ label: "Policy exception", value: "Ok", error: "Use at least 20 characters." });
assert.equal(textAreaError.dataset.state, "error");
assert.equal(textAreaError.querySelector("textarea").attributes["aria-invalid"], "true");
assert.equal(textAreaError.querySelector(".field__helper").textContent, "Use at least 20 characters.");

const primitiveChart = createChartsPrimitive({ type: "donut", label: "Mix", segments: [{ label: "Fuel", value: 7 }, { label: "EV", value: 3 }] });
assert.equal(primitiveChart.echartsOption.series[0].type, "pie");
assert.equal(primitiveChart.legendModel.length, 2);
const primitiveAnimation = createAnimationAsset({
  label: "Success motion",
  state: "playing",
  fallbackIcon: "shield",
  fallbackText: "Static success",
});
assert.equal(primitiveAnimation.className, "animation-asset");
assert.equal(primitiveAnimation.dataset.animationLibrary, "lottie-web");
assert.equal(primitiveAnimation.dataset.animationRuntime, "fallback");
assert.equal(primitiveAnimation.dataset.state, "playing");
assert.equal(primitiveAnimation.querySelector(".animation-asset__fallback-icon").textContent, "shield");
assert.equal(typeof resolveAnimationRuntime({ loadAnimation() {} })?.loadAnimation, "function");
const codeInput = createTransitionalSecurityCodeInput({ label: "Code", value: "123", length: 4, helper: "Expires soon" });
assert.equal(codeInput.tagName, "LABEL");
assert.equal(codeInput.className, "field code-input");
assert.equal(codeInput.dataset.state, "default");
assert.equal(codeInput.querySelector(".field__label").textContent, "Code");
assert.equal(codeInput.querySelector(".field__helper").textContent, "Expires soon");
assert.equal(codeInput.querySelector(".code-input__slots").attributes["aria-hidden"], "true");
assert.equal(codeInput.querySelector(".code-input__slots").children.length, 4);
assert.equal(codeInput.querySelectorAll("input").length, 1);
const otpLogicalInput = codeInput.querySelectorAll("input")[0];
assert.equal(otpLogicalInput.value, "123");
assert.equal(otpLogicalInput.attributes["data-code-input"], "");
assert.equal(otpLogicalInput.autocomplete, "one-time-code");
assert.equal(otpLogicalInput.attributes.inputmode, "numeric");
assert.equal(otpLogicalInput.attributes.autocomplete, "one-time-code");
assert.equal(otpLogicalInput.attributes.pattern, "[0-9]*");
assert.equal(otpLogicalInput.attributes.maxlength, "4");
assert.equal(codeInput.querySelector(".code-input__slots").children[0].tagName, "SPAN");
assert.equal(codeInput.querySelector(".code-input__slots").children[0].attributes["data-code-slot"], "");
assert.equal(otpLogicalInput.attributes["aria-describedby"], codeInput.querySelector(".field__helper").id);
const maskedOtp = createTransitionalSecurityCodeInput({ label: "Code", value: "123456", variant: "masked" });
assert.equal(maskedOtp.dataset.variant, "masked");
assert.equal(maskedOtp.dataset.masked, "true");
assert.equal(maskedOtp.querySelector(".code-input__slots").children[0].querySelector(".code-input__digit").textContent, "1");
const otpError = createTransitionalSecurityCodeInput({ label: "Code", value: "12", error: "Code expired" });
assert.equal(otpError.dataset.state, "error");
assert.equal(otpError.querySelectorAll("input")[0].attributes["aria-invalid"], "true");
assert.equal(otpError.querySelector(".field__helper").textContent, "Code expired");
let otpValue = "";
let otpComplete = "";
const interactiveOtp = createTransitionalSecurityCodeInput({
  label: "Code",
  length: 4,
  onValueChange(value) {
    otpValue = value;
  },
  onComplete(value) {
    otpComplete = value;
  },
});
const interactiveCodeInput = interactiveOtp.querySelectorAll("input")[0];
interactiveCodeInput.value = "a7890";
interactiveCodeInput.dispatchEvent({ type: "input" });
assert.equal(interactiveCodeInput.value, "7890");
const interactiveOtpSlots = interactiveOtp.querySelector(".code-input__slots").children;
assert.equal(interactiveOtpSlots[0].dataset.filled, "true");
assert.equal(interactiveOtpSlots[3].textContent, "0");
assert.equal(otpValue, "7890");
assert.equal(otpComplete, "7890");
assert.equal(interactiveCodeInput.autocomplete, "one-time-code"); // Native paste and Backspace stay on the single logical input.
interactiveCodeInput.dispatchEvent({ type: "focus" });
assert.equal(interactiveOtp.dataset.focused, "true");
interactiveCodeInput.value = "12";
interactiveCodeInput.dispatchEvent({ type: "input" });
assert.equal(interactiveOtpSlots[2].dataset.active, "true");
interactiveCodeInput.dispatchEvent({ type: "blur" });
assert.equal(interactiveOtp.dataset.focused, "false");

const phoneInput = createTransitionalPhoneInput({ label: "Phone", value: "5551234", country: "MX", helper: "SMS only" });
assert.equal(phoneInput.tagName, "LABEL");
const phoneInputClasses = phoneInput.className.split(" ");
assert.ok(phoneInputClasses.includes("phone-input"));
assert.ok(phoneInputClasses.includes("field"));
assert.ok(phoneInputClasses.includes("phone-input"));
assert.equal(phoneInput.dataset.state, "default");
assert.equal(phoneInput.querySelector(".field__label").textContent, "Phone");
assert.equal(phoneInput.querySelector(".phone-input__prefix").textContent, "+52");
assert.equal(phoneInput.querySelector(".country-flag").dataset.country, "MX");
assert.equal(phoneInput.querySelector(".country-flag").dataset.flagLibrary, "country-flag-icons");
assert.ok(phoneInput.querySelector(".country-flag__asset").src.includes("country-flag-icons/3x2/MX.svg"));
assert.equal(phoneInput.querySelector(".phone-input__country").dataset.country, "MX");
assert.equal(phoneInput.querySelector(".phone-input__country-trigger").attributes.role, "combobox");
assert.equal(phoneInput.querySelector(".phone-input__country-trigger").attributes["aria-expanded"], "false");
assert.ok(listCountryFlags().length > 200);
assert.equal(hasCountryFlag("MX"), true);
assert.equal(hasCountryFlag("ZZ"), false);
assert.equal(countryFlagAssetPath("MX"), "./vendor/country-flag-icons/3x2/MX.svg");
assert.equal(phoneInput.querySelectorAll(".phone-input__country-option").length, 10);
assert.equal(phoneInput.querySelector(".phone-input__country-option").attributes.role, "option");
assert.equal(phoneInput.querySelector(".field__helper").textContent, "SMS only");
const phoneField = phoneInput.querySelector(".phone-input__input");
assert.equal(phoneField.type, "tel");
assert.equal(phoneField.className, "input phone-input__input");
assert.equal(phoneField.attributes["data-phone-input"], "");
assert.equal(phoneField.attributes["aria-describedby"], phoneInput.querySelector(".field__helper").id);
assert.equal(phoneField.value, "55 5123 4");
const phoneError = createTransitionalPhoneInput({ label: "Phone", value: "55", error: "Enter a reachable number." });
assert.equal(phoneError.dataset.state, "error");
assert.equal(phoneError.querySelector(".phone-input__input").attributes["aria-invalid"], "true");
assert.equal(phoneError.querySelector(".field__helper").textContent, "Enter a reachable number.");
let phoneValue = "";
let phoneMeta = {};
const interactivePhone = createTransitionalPhoneInput({
  label: "Phone",
  country: "MX",
  onValueChange(value, meta) {
    phoneValue = value;
    phoneMeta = meta;
  },
});
const interactivePhoneField = interactivePhone.querySelector(".phone-input__input");
interactivePhoneField.value = "(55) 5123-4567";
interactivePhoneField.dispatchEvent({ type: "input" });
assert.equal(interactivePhoneField.value, "55 5123 4567");
assert.equal(phoneValue, "5551234567");
assert.equal(phoneMeta.country, "MX");
assert.equal(phoneMeta.callingCode, "+52");
assert.equal(phoneMeta.e164, "+525551234567");
interactivePhoneField.value = "+53 7 123 4567";
interactivePhoneField.dispatchEvent({ type: "input" });
assert.equal(interactivePhone.querySelector(".phone-input__prefix").textContent, "+53");
assert.equal(interactivePhone.querySelector(".phone-input__country").dataset.country, "CU");
assert.equal(phoneMeta.country, "CU");
assert.equal(phoneMeta.e164, "+5371234567");

const datePicker = createTransitionalDatePicker({ label: "Service date", value: "2026-07-13", helper: "One operational date.", min: "2026-01-01", max: "2026-12-31", density: "lg", state: "focus" });
assert.equal(datePicker.tagName, "DIV");
assert.equal(datePicker.className, "field date-picker");
assert.equal(datePicker.dataset.density, "lg");
assert.equal(datePicker.dataset.state, "focus");
assert.equal(datePicker.querySelector(".field__label").textContent, "Service date");
assert.equal(datePicker.querySelector(".date-picker__control").attributes["data-date-picker-trigger"], "");
assert.equal(datePicker.querySelector(".date-picker__control").attributes["aria-controls"], datePicker.querySelector(".date-picker__panel").id);
assert.equal(datePicker.querySelector(".date-picker__control").attributes["aria-labelledby"], datePicker.querySelector(".date-picker__label").id);
assert.equal(datePicker.querySelector(".date-picker__control").attributes["aria-describedby"], datePicker.querySelector(".date-picker__helper").id);
assert.equal(datePicker.querySelector(".date-picker__value").textContent, "13 jul 2026");
assert.equal(datePicker.querySelector(".field__helper").textContent, "One operational date.");
assert.equal(datePicker.querySelector("input").type, "date");
assert.equal(datePicker.querySelector("input").attributes["data-date-picker-input"], "");
assert.equal(datePicker.querySelector("input").min, "2026-01-01");
assert.equal(datePicker.querySelector("input").max, "2026-12-31");
assert.equal(datePicker.querySelector(".date-picker__panel").attributes.role, "dialog");
assert.equal(datePicker.querySelector(".date-picker__panel").attributes["aria-modal"], "false");
assert.equal(datePicker.querySelector(".date-picker__panel").hidden, true);
assert.equal(datePicker.querySelectorAll("strong")[0].textContent, "Julio 2026");
assert.equal(datePicker.querySelector(".date-picker__grid").attributes.role, "grid");
assert.equal(datePicker.querySelector(".date-picker__grid").attributes["aria-labelledby"], datePicker.querySelectorAll("strong")[0].id);
assert.equal(datePicker.querySelectorAll(".date-picker__weekday").map((day) => day.textContent).join(""), "LMXJVSD");
assert.equal(datePicker.querySelectorAll(".date-picker__weekday")[0].attributes.role, "columnheader");
assert.equal(datePicker.querySelectorAll(".date-picker__nav").length, 2);
assert.equal(datePicker.querySelectorAll(".date-picker__day")[0].attributes.role, "gridcell");
assert.equal(Boolean(datePicker.querySelectorAll(".date-picker__day")[0].attributes["aria-label"]), true);
let dateValue = "";
let dateOpen = null;
const interactiveDate = createTransitionalDatePicker({
  label: "Service date",
  value: "2026-07-13",
  onValueChange(value) {
    dateValue = value;
  },
  onOpenChange(open) {
    dateOpen = open;
  },
});
interactiveDate.querySelector(".date-picker__control").click();
assert.equal(interactiveDate.querySelector(".date-picker__panel").hidden, false);
assert.equal(interactiveDate.querySelector(".date-picker__control").attributes["aria-expanded"], "true");
assert.equal(dateOpen, true);
interactiveDate.querySelectorAll(".date-picker__nav")[1].click();
assert.equal(interactiveDate.querySelectorAll("strong")[0].textContent, "Agosto 2026");
interactiveDate.querySelectorAll(".date-picker__nav")[0].click();
assert.equal(interactiveDate.querySelectorAll("strong")[0].textContent, "Julio 2026");
const nextDateButton = interactiveDate.querySelectorAll(".date-picker__day")
  .find((button) => button.attributes["data-date-picker-day"] === "2026-07-14");
nextDateButton.click();
assert.equal(dateValue, "2026-07-14");
assert.equal(interactiveDate.querySelector("input").value, "2026-07-14");
assert.equal(interactiveDate.querySelector(".date-picker__panel").hidden, true);
assert.equal(globalThis.document.activeElement, interactiveDate.querySelector(".date-picker__control"));

const dateRangePicker = createTransitionalDateRangePicker({
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
  helper: "One bounded date range.",
  density: "md",
  state: "selected",
});
assert.equal(dateRangePicker.tagName, "DIV");
assert.equal(dateRangePicker.className, "field date-picker date-range-picker");
assert.equal(dateRangePicker.dataset.state, "selected");
assert.equal(dateRangePicker.dataset.from, "2026-07-01");
assert.equal(dateRangePicker.dataset.to, "2026-07-15");
assert.equal(dateRangePicker.querySelector(".date-range-picker__control").attributes["data-date-range-picker-trigger"], "");
assert.equal(dateRangePicker.querySelector(".date-range-picker__control").attributes["aria-controls"], dateRangePicker.querySelector(".date-range-picker__panel").id);
assert.equal(dateRangePicker.querySelector(".date-range-picker__value").textContent, "01 jul 2026 - 15 jul 2026");
assert.equal(dateRangePicker.querySelectorAll(".date-range-picker__preset").length, 3);
assert.equal(dateRangePicker.querySelector(".date-range-picker__panel").attributes.role, "dialog");
assert.equal(dateRangePicker.querySelector(".date-range-picker__grid").attributes.role, "grid");
assert.equal(dateRangePicker.querySelectorAll(".date-range-picker__day").some((day) => day.dataset.rangeEdge === "start"), true);
assert.equal(dateRangePicker.querySelectorAll(".date-range-picker__day").some((day) => day.dataset.rangeEdge === "end"), true);
const dateRangePickerNoPresets = createTransitionalDateRangePicker({
  label: "Export range",
  value: { from: "2026-07-01", to: "2026-07-09" },
  presets: false,
});
assert.equal(dateRangePickerNoPresets.querySelectorAll(".date-range-picker__preset").length, 0);
let rangeValue = null;
let rangeOpen = null;
const interactiveRange = createTransitionalDateRangePicker({
  label: "Reporting range",
  value: {},
  onValueChange(value) {
    rangeValue = value;
  },
  onOpenChange(open) {
    rangeOpen = open;
  },
});
interactiveRange.querySelector(".date-range-picker__control").click();
assert.equal(interactiveRange.querySelector(".date-range-picker__panel").hidden, false);
assert.equal(rangeOpen, true);
const firstInteractiveRangeDay = interactiveRange.querySelector(".date-range-picker__day");
const firstInteractiveRangeDate = firstInteractiveRangeDay.attributes["data-date-range-picker-day"];
firstInteractiveRangeDay.click();
assert.equal(rangeValue.from, firstInteractiveRangeDate);
assert.equal(rangeValue.to, "");
assert.equal(interactiveRange.dataset.from, firstInteractiveRangeDate);
interactiveRange.querySelectorAll(".date-range-picker__preset")[0].click();
assert.equal(Boolean(rangeValue.from), true);
assert.equal(Boolean(rangeValue.to), true);
assert.equal(interactiveRange.querySelector(".date-range-picker__panel").hidden, true);

console.log("components smoke tests passed");
