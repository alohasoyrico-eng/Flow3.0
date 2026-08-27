const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkTextAreaCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const tokenBlock = blocks.find((block) => block.body.includes("--comp-text-area-min-block-md:")) ?? { body: text, index: 0 };
  const surfaceBlock = blocks.find((block) => selectorKey(block) === ".text-area__surface" && block.body.includes("--comp-text-area-bg"));
  const textAreaBlock = blocks.find((block) => selectorKey(block) === ".text-area" && block.body.includes("background: var(--component-surface-transparent)"));
  const densitySmBlock = blockFor(blocks, selectorKey, ".field[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".field[data-density=\"lg\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".text-area__surface:focus-within,.field[data-state=\"focus\"] .text-area__surface");
  const errorBlock = blockFor(blocks, selectorKey, ".field[data-state=\"error\"] .text-area__surface");
  const mutedBlock = blockFor(blocks, selectorKey, ".field[data-state=\"disabled\"] .text-area__surface");
  const loadingBlock = blockFor(blocks, selectorKey, ".field[data-state=\"loading\"] .text-area__surface");
  const counterBlock = blockFor(blocks, selectorKey, ".text-area__counter");
  const counterErrorBlock = blockFor(blocks, selectorKey, ".field[data-state=\"error\"] .text-area__counter");

  requireIncludes({
    block: tokenBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-text-area-min-block-sm: calc(var(--component-control-frame-size-sm) * 2)",
      "--comp-text-area-min-block-md: var(--component-textarea-min-block)",
      "--comp-text-area-min-block-lg: calc(var(--component-textarea-min-block) + var(--component-control-frame-size-sm))",
      "--comp-text-area-current-min-block: var(--comp-text-area-min-block-md)",
      "--comp-text-area-current-padding-block: var(--comp-text-area-padding-block-md)",
      "--comp-text-area-current-padding-inline: var(--comp-text-area-padding-inline-md)",
      "--comp-text-area-bg-success:",
      "--comp-text-area-bg-warning:",
      "--comp-text-area-border-success:",
      "--comp-text-area-border-warning:",
      "--comp-text-area-radius: var(--component-control-frame-radius-field)",
      "--comp-text-area-font-size: var(--component-font-size-label)",
      "--comp-text-area-line-height: var(--component-line-height-relaxed)",
      "--comp-text-area-counter-family: var(--component-font-family-mono)",
      "--comp-text-area-counter-size: var(--component-density-counter-size-md)",
      "--comp-text-area-counter-warning-fg:",
      "--comp-text-area-motion-duration: var(--component-duration-state)",
    ],
    message: "TextArea aliases must derive density, voice, counter, radius, and motion from Flow component tokens.",
  });
  requireIncludes({
    block: surfaceBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-text-area-radius: var(--component-control-frame-radius-field)",
      "background: var(--comp-text-area-bg)",
      "border: var(--component-border-width) solid var(--comp-text-area-border)",
      "border-radius: var(--comp-text-area-radius)",
      "box-sizing: border-box",
      "display: grid",
      "inline-size: 100%",
      "max-inline-size: 100%",
      "min-block-size: var(--comp-text-area-current-min-block)",
      "min-inline-size: 0",
      "padding: var(--comp-text-area-current-padding-block) var(--comp-text-area-current-padding-inline)",
      "position: relative",
    ],
    message: "TextArea surface shell must consume component-scoped density aliases and preserve bounded box geometry.",
  });
  requireIncludes({
    block: textAreaBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--component-surface-transparent)",
      "border: 0",
      "box-sizing: border-box",
      "inline-size: 100%",
      "max-inline-size: 100%",
      "min-inline-size: 0",
      "outline: var(--component-outline-none)",
      "padding: 0 0 var(--comp-text-area-counter-row-block)",
    ],
    message: "TextArea inner textarea must stay transparent so focus, border, and counter belong to the shell.",
  });
  requireIncludes({
    block: densitySmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-text-area-current-min-block: var(--comp-text-area-min-block-sm)",
      "--comp-text-area-current-padding-block: var(--comp-text-area-padding-block-sm)",
      "--comp-text-area-current-padding-inline: var(--comp-text-area-padding-inline-sm)",
      "--comp-text-area-font-size: var(--component-control-frame-font-size-sm)",
      "--comp-text-area-counter-size: var(--component-density-counter-size-sm)",
    ],
    message: "TextArea small density must change min-block, padding, and type through Flow aliases.",
  });
  requireIncludes({
    block: densityLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-text-area-current-min-block: var(--comp-text-area-min-block-lg)",
      "--comp-text-area-current-padding-block: var(--comp-text-area-padding-block-lg)",
      "--comp-text-area-current-padding-inline: var(--comp-text-area-padding-inline-lg)",
      "--comp-text-area-font-size: var(--component-control-frame-font-size-lg)",
      "--comp-text-area-counter-size: var(--component-density-counter-size-lg)",
    ],
    message: "TextArea large density must change min-block, padding, and type through Flow aliases.",
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
    message: "TextArea disabled state must consume component muted aliases.",
  });
  requireIncludes({
    block: loadingBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-text-area-bg-loading)"],
    message: "TextArea loading state must consume component loading aliases instead of disabled aliases.",
  });
  requireIncludes({
    block: counterBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-text-area-counter-fg)",
      "font-family: var(--comp-text-area-counter-family)",
      "font-size: var(--comp-text-area-counter-size)",
      "inset-block-end: var(--comp-text-area-current-padding-block)",
      "inset-inline-start: var(--comp-text-area-current-padding-inline)",
      "position: absolute",
      "transition: color var(--comp-text-area-motion-duration) var(--comp-text-area-motion-ease)",
    ],
    message: "TextArea counter must be anchored inside the shell footer row, aligned with the native resize handle.",
  });
  requireIncludes({
    block: counterErrorBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-text-area-counter-error-fg)"],
    message: "TextArea error counter must consume component error alias.",
  });

  const innerFocusRing = text.match(/\.text-area:focus-visible\s*,\s*\.field\[data-state="focus"\]\s+\.text-area/s);
  if (innerFocusRing) {
    add("errors", packageCssFile, lineNumber(text, innerFocusRing.index), "TextArea focus ring must live on the shell so it contains the counter footer.");
  }

  const rawTextAreaGeometry = text.match(/--comp-text-area-(?:min-block|padding-[^:]+):\s*(?:[0-9.]+px|[0-9.]+rem)/);
  if (rawTextAreaGeometry) {
    add("errors", packageCssFile, lineNumber(text, rawTextAreaGeometry.index), "TextArea geometry aliases must flow through Flow component tokens instead of raw lengths.");
  }
}

module.exports = { checkTextAreaCssContract };
