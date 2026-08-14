import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Chip } from "../Chip.js";
import { Surface } from "../Surface.js";
import { Tag } from "../Tag.js";
import { Tooltip } from "../Tooltip.js";
import { flowRestProps } from "../internal/props.js";
const validStates = new Set(["default", "compact", "overflow", "interactive", "loading", "empty", "dark", "mobile"]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function itemLabel(item) {
    return item.value ? `${item.label}: ${item.value}` : item.label;
}
function itemKey(item, index) {
    return item.key ?? `${item.label}-${item.value ?? index}`;
}
function resolveState({ state, loading, compact, items, actions, }) {
    if (loading || state === "loading")
        return "loading";
    if (!items.length && !actions.length)
        return "empty";
    if (state && validStates.has(state))
        return state;
    if (compact)
        return "compact";
    if (actions.length || items.some((item) => item.interactive))
        return "interactive";
    return "default";
}
function renderCoreItem(item, density, disabled, index) {
    const label = itemLabel(item);
    const common = {
        label,
        density,
        icon: item.icon,
        "data-flow-slot": "artifact-metadata-bar.item",
        ...sanitizeRestProps(item),
    };
    if (item.kind === "badge") {
        return React.createElement(Badge, {
            ...common,
            tone: item.tone,
            variant: item.variant ?? "status",
            state: disabled || item.disabled ? "disabled" : "default",
            live: false,
        });
    }
    if (item.kind === "chip") {
        return React.createElement(Chip, {
            ...common,
            tone: item.tone,
            variant: item.variant ?? "assist",
            state: disabled || item.disabled ? "disabled" : item.selected ? "selected" : "default",
            selected: item.selected,
            interactive: item.interactive,
            disabled: disabled || item.disabled,
        });
    }
    return React.createElement(Tag, {
        ...common,
        tone: item.tone,
        variant: item.variant ?? "metadata",
        state: disabled || item.disabled ? "disabled" : item.interactive ? "focus" : "default",
        interactive: item.interactive,
        disabled: disabled || item.disabled,
    });
}
function renderItem(item, density, disabled, index) {
    const core = renderCoreItem(item, density, disabled, index);
    if (!item.explanation)
        return React.createElement(React.Fragment, { key: itemKey(item, index) }, core);
    return React.createElement(React.Fragment, { key: itemKey(item, index) }, core, React.createElement(Tooltip, {
        triggerLabel: `${itemLabel(item)} details`,
        content: item.explanation,
        density,
        disabled,
        "data-flow-slot": "artifact-metadata-bar.explanation",
    }));
}
function renderAction(action, density, disabled, index) {
    return React.createElement(Button, {
        ...action,
        key: action.key ?? action.label ?? String(index),
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "tertiary",
        disabled: disabled || action.disabled,
        "data-flow-slot": "artifact-metadata-bar.action",
    });
}
export const ArtifactMetadataBar = forwardRef(function ArtifactMetadataBar({ label = "Artifact metadata", items = [], actions = [], density, state, compact = false, loading = false, emptyLabel = "No metadata", children, surface, className = "", ...rest }, ref) {
    const normalizedItems = (Array.isArray(items) ? items : []).filter((item) => Boolean(item?.label));
    const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
    const resolvedState = resolveState({
        ...(state !== undefined ? { state } : {}),
        loading,
        compact,
        items: normalizedItems,
        actions: normalizedActions,
    });
    const disabled = resolvedState === "loading";
    return React.createElement(Surface, {
        ...surface,
        ...sanitizeRestProps(rest),
        ref,
        className: ["artifact-metadata-bar", className].filter(Boolean).join(" "),
        surfaceRole: "inline",
        density,
        state: disabled ? "disabled" : "default",
        "aria-label": rest["aria-label"] ?? label,
        "aria-busy": disabled ? "true" : undefined,
        "data-flow-pattern": "artifact-metadata-bar",
        "data-artifact-metadata-bar-state": resolvedState,
        "data-artifact-metadata-bar-count": String(normalizedItems.length),
    }, normalizedItems.length
        ? React.createElement("div", { "data-flow-slot": "artifact-metadata-bar.items" }, normalizedItems.map((item, index) => renderItem(item, density, disabled, index)))
        : React.createElement("div", { "data-flow-slot": "artifact-metadata-bar.empty" }, emptyLabel), children ? React.createElement("div", { "data-flow-slot": "artifact-metadata-bar.body" }, children) : null, normalizedActions.length
        ? React.createElement("div", { "data-flow-slot": "artifact-metadata-bar.actions" }, normalizedActions.map((action, index) => renderAction(action, density, disabled, index)))
        : null);
});
ArtifactMetadataBar.displayName = "ArtifactMetadataBar";
