import React, { forwardRef } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateAction, EmptyStateVariant } from "../EmptyState.js";
import type { InlineValidationState } from "../InlineValidation.js";
import type { InputDensity, InputValueMeta } from "../Input.js";
import type { ListItem, ListState } from "../List.js";
import type { SelectOption, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { List } from "../List.js";
import { Select } from "../Select.js";
import { flowDefinedProps } from "../internal/props.js";

export type SearchState = "idle" | "typing" | "results" | "empty" | "invalid" | "loading" | "disabled" | "selected";
export type SearchDensity = InputDensity;

export interface SearchResult extends Omit<ListItem, "key"> {
  key?: string;
  description?: ListItem["meta"];
  valueLabel?: string;
  state?: ListState;
}

export interface SearchValidation {
  label?: string;
  message: string;
  state?: InlineValidationState;
  live?: boolean;
}

export interface SearchEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  variant?: EmptyStateVariant;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface SearchAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  label: string;
}

export interface SearchProps extends FlowDataAttributes {
  label: string;
  helper?: string;
  value?: string;
  query?: string;
  placeholder?: string;
  density?: SearchDensity;
  state?: SearchState;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  scopes?: SelectOption[];
  scopeValue?: string;
  scopeLabel?: string;
  results?: SearchResult[];
  selectedKey?: string;
  resultCount?: number;
  validation?: SearchValidation;
  empty?: SearchEmptyState;
  submitAction?: SearchAction;
  clearAction?: SearchAction;
  onQueryChange?: (value: string, meta: InputValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onScopeChange?: (value: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => void;
  onResultSelect?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onSubmit?: (query: string, event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SearchComponent extends ForwardRefExoticComponent<SearchProps & RefAttributes<HTMLDivElement>> {
  displayName?: string;
}

function sanitizeRestProps(rest: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeResults(results: SearchResult[] | undefined) {
  return (Array.isArray(results) ? results : [])
    .filter((result) => result?.label)
    .map((result) => ({
      key: String(result.key ?? result.value ?? result.label),
      label: result.label,
      meta: result.meta ?? result.description,
      value: result.valueLabel ?? result.value,
      disabled: Boolean(result.disabled),
      ...flowDefinedProps({
        icon: result.icon,
        state: result.state,
      }),
    }));
}

function resolveState({
  disabled,
  loading,
  validation,
  results,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  validation?: SearchValidation;
  results: ReturnType<typeof normalizeResults>;
  state?: SearchState;
}): SearchState {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (validation?.state === "error" || state === "invalid") return "invalid";
  if (!results.length && state !== "idle" && state !== "typing") return "empty";
  if (state) return state;
  return results.length ? "results" : "idle";
}

export const Search: SearchComponent = forwardRef<HTMLDivElement, SearchProps>(function Search({
  label,
  helper = "",
  value,
  query,
  placeholder,
  density,
  state,
  disabled = false,
  loading = false,
  name = "",
  scopes = [],
  scopeValue,
  scopeLabel,
  results = [],
  selectedKey,
  resultCount,
  validation,
  empty,
  submitAction,
  clearAction,
  onQueryChange,
  onScopeChange,
  onResultSelect,
  onSubmit,
  onClear,
  className = "",
  ...rest
}, ref) {
  const normalizedResults = normalizeResults(results);
  const normalizedScopes = (Array.isArray(scopes) ? scopes : []).filter((scope) => scope?.label);
  const currentValue = query ?? value ?? "";
  const resolvedCount = resultCount ?? normalizedResults.length;
  const resolvedState = resolveState(flowDefinedProps({ disabled, loading, validation, results: normalizedResults, state }));
  const isDisabled = disabled || resolvedState === "disabled";
  const inputState = resolvedState === "invalid" ? "error" : resolvedState === "loading" ? "loading" : currentValue ? "filled" : "default";

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "search",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "search",
      "data-state": resolvedState,
      "data-density": density,
      "data-result-count": String(resolvedCount),
      "data-has-scope": String(Boolean(normalizedScopes.length)),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Input, flowDefinedProps({
      label,
      helper,
      value: currentValue,
      name,
      placeholder,
      disabled: isDisabled,
      loading,
      density,
      variant: "search",
      icon: "search",
      state: inputState,
      error: validation?.state === "error" ? validation.message : "",
      onValueChange: onQueryChange,
    })),
    normalizedScopes.length
      ? React.createElement(Select, flowDefinedProps({
        label: scopeLabel ?? `${label} scope`,
        options: normalizedScopes,
        value: scopeValue,
        disabled: isDisabled,
        density,
        variant: "inline",
        state: isDisabled ? "disabled" : scopeValue ? "filled" : "default",
        onValueChange: onScopeChange,
      }))
      : null,
    resolvedCount || currentValue
      ? React.createElement(InlineValidation, flowDefinedProps({
        label: `${label} result count`,
        message: `${resolvedCount} result${resolvedCount === 1 ? "" : "s"}`,
        state: resolvedState === "invalid" ? "error" : "info",
        density,
        live: true,
      }))
      : null,
    normalizedResults.length
      ? React.createElement(List, flowDefinedProps({
        label: `${label} results`,
        items: normalizedResults,
        variant: "action",
        state: resolvedState === "loading" ? "loading" : "default",
        density,
        selectedKey,
        interactive: Boolean(onResultSelect),
        onSelect: onResultSelect,
      }))
      : null,
    !normalizedResults.length && resolvedState === "empty"
      ? React.createElement(EmptyState, flowDefinedProps({
        title: empty?.title ?? "No results",
        description: empty?.description ?? helper,
        icon: empty?.icon,
        action: empty?.action,
        variant: empty?.variant ?? "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      }))
      : null,
    validation?.message && validation.state !== "error"
      ? React.createElement(InlineValidation, flowDefinedProps({
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? "default",
        density,
        live: validation.live,
      }))
      : null,
    submitAction?.label
      ? React.createElement(Button, flowDefinedProps({
        ...submitAction,
        label: submitAction.label,
        variant: submitAction.variant ?? "primary",
        density: submitAction.density ?? density,
        disabled: isDisabled || submitAction.disabled,
        loading: submitAction.loading,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          submitAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onSubmit?.(currentValue, event);
        },
      }))
      : null,
    clearAction?.label
      ? React.createElement(Button, flowDefinedProps({
        ...clearAction,
        label: clearAction.label,
        variant: clearAction.variant ?? "ghost",
        density: clearAction.density ?? density,
        disabled: isDisabled || !currentValue || clearAction.disabled,
        loading: clearAction.loading,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          clearAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onClear?.(event);
        },
      }))
      : null,
  );
}) as SearchComponent;

Search.displayName = "Search";
