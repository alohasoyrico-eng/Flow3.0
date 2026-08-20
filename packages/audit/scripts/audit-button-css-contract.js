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

function checkButtonCssContract({ text, blocks, packageCssFile, selectorKey, root }) {
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/Button.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/Button.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".button");
  const smBlock = blockFor(blocks, selectorKey, ".button[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".button[data-density=\"lg\"]");
  const fullWidthBlock = blockFor(blocks, selectorKey, ".button[data-full-width=\"true\"]");
  const focusBlock = blockFor(blocks, selectorKey, ".button:focus-visible");
  const hoverBlock = blockFor(blocks, selectorKey, ".button:hover:not(:disabled)");
  const activeBlock = blockFor(blocks, selectorKey, ".button:active:not(:disabled)");
  const disabledBlock = blockFor(blocks, selectorKey, ".button:disabled:not([data-state=\"loading\"])");
  const loadingBlock = blockFor(blocks, selectorKey, ".button[data-state=\"loading\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".button__icon");
  const spinnerBlock = blockFor(blocks, selectorKey, ".button .spinner");
  const pressedBlock = blockFor(blocks, selectorKey, ".button[data-state=\"pressed\"]:not(:disabled)");

  if (
    !source.includes("forwardRef") ||
    !source.includes("buttonPlatformContract") ||
    !source.includes("flowDensityProps(") ||
    !source.includes("flowStateProps(resolvedState)")
  ) {
    add("errors", sourceFile, 1, "Button must expose a real React ref contract, platform contract, density, and state props.");
  }
  if (!source.includes("if (!buttonLabel) return null;") || !source.includes("React.createElement(Spinner") || !source.includes("decorative: true")) {
    add("errors", sourceFile, 1, "Button must avoid empty buttons and compose Spinner through React for loading.");
  }
  if (!source.includes("disabled: resolvedState === \"disabled\" || resolvedState === \"loading\"") || !source.includes("\"aria-busy\": resolvedState === \"loading\" ? \"true\" : undefined")) {
    add("errors", sourceFile, 1, "Button must keep disabled/loading semantics in React.");
  }
  if (text.includes("--button-current-")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--button-current-")), "Button must not use short --button-current-* aliases; density belongs in the component namespace.");
  }
  if (text.includes("--comp-button-size-md: var(--component-control-min-size);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--comp-button-size-md: var(--component-control-min-size);")), "Button density sizes must route through --component-button-size-* aliases, not the global control size directly.");
  }
  if (!text.includes("--comp-button-size-md: var(--component-button-size-md);")) {
    add("errors", packageCssFile, 1, "Button medium size must consume --component-button-size-md.");
  }
  if (text.includes("--component-button-size-md: var(--component-density-control-height);") || text.includes("--comp-button-size: var(--component-density-control-height);")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--component-button-size-md: var(--component-density-control-height);") >= 0 ? text.indexOf("--component-button-size-md: var(--component-density-control-height);") : text.indexOf("--comp-button-size: var(--component-density-control-height);")), "Button medium geometry must not fall back to the global density control height; md must be the Button-owned 44px scale.");
  }
  for (const snippet of [
    "--component-control-frame-radius-action: var(--component-radius-pill);",
    "--component-button-size-sm: var(--component-control-frame-size-sm);",
    "--component-button-size-md: var(--component-control-frame-size-md);",
    "--component-button-size-lg: var(--component-control-frame-size-lg);",
    "--comp-button-size: var(--component-button-size-md);",
    "--comp-button-padding-sm: var(--component-control-frame-padding-action-sm);",
    "--comp-button-padding-md: var(--component-control-frame-padding-action-md);",
    "--comp-button-padding-lg: var(--component-control-frame-padding-action-lg);",
    "--comp-button-padding: var(--comp-button-padding-md);",
    "--comp-button-font-size-sm: var(--component-control-frame-font-size-sm);",
    "--comp-button-font-size-md: var(--component-control-frame-font-size-md);",
    "--comp-button-font-size-lg: var(--component-control-frame-font-size-lg);",
    "--comp-button-radius: var(--component-control-frame-radius-action);",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, `Button density must keep monotonic sm/md/lg geometry through Flow tokens: missing ${snippet}`);
    }
  }
  for (const [token, requiredPrefix] of [
    ["--comp-button-bg-danger-hover", "var(--component-tone-danger-"],
    ["--comp-button-bg-danger-pressed", "var(--component-tone-danger-"],
    ["--comp-button-bg-warning-hover", "var(--component-tone-warning-"],
    ["--comp-button-bg-warning-pressed", "var(--component-tone-warning-"],
    ["--comp-button-bg-danger-secondary-hover", "var(--component-tone-danger-"],
    ["--comp-button-bg-danger-secondary-pressed", "var(--component-tone-danger-"],
  ]) {
    const match = text.match(new RegExp(`${token}:\\s*([^;]+);`));
    if (!match || !match[1].trim().startsWith(requiredPrefix)) {
      add("errors", packageCssFile, match ? lineNumber(text, match.index) : 1, `${token} must stay inside its semantic tone family instead of falling back to action/blue tokens.`);
    }
  }
  const loadingStateBlock = blockFor(blocks, selectorKey, ".button[data-state=\"loading\"]");
  const loadingUsesDisabledVisualAlias = loadingStateBlock && /--comp-button-disabled-|background:\s*var\(--comp-button-disabled-|color:\s*var\(--comp-button-disabled-/.test(loadingStateBlock.body);
  if (loadingUsesDisabledVisualAlias) {
    add("errors", packageCssFile, lineNumber(text, loadingStateBlock.index), "Button loading/busy state must not reuse disabled visual aliases.");
  }
  if (blockFor(blocks, selectorKey, ".button:focus-visible,.icon-button:focus-visible,.text-area:focus-visible")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".button:focus-visible")), "Button focus must not share a CSS block with IconButton or TextArea.");
  }
  if (blockFor(blocks, selectorKey, ".button:disabled,.icon-button:disabled")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".button:disabled")), "Button disabled state must not share a CSS block with IconButton.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-button-current-size: var(--comp-button-size)",
      "--comp-button-current-padding: var(--comp-button-padding)",
      "--comp-button-current-icon-size: var(--comp-button-icon-size)",
      "--comp-button-current-font-size: var(--comp-button-font-size)",
      "--comp-button-border: var(--component-border-width) solid var(--comp-button-border-color)",
      "--comp-button-focus-ring: var(--component-focus-ring)",
      "--comp-button-disabled-opacity: var(--component-disabled-readable-opacity)",
      "--comp-button-transition:",
      "align-items: var(--comp-button-align)",
      "border: var(--comp-button-border)",
      "border-radius: var(--comp-button-radius)",
      "cursor: var(--comp-button-cursor)",
      "display: var(--comp-button-display)",
      "font-size: var(--comp-button-current-font-size)",
      "font-weight: var(--comp-button-font-weight)",
      "gap: var(--comp-button-gap)",
      "block-size: var(--comp-button-current-size)",
      "min-block-size: var(--comp-button-current-size)",
      "min-height: var(--comp-button-current-size)",
      "padding: 0 var(--comp-button-current-padding)",
      "transition: var(--comp-button-transition)",
    ],
    message: "Button root must own and consume aliases for density, frame, voice, layout, focus, disabled, variants, and motion.",
  });
  for (const [block, message] of [
    [smBlock, "Button small density must set component current size, padding, icon, and font aliases."],
    [lgBlock, "Button large density must set component current size, padding, icon, and font aliases."],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-button-current-size:",
        "--comp-button-current-padding:",
        "--comp-button-current-icon-size:",
        "--comp-button-current-font-size:",
      ],
      message,
    });
  }
  requireIncludes({
    block: fullWidthBlock,
    text,
    packageCssFile,
    snippets: ["inline-size: var(--comp-button-full-width)"],
    message: "Button full-width state must consume width alias.",
  });
  requireIncludes({
    block: focusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-button-focus-ring)", "outline-offset: var(--comp-button-focus-offset)"],
    message: "Button focus-visible state must consume Button accessibility aliases.",
  });
  requireIncludes({
    block: hoverBlock,
    text,
    packageCssFile,
    snippets: ["box-shadow: var(--comp-button-hover-shadow)", "transform: var(--comp-button-hover-transform)"],
    message: "Button hover state must consume Button depth and motion aliases.",
  });
  requireIncludes({
    block: activeBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-button-press-transform)"],
    message: "Button active state must consume Button press alias.",
  });
  requireIncludes({
    block: pressedBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-button-press-transform)"],
    message: "Button forced pressed state must consume Button press alias.",
  });
  requireIncludes({
    block: disabledBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-button-disabled-bg)",
      "border-color: var(--comp-button-disabled-border)",
      "color: var(--comp-button-disabled-fg)",
      "cursor: var(--comp-button-disabled-cursor)",
      "opacity: var(--comp-button-disabled-opacity)",
    ],
    message: "Button disabled state must consume Button disabled aliases.",
  });
  requireIncludes({
    block: loadingBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--component-loading-busy-cursor)"],
    message: "Button loading state must keep busy affordance separate from disabled visual aliases.",
  });
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-button-icon-color)", "font-size: var(--comp-button-current-icon-size)"],
    message: "Button icon must consume Button icon aliases.",
  });
  requireIncludes({
    block: spinnerBlock,
    text,
    packageCssFile,
    snippets: ["--comp-spinner-tone: var(--comp-button-spinner-tone)"],
    message: "Button loading spinner must inherit tone through Button alias.",
  });

  for (const [selector, snippets, message] of [
    [".button--primary", ["background: var(--comp-button-bg-primary)", "color: var(--comp-button-fg-primary)"], "Button primary variant must consume primary aliases."],
    [".button--primary:hover:not(:disabled)", ["background: var(--comp-button-bg-primary-hover)"], "Button primary hover must consume primary hover alias."],
    [".button--secondary", ["background: var(--comp-button-bg-secondary)", "border-color: var(--comp-button-border-secondary)", "color: var(--comp-button-fg-secondary)"], "Button secondary variant must consume secondary aliases."],
    [".button--secondary:hover:not(:disabled)", ["background: var(--comp-button-bg-secondary-hover)", "border-color: var(--comp-button-border-secondary-hover)"], "Button secondary hover must consume secondary hover aliases."],
    [".button--danger", ["background: var(--comp-button-bg-danger)", "color: var(--comp-button-fg-danger)"], "Button danger variant must consume danger aliases."],
    [".button--tertiary", ["background: var(--comp-button-bg-tertiary)", "border-color: var(--comp-button-border-tertiary)", "color: var(--comp-button-fg-tertiary)"], "Button tertiary variant must consume tertiary aliases."],
    [".button--tertiary:hover:not(:disabled)", ["background: var(--comp-button-bg-tertiary-hover)", "border-color: var(--comp-button-border-tertiary-hover)"], "Button tertiary hover must consume tertiary hover aliases."],
    [".button--outlined", ["background: var(--comp-button-bg-outlined)", "border-color: var(--comp-button-border-outlined)", "color: var(--comp-button-fg-outlined)"], "Button outlined variant must consume outlined aliases."],
    [".button--outlined:hover:not(:disabled)", ["border-color: var(--comp-button-border-outlined-hover)"], "Button outlined hover must consume outlined hover alias."],
    [".button--ghost", ["background: var(--comp-button-bg-ghost)", "border-color: var(--comp-button-border-ghost)", "color: var(--comp-button-fg-ghost)"], "Button ghost variant must consume ghost aliases."],
    [".button--ghost:hover:not(:disabled)", ["background: var(--comp-button-bg-ghost-hover)"], "Button ghost hover must consume ghost hover alias."],
    [".button--warning", ["background: var(--comp-button-bg-warning)", "color: var(--comp-button-fg-warning)"], "Button warning variant must consume warning aliases."],
    [".button--danger.button--secondary,.button--danger.button--outlined", ["background: var(--comp-button-bg-danger-secondary)", "border-color: var(--comp-button-border-danger-secondary)", "color: var(--comp-button-fg-danger-secondary)"], "Button danger secondary/outlined intent must consume danger outline aliases."],
  ]) {
    requireIncludes({ block: blockFor(blocks, selectorKey, selector), text, packageCssFile, snippets, message });
  }
}

module.exports = { checkButtonCssContract };
