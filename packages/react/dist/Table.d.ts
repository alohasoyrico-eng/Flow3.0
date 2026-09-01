import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { tablePlatformContract } from "#flow/platforms";

export type TableVariant = "standard" | "dense" | "sortable" | "selectable" | "expandable";
export type TableState = "default" | "hover" | "focus" | "selected" | "sorted" | "expanded";
export type TableDensity = "sm" | "md" | "lg";
export type TableSurface = "card" | "embedded";
export type TableSortDirection = "ascending" | "descending";
export type TableColumnAlign = "left" | "center" | "right";
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
export type TableDefaultSort = {
  key: string;
  direction?: TableSortDirection;
  dir?: 1 | -1;
};
export type TableSortEvent = MouseEvent<HTMLButtonElement>;
export type TableRowSelectEvent = MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;
export type TableRowClickEvent = MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;
export type TableExpandedEvent = MouseEvent<HTMLButtonElement> | MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>;
export type TableSelectionEvent = React.ChangeEvent<HTMLInputElement>;
export type TableCellEditEvent = React.FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>;

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
  onSelectionChange?: (keys: string[], event: TableSelectionEvent) => void;
  onCellEdit?: (key: string, columnKey: string, value: string, event: TableCellEditEvent) => void;
}

export interface TableComponent extends ForwardRefExoticComponent<TableProps & RefAttributes<HTMLDivElement>> {
  displayName: "Table";
  platformContract: typeof tablePlatformContract;
}

export const Table: TableComponent;
