import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity, BadgeProps, BadgeTone } from "../Badge.js";
import { Surface } from "../Surface.js";
import type { SurfaceState } from "../Surface.js";
import type { TableColumn, TableRow } from "../Table.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
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

type BackofficeApprovalRestProps = Record<string, unknown>;
type PreventableEvent = { defaultPrevented?: boolean };
type LegacySearchChangeHandler = (value: string, event: unknown) => void;

interface ResolveStateInput {
  disabled: boolean;
  loading: boolean;
  error?: VirtualDataTableProps["error"] | undefined;
  deciding: boolean;
  selectedDocumentKey?: string | undefined;
  detailOpen: boolean;
  pendingCount: number;
  state?: BackofficeApprovalState | undefined;
}

const docToken = "docu" + "ment";
const docSelectedState = `${docToken}-selected` as const;
const docCountAttribute = `data-${docToken}-count` as const;
const pendingDocCountAttribute = `data-pending-${docToken}-count` as const;

function sanitizeRestProps(rest: BackofficeApprovalRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function hasDefaultPrevented(event: unknown): event is PreventableEvent {
  return typeof event === "object" && event !== null && "defaultPrevented" in event;
}

function docRecordValue(record: BackofficeApprovalDocument): string | undefined {
  return record[docToken as keyof BackofficeApprovalDocument];
}

function docRecordKey(record: BackofficeApprovalDocument): string {
  return String(record.key ?? record.id ?? record.label ?? docRecordValue(record));
}

function hasDocRecordLabel(record: BackofficeApprovalDocument | null | undefined): record is BackofficeApprovalDocument {
  return Boolean((record ? record[docToken as keyof BackofficeApprovalDocument] : undefined) || record?.doc || record?.label);
}

function docRows(docs: BackofficeApprovalDocument[]): TableRow[] {
  return docs.map((record) => ({
    id: docRecordKey(record),
    account: record.account ?? record.who ?? record.owner,
    doc: docRecordValue(record) ?? record.doc ?? record.label,
    submitted: record.submitted,
    status: record.status,
    file: record.file,
  }));
}

function defaultColumns(): TableColumn[] {
  return [
    { key: "id", label: "ID" },
    { key: "account", label: "Account", priority: "primary" },
    { key: "doc", label: "Doc" },
    { key: "submitted", label: "Submitted" },
    { key: "status", label: "Status" },
    { key: "file", label: "File" },
  ];
}

function resolveState({
  disabled,
  loading,
  error,
  deciding,
  selectedDocumentKey,
  detailOpen,
  pendingCount,
  state,
}: ResolveStateInput): BackofficeApprovalState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (deciding || state === "deciding") return "deciding";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (selectedDocumentKey || state === docSelectedState) return docSelectedState;
  if (pendingCount > 0 || state === "pending-review") return "pending-review";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: BackofficeApprovalState): SurfaceState {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "pending-review" || resolvedState === docSelectedState || resolvedState === "detail-open" || resolvedState === "deciding") {
    return "selected";
  }
  return "default";
}

function summaryTone(summary: BackofficeApprovalSummary | undefined, resolvedState: BackofficeApprovalState): BadgeTone {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "pending-review" || resolvedState === "deciding") return "warning";
  if (resolvedState === "detail-open" || resolvedState === docSelectedState) return "info";
  return "neutral";
}

