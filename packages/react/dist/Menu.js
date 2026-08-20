import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { menuPlatformContract } from "#flow/platforms";
import { Avatar } from "./Avatar.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["actions", "grouped", "selection", "danger", "icon-trigger", "avatar-trigger"]);
const validStates = new Set(["default", "closed", "open", "focus", "disabled"]);
const validItemTones = new Set(["danger"]);
function slug(value) {
    return String(value ?? "menu").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function enabledItems(panel) {
    return [...(panel?.querySelectorAll?.('[role="menuitem"]:not(:disabled)') ?? [])];
}
function hasStableItemKey(item) {
    if (!item || item === "divider" || "separator" in item)
        return false;
    return item?.key !== undefined && item?.key !== null && item?.key !== "";
}
function isSeparator(item) {
    return item === "divider" || "separator" in item;
}
export const Menu = forwardRef(function Menu({ triggerLabel, items, open: openProp, label, variant = "actions", avatarName = "", avatarStatus = "none", density, state = "default", align = "start", disabled = false, onOpenChange, onSelect, className = "", ...rest }, ref) {
    const reactId = useId();
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "actions");
    const resolvedDensity = normalizeFlowDensity(density);
    const initialState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
    const isOpenControlled = openProp !== undefined;
    const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
    const [internalOpen, setInternalOpen] = useState(initiallyOpen);
    const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
    const [interactionState, setInteractionState] = useState(initiallyOpen ? "open" : initialState);
    const resolvedInteractionState = isOpenControlled ? (isOpen ? "open" : initialState) : interactionState;
    const menuId = `menu-${slug(label || triggerLabel)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const isDisabled = disabled || resolvedInteractionState === "disabled";
    const resolvedAlign = align === "end" ? "end" : "start";
    const resolvedItems = Array.isArray(items) ? items.filter((item) => isSeparator(item) || (hasStableItemKey(item) && item.label)) : [];
    const hasVisibleItems = resolvedItems.some((item) => !isSeparator(item));
    const setOpen = (nextOpen, { restoreFocus = false, focusFirst = false, event } = {}) => {
        if (isDisabled)
            return;
        const normalizedOpen = Boolean(nextOpen);
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        if (!isOpenControlled)
            setInteractionState(normalizedOpen ? "open" : "closed");
        onOpenChange?.(normalizedOpen, event);
        if (restoreFocus)
            requestAnimationFrame(() => triggerRef.current?.focus());
        if (focusFirst)
            requestAnimationFrame(() => enabledItems(panelRef.current)[0]?.focus());
    };
    useEffect(() => {
        if (!isOpen || isDisabled)
            return undefined;
        const onDocumentMouseDown = (event) => {
            const target = event.target instanceof Node ? event.target : null;
            if (!target)
                return;
            if (triggerRef.current?.contains(target))
                return;
            if (panelRef.current?.contains(target))
                return;
            setOpen(false, { event });
        };
        document.addEventListener("mousedown", onDocumentMouseDown);
        return () => document.removeEventListener("mousedown", onDocumentMouseDown);
    }, [isOpen, isDisabled]);
    if (!triggerLabel || !hasVisibleItems)
        return null;
    const moveItem = (event, direction) => {
        const enabled = enabledItems(panelRef.current);
        if (!enabled.length)
            return;
        event.preventDefault();
        const index = Math.max(0, enabled.indexOf(event.target));
        enabled[(index + direction + enabled.length) % enabled.length]?.focus();
    };
    const onPanelKeyDown = (event) => {
        if (event.key === "ArrowDown")
            moveItem(event, 1);
        else if (event.key === "ArrowUp")
            moveItem(event, -1);
        else if (event.key === "Home") {
            event.preventDefault();
            enabledItems(panelRef.current)[0]?.focus();
        }
        else if (event.key === "End") {
            event.preventDefault();
            const enabled = enabledItems(panelRef.current);
            enabled[enabled.length - 1]?.focus();
        }
        else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, { restoreFocus: true, event });
        }
        else if (event.key === "Tab")
            setOpen(false, { event });
    };
    const triggerProps = {
        ref: triggerRef,
        disabled: isDisabled,
        className: "menu__trigger",
        "data-menu-trigger": "",
        "aria-haspopup": "menu",
        "aria-expanded": Boolean(isOpen),
        "aria-controls": menuId,
        onClick: (event) => setOpen(!isOpen, { focusFirst: !isOpen, event }),
        onKeyDown: (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true, { focusFirst: true, event });
            }
            if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false, { restoreFocus: true, event });
            }
        },
    };
    const menuAccessibleLabel = label || triggerLabel;
    const hasTrigger = resolvedVariant === "icon-trigger"
        ? Boolean(triggerLabel)
        : resolvedVariant === "avatar-trigger"
            ? Boolean(triggerLabel)
            : Boolean(triggerLabel);
    return React.createElement("span", {
        ...flowRestProps(rest),
        ref,
        className: ["menu", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(isDisabled ? "disabled" : resolvedInteractionState),
        "data-align": resolvedAlign,
        "data-open": String(Boolean(isOpen)),
    }, hasTrigger && resolvedVariant === "icon-trigger"
        ? React.createElement(IconButton, { ...triggerProps, label: triggerLabel, icon: "more_horiz", variant: "ghost", ...(resolvedDensity ? { density: resolvedDensity } : {}) })
        : hasTrigger && resolvedVariant === "avatar-trigger"
            ? React.createElement("button", { ...triggerProps, type: "button", className: "menu__trigger menu__trigger--avatar", "aria-label": triggerLabel }, React.createElement(Avatar, { name: avatarName, status: avatarStatus, ...(resolvedDensity ? { density: resolvedDensity } : {}) }))
            : hasTrigger ? React.createElement(Button, { ...triggerProps, label: triggerLabel, variant: "secondary", ...(resolvedDensity ? { density: resolvedDensity } : {}), trailingIcon: isOpen ? "expand_less" : "expand_more" }) : null, React.createElement("div", {
        ref: panelRef,
        className: "menu__panel",
        "data-menu-panel": "",
        hidden: !isOpen,
        id: menuId,
        role: "menu",
        "aria-label": menuAccessibleLabel,
        onKeyDown: onPanelKeyDown,
    }, resolvedItems.map((item, index) => {
        if (isSeparator(item))
            return React.createElement("span", { key: `separator-${index}`, className: "menu__separator", role: "separator" });
        const key = item.key;
        const { key: itemKey, label: itemLabel, icon, disabled: itemDisabled, tone, shortcut, onClick, ...itemRest } = item;
        return React.createElement("button", {
            ...flowRestProps(itemRest),
            key,
            type: "button",
            className: "menu__item",
            disabled: Boolean(itemDisabled),
            role: "menuitem",
            tabIndex: -1,
            "data-key": key,
            ...(tone ? flowToneProps(normalizeFlowValue(tone, validItemTones, tone)) : {}),
            "aria-disabled": itemDisabled ? "true" : undefined,
            onClick: (event) => {
                if (itemDisabled)
                    return;
                onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onSelect?.(item, event);
                setOpen(false, { restoreFocus: true, event });
            },
        }, icon ? React.createElement("span", { className: "menu__item-icon", "aria-hidden": "true" }, icon) : null, React.createElement("span", { className: "menu__item-label" }, itemLabel), shortcut ? React.createElement("kbd", { className: "menu__item-shortcut" }, shortcut) : null);
    })));
});
Menu.displayName = "Menu";
Menu.platformContract = menuPlatformContract;
