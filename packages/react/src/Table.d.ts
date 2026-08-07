import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import type { tablePlatformContract } from "@design-system/components/platforms";

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

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  columns: TableColumn[];
  rows: TableRow[];
  rowKey?: string;
  label?: string;
  variant?: TableVariant;
  state?: TableState;
  density?: TableDensity;
  dense?: boolean;
  sortKey?: string;
  sortDir?: TableSortDirection;
  selectedKey?: string;
  expandedKey?: string;
  renderDetail?: (row: TableRow) => ReactNode;
  onSortChange?: (sort: TableSort) => void;
  onRowSelect?: (key: string) => void;
  onExpandedChange?: (key: string) => void;
}

export interface TableComponent extends ForwardRefExoticComponent<TableProps & RefAttributes<HTMLDivElement>> {
  displayName: "Table";
  platformContract: typeof tablePlatformContract;
}

export const Table: TableComponent;
