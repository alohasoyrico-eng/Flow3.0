/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { List } from "../List.js";
import { Surface } from "../Surface.js";
import { DragSortableList } from "./DragSortableList.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeColumns(columns) {
    return (Array.isArray(columns) ? columns : []).filter((column) => column?.key && column?.label);
}
function normalizeItems(items) {
    return (Array.isArray(items) ? items : []).filter((item) => item?.key && item?.label);
}
function resolveState({ disabled, loading, error, columns, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (error || state === "error")
        return "error";
    if (!columns.length || state === "empty")
        return "empty";
    if (state === "dragging")
        return "dragging";
    if (state === "saving")
        return "saving";
    return state ?? "idle";
}
function columnTone(column, isOverLimit) {
    if (isOverLimit)
        return "warning";
    return (column.tone ?? column.status?.tone ?? "default");
}
function listItemsForColumn(column, density, selectedKey, isDisabled) {
    return normalizeItems(column.items).map((item) => ({
        key: item.key,
        label: item.label,
        icon: item.icon ?? "view_agenda",
        state: isDisabled || item.disabled || item.locked ? "disabled" : item.key === selectedKey ? "selected" : item.state ?? "default",
        ...(item.description ?? item.meta ? { meta: item.description ?? item.meta } : {}),
        ...(isDisabled || item.disabled || item.locked ? { disabled: true } : {}),
        ...(item.status ? { value: React.createElement(Badge, {
                label: item.status.label,
                tone: item.status.tone ?? "neutral",
                variant: item.status.variant ?? "status",
                density,
                state: isDisabled || item.disabled || item.locked ? "disabled" : "default",
            }),
        } : {}),
    }));
}
function dragItemsForColumn(column) {
    const items = normalizeItems(column.items);
    return items.map((item, index) => ({
        key: item.key,
        label: item.label,
        positionLabel: item.positionLabel ?? `${index + 1} of ${items.length}`,
        ...(item.description ?? item.meta ? { description: item.description ?? item.meta } : {}),
        ...(item.icon ? { icon: item.icon } : {}),
        ...(item.locked !== undefined ? { locked: item.locked } : {}),
        ...(item.lockedReason ? { lockedReason: item.lockedReason } : {}),
        ...(item.disabled !== undefined ? { disabled: item.disabled } : {}),
        ...(item.disabledReason ? { disabledReason: item.disabledReason } : {}),
        ...(item.status ? { status: item.status } : {}),
    }));
}
export const KanbanBoard = forwardRef(function KanbanBoard({ label = "Kanban board", description, density, state, disabled = false, loading = false, error, columns = [], selectedKey, selectedColumnKey, sortable = false, actions = [], empty, onCardSelect, onMoveCard, onColumnAction, className = "", ...rest }, ref) {
    const normalizedColumns = normalizeColumns(columns);
    const resolvedState = resolveState({ disabled, loading, error, columns: normalizedColumns, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "saving";
    const cardCount = normalizedColumns.reduce((total, column) => total + normalizeItems(column.items).length, 0);
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" || resolvedState === "saving" ? "true" : undefined,
        "data-flow-pattern": "kanban-board",
        "data-state": resolvedState,
        "data-density": density,
        "data-column-count": String(normalizedColumns.length),
        "data-card-count": String(cardCount),
        "data-sortable": String(Boolean(sortable)),
        ...sanitizeRestProps(rest),
    }, description ? React.createElement(Badge, {
        label: description,
        tone: resolvedState === "error" ? "danger" : "info",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
    }) : null, actions.map((action) => React.createElement(Button, {
        ...action,
        key: action.key ?? action.label,
        label: action.label,
        variant: action.variant ?? "secondary",
        density: action.density ?? density,
        disabled: isDisabled || action.disabled,
        onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onColumnAction?.(action.key ?? action.label, event);
        },
    })), resolvedState === "error"
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
            title: empty?.title ?? `${label} has no columns`,
            description: empty?.description,
            icon: empty?.icon ?? "view_kanban",
            action: empty?.action,
            variant: empty?.variant ?? "empty",
            state: "default",
            density,
            onAction: empty?.onAction,
        })
        : null, normalizedColumns.map((column) => {
        const items = normalizeItems(column.items);
        const isOverLimit = Number.isFinite(column.limit) && column.limit !== undefined && items.length > column.limit;
        const columnState = isDisabled ? "disabled" : selectedColumnKey === column.key ? "selected" : isOverLimit ? "raised" : "default";
        return React.createElement(Surface, {
            key: column.key,
            surfaceRole: "panel",
            state: columnState,
            density,
            tone: columnTone(column, isOverLimit),
            elevation: selectedColumnKey === column.key ? "raised" : "none",
            "data-flow-slot": "columns",
            "data-flow-pattern-boundary": "kanban-column",
            "data-column-key": column.key,
            "data-column-count": String(items.length),
        }, React.createElement(Badge, {
            label: column.status?.label ?? `${items.length}${column.limit ? `/${column.limit}` : ""}`,
            tone: columnTone(column, isOverLimit),
            variant: "count",
            density,
            state: isDisabled || column.disabled ? "disabled" : "default",
            live: true,
        }), sortable
            ? React.createElement(DragSortableList, {
                label: column.label,
                description: column.description,
                density,
                state: isDisabled ? "disabled" : selectedColumnKey === column.key ? "dragging" : "idle",
                disabled: isDisabled || column.disabled,
                items: dragItemsForColumn(column),
                selectedKey,
                onSelect: (key, event) => onCardSelect?.(key, column.key, event),
                onMoveItem: (key, direction, event) => onMoveCard?.(key, column.key, direction, event),
                "data-flow-pattern-boundary": "drag-sortable-list",
            })
            : React.createElement(List, {
                label: column.label,
                items: listItemsForColumn(column, density, selectedKey, isDisabled || Boolean(column.disabled)),
                variant: "action",
                interactive: true,
                density,
                state: isDisabled || column.disabled ? "disabled" : isOverLimit ? "error" : "default",
                selectedKey,
                onSelect: (key, event) => onCardSelect?.(key, column.key, event),
            }));
    }));
});
KanbanBoard.displayName = "KanbanBoard";
