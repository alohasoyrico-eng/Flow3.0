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
  const buttonChipBlock = blockFor(blocks, selectorKey, "button.chip");
  const hoverButtonBlock = blockFor(blocks, selectorKey, "button.chip:hover:not(:disabled)");
  const hoverStateBlock = blockFor(blocks, selectorKey, ".chip[data-state=\"hover\"]");
  const focusBlock = blockFor(blocks, selectorKey, "button.chip:focus-visible,.chip[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, "button.chip:disabled,.chip[data-state=\"disabled\"]");

  requireIncludes({
    block: chipBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chip-border-width: var(--component-border-width)",
      "--comp-chip-radius: var(--component-radius-pill)",
      "--comp-chip-font-size: var(--component-font-size-label)",
      "--comp-chip-hover-transform: scale(var(--component-scale-hover))",
      "--comp-chip-press-transform: scale(var(--component-scale-press))",
      "border: var(--comp-chip-border-width) solid var(--comp-chip-border)",
      "border-radius: var(--comp-chip-radius)",
      "font-size: var(--comp-chip-font-size)",
      "min-block-size: var(--comp-chip-min-block-size)",
    ],
    message: "Chip base must own and consume component aliases for frame, voice, spacing, and motion.",
  });
  requireIncludes({
    block: buttonChipBlock,
    text,
    packageCssFile,
    snippets: ["min-block-size: var(--comp-chip-interactive-min-block-size)"],
    message: "Interactive Chip block size must consume the Chip interaction alias.",
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
