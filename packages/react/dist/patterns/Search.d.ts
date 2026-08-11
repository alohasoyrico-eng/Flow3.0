import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateAction, EmptyStateVariant } from "../EmptyState.js";
import type { InlineValidationState } from "../InlineValidation.js";
import type { InputDensity, InputValueMeta } from "../Input.js";
import type { ListItem, ListState } from "../List.js";
import type { SelectOption, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SearchState = "idle" | "typing" | "results" | "empty" | "invalid" | "loading" | "disabled" | "selected";
export type SearchDensity = InputDensity;

export interface SearchResult extends Omit<ListItem, "key"> {
  key?: string;
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
  displayName: "Search";
}

export const Search: SearchComponent;
