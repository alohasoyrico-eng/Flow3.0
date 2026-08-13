import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { CardSummary } from "../CardSummary.js";
import type { CardSummaryProps } from "../CardSummary.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Input } from "../Input.js";
import type { InputProps } from "../Input.js";
import { Select } from "../Select.js";
import type { SelectProps } from "../Select.js";
import { Stepper } from "../Stepper.js";
import type { StepperProps, StepperStep } from "../Stepper.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { ActionSheet } from "./ActionSheet.js";
import type { ActionSheetProps } from "./ActionSheet.js";

export type FullscreenSheetState = "closed" | "open" | "dirty" | "validating" | "saving" | "error" | "dismiss-confirming" | "disabled";
export type FullscreenSheetDensity = "sm" | "md" | "lg";
export type FullscreenSheetFieldKind = "input" | "select";

export interface FullscreenSheetInputField extends Partial<InputProps> {
  kind?: "input";
  key?: string;
  label: string;
}

export interface FullscreenSheetSelectField extends Partial<SelectProps> {
  kind: "select";
  key?: string;
  label: string;
}

export type FullscreenSheetField = FullscreenSheetInputField | FullscreenSheetSelectField;

export interface FullscreenSheetProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FullscreenSheetDensity;
  state?: FullscreenSheetState;
  open?: boolean;
  dirty?: boolean;
  validating?: boolean;
  saving?: boolean;
  disabled?: boolean;
  dismissConfirming?: boolean;
  summary?: Partial<CardSummaryProps>;
  steps?: StepperStep[];
  currentStep?: number;
  fields?: FullscreenSheetField[];
  validation?: Partial<InlineValidationProps>;
  primaryAction?: ButtonProps;
  secondaryAction?: ButtonProps;
  closeAction?: ButtonProps;
  actionSheet?: Partial<ActionSheetProps>;
  feedback?: ToastProps;
  error?: Partial<ToastProps>;
  className?: string;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FullscreenSheetComponent extends ForwardRefExoticComponent<FullscreenSheetProps & RefAttributes<HTMLDivElement>> {
  displayName: "FullscreenSheet";
}

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  open,
  dirty,
  validating,
  saving,
  error,
  dismissConfirming,
  disabled,
  state,
}: {
  open: boolean;
  dirty: boolean;
  validating: boolean;
  saving: boolean;
  error: boolean;
  dismissConfirming: boolean;
  disabled: boolean;
  state?: FullscreenSheetState | undefined;
}): FullscreenSheetState {
  if (disabled || state === "disabled") return "disabled";
  if (dismissConfirming || state === "dismiss-confirming") return "dismiss-confirming";
  if (error || state === "error") return "error";
  if (saving || state === "saving") return "saving";
  if (validating || state === "validating") return "validating";
  if (dirty || state === "dirty") return "dirty";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

function fieldKey(field: FullscreenSheetField, index: number): string {
  return field.key ?? field.name ?? `${field.kind ?? "input"}-${index}`;
}

function renderField(field: FullscreenSheetField, index: number, density: FullscreenSheetDensity | undefined, isDisabled: boolean, validating: boolean) {
  const common = {
    key: fieldKey(field, index),
    label: field.label,
    helper: field.helper,
    name: field.name,
    density: field.density ?? density,
    disabled: isDisabled || field.disabled,
  };

  if (field.kind === "select") {
    const selectField = field as FullscreenSheetSelectField & { error?: string };
    return React.createElement(Select, {
      ...common,
      options: field.options ?? [],
      value: field.value,
      open: field.open,
      state: field.state ?? (selectField.error ? "error" : field.value ? "filled" : "default"),
      onValueChange: field.onValueChange,
      onOpenChange: field.onOpenChange,
    } as SelectProps);
  }

  return React.createElement(Input, {
    ...common,
    value: field.value,
    placeholder: field.placeholder,
    error: field.error,
    readOnly: field.readOnly,
    variant: field.variant ?? "default",
    state: field.state ?? (validating ? "loading" : field.error ? "error" : field.value ? "filled" : "default"),
    onValueChange: field.onValueChange,
  } as InputProps);
}

export const FullscreenSheet = forwardRef<HTMLDivElement, FullscreenSheetProps>(function FullscreenSheet({
  label = "Fullscreen sheet",
  description,
  density,
  state,
  open = false,
  dirty = false,
  validating = false,
  saving = false,
  disabled = false,
  dismissConfirming = false,
  summary,
  steps = [],
  currentStep = 0,
  fields = [],
  validation,
  primaryAction,
  secondaryAction,
  closeAction,
  actionSheet,
  feedback,
  error,
  className = "",
  onClose,
  ...rest
}, ref) {
  const normalizedFields = (Array.isArray(fields) ? fields : []).filter((field) => field?.label);
  const resolvedState = resolveState({
    open,
    dirty,
    validating,
    saving,
    error: Boolean(error || validation?.state === "error" || feedback?.tone === "danger"),
    dismissConfirming,
    disabled,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "saving";
  const isBusy = resolvedState === "validating" || resolvedState === "saving";

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-pattern": "fullscreen-sheet",
      "data-state": resolvedState,
      "data-density": density,
      "data-field-count": String(normalizedFields.length),
      "data-action-sheet-boundary": actionSheet ? "true" : "false",
      ...sanitizeRestProps(rest),
    },
    React.createElement(
      Surface,
      {
        surfaceRole: "overlay",
        state: (open ? "overlay" : isDisabled ? "disabled" : "default") as NonNullable<SurfaceProps["state"]>,
        ...(density ? { density: density as NonNullable<SurfaceProps["density"]> } : {}),
        "data-sheet-open": open ? "true" : "false",
      },
      summary
        ? React.createElement(CardSummary, {
          ...summary,
          label: summary.label ?? label,
          density: summary.density ?? density,
          state: summary.state ?? (isDisabled ? "disabled" : resolvedState === "error" ? "warning" : "default"),
          fullWidth: summary.fullWidth ?? true,
        } as CardSummaryProps)
        : null,
      steps.length
        ? React.createElement(Stepper, {
          label: `${label} progress`,
          steps,
          current: currentStep,
          orientation: "horizontal",
          density,
        } as StepperProps)
        : null,
      description ? React.createElement("p", null, description) : null,
      normalizedFields.map((field, index) => renderField(field, index, density, isDisabled, resolvedState === "validating")),
      validation
        ? React.createElement(InlineValidation, {
          label: validation.label ?? label,
          value: validation.value,
          message: validation.message,
          state: validation.state ?? (resolvedState === "error" ? "error" : "info"),
          density,
          fullWidth: true,
          field: validation.field ?? true,
          live: validation.live ?? true,
        } as InlineValidationProps)
        : null,
      primaryAction
        ? React.createElement(Button, {
          ...primaryAction,
          label: primaryAction.label,
          variant: primaryAction.variant ?? "primary",
          density: primaryAction.density ?? density,
          disabled: isDisabled || primaryAction.disabled,
          loading: resolvedState === "saving" || primaryAction.loading,
        } as ButtonProps)
        : null,
      secondaryAction
        ? React.createElement(Button, {
          ...secondaryAction,
          label: secondaryAction.label,
          variant: secondaryAction.variant ?? "secondary",
          density: secondaryAction.density ?? density,
          disabled: isDisabled || secondaryAction.disabled,
        } as ButtonProps)
        : null,
      closeAction
        ? React.createElement(Button, {
          ...closeAction,
          label: closeAction.label ?? "Close",
          variant: closeAction.variant ?? "ghost",
          density: closeAction.density ?? density,
          disabled: closeAction.disabled,
          onClick: closeAction.onClick ?? onClose,
        } as ButtonProps)
        : null,
      actionSheet
        ? React.createElement(ActionSheet, {
          ...actionSheet,
          density: actionSheet.density ?? density,
          open: actionSheet.open ?? false,
        } as ActionSheetProps)
        : null,
      error
        ? React.createElement(Toast, {
          label: error.label ?? "Sheet error",
          description: error.description,
          tone: "danger",
          variant: "recovery",
          state: "visible",
          density,
          actionLabel: error.actionLabel,
          dismissible: error.dismissible ?? true,
          onAction: error.onAction,
          onDismiss: error.onDismiss,
        } as ToastProps)
        : null,
      feedback
        ? React.createElement(Toast, {
          ...feedback,
          density: feedback.density ?? density,
          state: feedback.state ?? "visible",
        } as ToastProps)
        : null,
    ),
  );
}) as FullscreenSheetComponent;

FullscreenSheet.displayName = "FullscreenSheet";
