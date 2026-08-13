import React, { forwardRef } from "react";
import type { ChangeEvent, ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { AuditEvent } from "../AuditEvent.js";
import type { AuditEventProps } from "../AuditEvent.js";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxValueMeta } from "../Checkbox.js";
import { Dialog } from "../Dialog.js";
import type { DialogAction, DialogProps } from "../Dialog.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Switch } from "../Switch.js";
import type { SwitchValueMeta } from "../Switch.js";
import { Table } from "../Table.js";
import type { TableColumn, TableDensity, TableRow } from "../Table.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import { Tooltip } from "../Tooltip.js";

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

type RolesAndPermissionsRestProps = Record<string, unknown>;
type PermissionRow = TableRow & { id: string; permission: React.ReactNode };

interface RolesAndPermissionsStateInput {
  disabled?: boolean | undefined;
  saving?: boolean | undefined;
  state?: RolesAndPermissionsState | undefined;
}

interface CellControlInput {
  mode: RolesAndPermissionsMode;
  checked: boolean;
  disabled?: boolean | undefined;
  density?: RolesAndPermissionsDensity | undefined;
  role: RolesAndPermissionsRole;
  permission: RolesAndPermissionsPermission;
  onPermissionChange?: RolesAndPermissionsProps["onPermissionChange"];
}

function sanitizeRestProps(rest: RolesAndPermissionsRestProps): Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>;
}

function normalizeRoles(roles: RolesAndPermissionsRole[] | null | undefined): RolesAndPermissionsRole[] {
  return (Array.isArray(roles) ? roles : []).filter((role) => Boolean(role?.label));
}

function normalizePermissions(permissions: RolesAndPermissionsPermission[] | null | undefined): RolesAndPermissionsPermission[] {
  return (Array.isArray(permissions) ? permissions : []).filter((permission) => Boolean(permission?.label));
}

function permissionKey(permission: RolesAndPermissionsPermission): string {
  return String(permission.key ?? permission.value ?? permission.label);
}

function roleKey(role: RolesAndPermissionsRole): string {
  return String(role.key ?? role.value ?? role.label);
}

function resolveState({ disabled, saving, state }: RolesAndPermissionsStateInput): RolesAndPermissionsState {
  if (disabled) return "permission-blocked";
  if (saving || state === "saving") return "saving";
  return state ?? "read-only";
}

function tableCellNode(row: TableRow, key: string): React.ReactNode {
  return row[key] as React.ReactNode;
}

function actionKey(action: RolesAndPermissionsAction): string {
  return String(action.key ?? action.label);
}

