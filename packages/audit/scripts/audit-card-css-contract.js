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

  requireIncludes({
    block: cardBlock,
    text,
    packageCssFile,
    snippets: [
      "--card-header-gap: var(--comp-card-header-gap)",
      "--card-heading-gap: var(--comp-card-heading-gap)",
      "--card-status-radius: var(--comp-card-status-radius)",
      "--card-detail-fg: var(--comp-card-detail-fg)",
      "--card-loading-min-block-size: calc(var(--card-icon-size) + var(--card-loading-gap))",
      "--card-actions-gap: var(--comp-card-actions-gap)",
    ],
    message: "Card base must expose local aliases for sublayout, status, detail, loading, and actions.",
  });
  requireIncludes({
    block: compactBlock,
    text,
    packageCssFile,
    snippets: ["--card-padding: var(--comp-card-compact-padding)", "--card-gap: var(--comp-card-compact-gap)"],
    message: "Card compact composition must resolve through comp Card frame aliases.",
  });
  requireIncludes({
    block: mediaBlock,
    text,
    packageCssFile,
    snippets: ["--card-gap: var(--comp-card-media-gap)", "--card-media-block-size:"],
    message: "Card media composition must resolve through comp Card media aliases.",
  });
  requireIncludes({
    block: statsBlock,
    text,
    packageCssFile,
    snippets: ["--card-padding: var(--comp-card-stats-padding)", "--card-value-size: var(--comp-card-stats-value-size)"],
    message: "Card stats composition must resolve through comp Card stats aliases.",
  });

  const elementContracts = [
    [headerBlock, ["gap: var(--card-header-gap)"], "Card header gap must consume the local Card alias."],
    [headingBlock, ["gap: var(--card-heading-gap)"], "Card heading gap must consume the local Card alias."],
    [iconBlock, ["border-radius: var(--comp-card-icon-radius)"], "Card icon radius must consume the component Card alias."],
    [statusBlock, ["border-radius: var(--card-status-radius)", "font-size: var(--card-status-size)", "padding: var(--card-status-padding-block) var(--card-status-padding-inline)"], "Card status frame and voice must consume local Card aliases."],
    [detailBlock, ["color: var(--card-detail-fg)"], "Card detail color must consume the local Card alias."],
    [loadingBlock, ["gap: var(--card-loading-gap)", "min-block-size: var(--card-loading-min-block-size)"], "Card loading rhythm must consume local Card aliases."],
    [actionsBlock, ["gap: var(--card-actions-gap)", "justify-content: var(--card-actions-justify)"], "Card actions layout must consume local Card aliases."],
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
