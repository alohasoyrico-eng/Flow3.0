import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type BackofficeApprovalState =
  | "default"
  | "pending-review"
  | "document-selected"
  | "detail-open"
  | "deciding"
  | "loading"
  | "error"
  | "disabled";
export type BackofficeApprovalDensity = BadgeDensity;

export interface BackofficeApprovalDocument {
  key?: string;
  id?: string;
  account?: string;
  who?: string;
  owner?: string;
  document?: string;
  doc?: string;
  label?: string;
  submitted?: string;
  status?: string;
  file?: string;
}

export type BackofficeApprovalSummary = Partial<BadgeProps> & {
  key?: string;
  label: string;
};

export type BackofficeApprovalQueue = Partial<DenseOperationalListProps>;
export type BackofficeApprovalDetail = Partial<DrawerAdapterProps>;
export type BackofficeApprovalFeedback = Partial<StatusFeedbackViewProps>;

export interface BackofficeApprovalProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: BackofficeApprovalDensity;
  state?: BackofficeApprovalState;
  disabled?: boolean;
  loading?: boolean;
  deciding?: boolean;
  error?: VirtualDataTableProps["error"];
  selectedDocumentKey?: string;
  detailOpen?: boolean;
  summaries?: BackofficeApprovalSummary[];
  documents?: BackofficeApprovalDocument[];
  queue?: BackofficeApprovalQueue;
  detail?: BackofficeApprovalDetail;
  feedback?: BackofficeApprovalFeedback;
  className?: string;
  onDocumentSearchChange?: DenseOperationalListProps["onSearchChange"];
  onDocumentFilterRemove?: DenseOperationalListProps["onFilterRemove"];
  onDocumentFiltersReset?: DenseOperationalListProps["onFiltersReset"];
  onDocumentSortChange?: DenseOperationalListProps["onSortChange"];
  onDocumentSelect?: DenseOperationalListProps["onRowSelect"];
  onDocumentPageChange?: DenseOperationalListProps["onPageChange"];
  onDocumentBulkAction?: DenseOperationalListProps["onBulkAction"];
  onDetailOpenChange?: DrawerAdapterProps["onOpenChange"];
  onDetailAction?: DrawerAdapterProps["onAction"];
  onApprove?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onReject?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface BackofficeApprovalComponent extends ForwardRefExoticComponent<BackofficeApprovalProps & RefAttributes<HTMLDivElement>> {
  displayName: "BackofficeApproval";
}

export const BackofficeApproval: BackofficeApprovalComponent;
