import React, { forwardRef } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxProps, CheckboxValueMeta } from "../Checkbox.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Input } from "../Input.js";
import type { InputProps } from "../Input.js";
import { KpiTile } from "../KpiTile.js";
import type { KpiTileProps } from "../KpiTile.js";
import { Select } from "../Select.js";
import type { SelectProps } from "../Select.js";
import { Stepper } from "../Stepper.js";
import type { StepperProps } from "../Stepper.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Table } from "../Table.js";
import type { TableProps, TableRow } from "../Table.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Settings } from "./Settings.js";
import type { SettingsProps } from "./Settings.js";

export type FleetManagerOnboardingDesktopState = "not-started" | "in-progress" | "blocked" | "validating" | "complete" | "empty" | "permission-blocked" | "disabled";
export type FleetManagerOnboardingDesktopDensity = ButtonProps["density"];

export type FleetManagerOnboardingDesktopMetric = Omit<Partial<KpiTileProps>, "tone"> & {
  key?: string;
  label: string;
  value: KpiTileProps["value"];
  tone?: BadgeProps["tone"];
};

export interface FleetManagerOnboardingDesktopTask extends Partial<CheckboxProps> {
  key?: string;
  id?: string;
  label: string;
}

export interface FleetManagerOnboardingDesktopProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FleetManagerOnboardingDesktopDensity;
  state?: FleetManagerOnboardingDesktopState;
  disabled?: boolean;
  inProgress?: boolean;
  blocked?: boolean;
  validating?: boolean;
  complete?: boolean;
  empty?: boolean;
  permissionBlocked?: boolean;
  steps?: StepperProps["steps"];
  currentStep?: StepperProps["current"];
  metrics?: FleetManagerOnboardingDesktopMetric[];
  tasks?: FleetManagerOnboardingDesktopTask[];
  fields?: Array<Partial<InputProps> & { key?: string }>;
  selects?: Array<Partial<SelectProps> & { key?: string }>;
  reviewColumns?: TableProps["columns"];
  reviewRows?: TableProps["rows"];
  settings?: Partial<SettingsProps>;
  validation?: Partial<InlineValidationProps>;
  primaryAction?: Omit<ButtonProps, "children" | "fullWidth"> & { key?: string };
  secondaryAction?: Omit<ButtonProps, "children" | "fullWidth"> & { key?: string };
  emptyState?: Partial<EmptyStateProps>;
  feedback?: Partial<ToastProps>;
  className?: string;
  onTaskChange?: (key: string, checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FleetManagerOnboardingDesktopComponent extends ForwardRefExoticComponent<FleetManagerOnboardingDesktopProps & RefAttributes<HTMLDivElement>> {
  displayName: "FleetManagerOnboardingDesktop";
}

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;
type NormalizedItem = { key?: string; id?: string; label?: string; checked?: boolean };

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeItems<T extends NormalizedItem>(items: T[] | undefined): T[] {
  return (Array.isArray(items) ? items : []).filter((item) => item?.key || item?.id || item?.label);
}

function resolveState({
  disabled,
  permissionBlocked,
  blocked,
  validating,
  complete,
  empty,
  inProgress,
  state,
  tasks,
  reviewRows,
}: {
  disabled: boolean;
  permissionBlocked: boolean;
  blocked: boolean;
  validating: boolean;
  complete: boolean;
  empty: boolean;
  inProgress: boolean;
  state?: FleetManagerOnboardingDesktopState | undefined;
  tasks: FleetManagerOnboardingDesktopTask[];
  reviewRows: TableRow[];
}): FleetManagerOnboardingDesktopState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (blocked || state === "blocked") return "blocked";
  if (validating || state === "validating") return "validating";
  if (complete || state === "complete") return "complete";
  if (empty || (!tasks.length && !reviewRows.length) || state === "empty") return "empty";
  if (inProgress || tasks.some((task) => task.checked) || state === "in-progress") return "in-progress";
  return state ?? "not-started";
}

