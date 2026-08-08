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
  const itemDangerBlock = blockFor(blocks, selectorKey, ".menu__item[data-tone=\"danger\"]");
  const itemDisabledBlock = blockFor(blocks, selectorKey, ".menu__item:disabled");
  const iconBlock = blockFor(blocks, selectorKey, ".menu__item-icon");
  const shortcutBlock = blockFor(blocks, selectorKey, ".menu__item-shortcut");
  const separatorBlock = blockFor(blocks, selectorKey, ".menu__separator");

  if (/\.dialog__panel,\s*\.drawer__panel,\s*\.menu__panel,/m.test(text)) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf(".menu__panel,")), "Menu panel must not live in the shared Dialog/Drawer/Table frame block.");
  }
  const rawPanelMinInline = text.match(/--comp-menu-panel-min-inline:\s*[0-9.]+rem/);
  if (rawPanelMinInline) {
    add("errors", packageCssFile, lineNumber(text, rawPanelMinInline.index), "Menu panel min inline size must flow through Frame menu content roles instead of local rem values.");
  }

  requireIncludes({
    block: rootBlock,
    text,
    packageCssFile,
    snippets: [
      "--comp-menu-panel-bg: var(--sys-color-surface)",
      "--comp-menu-panel-border-width: var(--component-border-width)",
      "--comp-menu-panel-depth: var(--component-depth-popover)",
      "--comp-menu-panel-min-inline: var(--component-menu-panel-min-inline-md)",
      "--comp-menu-item-font-size: var(--component-font-size-label)",
      "--comp-menu-enter-ease: var(--component-ease-enter)",
      "--comp-menu-item-transition:",
    ],
    message: "Menu root must own panel, item, voice, density, and motion aliases.",
  });
  requireIncludes({
    block: panelBlock,
    text,
    packageCssFile,
    snippets: [
      "animation: menu-enter var(--comp-menu-enter-duration) var(--comp-menu-enter-ease) both",
      "background: var(--comp-menu-panel-bg)",
      "border: var(--comp-menu-panel-border-width) solid var(--comp-menu-panel-border)",
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
      "color: var(--comp-menu-item-fg)",
      "font-family: var(--comp-menu-item-font-family)",
      "min-block-size: var(--comp-menu-item-height)",
      "transition: var(--comp-menu-item-transition)",
    ],
    message: "Menu items must consume Menu item frame, voice, density, and motion aliases.",
  });
  requireIncludes({
    block: itemHoverBlock,
    text,
    packageCssFile,
    snippets: ["transform: var(--comp-menu-item-hover-transform)"],
    message: "Menu item hover motion must consume the Menu motion alias.",
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
    snippets: ["color: var(--comp-menu-item-disabled-fg)", "opacity: var(--comp-menu-item-disabled-opacity)"],
    message: "Menu disabled item must consume Menu disabled aliases.",
  });
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
