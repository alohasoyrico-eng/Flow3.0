import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { AuditEvent } from "../AuditEvent.js";
import type { AuditEventProps } from "../AuditEvent.js";
import { Avatar } from "../Avatar.js";
import type { AvatarProps } from "../Avatar.js";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { CardSummary } from "../CardSummary.js";
import type { CardSummaryProps } from "../CardSummary.js";
import { Dialog } from "../Dialog.js";
import type { DialogProps } from "../Dialog.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { IconButton } from "../IconButton.js";
import type { IconButtonProps, IconButtonState, IconButtonVariant } from "../IconButton.js";
import { Pagination } from "../Pagination.js";
import type { PaginationProps } from "../Pagination.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Table } from "../Table.js";
import type { TableColumn, TableProps, TableRow } from "../Table.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Toolbar } from "./Toolbar.js";
import type { ToolbarProps } from "./Toolbar.js";

export type DriverAndVehicleAdministrationState = "loading" | "empty" | "ready" | "selected" | "action-running" | "permission-blocked" | "error" | "disabled";
export type DriverAndVehicleAdministrationDensity = ButtonProps["density"];
export type DriverAndVehicleAdministrationActionVariant = "standard" | "compact" | "wide";
export type DriverAndVehicleAdministrationActionState = "default" | "hover" | "focus" | "pressed" | "loading" | "warning" | "disabled";
export type DriverAndVehicleAdministrationActionIntent = "default" | "danger" | "warning";

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

export interface DriverAndVehicleAdministrationActionMeta {
  label: string;
  variant: DriverAndVehicleAdministrationActionVariant;
  intent: DriverAndVehicleAdministrationActionIntent;
  state: DriverAndVehicleAdministrationActionState;
}

