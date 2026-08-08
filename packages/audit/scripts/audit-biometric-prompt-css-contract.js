const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkBiometricPromptCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".biometric-prompt");
  const smBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-density=\"lg\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".biometric-prompt__icon");
  const titleBlock = blockFor(blocks, selectorKey, ".biometric-prompt__content strong");
  const authenticatingBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-state=\"authenticating\"] .biometric-prompt__icon");
  const authenticatingRingBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-state=\"authenticating\"] .biometric-prompt__icon::after");
  const successBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-state=\"success\"] .biometric-prompt__icon");
  const warningBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-state=\"warning\"] .biometric-prompt__icon");
  const errorBlock = blockFor(blocks, selectorKey, ".biometric-prompt[data-state=\"error\"] .biometric-prompt__icon");
  const actionBlock = blockFor(blocks, selectorKey, ".biometric-prompt__action");

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-biometric-prompt-gap: var(--sys-space-md)",
      "--comp-biometric-prompt-inline-size: min(100%, var(--component-content-size-sm))",
      "--comp-biometric-prompt-icon-size: calc(var(--component-density-control-height) * 2 - var(--sys-frame-space-micro))",
      "--comp-biometric-prompt-title-family: var(--sys-font-title)",
      "--comp-biometric-prompt-motion-pulse-duration: var(--component-duration-pulse)",
      "gap: var(--comp-biometric-prompt-gap)",
      "padding: var(--comp-biometric-prompt-padding)",
    ],
    message: "BiometricPrompt root must declare frame, voice, state, and motion aliases from the cascade.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-biometric-prompt-inline-size: min(100%, var(--component-content-size-xs))",
      "--comp-biometric-prompt-padding: var(--sys-space-lg)",
      "--comp-biometric-prompt-icon-size: calc(var(--component-density-control-height) + var(--sys-space-md))",
    ],
    message: "BiometricPrompt sm density must override current prompt aliases instead of using fixed component blocks.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-biometric-prompt-inline-size: min(100%, var(--component-content-size-md))",
      "--comp-biometric-prompt-padding: var(--sys-space-xl) var(--sys-space-lg)",
      "--comp-biometric-prompt-icon-size: calc(var(--component-density-control-height) * 2 + var(--sys-space-md))",
    ],
    message: "BiometricPrompt lg density must override current prompt aliases instead of using fixed component blocks.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-biometric-prompt-icon-bg)",
      "font-size: var(--comp-biometric-prompt-icon-font-size)",
      "min-block-size: var(--comp-biometric-prompt-icon-size)",
      "min-inline-size: var(--comp-biometric-prompt-icon-size)",
    ],
    message: "BiometricPrompt icon must consume component-scoped icon aliases.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--comp-biometric-prompt-title-family)",
      "font-size: var(--comp-biometric-prompt-title-size)",
      "font-weight: var(--comp-biometric-prompt-title-weight)",
      "line-height: var(--comp-biometric-prompt-title-line-height)",
    ],
    message: "BiometricPrompt title must consume component-scoped voice aliases.",
  });
  requireIncludes({
    block: authenticatingBlock,
    text,
    packageCssFile,
    snippets: ["animation: component-pulse var(--comp-biometric-prompt-motion-pulse-duration) var(--comp-biometric-prompt-motion-state-ease) infinite"],
    message: "BiometricPrompt authenticating motion must consume component motion aliases.",
  });
  requireIncludes({
    block: authenticatingRingBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: spinner-spin var(--comp-biometric-prompt-motion-loop-duration) var(--comp-biometric-prompt-motion-linear) infinite",
      "border: var(--comp-biometric-prompt-ring-border-width) solid var(--comp-biometric-prompt-ring-border-color)",
      "inset: var(--comp-biometric-prompt-ring-inset)",
    ],
    message: "BiometricPrompt authentication ring must consume frame/state/motion aliases.",
  });
  requireIncludes({
    block: successBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-biometric-prompt-success-bg)", "color: var(--comp-biometric-prompt-success-fg)"],
    message: "BiometricPrompt success state must consume state aliases.",
  });
  requireIncludes({
    block: warningBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-biometric-prompt-warning-bg)", "color: var(--comp-biometric-prompt-warning-fg)"],
    message: "BiometricPrompt warning state must consume state aliases.",
  });
  requireIncludes({
    block: errorBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-biometric-prompt-error-bg)",
      "color: var(--comp-biometric-prompt-error-fg)",
      "animation: component-error-shake var(--comp-biometric-prompt-motion-state-duration) var(--comp-biometric-prompt-motion-exit)",
    ],
    message: "BiometricPrompt error state must consume state and motion aliases.",
  });
  requireIncludes({
    block: actionBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-biometric-prompt-action-inline-size)"],
    message: "BiometricPrompt action layout must be controlled by its component action alias.",
  });
  if (/--comp-biometric-prompt-icon-size:\s*(?:var\(--component-textarea-min-block\)|calc\(var\(--component-block-size-md\))/.test(text)) {
    add("errors", packageCssFile, rootBlock ? lineNumber(text, rootBlock.index) : 1, "BiometricPrompt icon size must derive from density instead of fixed component block aliases.");
  }
}

module.exports = { checkBiometricPromptCssContract };
