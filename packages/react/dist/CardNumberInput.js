import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import { cardNumberInputPlatformContract } from "#flow/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowDensityProps, flowRestProps } from "./internal/props.js";

function normalizeCardNumber(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 19);
}

function formatCardNumber(value) {
  return normalizeCardNumber(value).replace(/(.{4})/g, "$1 ").trim();
}

function isCardNumberLuhnValid(digits) {
  const value = normalizeCardNumber(digits);
  if (value.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function cardNumberValidity(digits) {
  const value = normalizeCardNumber(digits);
  if (!value) return "empty";
  if (value.length < 12) return "incomplete";
  return isCardNumberLuhnValid(value) ? "valid" : "invalid";
}

function cardNumberBrand(digits) {
  const value = normalizeCardNumber(digits);
  if (/^4/.test(value)) return "Visa";
  if (/^5[1-5]/.test(value) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(value)) return "Mastercard";
  if (/^3[47]/.test(value)) return "American Express";
  return "";
}

function resolveCardNumberState({ disabled = false, loading = false, error = "", state, value = "", validity = "empty" } = {}) {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  if (state) return state;
  if (validity === "valid") return "valid";
  return value ? "filled" : "default";
}

export const CardNumberInput = forwardRef(function CardNumberInput({
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
  placeholder = "5231 0000 0000 0000",
  validationMessage = "",
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `card-number-input-${generatedId}`;
  const isValueControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const digits = normalizeCardNumber(currentValue);
  const formattedValue = formatCardNumber(digits);
  const validity = cardNumberValidity(digits);
  const brand = cardNumberBrand(digits);
  const resolvedError = error || (validity === "invalid" ? validationMessage : "");
  const resolvedHelper = resolvedError || helper;
  const resolvedState = resolveCardNumberState({ disabled, loading, error: resolvedError, state, value: digits, validity });
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;
  const meta = useMemo(() => ({
    formatted: formattedValue,
    validity,
    brand,
    luhnValid: validity === "valid",
  }), [brand, formattedValue, validity]);

  useEffect(() => {
    if (isValueControlled) setCurrentValue(value ?? "");
  }, [isValueControlled, value]);

  return React.createElement(
    "label",
    {
      className: ["field card-number-input", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      "data-mono": "true",
      "data-validity": validity,
      "data-brand": brand,
      "data-validation-message": validationMessage,
    },
    label ? React.createElement("span", { className: "field__label card-number-input__label", id: `${inputId}-label` }, label) : null,
    React.createElement(
      "span",
      { className: "field__control card-number-input__control" },
      React.createElement("span", { className: "field__icon card-number-input__icon", "aria-hidden": "true" }, "credit_card"),
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        name,
        className: "input card-number-input__input",
        type: "text",
        inputMode: "numeric",
        autoComplete: "cc-number",
        placeholder,
        value: formattedValue,
        disabled: Boolean(disabled || loading),
        required,
        pattern: "[0-9 ]*",
        enterKeyHint: "next",
        spellCheck: false,
        "data-card-number-input": "",
        "aria-labelledby": label ? `${inputId}-label` : undefined,
        "aria-label": label ? undefined : "Card number",
        "aria-describedby": describedBy,
        "aria-invalid": resolvedError ? "true" : undefined,
        onChange: (event) => {
          const nextDigits = normalizeCardNumber(event.target.value);
          const nextFormatted = formatCardNumber(nextDigits);
          const nextValidity = cardNumberValidity(nextDigits);
          const nextBrand = cardNumberBrand(nextDigits);
          if (!isValueControlled) setCurrentValue(nextDigits);
          onValueChange?.(nextDigits, {
            formatted: nextFormatted,
            validity: nextValidity,
            brand: nextBrand,
            luhnValid: nextValidity === "valid",
          });
        },
      }),
      React.createElement(
        "span",
        {
          className: "field__suffix card-number-input__brand",
          "data-card-number-brand": "",
          "aria-hidden": "true",
          hidden: !brand,
        },
        brand,
      ),
      loading ? React.createElement(Spinner, { label: label ? `${label} loading` : "Loading", density, decorative: true, className: "field__icon field__icon--loading" }) : null,
    ),
    resolvedHelper
      ? React.createElement(
        "span",
        {
          className: "field__helper card-number-input__helper",
          id: `${inputId}-helper`,
          "data-card-number-helper": "",
          role: resolvedError ? "alert" : undefined,
        },
        resolvedHelper,
      )
      : null,
  );
});

CardNumberInput.displayName = "CardNumberInput";
CardNumberInput.platformContract = cardNumberInputPlatformContract;
