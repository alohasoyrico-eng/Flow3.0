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
  const embeddedBlock = blockFor(blocks, selectorKey, ".table[data-surface=\"embedded\"]");
  const nativeTableBlock = blockFor(blocks, selectorKey, ".table table");
  const colBlock = blockFor(blocks, selectorKey, ".table col");
  const selectionColBlock = blockFor(blocks, selectorKey, ".table col.table__selection-col");
  const expanderColBlock = blockFor(blocks, selectorKey, ".table col.table__expander-col");
  const cellBlock = blockFor(blocks, selectorKey, ".table th,.table td");
  const headerBlock = blockFor(blocks, selectorKey, ".table th");
  const stickyBlock = blockFor(blocks, selectorKey, ".table[data-sticky=\"true\"] th");
  const zebraBlock = blockFor(blocks, selectorKey, ".table[data-zebra=\"true\"] tbody tr:nth-child(even):not(.table__detail-row):not(.table__group-row)");
  const hoverBlock = blockFor(blocks, selectorKey, ".table tbody tr:hover,.table tbody tr[data-state=\"hover\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".table tbody tr:focus-visible,.table tbody tr[data-state=\"focus\"]");
  const selectedBlock = blockFor(blocks, selectorKey, ".table tr[data-selected=\"true\"]");
  const emptyBlock = blockFor(blocks, selectorKey, ".table__empty");
  const emptyStateBlock = blockFor(blocks, selectorKey, ".table__empty .empty-state");
  const groupBlock = blockFor(blocks, selectorKey, ".table__group");
  const selectionBlock = blockFor(blocks, selectorKey, ".table__selection-head,.table__selection-cell");
  const selectionChoiceBlock = blockFor(blocks, selectorKey, ".table__selection-head .choice,.table__selection-cell .choice");
  const selectionTextBlock = blockFor(blocks, selectorKey, ".table__selection-head .choice__text,.table__selection-cell .choice__text,.table__expander-label");
  const editInputBlock = blockFor(blocks, selectorKey, ".table__edit-input");
  const treeIndentBlock = blockFor(blocks, selectorKey, ".table tr[aria-level] td:first-of-type:not(.table__selection-cell):not(.table__expander-cell),.table tr[aria-level] .table__expander-cell + td");
  const alignRightSortBlock = blockFor(blocks, selectorKey, ".table [data-align=\"right\"] .table__sort");
  const alignRightSortIconBlock = blockFor(blocks, selectorKey, ".table [data-align=\"right\"] .table__sort::after");
  const alignCenterBlock = blockFor(blocks, selectorKey, ".table [data-align=\"center\"]");
  const alignCenterSortBlock = blockFor(blocks, selectorKey, ".table [data-align=\"center\"] .table__sort");
  const sortBlock = blockFor(blocks, selectorKey, ".table__sort");
  const monoBlock = blockFor(blocks, selectorKey, ".table [data-mono=\"true\"]");
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
  if (text.includes("--comp-table-depth: var(--component-depth-panel-strong)") || text.includes("--comp-table-depth: var(--component-depth-panel)")) {
    const depthIndex = text.includes("--comp-table-depth: var(--component-depth-panel-strong)")
      ? text.indexOf("--comp-table-depth: var(--component-depth-panel-strong)")
      : text.indexOf("--comp-table-depth: var(--component-depth-panel)");
    add("errors", packageCssFile, lineNumber(text, depthIndex), "Table must use the governed DataGrid/card-rest depth, not floating panel elevation reserved for overlays.");
  }
  if (!text.includes("--comp-table-depth: var(--component-depth-card-rest)")) {
    add("errors", packageCssFile, 1, "Table must map depth to --component-depth-card-rest for DataGrid parity.");
  }
  if (!text.includes("--comp-table-embedded-depth: var(--component-depth-none)")) {
    add("errors", packageCssFile, 1, "Table embedded depth must map to --component-depth-none instead of hardcoding none.");
  }
  if (!text.includes("--comp-table-column-width: var(--component-inline-size-auto)")) {
    add("errors", packageCssFile, 1, "Table must declare --comp-table-column-width default in the component contract before runtime column overrides consume it.");
  }
  if (!text.includes("--comp-table-tree-depth: var(--component-offset-zero)")) {
    add("errors", packageCssFile, 1, "Table must declare --comp-table-tree-depth default in the component contract before runtime tree overrides consume it.");
  }

  requireIncludes({
    block: tableBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-table-current-cell-block-padding: var(--comp-table-cell-padding-block-md)",
      "--comp-table-current-header-block-padding: var(--comp-table-header-padding-block-md)",
      "--comp-table-current-cell-inline-padding: var(--comp-table-cell-padding-inline-md)",
      "--comp-table-current-border-width: var(--comp-table-border-width)",
      "--comp-table-current-header-bg: var(--comp-table-header-bg)",
      "--comp-table-current-row-selected-rail-width: var(--comp-table-row-selected-rail-width)",
      "--comp-table-current-row-zebra-bg: var(--comp-table-row-zebra-bg)",
      "--comp-table-current-selection-cell-inline-size: var(--comp-table-selection-cell-inline-size)",
      "--comp-table-current-edit-input-min-block-size: var(--comp-table-edit-input-min-block-size)",
      "--comp-table-current-tree-indent: var(--comp-table-tree-indent)",
      "--comp-table-current-group-bg: var(--comp-table-group-bg)",
      "--comp-table-current-sort-gap: var(--comp-table-sort-gap)",
      "--comp-table-current-expander-cell-inline-size: calc(var(--comp-table-expander-size) + var(--comp-table-expander-cell-gap))",
      "--comp-table-current-detail-padding-inline-start: calc(var(--comp-table-expander-size) + var(--comp-table-current-cell-inline-padding))",
      "box-shadow: var(--comp-table-depth)",
    ],
    message: "Table base must expose component-scoped current aliases for density, borders, header, selection, sort rhythm, expander geometry, detail padding, and governed DataGrid depth.",
  });

  const contracts = [
    [embeddedBlock, ["--comp-table-bg: var(--component-surface-transparent)", "--comp-table-depth: var(--comp-table-embedded-depth)", "border-color: var(--component-surface-transparent)"], "Table embedded surface must replace inline border/shadow overrides with a governed surface mode."],
    [nativeTableBlock, ["table-layout: fixed"], "Table native grid must use fixed layout so governed column widths remain contractual."],
    [colBlock, ["inline-size: var(--comp-table-column-width)", "width: var(--comp-table-column-width)"], "Table colgroup data columns must consume governed column width aliases."],
    [selectionColBlock, ["inline-size: var(--comp-table-selection-cell-inline-size)", "width: var(--comp-table-selection-cell-inline-size)"], "Table colgroup selection column must consume the governed selection frame alias."],
    [expanderColBlock, ["inline-size: var(--comp-table-current-expander-cell-inline-size)", "width: var(--comp-table-current-expander-cell-inline-size)"], "Table colgroup expander column must consume the governed expander frame alias."],
    [cellBlock, ["border-block-end: var(--comp-table-current-border-width) solid var(--comp-table-current-border)", "font-size: var(--comp-table-current-body-size)", "inline-size: var(--comp-table-column-width)", "overflow: hidden", "text-overflow: ellipsis", "padding: var(--comp-table-current-cell-block-padding) var(--comp-table-current-cell-inline-padding)"], "Table cells must consume component-scoped current density, width, overflow, and border aliases."],
    [headerBlock, ["background: var(--comp-table-current-header-bg)", "font-weight: var(--comp-table-current-header-weight)", "padding-block: var(--comp-table-current-header-block-padding)", "text-transform: var(--comp-table-current-header-transform)"], "Table header surface, rhythm, and voice must consume component-scoped current aliases."],
    [stickyBlock, ["position: sticky", "z-index: var(--component-z-raised)"], "Table sticky header must use the governed raised z-index token."],
    [zebraBlock, ["background: var(--comp-table-current-row-zebra-bg)"], "Table zebra rows must consume the governed sunken row alias."],
    [hoverBlock, ["background: var(--comp-table-current-row-hover-bg)"], "Table hover rows must consume the component-scoped row-hover alias."],
    [focusBlock, ["outline: var(--comp-table-current-focus-width) solid var(--comp-table-current-focus-color)", "outline-offset: calc(var(--comp-table-current-focus-offset) * -1)"], "Table focus rows must consume component-scoped focus aliases."],
    [selectedBlock, ["background: var(--comp-table-current-row-selected-bg)", "box-shadow: inset var(--comp-table-current-row-selected-rail-width) 0 0 var(--comp-table-current-row-selected-accent)"], "Table selected rows must consume component-scoped selection aliases."],
    [emptyBlock, ["color: var(--comp-table-empty-fg)", "padding-block: var(--comp-table-empty-padding-block)", "text-align: center"], "Table empty state must render in-table with governed spacing and text color."],
    [emptyStateBlock, ["--comp-empty-state-padding-block: var(--component-space-md)", "--comp-empty-state-icon-size: var(--component-empty-state-icon-size-sm)", "max-inline-size: var(--component-content-size-md)"], "Table empty state must compose Flow EmptyState with table-scoped compact spacing instead of plain text or manual HTML."],
    [groupBlock, ["background: var(--comp-table-current-group-bg)", "font-size: var(--comp-table-group-size)", "font-weight: var(--comp-table-group-weight)", "padding-block: var(--comp-table-group-padding-block)", "text-transform: var(--comp-table-group-transform)"], "Table group rows must use their own section-label aliases instead of mimicking the table header."],
    [selectionBlock, ["inline-size: var(--comp-table-current-selection-cell-inline-size)", "max-inline-size: var(--comp-table-current-selection-cell-inline-size)", "min-inline-size: var(--comp-table-current-selection-cell-inline-size)", "width: var(--comp-table-current-selection-cell-inline-size)"], "Table selection column must use governed fixed frame aliases."],
    [selectionChoiceBlock, ["justify-content: center", "min-block-size: auto"], "Table selection checkbox composition must not inflate row height."],
    [selectionTextBlock, ["clip-path: inset(50%)", "position: absolute"], "Table selection and expander header labels must stay accessible without visible duplicate text."],
    [editInputBlock, ["border: var(--comp-table-edit-input-border-width) solid var(--comp-table-edit-input-border)", "box-shadow: var(--comp-table-edit-input-shadow)", "min-block-size: var(--comp-table-current-edit-input-min-block-size)"], "Table editable cells must use governed edit input frame and focus aliases."],
    [treeIndentBlock, ["padding-inline-start: calc(var(--comp-table-current-cell-inline-padding) + (var(--comp-table-tree-depth) * var(--comp-table-current-tree-indent)))"], "Table tree rows must use governed indentation aliases."],
    [alignRightSortBlock, ["justify-content: flex-end"], "Table sortable right-aligned headers must align their internal sort trigger to the column end."],
    [alignRightSortIconBlock, ["order: -1"], "Table sortable right-aligned header icons must sit before the label so numeric labels align to cell values."],
    [alignCenterBlock, ["text-align: center"], "Table must support the DataGrid center alignment contract."],
    [alignCenterSortBlock, ["justify-content: center"], "Table sortable center-aligned headers must align their internal sort trigger to the column center."],
    [monoBlock, ["font-family: var(--comp-table-data-font-family)", "font-variant-numeric: tabular-nums"], "Table mono data cells must consume the governed type-data/mono family and tabular numbers."],
    [sortBlock, ["gap: var(--comp-table-current-sort-gap)"], "Table sort trigger rhythm must consume the component-scoped sort alias."],
    [activeAscBlock, ["opacity: var(--comp-table-current-sort-active-icon-opacity)"], "Table active ascending sort icon must consume the component-scoped active opacity alias."],
    [activeDescBlock, ["opacity: var(--comp-table-current-sort-active-icon-opacity)"], "Table active descending sort icon must consume the component-scoped active opacity alias."],
    [expanderCellBlock, ["inline-size: var(--comp-table-current-expander-cell-inline-size)", "max-inline-size: var(--comp-table-current-expander-cell-inline-size)", "min-inline-size: var(--comp-table-current-expander-cell-inline-size)", "width: var(--comp-table-current-expander-cell-inline-size)"], "Table expander cells must consume fixed component-scoped expander geometry aliases."],
    [expanderBlock, ["font-size: var(--comp-table-current-expander-icon-size)"], "Table expander icon size must consume the component-scoped icon alias."],
    [expandedBlock, ["transform: var(--comp-table-current-expander-expanded-transform)"], "Table expanded row marker must consume the component-scoped expanded transform alias."],
    [detailBlock, ["background: var(--comp-table-current-detail-bg)", "padding-block: var(--comp-table-current-detail-padding-block)", "padding-inline-start: var(--comp-table-current-detail-padding-inline-start)"], "Table detail row must consume component-scoped detail aliases."],
  ];
  for (const [block, snippets, message] of contracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkTableCssContract };
