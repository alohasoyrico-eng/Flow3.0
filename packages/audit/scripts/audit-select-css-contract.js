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
      "--comp-select-padding-end: calc(var(--component-space-lg) - var(--component-frame-space-micro))",
      "--comp-select-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-select-option-min-size: var(--component-option-min-block-size)",
      "--comp-select-option-radius: calc(var(--component-radius-control) - var(--component-frame-space-micro))",
    ],
    message: "Select frame offsets must consume Frame micro aliases instead of raw px/rem values.",
  });
  if (/--comp-(?:combobox|select)[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Select and Combobox component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
  const rawOptionHeight = text.match(/--comp-select-option-min-size:\s*calc\(var\(--component-control-min-size\)[^;]+/);
  if (rawOptionHeight) {
    add("errors", packageCssFile, lineNumber(text, rawOptionHeight.index), "Select option height must flow through shared Frame option roles instead of local control-size calculations.");
  }
}

module.exports = { checkSelectCssContract };