export interface DriverAndVehicleAdministrationAction extends Omit<IconButtonProps, "ariaLabel" | "badge" | "icon" | "label" | "loading" | "onClick" | "selected" | "state" | "variant" | "intent"> {
  key?: string;
  label: string;
  icon?: string;
  badge?: string;
  variant?: DriverAndVehicleAdministrationActionVariant;
  state?: DriverAndVehicleAdministrationActionState;
  intent?: DriverAndVehicleAdministrationActionIntent;
  loading?: boolean;
  onAction?: (meta: DriverAndVehicleAdministrationActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
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

function iconButtonVariantForAction(variant: DriverAndVehicleAdministrationActionVariant): IconButtonVariant {
  return variant === "compact" ? "ghost" : "secondary";
}

function iconButtonStateForAction(state: DriverAndVehicleAdministrationActionState): IconButtonState {
  return state === "warning" ? "default" : state;
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

type AdministrationTableRow = TableRow & {
  id: string;
  label: string;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeRecords(records: DriverAndVehicleAdministrationRecord[] | undefined): DriverAndVehicleAdministrationRecord[] {
  return (Array.isArray(records) ? records : []).filter((record): record is DriverAndVehicleAdministrationRecord => Boolean(record?.key || record?.id));
}

function resolveState({
  disabled,
  loading,
  empty,
  selectedKey,
  actionRunning,
  permissionBlocked,
  error,
  state,
  records,
}: {
  disabled: boolean;
  loading: boolean;
  empty: boolean;
  selectedKey: string | undefined;
  actionRunning: boolean;
  permissionBlocked: boolean;
  error: boolean;
  state: DriverAndVehicleAdministrationState | undefined;
  records: DriverAndVehicleAdministrationRecord[];
}): DriverAndVehicleAdministrationState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (actionRunning || state === "action-running") return "action-running";
  if (loading || state === "loading") return "loading";
  if (empty || records.length === 0 || state === "empty") return "empty";
  if (selectedKey || state === "selected") return "selected";
  return state ?? "ready";
}

function recordTone(record: DriverAndVehicleAdministrationRecord): BadgeProps["tone"] {
  if (record.tone) return record.tone;
  if (record.status === "blocked" || record.status === "expired") return "danger";
  if (record.status === "warning" || record.status === "review") return "warning";
  if (record.status === "active" || record.status === "ready") return "success";
  return "info";
}

function toTableRow(
  record: DriverAndVehicleAdministrationRecord,
  density: DriverAndVehicleAdministrationDensity,
  isDisabled: boolean,
): AdministrationTableRow {
  const key = String(record.key ?? record.id);
  const owner = record.owner ?? record.driver ?? record.name ?? record.label;
  return {
    ...record,
    id: key,
    label: String(record.label ?? owner ?? key),
    identity: React.createElement(Avatar, {
      name: String(owner ?? record.label ?? key),
      src: record.avatarSrc,
      status: record.presence,
      density,
      state: isDisabled || record.disabled ? "disabled" : "default",
    } as AvatarProps),
    statusCell: React.createElement(Badge, {
      label: record.statusLabel ?? record.status ?? "Ready",
      tone: recordTone(record),
      variant: "status",
      density,
      state: isDisabled || record.disabled ? "disabled" : "default",
    } as BadgeProps),
    vehicle: record.vehicle ?? record.plate ?? record.unit ?? "",
    type: record.type ?? record.kind ?? "Record",
  };
}

export const DriverAndVehicleAdministration = forwardRef<HTMLDivElement, DriverAndVehicleAdministrationProps>(function DriverAndVehicleAdministration({
  label = "Driver and vehicle administration",
  description,
  density,
  state,
  disabled = false,
  loading = false,
  empty = false,
  selectedKey,
  actionRunning = false,
  permissionBlocked = false,
  error = false,
  toolbar,
  summary,
  records = [],
  columns,
  actions = [],
  primaryAction,
  secondaryAction,
  dialog,
  audit,
  pagination,
  emptyState,
  feedback,
  className = "",
  onRowSelect,
  onAction,
  onDialogAction,
  ...rest
}, ref) {
  const normalizedRecords = normalizeRecords(records);
  const resolvedState = resolveState({
    disabled,
    loading,
    empty,
    selectedKey,
    actionRunning,
    permissionBlocked,
    error,
    state,
    records: normalizedRecords,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
  const isBusy = resolvedState === "loading" || resolvedState === "action-running";
  const showEmpty = resolvedState === "empty" || resolvedState === "loading" || resolvedState === "error" || resolvedState === "permission-blocked";
  const tableRows = normalizedRecords.map((record) => toTableRow(record, density, isDisabled));
  const tableColumns: TableColumn[] = Array.isArray(columns) && columns.length
    ? columns
    : [
      { key: "identity", label: "Driver", priority: "primary" },
      { key: "vehicle", label: "Vehicle", priority: "secondary" },
      { key: "type", label: "Type", priority: "secondary" },
      { key: "statusCell", label: "Status", priority: "primary" },
    ];
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action): action is DriverAndVehicleAdministrationAction => Boolean(action?.label));

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": isBusy ? "true" : undefined,
      "aria-disabled": isDisabled ? "true" : undefined,
      "data-flow-pattern": "driver-and-vehicle-administration",
      "data-state": resolvedState,
      "data-density": density,
      "data-record-count": String(normalizedRecords.length),
      "data-action-count": String(normalizedActions.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Toolbar, {
      ...(toolbar ?? {}),
      label: toolbar?.label ?? `${label} toolbar`,
      density: toolbar?.density ?? density,
      state: toolbar?.state ?? (permissionBlocked ? "permission-blocked" : loading ? "loading" : undefined),
      loading,
      disabled: isDisabled || toolbar?.disabled,
      permissionBlocked: permissionBlocked || toolbar?.permissionBlocked,
      "data-admin-toolbar-boundary": "true",
    } as ToolbarProps),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: isDisabled ? "disabled" : isBusy ? "raised" : resolvedState === "selected" ? "selected" : "default",
      density,
      "data-admin-surface": "true",
    } as SurfaceProps,
      React.createElement(CardSummary, {
        ...(summary ?? {}),
        label: summary?.label ?? label,
        meta: summary?.meta ?? description,
        number: summary?.number ?? `${normalizedRecords.length} records`,
        status: summary?.status ?? (permissionBlocked ? "Permission blocked" : error ? "Needs attention" : "Active"),
        metrics: summary?.metrics,
        variant: summary?.variant ?? "limit",
        state: summary?.state ?? (isDisabled ? "disabled" : error ? "warning" : "default"),
        density: summary?.density ?? density,
        fullWidth: summary?.fullWidth ?? true,
      } as CardSummaryProps),
      showEmpty
        ? React.createElement(EmptyState, {
          title: emptyState?.title ?? (loading ? "Loading records" : permissionBlocked ? "Permission required" : error ? "Administration unavailable" : "No records"),
          description: emptyState?.description ?? description,
          icon: emptyState?.icon ?? (loading ? "sync" : permissionBlocked ? "lock" : error ? "error" : "inventory_2"),
          action: emptyState?.action,
          variant: emptyState?.variant ?? (permissionBlocked ? "permission" : error ? "error" : "search-empty"),
          state: emptyState?.state ?? (loading ? "loading" : permissionBlocked ? "permission" : error ? "error" : "search-empty"),
          density,
          fullWidth: true,
          onAction: emptyState?.onAction,
        } as EmptyStateProps)
        : React.createElement(Table, {
          label: `${label} records`,
          columns: tableColumns,
          rows: tableRows,
          rowKey: "id",
          variant: selectedKey || onRowSelect ? "selectable" : "standard",
          state: selectedKey ? "selected" : "default",
          density,
          selectedKey,
          onRowSelect,
        } as TableProps),
      pagination
        ? React.createElement(Pagination, {
          label: pagination.label ?? `${label} pagination`,
          previousLabel: pagination.previousLabel ?? "Previous page",
          nextLabel: pagination.nextLabel ?? "Next page",
          getPageLabel: pagination.getPageLabel ?? ((page) => `Page ${page}`),
          page: pagination.page,
          pageCount: pagination.pageCount,
          density: pagination.density ?? density,
          disabled: isDisabled || pagination.disabled,
          fullWidth: pagination.fullWidth ?? true,
          onPageChange: pagination.onPageChange,
        } as PaginationProps)
        : null,
      normalizedActions.map((action) => {
        const actionState: DriverAndVehicleAdministrationActionState = isDisabled || action.disabled
          ? "disabled"
          : action.loading ?? (actionRunning && action.key === selectedKey)
            ? "loading"
            : action.state ?? "default";
        const variant: DriverAndVehicleAdministrationActionVariant = action.variant ?? "standard";
        const intent: DriverAndVehicleAdministrationActionIntent = action.intent === "danger" ? "danger" : action.intent === "warning" ? "warning" : "default";
        const meta: DriverAndVehicleAdministrationActionMeta = {
          label: action.label,
          variant,
          intent,
          state: actionState,
        };

        return React.createElement("div", {
          key: action.key ?? action.label,
          className: "pattern-action-item",
          "data-variant": variant,
          "data-intent": intent,
          "data-state": actionState,
          "data-density": action.density ?? density,
        },
        React.createElement(IconButton, {
          label: action.label,
          icon: action.icon,
          variant: iconButtonVariantForAction(variant),
          intent,
          state: iconButtonStateForAction(actionState),
          density: action.density ?? density,
          loading: action.loading ?? (actionRunning && action.key === selectedKey),
          disabled: isDisabled || action.disabled,
          className: "pattern-action-item__control",
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            action.onAction?.(meta, event);
            if (event.defaultPrevented) return;
            onAction?.(action.key ?? action.label, event);
          },
        } as React.ComponentProps<typeof IconButton>),
        action.label ? React.createElement("span", { className: "pattern-action-item__label" }, action.label) : null,
        action.badge
          ? React.createElement(Badge, {
            label: action.badge,
            variant: "count",
            density: action.density ?? density,
          } as React.ComponentProps<typeof Badge>)
          : null);
      }),
      primaryAction?.label
        ? React.createElement(Button, {
          ...primaryAction,
          label: primaryAction.label,
          variant: primaryAction.variant ?? "primary",
          density: primaryAction.density ?? density,
          loading: primaryAction.loading ?? actionRunning,
          disabled: isDisabled || primaryAction.disabled,
        } as ButtonProps)
        : null,
      secondaryAction?.label
        ? React.createElement(Button, {
          ...secondaryAction,
          label: secondaryAction.label,
          variant: secondaryAction.variant ?? "secondary",
          density: secondaryAction.density ?? density,
          disabled: isDisabled || secondaryAction.disabled,
        } as ButtonProps)
        : null,
      dialog
        ? React.createElement(Dialog, {
          ...dialog,
          label: dialog.label ?? "Confirm administration action",
          description: dialog.description,
          triggerLabel: dialog.triggerLabel ?? "Review action",
          closeLabel: dialog.closeLabel ?? "Close",
          variant: dialog.variant ?? "review",
          density: dialog.density ?? density,
          actions: dialog.actions,
          fields: dialog.fields,
          open: dialog.open,
          onOpenChange: dialog.onOpenChange,
          onAction: (key, event) => {
            dialog.onAction?.(key, event);
            if (event.defaultPrevented) return;
            onDialogAction?.(key, event);
          },
        } as DialogProps)
        : null,
      audit
        ? React.createElement(AuditEvent, {
          ...audit,
          label: audit.label ?? "Administration audit",
          description: audit.description,
          meta: audit.meta,
          status: audit.status,
          tone: audit.tone ?? "info",
          state: audit.state ?? (permissionBlocked ? "warning" : error ? "critical" : "verified"),
          density: audit.density ?? density,
          timestamp: audit.timestamp,
        } as AuditEventProps)
        : null,
      feedback
        ? React.createElement(Toast, {
          ...feedback,
          label: feedback.label,
          description: feedback.description,
          tone: feedback.tone ?? (error ? "danger" : permissionBlocked ? "warning" : "info"),
          variant: feedback.variant ?? "status",
          state: feedback.state ?? "visible",
          density: feedback.density ?? density,
        } as ToastProps)
        : null,
    ),
  );
}) as DriverAndVehicleAdministrationComponent;

DriverAndVehicleAdministration.displayName = "DriverAndVehicleAdministration";
