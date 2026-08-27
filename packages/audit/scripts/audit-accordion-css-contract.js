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
  const smBlock = blockFor(blocks, selectorKey, ".accordion[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".accordion[data-density=\"lg\"]");
  const flatBlock = blockFor(blocks, selectorKey, ".accordion[data-surface=\"flat\"]");
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
  const localTriggerSize = /--comp-accordion-trigger-min-block:\s*calc\(var\(--component-control-min-size\)[^;]+;/.exec(text);
  if (localTriggerSize) {
    add("errors", packageCssFile, lineNumber(text, localTriggerSize.index), "Accordion trigger height must flow through shared disclosure Frame roles instead of local control-size calculations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-accordion-bg: var(--component-color-surface)",
      "--comp-accordion-border-width: var(--component-border-width)",
      "--comp-accordion-trigger-min-block: var(--component-disclosure-trigger-min-block-size-md)",
      "--comp-accordion-trigger-font-weight: var(--component-font-weight-bold)",
      "--comp-accordion-trigger-font-size-sm: var(--component-density-label-size-sm)",
      "--comp-accordion-trigger-font-size-md: var(--component-density-label-size-md)",
      "--comp-accordion-trigger-font-size-lg: var(--component-density-label-size-lg)",
      "--comp-accordion-trigger-font-size: var(--comp-accordion-trigger-font-size-md)",
      "--comp-accordion-panel-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-accordion-panel-font-size-md: var(--component-density-helper-size-md)",
      "--comp-accordion-panel-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-accordion-panel-font-size: var(--comp-accordion-panel-font-size-md)",
      "--comp-accordion-icon-size-sm: var(--component-density-icon-size-sm)",
      "--comp-accordion-icon-size-md: var(--component-density-icon-size-md)",
      "--comp-accordion-icon-size-lg: var(--component-density-icon-size-lg)",
      "--comp-accordion-icon-size: var(--comp-accordion-icon-size-md)",
      "--comp-accordion-meta-font-size-sm: var(--component-density-helper-size-sm)",
      "--comp-accordion-meta-font-size-md: var(--component-density-helper-size-md)",
      "--comp-accordion-meta-font-size-lg: var(--component-density-helper-size-lg)",
      "--comp-accordion-meta-font-size: var(--comp-accordion-meta-font-size-md)",
      "--comp-accordion-chevron-size-sm: var(--component-density-icon-size-sm)",
      "--comp-accordion-chevron-size-md: var(--component-density-icon-size-md)",
      "--comp-accordion-chevron-size-lg: var(--component-density-icon-size-lg)",
      "--comp-accordion-chevron-size: var(--comp-accordion-chevron-size-md)",
      "--comp-accordion-focus-ring: var(--component-focus-ring)",
      "--comp-accordion-motion-ease: var(--component-ease-move)",
      "background: var(--comp-accordion-bg)",
      "border: var(--comp-accordion-border-width) solid var(--comp-accordion-border)",
    ],
    message: "Accordion root must own frame, trigger, voice, focus, density, and motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-accordion-trigger-min-block: var(--component-disclosure-trigger-min-block-size-sm)",
      "--comp-accordion-trigger-font-size: var(--comp-accordion-trigger-font-size-sm)",
      "--comp-accordion-panel-font-size: var(--comp-accordion-panel-font-size-sm)",
      "--comp-accordion-icon-size: var(--comp-accordion-icon-size-sm)",
      "--comp-accordion-meta-font-size: var(--comp-accordion-meta-font-size-sm)",
      "--comp-accordion-chevron-size: var(--comp-accordion-chevron-size-sm)",
    ],
    message: "Accordion sm density must use the shared small disclosure trigger Frame role.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-accordion-trigger-min-block: var(--component-disclosure-trigger-min-block-size-lg)",
      "--comp-accordion-trigger-font-size: var(--comp-accordion-trigger-font-size-lg)",
      "--comp-accordion-panel-font-size: var(--comp-accordion-panel-font-size-lg)",
      "--comp-accordion-icon-size: var(--comp-accordion-icon-size-lg)",
      "--comp-accordion-meta-font-size: var(--comp-accordion-meta-font-size-lg)",
      "--comp-accordion-chevron-size: var(--comp-accordion-chevron-size-lg)",
    ],
    message: "Accordion lg density must use the shared large disclosure trigger Frame role.",
  });
  requireIncludes({
    block: flatBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-accordion-bg: var(--component-surface-transparent)",
      "--comp-accordion-border-width: var(--component-border-width-none)",
      "--comp-accordion-depth: var(--component-depth-none)",
      "--comp-accordion-radius: var(--component-radius-none)",
      "--comp-accordion-trigger-bg: var(--component-surface-transparent)",
      "overflow: visible",
    ],
    message: "Accordion flat surface must remove nested elevation through shared surface, border, depth, and radius tokens.",
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
    snippets: [
      "color: var(--comp-accordion-meta-fg)",
      "font-size: var(--comp-accordion-meta-font-size)",
      "font-weight: var(--comp-accordion-meta-font-weight)",
    ],
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
