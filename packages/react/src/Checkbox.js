import React, { forwardRef, useEffect, useRef, useState } from "react";
import { checkboxPlatformContract } from "@design-system/components/platforms";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["default", "descriptive", "select-all", "compact"]);
function normalizeState({ checked, indeterminate, disabled, state, error }) {
    if (disabled)
        return "disabled";
    if (indeterminate)
        return "indeterminate";
    if (checked)
        return "checked";
    if (state === "error" || error)
        return "error";
    if (state === "focus")
        return "focus";
    return "unchecked";
}
export const Checkbox = forwardRef(function Checkbox({ label, description, error, variant = "default", state = "unchecked", density, checked, indeterminate = false, disabled = false, name = "", value = "on", required = false, onCheckedChange, className = "", ...rest }, ref) {
    const isCheckedControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(Boolean(checked));
    const [currentIndeterminate, setCurrentIndeterminate] = useState(Boolean(indeterminate));
    const currentChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
    const inputRef = useRef(null);
    const normalizedState = normalizeState({
        checked: currentChecked,
        indeterminate: currentIndeterminate,
        disabled,
        state,
        ...(error ? { error } : {}),
    });
    const isInvalid = normalizedState === "error" || Boolean(error);
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "default");
    if (!label)
        return null;
    useEffect(() => {
        if (inputRef.current)
            inputRef.current.indeterminate = currentIndeterminate;
    }, [currentIndeterminate]);
    const assignRef = (node) => {
        inputRef.current = node;
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    };
    const handleChange = (event) => {
        if (disabled)
            return;
        const nextChecked = event.currentTarget.checked;
        setCurrentIndeterminate(false);
        if (!isCheckedControlled)
            setInternalChecked(nextChecked);
        onCheckedChange?.(nextChecked, { indeterminate: false, value }, event);
    };
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("label", {
        className: ["choice checkbox", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        "data-checked": String(currentChecked),
        "data-indeterminate": String(currentIndeterminate),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(normalizedState),
        ...flowDensityProps(resolvedDensity),
        "data-invalid": isInvalid ? "true" : undefined,
    }, React.createElement("input", {
        ...flowRestProps(rest),
        ref: assignRef,
        type: "checkbox",
        className: "choice__input",
        name,
        value,
        checked: currentChecked,
        disabled,
        required,
        "aria-checked": currentIndeterminate ? "mixed" : String(currentChecked),
        "aria-invalid": isInvalid ? "true" : undefined,
        onChange: handleChange,
    }), React.createElement("span", { className: "choice__mark", "aria-hidden": "true" }, React.createElement("span", { className: "choice__indicator material-symbol" }, currentIndeterminate ? "remove" : "check")), React.createElement("span", { className: "choice__text" }, React.createElement("span", { className: "choice__label" }, label), description ? React.createElement("span", { className: "choice__description" }, description) : null, error ? React.createElement("span", { className: "choice__error" }, error) : null));
});
Checkbox.displayName = "Checkbox";
Checkbox.platformContract = checkboxPlatformContract;
