import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Surface } from "../Surface.js";
import { Tag } from "../Tag.js";
import { flowDefinedProps, flowRestProps } from "../internal/props.js";
import { SectionHeader } from "./SectionHeader.js";
const validStates = new Set(["default", "with-actions", "with-metadata", "with-status", "loading", "dark", "mobile"]);
const validBackgrounds = new Set(["none", "tint", "gradient-grid"]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ state, loading, actions, metadata, }) {
    if (loading || state === "loading")
        return "loading";
    if (state && validStates.has(state))
        return state;
    if ((actions?.length ?? 0) > 0)
        return "with-actions";
    if ((metadata?.length ?? 0) > 0)
        return "with-metadata";
    return "default";
}
function resolveTone(tone) {
    if (tone === "brand")
        return "selected";
    return tone ?? "default";
}
function resolveBackground(background) {
    return background && validBackgrounds.has(background) ? background : "none";
}
function metadataKey(item, index) {
    return item.key ?? `${item.label}-${item.value ?? index}`;
}
function renderMetadata(item, density, disabled, index) {
    const common = {
        label: item.value ? `${item.label}: ${item.value}` : item.label,
        density,
        icon: item.icon,
        "data-flow-slot": "documentation-hero.metadata-item",
        ...sanitizeRestProps(item),
    };
    if (item.kind === "badge") {
        return React.createElement(Badge, {
            ...common,
            key: metadataKey(item, index),
            tone: item.tone,
            variant: item.variant ?? "status",
            state: disabled ? "disabled" : "default",
            live: false,
        });
    }
    return React.createElement(Tag, {
        ...common,
        key: metadataKey(item, index),
        tone: item.tone,
        variant: item.variant ?? "metadata",
        state: disabled ? "disabled" : "default",
    });
}
function renderAction(action, density, disabled, index) {
    const key = action.key ?? action.label ?? String(index);
    return React.createElement(Button, {
        ...action,
        key,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? (index === 0 ? "primary" : "secondary"),
        disabled: disabled || action.disabled,
        "data-flow-slot": "documentation-hero.action",
    });
}
export const DocumentationHero = forwardRef(function DocumentationHero({ kicker, title, description, headingLevel = 1, metadata = [], actions = [], visual, children, density, tone, elevation = "none", state, loading = false, background = "none", surface, className = "", ...rest }, ref) {
    const normalizedMetadata = Array.isArray(metadata) ? metadata.filter((item) => Boolean(item?.label)) : [];
    const normalizedActions = Array.isArray(actions) ? actions.filter((action) => Boolean(action?.label)) : [];
    const resolvedState = resolveState({
        ...(state !== undefined ? { state } : {}),
        loading,
        actions: normalizedActions,
        metadata: normalizedMetadata,
    });
    const resolvedBackground = resolveBackground(background);
    const disabled = resolvedState === "loading";
    return React.createElement(Surface, {
        ...surface,
        ...sanitizeRestProps(rest),
        ref,
        className: ["documentation-hero", className].filter(Boolean).join(" "),
        surfaceRole: "section",
        density,
        elevation,
        tone: resolveTone(tone),
        state: disabled ? "disabled" : "default",
        "aria-busy": disabled ? "true" : undefined,
        "data-flow-pattern": "documentation-hero",
        "data-documentation-hero-state": resolvedState,
        "data-documentation-hero-background": resolvedBackground,
    }, React.createElement("div", { "data-flow-slot": "documentation-hero-copy" }, kicker ? React.createElement("p", { "data-flow-slot": "documentation-hero.kicker" }, kicker) : null, React.createElement(SectionHeader, flowDefinedProps({
        title,
        description,
        headingLevel,
        density,
        loading: disabled,
        "data-flow-slot": "documentation-hero.header",
    })), normalizedMetadata.length
        ? React.createElement("div", { "data-flow-slot": "documentation-hero.metadata" }, normalizedMetadata.map((item, index) => renderMetadata(item, density, disabled, index)))
        : null, children ? React.createElement("div", { "data-flow-slot": "documentation-hero.body" }, children) : null, normalizedActions.length
        ? React.createElement("div", { "data-flow-slot": "documentation-hero.actions" }, normalizedActions.map((action, index) => renderAction(action, density, disabled, index)))
        : null), visual ? React.createElement("div", { "data-flow-slot": "documentation-hero-visual" }, visual) : null);
});
DocumentationHero.displayName = "DocumentationHero";
