import React, { forwardRef } from "react";
import { Avatar } from "../Avatar.js";
import { Menu } from "../Menu.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function isMenuSeparator(item) {
    return item === "divider" || (typeof item === "object" && item !== null && "separator" in item && item.separator === true);
}
function hasMenuLabel(item) {
    return typeof item === "object" && item !== null && "label" in item && typeof item.label === "string";
}
function normalizeItems(items, signingOut) {
    return (Array.isArray(items) ? items : [])
        .filter((item) => isMenuSeparator(item) || hasMenuLabel(item))
        .map((item) => {
        if (isMenuSeparator(item))
            return item;
        const key = String(item.key ?? item.label);
        const tone = item.tone ?? (signingOut && key === "sign-out" ? "danger" : undefined);
        return {
            ...item,
            key,
            ...(tone ? { tone } : {}),
            disabled: Boolean(item.disabled || signingOut),
        };
    });
}
function resolveState({ disabled, loading, signingOut, permissionBlocked, open, state, }) {
    if (disabled)
        return "disabled";
    if (signingOut)
        return "signing-out";
    if (loading)
        return "loading";
    if (permissionBlocked)
        return "permission-blocked";
    if (state)
        return state;
    return open ? "open" : "closed";
}
export const AvatarMenu = forwardRef(function AvatarMenu({ name, src, status = "none", label, triggerLabel, density, state, open, disabled = false, loading = false, permissionBlocked = false, signingOut = false, items = [], align = "end", onOpenChange, onSelect, className = "", ...rest }, ref) {
    const resolvedLabel = label ?? (name ? `${name} account menu` : "Account menu");
    const resolvedState = resolveState({ disabled, loading, signingOut, permissionBlocked, open, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";
    const normalizedItems = normalizeItems(items, signingOut);
    const actionCount = normalizedItems.filter((item) => !isMenuSeparator(item)).length;
    if (!name || actionCount === 0)
        return null;
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": resolvedLabel,
        "aria-busy": resolvedState === "loading" || resolvedState === "signing-out" ? "true" : undefined,
        "data-flow-pattern": "avatar-menu",
        "data-state": resolvedState,
        "data-density": density,
        "data-action-count": String(actionCount),
        ...sanitizeRestProps(rest),
    }, React.createElement(Avatar, {
        name,
        src,
        status,
        density,
        state: isDisabled ? "disabled" : undefined,
        "aria-hidden": "true",
    }), React.createElement(Menu, {
        triggerLabel: triggerLabel ?? resolvedLabel,
        label: resolvedLabel,
        items: normalizedItems,
        ...(open === undefined ? {} : { open }),
        variant: "avatar-trigger",
        avatarName: name,
        avatarStatus: status,
        ...(density ? { density } : {}),
        state: isDisabled ? "disabled" : resolvedState === "open" ? "open" : "closed",
        align,
        disabled: isDisabled,
        ...(onOpenChange ? { onOpenChange } : {}),
        ...(onSelect ? { onSelect } : {}),
    }));
});
AvatarMenu.displayName = "AvatarMenu";
