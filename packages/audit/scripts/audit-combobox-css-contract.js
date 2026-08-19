const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkComboboxCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/Combobox.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/Combobox.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const comboboxBlock = blockFor(blocks, selectorKey, ".combobox");
  const chevronBlock = blockFor(blocks, selectorKey, ".combobox__chevron");
  const disabledClearBlock = blockFor(blocks, selectorKey, ".combobox__clear:disabled");
  const focusChevronBlock = blockFor(blocks, selectorKey, ".combobox:focus-within .combobox__chevron");
  const listboxBlock = blockFor(blocks, selectorKey, ".combobox__listbox");
  const openListboxBlock = blockFor(blocks, selectorKey, ".combobox[data-open=\"true\"] .combobox__listbox");
  const optionBlock = blockFor(blocks, selectorKey, ".combobox__option");
  const selectedCheckBlock = blockFor(blocks, selectorKey, ".combobox__option[data-selected=\"true\"] .combobox__option-check");
  const loadingIconBlock = blockFor(blocks, selectorKey, ".combobox[data-state=\"loading\"] .combobox__loading-icon");
  const loadingBlock = blockFor(blocks, selectorKey, ".combobox__loading");
  const emptyBlock = blockFor(blocks, selectorKey, ".combobox__empty") ?? blockFor(blocks, selectorKey, ".combobox__loading,.combobox__empty");

  requireIncludes({
    block: comboboxBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-combobox-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-combobox-chevron-motion-duration: var(--component-duration-state)",
      "--comp-combobox-overlay-motion-duration: var(--component-duration-state)",
      "--comp-combobox-overlay-visibility-duration: var(--component-duration-instant)",
      "--comp-combobox-listbox-bg: var(--component-listbox-bg)",
      "--comp-combobox-listbox-padding: var(--component-listbox-padding)",
      "--comp-combobox-listbox-radius: var(--component-listbox-radius)",
      "--comp-combobox-listbox-offset: var(--component-listbox-offset)",
      "--comp-combobox-loading-font-size: var(--component-font-size-caption)",
      "--comp-combobox-loading-padding-inline: var(--component-option-row-padding-inline-sm)",
      "--comp-combobox-empty-font-size: var(--component-font-size-caption)",
      "--comp-combobox-empty-padding-inline: var(--component-option-row-padding-inline-sm)",
      "--comp-combobox-option-min-size: var(--component-option-row-min-block-size-md)",
      "--comp-combobox-option-padding-x: var(--component-option-row-padding-inline-sm)",
      "--comp-combobox-option-active-ring: var(--component-option-row-active-ring)",
      "--comp-combobox-option-selected-bg: var(--component-option-row-selected-bg)",
      "--comp-combobox-option-disabled-bg: var(--component-option-row-disabled-bg)",
      "--comp-combobox-option-disabled-color: var(--component-option-row-disabled-color)",
      "--comp-combobox-option-disabled-opacity: var(--component-option-row-disabled-opacity)",
      "--comp-combobox-option-check-family: \"Material Symbols Rounded\"",
      "--comp-combobox-option-check-size-sm: var(--component-option-row-check-size-sm)",
      "--comp-combobox-option-check-size-md: var(--component-option-row-check-size-md)",
      "--comp-combobox-option-check-size-lg: var(--component-option-row-check-size-lg)",
      "--comp-combobox-option-check-size: var(--comp-combobox-option-check-size-md)",
      "--comp-combobox-option-check-hidden-opacity: var(--component-opacity-hidden)",
      "--comp-combobox-option-check-visible-opacity: var(--component-opacity-visible)",
    ],
    message: "Combobox aliases must derive chevron, overlay, listbox, option, loading, and empty-state roles from Flow component tokens.",
  });
  requireIncludes({
    block: chevronBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-combobox-chevron-color)"],
    message: "Combobox chevron must consume its component color alias.",
  });
  requireIncludes({
    block: disabledClearBlock,
    text,
    packageCssFile,
    snippets: ["display: none"],
    message: "Combobox clear action must stay hidden until a value can be cleared.",
  });
  requireIncludes({
    block: focusChevronBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-combobox-chevron-focus-color)"],
    message: "Combobox focused chevron must consume its component focus color alias.",
  });
  requireIncludes({
    block: listboxBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-combobox-listbox-bg)",
      "border: var(--component-border-width) solid var(--comp-combobox-listbox-border)",
      "border-radius: var(--comp-combobox-listbox-radius)",
      "box-shadow: var(--comp-combobox-listbox-depth)",
      "display: grid",
      "inset-block-start: calc(100% + var(--comp-combobox-listbox-offset))",
      "position: absolute",
      "padding: var(--comp-combobox-listbox-padding)",
    ],
    message: "Combobox listbox must own its Flow listbox geometry instead of relying on Select-only aliases.",
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
    block: optionBlock,
    text,
    packageCssFile,
    snippets: [
      "grid-template-columns: minmax(0, 1fr) auto auto",
      "min-block-size: var(--comp-combobox-option-min-size)",
      "padding: 0 var(--comp-combobox-option-padding-x)",
      "display: grid",
    ],
    message: "Combobox options must own row geometry and reserve trailing columns for metadata and selected check geometry.",
  });
  requireIncludes({
    block: selectedCheckBlock,
    text,
    packageCssFile,
    snippets: ["opacity: var(--comp-combobox-option-check-visible-opacity)"],
    message: "Combobox selected options must expose the shared selected check affordance.",
  });
  requireIncludes({
    block: loadingIconBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-combobox-loading-icon-color)"],
    message: "Combobox loading icon must consume the shared input loading color alias.",
  });
  requireIncludes({
    block: loadingBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-combobox-loading-color)",
      "font-size: var(--comp-combobox-loading-font-size)",
      "padding: var(--comp-combobox-loading-padding-block) var(--comp-combobox-loading-padding-inline)",
    ],
    message: "Combobox loading status must consume component voice and spacing aliases.",
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
  if (text.includes('[data-theme="dark"] .combobox')) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf('[data-theme="dark"] .combobox')), "Combobox dark mode must be handled through shared component listbox/option tokens, not a Combobox-specific dark override.");
  }

  if (!text.includes(".combobox__option[data-active=\"true\"]:not([data-selected=\"true\"])")) {
    add("errors", packageCssFile, 1, "Combobox active option state must be visually separate from selected state.");
  }
  if (!text.includes("outline: var(--component-focus-ring-width) solid var(--comp-combobox-option-active-ring)")) {
    add("errors", packageCssFile, 1, "Combobox active/keyboard option ring must consume the shared option active ring role.");
  }
  if (!text.includes(".combobox__option[data-disabled=\"true\"") || !text.includes("opacity: var(--comp-combobox-option-disabled-opacity)")) {
    add("errors", packageCssFile, 1, "Combobox disabled options must expose a distinct shared disabled option affordance.");
  }
  if (!source.includes("useState<number | null>(null)") || !source.includes("const isActive = activeOption === option") || !source.includes("\"data-active\": String(isActive)")) {
    add("errors", sourceFile, 1, "Combobox must not preactivate the first option; active option state is created by explicit keyboard/navigation intent.");
  }
  if (!source.includes("\"aria-activedescendant\": isOpen && activeOption && activeIndex !== null")) {
    add("errors", sourceFile, 1, "Combobox aria-activedescendant must only be emitted for an open listbox with an explicit active option.");
  }

  if (/--comp-combobox[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Combobox component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
}

module.exports = { checkComboboxCssContract };
