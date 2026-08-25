const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkBadgeCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const badgeBlock = blockFor(blocks, selectorKey, ".badge");
  const smBlock = blockFor(blocks, selectorKey, ".badge[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".badge[data-density=\"lg\"]");
  const hoverBlock = blockFor(blocks, selectorKey, ".badge[data-state=\"hover\"],.badge[data-state=\"focus\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".badge[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".badge[data-state=\"disabled\"]");
  const liveBlock = blockFor(blocks, selectorKey, ".badge[data-live=\"true\"] .badge__live");
  const liveKeyframes = text.match(/@keyframes\s+badge-live-dot\s*{[\s\S]*?\n}/)?.[0] ?? "";
  if (text.includes("--comp-badge-dot-size: var(--sys-frame-gap-element);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-badge-dot-size: var(--sys-frame-gap-element);")), "Badge dot size must consume --component-field-gap instead of reaching into frame gap directly.");
  }

  requireIncludes({
    block: badgeBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-badge-border-width: var(--component-border-width)",
      "--comp-badge-radius: var(--component-radius-pill)",
      "--comp-badge-dot-size: var(--component-field-gap)",
      "--comp-badge-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-badge-font-size-md: var(--component-density-helper-size-md)",
      "--comp-badge-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-badge-font-size: var(--comp-badge-font-size-md)",
      "--comp-badge-gap: var(--component-space-xs)",
      "--comp-badge-motion-duration: var(--component-duration-state)",
      "border: var(--comp-badge-border-width) solid var(--comp-badge-border)",
      "font-size: var(--comp-badge-font-size)",
      "gap: var(--comp-badge-gap)",
      "transform var(--comp-badge-motion-duration) var(--comp-badge-motion-press-ease)",
    ],
    message: "Badge base must own and consume component aliases for frame, voice, spacing, and motion.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: ["--comp-badge-font-size: var(--comp-badge-font-size-sm)", "--comp-badge-icon-size: var(--component-density-icon-size-sm)"],
    message: "Badge sm density must scale compact voice and icon through shared density aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: ["--comp-badge-font-size: var(--comp-badge-font-size-lg)", "--comp-badge-icon-size: var(--component-density-icon-size-lg)"],
    message: "Badge lg density must scale compact voice and icon through shared density aliases.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["box-shadow: var(--comp-badge-hover-shadow)", "transform: var(--comp-badge-hover-transform)"],
    message: "Badge hover/focus visual state must consume Badge aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-badge-focus-width) solid var(--comp-badge-focus-color)", "outline-offset: var(--comp-badge-focus-offset)"],
    message: "Badge focus ring must consume Badge accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-badge-disabled-text)", "opacity: var(--comp-badge-disabled-opacity)"],
    message: "Badge disabled state must consume Badge aliases.",
  });
  requireIncludes({
    block: liveBlock,
    text,
    packageCssFile,
    snippets: ["animation: badge-live-dot var(--comp-badge-live-animation-duration) var(--comp-badge-live-animation-ease) infinite"],
    message: "Badge live marker must consume Badge motion aliases.",
  });
  if (/scale\((?:0\.9|1\.18|1)\)/.test(liveKeyframes) || /opacity:\s*(?:0\.72|1)\s*;/.test(liveKeyframes)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes badge-live-dot")), "Badge live keyframes must use Badge scale and opacity aliases, not literal motion values.");
  }
}

module.exports = { checkBadgeCssContract };
