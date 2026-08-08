const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkStepperCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".stepper");
  const verticalBlock = blockFor(blocks, selectorKey, ".stepper[data-orientation=\"vertical\"]");
  const smBlock = blockFor(blocks, selectorKey, ".stepper[data-density=\"sm\"]");
  const itemBlock = blockFor(blocks, selectorKey, ".stepper__item");
  const activeItemBlock = blockFor(blocks, selectorKey, ".stepper__item[data-state=\"active\"]");
  const markerBlock = blockFor(blocks, selectorKey, ".stepper__marker");
  const activeMarkerBlock = blockFor(blocks, selectorKey, ".stepper__item[data-state=\"active\"] .stepper__marker");
  const completeMarkerBlock = blockFor(blocks, selectorKey, ".stepper__item[data-state=\"complete\"] .stepper__marker");
  const connectorBlock = blockFor(blocks, selectorKey, ".stepper__connector");
  const completeConnectorBlock = blockFor(blocks, selectorKey, ".stepper__connector[data-state=\"complete\"]");
  const verticalConnectorBlock = blockFor(blocks, selectorKey, ".stepper[data-orientation=\"vertical\"] .stepper__connector");
  const textBlock = blockFor(blocks, selectorKey, ".stepper__text");
  const smallBlock = blockFor(blocks, selectorKey, ".stepper__text small");
  const strongBlock = blockFor(blocks, selectorKey, ".stepper__text strong");
  const strongStateBlock = blocks.find((block) => selectorKey(block).includes(".stepper__item[data-state=\"active\"] .stepper__text strong"));
  const lgBlock = blockFor(blocks, selectorKey, ".stepper[data-density=\"lg\"]");

  const rawCurrentScale = text.match(/--comp-stepper-current-(?:start-|overshoot-)?scale:\s*[0-9.]+/);
  if (rawCurrentScale) {
    add("errors", packageCssFile, lineNumber(text, rawCurrentScale.index), "Stepper current animation scale must flow through component Momentum scale roles instead of raw numbers.");
  }
  const rawStepperSizing = /--comp-stepper-(?:marker-size|text-(?:max|min)-inline):\s*(?:calc\(var\(--component-control-min-size\)[^;]+|var\(--component-control-min-size\));/.exec(text);
  if (rawStepperSizing) {
    add("errors", packageCssFile, lineNumber(text, rawStepperSizing.index), "Stepper marker and text sizing must flow through shared Frame step roles instead of local control-size calculations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-stepper-marker-bg: var(--component-color-surface)",
      "--comp-stepper-marker-size: var(--component-step-marker-size-md)",
      "--comp-stepper-marker-border-width: var(--component-border-width-control)",
      "--comp-stepper-marker-active-bg:",
      "--comp-stepper-connector-bg: var(--component-color-border)",
      "--comp-stepper-label-font-weight: var(--sys-voice-weight-semibold)",
      "--comp-stepper-text-max-inline: var(--component-step-text-max-inline-size)",
      "--comp-stepper-text-min-inline: var(--component-step-text-min-inline-size)",
      "--comp-stepper-current-start-scale: var(--component-scale-current-start)",
      "--comp-stepper-current-overshoot-scale: var(--component-scale-current-overshoot)",
      "--comp-stepper-marker-transition:",
      "--comp-stepper-connector-transition:",
    ],
    message: "Stepper root must own marker, connector, text, state, density, and motion aliases.",
  });
  requireIncludes({
    block: verticalBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-stepper-orientation-gap)"],
    message: "Stepper vertical rhythm must consume the Stepper orientation alias.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-stepper-item-fg)", "gap: var(--comp-stepper-item-gap)"],
    message: "Stepper item must consume Stepper item aliases.",
  });
  requireIncludes({
    block: activeItemBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-stepper-item-active-fg)"],
    message: "Stepper active item must consume Stepper state color alias.",
  });
  requireIncludes({
    block: markerBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-stepper-marker-bg)",
      "border: var(--comp-stepper-marker-border-width) solid var(--comp-stepper-marker-border)",
      "font-family: var(--comp-stepper-marker-font-family)",
      "transition: var(--comp-stepper-marker-transition)",
    ],
    message: "Stepper marker must consume Stepper marker frame, voice, and motion aliases.",
  });
  requireIncludes({
    block: activeMarkerBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: stepper-current-enter var(--comp-stepper-current-duration) var(--comp-stepper-enter-ease) both",
      "background: var(--comp-stepper-marker-active-bg)",
      "box-shadow: var(--comp-stepper-marker-active-depth)",
    ],
    message: "Stepper active marker must consume Stepper active marker aliases.",
  });
  requireIncludes({
    block: completeMarkerBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: stepper-check-enter var(--comp-stepper-complete-duration) var(--comp-stepper-enter-ease) both",
      "background: var(--comp-stepper-marker-complete-bg)",
      "font-family: var(--comp-stepper-marker-complete-font-family)",
    ],
    message: "Stepper complete marker must consume Stepper complete marker aliases.",
  });
  requireIncludes({
    block: connectorBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-stepper-connector-bg)",
      "flex: 1 1 var(--comp-stepper-connector-flex-basis)",
      "transition: var(--comp-stepper-connector-transition)",
    ],
    message: "Stepper connector must consume Stepper connector aliases.",
  });
  requireIncludes({
    block: completeConnectorBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: stepper-connector-fill var(--comp-stepper-connector-duration) var(--comp-stepper-move-ease) both",
      "background: var(--comp-stepper-connector-complete-bg)",
    ],
    message: "Stepper complete connector must consume Stepper complete connector aliases.",
  });
  requireIncludes({
    block: verticalConnectorBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-stepper-connector-vertical-block)", "margin: var(--comp-stepper-connector-vertical-margin-block)"],
    message: "Stepper vertical connector must consume Stepper vertical connector aliases.",
  });
  requireIncludes({
    block: textBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-stepper-text-gap)", "max-inline-size: var(--comp-stepper-text-max-inline)", "min-inline-size: var(--comp-stepper-text-min-inline)"],
    message: "Stepper text layout must consume Stepper text aliases.",
  });
  requireIncludes({
    block: smallBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-stepper-description-fg)", "font-size: var(--comp-stepper-description-size)"],
    message: "Stepper description must consume Stepper description aliases.",
  });
  requireIncludes({
    block: strongBlock,
    text,
    packageCssFile,
    snippets: ["font-weight: var(--comp-stepper-label-font-weight)"],
    message: "Stepper label must consume Stepper label aliases.",
  });
  requireIncludes({
    block: strongStateBlock,
    text,
    packageCssFile,
    snippets: ["font-weight: var(--comp-stepper-label-active-font-weight)"],
    message: "Stepper active/complete label must consume Stepper active label alias.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: ["--comp-stepper-marker-size: var(--component-step-marker-size-sm)"],
    message: "Stepper sm density must use the shared small step marker Frame role.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: ["--comp-stepper-marker-size: var(--component-step-marker-size-lg)", "--comp-stepper-current-scale: var(--component-scale-hover)"],
    message: "Stepper lg density must scale marker through shared Frame and component/foundation aliases.",
  });
}

module.exports = { checkStepperCssContract };
