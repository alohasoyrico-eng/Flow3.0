const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkMovementRowCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".movement-row");
  const compactBlock = blocks.find((block) => block.selector.includes(".movement-row[data-variant=\"compact\"]"));
  const densityLgBlock = blockFor(blocks, selectorKey, ".movement-row[data-density=\"lg\"]");
  const fuelBlock = blockFor(blocks, selectorKey, ".movement-row[data-category=\"fuel\"]");
  const successBlock = blocks.find((block) => block.selector.includes(".movement-row[data-category=\"charge\"]"));
  const tollBlock = blockFor(blocks, selectorKey, ".movement-row[data-category=\"toll\"]");
  const dangerBlock = blocks.find((block) => block.selector.includes(".movement-row[data-state=\"error\"]"));
  const disabledBlock = blocks.find((block) => block.selector.includes(".movement-row[data-state=\"disabled\"]"));
  const iconBlock = blockFor(blocks, selectorKey, ".movement-row__icon");
  const valueBlock = blockFor(blocks, selectorKey, ".movement-row__value");
  const contentBlock = blockFor(blocks, selectorKey, ".movement-row__content");
  const titleBlock = blockFor(blocks, selectorKey, ".movement-row__content strong");
  const amountBlock = blockFor(blocks, selectorKey, ".movement-row__value strong");
  const statusBlock = blockFor(blocks, selectorKey, ".movement-row .movement-row__value > .movement-row__status");

  if (/--movement-row-/.test(rootBlock?.body ?? "")) {
    add("errors", packageCssFile, lineNumber(text, rootBlock.index), "MovementRow must not create parallel --movement-row-* aliases; use --comp-movement-row-* aliases.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-movement-row-border-width: 0",
      "--comp-movement-row-current-gap: var(--comp-movement-row-gap-md)",
      "--comp-movement-row-current-icon-bg: var(--comp-movement-row-icon-bg)",
      "--comp-movement-row-current-icon-fg: var(--comp-movement-row-icon-fg)",
      "--comp-movement-row-current-min-block-size: var(--comp-movement-row-min-block-size-md)",
      "--comp-movement-row-current-padding-block: var(--comp-movement-row-padding-block-md)",
      "--comp-movement-row-current-padding-inline: var(--comp-movement-row-padding-inline)",
      "--comp-movement-row-interactive-cursor: pointer",
      "border: var(--comp-movement-row-border-width)",
      "cursor: var(--comp-movement-row-interactive-cursor)",
      "display: var(--comp-movement-row-display)",
      "gap: var(--comp-movement-row-current-gap)",
      "grid-template-columns: var(--comp-movement-row-grid-template)",
      "min-block-size: var(--comp-movement-row-current-min-block-size)",
      "padding: var(--comp-movement-row-current-padding-block) var(--comp-movement-row-current-padding-inline)",
      "text-align: var(--comp-movement-row-text-align)",
    ],
    message: "MovementRow root must own frame, density, icon, layout, and interaction aliases as --comp-movement-row-*.",
  });
  requireIncludes({
    block: compactBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-movement-row-current-gap: var(--comp-movement-row-gap-sm)",
      "--comp-movement-row-current-min-block-size: var(--comp-movement-row-min-block-size-sm)",
      "--comp-movement-row-current-padding-block: var(--comp-movement-row-padding-block-sm)",
    ],
    message: "MovementRow compact/small density must set component aliases.",
  });
  requireIncludes({
    block: densityLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-movement-row-current-gap: var(--comp-movement-row-gap-lg)",
      "--comp-movement-row-current-min-block-size: var(--comp-movement-row-min-block-size-lg)",
      "--comp-movement-row-current-padding-block: var(--comp-movement-row-padding-block-lg)",
    ],
    message: "MovementRow large density must set component aliases.",
  });
  for (const [block, message] of [
    [fuelBlock, "MovementRow fuel category must set current icon aliases."],
    [successBlock, "MovementRow success/refund categories must set current icon aliases."],
    [tollBlock, "MovementRow toll category must set current icon aliases."],
    [dangerBlock, "MovementRow error/declined category must set current icon aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: ["--comp-movement-row-current-icon-bg:", "--comp-movement-row-current-icon-fg:"],
      message,
    });
  }
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-movement-row-disabled-cursor)", "opacity: var(--comp-movement-row-disabled-opacity)"],
    message: "MovementRow disabled state must consume MovementRow state aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-movement-row-current-icon-bg)",
      "color: var(--comp-movement-row-current-icon-fg)",
      "display: var(--comp-movement-row-icon-display)",
      "justify-content: var(--comp-movement-row-icon-justify)",
    ],
    message: "MovementRow icon must consume current icon aliases.",
  });
  requireIncludes({
    block: valueBlock,
    text,
    packageCssFile,
    snippets: [
      "gap: var(--comp-movement-row-value-gap)",
      "justify-items: var(--comp-movement-row-value-justify)",
      "min-inline-size: var(--comp-movement-row-value-min-inline-size)",
    ],
    message: "MovementRow value column must consume layout aliases.",
  });
  requireIncludes({
    block: contentBlock,
    text,
    packageCssFile,
    snippets: [
      "gap: var(--comp-movement-row-content-gap)",
      "min-inline-size: var(--comp-movement-row-content-min-inline-size)",
    ],
    message: "MovementRow content column must consume layout aliases.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-movement-row-title-size)", "font-weight: var(--comp-movement-row-title-weight)"],
    message: "MovementRow title must consume voice aliases.",
  });
  requireIncludes({
    block: amountBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-movement-row-amount-size)", "font-weight: var(--comp-movement-row-amount-weight)"],
    message: "MovementRow amount must consume voice aliases.",
  });
  requireIncludes({
    block: statusBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-movement-row-status-size)", "padding: var(--comp-movement-row-status-padding)"],
    message: "MovementRow status must consume voice and spacing aliases.",
  });
}

module.exports = { checkMovementRowCssContract };
