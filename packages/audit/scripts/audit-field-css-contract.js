const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkFieldCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const fieldBlock = blockFor(blocks, selectorKey, ".field-control,.field");
  const fieldSurfaceBlock = blockFor(blocks, selectorKey, ".field-control__surface,.field__control");
  const fieldSmBlock = blockFor(blocks, selectorKey, ".field-control[data-density=\"sm\"],.field[data-density=\"sm\"]");
  const fieldLgBlock = blockFor(blocks, selectorKey, ".field-control[data-density=\"lg\"],.field[data-density=\"lg\"]");
  const fieldIconBlock = blockFor(blocks, selectorKey, ".field__icon");
  const fieldActionBlock = blockFor(blocks, selectorKey, ".field-action");
  const phoneCompactBlock = blockFor(blocks, selectorKey, ".phone-input[data-variant=\"compact\"] .phone-input__control");
  const cardFieldBlock = blockFor(blocks, selectorKey, ".card-number-input,.card-expiry-input,.card-security-code-input");
  const cardControlBlock = blockFor(blocks, selectorKey, ".card-number-input__control,.card-expiry-input__control,.card-security-code-input__control");
  const cardIconBlock = blockFor(blocks, selectorKey, ".card-number-input__icon,.card-expiry-input__icon,.card-security-code-input__icon");
  const cardInputBlock = blockFor(blocks, selectorKey, ".card-number-input__input,.card-expiry-input__input,.card-security-code-input__input");
  const cardSecurityActionBlock = blockFor(blocks, selectorKey, ".card-security-code-input__action");

  if (!text.includes("--comp-input-control-size: var(--sys-density-control-height)")) {
    add("errors", packageCssFile, 1, "Input base control size must inherit from the density cascade.");
  }
  requireIncludes({
    block: fieldBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-field-control-size: var(--comp-input-control-size)",
      "--comp-field-icon-size: var(--comp-input-icon-size)",
      "--comp-field-icon-action-size: var(--comp-input-action-size)",
      "gap: var(--comp-input-gap)",
    ],
    message: "Field shell must bridge Input geometry into component-scoped Field aliases.",
  });
  requireIncludes({
    block: fieldSurfaceBlock,
    text,
    packageCssFile,
    snippets: [
      "gap: var(--comp-input-gap)",
      "min-block-size: var(--comp-field-control-size)",
      "padding: 0 var(--comp-input-padding-x)",
    ],
    message: "Field surface must consume Field/Input frame aliases instead of local geometry.",
  });
  requireIncludes({
    block: fieldSmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-field-control-size: var(--comp-input-control-size-sm)",
      "--comp-field-icon-size: var(--comp-input-icon-size-sm)",
      "--comp-field-icon-action-size: var(--comp-input-action-size-sm)",
    ],
    message: "Field sm density must cascade through Input size aliases.",
  });
  requireIncludes({
    block: fieldLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-field-control-size: var(--comp-input-control-size-lg)",
      "--comp-field-icon-size: var(--comp-input-icon-size-lg)",
      "--comp-field-icon-action-size: var(--comp-input-action-size-lg)",
    ],
    message: "Field lg density must cascade through Input size aliases.",
  });
  requireIncludes({
    block: fieldIconBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-field-icon-size)"],
    message: "Field icons must consume the current Field icon size.",
  });
  requireIncludes({
    block: fieldActionBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-field-icon-action-size)", "min-block-size: var(--comp-field-icon-action-size)"],
    message: "Field actions must consume the current Field action size.",
  });
  requireIncludes({
    block: phoneCompactBlock,
    text,
    packageCssFile,
    snippets: ["--comp-field-control-size: var(--comp-phone-input-control-size-compact)"],
    message: "Phone Input compact variant must override the shared Field size alias.",
  });
  requireIncludes({
    block: cardFieldBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-card-number-input-control-size: var(--comp-field-control-size)",
      "--comp-card-number-input-icon-size: var(--comp-field-icon-size)",
      "--comp-card-expiry-input-control-size: var(--comp-field-control-size)",
      "--comp-card-expiry-input-icon-size: var(--comp-field-icon-size)",
      "--comp-card-security-code-input-control-size: var(--comp-field-control-size)",
      "--comp-card-security-code-input-action-size: var(--comp-field-icon-action-size)",
    ],
    message: "Card field inputs must derive geometry from the shared Field shell aliases.",
  });
  requireIncludes({
    block: cardControlBlock,
    text,
    packageCssFile,
    snippets: ["min-block-size: var(--comp-card-number-input-control-size)"],
    message: "Card field controls must consume their component control-size alias.",
  });
  requireIncludes({
    block: cardIconBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-card-number-input-icon-size)"],
    message: "Card field icons must consume their component icon-size alias.",
  });
  requireIncludes({
    block: cardInputBlock,
    text,
    packageCssFile,
    snippets: ["font-variant-numeric: tabular-nums", "letter-spacing: var(--comp-card-number-input-value-spacing)"],
    message: "Card field value rhythm must stay tokenized through component aliases.",
  });
  requireIncludes({
    block: cardSecurityActionBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-card-security-code-input-action-size)", "block-size: var(--comp-card-security-code-input-action-size)"],
    message: "Card Security Code action must consume its component action-size alias.",
  });
  if (/--field-(?:control-size|icon-size|icon-action-size)(?:-|:|\))/.test(text)) {
    add("errors", packageCssFile, 1, "Field geometry aliases must stay in the --comp-field-* contract; legacy --field-* shortcuts are not allowed.");
  }
}

module.exports = { checkFieldCssContract };
