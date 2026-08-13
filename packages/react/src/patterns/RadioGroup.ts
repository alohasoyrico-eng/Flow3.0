import React, { forwardRef, useId, useState } from "react";
import type { ChangeEvent, ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { RadioButton } from "../RadioButton.js";
import { Surface } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type RadioGroupState = "unselected" | "selected" | "invalid" | "dirty" | "loading" | "permission-blocked" | "disabled";
export type RadioGroupDensity = "sm" | "md" | "lg";

export interface RadioGroupOption {
  key?: string;
  label: string;
  value?: string;
  description?: string;
  meta?: string;
  disabled?: boolean;
  variant?: "default" | "descriptive" | "compact" | "critical";
}

export interface RadioGroupValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface RadioGroupValueMeta {
  value: string;
  option?: RadioGroupOption;
  cleared?: boolean;
}

export interface RadioGroupProps extends FlowDataAttributes {
  label: string;
  helper?: string;
  density?: RadioGroupDensity;
  state?: RadioGroupState;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  name?: string;
  options?: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  clearLabel?: string;
  applyAction?: ButtonProps;
  validation?: RadioGroupValidation;
  className?: string;
  onValueChange?: (value: string, meta: RadioGroupValueMeta, event?: MouseEvent<HTMLElement>) => void;
  onApply?: (value: string | undefined, event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface RadioGroupComponent extends ForwardRefExoticComponent<RadioGroupProps & RefAttributes<HTMLDivElement>> {
  displayName: "RadioGroup";
}

type RadioGroupRestProps = Record<string, unknown>;
type RadioGroupChangeEvent = MouseEvent<HTMLButtonElement> | ChangeEvent<HTMLInputElement>;

interface RadioGroupStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  invalid: boolean;
  selected: boolean;
  state?: RadioGroupState | undefined;
}

function sanitizeRestProps(rest: RadioGroupRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeOptions(options: RadioGroupOption[] | null | undefined): RadioGroupOption[] {
  return (Array.isArray(options) ? options : []).filter((option) => Boolean(option?.label));
}

function optionValue(option: RadioGroupOption): string {
  return String(option.value ?? option.key ?? option.label);
}

function resolveState({ disabled, loading, invalid, selected, state }: RadioGroupStateInput): RadioGroupState {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (invalid || state === "invalid") return "invalid";
  if (state === "permission-blocked") return "permission-blocked";
  if (selected) return state ?? "selected";
  return state ?? "unselected";
}

function notifyValueChange(
  onValueChange: RadioGroupProps["onValueChange"],
  nextValue: string,
  meta: RadioGroupValueMeta,
  event?: RadioGroupChangeEvent,
): void {
  onValueChange?.(nextValue, meta, event as MouseEvent<HTMLElement> | undefined);
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({
  label,
  helper,
  density,
  state,
  disabled = false,
  loading = false,
  required = false,
  name,
  options = [],
  value,
  defaultValue = "",
  clearLabel,
  applyAction,
  validation,
  className = "",
  onValueChange,
  onApply,
  onClear,
  ...rest
}, ref) {
  const reactId = useId();
  const groupName = name || `radio-group-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlled ? value : internalValue;
  const normalizedOptions = normalizeOptions(options);
  const invalid = Boolean(validation?.message) || (required && !currentValue);
  const resolvedState = resolveState({ disabled, loading, invalid, selected: Boolean(currentValue), state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";

  if (!label) return null;

  const commitValue = (nextValue: string, meta: RadioGroupValueMeta, event?: RadioGroupChangeEvent) => {
    if (!controlled) setInternalValue(nextValue);
    notifyValueChange(onValueChange, nextValue, meta, event);
  };

  const clear = (event: MouseEvent<HTMLButtonElement>) => {
    onClear?.(event);
    if (event.defaultPrevented) return;
    commitValue("", { value: "", cleared: true }, event);
  };

  return React.createElement(
    Surface,
    {
      ref,
      surfaceRole: "section",
      state: isDisabled ? "disabled" : invalid ? "selected" : "default",
      density,
      className,
      role: "radiogroup",
      "aria-label": label,
      "aria-required": required ? "true" : undefined,
      "aria-busy": loading ? "true" : undefined,
      "data-flow-pattern": "radio-group",
      "data-flow-slot": "groupSurface",
      "data-state": resolvedState,
      "data-selected-value": currentValue ? String(currentValue) : "",
      ...sanitizeRestProps(rest),
    } as ComponentProps<typeof Surface>,
    React.createElement("div", { "data-flow-slot": "question" }, React.createElement("h3", null, label), helper ? React.createElement("p", null, helper) : null),
    normalizedOptions.map((option) => {
      const nextValue = optionValue(option);
      const checked = String(currentValue ?? "") === nextValue;
      return React.createElement(RadioButton, {
        key: nextValue,
        label: option.label,
        description: option.description ?? option.meta,
        value: nextValue,
        name: groupName,
        checked,
        disabled: isDisabled || option.disabled,
        density,
        required,
        variant: option.variant ?? "default",
        state: checked ? "selected" : "unselected",
        onCheckedChange: (nextChecked, _meta, event) => {
          if (!nextChecked) return;
          commitValue(nextValue, { value: nextValue, option }, event);
        },
      } as ComponentProps<typeof RadioButton>);
    }),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? "error",
        density,
        live: validation.live,
      } as ComponentProps<typeof InlineValidation>)
      : null,
    clearLabel || applyAction?.label
      ? React.createElement(
        "div",
        { "data-flow-slot": "actions" },
        clearLabel ? React.createElement(Button, { label: clearLabel, variant: "ghost", density, disabled: isDisabled || !currentValue, onClick: clear } as ComponentProps<typeof Button>) : null,
        applyAction?.label
          ? React.createElement(Button, {
            ...applyAction,
            label: applyAction.label,
            density: applyAction.density ?? density,
            disabled: isDisabled || applyAction.disabled,
            onClick: (event) => {
              applyAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onApply?.(currentValue, event);
            },
          } as ComponentProps<typeof Button>)
          : null,
      )
      : null,
  );
}) as RadioGroupComponent;

RadioGroup.displayName = "RadioGroup";
