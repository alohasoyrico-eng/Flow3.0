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

function checkSegmentedControlCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/SegmentedControl.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".segmented-control");
  const toolbarBlock = blockFor(blocks, selectorKey, ".segmented-control[data-variant=\"toolbar\"]");
  const compactBlock = blockFor(blocks, selectorKey, ".segmented-control[data-variant=\"compact\"]");
  const densitySmBlock = blockFor(blocks, selectorKey, ".segmented-control[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".segmented-control[data-density=\"lg\"]");
  const indicatorBlock = blockFor(blocks, selectorKey, ".segmented-control__indicator");
  const itemBlock = blockFor(blocks, selectorKey, ".segmented-control__item");
  const selectedIndicatorBlock = blockFor(blocks, selectorKey, ".segmented-control__item[aria-selected=\"true\"] .segmented-control__indicator");
  const activeBlock = blockFor(blocks, selectorKey, ".segmented-control__item:active:not(:disabled)");
  const selectedBlock = blockFor(blocks, selectorKey, ".segmented-control__item[aria-selected=\"true\"]");
  const selectedIconBlock = blockFor(blocks, selectorKey, ".segmented-control__item[aria-selected=\"true\"] .segmented-control__icon");
  const contentBlock = blockFor(blocks, selectorKey, ".segmented-control__icon,.segmented-control__label");
  const focusBlock = blockFor(blocks, selectorKey, ".segmented-control__item:focus-visible");
  const iconBlock = blockFor(blocks, selectorKey, ".segmented-control__icon");
  const labelBlock = blockFor(blocks, selectorKey, ".segmented-control__label");
  const iconOnlyBlock = blockFor(blocks, selectorKey, ".segmented-control[data-variant=\"icon-only\"]");
  const iconOnlyItemBlock = blockFor(blocks, selectorKey, ".segmented-control[data-variant=\"icon-only\"] .segmented-control__item");
  const iconOnlyLabelBlock = blockFor(blocks, selectorKey, ".segmented-control[data-variant=\"icon-only\"] .segmented-control__item[data-icon-only=\"true\"] .segmented-control__label");

  if (
    !source.includes("forwardRef") ||
    !source.includes("segmentedControlPlatformContract") ||
    !source.includes("flowVariantProps(resolvedVariant)") ||
    !source.includes("flowDensityProps(density)")
  ) {
    add("errors", sourceFile, 1, "SegmentedControl must expose a real React ref contract, platform contract, variant, and density props.");
  }
  if (!source.includes("if (!label || !normalizedItems.length) return null;") || !source.includes("role: \"tablist\"") || !source.includes("role: \"tab\"")) {
    add("errors", sourceFile, 1, "SegmentedControl must avoid unnamed/empty shells and keep tablist/tab accessibility roles.");
  }
  if (!source.includes("const schedule = globalThis.requestAnimationFrame") || !source.includes("globalThis.setTimeout?.(callback, 0)")) {
    add("errors", sourceFile, 1, "SegmentedControl keyboard focus scheduling must tolerate non-browser React runtimes.");
  }
  if (!source.includes("ArrowRight") || !source.includes("ArrowLeft") || !source.includes("Home") || !source.includes("End") || !source.includes("onValueChange?.(nextKey, event);")) {
    add("errors", sourceFile, 1, "SegmentedControl must keep keyboard roving behavior and pass the source event to onValueChange.");
  }
  if (blocks.filter((block) => selectorKey(block) === ".segmented-control").length > 1) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".segmented-control")), "SegmentedControl must not define duplicate root blocks or share a layout block with another component.");
  }
  if (/\.code-input \.code-input__slots,\s*\.segmented-control\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".code-input .code-input__slots")), "SegmentedControl must not share root layout with CodeInput slots.");
  }
  const localInlineSize = /--comp-segmented-control-inline-size:\s*min\(100%,\s*calc\([^;]*--component-control-min-size[^;]*\)\)/.exec(text);
  if (localInlineSize) {
    add("errors", packageCssFile, lineNumber(text, localInlineSize.index), "SegmentedControl inline size must flow through shared frame/content roles instead of local control-size math.");
  }
  const localItemSize = /--comp-segmented-control-item-min-block:\s*var\(--component-control-min-size\)/.exec(text);
  if (localItemSize) {
    add("errors", packageCssFile, lineNumber(text, localItemSize.index), "SegmentedControl item target must consume inline trigger roles instead of the generic control min size.");
  }
  const localDensityItemSize = /--comp-segmented-control-item-min-block-(?:sm|lg):\s*(?:var\(--sys-space-9\)|calc\(var\(--sys-frame-height-control-sm\)\s*\+\s*var\(--sys-space-xs\)\));/.exec(text);
  if (localDensityItemSize) {
    add("errors", packageCssFile, lineNumber(text, localDensityItemSize.index), "SegmentedControl density item targets must route through --component-segmented-control-item-min-block-* aliases.");
  }
  for (const density of ["sm", "lg"]) {
    const componentAlias = `--comp-segmented-control-item-min-block-${density}: var(--component-segmented-control-item-min-block-${density});`;
    if (!text.includes(componentAlias)) {
      add("errors", packageCssFile, 1, `SegmentedControl ${density} item target must consume --component-segmented-control-item-min-block-${density}.`);
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-segmented-control-align: stretch",
      "--comp-segmented-control-display: var(--component-display-inline-flex)",
      "--comp-segmented-control-gap: var(--component-frame-space-none)",
      "--comp-segmented-control-indicator-selected-transform: var(--component-transform-scale-rest)",
      "--comp-segmented-control-item-align: center",
      "--comp-segmented-control-item-display: var(--component-display-inline-flex)",
      "--comp-segmented-control-item-min-block: var(--component-inline-trigger-min-block-size-md)",
      "--comp-segmented-control-icon-selected-variation: var(--sys-icon-variation-filled-strong)",
      "--comp-segmented-control-inline-size: min(100%, var(--component-segmented-control-inline-size))",
      "--comp-segmented-control-visually-hidden-size: var(--component-visually-hidden-size)",
      "align-items: var(--comp-segmented-control-align)",
      "display: var(--comp-segmented-control-display)",
      "gap: var(--comp-segmented-control-gap)",
      "position: var(--comp-segmented-control-position)",
    ],
    message: "SegmentedControl root must own and consume aliases for frame, layout, indicator, item, icon, density, and accessibility.",
  });
  for (const [block, message] of [
    [toolbarBlock, "SegmentedControl toolbar variant must set item size, padding, icon size, bg, and width aliases."],
    [compactBlock, "SegmentedControl compact variant must set item size, padding, icon size, and width aliases."],
    [densitySmBlock, "SegmentedControl small density must set item size, padding, and icon aliases."],
    [densityLgBlock, "SegmentedControl large density must set item size, padding, and icon aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-segmented-control-item-min-block:",
        "--comp-segmented-control-item-padding-inline:",
        "--comp-segmented-control-icon-size:",
      ],
      message,
    });
  }
  requireIncludes({
    block: indicatorBlock,
    text,
    packageCssFile,
    snippets: [
      "pointer-events: var(--comp-segmented-control-indicator-pointer-events)",
      "position: var(--comp-segmented-control-indicator-position)",
      "transform: var(--comp-segmented-control-indicator-transform)",
    ],
    message: "SegmentedControl indicator must consume indicator aliases.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-segmented-control-item-align)",
      "background: var(--comp-segmented-control-item-bg)",
      "border: var(--comp-segmented-control-item-border)",
      "cursor: var(--comp-segmented-control-item-cursor)",
      "display: var(--comp-segmented-control-item-display)",
      "flex: var(--comp-segmented-control-item-flex)",
      "justify-content: var(--comp-segmented-control-item-justify)",
      "min-inline-size: var(--comp-segmented-control-item-min-inline)",
      "z-index: var(--comp-segmented-control-item-z)",
    ],
    message: "SegmentedControl item must consume item aliases for layout, frame, and depth.",
  });
  requireIncludes({
    block: selectedIndicatorBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-segmented-control-indicator-selected-transform)"],
    message: "SegmentedControl selected indicator must consume selected transform alias.",
  });
  requireIncludes({
    block: activeBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-segmented-control-press-transform)"],
    message: "SegmentedControl active state must consume press alias.",
  });
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-segmented-control-item-selected-fg)", "font-weight: var(--comp-segmented-control-item-selected-weight)"],
    message: "SegmentedControl selected item must consume selected aliases.",
  });
  requireIncludes({
    block: selectedIconBlock,
    text,
    packageCssFile,
    snippets: ["font-variation-settings: var(--comp-segmented-control-icon-selected-variation)"],
    message: "SegmentedControl selected icon must consume iconography alias.",
  });
  requireIncludes({
    block: contentBlock,
    text,
    packageCssFile,
    snippets: ["position: var(--comp-segmented-control-content-position)", "z-index: var(--comp-segmented-control-content-z)"],
    message: "SegmentedControl icon and label content must consume content depth aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-segmented-control-focus-width) solid var(--comp-segmented-control-focus-color)",
      "outline-offset: var(--comp-segmented-control-focus-offset)",
    ],
    message: "SegmentedControl focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-segmented-control-icon-size)", "line-height: var(--comp-segmented-control-icon-line-height)"],
    message: "SegmentedControl icon must consume icon aliases.",
  });
  requireIncludes({
    block: labelBlock,
    text,
    packageCssFile,
    snippets: [
      "overflow: var(--comp-segmented-control-label-overflow)",
      "text-overflow: var(--comp-segmented-control-label-text-overflow)",
      "white-space: var(--comp-segmented-control-label-white-space)",
    ],
    message: "SegmentedControl label must consume truncation aliases.",
  });
  requireIncludes({
    block: iconOnlyBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-segmented-control-icon-only-inline-size)"],
    message: "SegmentedControl icon-only root must consume icon-only width alias.",
  });
  requireIncludes({
    block: iconOnlyItemBlock,
    text,
    packageCssFile,
    snippets: [
      "aspect-ratio: var(--comp-segmented-control-icon-only-item-aspect-ratio)",
      "padding: var(--comp-segmented-control-icon-only-item-padding)",
    ],
    message: "SegmentedControl icon-only item must consume icon-only item aliases.",
  });
  requireIncludes({
    block: iconOnlyLabelBlock,
    text,
    packageCssFile,
    snippets: [
      "block-size: var(--comp-segmented-control-visually-hidden-size)",
      "clip: var(--comp-segmented-control-visually-hidden-clip)",
      "clip-path: var(--comp-segmented-control-visually-hidden-clip-path)",
      "inline-size: var(--comp-segmented-control-visually-hidden-size)",
      "margin: var(--comp-segmented-control-visually-hidden-margin)",
      "overflow: var(--comp-segmented-control-visually-hidden-overflow)",
      "position: var(--comp-segmented-control-visually-hidden-position)",
      "white-space: var(--comp-segmented-control-visually-hidden-white-space)",
    ],
    message: "SegmentedControl icon-only hidden label must consume accessibility aliases.",
  });
}

module.exports = { checkSegmentedControlCssContract };
