import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps, BadgeTone } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Drawer } from "../Drawer.js";
import type { DrawerDensity, DrawerOpenChangeEvent, DrawerProps } from "../Drawer.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction, EmptyStateProps } from "../EmptyState.js";
import { IconButton } from "../IconButton.js";
import type { IconButtonProps } from "../IconButton.js";
import { List } from "../List.js";
import type { ListItem, ListProps } from "../List.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type NotificationPanelState = "closed" | "open" | "loading" | "empty" | "unread" | "all-read" | "error" | "permission-blocked";
export type NotificationPanelDensity = DrawerDensity;

export interface NotificationPanelItem {
  key?: string;
  id?: string;
  label: string;
  description?: string;
  unread?: boolean;
  disabled?: boolean;
  tone?: BadgeTone;
}

export interface NotificationPanelEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface NotificationPanelErrorState extends NotificationPanelEmptyState {}
export interface NotificationPanelAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  label: string;
}

export interface NotificationPanelProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  closeLabel?: string;
  density?: NotificationPanelDensity;
  state?: NotificationPanelState;
  open?: boolean;
  loading?: boolean;
  permissionBlocked?: boolean;
  notifications?: NotificationPanelItem[];
  unreadCount?: number;
  selectedKey?: string;
  empty?: NotificationPanelEmptyState;
  error?: NotificationPanelErrorState;
  feedback?: ToastProps;
  markAllAction?: NotificationPanelAction;
  itemActionLabel?: string;
  dismissLabel?: string;
  onOpenChange?: (open: boolean, event?: DrawerOpenChangeEvent) => void;
  onSelect?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onMarkAll?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDismiss?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface NotificationPanelComponent extends ForwardRefExoticComponent<NotificationPanelProps & RefAttributes<HTMLDivElement>> {
  displayName: "NotificationPanel";
}

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;
type NormalizedNotificationPanelItem = NotificationPanelItem & { key: string; unread: boolean };

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeNotifications(items: NotificationPanelItem[] | undefined): NormalizedNotificationPanelItem[] {
  return (Array.isArray(items) ? items : [])
    .filter((item): item is NotificationPanelItem => Boolean(item?.label))
    .map((item) => ({
      ...item,
      key: String(item.key ?? item.id ?? item.label),
      unread: Boolean(item.unread),
    }));
}

function resolveState({
  open,
  loading,
  error,
  permissionBlocked,
  notifications,
  state,
}: {
  open: boolean;
  loading: boolean;
  error?: NotificationPanelErrorState | undefined;
  permissionBlocked: boolean;
  notifications: NormalizedNotificationPanelItem[];
  state?: NotificationPanelState | undefined;
}): NotificationPanelState {
  if (permissionBlocked) return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (!notifications.length) return "empty";
  if (state) return state;
  if (notifications.some((item) => item.unread)) return "unread";
  return open ? "open" : "closed";
}

