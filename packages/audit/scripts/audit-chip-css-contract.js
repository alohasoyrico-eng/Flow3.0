const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkChipCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const chipBlock = blockFor(blocks, selectorKey, ".chip");
  const smBlock = blockFor(blocks, selectorKey, ".chip[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".chip[data-density=\"lg\"]");
  const buttonChipBlock = blockFor(blocks, selectorKey, "button.chip");
  const hoverButtonBlock = blockFor(blocks, selectorKey, "button.chip:hover:not(:disabled)");
  const hoverStateBlock = blockFor(blocks, selectorKey, ".chip[data-state=\"hover\"]");
  const focusBlock = blockFor(blocks, selectorKey, "button.chip:focus-visible,.chip[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, "button.chip:disabled,.chip[data-state=\"disabled\"],.chip[aria-disabled=\"true\"]");
  const removableBlock = blockFor(blocks, selectorKey, ".chip[data-chip-remove=\"true\"]");
  const removableInteractiveBlock = blockFor(blocks, selectorKey, ".chip[data-chip-remove=\"true\"][data-interactive=\"true\"]");
  const actionBlock = blockFor(blocks, selectorKey, ".chip__action");
  const removeBlock = blockFor(blocks, selectorKey, ".chip__remove");
  const removeIconBlock = blockFor(blocks, selectorKey, ".chip__remove-icon");
  const localInteractiveSize = /--comp-chip-interactive-min-block-size:\s*var\(--component-control-min-size\)/.exec(text);
  if (localInteractiveSize) {
    add("errors", packageCssFile, lineNumber(text, localInteractiveSize.index), "Chip interactive size must consume inline trigger roles instead of the generic control min size.");
  }
  const removedVariantSelector = /\.chip\[data-variant="(?:suggestion|assist)"\]/.exec(text);
  if (removedVariantSelector) {
    add("errors", packageCssFile, lineNumber(text, removedVariantSelector.index), "Chip CSS must not restore decorative suggestion/assist variants.");
  }

  requireIncludes({
    block: chipBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chip-border-width: var(--component-border-width)",
      "--comp-chip-radius: var(--component-radius-pill)",
      "--comp-chip-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-chip-font-size-md: var(--component-density-helper-size-md)",
      "--comp-chip-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-chip-font-size: var(--comp-chip-font-size-md)",
      "--comp-chip-min-block-size-sm: var(--component-space-xl)",
      "--comp-chip-min-block-size-md: var(--component-badge-min-size)",
      "--comp-chip-min-block-size-lg: var(--component-control-frame-size-sm)",
      "--comp-chip-min-block-size: var(--comp-chip-min-block-size-md)",
      "--comp-chip-interactive-min-block-size-sm: var(--component-inline-trigger-min-block-size-sm)",
      "--comp-chip-interactive-min-block-size-md: var(--component-inline-trigger-min-block-size-md)",
      "--comp-chip-interactive-min-block-size-lg: var(--component-inline-trigger-min-block-size-lg)",
      "--comp-chip-interactive-min-block-size: var(--comp-chip-interactive-min-block-size-md)",
      "--comp-chip-content-padding-inline: calc(var(--component-space-lg) - var(--component-frame-space-micro))",
      "--comp-chip-padding-inline: var(--comp-chip-content-padding-inline)",
      "--comp-chip-removable-padding-inline-end: var(--component-space-sm)",
      "--comp-chip-action-padding-inline-start: var(--comp-chip-content-padding-inline)",
      "--comp-chip-action-padding-inline-end: var(--comp-chip-content-padding-inline)",
      "--comp-chip-remove-size-sm: calc(var(--component-inline-size-sm) - (var(--component-frame-space-micro) * 2))",
      "--comp-chip-remove-size-md: var(--component-badge-min-size)",
      "--comp-chip-remove-size-lg: calc(var(--component-badge-min-size) - (var(--component-frame-space-micro) * 2))",
      "--comp-chip-remove-size: var(--comp-chip-remove-size-md)",
      "--comp-chip-selected-bg: var(--component-color-surface-inverse)",
      "--comp-chip-selected-border: var(--component-color-surface-inverse)",
      "--comp-chip-selected-fg: var(--component-color-text-on-inverse)",
      "--comp-chip-hover-transform: scale(var(--component-scale-hover))",
      "--comp-chip-press-transform: scale(var(--component-scale-press))",
      "align-items: center",
      "border: var(--comp-chip-border-width) solid var(--comp-chip-border)",
      "border-radius: var(--comp-chip-radius)",
      "box-sizing: border-box",
      "display: inline-flex",
      "font-size: var(--comp-chip-font-size)",
      "line-height: var(--component-line-height-none)",
      "min-block-size: var(--comp-chip-min-block-size)",
      "white-space: nowrap",
    ],
    message: "Chip base must own and consume component aliases for frame, voice, spacing, and motion.",
  });
  requireIncludes({
    block: removableBlock,
    text,
    packageCssFile,
    snippets: [
      "gap: var(--component-space-0)",
      "min-block-size: var(--comp-chip-interactive-min-block-size)",
      "padding-inline: var(--comp-chip-action-padding-inline-start) var(--comp-chip-removable-padding-inline-end)",
    ],
    message: "Removable Chip root must behave as a container with tokenized spacing, not a single fused button.",
  });
  requireIncludes({
    block: removableInteractiveBlock,
    text,
    packageCssFile,
    snippets: ["padding-inline-start: var(--component-space-0)"],
    message: "Selectable removable Chip must let the internal action own leading control padding.",
  });
  requireIncludes({
    block: actionBlock,
    text,
    packageCssFile,
    snippets: [
      "appearance: none",
      "background: transparent",
      "border: var(--component-border-width-none)",
      "gap: var(--comp-chip-gap)",
      "min-block-size: var(--comp-chip-interactive-min-block-size)",
      "padding-block: var(--component-space-0)",
      "padding-inline-end: var(--comp-chip-action-padding-inline-end)",
      "padding-inline-start: var(--comp-chip-action-padding-inline-start)",
    ],
    message: "Removable Chip selectable action must be a native child button with tokenized frame reset.",
  });
  requireIncludes({
    block: removeBlock,
    text,
    packageCssFile,
    snippets: [
      "appearance: none",
      "background: transparent",
      "border: var(--component-border-width-none)",
      "inline-size: var(--comp-chip-remove-size)",
      "min-block-size: var(--comp-chip-interactive-min-block-size)",
    ],
    message: "Removable Chip close target must be a native child button with its own hit area.",
  });
  requireIncludes({
    block: removeIconBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--component-font-family-icon)",
      "font-size: var(--comp-chip-remove-icon-size)",
      "font-variation-settings: var(--component-icon-variation-outline-strong)",
    ],
    message: "Removable Chip close glyph must consume iconography aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chip-font-size: var(--comp-chip-font-size-sm)",
      "--comp-chip-min-block-size: var(--comp-chip-min-block-size-sm)",
      "--comp-chip-interactive-min-block-size: var(--comp-chip-interactive-min-block-size-sm)",
      "--comp-chip-remove-size: var(--comp-chip-remove-size-sm)",
      "--comp-chip-remove-icon-size: var(--component-density-icon-size-sm)",
    ],
    message: "Chip sm density must scale compact voice and frame through shared density aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chip-font-size: var(--comp-chip-font-size-lg)",
      "--comp-chip-min-block-size: var(--comp-chip-min-block-size-lg)",
      "--comp-chip-interactive-min-block-size: var(--comp-chip-interactive-min-block-size-lg)",
      "--comp-chip-remove-size: var(--comp-chip-remove-size-lg)",
      "--comp-chip-remove-icon-size: var(--component-density-icon-size-md)",
    ],
    message: "Chip lg density must scale compact voice and frame through shared density aliases.",
  });
  requireIncludes({
    block: buttonChipBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-chip-interactive-min-block-size)",
      "box-sizing: border-box",
      "min-block-size: var(--comp-chip-interactive-min-block-size)",
    ],
    message: "Interactive Chip block size must consume the Chip interaction alias as an exact border-box frame.",
  });
  for (const [block, message] of [
    [hoverButtonBlock, "Interactive Chip hover state must consume Chip aliases."],
    [hoverStateBlock, "Chip hover data-state must consume Chip aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: ["box-shadow: var(--comp-chip-hover-shadow)", "transform: var(--comp-chip-hover-transform)"],
      message,
    });
  }
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-chip-focus-width) solid var(--comp-chip-focus-color)", "outline-offset: var(--comp-chip-focus-offset)"],
    message: "Chip focus ring must consume Chip accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["opacity: var(--comp-chip-disabled-opacity)"],
    message: "Chip disabled state must consume Chip aliases.",
  });
  if (chipBlock?.body.includes("var(--sys-momentum-scale")) {
    add("errors", packageCssFile, lineNumber(text, chipBlock.index), "Chip motion must go through component-scale aliases instead of sys momentum directly.");
  }
}

module.exports = { checkChipCssContract };
