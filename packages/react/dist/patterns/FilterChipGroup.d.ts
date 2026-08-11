import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateAction } from "../EmptyState.js";
import type { ToastProps } from "../Toast.js";

export type FilterChipGroupState =
  | "empty"
  | "active"
  | "overflow"
  | "removing"
  | "resetting"
  | "disabled";

export type FilterChipGroupDensity = "sm" | "md" | "lg";

export interface FilterChipGroupFilter {
  key?: string;
  label: string;
  value?: string;
  tone?: "default" | "danger" | "warning";
  disabled?: boolean;
}

export interface FilterChipGroupEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface FilterChipGroupReset extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "onClick"> {}

export interface FilterChipGroupFeedback extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "density" | "actionLabel" | "dismissible" | "dismissLabel" | "onAction" | "onDismiss"> {}

export interface FilterChipGroupProps {
  label?: string;
  filters?: FilterChipGroupFilter[];
  resultCount?: number;
  overflowCount?: number;
  density?: FilterChipGroupDensity;
  state?: FilterChipGroupState;
  disabled?: boolean;
  empty?: FilterChipGroupEmptyState;
  reset?: FilterChipGroupReset;
  feedback?: FilterChipGroupFeedback;
  className?: string;
  onRemoveFilter?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface FilterChipGroupComponent extends ForwardRefExoticComponent<FilterChipGroupProps & RefAttributes<HTMLDivElement>> {
  displayName: "FilterChipGroup";
}

export const FilterChipGroup: FilterChipGroupComponent;
