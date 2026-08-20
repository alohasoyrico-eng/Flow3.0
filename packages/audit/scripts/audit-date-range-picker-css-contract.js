const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkDateRangePickerCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const dateRangePanelBlock = blockFor(blocks, selectorKey, ".date-range-picker__panel");
  const dateRangePresetBlock = blockFor(blocks, selectorKey, ".date-range-picker__preset");
  const dateRangeDayBlock = blockFor(blocks, selectorKey, ".date-range-picker__day[data-in-range=\"true\"]");
  const localPresetMinBlock = /--comp-date-range-picker-preset-min-block-size:\s*calc\(var\(--component-control-min-size\)\s*[+-][^;]+;/.exec(text);
  if (localPresetMinBlock) {
    add("errors", packageCssFile, lineNumber(text, localPresetMinBlock.index), "DateRangePicker preset sizing must flow through shared Frame date range preset roles instead of local control-size math.");
  }

  requireIncludes({
    block: dateRangePanelBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-date-range-picker-panel-inline-size: var(--component-date-range-picker-panel-inline-size)",
      "--comp-date-range-picker-preset-min-block-size: var(--component-date-range-picker-preset-min-block-size)",
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
      "block-size: var(--comp-date-range-picker-preset-min-block-size)",
      "box-sizing: border-box",
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

  const rawDatePanelInline = text.match(/--comp-date-range-picker-panel-inline-size:\s*calc\(var\(--component-control-min-size\) \* [0-9.]+\)/);
  if (rawDatePanelInline) {
    add("errors", packageCssFile, lineNumber(text, rawDatePanelInline.index), "DateRangePicker panel inline sizes must flow through Frame date panel roles instead of local control multipliers.");
  }
}

module.exports = { checkDateRangePickerCssContract };
