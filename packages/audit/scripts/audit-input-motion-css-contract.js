const { add, lineNumber } = require("./audit-context.js");

function selectorKey(block) {
  return block?.selector.replace(/\/\*[\s\S]*?\*\//g, "").trim().replace(/\s*,\s*/g, ",").replace(/\s+/g, " ");
}

function blockFor(blocks, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function checkInputMotionCssContract({ text, blocks, packageCssFile }) {
  const fieldSurfaceBlock = blockFor(blocks, ".field-control__surface,.field__control");
  if (!fieldSurfaceBlock) {
    add("errors", packageCssFile, 1, "Input motion contract requires the shared Field surface block.");
    return;
  }

  const requiredStateTransition =
    "background-color var(--component-duration-state) var(--component-ease-state)";
  const requiredBorderTransition =
    "border-color var(--component-duration-state) var(--component-ease-state)";
  const requiredFocusTransition =
    "outline-color var(--component-duration-state) var(--component-ease-state)";
  for (const [snippet, message] of [
    [requiredStateTransition, "Field surface background transitions must use the state motion role."],
    [requiredBorderTransition, "Field surface border transitions must use the state motion role."],
    [requiredFocusTransition, "Field surface focus transitions must use the state motion role."],
  ]) {
    if (!fieldSurfaceBlock.body.includes(snippet)) {
      add("errors", packageCssFile, lineNumber(text, fieldSurfaceBlock.index), message);
    }
  }

  const fieldControlBlocks = blocks.filter((block) => /\.field(?:-control)?__(?:surface|control)\b/.test(block.selector));
  for (const block of fieldControlBlocks) {
    if (/(?:^|\n)\s*(?:transform|animation):/.test(block.body)) {
      add("errors", packageCssFile, lineNumber(text, block.index), "Base Input/Field controls must not use Button-style transform or keyframe motion.");
    }
  }

  const fieldInputBlocks = blocks.filter((block) => /(?:^|,)\s*(?:\.field-input|\.input)\b/.test(selectorKey(block)));
  for (const block of fieldInputBlocks) {
    if (/(?:^|\n)\s*(?:transition|transform|animation):/.test(block.body)) {
      add("errors", packageCssFile, lineNumber(text, block.index), "Native Input text entry must not animate typing, value, or caret behavior.");
    }
  }

  const hoverSelector =
    '.field-control:not([data-state="disabled"]):not([data-state="loading"]):hover .field-control__surface,.field:not([data-state="disabled"]):not([data-state="loading"]):hover .field__control';
  if (!blockFor(blocks, hoverSelector)) {
    add("errors", packageCssFile, 1, "Input hover motion must explicitly exclude disabled and loading Field states.");
  }

  const fieldActionBlock = blockFor(blocks, ".field-action");
  if (!fieldActionBlock?.body.includes("transform var(--component-duration-press) var(--component-ease-press)")) {
    add("errors", packageCssFile, fieldActionBlock ? lineNumber(text, fieldActionBlock.index) : 1, "Field Action may use press motion, but it must consume the press motion role.");
  }

  const codeSlotBlock = blockFor(blocks, ".code-input__slot");
  if (codeSlotBlock && !codeSlotBlock.body.includes("transform var(--comp-code-input-motion-duration) var(--comp-code-input-motion-ease)")) {
    add("errors", packageCssFile, lineNumber(text, codeSlotBlock.index), "Code Input slot motion must be slot-scoped and tokenized, not inherited from base Input.");
  }

  for (const selector of [".code-input__control", ".code-input__digit"]) {
    const reducedSelectorPattern = new RegExp(`@media\\s*\\(prefers-reduced-motion:\\s*reduce\\)[\\s\\S]*?${selector.replace(".", "\\.")}`);
    if (!reducedSelectorPattern.test(text)) {
      add("errors", packageCssFile, 1, `Input-family expressive motion must include ${selector} in reduced-motion handling.`);
    }
  }
}

module.exports = { checkInputMotionCssContract };
