import React, { forwardRef, useMemo, useId, useState, } from "react";
import { inputAmountPlatformContract } from "#flow/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";
const validStates = new Set(["default", "filled", "loading", "error", "disabled"]);
function localeSeparators(locale) {
    const parts = new Intl.NumberFormat(locale, { minimumFractionDigits: 2 }).formatToParts(1234.5);
    return {
        group: parts.find((part) => part.type === "group")?.value ?? ",",
        decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    };
}
function normalizeAmount(value, locale) {
    const { group, decimal } = localeSeparators(locale);
    const normalized = String(value ?? "")
        .split(group).join("")
        .split(decimal).join(".")
        .replace(/[^\d.-]/g, "");
    return normalized;
}
function amountMeta(value, currency, locale) {
    const normalized = normalizeAmount(value, locale);
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
function formatAmountDisplay(value, currency, locale) {
    const meta = amountMeta(value, currency, locale);
    return meta.numericValue !== null
        ? new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(meta.numericValue)
        : "";
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
export const InputAmount = forwardRef(function InputAmount({ label, value, helper = "", helperText, error = "", disabled = false, loading = false, required = false, density, state, name = "", placeholder = "", currency = "MXN", locale, prefix, suffix = "", validationMessage, onValueChange, onFocus, onBlur, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? `input-amount-${generatedId}`;
    const resolvedCurrency = String(currency || "MXN").toUpperCase();
    const isValueControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(value ?? "");
    const [draftValue, setDraftValue] = useState(null);
    const currentValue = isValueControlled ? value ?? "" : internalValue;
    const normalizedValue = normalizeAmount(currentValue, locale);
    const controlledSignature = `${String(value ?? "")}::${resolvedCurrency}::${JSON.stringify(locale ?? "")}`;
    const activeDraftValue = draftValue && (!isValueControlled || draftValue.controlledSignature === controlledSignature) ? draftValue.value : null;
    const displayValue = useMemo(() => activeDraftValue ?? formatAmountDisplay(currentValue, resolvedCurrency, locale), [currentValue, activeDraftValue, locale, resolvedCurrency]);
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
        value: displayValue,
        disabled: Boolean(disabled || loading),
        required,
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        onChange: (event) => {
            const meta = amountMeta(event.target.value, resolvedCurrency, locale);
            setDraftValue({ value: event.target.value, controlledSignature });
            if (!isValueControlled)
                setInternalValue(meta.value);
            onValueChange?.(meta.value, meta, event);
        },
        onFocus: (event) => {
            setDraftValue({ value: event.currentTarget.value, controlledSignature });
            onFocus?.(event);
        },
        onBlur: (event) => {
            setDraftValue(null);
            onBlur?.(event);
        },
    }), suffix
        ? React.createElement("span", { className: "field__suffix input-amount__suffix", "aria-hidden": "true" }, suffix)
        : null, loading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading" }) : null), fieldMessage.message
        ? React.createElement("span", {
            className: "field__helper input-amount__helper",
            id: fieldMessage.messageId,
            role: fieldMessage.role,
            ...flowStateProps(fieldMessage.state),
        }, fieldMessage.message)
        : null);
});
InputAmount.displayName = "InputAmount";
InputAmount.platformContract = inputAmountPlatformContract;
