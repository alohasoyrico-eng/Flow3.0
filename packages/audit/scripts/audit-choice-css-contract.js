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

function checkChoiceCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const checkboxSourceFile = path.join(root || process.cwd(), "packages/react/src/Checkbox.js");
  const radioSourceFile = path.join(root || process.cwd(), "packages/react/src/RadioButton.js");
  const checkboxSource = fs.existsSync(checkboxSourceFile) ? fs.readFileSync(checkboxSourceFile, "utf8") : "";
  const radioSource = fs.existsSync(radioSourceFile) ? fs.readFileSync(radioSourceFile, "utf8") : "";
  const choiceBlock = blockFor(blocks, selectorKey, ".choice");
  const checkboxBlock = blockFor(blocks, selectorKey, ".checkbox");
  const radioBlock = blockFor(blocks, selectorKey, ".radio");
  const checkboxSmBlock = blockFor(blocks, selectorKey, ".checkbox[data-density=\"sm\"]");
  const radioSmBlock = blockFor(blocks, selectorKey, ".radio[data-density=\"sm\"]");
  const markBlock = blockFor(blocks, selectorKey, ".choice__mark");
  const indicatorBlock = blockFor(blocks, selectorKey, ".choice__indicator");
  const iconBlock = blockFor(blocks, selectorKey, ".choice__indicator.material-symbol");
  const checkedCheckboxBlock = blockFor(blocks, selectorKey, ".checkbox .choice__input:checked + .choice__mark");
  const radioDotBlock = blockFor(blocks, selectorKey, ".radio .choice__mark::after");
  const focusBlock = blockFor(blocks, selectorKey, ".choice__input:focus-visible + .choice__mark,.choice[data-state=\"focus\"] .choice__mark");
  const hoverBlock = blockFor(blocks, selectorKey, ".choice:hover .choice__mark");
  const activeBlock = blockFor(blocks, selectorKey, ".choice:active:not(:has(input:disabled)) .choice__mark");
  const textBlock = blockFor(blocks, selectorKey, ".choice__text");
  const labelBlock = blockFor(blocks, selectorKey, ".choice__label");
  const copyBlock = blockFor(blocks, selectorKey, ".choice__description,.choice__error");
  const errorBlock = blockFor(blocks, selectorKey, ".choice__error");
  const disabledBlock = blockFor(blocks, selectorKey, ".choice:has(input:disabled)");

  if (!checkboxSource.includes("flowDensityProps(density)") || !checkboxSource.includes("checkboxPlatformContract") || !checkboxSource.includes("forwardRef")) {
    add("errors", checkboxSourceFile, 1, "Checkbox must keep the React density, platform, and ref contract while consuming Choice CSS.");
  }
  if (!radioSource.includes("flowDensityProps(density)") || !radioSource.includes("radioButtonPlatformContract") || !radioSource.includes("forwardRef")) {
    add("errors", radioSourceFile, 1, "RadioButton must keep the React density, platform, and ref contract while consuming Choice CSS.");
  }
  if (text.includes("--choice-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--choice-")), "Choice must not use short --choice-* aliases; use --comp-choice-current-* aliases.");
  }
  if (text.includes("--icon-color")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--icon-color")), "Choice must not create a generic --icon-color hook; use a component-scoped alias.");
  }

  requireIncludes({
    block: choiceBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--component-inline-size-sm)",
      "--comp-choice-current-indicator-size: calc(var(--comp-choice-current-mark-size) / 2)",
      "--comp-choice-current-gap: var(--sys-space-sm)",
      "gap: var(--comp-choice-current-gap)",
      "padding-block: var(--comp-choice-current-padding-block, var(--sys-space-xs))",
    ],
    message: "Choice primitive must expose and consume component-scoped current aliases for geometry and rhythm.",
  });

  for (const [block, snippets, message] of [
    [checkboxBlock, ["--comp-choice-current-mark-size: var(--comp-checkbox-mark-size-md)", "--comp-choice-current-mark-checked-bg: var(--comp-checkbox-checked-bg)", "--comp-choice-current-indicator-fg: var(--comp-checkbox-indicator-fg)"], "Checkbox must map its component tokens into the Choice current aliases."],
    [radioBlock, ["--comp-choice-current-mark-size: var(--comp-radio-button-mark-size-md)", "--comp-choice-current-indicator-size: var(--comp-radio-button-indicator-size)", "--comp-choice-current-dot-bg: var(--comp-radio-button-dot-bg)"], "RadioButton must map its component tokens into the Choice current aliases."],
    [checkboxSmBlock, ["--comp-choice-current-mark-size: var(--comp-checkbox-mark-size-sm)", "--comp-choice-current-gap: var(--comp-checkbox-gap-sm)"], "Checkbox small density must set Choice current aliases."],
    [radioSmBlock, ["--comp-choice-current-mark-size: var(--comp-radio-button-mark-size-sm)", "--comp-choice-current-gap: var(--comp-radio-button-gap-sm)"], "RadioButton small density must set Choice current aliases."],
    [markBlock, ["background: var(--comp-choice-current-mark-bg, var(--sys-color-surface))", "block-size: var(--comp-choice-current-mark-size)", "inline-size: var(--comp-choice-current-mark-size)"], "Choice mark must consume Choice current aliases."],
    [indicatorBlock, ["color: var(--comp-choice-current-indicator-fg, var(--sys-color-action-text))", "font-size: var(--comp-choice-current-indicator-font-size)"], "Choice indicator must consume Choice current aliases."],
    [iconBlock, ["--comp-choice-current-icon-color: var(--comp-choice-current-indicator-fg, var(--sys-color-action-text))"], "Choice icon hook must stay component-scoped."],
    [checkedCheckboxBlock, ["background: var(--comp-choice-current-mark-checked-bg, var(--sys-color-action))", "border-color: var(--comp-choice-current-mark-checked-border, var(--sys-color-action))"], "Checkbox checked mark must consume Choice current aliases."],
    [radioDotBlock, ["background: var(--comp-choice-current-dot-bg, var(--sys-color-action))", "block-size: var(--comp-choice-current-indicator-size)", "inline-size: var(--comp-choice-current-indicator-size)"], "Radio dot must consume Choice current aliases."],
    [focusBlock, ["outline: var(--comp-choice-current-focus-width, var(--component-focus-ring-width)) solid var(--comp-choice-current-focus-color, var(--sys-color-focus))"], "Choice focus state must consume Choice current focus aliases."],
    [hoverBlock, ["border-color: var(--comp-choice-current-mark-hover-border", "transform: scale(var(--comp-choice-current-hover-scale"], "Choice hover state must consume Choice current aliases."],
    [activeBlock, ["transform: scale(var(--comp-choice-current-press-scale"], "Choice pressed state must consume Choice current aliases."],
    [textBlock, ["gap: var(--comp-choice-current-text-gap, var(--sys-space-sm))"], "Choice text rhythm must consume Choice current alias."],
    [labelBlock, ["font-weight: var(--comp-choice-current-label-weight"], "Choice label must consume Choice current voice alias."],
    [copyBlock, ["color: var(--comp-choice-current-description-fg", "font-size: var(--comp-choice-current-description-size"], "Choice description/error copy must consume Choice current voice aliases."],
    [errorBlock, ["color: var(--comp-choice-current-error-fg", "font-weight: var(--comp-choice-current-error-weight"], "Choice error copy must consume Choice current error aliases."],
    [disabledBlock, ["opacity: var(--comp-choice-current-disabled-opacity"], "Choice disabled state must consume Choice current disabled alias."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkChoiceCssContract };
