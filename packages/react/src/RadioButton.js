import React, { forwardRef, useState } from "react";
import { radioButtonPlatformContract } from "@design-system/components/platforms";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["default", "descriptive", "compact", "critical"]);
function normalizeState({ checked, disabled, state, error }) {
    if (disabled)
        return "disabled";
    if (checked)
        return "selected";
    if (state === "error" || error)
        return "error";
    if (state === "focus")
        return "focus";
    return "unselected";
}
export const RadioButton = forwardRef(function RadioButton({ label, description, error, variant = "default", state = "unselected", density, checked, disabled = false, name = "", value = "", required = false, onCheckedChange, className = "", ...rest }, ref) {
    const isCheckedControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(Boolean(checked));
    const currentChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
    const normalizedState = normalizeState({
        checked: currentChecked,
        disabled,
        state,
        ...(error ? { error } : {}),
    });
    const isInvalid = normalizedState === "error" || Boolean(error);
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "default");
    if (!label)
        return null;
    const handleChange = (event) => {
        if (disabled)
            return;
        const nextChecked = event.currentTarget.checked;
        if (!isCheckedControlled)
            setInternalChecked(nextChecked);
        onCheckedChange?.(nextChecked, { value }, event);
    };
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("label", {
        className: ["choice radio", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        "data-checked": String(currentChecked),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(normalizedState),
        ...flowDensityProps(resolvedDensity),
        "data-invalid": isInvalid ? "true" : undefined,
    }, React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        type: "radio",
        className: "choice__input",
        name,
        value,
        checked: currentChecked,
        disabled,
        required,
        "aria-invalid": isInvalid ? "true" : undefined,
        onChange: handleChange,
    }), React.createElement("span", { className: "choice__mark", "aria-hidden": "true" }), React.createElement("span", { className: "choice__text" }, React.createElement("span", { className: "choice__label" }, label), description ? React.createElement("span", { className: "choice__description" }, description) : null, error ? React.createElement("span", { className: "choice__error" }, error) : null));
});
RadioButton.displayName = "RadioButton";
RadioButton.platformContract = radioButtonPlatformContract;
