const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkSliderCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".slider");
  const smBlock = blockFor(blocks, selectorKey, ".slider[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".slider[data-density=\"lg\"]");
  const labelBlock = blockFor(blocks, selectorKey, ".slider__label");
  const valueBlock = blockFor(blocks, selectorKey, ".slider__value");
  const trackBlock = blocks.find((block) => selectorKey(block).replace(/\s+/g, "") === ".slider__track,.slider__fill");
  const trackOnlyBlock = blockFor(blocks, selectorKey, ".slider__track");
  const fillBlock = blockFor(blocks, selectorKey, ".slider__fill");
  const thumbBlock = blockFor(blocks, selectorKey, ".slider__thumb");
  const controlBlock = blockFor(blocks, selectorKey, ".slider__control");
  const inputBlock = blockFor(blocks, selectorKey, ".slider__input");
  const inputFocusBlock = blockFor(blocks, selectorKey, ".slider__input:focus-visible");
  const inputActiveBlock = blockFor(blocks, selectorKey, ".slider__input:active");
  const activeValueBlock = blocks.find((block) => selectorKey(block).includes(".slider:focus-within .slider__value"));
  const hoverThumbBlock = blocks.find((block) => selectorKey(block).includes(".slider[data-state=\"hover\"] .slider__thumb"));
  const focusThumbBlock = blocks.find((block) => selectorKey(block).includes(".slider[data-state=\"focus\"] .slider__thumb"));
  const pressedFillBlock = blocks.find((block) => selectorKey(block).includes(".slider[data-state=\"pressed\"] .slider__fill"));
  const pressedThumbBlock = blocks.find((block) => selectorKey(block).includes(".slider[data-dragging=\"true\"] .slider__thumb"));
  const disabledBlock = blockFor(blocks, selectorKey, ".slider[data-state=\"disabled\"]");
  const disabledInputBlock = blockFor(blocks, selectorKey, ".slider[data-state=\"disabled\"] .slider__input");

  if (/\.tooltip__trigger:focus-visible,\s*\.slider__input:focus-visible/m.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".slider__input:focus-visible")), "Slider input focus must not live in the shared Tooltip focus block.");
  }
  if (/\.slider\[data-pct=/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".slider[data-pct=")), "Slider percentage must flow through --comp-slider-percent instead of generated data-pct CSS rules.");
  }
  if (text.includes("--comp-slider-touch-size: var(--component-control-min-size);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-slider-touch-size: var(--component-control-min-size);")), "Slider touch target must route through --component-slider-touch-size-* aliases, not the global control size directly.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-slider-fg: var(--component-color-text)",
      "--comp-slider-track-size: var(--component-slider-track-size-md)",
      "--comp-slider-touch-size: var(--component-slider-touch-size-md)",
      "--comp-slider-label-font-size: var(--component-density-label-size-md)",
      "--comp-slider-value-font-size: var(--component-density-value-size-md)",
      "--comp-slider-thumb-border-width: calc(var(--component-border-width) * 3)",
      "--comp-slider-focus-ring-width: var(--component-focus-ring-width)",
      "--comp-slider-thumb-hover-halo:",
      "--comp-slider-thumb-pressed-halo:",
      "--comp-slider-thumb-hover-transform: var(--component-transform-center-raised)",
      "--comp-slider-thumb-focus-transform: var(--component-transform-center-raised)",
      "--comp-slider-thumb-pressed-transform:",
      "--comp-slider-fill-transition:",
      "--comp-slider-thumb-transition:",
      "--comp-slider-value-transition:",
      "color: var(--comp-slider-fg)",
      "gap: var(--comp-slider-gap)",
    ],
    message: "Slider root must own frame, density, voice, focus, state, and motion aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-slider-track-size: var(--component-slider-track-size-sm)",
      "--comp-slider-touch-size: var(--component-slider-touch-size-sm)",
      "--comp-slider-gap: var(--component-space-xs)",
      "--comp-slider-label-font-size: var(--component-density-label-size-sm)",
      "--comp-slider-value-font-size: var(--component-density-value-size-sm)",
    ],
    message: "Slider sm density must scale through Slider aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-slider-track-size: var(--component-slider-track-size-lg)",
      "--comp-slider-touch-size: var(--component-slider-touch-size-lg)",
      "--comp-slider-gap: var(--component-space-md)",
      "--comp-slider-label-font-size: var(--component-density-label-size-lg)",
      "--comp-slider-value-font-size: var(--component-density-value-size-lg)",
    ],
    message: "Slider lg density must scale through Slider aliases.",
  });
  requireIncludes({
    block: labelBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-slider-label-font-size)", "font-weight: var(--comp-slider-label-font-weight)"],
    message: "Slider label must consume Slider voice aliases.",
  });
  requireIncludes({
    block: valueBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-slider-value-fg)", "font-family: var(--comp-slider-value-font-family)", "font-size: var(--comp-slider-value-font-size)", "transition: var(--comp-slider-value-transition)"],
    message: "Slider value must consume Slider voice and motion aliases.",
  });
  requireIncludes({
    block: trackBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-slider-track-size)", "border-radius: var(--comp-slider-track-radius)"],
    message: "Slider track and fill must consume Slider track geometry aliases.",
  });
  requireIncludes({
    block: trackOnlyBlock,
    text,
    packageCssFile,
    snippets: ["box-shadow: var(--comp-slider-track-depth)"],
    message: "Slider track depth must consume the Slider depth alias.",
  });
  requireIncludes({
    block: fillBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-slider-fill-color)", "inline-size: var(--comp-slider-percent)", "transform: var(--component-transform-y-center) var(--comp-slider-fill-hover-transform)", "transition: var(--comp-slider-fill-transition)"],
    message: "Slider fill must consume the Slider fill color, percentage, transform, and motion contracts.",
  });
  requireIncludes({
    block: controlBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-slider-touch-size)", "box-sizing: border-box"],
    message: "Slider control must keep the touch frame exact through border-box sizing.",
  });
  requireIncludes({
    block: thumbBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-slider-thumb-bg)",
      "box-sizing: border-box",
      "box-shadow: var(--comp-slider-thumb-halo), var(--comp-slider-thumb-depth)",
      "inset-inline-start: var(--comp-slider-percent)",
      "transform: var(--comp-slider-thumb-transform)",
      "transition: var(--comp-slider-thumb-transition)",
    ],
    message: "Slider thumb must consume Slider surface, depth, percentage, transform, and motion aliases.",
  });
  requireIncludes({
    block: inputBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-slider-input-bg)", "cursor: var(--comp-slider-input-cursor)"],
    message: "Slider input must consume Slider input aliases.",
  });
  requireIncludes({
    block: inputFocusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-slider-focus-ring-width) solid var(--comp-slider-focus-ring-color)", "outline-offset: var(--comp-slider-focus-ring-offset)"],
    message: "Slider input focus must consume Slider focus aliases.",
  });
  requireIncludes({
    block: activeValueBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-slider-value-active-fg)"],
    message: "Slider active value must consume Slider state color alias.",
  });
  requireIncludes({
    block: inputActiveBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-slider-input-active-cursor)"],
    message: "Slider active input cursor must consume Slider cursor alias.",
  });
  requireIncludes({
    block: hoverThumbBlock,
    text,
    packageCssFile,
    snippets: [
      "box-shadow: var(--comp-slider-thumb-hover-halo), var(--comp-slider-thumb-raised-depth)",
      "transform: var(--comp-slider-thumb-hover-transform)",
    ],
    message: "Slider hover thumb must use a distinct tokenized hover halo and transform without focus ring.",
  });
  requireIncludes({
    block: focusThumbBlock,
    text,
    packageCssFile,
    snippets: [
      "box-shadow: var(--comp-slider-thumb-halo), var(--comp-slider-thumb-raised-depth)",
      "outline: var(--comp-slider-focus-ring-width) solid var(--comp-slider-focus-ring-color)",
      "transform: var(--comp-slider-thumb-focus-transform)",
    ],
    message: "Slider focus thumb must keep a distinct focus ring and transform.",
  });
  requireIncludes({
    block: pressedFillBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--component-transform-y-center) var(--comp-slider-fill-pressed-transform)"],
    message: "Slider pressed fill must use tokenized pressed momentum.",
  });
  requireIncludes({
    block: pressedThumbBlock,
    text,
    packageCssFile,
    snippets: [
      "box-shadow: var(--comp-slider-thumb-pressed-halo), var(--comp-slider-thumb-raised-depth)",
      "outline: var(--comp-slider-focus-ring-width) solid var(--comp-slider-focus-ring-color)",
      "transform: var(--comp-slider-thumb-pressed-transform)",
    ],
    message: "Slider pressed/dragging thumb must consume Slider depth, focus, and pressed transform aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-slider-disabled-cursor)", "opacity: var(--comp-slider-disabled-opacity)"],
    message: "Slider disabled state must consume Slider disabled aliases.",
  });
  requireIncludes({
    block: disabledInputBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-slider-input-disabled-cursor)"],
    message: "Slider disabled input must consume Slider disabled input alias.",
  });
}

module.exports = { checkSliderCssContract };
