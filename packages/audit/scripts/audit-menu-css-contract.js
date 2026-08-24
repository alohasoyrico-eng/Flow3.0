const { add, lineNumber } = require("./audit-context.js");

function blockFor(blocks, selectorKey, selector) {
  return blocks.find((block) => selectorKey(block) === selector);
}

function requireIncludes({ block, text, packageCssFile, snippets, message }) {
  if (block && snippets.every((snippet) => block.body.includes(snippet))) return;
  add("errors", packageCssFile, block ? lineNumber(text, block.index) : 1, message);
}

function checkMenuCssContract({ text, blocks, packageCssFile, selectorKey }) {
  const rootBlock = blockFor(blocks, selectorKey, ".menu");
  const panelBlock = blockFor(blocks, selectorKey, ".menu__panel");
  const avatarTriggerBlock = blockFor(blocks, selectorKey, ".menu__trigger--avatar");
  const avatarTriggerFocusBlock = blockFor(blocks, selectorKey, ".menu__trigger--avatar:focus-visible");
  const itemBlock = blockFor(blocks, selectorKey, ".menu__item");
  const itemHoverBlock = blockFor(blocks, selectorKey, ".menu__item:hover");
  const itemFocusBlock = blockFor(blocks, selectorKey, ".menu__item:focus-visible");
  const itemActiveBlock = blockFor(blocks, selectorKey, ".menu__item[data-active=\"true\"]");
  const itemDangerBlock = blockFor(blocks, selectorKey, ".menu__item[data-tone=\"danger\"]");
  const itemDisabledBlock = blockFor(blocks, selectorKey, ".menu__item:disabled");
  const iconBlock = blockFor(blocks, selectorKey, ".menu__item-icon");
  const shortcutBlock = blockFor(blocks, selectorKey, ".menu__item-shortcut");
  const separatorBlock = blockFor(blocks, selectorKey, ".menu__separator");

  for (const snippet of [
    "--component-overlay-panel-bg: var(--component-color-surface);",
    "--component-overlay-panel-border: var(--component-color-border);",
    "--component-overlay-panel-depth: var(--component-depth-popover);",
    "--component-overlay-panel-offset: var(--component-space-xs);",
    "--component-overlay-panel-radius: var(--component-control-frame-radius-field);",
    "--component-overlay-panel-z-index: var(--component-z-overlay);",
    "--component-listbox-bg: var(--component-overlay-panel-bg);",
    "--component-listbox-border: var(--component-overlay-panel-border);",
    "--component-listbox-depth: var(--component-overlay-panel-depth);",
    "--component-listbox-offset: var(--component-overlay-panel-offset);",
    "--component-listbox-radius: var(--component-overlay-panel-radius);",
  ]) {
    if (!text.includes(snippet)) {
      add("errors", packageCssFile, 1, `Menu/Listbox overlay panel geometry must stay centralized: missing ${snippet}`);
    }
  }

  if (/\.dialog__panel,\s*\.drawer__panel,\s*\.menu__panel,/m.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".menu__panel,")), "Menu panel must not live in the shared Dialog/Drawer/Table frame block.");
  }
  const rawPanelMinInline = text.match(/--comp-menu-panel-min-inline:\s*[0-9.]+rem/);
  if (rawPanelMinInline) {
    add("errors", packageCssFile, lineNumber(text, rawPanelMinInline.index), "Menu panel min inline size must flow through Frame menu content roles instead of local rem values.");
  }
  const rawHoverNudge = text.match(/--comp-menu-item-hover-transform:\s*translateX\([^;]*[0-9]/);
  if (rawHoverNudge) {
    add("errors", packageCssFile, lineNumber(text, rawHoverNudge.index), "Menu hover nudge must flow through component Momentum transform roles instead of local translate values.");
  }
  const rawItemHeight = text.match(/--comp-menu-item-height:\s*calc\(var\(--component-control-min-size\)[^;]+/);
  if (rawItemHeight) {
    add("errors", packageCssFile, lineNumber(text, rawItemHeight.index), "Menu item height must flow through shared Frame option roles instead of local control-size calculations.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-menu-panel-bg: var(--component-listbox-bg)",
      "--comp-menu-panel-border-width: var(--component-border-width)",
      "--comp-menu-panel-border: var(--component-listbox-border)",
      "--comp-menu-panel-depth: var(--component-listbox-depth)",
      "--comp-menu-panel-min-inline: var(--component-menu-panel-min-inline-md)",
      "--comp-menu-panel-padding: var(--component-listbox-padding)",
      "--comp-menu-panel-radius: var(--component-listbox-radius)",
      "--comp-menu-panel-z-index: var(--component-overlay-panel-z-index)",
      "--comp-menu-panel-gap: var(--component-listbox-gap)",
      "--comp-menu-item-fg: var(--component-option-row-color)",
      "--comp-menu-item-height-sm: var(--component-option-row-min-block-size-sm)",
      "--comp-menu-item-height-md: var(--component-option-row-min-block-size-md)",
      "--comp-menu-item-height-lg: var(--component-option-row-min-block-size-lg)",
      "--comp-menu-item-height: var(--comp-menu-item-height-md)",
      "--comp-menu-item-padding-x-sm: var(--component-option-row-padding-inline-sm)",
      "--comp-menu-item-padding-x-md: var(--component-option-row-padding-inline-md)",
      "--comp-menu-item-padding-x-lg: var(--component-option-row-padding-inline-lg)",
      "--comp-menu-item-padding-x: var(--comp-menu-item-padding-x-md)",
      "--comp-menu-item-radius: var(--component-option-row-radius)",
      "--comp-menu-item-active-ring: var(--component-option-row-active-ring)",
      "--comp-menu-item-disabled-bg: var(--component-option-row-disabled-bg)",
      "--comp-menu-item-disabled-fg: var(--component-option-row-disabled-color)",
      "--comp-menu-item-disabled-opacity: var(--component-option-row-disabled-opacity)",
      "--comp-menu-item-font-size: var(--component-font-size-label)",
      "--comp-menu-item-hover-transform: var(--component-transform-inline-nudge)",
      "--comp-menu-inline-size: var(--component-inline-size-fit-content)",
      "--comp-menu-max-inline-size: var(--component-inline-size-full)",
      "--comp-menu-justify-items: var(--component-justify-items-start)",
      "--comp-menu-position: var(--component-position-relative)",
      "--comp-menu-enter-ease: var(--component-ease-enter)",
      "--comp-menu-item-transition:",
      "inline-size: var(--comp-menu-inline-size)",
      "justify-items: var(--comp-menu-justify-items)",
      "max-inline-size: var(--comp-menu-max-inline-size)",
      "position: var(--comp-menu-position)",
    ],
    message: "Menu root must own panel, item, voice, density, motion, and anchored trigger layout aliases.",
  });
  requireIncludes({
    block: panelBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: menu-enter var(--comp-menu-enter-duration) var(--comp-menu-enter-ease) both",
      "background: var(--comp-menu-panel-bg)",
      "border: var(--comp-menu-panel-border-width) solid var(--comp-menu-panel-border)",
      "box-sizing: border-box",
      "box-shadow: var(--comp-menu-panel-depth)",
      "color: var(--comp-menu-panel-fg)",
      "z-index: var(--comp-menu-panel-z-index)",
    ],
    message: "Menu panel must consume Menu frame, surface, depth, z-index, and motion aliases.",
  });
  requireIncludes({
    block: avatarTriggerBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-menu-trigger-avatar-bg)",
      "border: var(--comp-menu-trigger-avatar-border-width) solid var(--comp-menu-trigger-avatar-border)",
      "min-block-size: var(--comp-menu-trigger-avatar-size)",
    ],
    message: "Menu avatar trigger must consume Menu trigger aliases instead of raw foundation tokens.",
  });
  requireIncludes({
    block: avatarTriggerFocusBlock,
    text,
    packageCssFile,
    snippets: ["outline: var(--comp-menu-focus-ring)", "outline-offset: var(--comp-menu-focus-ring-offset)"],
    message: "Menu avatar trigger focus must consume Menu focus aliases.",
  });
  requireIncludes({
    block: itemBlock,
    text,
    packageCssFile,
    snippets: [
      "background: var(--comp-menu-item-bg)",
      "box-sizing: border-box",
      "color: var(--comp-menu-item-fg)",
      "font-family: var(--comp-menu-item-font-family)",
      "min-block-size: var(--comp-menu-item-height)",
      "transition: var(--comp-menu-item-transition)",
    ],
    message: "Menu items must consume Menu item frame, voice, density, and motion aliases.",
  });
  for (const [selector, snippets, message] of [
    [
      ".menu[data-density=\"sm\"]",
      ["--comp-menu-item-height: var(--comp-menu-item-height-sm)", "--comp-menu-item-padding-x: var(--comp-menu-item-padding-x-sm)"],
      "Menu small density must scale item row geometry through shared option-row aliases.",
    ],
    [
      ".menu[data-density=\"lg\"]",
      ["--comp-menu-item-height: var(--comp-menu-item-height-lg)", "--comp-menu-item-padding-x: var(--comp-menu-item-padding-x-lg)"],
      "Menu large density must scale item row geometry through shared option-row aliases.",
    ],
  ]) {
    requireIncludes({ block: blockFor(blocks, selectorKey, selector), text, packageCssFile, snippets, message });
  }
  requireIncludes({
    block: itemHoverBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-menu-item-hover-transform)"],
    message: "Menu item hover motion must consume the Menu motion alias.",
  });
  requireIncludes({
    block: itemFocusBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--component-focus-ring-width) solid var(--comp-menu-item-active-ring)",
      "outline-offset: calc(var(--component-focus-ring-offset) * -1)",
    ],
    message: "Menu item focus must consume the shared option-row active ring instead of leaking the global button focus outline.",
  });
  requireIncludes({
    block: itemActiveBlock,
    text,
    packageCssFile,
    snippets: [
      "outline: var(--component-focus-ring-width) solid var(--comp-menu-item-active-ring)",
      "outline-offset: calc(var(--component-focus-ring-offset) * -1)",
    ],
    message: "Menu item active keyboard state must consume the same shared option-row active ring as focus-visible.",
  });
  requireIncludes({
    block: itemDangerBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-menu-item-danger-fg)"],
    message: "Menu danger item must consume the Menu tone alias.",
  });
  requireIncludes({
    block: itemDisabledBlock,
    text,
    packageCssFile,
    snippets: ["background: var(--comp-menu-item-disabled-bg)", "color: var(--comp-menu-item-disabled-fg)", "opacity: var(--comp-menu-item-disabled-opacity)"],
    message: "Menu disabled item must consume Menu disabled aliases.",
  });
  if (!text.includes("--component-option-row-disabled-opacity: var(--component-opacity-visible)")) {
    add("errors", packageCssFile, 1, "Shared option-row disabled state must remain legible; do not dim menu/listbox items through opacity-only affordances.");
  }
  requireIncludes({
    block: iconBlock,
    text,
    packageCssFile,
    snippets: ["font-family: var(--comp-menu-item-icon-family)", "font-size: var(--comp-menu-item-icon-size)"],
    message: "Menu item icon must consume Menu icon aliases.",
  });
  requireIncludes({
    block: shortcutBlock,
    text,
    packageCssFile,
    snippets: ["color: var(--comp-menu-item-shortcut-fg)", "font-size: var(--comp-menu-item-shortcut-font-size)"],
    message: "Menu shortcut must consume Menu shortcut aliases.",
  });
  requireIncludes({
    block: separatorBlock,
    text,
    packageCssFile,
    snippets: ["border-block-start: var(--comp-menu-panel-border-width) solid var(--comp-menu-separator-border)"],
    message: "Menu separator must consume Menu separator aliases.",
  });
}

module.exports = { checkMenuCssContract };
