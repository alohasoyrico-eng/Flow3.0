import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import type { AdvancedFiltersProps } from "./AdvancedFilters.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type FilterableEditableTableState =
  | "default"
  | "filters-open"
  | "filtered"
  | "selected"
  | "editing"
  | "loading"
  | "empty"
  | "error"
  | "disabled";
export type FilterableEditableTableDensity = BadgeDensity;

export type FilterableEditableTableMetric = Partial<BadgeProps> & {
  key?: string;
  label: string;
};
export type FilterableEditableTableFilters = Partial<AdvancedFiltersProps>;
export type FilterableEditableTableTable = Partial<VirtualDataTableProps>;
export type FilterableEditableTableEditor = Partial<DrawerAdapterProps>;
export type FilterableEditableTableFeedback = Partial<StatusFeedbackViewProps>;

export interface FilterableEditableTableProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FilterableEditableTableDensity;
  state?: FilterableEditableTableState;
  disabled?: boolean;
  loading?: boolean;
  error?: VirtualDataTableProps["error"];
  selectedRowKey?: string;
  editing?: boolean;
  metrics?: FilterableEditableTableMetric[];
  filters?: FilterableEditableTableFilters;
  table?: FilterableEditableTableTable;
  editor?: FilterableEditableTableEditor;
  feedback?: FilterableEditableTableFeedback;
  className?: string;
  onFilterDrawerOpenChange?: DrawerAdapterProps["onOpenChange"];
  onFilterApply?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFilterReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSavedFilterSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onTableSortChange?: VirtualDataTableProps["onSortChange"];
  onTableRowSelect?: VirtualDataTableProps["onRowSelect"];
  onTablePageChange?: VirtualDataTableProps["onPageChange"];
  onTableBulkAction?: VirtualDataTableProps["onBulkAction"];
  onEditorOpenChange?: DrawerAdapterProps["onOpenChange"];
  onEditorAction?: DrawerAdapterProps["onAction"];
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FilterableEditableTableComponent extends ForwardRefExoticComponent<FilterableEditableTableProps & RefAttributes<HTMLDivElement>> {
  displayName: "FilterableEditableTable";
}

export const FilterableEditableTable: FilterableEditableTableComponent;
