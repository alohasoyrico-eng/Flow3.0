import React, { forwardRef } from "react";
import type { ChangeEvent, ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxValueMeta } from "../Checkbox.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction, EmptyStateVariant } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelAction, ErrorPanelTone, ErrorPanelVariant } from "../ErrorPanel.js";
import { Pagination } from "../Pagination.js";
import type { PaginationDensity } from "../Pagination.js";
import { Skeleton } from "../Skeleton.js";
import { Table } from "../Table.js";
import type { TableColumn, TableDensity, TableRow, TableRowSelectEvent, TableSortDirection, TableSortEvent } from "../Table.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type VirtualDataTableState =
  | "default"
  | "loading"
  | "empty"
  | "error"
  | "selected"
  | "paginated"
  | "virtualized"
  | "disabled";
export type VirtualDataTableDensity = TableDensity | PaginationDensity;

export interface VirtualDataTableSelection {
  enabled?: boolean;
  label?: string;
  rowLabel?: string;
  onSelectionChange?: (key: string, checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface VirtualDataTablePagination {
  label?: string;
  pageSize?: number;
  previousLabel?: string;
  nextLabel?: string;
  getPageLabel?: (page: number) => string;
}

export interface VirtualDataTableEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  variant?: EmptyStateVariant;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface VirtualDataTableErrorState {
  label?: string;
  description?: string;
  action?: ErrorPanelAction;
  tone?: ErrorPanelTone;
  variant?: ErrorPanelVariant;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface VirtualDataTableBulkAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key?: string;
  label: string;
}

export interface VirtualDataTableProps extends FlowDataAttributes {
  label: string;
  description?: string;
  density?: VirtualDataTableDensity;
  state?: VirtualDataTableState;
  disabled?: boolean;
  loading?: boolean;
  virtualized?: boolean;
  columns?: TableColumn[];
  rows?: TableRow[];
  rowKey?: string;
  selectedKeys?: string[];
  selectedKey?: string;
  sortKey?: string;
  sortDir?: TableSortDirection;
  page?: number;
  pageCount?: number;
  pagination?: VirtualDataTablePagination;
  empty?: VirtualDataTableEmptyState;
  error?: VirtualDataTableErrorState;
  selection?: VirtualDataTableSelection;
  bulkActions?: VirtualDataTableBulkAction[];
  onSortChange?: (sort: { key: string; direction: TableSortDirection }, event: TableSortEvent) => void;
  onRowSelect?: (key: string, event: TableRowSelectEvent | ChangeEvent<HTMLInputElement>) => void;
  onPageChange?: (page: number, event: MouseEvent<HTMLButtonElement>) => void;
  onBulkAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface VirtualDataTableComponent extends ForwardRefExoticComponent<VirtualDataTableProps & RefAttributes<HTMLDivElement>> {
  displayName: "VirtualDataTable";
}

type VirtualDataTableRestProps = Record<string, unknown>;

interface VirtualDataTableStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  error?: VirtualDataTableErrorState | undefined;
  rows: TableRow[];
  state?: VirtualDataTableState | undefined;
}

function sanitizeRestProps(rest: VirtualDataTableRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({ disabled, loading, error, rows, state }: VirtualDataTableStateInput): VirtualDataTableState {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (!rows.length) return "empty";
  if (state) return state;
  return "default";
}

function normalizeRows(rows: TableRow[] | undefined, rowKey: string): TableRow[] {
  return (Array.isArray(rows) ? rows : []).filter((row) => row?.[rowKey] !== undefined && row?.[rowKey] !== null);
}

function normalizeColumns(columns: TableColumn[] | undefined): TableColumn[] {
  return (Array.isArray(columns) ? columns : []).filter((column): column is TableColumn => Boolean(column?.key && column.label));
}

function rowLabel(row: TableRow, key: string): string {
  const label = row.label;
  return typeof label === "string" || typeof label === "number" ? String(label) : key;
}

export const VirtualDataTable = forwardRef<HTMLDivElement, VirtualDataTableProps>(function VirtualDataTable({
  label,
  description,
  density,
  state,
  disabled = false,
  loading = false,
  virtualized = false,
  columns = [],
  rows = [],
  rowKey = "id",
  selectedKeys = [],
  selectedKey,
  sortKey,
  sortDir,
  page = 1,
  pageCount = 1,
  pagination,
  empty,
  error,
  selection,
  bulkActions = [],
  onSortChange,
  onRowSelect,
  onPageChange,
  onBulkAction,
  className = "",
  ...rest
}, ref) {
  const normalizedColumns = normalizeColumns(columns);
  const normalizedRows = normalizeRows(rows, rowKey);
  const resolvedState = resolveState({ disabled, loading, error, rows: normalizedRows, state });
  const selectedSet = new Set((Array.isArray(selectedKeys) ? selectedKeys : []).map(String));
  const selectedCount = selectedSet.size || (selectedKey ? 1 : 0);
  const isDisabled = disabled || resolvedState === "disabled";

  if (!label) return null;

  const tableColumns: TableColumn[] = selection?.enabled
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
          } as ComponentProps<typeof Checkbox>);
        },
      },
      ...normalizedColumns,
    ]
    : normalizedColumns;

  return React.createElement(
    "div",
    {
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
    },
    description ? React.createElement(Badge, {
      label: description,
      tone: selectedCount ? "info" : "neutral",
      variant: "status",
      density,
      state: isDisabled ? "disabled" : "default",
    } as ComponentProps<typeof Badge>) : null,
    selectedCount ? React.createElement(Badge, {
      label: `${selectedCount} selected`,
      tone: "info",
      variant: "count",
      density,
      live: true,
    } as ComponentProps<typeof Badge>) : null,
    resolvedState === "loading"
      ? React.createElement(Skeleton, {
        label: `${label} loading`,
        variant: "table",
        rows: Math.max(1, pagination?.pageSize ?? 5),
        columns: Math.max(1, normalizedColumns.length),
        state: "loading",
        density,
        fullWidth: true,
      } as ComponentProps<typeof Skeleton>)
      : null,
    resolvedState === "error"
      ? React.createElement(ErrorPanel, {
        label: error?.label ?? `${label} unavailable`,
        description: error?.description,
        action: error?.action,
        tone: error?.tone ?? "error",
        variant: error?.variant ?? "inline",
        state: "error",
        density,
        onAction: error?.onAction,
      } as ComponentProps<typeof ErrorPanel>)
      : null,
    resolvedState === "empty"
      ? React.createElement(EmptyState, {
        title: empty?.title ?? `${label} has no rows`,
        description: empty?.description,
        icon: empty?.icon,
        action: empty?.action,
        variant: empty?.variant ?? "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      } as ComponentProps<typeof EmptyState>)
      : null,
    normalizedRows.length && resolvedState !== "loading" && resolvedState !== "error"
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
      } as ComponentProps<typeof Table>)
      : null,
    (Array.isArray(bulkActions) ? bulkActions : []).filter((action) => action?.label).map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || selectedCount === 0 || action.disabled,
      loading: action.loading,
      onClick: (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onBulkAction?.(action.key ?? action.label, event);
      },
    } as ComponentProps<typeof Button>)),
    pageCount > 1
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
      } as ComponentProps<typeof Pagination>)
      : null,
  );
}) as VirtualDataTableComponent;

VirtualDataTable.displayName = "VirtualDataTable";
