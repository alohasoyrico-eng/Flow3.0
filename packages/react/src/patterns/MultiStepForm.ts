import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Card } from "../Card.js";
import type { CardProps } from "../Card.js";
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
import { FormSection } from "./FormSection.js";
import type { FormSectionProps } from "./FormSection.js";

export type MultiStepFormState = "not-started" | "active" | "dirty" | "validating" | "invalid" | "saving" | "complete" | "disabled";
export type MultiStepFormDensity = "sm" | "md" | "lg";

export interface MultiStepFormInputField extends Partial<InputProps> {
  kind?: "input";
  key?: string;
  label: string;
}

export interface MultiStepFormSelectField extends Partial<SelectProps> {
  kind: "select";
  key?: string;
  label: string;
}

export type MultiStepFormField = MultiStepFormInputField | MultiStepFormSelectField;

export interface MultiStepFormProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: MultiStepFormDensity;
  state?: MultiStepFormState;
  started?: boolean;
  dirty?: boolean;
  validating?: boolean;
  invalid?: boolean;
  saving?: boolean;
  complete?: boolean;
  disabled?: boolean;
  steps?: StepperStep[];
  currentStep?: number;
  summary?: Partial<CardProps>;
  fields?: MultiStepFormField[];
  formSection?: Partial<FormSectionProps>;
  validation?: Partial<InlineValidationProps>;
  primaryAction?: ButtonProps;
  secondaryAction?: ButtonProps;
  backAction?: ButtonProps;
  saveAction?: ButtonProps;
  feedback?: ToastProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface MultiStepFormComponent extends ForwardRefExoticComponent<MultiStepFormProps & RefAttributes<HTMLDivElement>> {
  displayName: "MultiStepForm";
}

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  started,
  dirty,
  validating,
  invalid,
  saving,
  complete,
  disabled,
  state,
}: {
  started: boolean;
  dirty: boolean;
  validating: boolean;
  invalid: boolean;
  saving: boolean;
  complete: boolean;
  disabled: boolean;
  state?: MultiStepFormState | undefined;
}): MultiStepFormState {
  if (disabled || state === "disabled") return "disabled";
  if (complete || state === "complete") return "complete";
  if (saving || state === "saving") return "saving";
  if (invalid || state === "invalid") return "invalid";
  if (validating || state === "validating") return "validating";
  if (dirty || state === "dirty") return "dirty";
  if (started || state === "active") return "active";
  return state ?? "not-started";
}

function fieldKey(field: MultiStepFormField, index: number): string {
  return field.key ?? field.name ?? `${field.kind ?? "input"}-${index}`;
}

function renderField(
  field: MultiStepFormField,
  index: number,
  density: MultiStepFormDensity | undefined,
  isDisabled: boolean,
  validating: boolean,
): React.ReactElement {
  const common = {
    key: fieldKey(field, index),
    label: field.label,
    helper: field.helper,
    name: field.name,
    density: field.density ?? density,
    disabled: isDisabled || field.disabled,
  };

  if (field.kind === "select") {
    const hasError = "error" in field && Boolean((field as { error?: unknown }).error);
    return React.createElement(Select, {
      ...common,
      options: field.options ?? [],
      value: field.value,
      open: field.open,
      state: field.state ?? (hasError ? "error" : field.value ? "filled" : "default"),
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

export const MultiStepForm = forwardRef<HTMLDivElement, MultiStepFormProps>(function MultiStepForm({
  label = "Multi step form",
  description,
  density,
  state,
  started = false,
  dirty = false,
  validating = false,
  invalid = false,
  saving = false,
  complete = false,
  disabled = false,
  steps = [],
  currentStep = 0,
  summary,
  fields = [],
  formSection,
  validation,
  primaryAction,
  secondaryAction,
  backAction,
  saveAction,
  feedback,
  className = "",
  ...rest
}, ref) {
  const normalizedFields = (Array.isArray(fields) ? fields : []).filter((field) => field?.label);
  const resolvedState = resolveState({
    started: started || steps.length > 0,
    dirty,
    validating,
    invalid: invalid || Boolean(validation?.message && validation?.state === "error"),
    saving,
    complete,
    disabled,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "saving";
  const isBusy = resolvedState === "validating" || resolvedState === "saving";
  const progressValue = steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-pattern": "multi-step-form",
      "data-state": resolvedState,
      "data-density": density,
      "data-step-count": String(steps.length),
      "data-current-step": String(currentStep),
      "data-field-count": String(normalizedFields.length),
      "data-form-section-boundary": formSection ? "true" : "false",
      ...sanitizeRestProps(rest),
    },
    steps.length
      ? React.createElement(Stepper, {
        label: `${label} progress`,
        steps,
        current: currentStep,
        orientation: "horizontal",
        density,
      } as StepperProps)
      : null,
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : resolvedState === "complete" ? "selected" : "default",
        density,
        "data-flow-slot": "content",
      } as SurfaceProps,
      summary
        ? React.createElement(Card, {
          ...summary,
          title: summary.title ?? label,
          value: summary.value ?? (steps.length ? `Step ${currentStep + 1} of ${steps.length}` : undefined),
          detail: summary.detail ?? description,
          status: summary.status ?? resolvedState,
          density: summary.density ?? density,
          state: isDisabled ? "disabled" : summary.state ?? (resolvedState === "invalid" ? "error" : "default"),
          fullWidth: summary.fullWidth ?? true,
        } as CardProps)
        : null,
      description ? React.createElement("p", null, description) : null,
      normalizedFields.map((field, index) => renderField(field, index, density, isDisabled, resolvedState === "validating")),
      formSection
        ? React.createElement(FormSection, {
          ...formSection,
          density: formSection.density ?? density,
          disabled: isDisabled || formSection.disabled,
        } as FormSectionProps)
        : null,
      validation
        ? React.createElement(InlineValidation, {
          label: validation.label ?? label,
          value: validation.value,
          message: validation.message,
          state: validation.state ?? (resolvedState === "invalid" ? "error" : "info"),
          density,
          fullWidth: true,
          field: validation.field ?? true,
          live: validation.live ?? true,
        } as InlineValidationProps)
        : null,
      backAction
        ? React.createElement(Button, {
          ...backAction,
          label: backAction.label ?? "Back",
          variant: backAction.variant ?? "secondary",
          density: backAction.density ?? density,
          disabled: isDisabled || backAction.disabled,
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
      saveAction
        ? React.createElement(Button, {
          ...saveAction,
          label: saveAction.label ?? "Save progress",
          variant: saveAction.variant ?? "ghost",
          density: saveAction.density ?? density,
          disabled: isDisabled || saveAction.disabled,
          loading: resolvedState === "saving" || saveAction.loading,
        } as ButtonProps)
        : null,
      primaryAction
        ? React.createElement(Button, {
          ...primaryAction,
          label: primaryAction.label ?? (currentStep + 1 >= steps.length ? "Submit" : "Next"),
          variant: primaryAction.variant ?? "primary",
          density: primaryAction.density ?? density,
          disabled: isDisabled || primaryAction.disabled,
          loading: resolvedState === "saving" || primaryAction.loading,
          "aria-label": `${primaryAction.label ?? "Next"}; ${progressValue}% complete`,
        } as ButtonProps)
        : null,
    ),
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ToastProps)
      : null,
  );
}) as MultiStepFormComponent;

MultiStepForm.displayName = "MultiStepForm";
