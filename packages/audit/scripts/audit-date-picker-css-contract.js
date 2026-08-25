const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkDatePickerCssContract({ text, blocks, packageCssFile, selectorKey }) {
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

  requireIncludes({
    block: datePickerBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-picker-control-size: var(--component-field-control-size-md)",
      "--comp-date-picker-day-size: calc(var(--component-density-control-height) - var(--component-space-lg) + var(--component-frame-space-micro))",
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
    message: "DatePicker base geometry must derive from the Field ControlFrame and frame cascades, not a baked md size.",
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
  if (/--component-date-picker-(?:control|day)-size-md/.test(text)) {
    add("errors", packageCssFile, 1, "DatePicker must not keep md-only size aliases; base trigger size comes from --component-field-control-size-md.");
  }
  for (const required of [
    "--component-date-picker-control-size-sm: var(--component-field-control-size-sm);",
    "--component-date-picker-control-size-lg: var(--component-field-control-size-lg);",
  ]) {
    if (!text.includes(required)) {
      add("errors", packageCssFile, 1, `DatePicker trigger density sizes must derive from field ControlFrame aliases. Missing: ${required}`);
    }
  }
  const rawDatePanelInline = text.match(/\.date-picker__panel\s*{[^}]*inline-size:\s*calc\(var\(--component-control-min-size\) \* [0-9.]+\)/s);
  if (rawDatePanelInline) {
    add("errors", packageCssFile, lineNumber(text, rawDatePanelInline.index), "DatePicker panel inline sizes must flow through Frame date panel roles instead of local control multipliers.");
  }
}

module.exports = { checkDatePickerCssContract };
