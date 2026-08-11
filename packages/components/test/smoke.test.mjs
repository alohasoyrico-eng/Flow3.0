import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createAnimationAsset,
  createChartsPrimitive,
  createMapsPrimitive,
  countryFlagAssetPath,
  hasCountryFlag,
  listCountryFlags,
  resolveAnimationRuntime,
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
  inputAmountPlatformAdapters,
  inputAmountPlatformContract,
  inputAmountPlatformProps,
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
assert.deepEqual(Object.keys(componentContracts), ["button", "iconButton", "input", "inputAmount", "cardNumberInput", "cardExpiryInput", "cardSecurityCodeInput", "select", "combobox", "card", "checkbox", "switch", "radioButton", "textArea", "badge", "chip", "tag", "tabs", "tooltip", "toast", "progressIndicator", "spinner", "accordion", "slider", "avatar", "skeleton", "dialog", "menu", "drawer", "table", "biometricPrompt", "treeView", "motionBoundary", "animatedMoment", "emptyState", "list", "kpiTile", "floatingActionButton", "breadcrumbs", "pagination", "auditEvent", "errorPanel", "inlineValidation", "stepper", "chartPanel", "stationPin", "routeSummary", "codeInput", "phoneInput", "countrySelector", "datePicker", "dateRangePicker", "segmentedControl", "popover", "cardSummary", "movementRow", "chatMessage", "chatThread", "chatComposer", "quickAction"]);
assert.equal(componentContracts.button.factory, "@design-system/react/button");
assert.equal(buttonPlatformContract.id, "button");
assert.equal(buttonPlatformContract.source.factory, componentContracts.button.factory);
assert.deepEqual(buttonPlatformProps(), componentContracts.button.props.map((prop) => prop.name));
assert.deepEqual(buttonPlatformContract.variants, componentContracts.button.variants);
assert.deepEqual(buttonPlatformContract.states, componentContracts.button.states);
assert.deepEqual(Object.keys(buttonPlatformAdapters), ["react"]);
assert.equal(buttonPlatformAdapters.react.componentName, "Button");
assert.equal(buttonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.iconButton.factory, "@design-system/react/icon-button");
assert.equal(iconButtonPlatformContract.id, "icon-button");
assert.equal(iconButtonPlatformContract.source.factory, componentContracts.iconButton.factory);
assert.deepEqual(iconButtonPlatformProps(), componentContracts.iconButton.props.map((prop) => prop.name));
assert.deepEqual(iconButtonPlatformContract.variants, componentContracts.iconButton.variants);
assert.deepEqual(iconButtonPlatformContract.states, componentContracts.iconButton.states);
assert.deepEqual(Object.keys(iconButtonPlatformAdapters), ["react"]);
assert.equal(iconButtonPlatformAdapters.react.componentName, "IconButton");
assert.equal(iconButtonPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.input.factory, "@design-system/react/input");
assert.equal(inputPlatformContract.id, "input");
assert.equal(inputPlatformContract.source.factory, componentContracts.input.factory);
assert.deepEqual(inputPlatformProps(), componentContracts.input.props.map((prop) => prop.name));
assert.deepEqual(inputPlatformContract.variants, componentContracts.input.variants);
assert.deepEqual(inputPlatformContract.states, componentContracts.input.states);
assert.deepEqual(Object.keys(inputPlatformAdapters), ["react"]);
assert.equal(inputPlatformAdapters.react.componentName, "Input");
assert.equal(inputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.inputAmount.factory, "@design-system/react/input-amount");
assert.equal(inputAmountPlatformContract.id, "input-amount");
assert.equal(inputAmountPlatformContract.source.factory, componentContracts.inputAmount.factory);
assert.deepEqual(inputAmountPlatformProps(), componentContracts.inputAmount.props.map((prop) => prop.name));
assert.deepEqual(inputAmountPlatformContract.variants, componentContracts.inputAmount.variants);
assert.deepEqual(inputAmountPlatformContract.states, componentContracts.inputAmount.states);
assert.deepEqual(Object.keys(inputAmountPlatformAdapters), ["react"]);
assert.equal(inputAmountPlatformAdapters.react.componentName, "InputAmount");
assert.equal(inputAmountPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.cardNumberInput.factory, "@design-system/react/card-number-input");
assert.equal(cardNumberInputPlatformContract.id, "card-number-input");
assert.equal(cardNumberInputPlatformContract.source.factory, componentContracts.cardNumberInput.factory);
assert.deepEqual(cardNumberInputPlatformProps(), componentContracts.cardNumberInput.props.map((prop) => prop.name));
assert.deepEqual(cardNumberInputPlatformContract.variants, componentContracts.cardNumberInput.variants);
assert.deepEqual(cardNumberInputPlatformContract.states, componentContracts.cardNumberInput.states);
assert.deepEqual(Object.keys(cardNumberInputPlatformAdapters), ["react"]);
assert.equal(cardNumberInputPlatformAdapters.react.componentName, "CardNumberInput");
assert.equal(cardNumberInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.cardExpiryInput.factory, "@design-system/react/card-expiry-input");
assert.equal(cardExpiryInputPlatformContract.id, "card-expiry-input");
assert.equal(cardExpiryInputPlatformContract.source.factory, componentContracts.cardExpiryInput.factory);
assert.deepEqual(cardExpiryInputPlatformProps(), componentContracts.cardExpiryInput.props.map((prop) => prop.name));
assert.deepEqual(cardExpiryInputPlatformContract.variants, componentContracts.cardExpiryInput.variants);
assert.deepEqual(cardExpiryInputPlatformContract.states, componentContracts.cardExpiryInput.states);
assert.deepEqual(Object.keys(cardExpiryInputPlatformAdapters), ["react"]);
assert.equal(cardExpiryInputPlatformAdapters.react.componentName, "CardExpiryInput");
assert.equal(cardExpiryInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.cardSecurityCodeInput.factory, "@design-system/react/card-security-code-input");
assert.equal(cardSecurityCodeInputPlatformContract.id, "card-security-code-input");
assert.equal(cardSecurityCodeInputPlatformContract.source.factory, componentContracts.cardSecurityCodeInput.factory);
assert.deepEqual(cardSecurityCodeInputPlatformProps(), componentContracts.cardSecurityCodeInput.props.map((prop) => prop.name));
assert.deepEqual(cardSecurityCodeInputPlatformContract.variants, componentContracts.cardSecurityCodeInput.variants);
assert.deepEqual(cardSecurityCodeInputPlatformContract.states, componentContracts.cardSecurityCodeInput.states);
assert.deepEqual(Object.keys(cardSecurityCodeInputPlatformAdapters), ["react"]);
assert.equal(cardSecurityCodeInputPlatformAdapters.react.componentName, "CardSecurityCodeInput");
assert.equal(cardSecurityCodeInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.select.factory, "@design-system/react/select");
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
assert.equal(textAreaPlatformContract.id, "text-area");
assert.equal(textAreaPlatformContract.source.factory, componentContracts.textArea.factory);
assert.deepEqual(textAreaPlatformProps(), componentContracts.textArea.props.map((prop) => prop.name));
assert.deepEqual(textAreaPlatformContract.variants, componentContracts.textArea.variants);
assert.deepEqual(textAreaPlatformContract.states, componentContracts.textArea.states);
assert.deepEqual(Object.keys(textAreaPlatformAdapters), ["react"]);
assert.equal(textAreaPlatformAdapters.react.componentName, "TextArea");
assert.equal(textAreaPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.combobox.factory, "@design-system/react/combobox");
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
assert.equal(switchPlatformContract.id, "switch");
assert.equal(switchPlatformContract.source.factory, componentContracts.switch.factory);
assert.deepEqual(switchPlatformProps(), componentContracts.switch.props.map((prop) => prop.name));
assert.deepEqual(switchPlatformContract.variants, componentContracts.switch.variants);
assert.deepEqual(switchPlatformContract.states, componentContracts.switch.states);
assert.deepEqual(Object.keys(switchPlatformAdapters), ["react"]);
assert.equal(switchPlatformAdapters.react.componentName, "Switch");
assert.equal(switchPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.radioButton.factory, "@design-system/react/radio-button");
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
assert.equal(codeInputPlatformContract.id, "code-input");
assert.equal(codeInputPlatformContract.source.factory, componentContracts.codeInput.factory);
assert.deepEqual(codeInputPlatformProps(), componentContracts.codeInput.props.map((prop) => prop.name));
assert.deepEqual(codeInputPlatformContract.variants, componentContracts.codeInput.variants);
assert.deepEqual(codeInputPlatformContract.states, componentContracts.codeInput.states);
assert.deepEqual(Object.keys(codeInputPlatformAdapters), ["react"]);
assert.equal(codeInputPlatformAdapters.react.componentName, "CodeInput");
assert.equal(codeInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.phoneInput.factory, "@design-system/react/phone-input");
assert.equal(phoneInputPlatformContract.id, "phone-input");
assert.equal(phoneInputPlatformContract.source.factory, componentContracts.phoneInput.factory);
assert.deepEqual(phoneInputPlatformProps(), componentContracts.phoneInput.props.map((prop) => prop.name));
assert.deepEqual(phoneInputPlatformContract.variants, componentContracts.phoneInput.variants);
assert.deepEqual(phoneInputPlatformContract.states, componentContracts.phoneInput.states);
assert.deepEqual(Object.keys(phoneInputPlatformAdapters), ["react"]);
assert.equal(phoneInputPlatformAdapters.react.componentName, "PhoneInput");
assert.equal(phoneInputPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.countrySelector.factory, "@design-system/react/country-selector");
assert.equal(countrySelectorPlatformContract.id, "country-selector");
assert.equal(countrySelectorPlatformContract.source.factory, componentContracts.countrySelector.factory);
assert.deepEqual(countrySelectorPlatformProps(), componentContracts.countrySelector.props.map((prop) => prop.name));
assert.deepEqual(countrySelectorPlatformContract.variants, componentContracts.countrySelector.variants);
assert.deepEqual(countrySelectorPlatformContract.states, componentContracts.countrySelector.states);
assert.deepEqual(Object.keys(countrySelectorPlatformAdapters), ["react"]);
assert.equal(countrySelectorPlatformAdapters.react.componentName, "CountrySelector");
assert.equal(countrySelectorPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.datePicker.factory, "@design-system/react/date-picker");
assert.equal(datePickerPlatformContract.id, "date-picker");
assert.equal(datePickerPlatformContract.source.factory, componentContracts.datePicker.factory);
assert.deepEqual(datePickerPlatformProps(), componentContracts.datePicker.props.map((prop) => prop.name));
assert.deepEqual(datePickerPlatformContract.variants, componentContracts.datePicker.variants);
assert.deepEqual(datePickerPlatformContract.states, componentContracts.datePicker.states);
assert.deepEqual(Object.keys(datePickerPlatformAdapters), ["react"]);
assert.equal(datePickerPlatformAdapters.react.componentName, "DatePicker");
assert.equal(datePickerPlatformAdapters.react.sourceOfTruth, true);
assert.equal(componentContracts.dateRangePicker.factory, "@design-system/react/date-range-picker");
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

assert.ok(listCountryFlags().length > 200);
assert.equal(hasCountryFlag("MX"), true);
assert.equal(hasCountryFlag("ZZ"), false);
assert.equal(countryFlagAssetPath("MX"), "./vendor/country-flag-icons/3x2/MX.svg");

const primitiveChart = createChartsPrimitive({ type: "donut", label: "Mix", segments: [{ label: "Fuel", value: 7 }, { label: "EV", value: 3 }] });
assert.equal(primitiveChart.echartsOption.series[0].type, "pie");
assert.equal(primitiveChart.legendModel.length, 2);
const unlabeledPrimitiveChart = createChartsPrimitive({ values: [1, 2, 3] });
assert.equal(unlabeledPrimitiveChart.textSummary.includes("Value 1"), false);
assert.equal(unlabeledPrimitiveChart.textSummary.includes("Series 1"), false);
assert.deepEqual(unlabeledPrimitiveChart.tableFallback.map((row) => row.label), ["", "", ""]);
const emptyPrimitiveChart = createChartsPrimitive();
assert.equal(emptyPrimitiveChart.textSummary.includes("32"), false);
assert.equal(emptyPrimitiveChart.tableFallback.length, 0);
const unnamedMapPrimitive = createMapsPrimitive({ permission: "granted", pins: [{}] });
assert.equal(unnamedMapPrimitive.mapLayerModel.pins[0].label, "");
assert.equal(unnamedMapPrimitive.mapLayerModel.pins[0].accessibleLabel, "");
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

console.log("components smoke tests passed");
