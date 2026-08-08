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

function checkBreadcrumbsCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/Breadcrumbs.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".breadcrumbs");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".breadcrumbs[data-full-width=\"true\"]");
  const listBlock = blockFor(blocks, selectorKey, ".breadcrumbs ol");
  const itemBlock = blockFor(blocks, selectorKey, ".breadcrumbs__item");
  const targetBlock = blockFor(blocks, selectorKey, ".breadcrumbs__target");
  const focusBlock = blockFor(blocks, selectorKey, ".breadcrumbs a.breadcrumbs__target:focus-visible");
  const hoverBlock = blockFor(blocks, selectorKey, ".breadcrumbs a.breadcrumbs__target:hover,.breadcrumbs[data-state=\"hover\"] a.breadcrumbs__target:first-of-type");
  const currentBlock = blockFor(blocks, selectorKey, ".breadcrumbs [aria-current=\"page\"]");
  const separatorBlock = blockFor(blocks, selectorKey, ".breadcrumbs__separator");
  const collapsedBlock = blockFor(blocks, selectorKey, ".breadcrumbs__target--collapsed");
  const densitySmBlock = blockFor(blocks, selectorKey, ".breadcrumbs[data-variant=\"compact\"],.breadcrumbs[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".breadcrumbs[data-variant=\"mobile\"],.breadcrumbs[data-density=\"lg\"]");
  const stateFocusBlock = blockFor(blocks, selectorKey, ".breadcrumbs[data-state=\"focus\"] a.breadcrumbs__target:first-of-type");
  const stateCollapsedBlock = blockFor(blocks, selectorKey, ".breadcrumbs[data-state=\"collapsed\"] .breadcrumbs__target--collapsed");
  const disabledBlock = blockFor(blocks, selectorKey, ".breadcrumbs[data-state=\"disabled\"],.breadcrumbs[aria-disabled=\"true\"]");

  if (!source.includes("forwardRef") || !source.includes("flowVariantProps(resolvedVariant)") || !source.includes("flowDensityProps(density)")) {
    add("errors", sourceFile, 1, "Breadcrumbs must expose real React ref, variant/state, and density props.");
  }
  if (!source.includes("if (!visibleItems.length) return null;") || !source.includes("return item?.label && stableKey !== undefined && stableKey !== null && stableKey !== \"\";")) {
    add("errors", sourceFile, 1, "Breadcrumbs must filter invalid path items and avoid empty navigation shells.");
  }
  if (/href:\s*item\.href\s*\?\?\s*"#"/.test(source)) {
    add("errors", sourceFile, 1, "Breadcrumbs must not synthesize href=\"#\" for non-navigable items.");
  }
  if (/\.breadcrumbs ol,\s*\.pagination\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".breadcrumbs ol")), "Breadcrumbs must not share its root list layout block with Pagination.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-breadcrumbs-list-align: center",
      "--comp-breadcrumbs-list-display: flex",
      "--comp-breadcrumbs-list-wrap: wrap",
      "--comp-breadcrumbs-item-display: inline-flex",
      "--comp-breadcrumbs-target-display: inline-flex",
      "--comp-breadcrumbs-target-block: var(--component-control-min-size)",
      "--comp-breadcrumbs-width: fit-content",
      "--comp-breadcrumbs-full-width: 100%",
      "color: var(--comp-breadcrumbs-target-fg)",
      "inline-size: var(--comp-breadcrumbs-width)",
    ],
    message: "Breadcrumbs root must own list, item, target, density, and width aliases.",
  });
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-breadcrumbs-full-width)"],
    message: "Breadcrumbs full-width state must consume width alias.",
  });
  requireIncludes({
    block: listBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-breadcrumbs-list-align)",
      "display: var(--comp-breadcrumbs-list-display)",
      "flex-wrap: var(--comp-breadcrumbs-list-wrap)",
      "gap: var(--comp-breadcrumbs-list-gap)",
      "list-style: var(--comp-breadcrumbs-list-style)",
      "margin: var(--comp-breadcrumbs-list-margin)",
      "padding: var(--comp-breadcrumbs-list-padding)",
    ],
    message: "Breadcrumbs list must consume list aliases.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-breadcrumbs-item-align)",
      "display: var(--comp-breadcrumbs-item-display)",
      "gap: var(--comp-breadcrumbs-item-gap)",
    ],
    message: "Breadcrumbs item must consume item aliases.",
  });
  requireIncludes({
    block: targetBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-breadcrumbs-target-align)",
      "border-radius: var(--comp-breadcrumbs-target-radius)",
      "color: var(--comp-breadcrumbs-target-fg)",
      "display: var(--comp-breadcrumbs-target-display)",
      "font-size: var(--comp-breadcrumbs-font-size)",
      "font-weight: var(--comp-breadcrumbs-target-weight)",
      "justify-content: var(--comp-breadcrumbs-target-justify)",
      "line-height: var(--comp-breadcrumbs-target-line-height)",
      "min-block-size: var(--comp-breadcrumbs-target-block)",
      "min-inline-size: var(--comp-breadcrumbs-target-block)",
      "padding-inline: var(--comp-breadcrumbs-target-padding-inline)",
      "text-decoration: var(--comp-breadcrumbs-target-decoration)",
    ],
    message: "Breadcrumbs target must consume target frame and voice aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-breadcrumbs-focus-width) solid var(--comp-breadcrumbs-focus-color)",
      "outline-offset: var(--comp-breadcrumbs-focus-offset)",
    ],
    message: "Breadcrumbs focus target must consume accessibility aliases.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-breadcrumbs-hover-bg)", "color: var(--comp-breadcrumbs-hover-fg)"],
    message: "Breadcrumbs hover state must consume hover aliases.",
  });
  requireIncludes({
    block: currentBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-breadcrumbs-current-fg)", "font-weight: var(--comp-breadcrumbs-current-weight)"],
    message: "Breadcrumbs current page must consume current aliases.",
  });
  requireIncludes({
    block: separatorBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-breadcrumbs-separator-fg)",
      "font-family: var(--comp-breadcrumbs-separator-family)",
      "font-size: var(--comp-breadcrumbs-separator-size)",
      "font-weight: var(--comp-breadcrumbs-separator-weight)",
      "line-height: var(--comp-breadcrumbs-separator-line-height)",
    ],
    message: "Breadcrumbs separator must consume iconography aliases.",
  });
  requireIncludes({
    block: collapsedBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-breadcrumbs-collapsed-fg)", "letter-spacing: var(--comp-breadcrumbs-collapsed-letter-spacing)"],
    message: "Breadcrumbs collapsed target must consume collapsed aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "Breadcrumbs compact/small density must set target size, padding, and font aliases."],
    [densityLgBlock, "Breadcrumbs mobile/large density must set target size, padding, and font aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: ["--comp-breadcrumbs-target-block:", "--comp-breadcrumbs-target-padding-inline:", "--comp-breadcrumbs-font-size:"],
      message,
    });
  }
  requireIncludes({
    block: stateFocusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-breadcrumbs-focus-width) solid var(--comp-breadcrumbs-focus-color)",
      "outline-offset: var(--comp-breadcrumbs-focus-offset)",
    ],
    message: "Breadcrumbs focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: stateCollapsedBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-breadcrumbs-collapsed-bg)"],
    message: "Breadcrumbs collapsed state must consume collapsed surface alias.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-breadcrumbs-disabled-fg)",
      "cursor: var(--comp-breadcrumbs-disabled-cursor)",
      "opacity: var(--comp-breadcrumbs-disabled-opacity)",
    ],
    message: "Breadcrumbs disabled state must consume disabled aliases.",
  });
}

module.exports = { checkBreadcrumbsCssContract };
