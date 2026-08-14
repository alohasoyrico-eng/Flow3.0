/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import { Timeline } from "./Timeline.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}
function resolveState({ disabled, loading, error, selectedAccountKey, detailOpen, timeline, state }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (detailOpen || state === "detail-open")
        return "detail-open";
    if (selectedAccountKey || state === "account-selected")
        return "account-selected";
    if (timeline?.filtered || state === "audit-filtered")
        return "audit-filtered";
    return state ?? "default";
}
function surfaceStateFor(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "error")
        return "critical";
    if (resolvedState === "loading")
        return "sunken";
    if (resolvedState === "detail-open" || resolvedState === "account-selected" || resolvedState === "audit-filtered")
        return "selected";
    return "default";
}
function summaryTone(summary, resolvedState) {
    if (summary?.tone)
        return summary.tone;
    if (resolvedState === "error")
        return "danger";
    if (resolvedState === "audit-filtered")
        return "warning";
    if (resolvedState === "account-selected" || resolvedState === "detail-open")
        return "info";
    return "neutral";
}
function isAccountOperationsSummary(summary) {
    return Boolean(summary?.label);
}
function hasDefaultPrevented(event) {
    return Boolean(event && typeof event === "object" && "defaultPrevented" in event);
}
export const AccountOperations = forwardRef(function AccountOperations({ label = "Account operations", description, density = "sm", state, disabled = false, loading = false, error, selectedAccountKey, detailOpen = false, summaries = [], accounts = {}, detail, timeline, className = "", onAccountSearchChange, onAccountFilterRemove, onAccountFiltersReset, onAccountSortChange, onAccountSelect, onAccountPageChange, onAccountBulkAction, onAccountToolbarOverflowSelect, onDetailOpenChange, onDetailAction, onAuditEventSelect, onAuditFilterRemove, onAuditClear, ...rest }, ref) {
    const normalizedSummaries = normalizeArray(summaries).filter(isAccountOperationsSummary);
    const resolvedState = resolveState({ disabled, loading, error, selectedAccountKey, detailOpen, timeline, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isLoading = loading || resolvedState === "loading";
    const tableRows = normalizeArray(accounts.table?.rows);
    const timelineEvents = normalizeArray(timeline?.events);
    return React.createElement(Surface, {
        ref,
        className,
        surfaceRole: "section",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        focusMode: "within",
        role: "group",
        "aria-label": label,
        "aria-description": description,
        "aria-busy": isLoading ? "true" : undefined,
        "data-flow-pattern": "account-operations",
        "data-flow-slot": "accountOperationsSurface",
        "data-account-operations-state": resolvedState,
        "data-density": density,
        "data-summary-count": String(normalizedSummaries.length),
        "data-account-row-count": String(tableRows.length),
        "data-audit-event-count": String(timelineEvents.length),
        "data-detail-open": String(Boolean(detailOpen)),
        ...sanitizeRestProps(rest),
    }, description
        ? React.createElement(Badge, {
            label: description,
            tone: summaryTone(undefined, resolvedState),
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            "data-flow-slot": "operationsSummary",
        })
        : null, normalizedSummaries.map((summary) => React.createElement(Badge, {
        ...summary,
        key: summary.key ?? summary.label,
        label: summary.label,
        tone: summaryTone(summary, resolvedState),
        variant: summary.variant ?? "status",
        density: summary.density ?? density,
        state: isDisabled ? "disabled" : summary.state ?? "default",
        live: summary.live ?? true,
        "data-flow-slot": "operationsMetric",
    })), React.createElement(DenseOperationalList, {
        ...accounts,
        label: accounts.label ?? `${label} accounts`,
        description: accounts.description,
        density: accounts.density ?? density,
        state: accounts.state ?? (selectedAccountKey ? "selected" : resolvedState === "audit-filtered" ? "filtered" : resolvedState),
        disabled: isDisabled || accounts.disabled,
        loading: isLoading || accounts.loading,
        error: accounts.error ?? error,
        selectedKeys: accounts.selectedKeys ?? (selectedAccountKey ? [selectedAccountKey] : []),
        onSearchChange: (value, event) => {
            accounts.onSearchChange?.(value, event);
            if (hasDefaultPrevented(event) && event.defaultPrevented)
                return;
            onAccountSearchChange?.(value, event);
        },
        onFilterRemove: (key, event) => {
            accounts.onFilterRemove?.(key, event);
            if (event.defaultPrevented)
                return;
            onAccountFilterRemove?.(key, event);
        },
        onFiltersReset: (event) => {
            accounts.onFiltersReset?.(event);
            if (event.defaultPrevented)
                return;
            onAccountFiltersReset?.(event);
        },
        onSortChange: (sort, event) => {
            accounts.onSortChange?.(sort, event);
            if (event.defaultPrevented)
                return;
            onAccountSortChange?.(sort, event);
        },
        onRowSelect: (key, event) => {
            accounts.onRowSelect?.(key, event);
            if (event.defaultPrevented)
                return;
            onAccountSelect?.(key, event);
        },
        onPageChange: (page, event) => {
            accounts.onPageChange?.(page, event);
            if (event.defaultPrevented)
                return;
            onAccountPageChange?.(page, event);
        },
        onBulkAction: (key, event) => {
            accounts.onBulkAction?.(key, event);
            if (event.defaultPrevented)
                return;
            onAccountBulkAction?.(key, event);
        },
        onToolbarOverflowSelect: (item, event) => {
            accounts.onToolbarOverflowSelect?.(item, event);
            if (event.defaultPrevented)
                return;
            onAccountToolbarOverflowSelect?.(item, event);
        },
        "data-flow-pattern-boundary": "dense-operational-list",
        "data-flow-slot": "accountListBoundary",
    }), detail
        ? React.createElement(DrawerAdapter, {
            ...detail,
            label: detail.label ?? `${label} detail`,
            description: detail.description,
            density: detail.density ?? density,
            open: detail.open ?? detailOpen,
            state: detail.state ?? (detailOpen ? "open" : "closed"),
            disabled: isDisabled || detail.disabled,
            loading: isLoading || detail.loading,
            error: detail.error ?? error,
            onOpenChange: (open, event) => {
                detail.onOpenChange?.(open, event);
                if (event?.defaultPrevented)
                    return;
                onDetailOpenChange?.(open, event);
            },
            onAction: (key, event) => {
                detail.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onDetailAction?.(key, event);
            },
            "data-flow-pattern-boundary": "drawer-adapter",
            "data-flow-slot": "accountDetailBoundary",
        })
        : null, timeline
        ? React.createElement(Timeline, {
            ...timeline,
            label: timeline.label ?? `${label} audit timeline`,
            density: timeline.density ?? density,
            state: timeline.state ?? (timeline.filtered ? "filtered" : resolvedState === "loading" ? "loading" : "default"),
            loading: isLoading || timeline.loading,
            error: timeline.error ?? false,
            permissionBlocked: isDisabled || timeline.permissionBlocked,
            onEventSelect: (key, event) => {
                timeline.onEventSelect?.(key, event);
                if (event.defaultPrevented)
                    return;
                onAuditEventSelect?.(key, event);
            },
            onFilterRemove: (key, event) => {
                timeline.onFilterRemove?.(key, event);
                if (event.defaultPrevented)
                    return;
                onAuditFilterRemove?.(key, event);
            },
            onClear: (event) => {
                timeline.onClear?.(event);
                if (event.defaultPrevented)
                    return;
                onAuditClear?.(event);
            },
            "data-flow-pattern-boundary": "timeline",
            "data-flow-slot": "accountAuditBoundary",
        })
        : null);
});
AccountOperations.displayName = "AccountOperations";
