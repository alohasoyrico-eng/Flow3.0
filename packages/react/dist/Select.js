import React, { forwardRef, useId, useState, } from "react";
import { selectPlatformContract } from "#flow/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity, } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";
function selectedOptionFor(options, value) {
    if (!value)
        return null;
    return options.find((option) => option.value === value) ?? null;
}
function normalizeOptions(options) {
    return (Array.isArray(options) ? options : []).filter((option) => (option?.label && option.value !== undefined && option.value !== null && option.value !== ""));
}
export const Select = forwardRef(function Select({ label, helper = "", icon = "", options, optionsLabel, value, name = "", disabled = false, density, variant = "default", state = "default", open: openProp, onValueChange, onOpenChange, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const selectId = id ?? `select-${generatedId}`;
    const normalizedOptions = normalizeOptions(options);
    const isValueControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(value ?? "");
    const currentValue = isValueControlled ? value ?? "" : internalValue;
    const isOpenControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(state === "open");
    const open = isOpenControlled ? Boolean(openProp) : internalOpen;
    const selectedOption = selectedOptionFor(normalizedOptions, currentValue);
    const selectedValue = selectedOption ? selectedOption.value : "";
    const selectedLabel = selectedOption ? selectedOption.label : "";
    const isOpen = open;
    const resolvedState = disabled ? "disabled" : state || "default";
    const activeIndex = selectedOption ? Math.max(normalizedOptions.indexOf(selectedOption), 0) : 0;
    const fieldMessage = resolveFieldMessage({
        controlId: selectId,
        describedBy: rest["aria-describedby"],
        helper,
        state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
    });
    if (!label || !normalizedOptions.length)
        return null;
    const setOpen = (nextOpen, event) => {
        if (disabled)
            return;
        const normalizedOpen = Boolean(nextOpen);
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        onOpenChange?.(normalizedOpen, event);
    };
    const commitOption = (option, event) => {
        if (option.disabled)
            return;
        const optionValue = option.value ?? "";
        if (!isValueControlled)
            setInternalValue(optionValue);
        setOpen(false, event);
        onValueChange?.(optionValue, { label: option.label, meta: option.meta ?? "" }, event);
    };
    const handleTriggerClick = (event) => {
        rest.onClick?.(event);
        if (event.defaultPrevented)
            return;
        setOpen(!open, event);
    };
    const handleTriggerKeyDown = (event) => {
        rest.onKeyDown?.(event);
        if (event.defaultPrevented)
            return;
        if (["ArrowDown", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            setOpen(true, event);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, event);
        }
    };
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("span", {
        className: ["field", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        role: "group",
        "aria-labelledby": `${selectId}-label`,
    }, React.createElement("span", { className: "field__label", id: `${selectId}-label` }, label), React.createElement("span", {
        className: ["select-control", variant === "inline" ? "select-control--inline" : ""].filter(Boolean).join(" "),
        "data-open": String(isOpen),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-value": selectedValue,
        "data-select-control": "",
    }, React.createElement("button", {
        ...flowRestProps(rest),
        ref,
        type: "button",
        className: "select-control__trigger",
        disabled,
        "data-select-trigger": "",
        role: "combobox",
        "aria-expanded": String(isOpen),
        "aria-haspopup": "listbox",
        "aria-controls": `${selectId}-listbox`,
        "aria-labelledby": `${selectId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        "aria-activedescendant": selectedOption ? `${selectId}-option-${activeIndex}` : undefined,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
    }, icon ? React.createElement("span", { className: "select-control__icon", "aria-hidden": "true" }, icon) : null, selectedLabel ? React.createElement("span", { className: "select-control__value", "data-select-value-label": "" }, selectedLabel) : null, selectedOption?.meta ? React.createElement("span", { className: "select-control__option-code", "data-select-value-meta": "" }, selectedOption.meta) : null, React.createElement("span", { className: "select-control__chevron", "aria-hidden": "true" }, "expand_more")), React.createElement("span", {
        id: `${selectId}-listbox`,
        className: "select-control__listbox",
        role: "listbox",
        "data-select-listbox": "",
        "aria-label": optionsLabel,
        "aria-labelledby": optionsLabel ? undefined : `${selectId}-label`,
    }, normalizedOptions.map((option, index) => {
        const optionValue = option.value;
        const isSelected = optionValue === selectedValue;
        return React.createElement("span", {
            key: optionValue,
            id: `${selectId}-option-${index}`,
            className: "select-control__option",
            role: "option",
            tabIndex: -1,
            "aria-selected": String(isSelected),
            "aria-disabled": option.disabled ? "true" : undefined,
            "data-select-option": "",
            "data-selected": String(isSelected),
            "data-value": optionValue,
            "data-label": option.label,
            "data-meta": option.meta || undefined,
            "data-disabled": option.disabled ? "true" : undefined,
            onClick: option.disabled ? undefined : (event) => commitOption(option, event),
            onKeyDown: (event) => {
                if (option.disabled)
                    return;
                if (["Enter", " "].includes(event.key)) {
                    event.preventDefault();
                    commitOption(option, event);
                }
                if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false, event);
                }
            },
        }, React.createElement("span", { className: "select-control__option-label" }, option.label), option.meta ? React.createElement("span", { className: "select-control__option-code" }, option.meta) : null);
    })), name ? React.createElement("input", { type: "hidden", name, value: selectedValue, "data-select-input": "", readOnly: true }) : null), fieldMessage.message ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message) : null);
});
Select.displayName = "Select";
Select.platformContract = selectPlatformContract;
