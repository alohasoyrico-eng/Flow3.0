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
      "--comp-tag-radius: var(--sys-frame-radius-sm)",
      "--comp-tag-font-size: var(--component-font-size-label)",
      "--comp-tag-interactive-min-block-size: var(--component-inline-trigger-min-block-size-md)",
      "--comp-tag-hover-transform: scale(var(--component-scale-hover))",
      "--comp-tag-press-transform: scale(var(--component-scale-press))",
      "border: var(--comp-tag-border-width) solid var(--comp-tag-border)",
      "border-radius: var(--comp-tag-radius)",
      "font-size: var(--comp-tag-font-size)",
      "min-block-size: var(--comp-tag-min-block-size)",
      "padding: 0 var(--comp-tag-padding-inline)",
    ],
    message: "Tag base must own and consume component aliases for frame, voice, spacing, and motion.",
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
