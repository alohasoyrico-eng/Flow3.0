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
  const markBlock = blockFor(blocks, selectorKey, ".choice__mark");
  const indicatorBlock = blockFor(blocks, selectorKey, ".choice__indicator");
  const iconBlock = blockFor(blocks, selectorKey, ".choice__indicator.material-symbol");
  const focusBlock = blockFor(blocks, selectorKey, ".choice__input:focus-visible + .choice__mark,.choice[data-state=\"focus\"] .choice__mark");
  const hoverBlock = blockFor(blocks, selectorKey, ".choice:hover .choice__mark");
  const activeBlock = blockFor(blocks, selectorKey, ".choice:active:not(:has(input:disabled)) .choice__mark");
  const textBlock = blockFor(blocks, selectorKey, ".choice__text");
  const labelBlock = blockFor(blocks, selectorKey, ".choice__label");
  const copyBlock = blockFor(blocks, selectorKey, ".choice__description,.choice__error");
  const errorBlock = blockFor(blocks, selectorKey, ".choice__error");
  const disabledBlock = blockFor(blocks, selectorKey, ".choice:has(input:disabled)");

  if (!checkboxSource.includes("flowDensityProps(") || !checkboxSource.includes("checkboxPlatformContract") || !checkboxSource.includes("forwardRef")) {
    add("errors", checkboxSourceFile, 1, "Checkbox must keep the React density, platform, and ref contract while consuming Choice CSS.");
  }
  if (!radioSource.includes("flowDensityProps(") || !radioSource.includes("radioButtonPlatformContract") || !radioSource.includes("forwardRef")) {
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
      "--comp-choice-current-indicator-font-size: var(--comp-choice-current-indicator-size)",
      "--comp-choice-current-gap: var(--component-space-sm)",
      "align-items: center",
      "gap: var(--comp-choice-current-gap)",
      "padding-block: var(--comp-choice-current-padding-block)",
    ],
    message: "Choice primitive must expose and consume component-scoped current aliases for geometry and rhythm.",
  });

  for (const [block, snippets, message] of [
    [markBlock, ["background: var(--comp-choice-current-mark-bg)", "block-size: var(--comp-choice-current-mark-size)", "inline-size: var(--comp-choice-current-mark-size)", "margin-block-start: 0"], "Choice mark must consume Choice current aliases and stay vertically centered with label text."],
    [indicatorBlock, ["color: var(--comp-choice-current-indicator-fg)", "font-size: var(--comp-choice-current-indicator-font-size)"], "Choice indicator must consume Choice current aliases."],
    [iconBlock, ["--comp-choice-current-icon-color: var(--comp-choice-current-indicator-fg)"], "Choice icon hook must stay component-scoped."],
    [focusBlock, ["outline: var(--comp-choice-current-focus-width) solid var(--comp-choice-current-focus-color)"], "Choice focus state must consume Choice current focus aliases."],
    [hoverBlock, ["border-color: var(--comp-choice-current-mark-hover-border", "transform: scale(var(--comp-choice-current-hover-scale"], "Choice hover state must consume Choice current aliases."],
    [activeBlock, ["transform: scale(var(--comp-choice-current-press-scale"], "Choice pressed state must consume Choice current aliases."],
    [textBlock, ["gap: var(--comp-choice-current-text-gap)", "line-height: var(--component-line-height-snug-state)"], "Choice text rhythm must consume Choice current alias and keep stable vertical alignment."],
    [labelBlock, ["font-weight: var(--comp-choice-current-label-weight", "line-height: var(--component-line-height-snug-state)"], "Choice label must consume Choice current voice alias and keep stable vertical alignment."],
    [copyBlock, ["color: var(--comp-choice-current-description-fg", "font-size: var(--comp-choice-current-description-size"], "Choice description/error copy must consume Choice current voice aliases."],
    [errorBlock, ["color: var(--comp-choice-current-error-fg", "font-weight: var(--comp-choice-current-error-weight"], "Choice error copy must consume Choice current error aliases."],
    [disabledBlock, ["opacity: var(--comp-choice-current-disabled-opacity"], "Choice disabled state must consume Choice current disabled alias."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
  if (!text.includes(".button__icon,\n.material-symbol,") || !text.includes("font-family: var(--component-font-family-icon)")) {
    add("errors", packageCssFile, 1, "Choice material-symbol indicators must be covered by the shared Flow icon font contract.");
  }
  for (const snippet of [
    "--comp-checkbox-checked-bg: var(--component-color-action-indicator)",
    "--comp-checkbox-checked-border: var(--component-color-action-indicator)",
    "--comp-checkbox-indicator-fg: var(--component-color-action-indicator-text)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "Checkbox selected state must use the shared action indicator color pair for dark-mode legibility.");
    }
  }
}

module.exports = { checkChoiceCssContract };
