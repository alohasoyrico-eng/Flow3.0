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
      "--comp-drawer-panel-inline: var(--component-drawer-panel-inline-md)",
      "--comp-drawer-panel-padding:",
      "--comp-drawer-footer-border-width: var(--component-border-width)",
      "--comp-drawer-z-index: var(--component-z-dialog)",
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
      "inline-size: min(var(--comp-drawer-panel-inline), 92vw)",
      "padding: var(--comp-drawer-panel-padding)",
    ],
    message: "Drawer panel must consume Drawer frame and enter motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-drawer-panel-inline: var(--component-drawer-panel-inline-sm)",
      "--comp-drawer-panel-padding: var(--component-space-xl)",
      "--comp-drawer-title-font-size: var(--component-font-size-title-md)",
    ],
    message: "Drawer sm density must set aliases on the Drawer root.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-drawer-panel-inline: var(--component-drawer-panel-inline-lg)",
      "--comp-drawer-panel-gap: var(--component-space-lg)",
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
  if (/--comp-drawer-z-index:\s*var\(--component-z-dialog,\s*\d+\)/.test(text) || /z-index:\s*var\(--component-z-dialog,\s*\d+\)/.test(text) || /--comp-drawer-z-index:\s*var\(--sys-depth-z-dialog,\s*\d+\)/.test(text) || /z-index:\s*var\(--sys-depth-z-dialog,\s*\d+\)/.test(text)) {
    add("errors", packageCssFile, 1, "Drawer z-index must come directly from Depth tokens without literal fallbacks.");
  }
  const rawPanelInline = text.match(/--comp-drawer-panel-inline:\s*min\([^;]*(?:rem|vw)/);
  if (rawPanelInline) {
    add("errors", packageCssFile, lineNumber(text, rawPanelInline.index), "Drawer panel inline sizes must flow through Frame drawer content roles instead of local viewport/rem values.");
  }
}

module.exports = { checkDrawerCssContract };
