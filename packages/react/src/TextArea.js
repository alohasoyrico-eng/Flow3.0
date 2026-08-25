/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useId, useState } from "react";
import { textAreaPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";
function resolveState({ disabled = false, loading = false, error = "", state, value = "" } = {}) {
    if (disabled)
        return "disabled";
    if (loading)
        return "loading";
    if (error)
        return "error";
    return state ?? (value ? "filled" : "default");
}
export const TextArea = forwardRef(function TextArea({ label, helper = "", helperText, error = "", value, name = "", placeholder = "", disabled = false, loading = false, required = false, rows = 3, maxLength, density, state, onValueChange, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const textAreaId = id ?? `text-area-${generatedId}`;
    const isValueControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(value ?? "");
    const currentValue = isValueControlled ? value ?? "" : internalValue;
    const resolvedState = resolveState({ disabled, loading, error, ...(state ? { state } : {}), value: currentValue });
    const isDisabled = Boolean(disabled) || Boolean(loading);
    const counterId = maxLength != null ? `${textAreaId}-counter` : "";
    const counterMaxLength = maxLength == null ? undefined : Number(maxLength);
    const counterLength = String(currentValue ?? "").length;
    const counterDisplayLength = counterMaxLength == null ? counterLength : Math.min(counterLength, counterMaxLength);
    const counterState = counterMaxLength == null
        ? undefined
        : counterLength >= counterMaxLength
            ? "limit"
            : counterLength >= Math.ceil(counterMaxLength * 0.9)
                ? "warning"
                : "default";
    const fieldMessage = resolveFieldMessage({
        controlId: textAreaId,
        describedBy: [counterId, rest["aria-describedby"]].filter(Boolean).join(" ") || undefined,
        error,
        helper,
        helperText,
        state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
    });
    const counterText = counterMaxLength != null ? `${counterDisplayLength}/${counterMaxLength}` : "";
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    const handleChange = (event) => {
        if (isDisabled)
            return;
        const nextValue = event.target.value;
        const meta = {
            ...(maxLength == null ? {} : { maxLength: Number(maxLength) }),
            length: String(nextValue).length,
        };
        if (!isValueControlled)
            setInternalValue(nextValue);
        onValueChange?.(nextValue, meta, event);
    };
    return React.createElement("label", {
        className: ["field", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
    }, React.createElement("span", { className: "field__label", id: `${textAreaId}-label` }, label), React.createElement("span", { className: "text-area__surface", "data-has-counter": maxLength != null ? "true" : undefined }, React.createElement("textarea", {
        ...flowRestProps(rest),
        ref,
        id: textAreaId,
        className: "text-area",
        name,
        value: currentValue,
        placeholder,
        disabled: isDisabled,
        required,
        rows,
        maxLength: counterMaxLength,
        "aria-labelledby": `${textAreaId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        onChange: handleChange,
    }), counterMaxLength != null ? React.createElement("span", { className: "text-area__counter", id: counterId, "data-limit-state": counterState, "data-text-area-counter": "" }, counterText) : null), fieldMessage.message ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message) : null);
});
TextArea.displayName = "TextArea";
TextArea.platformContract = textAreaPlatformContract;
