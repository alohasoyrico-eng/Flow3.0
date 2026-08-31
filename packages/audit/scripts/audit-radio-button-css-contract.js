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
  const radioLgBlock = blockFor(blocks, selectorKey, ".radio[data-density=\"lg\"]");
  const radioIndicatorBlock = blockFor(blocks, selectorKey, ".radio .choice__indicator");
  const radioMarkBlock = blockFor(blocks, selectorKey, ".radio .choice__mark");
  const sharedMarkBlock = blockFor(blocks, selectorKey, ".choice__mark");

  if (text.includes("--comp-radio-button-indicator-size: calc(var(--comp-choice-current-mark-size) *")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-radio-button-indicator-size: calc(var(--comp-choice-current-mark-size) *")), "RadioButton indicator sizes must not use CSS calc multiplication; browsers can invalidate the dot size.");
  }

  requireIncludes({
    block: radioBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-radio-button-mark-size-md)",
      "--comp-choice-current-indicator-size: var(--comp-radio-button-indicator-size-md)",
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
      "--comp-choice-current-indicator-size: var(--comp-radio-button-indicator-size-sm)",
      "--comp-choice-current-gap: var(--comp-radio-button-gap-sm)",
      "--comp-choice-current-text-gap: var(--comp-radio-button-gap-sm)",
    ],
    message: "RadioButton small density must set Choice current aliases.",
  });
  requireIncludes({
    block: radioLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-radio-button-mark-size-lg)",
      "--comp-choice-current-indicator-size: var(--comp-radio-button-indicator-size-lg)",
      "--comp-choice-current-gap: var(--comp-radio-button-gap-lg)",
      "--comp-choice-current-text-gap: var(--comp-radio-button-gap-lg)",
    ],
    message: "RadioButton large density must set Choice current aliases.",
  });
  requireIncludes({
    block: radioIndicatorBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-choice-current-dot-bg)",
      "display: block",
      "block-size: var(--comp-choice-current-indicator-size)",
      "inline-size: var(--comp-choice-current-indicator-size)",
      "transform-origin: center",
    ],
    message: "Radio dot must be a real Choice indicator with a visible transform box.",
  });
  requireIncludes({
    block: radioMarkBlock,
    text,
    packageCssFile,
    snippets: [
      "border-radius: var(--comp-choice-current-mark-radius)",
      "box-shadow: var(--comp-radio-button-rest-shadow)",
    ],
    message: "Radio rest mark must expose a visible base circle before selection.",
  });
  requireIncludes({
    block: sharedMarkBlock,
    text,
    packageCssFile,
    snippets: ["box-sizing: border-box"],
    message: "Choice mark must use border-box so RadioButton mark density sizes include borders.",
  });
  const checkedIndicatorSelectors = [
    ".radio .choice__input:checked + .choice__mark .choice__indicator",
    ".radio[data-checked=\"true\"] .choice__mark .choice__indicator",
    ".radio[data-state=\"selected\"] .choice__mark .choice__indicator",
  ];
  for (const selector of checkedIndicatorSelectors) {
    if (!text.includes(selector)) {
      add("errors", packageCssFile, 1, "Radio checked dot must use native and Flow selected-state selectors.");
    }
  }
  if (
    !text.includes("animation: choice-dot-enter var(--comp-choice-current-motion-duration) var(--comp-choice-current-motion-enter) both") ||
    !text.includes("transform: var(--component-transform-scale-rest)")
  ) {
    add("errors", packageCssFile, 1, "Radio checked dot must use Flow motion when entering selected state.");
  }
  if (!text.includes(".radio[data-checked=\"true\"] .choice__mark .choice__indicator")) {
    add("errors", packageCssFile, 1, "Radio checked dot must respond to Flow data-checked state, not only native :checked.");
  }
  if (!text.includes(".radio[data-checked=\"true\"] .choice__mark")) {
    add("errors", packageCssFile, 1, "Radio selected mark must respond to Flow data-checked state, not only native :checked.");
  }
  const selectedMarkBlock = blockFor(blocks, selectorKey, ".radio .choice__input:checked + .choice__mark,.radio[data-checked=\"true\"] .choice__mark,.radio[data-state=\"selected\"] .choice__mark");
  requireIncludes({
    block: selectedMarkBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-choice-current-mark-selected-bg)",
      "border-color: var(--comp-choice-current-mark-selected-border)",
      "box-shadow: var(--comp-radio-button-selected-shadow)",
    ],
    message: "Radio selected mark must expose visible selected container feedback, not only the center dot.",
  });
  for (const snippet of [
    "--comp-radio-button-selected-bg: var(--component-color-surface)",
    "--comp-radio-button-border: var(--component-color-border-strong)",
    "--comp-radio-button-rest-shadow:",
    "--comp-radio-button-selected-border: var(--component-color-action-indicator)",
    "--comp-radio-button-selected-shadow:",
    "--comp-radio-button-dot-bg: var(--component-color-action-indicator)",
    "--comp-radio-button-indicator-size-sm: var(--component-space-sm)",
    "--comp-radio-button-indicator-size-md: calc(var(--component-space-sm) + var(--component-border-width-medium))",
    "--comp-radio-button-indicator-size-lg: var(--component-space-md)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "RadioButton must define explicit indicator sizes for each density and use the shared action indicator color.");
    }
  }

  const rawRadioSize = text.match(/--comp-radio-button-(?:mark-size|indicator-size|gap)[^:]*:\s*(?:[0-9.]+px|[0-9.]+rem)/);
  if (rawRadioSize) {
    add("errors", packageCssFile, lineNumber(text, rawRadioSize.index), "RadioButton size and gap aliases must flow through Flow component tokens instead of raw lengths.");
  }
}

module.exports = { checkRadioButtonCssContract };
