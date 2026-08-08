const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkProgressIndicatorCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".progress");
  const smBlock = blockFor(blocks, selectorKey, ".progress[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".progress[data-density=\"lg\"]");
  const successBlock = blockFor(blocks, selectorKey, ".progress[data-tone=\"success\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".progress[data-state=\"disabled\"]");
  const metaBlock = blockFor(blocks, selectorKey, ".progress__meta");
  const labelBlock = blockFor(blocks, selectorKey, ".progress__label");
  const trackBlock = blockFor(blocks, selectorKey, ".progress__track");
  const meterBlock = blockFor(blocks, selectorKey, ".progress__meter");
  const webkitValueBlock = blockFor(blocks, selectorKey, ".progress__meter::-webkit-progress-value");
  const mozValueBlock = blockFor(blocks, selectorKey, ".progress__meter::-moz-progress-bar");
  const indeterminateBlock = blockFor(blocks, selectorKey, ".progress[data-indeterminate=\"true\"] .progress__meter");
  const valueBlock = blockFor(blocks, selectorKey, ".progress__value");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-progress-indicator-tone: var(--component-loading-progress-fill)",
      "--comp-progress-indicator-motion-ease: var(--component-ease-move)",
      "--comp-progress-indicator-track-border-width: var(--component-border-width)",
      "--comp-progress-indicator-min-inline-size: var(--component-progress-indicator-min-inline-size)",
      "--comp-progress-indicator-max-inline-size: var(--component-progress-indicator-max-inline-size)",
      "--comp-progress-indicator-value-font-family: var(--component-font-family-mono)",
      "color: var(--comp-progress-indicator-text-color)",
      "gap: var(--comp-progress-indicator-gap)",
    ],
    message: "Progress Indicator root must own loading, frame, voice, density, state, and motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: ["--comp-progress-indicator-track-size: var(--sys-space-xs)"],
    message: "Progress Indicator sm density must scale through Progress aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: ["--comp-progress-indicator-track-size: var(--sys-space-md)"],
    message: "Progress Indicator lg density must scale through Progress aliases.",
  });
  requireIncludes({
    block: successBlock,
    text,
    packageCssFile,
    snippets: ["--comp-progress-indicator-tone: var(--sys-color-success)"],
    message: "Progress Indicator success tone must resolve through its tone alias.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-progress-indicator-disabled-color)", "opacity: var(--comp-progress-indicator-disabled-opacity)"],
    message: "Progress Indicator disabled state must consume Progress disabled aliases.",
  });
  requireIncludes({
    block: metaBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-progress-indicator-meta-gap)"],
    message: "Progress Indicator meta rhythm must consume Progress meta alias.",
  });
  requireIncludes({
    block: labelBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-progress-indicator-text-color)", "font-weight: var(--comp-progress-indicator-label-font-weight)"],
    message: "Progress Indicator label must consume Progress voice aliases.",
  });
  requireIncludes({
    block: trackBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-progress-indicator-track-bg)",
      "border: var(--comp-progress-indicator-track-border-width) solid var(--comp-progress-indicator-track-border)",
      "box-shadow: var(--comp-progress-indicator-track-depth)",
    ],
    message: "Progress Indicator track must consume Progress frame and depth aliases.",
  });
  requireIncludes({
    block: meterBlock,
    text,
    packageCssFile,
    snippets: ["block-size: 100%", "inline-size: 100%"],
    message: "Progress Indicator meter must fill the component-owned track.",
  });
  requireIncludes({
    block: webkitValueBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-progress-indicator-tone)",
      "inline-size var(--comp-progress-indicator-motion-duration) var(--comp-progress-indicator-motion-ease)",
      "background-color var(--comp-progress-indicator-state-duration) var(--comp-progress-indicator-state-ease)",
    ],
    message: "Progress Indicator webkit value must consume Progress tone and motion aliases.",
  });
  requireIncludes({
    block: mozValueBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-progress-indicator-tone)",
      "inline-size var(--comp-progress-indicator-motion-duration) var(--comp-progress-indicator-motion-ease)",
    ],
    message: "Progress Indicator moz value must consume Progress tone and motion aliases.",
  });
  requireIncludes({
    block: indeterminateBlock,
    text,
    packageCssFile,
    snippets: ["animation: progress-indeterminate var(--comp-progress-indicator-indeterminate-duration) var(--comp-progress-indicator-indeterminate-ease) infinite"],
    message: "Progress Indicator indeterminate state must consume Progress loading motion aliases.",
  });
  requireIncludes({
    block: valueBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-progress-indicator-value-color)", "font-family: var(--comp-progress-indicator-value-font-family)"],
    message: "Progress Indicator value must consume Progress value voice aliases.",
  });

  if (/--comp-progress-indicator-(?:min|max)-inline-size:\s*var\(--sys-frame-content-/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.search(/--comp-progress-indicator-(?:min|max)-inline-size:\s*var\(--sys-frame-content-/)), "Progress Indicator content width must route through component-owned aliases, not sys frame content directly.");
  }
}

module.exports = { checkProgressIndicatorCssContract };
