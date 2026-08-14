/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { SectionHeader } from "./SectionHeader.js";
const validStates = new Set(["default", "dense", "callout", "matrix", "empty", "loading", "error", "dark", "mobile"]);
const validLayouts = new Set(["stack", "split", "matrix", "cards", "callout"]);
const validTones = new Set(["default", "muted", "selected", "danger", "warning", "success", "info"]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState(state, layout) {
    if (state && validStates.has(state))
        return state;
    if (layout === "matrix")
        return "matrix";
    if (layout === "callout")
        return "callout";
    return "default";
}
function resolveLayout(layout) {
    return layout && validLayouts.has(layout) ? layout : "stack";
}
function resolveTone(tone, state) {
    if (tone === "info")
        return "selected";
    if (tone && validTones.has(tone))
        return tone;
    if (state === "error")
        return "danger";
    if (state === "callout")
        return "muted";
    return "default";
}
export const DocumentationSection = forwardRef(function DocumentationSection({ title, description, header, children, footer, layout, state, density, tone, elevation = "none", surface, className = "", ...rest }, ref) {
    const resolvedLayout = resolveLayout(layout);
    const resolvedState = resolveState(state, resolvedLayout);
    const resolvedTone = resolveTone(tone, resolvedState);
    const sectionTitle = header?.title ?? title;
    const sectionDescription = header?.description ?? description;
    const sectionHeader = sectionTitle
        ? React.createElement(SectionHeader, {
            ...header,
            title: sectionTitle,
            description: sectionDescription,
            density,
            state: resolvedState === "loading" ? "loading" : header?.state,
            "data-flow-slot": "documentation-section.header",
        })
        : null;
    return React.createElement(Surface, {
        ...surface,
        ...sanitizeRestProps(rest),
        ref,
        className: ["documentation-section", className].filter(Boolean).join(" "),
        surfaceRole: "section",
        density,
        elevation,
        tone: resolvedTone,
        state: resolvedState === "loading" ? "disabled" : "default",
        "aria-label": rest["aria-label"] ?? sectionTitle ?? "Documentation section",
        "data-flow-pattern": "documentation-section",
        "data-documentation-section-layout": resolvedLayout,
        "data-documentation-section-state": resolvedState,
    }, sectionHeader, React.createElement("div", {
        "data-flow-slot": "documentation-section.body",
    }, children), footer
        ? React.createElement("div", {
            "data-flow-slot": "documentation-section.footer",
        }, footer)
        : null);
});
DocumentationSection.displayName = "DocumentationSection";
