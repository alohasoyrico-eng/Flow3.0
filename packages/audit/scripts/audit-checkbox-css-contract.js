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
  const checkedCheckboxBlock = blockFor(blocks, selectorKey, ".checkbox .choice__input:checked + .choice__mark");

  requireIncludes({
    block: checkboxBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-choice-current-mark-size: var(--comp-checkbox-mark-size-md)",
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
      "--comp-choice-current-gap: var(--comp-checkbox-gap-sm)",
    ],
    message: "Checkbox small density must set Choice current aliases.",
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

  const rawCheckboxSize = text.match(/--comp-checkbox-(?:mark-size|gap)[^:]*:\s*(?:[0-9.]+px|[0-9.]+rem)/);
  if (rawCheckboxSize) {
    add("errors", packageCssFile, lineNumber(text, rawCheckboxSize.index), "Checkbox size and gap aliases must flow through Flow component tokens instead of raw lengths.");
  }
}

module.exports = { checkCheckboxCssContract };
