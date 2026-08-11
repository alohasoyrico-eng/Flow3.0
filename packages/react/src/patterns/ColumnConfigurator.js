import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { Dialog } from "../Dialog.js";
import { Drawer } from "../Drawer.js";
import { InlineValidation } from "../InlineValidation.js";
import { Menu } from "../Menu.js";
import { Surface } from "../Surface.js";
import { Table } from "../Table.js";
import { Toast } from "../Toast.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeColumns(columns) {
  return (Array.isArray(columns) ? columns : []).filter((column) => column?.key && column?.label);
}

function resolveState({ disabled, saving, invalid, dirtyCount, open, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (invalid || state === "invalid") return "invalid";
  if (saving || state === "saving") return "saving";
  if (state === "resetting") return "resetting";
  if (state === "saved") return "saved";
  if (dirtyCount > 0 || state === "dirty") return "dirty";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

function columnChecked(column, visibleKeys) {
  if (column.visible !== undefined) return Boolean(column.visible);
  if (visibleKeys.length) return visibleKeys.includes(column.key);
  return !column.hidden;
}

function previewColumns(columns, visibleKeys) {
  return columns
    .filter((column) => column.required || columnChecked(column, visibleKeys))
    .map((column) => ({
      key: column.key,
      label: column.label,
      sortable: column.sortable,
      align: column.align,
      mono: column.mono,
      priority: column.priority,
      render: column.render,
    }));
}

function overlayActions({ applyAction, resetAction, cancelAction, saveViewAction, density, isDisabled, resolvedState, onAction }) {
  return [applyAction, resetAction, saveViewAction, cancelAction]
    .filter(Boolean)
    .map((action) => ({
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
    });
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
    });
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
  });
}

export const ColumnConfigurator = forwardRef(function ColumnConfigurator({
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
  const checkedColumns = normalizedColumns.map((column) => ({
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
	    }),
    React.createElement(Surface, {
      surfaceRole: "panel",
      state: isDisabled ? "disabled" : open ? "overlay" : "default",
      density,
      "data-column-configurator-surface": "controls",
    },
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
        onCheckedChange: (checked, meta, event) => onColumnVisibilityChange?.(column.key, checked, meta, event),
      })),
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
    }),
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
      })
      : null,
    actions.map((action, index) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? (index === 0 ? "primary" : "secondary"),
      density: action.density ?? density,
      disabled: action.disabled,
      loading: action.loading,
    })),
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      })
      : null,
  );
});

ColumnConfigurator.displayName = "ColumnConfigurator";
