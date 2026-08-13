import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxProps, CheckboxValueMeta } from "../Checkbox.js";
import { Dialog } from "../Dialog.js";
import type { DialogProps } from "../Dialog.js";
import { Drawer } from "../Drawer.js";
import type { DrawerProps } from "../Drawer.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Menu } from "../Menu.js";
import type { MenuAlign, MenuItem, MenuProps } from "../Menu.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Table } from "../Table.js";
import type { TableColumn, TableDensity, TableProps, TableRow } from "../Table.js";
import { Toast } from "../Toast.js";
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

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

type ColumnWithChecked = ColumnConfiguratorColumn & { checked: boolean };

type ConfiguratorAction = Omit<ColumnConfiguratorAction, "density" | "disabled" | "loading"> & {
  key: string;
  density: ColumnConfiguratorDensity | undefined;
  disabled: boolean | undefined;
  loading: boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeColumns(columns: ColumnConfiguratorColumn[] | undefined): ColumnConfiguratorColumn[] {
  return (Array.isArray(columns) ? columns : []).filter((column): column is ColumnConfiguratorColumn => Boolean(column?.key && column?.label));
}

function resolveState({
  disabled,
  saving,
  invalid,
  dirtyCount,
  open,
  state,
}: {
  disabled: boolean;
  saving: boolean;
  invalid: boolean;
  dirtyCount: number;
  open: boolean;
  state: ColumnConfiguratorState | undefined;
}): ColumnConfiguratorState {
  if (disabled || state === "disabled") return "disabled";
  if (invalid || state === "invalid") return "invalid";
  if (saving || state === "saving") return "saving";
  if (state === "resetting") return "resetting";
  if (state === "saved") return "saved";
  if (dirtyCount > 0 || state === "dirty") return "dirty";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

function columnChecked(column: ColumnConfiguratorColumn, visibleKeys: string[]): boolean {
  if (column.visible !== undefined) return Boolean(column.visible);
  if (visibleKeys.length) return visibleKeys.includes(column.key);
  return !column.hidden;
}

function previewColumns(columns: ColumnWithChecked[], visibleKeys: string[]): TableColumn[] {
  return columns
    .filter((column) => column.required || columnChecked(column, visibleKeys))
    .map((column): TableColumn => ({
      key: column.key,
      label: column.label,
      ...(column.sortable !== undefined ? { sortable: column.sortable } : {}),
      ...(column.align !== undefined ? { align: column.align } : {}),
      ...(column.mono !== undefined ? { mono: column.mono } : {}),
      ...(column.priority !== undefined ? { priority: column.priority } : {}),
      ...(column.render !== undefined ? { render: column.render } : {}),
    }));
}

function overlayActions({
  applyAction,
  resetAction,
  cancelAction,
  saveViewAction,
  density,
  isDisabled,
  resolvedState,
  onAction,
}: {
  applyAction: ColumnConfiguratorAction | undefined;
  resetAction: ColumnConfiguratorAction | undefined;
  cancelAction: ColumnConfiguratorAction | undefined;
  saveViewAction: ColumnConfiguratorAction | undefined;
  density: ColumnConfiguratorDensity | undefined;
  isDisabled: boolean;
  resolvedState: ColumnConfiguratorState;
  onAction: ColumnConfiguratorProps["onAction"];
}): ConfiguratorAction[] {
  return [applyAction, resetAction, saveViewAction, cancelAction]
    .filter((action): action is ColumnConfiguratorAction => Boolean(action))
    .map((action): ConfiguratorAction => ({
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: resolvedState === "saving" || action.loading,
      onClick: (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onAction?.(action.key ?? action.label, event);
      },
    }));
}

function renderOverlay({
  label,
  description,
  density,
  open,
  surface,
  resolvedState,
  actions,
  isDisabled,
  visibleCount,
  totalCount,
  onOpenChange,
  onMenuSelect,
}: {
  label: string;
  description: string | undefined;
  density: ColumnConfiguratorDensity | undefined;
  open: boolean;
  surface: ColumnConfiguratorSurface | undefined;
  resolvedState: ColumnConfiguratorState;
  actions: ConfiguratorAction[];
  isDisabled: boolean;
  visibleCount: number;
  totalCount: number;
  onOpenChange: ColumnConfiguratorProps["onOpenChange"];
  onMenuSelect: NonNullable<MenuProps["onSelect"]>;
}) {
  const mode = surface?.mode ?? "drawer";
  const triggerLabel = surface?.triggerLabel ?? "Configure columns";
  const overlayLabel = surface?.label ?? label;
  const overlayDescription = surface?.description ?? description ?? `${visibleCount} of ${totalCount} columns visible.`;

  if (mode === "menu") {
    return React.createElement(Menu, {
      triggerLabel,
      label: overlayLabel,
      items: [
        { key: "apply", label: actions[0]?.label ?? "Apply columns", disabled: isDisabled || !actions[0] },
        { key: "reset", label: actions[1]?.label ?? "Reset columns", disabled: isDisabled || !actions[1] },
        "divider",
        { key: "save-view", label: actions[2]?.label ?? "Save view", disabled: isDisabled || !actions[2] },
      ],
      open,
      variant: "selection",
      density,
      state: isDisabled ? "disabled" : open ? "open" : "default",
      align: surface?.align ?? "end",
      disabled: isDisabled,
      onOpenChange,
      onSelect: onMenuSelect,
    } as MenuProps);
  }

  if (mode === "dialog") {
    return React.createElement(Dialog, {
      label: overlayLabel,
      description: overlayDescription,
      triggerLabel,
      closeLabel: surface?.closeLabel ?? "Close column configuration",
      actions,
      open,
      tone: resolvedState === "invalid" ? "danger" : "neutral",
      variant: "review",
      state: open ? "open" : "closed",
      density,
      onOpenChange,
    } as DialogProps);
  }

  return React.createElement(Drawer, {
    label: overlayLabel,
    description: overlayDescription,
    triggerLabel,
    closeLabel: surface?.closeLabel ?? "Close column configuration",
    content: [
      { type: "badge", key: "visible-count", label: `${visibleCount}/${totalCount} visible`, tone: resolvedState === "invalid" ? "danger" : "info", variant: "status", live: true },
    ],
    actions,
    open,
    variant: "filter",
    state: open ? "open" : "closed",
    density,
    side: surface?.side ?? "right",
    onOpenChange,
  } as DrawerProps);
}

export const ColumnConfigurator = forwardRef<HTMLDivElement, ColumnConfiguratorProps>(function ColumnConfigurator({
  label = "Column configurator",
  description,
  density,
  state,
  disabled = false,
  open = false,
  saving = false,
  invalid = false,
  surface,
  columns = [],
  visibleKeys = [],
  defaultVisibleKeys = [],
  rows = [],
  rowKey = "id",
  table,
  applyAction,
  resetAction,
  saveViewAction,
  cancelAction,
  validation,
  feedback,
  className = "",
  onOpenChange,
  onColumnVisibilityChange,
  onAction,
  ...rest
}, ref) {
  const normalizedColumns = normalizeColumns(columns);
  const checkedColumns = normalizedColumns.map((column): ColumnWithChecked => ({
    ...column,
    checked: columnChecked(column, visibleKeys),
  }));
  const visibleCount = checkedColumns.filter((column) => column.checked || column.required).length;
  const defaultCount = defaultVisibleKeys.length || checkedColumns.filter((column) => column.defaultVisible ?? !column.hidden).length;
  const dirtyCount = Math.abs(visibleCount - defaultCount);
  const requiredHidden = checkedColumns.some((column) => column.required && !column.checked);
  const resolvedState = resolveState({ disabled, saving, invalid: invalid || requiredHidden || validation?.state === "error", dirtyCount, open, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "saving";
  const actions = overlayActions({ applyAction, resetAction, cancelAction, saveViewAction, density, isDisabled, resolvedState, onAction });
  const resolvedPreviewColumns = previewColumns(checkedColumns, visibleKeys);
  const previewRows = Array.isArray(rows) ? rows : [];

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "saving" ? "true" : undefined,
      "data-flow-pattern": "column-configurator",
      "data-state": resolvedState,
      "data-density": density,
      "data-visible-count": String(visibleCount),
      "data-column-count": String(checkedColumns.length),
      "data-surface-mode": surface?.mode ?? "drawer",
      ...sanitizeRestProps(rest),
    },
    renderOverlay({
      label,
      description,
      density,
      open,
      surface,
      resolvedState,
      actions,
      isDisabled,
      visibleCount,
      totalCount: checkedColumns.length,
      onOpenChange,
      onMenuSelect: (item, event) => {
        const action = actions.find((candidate) => candidate.key === item.key);
        action?.onClick?.(event);
      },
    }),
    React.createElement(Badge, {
      label: `${visibleCount} visible`,
      tone: resolvedState === "invalid" ? "danger" : dirtyCount ? "warning" : "info",
      variant: "count",
      density,
      state: isDisabled ? "disabled" : "default",
      live: true,
    } as BadgeProps),
    React.createElement(Surface, {
      surfaceRole: "panel",
      state: isDisabled ? "disabled" : open ? "overlay" : "default",
      density,
      "data-column-configurator-surface": "controls",
    } as SurfaceProps,
      checkedColumns.map((column) => React.createElement(Checkbox, {
        key: column.key,
        label: column.label,
        description: column.required ? column.requiredReason ?? "Required column" : column.description,
        variant: column.required ? "descriptive" : "compact",
        density,
        checked: column.required ? true : column.checked,
        disabled: isDisabled || column.required || column.disabled,
        state: isDisabled || column.disabled ? "disabled" : column.required ? "checked" : column.checked ? "checked" : "unchecked",
        name: column.name ?? "columns",
        value: column.key,
        onCheckedChange: (checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => onColumnVisibilityChange?.(column.key, checked, meta, event),
      } as CheckboxProps)),
    ),
    React.createElement(Table, {
      ...(table ?? {}),
      label: table?.label ?? `${label} preview`,
      columns: resolvedPreviewColumns,
      rows: previewRows,
      rowKey: table?.rowKey ?? rowKey,
      variant: table?.variant ?? "standard",
      state: resolvedState === "invalid" ? "default" : table?.state ?? "default",
      density: table?.density ?? density,
      sortKey: table?.sortKey,
      sortDir: table?.sortDir,
      selectedKey: table?.selectedKey,
      onSortChange: table?.onSortChange,
      onRowSelect: table?.onRowSelect,
    } as TableProps),
    validation || requiredHidden
      ? React.createElement(InlineValidation, {
        label: validation?.label ?? label,
        value: validation?.value,
        message: validation?.message ?? "Required columns cannot be hidden.",
        state: validation?.state ?? "error",
        density,
        fullWidth: true,
        field: validation?.field ?? true,
        live: validation?.live ?? true,
      } as InlineValidationProps)
      : null,
    actions.map((action, index) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? (index === 0 ? "primary" : "secondary"),
      density: action.density ?? density,
      disabled: action.disabled,
      loading: action.loading,
    } as ButtonProps)),
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ToastProps)
      : null,
  );
}) as ColumnConfiguratorComponent;

ColumnConfigurator.displayName = "ColumnConfigurator";
