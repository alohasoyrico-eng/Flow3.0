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
  const delegatesToSelect = source.includes("React.createElement(Select") && source.includes("searchable: true");
  const fieldControlBlock = blockFor(blocks, selectorKey, ".field-control__surface,.field__control");
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

  if (!text.includes(".combobox__chevron,") || !text.includes(".combobox__option-check,") || !text.includes("font-feature-settings: \"liga\"")) {
    add("errors", packageCssFile, 1, "Combobox chevron and selected-check glyphs must consume the shared Material Symbols ligature recipe, not only font-family.");
  }
  requireIncludes({
    block: fieldControlBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-field-control-size)",
      "min-block-size: var(--comp-field-control-size)",
      "box-sizing: border-box",
      "border-radius: var(--component-control-frame-radius-field)",
    ],
    message: "Combobox input frame must inherit the shared Field ControlFrame geometry through .field__control.",
  });
  requireIncludes({
    block: comboboxBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-combobox-chevron-size: calc(var(--component-font-size-title-md) + var(--component-frame-space-micro))",
      "--comp-combobox-chevron-family: var(--component-font-family-icon)",
      "--comp-combobox-chevron-weight: var(--component-font-weight-regular)",
      "--comp-combobox-chevron-line-height: var(--component-line-height-none)",
      "--comp-combobox-chevron-motion-duration: var(--component-duration-state)",
      "--comp-combobox-overlay-motion-duration: var(--component-duration-state)",
      "--comp-combobox-overlay-visibility-duration: var(--component-duration-instant)",
      "--comp-combobox-listbox-bg: var(--component-listbox-bg)",
      "--comp-combobox-listbox-padding: var(--component-listbox-padding)",
      "--comp-combobox-listbox-radius: var(--component-listbox-radius)",
      "--comp-combobox-listbox-offset: var(--component-listbox-offset)",
      "--comp-combobox-loading-font-size: var(--component-density-helper-size-md)",
      "--comp-combobox-loading-padding-inline: var(--component-option-row-padding-inline-sm)",
      "--comp-combobox-empty-font-size: var(--component-density-helper-size-md)",
      "--comp-combobox-empty-padding-inline: var(--component-option-row-padding-inline-sm)",
      "--comp-combobox-option-min-size-sm: var(--component-option-row-min-block-size-sm)",
      "--comp-combobox-option-min-size-md: var(--component-option-row-min-block-size-md)",
      "--comp-combobox-option-min-size-lg: var(--component-option-row-min-block-size-lg)",
      "--comp-combobox-option-min-size: var(--comp-combobox-option-min-size-md)",
      "--comp-combobox-option-padding-x-sm: var(--component-option-row-padding-inline-sm)",
      "--comp-combobox-option-padding-x-md: var(--component-option-row-padding-inline-md)",
      "--comp-combobox-option-padding-x-lg: var(--component-option-row-padding-inline-lg)",
      "--comp-combobox-option-padding-x: var(--comp-combobox-option-padding-x-md)",
      "--comp-combobox-option-label-font-size-sm: var(--component-density-label-size-sm)",
      "--comp-combobox-option-label-font-size-md: var(--component-density-label-size-md)",
      "--comp-combobox-option-label-font-size-lg: var(--component-density-label-size-lg)",
      "--comp-combobox-option-label-font-size: var(--comp-combobox-option-label-font-size-md)",
      "--comp-combobox-option-meta-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-combobox-option-meta-font-size-md: var(--component-density-helper-size-md)",
      "--comp-combobox-option-meta-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-combobox-option-meta-font-size: var(--comp-combobox-option-meta-font-size-md)",
      "--comp-combobox-option-color: var(--component-option-row-color)",
      "--comp-combobox-option-active-ring: var(--component-option-row-active-ring)",
      "--comp-combobox-option-selected-bg: var(--component-option-row-selected-bg)",
      "--comp-combobox-option-selected-color: var(--component-option-row-selected-color)",
      "--comp-combobox-option-disabled-bg: var(--component-option-row-disabled-bg)",
      "--comp-combobox-option-disabled-color: var(--component-option-row-disabled-color)",
      "--comp-combobox-option-disabled-opacity: var(--component-option-row-disabled-opacity)",
      "--comp-combobox-option-check-family: var(--component-font-family-icon)",
      "--comp-combobox-option-check-size-sm: var(--component-option-row-check-size-sm)",
      "--comp-combobox-option-check-size-md: var(--component-option-row-check-size-md)",
      "--comp-combobox-option-check-size-lg: var(--component-option-row-check-size-lg)",
      "--comp-combobox-option-check-size: var(--comp-combobox-option-check-size-md)",
      "--comp-combobox-option-check-hidden-opacity: var(--component-opacity-hidden)",
      "--comp-combobox-option-check-visible-opacity: var(--component-opacity-visible)",
      "--comp-select-chevron-color: var(--comp-combobox-chevron-color)",
      "--comp-select-chevron-family: var(--comp-combobox-chevron-family)",
      "--comp-select-chevron-size: var(--comp-combobox-chevron-size)",
      "--comp-select-chevron-weight: var(--comp-combobox-chevron-weight)",
      "--comp-select-chevron-line-height: var(--comp-combobox-chevron-line-height)",
    ],
    message: "Combobox aliases must derive chevron, overlay, listbox, option, loading, and empty-state roles from Flow component tokens.",
  });
  requireIncludes({
    block: chevronBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-combobox-chevron-color)",
      "font-family: var(--comp-combobox-chevron-family)",
      "font-size: var(--comp-combobox-chevron-size)",
      "font-weight: var(--comp-combobox-chevron-weight)",
      "line-height: var(--comp-combobox-chevron-line-height)",
      "transform var(--comp-combobox-chevron-motion-duration) var(--comp-combobox-chevron-motion-ease)",
    ],
    message: "Combobox chevron must consume component iconography, color, and motion aliases.",
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
      "box-sizing: border-box",
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
      "box-sizing: border-box",
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
  if (
    !text.includes(".combobox__option[data-disabled=\"true\"") ||
    !text.includes("background: var(--comp-combobox-option-disabled-bg)") ||
    !text.includes("color: var(--comp-combobox-option-disabled-color)") ||
    !text.includes("opacity: var(--comp-combobox-option-disabled-opacity)")
  ) {
    add("errors", packageCssFile, 1, "Combobox disabled options must expose a distinct shared disabled option affordance.");
  }
  if (!text.includes("--component-option-row-disabled-opacity: var(--component-opacity-visible)")) {
    add("errors", packageCssFile, 1, "Shared option-row disabled state must remain legible; do not dim listbox options through opacity-only affordances.");
  }
  if (!delegatesToSelect) {
    if (!source.includes("useState<number | null>(null)") || !source.includes("const isActive = activeOption === option") || !source.includes("\"data-active\": String(isActive)")) {
      add("errors", sourceFile, 1, "Combobox must not preactivate the first option; active option state is created by explicit keyboard/navigation intent.");
    }
    if (!source.includes("\"aria-activedescendant\": isOpen && activeOption && activeIndex !== null")) {
      add("errors", sourceFile, 1, "Combobox aria-activedescendant must only be emitted for an open listbox with an explicit active option.");
    }
    if (!source.includes("document.addEventListener(\"mousedown\", handleDocumentMouseDown)") || !source.includes("rootRef.current?.contains(target)")) {
      add("errors", sourceFile, 1, "Combobox must close on document mousedown outside its root while preserving inside option clicks.");
    }
    if (!source.includes("event.key === \"Tab\"") || !source.includes("setOpen(false, event)")) {
      add("errors", sourceFile, 1, "Combobox must close its open listbox on Tab without trapping keyboard focus.");
    }
    if (!source.includes("isShowingSelectedValue") || !source.includes("const query = isShowingSelectedValue ? \"\"")) {
      add("errors", sourceFile, 1, "Combobox must not collapse its option list to the selected label when opening an existing value for keyboard navigation.");
    }
    if (!source.includes("selectedEnabledIndex") || !source.includes("selectedEnabledIndex + 1") || !source.includes("selectedEnabledIndex - 1")) {
      add("errors", sourceFile, 1, "Combobox ArrowUp/ArrowDown must navigate from the selected option when an existing value is open.");
    }
    if (!source.includes("event.preventDefault();") || !source.includes("commitOption(option, event);")) {
      add("errors", sourceFile, 1, "Combobox option clicks must prevent label reactivation before committing so selection closes the listbox.");
    }
    if (!source.includes("inputRef.current?.focus()") || !source.includes("assignInputRef(ref, node)")) {
      add("errors", sourceFile, 1, "Combobox clear action must return focus to the input so keyboard navigation keeps working after clearing.");
    }
    if (!source.includes("className: \"field__control combobox\"")) {
      add("errors", sourceFile, 1, "Combobox must compose the shared Field control surface instead of defining a local input frame.");
    }
  }

  const smDensityBlock = blockFor(blocks, selectorKey, ".combobox[data-density=\"sm\"]");
  requireIncludes({
    block: smDensityBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-combobox-option-min-size: var(--comp-combobox-option-min-size-sm)",
      "--comp-combobox-option-padding-x: var(--comp-combobox-option-padding-x-sm)",
      "--comp-combobox-option-check-size: var(--comp-combobox-option-check-size-sm)",
      "--comp-combobox-option-label-font-size: var(--comp-combobox-option-label-font-size-sm)",
      "--comp-combobox-option-meta-font-size: var(--comp-combobox-option-meta-font-size-sm)",
      "--comp-combobox-loading-font-size: var(--component-density-helper-size-sm)",
      "--comp-combobox-empty-font-size: var(--component-density-helper-size-sm)",
    ],
    message: "Combobox small density must scale option pill geometry and voice through Combobox density aliases.",
  });
  const lgDensityBlock = blockFor(blocks, selectorKey, ".combobox[data-density=\"lg\"]");
  requireIncludes({
    block: lgDensityBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-combobox-option-min-size: var(--comp-combobox-option-min-size-lg)",
      "--comp-combobox-option-padding-x: var(--comp-combobox-option-padding-x-lg)",
      "--comp-combobox-option-check-size: var(--comp-combobox-option-check-size-lg)",
      "--comp-combobox-option-label-font-size: var(--comp-combobox-option-label-font-size-lg)",
      "--comp-combobox-option-meta-font-size: var(--comp-combobox-option-meta-font-size-lg)",
      "--comp-combobox-loading-font-size: var(--component-density-helper-size-lg)",
      "--comp-combobox-empty-font-size: var(--component-density-helper-size-lg)",
    ],
    message: "Combobox large density must scale option pill geometry and voice through Combobox density aliases.",
  });

  if (/--comp-combobox[^:]*:\s*calc\([^;]*(?:2px|0\.125rem)/.test(text)) {
    add("errors", packageCssFile, 1, "Combobox component aliases must not hardcode 2px or 0.125rem frame offsets.");
  }
}

module.exports = { checkComboboxCssContract };
