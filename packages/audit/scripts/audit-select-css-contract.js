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

  requireIncludes({
    block: selectBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-padding-end: calc(var(--component-space-lg) - var(--component-frame-space-micro))",
      "--comp-select-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-select-listbox-padding: var(--component-listbox-padding)",
      "--comp-select-listbox-radius: var(--component-listbox-radius)",
      "--comp-select-listbox-depth: var(--component-listbox-depth)",
      "--comp-select-option-min-size-sm: var(--component-option-row-min-block-size-sm)",
      "--comp-select-option-min-size-md: var(--component-option-row-min-block-size-md)",
      "--comp-select-option-min-size-lg: var(--component-option-row-min-block-size-lg)",
      "--comp-select-option-min-size: var(--comp-select-option-min-size-md)",
      "--comp-select-option-padding-x-sm: var(--component-option-row-padding-inline-sm)",
      "--comp-select-option-padding-x-md: var(--component-option-row-padding-inline-md)",
      "--comp-select-option-padding-x-lg: var(--component-option-row-padding-inline-lg)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-md)",
      "--comp-select-option-radius: var(--component-option-row-radius)",
      "--comp-select-option-active-ring: var(--component-option-row-active-ring)",
      "--comp-select-option-disabled-bg: var(--component-option-row-disabled-bg)",
      "--comp-select-option-disabled-color: var(--component-option-row-disabled-color)",
      "--comp-select-option-disabled-opacity: var(--component-option-row-disabled-opacity)",
      "--comp-select-loading-bg: color-mix(in srgb, var(--component-color-action) 7%, var(--component-color-surface))",
      "--comp-select-option-check-size: var(--component-option-row-check-size)",
      "--comp-select-option-check-hidden-opacity: var(--component-opacity-hidden)",
    ],
    message: "Select frame offsets and option/listbox geometry must consume shared component option/listbox roles.",
  });
  if (/--comp-select[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Select component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
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
  if (!text.includes(".select-control__option[data-disabled=\"true\"") || !text.includes("opacity: var(--comp-select-option-disabled-opacity)")) {
    add("errors", packageCssFile, 1, "Select disabled options must expose a distinct shared disabled option affordance.");
  }
  if (!text.includes(".select-control__option {\n  grid-template-columns: minmax(0, 1fr) auto auto;")) {
    add("errors", packageCssFile, 1, "Select options must reserve trailing columns for metadata and selected check geometry.");
  }
  if (!source.includes("useState<number | null>(null)") || !source.includes("const isActive = resolvedActiveIndex !== null && index === resolvedActiveIndex")) {
    add("errors", sourceFile, 1, "Select must not preactivate the first option; active option state is created by explicit keyboard/navigation intent.");
  }
  if (source.includes(": selectedOption ? `${selectId}-option-${selectedIndex}` : undefined")) {
    add("errors", sourceFile, 1, "Select aria-activedescendant must not point at selected/default options while the listbox is closed.");
  }
  if (!source.includes("\"aria-activedescendant\": isOpen && activeOption && resolvedActiveIndex !== null")) {
    add("errors", sourceFile, 1, "Select aria-activedescendant must only be emitted for an open listbox with an explicit active option.");
  }
  const smDensityBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-density=\"sm\"]");
  requireIncludes({
    block: smDensityBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-option-min-size: var(--comp-select-option-min-size-sm)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-sm)",
    ],
    message: "Select small density must scale option pill geometry through Select density aliases.",
  });
  const lgDensityBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-density=\"lg\"]");
  requireIncludes({
    block: lgDensityBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-select-option-min-size: var(--comp-select-option-min-size-lg)",
      "--comp-select-option-padding-x: var(--comp-select-option-padding-x-lg)",
    ],
    message: "Select large density must scale option pill geometry through Select density aliases.",
  });
}

module.exports = { checkSelectCssContract };
