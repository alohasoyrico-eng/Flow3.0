import type { ForwardRefExoticComponent, MouseEvent, RefAttributes, ReactNode } from "react";
import type { ButtonProps } from "../Button.js";
import type { DialogProps } from "../Dialog.js";
import type { MenuAlign, MenuItem, MenuVariant } from "../Menu.js";
import type { SearchProps } from "./Search.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type ActionSheetState = "closed" | "open" | "loading" | "disabled" | "destructive" | "permission-blocked" | "error";
export type ActionSheetDensity = "sm" | "md" | "lg";

export interface ActionSheetAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key?: string;
  label: string;
  description?: ReactNode;
  meta?: ReactNode;
  value?: ReactNode;
  valueLabel?: ReactNode;
  shortcut?: string;
  prominent?: boolean;
  selected?: boolean;
  tone?: "danger";
}

export interface ActionSheetOverflow {
  triggerLabel?: string;
  label?: string;
  items?: ActionSheetAction[];
  open?: boolean;
  variant?: MenuVariant;
  align?: MenuAlign;
  disabled?: boolean;
  onOpenChange?: DialogProps["onOpenChange"];
  onSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ActionSheetFeedback extends ToastProps {}

export interface ActionSheetError extends Partial<ToastProps> {
  label?: string;
}

export interface ActionSheetDialog extends Partial<DialogProps> {}

export interface ActionSheetProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: ActionSheetDensity;
  state?: ActionSheetState;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
  permissionBlocked?: boolean;
  error?: ActionSheetError;
  actions?: ActionSheetAction[];
  cancelAction?: ActionSheetAction;
  primaryAction?: ActionSheetAction;
  overflow?: ActionSheetOverflow;
  search?: Partial<SearchProps>;
  feedback?: ActionSheetFeedback;
  dialog?: ActionSheetDialog;
  className?: string;
  onOpenChange?: DialogProps["onOpenChange"];
  onAction?: (key: string, event: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ActionSheetComponent extends ForwardRefExoticComponent<ActionSheetProps & RefAttributes<HTMLDivElement>> {
  displayName: "ActionSheet";
}

export const ActionSheet: ActionSheetComponent;
