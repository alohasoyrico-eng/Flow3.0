import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { tablePlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import {
  type FlowDataAttributes,
  type FlowDensity,
  flowStateProps,
  flowVariantProps,
  normalizeFlowValue,
  normalizeFlowDensity,
  flowDensityProps,
  flowRestProps,
} from "./internal/props.js";

const validVariants = new Set(["standard", "dense", "sortable", "selectable", "expandable"]);
const validStates = new Set(["default", "hover", "focus", "selected", "sorted", "expanded"]);
const validColumnAlignments = new Set(["right"]);
const validColumnPriorities = new Set(["primary", "secondary", "tertiary"]);

export type TableVariant = "standard" | "dense" | "sortable" | "selectable" | "expandable";
export type TableState = "default" | "hover" | "focus" | "selected" | "sorted" | "expanded";
export type TableDensity = "sm" | "md" | "lg";
export type TableSortDirection = "ascending" | "descending";
export type TableColumnAlign = "left" | "right";
export type TableColumnPriority = "primary" | "secondary" | "tertiary";

export type TableBadgeCell = {
  label: string;
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  variant?: "status" | "counter" | "indicator" | "soft" | "strong";
  icon?: string;
};

export type TableCellValue = ReactNode | TableBadgeCell;
export type TableRow = Record<string, TableCellValue>;
export type TableSort = {
  key: string;
  direction: TableSortDirection;
};
export type TableSortEvent = MouseEvent<HTMLButtonElement>;
export type TableRowSelectEvent = MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;
export type TableExpandedEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLTableRowElement>;

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: TableColumnAlign;
  mono?: boolean;
  priority?: TableColumnPriority;
  sortValue?: (row: TableRow) => string | number | null | undefined;
  render?: (row: TableRow) => ReactNode;
}

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  columns: TableColumn[];
  rows: TableRow[];
  rowKey?: string;
  label: string;
  getExpandLabel?: (row: TableRow, meta: { expanded: boolean; key: string }) => string;
  variant?: TableVariant;
  state?: TableState;
  density?: TableDensity;
  dense?: boolean;
  sortKey?: string;
  sortDir?: TableSortDirection;
  selectedKey?: string;
  expandedKey?: string;
  renderDetail?: (row: TableRow) => ReactNode;
  onSortChange?: (sort: TableSort, event: TableSortEvent) => void;
  onRowSelect?: (key: string, event: TableRowSelectEvent) => void;
  onExpandedChange?: (key: string, event: TableExpandedEvent) => void;
}

export interface TableComponent extends ForwardRefExoticComponent<TableProps & RefAttributes<HTMLDivElement>> {
  displayName: "Table";
  platformContract: typeof tablePlatformContract;
}

function sortValue(row: TableRow, column: TableColumn): string | number | null | undefined | TableCellValue {
  if (typeof column.sortValue === "function") return column.sortValue(row);
  return row[column.key];
}

function isTableBadgeCell(value: TableCellValue): value is TableBadgeCell {
  return Boolean(value && typeof value === "object" && !React.isValidElement(value) && "label" in value);
}

function badgeVariantFor(variant: TableBadgeCell["variant"]): "status" | "count" | "dot" | "icon" {
  if (variant === "counter") return "count";
  if (variant === "indicator") return "dot";
  if (variant === "soft" || variant === "strong") return "status";
  return variant ?? "status";
}

function normalizedColumnAlignment(align: TableColumn["align"]): "right" | undefined {
  return align === "right" ? "right" : undefined;
}

function normalizedColumnPriority(priority: TableColumn["priority"]): "primary" | "secondary" | "tertiary" | undefined {
  return priority && validColumnPriorities.has(priority) ? priority : undefined;
}

function rowDataLabel(row: TableRow, key: string): string {
  const label = row.label ?? row.plate ?? key;
  return typeof label === "string" || typeof label === "number" ? String(label) : key;
}

function renderCell(value: TableCellValue, inheritedDensity: FlowDensity | undefined): ReactNode {
  if (React.isValidElement(value)) return value;
  if (isTableBadgeCell(value)) {
    return React.createElement(Badge, {
      label: value.label,
      tone: value.tone ?? "neutral",
      variant: badgeVariantFor(value.variant),
      icon: value.icon ?? "",
      ...(inheritedDensity ? { density: inheritedDensity } : {}),
    });
  }
  return value ?? "";
}

