const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkAccordionCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".accordion");
  const lgBlock = blockFor(blocks, selectorKey, ".accordion[data-density=\"lg\"]");
  const dividerBlock = blockFor(blocks, selectorKey, ".accordion__item + .accordion__item");
  const triggerBlock = blockFor(blocks, selectorKey, ".accordion__trigger");
  const triggerFocusBlock = blockFor(blocks, selectorKey, ".accordion__trigger:focus-visible");
  const triggerDisabledBlock = blockFor(blocks, selectorKey, ".accordion__trigger:disabled");
  const iconBlock = blockFor(blocks, selectorKey, ".accordion__icon");
  const metaBlock = blockFor(blocks, selectorKey, ".accordion__meta");
  const chevronBlock = blockFor(blocks, selectorKey, ".accordion__chevron");
  const chevronOpenBlock = blockFor(blocks, selectorKey, ".accordion__item[data-open=\"true\"] .accordion__chevron");
  const panelBlock = blockFor(blocks, selectorKey, ".accordion__panel");

  const accordionBlocks = blocks.filter((block) => selectorKey(block).includes(".accordion"));
  const buttonAliasBlock = accordionBlocks.find((block) => block.body.includes("--button-size-"));
  if (buttonAliasBlock) {
    add("errors", packageCssFile, lineNumber(text, buttonAliasBlock.index), "Accordion must not consume Button sizing aliases.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-accordion-bg: var(--sys-color-surface)",
      "--comp-accordion-border-width: var(--component-border-width)",
      "--comp-accordion-trigger-min-block: calc(var(--component-control-min-size)",
      "--comp-accordion-trigger-font-weight: var(--sys-voice-weight-bold)",
      "--comp-accordion-focus-ring: var(--component-focus-ring)",
      "--comp-accordion-motion-ease: var(--component-ease-move)",
      "background: var(--comp-accordion-bg)",
      "border: var(--comp-accordion-border-width) solid var(--comp-accordion-border)",
    ],
    message: "Accordion root must own frame, trigger, voice, focus, density, and motion aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: ["--comp-accordion-trigger-min-block: calc(var(--component-control-min-size)"],
    message: "Accordion lg density must scale from component control size, not Button aliases.",
  });
  requireIncludes({
    block: dividerBlock,
    text,
    packageCssFile,
    snippets: ["border-block-start: var(--comp-accordion-item-divider-width) solid var(--comp-accordion-item-divider)"],
    message: "Accordion item divider must consume Accordion divider aliases.",
  });
  requireIncludes({
    block: triggerBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-accordion-trigger-bg)",
      "color: var(--comp-accordion-trigger-fg)",
      "font-family: var(--comp-accordion-trigger-font-family)",
      "font-weight: var(--comp-accordion-trigger-font-weight)",
      "gap: var(--comp-accordion-trigger-gap)",
      "transition: var(--comp-accordion-trigger-transition)",
    ],
    message: "Accordion trigger must consume Accordion frame, voice, density, and state aliases.",
  });
  requireIncludes({
    block: triggerFocusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-accordion-focus-ring)", "outline-offset: var(--comp-accordion-focus-ring-offset)"],
    message: "Accordion trigger focus must consume Accordion focus aliases.",
  });
  requireIncludes({
    block: triggerDisabledBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-accordion-trigger-disabled-fg)", "opacity: var(--comp-accordion-trigger-disabled-opacity)"],
    message: "Accordion disabled trigger must consume Accordion disabled aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-accordion-icon-fg)", "font-size: var(--comp-accordion-icon-size)"],
    message: "Accordion icon must consume Accordion icon aliases.",
  });
  requireIncludes({
    block: metaBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-accordion-meta-fg)", "font-weight: var(--comp-accordion-meta-font-weight)"],
    message: "Accordion meta must consume Accordion voice aliases.",
  });
  requireIncludes({
    block: chevronBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-accordion-chevron-fg)", "transition: var(--comp-accordion-chevron-transition)"],
    message: "Accordion chevron must consume Accordion motion aliases.",
  });
  requireIncludes({
    block: chevronOpenBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-accordion-chevron-expanded-transform)"],
    message: "Accordion open chevron must consume Accordion state transform alias.",
  });
  requireIncludes({
    block: panelBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-accordion-panel-fg)",
      "font-size: var(--comp-accordion-panel-font-size)",
      "line-height: var(--comp-accordion-panel-line-height)",
      "transition: grid-template-rows var(--comp-accordion-motion-duration) var(--comp-accordion-motion-ease)",
    ],
    message: "Accordion panel must consume Accordion voice and motion aliases.",
  });
}

module.exports = { checkAccordionCssContract };
