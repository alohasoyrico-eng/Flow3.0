const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkInlineValidationCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/InlineValidation.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".inline-validation");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".inline-validation[data-full-width=\"true\"]");
  const fieldBlock = blockFor(blocks, selectorKey, ".inline-validation .field");
  const noFieldBlock = blockFor(blocks, selectorKey, ".inline-validation[data-field=\"false\"]");
  const fieldControlBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"info\"] .field__control,.inline-validation[data-state=\"success\"] .field__control,.inline-validation[data-state=\"warning\"] .field__control,.inline-validation[data-state=\"error\"] .field__control");
  const messageBlock = blockFor(blocks, selectorKey, ".inline-validation__message");
  const messageNoFieldBlock = blockFor(blocks, selectorKey, ".inline-validation[data-field=\"false\"] .inline-validation__message");
  const iconBlock = blockFor(blocks, selectorKey, ".inline-validation__message::before");
  const errorMessageBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"error\"] .inline-validation__message");
  const errorIconBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"error\"] .inline-validation__message::before");
  const successMessageBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"success\"] .inline-validation__message");
  const successIconBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"success\"] .inline-validation__message::before");
  const warningMessageBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"warning\"] .inline-validation__message");
  const warningIconBlock = blockFor(blocks, selectorKey, ".inline-validation[data-state=\"warning\"] .inline-validation__message::before");

  if (
    !source.includes("forwardRef") ||
    !source.includes("inlineValidationPlatformContract") ||
    !source.includes("flowStateProps(resolvedState)") ||
    !source.includes("flowDensityProps(resolvedDensity)")
  ) {
    add("errors", sourceFile, 1, "InlineValidation must expose a real React ref contract, platform contract, state, and density props.");
  }
  if (!source.includes("const showField = Boolean(label && requestedField);") || !source.includes("React.createElement(Input")) {
    add("errors", sourceFile, 1, "InlineValidation must compose Input only when a visible label allows a real field.");
  }
  if (!source.includes("\"aria-describedby\": message ? messageId : undefined") || !source.includes("\"aria-invalid\": resolvedState === \"error\" ? \"true\" : undefined") || !source.includes("role: messageRole")) {
    add("errors", sourceFile, 1, "InlineValidation must connect message, invalid state, and live-region semantics through React props.");
  }
  for (const sharedSelector of [
    ".inline-validation,.code-input,.phone-input,.card-number-input,.card-expiry-input,.card-security-code-input,.date-picker",
    ".inline-validation__message,.code-input small,.phone-input small",
  ]) {
    if (blockFor(blocks, selectorKey, sharedSelector)) {
      add("errors", packageCssFile, lineNumber(text, text.indexOf(sharedSelector.split(",")[0])), "InlineValidation must not share root or message CSS blocks with other components.");
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-inline-validation-color: var(--sys-color-text)",
      "--comp-inline-validation-display: var(--component-display-grid)",
      "--comp-inline-validation-gap: var(--sys-space-xs)",
      "--comp-inline-validation-full-width: var(--component-inline-size-full)",
      "--comp-inline-validation-message-size: var(--component-font-size-caption)",
      "--comp-inline-validation-icon-family: var(--sys-font-icon)",
      "--comp-inline-validation-error-icon: \"error\"",
      "color: var(--comp-inline-validation-color)",
      "display: var(--comp-inline-validation-display)",
      "gap: var(--comp-inline-validation-gap)",
      "inline-size: var(--comp-inline-validation-width)",
      "max-inline-size: var(--comp-inline-validation-full-width)",
    ],
    message: "InlineValidation root must own and consume aliases for layout, width, tone, message, and iconography.",
  });
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-inline-validation-full-width)"],
    message: "InlineValidation full-width state must consume width alias.",
  });
  requireIncludes({
    block: fieldBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-inline-validation-field-width)"],
    message: "InlineValidation composed field must consume field width alias.",
  });
  requireIncludes({
    block: noFieldBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-inline-validation-auto-width)"],
    message: "InlineValidation message-only layout must consume auto width alias.",
  });
  requireIncludes({
    block: fieldControlBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-inline-validation-tone)"],
    message: "InlineValidation field control state must consume tone alias.",
  });
  requireIncludes({
    block: messageBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-inline-validation-message-align)",
      "color: var(--comp-inline-validation-tone)",
      "display: var(--comp-inline-validation-message-display)",
      "font-size: var(--comp-inline-validation-message-size)",
      "font-weight: var(--comp-inline-validation-message-weight)",
      "gap: var(--comp-inline-validation-message-gap)",
      "line-height: var(--comp-inline-validation-message-line-height)",
      "margin: var(--comp-inline-validation-message-margin)",
      "min-block-size: var(--comp-inline-validation-message-min-block)",
    ],
    message: "InlineValidation message must consume InlineValidation message aliases.",
  });
  requireIncludes({
    block: messageNoFieldBlock,
    text,
    packageCssFile,
    snippets: ["min-block-size: var(--comp-inline-validation-message-auto-min-block)"],
    message: "InlineValidation message-only block must consume message min-size alias.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "content: var(--comp-inline-validation-icon-content)",
      "font-family: var(--comp-inline-validation-icon-family)",
      "font-size: var(--comp-inline-validation-icon-size)",
      "font-weight: var(--comp-inline-validation-icon-weight)",
      "line-height: var(--comp-inline-validation-icon-line-height)",
    ],
    message: "InlineValidation message icon must consume iconography aliases.",
  });
  for (const [messageStateBlock, iconStateBlock, iconAlias, message] of [
    [errorMessageBlock, errorIconBlock, "--comp-inline-validation-error-icon", "InlineValidation error state must consume tone and error icon aliases."],
    [successMessageBlock, successIconBlock, "--comp-inline-validation-success-icon", "InlineValidation success state must consume tone and success icon aliases."],
    [warningMessageBlock, warningIconBlock, "--comp-inline-validation-warning-icon", "InlineValidation warning state must consume tone and warning icon aliases."],
  ]) {
    requireIncludes({
      block: messageStateBlock,
      text,
      packageCssFile,
      snippets: ["color: var(--comp-inline-validation-tone)"],
      message,
    });
    requireIncludes({
      block: iconStateBlock,
      text,
      packageCssFile,
      snippets: [`content: var(${iconAlias})`],
      message,
    });
  }
}

module.exports = { checkInlineValidationCssContract };
