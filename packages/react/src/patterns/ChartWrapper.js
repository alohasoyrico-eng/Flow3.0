/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { ChartPanel } from "../ChartPanel.js";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { KpiTile } from "../KpiTile.js";
import { List } from "../List.js";
import { Menu } from "../Menu.js";
import { Skeleton } from "../Skeleton.js";
import { Surface } from "../Surface.js";
import { Table } from "../Table.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, loading, empty, error, permissionBlocked, filtered, interactive, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (permissionBlocked || state === "permission-blocked")
        return "permission-blocked";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (empty || state === "empty")
        return "empty";
    if (filtered || state === "filtered")
        return "filtered";
    if (interactive || state === "interactive")
        return "interactive";
    return state ?? "default";
}
function chartState(resolvedState) {
    if (resolvedState === "error")
        return "error";
    if (resolvedState === "disabled" || resolvedState === "permission-blocked")
        return "disabled";
    if (resolvedState === "filtered")
        return "warning";
    return "default";
}
function chartTone(resolvedState) {
    if (resolvedState === "error")
        return "danger";
    if (resolvedState === "filtered")
        return "warning";
    return "neutral";
}
function hasRows(table) {
    return Array.isArray(table?.columns) && table.columns.length > 0 && Array.isArray(table?.rows) && table.rows.length > 0;
}
function hasList(list) {
    return Array.isArray(list?.items) && list.items.length > 0;
}
export const ChartWrapper = forwardRef(function ChartWrapper({ label = "Chart", description, density, state, disabled = false, loading = false, empty = false, error, filtered = false, permissionBlocked = false, interactive = false, chart, summary, status, primaryAction, overflow, table, list, emptyState, errorPanel, skeleton, className = "", onAction, ...rest }, ref) {
    const resolvedState = resolveState({ disabled, loading, empty, error: Boolean(error), permissionBlocked, filtered, interactive, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
    const showLoading = resolvedState === "loading";
    const showEmpty = resolvedState === "empty" || resolvedState === "permission-blocked";
    const showError = resolvedState === "error";
    const chartProps = chart ?? {};
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": showLoading ? "true" : undefined,
        "data-flow-pattern": "chart-wrapper",
        "data-state": resolvedState,
        "data-density": density,
        "data-has-table-summary": String(hasRows(table)),
        "data-has-list-summary": String(hasList(list)),
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : showError ? "sunken" : "default",
        density,
        "data-chart-wrapper-surface": "true",
    }, summary
        ? React.createElement(KpiTile, {
            ...summary,
            label: summary.label ?? label,
            value: summary.value,
            density: summary.density ?? density,
            state: summary.state ?? (isDisabled ? "disabled" : showLoading ? "loading" : "default"),
            disabled: isDisabled || summary.disabled,
        })
        : null, status
        ? React.createElement(Badge, {
            ...status,
            label: status.label,
            density: status.density ?? density,
            tone: status.tone ?? (filtered ? "warning" : "info"),
            variant: status.variant ?? "status",
            live: status.live ?? true,
        })
        : null, primaryAction
        ? React.createElement(Button, {
            ...primaryAction,
            label: primaryAction.label,
            density: primaryAction.density ?? density,
            variant: primaryAction.variant ?? "secondary",
            disabled: isDisabled || primaryAction.disabled,
            onClick: (event) => {
                primaryAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onAction?.(primaryAction.key ?? primaryAction.label, event);
            },
        })
        : null, overflow
        ? React.createElement(Menu, {
            ...overflow,
            triggerLabel: overflow.triggerLabel ?? "Chart actions",
            items: overflow.items ?? [],
            density: overflow.density ?? density,
            state: isDisabled ? "disabled" : overflow.state,
            disabled: isDisabled || overflow.disabled,
        })
        : null, showLoading
        ? React.createElement(Skeleton, {
            label: skeleton?.label ?? `${label} loading`,
            variant: skeleton?.variant ?? "chart",
            density,
            state: "loading",
            rows: skeleton?.rows,
            columns: skeleton?.columns,
            fullWidth: skeleton?.fullWidth ?? true,
        })
        : null, showEmpty
        ? React.createElement(EmptyState, {
            title: emptyState?.title ?? (permissionBlocked ? `${label} unavailable` : `${label} has no data`),
            description: emptyState?.description ?? description,
            icon: emptyState?.icon,
            action: emptyState?.action,
            variant: emptyState?.variant ?? (permissionBlocked ? "permission" : "search-empty"),
            state: emptyState?.state ?? (permissionBlocked ? "permission" : "search-empty"),
            density,
            fullWidth: true,
            onAction: emptyState?.onAction,
        })
        : null, showError
        ? React.createElement(ErrorPanel, {
            label: errorPanel?.label ?? error?.label ?? `${label} unavailable`,
            description: errorPanel?.description ?? error?.description ?? description,
            action: errorPanel?.action ?? error?.action,
            tone: errorPanel?.tone ?? "error",
            variant: errorPanel?.variant ?? "panel",
            state: errorPanel?.state ?? "error",
            density,
            fullWidth: true,
            onAction: errorPanel?.onAction ?? error?.onAction,
        })
        : null, !showLoading && !showEmpty && !showError
        ? React.createElement(ChartPanel, {
            ...chartProps,
            label: chartProps.label ?? label,
            caption: chartProps.caption ?? description,
            density: chartProps.density ?? density,
            state: chartProps.state ?? chartState(resolvedState),
            tone: chartProps.tone ?? chartTone(resolvedState),
            fullWidth: chartProps.fullWidth ?? true,
        })
        : null, hasRows(table)
        ? React.createElement(Table, {
            ...table,
            label: table.label ?? `${label} data summary`,
            density: table.density ?? density,
            state: table.state ?? (isDisabled ? "disabled" : "default"),
        })
        : null, hasList(list)
        ? React.createElement(List, {
            ...list,
            label: list.label ?? `${label} list summary`,
            density: list.density ?? density,
            state: list.state ?? (isDisabled ? "disabled" : "default"),
            interactive: list.interactive ?? false,
        })
        : null));
});
ChartWrapper.displayName = "ChartWrapper";
