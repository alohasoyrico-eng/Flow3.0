import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateAction, EmptyStateVariant } from "../EmptyState.js";
import type { ErrorPanelAction, ErrorPanelTone, ErrorPanelVariant } from "../ErrorPanel.js";
import type { PaginationDensity } from "../Pagination.js";
import type { TableColumn, TableDensity, TableRow, TableSortDirection, TableSortEvent, TableRowSelectEvent } from "../Table.js";
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
  onSelectionChange?: (key: string, checked: boolean, meta: { value: string; indeterminate: boolean }, event: ChangeEvent<HTMLInputElement>) => void;
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

export const VirtualDataTable: VirtualDataTableComponent;
