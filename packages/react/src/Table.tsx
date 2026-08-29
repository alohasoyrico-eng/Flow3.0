import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
  type CSSProperties,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { tablePlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Checkbox } from "./Checkbox.js";
import { EmptyState } from "./EmptyState.js";
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
const validColumnAlignments = new Set(["center", "right"]);
const validColumnPriorities = new Set(["primary", "secondary", "tertiary"]);
const validSurfaces = new Set(["card", "embedded"]);

export type TableVariant = "standard" | "dense" | "sortable" | "selectable" | "expandable";
export type TableState = "default" | "hover" | "focus" | "selected" | "sorted" | "expanded";
export type TableDensity = "sm" | "md" | "lg";
export type TableSurface = "card" | "embedded";
export type TableSortDirection = "ascending" | "descending";
export type TableColumnAlign = "left" | "center" | "right";
export type TableColumnPriority = "primary" | "secondary" | "tertiary";
type TableDynamicStyle = CSSProperties & Record<"--comp-table-column-width" | "--comp-table-tree-depth", string>;

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
export type TableDefaultSort = {
  key: string;
  direction?: TableSortDirection;
  dir?: 1 | -1;
};
export type TableSortEvent = MouseEvent<HTMLButtonElement>;
export type TableRowSelectEvent = MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;
export type TableRowClickEvent = MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;
export type TableExpandedEvent = MouseEvent<HTMLButtonElement> | MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: TableColumnAlign;
  mono?: boolean;
  priority?: TableColumnPriority;
  width?: string | number;
  editable?: boolean;
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
  surface?: TableSurface;
  dense?: boolean;
  zebra?: boolean;
  stickyHeader?: boolean;
  emptyLabel?: string;
  emptyDescription?: string;
  emptyIcon?: string;
  tree?: boolean;
  childrenKey?: string;
  selection?: string[];
  sortKey?: string;
  sortDir?: TableSortDirection;
  defaultSort?: TableDefaultSort;
  selectedKey?: string;
  expandedKey?: string;
  defaultExpandedKey?: string;
  renderDetail?: (row: TableRow) => ReactNode;
  onSortChange?: (sort: TableSort, event: TableSortEvent) => void;
  onRowSelect?: (key: string, event: TableRowSelectEvent) => void;
  onRowClick?: (row: TableRow, event: TableRowClickEvent) => void;
  onExpandedChange?: (key: string, event: TableExpandedEvent) => void;
  onSelectionChange?: (keys: string[]) => void;
  onCellEdit?: (key: string, columnKey: string, value: string) => void;
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

function normalizedColumnAlignment(align: TableColumn["align"]): "center" | "right" | undefined {
  return align && validColumnAlignments.has(align) ? align as "center" | "right" : undefined;
}

function normalizedColumnPriority(priority: TableColumn["priority"]): "primary" | "secondary" | "tertiary" | undefined {
  return priority && validColumnPriorities.has(priority) ? priority : undefined;
}

function rowDataLabel(row: TableRow, key: string): string {
  const label = row.label ?? row.plate ?? key;
  return typeof label === "string" || typeof label === "number" ? String(label) : key;
}

function rowKeyFor(row: TableRow, rowKey: string, index: number): string {
  const key = row?.[rowKey];
  if (key !== undefined && key !== null && key !== "") return String(key);
  if (row.__group) return `group-${String(row.__group)}`;
  return String(index);
}

function tableCellStyle(width: TableColumn["width"], depth?: number): CSSProperties | undefined {
  if (width === undefined && depth === undefined) return undefined;
  const dynamicStyle = {} as TableDynamicStyle;
  if (width !== undefined) {
    dynamicStyle["--comp-table-column-width"] = typeof width === "number" ? `${width}px` : width;
  }
  if (depth !== undefined) {
    dynamicStyle["--comp-table-tree-depth"] = String(depth);
  }
  return dynamicStyle;
}

function tableDensityProps(density: FlowDensity | undefined): { density: FlowDensity } | Record<string, never> {
  return density ? { density } : {};
}

