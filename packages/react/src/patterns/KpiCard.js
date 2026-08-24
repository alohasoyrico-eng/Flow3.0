/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { KpiTile } from "../KpiTile.js";
import { Skeleton } from "../Skeleton.js";
import { Tag } from "../Tag.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
export const KpiCard = forwardRef(function KpiCard({ label, value, unit = "", delta, trend = "flat", tone = "neutral", icon, density, state = "default", disabled = false, loading = false, status, tag, action, empty, error, onAction, onSelect, className = "", ...rest }, ref) {
    const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : state;
    const hasMetric = value !== undefined && value !== null && value !== "";
    const showLoading = resolvedState === "loading";
    const showError = resolvedState === "error";
    const showPermission = resolvedState === "permission-blocked";
    const showEmpty = resolvedState === "empty" || (!hasMetric && !showLoading && !showError && !showPermission);
    const showMetric = hasMetric && !showLoading && !showError && !showEmpty && !showPermission;
    const hasDrillIn = Boolean(onSelect);
    if (!label)
        return null;
    return React.createElement("div", {
        ref,
        className: ["kpi-card", className].filter(Boolean).join(" "),
        role: "group",
        "aria-label": label,
        "data-flow-pattern": "kpi-card",
        "data-state": resolvedState,
        "data-density": density,
        ...sanitizeRestProps(rest),
    }, showLoading
        ? React.createElement(Skeleton, {
            label: `${label} loading`,
            variant: "card",
            density,
            lines: 3,
            state: "loading",
            fullWidth: true,
        })
        : null, showError
        ? React.createElement(ErrorPanel, {
            label: error?.label ?? `${label} unavailable`,
            description: error?.description,
            action: error?.action,
            tone: error?.tone ?? "error",
            variant: error?.variant ?? "inline",
            state: "error",
            density,
            onAction: error?.onAction,
        })
        : null, showPermission
        ? React.createElement(EmptyState, {
            title: empty?.title ?? `${label} is permission blocked`,
            description: empty?.description,
            icon: empty?.icon ?? "lock",
            action: empty?.action,
            variant: empty?.variant ?? "permission",
            state: "permission",
            density,
            onAction: empty?.onAction,
        })
        : null, showEmpty
        ? React.createElement(EmptyState, {
            title: empty?.title ?? `${label} is empty`,
            description: empty?.description,
            icon: empty?.icon,
            action: empty?.action,
            variant: empty?.variant ?? "search-empty",
            state: "search-empty",
            density,
            onAction: empty?.onAction,
        })
        : null, showMetric
        ? React.createElement(KpiTile, {
            label,
            value: String(value),
            delta,
            trend,
            tone,
            icon,
            variant: hasDrillIn ? "drill-in" : "standard",
            state: resolvedState === "stale" ? "risk" : resolvedState === "disabled" ? "disabled" : "default",
            density,
            disabled,
            loading,
            onSelect,
            "data-kpi-unit": unit,
        })
        : null, status?.label
        ? React.createElement(Badge, {
            label: status.label,
            tone: status.tone ?? tone,
            variant: status.variant ?? "status",
            state: status.state ?? "default",
            density,
            live: status.live,
        })
        : null, tag?.label
        ? React.createElement(Tag, {
            label: tag.label,
            tone: tag.tone ?? tone,
            variant: tag.variant ?? "metadata",
            state: tag.state ?? "default",
            density,
            icon: tag.icon,
            interactive: tag.interactive,
            disabled: disabled || tag.disabled,
        })
        : null, action?.label
        ? React.createElement(Button, {
            ...action,
            label: action.label,
            density: action.density ?? density,
            variant: action.variant ?? "ghost",
            disabled: disabled || action.disabled,
            onClick: (event) => {
                action.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onAction?.(action.key ?? action.label ?? "action", event);
            },
        })
        : null);
});
KpiCard.displayName = "KpiCard";
