import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ComboboxOpenChangeEvent, ComboboxValueChangeEvent, ComboboxValueMeta } from "../Combobox.js";
import type { EmptyStateAction } from "../EmptyState.js";
import type { InlineValidationProps } from "../InlineValidation.js";

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

export const Autocomplete: AutocompleteComponent;
