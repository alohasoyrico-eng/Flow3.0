/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Card } from "../Card.js";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
const validKinds = new Set(["summary", "rule", "matrix"]);
function resolveKind(kind) {
    return kind && validKinds.has(kind) ? kind : "matrix";
}
function normalizeItems(items) {
    return Array.isArray(items) ? items.filter(Boolean) : [];
}
function cardCompositionFor(kind, item) {
    if (item.composition)
        return item.composition;
    return kind === "summary" ? "stats" : "standard";
}
export const DocumentationReferenceGrid = forwardRef(function DocumentationReferenceGrid({ items, kind, label = "Reference grid", density, state, className = "", cardClassName = "", surface, ...rest }, ref) {
    const resolvedKind = resolveKind(kind);
    const normalizedItems = normalizeItems(items);
    return React.createElement(Surface, {
        ...surface,
        ...flowRestProps(rest),
        ref,
        className: ["documentation-reference-grid", className].filter(Boolean).join(" "),
        surfaceRole: "section",
        density,
        elevation: surface?.elevation ?? "none",
        tone: surface?.tone ?? "default",
        state: state ?? (normalizedItems.length ? resolvedKind : "empty"),
        "aria-label": rest["aria-label"] ?? label,
        "data-flow-pattern": "documentation-reference-grid",
        "data-documentation-reference-grid-kind": resolvedKind,
        "data-doc-primitive": `reference-${resolvedKind}-grid`,
    }, normalizedItems.map((item, index) => React.createElement(Card, {
        key: item.key ?? `${resolvedKind}-${index}`,
        className: cardClassName,
        title: item.title ?? "",
        value: item.value,
        detail: item.detail,
        status: item.status,
        variant: item.variant ?? "minimal",
        composition: cardCompositionFor(resolvedKind, item),
        state: "default",
        density,
        fullWidth: true,
        "data-flow-slot": "documentation-reference-grid.item",
    })));
});
DocumentationReferenceGrid.displayName = "DocumentationReferenceGrid";
