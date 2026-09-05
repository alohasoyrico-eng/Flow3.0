/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { tabsPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const allowedVariants = new Set(["pill", "underline", "default"]);
function normalizeTabsVariant(variant) {
    if (variant === "underline")
        return "underline";
    return "pill";
}
function itemKey(item) {
    return item?.key ?? item?.value ?? "";
}
function hasStableItemKey(item) {
    const key = item?.key ?? item?.value;
    return key !== undefined && key !== null && key !== "";
}
function normalizeItems(items) {
    const sourceItems = Array.isArray(items) ? items : [];
    return sourceItems.filter((item) => item?.label && hasStableItemKey(item)).map((item) => ({
        ...item,
        key: itemKey(item),
        label: item.label,
    }));
}
function selectedFromItems(items, selectedKey) {
    if (selectedKey !== undefined)
        return selectedKey;
    const selectedItemKey = itemKey(items.find((item) => item.selected));
    return selectedItemKey !== "" ? selectedItemKey : itemKey(items[0]);
}
export const Tabs = forwardRef(function Tabs({ label, items, selectedKey, variant = "pill", density, onValueChange, className = "", ...rest }, ref) {
    const normalizedItems = useMemo(() => normalizeItems(items), [items]);
    const isSelectedKeyControlled = selectedKey !== undefined;
    const [currentKey, setCurrentKey] = useState(() => selectedFromItems(normalizedItems, selectedKey));
    const rootRef = useRef(null);
    const tabRefs = useRef(new Map());
    const resolvedVariant = normalizeTabsVariant(allowedVariants.has(variant) ? variant : "pill");
    const resolvedDensity = normalizeFlowDensity(density);
    const activeKey = isSelectedKeyControlled ? selectedKey : currentKey || selectedFromItems(normalizedItems, selectedKey);
    const syncIndicator = (key = activeKey) => {
        const root = rootRef.current;
        const tab = key ? tabRefs.current.get(key) : undefined;
        if (!root || !tab)
            return;
        root.style.setProperty("--comp-tabs-indicator-left", `${tab.offsetLeft ?? 0}px`);
        root.style.setProperty("--comp-tabs-indicator-width", `${tab.offsetWidth ?? 0}px`);
    };
    useEffect(() => {
        syncIndicator(activeKey);
        const root = rootRef.current;
        if (!root || typeof ResizeObserver === "undefined")
            return undefined;
        const observer = new ResizeObserver(() => syncIndicator(activeKey));
        observer.observe(root);
        return () => observer.disconnect();
    }, [activeKey, normalizedItems]);
    const commitKey = (nextKey, restoreFocus = false, event) => {
        if (!nextKey)
            return;
        const tab = normalizedItems.find((item) => item.key === nextKey);
        if (!tab || tab.disabled)
            return;
        if (!isSelectedKeyControlled)
            setCurrentKey(nextKey);
        onValueChange?.(nextKey, event);
        const schedule = globalThis.requestAnimationFrame?.bind(globalThis) ?? ((callback) => globalThis.setTimeout?.(callback, 0));
        schedule(() => syncIndicator(nextKey));
        if (restoreFocus)
            schedule(() => tabRefs.current.get(nextKey)?.focus());
    };
    const enabled = normalizedItems.filter((item) => !item.disabled);
    const move = (direction, event) => {
        if (!enabled.length)
            return;
        const currentIndex = Math.max(0, enabled.findIndex((item) => item.key === activeKey));
        commitKey(enabled[(currentIndex + direction + enabled.length) % enabled.length]?.key, true, event);
    };
    const moveToEdge = (edge, event) => {
        const next = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
        if (next)
            commitKey(next.key, true, event);
    };
    if (!normalizedItems.length)
        return null;
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref: (node) => {
            rootRef.current = node;
            if (typeof ref === "function")
                ref(node);
            else if (ref)
                ref.current = node;
        },
        className: ["tabs", className].filter(Boolean).join(" "),
        role: "tablist",
        "aria-label": label,
        ...flowVariantProps(resolvedVariant),
        ...flowDensityProps(resolvedDensity),
    }, normalizedItems.map((item) => {
        const selected = item.key === activeKey;
        const badge = item.badge?.label ? item.badge : null;
        const { key, value, label: itemLabel, icon, badge: itemBadge, selected: itemSelected, disabled, onClick, onKeyDown, ...itemRest } = item;
        return React.createElement("button", {
            ...itemRest,
            key: item.key,
            ref: (node) => {
                if (node)
                    tabRefs.current.set(item.key, node);
                else
                    tabRefs.current.delete(item.key);
            },
            type: "button",
            className: "tabs__tab",
            role: "tab",
            disabled: Boolean(disabled),
            tabIndex: selected ? 0 : -1,
            "aria-selected": String(selected),
            "data-tabs-item": "",
            "data-key": item.key,
            onClick: (event) => {
                onClick?.(event);
                if (event.defaultPrevented)
                    return;
                commitKey(item.key, false, event);
            },
            onKeyDown: (event) => {
                onKeyDown?.(event);
                if (event.defaultPrevented)
                    return;
                if (event.key === "ArrowRight") {
                    event.preventDefault();
                    move(1, event);
                }
                else if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    move(-1, event);
                }
                else if (event.key === "Home") {
                    event.preventDefault();
                    moveToEdge("first", event);
                }
                else if (event.key === "End") {
                    event.preventDefault();
                    moveToEdge("last", event);
                }
            },
        }, icon ? React.createElement("span", { className: "tabs__icon", "aria-hidden": "true" }, icon) : null, React.createElement("span", { className: "tabs__label" }, itemLabel), badge ? React.createElement(Badge, {
            label: badge.label,
            tone: badge.tone ?? "neutral",
            variant: badge.variant ?? "count",
            ...(resolvedDensity ? { density: resolvedDensity } : {}),
        }) : null);
    }));
});
Tabs.displayName = "Tabs";
Tabs.platformContract = tabsPlatformContract;