function renderCell(value: TableCellValue, inheritedDensity: FlowDensity | undefined): ReactNode {
  if (React.isValidElement(value)) return value;
  if (isTableBadgeCell(value)) {
    return React.createElement(Badge, {
      label: value.label,
      tone: value.tone ?? "neutral",
      variant: badgeVariantFor(value.variant),
      icon: value.icon ?? "",
      ...tableDensityProps(inheritedDensity),
    });
  }
  return value ?? "";
}

function normalizeDefaultSort(defaultSort: TableDefaultSort | undefined): TableSort {
  if (!defaultSort?.key) return { key: "", direction: "ascending" };
  const direction = defaultSort.direction ?? (defaultSort.dir === -1 ? "descending" : "ascending");
  return { key: defaultSort.key, direction };
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
  surface = "card",
  dense = false,
  zebra = false,
  stickyHeader = false,
  emptyLabel = "",
  emptyDescription = "",
  emptyIcon = "search_off",
  tree = false,
  childrenKey = "children",
  selection,
  sortKey,
  sortDir = "ascending",
  defaultSort,
  selectedKey,
  expandedKey,
  defaultExpandedKey,
  renderDetail,
  onSortChange,
  onRowSelect,
  onRowClick,
  onExpandedChange,
  onSelectionChange,
  onCellEdit,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = (dense ? "dense" : normalizeFlowValue(variant, validVariants, "standard")) as TableVariant;
  const resolvedSurface = normalizeFlowValue(surface, validSurfaces, "card") as TableSurface;
  const initialState = normalizeFlowValue(state, validStates, "default") as TableState;
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedColumns = useMemo<TableColumn[]>(() => (Array.isArray(columns) ? columns : []).filter((column) => column?.key && column?.label), [columns]);
  const resolvedRows = useMemo<TableRow[]>(() => (Array.isArray(rows) ? rows : []).filter((row) => {
    if (row?.__group) return true;
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
  const [internalSort, setInternalSort] = useState<TableSort>(() => sortKey ? { key: sortKey, direction: sortDir } : normalizeDefaultSort(defaultSort));
  const [internalSelected, setInternalSelected] = useState<string>(String(selectedKey ?? ""));
  const [internalExpanded, setInternalExpanded] = useState<string>(String(expandedKey ?? defaultExpandedKey ?? ""));
  const [editCell, setEditCell] = useState<{ key: string; columnKey: string; value: string } | null>(null);
  const currentSort = isSortControlled ? { key: sortKey ?? "", direction: sortDir } : internalSort;
  const currentSelected = isSelectedKeyControlled ? String(selectedKey ?? "") : internalSelected;
  const currentExpanded = isExpandedKeyControlled ? String(expandedKey ?? "") : internalExpanded;
  const selectedKeys = new Set((selection ?? []).map(String));

  const sortedRows = useMemo(() => {
    if (!currentSort.key) return [...resolvedRows];
    const column = resolvedColumns.find((item) => item.key === currentSort.key);
    if (!column) return [...resolvedRows];
    const direction = currentSort.direction === "descending" ? -1 : 1;
    return [...resolvedRows].sort((a, b) => {
      if (a.__group || b.__group) return 0;
      const aValue = sortValue(a, column);
      const bValue = sortValue(b, column);
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") return (aValue - bValue) * direction;
      return String(aValue).localeCompare(String(bValue), "en") * direction;
    });
  }, [currentSort.direction, currentSort.key, resolvedColumns, resolvedRows]);

  const visibleRows = useMemo(() => {
    if (!tree) return sortedRows.map((row, index) => ({ row, depth: 0, index }));
    const output: Array<{ row: TableRow; depth: number; index: number }> = [];
    const walk = (items: TableRow[], depth: number) => {
      items.forEach((row, index) => {
        output.push({ row, depth, index: output.length });
        const key = rowKeyFor(row, rowKey, index);
        const children = Array.isArray(row[childrenKey]) ? row[childrenKey] as TableRow[] : [];
        if (children.length && currentExpanded === key) walk(children, depth + 1);
      });
    };
    walk(sortedRows, 0);
    return output;
  }, [childrenKey, currentExpanded, rowKey, sortedRows, tree]);

  const selectableRowKeys = visibleRows.filter(({ row }) => !row.__group).map(({ row, index }) => rowKeyFor(row, rowKey, index));
  const allSelected = bulkSelectable && selectableRowKeys.length > 0 && selectableRowKeys.every((key) => selectedKeys.has(key));
  const someSelected = bulkSelectable && selectableRowKeys.some((key) => selectedKeys.has(key)) && !allSelected;
  const interactionState = currentExpanded ? "expanded" : currentSort.key ? "sorted" : currentSelected ? "selected" : initialState;
  if (!label || !resolvedColumns.length) return null;

  const changeSort = (key: string, event: TableSortEvent): void => {
    const direction = currentSort.key === key && currentSort.direction !== "descending" ? "descending" : "ascending";
    if (!isSortControlled) setInternalSort({ key, direction });
    onSortChange?.({ key, direction }, event);
  };
  const selectRow = (key: string, event: TableRowSelectEvent): void => {
    if (!isSelectedKeyControlled) setInternalSelected(String(key));
    onRowSelect?.(String(key), event);
  };
  const clickRow = (row: TableRow, event: TableRowClickEvent): void => {
    onRowClick?.(row, event);
  };
  const toggleExpanded = (key: string, event: TableExpandedEvent): void => {
    const next = currentExpanded === String(key) ? "" : String(key);
    if (!isExpandedKeyControlled) setInternalExpanded(next);
    onExpandedChange?.(next, event);
  };
  const toggleSelection = (key: string, checked: boolean): void => {
    const next = new Set(selectedKeys);
    if (checked) next.add(key);
    else next.delete(key);
    onSelectionChange?.(selectableRowKeys.filter((item) => next.has(item)));
  };
  const toggleAllSelection = (checked: boolean): void => {
    onSelectionChange?.(checked ? selectableRowKeys : []);
  };
  const commitCellEdit = (): void => {
    if (!editCell) return;
    onCellEdit?.(editCell.key, editCell.columnKey, editCell.value);
    setEditCell(null);
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
      "data-surface": resolvedSurface,
      "data-zebra": zebra ? "true" : undefined,
      "data-sticky": stickyHeader ? "true" : undefined,
    },
    React.createElement(
      "table",
      { "aria-label": label, role: tree ? "treegrid" : undefined },
      React.createElement(
        "colgroup",
        null,
        bulkSelectable ? React.createElement("col", { className: "table__selection-col" }) : null,
        hasExpanderColumn ? React.createElement("col", { className: "table__expander-col" }) : null,
        resolvedColumns.map((column) => React.createElement("col", { key: column.key, style: tableCellStyle(column.width) })),
      ),
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          bulkSelectable ? React.createElement(
            "th",
            { className: "table__selection-head", scope: "col" },
            React.createElement(Checkbox, {
              label: "Select all rows",
              variant: "select-all",
              checked: allSelected,
              indeterminate: someSelected,
              onCheckedChange: (checked) => toggleAllSelection(checked),
              ...tableDensityProps(resolvedDensity),
            }),
          ) : null,
          hasExpanderColumn ? React.createElement(
            "th",
            { className: "table__expander-head", scope: "col" },
            React.createElement("span", { className: "table__expander-label" }, tree ? "Hierarchy" : "Details"),
          ) : null,
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
                style: tableCellStyle(column.width),
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
        visibleRows.length === 0
          ? React.createElement(
            "tr",
            { className: "table__empty-row" },
            React.createElement(
              "td",
              { className: "table__empty", colSpan: resolvedColumns.length + (bulkSelectable ? 1 : 0) + (hasExpanderColumn ? 1 : 0) },
              React.createElement(EmptyState, {
                title: emptyLabel || "No rows available",
                icon: emptyIcon,
                variant: "search-empty",
                state: "search-empty",
                fullWidth: true,
                ...tableDensityProps(resolvedDensity),
                ...(emptyDescription ? { description: emptyDescription } : {}),
              }),
            ),
          )
          : visibleRows.flatMap<ReactElement>(({ row, depth, index }) => {
          const key = rowKeyFor(row, rowKey, index);
          if (row.__group) {
            return [React.createElement(
              "tr",
              { key, className: "table__group-row", "data-group-row": "true" },
              React.createElement("td", { className: "table__group", colSpan: resolvedColumns.length + (bulkSelectable ? 1 : 0) + (hasExpanderColumn ? 1 : 0) }, String(row.__group)),
            )];
          }
          const selected = currentSelected === key;
          const checked = selectedKeys.has(key);
          const expanded = currentExpanded === key;
          const expandLabel = typeof getExpandLabel === "function" ? getExpandLabel(row, { expanded, key }) : undefined;
          const detail = typeof renderDetail === "function" ? renderDetail(row) : renderCell(row.detail, resolvedDensity);
          const treeChildren = tree && Array.isArray(row[childrenKey]) ? row[childrenKey] as TableRow[] : [];
          const rowHasDetail = canRenderExpanders && Boolean(expandLabel) && detail !== undefined && detail !== null && detail !== "";
          const rowCanExpand = rowHasDetail || treeChildren.length > 0;
          const resolvedExpandLabel = expandLabel ?? `${expanded ? "Collapse" : "Expand"} ${rowDataLabel(row, key)}`;
          const interactive = selectable || rowCanExpand || Boolean(onRowClick);
          const activateRowClick = (event: MouseEvent<HTMLTableRowElement>): void => {
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
            if (selectable) selectRow(key, event);
          };
          const activateRowKey = (event: KeyboardEvent<HTMLTableRowElement>): void => {
            if (onRowClick) {
              clickRow(row, event);
              return;
            }
            if (rowCanExpand) {
              toggleExpanded(key, event);
              return;
            }
            if (selectable) selectRow(key, event);
          };
          const rowNode = React.createElement(
            "tr",
            {
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
              onKeyDown: interactive ? (event: KeyboardEvent<HTMLTableRowElement>) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                activateRowKey(event);
              } : undefined,
            },
            bulkSelectable ? React.createElement(
              "td",
              { className: "table__selection-cell", onClick: (event: MouseEvent<HTMLTableCellElement>) => event.stopPropagation() },
              React.createElement(Checkbox, {
                label: `Select ${rowDataLabel(row, key)}`,
                variant: "compact",
                checked,
                onCheckedChange: (nextChecked) => toggleSelection(key, nextChecked),
                ...tableDensityProps(resolvedDensity),
              }),
            ) : null,
            hasExpanderColumn ? React.createElement(
              "td",
              { className: "table__expander-cell", style: tableCellStyle(undefined, depth) },
              rowCanExpand ? React.createElement(
                "button",
                {
                  type: "button",
                  className: "table__expander",
                  "data-table-expand": "",
                  "aria-label": resolvedExpandLabel,
                  "aria-expanded": String(expanded),
                  onClick: (event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    toggleExpanded(key, event);
                  },
                },
                "chevron_right",
              ) : null,
            ) : null,
            resolvedColumns.map((column) => React.createElement(
              "td",
              {
                key: column.key,
                "data-align": normalizedColumnAlignment(column.align),
                "data-mono": column.mono ? "true" : undefined,
                "data-priority": normalizedColumnPriority(column.priority),
                onDoubleClick: column.editable && onCellEdit ? () => setEditCell({ key, columnKey: column.key, value: String(row[column.key] ?? "") }) : undefined,
                style: tableCellStyle(column.width, tree ? depth : undefined),
              },
              editCell?.key === key && editCell.columnKey === column.key
                ? React.createElement("input", {
                  className: "table__edit-input",
                  autoFocus: true,
                  value: editCell.value,
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => setEditCell({ ...editCell, value: event.currentTarget.value }),
                  onBlur: commitCellEdit,
                  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitCellEdit();
                    }
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setEditCell(null);
                    }
                  },
                })
                : renderCell(typeof column.render === "function" ? column.render(row) : row[column.key], resolvedDensity),
            )),
          );
          if (!rowHasDetail) return [rowNode];
          return [
            rowNode,
            React.createElement(
              "tr",
              { key: `${key}-detail`, className: "table__detail-row", hidden: !expanded },
              React.createElement("td", { className: "table__detail", colSpan: resolvedColumns.length + (bulkSelectable ? 1 : 0) + (hasExpanderColumn ? 1 : 0) }, detail),
            ),
          ];
        }),
      ),
    ),
  );
}) as TableComponent;

Table.displayName = "Table";
Table.platformContract = tablePlatformContract;
