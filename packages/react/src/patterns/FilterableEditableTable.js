/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { AdvancedFilters } from "./AdvancedFilters.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import { VirtualDataTable } from "./VirtualDataTable.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}
function resolveState({ disabled, loading, error, selectedRowKey, editing, filters, rows, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (editing || state === "editing")
        return "editing";
    if (selectedRowKey || state === "selected")
        return "selected";
    if (filters?.open || filters?.dirty || state === "filters-open")
        return "filters-open";
    if (normalizeArray(filters?.appliedFilters).length || state === "filtered")
        return "filtered";
    if (!rows.length || state === "empty")
        return "empty";
    return state ?? "default";
}
function surfaceStateFor(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "error")
        return "critical";
    if (resolvedState === "loading")
        return "sunken";
    if (resolvedState === "editing" || resolvedState === "selected" || resolvedState === "filters-open" || resolvedState === "filtered")
        return "selected";
    return "default";
}
function metricTone(metric, resolvedState) {
    if (metric?.tone)
        return metric.tone;
    if (resolvedState === "error")
        return "danger";
    if (resolvedState === "editing" || resolvedState === "selected")
        return "info";
    if (resolvedState === "filters-open" || resolvedState === "filtered")
        return "warning";
    return "neutral";
}
export const FilterableEditableTable = forwardRef(function FilterableEditableTable({ label = "Filterable editable table", description, density = "sm", state, disabled = false, loading = false, error, selectedRowKey, editing = false, metrics = [], filters, table = {}, editor, feedback, className = "", onFilterDrawerOpenChange, onFilterApply, onFilterReset, onSavedFilterSelect, onTableSortChange, onTableRowSelect, onTablePageChange, onTableBulkAction, onEditorOpenChange, onEditorAction, onFeedbackAction, ...rest }, ref) {
    const rows = normalizeArray(table.rows);
    const normalizedMetrics = normalizeArray(metrics).filter((metric) => metric?.label);
    const appliedFilters = normalizeArray(filters?.appliedFilters);
    const resolvedState = resolveState({ disabled, loading, error, selectedRowKey, editing, filters, rows, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isLoading = loading || resolvedState === "loading";
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
        "data-flow-pattern": "filterable-editable-table",
        "data-flow-slot": "filterableEditableTableSurface",
        "data-filterable-editable-table-state": resolvedState,
        "data-density": density,
        "data-row-count": String(rows.length),
        "data-filter-count": String(appliedFilters.length),
        "data-metric-count": String(normalizedMetrics.length),
        "data-editing": String(Boolean(editing)),
        ...sanitizeRestProps(rest),
    }, description
        ? React.createElement(Badge, {
            label: description,
            tone: metricTone(undefined, resolvedState),
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            "data-flow-slot": "tableSummary",
        })
        : null, normalizedMetrics.map((metric) => React.createElement(Badge, {
        ...metric,
        key: metric.key ?? metric.label,
        label: metric.label,
        tone: metricTone(metric, resolvedState),
        variant: metric.variant ?? "status",
        density: metric.density ?? density,
        state: isDisabled ? "disabled" : metric.state ?? "default",
        live: metric.live ?? true,
        "data-flow-slot": "tableMetric",
    })), filters
        ? React.createElement(AdvancedFilters, {
            ...filters,
            label: filters.label ?? `${label} filters`,
            density: filters.density ?? density,
            disabled: Boolean(isDisabled || filters.disabled),
            applying: Boolean(isLoading || filters.applying),
            drawer: filters.drawer
                ? {
                    ...filters.drawer,
                    onOpenChange: (open, event) => {
                        filters.drawer?.onOpenChange?.(open, event);
                        if (event?.defaultPrevented)
                            return;
                        onFilterDrawerOpenChange?.(open, event);
                    },
                }
                : filters.drawer,
            applyAction: filters.applyAction
                ? {
                    ...filters.applyAction,
                    onClick: (event) => {
                        filters.applyAction?.onClick?.(event);
                        if (event.defaultPrevented)
                            return;
                        onFilterApply?.(event);
                    },
                }
                : filters.applyAction,
            resetAction: filters.resetAction
                ? {
                    ...filters.resetAction,
                    onClick: (event) => {
                        filters.resetAction?.onClick?.(event);
                        if (event.defaultPrevented)
                            return;
                        onFilterReset?.(event);
                    },
                }
                : filters.resetAction,
            savedViews: filters.savedViews
                ? {
                    ...filters.savedViews,
                    onSelect: (item, event) => {
                        filters.savedViews?.onSelect?.(item, event);
                        if (event.defaultPrevented)
                            return;
                        onSavedFilterSelect?.(item, event);
                    },
                }
                : filters.savedViews,
            "data-flow-pattern-boundary": "advanced-filters",
            "data-flow-slot": "filtersBoundary",
        })
        : null, React.createElement(VirtualDataTable, {
        ...table,
        label: table.label ?? label,
        density: table.density ?? density,
        state: (table.state ?? (resolvedState === "editing" ? "selected" : resolvedState)),
        disabled: isDisabled || table.disabled,
        loading: isLoading || table.loading,
        error: table.error ?? error,
        rows,
        selectedKey: table.selectedKey ?? selectedRowKey,
        virtualized: table.virtualized ?? true,
        selection: table.selection ?? { enabled: Boolean(onTableRowSelect) || Boolean(selectedRowKey) },
        onSortChange: (sort, event) => {
            table.onSortChange?.(sort, event);
            if (event.defaultPrevented)
                return;
            onTableSortChange?.(sort, event);
        },
        onRowSelect: (key, event) => {
            table.onRowSelect?.(key, event);
            if (event.defaultPrevented)
                return;
            onTableRowSelect?.(key, event);
        },
        onPageChange: (page, event) => {
            table.onPageChange?.(page, event);
            if (event.defaultPrevented)
                return;
            onTablePageChange?.(page, event);
        },
        onBulkAction: (key, event) => {
            table.onBulkAction?.(key, event);
            if (event.defaultPrevented)
                return;
            onTableBulkAction?.(key, event);
        },
        "data-flow-pattern-boundary": "virtual-data-table",
        "data-flow-slot": "tableBoundary",
    }), editor
        ? React.createElement(DrawerAdapter, {
            ...editor,
            label: editor.label ?? `${label} editor`,
            density: editor.density ?? density,
            open: editor.open ?? editing,
            state: editor.state ?? (editing ? "open" : "closed"),
            disabled: isDisabled || editor.disabled,
            loading: isLoading || editor.loading,
            error: (editor.error ?? error),
            onOpenChange: (open, event) => {
                editor.onOpenChange?.(open, event);
                if (event?.defaultPrevented)
                    return;
                onEditorOpenChange?.(open, event);
            },
            onAction: (key, event) => {
                editor.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onEditorAction?.(key, event);
            },
            "data-flow-pattern-boundary": "drawer-adapter",
            "data-flow-slot": "editorBoundary",
        })
        : null, feedback
        ? React.createElement(StatusFeedbackView, {
            ...feedback,
            label: feedback.label ?? `${label} feedback`,
            density: feedback.density ?? density,
            state: (feedback.state ?? resolvedState),
            onAction: (key, event) => {
                feedback.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onFeedbackAction?.(key, event);
            },
            "data-flow-pattern-boundary": "status-feedback-view",
            "data-flow-slot": "feedbackBoundary",
        })
        : null);
});
FilterableEditableTable.displayName = "FilterableEditableTable";
