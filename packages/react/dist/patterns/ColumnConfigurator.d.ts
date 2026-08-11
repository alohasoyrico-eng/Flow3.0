import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CheckboxValueMeta } from "../Checkbox.js";
import type { DialogProps } from "../Dialog.js";
import type { DrawerProps } from "../Drawer.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { MenuAlign, MenuItem } from "../Menu.js";
import type { TableColumn, TableDensity, TableProps, TableRow } from "../Table.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type ColumnConfiguratorState = "closed" | "open" | "dirty" | "saving" | "saved" | "invalid" | "resetting" | "disabled";
export type ColumnConfiguratorDensity = TableDensity;
export type ColumnConfiguratorSurfaceMode = "drawer" | "dialog" | "menu";

export interface ColumnConfiguratorColumn extends Omit<TableColumn, "key"> {
  key: string;
  visible?: boolean;
  hidden?: boolean;
  defaultVisible?: boolean;
  required?: boolean;
  requiredReason?: string;
  disabled?: boolean;
  description?: string;
  name?: string;
  status?: Partial<BadgeProps> & { label: string };
}

export interface ColumnConfiguratorSurface {
  mode?: ColumnConfiguratorSurfaceMode;
  label?: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  side?: DrawerProps["side"];
  align?: MenuAlign;
  dialog?: Partial<DialogProps>;
  drawer?: Partial<DrawerProps>;
  menuItems?: MenuItem[];
}

export interface ColumnConfiguratorAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key?: string;
  label: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ColumnConfiguratorProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: ColumnConfiguratorDensity;
  state?: ColumnConfiguratorState;
  disabled?: boolean;
  open?: boolean;
  saving?: boolean;
  invalid?: boolean;
  surface?: ColumnConfiguratorSurface;
  columns?: ColumnConfiguratorColumn[];
  visibleKeys?: string[];
  defaultVisibleKeys?: string[];
  rows?: TableRow[];
  rowKey?: string;
  table?: Partial<TableProps>;
  applyAction?: ColumnConfiguratorAction;
  resetAction?: ColumnConfiguratorAction;
  saveViewAction?: ColumnConfiguratorAction;
  cancelAction?: ColumnConfiguratorAction;
  validation?: Partial<InlineValidationProps>;
  feedback?: ToastProps;
  className?: string;
  onOpenChange?: DialogProps["onOpenChange"] | DrawerProps["onOpenChange"];
  onColumnVisibilityChange?: (key: string, checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ColumnConfiguratorComponent extends ForwardRefExoticComponent<ColumnConfiguratorProps & RefAttributes<HTMLDivElement>> {
  displayName: "ColumnConfigurator";
}

export const ColumnConfigurator: ColumnConfiguratorComponent;
