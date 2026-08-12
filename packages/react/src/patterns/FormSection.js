import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { IconButton } from "../IconButton.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { RadioButton } from "../RadioButton.js";
import { Select } from "../Select.js";
import { Surface } from "../Surface.js";
import { Switch } from "../Switch.js";
import { TextArea } from "../TextArea.js";
import { Toast } from "../Toast.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeFields(fields) {
  return (Array.isArray(fields) ? fields : []).filter((field) => field?.label);
}

function resolveState({ disabled, loading, state }) {
  if (disabled) return "disabled";
  if (loading || state === "saving") return "saving";
  return state ?? "idle";
}

function fieldState(sectionState, field) {
  if (field.disabled) return "disabled";
  if (field.loading || sectionState === "validating" || sectionState === "saving") return "loading";
  if (field.error || sectionState === "invalid") return "error";
  return field.state;
}

function selectionState(sectionState, field, selected) {
  if (field.disabled || sectionState === "disabled") return "disabled";
  if (field.error || sectionState === "invalid") return "error";
  return selected ? "selected" : "unselected";
}

function checkedState(sectionState, field, checked) {
  if (field.disabled || sectionState === "disabled") return "disabled";
  if (field.error || sectionState === "invalid") return "error";
  return checked ? "checked" : "unchecked";
}

export const FormSection = forwardRef(function FormSection({
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
        state: resolvedState === "invalid" ? "selected" : isDisabled ? "disabled" : isLoading ? "raised" : "default",
        density,
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
          });
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
          });
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
          });
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
          });
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
          });
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
          });
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
        });
      }),
    ),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? title,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "warning"),
        density,
        live: validation.live,
      })
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
          onAction?.(secondaryAction.key ?? secondaryAction.label, event);
        },
      })
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
          onAction?.(primaryAction.key ?? primaryAction.label, event);
        },
      })
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
      })
      : null,
  );
});

FormSection.displayName = "FormSection";
