const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkSelectCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const comboboxBlock = blockFor(blocks, selectorKey, ".combobox");
  const selectBlock = blockFor(blocks, selectorKey, ".select-control");
  const countrySelectorBlock = blockFor(blocks, selectorKey, ".country-selector");

  requireIncludes({
    block: comboboxBlock,
    text,
    packageCssFile,
    snippets: ["--comp-combobox-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))"],
    message: "Combobox chevron sizing must consume Frame micro offset instead of raw rem values.",
  });
  requireIncludes({
    block: selectBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-padding-end: calc(var(--sys-space-lg) - var(--component-frame-space-micro))",
      "--comp-select-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-select-option-min-size: var(--component-option-min-block-size)",
      "--comp-select-option-radius: calc(var(--component-radius-control) - var(--component-frame-space-micro))",
    ],
    message: "Select frame offsets must consume Frame micro aliases instead of raw px/rem values.",
  });
  requireIncludes({
    block: countrySelectorBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-country-selector-inline-listbox-max-inline-size: var(--component-country-selector-inline-listbox-max-inline-size)",
      "--comp-country-selector-inline-listbox-inline-size: var(--component-country-selector-inline-listbox-inline-size)",
      "--comp-country-selector-search-radius: calc(var(--component-radius-control) - var(--component-frame-space-micro))",
    ],
    message: "Country Selector listbox frame and search radius must consume Frame/component aliases instead of local values.",
  });
  if (/--comp-(?:combobox|select|country-selector)[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Select and Combobox component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
  const rawOptionHeight = text.match(/--comp-select-option-min-size:\s*calc\(var\(--component-control-min-size\)[^;]+/);
  if (rawOptionHeight) {
    add("errors", packageCssFile, lineNumber(text, rawOptionHeight.index), "Select option height must flow through shared Frame option roles instead of local control-size calculations.");
  }
  const rawCountryInline = text.match(/--comp-country-selector-inline-listbox-(?:max-inline-size|inline-size):\s*(?:calc\(var\(--component-control-min-size\) \* [0-9.]+\)|min\([^;]*100vw)/);
  if (rawCountryInline) {
    add("errors", packageCssFile, lineNumber(text, rawCountryInline.index), "Country Selector inline listbox sizes must flow through Frame listbox roles instead of local control multipliers or viewport clamps.");
  }
}

module.exports = { checkSelectCssContract };
