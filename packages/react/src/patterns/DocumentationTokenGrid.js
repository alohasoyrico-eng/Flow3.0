import React, { forwardRef } from "react";
import { CodeBlock } from "../CodeBlock.js";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
const validVariants = new Set(["tokens", "values", "compact"]);
function resolveVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "tokens";
}
function normalizeItems(items) {
    return (Array.isArray(items) ? items : [])
        .map((item, index) => typeof item === "string" ? { key: `token-${index}`, token: item } : item)
        .filter((item) => Boolean(item?.token));
}
export const DocumentationTokenGrid = forwardRef(function DocumentationTokenGrid({ items, label = "Token reference", variant = "tokens", density, className = "", surface, ...rest }, ref) {
    const resolvedVariant = resolveVariant(variant);
    const normalizedItems = normalizeItems(items);
    if (!normalizedItems.length)
        return null;
    return React.createElement(Surface, {
        ...surface,
        ...flowRestProps(rest),
        ref,
        className: ["documentation-token-grid", className].filter(Boolean).join(" "),
        surfaceRole: "section",
        density,
        elevation: surface?.elevation ?? "none",
        tone: surface?.tone ?? "default",
        state: "default",
        "aria-label": rest["aria-label"] ?? label,
        "data-flow-pattern": "documentation-token-grid",
        "data-documentation-token-grid-variant": resolvedVariant,
        "data-doc-primitive": "reference-token-grid",
    }, normalizedItems.map((item, index) => React.createElement(CodeBlock, {
        key: item.key ?? item.token ?? `token-${index}`,
        code: item.token,
        label: item.label,
        helper: item.helper,
        variant: "inline",
        density,
        className: "documentation-token-grid__item",
        wrap: false,
        "data-flow-slot": "documentation-token-grid.item",
    })));
});
DocumentationTokenGrid.displayName = "DocumentationTokenGrid";
