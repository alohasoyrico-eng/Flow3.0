import React, { forwardRef, useId, useState } from "react";
import { inputPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { resolveFieldMessage } from "./internal/field-message.js";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";

import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { FieldMessageState } from "./internal/field-message.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type InputVariant = "text" | "email" | "password" | "number" | "currency" | "unit" | "search";
export type InputDensity = FlowDensity;
export type InputState = "default" | "focus" | "filled" | "info" | "success" | "warning" | "loading" | "error" | "disabled";
export type InputAlign = "start" | "end";
export type InputValueMeta = {
  value: string;
  displayValue: string;
  rawValue: string;
  numericValue?: number | null;
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  helperText?: string;
  error?: string;
  live?: boolean;
  value?: string;
  density?: InputDensity;
  state?: InputState;
  variant?: InputVariant;
  icon?: string;
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  loading?: boolean;
  align?: InputAlign;
  revealable?: boolean;
  revealed?: boolean;
  revealLabel?: string;
  hideLabel?: string;
  locale?: string | string[];
  autocomplete?: string;
  onValueChange?: (value: string, meta: InputValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onRevealChange?: (revealed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface InputComponent extends ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>> {
  displayName: "Input";
  platformContract: typeof inputPlatformContract;
}

const validVariants = new Set<InputVariant>(["text", "email", "password", "number", "currency", "unit", "search"]);
const validStates = new Set<InputState>(["default", "focus", "filled", "info", "success", "warning", "loading", "error", "disabled"]);
const numericVariants = new Set<InputVariant>(["number", "currency", "unit"]);

function resolveInputState({ disabled = false, loading = false, error = "", state, value = "" }: {
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  state?: InputState;
  value?: string;
} = {}): InputState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  if (state && validStates.has(state)) return state;
  return value ? "filled" : "default";
}

function typeForVariant(variant: InputVariant, type?: InputHTMLAttributes<HTMLInputElement>["type"]) {
  if (variant === "email") return "email";
  if (variant === "password") return "password";
  if (variant === "search") return "search";
  if (numericVariants.has(variant)) return "text";
  return type || "text";
}

function inputModeForVariant(variant: InputVariant) {
  if (variant === "email") return "email";
  if (numericVariants.has(variant)) return "decimal";
  if (variant === "search") return "search";
  return undefined;
}

function autocompleteForVariant(variant: InputVariant) {
  if (variant === "email") return "email";
  if (variant === "password") return "current-password";
  if (variant === "search") return "off";
  return undefined;
}

function formatValue(value: string | number | readonly string[] | undefined, variant: InputVariant, locale?: string | string[]) {
  const stringValue = value == null ? "" : String(value);
  if (!stringValue || variant !== "currency") return stringValue;
  const numeric = Number(stringValue.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) return stringValue;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function normalizeValue(value: string, variant: InputVariant): InputValueMeta {
  const displayValue = value == null ? "" : String(value);
  if (!numericVariants.has(variant)) {
    return { value: displayValue, displayValue, rawValue: displayValue };
  }
  const normalized = displayValue.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  return {
    value: normalized,
    displayValue,
    rawValue: displayValue,
    numericValue: normalized === "" || normalized === "-" ? null : Number(normalized),
  };
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({
  label,
  helper = "",
  helperText,
  error = "",
  live = false,
  value,
  name = "",
  placeholder = "",
  disabled = false,
  loading = false,
  required = false,
  density,
  state,
  variant = "text",
  icon = "",
  prefix = "",
  suffix = "",
  mono = false,
  type = "text",
  inputMode,
  autocomplete,
  align = "start",
  revealable = false,
  revealed: revealedProp,
  revealLabel,
  hideLabel,
  locale,
  onValueChange,
  onRevealChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "text");
  const resolvedType = typeForVariant(resolvedVariant, type);
  const isRevealable = Boolean(revealable) || resolvedVariant === "password" || resolvedType === "password";
  const canReveal = Boolean(isRevealable && revealLabel && hideLabel);
  const isValueControlled = value !== undefined;
  const isRevealControlled = revealedProp !== undefined;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const [internalRevealed, setInternalRevealed] = useState(Boolean(revealedProp));
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const revealed = isRevealControlled ? Boolean(revealedProp) : internalRevealed;
  const resolvedState = resolveInputState({
    disabled,
    loading,
    error,
    ...(state ? { state } : {}),
    value: currentValue,
  });
  const resolvedDensity = normalizeFlowDensity(density);
  const isDisabled = Boolean(disabled) || Boolean(loading);
  const resolvedAlign = align === "end" || (align === "start" && numericVariants.has(resolvedVariant)) ? "end" : "start";
  const fieldMessage = resolveFieldMessage({
    controlId: inputId,
    describedBy: rest["aria-describedby"],
    error,
    helper,
    helperText,
    live,
    state: resolvedState as FieldMessageState,
  });
  const inputType = canReveal && revealed ? "text" : resolvedType;

  if (!label) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const meta = normalizeValue(event.target.value, resolvedVariant);
    if (!isValueControlled) setInternalValue(meta.value);
    onValueChange?.(meta.value, meta, event);
  };

  const handleRevealClick = (event: MouseEvent<HTMLButtonElement>) => {
    const nextRevealed = !revealed;
    if (!isRevealControlled) setInternalRevealed(nextRevealed);
    onRevealChange?.(nextRevealed, event);
  };

  return React.createElement(
    "label",
    {
      className: ["field", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      ...flowVariantProps(resolvedVariant),
      "data-mono": mono ? "true" : undefined,
      "data-align": resolvedAlign === "end" ? "end" : undefined,
    },
    React.createElement("span", { className: "field__label", "data-field-label": "", id: `${inputId}-label` }, label),
    React.createElement(
      "span",
      { className: "field__control" },
      icon
        ? React.createElement("span", { className: "field__icon", "aria-hidden": "true" }, icon)
        : null,
      prefix
        ? React.createElement("span", { className: "field__prefix", "aria-hidden": "true" }, prefix)
        : null,
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        className: "input",
        name,
        type: inputType,
        value: formatValue(currentValue, resolvedVariant, locale),
        placeholder,
        disabled: isDisabled,
        required,
        inputMode: inputMode || inputModeForVariant(resolvedVariant),
        autoComplete: autocomplete || autocompleteForVariant(resolvedVariant),
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        onChange: handleChange,
      }),
      suffix
        ? React.createElement("span", { className: "field__suffix", "aria-hidden": "true" }, suffix)
        : null,
      canReveal
        ? React.createElement(
          "button",
          {
            className: "field-action field__action",
            type: "button",
            disabled: isDisabled,
            "aria-label": revealed ? hideLabel : revealLabel,
            "aria-pressed": String(revealed),
            "data-field-action": "reveal",
            onClick: handleRevealClick,
          },
          React.createElement("span", { className: "field-action__icon", "aria-hidden": "true" }, revealed ? "visibility_off" : "visibility"),
        )
        : null,
      loading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading" }) : null,
    ),
    fieldMessage.message
      ? React.createElement("span", {
          className: "field__helper",
          "data-field-helper": "",
          ...flowStateProps(fieldMessage.state),
          id: fieldMessage.messageId,
          role: fieldMessage.role,
        }, fieldMessage.message)
      : null,
  );
}) as InputComponent;

Input.displayName = "Input";
Input.platformContract = inputPlatformContract;
