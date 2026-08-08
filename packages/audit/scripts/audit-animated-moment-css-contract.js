const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkAnimatedMomentCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".animated-moment");
  const smBlock = blockFor(blocks, selectorKey, ".animated-moment[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".animated-moment[data-density=\"lg\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".animated-moment .animated-moment__icon");
  const titleBlock = blockFor(blocks, selectorKey, ".animated-moment strong");
  const copyBlock = blockFor(blocks, selectorKey, ".animated-moment.animated-moment small");
  const stageBlock = blockFor(blocks, selectorKey, ".animated-moment__stage");
  const playingBlock = blockFor(blocks, selectorKey, ".animated-moment[data-state=\"playing\"] .animated-moment__icon");
  const cueBlock = blockFor(blocks, selectorKey, ".animated-moment__cue");
  const completeCueBlock = blockFor(blocks, selectorKey, ".animated-moment[data-state=\"complete\"] .animated-moment__cue");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-animated-moment-accent: var(--sys-color-action)",
      "--comp-animated-moment-halo-size: calc(var(--component-density-control-height) * 4.5)",
      "--comp-animated-moment-icon-size: calc(var(--component-density-control-height) * 2.9)",
      "--comp-animated-moment-icon-font-size: calc(var(--comp-animated-moment-icon-size) * 0.38)",
      "--comp-animated-moment-cycle: var(--component-duration-loop)",
      "--comp-animated-moment-gap: var(--component-space-lg)",
      "--comp-animated-moment-title-size: var(--component-font-size-title-md)",
      "--comp-animated-moment-cue-duration: var(--component-duration-medium)",
      "gap: var(--comp-animated-moment-gap)",
      "min-inline-size: var(--comp-animated-moment-min-inline-size)",
    ],
    message: "AnimatedMoment root must expose a component-scoped contract for density, voice, motion, and animation asset geometry.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-animated-moment-halo-size: calc(var(--component-density-control-height) * 3.5)",
      "--comp-animated-moment-icon-size: calc(var(--component-density-control-height) * 2.1)",
      "--comp-animated-moment-gap: var(--component-space-md)",
      "--comp-animated-moment-title-size: var(--component-font-size-title-sm)",
      "--comp-animated-moment-copy-size: var(--component-font-size-small)",
    ],
    message: "AnimatedMoment sm density must override current aliases instead of direct layout declarations.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-animated-moment-halo-size: calc(var(--component-density-control-height) * 5)",
      "--comp-animated-moment-icon-size: calc(var(--component-density-control-height) * 3.2)",
      "--comp-animated-moment-gap: var(--component-space-xl)",
      "--comp-animated-moment-title-size: var(--component-font-size-title-lg)",
      "--comp-animated-moment-copy-size: var(--component-font-size-title-sm)",
    ],
    message: "AnimatedMoment lg density must override current aliases instead of direct layout declarations.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-animated-moment-icon-size)",
      "box-shadow: var(--component-depth-accent-halo)",
      "font-size: var(--comp-animated-moment-icon-font-size)",
      "margin-block: var(--comp-animated-moment-icon-margin-block)",
    ],
    message: "AnimatedMoment icon must consume component-scoped animation geometry aliases.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-animated-moment-title-size)",
      "font-weight: var(--comp-animated-moment-title-weight)",
      "line-height: var(--comp-animated-moment-title-line-height)",
    ],
    message: "AnimatedMoment title must consume component-scoped voice aliases.",
  });
  requireIncludes({
    block: copyBlock,
    text,
    packageCssFile,
    snippets: [
      "font-size: var(--comp-animated-moment-copy-size)",
      "line-height: var(--comp-animated-moment-copy-line-height)",
      "max-inline-size: var(--comp-animated-moment-copy-max-inline-size)",
    ],
    message: "AnimatedMoment supporting copy must consume component-scoped voice aliases.",
  });
  requireIncludes({
    block: stageBlock,
    text,
    packageCssFile,
    snippets: [
      "min-block-size: var(--comp-animated-moment-icon-size)",
      "min-inline-size: var(--comp-animated-moment-icon-size)",
    ],
    message: "AnimatedMoment animation stage must share the icon geometry contract.",
  });
  requireIncludes({
    block: playingBlock,
    text,
    packageCssFile,
    snippets: ["animation: animated-moment-icon-breathe var(--comp-animated-moment-cycle) var(--comp-animated-moment-cycle-ease) infinite"],
    message: "AnimatedMoment playing state must consume motion aliases.",
  });
  requireIncludes({
    block: cueBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-animated-moment-cue-block-size)",
      "inline-size: var(--comp-animated-moment-cue-inline-size)",
      "transition: inline-size var(--comp-animated-moment-cue-duration) var(--comp-animated-moment-cue-ease)",
    ],
    message: "AnimatedMoment cue must consume component-scoped frame and motion aliases.",
  });
  requireIncludes({
    block: completeCueBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-animated-moment-cue-complete-inline-size)"],
    message: "AnimatedMoment complete cue width must be aliased.",
  });
  if (/--component-animated-moment-/.test(text)) {
    add("errors", packageCssFile, rootBlock ? lineNumber(text, rootBlock.index) : 1, "AnimatedMoment must not keep a parallel --component-animated-moment-* implementation; use --comp-animated-moment-*.");
  }
}

module.exports = { checkAnimatedMomentCssContract };
