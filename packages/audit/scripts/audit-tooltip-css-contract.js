const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkTooltipCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".tooltip");
  const smBlock = blockFor(blocks, selectorKey, ".tooltip[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".tooltip[data-density=\"lg\"]");
  const triggerBlock = blockFor(blocks, selectorKey, ".tooltip__trigger");
  const bubbleBlock = blockFor(blocks, selectorKey, ".tooltip__bubble");
  const openBlock = blockFor(blocks, selectorKey, ".tooltip:hover .tooltip__bubble,.tooltip:focus-within .tooltip__bubble,.tooltip[data-open=\"true\"] .tooltip__bubble");
  const leftOpenBlock = blockFor(blocks, selectorKey, ".tooltip[data-placement=\"left\"]:hover .tooltip__bubble,.tooltip[data-placement=\"left\"]:focus-within .tooltip__bubble,.tooltip[data-placement=\"left\"][data-open=\"true\"] .tooltip__bubble");
  const rightOpenBlock = blockFor(blocks, selectorKey, ".tooltip[data-placement=\"right\"]:hover .tooltip__bubble,.tooltip[data-placement=\"right\"]:focus-within .tooltip__bubble,.tooltip[data-placement=\"right\"][data-open=\"true\"] .tooltip__bubble");
  const localTriggerSize = /--comp-tooltip-trigger-min-block-(?:sm|md|lg):\s*(?:calc\(var\(--component-control-min-size\)[^;]+|var\(--component-control-min-size\));/.exec(text);
  if (localTriggerSize) {
    add("errors", packageCssFile, lineNumber(text, localTriggerSize.index), "Tooltip trigger heights must flow through shared inline trigger Frame roles instead of local control-size calculations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tooltip-trigger-min-block-sm:",
      "--comp-tooltip-trigger-min-block-md:",
      "--comp-tooltip-trigger-min-block-lg:",
      "--comp-tooltip-trigger-min-block-sm: var(--component-inline-trigger-min-block-size-sm)",
      "--comp-tooltip-trigger-min-block-md: var(--component-inline-trigger-min-block-size-md)",
      "--comp-tooltip-trigger-min-block-lg: var(--component-inline-trigger-min-block-size-lg)",
      "--comp-tooltip-bubble-min-inline-sm:",
      "--comp-tooltip-bubble-min-inline-md:",
      "--comp-tooltip-bubble-min-inline-lg:",
      "--comp-tooltip-bubble-depth: var(--component-depth-tooltip)",
      "--comp-tooltip-bubble-z-index: var(--component-overlay-panel-z-index)",
      "--comp-tooltip-scale-closed: var(--component-scale-enter)",
      "--comp-tooltip-scale-open: var(--component-scale-none)",
      "--comp-tooltip-open-transform-y:",
      "--comp-tooltip-open-transform-x:",
    ],
    message: "Tooltip root must expose component-owned density, size, and open-transform aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tooltip-trigger-min-block: var(--comp-tooltip-trigger-min-block-sm)",
      "--comp-tooltip-trigger-padding-x: var(--comp-tooltip-trigger-padding-x-sm)",
      "--comp-tooltip-bubble-min-inline: var(--comp-tooltip-bubble-min-inline-sm)",
    ],
    message: "Tooltip sm density must resolve through Tooltip aliases, not Button aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tooltip-trigger-min-block: var(--comp-tooltip-trigger-min-block-lg)",
      "--comp-tooltip-trigger-padding-x: var(--comp-tooltip-trigger-padding-x-lg)",
      "--comp-tooltip-bubble-min-inline: var(--comp-tooltip-bubble-min-inline-lg)",
    ],
    message: "Tooltip lg density must resolve through Tooltip aliases, not Button aliases.",
  });
  for (const [block, snippet, message] of [
    [openBlock, "transform: var(--comp-tooltip-open-transform-y)", "Tooltip top/bottom open transform must consume its component alias."],
    [leftOpenBlock, "transform: var(--comp-tooltip-open-transform-x)", "Tooltip left open transform must consume its component alias."],
    [rightOpenBlock, "transform: var(--comp-tooltip-open-transform-x)", "Tooltip right open transform must consume its component alias."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets: [snippet], message });
  }
  requireIncludes({
    block: triggerBlock,
    text,
    packageCssFile,
    snippets: ["box-sizing: border-box", "min-block-size: var(--comp-tooltip-trigger-min-block)"],
    message: "Tooltip trigger must keep exact inline-trigger frame behavior through border-box sizing.",
  });
  requireIncludes({
    block: bubbleBlock,
    text,
    packageCssFile,
    snippets: [
      "box-shadow: var(--comp-tooltip-bubble-depth)",
      "box-sizing: border-box",
      "z-index: var(--comp-tooltip-bubble-z-index)",
    ],
    message: "Tooltip bubble must consume governed bubble depth/z-index aliases and border-box sizing.",
  });

  for (const stale of ["--button-size-", "--button-padding-", "scale(1)", "0.92", "13.75rem", "12rem", "15rem"]) {
    if (rootBlock?.body.includes(stale) || smBlock?.body.includes(stale) || lgBlock?.body.includes(stale) || openBlock?.body.includes(stale) || leftOpenBlock?.body.includes(stale) || rightOpenBlock?.body.includes(stale)) {
      add("errors", packageCssFile, 1, `Tooltip CSS must not use stale hardcoded or Button-owned alias "${stale}".`);
    }
  }
}

module.exports = { checkTooltipCssContract };
