import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AuditEventProps } from "../AuditEvent.js";
import type { ButtonProps } from "../Button.js";
import type { CheckboxValueMeta } from "../Checkbox.js";
import type { DialogAction, DialogProps } from "../Dialog.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { SwitchValueMeta } from "../Switch.js";
import type { TableDensity } from "../Table.js";
import type { ToastProps } from "../Toast.js";

export type RolesAndPermissionsState =
  | "read-only"
  | "editing"
  | "dirty"
  | "confirming"
  | "saving"
  | "saved"
  | "permission-blocked"
  | "error";
export type RolesAndPermissionsDensity = TableDensity;
export type RolesAndPermissionsMode = "switch" | "checkbox";

export interface RolesAndPermissionsRole {
  key?: string;
  value?: string;
  label: string;
  disabled?: boolean;
}

export interface RolesAndPermissionsPermission {
  key?: string;
  value?: string;
  label: string;
  badge?: string;
  scope?: string;
  tone?: "neutral" | "info" | "success" | "warning" | "danger" | "accent";
  disabled?: boolean;
  disabledReason?: string;
  reason?: string;
}

export type RolesAndPermissionsValues = Record<string, Record<string, boolean>>;

export interface RolesAndPermissionsValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface RolesAndPermissionsConfirmation extends Pick<DialogProps, "label" | "description" | "open" | "tone" | "variant" | "onOpenChange" | "onAction"> {
  actions?: DialogAction[];
}

export interface RolesAndPermissionsAudit extends Pick<AuditEventProps, "label" | "description" | "meta" | "status" | "icon" | "tone" | "state" | "timestamp"> {}

export interface RolesAndPermissionsFeedback extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "actionLabel" | "dismissible" | "dismissLabel" | "onAction" | "onDismiss"> {}

export interface RolesAndPermissionsAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface RolesAndPermissionsChangeMeta {
  role: RolesAndPermissionsRole;
  permission: RolesAndPermissionsPermission;
  meta: SwitchValueMeta | CheckboxValueMeta;
}

export interface RolesAndPermissionsProps {
  label?: string;
  description?: string;
  density?: RolesAndPermissionsDensity;
  state?: RolesAndPermissionsState;
  disabled?: boolean;
  saving?: boolean;
  mode?: RolesAndPermissionsMode;
  roles?: RolesAndPermissionsRole[];
  permissions?: RolesAndPermissionsPermission[];
  values?: RolesAndPermissionsValues;
  validation?: RolesAndPermissionsValidation;
  confirmation?: RolesAndPermissionsConfirmation;
  audit?: RolesAndPermissionsAudit;
  feedback?: RolesAndPermissionsFeedback;
  actions?: RolesAndPermissionsAction[];
  className?: string;
  onPermissionChange?: (
    roleKey: string,
    permissionKey: string,
    checked: boolean,
    meta: RolesAndPermissionsChangeMeta,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface RolesAndPermissionsComponent extends ForwardRefExoticComponent<RolesAndPermissionsProps & RefAttributes<HTMLDivElement>> {
  displayName: "RolesAndPermissions";
}

export const RolesAndPermissions: RolesAndPermissionsComponent;
