/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { Chip } from "../Chip.js";
import { Surface } from "../Surface.js";
import { Tag } from "../Tag.js";
import { Tooltip } from "../Tooltip.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, loading, hidden, selected, error, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (error || state === "error")
        return "error";
    if (hidden || state === "hidden")
        return "hidden";
    if (selected || state === "selected")
        return "selected";
    return state ?? "default";
}
function surfaceStateFor(state) {
    if (state === "disabled")
        return "disabled";
    if (state === "error")
        return "critical";
    if (state === "selected")
        return "selected";
    return "default";
}
function coerceToggleEvent(event) {
    return event;
}
export const ChartLegendItem = forwardRef(function ChartLegendItem({ label, value, description, colorLabel, density = "sm", state, selected = false, hidden = false, loading = false, disabled = false, error = false, control = "checkbox", status, tag, tooltip, action, className = "", onToggle, onAction, ...rest }, ref) {
    if (!label)
        return null;
    const resolvedState = resolveState({ disabled, loading, hidden, selected, error, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
    const checked = !hidden && (selected || resolvedState === "selected" || resolvedState === "default");
    const handleToggle = (nextChecked, meta, event) => {
        onToggle?.(nextChecked, { label, hidden: !nextChecked, state: resolvedState, meta }, coerceToggleEvent(event));
    };
    const toggleControl = control === "chip"
        ? React.createElement(Chip, {
            label,
            selected: checked,
            disabled: isDisabled,
            removable: false,
            density,
            onClick: (event) => onToggle?.(!checked, { label, hidden: checked, state: resolvedState }, event),
            "data-flow-slot": "toggle",
        })
        : control === "button"
            ? React.createElement(Button, {
                label,
                variant: checked ? "primary" : "secondary",
                disabled: isDisabled,
                density,
                onClick: (event) => onToggle?.(!checked, { label, hidden: checked, state: resolvedState }, event),
                "data-flow-slot": "toggle",
            })
            : React.createElement(Checkbox, {
                label,
                ...(description !== undefined ? { description } : {}),
                checked,
                disabled: isDisabled,
                density,
                state: checked ? "checked" : "unchecked",
                onCheckedChange: handleToggle,
                "data-flow-slot": "toggle",
            });
    return React.createElement(Surface, {
        ref,
        surfaceRole: "section",
        state: surfaceStateFor(resolvedState),
        density,
        className,
        role: "group",
        "aria-label": `${label}${value ? ` ${value}` : ""}`,
        "aria-disabled": isDisabled ? "true" : undefined,
        "data-flow-pattern": "chart-legend-item",
        "data-flow-slot": "legendSurface",
        "data-state": resolvedState,
        "data-density": density,
        ...sanitizeRestProps(rest),
    }, toggleControl, value ? React.createElement(Badge, {
        label: value,
        tone: "neutral",
        state: resolvedState,
        density,
        "data-flow-slot": "value",
    }) : null, colorLabel ? React.createElement(Tag, {
        label: colorLabel,
        tone: "neutral",
        state: resolvedState,
        density,
        "data-flow-slot": "seriesLabel",
    }) : null, status?.label ? React.createElement(Badge, { ...status, density: status.density ?? density, "data-flow-slot": "status" }) : null, tag?.label ? React.createElement(Tag, { ...tag, density: tag.density ?? density, "data-flow-slot": "status" }) : null, tooltip?.label ? React.createElement(Tooltip, { ...tooltip, density: tooltip.density ?? density, "data-flow-slot": "status" }) : null, action?.label ? React.createElement(Button, {
        ...action,
        density: action.density ?? density,
        variant: action.variant ?? "ghost",
        disabled: isDisabled || action.disabled,
        onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onAction?.(action.key ?? action.label, event);
        },
        "data-flow-slot": "toggle",
    }) : null);
});
ChartLegendItem.displayName = "ChartLegendItem";
