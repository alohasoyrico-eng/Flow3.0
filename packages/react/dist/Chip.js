import React, { forwardRef } from "react";
import { chipPlatformContract } from "#flow/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["filter", "input"]);
const validTones = new Set(["default", "danger", "warning"]);
const validStates = new Set(["default", "hover", "pressed", "selected", "focus", "disabled"]);
const validTypes = new Set(["button", "submit", "reset"]);
function normalizeVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "filter";
}
function normalizeTone(tone) {
    return tone && validTones.has(tone) ? tone : "default";
}
function normalizeState({ disabled = false, selected = false, state = "default" } = {}) {
    if (disabled)
        return "disabled";
    if (selected)
        return "selected";
    if (validStates.has(state))
        return state;
    return "default";
}
export const Chip = forwardRef(function Chip({ label, variant = "filter", tone = "default", state = "default", density, selected = false, disabled = false, removable = false, icon = "", interactive = false, onRemoveLabel, onRemove, onSelectedChange, className = "", type = "button", ...rest }, ref) {
    const resolvedVariant = normalizeVariant(variant);
    const resolvedTone = normalizeTone(tone);
    const isSelected = Boolean(selected) || state === "selected";
    const resolvedState = normalizeState({ disabled, selected: isSelected, state });
    const canRemove = Boolean(removable && onRemoveLabel && onRemove);
    const resolvedType = validTypes.has(type) ? type : "button";
    const canSelect = Boolean(rest.onClick || typeof onSelectedChange === "function" || resolvedType === "submit" || resolvedType === "reset");
    const isInteractive = !canRemove && (Boolean(interactive) || isSelected || typeof onSelectedChange === "function") && canSelect;
    const element = isInteractive ? "button" : "span";
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    function handleClick(event) {
        rest.onClick?.(event);
        if (event.defaultPrevented || resolvedState === "disabled")
            return;
        if (typeof onSelectedChange === "function") {
            onSelectedChange(!isSelected, event);
        }
    }
    function handleRemove(event) {
        event.stopPropagation();
        if (event.defaultPrevented || resolvedState === "disabled")
            return;
        onRemove?.(label, event);
    }
    const iconNode = icon ? React.createElement("span", { className: "chip__icon", "aria-hidden": "true" }, icon) : null;
    const labelNode = React.createElement("span", { className: "chip__label" }, label);
    if (canRemove) {
        const { onClick: _rootOnClick, ...removableRest } = flowRestProps(rest);
        return React.createElement("span", {
            ...removableRest,
            ref,
            className: ["chip", className].filter(Boolean).join(" "),
            "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
            ...flowVariantProps(resolvedVariant),
            ...flowToneProps(resolvedTone),
            ...flowDensityProps(resolvedDensity),
            ...flowStateProps(resolvedState),
            "data-selected": String(isSelected),
            "data-chip-remove": "true",
            "data-interactive": canSelect ? "true" : undefined,
        }, canSelect
            ? React.createElement("button", {
                className: "chip__action",
                type: resolvedType,
                disabled: resolvedState === "disabled",
                onClick: handleClick,
                "aria-pressed": String(isSelected),
            }, iconNode, labelNode)
            : React.createElement(React.Fragment, null, iconNode, labelNode), React.createElement("button", {
            className: "chip__remove",
            type: "button",
            disabled: resolvedState === "disabled",
            onClick: handleRemove,
            "aria-label": onRemoveLabel,
        }, React.createElement("span", { className: "chip__remove-icon", "data-chip-remove-icon": "true", "aria-hidden": "true" }, "close")));
    }
    return React.createElement(element, {
        ...flowRestProps(rest),
        ref,
        className: ["chip", className].filter(Boolean).join(" "),
        type: isInteractive ? resolvedType : undefined,
        disabled: isInteractive ? resolvedState === "disabled" : undefined,
        onClick: isInteractive ? handleClick : rest.onClick,
        "aria-label": canRemove ? onRemoveLabel : rest["aria-label"],
        "aria-pressed": isInteractive ? String(isSelected) : undefined,
        "aria-disabled": !isInteractive && resolvedState === "disabled" ? "true" : undefined,
        ...flowVariantProps(resolvedVariant),
        ...flowToneProps(resolvedTone),
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(resolvedState),
        "data-selected": String(isSelected),
    }, iconNode, labelNode);
});
Chip.displayName = "Chip";
Chip.platformContract = chipPlatformContract;
