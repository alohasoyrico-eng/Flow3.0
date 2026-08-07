import React, { forwardRef, useEffect, useId, useState } from "react";
import { inputPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["text", "email", "password", "number", "currency", "unit", "search"]);
const numericVariants = new Set(["number", "currency", "unit"]);

function resolveInputState({ disabled = false, loading = false, error = "", state, value = "" } = {}) {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  return state ?? (value ? "filled" : "default");
}

function typeForVariant(variant, type) {
  if (variant === "email") return "email";
  if (variant === "password") return "password";
  if (variant === "search") return "search";
  if (numericVariants.has(variant)) return "text";
  return type || "text";
}

function inputModeForVariant(variant) {
  if (variant === "email") return "email";
  if (numericVariants.has(variant)) return "decimal";
  if (variant === "search") return "search";
  return undefined;
}

function autocompleteForVariant(variant) {
  if (variant === "email") return "email";
  if (variant === "password") return "current-password";
  if (variant === "search") return "off";
  return undefined;
}

function formatValue(value, variant) {
  const stringValue = value == null ? "" : String(value);
  if (!stringValue || variant !== "currency") return stringValue;
  const numeric = Number(stringValue.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) return stringValue;
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

function normalizeValue(value, variant) {
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

export const Input = forwardRef(function Input({
  label,
  helper = "",
  helperText,
  error = "",
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
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "text");
  const resolvedType = typeForVariant(resolvedVariant, type);
  const isRevealable = Boolean(revealable) || resolvedVariant === "password" || resolvedType === "password";
  const isValueControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [revealed, setRevealed] = useState(false);
  const resolvedState = resolveInputState({ disabled, loading, error, state, value: currentValue });
  const resolvedHelper = error || helperText || helper;
  const isDisabled = Boolean(disabled) || Boolean(loading);
  const resolvedAlign = align === "end" || (align === "start" && numericVariants.has(resolvedVariant)) ? "end" : "start";
  const describedBy = [resolvedHelper ? `${inputId}-helper` : "", rest["aria-describedby"]].filter(Boolean).join(" ") || undefined;
  const inputType = isRevealable && revealed ? "text" : resolvedType;

  useEffect(() => {
    if (isValueControlled) setCurrentValue(value ?? "");
  }, [isValueControlled, value]);

  const handleChange = (event) => {
    const meta = normalizeValue(event.target.value, resolvedVariant);
    if (!isValueControlled) setCurrentValue(meta.value);
    onValueChange?.(meta.value, meta);
  };

  return React.createElement(
    "label",
    {
      className: ["field", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      ...flowVariantProps(resolvedVariant),
      "data-mono": mono ? "true" : undefined,
      "data-align": resolvedAlign === "end" ? "end" : undefined,
    },
    label ? React.createElement("span", { className: "field__label", id: `${inputId}-label` }, label) : null,
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
        value: formatValue(currentValue, resolvedVariant),
        placeholder,
        disabled: isDisabled,
        required,
        inputMode: inputMode || inputModeForVariant(resolvedVariant),
        autoComplete: autocomplete || autocompleteForVariant(resolvedVariant),
        "aria-labelledby": label ? `${inputId}-label` : undefined,
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : rest["aria-invalid"],
        onChange: handleChange,
      }),
      suffix
        ? React.createElement("span", { className: "field__suffix", "aria-hidden": "true" }, suffix)
        : null,
      isRevealable
        ? React.createElement(
          "button",
          {
            className: "field-action field__action",
            type: "button",
            disabled: isDisabled,
            "aria-label": revealed ? "Hide value" : "Show value",
            "aria-pressed": String(revealed),
            "data-field-action": "reveal",
            onClick: () => setRevealed((current) => !current),
          },
          React.createElement("span", { className: "field-action__icon", "aria-hidden": "true" }, revealed ? "visibility_off" : "visibility"),
        )
        : null,
      loading ? React.createElement(Spinner, { label: label ? `${label} loading` : "Loading", density, decorative: true, className: "field__icon field__icon--loading" }) : null,
    ),
    resolvedHelper
      ? React.createElement("span", { className: "field__helper", id: `${inputId}-helper`, role: error ? "alert" : undefined }, resolvedHelper)
      : null,
  );
});

Input.displayName = "Input";
Input.platformContract = inputPlatformContract;
