const materialSymbolAliases = Object.freeze({
  menu_open: "keyboard_arrow_down",
  toast: "notifications",
});

type MaterialSymbolAlias = keyof typeof materialSymbolAliases;

function hasMaterialSymbolAlias(name: string): name is MaterialSymbolAlias {
  return Object.prototype.hasOwnProperty.call(materialSymbolAliases, name);
}

export function iconGlyph(name = ""): string {
  return hasMaterialSymbolAlias(name) ? materialSymbolAliases[name] : name;
}

export function setIconGlyph<T extends HTMLElement | null | undefined>(node: T, name = ""): T {
  if (!node) return node;
  node.textContent = iconGlyph(name);
  return node;
}
