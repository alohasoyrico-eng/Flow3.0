import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type RefAttributes,
  forwardRef,
  useId,
  useMemo,
  useState,
} from "react";
import { cardExpiryInputPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import {
  type FlowDataAttributes,
  flowStateProps,
  flowDensityProps,
  flowRestProps,
  flowDataProps,
  normalizeFlowDensity,
} from "./internal/props.js";

export type CardExpiryInputDensity = "sm" | "md" | "lg";
export type CardExpiryInputState = "default" | "filled" | "valid" | "loading" | "error" | "disabled";
export type CardExpiryValidity = "empty" | "incomplete" | "valid" | "invalid" | "expired";
export type CardExpiryParts = {
  digits: string;
  month: string;
  year: string;
};
export type CardExpiryMeta = CardExpiryParts & {
  validity: CardExpiryValidity;
  expired: boolean;
};

export interface CardExpiryInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  error?: string;
  value?: string;
  density?: CardExpiryInputDensity;
  state?: CardExpiryInputState;
  loading?: boolean;
  validationMessage?: string;
  expiredMessage?: string;
  onValueChange?: (value: string, meta: CardExpiryMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CardExpiryInputComponent extends ForwardRefExoticComponent<CardExpiryInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CardExpiryInput";
  platformContract: typeof cardExpiryInputPlatformContract;
}

function normalizeCardExpiry(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "").slice(0, 4);
}

function formatCardExpiry(value: unknown): string {
  const digits = normalizeCardExpiry(value);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function parseCardExpiry(value: unknown): CardExpiryParts {
  const digits = normalizeCardExpiry(value);
  if (digits.length < 4) return { digits, month: "", year: "" };
  return { digits, month: digits.slice(0, 2), year: digits.slice(2, 4) };
}

function cardExpiryValidity(value: unknown, now = new Date()): CardExpiryValidity {
  const { digits, month, year } = parseCardExpiry(value);
  if (!digits) return "empty";
  if (digits.length < 4) return "incomplete";
  const monthNumber = Number(month);
  if (monthNumber < 1 || monthNumber > 12) return "invalid";
  const yearNumber = 2000 + Number(year);
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  if (yearNumber < currentYear || (yearNumber === currentYear && monthNumber < currentMonth)) return "expired";
  return "valid";
}

function resolveCardExpiryState({
  disabled = false,
  loading = false,
  error = "",
  state,
  value = "",
  validity = "empty",
}: {
  disabled?: boolean;
  loading?: boolean;
  error?: string | undefined;
  state?: CardExpiryInputState | undefined;
  value?: string;
  validity?: CardExpiryValidity;
} = {}): CardExpiryInputState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  if (state) return state;
  if (validity === "valid") return "valid";
  return value ? "filled" : "default";
}

export const CardExpiryInput = forwardRef<HTMLInputElement, CardExpiryInputProps>(function CardExpiryInput({
  label,
  value,
  helper = "",
  error = "",
  disabled = false,
  loading = false,
  required = false,
  density,
  state,
  name = "",
  placeholder = "",
  validationMessage,
  expiredMessage,
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `card-expiry-input-${generatedId}`;
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const digits = normalizeCardExpiry(currentValue);
  const formattedValue = formatCardExpiry(digits);
  const validity = cardExpiryValidity(digits);
  const { month, year } = parseCardExpiry(digits);
  const localError = validity === "invalid" ? validationMessage : validity === "expired" ? expiredMessage : undefined;
  const resolvedError = error || localError;
  const resolvedHelper = resolvedError || helper;
  const resolvedState = resolveCardExpiryState({ disabled, loading, error: resolvedError, state, value: digits, validity });
  const resolvedDensity = normalizeFlowDensity(density);
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;
  const meta = useMemo(() => ({
    digits,
    month,
    year,
    validity,
    expired: validity === "expired",
  }), [digits, month, validity, year]);

  if (!label) return null;

  return React.createElement(
    "label",
    {
      className: ["field card-expiry-input", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-mono": "true",
      "data-validity": validity,
      "data-month": month,
      "data-year": year,
      "data-validation-message": validationMessage,
      "data-expired-message": expiredMessage,
    },
    React.createElement("span", { className: "field__label card-expiry-input__label", id: `${inputId}-label` }, label),
    React.createElement(
      "span",
      { className: "field__control card-expiry-input__control" },
      React.createElement("span", { className: "field__icon card-expiry-input__icon", "aria-hidden": "true" }, "calendar_month"),
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        name,
        className: "input card-expiry-input__input",
        type: "text",
        inputMode: "numeric",
        autoComplete: "cc-exp",
        placeholder,
        value: formattedValue,
        disabled: Boolean(disabled || loading),
        required,
        pattern: "[0-9/ ]*",
        enterKeyHint: "next",
        maxLength: 5,
        spellCheck: false,
        "data-card-expiry-input": "",
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": resolvedError ? "true" : undefined,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const nextDigits = normalizeCardExpiry(event.target.value);
          const nextFormatted = formatCardExpiry(nextDigits);
          const nextValidity = cardExpiryValidity(nextDigits);
          const parsed = parseCardExpiry(nextDigits);
          if (!isValueControlled) setInternalValue(nextDigits);
          onValueChange?.(nextFormatted, {
            digits: nextDigits,
            month: parsed.month,
            year: parsed.year,
            validity: nextValidity,
            expired: nextValidity === "expired",
          }, event);
        },
      }),
      loading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading" }) : null,
    ),
    resolvedHelper
      ? React.createElement(
        "span",
        {
          className: "field__helper card-expiry-input__helper",
          id: `${inputId}-helper`,
          "data-card-expiry-helper": "",
          role: resolvedError ? "alert" : undefined,
        },
        resolvedHelper,
      )
      : null,
  );
}) as CardExpiryInputComponent;

CardExpiryInput.displayName = "CardExpiryInput";
CardExpiryInput.platformContract = cardExpiryInputPlatformContract;
