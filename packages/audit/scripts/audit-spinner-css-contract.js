const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkSpinnerCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const buttonSpinnerBlock = blockFor(blocks, selectorKey, ".button .spinner");
  const rootBlock = blockFor(blocks, selectorKey, ".spinner");
  const svgBlock = blockFor(blocks, selectorKey, ".spinner__svg");
  const strokeBlock = blocks.find((block) => selectorKey(block).replace(/\s+/g, "") === ".spinner__track,.spinner__arc");
  const trackBlock = blockFor(blocks, selectorKey, ".spinner__track");
  const arcBlock = blockFor(blocks, selectorKey, ".spinner__arc");
  const smBlock = blockFor(blocks, selectorKey, ".spinner[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".spinner[data-density=\"lg\"]");
  const successBlock = blockFor(blocks, selectorKey, ".spinner[data-tone=\"success\"]");
  const subtleBlock = blockFor(blocks, selectorKey, ".spinner[data-state=\"subtle\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".spinner[data-state=\"disabled\"]");

  if (text.includes("--spinner-tone")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--spinner-tone")), "Spinner must not use legacy --spinner-tone aliases; use --comp-spinner-tone.");
  }

  requireIncludes({
    block: buttonSpinnerBlock,
    text,
    packageCssFile,
    snippets: ["--comp-spinner-tone: currentColor"],
    message: "Button-hosted Spinner must override the live Spinner component tone alias.",
  });
  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-spinner-size: var(--component-inline-size-sm)",
      "--comp-spinner-tone: var(--component-loading-spinner-tone)",
      "--comp-spinner-track-tone: var(--component-loading-spinner-track)",
      "--comp-spinner-spin-ease: var(--component-loading-easing-linear)",
      "--comp-spinner-rhythm-ease: var(--component-ease-loading-rhythm)",
      "--comp-spinner-disabled-opacity: var(--component-opacity-disabled)",
      "block-size: var(--comp-spinner-size)",
      "inline-size: var(--comp-spinner-size)",
    ],
    message: "Spinner root must own loading, size, tone, state, and motion aliases.",
  });
  requireIncludes({
    block: svgBlock,
    text,
    packageCssFile,
    snippets: ["animation: spinner-spin var(--comp-spinner-spin-cycle) var(--comp-spinner-spin-ease) infinite"],
    message: "Spinner SVG must consume the Spinner continuous motion aliases.",
  });
  requireIncludes({
    block: strokeBlock,
    text,
    packageCssFile,
    snippets: ["stroke-width: var(--comp-spinner-border-width)"],
    message: "Spinner track and arc must consume Spinner stroke geometry aliases.",
  });
  requireIncludes({
    block: trackBlock,
    text,
    packageCssFile,
    snippets: ["stroke: var(--comp-spinner-track-tone)"],
    message: "Spinner track must consume the Spinner track tone alias.",
  });
  requireIncludes({
    block: arcBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: spinner-arc-breathe var(--comp-spinner-rhythm-cycle) var(--comp-spinner-rhythm-ease) infinite alternate",
      "stroke: var(--comp-spinner-tone)",
      "stroke-dasharray: var(--comp-spinner-arc-start)",
    ],
    message: "Spinner arc must consume Spinner tone and loading rhythm aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: ["--comp-spinner-size: var(--component-inline-size-xs)", "--comp-spinner-border-width: var(--sys-frame-border-medium)"],
    message: "Spinner sm density must scale through Spinner aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: ["--comp-spinner-size: var(--component-inline-size-md)", "--comp-spinner-border-width: var(--component-offset-xs)"],
    message: "Spinner lg density must scale through Spinner aliases.",
  });
  requireIncludes({
    block: successBlock,
    text,
    packageCssFile,
    snippets: ["--comp-spinner-tone: var(--sys-color-success)"],
    message: "Spinner success tone must resolve through its tone alias.",
  });
  requireIncludes({
    block: subtleBlock,
    text,
    packageCssFile,
    snippets: ["opacity: var(--comp-spinner-subtle-opacity)"],
    message: "Spinner subtle state must consume Spinner subtle opacity alias.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["--comp-spinner-tone: var(--comp-spinner-disabled-tone)", "opacity: var(--comp-spinner-disabled-opacity)"],
    message: "Spinner disabled state must consume Spinner disabled aliases.",
  });
}

module.exports = { checkSpinnerCssContract };
