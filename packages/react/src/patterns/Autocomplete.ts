import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useMemo,
} from "react";
import { Combobox } from "../Combobox.js";
import type {
  ComboboxOpenChangeEvent,
  ComboboxOption,
  ComboboxProps,
  ComboboxState,
  ComboboxValueChangeEvent,
  ComboboxValueMeta,
} from "../Combobox.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction, EmptyStateProps } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { List } from "../List.js";
import type { ListItem, ListProps } from "../List.js";
import { Skeleton } from "../Skeleton.js";
import type { SkeletonProps } from "../Skeleton.js";

export type AutocompleteState =
  | "idle"
  | "typing"
  | "suggesting"
  | "loading"
  | "empty"
  | "invalid"
  | "selected"
  | "disabled";

export type AutocompleteDensity = "sm" | "md" | "lg";

export interface AutocompleteSuggestion {
  key?: string;
  label: string;
  value?: string;
  meta?: string;
  description?: string;
  disabled?: boolean;
}

export interface AutocompleteEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface AutocompleteValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface AutocompleteProps {
  label: string;
  helper?: string;
  suggestions?: AutocompleteSuggestion[];
  value?: string;
  name?: string;
  placeholder?: string;
  density?: AutocompleteDensity;
  state?: AutocompleteState;
  disabled?: boolean;
  loading?: boolean;
  empty?: AutocompleteEmptyState;
  validation?: AutocompleteValidation;
  selectedKey?: string;
  className?: string;
  onValueChange?: (value: string, meta: ComboboxValueMeta, event: ComboboxValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: ComboboxOpenChangeEvent) => void;
  onSuggestionSelect?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface AutocompleteComponent extends ForwardRefExoticComponent<AutocompleteProps & RefAttributes<HTMLDivElement>> {
  displayName: "Autocomplete";
}

type NormalizedSuggestion = Required<Pick<ComboboxOption, "label" | "value">> & {
  key: string;
  meta: string;
  disabled: boolean;
};

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

const interactiveStates = new Set<AutocompleteState>(["typing", "suggesting", "loading", "selected"]);

function normalizeSuggestion(suggestion: AutocompleteSuggestion | null | undefined): NormalizedSuggestion | null {
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

function isNormalizedSuggestion(suggestion: NormalizedSuggestion | null): suggestion is NormalizedSuggestion {
  return Boolean(suggestion);
}

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  disabled,
  loading,
  state,
  hasSuggestions,
}: {
  disabled: boolean;
  loading: boolean;
  state: AutocompleteState;
  hasSuggestions: boolean;
}): AutocompleteState {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (!hasSuggestions) return "empty";
  return state;
}

function comboboxStateFor(resolvedState: AutocompleteState): ComboboxState {
  if (resolvedState === "invalid") return "error";
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "typing" || resolvedState === "suggesting" || resolvedState === "selected") return "open";
  return "default";
}

export const Autocomplete = forwardRef<HTMLDivElement, AutocompleteProps>(function Autocomplete({
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
    .filter(isNormalizedSuggestion), [suggestions]);
  const hasSuggestions = normalizedSuggestions.length > 0;
  const resolvedState = resolveState({ disabled, loading, state, hasSuggestions });
  const comboboxState = comboboxStateFor(resolvedState);

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
        open: interactiveStates.has(resolvedState),
        emptyText: empty?.title,
        onValueChange,
        onOpenChange,
      } as ComboboxProps)
      : null,
    loading || resolvedState === "loading"
      ? React.createElement(Skeleton, {
        label: `${label} suggestions loading`,
        variant: "row",
        density,
        lines: 3,
        state: "loading",
        fullWidth: true,
      } as SkeletonProps)
      : null,
    hasSuggestions && resolvedState !== "loading"
      ? React.createElement(List, {
        label: `${label} suggestion summary`,
        items: normalizedSuggestions.map((suggestion): ListItem => ({
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
      } as ListProps)
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
      } as EmptyStateProps)
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "default"),
        density,
        live: validation.live,
      } as InlineValidationProps)
      : null,
  );
}) as AutocompleteComponent;

Autocomplete.displayName = "Autocomplete";
