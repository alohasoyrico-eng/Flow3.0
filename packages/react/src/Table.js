import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { tablePlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "dense", "sortable", "selectable", "expandable"]);
const validStates = new Set(["default", "hover", "focus", "selected", "sorted", "expanded"]);
const validColumnAlignments = new Set(["right"]);
const validColumnPriorities = new Set(["primary", "secondary", "tertiary"]);

function sortValue(row, column) {
  if (typeof column.sortValue === "function") return column.sortValue(row);
  return row[column.key];
}

function renderCell(value, density) {
  if (React.isValidElement(value)) return value;
  if (value && typeof value === "object" && "label" in value) {
    return React.createElement(Badge, {
      label: value.label,
      tone: value.tone ?? "neutral",
      variant: value.variant ?? "status",
      icon: value.icon ?? "",
      density,
    });
  }
  return value ?? "";
}

export const Table = forwardRef(function Table({
  columns,
  rows,
  rowKey = "id",
  label,
  getExpandLabel,
  variant = "standard",
  state = "default",
  density,
  dense = false,
  sortKey,
  sortDir = "ascending",
  selectedKey,
  expandedKey,
  renderDetail,
  onSortChange,
  onRowSelect,
  onExpandedChange,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = dense ? "dense" : normalizeFlowValue(variant, validVariants, "standard");
  const initialState = normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedColumns = useMemo(() => (Array.isArray(columns) ? columns : []).filter((column) => column?.key && column?.label), [columns]);
  const resolvedRows = useMemo(() => (Array.isArray(rows) ? rows : []).filter((row) => {
    const key = row?.[rowKey];
    return key !== undefined && key !== null && key !== "";
  }), [rowKey, rows]);
  const sortable = resolvedVariant === "sortable" || resolvedColumns.some((column) => column.sortable);
  const selectable = resolvedVariant === "selectable" || Boolean(onRowSelect || selectedKey);
  const expandable = resolvedVariant === "expandable" || Boolean(renderDetail || expandedKey);
  const canRenderExpanders = expandable && typeof getExpandLabel === "function";
  const isSelectedKeyControlled = selectedKey !== undefined;
  const isSortControlled = sortKey !== undefined;
  const isExpandedKeyControlled = expandedKey !== undefined;
  const [currentSort, setCurrentSort] = useState({ key: sortKey ?? "", direction: sortDir });
  const [currentSelected, setCurrentSelected] = useState(String(selectedKey || ""));
  const [currentExpanded, setCurrentExpanded] = useState(String(expandedKey || ""));

  useEffect(() => {
    if (isSelectedKeyControlled) setCurrentSelected(String(selectedKey || ""));
  }, [isSelectedKeyControlled, selectedKey]);

  useEffect(() => {
    if (isSortControlled) setCurrentSort({ key: sortKey ?? "", direction: sortDir });
  }, [isSortControlled, sortDir, sortKey]);

  useEffect(() => {
    if (isExpandedKeyControlled) setCurrentExpanded(String(expandedKey || ""));
  }, [expandedKey, isExpandedKeyControlled]);

  const sortedRows = useMemo(() => {
    if (!currentSort.key) return [...resolvedRows];
    const column = resolvedColumns.find((item) => item.key === currentSort.key);
    if (!column) return [...resolvedRows];
    const direction = currentSort.direction === "descending" ? -1 : 1;
    return [...resolvedRows].sort((a, b) => {
      const aValue = sortValue(a, column);
      const bValue = sortValue(b, column);
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue), "en") * direction;
    });
  }, [currentSort.direction, currentSort.key, resolvedColumns, resolvedRows]);

  const interactionState = currentExpanded ? "expanded" : currentSort.key ? "sorted" : currentSelected ? "selected" : initialState;
  if (!label || !resolvedColumns.length || !resolvedRows.length) return null;

  const changeSort = (key) => {
    const direction = currentSort.key === key && currentSort.direction !== "descending" ? "descending" : "ascending";
    if (!isSortControlled) setCurrentSort({ key, direction });
    onSortChange?.({ key, direction });
  };
  const selectRow = (key) => {
    if (!isSelectedKeyControlled) setCurrentSelected(String(key));
    onRowSelect?.(String(key));
  };
  const toggleExpanded = (key) => {
    const next = currentExpanded === String(key) ? "" : String(key);
    if (!isExpandedKeyControlled) setCurrentExpanded(next);
    onExpandedChange?.(next);
  };

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["table", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(interactionState),
      ...flowDensityProps(resolvedDensity),
    },
    React.createElement(
      "table",
      { "aria-label": label },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          canRenderExpanders ? React.createElement("th", { className: "table__expander-head", scope: "col" }) : null,
          resolvedColumns.map((column) => {
            const active = currentSort.key === column.key;
            const canSort = column.sortable || sortable;
            return React.createElement(
              "th",
              {
                key: column.key,
                scope: "col",
                "data-align": normalizeFlowValue(column.align, validColumnAlignments, undefined),
                "data-priority": normalizeFlowValue(column.priority, validColumnPriorities, undefined),
                "aria-sort": canSort ? (active ? currentSort.direction : "none") : undefined,
              },
              canSort
                ? React.createElement(
                  "button",
                  {
                    type: "button",
                    className: "table__sort",
                    "data-table-sort": "",
                    "data-active": String(active),
                    "data-dir": active && currentSort.direction === "descending" ? "desc" : "asc",
                    onClick: () => changeSort(column.key),
                  },
                  React.createElement("span", null, column.label),
                )
                : column.label,
            );
          }),
        ),
      ),
      React.createElement(
        "tbody",
        null,
        sortedRows.flatMap((row, index) => {
          const key = String(row[rowKey]);
          const selected = currentSelected === key;
          const expanded = currentExpanded === key;
          const expandLabel = typeof getExpandLabel === "function" ? getExpandLabel(row, { expanded, key }) : undefined;
          const rowCanExpand = canRenderExpanders && Boolean(expandLabel);
          const interactive = selectable || rowCanExpand;
          const rowNode = React.createElement(
            "tr",
            {
              key,
              "data-key": key,
              "data-label": row.label ?? row.plate ?? key,
              "data-selected": String(selected),
              ...flowStateProps(initialState === "hover" && index === 0 ? "hover" : initialState === "focus" && index === 0 ? "focus" : undefined),
              tabIndex: interactive ? 0 : undefined,
              "aria-expanded": rowCanExpand ? String(expanded) : undefined,
              onClick: selectable ? () => selectRow(key) : undefined,
              onKeyDown: interactive ? (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (rowCanExpand) toggleExpanded(key);
                else selectRow(key);
              } : undefined,
            },
            rowCanExpand ? React.createElement(
              "td",
              { className: "table__expander-cell" },
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "table__expander",
                  "data-table-expand": "",
                  "aria-label": expandLabel,
                  "aria-expanded": String(expanded),
                  onClick: (event) => {
                    event.stopPropagation();
                    toggleExpanded(key);
                  },
                },
                "chevron_right",
              ),
            ) : null,
            resolvedColumns.map((column) => React.createElement(
              "td",
              {
                key: column.key,
                "data-align": normalizeFlowValue(column.align, validColumnAlignments, undefined),
                "data-mono": column.mono ? "true" : undefined,
                "data-priority": normalizeFlowValue(column.priority, validColumnPriorities, undefined),
              },
              renderCell(typeof column.render === "function" ? column.render(row) : row[column.key], resolvedDensity || undefined),
            )),
          );
          if (!rowCanExpand) return [rowNode];
          const detail = typeof renderDetail === "function" ? renderDetail(row) : row.detail ?? "";
          return [
            rowNode,
            React.createElement(
              "tr",
              { key: `${key}-detail`, className: "table__detail-row", hidden: !expanded },
              React.createElement("td", { className: "table__detail", colSpan: resolvedColumns.length + 1 }, detail),
            ),
          ];
        }),
      ),
    ),
  );
});

Table.displayName = "Table";
Table.platformContract = tablePlatformContract;