function cellControl({ mode, checked, disabled, density, role, permission, onPermissionChange }: CellControlInput): React.ReactElement {
  const label = `${role.label}: ${permission.label}`;
  const roleKeyValue = roleKey(role);
  const permissionKeyValue = permissionKey(permission);
  const shared = {
    label,
    density,
    checked,
    disabled,
    name: `${roleKeyValue}-${permissionKeyValue}`,
    "data-role-key": roleKeyValue,
    "data-permission-key": permissionKeyValue,
  };
  const onCheckedChange = (nextChecked: boolean, meta: SwitchValueMeta | CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => {
    onPermissionChange?.(roleKeyValue, permissionKeyValue, nextChecked, { role, permission, meta }, event);
  };
  return mode === "checkbox"
    ? React.createElement(Checkbox, {
      ...shared,
      variant: "compact",
      state: disabled ? "disabled" : checked ? "checked" : "unchecked",
      onCheckedChange,
    } as ComponentProps<typeof Checkbox>)
    : React.createElement(Switch, {
      ...shared,
      state: disabled ? "disabled" : checked ? "on" : "off",
      onCheckedChange,
    } as ComponentProps<typeof Switch>);
}

export const RolesAndPermissions = forwardRef<HTMLDivElement, RolesAndPermissionsProps>(function RolesAndPermissions({
  label = "Roles and permissions",
  description,
  density,
  state,
  disabled = false,
  saving = false,
  mode = "switch",
  roles = [],
  permissions = [],
  values = {},
  validation,
  confirmation,
  audit,
  feedback,
  actions = [],
  onPermissionChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const normalizedRoles = normalizeRoles(roles);
  const normalizedPermissions = normalizePermissions(permissions);
  const resolvedState = resolveState({ disabled, saving, state });
  const isDisabled = disabled || resolvedState === "permission-blocked";
  const roleColumns: TableColumn[] = normalizedRoles.map((role) => ({
    key: roleKey(role),
    label: role.label,
    render: (row) => tableCellNode(row, roleKey(role)),
  }));
  const columns: TableColumn[] = [
    {
      key: "permission",
      label: "Permission",
      priority: "primary",
      render: (row) => tableCellNode(row, "permission"),
    },
    ...roleColumns,
  ];
  const rows: PermissionRow[] = normalizedPermissions.map((permission) => {
    const key = permissionKey(permission);
    const disabledReason = permission.disabledReason ?? permission.reason;
    const row: PermissionRow = {
      id: key,
      permission: React.createElement(
        React.Fragment,
        null,
        React.createElement(Badge, {
          label: permission.badge ?? permission.scope ?? "Permission",
          tone: permission.tone ?? "neutral",
          variant: "status",
          density,
          state: isDisabled || permission.disabled ? "disabled" : "default",
        } as ComponentProps<typeof Badge>),
        permission.label,
        disabledReason
          ? React.createElement(Tooltip, {
            triggerLabel: `${permission.label} reason`,
            content: disabledReason,
            variant: "disabled-help",
            density,
            state: permission.disabled ? "disabled" : "default",
          } as ComponentProps<typeof Tooltip>)
          : null,
      ),
    };
    for (const role of normalizedRoles) {
      const keyForRole = roleKey(role);
      const roleValues = values[keyForRole] ?? {};
      const checked = Boolean(roleValues[key]);
      const controlDisabled = isDisabled || role.disabled || permission.disabled;
      row[keyForRole] = cellControl({
        mode,
        checked,
        disabled: controlDisabled,
        density,
        role,
        permission,
        onPermissionChange,
      });
    }
    return row;
  });

  if (!normalizedRoles.length || !normalizedPermissions.length) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "saving" ? "true" : undefined,
      "data-flow-pattern": "roles-and-permissions",
      "data-state": resolvedState,
      "data-density": density,
      "data-role-count": String(normalizedRoles.length),
      "data-permission-count": String(normalizedPermissions.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Table, {
      label,
      columns,
      rows,
      rowKey: "id",
      variant: "selectable",
      state: resolvedState === "dirty" ? "selected" : "default",
      density,
      "aria-description": description,
    } as ComponentProps<typeof Table>),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "error" ? "error" : "warning"),
        density,
        live: validation.live,
      } as ComponentProps<typeof InlineValidation>)
      : null,
    audit?.label
      ? React.createElement(AuditEvent, {
        label: audit.label,
        description: audit.description,
        meta: audit.meta,
        status: audit.status,
        icon: audit.icon,
        tone: audit.tone ?? "info",
        state: audit.state ?? "default",
        density,
        timestamp: audit.timestamp,
      } as ComponentProps<typeof AuditEvent>)
      : null,
    confirmation?.label
      ? React.createElement(Dialog, {
        label: confirmation.label,
        description: confirmation.description,
        open: confirmation.open,
        tone: confirmation.tone ?? "danger",
        variant: confirmation.variant ?? "confirmation",
        state: confirmation.open ? "open" : "closed",
        density,
        actions: confirmation.actions,
        onOpenChange: confirmation.onOpenChange,
        onAction: confirmation.onAction,
      } as ComponentProps<typeof Dialog>)
      : null,
    actions.filter((action) => action?.label).map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: saving || action.loading,
      onClick: (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onAction?.(actionKey(action), event);
      },
    } as ComponentProps<typeof Button>)),
    feedback?.label
      ? React.createElement(Toast, {
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? (resolvedState === "saved" ? "success" : resolvedState === "error" ? "danger" : "info"),
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density,
        actionLabel: feedback.actionLabel,
        dismissible: feedback.dismissible,
        dismissLabel: feedback.dismissLabel,
        onAction: feedback.onAction,
        onDismiss: feedback.onDismiss,
      } as ComponentProps<typeof Toast>)
      : null,
  );
}) as RolesAndPermissionsComponent;

RolesAndPermissions.displayName = "RolesAndPermissions";
