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

function checkQuickActionCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/QuickAction.tsx");
  const jsSourceFile = path.join(sourceRoot, "packages/react/src/QuickAction.js");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : jsSourceFile;
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".quick-action");
  const densitySmBlock = blockFor(blocks, selectorKey, ".quick-action[data-density=\"sm\"]");
  const densityLgBlock = blockFor(blocks, selectorKey, ".quick-action[data-density=\"lg\"]");
  const compactBlock = blockFor(blocks, selectorKey, ".quick-action[data-variant=\"compact\"]");
  const wideBlock = blockFor(blocks, selectorKey, ".quick-action[data-variant=\"wide\"]");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".quick-action[data-full-width=\"true\"]");
  const controlBlock = blockFor(blocks, selectorKey, ".quick-action__control");
  const iconBlock = blockFor(blocks, selectorKey, ".quick-action__icon");
  const focusBlock = blocks.find((block) => block.selector.includes(".quick-action__control:focus-visible"));
  const loadingBlock = blockFor(blocks, selectorKey, ".quick-action[data-state=\"loading\"]");
  const loadingControlBlock = blockFor(blocks, selectorKey, ".quick-action[data-state=\"loading\"] .quick-action__control");
  const warningBlock = blockFor(blocks, selectorKey, ".quick-action[data-state=\"warning\"] .quick-action__control");
  const warningIntentBlock = blocks.find((block) => block.selector.includes(".quick-action[data-intent=\"warning\"] .quick-action__control"));
  const dangerIntentBlock = blockFor(blocks, selectorKey, ".quick-action[data-intent=\"danger\"] .quick-action__control");
  const disabledControlBlock = blockFor(blocks, selectorKey, ".quick-action[data-state=\"disabled\"] .quick-action__control");
  const disabledLabelBlock = blockFor(blocks, selectorKey, ".quick-action[data-state=\"disabled\"] .quick-action__label");
  const labelBlock = blockFor(blocks, selectorKey, ".quick-action__label");

  if (!source.includes("Badge") || !source.includes("Spinner")) {
    add("errors", sourceFile, 1, "QuickAction must compose Badge and Spinner instead of duplicating count/loading visuals.");
  }
  if (!source.includes("\"warning\"") || !source.includes("\"data-intent\"")) {
    add("errors", sourceFile, 1, "QuickAction must expose governed warning intent through data-intent.");
  }
  const localActionSize = /--comp-quick-action-(?:label-width|min-block-size|min-inline-size):\s*calc\(var\(--component-control-min-size\)[^;]+;/.exec(text);
  if (localActionSize) {
    add("errors", packageCssFile, lineNumber(text, localActionSize.index), "QuickAction layout sizes must flow through shared Frame action roles instead of local control-size calculations.");
  }
  const localIconSize = /--comp-quick-action-icon-size:\s*var\(--component-(?:control-min-size|inline-size-md|block-size-sm)\)/.exec(text);
  if (localIconSize) {
    add("errors", packageCssFile, lineNumber(text, localIconSize.index), "QuickAction control size must flow through shared Frame action control roles instead of generic component size aliases.");
  }
  for (const snippet of [
    "--comp-quick-action-icon-size: var(--component-action-control-size-md)",
    "--comp-quick-action-icon-font-size: var(--component-density-icon-size-md)",
    "--comp-quick-action-label-width: var(--component-action-label-inline-size-md)",
    "--comp-quick-action-min-block-size: var(--component-action-min-block-size-md)",
    "--comp-quick-action-min-inline-size: var(--component-action-min-inline-size-md)",
  ]) {
    if (!rootBlock?.body.includes(snippet)) {
      add("errors", packageCssFile, rootBlock ? lineNumber(text, rootBlock.index) : 1, "QuickAction root sizing aliases must consume shared Frame action roles.");
      break;
    }
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-quick-action-bg: var(--component-surface-transparent)",
      "--comp-quick-action-border-width: var(--component-border-width-none)",
      "--comp-quick-action-shadow: var(--component-depth-none)",
      "--comp-quick-action-cursor: var(--component-cursor-default)",
      "--comp-quick-action-display: var(--component-display-inline-grid)",
      "--comp-quick-action-inline-size: var(--component-inline-size-max-content)",
      "--comp-quick-action-max-inline-size: var(--component-inline-size-full)",
      "--comp-quick-action-control-cursor: var(--component-cursor-pointer)",
      "--comp-quick-action-control-display: var(--component-display-inline-flex)",
      "--comp-quick-action-control-padding: var(--component-frame-space-none)",
      "--comp-quick-action-disabled-bg: var(--component-color-disabled-bg)",
      "--comp-quick-action-disabled-border: var(--component-color-disabled-border)",
      "--comp-quick-action-disabled-cursor: var(--component-cursor-not-allowed)",
      "--comp-quick-action-disabled-fg: var(--component-color-disabled-fg)",
      "--comp-quick-action-disabled-opacity: var(--component-opacity-disabled)",
      "--comp-quick-action-label-display: var(--component-display-block)",
      "background: var(--comp-quick-action-bg)",
      "border: var(--comp-quick-action-border-width)",
      "box-shadow: var(--comp-quick-action-shadow)",
      "cursor: var(--comp-quick-action-cursor)",
      "display: var(--comp-quick-action-display)",
      "inline-size: var(--comp-quick-action-inline-size)",
      "min-inline-size: max(var(--comp-quick-action-min-inline-size), var(--comp-quick-action-label-width))",
    ],
    message: "QuickAction root must stay a layout-only wrapper with explicit component aliases.",
  });
  for (const [block, message] of [
    [densitySmBlock, "QuickAction small density must set sizing aliases."],
    [densityLgBlock, "QuickAction large density must set sizing aliases."],
    [compactBlock, "QuickAction compact variant must set sizing aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-quick-action-icon-size:",
        "--comp-quick-action-icon-font-size:",
        "--comp-quick-action-label-width:",
        "--comp-quick-action-label-size:",
        "--comp-quick-action-min-block-size:",
        "--comp-quick-action-min-inline-size:",
      ],
      message,
    });
  }
  requireIncludes({
    block: densitySmBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-quick-action-icon-size: var(--component-action-control-size-sm)",
      "--comp-quick-action-icon-font-size: var(--component-density-icon-size-sm)",
      "--comp-quick-action-label-width: var(--component-action-label-inline-size-sm)",
      "--comp-quick-action-min-block-size: var(--component-action-min-block-size-md)",
      "--comp-quick-action-min-inline-size: var(--component-action-min-inline-size-sm)",
    ],
    message: "QuickAction small density must consume shared small action Frame roles.",
  });
  requireIncludes({
    block: densityLgBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-quick-action-icon-size: var(--component-action-control-size-lg)",
      "--comp-quick-action-icon-font-size: var(--component-density-icon-size-lg)",
      "--comp-quick-action-label-width: var(--component-action-label-inline-size-lg)",
      "--comp-quick-action-min-block-size: var(--component-action-min-block-size-lg)",
      "--comp-quick-action-min-inline-size: var(--component-action-min-inline-size-lg)",
    ],
    message: "QuickAction large density must consume shared large action Frame roles.",
  });
  requireIncludes({
    block: compactBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-quick-action-icon-size: var(--component-action-control-size-sm)",
      "--comp-quick-action-icon-font-size: var(--component-density-icon-size-sm)",
      "--comp-quick-action-label-width: var(--component-action-label-inline-size-sm)",
      "--comp-quick-action-min-block-size: var(--component-action-min-block-size-md)",
      "--comp-quick-action-min-inline-size: var(--component-action-min-inline-size-sm)",
    ],
    message: "QuickAction compact variant must consume shared compact action Frame roles.",
  });
  requireIncludes({
    block: wideBlock,
    text,
    packageCssFile,
    snippets: ["--comp-quick-action-label-width: var(--component-action-label-inline-size-xl)", "--comp-quick-action-min-inline-size:"],
    message: "QuickAction wide variant must set width aliases.",
  });
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-quick-action-full-width)"],
    message: "QuickAction full width variant must consume its width alias.",
  });
  requireIncludes({
    block: controlBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-quick-action-control-bg)",
      "border: var(--comp-quick-action-control-border-width) solid var(--comp-quick-action-control-border)",
      "border-radius: var(--comp-quick-action-control-radius)",
      "block-size: var(--comp-quick-action-icon-size)",
      "box-sizing: border-box",
      "box-shadow: var(--comp-quick-action-control-shadow)",
      "cursor: var(--comp-quick-action-control-cursor)",
      "display: var(--comp-quick-action-control-display)",
      "inline-size: var(--comp-quick-action-icon-size)",
      "justify-content: var(--comp-quick-action-control-justify)",
      "padding: var(--comp-quick-action-control-padding)",
    ],
    message: "QuickAction control must own the circular interactive surface through control aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: [
      "display: var(--comp-quick-action-icon-display)",
      "font-size: var(--comp-quick-action-icon-font-size)",
      "justify-content: var(--comp-quick-action-icon-justify)",
    ],
    message: "QuickAction icon must consume icon aliases.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--comp-quick-action-focus-width) solid var(--comp-quick-action-focus-color)",
      "outline-offset: var(--comp-quick-action-focus-offset)",
    ],
    message: "QuickAction focus must consume accessibility aliases on the circular control.",
  });
  requireIncludes({
    block: loadingBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-quick-action-loading-cursor)"],
    message: "QuickAction loading state must consume loading cursor alias.",
  });
  requireIncludes({
    block: loadingControlBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-quick-action-disabled-bg)",
      "border-color: var(--comp-quick-action-disabled-border)",
      "color: var(--comp-quick-action-disabled-fg)",
      "cursor: var(--comp-quick-action-disabled-cursor)",
      "opacity: var(--comp-quick-action-disabled-opacity)",
      "transform: none",
    ],
    message: "QuickAction loading control must consume blocked-state aliases.",
  });
  requireIncludes({
    block: warningBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-quick-action-warning-bg)", "color: var(--comp-quick-action-warning-fg)"],
    message: "QuickAction warning state must consume warning aliases.",
  });
  requireIncludes({
    block: warningIntentBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-quick-action-warning-bg)", "color: var(--comp-quick-action-warning-fg)"],
    message: "QuickAction warning intent must consume warning aliases.",
  });
  requireIncludes({
    block: dangerIntentBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-quick-action-danger-bg)", "color: var(--comp-quick-action-danger-fg)"],
    message: "QuickAction danger intent must consume danger aliases.",
  });
  requireIncludes({
    block: disabledControlBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-quick-action-disabled-bg)",
      "border-color: var(--comp-quick-action-disabled-border)",
      "color: var(--comp-quick-action-disabled-fg)",
      "cursor: var(--comp-quick-action-disabled-cursor)",
      "opacity: var(--comp-quick-action-disabled-opacity)",
      "transform: none",
    ],
    message: "QuickAction disabled control must consume blocked-state aliases.",
  });
  requireIncludes({
    block: disabledLabelBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-quick-action-disabled-fg)"],
    message: "QuickAction disabled label must consume blocked-state aliases.",
  });
  requireIncludes({
    block: labelBlock,
    text,
    packageCssFile,
    snippets: [
      "color: var(--comp-quick-action-label-fg)",
      "display: var(--comp-quick-action-label-display)",
      "font-size: var(--comp-quick-action-label-size)",
      "font-weight: var(--comp-quick-action-label-weight)",
      "inline-size: var(--comp-quick-action-label-width)",
      "line-height: var(--comp-quick-action-label-line-height)",
      "overflow-wrap: var(--comp-quick-action-label-overflow-wrap)",
    ],
    message: "QuickAction label must stay outside the circular surface and consume label aliases.",
  });
}

module.exports = { checkQuickActionCssContract };
