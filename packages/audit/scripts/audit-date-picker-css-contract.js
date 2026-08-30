const { add, lineNumber } = require("./audit-context.js");
const fs = require("fs");
const path = require("path");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkDatePickerCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/DatePicker.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/DatePicker.js");
  const demoFile = path.join(sourceRoot, "packages/audit/scripts/build-local-react-qa-demo.mjs");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const demo = fs.existsSync(demoFile) ? fs.readFileSync(demoFile, "utf8") : "";
  const datePickerDemo = demo.match(/"date-picker":\s*\{[\s\S]*?\n  "date-range-picker":/)?.[0] ?? "";
  const datePickerBlock = blockFor(blocks, selectorKey, ".date-picker");
  const datePickerSmBlock = blockFor(blocks, selectorKey, ".date-picker[data-density=\"sm\"]");
  const datePickerLgBlock = blockFor(blocks, selectorKey, ".date-picker[data-density=\"lg\"]");
  const datePickerControlBlock = blockFor(blocks, selectorKey, ".date-picker__control");
  const datePickerPanelBlock = blockFor(blocks, selectorKey, ".date-picker__panel");
  const datePickerDayBlock = blockFor(blocks, selectorKey, ".date-picker__day");
  const datePickerValueBlock = blockFor(blocks, selectorKey, ".date-picker__value");
  const datePickerHelperBlock = blockFor(blocks, selectorKey, ".date-picker.field .date-picker__helper");
  const datePickerHeaderBlock = blockFor(blocks, selectorKey, ".date-picker__header strong");
  const datePickerWeekdayBlock = blockFor(blocks, selectorKey, ".date-picker__weekday");
  const datePickerSelectorPanelBlock = blockFor(blocks, selectorKey, ".date-picker__selector-panel");
  const datePickerSelectorListboxBlock = blockFor(blocks, selectorKey, ".date-picker__selector-listbox");
  const datePickerMonthSelectorListboxBlock = blockFor(blocks, selectorKey, ".date-picker__selector-panel--month .date-picker__selector-listbox");
  const datePickerYearSelectorListboxBlock = blockFor(blocks, selectorKey, ".date-picker__selector-panel--year .date-picker__selector-listbox");

  requireIncludes({
    block: datePickerBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-picker-gap: var(--component-field-shell-gap)",
      "--comp-date-picker-control-size: var(--component-field-control-size-md)",
      "--comp-date-picker-day-size: var(--component-date-picker-day-size)",
      "--comp-date-picker-value-font-size-sm: var(--component-control-frame-font-size-sm)",
      "--comp-date-picker-value-font-size-md: var(--component-control-frame-font-size-md)",
      "--comp-date-picker-value-font-size-lg: var(--component-control-frame-font-size-lg)",
      "--comp-date-picker-value-font-size: var(--comp-date-picker-value-font-size-md)",
      "--comp-date-picker-helper-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-date-picker-helper-font-size-md: var(--component-density-helper-size-md)",
      "--comp-date-picker-helper-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-date-picker-helper-font-size: var(--comp-date-picker-helper-font-size-md)",
      "--comp-date-picker-header-font-size-sm: var(--component-density-label-size-sm)",
      "--comp-date-picker-header-font-size-md: var(--component-density-label-size-md)",
      "--comp-date-picker-header-font-size-lg: var(--component-density-label-size-lg)",
      "--comp-date-picker-header-font-size: var(--comp-date-picker-header-font-size-md)",
      "--comp-date-picker-day-font-size-sm: var(--component-density-label-size-sm)",
      "--comp-date-picker-day-font-size-md: var(--component-density-label-size-md)",
      "--comp-date-picker-day-font-size-lg: var(--component-density-label-size-lg)",
      "--comp-date-picker-day-font-size: var(--comp-date-picker-day-font-size-md)",
      "--comp-date-picker-panel-inline-size: var(--component-date-picker-panel-inline-size)",
      "--comp-date-picker-radius: var(--component-control-frame-radius-field)",
      "--comp-date-picker-panel-radius: var(--component-radius-surface)",
    ],
    message: "DatePicker base geometry must derive from Field shell clearance, Field ControlFrame, and frame cascades, not local spacing or a baked md size.",
  });
  requireIncludes({
    block: datePickerSmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-picker-control-size: var(--component-date-picker-control-size-sm)",
      "--comp-date-picker-day-size: var(--component-date-picker-day-size-sm)",
      "--comp-date-picker-value-font-size: var(--comp-date-picker-value-font-size-sm)",
      "--comp-date-picker-helper-font-size: var(--comp-date-picker-helper-font-size-sm)",
      "--comp-date-picker-header-font-size: var(--comp-date-picker-header-font-size-sm)",
      "--comp-date-picker-day-font-size: var(--comp-date-picker-day-font-size-sm)",
    ],
    message: "DatePicker sm density must override only the current component aliases.",
  });
  requireIncludes({
    block: datePickerLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-picker-control-size: var(--component-date-picker-control-size-lg)",
      "--comp-date-picker-day-size: var(--component-date-picker-day-size-lg)",
      "--comp-date-picker-value-font-size: var(--comp-date-picker-value-font-size-lg)",
      "--comp-date-picker-helper-font-size: var(--comp-date-picker-helper-font-size-lg)",
      "--comp-date-picker-header-font-size: var(--comp-date-picker-header-font-size-lg)",
      "--comp-date-picker-day-font-size: var(--comp-date-picker-day-font-size-lg)",
    ],
    message: "DatePicker lg density must override only the current component aliases.",
  });
  requireIncludes({
    block: datePickerValueBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-date-picker-value-font-size)"],
    message: "DatePicker trigger value must consume the density-aware value voice alias.",
  });
  requireIncludes({
    block: datePickerHelperBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-date-picker-helper-font-size)"],
    message: "DatePicker helper must consume the density-aware helper voice alias.",
  });
  requireIncludes({
    block: datePickerHeaderBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-date-picker-header-font-size)"],
    message: "DatePicker calendar header must consume the density-aware header voice alias.",
  });
  requireIncludes({
    block: datePickerWeekdayBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-date-picker-day-font-size)"],
    message: "DatePicker weekdays must consume the density-aware day voice alias.",
  });
  requireIncludes({
    block: datePickerControlBlock,
    text,
    packageCssFile,
    snippets: [
      "gap: var(--comp-date-picker-control-gap)",
      "block-size: var(--comp-date-picker-control-size)",
      "box-sizing: border-box",
      "min-block-size: var(--comp-date-picker-control-size)",
      "border-radius: var(--comp-date-picker-radius)",
    ],
    message: "DatePicker trigger must consume the component-scoped control aliases.",
  });
  requireIncludes({
    block: datePickerPanelBlock,
    text,
    packageCssFile,
    snippets: [
      "border-radius: var(--comp-date-picker-panel-radius)",
      "box-shadow: var(--component-depth-date-panel)",
      "inline-size: var(--comp-date-picker-panel-inline-size)",
      "z-index: var(--component-z-dropdown)",
    ],
    message: "DatePicker panel must route shape and elevation through system/component tokens.",
  });
  requireIncludes({
    block: datePickerDayBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-date-picker-day-font-size)",
      "block-size: var(--comp-date-picker-day-size)",
      "box-sizing: border-box",
      "inline-size: var(--comp-date-picker-day-size)",
      "min-block-size: var(--comp-date-picker-day-size)",
      "min-inline-size: var(--comp-date-picker-day-size)",
      "border-radius: var(--component-radius-pill)",
    ],
    message: "DatePicker days must consume the shared calendar day aliases.",
  });
  requireIncludes({
    block: datePickerSelectorPanelBlock,
    text,
    packageCssFile,
    snippets: ["box-sizing: border-box", "display: grid", "padding-block-start: var(--component-space-2)"],
    message: "DatePicker month/year selectors must render as an in-panel chooser instead of overlaying the calendar grid.",
  });
  requireIncludes({
    block: datePickerSelectorListboxBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-date-picker-surface)",
      "border: var(--component-border-width) solid var(--comp-date-picker-border)",
      "border-radius: var(--component-radius-lg)",
      "box-sizing: border-box",
      "inline-size: 100%",
      "overflow: visible",
    ],
    message: "DatePicker selector listboxes must use Flow surface geometry and avoid local scroll/absolute overlay behavior.",
  });
  requireIncludes({
    block: datePickerMonthSelectorListboxBlock,
    text,
    packageCssFile,
    snippets: ["grid-template-columns: repeat(3, minmax(var(--component-inline-size-lg), 1fr))"],
    message: "DatePicker month selector must use a compact in-panel grid that keeps month labels readable.",
  });
  requireIncludes({
    block: datePickerYearSelectorListboxBlock,
    text,
    packageCssFile,
    snippets: ["grid-template-columns: repeat(4, minmax(var(--component-inline-size-md), 1fr))"],
    message: "DatePicker year selector must use a compact in-panel grid so the default year range does not require scroll.",
  });
  if (/--component-date-picker-(?:control|day)-size-md/.test(text)) {
    add("errors", packageCssFile, 1, "DatePicker must not keep md-only size aliases; base trigger size comes from --component-field-control-size-md.");
  }
  for (const required of [
    "--component-date-picker-control-size-sm: var(--component-field-control-size-sm);",
    "--component-date-picker-control-size-lg: var(--component-field-control-size-lg);",
    "--component-date-picker-day-size: calc(var(--component-control-min-size) - var(--component-space-3));",
  ]) {
    if (!text.includes(required)) {
      add("errors", packageCssFile, 1, `DatePicker trigger density sizes must derive from field ControlFrame aliases. Missing: ${required}`);
    }
  }
  const rawDatePanelInline = text.match(/\.date-picker__panel\s*{[^}]*inline-size:\s*calc\(var\(--component-control-min-size\) \* [0-9.]+\)/s);
  if (rawDatePanelInline) {
    add("errors", packageCssFile, lineNumber(text, rawDatePanelInline.index), "DatePicker panel inline sizes must flow through Frame date panel roles instead of local control multipliers.");
  }
  for (const [snippet, message] of [
    ["function addDays", "DatePicker grid keyboard navigation must move by calendar dates, not by wrapping visible button indexes."],
    ["function addMonthsClamped", "DatePicker PageUp/PageDown must preserve a valid day across month changes."],
    ["event.shiftKey ? 12 : 1", "DatePicker must support year jumps with Shift+PageUp/Shift+PageDown instead of forcing keyboard users to move month by month."],
    ["previousYearLabel", "DatePicker must expose previousYearLabel instead of hardcoding visible year-navigation copy."],
    ["nextYearLabel", "DatePicker must expose nextYearLabel instead of hardcoding visible year-navigation copy."],
    ["monthSelectLabel", "DatePicker must expose monthSelectLabel instead of hardcoding month-selector copy."],
    ["yearSelectLabel", "DatePicker must expose yearSelectLabel instead of hardcoding year-selector copy."],
    ["date-picker__selector date-picker__selector--month", "DatePicker must expose a keyboard-native month selector in the calendar header."],
    ["date-picker__selector date-picker__selector--year", "DatePicker must expose a keyboard-native year selector in the calendar header."],
    ["date-picker__selector-panel date-picker__selector-panel--month", "DatePicker month selector must render in the panel body instead of inside the header trigger."],
    ["date-picker__selector-panel date-picker__selector-panel--year", "DatePicker year selector must render in the panel body instead of inside the header trigger."],
    ["moveMonth(-12)", "DatePicker must expose visible previous-year navigation in the calendar header."],
    ["moveMonth(12)", "DatePicker must expose visible next-year navigation in the calendar header."],
    ["keepTabInsidePanel", "DatePicker must keep header controls keyboard-reachable instead of closing the panel on Tab."],
    ["currentIndex + direction + tabbables.length", "DatePicker Tab handling must cycle through every reachable panel control, not only boundary exits."],
    ['event.key === "Home"', "DatePicker must support Home to move to the first enabled day in the current month."],
    ['event.key === "End"', "DatePicker must support End to move to the last enabled day in the current month."],
  ]) {
    if (!source.includes(snippet)) add("errors", sourceFile, 1, message);
  }
  for (const [snippet, message] of [
    ['locale: "es-MX"', "DatePicker runtime 1:1 demo must pass Spanish locale from the consumer layer."],
    ['weekdays: ["L", "M", "X", "J", "V", "S", "D"]', "DatePicker runtime 1:1 demo must pass Monday-first weekday labels from the consumer layer."],
    ['monthSelectLabel: "Seleccionar mes"', "DatePicker runtime 1:1 demo must pass month-selector copy from the consumer layer."],
    ['yearSelectLabel: "Seleccionar año"', "DatePicker runtime 1:1 demo must pass year-selector copy from the consumer layer."],
  ]) {
    if (!datePickerDemo.includes(snippet)) add("errors", demoFile, 1, message);
  }
}

module.exports = { checkDatePickerCssContract };
