import React, { forwardRef, useMemo, } from "react";
import { Avatar } from "../Avatar.js";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import { Popover } from "../Popover.js";
import { Tooltip } from "../Tooltip.js";
function normalizeIdentity(identity) {
    if (!identity?.name)
        return null;
    const key = identity.key ?? identity.id ?? identity.name;
    return {
        key: String(key),
        name: identity.name,
        ...(identity.src !== undefined ? { src: identity.src } : {}),
        status: identity.status ?? "none",
        meta: identity.meta ?? identity.role ?? identity.email ?? "",
        disabled: Boolean(identity.disabled || identity.permissionBlocked),
    };
}
function isNormalizedIdentity(identity) {
    return Boolean(identity);
}
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function avatarStateFor(identity, disabled) {
    if (disabled || identity.disabled)
        return "disabled";
    if (identity.status === "none")
        return "default";
    return identity.status;
}
export const AvatarGroup = forwardRef(function AvatarGroup({ label = "People", identities, maxVisible = 3, density, state = "default", disabled = false, overflow, action, validation, tooltip, onIdentitySelect, onAction, onOverflowOpenChange, className = "", ...rest }, ref) {
    const normalizedIdentities = useMemo(() => (Array.isArray(identities) ? identities : [])
        .map(normalizeIdentity)
        .filter(isNormalizedIdentity), [identities]);
    const visibleCount = Math.max(0, Number(maxVisible) || 0);
    const visibleIdentities = normalizedIdentities.slice(0, visibleCount);
    const overflowIdentities = normalizedIdentities.slice(visibleCount);
    const overflowCount = overflow?.count ?? overflowIdentities.length;
    const resolvedState = disabled ? "disabled" : overflowCount > 0 ? "overflow" : state;
    if (!normalizedIdentities.length && !validation?.message)
        return null;
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "data-flow-pattern": "avatar-group",
        "data-state": resolvedState,
        "data-density": density,
        "data-avatar-count": String(normalizedIdentities.length),
        ...sanitizeRestProps(rest),
    }, visibleIdentities.map((identity) => React.createElement(Avatar, {
        key: identity.key,
        name: identity.name,
        src: identity.src,
        status: identity.status,
        state: avatarStateFor(identity, disabled),
        density,
        "data-identity-key": identity.key,
    })), overflowCount > 0
        ? React.createElement(Badge, {
            label: `+${overflowCount}`,
            ariaLabel: `${overflowCount} additional people`,
            tone: disabled ? "neutral" : "info",
            variant: "count",
            state: "overflow",
            density,
        })
        : null, tooltip?.content
        ? React.createElement(Tooltip, {
            triggerLabel: tooltip.triggerLabel ?? `${label} details`,
            content: tooltip.content,
            placement: tooltip.placement ?? "top",
            state: tooltip.state,
            density: tooltip.density ?? density,
            disabled: disabled || tooltip.disabled,
        })
        : null, overflowCount > 0
        ? React.createElement(Popover, {
            triggerLabel: overflow?.triggerLabel ?? `View ${overflowCount} more`,
            title: overflow?.title ?? label,
            description: overflow?.description ?? `${normalizedIdentities.length} people in this group.`,
            open: overflow?.open,
            state: disabled ? "disabled" : overflow?.state ?? "default",
            density: overflow?.density ?? density,
            disabled,
            onOpenChange: onOverflowOpenChange ?? overflow?.onOpenChange,
        })
        : null, overflowIdentities.length
        ? React.createElement(List, {
            label: overflow?.listLabel ?? `${label} overflow`,
            items: overflowIdentities.map((identity) => ({
                key: identity.key,
                label: identity.name,
                meta: identity.meta,
                state: identity.disabled ? "disabled" : "default",
                disabled: identity.disabled || disabled,
            })),
            variant: "media",
            density,
            interactive: Boolean(onIdentitySelect),
            onSelect: onIdentitySelect,
        })
        : null, action?.label
        ? (() => {
            const actionLabel = action.label;
            return React.createElement(Button, {
                ...action,
                label: actionLabel,
                density: action.density ?? density,
                variant: action.variant ?? "ghost",
                disabled: disabled || action.disabled,
                onClick: (event) => {
                    action.onClick?.(event);
                    if (event.defaultPrevented)
                        return;
                    onAction?.(action.key ?? actionLabel, event);
                },
            });
        })()
        : null, validation?.message
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            state: validation.state ?? (resolvedState === "invalid" ? "error" : "default"),
            density,
            live: validation.live,
        })
        : null);
});
AvatarGroup.displayName = "AvatarGroup";
