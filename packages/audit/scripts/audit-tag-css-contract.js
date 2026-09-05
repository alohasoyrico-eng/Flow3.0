const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkTagCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const tagBlock = blockFor(blocks, selectorKey, ".tag");
  const smBlock = blockFor(blocks, selectorKey, ".tag[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".tag[data-density=\"lg\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".tag__icon");
  const buttonTagBlock = blockFor(blocks, selectorKey, "button.tag");
  const hoverBlock = blockFor(blocks, selectorKey, "button.tag:hover:not(:disabled),.tag[data-state=\"hover\"][data-interactive=\"true\"]");
  const focusBlock = blockFor(blocks, selectorKey, "button.tag:focus-visible,.tag[data-state=\"focus\"][data-interactive=\"true\"]");
  const disabledBlock = blockFor(blocks, selectorKey, "button.tag:disabled,.tag[data-state=\"disabled\"]");
  const localInteractiveSize = /--comp-tag-interactive-min-block-size:\s*var\(--component-control-min-size\)/.exec(text);
  if (localInteractiveSize) {
    add("errors", packageCssFile, lineNumber(text, localInteractiveSize.index), "Tag interactive size must consume inline trigger roles instead of the generic control min size.");
  }

  requireIncludes({
    block: tagBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tag-border-width: var(--component-border-width)",
      "--comp-tag-radius: var(--component-radius-pill)",
      "--comp-tag-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-tag-font-size-md: var(--component-density-helper-size-md)",
      "--comp-tag-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-tag-font-size: var(--comp-tag-font-size-md)",
      "--comp-tag-min-block-size-sm: var(--component-space-xl)",
      "--comp-tag-min-block-size-md: var(--component-badge-min-size)",
      "--comp-tag-min-block-size-lg: var(--component-control-frame-size-sm)",
      "--comp-tag-interactive-min-block-size-sm: var(--component-inline-trigger-min-block-size-sm)",
      "--comp-tag-interactive-min-block-size: var(--component-inline-trigger-min-block-size-md)",
      "--comp-tag-interactive-min-block-size-lg: var(--component-inline-trigger-min-block-size-lg)",
      "--comp-tag-padding-inline-sm: var(--component-space-sm)",
      "--comp-tag-padding-inline-md: var(--component-space-md)",
      "--comp-tag-padding-inline-lg: var(--component-space-lg)",
      "--comp-tag-icon-size-sm: var(--component-density-icon-size-xs)",
      "--comp-tag-icon-size-md: var(--component-density-icon-size-sm)",
      "--comp-tag-icon-size-lg: var(--component-density-icon-size-md)",
      "--comp-tag-hover-shadow: var(--component-depth-none)",
      "--comp-tag-hover-transform: scale(var(--component-scale-hover))",
      "--comp-tag-press-transform: scale(var(--component-scale-press))",
      "border: var(--comp-tag-border-width) solid var(--comp-tag-border)",
      "border-radius: var(--comp-tag-radius)",
      "display: inline-flex",
      "font-size: var(--comp-tag-font-size)",
      "min-block-size: var(--comp-tag-min-block-size)",
      "padding: 0 var(--comp-tag-padding-inline)",
    ],
    message: "Tag base must own and consume component aliases for frame, voice, spacing, and motion.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tag-font-size: var(--comp-tag-font-size-sm)",
      "--comp-tag-gap: var(--comp-tag-gap-sm)",
      "--comp-tag-icon-size: var(--comp-tag-icon-size-sm)",
      "--comp-tag-interactive-min-block-size: var(--comp-tag-interactive-min-block-size-sm)",
      "--comp-tag-min-block-size: var(--comp-tag-min-block-size-sm)",
      "--comp-tag-padding-inline: var(--comp-tag-padding-inline-sm)",
    ],
    message: "Tag sm density must scale compact voice, spacing, icon, and frame through shared density aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tag-font-size: var(--comp-tag-font-size-lg)",
      "--comp-tag-gap: var(--comp-tag-gap-lg)",
      "--comp-tag-icon-size: var(--comp-tag-icon-size-lg)",
      "--comp-tag-interactive-min-block-size: var(--comp-tag-interactive-min-block-size-lg)",
      "--comp-tag-min-block-size: var(--comp-tag-min-block-size-lg)",
      "--comp-tag-padding-inline: var(--comp-tag-padding-inline-lg)",
    ],
    message: "Tag lg density must scale compact voice, spacing, icon, and frame through shared density aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-tag-icon-size)", "line-height: var(--component-line-height-none)"],
    message: "Tag icon must consume the density-aware Tag icon alias without changing tag height.",
  });
  requireIncludes({
    block: buttonTagBlock,
    text,
    packageCssFile,
    snippets: ["min-block-size: var(--comp-tag-interactive-min-block-size)"],
    message: "Interactive Tag block size must consume the Tag interaction alias.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-tag-hover-border)", "box-shadow: var(--comp-tag-hover-shadow)", "transform: var(--comp-tag-hover-transform)"],
    message: "Interactive Tag hover state must consume Tag aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-tag-focus-width) solid var(--comp-tag-focus-color)", "outline-offset: var(--comp-tag-focus-offset)"],
    message: "Tag focus ring must consume Tag accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["opacity: var(--comp-tag-disabled-opacity)"],
    message: "Tag disabled state must consume Tag aliases.",
  });
  if (tagBlock?.body.includes("var(--sys-momentum-scale")) {
    add("errors", packageCssFile, lineNumber(text, tagBlock.index), "Tag motion must go through component-scale aliases instead of sys momentum directly.");
  }
}

module.exports = { checkTagCssContract };
