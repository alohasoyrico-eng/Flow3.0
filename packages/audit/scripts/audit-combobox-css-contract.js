const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkComboboxCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const comboboxBlock = blockFor(blocks, selectorKey, ".combobox");
  const chevronBlock = blockFor(blocks, selectorKey, ".combobox__chevron");
  const focusChevronBlock = blockFor(blocks, selectorKey, ".combobox:focus-within .combobox__chevron");
  const openListboxBlock = blockFor(blocks, selectorKey, ".combobox[data-open=\"true\"] .combobox__listbox");
  const emptyBlock = blockFor(blocks, selectorKey, ".combobox__empty");

  requireIncludes({
    block: comboboxBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-combobox-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-combobox-chevron-motion-duration: var(--component-duration-state)",
      "--comp-combobox-overlay-motion-duration: var(--component-duration-state)",
      "--comp-combobox-overlay-visibility-duration: var(--component-duration-instant)",
      "--comp-combobox-empty-font-size: var(--component-font-size-caption)",
    ],
    message: "Combobox aliases must derive chevron, overlay, and empty-state roles from Flow component tokens.",
  });
  requireIncludes({
    block: chevronBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-combobox-chevron-color)"],
    message: "Combobox chevron must consume its component color alias.",
  });
  requireIncludes({
    block: focusChevronBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-combobox-chevron-focus-color)"],
    message: "Combobox focused chevron must consume its component focus color alias.",
  });
  requireIncludes({
    block: openListboxBlock,
    text,
    packageCssFile,
    snippets: [
      "opacity: var(--comp-combobox-open-opacity)",
      "opacity var(--comp-combobox-overlay-motion-duration) var(--comp-combobox-overlay-motion-ease)",
      "visibility var(--comp-combobox-overlay-visibility-duration) var(--comp-combobox-overlay-visibility-ease) var(--comp-combobox-overlay-visibility-duration)",
    ],
    message: "Combobox open listbox must consume component overlay motion aliases.",
  });
  requireIncludes({
    block: emptyBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-combobox-empty-color)",
      "font-size: var(--comp-combobox-empty-font-size)",
      "padding: var(--comp-combobox-empty-padding-block) var(--comp-combobox-empty-padding-inline)",
    ],
    message: "Combobox empty state must consume component voice and spacing aliases.",
  });

  if (/--comp-combobox[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Combobox component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
}

module.exports = { checkComboboxCssContract };
