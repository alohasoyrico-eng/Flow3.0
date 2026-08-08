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

function checkFloatingActionButtonCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceFile = path.join(root || process.cwd(), "packages/react/src/FloatingActionButton.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".fab");
  const smBlock = blockFor(blocks, selectorKey, ".fab[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".fab[data-density=\"lg\"]");
  const accentBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"accent\"]");
  const miniBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"mini\"]");
  const hoverBlock = blockFor(blocks, selectorKey, ".fab:hover:not(:disabled)");
  const accentHoverBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"accent\"]:hover:not(:disabled)");
  const activeBlock = blockFor(blocks, selectorKey, ".fab:active:not(:disabled)");
  const stateHoverBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"hover\"]:not(:disabled)");
  const statePressedBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"pressed\"]:not(:disabled)");
  const collapsedBlock = blockFor(blocks, selectorKey, ".fab[data-extended=\"false\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".fab__icon");
  const focusBlock = blockFor(blocks, selectorKey, ".fab:focus-visible");
  const stateFocusBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".fab:disabled");

  if (
    !source.includes("forwardRef") ||
    !source.includes("floatingActionButtonPlatformContract") ||
    !source.includes("flowVariantProps(resolvedVariant)") ||
    !source.includes("flowStateProps(resolvedState)") ||
    !source.includes("flowDensityProps(resolvedDensity)")
  ) {
    add("errors", sourceFile, 1, "FloatingActionButton must expose a real React ref contract, platform contract, variant, state, and density props.");
  }
  if (!source.includes("if (!resolvedLabel) return null;") || !source.includes("\"aria-label\": resolvedLabel")) {
    add("errors", sourceFile, 1, "FloatingActionButton must not render without an accessible label.");
  }
  if (!source.includes("const canInteract = Boolean(rest.onClick || resolvedType === \"submit\" || resolvedType === \"reset\");") || !source.includes("disabled: resolvedState === \"disabled\" || resolvedState === \"loading\" || !canInteract")) {
    add("errors", sourceFile, 1, "FloatingActionButton must keep inert and loading actions disabled.");
  }
  if (!source.includes("React.createElement(Spinner") || !source.includes("decorative: true")) {
    add("errors", sourceFile, 1, "FloatingActionButton loading state must compose Spinner through React.");
  }
  if (text.includes("--fab-size") || text.includes("--fab-icon-size") || text.includes("--fab-padding")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--fab-")), "FloatingActionButton must not use short local --fab-* aliases; use the component token namespace.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-floating-action-button-align: center",
      "--comp-floating-action-button-size: var(--comp-floating-action-button-size-md)",
      "--comp-floating-action-button-icon-size: var(--comp-floating-action-button-icon-size-md)",
      "--comp-floating-action-button-padding-x: var(--comp-floating-action-button-padding-x-md)",
      "--comp-floating-action-button-border: 0",
      "--comp-floating-action-button-cursor: pointer",
      "--comp-floating-action-button-transition:",
      "--comp-floating-action-button-disabled-cursor: not-allowed",
      "align-items: var(--comp-floating-action-button-align)",
      "border: var(--comp-floating-action-button-border)",
      "cursor: var(--comp-floating-action-button-cursor)",
      "display: var(--comp-floating-action-button-display)",
      "inline-size: var(--comp-floating-action-button-inline-size)",
      "justify-content: var(--comp-floating-action-button-justify)",
      "min-block-size: var(--comp-floating-action-button-size)",
      "min-inline-size: var(--comp-floating-action-button-size)",
      "padding: 0 var(--comp-floating-action-button-padding-x)",
      "transition: var(--comp-floating-action-button-transition)",
    ],
    message: "FloatingActionButton root must own and consume aliases for layout, frame, density, interaction, and motion.",
  });
  for (const [block, message] of [
    [smBlock, "FloatingActionButton small density must set size, icon, and padding aliases."],
    [lgBlock, "FloatingActionButton large density must set size, icon, and padding aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-floating-action-button-size:",
        "--comp-floating-action-button-icon-size:",
        "--comp-floating-action-button-padding-x:",
      ],
      message,
    });
  }
  requireIncludes({
    block: accentBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-floating-action-button-accent-bg)"],
    message: "FloatingActionButton accent variant must consume accent background alias.",
  });
  requireIncludes({
    block: miniBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-floating-action-button-size: var(--comp-floating-action-button-mini-size)",
      "--comp-floating-action-button-icon-size: var(--comp-floating-action-button-icon-size-sm)",
      "--comp-floating-action-button-padding-x: var(--comp-floating-action-button-collapsed-padding-x)",
    ],
    message: "FloatingActionButton mini variant must set size, icon, and padding aliases.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-floating-action-button-bg-hover)",
      "box-shadow: var(--comp-floating-action-button-shadow-hover)",
      "transform: var(--comp-floating-action-button-hover-transform)",
    ],
    message: "FloatingActionButton hover state must consume hover aliases.",
  });
  requireIncludes({
    block: accentHoverBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-floating-action-button-accent-bg-hover)"],
    message: "FloatingActionButton accent hover must consume accent hover alias.",
  });
  requireIncludes({
    block: activeBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-floating-action-button-active-transform)"],
    message: "FloatingActionButton active state must consume active transform alias.",
  });
  requireIncludes({
    block: stateHoverBlock,
    text,
    packageCssFile,
    snippets: [
      "box-shadow: var(--comp-floating-action-button-shadow-hover)",
      "transform: var(--comp-floating-action-button-hover-transform)",
    ],
    message: "FloatingActionButton forced hover state must consume hover aliases.",
  });
  requireIncludes({
    block: statePressedBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-floating-action-button-press-transform)"],
    message: "FloatingActionButton forced pressed state must consume press alias.",
  });
  requireIncludes({
    block: collapsedBlock,
    text,
    packageCssFile,
    snippets: ["padding: 0 var(--comp-floating-action-button-collapsed-padding-x)"],
    message: "FloatingActionButton collapsed state must consume collapsed padding alias.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["font-size: var(--comp-floating-action-button-icon-size)"],
    message: "FloatingActionButton icon must consume icon size alias.",
  });
  for (const [block, message] of [
    [focusBlock, "FloatingActionButton focus-visible state must consume focus aliases."],
    [stateFocusBlock, "FloatingActionButton forced focus state must consume focus aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "outline: var(--comp-floating-action-button-focus-width) solid var(--comp-floating-action-button-focus-color)",
        "outline-offset: var(--comp-floating-action-button-focus-offset)",
      ],
      message,
    });
  }
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "cursor: var(--comp-floating-action-button-disabled-cursor)",
      "opacity: var(--comp-floating-action-button-disabled-opacity)",
    ],
    message: "FloatingActionButton disabled state must consume disabled aliases.",
  });
}

module.exports = { checkFloatingActionButtonCssContract };
