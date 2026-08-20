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
  const sourceRoot = root || process.cwd();
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/FloatingActionButton.tsx");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : path.join(sourceRoot, "packages/react/src/FloatingActionButton.js");
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const rootBlock = blockFor(blocks, selectorKey, ".fab");
  const smBlock = blockFor(blocks, selectorKey, ".fab[data-density=\"sm\"]");
  const lgBlock = blockFor(blocks, selectorKey, ".fab[data-density=\"lg\"]");
  const secondaryBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"secondary\"]");
  const tertiaryBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"tertiary\"]");
  const outlinedBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"outlined\"]");
  const ghostBlock = blockFor(blocks, selectorKey, ".fab[data-variant=\"ghost\"]");
  const dangerBlock = blockFor(blocks, selectorKey, ".fab[data-intent=\"danger\"]");
  const warningBlock = blockFor(blocks, selectorKey, ".fab[data-intent=\"warning\"]");
  const dangerSecondaryBlock = blockFor(blocks, selectorKey, ".fab[data-intent=\"danger\"][data-variant=\"secondary\"]");
  const dangerOutlinedBlock = blockFor(blocks, selectorKey, ".fab[data-intent=\"danger\"][data-variant=\"outlined\"]");
  const warningSecondaryBlock = blockFor(blocks, selectorKey, ".fab[data-intent=\"warning\"][data-variant=\"secondary\"]");
  const warningOutlinedBlock = blockFor(blocks, selectorKey, ".fab[data-intent=\"warning\"][data-variant=\"outlined\"]");
  const hoverBlock = blockFor(blocks, selectorKey, ".fab:hover:not(:disabled)");
  const activeBlock = blockFor(blocks, selectorKey, ".fab:active:not(:disabled)");
  const stateHoverBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"hover\"]:not(:disabled)");
  const statePressedBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"pressed\"]:not(:disabled)");
  const collapsedBlock = blockFor(blocks, selectorKey, ".fab[data-extended=\"false\"]");
  const iconBlock = blockFor(blocks, selectorKey, ".fab__icon");
  const focusBlock = blockFor(blocks, selectorKey, ".fab:focus-visible");
  const stateFocusBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"focus\"]");
  const disabledBlock = blockFor(blocks, selectorKey, ".fab:disabled:not([data-state=\"loading\"])");
  const loadingBlock = blockFor(blocks, selectorKey, ".fab[data-state=\"loading\"]");

  if (
    !source.includes("forwardRef") ||
    !source.includes("floatingActionButtonPlatformContract") ||
    !source.includes("flowVariantProps(resolvedVariant)") ||
    !source.includes("flowStateProps(resolvedState)") ||
    !source.includes("flowDensityProps(resolvedDensity)")
  ) {
    add("errors", sourceFile, 1, "FloatingActionButton must expose a real React ref contract, platform contract, variant, state, and density props.");
  }
  if (!/if\s*\(!resolvedLabel\)\s*return null;/.test(source) || !source.includes("\"aria-label\": resolvedLabel")) {
    add("errors", sourceFile, 1, "FloatingActionButton must not render without an accessible label.");
  }
  if (!source.includes("const canInteract = Boolean(rest.onClick || resolvedType === \"submit\" || resolvedType === \"reset\");") || !source.includes("disabled: resolvedState === \"disabled\" || resolvedState === \"loading\" || !canInteract")) {
    add("errors", sourceFile, 1, "FloatingActionButton must keep inert and loading actions disabled.");
  }
  if (!source.includes("export type FloatingActionButtonVariant = \"primary\" | \"secondary\" | \"tertiary\" | \"outlined\" | \"ghost\"") || source.includes("\"extended\" | \"mini\"")) {
    add("errors", sourceFile, 1, "FloatingActionButton variant must describe action hierarchy only; extended label treatment is owned by the extended prop.");
  }
  if (!source.includes("export type FloatingActionButtonIntent = \"default\" | \"danger\" | \"warning\"") || !source.includes("\"data-intent\": resolvedIntent")) {
    add("errors", sourceFile, 1, "FloatingActionButton must expose default, danger, and warning action intents through data-intent.");
  }
  if (!source.includes("React.createElement(Spinner") || !source.includes("decorative: true")) {
    add("errors", sourceFile, 1, "FloatingActionButton loading state must compose Spinner through React.");
  }
  if (text.includes("--fab-size") || text.includes("--fab-icon-size") || text.includes("--fab-padding")) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf("--fab-")), "FloatingActionButton must not use short local --fab-* aliases; use the component token namespace.");
  }
  for (const block of [rootBlock, secondaryBlock, tertiaryBlock, outlinedBlock, ghostBlock, dangerBlock, warningBlock, dangerSecondaryBlock, dangerOutlinedBlock, warningSecondaryBlock, warningOutlinedBlock].filter(Boolean)) {
    if (block.body.includes("--comp-button-")) {
      add("errors", packageCssFile, lineNumber(text, block.index), "FloatingActionButton must not consume Button-local --comp-button-* aliases; use shared component roles or FAB aliases.");
    }
  }
  for (const [snippet, message] of [
    ["--component-fab-size-lg: var(--sys-space-16);", "FloatingActionButton large frame must stay on the 64px system space scale."],
    ["--comp-floating-action-button-icon-size-sm: var(--component-density-icon-size-sm);", "FloatingActionButton sm icon must consume density icon sm."],
    ["--comp-floating-action-button-icon-size-md: var(--component-density-icon-size-md);", "FloatingActionButton md icon must consume density icon md."],
    ["--comp-floating-action-button-icon-size-lg: var(--component-density-icon-size-lg);", "FloatingActionButton lg icon must consume density icon lg."],
    ["--comp-floating-action-button-bg: var(--component-action-bg-primary);", "FloatingActionButton default background must consume shared action appearance roles."],
    ["--comp-floating-action-button-bg-hover: var(--component-action-bg-primary-hover);", "FloatingActionButton default hover must consume shared action appearance roles."],
    ["--comp-floating-action-button-border-color: var(--component-action-border-ghost);", "FloatingActionButton border color must declare a named default component role."],
    ["--comp-floating-action-button-text: var(--component-action-fg-primary);", "FloatingActionButton foreground must consume shared action appearance roles."],
    ["--comp-floating-action-button-disabled-bg: var(--component-disabled-bg);", "FloatingActionButton disabled state must consume shared disabled background."],
    ["--comp-floating-action-button-disabled-text: var(--component-disabled-text);", "FloatingActionButton disabled state must consume shared disabled text."],
  ]) {
    if (!text.includes(snippet)) add("errors", packageCssFile, 1, message);
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-floating-action-button-align: var(--component-align-center)",
      "--comp-floating-action-button-size: var(--comp-floating-action-button-size-md)",
      "--comp-floating-action-button-icon-size: var(--comp-floating-action-button-icon-size-md)",
      "--comp-floating-action-button-padding-x: var(--comp-floating-action-button-padding-x-md)",
      "--comp-floating-action-button-border: var(--component-border-none)",
      "--comp-floating-action-button-cursor: var(--component-cursor-pointer)",
      "--comp-floating-action-button-transition:",
      "--comp-floating-action-button-disabled-cursor: var(--component-cursor-not-allowed)",
      "align-items: var(--comp-floating-action-button-align)",
      "border: var(--comp-floating-action-button-border)",
      "border-color: var(--comp-floating-action-button-border-color)",
      "block-size: var(--comp-floating-action-button-size)",
      "box-sizing: border-box",
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
  for (const [block, variant] of [
    [secondaryBlock, "secondary"],
    [tertiaryBlock, "tertiary"],
    [outlinedBlock, "outlined"],
    [ghostBlock, "ghost"],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-floating-action-button-bg:",
        "--comp-floating-action-button-bg-hover:",
        "--comp-floating-action-button-bg-pressed:",
        "--comp-floating-action-button-border:",
        "--comp-floating-action-button-text:",
      ],
      message: `FloatingActionButton ${variant} variant must consume action hierarchy aliases.`,
    });
  }
  for (const [block, intent] of [
    [dangerBlock, "danger"],
    [warningBlock, "warning"],
  ]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-floating-action-button-bg:",
        "--comp-floating-action-button-bg-hover:",
        "--comp-floating-action-button-bg-pressed:",
        "--comp-floating-action-button-text:",
      ],
      message: `FloatingActionButton ${intent} intent must consume action intent aliases.`,
    });
  }
  for (const [block, variant] of [[dangerSecondaryBlock, "secondary"], [dangerOutlinedBlock, "outlined"]]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-floating-action-button-bg: var(--component-action-bg-danger-secondary)",
        "--comp-floating-action-button-border-color: var(--component-action-border-danger-secondary)",
        "--comp-floating-action-button-text: var(--component-action-fg-danger-secondary)",
      ],
      message: `FloatingActionButton ${variant} danger intent must stay surface-based instead of solid danger.`,
    });
  }
  for (const [block, variant] of [[warningSecondaryBlock, "secondary"], [warningOutlinedBlock, "outlined"]]) {
    requireIncludes({
      block,
      text,
      packageCssFile,
      snippets: [
        "--comp-floating-action-button-bg: var(--component-action-bg-warning-secondary)",
        "--comp-floating-action-button-border-color: var(--component-action-border-warning-secondary)",
        "--comp-floating-action-button-text: var(--component-action-fg-warning-secondary)",
      ],
      message: `FloatingActionButton ${variant} warning intent must stay surface-based instead of solid warning.`,
    });
  }
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
    block: activeBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-floating-action-button-bg-pressed)",
      "transform: var(--comp-floating-action-button-active-transform)",
    ],
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
    snippets: [
      "background: var(--comp-floating-action-button-bg-pressed)",
      "transform: var(--comp-floating-action-button-press-transform)",
    ],
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
      "background: var(--comp-floating-action-button-disabled-bg)",
      "border: var(--component-border-width) solid var(--comp-floating-action-button-disabled-border)",
      "box-shadow: var(--comp-floating-action-button-disabled-shadow)",
      "color: var(--comp-floating-action-button-disabled-text)",
      "cursor: var(--comp-floating-action-button-disabled-cursor)",
      "opacity: var(--comp-floating-action-button-disabled-opacity)",
    ],
    message: "FloatingActionButton disabled state must consume disabled aliases.",
  });
  requireIncludes({
    block: loadingBlock,
    text,
    packageCssFile,
    snippets: ["cursor: var(--component-loading-busy-cursor)"],
    message: "FloatingActionButton loading state must keep busy cursor distinct from disabled styling.",
  });
}

module.exports = { checkFloatingActionButtonCssContract };
