const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkDialogCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".dialog");
  const panelBlock = blockFor(blocks, selectorKey, ".dialog__panel");
  const smBlock = blockFor(blocks, selectorKey, ".dialog[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".dialog[data-density=\"lg\"]");
  const closingBlock = blockFor(blocks, selectorKey, ".dialog[data-state=\"closing\"] .dialog__panel");
  const footerBlock = blockFor(blocks, selectorKey, ".dialog__panel footer");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-dialog-panel-border-width: var(--component-border-width)",
      "--comp-dialog-panel-padding: var(--sys-space-lg)",
      "--comp-dialog-panel-gap: var(--sys-space-md)",
      "--comp-dialog-enter-ease: var(--component-ease-enter)",
      "--comp-dialog-exit-ease: var(--component-ease-exit)",
    ],
    message: "Dialog root must own panel frame, density, and lifecycle motion aliases.",
  });
  requireIncludes({
    block: panelBlock,
    text,
    packageCssFile,
    snippets: [
      "border: var(--comp-dialog-panel-border-width) solid var(--comp-dialog-panel-border)",
      "animation: dialog-enter var(--comp-dialog-enter-duration) var(--comp-dialog-enter-ease) both",
      "gap: var(--comp-dialog-panel-gap)",
      "padding: var(--comp-dialog-panel-padding)",
    ],
    message: "Dialog panel must consume Dialog frame and enter motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-dialog-panel-padding: var(--sys-space-md)",
      "--comp-dialog-icon-size: var(--component-dialog-icon-size-sm)",
      "--comp-dialog-title-font-size: var(--component-font-size-body)",
    ],
    message: "Dialog sm density must set aliases on the Dialog root.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-dialog-panel-padding: var(--sys-space-xl)",
      "--comp-dialog-icon-size: var(--component-dialog-icon-size-lg)",
      "--comp-dialog-title-font-size: var(--component-font-size-title-md)",
    ],
    message: "Dialog lg density must set aliases on the Dialog root.",
  });
  requireIncludes({
    block: closingBlock,
    text,
    packageCssFile,
    snippets: ["animation: dialog-exit var(--comp-dialog-exit-duration) var(--comp-dialog-exit-ease) both"],
    message: "Dialog closing state must consume Dialog exit motion aliases.",
  });
  requireIncludes({
    block: footerBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-dialog-footer-gap)"],
    message: "Dialog footer must consume the Dialog footer gap alias.",
  });
  for (const staleSelector of ['.dialog[data-density="sm"] .dialog__panel', '.dialog[data-density="lg"] .dialog__panel']) {
    if (blockFor(blocks, selectorKey, staleSelector)) {
      add("errors", packageCssFile, 1, "Dialog density aliases must live on the root, not on the panel selector.");
    }
  }
}

module.exports = { checkDialogCssContract };
