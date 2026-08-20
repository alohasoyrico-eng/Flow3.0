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
  const fieldInputBlock = blockFor(blocks, selectorKey, ".field-input,.input");
  const fieldPlaceholderBlock = blockFor(blocks, selectorKey, ".field-input::placeholder,.input::placeholder");
  const fieldSmBlock = blockFor(blocks, selectorKey, ".field-control[data-density=\"sm\"],.field[data-density=\"sm\"]");
  const fieldLgBlock = blockFor(blocks, selectorKey, ".field-control[data-density=\"lg\"],.field[data-density=\"lg\"]");
  const fieldIconBlock = blockFor(blocks, selectorKey, ".field__icon");
  const fieldActionBlock = blockFor(blocks, selectorKey, ".field-action");
  const fieldErrorMessageBlock = blockFor(blocks, selectorKey, ".field-control[data-state=\"error\"] .field-control__helper,.field[data-state=\"error\"] .field__helper,.field[data-state=\"error\"] .field__icon");
  const darkFieldBlock = blockFor(blocks, selectorKey, "[data-theme=\"dark\"] .field,[data-theme=\"dark\"] .field-control");
  const cardFieldBlock = blockFor(blocks, selectorKey, ".card-number-input,.card-expiry-input,.card-security-code-input");
  const cardControlBlock = blockFor(blocks, selectorKey, ".card-number-input__control,.card-expiry-input__control,.card-security-code-input__control");
  const cardIconBlock = blockFor(blocks, selectorKey, ".card-number-input__icon,.card-expiry-input__icon,.card-security-code-input__icon");
  const cardInputBlock = blockFor(blocks, selectorKey, ".card-number-input__input,.card-expiry-input__input,.card-security-code-input__input");
  const cardSecurityActionBlock = blockFor(blocks, selectorKey, ".card-security-code-input__action");

  if (!text.includes("--comp-input-control-size: var(--comp-input-control-size-md)")) {
    add("errors", packageCssFile, 1, "Input base control size must default to the field md size, not the global density control height.");
  }
  for (const snippet of [
    "--component-control-frame-size-sm: var(--sys-space-9);",
    "--component-control-frame-size-md: var(--component-control-min-size);",
    "--component-control-frame-size-lg: calc(var(--sys-space-12) + var(--sys-space-xs));",
    "--component-control-frame-radius-field: var(--component-radius-control);",
    "--component-field-control-size-sm: var(--component-control-frame-size-sm);",
    "--component-field-control-size-md: var(--component-control-frame-size-md);",
    "--component-field-control-size-lg: var(--component-control-frame-size-lg);",
    "--comp-input-control-size-sm: var(--component-field-control-size-sm);",
    "--comp-input-control-size-md: var(--component-field-control-size-md);",
    "--comp-input-control-size-lg: var(--component-field-control-size-lg);",
    "--comp-input-control-size: var(--comp-input-control-size-md);",
    "--comp-input-font-size-sm: var(--component-control-frame-font-size-sm);",
    "--comp-input-font-size-md: var(--component-control-frame-font-size-md);",
    "--comp-input-font-size-lg: var(--component-control-frame-font-size-lg);",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, `Field/Input density must keep monotonic sm/md/lg geometry through shared field tokens: missing ${snippet}`);
    }
  }
  const loadingSurfaceBlock = blockFor(blocks, selectorKey, ".field-control[data-state=\"loading\"] .field-control__surface,.field[data-state=\"loading\"] .field__control");
  const disabledSurfaceBlock = blockFor(blocks, selectorKey, ".field-control[data-state=\"disabled\"] .field-control__surface,.field[data-state=\"disabled\"] .field__control");
  requireIncludes({
    block: loadingSurfaceBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-input-loading-bg)"],
    message: "Field/Input loading state must consume a loading surface alias, not the disabled visual alias.",
  });
  requireIncludes({
    block: disabledSurfaceBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-input-disabled-bg)"],
    message: "Field/Input disabled state must consume the disabled surface alias.",
  });
  if (loadingSurfaceBlock && /--comp-input-disabled-|background:\s*var\(--comp-input-disabled-/.test(loadingSurfaceBlock.body)) {
    add("errors", packageCssFile, lineNumber(text, loadingSurfaceBlock.index), "Field/Input loading state must stay visually distinct from disabled.");
  }
  for (const [state, token] of [
    ["info", "--comp-input-info-bg"],
    ["success", "--comp-input-success-bg"],
    ["warning", "--comp-input-warning-bg"],
    ["error", "--comp-input-error-bg"],
  ]) {
    if (!text.includes(`.field[data-state="${state}"] .field__control`) || !text.includes(`background: var(${token})`)) {
      add("errors", packageCssFile, 1, `Field/Input ${state} state must use its semantic field background alias.`);
    }
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
      "border-radius: var(--component-control-frame-radius-field)",
      "box-sizing: border-box",
      "block-size: var(--comp-field-control-size)",
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
      "--comp-input-font-size: var(--comp-input-font-size-sm)",
      "--comp-input-padding-x: var(--comp-input-padding-x-sm)",
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
      "--comp-input-font-size: var(--comp-input-font-size-lg)",
      "--comp-input-padding-x: var(--comp-input-padding-x-lg)",
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
  if (!text.includes("--component-field-placeholder-fg: var(--component-color-text-muted);")) {
    add("errors", packageCssFile, 1, "Field placeholder color must be exposed as a shared component field token.");
  }
  if (!text.includes("--component-field-error-helper-fg: var(--component-color-danger);")) {
    add("errors", packageCssFile, 1, "Field error helper color must be exposed as a shared component field token.");
  }
  requireIncludes({
    block: fieldInputBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-input-field-fg)", "font-size: var(--comp-input-font-size)"],
    message: "Field input text must consume the field foreground and current density font-size aliases.",
  });
  requireIncludes({
    block: fieldPlaceholderBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-input-placeholder-fg)", "opacity: 1"],
    message: "Field placeholder must consume the shared placeholder alias instead of browser-native placeholder color.",
  });
  requireIncludes({
    block: fieldErrorMessageBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-input-error-helper-fg)"],
    message: "Field error helper/icon must consume the semantic error helper alias.",
  });
  requireIncludes({
    block: darkFieldBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-input-error-bg: color-mix(in srgb, var(--component-color-danger) 18%, var(--component-color-surface))",
      "--comp-input-error-border: color-mix(in srgb, var(--component-color-danger) 78%, var(--component-color-text))",
      "--comp-input-error-helper-fg: var(--component-field-error-helper-fg)",
      "--comp-input-info-bg: color-mix(in srgb, var(--component-color-action) 16%, var(--component-color-surface))",
      "--comp-input-info-border: color-mix(in srgb, var(--component-color-action) 70%, var(--component-color-text))",
      "--comp-input-success-bg: color-mix(in srgb, var(--component-color-success) 18%, var(--component-color-surface))",
      "--comp-input-success-border: color-mix(in srgb, var(--component-color-success) 70%, var(--component-color-text))",
      "--comp-input-warning-bg: color-mix(in srgb, var(--component-color-warning) 16%, var(--component-color-surface))",
      "--comp-input-warning-border: color-mix(in srgb, var(--component-color-warning) 72%, var(--component-color-text))",
      "--comp-input-warning-helper-fg: color-mix(in srgb, var(--component-color-warning) 64%, var(--component-color-text))",
      "--comp-input-label-fg: var(--component-color-text)",
      "--comp-input-placeholder-fg: var(--component-color-text-muted)",
      "--comp-input-loading-bg: color-mix(in srgb, var(--component-color-action) 10%, var(--component-color-surface-raised))",
      "--comp-input-icon-loading-fg: color-mix(in srgb, var(--component-color-action) 42%, var(--component-color-text))",
    ],
    message: "Field dark mode semantic states must preserve readable input, helper, and icon contrast.",
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
