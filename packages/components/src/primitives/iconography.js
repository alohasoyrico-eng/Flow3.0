const materialSymbolAliases = Object.freeze({
    menu_open: "keyboard_arrow_down",
    toast: "notifications",
});
function hasMaterialSymbolAlias(name) {
    return Object.prototype.hasOwnProperty.call(materialSymbolAliases, name);
}
export function iconGlyph(name = "") {
    return hasMaterialSymbolAlias(name) ? materialSymbolAliases[name] : name;
}
export function setIconGlyph(node, name = "") {
    if (!node)
        return node;
    node.textContent = iconGlyph(name);
    return node;
}
