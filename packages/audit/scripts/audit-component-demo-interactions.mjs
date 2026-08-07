#!/usr/bin/env node

import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

class InteractionEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.key = options.key ?? "";
    this.target = options.target ?? null;
    this.currentTarget = null;
    this.defaultPrevented = false;
    this.propagationStopped = false;
    this.clipboardData = options.clipboardData;
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  stopPropagation() {
    this.propagationStopped = true;
  }
}

class DemoElement {
  constructor(tagName = "div", options = {}) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this.dataset = {};
    this.className = options.className ?? "";
    this.textContent = options.textContent ?? "";
    this.value = options.value ?? "";
    this.hidden = Boolean(options.hidden);
    this.disabled = Boolean(options.disabled);
    this.tabIndex = options.tabIndex ?? 0;
    this.type = options.type ?? "";
    this.min = options.min ?? "";
    this.max = options.max ?? "";
    this.step = options.step ?? "";
    this.id = options.id ?? "";
    this.removed = false;
    this.focused = false;
    this.offsetLeft = options.offsetLeft ?? 0;
    this.offsetWidth = options.offsetWidth ?? 64;
    this.style = {
      values: {},
      setProperty: (name, value) => {
        this.style.values[name] = value;
      },
    };
    this.listeners = new Map();
    this.classList = {
      contains: (name) => this.className.split(/\s+/).includes(name),
      add: (name) => {
        if (!this.classList.contains(name)) this.className = [this.className, name].filter(Boolean).join(" ");
      },
      remove: (name) => {
        this.className = this.className.split(/\s+/).filter((item) => item !== name).join(" ");
      },
    };
    for (const [name, value] of Object.entries(options.attrs ?? {})) this.setAttribute(name, value);
    for (const [name, value] of Object.entries(options.dataset ?? {})) this.dataset[name] = String(value);
  }

  append(...nodes) {
    for (const node of nodes) {
      node.parentNode = this;
      this.children.push(node);
    }
  }

  addEventListener(type, listener) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  dispatch(type, options = {}) {
    const event = type instanceof InteractionEvent ? type : new InteractionEvent(type, options);
    event.target ??= this;
    event.currentTarget = this;
    for (const listener of this.listeners.get(event.type) ?? []) listener(event);
    return event;
  }

  click() {
    return this.dispatch("click");
  }

  focus() {
    this.focused = true;
    return this.dispatch("focus");
  }

  remove() {
    this.removed = true;
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
  }

  replaceWith(nextNode) {
    if (!this.parentNode || !nextNode) return;
    const siblings = this.parentNode.children;
    const index = siblings.indexOf(this);
    if (index < 0) return;
    nextNode.parentNode = this.parentNode;
    siblings.splice(index, 1, nextNode);
    this.parentNode = null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === "id") this.id = String(value);
    if (name === "type") this.type = String(value);
    if (name === "tabindex") this.tabIndex = Number(value);
    if (name.startsWith("data-")) this.dataset[toDatasetKey(name.slice(5))] = String(value);
  }

  getAttribute(name) {
    if (name === "id") return this.id;
    if (name === "type") return this.type;
    if (name === "tabindex") return String(this.tabIndex);
    if (name.startsWith("data-")) return this.dataset[toDatasetKey(name.slice(5))] ?? null;
    return this.attributes[name] ?? null;
  }

  hasAttribute(name) {
    if (name === "id") return Boolean(this.id);
    if (name === "type") return Boolean(this.type);
    if (name === "tabindex") return this.tabIndex != null;
    if (name.startsWith("data-")) return Object.prototype.hasOwnProperty.call(this.dataset, toDatasetKey(name.slice(5)));
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  removeAttribute(name) {
    delete this.attributes[name];
    if (name.startsWith("data-")) delete this.dataset[toDatasetKey(name.slice(5))];
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const selectors = selector.split(",").map((part) => part.trim()).filter(Boolean);
    const all = descendants(this);
    return all.filter((node) => selectors.some((part) => matchesSelectorPath(node, part)));
  }

  closest(selector) {
    let node = this;
    while (node) {
      if (selector.split(",").some((part) => matchesSimpleSelector(node, part.trim()))) return node;
      node = node.parentNode;
    }
    return null;
  }

  get nextElementSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.children;
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
}

globalThis.window = {
  addEventListener() {},
  setTimeout(callback) {
    callback();
  },
};

globalThis.document = new DemoElement("document");
globalThis.document.createElement = (tagName) => new DemoElement(tagName);

