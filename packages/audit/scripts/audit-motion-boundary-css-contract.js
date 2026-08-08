const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkMotionBoundaryCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".motion-boundary");
  const surfaceBlock = blockFor(blocks, selectorKey, ".biometric-prompt,.motion-boundary,.animated-moment");
  const iconBlock = blockFor(blocks, selectorKey, ".biometric-prompt__icon,.motion-boundary__icon,.animated-moment__icon");
  const stateBlock = blockFor(blocks, selectorKey, ".motion-boundary__state");
  const cueBaseBlock = blockFor(blocks, selectorKey, ".motion-boundary__cue,.animated-moment__cue");
  const cueBlock = blockFor(blocks, selectorKey, ".motion-boundary__cue");
  const idleBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-state=\"idle\"] .motion-boundary__cue");
  const enteringBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-state=\"entering\"] .motion-boundary__cue");
  const activeBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-state=\"active\"] .motion-boundary__cue");
  const exitingBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-state=\"exiting\"] .motion-boundary__cue");
  const disabledStateBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-state=\"disabled\"] .motion-boundary__state");
  const disabledCueBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-state=\"disabled\"] .motion-boundary__cue");
  const slideBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-variant=\"slide\"] .motion-boundary__cue");
  const collapseBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-variant=\"collapse\"] .motion-boundary__cue");
  const routeBlock = blockFor(blocks, selectorKey, ".motion-boundary[data-variant=\"route\"] .motion-boundary__cue");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-motion-boundary-gap: var(--sys-space-md)",
      "--comp-motion-boundary-surface-bg: var(--sys-color-surface)",
      "--comp-motion-boundary-icon-size: var(--component-inline-size-lg)",
      "--comp-motion-boundary-cue-inline-size: var(--component-motion-cue-inline-size)",
      "--comp-motion-boundary-cue-duration: var(--component-duration-medium)",
      "--comp-motion-boundary-cue-ease: var(--component-ease-move)",
      "--comp-motion-boundary-cue-idle-transform: var(--component-motion-cue-idle-transform)",
      "--comp-motion-boundary-cue-enter-transform: var(--component-motion-cue-enter-transform)",
      "--comp-motion-boundary-cue-active-transform: var(--component-motion-cue-active-transform)",
      "--comp-motion-boundary-cue-exit-transform: var(--component-motion-cue-exit-transform)",
      "gap: var(--comp-motion-boundary-gap)",
    ],
    message: "MotionBoundary root must declare the motion/surface/icon aliases consumed by its parts.",
  });
  requireIncludes({
    block: surfaceBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-motion-boundary-surface-bg: var(--sys-color-surface)",
      "background: var(--comp-motion-boundary-surface-bg)",
      "border-radius: var(--comp-motion-boundary-surface-radius)",
      "box-shadow: var(--comp-motion-boundary-surface-shadow)",
      "padding: var(--comp-motion-boundary-surface-padding)",
    ],
    message: "MotionBoundary surface treatment must be driven through component aliases without fallback defaults.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-motion-boundary-icon-bg: color-mix(in srgb, var(--sys-color-action) 12%, var(--sys-color-surface))",
      "background: var(--comp-motion-boundary-icon-bg)",
      "font-size: var(--comp-motion-boundary-icon-font-size)",
      "min-block-size: var(--comp-motion-boundary-icon-size)",
    ],
    message: "MotionBoundary icon treatment must be routed through icon aliases instead of shared raw values.",
  });
  requireIncludes({
    block: stateBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-motion-boundary-state-bg)",
      "border: var(--component-border-width) solid var(--comp-motion-boundary-state-border)",
      "font-size: var(--comp-motion-boundary-state-font-size)",
      "padding: var(--comp-motion-boundary-state-padding)",
    ],
    message: "MotionBoundary state chip must consume the component State/Voice/Frame aliases.",
  });
  requireIncludes({
    block: cueBaseBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-motion-boundary-cue-bg: var(--sys-color-action)",
      "background: var(--comp-motion-boundary-cue-bg)",
      "border-radius: var(--comp-motion-boundary-cue-radius)",
    ],
    message: "MotionBoundary cue base must expose color and shape through aliases.",
  });
  requireIncludes({
    block: cueBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-motion-boundary-cue-block-size)",
      "inline-size: var(--comp-motion-boundary-cue-inline-size)",
      "transition: transform var(--comp-motion-boundary-cue-duration) var(--comp-motion-boundary-cue-ease)",
    ],
    message: "MotionBoundary cue geometry and timing must consume component aliases.",
  });
  requireIncludes({ block: idleBlock, text, packageCssFile, snippets: ["transform: var(--comp-motion-boundary-cue-idle-transform)"], message: "MotionBoundary idle cue transform must be aliased." });
  requireIncludes({ block: enteringBlock, text, packageCssFile, snippets: ["--comp-motion-boundary-cue-duration: var(--component-duration-enter)", "--comp-motion-boundary-cue-ease: var(--component-ease-enter)", "transform: var(--comp-motion-boundary-cue-enter-transform)"], message: "MotionBoundary entering state must consume enter duration/ease and transform aliases." });
  requireIncludes({ block: activeBlock, text, packageCssFile, snippets: ["--comp-motion-boundary-cue-ease: var(--component-ease-move)", "transform: var(--comp-motion-boundary-cue-active-transform)"], message: "MotionBoundary active cue transform must be aliased." });
  requireIncludes({ block: exitingBlock, text, packageCssFile, snippets: ["--comp-motion-boundary-cue-duration: var(--component-duration-exit)", "--comp-motion-boundary-cue-ease: var(--component-ease-exit)", "transform: var(--comp-motion-boundary-cue-exit-transform)"], message: "MotionBoundary exiting state must consume exit duration/ease and transform aliases." });
  requireIncludes({ block: disabledStateBlock, text, packageCssFile, snippets: ["background: var(--comp-motion-boundary-disabled-state-bg)", "border-color: var(--comp-motion-boundary-disabled-state-border)", "color: var(--comp-motion-boundary-disabled-state-fg)"], message: "MotionBoundary disabled state chip must consume disabled aliases." });
  requireIncludes({ block: disabledCueBlock, text, packageCssFile, snippets: ["background: var(--comp-motion-boundary-disabled-cue-bg)", "transform: var(--comp-motion-boundary-cue-idle-transform)"], message: "MotionBoundary disabled cue must consume disabled and idle aliases." });
  requireIncludes({ block: slideBlock, text, packageCssFile, snippets: ["inline-size: var(--comp-motion-boundary-cue-slide-inline-size)"], message: "MotionBoundary slide variant cue width must be aliased." });
  requireIncludes({ block: collapseBlock, text, packageCssFile, snippets: ["inline-size: var(--comp-motion-boundary-cue-collapse-inline-size)"], message: "MotionBoundary collapse variant cue width must be aliased." });
  requireIncludes({ block: routeBlock, text, packageCssFile, snippets: ["background: var(--comp-motion-boundary-cue-route-bg)", "inline-size: var(--comp-motion-boundary-cue-route-inline-size)"], message: "MotionBoundary route variant cue treatment must be aliased." });

  const hardcodedCueSize = text.match(/--comp-motion-boundary-cue-(?:inline|slide-inline|collapse-inline|route-inline)-size:\s*[0-9.]+%/);
  if (hardcodedCueSize) {
    add("errors", packageCssFile, lineNumber(text, hardcodedCueSize.index), "MotionBoundary cue sizes must flow through component motion cue roles, not local hardcoded percentages.");
  }

  const hardcodedCueTransform = text.match(/--comp-motion-boundary-cue-(?:idle|enter|active|exit)-transform:\s*(?:translate|scale|rotate|skew|matrix)[^;]*[0-9]/);
  if (hardcodedCueTransform) {
    add("errors", packageCssFile, lineNumber(text, hardcodedCueTransform.index), "MotionBoundary cue transforms must flow through component Momentum cue roles, not local hardcoded transforms.");
  }
}

module.exports = { checkMotionBoundaryCssContract };
