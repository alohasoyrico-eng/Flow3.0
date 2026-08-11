import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import { NotificationPanel } from "./NotificationPanel.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function resolveState({ disabled, loading, error, selectedTicketKey, detailOpen, alerts, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (selectedTicketKey || state === "ticket-selected") return "ticket-selected";
  if (alerts?.open || state === "alerts-open") return "alerts-open";
  return state ?? "default";
}

function surfaceStateFor(resolvedState) {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical";
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "detail-open" || resolvedState === "ticket-selected" || resolvedState === "alerts-open") return "selected";
  return "default";
}

function summaryTone(summary, resolvedState) {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "alerts-open") return "warning";
  if (resolvedState === "detail-open" || resolvedState === "ticket-selected") return "info";
  return "neutral";
}

export const TicketQueue = forwardRef(function TicketQueue({
  label = "Ticket queue",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  error,
  selectedTicketKey,
  detailOpen = false,
  summaries = [],
  alerts,
  tickets = {},
  detail,
  feedback,
  className = "",
  onAlertOpenChange,
  onAlertSelect,
  onAlertDismiss,
  onAlertMarkAll,
  onTicketSearchChange,
  onTicketFilterRemove,
  onTicketFiltersReset,
  onTicketSortChange,
  onTicketSelect,
  onTicketPageChange,
  onTicketBulkAction,
  onTicketToolbarOverflowSelect,
  onDetailOpenChange,
  onDetailAction,
  onFeedbackAction,
  ...rest
}, ref) {
  const normalizedSummaries = normalizeArray(summaries).filter((summary) => summary?.label);
  const ticketRows = normalizeArray(tickets.table?.rows);
  const alertItems = normalizeArray(alerts?.notifications);
  const resolvedState = resolveState({ disabled, loading, error, selectedTicketKey, detailOpen, alerts, state });
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
      "data-flow-pattern": "ticket-queue",
      "data-flow-slot": "ticketQueueSurface",
      "data-ticket-queue-state": resolvedState,
      "data-density": density,
      "data-summary-count": String(normalizedSummaries.length),
      "data-ticket-row-count": String(ticketRows.length),
      "data-alert-count": String(alertItems.length),
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
        "data-flow-slot": "queueSummary",
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
      "data-flow-slot": "queueMetric",
    })),
    alerts
      ? React.createElement(NotificationPanel, {
        ...alerts,
        label: alerts.label ?? `${label} alerts`,
        density: alerts.density ?? density,
        disabled: isDisabled || alerts.disabled,
        loading: isLoading || alerts.loading,
        error: alerts.error ?? (error ? { title: error.label, description: error.description } : undefined),
        onOpenChange: (open, event) => {
          alerts.onOpenChange?.(open, event);
          if (event.defaultPrevented) return;
          onAlertOpenChange?.(open, event);
        },
        onSelect: (key, event) => {
          alerts.onSelect?.(key, event);
          if (event.defaultPrevented) return;
          onAlertSelect?.(key, event);
        },
        onDismiss: (key, event) => {
          alerts.onDismiss?.(key, event);
          if (event.defaultPrevented) return;
          onAlertDismiss?.(key, event);
        },
        onMarkAll: (event) => {
          alerts.onMarkAll?.(event);
          if (event.defaultPrevented) return;
          onAlertMarkAll?.(event);
        },
        "data-flow-pattern-boundary": "notification-panel",
        "data-flow-slot": "queueAlertsBoundary",
      })
      : null,
    React.createElement(DenseOperationalList, {
      ...tickets,
      label: tickets.label ?? `${label} tickets`,
      density: tickets.density ?? density,
      state: tickets.state ?? (selectedTicketKey ? "selected" : resolvedState),
      disabled: isDisabled || tickets.disabled,
      loading: isLoading || tickets.loading,
      error: tickets.error ?? error,
      selectedKeys: tickets.selectedKeys ?? (selectedTicketKey ? [selectedTicketKey] : []),
      onSearchChange: (value, event) => {
        tickets.onSearchChange?.(value, event);
        if (event.defaultPrevented) return;
        onTicketSearchChange?.(value, event);
      },
      onFilterRemove: (key, event) => {
        tickets.onFilterRemove?.(key, event);
        if (event.defaultPrevented) return;
        onTicketFilterRemove?.(key, event);
      },
      onFiltersReset: (event) => {
        tickets.onFiltersReset?.(event);
        if (event.defaultPrevented) return;
        onTicketFiltersReset?.(event);
      },
      onSortChange: (sort, event) => {
        tickets.onSortChange?.(sort, event);
        if (event.defaultPrevented) return;
        onTicketSortChange?.(sort, event);
      },
      onRowSelect: (key, event) => {
        tickets.onRowSelect?.(key, event);
        if (event.defaultPrevented) return;
        onTicketSelect?.(key, event);
      },
      onPageChange: (page, event) => {
        tickets.onPageChange?.(page, event);
        if (event.defaultPrevented) return;
        onTicketPageChange?.(page, event);
      },
      onBulkAction: (key, event) => {
        tickets.onBulkAction?.(key, event);
        if (event.defaultPrevented) return;
        onTicketBulkAction?.(key, event);
      },
      onToolbarOverflowSelect: (item, event) => {
        tickets.onToolbarOverflowSelect?.(item, event);
        if (event.defaultPrevented) return;
        onTicketToolbarOverflowSelect?.(item, event);
      },
      "data-flow-pattern-boundary": "dense-operational-list",
      "data-flow-slot": "ticketListBoundary",
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
        "data-flow-slot": "ticketDetailBoundary",
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
        "data-flow-slot": "queueFeedbackBoundary",
      })
      : null,
  );
});

TicketQueue.displayName = "TicketQueue";
