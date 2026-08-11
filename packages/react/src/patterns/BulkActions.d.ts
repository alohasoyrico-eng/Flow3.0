import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeDensity } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CheckboxProps } from "../Checkbox.js";
import type { DialogProps } from "../Dialog.js";
import type { MenuProps } from "../Menu.js";
import type { ProgressIndicatorProps } from "../ProgressIndicator.js";
import type { TableProps } from "../Table.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ToolbarProps } from "./Toolbar.js";

export type BulkActionsState = "none-selected" | "selected" | "partially-eligible" | "confirming" | "running" | "partial-failure" | "complete" | "disabled";
export type BulkActionsDensity = BadgeDensity;

export interface BulkActionsSelection extends Pick<CheckboxProps, "label" | "description" | "disabled" | "onCheckedChange"> {}

export type BulkActionsAction = ButtonProps & {
  key?: string;
};

export interface BulkActionsOverflow extends Pick<MenuProps, "triggerLabel" | "label" | "items" | "open" | "variant" | "align" | "disabled" | "onOpenChange" | "onSelect"> {}

export interface BulkActionsProps extends FlowDataAttributes {
  label?: string;
  density?: BulkActionsDensity;
  state?: BulkActionsState;
  disabled?: boolean;
  selectedCount?: number;
  totalCount?: number;
  eligibleCount?: number;
  selection?: BulkActionsSelection;
  table?: TableProps;
  actions?: BulkActionsAction[];
  overflow?: BulkActionsOverflow;
  confirmation?: DialogProps;
  progress?: ProgressIndicatorProps;
  feedback?: ToastProps;
  toolbar?: ToolbarProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface BulkActionsComponent extends ForwardRefExoticComponent<BulkActionsProps & RefAttributes<HTMLDivElement>> {
  displayName: "BulkActions";
}

export const BulkActions: BulkActionsComponent;
