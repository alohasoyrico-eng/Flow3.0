import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { Surface } from "../Surface.js";
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
        const sharedProps = {
          key: field.key ?? field.name ?? field.label,
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
          "data-field-key": field.key ?? field.name,
        };
        if (field.kind === "text-area") {
          return React.createElement(TextArea, {
            ...sharedProps,
            rows: field.rows,
            maxLength: field.maxLength,
            onValueChange: (value, meta, event) => {
              field.onValueChange?.(value, meta, event);
              onFieldValueChange?.(field.key ?? field.name ?? field.label, value, meta, event);
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
            onFieldValueChange?.(field.key ?? field.name ?? field.label, value, meta, event);
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
