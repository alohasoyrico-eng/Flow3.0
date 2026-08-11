import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { DialogProps } from "../Dialog.js";
import type { QuickActionMeta, QuickActionProps } from "../QuickAction.js";
import type { ToastProps } from "../Toast.js";
import type { TooltipProps } from "../Tooltip.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SearchProps } from "./Search.js";

export type QuickActionsGridState = "default" | "loading" | "disabled" | "permission-blocked" | "confirming" | "completed" | "error";
export type QuickActionsGridDensity = "sm" | "md" | "lg";

export interface QuickActionsGridAction extends Omit<QuickActionProps, "onAction"> {
  key?: string;
  status?: Partial<BadgeProps> & { label: string };
  tooltip?: Partial<TooltipProps> & { content: string };
  permissionBlocked?: boolean;
  intent?: "default" | "danger";
  onAction?: (meta: QuickActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
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
