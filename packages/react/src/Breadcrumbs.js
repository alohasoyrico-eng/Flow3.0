/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useMemo } from "react";
import { breadcrumbsPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const allowedVariants = new Set(["standard", "compact", "overflow", "mobile"]);
const allowedStates = new Set(["default", "hover", "focus", "collapsed", "current", "disabled"]);
function resolveBreadcrumbItems(items, { variant, maxItems, collapsedLabel }) {
    if (variant === "mobile" && items.length > 2) {
        const penultimate = items[items.length - 2];
        const last = items[items.length - 1];
        if (!penultimate || !last)
            return items;
        return [
            { ...penultimate, current: false },
            { ...last, current: true },
        ];
    }
    const limit = Number(maxItems ?? (variant === "overflow" ? 4 : items.length));
    if (!Number.isFinite(limit) || limit < 3 || items.length <= limit)
        return items;
    if (!collapsedLabel)
        return items;
    const head = items[0];
    if (!head)
        return items;
    const tailCount = Math.max(1, limit - 2);
    const tail = items.slice(-tailCount);
    return [
        { ...head, current: false },
        { id: "__collapsed", label: collapsedLabel, collapsed: true, current: false },
        ...tail.map((item, index) => ({ ...item, current: index === tail.length - 1 })),
    ];
}
function normalizeItems(items) {
    const sourceItems = Array.isArray(items) ? items : [];
    const labeledItems = sourceItems.filter((item) => {
        const stableKey = item?.id ?? item?.href;
        return item?.label && stableKey !== undefined && stableKey !== null && stableKey !== "";
    });
    return labeledItems.map((item, index) => ({
        ...item,
        label: item.label,
        current: Boolean(item.current) || index === labeledItems.length - 1,
    }));
}
export const Breadcrumbs = forwardRef(function Breadcrumbs({ items, label, collapsedLabel, variant = "standard", state = "default", density, maxItems, separator = "chevron_right", disabled = false, fullWidth = false, className = "", ...rest }, ref) {
    const resolvedVariant = allowedVariants.has(variant) ? variant : "standard";
    const resolvedState = disabled ? "disabled" : allowedStates.has(state) ? state : "default";
    const visibleItems = useMemo(() => resolveBreadcrumbItems(normalizeItems(items), { variant: resolvedVariant, maxItems, collapsedLabel }), [items, maxItems, resolvedVariant, collapsedLabel]);
    const resolvedDensity = normalizeFlowDensity(density);
    if (!visibleItems.length)
        return null;
    return React.createElement("nav", {
        ...flowRestProps(rest),
        ref,
        className: ["breadcrumbs", className].filter(Boolean).join(" "),
        "aria-label": label,
        "aria-disabled": disabled ? "true" : undefined,
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": fullWidth ? "true" : undefined,
    }, React.createElement("ol", null, visibleItems.map((item, index) => {
        const key = item.id ?? item.href;
        const isLast = index === visibleItems.length - 1;
        const hasAction = typeof item.onClick === "function";
        const target = item.collapsed
            ? React.createElement("span", {
                className: "breadcrumbs__target breadcrumbs__target--collapsed",
                "aria-label": item.label,
            }, "...")
            : item.current || disabled || (!item.href && !hasAction)
                ? React.createElement("span", {
                    className: "breadcrumbs__target",
                    "aria-current": item.current ? "page" : undefined,
                }, item.label)
                : !item.href && hasAction
                    ? React.createElement("button", {
                        type: "button",
                        className: "breadcrumbs__target",
                        onClick: (event) => item.onClick?.(item, event),
                    }, item.label)
                    : React.createElement("a", {
                        className: "breadcrumbs__target",
                        href: item.href,
                        onClick: hasAction
                            ? (event) => {
                                event.preventDefault();
                                item.onClick?.(item, event);
                            }
                            : undefined,
                    }, item.label);
        return React.createElement("li", {
            key,
            className: "breadcrumbs__item",
            "data-collapsed": item.collapsed ? "true" : undefined,
        }, target, !isLast
            ? React.createElement("span", { className: "breadcrumbs__separator", "aria-hidden": "true" }, separator)
            : null);
    })));
});
Breadcrumbs.displayName = "Breadcrumbs";
Breadcrumbs.platformContract = breadcrumbsPlatformContract;
