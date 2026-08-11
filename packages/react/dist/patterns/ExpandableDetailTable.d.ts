import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type ExpandableDetailTableState =
  | "default"
  | "expanded"
  | "detail-open"
  | "loading"
  | "empty"
  | "error"
  | "disabled";
export type ExpandableDetailTableDensity = BadgeDensity;

export type ExpandableDetailTableSummary = Partial<BadgeProps> & {
  key?: string;
  label: string;
};
export type ExpandableDetailTableTable = Partial<VirtualDataTableProps>;
export type ExpandableDetailTableDetail = Partial<DrawerAdapterProps>;
export type ExpandableDetailTableFeedback = Partial<StatusFeedbackViewProps>;

export interface ExpandableDetailTableProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: ExpandableDetailTableDensity;
  state?: ExpandableDetailTableState;
  disabled?: boolean;
  loading?: boolean;
  error?: VirtualDataTableProps["error"];
  expandedRowKey?: string;
  detailOpen?: boolean;
  summaries?: ExpandableDetailTableSummary[];
  table?: ExpandableDetailTableTable;
  detail?: ExpandableDetailTableDetail;
  feedback?: ExpandableDetailTableFeedback;
  className?: string;
  onTableSortChange?: VirtualDataTableProps["onSortChange"];
  onTableRowSelect?: VirtualDataTableProps["onRowSelect"];
  onTablePageChange?: VirtualDataTableProps["onPageChange"];
  onTableBulkAction?: VirtualDataTableProps["onBulkAction"];
  onDetailOpenChange?: DrawerAdapterProps["onOpenChange"];
  onDetailAction?: DrawerAdapterProps["onAction"];
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ExpandableDetailTableComponent extends ForwardRefExoticComponent<ExpandableDetailTableProps & RefAttributes<HTMLDivElement>> {
  displayName: "ExpandableDetailTable";
}

export const ExpandableDetailTable: ExpandableDetailTableComponent;
