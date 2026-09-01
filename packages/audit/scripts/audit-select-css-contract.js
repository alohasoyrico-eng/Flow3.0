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

function checkSelectCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/Select.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/Select.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const selectBlock = blockFor(blocks, selectorKey, ".select-control");
  const countrySelectorBlock = blockFor(blocks, selectorKey, ".country-selector");
  const selectTriggerBlock = blockFor(blocks, selectorKey, ".select-control__trigger,.country-selector__trigger,.phone-input__country-trigger");
  const inlineListboxBlock = blockFor(blocks, selectorKey, ".select-control--inline .select-control__listbox,.country-selector.select-control--inline .country-selector__overlay");
  const selectOptionLabelBlock = blockFor(blocks, selectorKey, ".select-control__option-label");
  const selectOptionCodeBlock = blockFor(blocks, selectorKey, ".select-control__option-code");
  const countryOptionLabelBlock = blockFor(blocks, selectorKey, ".country-selector__option-label");
  const countryOptionCodeBlock = blockFor(blocks, selectorKey, ".country-selector__option-code");

  requireIncludes({
    block: selectBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-control-size-md: var(--component-field-control-size-md)",
      "--comp-select-control-size-sm: var(--component-field-control-size-sm)",
      "--comp-select-control-size-lg: var(--component-field-control-size-lg)",
      "--comp-select-padding-start-sm: var(--component-control-frame-padding-field-sm)",
      "--comp-select-padding-start-md: var(--component-control-frame-padding-field-md)",
      "--comp-select-padding-start-lg: var(--component-control-frame-padding-field-lg)",
      "--comp-select-padding-start: var(--comp-select-padding-start-md)",
      "--comp-select-padding-end-sm: calc(var(--component-control-frame-padding-field-sm) - var(--component-frame-space-micro))",
      "--comp-select-padding-end-md: calc(var(--component-control-frame-padding-field-md) - var(--component-frame-space-micro))",
      "--comp-select-padding-end-lg: calc(var(--component-control-frame-padding-field-lg) - var(--component-frame-space-micro))",
      "--comp-select-padding-end: var(--comp-select-padding-end-md)",
      "--comp-select-font-size-sm: var(--component-control-frame-font-size-sm)",
      "--comp-select-font-size-md: var(--component-control-frame-font-size-md)",
      "--comp-select-font-size-lg: var(--component-control-frame-font-size-lg)",
      "--comp-select-font-size: var(--comp-select-font-size-md)",
      "--comp-select-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-select-listbox-padding: var(--component-listbox-padding)",
      "--comp-select-listbox-radius: var(--component-listbox-radius)",
      "--comp-select-listbox-depth: var(--component-listbox-depth)",
      "--comp-select-inline-listbox-inline: var(--component-inline-size-max-content)",
      "--comp-select-inline-listbox-min-inline: var(--component-inline-size-max-content)",
      "--comp-select-option-min-size-sm: var(--component-option-row-min-block-size-sm)",
      "--comp-select-option-min-size-md: var(--component-option-row-min-block-size-md)",
      "--comp-select-option-min-size-lg: var(--component-option-row-min-block-size-lg)",
      "--comp-select-option-min-size: var(--comp-select-option-min-size-md)",
      "--comp-select-option-padding-x-sm: var(--component-option-row-padding-inline-sm)",
      "--comp-select-option-padding-x-md: var(--component-option-row-padding-inline-md)",
      "--comp-select-option-padding-x-lg: var(--component-option-row-padding-inline-lg)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-md)",
      "--comp-select-option-radius: var(--component-option-row-radius)",
      "--comp-select-option-color: var(--component-option-row-color)",
      "--comp-select-option-active-ring: var(--component-option-row-active-ring)",
      "--comp-select-option-selected-color: var(--component-option-row-selected-color)",
      "--comp-select-option-disabled-bg: var(--component-option-row-disabled-bg)",
      "--comp-select-option-disabled-color: var(--component-option-row-disabled-color)",
      "--comp-select-option-disabled-opacity: var(--component-option-row-disabled-opacity)",
      "--comp-select-loading-bg: color-mix(in srgb, var(--component-color-action) 7%, var(--component-color-surface))",
      "--comp-select-option-check-size-sm: var(--component-option-row-check-size-sm)",
      "--comp-select-option-check-size-md: var(--component-option-row-check-size-md)",
      "--comp-select-option-check-size-lg: var(--component-option-row-check-size-lg)",
      "--comp-select-option-check-size: var(--comp-select-option-check-size-md)",
      "--comp-select-option-check-hidden-opacity: var(--component-opacity-hidden)",
      "--comp-select-option-label-font-size-sm: var(--component-density-label-size-sm)",
      "--comp-select-option-label-font-size-md: var(--component-density-label-size-md)",
      "--comp-select-option-label-font-size-lg: var(--component-density-label-size-lg)",
      "--comp-select-option-label-font-size: var(--comp-select-option-label-font-size-md)",
      "--comp-select-option-meta-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-select-option-meta-font-size-md: var(--component-density-helper-size-md)",
      "--comp-select-option-meta-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-select-option-meta-font-size: var(--comp-select-option-meta-font-size-md)",
      "--comp-select-option-meta-opacity: var(--component-opacity-muted)",
    ],
    message: "Select frame offsets and option/listbox geometry must consume shared component option/listbox roles.",
  });
  requireIncludes({
    block: countrySelectorBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-country-selector-label-font-size: var(--comp-select-option-label-font-size)",
      "--comp-country-selector-code-font-size: var(--comp-select-option-meta-font-size)",
    ],
    message: "CountrySelector/Phone option voice must inherit Select option density aliases instead of fixed local sizes.",
  });
  requireIncludes({
    block: selectOptionLabelBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-select-option-label-font-size)",
      "font-weight: var(--component-font-weight-medium)",
    ],
    message: "Select option labels must consume Select-owned option voice density aliases.",
  });
  requireIncludes({
    block: selectOptionCodeBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-select-option-meta-font-size)",
      "font-weight: var(--component-font-weight-bold)",
      "opacity: var(--comp-select-option-meta-opacity)",
    ],
    message: "Select option metadata must consume Select-owned option meta density aliases.",
  });
  requireIncludes({
    block: countryOptionLabelBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-country-selector-label-font-size)"],
    message: "CountrySelector option labels must consume CountrySelector aliases that inherit Select density.",
  });
  requireIncludes({
    block: countryOptionCodeBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-country-selector-code-font-size)",
      "opacity: var(--comp-country-selector-option-code-opacity)",
    ],
    message: "CountrySelector option codes must consume CountrySelector aliases that inherit Select density.",
  });
  if (/--comp-select[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Select component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
  requireIncludes({
    block: selectTriggerBlock,
    text,
    packageCssFile,
    snippets: [
      "border-radius: var(--component-control-frame-radius-field)",
      "block-size: var(--comp-select-current-control-size)",
      "box-sizing: border-box",
      "font-size: var(--comp-select-font-size)",
      "line-height: var(--component-line-height-none)",
    ],
    message: "Select trigger must render the exact ControlFrame field geometry; min-height alone is not enough.",
  });
  const rawOptionHeight = text.match(/--comp-select-option-min-size:\s*calc\(var\(--component-control-min-size\)[^;]+/);
  if (rawOptionHeight) {
    add("errors", packageCssFile, lineNumber(text, rawOptionHeight.index), "Select option height must flow through shared Frame option roles instead of local control-size calculations.");
  }
  if (!text.includes(".select-control[data-state=\"loading\"] .select-control__trigger")) {
    add("errors", packageCssFile, 1, "Select loading state must expose a distinct trigger surface.");
  }
  if (!text.includes(".select-control[data-state=\"loading\"] .select-control__icon")) {
    add("errors", packageCssFile, 1, "Select loading state must animate the loading icon through component motion aliases.");
  }
  if (!text.includes(".select-control__option[data-selected=\"true\"] .select-control__option-check")) {
    add("errors", packageCssFile, 1, "Select selected options must expose a trailing check affordance.");
  }
  if (!text.includes(".select-control__option[data-active=\"true\"]:not([data-selected=\"true\"])")) {
    add("errors", packageCssFile, 1, "Select active option state must be visually separate from selected state.");
  }
  if (!text.includes("outline: var(--component-focus-ring-width) solid var(--comp-select-option-active-ring)")) {
    add("errors", packageCssFile, 1, "Select active/keyboard option ring must consume the shared option active ring role.");
  }
  if (
    !text.includes(".select-control__option[data-disabled=\"true\"") ||
    !text.includes("background: var(--comp-select-option-disabled-bg)") ||
    !text.includes("color: var(--comp-select-option-disabled-color)") ||
    !text.includes("opacity: var(--comp-select-option-disabled-opacity)")
  ) {
    add("errors", packageCssFile, 1, "Select disabled options must expose a distinct shared disabled option affordance.");
  }
  if (!text.includes("--component-option-row-disabled-opacity: var(--component-opacity-visible)")) {
    add("errors", packageCssFile, 1, "Shared option-row disabled state must remain legible; do not dim listbox options through opacity-only affordances.");
  }
  if (!text.includes("--component-option-row-disabled-bg: var(--component-surface-transparent)")) {
    add("errors", packageCssFile, 1, "Shared option-row disabled state must not use a filled row surface that competes with selected options.");
  }
  if (!text.includes(".select-control__option {\n  grid-template-columns: minmax(0, 1fr) auto auto;")) {
    add("errors", packageCssFile, 1, "Select options must reserve trailing columns for metadata and selected check geometry.");
  }
  requireIncludes({
    block: inlineListboxBlock,
    text,
    packageCssFile,
    snippets: [
      "inline-size: var(--comp-select-inline-listbox-inline)",
      "inset-inline-end: auto",
      "min-inline-size: var(--comp-select-inline-listbox-min-inline)",
    ],
    message: "Select inline listbox must stay readable through governed inline-listbox sizing instead of inheriting the compact trigger width.",
  });
  const inlineRootBlock = blockFor(blocks, selectorKey, ".select-control--inline,.country-selector.select-control--inline,.phone-input__country");
  requireIncludes({
    block: inlineRootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-option-min-size: var(--comp-select-option-min-size-sm)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-sm)",
      "--comp-select-option-check-size: var(--comp-select-option-check-size-sm)",
    ],
    message: "Select inline must use compact option-row geometry so the menu remains proportional to the inline trigger.",
  });
  if (!source.includes("useState<number | null>(null)") || (!source.includes("const isActive = resolvedActiveIndex !== null && index === resolvedActiveIndex") && !source.includes("const isActive = activeOption === option"))) {
    add("errors", sourceFile, 1, "Select must not preactivate the first option; active option state is created by explicit keyboard/navigation intent.");
  }
  if (source.includes(": selectedOption ? `${selectId}-option-${selectedIndex}` : undefined")) {
    add("errors", sourceFile, 1, "Select aria-activedescendant must not point at selected/default options while the listbox is closed.");
  }
  if (!source.includes("\"aria-activedescendant\": isOpen && activeOption && resolvedActiveIndex !== null") && !source.includes("\"aria-activedescendant\": isOpen && activeOption ?")) {
    add("errors", sourceFile, 1, "Select aria-activedescendant must only be emitted for an open listbox with an explicit active option.");
  }
  const smDensityBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-density=\"sm\"]");
  requireIncludes({
    block: smDensityBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-font-size: var(--comp-select-font-size-sm)",
      "--comp-select-padding-start: var(--comp-select-padding-start-sm)",
      "--comp-select-padding-end: var(--comp-select-padding-end-sm)",
      "--comp-select-option-min-size: var(--comp-select-option-min-size-sm)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-sm)",
      "--comp-select-option-check-size: var(--comp-select-option-check-size-sm)",
      "--comp-select-option-label-font-size: var(--comp-select-option-label-font-size-sm)",
      "--comp-select-option-meta-font-size: var(--comp-select-option-meta-font-size-sm)",
    ],
    message: "Select small density must scale option pill geometry and voice through Select density aliases.",
  });
  const lgDensityBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-density=\"lg\"]");
  requireIncludes({
    block: lgDensityBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-font-size: var(--comp-select-font-size-lg)",
      "--comp-select-padding-start: var(--comp-select-padding-start-lg)",
      "--comp-select-padding-end: var(--comp-select-padding-end-lg)",
      "--comp-select-option-min-size: var(--comp-select-option-min-size-lg)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-lg)",
      "--comp-select-option-check-size: var(--comp-select-option-check-size-lg)",
      "--comp-select-option-label-font-size: var(--comp-select-option-label-font-size-lg)",
      "--comp-select-option-meta-font-size: var(--comp-select-option-meta-font-size-lg)",
    ],
    message: "Select large density must scale option pill geometry and voice through Select density aliases.",
  });
}

module.exports = { checkSelectCssContract };
