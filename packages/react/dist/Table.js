import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { tablePlatformContract } from "#flow/platforms";
import { Badge } from "./Badge.js";
import { normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "dense", "sortable", "selectable", "expandable"]);
const validStates = new Set(["default", "hover", "focus", "selected", "sorted", "expanded"]);

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
  columns = [],
  rows = [],
  rowKey = "id",
  label = "Table",
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
  const sortable = resolvedVariant === "sortable" || columns.some((column) => column.sortable);
  const selectable = resolvedVariant === "selectable" || Boolean(onRowSelect || selectedKey);
  const expandable = resolvedVariant === "expandable" || Boolean(renderDetail || expandedKey);
  const isSelectedKeyControlled = selectedKey !== undefined;
  const isSortControlled = sortKey !== undefined;
  const isExpandedKeyControlled = expandedKey !== undefined;
  const [currentSort, setCurrentSort] = useState({ key: sortKey ?? "", direction: sortDir });
  const [currentSelected, setCurrentSelected] = useState(String(selectedKey || ""));
  const [currentExpanded, setCurrentExpanded] = useState(String(expandedKey || (initialState === "expanded" ? rows[0]?.[rowKey] ?? "" : "")));

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
    if (!currentSort.key) return [...rows];
    const column = columns.find((item) => item.key === currentSort.key);
    if (!column) return [...rows];
    const direction = currentSort.direction === "descending" ? -1 : 1;
    return [...rows].sort((a, b) => {
      const aValue = sortValue(a, column);
      const bValue = sortValue(b, column);
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue), "en") * direction;
    });
  }, [columns, currentSort.direction, currentSort.key, rows]);

  const interactionState = currentExpanded ? "expanded" : currentSort.key ? "sorted" : currentSelected ? "selected" : initialState;
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
      "data-variant": resolvedVariant,
      "data-state": interactionState,
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
          expandable ? React.createElement("th", { className: "table__expander-head", scope: "col" }) : null,
          columns.map((column) => {
            const active = currentSort.key === column.key;
            const canSort = column.sortable || sortable;
            return React.createElement(
              "th",
              {
                key: column.key,
                scope: "col",
                "data-align": column.align || undefined,
                "data-priority": column.priority || undefined,
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
                  React.createElement("span", null, column.label ?? column.key),
                )
                : column.label ?? column.key,
            );
          }),
        ),
      ),
      React.createElement(
        "tbody",
        null,
        sortedRows.flatMap((row, index) => {
          const key = String(row[rowKey]);
          const selected = currentSelected ? currentSelected === key : initialState === "selected" && index === 1;
          const expanded = currentExpanded === key;
          const interactive = selectable || expandable;
          const rowNode = React.createElement(
            "tr",
            {
              key,
              "data-key": key,
              "data-label": row.label ?? row.plate ?? key,
              "data-selected": String(selected),
              "data-state": initialState === "hover" && index === 0 ? "hover" : initialState === "focus" && index === 0 ? "focus" : undefined,
              tabIndex: interactive ? 0 : undefined,
              "aria-expanded": expandable ? String(expanded) : undefined,
              onClick: selectable ? () => selectRow(key) : undefined,
              onKeyDown: interactive ? (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (expandable) toggleExpanded(key);
                else selectRow(key);
              } : undefined,
            },
            expandable ? React.createElement(
              "td",
              { className: "table__expander-cell" },
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "table__expander",
                  "data-table-expand": "",
                  "aria-label": `${expanded ? "Collapse" : "Expand"} ${row.label ?? row.plate ?? key}`,
                  "aria-expanded": String(expanded),
                  onClick: (event) => {
                    event.stopPropagation();
                    toggleExpanded(key);
                  },
                },
                "chevron_right",
              ),
            ) : null,
            columns.map((column) => React.createElement(
              "td",
              {
                key: column.key,
                "data-align": column.align || undefined,
                "data-mono": column.mono ? "true" : undefined,
                "data-priority": column.priority || undefined,
              },
              renderCell(typeof column.render === "function" ? column.render(row) : row[column.key], resolvedDensity || undefined),
            )),
          );
          if (!expandable) return [rowNode];
          const detail = typeof renderDetail === "function" ? renderDetail(row) : row.detail ?? "Recent activity and supporting row detail.";
          return [
            rowNode,
            React.createElement(
              "tr",
              { key: `${key}-detail`, className: "table__detail-row", hidden: !expanded },
              React.createElement("td", { className: "table__detail", colSpan: columns.length + 1 }, detail),
            ),
          ];
        }),
      ),
    ),
  );
});

Table.displayName = "Table";
Table.platformContract = tablePlatformContract;
