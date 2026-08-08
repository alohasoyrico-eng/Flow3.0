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
  const dateRangePanelBlock = blockFor(blocks, selectorKey, ".date-range-picker__panel");
  const dateRangePresetBlock = blockFor(blocks, selectorKey, ".date-range-picker__preset");
  const dateRangeDayBlock = blockFor(blocks, selectorKey, ".date-range-picker__day[data-in-range=\"true\"]");

  requireIncludes({
    block: datePickerBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-picker-control-size: var(--sys-density-control-height)",
      "--comp-date-picker-day-size: calc(var(--sys-density-control-height) - var(--sys-space-lg) + var(--sys-frame-space-micro))",
      "--comp-date-picker-radius: var(--component-radius-control)",
      "--comp-date-picker-panel-radius: var(--sys-frame-radius-surface)",
    ],
    message: "DatePicker base geometry must derive from the density and frame cascades, not a baked md size.",
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
      "z-index: var(--sys-depth-z-dropdown)",
    ],
    message: "DatePicker panel must route shape and elevation through system/component tokens.",
  });
  requireIncludes({
    block: datePickerDayBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-date-picker-day-font-size)",
      "min-block-size: var(--comp-date-picker-day-size)",
      "border-radius: var(--component-radius-pill)",
    ],
    message: "DatePicker days must consume the shared calendar day aliases.",
  });
  requireIncludes({
    block: dateRangePanelBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-range-picker-panel-inline-size: calc(var(--component-control-min-size) * 7)",
      "--comp-date-range-picker-preset-radius: var(--component-radius-pill)",
      "--comp-date-range-picker-motion-duration: var(--component-duration-state)",
    ],
    message: "DateRangePicker must extend DatePicker with component-scoped range aliases.",
  });
  requireIncludes({
    block: dateRangePresetBlock,
    text,
    packageCssFile,
    snippets: [
      "border: var(--component-border-width) solid var(--comp-date-range-picker-preset-border)",
      "font-size: var(--comp-date-range-picker-preset-font-size)",
      "transform var(--comp-date-range-picker-motion-press-duration) var(--comp-date-range-picker-motion-press)",
    ],
    message: "DateRangePicker presets must consume range aliases for frame, voice, and motion.",
  });
  requireIncludes({
    block: dateRangeDayBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-date-range-picker-range-bg)",
      "border-radius: var(--comp-date-range-picker-range-radius)",
      "color: var(--comp-date-range-picker-range-fg)",
    ],
    message: "DateRangePicker range days must consume range aliases instead of hardcoded styling.",
  });
  if (/--component-date-picker-(?:control|day)-size-md/.test(text)) {
    add("errors", packageCssFile, 1, "DatePicker must not keep md-only size aliases; base size comes from --sys-density-control-height.");
  }
}

module.exports = { checkDatePickerCssContract };
