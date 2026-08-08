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

function checkRouteSummaryCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/RouteSummary.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".route-summary");
  const densitySmBlock = blockFor(blocks, selectorKey, ".route-summary[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".route-summary[data-density=\"lg\"]");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".route-summary[data-full-width=\"true\"]");
  const hoverBlock = blockFor(blocks, selectorKey, ".route-summary[data-state=\"hover\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".route-summary[data-state=\"focus\"]");
  const selectedBlock = blockFor(blocks, selectorKey, ".route-summary[data-state=\"selected\"]");
  const warningBlock = blockFor(blocks, selectorKey, ".route-summary[data-state=\"warning\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".route-summary[data-state=\"disabled\"]");
  const compactBlock = blockFor(blocks, selectorKey, ".route-summary[data-variant=\"compact\"]");
  const compactHeaderBlock = blockFor(blocks, selectorKey, ".route-summary[data-variant=\"compact\"] header");
  const headerBlock = blockFor(blocks, selectorKey, ".route-summary header");
  const headerTitleBlock = blockFor(blocks, selectorKey, ".route-summary header strong");
  const metricsBlock = blockFor(blocks, selectorKey, ".route-summary__metrics");
  const metricItemBlock = blockFor(blocks, selectorKey, ".route-summary__metrics span");
  const footerBlock = blockFor(blocks, selectorKey, ".route-summary footer");

  if (!source.includes("React.createElement(Button") || !source.includes("React.createElement(IconButton")) {
    add("errors", sourceFile, 1, "RouteSummary must compose Button and IconButton for actions instead of duplicating action controls.");
  }
  if (/\.chart-panel,\s*\.route-summary,\s*\.card-summary\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".route-summary")), "RouteSummary must not share its root frame block with ChartPanel and CardSummary.");
  }
  if (/\.chart-panel header,\s*\.route-summary header,\s*\.card-summary header\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".route-summary header")), "RouteSummary header must not share a generic header block with ChartPanel/CardSummary.");
  }
  if (/\.route-summary__metrics,\s*\.card-summary__metrics\s*{/.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".route-summary__metrics")), "RouteSummary metrics must not share a generic metrics block with CardSummary.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-route-summary-bg: var(--sys-color-surface)",
      "--comp-route-summary-border-width: var(--component-border-width)",
      "--comp-route-summary-depth: var(--component-depth-panel)",
      "--comp-route-summary-display: grid",
      "--comp-route-summary-radius:",
      "--comp-route-summary-header-display: grid",
      "--comp-route-summary-metric-display: grid",
      "background: var(--comp-route-summary-bg)",
      "border: var(--comp-route-summary-border-width) solid var(--comp-route-summary-border)",
      "border-radius: var(--comp-route-summary-radius)",
      "box-shadow: var(--comp-route-summary-depth)",
      "color: var(--comp-route-summary-fg)",
      "display: var(--comp-route-summary-display)",
      "gap: var(--comp-route-summary-gap)",
      "padding: var(--comp-route-summary-padding)",
    ],
    message: "RouteSummary root must own frame, density, header, metric, and state aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "RouteSummary small density must set route aliases."],
    [densityLgBlock, "RouteSummary large density must set route aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-route-summary-gap:",
        "--comp-route-summary-padding:",
        "--comp-route-summary-icon-size:",
        "--comp-route-summary-metric-gap:",
        "--comp-route-summary-metric-padding:",
        "--comp-route-summary-metric-min:",
      ],
      message,
    });
  }
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-route-summary-full-width)"],
    message: "RouteSummary full width state must consume its width alias.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-route-summary-hover-border-state)"],
    message: "RouteSummary hover state must consume route hover alias.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-route-summary-focus-width) solid var(--comp-route-summary-focus-color)",
      "outline-offset: var(--comp-route-summary-focus-offset)",
    ],
    message: "RouteSummary focus state must consume accessibility aliases.",
  });
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-route-summary-selected-border)", "box-shadow: var(--comp-route-summary-selected-shadow)"],
    message: "RouteSummary selected state must consume selected aliases.",
  });
  requireIncludes({
    block: warningBlock,
    text,
    packageCssFile,
    snippets: ["border-color: var(--comp-route-summary-warning-border)"],
    message: "RouteSummary warning state must consume warning alias.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-route-summary-disabled-cursor)", "opacity: var(--comp-route-summary-disabled-opacity)"],
    message: "RouteSummary disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: compactBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-route-summary-compact-display: flex",
      "--comp-route-summary-compact-grid: none",
      "display: var(--comp-route-summary-compact-display)",
      "grid-template-columns: var(--comp-route-summary-compact-grid)",
    ],
    message: "RouteSummary compact variant must consume compact layout aliases.",
  });
  requireIncludes({
    block: compactHeaderBlock,
    text,
    packageCssFile,
    snippets: [
      "display: var(--comp-route-summary-compact-header-display)",
      "flex: var(--comp-route-summary-compact-header-flex)",
      "min-inline-size: var(--comp-route-summary-compact-header-min-inline)",
    ],
    message: "RouteSummary compact header must consume compact header aliases.",
  });
  requireIncludes({
    block: headerBlock,
    text,
    packageCssFile,
    snippets: [
      "display: var(--comp-route-summary-header-display)",
      "grid-template-columns: var(--comp-route-summary-header-grid)",
      "gap: var(--comp-route-summary-header-gap)",
    ],
    message: "RouteSummary header must consume header aliases.",
  });
  requireIncludes({
    block: headerTitleBlock,
    text,
    packageCssFile,
    snippets: ["font-family: var(--comp-route-summary-header-title-family)"],
    message: "RouteSummary header title must consume route voice alias.",
  });
  requireIncludes({
    block: metricsBlock,
    text,
    packageCssFile,
    snippets: [
      "display: var(--comp-route-summary-metric-display)",
      "gap: var(--comp-route-summary-metric-gap)",
      "grid-template-columns: repeat(auto-fit, minmax(var(--comp-route-summary-metric-min), 1fr))",
    ],
    message: "RouteSummary metrics must consume route metric aliases.",
  });
  requireIncludes({
    block: metricItemBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-route-summary-metric-surface)",
      "border: var(--comp-route-summary-border-width) solid var(--comp-route-summary-metric-border)",
      "padding: var(--comp-route-summary-metric-padding)",
    ],
    message: "RouteSummary metric item must consume route metric aliases.",
  });
  requireIncludes({
    block: footerBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-route-summary-metric-gap)"],
    message: "RouteSummary footer must consume route action gap alias.",
  });
}

module.exports = { checkRouteSummaryCssContract };