const stateful = await import(pathToFileURL(path.join(repoRoot, "apps/docs/stateful-component-interactions.js")).href);
const overlay = await import(pathToFileURL(path.join(repoRoot, "apps/docs/overlay-demo-interactions.js")).href);
const display = await import(pathToFileURL(path.join(repoRoot, "apps/docs/display-demo-interactions.js")).href);
const tooltip = await import(pathToFileURL(path.join(repoRoot, "apps/docs/tooltip-demo-interactions.js")).href);
const toast = await import(pathToFileURL(path.join(repoRoot, "apps/docs/toast-demo-interactions.js")).href);
const progress = await import(pathToFileURL(path.join(repoRoot, "apps/docs/progress-indicator-demo-interactions.js")).href);

const root = new DemoElement("main");
const fixtures = buildFixtures();
root.append(...fixtures.roots);

stateful.setupStatefulComponentDemos(root);
overlay.setupOverlayDemos(root);
overlay.setupMenuDemos(root);
display.setupAccordionDemos(root);
display.setupTableDemos(root);
tooltip.setupTooltipDemos(root);
toast.setupToastDemos(root);
progress.setupProgressIndicatorDemos(root);

fixtures.chipToggle.click();
assert.equal(fixtures.chipToggle.getAttribute("aria-pressed"), "true", "Chip click should toggle pressed state.");
assert.equal(fixtures.chipToggle.dataset.selected, "true", "Chip click should set selected dataset state.");
fixtures.chipRemove.click();
assert.equal(fixtures.chipRemove.removed, true, "Removable Chip click should remove the chip.");

fixtures.tabs.children[0].dispatch("keydown", { key: "ArrowRight" });
assert.equal(fixtures.tabs.children[1].getAttribute("aria-selected"), "true", "Tabs ArrowRight should activate the next tab.");

fixtures.sliderInput.value = "75";
fixtures.sliderInput.dispatch("input");
assert.equal(fixtures.slider.dataset.value, "75", "Slider input should update the demo value.");
assert.equal(fixtures.sliderOutput.textContent, "75 km", "Slider output should preserve the value suffix.");

fixtures.segmented.children[1].click();
assert.equal(fixtures.segmented.children[1].getAttribute("aria-selected"), "true", "Segmented Control click should select the clicked item.");
assert.ok(fixtures.segmented.children[1].querySelector(".segmented-control__indicator"), "Segmented Control selected item should own the visual indicator without inline positioning.");

fixtures.paginationNext.click();
assert.equal(fixtures.paginationPage3.getAttribute("aria-current"), "page", "Pagination next should advance to page 3.");
assert.equal(fixtures.paginationNext.disabled, true, "Pagination next should disable on the last page.");

fixtures.popoverTrigger.click();
assert.equal(fixtures.popover.dataset.statefulReady, "true", "Popover docs should mark the React demo ready.");
assert.equal(fixtures.popoverTrigger.getAttribute("aria-expanded"), "false", "Popover docs runtime should not duplicate React open state.");
assert.equal(fixtures.popoverPanel.hidden, true, "Popover docs runtime should leave closed React panels hidden.");

fixtures.comboboxInput.value = "Luis";
fixtures.comboboxInput.dispatch("input");
assert.equal(fixtures.comboboxControl.dataset.open, "true", "Combobox input should open the option layer after typing.");
assert.equal(fixtures.comboboxInput.getAttribute("aria-expanded"), "true", "Combobox input should expose expanded state after typing.");
assert.equal(fixtures.comboboxOptions[0].hidden, true, "Combobox input should hide non-matching options.");
assert.equal(fixtures.comboboxOptions[1].hidden, false, "Combobox input should keep matching options visible.");
fixtures.comboboxInput.dispatch("keydown", { key: "Enter" });
assert.equal(fixtures.comboboxInput.value, "MX-8840 - Luis Perez", "Combobox Enter should select the active visible option.");
assert.equal(fixtures.comboboxControl.dataset.value, "mx-8840", "Combobox selection should sync semantic value.");
fixtures.comboboxClear.click();
assert.equal(fixtures.comboboxInput.value, "", "Combobox clear action should clear visible value.");

fixtures.treeControls[0].dispatch("keydown", { key: "ArrowDown" });
assert.equal(fixtures.treeItems[1].dataset.selected, "true", "Tree View ArrowDown should select the next item.");
fixtures.treeControls[0].dispatch("keydown", { key: "ArrowRight" });
assert.equal(fixtures.treeItems[0].dataset.expanded, "true", "Tree View ArrowRight should expand expandable items.");

