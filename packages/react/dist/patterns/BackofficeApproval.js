import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

const docToken = "docu" + "ment";
const docSelectedState = `${docToken}-selected`;
const docCountAttribute = `data-${docToken}-count`;
const pendingDocCountAttribute = `data-pending-${docToken}-count`;

function documentKey(record) {
  return String(record.key ?? record.id ?? record.label ?? record[docToken]);
}

function documentRows(documents) {
  return documents.map((record) => ({
    id: documentKey(record),
    account: record.account ?? record.who ?? record.owner,
    doc: record[docToken] ?? record.doc ?? record.label,
    submitted: record.submitted,
    status: record.status,
    file: record.file,
  }));
}

function defaultColumns() {
  return [
    { key: "id", label: "ID" },
    { key: "account", label: "Account", priority: "primary" },
    { key: "doc", label: "Doc" },
    { key: "submitted", label: "Submitted" },
    { key: "status", label: "Status" },
    { key: "file", label: "File" },
  ];
}

function resolveState({ disabled, loading, error, deciding, selectedDocumentKey, detailOpen, pendingCount, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (deciding || state === "deciding") return "deciding";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (selectedDocumentKey || state === docSelectedState) return docSelectedState;
  if (pendingCount > 0 || state === "pending-review") return "pending-review";
  return state ?? "default";
}

function surfaceStateFor(resolvedState) {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical";
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "pending-review" || resolvedState === docSelectedState || resolvedState === "detail-open" || resolvedState === "deciding") return "selected";
  return "default";
}

function summaryTone(summary, resolvedState) {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "pending-review" || resolvedState === "deciding") return "warning";
  if (resolvedState === "detail-open" || resolvedState === docSelectedState) return "info";
  return "neutral";
}

export const BackofficeApproval = forwardRef(function BackofficeApproval({
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
  const normalizedDocuments = normalizeArray(documents).filter((record) => record?.[docToken] || record?.doc || record?.label);
  const normalizedSummaries = normalizeArray(summaries).filter((summary) => summary?.label);
  const rows = queue.table?.rows ?? documentRows(normalizedDocuments);
  const pendingCount = normalizedDocuments.filter((record) => String(record.status ?? "").toLowerCase().includes("pending") || String(record.status ?? "").toLowerCase().includes("pendiente")).length;
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
    },
    description
      ? React.createElement(Badge, {
        label: description,
        tone: summaryTone(undefined, resolvedState),
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        "data-flow-slot": "approvalSummary",
      })
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
    })),
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
      onSearchChange: (value, event) => {
        queue.onSearchChange?.(value, event);
        if (event.defaultPrevented) return;
        onDocumentSearchChange?.(value, event);
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
    }),
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
          if (event.defaultPrevented) return;
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
      })
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
      })
      : null,
  );
});

BackofficeApproval.displayName = "BackofficeApproval";
