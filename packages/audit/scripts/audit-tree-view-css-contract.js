const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkTreeViewCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const treeBlock = blockFor(blocks, selectorKey, ".tree-view");
  const treeSmBlock = blockFor(blocks, selectorKey, ".tree-view[data-density=\"sm\"]");
  const treeLgBlock = blockFor(blocks, selectorKey, ".tree-view[data-density=\"lg\"]");
  const controlBlock = blockFor(blocks, selectorKey, ".tree-view__control,.button.tree-view__control,.tree-view .button.tree-view__control");
  const iconBlock = blockFor(blocks, selectorKey, ".tree-view__control .button__icon,.button.tree-view__control .button__icon,.tree-view .button.tree-view__control .button__icon");
  const itemBlock = blockFor(blocks, selectorKey, ".tree-view__item");
  const hoverBlock = blockFor(blocks, selectorKey, ".tree-view__item:not([data-selected=\"true\"]) .tree-view__control:hover:not(:disabled),.tree-view__item:not([data-selected=\"true\"]) .button.tree-view__control:hover:not(:disabled),.tree-view .tree-view__item:not([data-selected=\"true\"]) .button.tree-view__control:hover:not(:disabled)");

  requireIncludes({
    block: treeBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tree-view-control-min-block: var(--sys-density-control-height)",
      "--comp-tree-view-control-min-block-sm: var(--component-field-control-size-sm)",
      "--comp-tree-view-control-min-block-lg: var(--component-control-min-size)",
      "--comp-tree-view-icon-size: var(--sys-icon-size-md)",
      "--comp-tree-view-hover-bg: var(--sys-energy-surface-primary)",
      "--comp-tree-view-hover-border: var(--sys-energy-border-default)",
      "--comp-tree-view-hover-shadow: 0 0 0 var(--sys-frame-border-thin)",
      "--comp-tree-view-hover-transform: translateX(calc(var(--sys-space-xs) / 2))",
      "--comp-tree-view-motion-duration: var(--component-duration-medium)",
    ],
    message: "TreeView base contract must derive control size from density and compose TreeView/Energy/Momentum aliases.",
  });
  requireIncludes({
    block: treeSmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tree-view-control-min-block: var(--comp-tree-view-control-min-block-sm)",
      "--comp-tree-view-icon-size: var(--comp-tree-view-icon-size-sm)",
    ],
    message: "TreeView sm density must override through TreeView size aliases.",
  });
  requireIncludes({
    block: treeLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tree-view-control-min-block: var(--comp-tree-view-control-min-block-lg)",
      "--comp-tree-view-icon-size: var(--comp-tree-view-icon-size-lg)",
    ],
    message: "TreeView lg density must override through TreeView size aliases.",
  });
  requireIncludes({
    block: controlBlock,
    text,
    packageCssFile,
    snippets: [
      "min-block-size: var(--comp-tree-view-control-min-block)",
      "border-radius: var(--sys-frame-radius-container)",
      "font-weight: var(--sys-voice-weight-bold)",
    ],
    message: "TreeView controls must consume component aliases and foundation tokens instead of local button geometry.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-tree-view-icon-size)",
      "transform var(--comp-tree-view-motion-duration) var(--comp-tree-view-chevron-ease)",
    ],
    message: "TreeView icons must inherit the current TreeView icon size and Momentum aliases.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: ["transition: margin-inline-start var(--comp-tree-view-motion-duration) var(--comp-tree-view-motion-ease)"],
    message: "TreeView indentation motion must stay tokenized through the TreeView contract.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-tree-view-hover-bg)",
      "border-color: var(--comp-tree-view-hover-border)",
      "box-shadow: var(--comp-tree-view-hover-shadow)",
      "transform: var(--comp-tree-view-hover-transform)",
    ],
    message: "TreeView hover treatment must consume component aliases instead of inline decoration.",
  });
  if (/--comp-tree-view-(?:control-min-block|icon-size):\s*var\(--comp-button-(?:size|icon-size)-sm\)/.test(treeBlock?.body ?? "")) {
    add("errors", packageCssFile, lineNumber(text, treeBlock.index), "TreeView root must not bake sm as the default; base size comes from density.");
  }
}

module.exports = { checkTreeViewCssContract };
