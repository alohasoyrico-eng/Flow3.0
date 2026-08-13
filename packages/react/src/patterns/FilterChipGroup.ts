import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useMemo,
} from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Chip } from "../Chip.js";
import type { ChipProps } from "../Chip.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction, EmptyStateProps } from "../EmptyState.js";
import { Toast } from "../Toast.js";
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

type NormalizedFilter = {
  key: string;
  label: string;
  value?: string | undefined;
  tone: NonNullable<FilterChipGroupFilter["tone"]>;
  disabled: boolean;
};

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function normalizeFilter(filter: FilterChipGroupFilter | undefined): NormalizedFilter | null {
  if (!filter?.label) return null;
  const key = filter.key ?? filter.value ?? filter.label;
  return {
    key: String(key),
    label: filter.label,
    value: filter.value,
    tone: filter.tone ?? "default",
    disabled: Boolean(filter.disabled),
  };
}

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

export const FilterChipGroup = forwardRef<HTMLDivElement, FilterChipGroupProps>(function FilterChipGroup({
  label = "Active filters",
  filters,
  resultCount,
  overflowCount = 0,
  density,
  state = "active",
  disabled = false,
  empty,
  reset,
  feedback,
  onRemoveFilter,
  onReset,
  onFeedbackAction,
  onFeedbackDismiss,
  className = "",
  ...rest
}, ref) {
  const normalizedFilters = useMemo(() => (Array.isArray(filters) ? filters : [])
    .map(normalizeFilter)
    .filter((filter): filter is NormalizedFilter => Boolean(filter)), [filters]);
  const hasFilters = normalizedFilters.length > 0;
  const resolvedState = disabled ? "disabled" : hasFilters ? state : "empty";
  const countLabel = typeof resultCount === "number" ? `${resultCount} results` : `${normalizedFilters.length} filters`;
  const canReset = Boolean(hasFilters && reset?.label && !disabled);

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "data-flow-pattern": "filter-chip-group",
      "data-state": resolvedState,
      "data-density": density,
      "data-filter-count": String(normalizedFilters.length),
      ...sanitizeRestProps(rest),
    },
    hasFilters
      ? React.createElement(
        React.Fragment,
        null,
        React.createElement(Badge, {
          label: countLabel,
          tone: resultCount === 0 ? "warning" : "info",
          variant: "status",
          density,
          state: disabled ? "disabled" : "default",
          live: true,
        } as BadgeProps),
        normalizedFilters.map((filter) => React.createElement(Chip, {
          key: filter.key,
          label: filter.label,
          tone: filter.tone,
          density,
          state: resolvedState === "removing" ? "pressed" : "default",
          removable: !filter.disabled && !disabled,
          disabled: filter.disabled || disabled,
          onRemoveLabel: `Remove ${filter.label}`,
          onRemove: (_label, event) => onRemoveFilter?.(filter.key, event),
          "data-filter-key": filter.key,
        } as ChipProps)),
        overflowCount > 0
          ? React.createElement(Badge, {
            label: `+${overflowCount}`,
            ariaLabel: `${overflowCount} additional filters`,
            tone: "neutral",
            variant: "count",
            state: "overflow",
            density,
          } as BadgeProps)
          : null,
        canReset
          ? React.createElement(Button, {
            label: reset?.label,
            variant: reset?.variant ?? "ghost",
            intent: reset?.intent ?? "default",
            density: reset?.density ?? density,
            disabled: reset?.disabled,
            loading: reset?.loading || resolvedState === "resetting",
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              reset?.onClick?.(event);
              if (event.defaultPrevented) return;
              onReset?.(event);
            },
          } as ButtonProps)
          : null,
      )
      : React.createElement(EmptyState, {
        title: empty?.title ?? "No active filters",
        description: empty?.description ?? "Filters applied from search, toolbar, or advanced filters appear here.",
        icon: empty?.icon,
        action: empty?.action,
        variant: "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      } as EmptyStateProps),
    feedback?.label
      ? React.createElement(Toast, {
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? "info",
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
        actionLabel: feedback.actionLabel,
        dismissible: feedback.dismissible,
        dismissLabel: feedback.dismissLabel,
        onAction: onFeedbackAction ?? feedback.onAction,
        onDismiss: onFeedbackDismiss ?? feedback.onDismiss,
      } as ToastProps)
      : null,
  );
}) as FilterChipGroupComponent;

FilterChipGroup.displayName = "FilterChipGroup";
