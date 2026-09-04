const allowedDynamicStyleKeysByComponent = {
  Avatar: ["--comp-avatar-identity-bg", "--comp-avatar-identity-fg"],
  ChartPanel: ["--comp-chart-panel-current-series", "--comp-chart-panel-stagger-delay"],
  Popover: [
    "--comp-popover-runtime-left",
    "--comp-popover-runtime-top",
    "--comp-popover-runtime-origin",
    "--comp-popover-runtime-visibility",
    "--comp-popover-runtime-width",
    "--comp-popover-runtime-min-width",
    "--comp-popover-runtime-max-height",
    "--comp-popover-runtime-max-width",
  ],
  Skeleton: [
    "--comp-skeleton-current-width",
    "--comp-skeleton-current-height",
    "--comp-skeleton-current-columns",
    "--comp-skeleton-bone-current-inline-size",
    "--comp-skeleton-bone-current-block-size",
    "--comp-skeleton-bone-current-radius",
  ],
  Slider: ["--comp-slider-percent"],
  Table: ["--comp-table-column-width", "--comp-table-tree-depth"],
  Tabs: ["--comp-tabs-indicator-left", "--comp-tabs-indicator-width"],
  TreeView: ["--comp-tree-view-level"],
};

module.exports = { allowedDynamicStyleKeysByComponent };
