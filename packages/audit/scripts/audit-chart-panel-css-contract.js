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

function checkChartPanelCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/ChartPanel.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".chart-panel");
  const densitySmBlock = blockFor(blocks, selectorKey, ".chart-panel[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".chart-panel[data-density=\"lg\"]");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".chart-panel[data-full-width=\"true\"]");
  const stateBlock = blockFor(blocks, selectorKey, ".chart-panel[data-state=\"error\"],.chart-panel[data-state=\"warning\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".chart-panel[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".chart-panel[data-state=\"disabled\"]");
  const headerBlock = blockFor(blocks, selectorKey, ".chart-panel header");
  const headerTitleBlock = blockFor(blocks, selectorKey, ".chart-panel header strong");
  const plotBlock = blockFor(blocks, selectorKey, ".chart-panel__plot");
  const echartsBlock = blockFor(blocks, selectorKey, ".chart-panel__echarts");
  const seriesTwoStrokeBlock = blockFor(blocks, selectorKey, ".chart-panel__line[data-series=\"2\"],.chart-panel__dot[data-series=\"2\"]");
  const seriesThreeStrokeBlock = blockFor(blocks, selectorKey, ".chart-panel__line[data-series=\"3\"],.chart-panel__dot[data-series=\"3\"]");
  const seriesTwoFillBlock = blockFor(blocks, selectorKey, ".chart-panel__dot[data-series=\"2\"]");
  const seriesThreeFillBlock = blockFor(blocks, selectorKey, ".chart-panel__dot[data-series=\"3\"]");
  const donutBlock = blockFor(blocks, selectorKey, ".chart-panel__donut");
  const tooltipBlock = blockFor(blocks, selectorKey, ".chart-panel__tooltip");

  if (!source.includes("createChartsPrimitive") || !source.includes("data-chart-engine") || !source.includes("echartsOption")) {
    add("errors", sourceFile, 1, "ChartPanel must use the charts primitive and expose its ECharts option contract.");
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

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-chart-panel-bg: var(--sys-color-surface)",
      "--comp-chart-panel-border-width: var(--component-border-width)",
      "--comp-chart-panel-depth: var(--component-depth-panel)",
      "--comp-chart-panel-display: grid",
      "--comp-chart-panel-gap: var(--sys-space-sm)",
      "--comp-chart-panel-header-display: grid",
      "--comp-chart-panel-padding: var(--sys-space-lg)",
      "--comp-chart-panel-radius:",
      "--comp-chart-panel-width:",
      "--comp-chart-panel-plot-size:",
      "--comp-chart-panel-donut-bg:",
      "--comp-chart-panel-series-1: var(--sys-chart-series-primary)",
      "--comp-chart-panel-series-2: var(--sys-chart-series-secondary)",
      "--comp-chart-panel-series-5: var(--sys-chart-series-tertiary)",
      "background: var(--comp-chart-panel-bg)",
      "border: var(--comp-chart-panel-border-width) solid var(--comp-chart-panel-border)",
      "border-radius: var(--comp-chart-panel-radius)",
      "box-shadow: var(--comp-chart-panel-depth)",
      "color: var(--comp-chart-panel-fg)",
      "display: var(--comp-chart-panel-display)",
      "gap: var(--comp-chart-panel-gap)",
      "inline-size: var(--comp-chart-panel-width)",
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
      snippets: ["--comp-chart-panel-plot-density-offset:", "--comp-chart-panel-gap:", "--comp-chart-panel-padding:"],
      message,
    });
  }
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-chart-panel-full-width)"],
    message: "ChartPanel full width state must consume its width alias.",
  });
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
    snippets: ["display: var(--comp-chart-panel-header-display)", "gap: var(--comp-chart-panel-header-gap)"],
    message: "ChartPanel header must consume header aliases.",
  });
  requireIncludes({
    block: headerTitleBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-chart-panel-header-title-color)",
      "font-family: var(--comp-chart-panel-header-title-family)",
    ],
    message: "ChartPanel title must consume chart voice aliases.",
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
    snippets: ["block-size: var(--comp-chart-panel-plot-size)", "inline-size: 100%"],
    message: "ChartPanel ECharts host must consume chart plot aliases.",
  });
  for (const [block, snippets, message] of [
    [seriesTwoStrokeBlock, ["stroke: var(--comp-chart-panel-series-2)"], "ChartPanel second series stroke must consume component-scoped series alias."],
    [seriesThreeStrokeBlock, ["stroke: var(--comp-chart-panel-series-5)"], "ChartPanel third series stroke must consume component-scoped series alias."],
    [seriesTwoFillBlock, ["fill: var(--comp-chart-panel-series-2)"], "ChartPanel second series fill must consume component-scoped series alias."],
    [seriesThreeFillBlock, ["fill: var(--comp-chart-panel-series-5)"], "ChartPanel third series fill must consume component-scoped series alias."],
    [donutBlock, ["background: var(--comp-chart-panel-donut-bg)"], "ChartPanel donut must consume component-scoped donut background alias."],
    [tooltipBlock, ["inset-block-start: var(--comp-chart-panel-tooltip-y, 0)", "inset-inline-start: var(--comp-chart-panel-tooltip-x, 50%)"], "ChartPanel tooltip coordinates must use component-scoped runtime aliases."],
  ]) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkChartPanelCssContract };
