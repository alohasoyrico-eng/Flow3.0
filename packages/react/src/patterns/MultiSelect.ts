import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxProps } from "../Checkbox.js";
import { Chip } from "../Chip.js";
import type { ChipProps } from "../Chip.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Select } from "../Select.js";
import type { SelectDensity, SelectOpenChangeEvent, SelectProps } from "../Select.js";

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

type SafeRootProps = Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeOptions(options: MultiSelectOption[] | undefined): MultiSelectOption[] {
  return (Array.isArray(options) ? options : []).filter((option) => option?.label);
}

function selectedSet(values: string[] | undefined): Set<string> {
  return new Set((Array.isArray(values) ? values : []).filter((value) => value !== undefined && value !== null).map(String));
}

function optionValue(option: MultiSelectOption): string {
  return String(option.value ?? option.key ?? option.label);
}

function resolveState({
  disabled,
  loading,
  open,
  selectedCount,
  optionsCount,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  open: boolean;
  selectedCount: number;
  optionsCount: number;
  state?: MultiSelectState | undefined;
}): MultiSelectState {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (state === "invalid") return "invalid";
  if (open || state === "open") return "open";
  if (!optionsCount) return "empty";
  if (selectedCount) return "selected";
  return state ?? "closed";
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect({
  label,
  helper,
  density,
  state,
  open = false,
  disabled = false,
  loading = false,
  options = [],
  value = [],
  maxVisibleChips = 3,
  optionsLabel,
  placeholder = "Select options",
  empty,
  clearAction,
  validation,
  onOpenChange,
  onValueChange,
  onRemove,
  onClear,
  className = "",
  ...rest
}, ref) {
  const normalizedOptions = normalizeOptions(options);
  const selectedValues = selectedSet(value);
  const selectedOptions = normalizedOptions.filter((option) => selectedValues.has(optionValue(option)));
  const selectedCount = selectedOptions.length;
  const visibleChips = selectedOptions.slice(0, Math.max(0, maxVisibleChips));
  const overflowCount = Math.max(0, selectedCount - visibleChips.length);
  const resolvedState = resolveState({ disabled, loading, open, selectedCount, optionsCount: normalizedOptions.length, state });
  const triggerOptions = normalizedOptions.length
    ? normalizedOptions.map((option) => ({
      label: option.label,
      value: optionValue(option),
      meta: option.meta,
      disabled: option.disabled,
    }))
    : [{ label: placeholder, value: "__empty", disabled: true }];
  const triggerValue = selectedOptions[0] ? optionValue(selectedOptions[0]) : "__empty";

  if (!label) return null;

  const updateValue = (nextValue: string, checked: boolean, event?: MouseEvent<HTMLElement>) => {
    const nextValues = new Set(selectedValues);
    if (checked) nextValues.add(nextValue);
    else nextValues.delete(nextValue);
    onValueChange?.([...nextValues], { value: nextValue, checked }, event);
  };

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "multi-select",
      "data-state": resolvedState,
      "data-density": density,
      "data-selected-count": String(selectedCount),
      "data-option-count": String(normalizedOptions.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Select, {
      label,
      helper,
      options: triggerOptions,
      optionsLabel,
      value: triggerValue,
      disabled,
      density,
      state: resolvedState === "invalid" ? "error" : resolvedState === "loading" ? "loading" : resolvedState === "open" ? "open" : selectedCount ? "filled" : "default",
      open,
      onOpenChange,
      "aria-invalid": resolvedState === "invalid" ? "true" : undefined,
    } as SelectProps),
    React.createElement(Badge, {
      label: String(selectedCount),
      tone: resolvedState === "invalid" ? "danger" : selectedCount ? "info" : "neutral",
      variant: "count",
      state: disabled ? "disabled" : selectedCount ? "default" : "hidden",
      density,
      hidden: selectedCount === 0,
      live: true,
      ariaLabel: `${selectedCount} selected`,
    } as BadgeProps),
    normalizedOptions.length
      ? normalizedOptions.map((option) => {
        const valueKey = optionValue(option);
        const checked = selectedValues.has(valueKey);
        return React.createElement(Checkbox, {
          key: valueKey,
          label: option.label,
          description: option.meta,
          checked,
          value: valueKey,
          disabled: disabled || option.disabled,
          density,
          variant: "compact",
          state: checked ? "checked" : "unchecked",
          onCheckedChange: (nextChecked, _meta, event) => updateValue(valueKey, nextChecked, event as unknown as MouseEvent<HTMLElement>),
        } as CheckboxProps);
      })
      : React.createElement(EmptyState, {
        title: empty?.title ?? `${label} has no options`,
        description: empty?.description,
        icon: empty?.icon,
        action: empty?.action,
        variant: empty?.variant ?? "search-empty",
        state: disabled ? "disabled" : "search-empty",
        density,
        onAction: empty?.onAction,
      } as EmptyStateProps),
    visibleChips.map((option) => {
      const valueKey = optionValue(option);
      return React.createElement(Chip, {
        key: valueKey,
        label: option.label,
        variant: "input",
        tone: resolvedState === "invalid" ? "danger" : "default",
        state: disabled ? "disabled" : "selected",
        density,
        selected: true,
        disabled,
        removable: !disabled,
        onRemoveLabel: `Remove ${option.label}`,
        onRemove: (_chipLabel, event) => {
          onRemove?.(valueKey, event);
          if (event.defaultPrevented) return;
          updateValue(valueKey, false, event);
        },
      } as ChipProps);
    }),
    overflowCount
      ? React.createElement(Badge, {
        label: `+${overflowCount}`,
        tone: "neutral",
        variant: "count",
        state: "overflow",
        density,
        ariaLabel: `${overflowCount} more selected`,
      } as BadgeProps)
      : null,
    clearAction?.label && selectedCount
      ? React.createElement(Button, {
        ...clearAction,
        label: clearAction.label,
        variant: clearAction.variant ?? "ghost",
        density: clearAction.density ?? density,
        disabled: disabled || clearAction.disabled,
        onClick: (event) => {
          clearAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onClear?.(event);
          onValueChange?.([], { value: "", checked: false, cleared: true }, event);
        },
      } as ButtonProps)
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "warning"),
        density,
        live: validation.live,
      } as InlineValidationProps)
      : null,
  );
}) as MultiSelectComponent;

MultiSelect.displayName = "MultiSelect";