fixtures.overlayClose.click();
assert.equal(fixtures.overlayPanel.hidden, true, "Overlay close should hide the overlay surface.");
assert.equal(fixtures.overlayDemo.dataset.state, "closed", "Overlay close should set closed state.");

fixtures.menuTrigger.click();
assert.equal(fixtures.menuPanel.hidden, false, "Menu trigger should open the menu.");
fixtures.menuItem.click();
assert.equal(fixtures.menuPanel.hidden, true, "Menu item click should close the menu.");

assert.equal(fixtures.accordion.dataset.demoReady, "true", "Accordion React island should be registered without legacy DOM state ownership.");

assert.equal(fixtures.table.dataset.demoReady, "true", "Table setup should only mark React demos ready; interaction belongs to the React component.");

fixtures.tooltipTrigger.dispatch("mouseenter");
assert.equal(fixtures.tooltip.dataset.open, "true", "Tooltip mouseenter should open tooltip.");
fixtures.tooltipTrigger.dispatch("keydown", { key: "Escape" });
assert.equal(fixtures.tooltip.dataset.open, "false", "Tooltip Escape should close tooltip.");

fixtures.toastAction.dispatch("click", { currentTarget: fixtures.toastAction });
assert.equal(fixtures.toastAction.textContent, "Synced", "Toast action should update action label with the completed outcome.");
assert.equal(fixtures.toast.dataset.tone, "success", "Toast action should set success tone.");
fixtures.toastDismiss.click();
assert.equal(fixtures.toast.removed, true, "Toast dismiss should remove the toast.");

assert.equal(fixtures.progress.querySelector(".progress__label").textContent, "Upload", "Progress Indicator should keep a visible label.");
assert.equal(fixtures.progress.attributes["aria-labelledby"], fixtures.progress.querySelector(".progress__label").id, "Progress Indicator should use visible label as accessible name.");
assert.equal(fixtures.progressMeter.attributes.value, "60", "Progress Indicator should set determinate progress through the native progress value.");
assert.equal(fixtures.progressMeter.attributes.max, "100", "Progress Indicator should set determinate progress through the native progress max.");
assert.equal(fixtures.progress.attributes["aria-valuenow"], "60", "Progress Indicator should keep determinate aria-valuenow in sync.");
assert.equal(fixtures.progress.attributes["aria-valuemax"], "100", "Progress Indicator should keep determinate aria-valuemax in sync.");
assert.equal(fixtures.indeterminateProgress.attributes["aria-valuenow"], undefined, "Indeterminate progress must not expose fake aria-valuenow.");
assert.equal(fixtures.indeterminateProgress.querySelector(".progress__value"), null, "Indeterminate progress must not show a fake value.");

console.log(JSON.stringify({
  status: "pass",
  checked: [
    "chip",
    "tabs",
    "slider",
    "segmented-control",
    "pagination",
    "popover",
    "combobox",
    "tree-view",
    "overlay",
    "menu",
    "accordion",
    "table",
    "tooltip",
    "toast",
    "progress-indicator"
  ],
}, null, 2));

