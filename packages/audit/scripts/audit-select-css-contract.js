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
    snippets: ["--comp-combobox-chevron-size: calc(var(--component-font-size-title-md) + var(--sys-frame-space-micro))"],
    message: "Combobox chevron sizing must consume Frame micro offset instead of raw rem values.",
  });
  requireIncludes({
    block: selectBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-padding-end: calc(var(--sys-space-lg) - var(--sys-frame-space-micro))",
      "--comp-select-chevron-size: calc(var(--component-font-size-title-md) + var(--sys-frame-space-micro))",
      "--comp-select-option-radius: calc(var(--component-radius-control) - var(--sys-frame-space-micro))",
    ],
    message: "Select frame offsets must consume Frame micro aliases instead of raw px/rem values.",
  });
  requireIncludes({
    block: countrySelectorBlock,
    text,
    packageCssFile,
    snippets: ["--comp-country-selector-search-radius: calc(var(--component-radius-control) - var(--sys-frame-space-micro))"],
    message: "Country Selector search radius must consume Frame micro aliases instead of raw px values.",
  });
  if (/--comp-(?:combobox|select|country-selector)[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Select and Combobox component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
}

module.exports = { checkSelectCssContract };
