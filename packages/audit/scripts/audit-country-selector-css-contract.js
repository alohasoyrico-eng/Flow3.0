const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCountrySelectorCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const countrySelectorBlock = blockFor(blocks, selectorKey, ".country-selector");

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

  const rawCountryInline = text.match(/--comp-country-selector-inline-listbox-(?:max-inline-size|inline-size):\s*(?:calc\(var\(--component-control-min-size\) \* [0-9.]+\)|min\([^;]*100vw)/);
  if (rawCountryInline) {
    add("errors", packageCssFile, lineNumber(text, rawCountryInline.index), "Country Selector inline listbox sizes must flow through Frame listbox roles instead of local control multipliers or viewport clamps.");
  }
}

module.exports = { checkCountrySelectorCssContract };
