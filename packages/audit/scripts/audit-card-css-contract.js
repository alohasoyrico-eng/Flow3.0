const { add, lineNumber } = require("./audit-context.js");

function bodyFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkCardCssContract({ text, blocks, packageCssFile, selectorKey }) {
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
  const minimalIconBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__icon");
  const minimalDetailBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"minimal\"] .card__detail");
  const elevatedDetailBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"elevated\"] .card__detail");
  const ghostBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"ghost\"]");
  const ghostTextBlock = bodyFor(blocks, selectorKey, ".card[data-variant=\"ghost\"] .card__title,.card[data-variant=\"ghost\"] .card__detail");

  if (text.includes("--card-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--card-")), "Card must not introduce short --card-* aliases; use the component namespace and --comp-card-current-* resolved aliases.");
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
    snippets: ["--comp-card-current-gap: var(--comp-card-media-gap)", "--comp-card-current-media-block-size:"],
    message: "Card media composition must resolve through comp Card media aliases.",
  });
  requireIncludes({
    block: statsBlock,
    text,
    packageCssFile,
    snippets: ["--comp-card-current-padding: var(--comp-card-stats-padding)", "--comp-card-current-value-size: var(--comp-card-stats-value-size)"],
    message: "Card stats composition must resolve through comp Card stats aliases.",
  });

  const elementContracts = [
    [headerBlock, ["gap: var(--comp-card-current-header-gap)"], "Card header gap must consume the component-scoped current alias."],
    [headingBlock, ["gap: var(--comp-card-current-heading-gap)"], "Card heading gap must consume the component-scoped current alias."],
    [iconBlock, ["border-radius: var(--comp-card-icon-radius)", "font-size: var(--comp-card-current-icon-font-size)", "inline-size: var(--comp-card-current-icon-size)"], "Card icon frame must consume component Card aliases."],
    [statusBlock, ["border-radius: var(--comp-card-current-status-radius)", "font-size: var(--comp-card-current-status-size)", "padding: var(--comp-card-current-status-padding-block) var(--comp-card-current-status-padding-inline)"], "Card status frame and voice must consume component-scoped current aliases."],
    [detailBlock, ["color: var(--comp-card-current-detail-fg)"], "Card detail color must consume the component-scoped current alias."],
    [loadingBlock, ["gap: var(--comp-card-current-loading-gap)", "min-block-size: var(--comp-card-current-loading-min-block-size)"], "Card loading rhythm must consume component-scoped current aliases."],
    [actionsBlock, ["gap: var(--comp-card-current-actions-gap)", "justify-content: var(--comp-card-current-actions-justify)"], "Card actions layout must consume component-scoped current aliases."],
    [minimalIconBlock, ["font-size: var(--comp-card-minimal-icon-size)", "inline-size: var(--comp-card-minimal-icon-size)"], "Card minimal icon sizing must consume component Card aliases."],
    [minimalDetailBlock, ["font-size: var(--comp-card-minimal-detail-size)"], "Card minimal detail voice must consume a component Card alias."],
    [elevatedDetailBlock, ["font-size: var(--comp-card-elevated-detail-size)"], "Card elevated detail voice must consume a component Card alias."],
    [ghostBlock, ["color: var(--comp-card-ghost-fg)"], "Card ghost foreground must consume a component Card alias."],
    [ghostTextBlock, ["font-size: var(--comp-card-ghost-text-size)"], "Card ghost text voice must consume a component Card alias."],
  ];
  for (const [block, snippets, message] of elementContracts) {
    requireIncludes({ block, text, packageCssFile, snippets, message });
  }
}

module.exports = { checkCardCssContract };
