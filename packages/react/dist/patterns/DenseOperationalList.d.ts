import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import type { BulkActionsProps } from "./BulkActions.js";
import type { FilterChipGroupProps } from "./FilterChipGroup.js";
import type { SearchProps } from "./Search.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import type { ToolbarProps } from "./Toolbar.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type DenseOperationalListState = "default" | "filtered" | "selected" | "loading" | "empty" | "error" | "disabled";
export type DenseOperationalListDensity = BadgeDensity;

export type DenseOperationalListFilter = NonNullable<FilterChipGroupProps["filters"]>[number];
export type DenseOperationalListSearch = Partial<SearchProps>;
export type DenseOperationalListToolbar = Partial<ToolbarProps>;
export type DenseOperationalListTable = Partial<VirtualDataTableProps>;
export type DenseOperationalListBulkActions = Partial<BulkActionsProps>;
export type DenseOperationalListFeedback = Partial<StatusFeedbackViewProps>;

export interface DenseOperationalListProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DenseOperationalListDensity;
  state?: DenseOperationalListState;
  disabled?: boolean;
  loading?: boolean;
  error?: VirtualDataTableProps["error"];
  search?: DenseOperationalListSearch;
  filters?: DenseOperationalListFilter[];
  toolbar?: DenseOperationalListToolbar;
  table?: DenseOperationalListTable;
  bulkActions?: DenseOperationalListBulkActions;
  feedback?: DenseOperationalListFeedback;
  resultCount?: number;
  selectedKeys?: string[];
  className?: string;
  onSearchChange?: SearchProps["onQueryChange"];
  onFilterRemove?: FilterChipGroupProps["onRemoveFilter"];
  onFiltersReset?: FilterChipGroupProps["onReset"];
  onSortChange?: VirtualDataTableProps["onSortChange"];
  onRowSelect?: VirtualDataTableProps["onRowSelect"];
  onPageChange?: VirtualDataTableProps["onPageChange"];
  onBulkAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onToolbarOverflowSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DenseOperationalListComponent extends ForwardRefExoticComponent<DenseOperationalListProps & RefAttributes<HTMLDivElement>> {
  displayName: "DenseOperationalList";
}

export const DenseOperationalList: DenseOperationalListComponent;
