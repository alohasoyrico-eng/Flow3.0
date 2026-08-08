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

  if (text.includes("--table-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--table-")), "Table must not introduce short --table-* aliases; use the component namespace and --comp-table-current-* resolved aliases.");
  }
  const localExpanderSize = /--comp-table-expander-size:\s*var\(--component-control-min-size\)/.exec(text);
  if (localExpanderSize) {
    add("errors", packageCssFile, lineNumber(text, localExpanderSize.index), "Table expander size must consume table expander frame roles instead of the generic control min size.");
  }
  if (!text.includes("--comp-table-expander-size: var(--component-table-expander-size)")) {
    add("errors", packageCssFile, 1, "Table expander size must expose the component table expander frame alias.");
  }

  requireIncludes({
    block: tableBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-table-current-cell-block-padding: var(--comp-table-cell-padding-block-md)",
      "--comp-table-current-cell-inline-padding: var(--comp-table-cell-padding-inline-md)",
      "--comp-table-current-border-width: var(--comp-table-border-width)",
      "--comp-table-current-header-bg: var(--comp-table-header-bg)",
      "--comp-table-current-row-selected-rail-width: var(--comp-table-row-selected-rail-width)",
      "--comp-table-current-sort-gap: var(--comp-table-sort-gap)",
      "--comp-table-current-expander-cell-inline-size: calc(var(--comp-table-expander-size) + var(--comp-table-expander-cell-gap))",
      "--comp-table-current-detail-padding-inline-start: calc(var(--comp-table-expander-size) + var(--comp-table-current-cell-inline-padding))",
    ],
    message: "Table base must expose component-scoped current aliases for density, borders, header, selection, sort rhythm, expander geometry, and detail padding.",
  });

  const contracts = [
    [cellBlock, ["border-block-end: var(--comp-table-current-border-width) solid var(--comp-table-current-border)", "font-size: var(--comp-table-current-body-size)", "padding: var(--comp-table-current-cell-block-padding) var(--comp-table-current-cell-inline-padding)"], "Table cells must consume component-scoped current density and border aliases."],
    [headerBlock, ["background: var(--comp-table-current-header-bg)", "font-weight: var(--comp-table-current-header-weight)", "text-transform: var(--comp-table-current-header-transform)"], "Table header surface and voice must consume component-scoped current aliases."],
    [hoverBlock, ["background: var(--comp-table-current-row-hover-bg)"], "Table hover rows must consume the component-scoped row-hover alias."],
    [focusBlock, ["outline: var(--comp-table-current-focus-width) solid var(--comp-table-current-focus-color)", "outline-offset: calc(var(--comp-table-current-focus-offset) * -1)"], "Table focus rows must consume component-scoped focus aliases."],
    [selectedBlock, ["background: var(--comp-table-current-row-selected-bg)", "box-shadow: inset var(--comp-table-current-row-selected-rail-width) 0 0 var(--comp-table-current-row-selected-accent)"], "Table selected rows must consume component-scoped selection aliases."],
    [sortBlock, ["gap: var(--comp-table-current-sort-gap)"], "Table sort trigger rhythm must consume the component-scoped sort alias."],
    [activeAscBlock, ["opacity: var(--comp-table-current-sort-active-icon-opacity)"], "Table active ascending sort icon must consume the component-scoped active opacity alias."],
    [activeDescBlock, ["opacity: var(--comp-table-current-sort-active-icon-opacity)"], "Table active descending sort icon must consume the component-scoped active opacity alias."],
    [expanderCellBlock, ["inline-size: var(--comp-table-current-expander-cell-inline-size)", "padding-inline-end: var(--comp-table-current-expander-cell-padding-inline-end)"], "Table expander cells must consume component-scoped expander geometry aliases."],
    [expanderBlock, ["font-size: var(--comp-table-current-expander-icon-size)"], "Table expander icon size must consume the component-scoped icon alias."],
    [expandedBlock, ["transform: var(--comp-table-current-expander-expanded-transform)"], "Table expanded row marker must consume the component-scoped expanded transform alias."],
    [detailBlock, ["background: var(--comp-table-current-detail-bg)", "padding-block: var(--comp-table-current-detail-padding-block)", "padding-inline-start: var(--comp-table-current-detail-padding-inline-start)"], "Table detail row must consume component-scoped detail aliases."],
  ];
  for (const [block, snippets, message] of contracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkTableCssContract };
