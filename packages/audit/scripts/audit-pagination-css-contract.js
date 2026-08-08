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

function checkPaginationCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/Pagination.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".pagination");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".pagination[data-full-width=\"true\"]");
  const buttonBlock = blockFor(blocks, selectorKey, ".pagination__button");
  const hoverBlock = blockFor(blocks, selectorKey, ".pagination__button:hover,.pagination[data-state=\"hover\"] .pagination__button:not([aria-current=\"page\"]):not(:disabled)");
  const focusBlock = blockFor(blocks, selectorKey, ".pagination__button:focus-visible,.pagination[data-state=\"focus\"] .pagination__button:not([aria-current=\"page\"]):not(:disabled)");
  const activeBlock = blockFor(blocks, selectorKey, ".pagination__button:active:not(:disabled)");
  const currentBlock = blockFor(blocks, selectorKey, ".pagination__button[aria-current=\"page\"],.pagination[data-state=\"selected\"] .pagination__button[aria-current=\"page\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".pagination__button:disabled,.pagination[data-state=\"disabled\"] .pagination__button");
  const iconBlock = blockFor(blocks, selectorKey, ".pagination__icon");
  const ellipsisBlock = blockFor(blocks, selectorKey, ".pagination__ellipsis");
  const densitySmBlock = blockFor(blocks, selectorKey, ".pagination[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".pagination[data-density=\"lg\"]");

  if (!source.includes("const currentPage = isPageControlled ? normalized.currentPage : internalPage;") || !source.includes("if (!isPageControlled) setInternalPage(next);") || !source.includes("onPageChange(next, event);")) {
    add("errors", sourceFile, 1, "Pagination must keep real controlled/uncontrolled page behavior and pass the source event.");
  }
  if (!source.includes("if (!hasLabels || !hasPages) return null;") || !source.includes("\"aria-current\": current ? \"page\" : undefined")) {
    add("errors", sourceFile, 1, "Pagination must require accessible labels and expose aria-current for the selected page.");
  }
  if (/\.breadcrumbs ol,\s*\.pagination\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".breadcrumbs ol")), "Pagination must not share its root layout block with Breadcrumbs.");
  }
  const localNavigationSize = /--comp-pagination-(?:size|size-sm|size-lg|ellipsis-inline-size):\s*(?:calc\(var\(--component-control-min-size\)[^;]+|var\(--component-control-min-size\));/.exec(text);
  if (localNavigationSize) {
    add("errors", packageCssFile, lineNumber(text, localNavigationSize.index), "Pagination navigation target sizes must flow through shared Frame navigation roles instead of local control-size calculations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-pagination-align: var(--component-align-center)",
      "--comp-pagination-button-display: var(--component-display-inline-flex)",
      "--comp-pagination-cursor: var(--component-cursor-pointer)",
      "--comp-pagination-disabled-cursor: var(--component-cursor-default)",
      "--comp-pagination-full-width: var(--component-inline-size-full)",
      "--comp-pagination-size: var(--component-navigation-target-size-md)",
      "--comp-pagination-size-sm: var(--component-navigation-target-size-sm)",
      "--comp-pagination-size-lg: var(--component-navigation-target-size-lg)",
      "--comp-pagination-ellipsis-inline-size: var(--component-navigation-ellipsis-inline-size)",
      "--comp-pagination-gap:",
      "--comp-pagination-wrap: var(--component-flex-wrap-wrap)",
      "--comp-pagination-width: var(--component-inline-size-fit-content)",
      "align-items: var(--comp-pagination-align)",
      "display: var(--comp-pagination-button-display)",
      "flex-wrap: var(--comp-pagination-wrap)",
      "gap: var(--comp-pagination-gap)",
      "inline-size: var(--comp-pagination-width)",
    ],
    message: "Pagination root must own layout, density, width, and control aliases.",
  });
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-pagination-full-width)"],
    message: "Pagination full-width state must consume width alias.",
  });
  requireIncludes({
    block: buttonBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-pagination-button-align)",
      "background: var(--comp-pagination-button-bg)",
      "border: var(--comp-pagination-button-border)",
      "border-radius: var(--comp-pagination-radius)",
      "color: var(--comp-pagination-fg)",
      "cursor: var(--comp-pagination-cursor)",
      "display: var(--comp-pagination-button-display)",
      "font-family: var(--comp-pagination-font-family)",
      "font-size: var(--comp-pagination-font-size)",
      "font-weight: var(--comp-pagination-font-weight)",
      "justify-content: var(--comp-pagination-button-justify)",
      "min-block-size: var(--comp-pagination-size)",
      "min-inline-size: var(--comp-pagination-size)",
      "padding-inline: var(--comp-pagination-padding-inline)",
    ],
    message: "Pagination buttons must consume control, voice, and density aliases.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-pagination-hover-bg)", "color: var(--comp-pagination-hover-fg)"],
    message: "Pagination hover state must consume hover aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-pagination-focus-width) solid var(--comp-pagination-focus-color)",
      "outline-offset: var(--comp-pagination-focus-offset)",
    ],
    message: "Pagination focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: activeBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-pagination-press-transform)"],
    message: "Pagination active state must consume press motion alias.",
  });
  requireIncludes({
    block: currentBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-pagination-current-bg)",
      "box-shadow: var(--comp-pagination-current-shadow)",
      "color: var(--comp-pagination-current-fg)",
      "cursor: var(--comp-pagination-current-cursor)",
      "font-weight: var(--comp-pagination-current-weight)",
    ],
    message: "Pagination current page must consume selected aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-pagination-disabled-cursor)", "opacity: var(--comp-pagination-disabled-opacity)"],
    message: "Pagination disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--comp-pagination-icon-family)",
      "font-size: var(--comp-pagination-icon-size)",
      "line-height: var(--comp-pagination-icon-line-height)",
    ],
    message: "Pagination icons must consume iconography aliases.",
  });
  requireIncludes({
    block: ellipsisBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-pagination-button-align)",
      "color: var(--comp-pagination-ellipsis-fg)",
      "display: var(--comp-pagination-button-display)",
      "font-family: var(--comp-pagination-font-family)",
      "justify-content: var(--comp-pagination-button-justify)",
      "min-inline-size: var(--comp-pagination-ellipsis-inline-size)",
    ],
    message: "Pagination ellipsis must consume pagination aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "Pagination small density must set size, gap, and padding aliases."],
    [densityLgBlock, "Pagination large density must set size, gap, and padding aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: ["--comp-pagination-size:", "--comp-pagination-gap:", "--comp-pagination-padding-inline:"],
      message,
    });
  }
}

module.exports = { checkPaginationCssContract };
