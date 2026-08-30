import React, { forwardRef, useEffect, useId, useMemo, useRef, useState, } from "react";
import { comboboxPlatformContract } from "#flow/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity, } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";
import { Spinner } from "./Spinner.js";
function optionValue(option) {
    return option.value ?? "";
}
function optionLabel(option) {
    return option.label ?? "";
}
function selectedOptionFor(options, value) {
    return options.find((option) => optionValue(option) === value) ?? null;
}
function normalizeOptions(options) {
    return (Array.isArray(options) ? options : []).filter((option) => (option?.label && option.value !== undefined && option.value !== null && option.value !== ""));
}
function normalizedState({ disabled, loading, state, currentValue, visibleCount, }) {
    if (disabled)
        return "disabled";
    if (loading)
        return "loading";
    if (state === "error")
        return "error";
    if (state === "loading")
        return "loading";
    if (state === "open" || state === "focus")
        return state;
    if (visibleCount === 0 && currentValue)
        return "empty";
    return state ?? (currentValue ? "filled" : "default");
}
function assignInputRef(ref, node) {
    if (typeof ref === "function") {
        ref(node);
        return;
    }
    if (ref) {
        ref.current = node;
    }
}
export const Combobox = forwardRef(function Combobox({ label, helper = "", icon = "search", options, optionsLabel, clearSelectionLabel, value, name = "", placeholder = "", emptyText, loadingText = "Loading results", disabled = false, loading = false, density, state, open: openProp, onValueChange, onOpenChange, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const comboboxId = id ?? `combobox-${generatedId}`;
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
    const isValueControlled = value !== undefined;
    const initialValue = value ?? "";
    const initialOption = selectedOptionFor(normalizedOptions, initialValue);
    const [internalValue, setInternalValue] = useState(initialValue);
    const [inputValue, setInputValue] = useState(initialOption ? optionLabel(initialOption) : initialValue);
    const isOpenControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(state === "open");
    const open = isOpenControlled ? Boolean(openProp) : internalOpen;
    const [activeIndex, setActiveIndex] = useState(null);
    const currentValue = isValueControlled ? value ?? "" : internalValue;
    const selectedOption = selectedOptionFor(normalizedOptions, currentValue);
    const selectedValue = selectedOption ? optionValue(selectedOption) : "";
    const isOpen = Boolean(open) && !disabled;
    const openStateRef = useRef(isOpen);
    openStateRef.current = isOpen;
    const controlledSelectionLabel = selectedOption ? optionLabel(selectedOption) : currentValue;
    const displayInputValue = isValueControlled && (!isOpen || (selectedOption && inputValue === "")) ? controlledSelectionLabel : inputValue;
    const isShowingSelectedValue = Boolean(selectedOption && displayInputValue === optionLabel(selectedOption));
    const query = isShowingSelectedValue ? "" : displayInputValue.trim().toLowerCase();
    const filteredOptions = useMemo(() => normalizedOptions.filter((option) => {
        const haystack = `${optionLabel(option)} ${option.meta ?? ""}`.toLowerCase();
        return !query || haystack.includes(query);
    }), [normalizedOptions, query]);
    const enabledOptions = filteredOptions.filter((option) => !option.disabled);
    const selectedEnabledIndex = selectedOption ? enabledOptions.findIndex((option) => optionValue(option) === selectedValue) : -1;
    const activeOption = activeIndex === null ? null : enabledOptions[activeIndex] ?? null;
    const resolvedState = normalizedState({ disabled, loading, state, currentValue: displayInputValue, visibleCount: filteredOptions.length });
    const isLoading = resolvedState === "loading";
    const resolvedDensity = normalizeFlowDensity(density);
    const fieldMessage = resolveFieldMessage({
        controlId: comboboxId,
        describedBy: rest["aria-describedby"],
        helper,
        state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
    });
    const setOpen = (nextOpen, event) => {
        if (disabled)
            return;
        const normalizedOpen = Boolean(nextOpen);
        if (normalizedOpen === openStateRef.current)
            return;
        openStateRef.current = normalizedOpen;
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        onOpenChange?.(normalizedOpen, event);
    };
    useEffect(() => {
        if (!isOpen)
            return undefined;
        const handleDocumentMouseDown = (event) => {
            const target = event.target;
            if (!(target instanceof Node))
                return;
            if (rootRef.current?.contains(target))
                return;
            setActiveIndex(null);
            setOpen(false, event);
        };
        document.addEventListener("mousedown", handleDocumentMouseDown);
        return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
    });
    if (!label || !normalizedOptions.length)
        return null;
    const commitOption = (option, event) => {
        if (!option || option.disabled)
            return;
        const nextValue = optionValue(option);
        const nextLabel = optionLabel(option);
        if (!isValueControlled)
            setInternalValue(nextValue);
        setInputValue(nextLabel);
        setOpen(false, event);
        setActiveIndex(null);
        onValueChange?.(nextValue, { label: nextLabel, meta: option.meta ?? "", inputValue: nextLabel }, event);
    };
    const clearValue = (event) => {
        event.preventDefault();
        if (!isValueControlled)
            setInternalValue("");
        setInputValue("");
        setOpen(true, event);
        setActiveIndex(null);
        inputRef.current?.focus();
        onValueChange?.("", { label: "", meta: "", inputValue: "", cleared: true }, event);
    };
    const handleInputFocus = (event) => {
        rest.onFocus?.(event);
        if (event.defaultPrevented || disabled)
            return;
        setOpen(true, event);
    };
    const handleInputClick = (event) => {
        rest.onClick?.(event);
        if (event.defaultPrevented || disabled)
            return;
        setOpen(true, event);
    };
    const handleInputKeyDown = (event) => {
        rest.onKeyDown?.(event);
        if (event.defaultPrevented)
            return;
        if (event.key === "Tab") {
            setActiveIndex(null);
            setOpen(false, event);
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true, event);
            setActiveIndex((index) => {
                if (!enabledOptions.length)
                    return null;
                if (index === null)
                    return selectedEnabledIndex >= 0 ? Math.min(enabledOptions.length - 1, selectedEnabledIndex + 1) : 0;
                return Math.min(enabledOptions.length - 1, index + 1);
            });
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true, event);
            setActiveIndex((index) => {
                if (!enabledOptions.length)
                    return null;
                if (index === null)
                    return selectedEnabledIndex >= 0 ? Math.max(0, selectedEnabledIndex - 1) : Math.max(0, enabledOptions.length - 1);
                return Math.max(0, index - 1);
            });
        }
        if (event.key === "Enter") {
            event.preventDefault();
            if (activeOption)
                commitOption(activeOption, event);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, event);
        }
    };
    return React.createElement("label", {
        ref: rootRef,
        className: ["field", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
    }, React.createElement("span", { className: "field__label", id: `${comboboxId}-label` }, label), React.createElement("span", {
        className: "field__control combobox",
        "data-open": String(isOpen),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-value": selectedValue,
        "data-combobox-control": "",
    }, icon ? React.createElement("span", { className: "field__icon combobox__icon", "aria-hidden": "true" }, icon) : null, React.createElement("input", {
        ...flowRestProps(rest),
        ref: (node) => {
            inputRef.current = node;
            assignInputRef(ref, node);
        },
        id: comboboxId,
        className: "input combobox__input",
        name,
        type: "text",
        value: displayInputValue,
        placeholder,
        disabled,
        autoComplete: "off",
        spellCheck: false,
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-expanded": String(isOpen),
        "aria-haspopup": "listbox",
        "aria-controls": `${comboboxId}-listbox`,
        "aria-labelledby": `${comboboxId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        "aria-busy": isLoading ? "true" : undefined,
        "aria-activedescendant": isOpen && activeOption && activeIndex !== null ? `${comboboxId}-option-${normalizedOptions.indexOf(activeOption)}` : undefined,
        onFocus: handleInputFocus,
        onClick: handleInputClick,
        onChange: (event) => {
            const nextValue = event.target.value;
            setInputValue(nextValue);
            if (!isValueControlled)
                setInternalValue(nextValue);
            setOpen(true, event);
            setActiveIndex(null);
            onValueChange?.(nextValue, { label: nextValue, meta: "", inputValue: nextValue }, event);
        },
        onKeyDown: handleInputKeyDown,
    }), clearSelectionLabel ? React.createElement("button", {
        className: "field-action field__action combobox__clear",
        type: "button",
        disabled: disabled || !displayInputValue,
        "aria-label": clearSelectionLabel,
        "data-field-action": "clear",
        "data-combobox-clear": "",
        onClick: clearValue,
    }, React.createElement("span", { className: "field-action__icon", "aria-hidden": "true" }, "close")) : null, isLoading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading combobox__loading-icon" }) : null, React.createElement("span", { className: "select-control__chevron combobox__chevron", "aria-hidden": "true" }, "expand_more"), React.createElement("span", {
        id: `${comboboxId}-listbox`,
        className: "combobox__listbox",
        role: "listbox",
        "data-combobox-listbox": "",
        "aria-label": optionsLabel,
        "aria-labelledby": optionsLabel ? undefined : `${comboboxId}-label`,
    }, filteredOptions.map((option) => {
        const valueKey = optionValue(option);
        const isSelected = valueKey === selectedValue;
        const isActive = activeOption === option;
        const index = normalizedOptions.indexOf(option);
        return React.createElement("span", {
            key: valueKey,
            id: `${comboboxId}-option-${index}`,
            className: "combobox__option",
            role: "option",
            tabIndex: -1,
            "aria-selected": String(isSelected),
            "aria-disabled": option.disabled ? "true" : undefined,
            "data-combobox-option": "",
            "data-selected": String(isSelected),
            "data-active": String(isActive),
            "data-value": valueKey,
            "data-label": optionLabel(option),
            "data-meta": option.meta || undefined,
            "data-disabled": option.disabled ? "true" : undefined,
            onMouseDown: (event) => event.preventDefault(),
            onClick: option.disabled ? undefined : (event) => {
                event.preventDefault();
                commitOption(option, event);
            },
        }, React.createElement("span", { className: "combobox__option-label" }, optionLabel(option)), option.meta ? React.createElement("span", { className: "combobox__option-meta" }, option.meta) : null, React.createElement("span", { className: "combobox__option-check", "aria-hidden": "true" }, isSelected ? "check" : ""));
    }), isLoading ? React.createElement("span", { className: "combobox__loading", "data-combobox-loading": "", role: "status" }, loadingText) : null, emptyText ? React.createElement("span", { className: "combobox__empty", "data-combobox-empty": "", role: "status", hidden: filteredOptions.length > 0 }, emptyText) : null)), fieldMessage.message ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message) : null);
});
Combobox.displayName = "Combobox";
Combobox.platformContract = comboboxPlatformContract;
