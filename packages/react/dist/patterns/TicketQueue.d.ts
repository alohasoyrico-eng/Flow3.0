import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import type { NotificationPanelProps } from "./NotificationPanel.js";
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
export type TicketQueueAlerts = Partial<NotificationPanelProps>;
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

export const TicketQueue: TicketQueueComponent;
