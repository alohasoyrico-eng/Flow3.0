import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { Pagination } from "../Pagination.js";
import { Skeleton } from "../Skeleton.js";
import { Table } from "../Table.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, loading, error, rows, state }) {
    if (disabled)
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (error || state === "error")
        return "error";
    if (!rows.length)
        return "empty";
    if (state)
        return state;
    return "default";
}
function normalizeRows(rows, rowKey) {
    return (Array.isArray(rows) ? rows : []).filter((row) => row?.[rowKey] !== undefined && row?.[rowKey] !== null);
}
function normalizeColumns(columns) {
    return (Array.isArray(columns) ? columns : []).filter((column) => Boolean(column?.key && column.label));
}
function rowLabel(row, key) {
    const label = row.label;
    return typeof label === "string" || typeof label === "number" ? String(label) : key;
}
export const VirtualDataTable = forwardRef(function VirtualDataTable({ label, description, density, state, disabled = false, loading = false, virtualized = false, columns = [], rows = [], rowKey = "id", selectedKeys = [], selectedKey, sortKey, sortDir, page = 1, pageCount = 1, pagination, empty, error, selection, bulkActions = [], onSortChange, onRowSelect, onPageChange, onBulkAction, className = "", ...rest }, ref) {
    const normalizedColumns = normalizeColumns(columns);
    const normalizedRows = normalizeRows(rows, rowKey);
    const resolvedState = resolveState({ disabled, loading, error, rows: normalizedRows, state });
    const selectedSet = new Set((Array.isArray(selectedKeys) ? selectedKeys : []).map(String));
    const selectedCount = selectedSet.size || (selectedKey ? 1 : 0);
    const isDisabled = disabled || resolvedState === "disabled";
    if (!label)
        return null;
    const tableColumns = selection?.enabled
        ? [
            {
                key: "__selection",
                label: selection.label ?? "Select",
                render: (row) => {
                    const key = String(row[rowKey]);
                    const checked = selectedSet.has(key) || selectedKey === key;
                    return React.createElement(Checkbox, {
                        label: `${selection.rowLabel ?? "Select row"} ${rowLabel(row, key)}`,
                        checked,
                        state: isDisabled ? "disabled" : checked ? "checked" : "unchecked",
                        disabled: isDisabled || row.disabled === true,
                        density,
                        value: key,
                        onClick: (event) => event.stopPropagation(),
                        onCheckedChange: (nextChecked, meta, event) => {
                            onRowSelect?.(key, event);
                            selection.onSelectionChange?.(key, nextChecked, meta, event);
                        },
                    });
                },
            },
            ...normalizedColumns,
        ]
        : normalizedColumns;
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "virtual-data-table",
        "data-state": resolvedState,
        "data-density": density,
        "data-row-count": String(normalizedRows.length),
        "data-selected-count": String(selectedCount),
        "data-virtualized": String(Boolean(virtualized)),
        ...sanitizeRestProps(rest),
    }, description ? React.createElement(Badge, {
        label: description,
        tone: selectedCount ? "info" : "neutral",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
    }) : null, selectedCount ? React.createElement(Badge, {
        label: `${selectedCount} selected`,
        tone: "info",
        variant: "count",
        density,
        live: true,
    }) : null, resolvedState === "loading"
        ? React.createElement(Skeleton, {
            label: `${label} loading`,
            variant: "table",
            rows: Math.max(1, pagination?.pageSize ?? 5),
            columns: Math.max(1, normalizedColumns.length),
            state: "loading",
            density,
            fullWidth: true,
        })
        : null, resolvedState === "error"
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
        : null, resolvedState === "empty"
        ? React.createElement(EmptyState, {
            title: empty?.title ?? `${label} has no rows`,
            description: empty?.description,
            icon: empty?.icon,
            action: empty?.action,
            variant: empty?.variant ?? "search-empty",
            state: "search-empty",
            density,
            onAction: empty?.onAction,
        })
        : null, normalizedRows.length && resolvedState !== "loading" && resolvedState !== "error"
        ? React.createElement(Table, {
            label,
            columns: tableColumns,
            rows: normalizedRows,
            rowKey,
            variant: selection?.enabled ? "selectable" : sortKey ? "sortable" : "standard",
            state: selectedCount ? "selected" : "default",
            density,
            sortKey,
            sortDir,
            selectedKey,
            onSortChange,
            onRowSelect,
        })
        : null, (Array.isArray(bulkActions) ? bulkActions : []).filter((action) => action?.label).map((action) => React.createElement(Button, {
        ...action,
        key: action.key ?? action.label,
        label: action.label,
        variant: action.variant ?? "secondary",
        density: action.density ?? density,
        disabled: isDisabled || selectedCount === 0 || action.disabled,
        loading: action.loading,
        onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onBulkAction?.(action.key ?? action.label, event);
        },
    })), pageCount > 1
        ? React.createElement(Pagination, {
            page,
            pageCount,
            label: pagination?.label ?? `${label} pagination`,
            previousLabel: pagination?.previousLabel ?? "Previous page",
            nextLabel: pagination?.nextLabel ?? "Next page",
            getPageLabel: pagination?.getPageLabel ?? ((nextPage) => `Page ${nextPage}`),
            state: isDisabled ? "disabled" : "default",
            density,
            disabled: isDisabled,
            onPageChange,
        })
        : null);
});
VirtualDataTable.displayName = "VirtualDataTable";