function buildFixtures() {
  const chipToggle = el("button", { className: "chip", attrs: { "aria-pressed": "false" }, dataset: { docComponent: "chip", selected: "false", state: "default" } }, [
    el("span", { className: "chip__label", textContent: "Active filter" }),
  ]);
  const chipRemove = el("button", { className: "chip", attrs: { "aria-pressed": "true" }, dataset: { docComponent: "chip", chipRemove: "true", selected: "true", state: "selected" } }, [
    el("span", { className: "chip__label", textContent: "Route" }),
    el("span", { attrs: { "aria-hidden": "true" }, dataset: { chipRemoveIcon: "true" }, textContent: "close" }),
  ]);

  const tabs = el("div", { className: "detail-tablist" }, [
    el("button", { attrs: { role: "tab", "aria-selected": "true" }, offsetLeft: 0, offsetWidth: 80, textContent: "One" }),
    el("button", { attrs: { role: "tab", "aria-selected": "false" }, offsetLeft: 80, offsetWidth: 80, textContent: "Two" }),
  ]);

  const sliderOutput = el("output", { attrs: { "data-slider-output": "" }, textContent: "25 km" });
  const sliderInput = el("input", { attrs: { "data-slider-input": "" }, type: "range", min: "0", max: "100", value: "25" });
  const slider = el("label", { className: "slider-demo" }, [sliderOutput, sliderInput]);

  const segmented = el("div", { className: "segmented-control", dataset: { docComponent: "segmented-control" } }, [
    el("button", { attrs: { role: "tab", "aria-selected": "true", "data-segmented-control-item": "" } }, [
      el("span", { className: "segmented-control__indicator", attrs: { "aria-hidden": "true" } }),
      el("span", { className: "segmented-control__label", textContent: "Today" }),
    ]),
    el("button", { attrs: { role: "tab", "aria-selected": "false", "data-segmented-control-item": "" }, textContent: "Week" }),
  ]);

  const paginationPage1 = el("button", { attrs: { "data-kind": "page", "data-page": "1" }, textContent: "1" });
  const paginationPage2 = el("button", { attrs: { "data-kind": "page", "data-page": "2", "aria-current": "page" }, textContent: "2" });
  const paginationPage3 = el("button", { attrs: { "data-kind": "page", "data-page": "3" }, textContent: "3" });
  const paginationNext = el("button", { attrs: { "data-kind": "next" }, textContent: "Next" });
  const pagination = el("nav", { attrs: { "data-doc-component": "pagination", "data-page": "2", "data-page-count": "3" } }, [
    el("button", { attrs: { "data-kind": "prev" }, textContent: "Prev" }),
    paginationPage1,
    paginationPage2,
    paginationPage3,
    paginationNext,
  ]);

  const popoverTrigger = el("button", { attrs: { "data-popover-trigger": "", "aria-expanded": "false" }, textContent: "Details" });
  const popoverPanel = el("section", { attrs: { role: "dialog" }, hidden: true });
  const popover = el("span", { className: "popover", attrs: { "data-doc-component": "popover", "data-open": "false" }, dataset: { state: "closed" } }, [popoverTrigger, popoverPanel]);

  const comboboxInput = el("input", {
    className: "combobox__input",
    attrs: {
      role: "combobox",
      "aria-expanded": "false",
      "aria-autocomplete": "list",
      "aria-controls": "combobox-audit-listbox",
    },
  });
  const comboboxClear = el("button", {
    className: "field-action combobox__clear",
    attrs: { "data-combobox-clear": "", "aria-label": "Clear vehicle" },
    disabled: true,
  });
  const comboboxOptions = [
    el("button", {
      className: "select-control__option combobox__option",
      attrs: { id: "combobox-audit-option-1", "data-combobox-option": "", role: "option", "aria-selected": "false" },
      dataset: { label: "MX-4821 - Ana Gomez", value: "mx-4821", meta: "Vehicle" },
      textContent: "MX-4821 - Ana Gomez Vehicle",
    }),
    el("button", {
      className: "select-control__option combobox__option",
      attrs: { id: "combobox-audit-option-2", "data-combobox-option": "", role: "option", "aria-selected": "false" },
      dataset: { label: "MX-8840 - Luis Perez", value: "mx-8840", meta: "Vehicle" },
      textContent: "MX-8840 - Luis Perez Vehicle",
    }),
  ];
  const comboboxListbox = el("div", {
    className: "select-control__listbox combobox__listbox",
    attrs: { id: "combobox-audit-listbox", "data-combobox-listbox": "", role: "listbox" },
  }, [
    ...comboboxOptions,
    el("span", { className: "combobox__empty", attrs: { "data-combobox-empty": "", role: "status" }, hidden: true, textContent: "No matching options" }),
  ]);
  const comboboxControl = el("div", {
    className: "field__control combobox",
    attrs: { "data-combobox-control": "" },
    dataset: { open: "false", value: "" },
  }, [comboboxInput, comboboxClear, comboboxListbox]);
  const combobox = el("label", { attrs: { "data-doc-component": "combobox" } }, [comboboxControl]);

  const countrySelectorPrefix = el("span", {
    className: "select-control__code country-selector__code",
    attrs: { "data-country-selector-prefix": "" },
    textContent: "+52",
  });
  const countrySelectorTrigger = el("span", {
    className: "select-control__trigger country-selector__trigger",
    attrs: {
      "data-country-selector-trigger": "",
      role: "combobox",
      "aria-expanded": "false",
      "aria-controls": "country-selector-audit-list",
    },
  }, [
    el("span", { className: "country-flag", attrs: { "data-country-selector-flag": "" }, dataset: { country: "MX" } }),
    countrySelectorPrefix,
    el("span", { className: "select-control__chevron country-selector__chevron", textContent: "expand_more" }),
  ]);
  const countrySelectorSearch = el("input", {
    className: "country-selector__search-input",
    attrs: { "data-country-selector-search": "" },
  });
  const countrySelectorOptions = [
    el("span", {
      className: "select-control__option country-selector__option",
      attrs: { id: "country-selector-audit-mx", "data-country-selector-option": "", role: "option", "aria-selected": "true" },
      dataset: { countryCode: "MX", callingCode: "+52", nationalLength: "10", selected: "true" },
    }, [
      el("span", { className: "country-flag", dataset: { country: "MX" } }),
      el("span", { className: "select-control__option-label country-selector__option-label", textContent: "Mexico" }),
      el("span", { className: "select-control__option-code country-selector__option-code", textContent: "+52" }),
    ]),
    el("span", {
      className: "select-control__option country-selector__option",
      attrs: { id: "country-selector-audit-cu", "data-country-selector-option": "", role: "option", "aria-selected": "false" },
      dataset: { countryCode: "CU", callingCode: "+53", nationalLength: "8", selected: "false" },
    }, [
      el("span", { className: "country-flag", dataset: { country: "CU" } }),
      el("span", { className: "select-control__option-label country-selector__option-label", textContent: "Cuba" }),
      el("span", { className: "select-control__option-code country-selector__option-code", textContent: "+53" }),
    ]),
  ];
  const countrySelectorList = el("span", {
    className: "select-control__listbox country-selector__listbox",
    attrs: { id: "country-selector-audit-list", "data-country-selector-list": "", role: "listbox" },
  }, [
    el("span", { className: "country-selector__search" }, [countrySelectorSearch]),
    ...countrySelectorOptions,
  ]);
  const countrySelectorControl = el("span", {
    className: "select-control country-selector",
    attrs: { "data-country-selector": "" },
    dataset: { country: "MX", value: "MX", open: "false" },
  }, [countrySelectorTrigger, countrySelectorList]);
  const countrySelector = el("span", { attrs: { "data-doc-component": "country-selector" } }, [countrySelectorControl]);

  const treeControls = [el("button", { attrs: { "data-tree-control": "" }, textContent: "Fleet" }), el("button", { attrs: { "data-tree-control": "" }, textContent: "Cards" })];
  const treeItems = [
    el("li", { attrs: { "data-tree-item": "" }, dataset: { selected: "true", expanded: "false" } }, [treeControls[0]]),
    el("li", { attrs: { "data-tree-item": "" }, dataset: { selected: "false" } }, [treeControls[1]]),
  ];
  const tree = el("ul", { attrs: { "data-doc-component": "tree-view" } }, treeItems);

  const overlayTrigger = el("button", { attrs: { "data-overlay-open": "", "aria-expanded": "true" } });
  const overlayClose = el("button", { attrs: { "data-overlay-close": "" } });
  const overlayPanel = el("div", { attrs: { "data-overlay-dismiss": "" } }, [overlayClose]);
  const overlayDemo = el("div", { className: "overlay-demo-fixture", attrs: { "data-doc-component": "dialog" }, dataset: { state: "open" } }, [overlayTrigger, overlayPanel]);

  const menuTrigger = el("button", { attrs: { "data-menu-trigger": "", "aria-expanded": "false" } });
  const menuPanel = el("div", { attrs: { "data-menu-panel": "" }, hidden: true });
  const menuItem = el("button", { attrs: { role: "menuitem" }, textContent: "Edit" });
  menuPanel.append(menuItem);
  const menu = el("span", { className: "menu-demo", dataset: { open: "false" } }, [menuTrigger, menuPanel]);

  const accordion = el("span", { attrs: { "data-doc-component": "accordion" } });

  const table = el("span", { attrs: { "data-doc-component": "table" } });

  const tooltipTrigger = el("button", { className: "tooltip-demo__trigger" });
  const tooltipBubble = el("span", { className: "tooltip-demo__bubble", id: "tip-1" });
  const tooltipRoot = el("span", { className: "tooltip-demo", dataset: { state: "default" } }, [tooltipTrigger, tooltipBubble]);

  const toastAction = el("button", { attrs: { "data-toast-action": "" }, textContent: "Retry" });
  const toastDismiss = el("button", { attrs: { "data-toast-dismiss": "" } });
  const toastRoot = el("article", { className: "toast-demo", dataset: { tone: "danger" } }, [toastAction, toastDismiss]);

  const progressLabel = el("span", { className: "progress__label", attrs: { id: "progress-audit-label" }, textContent: "Upload" });
  const progressValue = el("span", { className: "progress__value", textContent: "60%" });
  const progressMeter = el("progress", { className: "progress__meter", attrs: { value: "60", max: "100", "aria-hidden": "true" } });
  const progressNode = el("div", {
    className: "progress",
    attrs: {
      role: "progressbar",
      "aria-labelledby": "progress-audit-label",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": "60",
    },
    dataset: { value: "60", max: "100", indeterminate: "false" },
  }, [
    el("span", { className: "progress__meta" }, [progressLabel, progressValue]),
    el("span", { className: "progress__track" }, [progressMeter]),
  ]);
  const progressRoot = el("div", { dataset: { docComponent: "progress-indicator", value: "60", max: "100" } }, [progressNode]);
  const indeterminateProgress = el("div", {
    className: "progress",
    attrs: {
      role: "progressbar",
      "aria-labelledby": "progress-indeterminate-label",
      "aria-valuemin": "0",
    },
    dataset: { indeterminate: "true" },
  }, [
    el("span", { className: "progress__meta" }, [
      el("span", { className: "progress__label", attrs: { id: "progress-indeterminate-label" }, textContent: "Syncing" }),
    ]),
    el("span", { className: "progress__track" }, [el("progress", { className: "progress__meter", attrs: { max: "100", "aria-hidden": "true" } })]),
  ]);

  return {
    roots: [
      chipToggle,
      chipRemove,
      tabs,
      slider,
      segmented,
      pagination,
      popover,
      combobox,
      tree,
      overlayDemo,
      menu,
      accordion,
      table,
      tooltipRoot,
      toastRoot,
      progressRoot,
      indeterminateProgress,
    ],
    chipToggle,
    chipRemove,
    tabs,
    slider,
    sliderInput,
    sliderOutput,
    segmented,
    pagination,
    paginationPage3,
    paginationNext,
    popover,
    popoverTrigger,
    popoverPanel,
    combobox,
    comboboxControl,
    comboboxInput,
    comboboxClear,
    comboboxOptions,
      tree,
      treeItems,
      treeControls,
      overlayDemo,
    overlayPanel,
    overlayClose,
    menu,
    menuTrigger,
    menuPanel,
    menuItem,
    accordion,
    table,
    tooltip: tooltipRoot,
    tooltipTrigger,
    toast: toastRoot,
    toastAction,
    toastDismiss,
    progress: progressNode,
    progressMeter,
    indeterminateProgress,
  };
}

