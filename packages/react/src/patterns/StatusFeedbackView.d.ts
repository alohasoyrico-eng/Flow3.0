import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { EmptyStateAction } from "../EmptyState.js";
import type { ErrorPanelAction, ErrorPanelTone } from "../ErrorPanel.js";
import type { ToastTone } from "../Toast.js";
import type { NotificationPanelItem, NotificationPanelState } from "./NotificationPanel.js";
import type { SnackbarMessage, SnackbarProviderState, SnackbarQueueAction } from "./SnackbarProvider.js";

export type StatusFeedbackViewKind =
  | "empty"
  | "error"
  | "inline"
  | "toast"
  | "notifications"
  | "snackbar"
  | "loading"
  | "permission"
  | "maintenance";

export type StatusFeedbackViewState =
  | "default"
  | "empty"
  | "error"
  | "critical"
  | "warning"
  | "success"
  | "info"
  | "visible"
  | "closed"
  | "open"
  | "loading"
  | "permission"
  | "maintenance"
  | "disabled";

export type StatusFeedbackViewDensity = "sm" | "md" | "lg";
export type StatusFeedbackViewAction = EmptyStateAction | ErrorPanelAction | SnackbarQueueAction;

export interface StatusFeedbackViewProps {
  kind?: StatusFeedbackViewKind;
  label?: string;
  title?: string;
  description?: string;
  state?: StatusFeedbackViewState | NotificationPanelState | SnackbarProviderState;
  tone?: ToastTone | ErrorPanelTone;
  density?: StatusFeedbackViewDensity;
  action?: StatusFeedbackViewAction;
  field?: boolean;
  inlineValue?: string;
  message?: string;
  live?: boolean;
  notifications?: NotificationPanelItem[];
  messages?: SnackbarMessage[];
  open?: boolean;
  maxVisible?: number;
  paused?: boolean;
  selectedKey?: string;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDismissChange?: (dismissed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  onMessageAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onMessageDismiss?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onQueueAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onOpenChange?: (open: boolean, event?: unknown) => void;
  onSelect?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  [key: `data-${string}`]: string | number | boolean | undefined;
}

export interface StatusFeedbackViewComponent extends ForwardRefExoticComponent<StatusFeedbackViewProps & RefAttributes<HTMLDivElement>> {
  displayName: "StatusFeedbackView";
}

export const StatusFeedbackView: StatusFeedbackViewComponent;
