const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkTextAreaCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const tokenBlock = blocks.find((block) => block.body.includes("--comp-text-area-min-block:"));
  const textAreaBlock = blocks.find((block) => selectorKey(block) === ".text-area" && block.body.includes("--comp-text-area-bg"));
  const counterPaddingBlock = blockFor(blocks, selectorKey, ".text-area__surface[data-has-counter=\"true\"] .text-area");
  const focusBlock = blockFor(blocks, selectorKey, ".text-area:focus-visible,.field[data-state=\"focus\"] .text-area");
  const errorBlock = blockFor(blocks, selectorKey, ".field[data-state=\"error\"] .text-area");
  const mutedBlock = blockFor(blocks, selectorKey, ".field[data-state=\"disabled\"] .text-area,.field[data-state=\"loading\"] .text-area");
  const counterBlock = blockFor(blocks, selectorKey, ".text-area__counter");
  const counterErrorBlock = blockFor(blocks, selectorKey, ".field[data-state=\"error\"] .text-area__counter");

  requireIncludes({
    block: tokenBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-text-area-min-block: var(--component-textarea-min-block)",
      "--comp-text-area-padding-block: var(--component-space-md)",
      "--comp-text-area-padding-inline: var(--component-space-lg)",
      "--comp-text-area-radius: var(--component-radius-control)",
      "--comp-text-area-font-size: var(--component-font-size-label)",
      "--comp-text-area-line-height: var(--component-line-height-relaxed)",
      "--comp-text-area-counter-family: var(--component-font-family-mono)",
      "--comp-text-area-motion-duration: var(--component-duration-state)",
    ],
    message: "TextArea aliases must derive size, voice, counter, radius, and motion from Flow component tokens.",
  });
  requireIncludes({
    block: textAreaBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-text-area-bg)",
      "border: var(--component-border-width) solid var(--comp-text-area-border)",
      "border-radius: var(--comp-text-area-radius)",
      "min-block-size: var(--comp-text-area-min-block)",
      "padding: var(--comp-text-area-padding-block) var(--comp-text-area-padding-inline)",
    ],
    message: "TextArea surface must consume component-scoped aliases rather than local field geometry.",
  });
  requireIncludes({
    block: counterPaddingBlock,
    text,
    packageCssFile,
    snippets: ["padding-block-end: var(--comp-text-area-counter-padding-block-end)"],
    message: "TextArea counter spacing must consume its component alias.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "border-color: var(--comp-text-area-border-focus)",
      "outline: var(--comp-text-area-focus-width) solid var(--comp-text-area-focus-color)",
      "outline-offset: var(--comp-text-area-focus-offset)",
    ],
    message: "TextArea focus must consume component focus aliases.",
  });
  requireIncludes({
    block: errorBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-text-area-bg-error)", "border-color: var(--comp-text-area-border-error)"],
    message: "TextArea error state must consume component error aliases.",
  });
  requireIncludes({
    block: mutedBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-text-area-bg-muted)"],
    message: "TextArea disabled/loading state must consume component muted aliases.",
  });
  requireIncludes({
    block: counterBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-text-area-counter-fg)",
      "font-family: var(--comp-text-area-counter-family)",
      "font-size: var(--comp-text-area-counter-size)",
      "inset-block-end: var(--comp-text-area-counter-inset-block)",
    ],
    message: "TextArea counter must consume component counter aliases.",
  });
  requireIncludes({
    block: counterErrorBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-text-area-counter-error-fg)"],
    message: "TextArea error counter must consume component error alias.",
  });

  const rawTextAreaGeometry = text.match(/--comp-text-area-(?:min-block|padding-[^:]+):\s*(?:[0-9.]+px|[0-9.]+rem)/);
  if (rawTextAreaGeometry) {
    add("errors", packageCssFile, lineNumber(text, rawTextAreaGeometry.index), "TextArea geometry aliases must flow through Flow component tokens instead of raw lengths.");
  }
}

module.exports = { checkTextAreaCssContract };
