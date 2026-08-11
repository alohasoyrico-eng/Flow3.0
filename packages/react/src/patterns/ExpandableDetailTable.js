import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import { VirtualDataTable } from "./VirtualDataTable.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function resolveState({ disabled, loading, error, expandedRowKey, detailOpen, rows, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (expandedRowKey || state === "expanded") return "expanded";
  if (!rows.length || state === "empty") return "empty";
  return state ?? "default";
}

function surfaceStateFor(resolvedState) {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical";
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "expanded" || resolvedState === "detail-open") return "selected";
  return "default";
}

function summaryTone(summary, resolvedState) {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "expanded" || resolvedState === "detail-open") return "info";
  return "neutral";
}

export const ExpandableDetailTable = forwardRef(function ExpandableDetailTable({
  label = "Expandable detail table",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  error,
  expandedRowKey,
  detailOpen = false,
  summaries = [],
  table = {},
  detail,
  feedback,
  className = "",
  onTableSortChange,
  onTableRowSelect,
  onTablePageChange,
  onTableBulkAction,
  onDetailOpenChange,
  onDetailAction,
  onFeedbackAction,
  ...rest
}, ref) {
  const rows = normalizeArray(table.rows);
  const normalizedSummaries = normalizeArray(summaries).filter((summary) => summary?.label);
  const resolvedState = resolveState({ disabled, loading, error, expandedRowKey, detailOpen, rows, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading";

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
      "data-flow-pattern": "expandable-detail-table",
      "data-flow-slot": "expandableDetailTableSurface",
      "data-expandable-detail-table-state": resolvedState,
      "data-density": density,
      "data-row-count": String(rows.length),
      "data-summary-count": String(normalizedSummaries.length),
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
        "data-flow-slot": "detailTableSummary",
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
      "data-flow-slot": "detailTableMetric",
    })),
    React.createElement(VirtualDataTable, {
      ...table,
      label: table.label ?? label,
      density: table.density ?? density,
      state: table.state ?? (expandedRowKey || detailOpen ? "selected" : resolvedState),
      disabled: isDisabled || table.disabled,
      loading: isLoading || table.loading,
      error: table.error ?? error,
      rows,
      selectedKey: table.selectedKey ?? expandedRowKey,
      virtualized: table.virtualized ?? true,
      selection: table.selection ?? { enabled: Boolean(onTableRowSelect) || Boolean(expandedRowKey) },
      onSortChange: (sort, event) => {
        table.onSortChange?.(sort, event);
        if (event.defaultPrevented) return;
        onTableSortChange?.(sort, event);
      },
      onRowSelect: (key, event) => {
        table.onRowSelect?.(key, event);
        if (event.defaultPrevented) return;
        onTableRowSelect?.(key, event);
      },
      onPageChange: (page, event) => {
        table.onPageChange?.(page, event);
        if (event.defaultPrevented) return;
        onTablePageChange?.(page, event);
      },
      onBulkAction: (key, event) => {
        table.onBulkAction?.(key, event);
        if (event.defaultPrevented) return;
        onTableBulkAction?.(key, event);
      },
      "data-flow-pattern-boundary": "virtual-data-table",
      "data-flow-slot": "tableBoundary",
    }),
    detail
      ? React.createElement(DrawerAdapter, {
        ...detail,
        label: detail.label ?? `${label} detail`,
        density: detail.density ?? density,
        open: detail.open ?? detailOpen,
        state: detail.state ?? (detailOpen ? "open" : expandedRowKey ? "responsive" : "closed"),
        disabled: isDisabled || detail.disabled,
        loading: isLoading || detail.loading,
        error: detail.error ?? error,
        onOpenChange: (open, event) => {
          detail.onOpenChange?.(open, event);
          if (event.defaultPrevented) return;
          onDetailOpenChange?.(open, event);
        },
        onAction: (key, event) => {
          detail.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onDetailAction?.(key, event);
        },
        "data-flow-pattern-boundary": "drawer-adapter",
        "data-flow-slot": "detailBoundary",
      })
      : null,
    feedback
      ? React.createElement(StatusFeedbackView, {
        ...feedback,
        label: feedback.label ?? `${label} feedback`,
        density: feedback.density ?? density,
        state: feedback.state ?? resolvedState,
        onAction: (key, event) => {
          feedback.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onFeedbackAction?.(key, event);
        },
        "data-flow-pattern-boundary": "status-feedback-view",
        "data-flow-slot": "feedbackBoundary",
      })
      : null,
  );
});

ExpandableDetailTable.displayName = "ExpandableDetailTable";
