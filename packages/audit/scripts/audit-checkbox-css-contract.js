const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCheckboxCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const checkboxBlock = blockFor(blocks, selectorKey, ".checkbox");
  const checkboxSmBlock = blockFor(blocks, selectorKey, ".checkbox[data-density=\"sm\"]");
  const checkboxLgBlock = blockFor(blocks, selectorKey, ".checkbox[data-density=\"lg\"]");
  const checkedCheckboxBlock = blockFor(blocks, selectorKey, ".checkbox .choice__input:checked + .choice__mark");
  const markBlock = blockFor(blocks, selectorKey, ".choice__mark");

  requireIncludes({
    block: checkboxBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-checkbox-mark-size-md)",
      "--comp-choice-current-indicator-size: var(--comp-checkbox-indicator-size-md)",
      "--comp-choice-current-indicator-font-size: var(--comp-choice-current-indicator-size)",
      "--comp-choice-current-mark-checked-bg: var(--comp-checkbox-checked-bg)",
      "--comp-choice-current-indicator-fg: var(--comp-checkbox-indicator-fg)",
    ],
    message: "Checkbox must map its component tokens into the Choice current aliases.",
  });
  requireIncludes({
    block: checkboxSmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-checkbox-mark-size-sm)",
      "--comp-choice-current-indicator-size: var(--comp-checkbox-indicator-size-sm)",
      "--comp-choice-current-indicator-font-size: var(--comp-choice-current-indicator-size)",
      "--comp-choice-current-gap: var(--comp-checkbox-gap-sm)",
    ],
    message: "Checkbox small density must set Choice current aliases.",
  });
  requireIncludes({
    block: checkboxLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-checkbox-mark-size-lg)",
      "--comp-choice-current-indicator-size: var(--comp-checkbox-indicator-size-lg)",
      "--comp-choice-current-indicator-font-size: var(--comp-choice-current-indicator-size)",
      "--comp-choice-current-gap: var(--comp-checkbox-gap-lg)",
    ],
    message: "Checkbox large density must set Choice current aliases, including the indicator size.",
  });
  requireIncludes({
    block: checkedCheckboxBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-choice-current-mark-checked-bg)",
      "border-color: var(--comp-choice-current-mark-checked-border)",
    ],
    message: "Checkbox checked mark must consume Choice current aliases.",
  });
  requireIncludes({
    block: markBlock,
    text,
    packageCssFile,
    snippets: ["box-sizing: border-box"],
    message: "Choice mark must use border-box so checkbox/radio density sizes include borders.",
  });

  const rawCheckboxSize = text.match(/--comp-checkbox-(?:mark-size|gap)[^:]*:\s*(?:[0-9.]+px|[0-9.]+rem)/);
  if (rawCheckboxSize) {
    add("errors", packageCssFile, lineNumber(text, rawCheckboxSize.index), "Checkbox size and gap aliases must flow through Flow component tokens instead of raw lengths.");
  }

  const checkboxIndicatorSizeTokens = Object.fromEntries(
    [...text.matchAll(/--comp-checkbox-indicator-size-(sm|md|lg):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
  if (!checkboxIndicatorSizeTokens.sm || !checkboxIndicatorSizeTokens.md || !checkboxIndicatorSizeTokens.lg) {
    add("errors", packageCssFile, 1, "Checkbox must declare sm/md/lg indicator size aliases.");
  }
  if (checkboxIndicatorSizeTokens.md && checkboxIndicatorSizeTokens.lg && checkboxIndicatorSizeTokens.md === checkboxIndicatorSizeTokens.lg) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-checkbox-indicator-size-lg")), "Checkbox large indicator size must not duplicate medium; density must scale the check icon.");
  }
}

module.exports = { checkCheckboxCssContract };
