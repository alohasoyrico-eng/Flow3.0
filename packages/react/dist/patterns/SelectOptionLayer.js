import React, { forwardRef, useMemo } from "react";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { Select } from "../Select.js";

function normalizeOption(option) {
  if (!option?.label || option.value === undefined || option.value === null || option.value === "") return null;
  return {
    label: option.label,
    value: String(option.value),
    meta: option.reason || option.group || option.meta || "",
    disabled: Boolean(option.disabled || option.unavailable),
  };
}

function normalizeOptions(groups, options) {
  const groupedOptions = Array.isArray(groups)
    ? groups.flatMap((group) => (group?.options ?? []).map((option) => ({
      ...option,
      group: option.group || group.label,
    })))
    : [];
  return (groupedOptions.length ? groupedOptions : Array.isArray(options) ? options : [])
    .map(normalizeOption)
    .filter(Boolean);
}

export const SelectOptionLayer = forwardRef(function SelectOptionLayer({
  label,
  helper = "",
  options,
  groups,
  value,
  name = "",
  density,
  state = "closed",
  disabled = false,
  empty,
  validation,
  action,
  onValueChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const normalizedOptions = useMemo(() => normalizeOptions(groups, options), [groups, options]);
  const resolvedState = disabled ? "disabled" : state;
  const hasOptions = normalizedOptions.length > 0;
  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      "data-flow-pattern": "select-option-layer",
      "data-state": resolvedState,
      "data-density": density,
      "data-has-options": String(hasOptions),
      ...Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))),
    },
    hasOptions
      ? React.createElement(Select, {
        label,
        helper,
        options: normalizedOptions,
        value,
        name,
        density,
        state: resolvedState === "open" ? "open" : resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
        disabled: disabled || resolvedState === "disabled",
        onValueChange,
      })
      : React.createElement(EmptyState, {
        title: empty?.title ?? "No options available",
        description: empty?.description ?? helper,
        icon: empty?.icon,
        density,
        state: "search-empty",
        variant: "search-empty",
        action: empty?.action,
        onAction,
      }),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "error" ? "error" : "default"),
        density,
        live: validation.live,
      })
      : null,
    action?.label
      ? React.createElement(Button, {
        ...action,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "secondary",
        onClick: (event) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(action.key ?? action.label, event);
        },
      })
      : null,
  );
});

SelectOptionLayer.displayName = "SelectOptionLayer";
