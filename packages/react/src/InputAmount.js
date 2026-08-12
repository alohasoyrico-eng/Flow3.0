import React, { forwardRef, useId, useState, } from "react";
import { inputAmountPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
const validStates = new Set(["default", "filled", "loading", "error", "disabled"]);
function normalizeAmount(value) {
    const normalized = String(value ?? "").replace(/[^\d.,-]/g, "").replace(/,/g, "");
    return normalized;
}
function amountMeta(value, currency, locale) {
    const normalized = normalizeAmount(value);
    const numericValue = normalized === "" || normalized === "-" ? null : Number(normalized);
    const finiteNumericValue = typeof numericValue === "number" && Number.isFinite(numericValue) ? numericValue : null;
    const formatOptions = {
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
function resolveAmountState({ disabled = false, loading = false, error = "", state, value = "" } = {}) {
    if (disabled)
        return "disabled";
    if (loading)
        return "loading";
    if (error)
        return "error";
    if (state && validStates.has(state))
        return state;
    return value ? "filled" : "default";
}
export const InputAmount = forwardRef(function InputAmount({ label, value, helper = "", helperText, error = "", disabled = false, loading = false, required = false, density, state, name = "", placeholder = "", currency = "MXN", locale, prefix, suffix = "", validationMessage, onValueChange, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? `input-amount-${generatedId}`;
    const resolvedCurrency = String(currency || "MXN").toUpperCase();
    const isValueControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(value ?? "");
    const currentValue = isValueControlled ? value ?? "" : internalValue;
    const normalizedValue = normalizeAmount(currentValue);
    const resolvedError = error || validationMessage || "";
    const resolvedHelper = resolvedError || helperText || helper;
    const resolvedState = resolveAmountState({ disabled, loading, error: resolvedError, ...(state !== undefined ? { state } : {}), value: normalizedValue });
    const resolvedDensity = normalizeFlowDensity(density);
    const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;
    if (!label)
        return null;
    return React.createElement("label", {
        className: ["field input-amount", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-mono": "true",
        "data-align": "end",
        "data-currency": resolvedCurrency,
    }, React.createElement("span", { className: "field__label input-amount__label", id: `${inputId}-label` }, label), React.createElement("span", { className: "field__control input-amount__control" }, React.createElement("span", { className: "field__prefix input-amount__currency", "aria-hidden": "true" }, prefix || resolvedCurrency), React.createElement("input", {
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
        "aria-describedby": describedBy,
        "aria-invalid": resolvedError ? "true" : undefined,
        onChange: (event) => {
            const meta = amountMeta(event.target.value, resolvedCurrency, locale);
            if (!isValueControlled)
                setInternalValue(meta.value);
            onValueChange?.(meta.value, meta, event);
        },
    }), suffix
        ? React.createElement("span", { className: "field__suffix input-amount__suffix", "aria-hidden": "true" }, suffix)
        : null, loading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading" }) : null), resolvedHelper
        ? React.createElement("span", {
            className: "field__helper input-amount__helper",
            id: `${inputId}-helper`,
            role: resolvedError ? "alert" : undefined,
        }, resolvedHelper)
        : null);
});
InputAmount.displayName = "InputAmount";
InputAmount.platformContract = inputAmountPlatformContract;
