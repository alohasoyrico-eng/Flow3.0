import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { DialogProps } from "../Dialog.js";
import type { IconButtonProps } from "../IconButton.js";
import type { ToastProps } from "../Toast.js";
import type { TooltipProps } from "../Tooltip.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SearchProps } from "./Search.js";

export type QuickActionsGridState = "default" | "loading" | "disabled" | "permission-blocked" | "confirming" | "completed" | "error";
export type QuickActionsGridDensity = "sm" | "md" | "lg";
export type QuickActionsGridActionVariant = "standard" | "compact" | "wide";
export type QuickActionsGridActionState = "default" | "hover" | "focus" | "pressed" | "loading" | "warning" | "disabled";
export type QuickActionsGridActionIntent = "default" | "danger" | "warning";

export interface QuickActionsGridActionMeta {
  label: string;
  variant: QuickActionsGridActionVariant;
  intent: QuickActionsGridActionIntent;
  state: QuickActionsGridActionState;
}

export interface QuickActionsGridAction extends Omit<IconButtonProps, "ariaLabel" | "badge" | "icon" | "label" | "loading" | "onClick" | "selected" | "state" | "variant" | "intent"> {
  key?: string;
  label: string;
  icon?: string;
  badge?: string;
  variant?: QuickActionsGridActionVariant;
  state?: QuickActionsGridActionState;
  status?: Partial<BadgeProps> & { label: string };
  tooltip?: Partial<TooltipProps> & { content: string };
  permissionBlocked?: boolean;
  intent?: QuickActionsGridActionIntent;
  loading?: boolean;
  onAction?: (meta: QuickActionsGridActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface QuickActionsGridProps extends FlowDataAttributes {
  label?: string;
  density?: QuickActionsGridDensity;
  state?: QuickActionsGridState;
  loading?: boolean;
  disabled?: boolean;
  permissionBlocked?: boolean;
  confirming?: boolean;
  completed?: boolean;
  error?: Partial<ToastProps>;
  actions?: QuickActionsGridAction[];
  search?: Partial<SearchProps>;
  confirmation?: Partial<DialogProps>;
  feedback?: ToastProps;
  className?: string;
  onAction?: (key: string, action: QuickActionsGridAction, event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface QuickActionsGridComponent extends ForwardRefExoticComponent<QuickActionsGridProps & RefAttributes<HTMLDivElement>> {
  displayName: "QuickActionsGrid";
}

export const QuickActionsGrid: QuickActionsGridComponent;
