import React, { forwardRef, useMemo, useState, } from "react";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { InlineValidation } from "../InlineValidation.js";
import { Surface } from "../Surface.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeOptions(options) {
    return (Array.isArray(options) ? options : []).filter((option) => Boolean(option?.label));
}
function optionValue(option) {
    return String(option.value ?? option.key ?? option.label);
}
function selectedSet(value) {
    return new Set((Array.isArray(value) ? value : []).filter((item) => item !== undefined && item !== null).map(String));
}
function resolveState({ disabled, loading, invalid, selectedCount, optionCount, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (invalid || state === "invalid")
        return "invalid";
    if (!selectedCount)
        return state ?? "none-selected";
    if (selectedCount === optionCount)
        return state ?? "all-selected";
    return state ?? "partial";
}
function coerceCheckboxEvent(event) {
    return event;
}
export const CheckboxGroup = forwardRef(function CheckboxGroup({ label, helper, density, state, disabled = false, loading = false, required = false, options = [], value, defaultValue = [], selectAllLabel, clearLabel, applyAction, validation, className = "", onValueChange, onApply, onClear, ...rest }, ref) {
    const controlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = controlled ? value : internalValue;
    const normalizedOptions = normalizeOptions(options);
    const enabledOptions = normalizedOptions.filter((option) => !option.disabled);
    const selectedValues = useMemo(() => selectedSet(currentValue), [currentValue]);
    const enabledValues = enabledOptions.map(optionValue);
    const selectedEnabledCount = enabledValues.filter((item) => selectedValues.has(item)).length;
    const invalid = Boolean(validation?.message) || (required && selectedValues.size === 0);
    const resolvedState = resolveState({
        disabled,
        loading,
        invalid,
        selectedCount: selectedEnabledCount,
        optionCount: enabledValues.length,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
    if (!label)
        return null;
    const commitValue = (nextValues, meta, event) => {
        if (!controlled)
            setInternalValue(nextValues);
        onValueChange?.(nextValues, meta, event);
    };
    const updateOption = (nextValue, checked, event) => {
        const nextValues = new Set(selectedValues);
        if (checked)
            nextValues.add(nextValue);
        else
            nextValues.delete(nextValue);
        commitValue([...nextValues], { value: nextValue, checked }, coerceCheckboxEvent(event));
    };
    const toggleAll = (checked, _meta, event) => {
        const nextValues = new Set(selectedValues);
        if (checked)
            enabledValues.forEach((item) => nextValues.add(item));
        else
            enabledValues.forEach((item) => nextValues.delete(item));
        commitValue([...nextValues], { value: "__all", checked, indeterminate: false }, coerceCheckboxEvent(event));
    };
    const clear = (event) => {
        onClear?.(event);
        if (event.defaultPrevented)
            return;
        commitValue([], { value: "__clear", checked: false, cleared: true }, event);
    };
    return React.createElement(Surface, {
        ref,
        surfaceRole: "section",
        state: isDisabled ? "disabled" : invalid ? "selected" : "default",
        density,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": loading ? "true" : undefined,
        "data-flow-pattern": "checkbox-group",
        "data-flow-slot": "groupSurface",
        "data-state": resolvedState,
        "data-selected-count": String(selectedValues.size),
        ...sanitizeRestProps(rest),
    }, React.createElement("div", { "data-flow-slot": "question" }, React.createElement("h3", null, label), helper ? React.createElement("p", null, helper) : null), selectAllLabel
        ? React.createElement(Checkbox, {
            label: selectAllLabel,
            checked: enabledValues.length > 0 && selectedEnabledCount === enabledValues.length,
            indeterminate: selectedEnabledCount > 0 && selectedEnabledCount < enabledValues.length,
            disabled: isDisabled || !enabledValues.length,
            density,
            variant: "select-all",
            state: selectedEnabledCount > 0 && selectedEnabledCount < enabledValues.length ? "indeterminate" : undefined,
            onCheckedChange: toggleAll,
        })
        : null, normalizedOptions.map((option) => {
        const nextValue = optionValue(option);
        return React.createElement(Checkbox, {
            key: nextValue,
            label: option.label,
            description: option.description ?? option.meta,
            value: nextValue,
            checked: selectedValues.has(nextValue),
            disabled: isDisabled || option.disabled,
            density,
            required,
            variant: option.variant ?? "default",
            state: selectedValues.has(nextValue) ? "checked" : "unchecked",
            onCheckedChange: (checked, _meta, event) => updateOption(nextValue, checked, event),
        });
    }), validation?.message
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            state: validation.state ?? "error",
            density,
            live: validation.live,
        })
        : null, clearLabel || applyAction?.label
        ? React.createElement("div", { "data-flow-slot": "actions" }, clearLabel ? React.createElement(Button, { label: clearLabel, variant: "ghost", density, disabled: isDisabled || selectedValues.size === 0, onClick: clear }) : null, applyAction?.label
            ? React.createElement(Button, {
                ...applyAction,
                label: applyAction.label,
                density: applyAction.density ?? density,
                disabled: isDisabled || applyAction.disabled,
                onClick: (event) => {
                    applyAction.onClick?.(event);
                    if (event.defaultPrevented)
                        return;
                    onApply?.([...selectedValues], event);
                },
            })
            : null)
        : null);
});
CheckboxGroup.displayName = "CheckboxGroup";
