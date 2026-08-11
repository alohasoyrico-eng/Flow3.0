import React, { forwardRef, useId, useState } from "react";
import { Button } from "../Button.js";
import { InlineValidation } from "../InlineValidation.js";
import { RadioButton } from "../RadioButton.js";
import { Surface } from "../Surface.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeOptions(options) {
  return (Array.isArray(options) ? options : []).filter((option) => option?.label);
}

function optionValue(option) {
  return String(option.value ?? option.key ?? option.label);
}

function resolveState({ disabled, loading, invalid, selected, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (invalid || state === "invalid") return "invalid";
  if (state === "permission-blocked") return "permission-blocked";
  if (selected) return state ?? "selected";
  return state ?? "unselected";
}

export const RadioGroup = forwardRef(function RadioGroup({
  label,
  helper,
  density,
  state,
  disabled = false,
  loading = false,
  required = false,
  name,
  options = [],
  value,
  defaultValue = "",
  clearLabel,
  applyAction,
  validation,
  className = "",
  onValueChange,
  onApply,
  onClear,
  ...rest
}, ref) {
  const reactId = useId();
  const groupName = name || `radio-group-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlled ? value : internalValue;
  const normalizedOptions = normalizeOptions(options);
  const invalid = Boolean(validation?.message) || (required && !currentValue);
  const resolvedState = resolveState({ disabled, loading, invalid, selected: Boolean(currentValue), state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";

  if (!label) return null;

  const commitValue = (nextValue, meta, event) => {
    if (!controlled) setInternalValue(nextValue);
    onValueChange?.(nextValue, meta, event);
  };

  const clear = (event) => {
    onClear?.(event);
    if (event.defaultPrevented) return;
    commitValue("", { value: "", cleared: true }, event);
  };

  return React.createElement(
    Surface,
    {
      ref,
      surfaceRole: "section",
      state: isDisabled ? "disabled" : invalid ? "selected" : "default",
      density,
      className,
      role: "radiogroup",
      "aria-label": label,
      "aria-required": required ? "true" : undefined,
      "aria-busy": loading ? "true" : undefined,
      "data-flow-pattern": "radio-group",
      "data-flow-slot": "groupSurface",
      "data-state": resolvedState,
      "data-selected-value": currentValue ? String(currentValue) : "",
      ...sanitizeRestProps(rest),
    },
    React.createElement("div", { "data-flow-slot": "question" }, React.createElement("h3", null, label), helper ? React.createElement("p", null, helper) : null),
    normalizedOptions.map((option) => {
      const nextValue = optionValue(option);
      const checked = String(currentValue ?? "") === nextValue;
      return React.createElement(RadioButton, {
        key: nextValue,
        label: option.label,
        description: option.description ?? option.meta,
        value: nextValue,
        name: groupName,
        checked,
        disabled: isDisabled || option.disabled,
        density,
        required,
        variant: option.variant ?? "default",
        state: checked ? "selected" : "unselected",
        onCheckedChange: (nextChecked, meta, event) => {
          if (!nextChecked) return;
          commitValue(nextValue, { value: nextValue, option }, event);
        },
      });
    }),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? "error",
        density,
        live: validation.live,
      })
      : null,
    clearLabel || applyAction?.label
      ? React.createElement(
        "div",
        { "data-flow-slot": "actions" },
        clearLabel ? React.createElement(Button, { label: clearLabel, variant: "ghost", density, disabled: isDisabled || !currentValue, onClick: clear }) : null,
        applyAction?.label
          ? React.createElement(Button, {
            ...applyAction,
            label: applyAction.label,
            density: applyAction.density ?? density,
            disabled: isDisabled || applyAction.disabled,
            onClick: (event) => {
              applyAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onApply?.(currentValue, event);
            },
          })
          : null,
      )
      : null,
  );
});

RadioGroup.displayName = "RadioGroup";
