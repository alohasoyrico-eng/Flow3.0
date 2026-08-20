const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkPopoverCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".popover");
  const openBlock = blockFor(blocks, selectorKey, ".popover[data-open=\"true\"]");
  const panelBlock = blockFor(blocks, selectorKey, ".popover__panel");
  const warningBlock = blockFor(blocks, selectorKey, ".popover[data-state=\"warning\"] .popover__panel");
  const titleBlock = blockFor(blocks, selectorKey, ".popover__panel strong");
  const bodyBlock = blockFor(blocks, selectorKey, ".popover__panel p");
  const actionsBlock = blockFor(blocks, selectorKey, ".popover__actions");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-popover-panel-bg: var(--component-overlay-panel-bg)",
      "--comp-popover-panel-border-width: var(--component-border-width)",
      "--comp-popover-panel-border: var(--component-overlay-panel-border)",
      "--comp-popover-panel-radius: var(--component-overlay-panel-radius)",
      "--comp-popover-panel-depth: var(--component-overlay-panel-depth)",
      "--comp-popover-panel-offset: var(--component-overlay-panel-offset)",
      "--comp-popover-panel-z-index: var(--component-overlay-panel-z-index)",
      "--comp-popover-enter-ease: var(--component-ease-enter)",
      "--comp-popover-title-family: var(--component-font-family-title)",
      "--comp-popover-body-fg: var(--component-color-text-muted)",
    ],
    message: "Popover root must own panel frame, surface, depth, voice, and enter motion aliases.",
  });
  requireIncludes({
    block: openBlock,
    text,
    packageCssFile,
    snippets: ["z-index: var(--comp-popover-panel-z-index)"],
    message: "Popover open state must consume the Popover z-index alias.",
  });
  requireIncludes({
    block: panelBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: popover-enter var(--comp-popover-enter-duration) var(--comp-popover-enter-ease) both",
      "background: var(--comp-popover-panel-bg)",
      "border: var(--comp-popover-panel-border-width) solid var(--comp-popover-panel-border)",
      "box-sizing: border-box",
      "box-shadow: var(--comp-popover-panel-depth)",
      "color: var(--comp-popover-panel-fg)",
      "z-index: var(--comp-popover-panel-z-index)",
    ],
    message: "Popover panel must consume Popover frame, surface, depth, and motion aliases.",
  });
  requireIncludes({
    block: warningBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-popover-panel-border-warning)"],
    message: "Popover warning state must consume the Popover warning border alias.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: ["font-family: var(--comp-popover-title-family)", "font-weight: var(--comp-popover-title-weight)"],
    message: "Popover title must consume Popover voice aliases.",
  });
  requireIncludes({
    block: bodyBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-popover-body-fg)", "line-height: var(--comp-popover-body-line-height)"],
    message: "Popover body copy must consume Popover voice/color aliases.",
  });
  requireIncludes({
    block: actionsBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-popover-actions-gap)", "padding-block-start: var(--comp-popover-actions-padding-block-start)"],
    message: "Popover actions must consume Popover action layout aliases.",
  });
}

module.exports = { checkPopoverCssContract };
