import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AuditEventProps } from "../AuditEvent.js";
import type { AvatarProps } from "../Avatar.js";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CardSummaryProps } from "../CardSummary.js";
import type { DialogProps } from "../Dialog.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { PaginationProps } from "../Pagination.js";
import type { QuickActionProps } from "../QuickAction.js";
import type { TableProps } from "../Table.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ToolbarProps } from "./Toolbar.js";

export type DriverAndVehicleAdministrationState = "loading" | "empty" | "ready" | "selected" | "action-running" | "permission-blocked" | "error" | "disabled";
export type DriverAndVehicleAdministrationDensity = ButtonProps["density"];

export interface DriverAndVehicleAdministrationRecord {
  key?: string;
  id?: string;
  label?: string;
  name?: string;
  driver?: string;
  owner?: string;
  vehicle?: string;
  plate?: string;
  unit?: string;
  type?: string;
  kind?: string;
  status?: string;
  statusLabel?: string;
  tone?: BadgeProps["tone"];
  avatarSrc?: AvatarProps["src"];
  presence?: AvatarProps["status"];
  disabled?: boolean;
  [key: string]: unknown;
}

export interface DriverAndVehicleAdministrationAction extends Omit<QuickActionProps, "children"> {
  key?: string;
  label: string;
}

export interface DriverAndVehicleAdministrationDialog extends Partial<DialogProps> {}

export interface DriverAndVehicleAdministrationProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DriverAndVehicleAdministrationDensity;
  state?: DriverAndVehicleAdministrationState;
  disabled?: boolean;
  loading?: boolean;
  empty?: boolean;
  selectedKey?: string;
  actionRunning?: boolean;
  permissionBlocked?: boolean;
  error?: boolean;
  toolbar?: Partial<ToolbarProps>;
  summary?: Partial<CardSummaryProps>;
  records?: DriverAndVehicleAdministrationRecord[];
  columns?: TableProps["columns"];
  actions?: DriverAndVehicleAdministrationAction[];
  primaryAction?: Omit<ButtonProps, "children" | "fullWidth">;
  secondaryAction?: Omit<ButtonProps, "children" | "fullWidth">;
  dialog?: DriverAndVehicleAdministrationDialog;
  audit?: Partial<AuditEventProps>;
  pagination?: Partial<PaginationProps>;
  emptyState?: Partial<EmptyStateProps>;
  feedback?: Partial<ToastProps>;
  className?: string;
  onRowSelect?: TableProps["onRowSelect"];
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onDialogAction?: DialogProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DriverAndVehicleAdministrationComponent extends ForwardRefExoticComponent<DriverAndVehicleAdministrationProps & RefAttributes<HTMLDivElement>> {
  displayName: "DriverAndVehicleAdministration";
}

export const DriverAndVehicleAdministration: DriverAndVehicleAdministrationComponent;
