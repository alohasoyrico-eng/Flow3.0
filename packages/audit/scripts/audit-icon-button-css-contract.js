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

function checkIconButtonCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/IconButton.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/IconButton.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".icon-button");
  const focusBlock = blockFor(blocks, selectorKey, ".icon-button:focus-visible");
  const disabledBlock = blockFor(blocks, selectorKey, ".icon-button:disabled");
  const iconBlock = blockFor(blocks, selectorKey, ".icon-button__icon");
  const badgeBlock = blockFor(blocks, selectorKey, ".icon-button__badge");

  if (!source.includes("forwardRef") || !source.includes("iconButtonPlatformContract") || !source.includes("flowDensityProps(")) {
    add("errors", sourceFile, 1, "IconButton must expose a real React ref contract, platform contract, and density prop.");
  }
  if (!source.includes("if (!resolvedLabel) return null;") || !source.includes("\"aria-label\": resolvedLabel") || !source.includes("\"aria-pressed\": selected ? \"true\" : undefined")) {
    add("errors", sourceFile, 1, "IconButton must require an accessible label and expose selected state with aria-pressed.");
  }
  if (text.includes("--icon-button-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--icon-button-")), "IconButton must not use short --icon-button-* aliases; use the component namespace.");
  }
  if (text.includes("--comp-icon-button-size-md: var(--component-control-min-size);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-icon-button-size-md: var(--component-control-min-size);")), "IconButton density sizes must route through --component-icon-button-size-* aliases, not the global control size directly.");
  }
  if (!text.includes("--comp-icon-button-size-md: var(--component-icon-button-size-md);")) {
    add("errors", packageCssFile, 1, "IconButton medium size must consume --component-icon-button-size-md.");
  }
  if (text.includes("--comp-icon-button-size: var(--component-density-control-height);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-icon-button-size: var(--component-density-control-height);")), "IconButton base geometry must be md 44px, not the global density control height.");
  }
  if (!text.includes("--comp-icon-button-size: var(--component-icon-button-size-md);")) {
    add("errors", packageCssFile, 1, "IconButton base geometry must default to --component-icon-button-size-md.");
  }
  if (blockFor(blocks, selectorKey, ".icon-button:focus-visible,.text-area:focus-visible")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".icon-button:focus-visible")), "IconButton focus must not share a CSS block with TextArea.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-icon-button-current-size: var(--comp-icon-button-size)",
      "--comp-icon-button-current-icon-size: var(--comp-icon-button-icon-size)",
      "--comp-icon-button-border: var(--component-border-width) solid var(--comp-icon-button-border-color)",
      "--comp-icon-button-transition:",
      "--comp-icon-button-hover-transform: scale(var(--comp-icon-button-hover-scale))",
      "--comp-icon-button-press-transform: scale(var(--comp-icon-button-press-scale))",
      "--comp-icon-button-selected-icon-variation:",
      "--comp-icon-button-badge-animation:",
      "align-items: var(--comp-icon-button-align)",
      "background: var(--comp-icon-button-bg)",
      "border: var(--comp-icon-button-border)",
      "block-size: var(--comp-icon-button-current-size)",
      "inline-size: var(--comp-icon-button-current-size)",
      "min-block-size: var(--comp-icon-button-current-size)",
      "transition: var(--comp-icon-button-transition)",
    ],
    message: "IconButton root must own and consume aliases for density, frame, selected state, badge, focus, disabled, and motion.",
  });

  for (const [selector, message] of [
    [".icon-button[data-density=\"sm\"]", "IconButton small density must set current size and icon aliases."],
    [".icon-button[data-density=\"lg\"]", "IconButton large density must set current size and icon aliases."],
  ]) {
    requireIncludes({
      block: blockFor(blocks, selectorKey, selector),
      text,
      packageCssFile,
      snippets: ["--comp-icon-button-current-size:", "--comp-icon-button-current-icon-size:"],
      message,
    });
  }

  for (const [selector, snippets, message] of [
    [".icon-button:hover:not(:disabled)", ["background: var(--comp-icon-button-hover-bg)", "border-color: var(--comp-icon-button-hover-border)", "transform: var(--comp-icon-button-hover-transform)"], "IconButton hover must consume hover aliases."],
    [".icon-button:active:not(:disabled)", ["transform: var(--comp-icon-button-press-transform)"], "IconButton active must consume press alias."],
    [".icon-button--tonal", ["background: var(--comp-icon-button-tonal-bg)"], "IconButton tonal variant must consume tonal alias."],
    [".icon-button--primary", ["border-color: var(--comp-icon-button-primary-border)", "background: var(--comp-icon-button-primary-bg)", "color: var(--comp-icon-button-primary-fg)"], "IconButton primary variant must consume action aliases."],
    [".icon-button--primary:hover:not(:disabled)", ["background: var(--comp-icon-button-primary-hover-bg)", "border-color: var(--comp-icon-button-primary-border)"], "IconButton primary hover must consume hover aliases."],
    [".icon-button[aria-pressed=\"true\"]", ["border-color: var(--comp-icon-button-selected-border)", "color: var(--comp-icon-button-selected-fg)"], "IconButton selected state must consume selected aliases."],
    [".icon-button--primary[aria-pressed=\"true\"]", ["color: var(--comp-icon-button-selected-primary-fg)"], "IconButton selected primary must consume selected foreground alias."],
    [".icon-button[aria-pressed=\"true\"] .icon-button__icon", ["font-variation-settings: var(--comp-icon-button-selected-icon-variation)"], "IconButton selected icon must consume iconography alias."],
  ]) {
    requireIncludes({ block: blockFor(blocks, selectorKey, selector), text, packageCssFile, snippets, message });
  }

  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-icon-button-focus-ring)", "outline-offset: var(--comp-icon-button-focus-offset)"],
    message: "IconButton focus-visible state must consume accessibility aliases.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--comp-icon-button-disabled-cursor)", "opacity: var(--comp-icon-button-disabled-opacity)"],
    message: "IconButton disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-icon-button-icon-fg)", "font-size: var(--comp-icon-button-current-icon-size)"],
    message: "IconButton glyph must consume icon aliases.",
  });
  requireIncludes({
    block: badgeBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: var(--comp-icon-button-badge-animation)",
      "background: var(--comp-icon-button-badge-bg)",
      "border: var(--comp-icon-button-badge-border)",
      "border-radius: var(--comp-icon-button-badge-radius)",
      "position: var(--comp-icon-button-badge-position)",
      "pointer-events: var(--comp-icon-button-badge-pointer-events)",
    ],
    message: "IconButton badge must consume badge aliases.",
  });
}

module.exports = { checkIconButtonCssContract };
