const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkErrorPanelCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const fs = require("fs");
  const path = require("path");
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/ErrorPanel.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".error-panel");
  const inlineBlock = blockFor(blocks, selectorKey, ".error-panel[data-variant=\"inline\"]");
  const blockingBlock = blockFor(blocks, selectorKey, ".error-panel[data-variant=\"blocking\"]");
  const emptyRecoveryIconBlock = blockFor(blocks, selectorKey, ".error-panel[data-variant=\"empty-recovery\"] .error-panel__icon");
  const disabledBlock = blockFor(blocks, selectorKey, ".error-panel[data-state=\"disabled\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".error-panel__icon");
  const contentBlock = blockFor(blocks, selectorKey, ".error-panel__content");
  const titleBlock = blockFor(blocks, selectorKey, ".error-panel__content strong");
  const descriptionBlock = blockFor(blocks, selectorKey, ".error-panel__content p");
  const actionsBlock = blockFor(blocks, selectorKey, ".error-panel__actions");
  const blockingActionsBlock = blockFor(blocks, selectorKey, ".error-panel[data-variant=\"blocking\"] .error-panel__actions");
  const emptyRecoveryActionsBlock = blockFor(blocks, selectorKey, ".error-panel[data-variant=\"empty-recovery\"] .error-panel__actions");

  if (/\.kpi-tile,\s*\.error-panel\s*{/m.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".error-panel")), "ErrorPanel must not share its frame block with KpiTile.");
  }
  if (!source.includes("React.createElement(Button") || !source.includes("React.createElement(Spinner")) {
    add("errors", sourceFile, 1, "ErrorPanel must compose Button and Spinner instead of duplicating action/loading implementations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-error-panel-bg: var(--component-color-surface)",
      "--comp-error-panel-border-width: var(--component-border-width)",
      "--comp-error-panel-depth: var(--component-depth-none)",
      "--comp-error-panel-icon-bg:",
      "--comp-error-panel-icon-font-size: calc(var(--comp-error-panel-icon-size) * 0.48)",
      "--comp-error-panel-title-family: var(--component-font-family-title)",
      "--comp-error-panel-title-weight: var(--component-font-weight-bold)",
      "background: var(--comp-error-panel-bg)",
      "border: var(--comp-error-panel-border-width) solid var(--comp-error-panel-border)",
      "color: var(--comp-error-panel-fg)",
      "display: grid",
    ],
    message: "ErrorPanel root must own frame, icon, tone, density, composition, and voice aliases.",
  });
  requireIncludes({
    block: inlineBlock,
    text,
    packageCssFile,
    snippets: ["border-radius: var(--comp-error-panel-inline-radius)", "box-shadow: var(--comp-error-panel-depth)"],
    message: "ErrorPanel inline variant must consume ErrorPanel inline aliases.",
  });
  requireIncludes({
    block: blockingBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-error-panel-icon-size: 5.25rem",
      "box-shadow: var(--comp-error-panel-blocking-depth)",
      "grid-template-columns: minmax(0, 1fr)",
      "text-align: center",
    ],
    message: "ErrorPanel blocking variant must consume ErrorPanel blocking depth alias.",
  });
  requireIncludes({
    block: emptyRecoveryIconBlock,
    text,
    packageCssFile,
    snippets: ["block-size: var(--comp-error-panel-empty-icon-size)", "font-size: var(--comp-error-panel-empty-icon-font-size)"],
    message: "ErrorPanel empty recovery icon must consume ErrorPanel empty-state bridge aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "border-color: var(--comp-error-panel-disabled-border)",
      "color: var(--comp-error-panel-disabled-fg)",
      "opacity: var(--comp-error-panel-disabled-opacity)",
    ],
    message: "ErrorPanel disabled state must consume ErrorPanel disabled aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-error-panel-icon-bg)",
      "border-radius: var(--comp-error-panel-icon-radius)",
      "color: var(--comp-error-panel-icon-fg)",
      "font-family: var(--comp-error-panel-icon-family)",
    ],
    message: "ErrorPanel icon must consume ErrorPanel icon aliases.",
  });
  requireIncludes({
    block: contentBlock,
    text,
    packageCssFile,
    snippets: ["gap: var(--comp-error-panel-content-gap)"],
    message: "ErrorPanel content rhythm must consume ErrorPanel content alias.",
  });
  requireIncludes({
    block: titleBlock,
    text,
    packageCssFile,
    snippets: [
      "font-family: var(--comp-error-panel-title-family)",
      "font-size: var(--comp-error-panel-title-size)",
      "font-weight: var(--comp-error-panel-title-weight)",
    ],
    message: "ErrorPanel title must consume ErrorPanel title aliases.",
  });
  requireIncludes({
    block: descriptionBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-error-panel-description-fg)",
      "font-size: var(--comp-error-panel-description-size)",
      "line-height: var(--comp-error-panel-description-line-height)",
    ],
    message: "ErrorPanel description must consume ErrorPanel description aliases.",
  });
  requireIncludes({
    block: actionsBlock,
    text,
    packageCssFile,
    snippets: ["display: flex", "gap: var(--comp-error-panel-actions-gap)"],
    message: "ErrorPanel actions must use a governed action frame.",
  });
  requireIncludes({
    block: blockingActionsBlock,
    text,
    packageCssFile,
    snippets: ["flex-direction: column", "max-inline-size: var(--comp-error-panel-actions-width)"],
    message: "ErrorPanel blocking actions must follow the StatusView stacked action model.",
  });
  requireIncludes({
    block: emptyRecoveryActionsBlock,
    text,
    packageCssFile,
    snippets: ["flex-direction: column", "max-inline-size: var(--comp-error-panel-actions-width)"],
    message: "ErrorPanel empty recovery actions must follow the StatusView stacked action model.",
  });
}

module.exports = { checkErrorPanelCssContract };
