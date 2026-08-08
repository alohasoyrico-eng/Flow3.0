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

function checkTabsCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/Tabs.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".tabs");
  const indicatorBlock = blockFor(blocks, selectorKey, ".tabs::before");
  const tabBlock = blockFor(blocks, selectorKey, ".tabs__tab");
  const selectedBlock = blockFor(blocks, selectorKey, ".tabs__tab[aria-selected=\"true\"]");
  const selectedIconBlock = blockFor(blocks, selectorKey, ".tabs__tab[aria-selected=\"true\"] .tabs__icon");
  const hoverBlock = blockFor(blocks, selectorKey, ".tabs__tab:hover:not([aria-selected=\"true\"]):not(:disabled)");
  const activeBlock = blockFor(blocks, selectorKey, ".tabs__tab:active:not(:disabled)");
  const underlineBlock = blockFor(blocks, selectorKey, ".tabs[data-variant=\"underline\"]");
  const underlineIndicatorBlock = blockFor(blocks, selectorKey, ".tabs[data-variant=\"underline\"]::before");
  const underlineTabBlock = blockFor(blocks, selectorKey, ".tabs[data-variant=\"underline\"] .tabs__tab");
  const densitySmBlock = blockFor(blocks, selectorKey, ".tabs[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".tabs[data-density=\"lg\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".tabs__tab:focus-visible");

  if (
    !source.includes("forwardRef") ||
    !source.includes("tabsPlatformContract") ||
    !source.includes("flowVariantProps(resolvedVariant)") ||
    !source.includes("flowDensityProps(resolvedDensity)")
  ) {
    add("errors", sourceFile, 1, "Tabs must expose a real React ref contract, platform contract, variant, and density props.");
  }
  if (!source.includes("if (!normalizedItems.length) return null;") || !source.includes("role: \"tablist\"") || !source.includes("role: \"tab\"")) {
    add("errors", sourceFile, 1, "Tabs must avoid empty shells and keep tablist/tab accessibility roles.");
  }
  if (!source.includes("React.createElement(Badge") || !source.includes("const badge = item.badge?.label ? item.badge : null;")) {
    add("errors", sourceFile, 1, "Tabs must compose Badge through the React component and require explicit badge labels.");
  }
  if (!source.includes("ArrowRight") || !source.includes("ArrowLeft") || !source.includes("Home") || !source.includes("End") || !source.includes("onValueChange?.(nextKey, event);")) {
    add("errors", sourceFile, 1, "Tabs must keep keyboard roving behavior and pass the source event to onValueChange.");
  }
  if (blocks.filter((block) => selectorKey(block) === ".tabs__tab").length > 1) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".tabs__tab")), "Tabs must not define duplicate .tabs__tab blocks; all tab sizing belongs in the primary block.");
  }
  if (/var\(--comp-tabs-indicator-(?:left|width),/.test(text)) {
    add("errors", packageCssFile, 1, "Tabs indicator runtime aliases must be declared on the root and consumed without inline fallbacks.");
  }
  const localTabTarget = /--comp-tabs-tab-min-(?:block|inline):\s*var\(--component-control-min-size\)/.exec(text);
  if (localTabTarget) {
    add("errors", packageCssFile, lineNumber(text, localTabTarget.index), "Tabs tab targets must consume navigation target roles instead of the generic control min size.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tabs-bg: var(--sys-energy-surface-sunken)",
      "--comp-tabs-tab-bg-selected: var(--sys-energy-surface-primary)",
      "--comp-tabs-indicator-transition: left var(--sys-duration-base) var(--sys-motion-curve-touch), width var(--sys-duration-base) var(--sys-motion-curve-touch)",
      "--comp-tabs-tab-min-block: var(--component-navigation-target-size-lg)",
      "--comp-tabs-tab-min-inline: var(--component-navigation-target-size-lg)",
      "--comp-tabs-focus-width: var(--component-focus-ring-width)",
      "--comp-tabs-underline-indicator-shadow: var(--component-depth-none)",
      "align-items: var(--comp-tabs-align)",
      "background: var(--comp-tabs-bg)",
      "border: var(--comp-tabs-border)",
      "border-radius: var(--comp-tabs-radius)",
      "display: var(--comp-tabs-display)",
      "gap: var(--comp-tabs-gap)",
      "padding: var(--comp-tabs-padding)",
    ],
    message: "Tabs root must own and consume aliases for track, indicator, tab, density, focus, and motion.",
  });
  requireIncludes({
    block: indicatorBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-tabs-indicator-bg)",
      "border: var(--comp-tabs-indicator-border)",
      "box-shadow: var(--comp-tabs-indicator-shadow)",
      "left: var(--comp-tabs-indicator-left)",
      "transition: var(--comp-tabs-indicator-transition)",
      "width: var(--comp-tabs-indicator-width)",
    ],
    message: "Tabs indicator must consume Tabs aliases for selected surface, position, width, and motion.",
  });
  requireIncludes({
    block: tabBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-tabs-tab-bg)",
      "border: var(--comp-tabs-tab-border)",
      "border-radius: var(--comp-tabs-tab-radius)",
      "color: var(--comp-tabs-tab-fg)",
      "font-size: var(--comp-tabs-tab-font-size)",
      "font-weight: var(--comp-tabs-tab-font-weight)",
      "min-block-size: var(--comp-tabs-tab-min-block)",
      "min-height: var(--comp-tabs-tab-min-block)",
      "padding: 0 var(--comp-tabs-tab-padding-inline)",
      "transition: var(--comp-tabs-tab-transition)",
    ],
    message: "Tabs tab must consume tab aliases for frame, voice, spacing, and motion.",
  });
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-tabs-selected-fg)", "font-weight: var(--comp-tabs-selected-weight)"],
    message: "Tabs selected state must consume selected aliases.",
  });
  requireIncludes({
    block: selectedIconBlock,
    text,
    packageCssFile,
    snippets: ["font-variation-settings: var(--comp-tabs-icon-selected-variation)"],
    message: "Tabs selected icon state must consume iconography alias.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-tabs-hover-fg)"],
    message: "Tabs hover state must consume hover alias.",
  });
  requireIncludes({
    block: activeBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-tabs-pressed-transform)"],
    message: "Tabs active state must consume press alias.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-tabs-focus-width) solid var(--comp-tabs-focus-color)",
      "outline-offset: var(--comp-tabs-focus-offset)",
    ],
    message: "Tabs focus state must consume accessibility aliases instead of sharing Tooltip focus CSS.",
  });
  requireIncludes({
    block: underlineBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-tabs-underline-bg)",
      "border: var(--comp-tabs-underline-border)",
      "border-block-end: var(--comp-tabs-underline-border-block-end)",
      "gap: var(--comp-tabs-underline-gap)",
      "padding: var(--comp-tabs-underline-padding)",
    ],
    message: "Tabs underline variant must consume underline aliases.",
  });
  requireIncludes({
    block: underlineIndicatorBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-tabs-underline-indicator-bg)",
      "border: var(--comp-tabs-underline-indicator-border)",
      "block-size: var(--comp-tabs-underline-indicator-block-size)",
      "box-shadow: var(--comp-tabs-underline-indicator-shadow)",
      "left: var(--comp-tabs-indicator-left)",
    ],
    message: "Tabs underline indicator must consume underline indicator aliases.",
  });
  requireIncludes({
    block: underlineTabBlock,
    text,
    packageCssFile,
    snippets: [
      "border-radius: var(--comp-tabs-underline-tab-radius)",
      "padding: 0 var(--comp-tabs-underline-tab-padding-inline)",
    ],
    message: "Tabs underline tabs must consume underline tab aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "Tabs small density must set tab size, padding, and font aliases."],
    [densityLgBlock, "Tabs large density must set tab size, padding, and font aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-tabs-tab-min-block:",
        "--comp-tabs-tab-padding-inline:",
        "--comp-tabs-tab-font-size:",
      ],
      message,
    });
  }
}

module.exports = { checkTabsCssContract };
