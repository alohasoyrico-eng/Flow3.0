/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useMemo, useState, } from "react";
import { tablePlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Checkbox } from "./Checkbox.js";
import { EmptyState } from "./EmptyState.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps, } from "./internal/props.js";
const validVariants = new Set(["standard", "dense", "sortable", "selectable", "expandable"]);
const validStates = new Set(["default", "hover", "focus", "selected", "sorted", "expanded"]);
const validColumnAlignments = new Set(["center", "right"]);
const validColumnPriorities = new Set(["primary", "secondary", "tertiary"]);
const validSurfaces = new Set(["card", "embedded"]);
function sortValue(row, column) {
    if (typeof column.sortValue === "function")
        return column.sortValue(row);
    return row[column.key];
}
function isTableBadgeCell(value) {
    return Boolean(value && typeof value === "object" && !React.isValidElement(value) && "label" in value);
}
function badgeVariantFor(variant) {
    if (variant === "counter")
        return "count";
    if (variant === "indicator")
        return "dot";
    if (variant === "soft" || variant === "strong")
        return "status";
    return variant ?? "status";
}
function normalizedColumnAlignment(align) {
    return align && validColumnAlignments.has(align) ? align : undefined;
}
function normalizedColumnPriority(priority) {
    return priority && validColumnPriorities.has(priority) ? priority : undefined;
}
function rowDataLabel(row, key) {
    const label = row.label ?? row.plate ?? key;
    return typeof label === "string" || typeof label === "number" ? String(label) : key;
}
function rowKeyFor(row, rowKey, index) {
    const key = row?.[rowKey];
    if (key !== undefined && key !== null && key !== "")
        return String(key);
    if (row.__group)
        return `group-${String(row.__group)}`;
    return String(index);
}
function tableCellStyle(width, depth) {
    if (width === undefined && depth === undefined)
        return undefined;
    const dynamicStyle = {};
    if (width !== undefined) {
        dynamicStyle["--comp-table-column-width"] = typeof width === "number" ? `${width}px` : width;
    }
    if (depth !== undefined) {
        dynamicStyle["--comp-table-tree-depth"] = String(depth);
    }
    return dynamicStyle;
}
function tableDensityProps(density) {
    return density ? { density } : {};
}
function renderCell(value, inheritedDensity) {
    if (React.isValidElement(value))
        return value;
    if (isTableBadgeCell(value)) {
        return React.createElement(Badge, {
            label: value.label,
            tone: value.tone ?? "neutral",
            variant: badgeVariantFor(value.variant),
            icon: value.icon ?? "",
            ...tableDensityProps(inheritedDensity ?? "sm"),
        });
    }
    return value ?? "";
}
function normalizeDefaultSort(defaultSort) {
    if (!defaultSort?.key)
        return { key: "", direction: "ascending" };
    const direction = defaultSort.direction ?? (defaultSort.dir === -1 ? "descending" : "ascending");
    return { key: defaultSort.key, direction };
}
export const Table = forwardRef(function Table({ columns, rows, rowKey = "id", label, getExpandLabel, variant = "standard", state = "default", density, surface = "card", dense = false, zebra = false, stickyHeader = false, emptyLabel = "", emptyDescription = "", emptyIcon = "search_off", tree = false, childrenKey = "children", selection, sortKey, sortDir = "ascending", defaultSort, selectedKey, expandedKey, defaultExpandedKey, renderDetail, onSortChange, onRowSelect, onRowClick, onExpandedChange, onSelectionChange, onCellEdit, className = "", ...rest }, ref) {
    const resolvedVariant = (dense ? "dense" : normalizeFlowValue(variant, validVariants, "standard"));
    const resolvedSurface = normalizeFlowValue(surface, validSurfaces, "card");
    const initialState = normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedColumns = useMemo(() => (Array.isArray(columns) ? columns : []).filter((column) => column?.key && column?.label), [columns]);
    const resolvedRows = useMemo(() => (Array.isArray(rows) ? rows : []).filter((row) => {
        if (row?.__group)
            return true;
        const key = row?.[rowKey];
        return key !== undefined && key !== null && key !== "";
    }), [rowKey, rows]);
    const sortable = resolvedVariant === "sortable" || resolvedColumns.some((column) => column.sortable);
    const selectable = resolvedVariant === "selectable" || Boolean(onRowSelect || selectedKey);
    const bulkSelectable = Array.isArray(selection);
    const expandable = resolvedVariant === "expandable" || Boolean(renderDetail || expandedKey);
    const canRenderExpanders = expandable && typeof getExpandLabel === "function";
    const hasExpanderColumn = tree || canRenderExpanders;
    const isSelectedKeyControlled = selectedKey !== undefined;
    const isSortControlled = sortKey !== undefined;
    const isExpandedKeyControlled = expandedKey !== undefined;
    const [internalSort, setInternalSort] = useState(() => sortKey ? { key: sortKey, direction: sortDir } : normalizeDefaultSort(defaultSort));
    const [internalSelected, setInternalSelected] = useState(String(selectedKey ?? ""));
    const [internalExpanded, setInternalExpanded] = useState(String(expandedKey ?? defaultExpandedKey ?? ""));
    const [editCell, setEditCell] = useState(null);
    const currentSort = isSortControlled ? { key: sortKey ?? "", direction: sortDir } : internalSort;
    const currentSelected = isSelectedKeyControlled ? String(selectedKey ?? "") : internalSelected;
    const currentExpanded = isExpandedKeyControlled ? String(expandedKey ?? "") : internalExpanded;
    const selectedKeys = new Set((selection ?? []).map(String));
    const sortedRows = useMemo(() => {
        if (!currentSort.key)
            return [...resolvedRows];
        const column = resolvedColumns.find((item) => item.key === currentSort.key);
        if (!column)
            return [...resolvedRows];
        const direction = currentSort.direction === "descending" ? -1 : 1;
        return [...resolvedRows].sort((a, b) => {
            if (a.__group || b.__group)
                return 0;
            const aValue = sortValue(a, column);
            const bValue = sortValue(b, column);
            if (aValue == null)
                return 1;
            if (bValue == null)
                return -1;
            if (typeof aValue === "number" && typeof bValue === "number")
                return (aValue - bValue) * direction;
            return String(aValue).localeCompare(String(bValue), "en") * direction;
        });
    }, [currentSort.direction, currentSort.key, resolvedColumns, resolvedRows]);
    const visibleRows = useMemo(() => {
        if (!tree)
            return sortedRows.map((row, index) => ({ row, depth: 0, index }));
        const output = [];
        const walk = (items, depth) => {
            items.forEach((row, index) => {
                output.push({ row, depth, index: output.length });
                const key = rowKeyFor(row, rowKey, index);
                const children = Array.isArray(row[childrenKey]) ? row[childrenKey] : [];
                if (children.length && currentExpanded === key)
                    walk(children, depth + 1);
            });
        };
        walk(sortedRows, 0);
        return output;
    }, [childrenKey, currentExpanded, rowKey, sortedRows, tree]);
    const selectableRowKeys = visibleRows.filter(({ row }) => !row.__group).map(({ row, index }) => rowKeyFor(row, rowKey, index));
    const allSelected = bulkSelectable && selectableRowKeys.length > 0 && selectableRowKeys.every((key) => selectedKeys.has(key));
    const someSelected = bulkSelectable && selectableRowKeys.some((key) => selectedKeys.has(key)) && !allSelected;
    const interactionState = currentExpanded ? "expanded" : currentSort.key ? "sorted" : currentSelected ? "selected" : initialState;
    if (!label || !resolvedColumns.length)
        return null;
    const changeSort = (key, event) => {
        const direction = currentSort.key === key && currentSort.direction !== "descending" ? "descending" : "ascending";
        if (!isSortControlled)
            setInternalSort({ key, direction });
        onSortChange?.({ key, direction }, event);
    };
    const selectRow = (key, event) => {
        if (!isSelectedKeyControlled)
            setInternalSelected(String(key));
        onRowSelect?.(String(key), event);
    };
    const clickRow = (row, event) => {
        onRowClick?.(row, event);
    };
    const toggleExpanded = (key, event) => {
        const next = currentExpanded === String(key) ? "" : String(key);
        if (!isExpandedKeyControlled)
            setInternalExpanded(next);
        onExpandedChange?.(next, event);
    };
    const toggleSelection = (key, checked, event) => {
        const next = new Set(selectedKeys);
        if (checked)
            next.add(key);
        else
            next.delete(key);
        onSelectionChange?.(selectableRowKeys.filter((item) => next.has(item)), event);
    };
    const toggleAllSelection = (checked, event) => {
        onSelectionChange?.(checked ? selectableRowKeys : [], event);
    };
    const commitCellEdit = (event) => {
        if (!editCell)
            return;
        onCellEdit?.(editCell.key, editCell.columnKey, editCell.value, event);
        setEditCell(null);
    };
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        className: ["table", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(interactionState),
        ...flowDensityProps(resolvedDensity),
        "data-surface": resolvedSurface,
        "data-zebra": zebra ? "true" : undefined,
        "data-sticky": stickyHeader ? "true" : undefined,
    }, React.createElement("table", { "aria-label": label, role: tree ? "treegrid" : undefined }, React.createElement("colgroup", null, bulkSelectable ? React.createElement("col", { className: "table__selection-col" }) : null, hasExpanderColumn ? React.createElement("col", { className: "table__expander-col" }) : null, resolvedColumns.map((column) => React.createElement("col", { key: column.key, style: tableCellStyle(column.width) }))), React.createElement("thead", null, React.createElement("tr", null, bulkSelectable ? React.createElement("th", { className: "table__selection-head", scope: "col" }, React.createElement(Checkbox, {
        label: "Select all rows",
        variant: "select-all",
        checked: allSelected,
        indeterminate: someSelected,
        onCheckedChange: (checked, _meta, event) => toggleAllSelection(checked, event),
        ...tableDensityProps(resolvedDensity),
    })) : null, hasExpanderColumn ? React.createElement("th", { className: "table__expander-head", scope: "col" }, React.createElement("span", { className: "table__expander-label" }, tree ? "Hierarchy" : "Details")) : null, resolvedColumns.map((column) => {
        const active = currentSort.key === column.key;
        const canSort = column.sortable || sortable;
        return React.createElement("th", {
            key: column.key,
            scope: "col",
            "data-align": normalizedColumnAlignment(column.align),
            "data-priority": normalizedColumnPriority(column.priority),
            "aria-sort": canSort ? (active ? currentSort.direction : "none") : undefined,
            style: tableCellStyle(column.width),
        }, canSort
            ? React.createElement("button", {
                type: "button",
                className: "table__sort",
                "data-table-sort": "",
                "data-active": String(active),
                "data-dir": active && currentSort.direction === "descending" ? "desc" : "asc",
                onClick: (event) => changeSort(column.key, event),
            }, React.createElement("span", null, column.label))
            : column.label);
    }))), React.createElement("tbody", null, visibleRows.length === 0
        ? React.createElement("tr", { className: "table__empty-row" }, React.createElement("td", { className: "table__empty", colSpan: resolvedColumns.length + (bulkSelectable ? 1 : 0) + (hasExpanderColumn ? 1 : 0) }, React.createElement(EmptyState, {
            title: emptyLabel || "No rows available",
            icon: emptyIcon,
            variant: "search-empty",
            state: "search-empty",
            fullWidth: true,
            ...tableDensityProps(resolvedDensity),
            ...(emptyDescription ? { description: emptyDescription } : {}),
        })))
        : visibleRows.flatMap(({ row, depth, index }) => {
            const key = rowKeyFor(row, rowKey, index);
            if (row.__group) {
                return [React.createElement("tr", { key, className: "table__group-row", "data-group-row": "true" }, React.createElement("td", { className: "table__group", colSpan: resolvedColumns.length + (bulkSelectable ? 1 : 0) + (hasExpanderColumn ? 1 : 0) }, String(row.__group)))];
            }
            const selected = currentSelected === key;
            const checked = selectedKeys.has(key);
            const expanded = currentExpanded === key;
            const expandLabel = typeof getExpandLabel === "function" ? getExpandLabel(row, { expanded, key }) : undefined;
            const detail = typeof renderDetail === "function" ? renderDetail(row) : renderCell(row.detail, resolvedDensity);
            const treeChildren = tree && Array.isArray(row[childrenKey]) ? row[childrenKey] : [];
            const rowHasDetail = canRenderExpanders && Boolean(expandLabel) && detail !== undefined && detail !== null && detail !== "";
            const rowCanExpand = rowHasDetail || treeChildren.length > 0;
            const resolvedExpandLabel = expandLabel ?? `${expanded ? "Collapse" : "Expand"} ${rowDataLabel(row, key)}`;
            const interactive = selectable || rowCanExpand || Boolean(onRowClick);
            const activateRowClick = (event) => {
                if (onRowSelect) {
                    selectRow(key, event);
                    return;
                }
                if (onRowClick) {
                    clickRow(row, event);
                    return;
                }
                if (rowCanExpand) {
                    toggleExpanded(key, event);
                    return;
                }
                if (selectable)
                    selectRow(key, event);
            };
            const activateRowKey = (event) => {
                if (onRowClick) {
                    clickRow(row, event);
                    return;
                }
                if (rowCanExpand) {
                    toggleExpanded(key, event);
                    return;
                }
                if (selectable)
                    selectRow(key, event);
            };
            const rowNode = React.createElement("tr", {
                key,
                "data-key": key,
                "data-label": rowDataLabel(row, key),
                "data-selected": String(selected),
                "data-selection-checked": bulkSelectable ? String(checked) : undefined,
                "data-tree-depth": tree ? String(depth) : undefined,
                "aria-selected": selectable ? String(selected) : undefined,
                ...flowStateProps(initialState === "hover" && index === 0 ? "hover" : initialState === "focus" && index === 0 ? "focus" : undefined),
                tabIndex: interactive ? 0 : undefined,
                "aria-expanded": rowCanExpand ? String(expanded) : undefined,
                "aria-level": tree ? depth + 1 : undefined,
                onClick: interactive ? activateRowClick : undefined,
                onKeyDown: interactive ? (event) => {
                    if (event.key !== "Enter" && event.key !== " ")
                        return;
                    event.preventDefault();
                    activateRowKey(event);
                } : undefined,
            }, bulkSelectable ? React.createElement("td", { className: "table__selection-cell", onClick: (event) => event.stopPropagation() }, React.createElement(Checkbox, {
                label: `Select ${rowDataLabel(row, key)}`,
                variant: "compact",
                checked,
                onCheckedChange: (nextChecked, _meta, event) => toggleSelection(key, nextChecked, event),
                ...tableDensityProps(resolvedDensity),
            })) : null, hasExpanderColumn ? React.createElement("td", { className: "table__expander-cell", style: tableCellStyle(undefined, depth) }, rowCanExpand ? React.createElement("button", {
                type: "button",
                className: "table__expander",
                "data-table-expand": "",
                "aria-label": resolvedExpandLabel,
                "aria-expanded": String(expanded),
                onClick: (event) => {
                    event.stopPropagation();
                    toggleExpanded(key, event);
                },
            }, "chevron_right") : null) : null, resolvedColumns.map((column) => React.createElement("td", {
                key: column.key,
                "data-align": normalizedColumnAlignment(column.align),
                "data-mono": column.mono ? "true" : undefined,
                "data-priority": normalizedColumnPriority(column.priority),
                onDoubleClick: column.editable && onCellEdit ? () => setEditCell({ key, columnKey: column.key, value: String(row[column.key] ?? "") }) : undefined,
                style: tableCellStyle(column.width, tree ? depth : undefined),
            }, editCell?.key === key && editCell.columnKey === column.key
                ? React.createElement("input", {
                    className: "table__edit-input",
                    autoFocus: true,
                    value: editCell.value,
                    onChange: (event) => setEditCell({ ...editCell, value: event.currentTarget.value }),
                    onBlur: commitCellEdit,
                    onKeyDown: (event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            commitCellEdit(event);
                        }
                        if (event.key === "Escape") {
                            event.preventDefault();
                            setEditCell(null);
                        }
                    },
                })
                : renderCell(typeof column.render === "function" ? column.render(row) : row[column.key], resolvedDensity))));
            if (!rowHasDetail)
                return [rowNode];
            return [
                rowNode,
                React.createElement("tr", { key: `${key}-detail`, className: "table__detail-row", hidden: !expanded }, React.createElement("td", { className: "table__detail", colSpan: resolvedColumns.length + (bulkSelectable ? 1 : 0) + (hasExpanderColumn ? 1 : 0) }, detail)),
            ];
        }))));
});
Table.displayName = "Table";
Table.platformContract = tablePlatformContract;
