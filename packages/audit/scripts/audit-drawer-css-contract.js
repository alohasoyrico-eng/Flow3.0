const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkDrawerCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".drawer");
  const panelBlock = blockFor(blocks, selectorKey, ".drawer__panel");
  const smBlock = blockFor(blocks, selectorKey, ".drawer[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".drawer[data-density=\"lg\"]");
  const closingBlock = blockFor(blocks, selectorKey, ".drawer[data-state=\"closing\"] .drawer__panel");
  const footerBlock = blockFor(blocks, selectorKey, ".drawer__panel footer");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-drawer-panel-border-width: var(--component-border-width)",
      "--comp-drawer-panel-padding:",
      "--comp-drawer-footer-border-width: var(--component-border-width)",
      "--comp-drawer-enter-ease: var(--component-ease-enter)",
      "--comp-drawer-exit-ease: var(--component-ease-exit)",
    ],
    message: "Drawer root must own panel frame, density, footer, and lifecycle motion aliases.",
  });
  requireIncludes({
    block: panelBlock,
    text,
    packageCssFile,
    snippets: [
      "border: var(--comp-drawer-panel-border-width) solid var(--comp-drawer-panel-border)",
      "animation: drawer-enter var(--comp-drawer-enter-duration) var(--comp-drawer-enter-ease)",
      "gap: var(--comp-drawer-panel-gap)",
      "padding: var(--comp-drawer-panel-padding)",
    ],
    message: "Drawer panel must consume Drawer frame and enter motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-drawer-panel-inline: min(68vw, 42rem)",
      "--comp-drawer-panel-padding: var(--sys-space-xl)",
      "--comp-drawer-title-font-size: var(--component-font-size-title-md)",
    ],
    message: "Drawer sm density must set aliases on the Drawer root.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-drawer-panel-inline: min(82vw, 50rem)",
      "--comp-drawer-panel-gap: var(--sys-space-lg)",
      "--comp-drawer-title-font-size: var(--component-font-size-display-sm)",
    ],
    message: "Drawer lg density must set aliases on the Drawer root.",
  });
  requireIncludes({
    block: closingBlock,
    text,
    packageCssFile,
    snippets: ["animation: drawer-exit var(--comp-drawer-exit-duration) var(--comp-drawer-exit-ease) both"],
    message: "Drawer closing state must consume Drawer exit motion aliases.",
  });
  requireIncludes({
    block: footerBlock,
    text,
    packageCssFile,
    snippets: ["border-block-start: var(--comp-drawer-footer-border-width) solid var(--comp-drawer-footer-border)", "gap: var(--comp-drawer-footer-gap)"],
    message: "Drawer footer must consume Drawer footer aliases.",
  });
  for (const staleSelector of ['.drawer[data-density="sm"] .drawer__panel', '.drawer[data-density="lg"] .drawer__panel']) {
    if (blockFor(blocks, selectorKey, staleSelector)) {
      add("errors", packageCssFile, 1, "Drawer density aliases must live on the root, not on the panel selector.");
    }
  }
}

module.exports = { checkDrawerCssContract };
