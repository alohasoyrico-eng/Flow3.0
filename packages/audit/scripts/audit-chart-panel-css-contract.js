const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function normalizedBlockSelector(block, selectorKey) {
  return String(block?.selector ?? selectorKey(block) ?? "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, "");
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function requireSelectorIncludes({ block, text, packageCssFile, selectorKey, snippets, message }) {
  const selector = normalizedBlockSelector(block, selectorKey);
  if (block && snippets.every((snippet) => selector.includes(snippet.replace(/\s+/g, "")))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkChartPanelCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/ChartPanel.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".chart-panel");
  const densitySmBlock = blockFor(blocks, selectorKey, ".chart-panel[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".chart-panel[data-density=\"lg\"]");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".chart-panel[data-full-width=\"true\"]");
  const figureBlock = blockFor(blocks, selectorKey, ".chart-panel figure");
  const complexChartTypeBlock = blocks.find((block) => {
    const selector = normalizedBlockSelector(block, selectorKey);
    return selector.includes(".chart-panel:is(")
      && selector.includes("[data-chart-type=\"heatmap\"]")
      && selector.includes("[data-chart-type=\"boxplot\"]");
  });
  const lineVariantBlock = blockFor(blocks, selectorKey, ".chart-panel[data-variant=\"line\"]");
  const compactVariantBlock = blockFor(blocks, selectorKey, ".chart-panel[data-variant=\"compact\"]");
  const stateBlock = blockFor(blocks, selectorKey, ".chart-panel[data-state=\"error\"],.chart-panel[data-state=\"warning\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".chart-panel[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".chart-panel[data-state=\"disabled\"]");
  const headerBlock = blockFor(blocks, selectorKey, ".chart-panel header");
  const headerCopyBlock = blockFor(blocks, selectorKey, ".chart-panel header > div");
  const headerTitleBlock = blockFor(blocks, selectorKey, ".chart-panel header strong");
  const headerCaptionBlock = blockFor(blocks, selectorKey, ".chart-panel header p");
  const outputBlock = blockFor(blocks, selectorKey, ".chart-panel output");
  const plotBlock = blockFor(blocks, selectorKey, ".chart-panel__plot");
  const echartsBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts");
  const runtimeFallbackBlock = blockFor(blocks, selectorKey, ".chart-panel[data-chart-engine=\"echarts-runtime\"] .chart-panel__plot");
  const lineBlock = blockFor(blocks, selectorKey, ".chart-panel__line");
  const dotBlock = blockFor(blocks, selectorKey, ".chart-panel__dot");
  const barSvgBlock = blockFor(blocks, selectorKey, ".chart-panel__bar-svg");
  const comparisonBarBlock = blockFor(blocks, selectorKey, ".chart-panel__comparison-bar");
  const donutBlock = blockFor(blocks, selectorKey, ".chart-panel__donut");
  const tooltipBlock = blockFor(blocks, selectorKey, ".chart-panel__tooltip");
  const echartsTooltipBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts-tooltip");
  const echartsTooltipTitleBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts-tooltip-title");
  const echartsTooltipIconBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts-tooltip-icon");
  const echartsTooltipLabelBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts-tooltip-label");
  const echartsTooltipValueBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts-tooltip-value");
  const echartsTooltipSwatchBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts-tooltip-swatch");

  if (!source.includes("createChartsPrimitive") || !source.includes("data-chart-engine") || !source.includes("echartsOption") || !source.includes("import(\"echarts\")")) {
    add("errors", sourceFile, 1, "ChartPanel must use the charts primitive, mount ECharts at runtime, and expose its option contract.");
  }
  if (!source.includes("\"echarts-runtime\"") || !source.includes("\"fallback\"") || !source.includes("\"data-chart-renderer\": \"echarts\"") || !source.includes("\"data-fallback-plot\": \"true\"")) {
    add("errors", sourceFile, 1, "ChartPanel must expose the ECharts runtime/fallback state contract instead of silently rendering a manual chart.");
  }
  if (/echarts\.init\([^)]*width:|echarts\.init\([^)]*height:/.test(source)) {
    add("errors", sourceFile, lineNumber(source, source.search(/echarts\.init\([^)]*(?:width:|height:)/)), "ChartPanel must let ECharts measure the CSS-sized host instead of locking width/height at init.");
  }
  if (!source.includes("scheduleStableResize") || !source.includes("requestAnimationFrame") || !source.includes("ResizeObserver(scheduleStableResize)") || !source.includes("window.addEventListener(\"resize\", scheduleStableResize)")) {
    add("errors", sourceFile, 1, "ChartPanel ECharts renderer must schedule stable resize after CSS layout, ResizeObserver, and window resize.");
  }
  if (!source.includes("installChartTooltipFormatter") || !source.includes("tooltipMarkerClass") || !source.includes("param.data?.tooltipMarkerClass") || !source.includes("tooltipIconName") || !source.includes("param.data?.tooltipIcon") || !source.includes("tooltipTitleName") || !source.includes("tooltipRowLabel") || !source.includes("itemCount > 1") || !source.includes("chart-panel__echarts-tooltip-icon")) {
    add("errors", sourceFile, 1, "ChartPanel ECharts renderer must format tooltips from each data item's Flow marker/icon metadata and separate axis title from series labels, not a fixed color-only tooltip.");
  }
  if (source.includes("style=")) {
    add("errors", sourceFile, lineNumber(source, source.indexOf("style=")), "ChartPanel ECharts tooltip formatter must not bypass Flow CSS with inline visual styles.");
  }
  if (/\.chart-panel,\s*\.card-summary\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".chart-panel,\n.card-summary")), "ChartPanel must not share chart/frame aliases with CardSummary.");
  }
  if (/\.chart-panel header,\s*\.card-summary header\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".chart-panel header")), "ChartPanel header must not share a generic header block with CardSummary.");
  }
  if (/\.chart-panel header strong,\s*\.card-summary header strong\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".chart-panel header strong")), "ChartPanel title voice must not share a generic title block with CardSummary.");
  }
  if (text.includes("--chart-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--chart-")), "ChartPanel must not use short --chart-* runtime aliases; use --comp-chart-panel-* aliases while consuming --sys-chart-* foundation tokens.");
  }
  if (/\.chart-panel__(?:line|dot|comparison-bar)\[data-series=/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.search(/\.chart-panel__(?:line|dot|comparison-bar)\[data-series=/)), "ChartPanel series color must flow through --comp-chart-panel-current-series instead of enumerated data-series CSS selectors.");
  }
  if (/\.chart-panel__(?:bar-group|comparison-bar|pareto-bar)[^{]*(?:nth-child|nth-of-type)/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.search(/\.chart-panel__(?:bar-group|comparison-bar|pareto-bar)[^{]*(?:nth-child|nth-of-type)/)), "ChartPanel stagger must flow through --comp-chart-panel-stagger-delay instead of nth-child CSS selectors.");
  }
  if (/chart-panel__(?:bullet|pareto)|data-variant="(?:bullet|pareto)"|--comp-chart-panel-(?:bullet|pareto)/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.search(/chart-panel__(?:bullet|pareto)|data-variant="(?:bullet|pareto)"|--comp-chart-panel-(?:bullet|pareto)/)), "ChartPanel must not keep Bullet/Pareto implementation residue; those are named analytical chart patterns.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chart-panel-bg: var(--component-color-surface)",
      "--comp-chart-panel-border-width: var(--component-border-width)",
      "--comp-chart-panel-depth: var(--component-depth-none)",
      "--comp-chart-panel-display: var(--component-display-grid)",
      "--comp-chart-panel-gap: var(--component-space-sm)",
      "--comp-chart-panel-header-display: var(--component-display-grid)",
      "--comp-chart-panel-copy-gap: var(--component-frame-space-micro)",
      "--comp-chart-panel-header-title-size: var(--component-density-label-size-md)",
      "--comp-chart-panel-caption-size: var(--component-density-helper-size-md)",
      "--comp-chart-panel-padding: var(--component-space-lg)",
      "--comp-chart-panel-radius:",
      "--comp-chart-panel-output-size: var(--component-font-size-data-lg)",
      "--comp-chart-panel-output-weight: var(--component-font-weight-light)",
      "--comp-chart-panel-hover-depth: var(--component-depth-none)",
      "--comp-chart-panel-hover-transform: var(--component-transform-none)",
      "--comp-chart-panel-tooltip-x: 50%",
      "--comp-chart-panel-tooltip-y: var(--component-offset-zero)",
      "--comp-chart-panel-tooltip-icon-size: var(--component-density-label-size-md)",
      "--comp-chart-panel-tooltip-label-size: var(--component-density-label-size-md)",
      "--comp-chart-panel-tooltip-title-size: var(--component-density-label-size-md)",
      "--comp-chart-panel-tooltip-value-size: var(--component-font-size-body-sm)",
      "--comp-chart-panel-width:",
      "--comp-chart-panel-min-block-size:",
      "--comp-chart-panel-plot-size:",
      "--comp-chart-panel-donut-bg:",
      "--comp-chart-panel-series-1: var(--component-chart-series-primary)",
      "--comp-chart-panel-series-2: var(--component-chart-series-secondary)",
      "--comp-chart-panel-series-3: var(--component-chart-series-tertiary)",
      "--comp-chart-panel-series-4: var(--component-chart-series-quaternary)",
      "--comp-chart-panel-series-5: var(--component-chart-series-mixed)",
      "--comp-chart-panel-series-6: var(--component-chart-threshold-warning)",
      "--comp-chart-panel-current-series: var(--comp-chart-panel-tone)",
      "--comp-chart-panel-comparison-reference-fill:",
      "--comp-chart-panel-stagger-delay: var(--component-duration-instant)",
      "background: var(--comp-chart-panel-bg)",
      "border: var(--comp-chart-panel-border-width) solid var(--comp-chart-panel-border)",
      "border-radius: var(--comp-chart-panel-radius)",
      "box-sizing: border-box",
      "box-shadow: var(--comp-chart-panel-depth)",
      "color: var(--comp-chart-panel-fg)",
      "display: var(--comp-chart-panel-display)",
      "gap: var(--comp-chart-panel-gap)",
      "inline-size: var(--comp-chart-panel-width)",
      "min-block-size: var(--comp-chart-panel-min-block-size)",
      "padding: var(--comp-chart-panel-padding)",
    ],
    message: "ChartPanel root must own chart, frame, density, header, state, and width aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "ChartPanel small density must set chart aliases."],
    [densityLgBlock, "ChartPanel large density must set chart aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: ["--comp-chart-panel-caption-size:", "--comp-chart-panel-header-title-size:", "--comp-chart-panel-output-size:", "--comp-chart-panel-plot-density-offset:", "--comp-chart-panel-gap:", "--comp-chart-panel-padding:"],
      message,
    });
  }
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: [
      "inline-size: var(--comp-chart-panel-full-width)",
      "--comp-chart-panel-plot-size-base:",
    ],
    message: "ChartPanel full width state must only consume its width alias and raised plot size; it must not change the vertical component anatomy.",
  });
  requireIncludes({
    block: figureBlock,
    text,
    packageCssFile,
    snippets: ["display: grid", "gap: var(--comp-chart-panel-figure-gap)", "margin: 0", "min-inline-size: var(--component-inline-size-zero)"],
    message: "ChartPanel figure must be shrink-safe and keep the chart below the typographic header.",
  });
  if (/--comp-chart-panel-full-width-(?:grid|gap)|\.chart-panel\[data-full-width="true"\][^{]*{[^}]*grid-template-columns|\.chart-panel\[data-full-width="true"\][^{]*{[^}]*column-gap/s.test(text)) {
    add("errors", packageCssFile, 1, "ChartPanel fullWidth must not introduce a two-column anatomy; typography stays above the chart.");
  }
  requireIncludes({
    block: complexChartTypeBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chart-panel-plot-size-base:",
    ],
    message: "ChartPanel complex ECharts types must raise plot size through data-chart-type component CSS, not demo-only overrides.",
  });
  requireSelectorIncludes({
    block: complexChartTypeBlock,
    text,
    packageCssFile,
    selectorKey,
    snippets: [
      "[data-chart-type=\"heatmap\"]",
      "[data-chart-type=\"radar\"]",
      "[data-chart-type=\"waterfall\"]",
      "[data-chart-type=\"pareto\"]",
      "[data-chart-type=\"gauge\"]",
      "[data-chart-type=\"funnel\"]",
      "[data-chart-type=\"treemap\"]",
      "[data-chart-type=\"boxplot\"]",
    ],
    message: "ChartPanel complex ECharts plot-size rule must cover every heavyweight chartType selector.",
  });
  if (complexChartTypeBlock && lineVariantBlock && complexChartTypeBlock.index < lineVariantBlock.index) {
    add("errors", packageCssFile, lineNumber(text, complexChartTypeBlock.index), "ChartPanel complex chartType plot-size rule must appear after the line variant rule so chartType can override variant anatomy.");
  }
  if (complexChartTypeBlock && compactVariantBlock && complexChartTypeBlock.index < compactVariantBlock.index) {
    add("errors", packageCssFile, lineNumber(text, complexChartTypeBlock.index), "ChartPanel complex chartType plot-size rule must appear after the compact variant rule so gauge and other dense charts are not compressed.");
  }
  requireIncludes({
    block: stateBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-chart-panel-state-border)"],
    message: "ChartPanel warning/error states must consume state border alias.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-chart-panel-focus-width) solid var(--comp-chart-panel-focus-color)",
      "outline-offset: var(--comp-chart-panel-focus-offset)",
    ],
    message: "ChartPanel focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "border-color: var(--comp-chart-panel-disabled-border)",
      "color: var(--comp-chart-panel-disabled-fg)",
      "opacity: var(--comp-chart-panel-disabled-opacity)",
    ],
    message: "ChartPanel disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: headerBlock,
    text,
    packageCssFile,
    snippets: ["display: var(--comp-chart-panel-header-display)", "gap: var(--comp-chart-panel-header-gap)", "min-inline-size: var(--component-inline-size-zero)"],
    message: "ChartPanel header must consume header aliases.",
  });
  requireIncludes({
    block: headerCopyBlock,
    text,
    packageCssFile,
    snippets: ["display: var(--comp-chart-panel-header-display)", "gap: var(--comp-chart-panel-copy-gap)", "min-inline-size: var(--component-inline-size-zero)"],
    message: "ChartPanel header copy stack must consume component aliases so typography spacing is density-safe.",
  });
  requireIncludes({
    block: headerTitleBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-chart-panel-header-title-color)",
      "font-family: var(--comp-chart-panel-header-title-family)",
      "font-size: var(--comp-chart-panel-header-title-size)",
    ],
    message: "ChartPanel title must consume chart voice aliases.",
  });
  requireIncludes({
    block: headerCaptionBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-chart-panel-caption-size)", "font-weight: var(--comp-chart-panel-caption-weight)", "line-height: var(--component-line-height-snug)", "margin: 0"],
    message: "ChartPanel caption must consume density-scaled caption aliases.",
  });
  requireIncludes({
    block: outputBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-chart-panel-output-size)", "font-weight: var(--comp-chart-panel-output-weight)", "margin: 0"],
    message: "ChartPanel output/KPI must consume density-scaled data aliases.",
  });
  requireIncludes({
    block: plotBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-chart-panel-plot-size)", "inline-size: 100%"],
    message: "ChartPanel plot must consume chart plot aliases.",
  });
  requireIncludes({
    block: echartsBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-chart-panel-plot-size)", "height: var(--comp-chart-panel-plot-size)", "inline-size: 100%", "min-block-size: var(--comp-chart-panel-plot-size)"],
    message: "ChartPanel ECharts host must consume chart plot aliases.",
  });
  requireIncludes({
    block: runtimeFallbackBlock,
    text,
    packageCssFile,
    snippets: ["display: none"],
    message: "ChartPanel must hide the fallback plot when the ECharts runtime mounts.",
  });
  for (const [block, snippets, message] of [
    [lineBlock, ["stroke: var(--comp-chart-panel-current-series)"], "ChartPanel lines must consume the dynamic series color contract."],
    [dotBlock, ["fill: var(--comp-chart-panel-current-series)"], "ChartPanel dots must consume the dynamic series color contract."],
    [barSvgBlock, ["animation-delay: var(--comp-chart-panel-stagger-delay)"], "ChartPanel bars must consume the dynamic stagger contract."],
    [comparisonBarBlock, ["fill: var(--comp-chart-panel-current-series)", "animation-delay: var(--comp-chart-panel-stagger-delay)"], "ChartPanel comparison bars must consume the dynamic series color and stagger contracts."],
    [donutBlock, ["background: var(--comp-chart-panel-donut-bg)"], "ChartPanel donut must consume component-scoped donut background alias."],
    [tooltipBlock, ["inset-block-start: var(--comp-chart-panel-tooltip-y)", "inset-inline-start: var(--comp-chart-panel-tooltip-x)"], "ChartPanel tooltip coordinates must use component-scoped runtime aliases without inline fallbacks."],
    [echartsTooltipBlock, ["background: var(--comp-chart-panel-tooltip-bg)", "color: var(--comp-chart-panel-tooltip-fg)", "display: grid", "gap: var(--component-space-xs)", "min-inline-size: var(--component-content-size-sm)", "padding: var(--comp-chart-panel-tooltip-padding)"], "ChartPanel ECharts tooltip layout and contrast must be owned by Flow CSS classes."],
    [echartsTooltipTitleBlock, ["font-size: var(--comp-chart-panel-tooltip-title-size)", "font-weight: var(--comp-chart-panel-tooltip-weight)"], "ChartPanel ECharts tooltip title must use density-aware Flow typography."],
    [echartsTooltipIconBlock, ["font-family: var(--component-font-family-icon)", "font-size: var(--comp-chart-panel-tooltip-icon-size)", "font-variation-settings: var(--component-icon-variation-filled)"], "ChartPanel ECharts tooltip must include iconography so hover is not color-only."],
    [echartsTooltipLabelBlock, ["font-size: var(--comp-chart-panel-tooltip-label-size)", "font-weight: var(--component-font-weight-medium)"], "ChartPanel ECharts tooltip labels must remain legible and density-aware."],
    [echartsTooltipValueBlock, ["font-size: var(--comp-chart-panel-tooltip-value-size)", "margin-inline-start: auto"], "ChartPanel ECharts tooltip values must remain legible and aligned."],
    [echartsTooltipSwatchBlock, ["background: var(--component-chart-series-primary)", "border-radius: var(--component-radius-pill)"], "ChartPanel ECharts tooltip swatch must be owned by Flow CSS classes."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
  if (/var\(--comp-chart-panel-tooltip-[xy],/.test(text)) {
    add("errors", packageCssFile, 1, "ChartPanel tooltip runtime aliases must be declared on the root and consumed without inline fallbacks.");
  }
}

module.exports = { checkChartPanelCssContract };
