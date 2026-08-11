import React, { forwardRef, useMemo } from "react";
import { Combobox } from "../Combobox.js";
import { EmptyState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import { Skeleton } from "../Skeleton.js";

function normalizeSuggestion(suggestion) {
  if (!suggestion?.label) return null;
  const value = suggestion.value ?? suggestion.key ?? suggestion.label;
  return {
    key: String(value),
    label: suggestion.label,
    value: String(value),
    meta: suggestion.meta ?? suggestion.description ?? "",
    disabled: Boolean(suggestion.disabled),
  };
}

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

export const Autocomplete = forwardRef(function Autocomplete({
  label,
  helper = "",
  suggestions,
  value,
  name = "",
  placeholder = "",
  density,
  state = "idle",
  disabled = false,
  loading = false,
  empty,
  validation,
  selectedKey,
  onValueChange,
  onOpenChange,
  onSuggestionSelect,
  className = "",
  ...rest
}, ref) {
  const normalizedSuggestions = useMemo(() => (Array.isArray(suggestions) ? suggestions : [])
    .map(normalizeSuggestion)
    .filter(Boolean), [suggestions]);
  const hasSuggestions = normalizedSuggestions.length > 0;
  const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : !hasSuggestions ? "empty" : state;
  const comboboxState = resolvedState === "invalid" ? "error" : resolvedState === "disabled" ? "disabled" : ["typing", "suggesting", "selected"].includes(resolvedState) ? "open" : "default";

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "data-flow-pattern": "autocomplete",
      "data-state": resolvedState,
      "data-density": density,
      "data-suggestion-count": String(normalizedSuggestions.length),
      ...sanitizeRestProps(rest),
    },
    hasSuggestions
      ? React.createElement(Combobox, {
        label,
        helper,
        options: normalizedSuggestions,
        optionsLabel: `${label} suggestions`,
        value,
        name,
        placeholder,
        disabled,
        density,
        state: comboboxState,
        open: ["typing", "suggesting", "loading", "selected"].includes(resolvedState),
        emptyText: empty?.title,
        onValueChange,
        onOpenChange,
      })
      : null,
    loading || resolvedState === "loading"
      ? React.createElement(Skeleton, {
        label: `${label} suggestions loading`,
        variant: "row",
        density,
        lines: 3,
        state: "loading",
        fullWidth: true,
      })
      : null,
    hasSuggestions && resolvedState !== "loading"
      ? React.createElement(List, {
        label: `${label} suggestion summary`,
        items: normalizedSuggestions.map((suggestion) => ({
          key: suggestion.key,
          label: suggestion.label,
          meta: suggestion.meta,
          state: suggestion.disabled ? "disabled" : selectedKey === suggestion.key ? "selected" : "default",
          disabled: suggestion.disabled || disabled,
        })),
        variant: "compact",
        density,
        interactive: Boolean(onSuggestionSelect),
        selectedKey,
        onSelect: onSuggestionSelect,
      })
      : null,
    !hasSuggestions && !loading
      ? React.createElement(EmptyState, {
        title: empty?.title ?? "No suggestions",
        description: empty?.description ?? helper,
        icon: empty?.icon,
        action: empty?.action,
        variant: "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      })
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "default"),
        density,
        live: validation.live,
      })
      : null,
  );
});

Autocomplete.displayName = "Autocomplete";
