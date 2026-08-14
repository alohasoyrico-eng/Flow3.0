/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useId, useState, } from "react";
import { codeInputPlatformContract } from "@design-system/components/platforms";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["sms", "otp", "approval", "masked", "compact"]);
const validStates = new Set(["default", "hover", "focus", "complete", "warning", "error", "disabled"]);
function normalizeCodeValue(value, length = 6) {
    return String(value ?? "").replace(/\D/g, "").slice(0, Number(length));
}
function resolveCodeInputState({ disabled = false, error = "", state, value = "", length = 6 } = {}) {
    if (disabled)
        return "disabled";
    if (error)
        return "error";
    if (state && state !== "default")
        return normalizeFlowValue(state, validStates, "default");
    return value.length === Number(length) && value ? "complete" : "default";
}
function codeMeta(value, length) {
    return {
        value,
        length: Number(length),
        complete: value.length === Number(length),
    };
}
export const CodeInput = forwardRef(function CodeInput({ label, value, length = 6, variant = "sms", masked = false, helper = "", disabled = false, state, density, error = "", onValueChange, onComplete, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const inputId = id ?? `code-input-${generatedId}`;
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "sms");
    const resolvedLength = Math.max(1, Number(length) || 6);
    const isValueControlled = value !== undefined;
    const [focused, setFocused] = useState(state === "focus");
    const [internalValue, setInternalValue] = useState(normalizeCodeValue(value ?? "", resolvedLength));
    const currentValue = isValueControlled ? normalizeCodeValue(value ?? "", resolvedLength) : internalValue;
    const digits = normalizeCodeValue(currentValue, resolvedLength);
    const resolvedState = resolveCodeInputState({ disabled, error, ...(state !== undefined ? { state } : {}), value: digits, length: resolvedLength });
    const resolvedHelper = error || helper;
    const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;
    const isMasked = Boolean(masked) || resolvedVariant === "masked";
    const activeIndex = Math.min(digits.length, Math.max(resolvedLength - 1, 0));
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    return React.createElement("label", {
        className: ["field code-input", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        ...flowVariantProps(resolvedVariant),
        "data-masked": isMasked ? "true" : undefined,
        "data-focused": focused ? "true" : "false",
        "data-length": String(resolvedLength),
    }, React.createElement("span", { className: "field__label", id: `${inputId}-label` }, label), React.createElement("span", { className: "code-input__control" }, React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        className: "code-input__input",
        type: "text",
        inputMode: "numeric",
        autoComplete: "one-time-code",
        pattern: "[0-9]*",
        maxLength: resolvedLength,
        value: digits,
        disabled: Boolean(disabled),
        "data-code-input": "",
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : undefined,
        onFocus: (event) => {
            rest.onFocus?.(event);
            if (event.defaultPrevented)
                return;
            setFocused(true);
        },
        onBlur: (event) => {
            rest.onBlur?.(event);
            if (event.defaultPrevented)
                return;
            setFocused(false);
        },
        onChange: (event) => {
            const nextValue = normalizeCodeValue(event.target.value, resolvedLength);
            if (!isValueControlled)
                setInternalValue(nextValue);
            const nextMeta = codeMeta(nextValue, resolvedLength);
            onValueChange?.(nextValue, nextMeta, event);
            if (nextMeta.complete)
                onComplete?.(nextValue, nextMeta, event);
        },
    }), React.createElement("span", { className: "code-input__slots", "aria-hidden": "true" }, Array.from({ length: resolvedLength }, (_, index) => {
        const digit = digits[index] ?? "";
        const isActive = focused && index === activeIndex && !disabled;
        return React.createElement("span", {
            className: "code-input__slot",
            "data-code-slot": "",
            "data-filled": String(Boolean(digit)),
            "data-active": String(isActive),
            key: index,
        }, digit
            ? React.createElement("span", { className: "code-input__digit" }, digit)
            : isActive
                ? React.createElement("span", { className: "code-input__caret" })
                : null);
    }))), resolvedHelper
        ? React.createElement("span", { className: "field__helper", id: `${inputId}-helper`, role: error ? "alert" : undefined }, resolvedHelper)
        : null);
});
CodeInput.displayName = "CodeInput";
CodeInput.platformContract = codeInputPlatformContract;
