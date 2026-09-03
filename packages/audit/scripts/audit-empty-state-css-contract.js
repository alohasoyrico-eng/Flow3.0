const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkEmptyStateCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const fs = require("fs");
  const path = require("path");
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/EmptyState.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".empty-state");
  const smBlock = blockFor(blocks, selectorKey, ".empty-state[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".empty-state[data-density=\"lg\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".empty-state__icon");
  const permissionIconBlock = blocks.find((block) => selectorKey(block).includes(".empty-state[data-variant=\"permission\"] .empty-state__icon"));
  const errorIconBlock = blocks.find((block) => selectorKey(block).includes(".empty-state[data-variant=\"error\"] .empty-state__icon"));
  const titleBlock = blockFor(blocks, selectorKey, ".empty-state__title");
  const descriptionBlock = blockFor(blocks, selectorKey, ".empty-state__description");
  const actionBlock = blockFor(blocks, selectorKey, ".empty-state__action");

  if (!source.includes("React.createElement(Button") || !source.includes("React.createElement(Spinner")) {
    add("errors", sourceFile, 1, "EmptyState must compose Button and Spinner instead of duplicating action/loading implementations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-empty-state-fg: var(--component-color-text)",
      "--comp-empty-state-icon-bg:",
      "--comp-empty-state-icon-glyph-size: calc(var(--comp-empty-state-icon-size) * 0.47)",
      "--comp-empty-state-title-family: var(--component-font-family-title)",
      "--comp-empty-state-description-line-height: var(--component-line-height-normal)",
      "color: var(--comp-empty-state-fg)",
      "gap: var(--comp-empty-state-gap)",
      "padding: var(--comp-empty-state-padding-block) var(--comp-empty-state-padding-inline)",
    ],
    message: "EmptyState root must own frame, icon, density, tone, and voice aliases.",
  });
  requireIncludes({
    block: smBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-empty-state-icon-size: var(--component-empty-state-icon-size-sm)",
      "--comp-empty-state-gap: var(--component-space-xs)",
      "--comp-empty-state-title-size: var(--component-font-size-small)",
      "--comp-empty-state-description-size: var(--component-font-size-caption)",
    ],
    message: "EmptyState sm density must scale through EmptyState aliases.",
  });
  requireIncludes({
    block: lgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-empty-state-icon-size: var(--component-empty-state-icon-size-lg)",
      "--comp-empty-state-gap: var(--component-space-md)",
      "--comp-empty-state-title-size: var(--component-font-size-title-md)",
      "--comp-empty-state-description-size: var(--component-font-size-body)",
    ],
    message: "EmptyState lg density must scale through EmptyState aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-empty-state-icon-bg)",
      "border-radius: var(--comp-empty-state-icon-radius)",
      "color: var(--comp-empty-state-icon-fg)",
      "font-size: var(--comp-empty-state-icon-glyph-size)",
      "margin-block-end: var(--comp-empty-state-icon-margin-block-end)",
    ],
    message: "EmptyState icon must consume EmptyState icon aliases.",
  });
  requireIncludes({
    block: permissionIconBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-empty-state-permission-icon-bg)", "color: var(--comp-empty-state-permission-icon-fg)"],
    message: "EmptyState permission icon must consume EmptyState permission aliases.",
  });
  requireIncludes({
    block: errorIconBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-empty-state-error-icon-bg)", "color: var(--comp-empty-state-error-icon-fg)"],
    message: "EmptyState error icon must consume EmptyState error aliases.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--comp-empty-state-title-family)",
      "font-size: var(--comp-empty-state-title-size)",
      "font-weight: var(--comp-empty-state-title-weight)",
    ],
    message: "EmptyState title must consume EmptyState title voice aliases.",
  });
  requireIncludes({
    block: descriptionBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-empty-state-description-fg)",
      "font-size: var(--comp-empty-state-description-size)",
      "line-height: var(--comp-empty-state-description-line-height)",
      "max-inline-size: var(--comp-empty-state-description-width)",
    ],
    message: "EmptyState description must consume EmptyState description aliases.",
  });
  requireIncludes({
    block: actionBlock,
    text,
    packageCssFile,
    snippets: ["margin-block-start: var(--component-space-sm)"],
    message: "EmptyState ZIP action slot must use a governed action frame.",
  });

  if (/--comp-empty-state-icon-size:\s*var\(--sys-frame-height-control-lg/.test(text)) {
    add("errors", packageCssFile, 1, "EmptyState density icon size must route through component-owned icon size aliases.");
  }
  if (/--comp-empty-state-icon-glyph-size:\s*var\(--component-icon-size/.test(text)) {
    add("errors", packageCssFile, 1, "EmptyState glyph size must stay proportional to the component icon container across host contexts.");
  }
}

module.exports = { checkEmptyStateCssContract };