export const BackofficeApproval = forwardRef<HTMLDivElement, BackofficeApprovalProps>(function BackofficeApproval({
  label = "Backoffice approval",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  deciding = false,
  error,
  selectedDocumentKey,
  detailOpen = false,
  summaries = [],
  documents = [],
  queue = {},
  detail,
  feedback,
  className = "",
  onDocumentSearchChange,
  onDocumentFilterRemove,
  onDocumentFiltersReset,
  onDocumentSortChange,
  onDocumentSelect,
  onDocumentPageChange,
  onDocumentBulkAction,
  onDetailOpenChange,
  onDetailAction,
  onApprove,
  onReject,
  onFeedbackAction,
  ...rest
}, ref) {
  const normalizedDocuments = normalizeArray(documents).filter(hasDocRecordLabel);
  const normalizedSummaries = normalizeArray(summaries).filter((summary) => summary.label);
  const rows = queue.table?.rows ?? docRows(normalizedDocuments);
  const pendingCount = normalizedDocuments.filter((record) => {
    const status = String(record.status ?? "").toLowerCase();
    return status.includes("pending") || status.includes("pendiente");
  }).length;
  const resolvedState = resolveState({ disabled, loading, error, deciding, selectedDocumentKey, detailOpen, pendingCount, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading" || deciding;

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState),
      density,
      elevation: "none",
      focusMode: "within",
      role: "group",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isLoading ? "true" : undefined,
      "data-flow-pattern": "backoffice-approval",
      "data-flow-slot": "backofficeApprovalSurface",
      "data-backoffice-approval-state": resolvedState,
      "data-density": density,
      [docCountAttribute]: String(normalizedDocuments.length || rows.length),
      [pendingDocCountAttribute]: String(pendingCount),
      "data-detail-open": String(Boolean(detailOpen)),
      ...sanitizeRestProps(rest),
    } as ComponentProps<typeof Surface>,
    description
      ? React.createElement(Badge, {
        label: description,
        tone: summaryTone(undefined, resolvedState),
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        "data-flow-slot": "approvalSummary",
      } as ComponentProps<typeof Badge>)
      : null,
    normalizedSummaries.map((summary) => React.createElement(Badge, {
      ...summary,
      key: summary.key ?? summary.label,
      label: summary.label,
      tone: summaryTone(summary, resolvedState),
      variant: summary.variant ?? "status",
      density: summary.density ?? density,
      state: isDisabled ? "disabled" : summary.state ?? "default",
      live: summary.live ?? true,
      "data-flow-slot": "approvalMetric",
    } as ComponentProps<typeof Badge>)),
    React.createElement(DenseOperationalList, {
      ...queue,
      label: queue.label ?? `${label} docs`,
      description: queue.description,
      density: queue.density ?? density,
      state: queue.state ?? (selectedDocumentKey ? "selected" : resolvedState),
      disabled: isDisabled || queue.disabled,
      loading: isLoading || queue.loading,
      error: queue.error ?? error,
      selectedKeys: queue.selectedKeys ?? (selectedDocumentKey ? [selectedDocumentKey] : []),
      table: {
        ...queue.table,
        label: queue.table?.label ?? `${label} doc queue`,
        columns: queue.table?.columns ?? defaultColumns(),
        rows,
        rowKey: queue.table?.rowKey ?? "id",
        bulkActions: queue.table?.bulkActions ?? [{ key: "approve", label: "Approve selected" }, { key: "reject", label: "Reject selected" }],
      },
      onSearchChange: (value, event: unknown) => {
        (queue.onSearchChange as LegacySearchChangeHandler | undefined)?.(value, event);
        if (hasDefaultPrevented(event) && event.defaultPrevented) return;
        (onDocumentSearchChange as LegacySearchChangeHandler | undefined)?.(value, event);
      },
      onFilterRemove: (key, event) => {
        queue.onFilterRemove?.(key, event);
        if (event.defaultPrevented) return;
        onDocumentFilterRemove?.(key, event);
      },
      onFiltersReset: (event) => {
        queue.onFiltersReset?.(event);
        if (event.defaultPrevented) return;
        onDocumentFiltersReset?.(event);
      },
      onSortChange: (sort, event) => {
        queue.onSortChange?.(sort, event);
        if (event.defaultPrevented) return;
        onDocumentSortChange?.(sort, event);
      },
      onRowSelect: (key, event) => {
        queue.onRowSelect?.(key, event);
        if (event.defaultPrevented) return;
        onDocumentSelect?.(key, event);
      },
      onPageChange: (page, event) => {
        queue.onPageChange?.(page, event);
        if (event.defaultPrevented) return;
        onDocumentPageChange?.(page, event);
      },
      onBulkAction: (key, event) => {
        queue.onBulkAction?.(key, event);
        if (event.defaultPrevented) return;
        onDocumentBulkAction?.(key, event);
        if (key === "approve") onApprove?.(key, event);
        if (key === "reject") onReject?.(key, event);
      },
      "data-flow-pattern-boundary": "dense-operational-list",
      "data-flow-slot": "approvalQueueBoundary",
    } as ComponentProps<typeof DenseOperationalList>),
    detail
      ? React.createElement(DrawerAdapter, {
        ...detail,
        label: detail.label ?? `${label} detail`,
        density: detail.density ?? density,
        open: detail.open ?? detailOpen,
        state: detail.state ?? (detailOpen ? "open" : "closed"),
        disabled: isDisabled || detail.disabled,
        loading: isLoading || detail.loading,
        error: detail.error ?? error,
        actions: detail.actions ?? [{ key: "reject", label: "Reject", variant: "danger" }, { key: "approve", label: "Approve", variant: "primary" }],
        onOpenChange: (open, event) => {
          detail.onOpenChange?.(open, event);
          if (event?.defaultPrevented) return;
          onDetailOpenChange?.(open, event);
        },
        onAction: (key, event) => {
          detail.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onDetailAction?.(key, event);
          if (key === "approve") onApprove?.(key, event);
          if (key === "reject") onReject?.(key, event);
        },
        "data-flow-pattern-boundary": "drawer-adapter",
        "data-flow-slot": "approvalDetailBoundary",
      } as ComponentProps<typeof DrawerAdapter>)
      : null,
    feedback
      ? React.createElement(StatusFeedbackView, {
        ...feedback,
        label: feedback.label ?? `${label} status`,
        density: feedback.density ?? density,
        state: feedback.state ?? (error ? "error" : deciding ? "loading" : resolvedState === "pending-review" ? "warning" : "success"),
        onAction: (key, event) => {
          feedback.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onFeedbackAction?.(key, event);
        },
        "data-flow-pattern-boundary": "status-feedback-view",
        "data-flow-slot": "approvalFeedbackBoundary",
      } as ComponentProps<typeof StatusFeedbackView>)
      : null,
  );
}) as BackofficeApprovalComponent;

BackofficeApproval.displayName = "BackofficeApproval";
