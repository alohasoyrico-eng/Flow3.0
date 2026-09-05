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
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/Tabs.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/Tabs.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".tabs");
  const indicatorBlock = blockFor(blocks, selectorKey, ".tabs::before");
  const tabBlock = blockFor(blocks, selectorKey, ".tabs__tab");
  const selectedBlock = blockFor(blocks, selectorKey, ".tabs__tab[aria-selected=\"true\"]");
  const selectedIconBlock = blockFor(blocks, selectorKey, ".tabs__tab[aria-selected=\"true\"] .tabs__icon");
  const disabledBlock = blockFor(blocks, selectorKey, ".tabs__tab:disabled");
  const disabledBadgeBlock = blockFor(blocks, selectorKey, ".tabs__tab:disabled .badge");
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
  if (!source.includes('export type TabsVariant = "pill" | "underline" | "default";') || !source.includes("function normalizeTabsVariant") || !source.includes('variant = "pill"')) {
    add("errors", sourceFile, 1, "Tabs must expose the ZIP pill/underline variants and keep default only as a compatibility alias.");
  }
  if (!source.includes("disabled: Boolean(disabled)") || !source.includes("const enabled = normalizedItems.filter((item) => !item.disabled);")) {
    add("errors", sourceFile, 1, "Tabs must wire disabled items to native buttons and exclude them from roving keyboard navigation.");
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
  if (/--comp-tabs-tab-min-block:\s*calc\(var\(--component-density-control-height\)/.test(text)) {
    add("errors", packageCssFile, 1, "Tabs density must consume ControlFrame action sizes instead of local density-control-height math.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-tabs-bg: var(--component-energy-surface-sunken)",
      "--comp-tabs-tab-bg-selected: var(--component-energy-surface-primary)",
      "--comp-tabs-indicator-transition: var(--component-transition-tabs-indicator)",
      "--comp-tabs-radius: var(--component-control-frame-radius-action)",
      "--comp-tabs-tab-radius: var(--component-control-frame-radius-action)",
      "--comp-tabs-tab-font-size-sm: var(--component-control-frame-font-size-sm)",
      "--comp-tabs-tab-font-size-md: var(--component-control-frame-font-size-md)",
      "--comp-tabs-tab-font-size-lg: var(--component-control-frame-font-size-lg)",
      "--comp-tabs-tab-font-weight: var(--component-font-weight-medium)",
      "--comp-tabs-selected-fg: var(--component-color-text)",
      "--comp-tabs-selected-weight: var(--component-font-weight-bold)",
      "--comp-tabs-tab-min-block-sm: var(--component-control-frame-size-sm)",
      "--comp-tabs-tab-min-block-md: var(--component-control-frame-size-md)",
      "--comp-tabs-tab-min-block-lg: var(--component-control-frame-size-lg)",
      "--comp-tabs-tab-min-block: var(--comp-tabs-tab-min-block-md)",
      "--comp-tabs-tab-min-inline: var(--component-control-frame-size-md)",
      "--comp-tabs-tab-padding-inline-sm: var(--component-control-frame-padding-action-sm)",
      "--comp-tabs-tab-padding-inline-md: var(--component-control-frame-padding-action-md)",
      "--comp-tabs-tab-padding-inline-lg: var(--component-control-frame-padding-action-lg)",
      "--comp-tabs-disabled-fg: var(--component-disabled-text)",
      "--comp-tabs-disabled-cursor: var(--component-disabled-cursor)",
      "--comp-tabs-disabled-opacity: var(--component-disabled-readable-opacity)",
      "--comp-tabs-focus-width: var(--component-focus-ring-width)",
      "--comp-tabs-focus-shadow: inset 0 0 0 var(--comp-tabs-focus-width) var(--comp-tabs-focus-color)",
      "--comp-tabs-focus-offset: var(--component-outline-none)",
      "--comp-tabs-underline-indicator-shadow: var(--component-depth-none)",
      "align-items: var(--comp-tabs-align)",
      "background: var(--comp-tabs-bg)",
      "border: var(--comp-tabs-border)",
      "border-radius: var(--comp-tabs-radius)",
      "display: var(--comp-tabs-display)",
      "gap: var(--comp-tabs-gap)",
      "inline-size: fit-content",
      "max-inline-size: 100%",
      "overflow-x: auto",
      "overflow-y: hidden",
      "padding: var(--comp-tabs-padding)",
      "scrollbar-width: none",
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
      "block-size: var(--comp-tabs-tab-min-block)",
      "box-sizing: border-box",
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
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-tabs-disabled-fg)",
      "cursor: var(--comp-tabs-disabled-cursor)",
      "opacity: var(--comp-tabs-disabled-opacity)",
      "transform: var(--component-transform-scale-rest)",
    ],
    message: "Tabs disabled state must be visibly disabled and block pressed motion.",
  });
  requireIncludes({
    block: disabledBadgeBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-badge-bg: var(--component-disabled-bg)",
      "--comp-badge-border: var(--component-disabled-border)",
      "--comp-badge-fg: var(--component-disabled-text)",
      "opacity: var(--component-opacity-visible)",
    ],
    message: "Tabs disabled badges must use readable disabled surface, border, and text tokens instead of opacity-only affordance.",
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
      "box-shadow: var(--comp-tabs-focus-shadow)",
      "outline: var(--component-outline-none)",
      "outline-offset: var(--comp-tabs-focus-offset)",
      "z-index: var(--component-z-raised)",
    ],
    message: "Tabs focus state must use a governed inset ring so scrollable tracks cannot clip visible focus.",
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
  for (const [block, snippets, message] of [
    [
      densitySmBlock,
      [
        "--comp-tabs-tab-min-block: var(--comp-tabs-tab-min-block-sm)",
        "--comp-tabs-tab-padding-inline: var(--comp-tabs-tab-padding-inline-sm)",
        "--comp-tabs-tab-font-size: var(--comp-tabs-tab-font-size-sm)",
      ],
      "Tabs small density must set tab size, padding, and font aliases from ControlFrame.",
    ],
    [
      densityLgBlock,
      [
        "--comp-tabs-tab-min-block: var(--comp-tabs-tab-min-block-lg)",
        "--comp-tabs-tab-padding-inline: var(--comp-tabs-tab-padding-inline-lg)",
        "--comp-tabs-tab-font-size: var(--comp-tabs-tab-font-size-lg)",
      ],
      "Tabs large density must set tab size, padding, and font aliases from ControlFrame.",
    ],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets,
      message,
    });
  }
}

module.exports = { checkTabsCssContract };