export const Table = forwardRef<HTMLDivElement, TableProps>(function Table({
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
  const resolvedVariant = (dense ? "dense" : normalizeFlowValue(variant, validVariants, "standard")) as TableVariant;
  const initialState = normalizeFlowValue(state, validStates, "default") as TableState;
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedColumns = useMemo<TableColumn[]>(() => (Array.isArray(columns) ? columns : []).filter((column) => column?.key && column?.label), [columns]);
  const resolvedRows = useMemo<TableRow[]>(() => (Array.isArray(rows) ? rows : []).filter((row) => {
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
  const [internalSort, setInternalSort] = useState<TableSort>({ key: sortKey ?? "", direction: sortDir });
  const [internalSelected, setInternalSelected] = useState<string>(String(selectedKey ?? ""));
  const [internalExpanded, setInternalExpanded] = useState<string>(String(expandedKey ?? ""));
  const currentSort = isSortControlled ? { key: sortKey ?? "", direction: sortDir } : internalSort;
  const currentSelected = isSelectedKeyControlled ? String(selectedKey ?? "") : internalSelected;
  const currentExpanded = isExpandedKeyControlled ? String(expandedKey ?? "") : internalExpanded;

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

  const changeSort = (key: string, event: TableSortEvent): void => {
    const direction = currentSort.key === key && currentSort.direction !== "descending" ? "descending" : "ascending";
    if (!isSortControlled) setInternalSort({ key, direction });
    onSortChange?.({ key, direction }, event);
  };
  const selectRow = (key: string, event: TableRowSelectEvent): void => {
    if (!isSelectedKeyControlled) setInternalSelected(String(key));
    onRowSelect?.(String(key), event);
  };
  const toggleExpanded = (key: string, event: TableExpandedEvent): void => {
    const next = currentExpanded === String(key) ? "" : String(key);
    if (!isExpandedKeyControlled) setInternalExpanded(next);
    onExpandedChange?.(next, event);
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
                "data-align": normalizedColumnAlignment(column.align),
                "data-priority": normalizedColumnPriority(column.priority),
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
                    onClick: (event: MouseEvent<HTMLButtonElement>) => changeSort(column.key, event),
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
        sortedRows.flatMap<ReactElement>((row, index) => {
          const key = String(row[rowKey]);
          const selected = currentSelected === key;
          const expanded = currentExpanded === key;
          const expandLabel = typeof getExpandLabel === "function" ? getExpandLabel(row, { expanded, key }) : undefined;
          const detail = typeof renderDetail === "function" ? renderDetail(row) : renderCell(row.detail, resolvedDensity);
          const rowCanExpand = canRenderExpanders && Boolean(expandLabel) && detail !== undefined && detail !== null && detail !== "";
          const interactive = selectable || rowCanExpand;
          const rowNode = React.createElement(
            "tr",
            {
              key,
              "data-key": key,
              "data-label": rowDataLabel(row, key),
              "data-selected": String(selected),
              ...flowStateProps(initialState === "hover" && index === 0 ? "hover" : initialState === "focus" && index === 0 ? "focus" : undefined),
              tabIndex: interactive ? 0 : undefined,
              "aria-expanded": rowCanExpand ? String(expanded) : undefined,
              onClick: selectable ? (event: MouseEvent<HTMLTableRowElement>) => selectRow(key, event) : undefined,
              onKeyDown: interactive ? (event: KeyboardEvent<HTMLTableRowElement>) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                if (rowCanExpand) toggleExpanded(key, event);
                else selectRow(key, event);
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
                  onClick: (event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    toggleExpanded(key, event);
                  },
                },
                "chevron_right",
              ),
            ) : null,
            resolvedColumns.map((column) => React.createElement(
              "td",
              {
                key: column.key,
                "data-align": normalizedColumnAlignment(column.align),
                "data-mono": column.mono ? "true" : undefined,
                "data-priority": normalizedColumnPriority(column.priority),
              },
              renderCell(typeof column.render === "function" ? column.render(row) : row[column.key], resolvedDensity),
            )),
          );
          if (!rowCanExpand) return [rowNode];
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
}) as TableComponent;

Table.displayName = "Table";
Table.platformContract = tablePlatformContract;
