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

function checkCardSummaryCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/CardSummary.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".card-summary");
  const densitySmBlock = blockFor(blocks, selectorKey, ".card-summary[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".card-summary[data-density=\"lg\"]");
  const virtualBlock = blockFor(blocks, selectorKey, ".card-summary[data-variant=\"virtual\"]");
  const compactBlock = blockFor(blocks, selectorKey, ".card-summary[data-variant=\"compact\"]");
  const activeBlock = blockFor(blocks, selectorKey, ".card-summary[data-state=\"active\"]");
  const headerBlock = blockFor(blocks, selectorKey, ".card-summary header");
  const badgeBlock = blockFor(blocks, selectorKey, ".card-summary .badge");
  const brandBlock = blockFor(blocks, selectorKey, ".card-summary__brand");
  const techBlock = blockFor(blocks, selectorKey, ".card-summary__tech");
  const chipBlock = blockFor(blocks, selectorKey, ".card-summary__chip");
  const iconBlock = blockFor(blocks, selectorKey, ".card-summary__icon");
  const numberBlock = blockFor(blocks, selectorKey, ".card-summary__number");
  const compactIconBlock = blockFor(blocks, selectorKey, ".card-summary[data-variant=\"compact\"] .card-summary__icon");
  const metricBlock = blockFor(blocks, selectorKey, ".card-summary .card-summary__metrics");
  const holderBlock = blockFor(blocks, selectorKey, ".card-summary .card-summary__holder");

  if (!source.includes("React.createElement(Badge")) {
    add("errors", sourceFile, 1, "CardSummary must compose Badge for card status instead of duplicating status chrome.");
  }
  if (/--card-summary-/.test(rootBlock?.body ?? "") || /var\(--card-summary-/.test(text)) {
    add("errors", packageCssFile, rootBlock ? lineNumber(text, rootBlock.index) : 1, "CardSummary must not create parallel --card-summary-* aliases; use --comp-card-summary-* aliases.");
  }
  const localMetricSize = /--comp-card-summary-metric-min-(?:sm|md|lg):\s*calc\(var\(--component-control-min-size\)\s*\*\s*[\d.]+\)/.exec(text);
  if (localMetricSize) {
    add("errors", packageCssFile, lineNumber(text, localMetricSize.index), "CardSummary metric minimums must flow through shared Frame metric roles instead of local control-size multipliers.");
  }
  for (const snippet of [
    "--comp-card-summary-metric-min-sm: var(--component-metric-min-inline-size-xs)",
    "--comp-card-summary-metric-min-md: var(--component-metric-min-inline-size-md)",
    "--comp-card-summary-metric-min-lg: var(--component-metric-min-inline-size-lg)",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, "CardSummary metric minimum aliases must be defined from shared Frame metric roles.");
      break;
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-card-summary-current-bg: var(--comp-card-summary-bg)",
      "--comp-card-summary-current-fg: var(--comp-card-summary-fg)",
      "--comp-card-summary-current-muted: var(--comp-card-summary-muted)",
      "--comp-card-summary-current-gap: var(--comp-card-summary-gap-md)",
      "--comp-card-summary-current-padding: var(--comp-card-summary-padding-md)",
      "--comp-card-summary-current-icon-size: var(--comp-card-summary-icon-size-md)",
      "--comp-card-summary-current-number-size: var(--comp-card-summary-number-size-md)",
      "--comp-card-summary-current-metric-min: var(--comp-card-summary-metric-min-md)",
      "aspect-ratio: var(--comp-card-summary-aspect-ratio)",
      "background:",
      "var(--comp-card-summary-current-bg)",
      "color: var(--comp-card-summary-current-fg)",
      "gap: var(--comp-card-summary-current-gap)",
      "padding: var(--comp-card-summary-current-padding)",
    ],
    message: "CardSummary root must consume current aliases for density, tone, surface, and frame.",
  });
  for (const [block, message] of [
    [densitySmBlock, "CardSummary small density must set current aliases."],
    [densityLgBlock, "CardSummary large density must set current aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-card-summary-current-chip-block:",
        "--comp-card-summary-current-chip-inline:",
        "--comp-card-summary-current-gap:",
        "--comp-card-summary-current-icon-size:",
        "--comp-card-summary-current-metric-min:",
        "--comp-card-summary-current-number-size:",
        "--comp-card-summary-current-padding:",
      ],
      message,
    });
  }
  requireIncludes({
    block: virtualBlock,
    text,
    packageCssFile,
    snippets: ["--comp-card-summary-current-bg: var(--comp-card-summary-bg-virtual)", "--comp-card-summary-current-tone: var(--comp-card-summary-tone-virtual)"],
    message: "CardSummary virtual variant must set current surface/tone aliases.",
  });
  requireIncludes({
    block: compactBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-card-summary-aspect-ratio: auto",
      "--comp-card-summary-current-bg: var(--comp-card-summary-bg-compact)",
      "--comp-card-summary-current-fg: var(--comp-card-summary-fg-compact)",
      "--comp-card-summary-current-muted: var(--comp-card-summary-muted-compact)",
      "--comp-card-summary-current-padding:",
    ],
    message: "CardSummary compact variant must set current aliases rather than private aliases.",
  });
  requireIncludes({
    block: activeBlock,
    text,
    packageCssFile,
    snippets: ["border-color: color-mix(in srgb, var(--comp-card-summary-current-tone)"],
    message: "CardSummary active state must consume current tone alias.",
  });
  requireIncludes({
    block: headerBlock,
    text,
    packageCssFile,
    snippets: [
      "align-items: var(--comp-card-summary-header-align)",
      "gap: var(--comp-card-summary-header-gap)",
      "grid-template-columns: var(--comp-card-summary-header-grid)",
    ],
    message: "CardSummary header must consume header aliases.",
  });
  requireIncludes({
    block: badgeBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-card-summary-badge-bg)", "border-color: var(--comp-card-summary-badge-border)", "color: var(--comp-card-summary-current-fg)"],
    message: "CardSummary badge bridge must consume card aliases.",
  });
  requireIncludes({
    block: brandBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-card-summary-current-fg)",
      "font-family: var(--comp-card-summary-brand-family)",
      "font-size: var(--comp-card-summary-brand-size)",
      "font-weight: var(--comp-card-summary-brand-weight)",
      "letter-spacing: var(--comp-card-summary-brand-letter-spacing)",
      "text-transform: var(--comp-card-summary-brand-transform)",
    ],
    message: "CardSummary brand must consume card voice aliases.",
  });
  requireIncludes({
    block: techBlock,
    text,
    packageCssFile,
    snippets: ["display: var(--comp-card-summary-tech-display)", "gap: var(--comp-card-summary-tech-gap)", "margin-block-start: var(--comp-card-summary-tech-margin-block-start)"],
    message: "CardSummary tech row must consume layout aliases.",
  });
  requireIncludes({
    block: chipBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-card-summary-chip-bg)",
      "block-size: var(--comp-card-summary-current-chip-block)",
      "display: var(--comp-card-summary-chip-display)",
      "inline-size: var(--comp-card-summary-current-chip-inline)",
    ],
    message: "CardSummary chip must consume current chip aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-card-summary-current-muted)", "font-size: var(--comp-card-summary-current-icon-size)"],
    message: "CardSummary icon must consume current icon aliases.",
  });
  requireIncludes({
    block: numberBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-card-summary-current-fg)", "font-size: var(--comp-card-summary-current-number-size)"],
    message: "CardSummary number must consume current voice aliases.",
  });
  requireIncludes({
    block: compactIconBlock,
    text,
    packageCssFile,
    snippets: ["background: color-mix(in srgb, var(--comp-card-summary-current-tone)", "color: var(--comp-card-summary-current-tone)"],
    message: "CardSummary compact icon must consume current tone alias.",
  });
  requireIncludes({
    block: metricBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-card-summary-metrics-bg)",
      "border: var(--component-border-width) solid var(--comp-card-summary-metrics-border)",
      "grid-template-columns: repeat(auto-fit, minmax(var(--comp-card-summary-current-metric-min), 1fr))",
    ],
    message: "CardSummary metrics must consume metric aliases.",
  });
  requireIncludes({
    block: holderBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-card-summary-current-muted)"],
    message: "CardSummary holder must consume current muted alias.",
  });
}

module.exports = { checkCardSummaryCssContract };
