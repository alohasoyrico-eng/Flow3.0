import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type RefAttributes,
  forwardRef,
  useId,
  useState,
} from "react";
import { inputAmountPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";

export type InputAmountDensity = FlowDensity;
export type InputAmountState = "default" | "filled" | "loading" | "error" | "disabled";
export type InputAmountMeta = {
  value: string;
  displayValue: string;
  rawValue: string;
  numericValue: number | null;
  currency: string;
  formatted: string;
};

export interface InputAmountProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  helper?: string;
  helperText?: string;
  error?: string;
  density?: InputAmountDensity;
  state?: InputAmountState;
  loading?: boolean;
  currency?: string;
  locale?: string | string[];
  prefix?: string;
  suffix?: string;
  validationMessage?: string;
  onValueChange?: (value: string, meta: InputAmountMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface InputAmountComponent extends ForwardRefExoticComponent<InputAmountProps & RefAttributes<HTMLInputElement>> {
  displayName: "InputAmount";
  platformContract: typeof inputAmountPlatformContract;
}

const validStates = new Set<InputAmountState>(["default", "filled", "loading", "error", "disabled"]);

function normalizeAmount(value: unknown) {
  const normalized = String(value ?? "").replace(/[^\d.,-]/g, "").replace(/,/g, "");
  return normalized;
}

function amountMeta(value: unknown, currency: string, locale: string | string[] | undefined): InputAmountMeta {
  const normalized = normalizeAmount(value);
  const numericValue = normalized === "" || normalized === "-" ? null : Number(normalized);
  const finiteNumericValue = typeof numericValue === "number" && Number.isFinite(numericValue) ? numericValue : null;
  const formatOptions: Intl.NumberFormatOptions = {
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  formatOptions["style"] = "currency";
  const formatter = new Intl.NumberFormat(locale, formatOptions);
  return {
    value: normalized,
    displayValue: String(value ?? ""),
    rawValue: String(value ?? ""),
    numericValue: finiteNumericValue,
    currency,
    formatted: finiteNumericValue !== null ? formatter.format(finiteNumericValue) : "",
  };
}

function resolveAmountState({ disabled = false, loading = false, error = "", state, value = "" }: {
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  state?: InputAmountState;
  value?: string;
} = {}): InputAmountState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  if (state && validStates.has(state)) return state;
  return value ? "filled" : "default";
}

export const InputAmount = forwardRef<HTMLInputElement, InputAmountProps>(function InputAmount({
  label,
  value,
  helper = "",
  helperText,
  error = "",
  disabled = false,
  loading = false,
  required = false,
  density,
  state,
  name = "",
  placeholder = "",
  currency = "MXN",
  locale,
  prefix,
  suffix = "",
  validationMessage,
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `input-amount-${generatedId}`;
  const resolvedCurrency = String(currency || "MXN").toUpperCase();
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? "");
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const normalizedValue = normalizeAmount(currentValue);
  const resolvedError = error || validationMessage || "";
  const resolvedState = resolveAmountState({ disabled, loading, error: resolvedError, ...(state !== undefined ? { state } : {}), value: normalizedValue });
  const resolvedDensity = normalizeFlowDensity(density);
  const fieldMessage = resolveFieldMessage({
    controlId: inputId,
    describedBy: rest["aria-describedby"],
    error: resolvedError,
    helper,
    helperText,
    state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
  });

  if (!label) return null;

  return React.createElement(
    "label",
    {
      className: ["field input-amount", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-mono": "true",
      "data-align": "end",
      "data-currency": resolvedCurrency,
    },
    React.createElement("span", { className: "field__label input-amount__label", id: `${inputId}-label` }, label),
    React.createElement(
      "span",
      { className: "field__control input-amount__control" },
      React.createElement("span", { className: "field__prefix input-amount__currency", "aria-hidden": "true" }, prefix || resolvedCurrency),
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        name,
        className: "input input-amount__input",
        type: "text",
        inputMode: "decimal",
        autoComplete: "off",
        placeholder,
        value: normalizedValue,
        disabled: Boolean(disabled || loading),
        required,
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const meta = amountMeta(event.target.value, resolvedCurrency, locale);
          if (!isValueControlled) setInternalValue(meta.value);
          onValueChange?.(meta.value, meta, event);
        },
      }),
      suffix
        ? React.createElement("span", { className: "field__suffix input-amount__suffix", "aria-hidden": "true" }, suffix)
        : null,
      loading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading" }) : null,
    ),
    fieldMessage.message
      ? React.createElement(
        "span",
        {
          className: "field__helper input-amount__helper",
          id: fieldMessage.messageId,
          role: fieldMessage.role,
          ...flowStateProps(fieldMessage.state),
        },
        fieldMessage.message,
      )
      : null,
  );
}) as InputAmountComponent;

InputAmount.displayName = "InputAmount";
InputAmount.platformContract = inputAmountPlatformContract;
