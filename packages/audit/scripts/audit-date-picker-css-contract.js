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

  requireIncludes({
    block: datePickerBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-picker-control-size: var(--component-field-control-size-md)",
      "--comp-date-picker-day-size: calc(var(--component-density-control-height) - var(--component-space-lg) + var(--component-frame-space-micro))",
      "--comp-date-picker-panel-inline-size: var(--component-date-picker-panel-inline-size)",
      "--comp-date-picker-radius: var(--component-radius-control)",
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
    ],
    message: "DatePicker lg density must override only the current component aliases.",
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
