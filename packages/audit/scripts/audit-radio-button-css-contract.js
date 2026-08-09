const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkRadioButtonCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const radioBlock = blockFor(blocks, selectorKey, ".radio");
  const radioSmBlock = blockFor(blocks, selectorKey, ".radio[data-density=\"sm\"]");
  const radioDotBlock = blockFor(blocks, selectorKey, ".radio .choice__mark::after");

  if (text.includes("--comp-radio-button-indicator-scale: var(--sys-frame-ratio-half);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-radio-button-indicator-scale: var(--sys-frame-ratio-half);")), "RadioButton indicator scale must consume --component-ratio-half instead of reaching into frame ratio directly.");
  }
  if (!text.includes("--comp-radio-button-indicator-scale: var(--component-ratio-half);")) {
    add("errors", packageCssFile, 1, "RadioButton indicator scale must consume --component-ratio-half.");
  }

  requireIncludes({
    block: radioBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-radio-button-mark-size-md)",
      "--comp-choice-current-indicator-size: var(--comp-radio-button-indicator-size)",
      "--comp-choice-current-dot-bg: var(--comp-radio-button-dot-bg)",
    ],
    message: "RadioButton must map its component tokens into the Choice current aliases.",
  });
  requireIncludes({
    block: radioSmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-radio-button-mark-size-sm)",
      "--comp-choice-current-gap: var(--comp-radio-button-gap-sm)",
    ],
    message: "RadioButton small density must set Choice current aliases.",
  });
  requireIncludes({
    block: radioDotBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-choice-current-dot-bg)",
      "block-size: var(--comp-choice-current-indicator-size)",
      "inline-size: var(--comp-choice-current-indicator-size)",
    ],
    message: "Radio dot must consume Choice current aliases.",
  });

  const rawRadioSize = text.match(/--comp-radio-button-(?:mark-size|gap)[^:]*:\s*(?:[0-9.]+px|[0-9.]+rem)/);
  if (rawRadioSize) {
    add("errors", packageCssFile, lineNumber(text, rawRadioSize.index), "RadioButton size and gap aliases must flow through Flow component tokens instead of raw lengths.");
  }
}

module.exports = { checkRadioButtonCssContract };
