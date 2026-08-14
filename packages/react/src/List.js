/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useState, } from "react";
import { listPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["standard", "compact", "action", "status", "media"]);
const validStates = new Set(["default", "hover", "selected", "loading", "error", "disabled"]);
const validItemTones = new Set(["danger"]);
export const List = forwardRef(function List({ items, interactive = false, label, variant = "standard", state = "default", selectedKey, density, onSelect, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
    const resolvedState = normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    const requestedInteraction = Boolean(interactive || resolvedVariant === "action" || typeof onSelect === "function");
    const isInteractive = requestedInteraction && typeof onSelect === "function";
    const sourceItems = Array.isArray(items) ? items : [];
    const resolvedItems = sourceItems.filter((item) => item?.key !== undefined && item?.key !== null && item?.key !== "" && item?.label);
    const initialSelectedKey = selectedKey ?? resolvedItems.find((item) => item.state === "selected")?.key ?? "";
    const isSelectedKeyControlled = selectedKey !== undefined;
    const [internalSelectedKey, setInternalSelectedKey] = useState(String(initialSelectedKey));
    const currentSelectedKey = isSelectedKeyControlled ? String(selectedKey ?? "") : internalSelectedKey;
    if (!resolvedItems.length)
        return null;
    return React.createElement("ul", {
        ...flowRestProps(rest),
        ref,
        className: ["list", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-interactive": String(isInteractive),
        role: "list",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
    }, resolvedItems.map((item) => {
        const key = String(item.key);
        const isSelected = currentSelectedKey === key;
        const rowState = normalizeFlowValue(isSelected ? "selected" : item.state ?? resolvedState, validStates, resolvedState);
        const rowTone = normalizeFlowValue(item.tone ?? (rowState === "error" ? "danger" : ""), validItemTones, "");
        const disabled = Boolean(item.disabled) || rowState === "disabled" || resolvedState === "disabled";
        const itemCanInteract = isInteractive;
        const Control = itemCanInteract ? "button" : "span";
        const { key: itemKey, label: itemLabel, meta, value, icon, state: itemState, tone, disabled: itemDisabled, onClick, ...itemRest } = item;
        return React.createElement("li", { className: "list__row", key }, React.createElement(Control, {
            ...(itemCanInteract ? flowRestProps(itemRest) : {}),
            className: "list__item",
            type: itemCanInteract ? "button" : undefined,
            disabled: itemCanInteract ? disabled : undefined,
            ...flowStateProps(rowState),
            ...flowToneProps(rowTone || undefined),
            "data-key": itemCanInteract ? key : undefined,
            "aria-current": rowState === "selected" ? "true" : undefined,
            "aria-busy": rowState === "loading" ? "true" : undefined,
            onClick: itemCanInteract ? (event) => {
                if (disabled)
                    return;
                onClick?.(event);
                if (event.defaultPrevented)
                    return;
                if (!isSelectedKeyControlled)
                    setInternalSelectedKey(key);
                onSelect?.(key, event);
            } : undefined,
        }, icon
            ? React.createElement("span", { className: "list__icon material-symbol", "aria-hidden": "true" }, icon)
            : null, React.createElement("span", { className: "list__content" }, React.createElement("strong", null, itemLabel), meta ? React.createElement("small", null, meta) : null), value ? React.createElement("span", { className: "list__value" }, value) : null));
    }));
});
List.displayName = "List";
List.platformContract = listPlatformContract;
