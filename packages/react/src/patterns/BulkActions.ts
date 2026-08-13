import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxProps } from "../Checkbox.js";
import { Dialog } from "../Dialog.js";
import type { DialogProps } from "../Dialog.js";
import { Menu } from "../Menu.js";
import type { MenuProps } from "../Menu.js";
import { ProgressIndicator } from "../ProgressIndicator.js";
import type { ProgressIndicatorProps } from "../ProgressIndicator.js";
import { Table } from "../Table.js";
import type { TableProps } from "../Table.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Toolbar } from "./Toolbar.js";
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

type BulkActionsRestProps = Record<string, unknown>;

interface ResolveStateInput {
  disabled: boolean;
  selectedCount: number;
  eligibleCount: number;
  confirming: boolean;
  running: boolean;
  partialFailure: boolean;
  complete: boolean;
  state?: BulkActionsState | undefined;
}

function sanitizeRestProps(rest: BulkActionsRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({
  disabled,
  selectedCount,
  eligibleCount,
  confirming,
  running,
  partialFailure,
  complete,
  state,
}: ResolveStateInput): BulkActionsState {
  if (disabled || state === "disabled") return "disabled";
  if (running || state === "running") return "running";
  if (partialFailure || state === "partial-failure") return "partial-failure";
  if (complete || state === "complete") return "complete";
  if (confirming || state === "confirming") return "confirming";
  if (selectedCount > 0 && eligibleCount < selectedCount) return "partially-eligible";
  if (selectedCount > 0 || state === "selected") return "selected";
  return state ?? "none-selected";
}

export const BulkActions = forwardRef<HTMLDivElement, BulkActionsProps>(function BulkActions({
  label = "Bulk actions",
  density,
  state,
  disabled = false,
  selectedCount = 0,
  totalCount = 0,
  eligibleCount,
  selection,
  table,
  actions = [],
  overflow,
  confirmation,
  progress,
  feedback,
  toolbar,
  className = "",
  ...rest
}, ref) {
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
  const computedEligibleCount = typeof eligibleCount === "number" ? eligibleCount : selectedCount;
  const resolvedState = resolveState({
    disabled,
    selectedCount,
    eligibleCount: computedEligibleCount,
    confirming: Boolean(confirmation?.open),
    running: progress?.state === "active" || progress?.state === "indeterminate",
    partialFailure: feedback?.tone === "danger" || progress?.state === "error",
    complete: progress?.state === "complete" || feedback?.tone === "success",
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || selectedCount === 0;
  const selectionDescription = selection?.description
    ?? `${selectedCount} of ${totalCount || selectedCount} selected; ${computedEligibleCount} eligible.`;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "running" ? "true" : undefined,
      "data-flow-pattern": "bulk-actions",
      "data-state": resolvedState,
      "data-density": density,
      "data-selected-count": String(selectedCount),
      "data-eligible-count": String(computedEligibleCount),
      "data-action-count": String(normalizedActions.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Checkbox, {
      label: selection?.label ?? "Select records",
      description: selectionDescription,
      checked: selectedCount > 0 && selectedCount === totalCount && totalCount > 0,
      indeterminate: selectedCount > 0 && selectedCount < totalCount,
      variant: "select-all",
      density,
      disabled: disabled || selection?.disabled,
      onCheckedChange: selection?.onCheckedChange,
    } as ComponentProps<typeof Checkbox>),
    React.createElement(Badge, {
      label: `${selectedCount} selected`,
      ariaLabel: `${selectedCount} selected records`,
      tone: selectedCount > 0 ? "info" : "neutral",
      variant: "status",
      density,
      live: true,
    } as ComponentProps<typeof Badge>),
    computedEligibleCount < selectedCount
      ? React.createElement(Badge, {
        label: `${computedEligibleCount} eligible`,
        ariaLabel: `${computedEligibleCount} selected records are eligible`,
        tone: "warning",
        variant: "status",
        density,
        live: true,
      } as ComponentProps<typeof Badge>)
      : null,
    table
      ? React.createElement(Table, {
        ...table,
        density: table.density ?? density,
        variant: table.variant ?? "selectable",
      } as ComponentProps<typeof Table>)
      : null,
    toolbar
      ? React.createElement(Toolbar, {
        ...toolbar,
        density: toolbar.density ?? density,
      } as ComponentProps<typeof Toolbar>)
      : null,
    normalizedActions.map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: resolvedState === "running" || action.loading,
    } as ComponentProps<typeof Button>)),
    overflow?.items?.length
      ? React.createElement(Menu, {
        triggerLabel: overflow.triggerLabel ?? "More bulk actions",
        label: overflow.label ?? "Bulk action menu",
        items: overflow.items,
        open: overflow.open,
        variant: overflow.variant ?? "actions",
        density,
        state: isDisabled ? "disabled" : overflow.open ? "open" : "closed",
        align: overflow.align ?? "end",
        disabled: isDisabled || overflow.disabled,
        onOpenChange: overflow.onOpenChange,
        onSelect: overflow.onSelect,
      } as ComponentProps<typeof Menu>)
      : null,
    confirmation
      ? React.createElement(Dialog, {
        ...confirmation,
        density: confirmation.density ?? density,
        open: confirmation.open,
        state: confirmation.open ? "open" : "closed",
        variant: confirmation.variant ?? "confirmation",
      } as ComponentProps<typeof Dialog>)
      : null,
    progress
      ? React.createElement(ProgressIndicator, {
        ...progress,
        density: progress.density ?? density,
        fullWidth: progress.fullWidth ?? true,
      } as ComponentProps<typeof ProgressIndicator>)
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ComponentProps<typeof Toast>)
      : null,
  );
}) as BulkActionsComponent;

BulkActions.displayName = "BulkActions";
