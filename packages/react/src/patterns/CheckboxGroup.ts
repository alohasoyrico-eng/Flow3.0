import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxProps, CheckboxValueMeta } from "../Checkbox.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type CheckboxGroupState = "none-selected" | "partial" | "all-selected" | "invalid" | "dirty" | "loading" | "disabled";
export type CheckboxGroupDensity = "sm" | "md" | "lg";

export interface CheckboxGroupOption {
  key?: string;
  label: string;
  value?: string;
  description?: string;
  meta?: string;
  disabled?: boolean;
  variant?: "default" | "descriptive" | "select-all" | "compact";
}

export interface CheckboxGroupValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface CheckboxGroupValueMeta {
  value: string;
  checked: boolean;
  indeterminate?: boolean;
  cleared?: boolean;
}

export interface CheckboxGroupProps extends FlowDataAttributes {
  label: string;
  helper?: string;
  density?: CheckboxGroupDensity;
  state?: CheckboxGroupState;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  options?: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  selectAllLabel?: string;
  clearLabel?: string;
  applyAction?: ButtonProps;
  validation?: CheckboxGroupValidation;
  className?: string;
  onValueChange?: (value: string[], meta: CheckboxGroupValueMeta, event?: MouseEvent<HTMLElement>) => void;
  onApply?: (value: string[], event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface CheckboxGroupComponent extends ForwardRefExoticComponent<CheckboxGroupProps & RefAttributes<HTMLDivElement>> {
  displayName: "CheckboxGroup";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeOptions(options: CheckboxGroupOption[] | undefined): CheckboxGroupOption[] {
  return (Array.isArray(options) ? options : []).filter((option): option is CheckboxGroupOption => Boolean(option?.label));
}

function optionValue(option: CheckboxGroupOption): string {
  return String(option.value ?? option.key ?? option.label);
}

function selectedSet(value: string[] | undefined): Set<string> {
  return new Set((Array.isArray(value) ? value : []).filter((item) => item !== undefined && item !== null).map(String));
}

function resolveState({
  disabled,
  loading,
  invalid,
  selectedCount,
  optionCount,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  invalid: boolean;
  selectedCount: number;
  optionCount: number;
  state: CheckboxGroupState | undefined;
}): CheckboxGroupState {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (invalid || state === "invalid") return "invalid";
  if (!selectedCount) return state ?? "none-selected";
  if (selectedCount === optionCount) return state ?? "all-selected";
  return state ?? "partial";
}

function coerceCheckboxEvent(event: ChangeEvent<HTMLInputElement>): MouseEvent<HTMLElement> {
  return event as unknown as MouseEvent<HTMLElement>;
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup({
  label,
  helper,
  density,
  state,
  disabled = false,
  loading = false,
  required = false,
  options = [],
  value,
  defaultValue = [],
  selectAllLabel,
  clearLabel,
  applyAction,
  validation,
  className = "",
  onValueChange,
  onApply,
  onClear,
  ...rest
}, ref) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const currentValue = controlled ? value : internalValue;
  const normalizedOptions = normalizeOptions(options);
  const enabledOptions = normalizedOptions.filter((option) => !option.disabled);
  const selectedValues = useMemo(() => selectedSet(currentValue), [currentValue]);
  const enabledValues = enabledOptions.map(optionValue);
  const selectedEnabledCount = enabledValues.filter((item) => selectedValues.has(item)).length;
  const invalid = Boolean(validation?.message) || (required && selectedValues.size === 0);
  const resolvedState = resolveState({
    disabled,
    loading,
    invalid,
    selectedCount: selectedEnabledCount,
    optionCount: enabledValues.length,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";

  if (!label) return null;

  const commitValue = (nextValues: string[], meta: CheckboxGroupValueMeta, event?: MouseEvent<HTMLElement>) => {
    if (!controlled) setInternalValue(nextValues);
    onValueChange?.(nextValues, meta, event);
  };

  const updateOption = (nextValue: string, checked: boolean, event: ChangeEvent<HTMLInputElement>) => {
    const nextValues = new Set(selectedValues);
    if (checked) nextValues.add(nextValue);
    else nextValues.delete(nextValue);
    commitValue([...nextValues], { value: nextValue, checked }, coerceCheckboxEvent(event));
  };

  const toggleAll = (checked: boolean, _meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => {
    const nextValues = new Set(selectedValues);
    if (checked) enabledValues.forEach((item) => nextValues.add(item));
    else enabledValues.forEach((item) => nextValues.delete(item));
    commitValue([...nextValues], { value: "__all", checked, indeterminate: false }, coerceCheckboxEvent(event));
  };

  const clear = (event: MouseEvent<HTMLButtonElement>) => {
    onClear?.(event);
    if (event.defaultPrevented) return;
    commitValue([], { value: "__clear", checked: false, cleared: true }, event);
  };

  return React.createElement(
    Surface,
    {
      ref,
      surfaceRole: "section",
      state: isDisabled ? "disabled" : invalid ? "selected" : "default",
      density,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": loading ? "true" : undefined,
      "data-flow-pattern": "checkbox-group",
      "data-flow-slot": "groupSurface",
      "data-state": resolvedState,
      "data-selected-count": String(selectedValues.size),
      ...sanitizeRestProps(rest),
    } as SurfaceProps,
    React.createElement("div", { "data-flow-slot": "question" }, React.createElement("h3", null, label), helper ? React.createElement("p", null, helper) : null),
    selectAllLabel
      ? React.createElement(Checkbox, {
        label: selectAllLabel,
        checked: enabledValues.length > 0 && selectedEnabledCount === enabledValues.length,
        indeterminate: selectedEnabledCount > 0 && selectedEnabledCount < enabledValues.length,
        disabled: isDisabled || !enabledValues.length,
        density,
        variant: "select-all",
        state: selectedEnabledCount > 0 && selectedEnabledCount < enabledValues.length ? "indeterminate" : undefined,
        onCheckedChange: toggleAll,
      } as CheckboxProps)
      : null,
    normalizedOptions.map((option) => {
      const nextValue = optionValue(option);
      return React.createElement(Checkbox, {
        key: nextValue,
        label: option.label,
        description: option.description ?? option.meta,
        value: nextValue,
        checked: selectedValues.has(nextValue),
        disabled: isDisabled || option.disabled,
        density,
        required,
        variant: option.variant ?? "default",
        state: selectedValues.has(nextValue) ? "checked" : "unchecked",
        onCheckedChange: (checked: boolean, _meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => updateOption(nextValue, checked, event),
      } as CheckboxProps);
    }),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? "error",
        density,
        live: validation.live,
      } as InlineValidationProps)
      : null,
    clearLabel || applyAction?.label
      ? React.createElement(
        "div",
        { "data-flow-slot": "actions" },
        clearLabel ? React.createElement(Button, { label: clearLabel, variant: "ghost", density, disabled: isDisabled || selectedValues.size === 0, onClick: clear } as ButtonProps) : null,
        applyAction?.label
          ? React.createElement(Button, {
            ...applyAction,
            label: applyAction.label,
            density: applyAction.density ?? density,
            disabled: isDisabled || applyAction.disabled,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              applyAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onApply?.([...selectedValues], event);
            },
          } as ButtonProps)
          : null,
      )
      : null,
  );
}) as CheckboxGroupComponent;

CheckboxGroup.displayName = "CheckboxGroup";
