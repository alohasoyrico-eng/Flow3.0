import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity, BadgeProps, BadgeTone } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import { Surface } from "../Surface.js";
import type { SurfaceState } from "../Surface.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import { NotificationPanel } from "./NotificationPanel.js";
import type { NotificationPanelProps } from "./NotificationPanel.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";

export type TicketQueueState =
  | "default"
  | "alerts-open"
  | "ticket-selected"
  | "detail-open"
  | "loading"
  | "error"
  | "disabled";
export type TicketQueueDensity = BadgeDensity;

export type TicketQueueSummary = Partial<BadgeProps> & {
  key?: string;
  label: string;
};
export type TicketQueueAlerts = Partial<NotificationPanelProps> & {
  disabled?: boolean;
};
export type TicketQueueTickets = Partial<DenseOperationalListProps>;
export type TicketQueueDetail = Partial<DrawerAdapterProps>;
export type TicketQueueFeedback = Partial<StatusFeedbackViewProps>;

export interface TicketQueueProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: TicketQueueDensity;
  state?: TicketQueueState;
  disabled?: boolean;
  loading?: boolean;
  error?: DenseOperationalListProps["error"];
  selectedTicketKey?: string;
  detailOpen?: boolean;
  summaries?: TicketQueueSummary[];
  alerts?: TicketQueueAlerts;
  tickets?: TicketQueueTickets;
  detail?: TicketQueueDetail;
  feedback?: TicketQueueFeedback;
  className?: string;
  onAlertOpenChange?: NotificationPanelProps["onOpenChange"];
  onAlertSelect?: NotificationPanelProps["onSelect"];
  onAlertDismiss?: NotificationPanelProps["onDismiss"];
  onAlertMarkAll?: NotificationPanelProps["onMarkAll"];
  onTicketSearchChange?: DenseOperationalListProps["onSearchChange"];
  onTicketFilterRemove?: DenseOperationalListProps["onFilterRemove"];
  onTicketFiltersReset?: DenseOperationalListProps["onFiltersReset"];
  onTicketSortChange?: DenseOperationalListProps["onSortChange"];
  onTicketSelect?: DenseOperationalListProps["onRowSelect"];
  onTicketPageChange?: DenseOperationalListProps["onPageChange"];
  onTicketBulkAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onTicketToolbarOverflowSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onDetailOpenChange?: DrawerAdapterProps["onOpenChange"];
  onDetailAction?: DrawerAdapterProps["onAction"];
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface TicketQueueComponent extends ForwardRefExoticComponent<TicketQueueProps & RefAttributes<HTMLDivElement>> {
  displayName: "TicketQueue";
}

type TicketQueueRestProps = Record<string, unknown>;

interface TicketQueueStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  error?: DenseOperationalListProps["error"] | undefined;
  selectedTicketKey?: string | undefined;
  detailOpen?: boolean | undefined;
  alerts?: TicketQueueAlerts | undefined;
  state?: TicketQueueState | undefined;
}

function sanitizeRestProps(rest: TicketQueueRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function resolveState({ disabled, loading, error, selectedTicketKey, detailOpen, alerts, state }: TicketQueueStateInput): TicketQueueState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (selectedTicketKey || state === "ticket-selected") return "ticket-selected";
  if (alerts?.open || state === "alerts-open") return "alerts-open";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: TicketQueueState): SurfaceState {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical" as SurfaceState;
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "detail-open" || resolvedState === "ticket-selected" || resolvedState === "alerts-open") return "selected";
  return "default";
}

function summaryTone(summary: TicketQueueSummary | undefined, resolvedState: TicketQueueState): BadgeTone {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "alerts-open") return "warning";
  if (resolvedState === "detail-open" || resolvedState === "ticket-selected") return "info";
  return "neutral";
}

export const TicketQueue = forwardRef<HTMLDivElement, TicketQueueProps>(function TicketQueue({
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
  const normalizedSummaries = normalizeArray(summaries).filter((summary): summary is TicketQueueSummary => Boolean(summary?.label));
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
    } as ComponentProps<typeof Surface>,
    description
      ? React.createElement(Badge, {
        label: description,
        tone: summaryTone(undefined, resolvedState),
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        "data-flow-slot": "queueSummary",
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
      "data-flow-slot": "queueMetric",
    } as ComponentProps<typeof Badge>)),
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
          if (event?.defaultPrevented) return;
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
      } as ComponentProps<typeof NotificationPanel>)
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
      onSearchChange: (value, meta, event) => {
        tickets.onSearchChange?.(value, meta, event);
        if (event.defaultPrevented) return;
        onTicketSearchChange?.(value, meta, event);
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
        onOpenChange: (open, event) => {
          detail.onOpenChange?.(open, event);
          if (event?.defaultPrevented) return;
          onDetailOpenChange?.(open, event);
        },
        onAction: (key, event) => {
          detail.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onDetailAction?.(key, event);
        },
        "data-flow-pattern-boundary": "drawer-adapter",
        "data-flow-slot": "ticketDetailBoundary",
      } as ComponentProps<typeof DrawerAdapter>)
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
      } as ComponentProps<typeof StatusFeedbackView>)
      : null,
  );
}) as TicketQueueComponent;

TicketQueue.displayName = "TicketQueue";
