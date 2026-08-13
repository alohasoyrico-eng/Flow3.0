import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelAction, ErrorPanelTone } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationState } from "../InlineValidation.js";
import { Surface } from "../Surface.js";
import type { SurfaceState } from "../Surface.js";
import { Toast } from "../Toast.js";
import type { ToastState, ToastTone } from "../Toast.js";
import { NotificationPanel } from "./NotificationPanel.js";
import type { NotificationPanelItem, NotificationPanelState } from "./NotificationPanel.js";
import { SnackbarProvider } from "./SnackbarProvider.js";
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

type StatusFeedbackViewRestProps = Record<string, unknown>;

const validKinds = new Set<StatusFeedbackViewKind>([
  "empty",
  "error",
  "inline",
  "toast",
  "notifications",
  "snackbar",
  "loading",
  "permission",
  "maintenance",
]);

const inlineStates = new Set<InlineValidationState>(["success", "warning", "error", "disabled"]);

function sanitizeRestProps(rest: StatusFeedbackViewRestProps): Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>;
}

function normalizeKind(kind: StatusFeedbackViewKind | undefined, state: StatusFeedbackViewProps["state"]): StatusFeedbackViewKind {
  if (kind && validKinds.has(kind)) return kind;
  if (state === "error" || state === "critical" || state === "warning") return "error";
  if (state === "loading") return "loading";
  if (state === "permission") return "permission";
  if (state === "maintenance") return "maintenance";
  return "empty";
}

function resolveState(kind: StatusFeedbackViewKind, state: StatusFeedbackViewProps["state"]): StatusFeedbackViewProps["state"] {
  if (state) return state;
  if (kind === "error") return "error";
  if (kind === "inline") return "info";
  if (kind === "toast") return "visible";
  if (kind === "notifications") return "closed";
  if (kind === "snackbar") return "visible";
  if (kind === "loading") return "loading";
  if (kind === "permission") return "permission";
  if (kind === "maintenance") return "default";
  return "empty";
}

function emptyVariant(kind: StatusFeedbackViewKind): ComponentProps<typeof EmptyState>["variant"] {
  if (kind === "permission") return "permission";
  if (kind === "maintenance") return "maintenance";
  return "search-empty";
}

function toastTone(tone: StatusFeedbackViewProps["tone"], state: StatusFeedbackViewProps["state"]): ToastTone {
  if (tone === "neutral" || tone === "info" || tone === "success" || tone === "warning" || tone === "danger") return tone;
  if (state === "success") return "success";
  if (state === "warning") return "warning";
  if (state === "error" || state === "critical") return "danger";
  return "info";
}

function surfaceState(state: StatusFeedbackViewProps["state"]): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "error" || state === "critical") return "raised";
  return "default";
}

export const StatusFeedbackView = forwardRef<HTMLDivElement, StatusFeedbackViewProps>(function StatusFeedbackView({
  kind,
  label = "Status feedback",
  title,
  description,
  state,
  tone,
  density,
  action,
  field,
  inlineValue = "",
  message,
  live = true,
  notifications,
  messages,
  open = false,
  maxVisible = 2,
  paused = false,
  selectedKey,
  onAction,
  onDismiss,
  onDismissChange,
  onMessageAction,
  onMessageDismiss,
  onQueueAction,
  onOpenChange,
  onSelect,
  className = "",
  ...rest
}, ref) {
  const resolvedKind = normalizeKind(kind, state);
  const resolvedState = resolveState(resolvedKind, state);
  const shared = sanitizeRestProps(rest);
  const statusLabel = title ?? label;

  let content: React.ReactNode = null;
  if (resolvedKind === "notifications") {
    content = React.createElement(NotificationPanel, {
      label,
      description,
      density,
      state: resolvedState as NotificationPanelState,
      open,
      notifications,
      selectedKey,
      onOpenChange,
      onSelect,
      "data-flow-pattern-boundary": "notification-panel",
    } as ComponentProps<typeof NotificationPanel>);
  } else if (resolvedKind === "snackbar") {
    content = React.createElement(SnackbarProvider, {
      label,
      density,
      state: resolvedState as SnackbarProviderState,
      messages,
      maxVisible,
      paused,
      ...(action ? { action: action as SnackbarQueueAction } : {}),
      onMessageAction,
      onMessageDismiss,
      onQueueAction,
      "data-flow-pattern-boundary": "snackbar-provider",
    } as ComponentProps<typeof SnackbarProvider>);
  } else if (resolvedKind === "error") {
    content = React.createElement(ErrorPanel, {
      label: statusLabel,
      description,
      ...(action ? { action: action as ErrorPanelAction } : {}),
      tone: tone === "warning" || tone === "critical" ? tone : "error",
      variant: resolvedState === "critical" ? "blocking" : "panel",
      state: resolvedState === "critical" ? "critical" : resolvedState === "warning" ? "warning" : "error",
      density,
      onAction,
    } as ComponentProps<typeof ErrorPanel>);
  } else if (resolvedKind === "inline") {
    const inlineState = inlineStates.has(resolvedState as InlineValidationState)
      ? resolvedState as InlineValidationState
      : "info";
    content = React.createElement(InlineValidation, {
      label: statusLabel,
      value: inlineValue,
      message: message ?? description,
      state: inlineState,
      field,
      live,
      density,
    } as ComponentProps<typeof InlineValidation>);
  } else if (resolvedKind === "toast") {
    const actionLabel = action?.label;
    content = React.createElement(Toast, {
      label: statusLabel,
      description,
      tone: toastTone(tone, resolvedState),
      variant: actionLabel ? "recovery" : resolvedState === "warning" ? "warning" : "status",
      state: actionLabel ? "action" : "visible" as ToastState,
      density,
      actionLabel: action?.label,
      dismissible: Boolean(onDismiss || onDismissChange),
      dismissLabel: "Dismiss status feedback",
      onAction: actionLabel ? (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onAction?.(action.key ?? actionLabel, event);
      } : undefined,
      onDismiss,
      onDismissChange,
    } as ComponentProps<typeof Toast>);
  } else {
    content = React.createElement(EmptyState, {
      title: statusLabel,
      description,
      icon: resolvedKind === "loading" ? undefined : resolvedKind === "maintenance" ? "construction" : undefined,
      ...(action ? { action: action as EmptyStateAction } : {}),
      variant: emptyVariant(resolvedKind),
      state: resolvedKind === "loading" ? "loading" : resolvedKind === "permission" ? "permission" : "default",
      density,
      onAction,
    } as ComponentProps<typeof EmptyState>);
  }

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "section",
      state: surfaceState(resolvedState),
      density,
      elevation: "none",
      role: resolvedKind === "inline" ? "group" : "region",
      "aria-label": label,
      "aria-live": live && resolvedKind !== "notifications" && resolvedKind !== "snackbar" ? "polite" : undefined,
      "aria-busy": resolvedKind === "loading" || resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "status-feedback-view",
      "data-state": resolvedState,
      "data-density": density,
      "data-feedback-kind": resolvedKind,
      ...shared,
    } as ComponentProps<typeof Surface>,
    content,
  );
}) as StatusFeedbackViewComponent;

StatusFeedbackView.displayName = "StatusFeedbackView";
