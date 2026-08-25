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
  const pressedBlock = bodyFor(blocks, selectorKey, ".card[data-interactive=\"true\"]:active");
  const minimalIconBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__icon");
  const minimalDetailBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__detail");
  const elevatedDetailBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"elevated\"] .card__detail");
  const elevatedBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"elevated\"]");
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
  const localCardFrameAlias = /--comp-card-(?:padding|gap)-(?:sm|md|lg):\s*(?:var\(--component-space-|calc\([^;]*--component-space-)/.exec(text);
  if (localCardFrameAlias) {
    add("errors", packageCssFile, lineNumber(text, localCardFrameAlias.index), "Card density padding/gap must resolve through Surface/Frame aliases, not direct component-space aliases.");
  }
  const localCardCompositionFrame = /--comp-card-(?:compact-padding|compact-gap|media-padding|media-gap|stats-padding|stats-gap|minimal-gap|elevated-gap):\s*(?:var\(--component-space-|calc\([^;]*--component-space-)/.exec(text);
  if (localCardCompositionFrame) {
    add("errors", packageCssFile, lineNumber(text, localCardCompositionFrame.index), "Card composition padding/gap must resolve through Surface/Frame aliases, not direct component-space aliases.");
  }
  if (minimalHeaderBlock?.body.includes("display: contents")) {
    add("errors", packageCssFile, lineNumber(text, minimalHeaderBlock.index), "Card minimal must preserve component anatomy; do not use display: contents for card header/heading.");
  }
  if (selectedBlock?.body.includes("border-width")) {
    add("errors", packageCssFile, lineNumber(text, selectedBlock.index), "Card selected state must not change border width because it causes layout shift.");
  }
  if (text.includes("--comp-card-selected-indicator: inset")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-card-selected-indicator: inset")), "Card selected/pressed affordance must not use a side indicator; use the shared pressed surface tokens.");
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
      "border: var(--component-surface-frame-border-width) solid var(--comp-card-border)",
      "border-radius: var(--comp-card-radius)",
      "box-sizing: border-box",
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
    [headerBlock, ["align-items: center", "gap: var(--comp-card-current-header-gap)"], "Card header row must center-align its icon, title, status, and header actions while consuming the component-scoped current gap alias."],
    [headingBlock, ["align-items: center", "gap: var(--comp-card-current-heading-gap)"], "Card heading row must center-align icon and title content while consuming the component-scoped current gap alias."],
    [iconBlock, ["border-radius: var(--comp-card-icon-radius)", "font-size: var(--comp-card-current-icon-font-size)", "inline-size: var(--comp-card-current-icon-size)"], "Card icon frame must consume component Card aliases."],
    [statusBlock, ["align-self: center", "border-radius: var(--comp-card-current-status-radius)", "font-size: var(--comp-card-current-status-size)", "padding: var(--comp-card-current-status-padding-block) var(--comp-card-current-status-padding-inline)"], "Card status frame, placement, and voice must consume component-scoped current aliases."],
    [detailBlock, ["color: var(--comp-card-current-detail-fg)", "font-size: var(--comp-card-detail-size)", "line-height: var(--comp-card-detail-line-height)"], "Card detail voice and color must consume component Card aliases."],
    [loadingBlock, ["gap: var(--comp-card-current-loading-gap)", "min-block-size: var(--comp-card-current-loading-min-block-size)"], "Card loading rhythm must consume component-scoped current aliases."],
    [actionsBlock, ["gap: var(--comp-card-current-actions-gap)", "justify-content: var(--comp-card-current-actions-justify)"], "Card actions layout must consume component-scoped current aliases."],
    [headerActionsBlock, ["align-self: center", "justify-content: flex-end"], "Card header actions must have a governed placement rule."],
    [minimalIconBlock, ["font-size: var(--comp-card-minimal-icon-size)", "inline-size: var(--comp-card-minimal-icon-size)"], "Card minimal icon sizing must consume component Card aliases."],
    [minimalHeaderBlock, ["display: flex"], "Card minimal header/heading must preserve real flex anatomy."],
    [minimalDetailBlock, ["font-size: var(--comp-card-minimal-detail-size)"], "Card minimal detail voice must consume a component Card alias."],
    [elevatedBlock, ["box-shadow: var(--comp-card-shadow-hover)"], "Card elevated depth must consume the Card hover shadow alias."],
    [elevatedDetailBlock, ["font-size: var(--comp-card-elevated-detail-size)"], "Card elevated detail voice must consume a component Card alias."],
    [ghostBlock, ["color: var(--comp-card-ghost-fg)"], "Card ghost foreground must consume a component Card alias."],
    [ghostTextBlock, ["font-size: var(--comp-card-ghost-text-size)"], "Card ghost text voice must consume a component Card alias."],
  ];
  for (const [block, snippets, message] of elementContracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
  for (const [snippet, message] of [
    ["--comp-card-surface-bg: var(--component-color-surface)", "Card surface background must map through a Surface/Foundation alias."],
    ["--component-radius-card: var(--sys-radius-lg)", "Card radius must expose a component alias over the foundation card radius."],
    ["--component-surface-frame-padding-md: var(--component-density-card-padding)", "Card surface frame medium padding must route through the card density foundation."],
    ["--component-surface-frame-radius-card: var(--component-radius-card)", "Card surface frame radius must route through the component Card radius alias."],
    ["--component-surface-frame-border-width: var(--component-frame-border-thin)", "Card surface frame border width must route through the frame border foundation."],
    ["--comp-card-padding-md: var(--component-surface-frame-padding-md)", "Card medium padding must consume the Surface/Frame padding alias, not generic spacing."],
    ["--comp-card-gap-md: var(--component-surface-frame-gap-md)", "Card medium gap must consume the Surface/Frame gap alias, not generic spacing."],
    ["--component-depth-card-hover: var(--sys-elevation-floating)", "Card hover depth must use the floating elevation alias rather than the heavier overlay/popover depth."],
    ["--comp-card-surface-radius: var(--component-surface-frame-radius-card)", "Card surface radius must map through the Surface/Frame card radius alias."],
    ["--comp-card-bg: var(--comp-card-surface-bg)", "Card background must consume the mapped surface alias."],
    ["--comp-card-radius: var(--comp-card-surface-radius)", "Card radius must consume the mapped surface alias."],
    ["--comp-card-surface-bg-pressed: var(--component-tone-action-surface-pressed)", "Card pressed surface background must map through the shared action pressed surface tone."],
    ["--comp-card-bg-selected: var(--comp-card-bg-pressed)", "Card selected state must consume the shared Card pressed background alias."],
    ["--comp-card-border-selected: var(--comp-card-border-pressed)", "Card selected state must consume the shared Card pressed border alias."],
    ["--comp-card-shadow-selected: var(--comp-card-shadow-pressed)", "Card selected state must consume the shared Card pressed shadow alias."],
    ["--comp-card-press-transform: var(--component-transform-press)", "Card pressed state must consume the shared press motion transform."],
    ["--comp-card-title-size-lg: var(--component-font-size-title-md)", "Card large density title must use the next title voice instead of resolving to the same size as medium."],
    ["--comp-card-ghost-fg: var(--component-color-text)", "Card ghost foreground must use text color, not surface color, so light/dark contrast stays readable."],
    ["--comp-card-shadow-error: var(--component-depth-error-ring), var(--comp-card-shadow-rest)", "Card error state must use an error ring plus rest shadow, not modal/overlay depth."],
  ]) {
    if (!text.includes(snippet)) add("errors", packageCssFile, 1, message);
  }
  requireIncludes({
    block: selectedBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-card-bg-selected)", "box-shadow: var(--comp-card-shadow-selected)", "transform: var(--comp-card-press-transform)"],
    message: "Card selected state must read as a pressed surface with governed background, depth, and motion aliases.",
  });
  requireIncludes({
    block: pressedBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-card-bg-pressed)", "border-color: var(--comp-card-border-pressed)", "box-shadow: var(--comp-card-shadow-pressed)", "transform: var(--comp-card-press-transform)"],
    message: "Interactive Card active state must consume the same pressed surface aliases as selected Card.",
  });
}

module.exports = { checkCardCssContract };
