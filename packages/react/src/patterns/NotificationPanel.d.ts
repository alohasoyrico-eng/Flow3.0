import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeTone } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { DrawerDensity, DrawerOpenChangeEvent } from "../Drawer.js";
import type { EmptyStateAction } from "../EmptyState.js";
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

export const NotificationPanel: NotificationPanelComponent;