function el(tagName, options = {}, children = []) {
  const node = new DemoElement(tagName, options);
  node.append(...children);
  return node;
}

function descendants(root) {
  const nodes = [];
  const visit = (node) => {
    for (const child of node.children) {
      nodes.push(child);
      visit(child);
    }
  };
  visit(root);
  return nodes;
}

function matchesSelectorPath(node, selector) {
  const parts = selector.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return matchesSimpleSelector(node, parts[0]);
  if (!matchesSimpleSelector(node, parts[parts.length - 1])) return false;
  let cursor = node.parentNode;
  for (let index = parts.length - 2; index >= 0; index -= 1) {
    while (cursor && !matchesSimpleSelector(cursor, parts[index])) cursor = cursor.parentNode;
    if (!cursor) return false;
    cursor = cursor.parentNode;
  }
  return true;
}

function matchesSimpleSelector(node, selector) {
  const notMatch = selector.match(/:not\((.+)\)$/);
  const base = notMatch ? selector.slice(0, notMatch.index) : selector;
  if (notMatch && matchesSimpleSelector(node, notMatch[1])) return false;
  if (!base) return true;

  const attrMatches = [...base.matchAll(/\[([^\]=]+)(?:=['"]?([^'"\]]+)['"]?)?\]/g)];
  const withoutAttrs = base.replace(/\[[^\]]+\]/g, "");
  const classMatches = [...withoutAttrs.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((match) => match[1]);
  const tag = withoutAttrs.replace(/\.[a-zA-Z0-9_-]+/g, "");

  if (tag && tag !== "*" && node.tagName.toLowerCase() !== tag.toLowerCase()) return false;
  for (const className of classMatches) {
    if (!node.classList.contains(className)) return false;
  }
  for (const [, attr, expected] of attrMatches) {
    const actual = node.getAttribute(attr);
    if (actual == null) return false;
    if (expected != null && actual !== expected) return false;
  }
  return true;
}

function toDatasetKey(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}
