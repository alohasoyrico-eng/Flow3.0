const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkTableCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const tableBlock = blockFor(blocks, selectorKey, ".table");
  const cellBlock = blockFor(blocks, selectorKey, ".table th,.table td");
  const headerBlock = blockFor(blocks, selectorKey, ".table th");
  const hoverBlock = blockFor(blocks, selectorKey, ".table tbody tr:hover,.table tbody tr[data-state=\"hover\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".table tbody tr:focus-visible,.table tbody tr[data-state=\"focus\"]");
  const selectedBlock = blockFor(blocks, selectorKey, ".table tr[data-selected=\"true\"]");
  const sortBlock = blockFor(blocks, selectorKey, ".table__sort");
  const activeAscBlock = blockFor(blocks, selectorKey, ".table__sort[data-active=\"true\"][data-dir=\"asc\"]::after");
  const activeDescBlock = blockFor(blocks, selectorKey, ".table__sort[data-active=\"true\"][data-dir=\"desc\"]::after");
  const expanderCellBlock = blockFor(blocks, selectorKey, ".table__expander-head,.table__expander-cell");
  const expanderBlock = blockFor(blocks, selectorKey, ".table__expander");
  const expandedBlock = blockFor(blocks, selectorKey, ".table tr[aria-expanded=\"true\"] .table__expander");
  const detailBlock = blockFor(blocks, selectorKey, ".table__detail");

  requireIncludes({
    block: tableBlock,
    text,
    packageCssFile,
    snippets: [
      "--table-border-width: var(--comp-table-border-width)",
      "--table-header-bg: var(--comp-table-header-bg)",
      "--table-row-selected-rail-width: var(--comp-table-row-selected-rail-width)",
      "--table-sort-gap: var(--comp-table-sort-gap)",
      "--table-expander-cell-inline-size: calc(var(--comp-table-expander-size) + var(--comp-table-expander-cell-gap))",
      "--table-detail-padding-inline-start: calc(var(--comp-table-expander-size) + var(--table-cell-inline-padding))",
    ],
    message: "Table base must expose local aliases for borders, header, selection, sort rhythm, expander geometry, and detail padding.",
  });

  const contracts = [
    [cellBlock, ["border-block-end: var(--table-border-width) solid var(--table-border)"], "Table cells must consume local border aliases."],
    [headerBlock, ["background: var(--table-header-bg)", "font-weight: var(--table-header-weight)", "text-transform: var(--table-header-transform)"], "Table header surface and voice must consume local aliases."],
    [hoverBlock, ["background: var(--table-row-hover-bg)"], "Table hover rows must consume the local row-hover alias."],
    [focusBlock, ["outline: var(--table-focus-width) solid var(--table-focus-color)", "outline-offset: calc(var(--table-focus-offset) * -1)"], "Table focus rows must consume local focus aliases."],
    [selectedBlock, ["background: var(--table-row-selected-bg)", "box-shadow: inset var(--table-row-selected-rail-width) 0 0 var(--table-row-selected-accent)"], "Table selected rows must consume local selection aliases."],
    [sortBlock, ["gap: var(--table-sort-gap)"], "Table sort trigger rhythm must consume the local sort alias."],
    [activeAscBlock, ["opacity: var(--table-sort-active-icon-opacity)"], "Table active ascending sort icon must consume the local active opacity alias."],
    [activeDescBlock, ["opacity: var(--table-sort-active-icon-opacity)"], "Table active descending sort icon must consume the local active opacity alias."],
    [expanderCellBlock, ["inline-size: var(--table-expander-cell-inline-size)", "padding-inline-end: var(--table-expander-cell-padding-inline-end)"], "Table expander cells must consume local expander geometry aliases."],
    [expanderBlock, ["font-size: var(--table-expander-icon-size)"], "Table expander icon size must consume the local icon alias."],
    [expandedBlock, ["transform: var(--table-expander-expanded-transform)"], "Table expanded row marker must consume the local expanded transform alias."],
    [detailBlock, ["background: var(--table-detail-bg)", "padding-block: var(--table-detail-padding-block)", "padding-inline-start: var(--table-detail-padding-inline-start)"], "Table detail row must consume local detail aliases."],
  ];
  for (const [block, snippets, message] of contracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkTableCssContract };
