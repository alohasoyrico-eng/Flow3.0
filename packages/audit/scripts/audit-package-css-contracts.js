const { path, read, add, lineNumber } = require("./audit-context.js");
const { checkComponentCssContracts } = require("./audit-component-css-contracts.js");
const { checkTokenizedVisualProperties } = require("./audit-tokenized-css-properties.js");
const { checkComponentVarFallbacks } = require("./audit-component-var-fallbacks.js");
const { checkComponentCrossAliases } = require("./audit-component-cross-aliases.js");
const { checkComponentAliasLiterals } = require("./audit-component-alias-literals.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const packageSpinnerFile = path.join(process.cwd(), "packages/react/src/Spinner.js");
function cssBlocks(text) {
  const blocks = [];
  const pattern = /(?<selector>[^{}]+)\{(?<body>[^{}]*)\}/g;
  for (const match of text.matchAll(pattern)) {
    blocks.push({
      selector: match.groups.selector.trim(),
      body: match.groups.body,
      index: match.index,
    });
  }
  return blocks;
}

function normalizedSelector(block) {
  return block?.selector.replace(/\/\*[\s\S]*?\*\//g, "").trim();
}

function selectorKey(block) {
  return normalizedSelector(block)?.replace(/\s*,\s*/g, ",").replace(/\s+/g, " ");
}

function checkPackageCssContracts() {
  const text = read(packageCssFile);
  const spinnerSource = read(packageSpinnerFile);
  const rootAliasBlock = text.match(/:root\s*{[\s\S]*?\n}/)?.[0] ?? "";
  const requiredAliases = [
    "--component-control-min-size",
    "--component-focus-ring-width",
    "--component-focus-ring-offset",
    "--component-radius-pill",
    "--component-radius-control",
    "--component-inline-size-full",
    "--component-inline-size-fit-content",
    "--component-inline-size-max-content",
    "--component-inline-size-auto",
    "--component-font-size-caption",
    "--component-font-size-small",
    "--component-font-size-label",
    "--component-font-size-body",
    "--component-font-size-title-sm",
    "--component-font-size-title-md",
    "--component-font-size-data-lg",
    "--component-icon-size-sm",
    "--component-icon-size-md",
    "--component-icon-size-lg",
    "--component-font-size-icon-md",
    "--component-font-size-display-sm",
    "--component-font-size-display-md",
    "--component-duration-fast",
    "--component-duration-snappy",
    "--component-duration-instant",
    "--component-duration-enter",
    "--component-duration-exit",
    "--component-duration-state",
    "--component-duration-overlay",
    "--component-duration-sheet",
    "--component-duration-reveal",
    "--component-duration-press",
    "--component-duration-medium",
    "--component-duration-loop",
    "--component-duration-loading-spin",
    "--component-duration-loading-cycle",
    "--component-duration-progress",
    "--component-duration-shimmer",
    "--component-duration-pulse",
    "--component-ease-standard",
    "--component-ease-emphasis",
    "--component-ease-progress",
    "--component-ease-enter",
    "--component-ease-move",
    "--component-ease-exit",
    "--component-ease-state",
    "--component-ease-press",
    "--component-ease-loading-rhythm",
    "--component-loading-easing-linear",
    "--component-surface-transparent",
    "--component-border-transparent",
    "--component-depth-none",
    "--component-depth-low",
    "--component-depth-low-soft",
    "--component-depth-low-medium",
    "--component-depth-raised",
    "--component-depth-raised-soft",
    "--component-depth-raised-strong",
    "--component-depth-tooltip",
    "--component-depth-panel",
    "--component-depth-inset-track",
    "--component-depth-panel-strong",
    "--component-depth-sheet",
    "--component-depth-pill",
    "--component-depth-action-hover",
    "--component-depth-danger",
    "--component-depth-popover",
    "--component-depth-success-ring",
    "--component-depth-toast",
    "--component-depth-card-hover",
    "--component-depth-date-panel",
  ];
  for (const alias of requiredAliases) {
    if (!text.includes(`${alias}:`)) {
      add("errors", packageCssFile, 1, `Package component CSS must define the internal alias ${alias}.`);
    }
  }

  const cssWithoutDefinitions = text.replace(/:root\s*{[^}]*}/, "");
  const rawCurveIndex = cssWithoutDefinitions.search(/cubic-bezier\(/);
  if (rawCurveIndex >= 0) {
    const sourceIndex = text.indexOf("cubic-bezier", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package motion curves must use internal motion aliases instead of raw cubic-bezier values.");
  }

  if (/border-radius:\s*999px\s*;/.test(cssWithoutDefinitions)) {
    add("errors", packageCssFile, 1, "Package pill radii must use --component-radius-pill outside the alias block.");
  }
  const directMotionAliasIndex = cssWithoutDefinitions.search(/var\(--component-(?:ease-standard|ease-emphasis|ease-progress|duration-fast)\)/);
  if (directMotionAliasIndex >= 0) {
    const sourceIndex = text.indexOf(cssWithoutDefinitions.match(/var\(--component-(?:ease-standard|ease-emphasis|ease-progress|duration-fast)\)/)?.[0] ?? "", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package components must consume semantic motion role aliases, not base motion aliases.");
  }
  const rawFontSizeIndex = cssWithoutDefinitions.search(/font-size:\s*[0-9.]+(?:rem|px)\s*;/);
  if (rawFontSizeIndex >= 0) {
    const sourceIndex = text.indexOf("font-size:", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package typography must use internal font-size aliases instead of raw rem or px values.");
  }
  for (const match of cssWithoutDefinitions.matchAll(/^\s*text-transform:\s*(?:uppercase|none)\s*;/gm)) {
    const sourceIndex = text.indexOf(match[0], text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package text-transform declarations must consume sys Voice transform aliases.");
  }
  for (const match of cssWithoutDefinitions.matchAll(/^\s*(?:line-height|letter-spacing):\s*(?:1|0)\s*;/gm)) {
    const sourceIndex = text.indexOf(match[0], text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package Voice reset metrics must consume sys Voice aliases instead of raw line-height or letter-spacing values.");
  }
  checkTokenizedVisualProperties(cssWithoutDefinitions, text);
  checkComponentAliasLiterals(rootAliasBlock, text);
  checkComponentVarFallbacks(cssWithoutDefinitions, text);
  checkComponentCrossAliases(cssWithoutDefinitions, text);
  const rawTransformIndex = cssWithoutDefinitions.search(/transform:\s*[^;]*(?:translate[XY]?\([^)]*\d+px|scale\((?:0\.98|0\.985|1\.04)\))/);
  if (rawTransformIndex >= 0) {
    const sourceIndex = text.indexOf(cssWithoutDefinitions.match(/transform:\s*[^;]*(?:translate[XY]?\([^)]*\d+px|scale\((?:0\.98|0\.985|1\.04)\))/)?.[0] ?? "", text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package transform motion must use component transform aliases instead of raw px translation or literal scale values.");
  }
  for (const match of cssWithoutDefinitions.matchAll(/^\s*transform:\s*([^;]*(?:scale|translate|rotate)(?:X|Y)?\([^;]*);/gm)) {
    if (/var\(--(?:component|comp|sys)-/.test(match[0])) continue;
    const sourceIndex = text.indexOf(match[0], text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package transform declarations must consume Flow component aliases instead of raw scale, translate, or rotate values.");
  }
  for (const match of cssWithoutDefinitions.matchAll(/^\s*transform:\s*([^;]*(?:scale(?:X|Y)?|rotate)\(\s*-?(?:\d|\.)[^;]*);/gm)) {
    const sourceIndex = text.indexOf(match[0], text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package transform scale and rotation values must be aliased; raw numeric motion belongs in Flow component aliases.");
  }
  for (const match of cssWithoutDefinitions.matchAll(/^\s*opacity:\s*(?!var\()(?!0\s*;|1\s*;)[0-9.]+\s*;/gm)) {
    const sourceIndex = text.indexOf(match[0], text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package partial opacity values must consume Flow state aliases instead of raw local numbers.");
  }
  for (const match of cssWithoutDefinitions.matchAll(/^\s*stroke-width:\s*(?!var\()[0-9.]+\s*;/gm)) {
    const sourceIndex = text.indexOf(match[0], text.indexOf("}") + 1);
    add("errors", packageCssFile, lineNumber(text, sourceIndex), "Package SVG stroke widths must consume Flow frame/chart aliases instead of raw local numbers.");
  }
  const rawControlSizePattern = /\b(?:min-block-size|min-height|min-inline-size|inline-size|block-size|width):\s*44px\s*;/;
  if (rawControlSizePattern.test(cssWithoutDefinitions)) {
    add("errors", packageCssFile, 1, "Package 44px control sizing must use --component-control-min-size outside the alias block.");
  }
  for (const match of text.matchAll(/--comp-[\w-]+:\s*calc\(var\(--component-control-min-size\)\s*[+-][^;]+;/g)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must not derive local geometry from --component-control-min-size math; route reusable sizes through sys-frame/component roles.");
  }
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc)\([^;]*--sys-density-control-height[^;]*;/g)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must consume --component-density-control-height instead of reaching into sys density directly.");
  }
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc)\([^;]*--sys-density-control-padding-[xy][^;]*;/g)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must consume --component-density-control-padding-* instead of reaching into sys density directly.");
  }
  for (const match of text.matchAll(/--comp-[\w-]*radius[\w-]*:\s*var\(--sys-frame-radius-surface\);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component surface radius aliases must consume --component-radius-surface instead of reaching into sys frame radius directly.");
  for (const match of text.matchAll(/--comp-[\w-]*radius[\w-]*:\s*var\(--sys-frame-radius-sm\);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component small radius aliases must consume --component-radius-sm instead of reaching into sys frame radius directly.");
  for (const match of text.matchAll(/--comp-[\w-]*border-width[\w-]*:\s*var\(--sys-(?:frame-border|border-width)-[\w-]+\);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component border-width aliases must consume --component-border-width* aliases instead of reaching into sys frame border directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc|min|max)\([^;]*--sys-frame-space-micro[^;]*;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must consume --component-frame-space-micro instead of reaching into sys frame spacing directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc)\([^;]*--sys-frame-padding-control[^;]*;/g)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must consume --component-frame-padding-control instead of reaching into sys frame padding directly.");
  }
  for (const match of text.matchAll(/--comp-[\w-]+:\s*var\(--sys-frame-space-none\);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must consume --component-frame-space-none instead of reaching into sys frame spacing directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*var\(--sys-frame-gap-subsection\);/g)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component aliases must consume --component-frame-gap-subsection instead of reaching into sys frame gap directly.");
  }
  for (const match of text.matchAll(/--comp-[\w-]*radius[\w-]*:\s*calc\(var\(--sys-radius-md\)\s*\+\s*var\(--sys-radius-sm\)\);/g)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component radius aliases must consume --component-radius-control instead of duplicating the radius formula.");
  }
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc|min|max)\([^;]*--sys-(?:radius|depth|elevation|momentum|touch)-[\w-]+[^;]*;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component radius, depth, motion, and touch aliases must consume --component-* aliases instead of reaching into sys tokens directly.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:depth|shadow)[\w-]*:\s*none;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component depth and shadow aliases must consume --component-depth-none instead of hardcoding none.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:bg|background|surface)[\w-]*:\s*transparent;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component surface aliases must consume --component-surface-transparent instead of hardcoding transparent.");
  for (const match of text.matchAll(/--comp-[\w-]*border[\w-]*:\s*transparent;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component border aliases must consume --component-border-transparent instead of hardcoding transparent.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:full-width|width|inline-size|field-width|max-inline-size)[\w-]*:\s*100%;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component full-width aliases must consume --component-inline-size-full instead of hardcoding 100%.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:width|inline-size|min-inline-size|auto-width)[\w-]*:\s*(?:fit-content|max-content|auto);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component intrinsic width aliases must consume component inline-size aliases instead of hardcoding fit-content, max-content, or auto.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:padding|margin|gap)[\w-]*:\s*0;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component spacing reset aliases must consume --component-frame-space-none instead of hardcoding 0.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:border(?:-width)?|radius)[\w-]*:\s*0;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component border/radius reset aliases must consume component reset aliases instead of hardcoding 0.");
  for (const match of text.matchAll(/--comp-[\w-]*display[\w-]*:\s*(?:inline-flex|inline-grid|inline-block|flex|grid|block|none);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component display aliases must consume --component-display-* instead of hardcoding display keywords.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:flex|pointer-events|list-style|decoration|grid)[\w-]*:\s*none;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component none aliases must consume semantic component none aliases instead of hardcoding none.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:0|100%|auto);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component geometry aliases must consume semantic component geometry aliases instead of hardcoding 0, 100%, or auto.");
  for (const match of text.matchAll(/--comp-[\w-]*cursor[\w-]*:\s*(?:pointer|default|not-allowed|grab|grabbing|progress);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component cursor aliases must consume --component-cursor-* instead of hardcoding cursor keywords.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:position|overflow|white-space|isolation)[\w-]*:\s*(?:relative|absolute|hidden|nowrap|isolate);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component layout-state aliases must consume semantic component layout-state aliases instead of hardcoding position, overflow, whitespace, or isolation keywords.");
  for (const match of text.matchAll(/--comp-[\w-]*(?:align|justify|text-align|justify-self|justify-items)[\w-]*:\s*(?:center|start|end|stretch|space-between|flex-end);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component alignment aliases must consume semantic component alignment aliases instead of hardcoding alignment keywords.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:inherit|cover|wrap|ellipsis|anywhere|normal);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component content behavior aliases must consume semantic component content aliases instead of hardcoding keywords.");
  for (const match of text.matchAll(/--comp-[\w-]*animation-name[\w-]*:\s*component-[\w-]+;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component animation-name aliases must consume semantic component animation aliases instead of hardcoding keyframe names.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc|min|max)\([^;]*--sys-space-[\w-]+[^;]*;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component spacing aliases must consume --component-space-* instead of reaching into sys space directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|color-mix)\([^;]*--sys-color-[\w-]+[^;]*;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component color aliases must consume --component-color-* instead of reaching into sys color directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc|min|max)\([^;]*--sys-(?:voice|font)-[\w-]+[^;]*;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component voice aliases must consume component font/voice aliases instead of reaching into sys voice or font directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*(?:var|calc|min|max)\([^;]*--sys-(?:icon|symbol)-[\w-]+[^;]*;/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component icon and symbol aliases must consume component icon/symbol aliases instead of reaching into sys icon or symbol directly.");
  for (const match of text.matchAll(/--comp-[\w-]+:\s*var\(--sys-(?:disabled|state)-[\w-]+\);/g)) add("errors", packageCssFile, lineNumber(text, match.index), "Component state aliases must consume component opacity/disabled aliases instead of reaching into sys state or disabled directly.");

  const blocks = cssBlocks(text);
  checkComponentCssContracts({ text, blocks, packageCssFile, selectorKey, normalizedSelector });
  const buttonBlock = blocks.find((block) => block.selector === ".button");
  const buttonSmBlock = blocks.find((block) => block.selector === ".button[data-density=\"sm\"]");
  const buttonLgBlock = blocks.find((block) => block.selector === ".button[data-density=\"lg\"]");
  const buttonIconBlock = blocks.find((block) => block.selector === ".button__icon");
  if (!buttonBlock?.body.includes("min-block-size: var(--comp-button-current-size)")) {
    add("errors", packageCssFile, buttonBlock ? lineNumber(text, buttonBlock.index) : 1, "Button block size must follow its density-owned size token.");
  }
  if (!buttonBlock?.body.includes("min-height: var(--comp-button-current-size)")) {
    add("errors", packageCssFile, buttonBlock ? lineNumber(text, buttonBlock.index) : 1, "Button physical fallback height must follow the same density-owned size token.");
  }
  if (!buttonSmBlock?.body.includes("--comp-button-current-size: var(--comp-button-size-sm)") || !buttonLgBlock?.body.includes("--comp-button-current-size: var(--comp-button-size-lg)")) {
    add("errors", packageCssFile, 1, "Button sm and lg densities must set --comp-button-current-size from comp Button size tokens.");
  }
  if (!text.includes("--comp-button-size: var(--component-density-control-height)") || !text.includes("--comp-button-padding: var(--component-density-control-padding-x)")) {
    add("errors", packageCssFile, 1, "Button base geometry must inherit from component density aliases instead of a fixed md size.");
  }
  if (/--button-(?:size|padding|icon-size)(?:-|:|\))/.test(text)) {
    add("errors", packageCssFile, 1, "Button geometry aliases must stay in the --comp-button-* contract; legacy --button-* shortcuts are not allowed.");
  }
  if (!buttonIconBlock?.body.includes("font-size: var(--comp-button-current-icon-size)")) {
    add("errors", packageCssFile, buttonIconBlock ? lineNumber(text, buttonIconBlock.index) : 1, "Button icon size must follow the current density token.");
  }
  if (/\.button,\s*\n[\s\S]{0,160}?min-block-size:\s*var\(--component-control-min-size\)/.test(text)) {
    add("errors", packageCssFile, 1, "Button must not be reset by a later generic 44px rule; use Button density tokens.");
  }

  const selectControlBlock = blocks.find((block) => selectorKey(block) === ".select-control");
  const selectSmBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-density=\"sm\"]");
  const selectLgBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-density=\"lg\"]");
  const selectTriggerBlock = blocks.find((block) => selectorKey(block) === ".select-control__trigger,.country-selector__trigger,.phone-input__country-trigger");
  const selectChevronBlock = blocks.find((block) => selectorKey(block) === ".select-control__icon,.select-control__chevron,.country-selector__chevron");
  const selectListboxBlock = blocks.find((block) => selectorKey(block) === ".select-control__listbox,.country-selector__listbox,.phone-input__country-listbox");
  const selectOpenListboxBlock = blocks.find((block) => selectorKey(block) === ".select-control[data-open=\"true\"] .select-control__listbox,.country-selector[data-open=\"true\"] .country-selector__listbox");
  const selectOptionBlock = blocks.find((block) => selectorKey(block) === ".select-control__option,.country-selector__option,.phone-input__country-option");
  const countrySelectorBlock = blocks.find((block) => selectorKey(block) === ".country-selector"), inlineCountryListboxBlock = blocks.find((block) => selectorKey(block) === ".country-selector.select-control--inline .country-selector__listbox,.phone-input__country-listbox");
  if (/--select-|--component-select/.test(text)) {
    add("errors", packageCssFile, 1, "Select must use the component alias family --comp-select-*; legacy --select-* and --component-select-* aliases are not allowed.");
  }
  if (!selectControlBlock?.body.includes("--comp-select-control-size: var(--component-density-control-height)") || !selectControlBlock?.body.includes("--comp-select-current-control-size: var(--comp-select-control-size)")) {
    add("errors", packageCssFile, selectControlBlock ? lineNumber(text, selectControlBlock.index) : 1, "Select must inherit base control size from the density cascade.");
  }
  if (!selectSmBlock?.body.includes("--comp-select-current-control-size: var(--comp-select-control-size-sm)") || !selectLgBlock?.body.includes("--comp-select-current-control-size: var(--comp-select-control-size-lg)")) {
    add("errors", packageCssFile, 1, "Select density states must consume comp Select size tokens.");
  }
  if (!selectTriggerBlock?.body.includes("gap: var(--comp-select-gap)") || !selectTriggerBlock?.body.includes("padding: 0 var(--comp-select-padding-end) 0 var(--comp-select-padding-start)")) {
    add("errors", packageCssFile, selectTriggerBlock ? lineNumber(text, selectTriggerBlock.index) : 1, "Select trigger must consume comp Select frame aliases for gap and chevron-side padding.");
  }
  if (!selectChevronBlock?.body.includes("font-size: var(--comp-select-chevron-size)") || !selectChevronBlock?.body.includes("transform var(--comp-select-chevron-motion-duration) var(--comp-select-chevron-motion-ease)")) {
    add("errors", packageCssFile, selectChevronBlock ? lineNumber(text, selectChevronBlock.index) : 1, "Select chevron must consume comp Select size and motion aliases.");
  }
  if (!selectListboxBlock?.body.includes("box-shadow: var(--comp-select-listbox-depth)") || !selectListboxBlock?.body.includes("padding: var(--comp-select-listbox-padding)") || !selectOpenListboxBlock?.body.includes("opacity var(--comp-select-overlay-motion-duration) var(--comp-select-overlay-motion-ease)")) {
    add("errors", packageCssFile, selectListboxBlock ? lineNumber(text, selectListboxBlock.index) : 1, "Select option layer must consume comp Select depth, frame, and overlay motion aliases.");
  }
  if (!selectOptionBlock?.body.includes("min-block-size: var(--comp-select-option-min-size)") || !selectOptionBlock?.body.includes("padding: 0 var(--comp-select-option-padding-x)")) {
    add("errors", packageCssFile, selectOptionBlock ? lineNumber(text, selectOptionBlock.index) : 1, "Select options must consume comp Select density/frame aliases.");
  }
  if (!countrySelectorBlock?.body.includes("--comp-country-selector-inline-listbox-max-inline-size: var(--component-country-selector-inline-listbox-max-inline-size)") || !countrySelectorBlock?.body.includes("--comp-country-selector-inline-listbox-inline-size: var(--component-country-selector-inline-listbox-inline-size)")) {
    add("errors", packageCssFile, countrySelectorBlock ? lineNumber(text, countrySelectorBlock.index) : 1, "Country Selector inline listbox width must be exposed through component frame aliases.");
  }
  if (!inlineCountryListboxBlock?.body.includes("inline-size: var(--comp-country-selector-inline-listbox-inline-size)")) {
    add("errors", packageCssFile, inlineCountryListboxBlock ? lineNumber(text, inlineCountryListboxBlock.index) : 1, "Country Selector and Phone Input inline listboxes must consume the shared component width alias.");
  }

  const avatarBlocks = blocks.filter((block) => /^\.avatar(?:$|--|\[|__)/.test(normalizedSelector(block) ?? ""));
  for (const block of avatarBlocks) {
    if (/(?:--comp-avatar-size|--comp-avatar-status-size|inline-size|block-size|min-block-size):[^;]*(?:\d+px|\d+rem|\d+em)/.test(block.body)) {
      add("errors", packageCssFile, lineNumber(text, block.index), "Avatar geometry must use Flow frame/density/space aliases instead of raw unit values.");
    }
  }

  const sliderBlock = blocks.find((block) => normalizedSelector(block) === ".slider");
  const sliderSmBlock = blocks.find((block) => normalizedSelector(block) === ".slider[data-density=\"sm\"]");
  const sliderLgBlock = blocks.find((block) => normalizedSelector(block) === ".slider[data-density=\"lg\"]");
  const sliderTrackBlock = blocks.find((block) => normalizedSelector(block).replace(/\s+/g, "") === ".slider__track,.slider__fill");
  const sliderThumbBlock = blocks.find((block) => normalizedSelector(block) === ".slider__thumb");
  if (!sliderBlock?.body.includes("--comp-slider-track-size: var(--component-slider-track-size-md)")) {
    add("errors", packageCssFile, sliderBlock ? lineNumber(text, sliderBlock.index) : 1, "Slider md density must define the package-owned track size.");
  }
  if (!sliderBlock?.body.includes("--comp-slider-thumb-border-width: calc(var(--component-border-width) * 3)")) {
    add("errors", packageCssFile, sliderBlock ? lineNumber(text, sliderBlock.index) : 1, "Slider md density must define the package-owned thumb border width.");
  }
  if (!sliderSmBlock?.body.includes("--comp-slider-track-size: var(--component-slider-track-size-sm)") || !sliderSmBlock?.body.includes("--comp-slider-thumb-size: var(--component-slider-thumb-size-sm)") || !sliderSmBlock?.body.includes("--comp-slider-thumb-border-width: calc(var(--component-border-width) * 2)")) {
    add("errors", packageCssFile, sliderSmBlock ? lineNumber(text, sliderSmBlock.index) : 1, "Slider sm density must scale track, thumb, and thumb border geometry.");
  }
  if (!sliderLgBlock?.body.includes("--comp-slider-track-size: var(--component-slider-track-size-lg)") || !sliderLgBlock?.body.includes("--comp-slider-thumb-size: var(--component-slider-thumb-size-lg)") || !sliderLgBlock?.body.includes("--comp-slider-thumb-halo: 0 0 0 calc(var(--component-border-width) * 5)")) {
    add("errors", packageCssFile, sliderLgBlock ? lineNumber(text, sliderLgBlock.index) : 1, "Slider lg density must scale track, thumb, and halo geometry.");
  }
  if (!sliderTrackBlock?.body.includes("block-size: var(--comp-slider-track-size)") || !sliderTrackBlock?.body.includes("border-radius: var(--comp-slider-track-radius)")) {
    add("errors", packageCssFile, sliderTrackBlock ? lineNumber(text, sliderTrackBlock.index) : 1, "Slider track and fill must consume the density-owned track size and radius.");
  }
  if (!sliderThumbBlock?.body.includes("border: var(--comp-slider-thumb-border-width) solid var(--comp-slider-state-color)") || !sliderThumbBlock?.body.includes("inline-size: var(--comp-slider-thumb-size)")) {
    add("errors", packageCssFile, sliderThumbBlock ? lineNumber(text, sliderThumbBlock.index) : 1, "Slider thumb must consume density-owned size and border variables.");
  }

  const stepperBlock = blocks.find((block) => normalizedSelector(block) === ".stepper"), stepperItemBlock = blocks.find((block) => normalizedSelector(block) === ".stepper__item");
  if (!stepperBlock?.body.includes("--comp-stepper-current-scale: var(--component-scale-raised)") || !stepperBlock?.body.includes("--comp-stepper-item-gap:")) {
    add("errors", packageCssFile, stepperBlock ? lineNumber(text, stepperBlock.index) : 1, "Stepper must expose current marker scale and item spacing through component aliases.");
  }
  if (!stepperItemBlock?.body.includes("gap: var(--comp-stepper-item-gap)")) {
    add("errors", packageCssFile, stepperItemBlock ? lineNumber(text, stepperItemBlock.index) : 1, "Stepper item rhythm must consume its component gap alias.");
  }

  const iconButtonBlock = blocks.find((block) => block.selector === ".icon-button");
  const iconButtonIconBlock = blocks.find((block) => block.selector === ".icon-button__icon");
  const iconButtonBadgeBlock = blocks.find((block) => block.selector === ".icon-button__badge");
  if (!iconButtonBlock?.body.includes("block-size: var(--comp-icon-button-current-size)")) {
    add("errors", packageCssFile, iconButtonBlock ? lineNumber(text, iconButtonBlock.index) : 1, "Icon Button must use the density-owned size for both axes.");
  }
  if (!iconButtonIconBlock?.body.includes("color: var(--comp-icon-button-icon-fg)") || !iconButtonIconBlock?.body.includes("font-size: var(--comp-icon-button-current-icon-size)")) {
    add("errors", packageCssFile, iconButtonIconBlock ? lineNumber(text, iconButtonIconBlock.index) : 1, "Icon Button symbol size and color must follow current density and currentColor.");
  }
  if (!iconButtonBadgeBlock?.body.includes("animation: var(--comp-icon-button-badge-animation)")) {
    add("errors", packageCssFile, iconButtonBadgeBlock ? lineNumber(text, iconButtonBadgeBlock.index) : 1, "Icon Button badge must use the shared pulse motion role.");
  }
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.icon-button__badge[\s\S]*?animation:\s*none\s*!important/.test(text)) {
    add("errors", packageCssFile, 1, "Icon Button badge pulse must stop under reduced motion.");
  }

  const spinnerBlock = cssBlocks(text).find((block) => block.selector === ".spinner");
  const spinnerSvgBlock = cssBlocks(text).find((block) => block.selector === ".spinner__svg");
  const spinnerArcBlock = cssBlocks(text).find((block) => block.selector === ".spinner__arc");
  const spinnerKeyframes = text.match(/@keyframes\s+spinner-spin\s*{[\s\S]*?\n}/)?.[0] ?? "";
  if (spinnerBlock?.body.includes("animation:") || spinnerBlock?.body.includes("border:")) {
    add("errors", packageCssFile, spinnerBlock ? lineNumber(text, spinnerBlock.index) : 1, "Spinner base must not fake motion or geometry with border styles; use the SVG track and arc.");
  }
  if (!spinnerBlock?.body.includes("--comp-spinner-spin-ease: var(--component-loading-easing-linear)")) {
    add("errors", packageCssFile, spinnerBlock ? lineNumber(text, spinnerBlock.index) : 1, "Spinner must use the linear continuous motion alias.");
  }
  if (!spinnerBlock?.body.includes("--comp-spinner-rhythm-ease: var(--component-ease-loading-rhythm)")) {
    add("errors", packageCssFile, spinnerBlock ? lineNumber(text, spinnerBlock.index) : 1, "Spinner must use the loading rhythm alias for arc motion.");
  }
  if (!spinnerSvgBlock?.body.includes("animation: spinner-spin var(--comp-spinner-spin-cycle) var(--comp-spinner-spin-ease) infinite")) {
    add("errors", packageCssFile, spinnerSvgBlock ? lineNumber(text, spinnerSvgBlock.index) : 1, "Spinner SVG must own the shared continuous spin animation.");
  }
  if (!spinnerArcBlock?.body.includes("animation: spinner-arc-breathe var(--comp-spinner-rhythm-cycle) var(--comp-spinner-rhythm-ease) infinite alternate")) {
    add("errors", packageCssFile, spinnerArcBlock ? lineNumber(text, spinnerArcBlock.index) : 1, "Spinner arc must breathe with an alternating loading rhythm so the loop does not visibly reset.");
  }
  if (!spinnerArcBlock?.body.includes("stroke-dasharray") || !spinnerArcBlock?.body.includes("stroke: var(--comp-spinner-tone)")) {
    add("errors", packageCssFile, spinnerArcBlock ? lineNumber(text, spinnerArcBlock.index) : 1, "Spinner active arc must be one SVG stroke segment using the semantic tone.");
  }
  if (!text.includes("@keyframes spinner-arc-breathe")) {
    add("errors", packageCssFile, 1, "Spinner must define arc breathing keyframes so compact loading is not a flat rotation.");
  }
  if (!spinnerSource.includes('className: "spinner__track"') || !spinnerSource.includes('className: "spinner__arc"') || !spinnerSource.includes('pathLength: "100"')) {
    add("errors", packageSpinnerFile, 1, "Spinner SVG track and arc must normalize pathLength to 100 so dash rhythm is stable across browsers.");
  }
  const spinnerArcKeyframes = text.match(/@keyframes\s+spinner-arc-breathe\s*{[\s\S]*?\n}/)?.[0] ?? "";
  if (/stroke-dashoffset/.test(spinnerArcKeyframes)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes spinner-arc-breathe")), "Spinner arc rhythm must not animate dashoffset because it creates a visible loop reset.");
  }
  const usesLiteralEndpoints = /from\s*{[\s\S]*?stroke-dasharray:\s*30 100/.test(spinnerArcKeyframes) && /to\s*{[\s\S]*?stroke-dasharray:\s*74 100/.test(spinnerArcKeyframes);
  const usesComponentEndpoints = /from\s*{[\s\S]*?stroke-dasharray:\s*var\(--comp-spinner-arc-start\)/.test(spinnerArcKeyframes) && /to\s*{[\s\S]*?stroke-dasharray:\s*var\(--comp-spinner-arc-end\)/.test(spinnerArcKeyframes);
  if (!usesLiteralEndpoints && !usesComponentEndpoints) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes spinner-arc-breathe")), "Spinner arc breathing keyframes must use two stable endpoints for the alternating loop.");
  }
  if (/scale\(|translateY\(|cubic-bezier|ease-emphasis/.test(spinnerKeyframes)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("@keyframes spinner-spin")), "Spinner keyframes must avoid scale, translate, and non-linear easing in the continuous loop.");
  }

  const enterAnimationPattern = /animation:\s*[^;]*-enter[^;]*;/g;
  for (const match of text.matchAll(enterAnimationPattern)) {
    if (match[0].includes("var(--component-ease-enter)") || /var\(--comp-[^)]+(?:motion-)?enter(?:-ease)?\)/.test(match[0])) continue;
    add("errors", packageCssFile, lineNumber(text, match.index), "Package lifecycle enter animations must use --component-ease-enter.");
  }

  for (const block of cssBlocks(text)) {
    if (!/:(?:focus-visible|focus-within|focus)\b/.test(block.selector)) continue;
    const line = lineNumber(text, block.index);
    if (/(?:^|\n)\s*box-shadow:\s*(?:inset\s*)?0\s+0\s+0\b/.test(block.body)) {
      add("errors", packageCssFile, line, "Package focus states must use outline and outline-offset, not box-shadow focus rings.");
    }
    if (/(?:^|\n)\s*outline:\s*0\s*;/.test(block.body) || /(?:^|\n)\s*outline:\s*none\s*;/.test(block.body)) {
      add("errors", packageCssFile, line, "Package focus states must not disable outline.");
    }
  }

}

module.exports = { checkPackageCssContracts };
