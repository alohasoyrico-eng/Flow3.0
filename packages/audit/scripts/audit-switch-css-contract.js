const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkSwitchCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/Switch.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/Switch.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".switch");
  const smBlock = blockFor(blocks, selectorKey, ".switch[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".switch[data-density=\"lg\"]");
  const inputFocusBlock = blockFor(blocks, selectorKey, ".switch__input:focus-visible ~ .switch__track");
  const textBlock = blockFor(blocks, selectorKey, ".switch__text");
  const labelBlock = blockFor(blocks, selectorKey, ".switch__label");
  const descriptionBlock = blockFor(blocks, selectorKey, ".switch__description");
  const disabledBlock = blockFor(blocks, selectorKey, ".switch:has(input:disabled)");
  const trackBlock = blockFor(blocks, selectorKey, ".switch__track");
  const thumbBlock = blockFor(blocks, selectorKey, ".switch__thumb");
  const checkedTrackBlock = blockFor(blocks, selectorKey, ".switch__input:checked ~ .switch__track");
  const checkedThumbBlock = blockFor(blocks, selectorKey, ".switch__input:checked ~ .switch__track .switch__thumb");
  const pressedTrackBlock = blockFor(blocks, selectorKey, ".switch:active:not(:has(input:disabled)) .switch__track,.switch[data-state=\"pressed\"] .switch__track");
  const pressedThumbBlock = blockFor(blocks, selectorKey, ".switch:active:not(:has(input:disabled)) .switch__thumb,.switch[data-state=\"pressed\"] .switch__thumb");
  const pressedCheckedBlock = blockFor(blocks, selectorKey, ".switch:active:not(:has(input:disabled)) .switch__input:checked ~ .switch__track .switch__thumb,.switch[data-state=\"pressed\"] .switch__input:checked ~ .switch__track .switch__thumb");
  const stateFocusBlock = blockFor(blocks, selectorKey, ".switch[data-state=\"focus\"] .switch__track");
  const errorTrackBlock = blockFor(blocks, selectorKey, ".switch[data-state=\"error\"] .switch__track,.switch[data-invalid=\"true\"] .switch__track");
  const errorCheckedBlock = blockFor(blocks, selectorKey, ".switch[data-state=\"error\"] .switch__input:checked ~ .switch__track,.switch[data-invalid=\"true\"] .switch__input:checked ~ .switch__track");
  const errorBlock = blockFor(blocks, selectorKey, ".switch__error");
  const hoverBlock = blockFor(blocks, selectorKey, ".switch:hover .switch__track");

  if (!source.includes("forwardRef") || !source.includes("switchPlatformContract") || !source.includes("flowDensityProps(")) {
    add("errors", sourceFile, 1, "Switch must expose a real React ref contract, platform contract, and density prop.");
  }
  if (!source.includes("if (!label) return null;") || !source.includes("role: \"switch\"") || !source.includes("\"aria-checked\": String(currentChecked)")) {
    add("errors", sourceFile, 1, "Switch must require a visible label and expose the native switch accessibility contract.");
  }
  if (text.includes("--switch-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--switch-")), "Switch must not use short --switch-* aliases; use --comp-switch-current-* aliases.");
  }
  if (text.includes("--comp-switch-track-width-sm: var(--component-control-min-size);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-switch-track-width-sm: var(--component-control-min-size);")), "Switch track width must route through --component-switch-track-width-* aliases, not the global control size directly.");
  }
  if (!text.includes("--comp-switch-track-width-sm: var(--component-switch-track-width-sm);")) {
    add("errors", packageCssFile, 1, "Switch small track width must consume --component-switch-track-width-sm.");
  }
  if (!text.includes("--component-switch-track-width-lg: calc(var(--component-inline-size-lg) + var(--component-space-md));")) {
    add("errors", packageCssFile, 1, "Switch large track width must be wider than medium so large density preserves track/thumb proportions.");
  }
  for (const snippet of [
    "--comp-switch-thumb-size-sm: var(--component-icon-size-sm)",
    "--comp-switch-thumb-size-md: var(--component-icon-size-md)",
    "--comp-switch-thumb-size-lg: var(--component-icon-size-lg)",
    "--comp-switch-thumb-press-inline-sm: var(--component-icon-size-md)",
    "--comp-switch-thumb-press-inline-md: var(--component-icon-size-lg)",
    "--comp-switch-thumb-press-inline-lg: calc(var(--component-icon-size-lg) + var(--component-space-sm))",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "Switch thumb geometry must use the shared 3-step icon density scale and one-step press expansion.");
    }
  }
  if (text.includes("--comp-switch-track-padding: var(--sys-frame-border-indicator);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-switch-track-padding: var(--sys-frame-border-indicator);")), "Switch track padding must consume --component-border-width-indicator instead of reaching into frame border directly.");
  }
  if (!text.includes("--comp-switch-track-padding: var(--component-border-width-indicator);")) {
    add("errors", packageCssFile, 1, "Switch track padding must consume --component-border-width-indicator.");
  }
  for (const snippet of [
    "--comp-switch-track-on-bg: var(--component-color-action-indicator)",
    "--comp-switch-thumb-bg: var(--component-color-action-indicator-text)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "Switch active state must use the shared action indicator color pair for dark-mode legibility.");
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-switch-current-track-width: var(--comp-switch-track-width-md)",
      "--comp-switch-current-track-block: var(--comp-switch-track-block-md)",
      "--comp-switch-current-thumb-size: var(--comp-switch-thumb-size-md)",
      "--comp-switch-current-thumb-on-x: calc(var(--comp-switch-current-track-width) - var(--comp-switch-current-thumb-size) - (var(--comp-switch-current-track-padding) * 2))",
      "--comp-switch-current-gap: var(--comp-switch-gap-md)",
      "--comp-switch-current-track-bg: var(--comp-switch-track-bg)",
      "--comp-switch-current-focus-width: var(--comp-switch-focus-width)",
      "--comp-switch-current-motion-duration: var(--comp-switch-motion-duration)",
      "gap: var(--comp-switch-current-gap)",
    ],
    message: "Switch root must expose and consume component-scoped current aliases for density, state, focus, copy, and motion.",
  });

  for (const [block, snippets, message] of [
    [smBlock, ["--comp-switch-current-track-width: var(--comp-switch-track-width-sm)", "--comp-switch-current-gap: var(--comp-switch-gap-sm)"], "Switch small density must set component-scoped current aliases."],
    [lgBlock, ["--comp-switch-current-track-width: var(--comp-switch-track-width-lg)", "--comp-switch-current-gap: var(--comp-switch-gap-lg)"], "Switch large density must set component-scoped current aliases."],
    [inputFocusBlock, ["outline: var(--comp-switch-current-focus-width) solid var(--comp-switch-current-focus-color)", "outline-offset: var(--comp-switch-current-focus-offset)"], "Switch input focus must consume switch focus aliases."],
    [textBlock, ["gap: var(--comp-switch-current-gap)", "line-height: var(--component-line-height-snug-state)"], "Switch text rhythm must consume switch gap alias and stable line-height."],
    [labelBlock, ["font-weight: var(--comp-switch-current-label-weight)", "line-height: var(--component-line-height-snug-state)"], "Switch label must consume switch voice alias and stable line-height."],
    [descriptionBlock, ["color: var(--comp-switch-current-description-fg)", "font-size: var(--comp-switch-current-description-size)"], "Switch description must consume switch voice aliases."],
    [disabledBlock, ["opacity: var(--comp-switch-current-disabled-opacity)"], "Switch disabled state must consume switch disabled alias."],
    [trackBlock, ["background: var(--comp-switch-current-track-bg)", "box-sizing: border-box", "inline-size: var(--comp-switch-current-track-width)", "min-block-size: var(--comp-switch-current-track-block)", "padding: var(--comp-switch-current-track-padding)"], "Switch track must consume current geometry and state aliases."],
    [thumbBlock, ["background: var(--comp-switch-current-thumb-bg)", "block-size: var(--comp-switch-current-thumb-size)", "box-sizing: border-box", "inline-size: var(--comp-switch-current-thumb-size)"], "Switch thumb must consume current geometry aliases."],
    [checkedTrackBlock, ["background: var(--comp-switch-current-track-on-bg)"], "Switch checked track must consume checked alias."],
    [checkedThumbBlock, ["transform: translateX(var(--comp-switch-current-thumb-on-x))"], "Switch checked thumb must consume current translate alias."],
    [pressedTrackBlock, ["transform: scale(var(--comp-switch-current-press-scale))"], "Switch pressed track must consume press alias."],
    [pressedThumbBlock, ["inline-size: var(--comp-switch-current-thumb-press-inline)"], "Switch pressed thumb must consume press geometry alias."],
    [pressedCheckedBlock, ["transform: translateX(var(--comp-switch-current-thumb-on-press-x))"], "Switch checked pressed thumb must consume current pressed translate alias."],
    [stateFocusBlock, ["outline: var(--comp-switch-current-focus-width) solid var(--comp-switch-current-focus-color)", "outline-offset: var(--comp-switch-current-focus-offset)"], "Switch focus state must consume focus aliases."],
    [errorTrackBlock, ["background: var(--comp-switch-current-error-bg)", "box-shadow: var(--comp-switch-current-error-shadow)"], "Switch error track must consume error aliases."],
    [errorCheckedBlock, ["background: var(--comp-switch-current-error-on-bg)"], "Switch checked error track must consume checked error alias."],
    [errorBlock, ["color: var(--comp-switch-current-error-fg)", "font-size: var(--comp-switch-current-description-size)", "font-weight: var(--comp-switch-current-error-weight)"], "Switch error copy must consume switch voice aliases."],
    [hoverBlock, ["box-shadow: var(--comp-switch-current-hover-shadow)"], "Switch hover state must consume hover alias."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkSwitchCssContract };
