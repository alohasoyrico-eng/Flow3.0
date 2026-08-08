const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkListCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".list");
  const densitySmBlock = blockFor(blocks, selectorKey, ".list[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".list[data-density=\"lg\"]");
  const rowBlock = blockFor(blocks, selectorKey, ".list__row");
  const itemBlock = blockFor(blocks, selectorKey, ".list__item");
  const buttonBlock = blockFor(blocks, selectorKey, ".list__item:is(button)");
  const focusBlock = blockFor(blocks, selectorKey, ".list__item:is(button):focus-visible");
  const selectedBlock = blockFor(blocks, selectorKey, ".list__item[data-state=\"selected\"]");
  const disabledBlock = blocks.find((block) => block.selector.includes(".list__item:disabled"));
  const iconBlock = blockFor(blocks, selectorKey, ".list__icon");
  const rowDividerBlock = blockFor(blocks, selectorKey, ".list__row + .list__row");
  const contentBlock = blockFor(blocks, selectorKey, ".list__content");
  const metaBlock = blocks.find((block) => block.selector.includes(".list__content small") && block.selector.includes(".list__value"));
  const valueBlock = blockFor(blocks, selectorKey, ".list__value");

  if (/--list-/.test(rootBlock?.body ?? "")) {
    add("errors", packageCssFile, lineNumber(text, rootBlock.index), "List must not create parallel --list-* runtime aliases; use --comp-list-* aliases.");
  }
  for (const density of ["sm", "md", "lg"]) {
    const directFrameHeight = `--comp-list-item-min-block-${density}: var(--sys-frame-height-control-${density});`;
    if (text.includes(directFrameHeight)) {
      add("errors", packageCssFile, lineNumber(text, text.indexOf(directFrameHeight)), "List item block sizes must route through --component-list-item-min-block-* aliases.");
    }
    const componentAlias = `--comp-list-item-min-block-${density}: var(--component-list-item-min-block-${density});`;
    if (!text.includes(componentAlias)) {
      add("errors", packageCssFile, 1, `List ${density} item block size must consume --component-list-item-min-block-${density}.`);
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-list-border-width: var(--component-border-width)",
      "--comp-list-current-item-padding: var(--comp-list-item-padding-md)",
      "--comp-list-current-item-gap: var(--comp-list-item-gap-md)",
      "--comp-list-current-item-min-block: var(--comp-list-item-min-block-md)",
      "--comp-list-current-icon-size: var(--comp-list-icon-size-md)",
      "--comp-list-current-icon-box-size: var(--comp-list-icon-box-size-md)",
      "--comp-list-current-meta-size: var(--comp-list-meta-size-md)",
      "--comp-list-interactive-cursor: pointer",
      "--comp-list-item-border-width: 0",
      "--comp-list-item-inline-size: 100%",
      "border: var(--comp-list-border-width) solid var(--comp-list-border)",
    ],
    message: "List root must own density, frame, interaction, and voice aliases as --comp-list-*.",
  });
  requireIncludes({
    block: densitySmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-list-current-item-padding: var(--comp-list-item-padding-sm)",
      "--comp-list-current-item-gap: var(--comp-list-item-gap-sm)",
      "--comp-list-current-item-min-block: var(--comp-list-item-min-block-sm)",
      "--comp-list-current-icon-size: var(--comp-list-icon-size-sm)",
      "--comp-list-current-icon-box-size: var(--comp-list-icon-box-size-sm)",
      "--comp-list-current-meta-size: var(--comp-list-meta-size-sm)",
    ],
    message: "List small density must set component aliases, not private --list-* aliases.",
  });
  requireIncludes({
    block: densityLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-list-current-item-padding: var(--comp-list-item-padding-lg)",
      "--comp-list-current-item-gap: var(--comp-list-item-gap-lg)",
      "--comp-list-current-item-min-block: var(--comp-list-item-min-block-lg)",
      "--comp-list-current-icon-size: var(--comp-list-icon-size-lg)",
      "--comp-list-current-icon-box-size: var(--comp-list-icon-box-size-lg)",
      "--comp-list-current-meta-size: var(--comp-list-meta-size-lg)",
    ],
    message: "List large density must set component aliases, not private --list-* aliases.",
  });
  requireIncludes({
    block: rowBlock,
    text,
    packageCssFile,
    snippets: ["margin: var(--comp-list-row-margin)"],
    message: "List row spacing must consume a List alias.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: [
      "border: var(--comp-list-item-border-width)",
      "border-radius: var(--comp-list-item-radius)",
      "display: var(--comp-list-item-display)",
      "gap: var(--comp-list-current-item-gap)",
      "grid-template-columns: var(--comp-list-item-grid-template)",
      "inline-size: var(--comp-list-item-inline-size)",
      "min-block-size: var(--comp-list-current-item-min-block)",
      "padding: var(--comp-list-current-item-padding)",
      "text-align: var(--comp-list-item-text-align)",
    ],
    message: "List item layout must consume List frame/density aliases.",
  });
  requireIncludes({
    block: buttonBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-list-interactive-cursor)", "font: inherit"],
    message: "List interactive item must consume List interaction alias.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-list-focus-width) solid var(--comp-list-focus-color)"],
    message: "List focus state must consume List accessibility aliases.",
  });
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-list-selected-bg)", "box-shadow: inset var(--comp-list-focus-width) 0 0 var(--comp-list-selected-accent)"],
    message: "List selected state must consume List state aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-list-disabled-cursor)", "opacity: var(--comp-list-disabled-opacity)"],
    message: "List disabled state must consume List state aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-list-current-icon-box-size)",
      "display: var(--comp-list-icon-display)",
      "font-size: var(--comp-list-current-icon-size)",
      "inline-size: var(--comp-list-current-icon-box-size)",
      "line-height: var(--comp-list-icon-line-height)",
    ],
    message: "List icon geometry must consume List icon aliases.",
  });
  requireIncludes({
    block: rowDividerBlock,
    text,
    packageCssFile,
    snippets: ["border-block-start: var(--comp-list-border-width) solid var(--comp-list-border)"],
    message: "List row divider must consume List border alias.",
  });
  requireIncludes({
    block: contentBlock,
    text,
    packageCssFile,
    snippets: ["display: var(--comp-list-content-display)", "gap: var(--comp-list-content-gap)"],
    message: "List content rhythm must consume List content aliases.",
  });
  requireIncludes({
    block: metaBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-list-muted-fg)", "font-size: var(--comp-list-current-meta-size)"],
    message: "List metadata text must consume List voice aliases.",
  });
  requireIncludes({
    block: valueBlock,
    text,
    packageCssFile,
    snippets: ["font-weight: var(--comp-list-value-weight)"],
    message: "List value text must consume List voice alias.",
  });
}

module.exports = { checkListCssContract };