export const FleetManagerOnboardingDesktop = forwardRef<HTMLDivElement, FleetManagerOnboardingDesktopProps>(function FleetManagerOnboardingDesktop({
  label = "Fleet manager onboarding",
  description,
  density,
  state,
  disabled = false,
  inProgress = false,
  blocked = false,
  validating = false,
  complete = false,
  empty = false,
  permissionBlocked = false,
  steps = [],
  currentStep = 0,
  metrics = [],
  tasks = [],
  fields = [],
  selects = [],
  reviewColumns,
  reviewRows = [],
  settings,
  validation,
  primaryAction,
  secondaryAction,
  emptyState,
  feedback,
  className = "",
  onTaskChange,
  onAction,
  ...rest
}, ref) {
  const normalizedTasks = normalizeItems(tasks);
  const normalizedRows = normalizeItems(reviewRows);
  const resolvedState = resolveState({
    disabled,
    permissionBlocked,
    blocked,
    validating,
    complete,
    empty,
    inProgress,
    state,
    tasks: normalizedTasks,
    reviewRows: normalizedRows,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
  const isBusy = resolvedState === "validating";
  const normalizedSteps = Array.isArray(steps) && steps.length ? steps : [
    { id: "setup", label: "Setup" },
    { id: "review", label: "Review" },
    { id: "complete", label: "Complete" },
  ];
  const kpis = Array.isArray(metrics) && metrics.length ? metrics : [
    { key: "progress", label: "Progress", value: `${normalizedTasks.filter((task) => task.checked).length}/${Math.max(normalizedTasks.length, 1)}`, tone: complete ? "success" : "info" },
  ] satisfies FleetManagerOnboardingDesktopMetric[];
  const tableColumns = Array.isArray(reviewColumns) && reviewColumns.length
    ? reviewColumns
    : [{ key: "name", label: "Name" }, { key: "status", label: "Status" }];

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": isBusy ? "true" : undefined,
      "aria-disabled": isDisabled ? "true" : undefined,
      "data-flow-pattern": "fleet-manager-onboarding-desktop",
      "data-state": resolvedState,
      "data-density": density,
      "data-task-count": String(normalizedTasks.length),
      "data-review-count": String(normalizedRows.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Surface, {
      surfaceRole: "section",
      state: (isDisabled ? "disabled" : isBusy ? "raised" : complete ? "selected" : "default") as NonNullable<SurfaceProps["state"]>,
      ...(density ? { density: density as NonNullable<SurfaceProps["density"]> } : {}),
      "data-fleet-manager-onboarding-surface": "true",
    },
      React.createElement(Stepper, {
        label: `${label} progress`,
        steps: normalizedSteps,
        current: currentStep,
        density,
      } as StepperProps),
      kpis.map((metric) => React.createElement(KpiTile, {
        ...metric,
        key: metric.key ?? metric.label,
        label: metric.label,
        value: metric.value,
        tone: metric.tone ?? "info",
        variant: metric.variant ?? "standard",
        state: metric.state ?? (isDisabled ? "disabled" : isBusy ? "loading" : "default"),
        density: metric.density ?? density,
      } as KpiTileProps)),
      React.createElement(Badge, {
        label: complete ? "Complete" : blocked || permissionBlocked ? "Blocked" : "In progress",
        tone: complete ? "success" : blocked || permissionBlocked ? "warning" : "info",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        live: true,
      } as BadgeProps),
      normalizedTasks.map((task) => React.createElement(Checkbox, {
        ...task,
        key: task.key ?? task.id ?? task.label,
        label: task.label,
        description: task.description,
        checked: task.checked,
        indeterminate: task.indeterminate,
        density: task.density ?? density,
        disabled: isDisabled || task.disabled,
        error: task.error,
        onCheckedChange: (checked, meta, event) => {
          task.onCheckedChange?.(checked, meta, event);
          if (event.defaultPrevented) return;
          onTaskChange?.(task.key ?? task.id ?? task.label, checked, meta, event);
        },
      } as CheckboxProps)),
      fields.filter((field) => field?.label).map((field) => React.createElement(Input, {
        ...field,
        key: field.key ?? field.name ?? field.label,
        label: field.label,
        density: field.density ?? density,
        disabled: isDisabled || field.disabled,
      } as InputProps)),
      selects.filter((select) => select?.label).map((select) => React.createElement(Select, {
        ...select,
        key: select.key ?? select.name ?? select.label,
        label: select.label,
        options: select.options ?? [{ label: "Default", value: "default" }],
        density: select.density ?? density,
        disabled: isDisabled || select.disabled,
      } as SelectProps)),
      validation?.message
        ? React.createElement(InlineValidation, {
          ...validation,
          label: validation.label ?? label,
          state: validation.state ?? (blocked || permissionBlocked ? "error" : isBusy ? "warning" : complete ? "success" : "default"),
          density: validation.density ?? density,
          fullWidth: true,
        } as InlineValidationProps)
        : null,
      settings
        ? React.createElement(Settings, {
          ...settings,
          label: settings.label ?? "Onboarding settings",
          density: settings.density ?? density,
          disabled: isDisabled || settings.disabled,
          "data-settings-boundary": "true",
        } as SettingsProps)
        : null,
      resolvedState === "empty" || resolvedState === "permission-blocked"
        ? React.createElement(EmptyState, {
          title: emptyState?.title ?? (permissionBlocked ? "Permission required" : "No setup tasks"),
          description: emptyState?.description ?? description,
          icon: emptyState?.icon ?? (permissionBlocked ? "lock" : "inventory_2"),
          action: emptyState?.action,
          variant: emptyState?.variant ?? (permissionBlocked ? "permission" : "search-empty"),
          state: emptyState?.state ?? (permissionBlocked ? "permission" : "search-empty"),
          density,
          fullWidth: true,
          onAction: emptyState?.onAction,
        } as EmptyStateProps)
        : normalizedRows.length
          ? React.createElement(Table, {
            label: `${label} review`,
            columns: tableColumns,
            rows: normalizedRows.map((row) => ({ ...row, id: row.id ?? row.key ?? row.label })),
            rowKey: "id",
            density,
            state: complete ? "selected" : "default",
          } as TableProps)
          : null,
      primaryAction?.label
        ? React.createElement(Button, {
          ...primaryAction,
          label: primaryAction.label,
          variant: primaryAction.variant ?? "primary",
          density: primaryAction.density ?? density,
          loading: primaryAction.loading ?? isBusy,
          disabled: isDisabled || primaryAction.disabled,
          onClick: (event) => {
            primaryAction.onClick?.(event);
            if (event.defaultPrevented) return;
            onAction?.(primaryAction.key ?? primaryAction.label ?? label, event);
          },
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
      feedback
        ? React.createElement(Toast, {
          ...feedback,
          label: feedback.label,
          tone: feedback.tone ?? (complete ? "success" : blocked || permissionBlocked ? "warning" : "info"),
          variant: feedback.variant ?? "status",
          state: feedback.state ?? "visible",
          density: feedback.density ?? density,
        } as ToastProps)
        : null,
    ),
  );
}) as FleetManagerOnboardingDesktopComponent;

FleetManagerOnboardingDesktop.displayName = "FleetManagerOnboardingDesktop";