export const NotificationPanel = forwardRef<HTMLDivElement, NotificationPanelProps>(function NotificationPanel({
  label = "Notifications",
  description,
  closeLabel = "Close notifications",
  density,
  state,
  open = false,
  loading = false,
  permissionBlocked = false,
  notifications = [],
  unreadCount,
  selectedKey,
  empty,
  error,
  feedback,
  markAllAction,
  itemActionLabel = "Open notification",
  dismissLabel = "Dismiss notification",
  onOpenChange,
  onSelect,
  onMarkAll,
  onDismiss,
  className = "",
  ...rest
}, ref) {
  const normalizedNotifications = normalizeNotifications(notifications);
  const resolvedUnreadCount = unreadCount ?? normalizedNotifications.filter((item) => item.unread).length;
  const resolvedState = resolveState({ open, loading, error, permissionBlocked, notifications: normalizedNotifications, state });
  const isUnavailable = resolvedState === "permission-blocked" || resolvedState === "loading" || resolvedState === "error";

  const listItems: ListItem[] = normalizedNotifications.map((item) => ({
    key: item.key,
    label: item.label,
    meta: item.description,
    state: item.key === selectedKey ? "selected" : item.unread ? "hover" : "default",
    disabled: Boolean(item.disabled || isUnavailable),
    value: React.createElement(Badge, {
      label: item.unread ? "Unread" : "Read",
      tone: item.unread ? "info" : "neutral",
      variant: "status",
      density,
      state: item.disabled || isUnavailable ? "disabled" : "default",
      live: item.unread,
    } as BadgeProps),
  }));

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "region",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "notification-panel",
      "data-state": resolvedState,
      "data-density": density,
      "data-notification-count": String(normalizedNotifications.length),
      "data-unread-count": String(resolvedUnreadCount),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Drawer, {
      label,
      description: description ?? (resolvedUnreadCount ? `${resolvedUnreadCount} unread notifications` : "All notifications read"),
      closeLabel,
      open,
      state: open ? "open" : "closed",
      variant: "side-sheet",
      tone: error ? "danger" : "neutral",
      density,
      content: [
        { type: "badge", key: "unread", label: `${resolvedUnreadCount} unread`, tone: resolvedUnreadCount ? "info" : "neutral", variant: "count", live: true },
      ],
      onOpenChange,
    } as DrawerProps),
    React.createElement(Badge, {
      label: `${resolvedUnreadCount} unread`,
      tone: resolvedUnreadCount ? "info" : "neutral",
      variant: "count",
      density,
      state: isUnavailable ? "disabled" : "default",
      live: true,
    } as BadgeProps),
    markAllAction?.label
      ? React.createElement(Button, {
        ...markAllAction,
        label: markAllAction.label,
        variant: markAllAction.variant ?? "secondary",
        density: markAllAction.density ?? density,
        disabled: isUnavailable || !resolvedUnreadCount || markAllAction.disabled,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          markAllAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onMarkAll?.(event);
        },
      } as ButtonProps)
      : null,
    normalizedNotifications.length && !isUnavailable
      ? React.createElement(List, {
        label: `${label} list`,
        items: listItems,
        variant: "action",
        selectedKey,
        density,
        state: isUnavailable ? "disabled" : "default",
        interactive: Boolean(onSelect),
        onSelect,
      } as ListProps)
      : null,
    normalizedNotifications.length && !isUnavailable
      ? normalizedNotifications.slice(0, 1).map((item) => React.createElement(IconButton, {
        key: `dismiss-${item.key}`,
        icon: "close",
        label: `${dismissLabel}: ${item.label}`,
        density,
        variant: "ghost",
        disabled: item.disabled,
        onClick: (event: MouseEvent<HTMLButtonElement>) => onDismiss?.(item.key, event),
      } as IconButtonProps))
      : null,
    !normalizedNotifications.length || resolvedState === "permission-blocked" || resolvedState === "error"
      ? React.createElement(EmptyState, {
        title: error?.title ?? empty?.title ?? (permissionBlocked ? "Notifications unavailable" : "No notifications"),
        description: error?.description ?? empty?.description ?? (permissionBlocked ? "Your role cannot view notification history." : "You are all caught up."),
        icon: error?.icon ?? empty?.icon,
        action: error?.action ?? empty?.action,
        variant: error ? "error" : permissionBlocked ? "permission" : "search-empty",
        state: error ? "error" : permissionBlocked ? "permission" : "search-empty",
        density,
        onAction: error?.onAction ?? empty?.onAction,
      } as EmptyStateProps)
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        ...feedback,
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? "info",
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
      } as ToastProps)
      : null,
    itemActionLabel
      ? React.createElement(Button, {
        label: itemActionLabel,
        variant: "ghost",
        density,
        disabled: isUnavailable || !normalizedNotifications.length,
        onClick: (event: MouseEvent<HTMLButtonElement>) => selectedKey && onSelect?.(selectedKey, event),
      } as ButtonProps)
      : null,
  );
}) as NotificationPanelComponent;

NotificationPanel.displayName = "NotificationPanel";
