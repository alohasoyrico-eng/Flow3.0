import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { SelectDensity, SelectOpenChangeEvent } from "../Select.js";

export type MultiSelectState = "closed" | "open" | "selected" | "empty" | "loading" | "invalid" | "disabled";
export type MultiSelectDensity = SelectDensity;

export interface MultiSelectOption {
  key?: string;
  label: string;
  value?: string;
  meta?: string;
  disabled?: boolean;
}

export interface MultiSelectClearAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface MultiSelectEmptyState extends Pick<EmptyStateProps, "title" | "description" | "icon" | "action" | "variant" | "onAction"> {}

export interface MultiSelectValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface MultiSelectValueMeta {
  value: string;
  checked: boolean;
  cleared?: boolean;
}

export interface MultiSelectProps {
  label: string;
  helper?: string;
  density?: MultiSelectDensity;
  state?: MultiSelectState;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  options?: MultiSelectOption[];
  value?: string[];
  maxVisibleChips?: number;
  optionsLabel?: string;
  placeholder?: string;
  empty?: MultiSelectEmptyState;
  clearAction?: MultiSelectClearAction;
  validation?: MultiSelectValidation;
  className?: string;
  onOpenChange?: (open: boolean, event?: SelectOpenChangeEvent) => void;
  onValueChange?: (value: string[], meta: MultiSelectValueMeta, event?: MouseEvent<HTMLElement>) => void;
  onRemove?: (value: string, event?: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface MultiSelectComponent extends ForwardRefExoticComponent<MultiSelectProps & RefAttributes<HTMLDivElement>> {
  displayName: "MultiSelect";
}

export const MultiSelect: MultiSelectComponent;
