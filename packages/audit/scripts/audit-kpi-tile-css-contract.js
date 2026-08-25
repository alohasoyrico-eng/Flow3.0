const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function blocksFor(blocks, selectorKey, selector) {
  return blocks.filter((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkKpiTileCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlocks = blocksFor(blocks, selectorKey, ".kpi-tile");
  const rootBlock = rootBlocks[0];
  const densitySmBlock = blockFor(blocks, selectorKey, ".kpi-tile[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".kpi-tile[data-density=\"lg\"]");
  const interactiveBlock = blocks.find((block) => block.selector.includes(".kpi-tile:is(a, [role=\"button\"])"));
  const hoverBlock = blocks.find((block) => block.selector.includes(".kpi-tile[data-state=\"hover\"]"));
  const focusBlock = blocks.find((block) => block.selector.includes(".kpi-tile:focus-visible"));
  const disabledBlock = blocks.find((block) => block.selector.includes(".kpi-tile[aria-disabled=\"true\"]"));
  const loadingBlock = blockFor(blocks, selectorKey, ".kpi-tile[data-state=\"loading\"]");
  const headerBlock = blockFor(blocks, selectorKey, ".kpi-tile header");
  const valueBlock = blockFor(blocks, selectorKey, ".kpi-tile strong");
  const deltaBlock = blockFor(blocks, selectorKey, ".kpi-tile__delta");
  const iconBlock = blocks.find((block) => block.selector.includes(".kpi-tile__trend-icon") && block.selector.includes(".kpi-tile__icon"));
  const riskBlock = blocks.find((block) => block.selector.includes('.kpi-tile[data-variant="threshold"]'));

  if (rootBlocks.length !== 1) {
    add("errors", packageCssFile, rootBlock ? lineNumber(text, rootBlock.index) : 1, "KPI Tile must have exactly one .kpi-tile root block.");
  }
  if (/\.kpi-tile__delta,\s*\.error-panel p\s*{/m.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".kpi-tile__delta")), "KPI Tile delta must not share text styling with ErrorPanel.");
  }
  for (const snippet of [
    "--comp-kpi-tile-header-size-sm: var(--component-density-label-size-sm)",
    "--comp-kpi-tile-header-size-md: var(--component-density-label-size-md)",
    "--comp-kpi-tile-header-size-lg: var(--component-density-label-size-lg)",
    "--comp-kpi-tile-header-size: var(--comp-kpi-tile-header-size-md)",
    "--comp-kpi-tile-icon-size-sm: var(--component-density-icon-size-sm)",
    "--comp-kpi-tile-icon-size-md: var(--component-density-icon-size-md)",
    "--comp-kpi-tile-icon-size-lg: var(--component-density-icon-size-lg)",
    "--comp-kpi-tile-icon-size: var(--comp-kpi-tile-icon-size-md)",
    "--comp-kpi-tile-delta-size-sm: var(--component-density-helper-size-sm)",
    "--comp-kpi-tile-delta-size-md: var(--component-density-helper-size-md)",
    "--comp-kpi-tile-delta-size-lg: var(--component-density-helper-size-lg)",
    "--comp-kpi-tile-delta-size: var(--comp-kpi-tile-delta-size-md)",
    "--comp-kpi-tile-affordance-size-sm: var(--component-density-icon-size-sm)",
    "--comp-kpi-tile-affordance-size-md: var(--component-density-icon-size-md)",
    "--comp-kpi-tile-affordance-size-lg: var(--component-density-icon-size-lg)",
    "--comp-kpi-tile-affordance-size: var(--comp-kpi-tile-affordance-size-md)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "KPI Tile voice/icon density aliases must be defined from shared density aliases.");
      break;
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-kpi-tile-bg: var(--component-color-surface)",
      "--comp-kpi-tile-border-width: var(--component-border-width)",
      "--comp-kpi-tile-depth: var(--component-depth-panel)",
      "--comp-kpi-tile-padding:",
      "--comp-kpi-tile-min-block-size:",
      "--comp-kpi-tile-value-family: var(--component-font-family-mono)",
      "--comp-kpi-tile-risk-rail-width: var(--component-space-xs)",
      "background: var(--comp-kpi-tile-bg)",
      "border: var(--comp-kpi-tile-border-width) solid var(--comp-kpi-tile-border)",
      "border-radius: var(--comp-kpi-tile-radius)",
      "box-shadow: var(--comp-kpi-tile-depth)",
      "color: var(--comp-kpi-tile-fg)",
      "gap: var(--comp-kpi-tile-gap)",
      "min-block-size: var(--comp-kpi-tile-min-block-size)",
      "padding: var(--comp-kpi-tile-padding)",
      "transition: var(--comp-kpi-tile-transition)",
    ],
    message: "KPI Tile root must consume KPI aliases for frame, density, voice, depth, and state.",
  });
  requireIncludes({
    block: densitySmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-kpi-tile-affordance-size: var(--comp-kpi-tile-affordance-size-sm)",
      "--comp-kpi-tile-delta-size: var(--comp-kpi-tile-delta-size-sm)",
      "--comp-kpi-tile-header-size: var(--comp-kpi-tile-header-size-sm)",
      "--comp-kpi-tile-icon-size: var(--comp-kpi-tile-icon-size-sm)",
      "--comp-kpi-tile-padding: var(--component-space-lg)",
      "--comp-kpi-tile-value-size: var(--component-font-size-title-lg)",
      "--comp-kpi-tile-min-block-size:",
    ],
    message: "KPI Tile small density must set aliases instead of direct layout properties.",
  });
  requireIncludes({
    block: densityLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-kpi-tile-affordance-size: var(--comp-kpi-tile-affordance-size-lg)",
      "--comp-kpi-tile-delta-size: var(--comp-kpi-tile-delta-size-lg)",
      "--comp-kpi-tile-header-size: var(--comp-kpi-tile-header-size-lg)",
      "--comp-kpi-tile-icon-size: var(--comp-kpi-tile-icon-size-lg)",
      "--comp-kpi-tile-padding: var(--component-space-xl)",
      "--comp-kpi-tile-value-size: var(--component-font-size-display-sm)",
      "--comp-kpi-tile-min-block-size:",
    ],
    message: "KPI Tile large density must set aliases instead of direct layout properties.",
  });
  requireIncludes({
    block: interactiveBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-kpi-tile-interactive-cursor)"],
    message: "KPI Tile interactive cursor must consume a KPI state alias.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: [
      "border-color: var(--comp-kpi-tile-border-interactive)",
      "box-shadow: var(--comp-kpi-tile-depth-interactive)",
      "transform: var(--comp-kpi-tile-transform-interactive)",
    ],
    message: "KPI Tile hover/selected state must consume KPI state aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-kpi-tile-focus-ring-width) solid var(--comp-kpi-tile-focus-ring-color)",
      "outline-offset: var(--comp-kpi-tile-focus-ring-offset)",
    ],
    message: "KPI Tile focus state must consume KPI accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "cursor: var(--comp-kpi-tile-disabled-cursor)",
      "opacity: var(--comp-kpi-tile-disabled-opacity)",
      "transform: var(--comp-kpi-tile-disabled-transform)",
    ],
    message: "KPI Tile disabled state must consume KPI state aliases.",
  });
  requireIncludes({
    block: loadingBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-kpi-tile-loading-fg)"],
    message: "KPI Tile loading state must consume KPI loading alias.",
  });
  requireIncludes({
    block: headerBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-kpi-tile-header-align)",
      "color: var(--comp-kpi-tile-header-fg)",
      "font-size: var(--comp-kpi-tile-header-size)",
      "font-weight: var(--comp-kpi-tile-header-weight)",
      "letter-spacing: var(--comp-kpi-tile-header-letter-spacing)",
      "line-height: var(--comp-kpi-tile-header-line-height)",
      "text-transform: var(--comp-kpi-tile-header-transform)",
    ],
    message: "KPI Tile header must consume KPI voice aliases.",
  });
  requireIncludes({
    block: valueBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--comp-kpi-tile-value-family)",
      "font-size: var(--comp-kpi-tile-value-size)",
      "font-weight: var(--comp-kpi-tile-value-weight)",
      "letter-spacing: var(--comp-kpi-tile-value-letter-spacing)",
      "line-height: var(--comp-kpi-tile-value-line-height)",
    ],
    message: "KPI Tile value must consume KPI data voice aliases.",
  });
  requireIncludes({
    block: deltaBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-kpi-tile-delta-color)", "font-size: var(--comp-kpi-tile-delta-size)", "margin: 0"],
    message: "KPI Tile delta must own its text color and spacing.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-kpi-tile-tone)",
      "font-size: var(--comp-kpi-tile-icon-size)",
      "font-family: var(--comp-kpi-tile-icon-family)",
      "line-height: var(--comp-kpi-tile-icon-line-height)",
    ],
    message: "KPI Tile icons must consume KPI icon aliases.",
  });
  requireIncludes({
    block: riskBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-kpi-tile-risk-bg)",
      "border-color: var(--comp-kpi-tile-border-interactive)",
      "border-inline-start: var(--comp-kpi-tile-risk-rail-width) solid var(--comp-kpi-tile-tone)",
    ],
    message: "KPI Tile threshold/risk state must keep its semantic rail through KPI aliases.",
  });
}

module.exports = { checkKpiTileCssContract };
