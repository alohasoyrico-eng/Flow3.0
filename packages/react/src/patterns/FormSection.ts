import React, { forwardRef } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import type { CardDensity } from "../Card.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxProps, CheckboxValueMeta } from "../Checkbox.js";
import { IconButton } from "../IconButton.js";
import type { IconButtonProps } from "../IconButton.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Input } from "../Input.js";
import type { InputAlign, InputProps, InputValueMeta, InputVariant } from "../Input.js";
import { RadioButton } from "../RadioButton.js";
import type { RadioButtonProps, RadioButtonValueMeta } from "../RadioButton.js";
import { Select } from "../Select.js";
import type { SelectOpenChangeEvent, SelectOption, SelectProps, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Switch } from "../Switch.js";
import type { SwitchProps, SwitchValueMeta } from "../Switch.js";
import { TextArea } from "../TextArea.js";
import type { TextAreaChangeMeta, TextAreaProps } from "../TextArea.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";

export type FormSectionState = "idle" | "dirty" | "validating" | "invalid" | "saving" | "saved" | "disabled";
export type FormSectionDensity = CardDensity;

export interface FormSectionField {
  key?: string;
  kind?: "input" | "select" | "checkbox" | "switch" | "radio-button" | "text-area" | "icon-button";
  label: string;
  description?: string;
  helper?: string;
  helperText?: string;
  error?: string;
  value?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  state?: InputProps["state"];
  variant?: InputVariant;
  icon?: string;
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  align?: InputAlign;
  revealable?: boolean;
  revealLabel?: string;
  hideLabel?: string;
  autocomplete?: string;
  options?: SelectOption[];
  open?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  selectedValue?: string;
  selected?: boolean;
  badge?: boolean;
  ariaLabel?: string;
  rows?: number;
  maxLength?: number;
  onClick?: IconButtonProps["onClick"];
  onOpenChange?: (open: boolean, event?: SelectOpenChangeEvent) => void;
  onCheckedChange?: (
    checked: boolean,
    meta: CheckboxValueMeta | SwitchValueMeta | RadioButtonValueMeta,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onValueChange?: (
    value: string,
    meta: InputValueMeta | TextAreaChangeMeta | SelectValueMeta,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | SelectValueChangeEvent
  ) => void;
  checkboxProps?: Partial<CheckboxProps>;
  switchProps?: Partial<SwitchProps>;
  radioButtonProps?: Partial<RadioButtonProps>;
}

export interface FormSectionAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface FormSectionValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {
  summary?: string;
}

export interface FormSectionFeedback extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "density" | "actionLabel" | "dismissible" | "dismissLabel" | "onAction" | "onDismiss"> {}

export interface FormSectionProps {
  title: string;
  description?: string;
  density?: FormSectionDensity;
  state?: FormSectionState;
  disabled?: boolean;
  loading?: boolean;
  fields?: FormSectionField[];
  primaryAction?: FormSectionAction;
  secondaryAction?: FormSectionAction;
  validation?: FormSectionValidation;
  feedback?: FormSectionFeedback;
  className?: string;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onFieldValueChange?: (
    key: string,
    value: string,
    meta: InputValueMeta | TextAreaChangeMeta | SelectValueMeta | CheckboxValueMeta | SwitchValueMeta | RadioButtonValueMeta,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | SelectValueChangeEvent
  ) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface FormSectionComponent extends ForwardRefExoticComponent<FormSectionProps & RefAttributes<HTMLDivElement>> {
  displayName: "FormSection";
}

type SafeRootProps = Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeFields(fields: FormSectionField[] | undefined): FormSectionField[] {
  return (Array.isArray(fields) ? fields : []).filter((field) => field?.label);
}

function resolveState({ disabled, loading, state }: { disabled: boolean; loading: boolean; state?: FormSectionState | undefined }): FormSectionState {
  if (disabled) return "disabled";
  if (loading || state === "saving") return "saving";
  return state ?? "idle";
}

function fieldState(sectionState: FormSectionState, field: FormSectionField): InputProps["state"] {
  if (field.disabled) return "disabled";
  if (field.loading || sectionState === "validating" || sectionState === "saving") return "loading";
  if (field.error || sectionState === "invalid") return "error";
  return field.state;
}

function selectionState(sectionState: FormSectionState, field: FormSectionField, selected: boolean): RadioButtonProps["state"] {
  if (field.disabled || sectionState === "disabled") return "disabled";
  if (field.error || sectionState === "invalid") return "error";
  return selected ? "selected" : "unselected";
}

function checkedState(sectionState: FormSectionState, field: FormSectionField, checked: boolean): CheckboxProps["state"] {
  if (field.disabled || sectionState === "disabled") return "disabled";
  if (field.error || sectionState === "invalid") return "error";
  return checked ? "checked" : "unchecked";
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(function FormSection({
  title,
  description,
  density,
  state,
  disabled = false,
  loading = false,
  fields = [],
  primaryAction,
  secondaryAction,
  validation,
  feedback,
  onAction,
  onFieldValueChange,
  className = "",
  ...rest
}, ref) {
  const normalizedFields = normalizeFields(fields);
  const resolvedState = resolveState({ disabled, loading, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "saving" || resolvedState === "validating";

  if (!title) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": title,
      "aria-busy": isLoading ? "true" : undefined,
      "data-flow-pattern": "form-section",
      "data-state": resolvedState,
      "data-density": density,
      "data-field-count": String(normalizedFields.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: (resolvedState === "invalid" ? "selected" : isDisabled ? "disabled" : isLoading ? "raised" : "default") as NonNullable<SurfaceProps["state"]>,
        ...(density ? { density: density as NonNullable<SurfaceProps["density"]> } : {}),
        "data-flow-slot": "container",
      },
      React.createElement("h3", null, title),
      description ? React.createElement("p", null, description) : null,
      validation?.summary ? React.createElement("p", null, validation.summary) : null,
      normalizedFields.map((field) => {
        const fieldKey = field.key ?? field.name ?? field.label;
        const sharedProps = {
          key: fieldKey,
          label: field.label,
          helper: field.helper,
          helperText: field.helperText,
          error: field.error,
          value: field.value,
          name: field.name,
          placeholder: field.placeholder,
          disabled: isDisabled || field.disabled,
          loading: isLoading || field.loading,
          required: field.required,
          density,
          state: fieldState(resolvedState, field),
          "data-field-key": fieldKey,
        };
        if (field.kind === "select") {
          const { helperText, ...selectSharedProps } = sharedProps;
          return React.createElement(Select, {
            ...selectSharedProps,
            helper: field.helper ?? helperText,
            options: field.options ?? [],
            value: field.value,
            open: field.open,
            density,
            state: fieldState(resolvedState, field),
            onOpenChange: field.onOpenChange,
            onValueChange: (value, meta, event) => {
              field.onValueChange?.(value, meta, event);
              onFieldValueChange?.(fieldKey, value, meta, event);
            },
          } as SelectProps);
        }
        if (field.kind === "checkbox") {
          const { helperText, ...checkboxSharedProps } = sharedProps;
          return React.createElement(Checkbox, {
            ...checkboxSharedProps,
            description: field.description ?? field.helper ?? helperText,
            checked: Boolean(field.checked),
            indeterminate: field.indeterminate,
            value: field.value,
            density,
            state: checkedState(resolvedState, field, Boolean(field.checked)),
            onCheckedChange: (checked, meta, event) => {
              field.onCheckedChange?.(checked, meta, event);
              onFieldValueChange?.(fieldKey, checked ? meta.value : "", meta, event);
            },
          } as CheckboxProps);
        }
        if (field.kind === "switch") {
          const { helperText, ...switchSharedProps } = sharedProps;
          return React.createElement(Switch, {
            ...switchSharedProps,
            description: field.description ?? field.helper ?? helperText,
            checked: Boolean(field.checked),
            density,
            state: field.disabled || isDisabled ? "disabled" : field.error || resolvedState === "invalid" ? "error" : field.checked ? "on" : "off",
            onCheckedChange: (checked, meta, event) => {
              field.onCheckedChange?.(checked, meta, event);
              onFieldValueChange?.(fieldKey, checked ? "true" : "false", meta, event);
            },
          } as SwitchProps);
        }
        if (field.kind === "radio-button") {
          const { helperText, ...radioSharedProps } = sharedProps;
          const checked = field.checked ?? (field.value !== undefined && field.value === field.selectedValue);
          return React.createElement(RadioButton, {
            ...radioSharedProps,
            description: field.description ?? field.helper ?? helperText,
            name: field.name ?? `${fieldKey}-group`,
            value: field.value,
            checked: Boolean(checked),
            density,
            state: selectionState(resolvedState, field, Boolean(checked)),
            onCheckedChange: (checkedValue, meta, event) => {
              field.onCheckedChange?.(checkedValue, meta, event);
              if (checkedValue) onFieldValueChange?.(fieldKey, meta.value, meta, event);
            },
          } as RadioButtonProps);
        }
        if (field.kind === "icon-button") {
          return React.createElement(IconButton, {
            key: fieldKey,
            icon: field.icon ?? "more_horiz",
            label: field.label,
            ariaLabel: field.ariaLabel ?? field.label,
            variant: field.variant ?? "ghost",
            density,
            selected: field.selected,
            badge: field.badge,
            disabled: isDisabled || field.disabled,
            "data-field-key": fieldKey,
            onClick: (event) => {
              field.onClick?.(event);
              if (event.defaultPrevented) return;
              onAction?.(fieldKey, event);
            },
          } as IconButtonProps);
        }
        if (field.kind === "text-area") {
          return React.createElement(TextArea, {
            ...sharedProps,
            rows: field.rows,
            maxLength: field.maxLength,
            onValueChange: (value, meta, event) => {
              field.onValueChange?.(value, meta, event);
              onFieldValueChange?.(fieldKey, value, meta, event);
            },
          } as TextAreaProps);
        }
        return React.createElement(Input, {
          ...sharedProps,
          variant: field.variant,
          icon: field.icon,
          prefix: field.prefix,
          suffix: field.suffix,
          mono: field.mono,
          align: field.align,
          revealable: field.revealable,
          revealLabel: field.revealLabel,
          hideLabel: field.hideLabel,
          autocomplete: field.autocomplete,
          onValueChange: (value, meta, event) => {
            field.onValueChange?.(value, meta, event);
            onFieldValueChange?.(fieldKey, value, meta, event);
          },
        } as InputProps);
      }),
    ),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? title,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "warning"),
        density,
        live: validation.live,
      } as InlineValidationProps)
      : null,
    secondaryAction?.label
      ? React.createElement(Button, {
        ...secondaryAction,
        label: secondaryAction.label,
        variant: secondaryAction.variant ?? "ghost",
        density: secondaryAction.density ?? density,
        disabled: isDisabled || secondaryAction.disabled,
        loading: secondaryAction.loading,
        onClick: (event) => {
          secondaryAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(secondaryAction.key ?? secondaryAction.label ?? title, event);
        },
      } as ButtonProps)
      : null,
    primaryAction?.label
      ? React.createElement(Button, {
        ...primaryAction,
        label: primaryAction.label,
        variant: primaryAction.variant ?? "primary",
        density: primaryAction.density ?? density,
        disabled: isDisabled || primaryAction.disabled,
        loading: isLoading || primaryAction.loading,
        onClick: (event) => {
          primaryAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(primaryAction.key ?? primaryAction.label ?? title, event);
        },
      } as ButtonProps)
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? (resolvedState === "saved" ? "success" : resolvedState === "invalid" ? "warning" : "info"),
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
        actionLabel: feedback.actionLabel,
        dismissible: feedback.dismissible,
        dismissLabel: feedback.dismissLabel,
        onAction: feedback.onAction,
        onDismiss: feedback.onDismiss,
      } as ToastProps)
      : null,
  );
}) as FormSectionComponent;

FormSection.displayName = "FormSection";
