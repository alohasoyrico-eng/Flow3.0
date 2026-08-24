const { add, lineNumber, path, root, read } = require("./audit-context.js");

function bodyFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCardCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const cardContractFile = path.join(root, "packages/components/src/contracts.ts");
  const cardPlatformFile = path.join(root, "packages/components/src/platforms/card.ts");
  const contractText = read(cardContractFile);
  const platformText = read(cardPlatformFile);
  const cardBlock = bodyFor(blocks, selectorKey, ".card");
  const compactBlock = bodyFor(blocks, selectorKey, ".card[data-composition=\"compact\"]");
  const mediaBlock = bodyFor(blocks, selectorKey, ".card[data-composition=\"media\"]");
  const statsBlock = bodyFor(blocks, selectorKey, ".card[data-composition=\"stats\"]");
  const headerBlock = bodyFor(blocks, selectorKey, ".card__header");
  const headingBlock = bodyFor(blocks, selectorKey, ".card__heading");
  const iconBlock = bodyFor(blocks, selectorKey, ".card__icon");
  const statusBlock = bodyFor(blocks, selectorKey, ".card__status");
  const detailBlock = bodyFor(blocks, selectorKey, ".card__detail");
  const loadingBlock = bodyFor(blocks, selectorKey, ".card__loading");
  const actionsBlock = bodyFor(blocks, selectorKey, ".card__actions");
  const headerActionsBlock = bodyFor(blocks, selectorKey, ".card__actions[data-placement=\"header\"]");
  const minimalIconBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__icon");
  const minimalDetailBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__detail");
  const elevatedDetailBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"elevated\"] .card__detail");
  const ghostBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"ghost\"]");
  const ghostTextBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"ghost\"] .card__title,.card[data-variant=\"ghost\"] .card__detail");
  const minimalHeaderBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__header,.card[data-variant=\"minimal\"] .card__heading");
  const selectedBlock = bodyFor(blocks, selectorKey, ".card[data-state=\"selected\"]");

  if (text.includes("--card-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--card-")), "Card must not introduce short --card-* aliases; use the component namespace and --comp-card-current-* resolved aliases.");
  }
  if (!contractText.includes("Render a discrete object-card")) {
    add("errors", cardContractFile, 1, "Card contract purpose must define Card as an object-card, not a generic grouping surface.");
  }
  if (!contractText.includes("Do not use Card as a generic layout panel")) {
    add("errors", cardContractFile, 1, "Card contract must reject use as a generic layout panel; structural surfaces belong to Surface.");
  }
  if (!contractText.includes("Surface owns canvas, section, panel, overlay, inline groups, settings sections, grouped forms, and page shells; Card must only render object-card anatomy.")) {
    add("errors", cardContractFile, 1, "Card contract must define the explicit Surface ownership boundary for settings, grouped forms, page shells, and other structural surfaces.");
  }
  if (!contractText.includes("Do not use Card for KPI/stat, chart panel, payment-card, or route/admin summary semantics; those belong to Card-family patterns.")) {
    add("errors", cardContractFile, 1, "Card contract must reject KPI/stat, chart panel, payment-card, and route/admin summary semantics; use Card-family patterns.");
  }
  if (!contractText.includes("Use KpiCard for KPI/stat semantics; KpiTile may implement the metric visual and Card composition stats is compatibility only.")) {
    add("errors", cardContractFile, 1, "Card contract must route KPI/stat semantics through KpiCard, with KpiTile only as implementation surface.");
  }
  if (!contractText.includes("Use Chart Wrapper for chart-card semantics; ChartPanel may implement the chart visual when its API fits the pattern.")) {
    add("errors", cardContractFile, 1, "Card contract must route chart-card semantics through Chart Wrapper, with ChartPanel only as implementation surface.");
  }
  if (!contractText.includes("Use a payment/fleet card pattern for payment-card semantics; CardSummary may implement the payment summary visual when it remains useful.")) {
    add("errors", cardContractFile, 1, "Card contract must route payment-card semantics through a payment/fleet pattern, with CardSummary only as implementation surface.");
  }
  if (!contractText.includes("{ name: \"actionPlacement\", type: \"\\\"footer\\\" | \\\"header\\\"\", required: false }")) {
    add("errors", cardContractFile, 1, "Card contract must expose actionPlacement so header actions remain governed Card anatomy.");
  }
  if (!platformText.includes("\"surface\"")) {
    add("errors", cardPlatformFile, 1, "Card platform contract must declare the Surface primitive dependency.");
  }
  if (!platformText.includes("\"surface.*\"")) {
    add("errors", cardPlatformFile, 1, "Card platform contract must declare surface token dependencies.");
  }
  const localMediaSize = /--comp-card-current-media-block-size:\s*calc\([^;]*--component-control-min-size[^;]*\)/.exec(text);
  if (localMediaSize) {
    add("errors", packageCssFile, lineNumber(text, localMediaSize.index), "Card media block size must flow through shared frame/content roles instead of local control-size math.");
  }
  if (minimalHeaderBlock?.body.includes("display: contents")) {
    add("errors", packageCssFile, lineNumber(text, minimalHeaderBlock.index), "Card minimal must preserve component anatomy; do not use display: contents for card header/heading.");
  }
  if (selectedBlock?.body.includes("border-width")) {
    add("errors", packageCssFile, lineNumber(text, selectedBlock.index), "Card selected state must not change border width because it causes layout shift.");
  }

  requireIncludes({
    block: cardBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-card-current-padding: var(--comp-card-padding-md)",
      "--comp-card-current-gap: var(--comp-card-gap-md)",
      "--comp-card-current-icon-size: var(--comp-card-icon-size-md)",
      "--comp-card-current-title-size: var(--comp-card-title-size-md)",
      "--comp-card-current-header-gap: var(--comp-card-header-gap)",
      "--comp-card-current-heading-gap: var(--comp-card-heading-gap)",
      "--comp-card-current-status-radius: var(--comp-card-status-radius)",
      "--comp-card-current-detail-fg: var(--comp-card-detail-fg)",
      "--comp-card-current-loading-min-block-size: calc(var(--comp-card-current-icon-size) + var(--comp-card-current-loading-gap))",
      "--comp-card-current-actions-gap: var(--comp-card-actions-gap)",
      "background: var(--comp-card-bg)",
      "border-radius: var(--comp-card-radius)",
      "gap: var(--comp-card-current-gap)",
      "padding: var(--comp-card-current-padding)",
    ],
    message: "Card base must expose and consume component-scoped current aliases for density, sublayout, status, detail, loading, and actions.",
  });
  requireIncludes({
    block: compactBlock,
    text,
    packageCssFile,
    snippets: ["--comp-card-current-padding: var(--comp-card-compact-padding)", "--comp-card-current-gap: var(--comp-card-compact-gap)"],
    message: "Card compact composition must resolve through comp Card frame aliases.",
  });
  requireIncludes({
    block: mediaBlock,
    text,
    packageCssFile,
    snippets: ["--comp-card-current-gap: var(--comp-card-media-gap)", "--comp-card-current-media-block-size: var(--component-card-media-block-size)"],
    message: "Card media composition must resolve through comp Card media aliases.",
  });
  if (statsBlock) {
    requireIncludes({
      block: statsBlock,
      text,
      packageCssFile,
      snippets: ["--comp-card-current-padding: var(--comp-card-stats-padding)", "--comp-card-current-value-size: var(--comp-card-stats-value-size)"],
      message: "Card stats legacy compatibility must resolve through comp Card stats aliases when present.",
    });
  }

  const elementContracts = [
    [headerBlock, ["gap: var(--comp-card-current-header-gap)"], "Card header gap must consume the component-scoped current alias."],
    [headingBlock, ["gap: var(--comp-card-current-heading-gap)"], "Card heading gap must consume the component-scoped current alias."],
    [iconBlock, ["border-radius: var(--comp-card-icon-radius)", "font-size: var(--comp-card-current-icon-font-size)", "inline-size: var(--comp-card-current-icon-size)"], "Card icon frame must consume component Card aliases."],
    [statusBlock, ["border-radius: var(--comp-card-current-status-radius)", "font-size: var(--comp-card-current-status-size)", "padding: var(--comp-card-current-status-padding-block) var(--comp-card-current-status-padding-inline)"], "Card status frame and voice must consume component-scoped current aliases."],
    [detailBlock, ["color: var(--comp-card-current-detail-fg)"], "Card detail color must consume the component-scoped current alias."],
    [loadingBlock, ["gap: var(--comp-card-current-loading-gap)", "min-block-size: var(--comp-card-current-loading-min-block-size)"], "Card loading rhythm must consume component-scoped current aliases."],
    [actionsBlock, ["gap: var(--comp-card-current-actions-gap)", "justify-content: var(--comp-card-current-actions-justify)"], "Card actions layout must consume component-scoped current aliases."],
    [headerActionsBlock, ["justify-content: flex-end"], "Card header actions must have a governed placement rule."],
    [minimalIconBlock, ["font-size: var(--comp-card-minimal-icon-size)", "inline-size: var(--comp-card-minimal-icon-size)"], "Card minimal icon sizing must consume component Card aliases."],
    [minimalHeaderBlock, ["display: flex"], "Card minimal header/heading must preserve real flex anatomy."],
    [minimalDetailBlock, ["font-size: var(--comp-card-minimal-detail-size)"], "Card minimal detail voice must consume a component Card alias."],
    [elevatedDetailBlock, ["font-size: var(--comp-card-elevated-detail-size)"], "Card elevated detail voice must consume a component Card alias."],
    [ghostBlock, ["color: var(--comp-card-ghost-fg)"], "Card ghost foreground must consume a component Card alias."],
    [ghostTextBlock, ["font-size: var(--comp-card-ghost-text-size)"], "Card ghost text voice must consume a component Card alias."],
  ];
  for (const [block, snippets, message] of elementContracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
  for (const [snippet, message] of [
    ["--comp-card-surface-bg: var(--component-color-surface)", "Card surface background must map through a Surface/Foundation alias."],
    ["--comp-card-surface-radius: var(--component-radius-surface)", "Card surface radius must map through a Surface/Foundation alias."],
    ["--comp-card-bg: var(--comp-card-surface-bg)", "Card background must consume the mapped surface alias."],
    ["--comp-card-radius: var(--comp-card-surface-radius)", "Card radius must consume the mapped surface alias."],
  ]) {
    if (!text.includes(snippet)) add("errors", packageCssFile, 1, message);
  }
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["box-shadow: var(--comp-card-shadow-selected)"],
    message: "Card selected state must use the selected shadow/indicator alias for non-color-only selection affordance.",
  });
  if (!text.includes("--comp-card-selected-indicator: inset var(--comp-card-selected-indicator-width)")) {
    add("errors", packageCssFile, 1, "Card selected affordance must include an inset structural indicator and not rely on color alone.");
  }
}

module.exports = { checkCardCssContract };
