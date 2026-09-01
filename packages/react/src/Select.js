/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useEffect, useId, useMemo, useRef, useState, } from "react";
import { selectPlatformContract } from "@design-system/components/platforms";
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
function firstEnabledIndex(options) {
    const index = options.findIndex((option) => !option.disabled);
    return index >= 0 ? index : null;
}
function nextEnabledIndex(options, currentIndex, direction) {
    if (!options.length)
        return null;
    if (currentIndex === null) {
        return direction === 1 ? firstEnabledIndex(options) : lastEnabledIndex(options);
    }
    const startIndex = Math.min(Math.max(currentIndex, 0), options.length - 1);
    for (let offset = 1; offset <= options.length; offset += 1) {
        const index = (startIndex + direction * offset + options.length) % options.length;
        if (!options[index]?.disabled)
            return index;
    }
    return startIndex;
}
function lastEnabledIndex(options) {
    for (let index = options.length - 1; index >= 0; index -= 1) {
        if (!options[index]?.disabled)
            return index;
    }
    return firstEnabledIndex(options);
}
function optionValue(option) {
    return option.value ?? "";
}
function optionLabel(option) {
    return option.label ?? "";
}
function assignSearchInputRef(ref, node) {
    if (typeof ref === "function") {
        ref(node);
        return;
    }
    if (ref) {
        ref.current = node;
    }
}
export const Select = forwardRef(function Select({ label, helper = "", icon = "", options, optionsLabel, value, name = "", placeholder = "", searchable = false, clearable = false, clearSelectionLabel = "Clear selection", emptyText, loadingText = "Loading options", disabled = false, loading = false, density, variant = "default", state = "default", open: openProp, onValueChange, onOpenChange, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const selectId = id ?? `select-${generatedId}`;
    const rootRef = useRef(null);
    const searchInputRef = useRef(null);
    const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
    const isValueControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(value ?? "");
    const currentValue = isValueControlled ? value ?? "" : internalValue;
    const isOpenControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(state === "open");
    const open = isOpenControlled ? Boolean(openProp) : internalOpen;
    const selectedOption = selectedOptionFor(normalizedOptions, currentValue);
    const selectedValue = selectedOption ? selectedOption.value : "";
    const selectedLabel = selectedOption ? selectedOption.label : "";
    const [inputValue, setInputValue] = useState(selectedLabel || currentValue);
    const searchValue = isValueControlled && !open && selectedOption ? selectedLabel : inputValue;
    const isShowingSelectedValue = Boolean(searchable && selectedOption && searchValue === selectedLabel);
    const query = searchable && !isShowingSelectedValue ? searchValue.trim().toLowerCase() : "";
    const visibleOptions = useMemo(() => normalizedOptions.filter((option) => {
        if (!query)
            return true;
        const haystack = `${optionLabel(option)} ${option.meta ?? ""}`.toLowerCase();
        return haystack.includes(query);
    }), [normalizedOptions, query]);
    const isOpen = open;
    const openStateRef = useRef(isOpen);
    openStateRef.current = isOpen;
    const resolvedState = disabled
        ? "disabled"
        : loading || state === "loading"
            ? "loading"
            : state === "empty" || (searchable && Boolean(searchValue) && visibleOptions.length === 0)
                ? "empty"
                : state || "default";
    const isLoading = resolvedState === "loading";
    const [activeIndex, setActiveIndex] = useState(null);
    const enabledVisibleOptions = visibleOptions.filter((option) => !option.disabled);
    const selectedEnabledIndex = selectedOption ? enabledVisibleOptions.findIndex((option) => optionValue(option) === selectedValue) : -1;
    const activeOptionCandidate = activeIndex !== null
        ? searchable
            ? enabledVisibleOptions[activeIndex] ?? null
            : normalizedOptions[activeIndex] ?? null
        : null;
    const activeOption = activeOptionCandidate && !activeOptionCandidate.disabled ? activeOptionCandidate : null;
    useEffect(() => {
        if (!searchable || !isValueControlled)
            return;
        setInputValue(selectedLabel || currentValue);
    }, [currentValue, isValueControlled, searchable, selectedLabel]);
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
    const commitOption = (option, event) => {
        if (option.disabled)
            return;
        const optionValue = option.value ?? "";
        const optionLabel = option.label;
        if (!isValueControlled)
            setInternalValue(optionValue);
        if (searchable)
            setInputValue(optionLabel);
        setActiveIndex(null);
        setOpen(false, event);
        onValueChange?.(optionValue, searchable ? { label: optionLabel, meta: option.meta ?? "", inputValue: optionLabel } : { label: optionLabel, meta: option.meta ?? "" }, event);
    };
    const clearValue = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isValueControlled)
            setInternalValue("");
        setInputValue("");
        setActiveIndex(null);
        setOpen(searchable, event);
        searchInputRef.current?.focus();
        onValueChange?.("", { label: "", meta: "", inputValue: "", cleared: true }, event);
    };
    const handleTriggerClick = (event) => {
        rest.onClick?.(event);
        if (event.defaultPrevented)
            return;
        setOpen(!open, event);
        if (!open)
            setActiveIndex(null);
    };
    const handleTriggerKeyDown = (event) => {
        rest.onKeyDown?.(event);
        if (event.defaultPrevented)
            return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            setActiveIndex((index) => (isOpen ? nextEnabledIndex(normalizedOptions, index, direction) : direction === 1 ? firstEnabledIndex(normalizedOptions) : lastEnabledIndex(normalizedOptions)));
            setOpen(true, event);
        }
        if (event.key === "Home") {
            event.preventDefault();
            setActiveIndex(firstEnabledIndex(normalizedOptions));
            setOpen(true, event);
        }
        if (event.key === "End") {
            event.preventDefault();
            setActiveIndex(lastEnabledIndex(normalizedOptions));
            setOpen(true, event);
        }
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (isOpen && activeOption) {
                commitOption(activeOption, event);
                return;
            }
            setOpen(true, event);
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, event);
        }
    };
    const handleSearchFocus = (event) => {
        rest.onFocus?.(event);
        if (event.defaultPrevented || disabled)
            return;
        setOpen(true, event);
    };
    const handleSearchChange = (event) => {
        const nextValue = event.target.value;
        setInputValue(nextValue);
        if (!isValueControlled)
            setInternalValue(nextValue);
        setActiveIndex(null);
        setOpen(true, event);
        onValueChange?.(nextValue, { label: nextValue, meta: "", inputValue: nextValue }, event);
    };
    const handleSearchKeyDown = (event) => {
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
                if (!enabledVisibleOptions.length)
                    return null;
                if (index === null)
                    return selectedEnabledIndex >= 0 ? Math.min(enabledVisibleOptions.length - 1, selectedEnabledIndex + 1) : 0;
                return Math.min(enabledVisibleOptions.length - 1, index + 1);
            });
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true, event);
            setActiveIndex((index) => {
                if (!enabledVisibleOptions.length)
                    return null;
                if (index === null)
                    return selectedEnabledIndex >= 0 ? Math.max(0, selectedEnabledIndex - 1) : Math.max(0, enabledVisibleOptions.length - 1);
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
    const handleRootBlur = (event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget && event.currentTarget.contains(nextTarget))
            return;
        if (!open)
            return;
        setOpen(false);
    };
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("span", {
        ref: rootRef,
        className: ["field", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        role: "group",
        "aria-labelledby": `${selectId}-label`,
        onBlur: handleRootBlur,
    }, React.createElement("span", { className: "field__label", id: `${selectId}-label` }, label), React.createElement("span", {
        className: ["select-control", variant === "inline" ? "select-control--inline" : ""].filter(Boolean).join(" "),
        "data-open": String(isOpen),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-value": selectedValue,
        "data-select-control": "",
    }, searchable ? React.createElement("span", {
        className: "select-control__trigger select-control__trigger--searchable",
        "data-select-search-shell": "",
    }, icon || isLoading ? React.createElement("span", { className: "select-control__icon", "aria-hidden": "true" }, isLoading ? "progress_activity" : icon) : null, React.createElement("input", {
        ...flowRestProps(rest),
        ref: (node) => {
            searchInputRef.current = node;
            assignSearchInputRef(ref, node);
        },
        id: selectId,
        className: "select-control__input",
        name,
        type: "text",
        value: searchValue,
        placeholder: selectedOption && !isOpen ? undefined : placeholder,
        disabled,
        autoComplete: "off",
        spellCheck: false,
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-expanded": String(isOpen),
        "aria-haspopup": "listbox",
        "aria-controls": `${selectId}-listbox`,
        "aria-labelledby": `${selectId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        "aria-busy": isLoading ? "true" : undefined,
        "aria-activedescendant": isOpen && activeOption ? `${selectId}-option-${normalizedOptions.indexOf(activeOption)}` : undefined,
        onFocus: handleSearchFocus,
        onClick: (event) => {
            rest.onClick?.(event);
            if (!event.defaultPrevented)
                setOpen(true, event);
        },
        onChange: handleSearchChange,
        onKeyDown: handleSearchKeyDown,
    }), clearable && searchValue ? React.createElement("button", {
        className: "field-action select-control__clear",
        type: "button",
        disabled,
        "aria-label": clearSelectionLabel,
        "data-field-action": "clear",
        "data-select-clear": "",
        onClick: clearValue,
    }, React.createElement("span", { className: "field-action__icon", "aria-hidden": "true" }, "close")) : null, React.createElement("span", { className: "select-control__chevron", "aria-hidden": "true" }, "expand_more")) : React.createElement("button", {
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
        "aria-busy": isLoading ? "true" : undefined,
        "aria-activedescendant": isOpen && activeOption ? `${selectId}-option-${normalizedOptions.indexOf(activeOption)}` : undefined,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
    }, icon || isLoading ? React.createElement("span", { className: "select-control__icon", "aria-hidden": "true" }, isLoading ? "progress_activity" : icon) : null, selectedLabel
        ? React.createElement("span", { className: "select-control__value", "data-select-value-label": "" }, selectedLabel)
        : placeholder
            ? React.createElement("span", { className: "select-control__value select-control__placeholder", "data-select-placeholder": "" }, placeholder)
            : null, selectedOption?.meta ? React.createElement("span", { className: "select-control__option-code", "data-select-value-meta": "" }, selectedOption.meta) : null, React.createElement("span", { className: "select-control__chevron", "aria-hidden": "true" }, "expand_more")), React.createElement("span", {
        id: `${selectId}-listbox`,
        className: "select-control__listbox",
        role: "listbox",
        "data-select-listbox": "",
        "aria-label": optionsLabel,
        "aria-labelledby": optionsLabel ? undefined : `${selectId}-label`,
    }, visibleOptions.map((option) => {
        const index = normalizedOptions.indexOf(option);
        const optionValue = option.value;
        const isSelected = optionValue === selectedValue;
        const isActive = activeOption === option;
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
            "data-active": String(isActive),
            "data-value": optionValue,
            "data-label": option.label,
            "data-meta": option.meta || undefined,
            "data-disabled": option.disabled ? "true" : undefined,
            onMouseDown: (event) => event.preventDefault(),
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
        }, React.createElement("span", { className: "select-control__option-label" }, option.label), option.meta ? React.createElement("span", { className: "select-control__option-code" }, option.meta) : null, React.createElement("span", { className: "select-control__option-check", "aria-hidden": "true" }, isSelected ? "check" : ""));
    }), isLoading ? React.createElement("span", { className: "select-control__loading", "data-select-loading": "", role: "status" }, loadingText) : null, emptyText ? React.createElement("span", { className: "select-control__empty", "data-select-empty": "", role: "status", hidden: visibleOptions.length > 0 }, emptyText) : null), name ? React.createElement("input", { type: "hidden", name, value: selectedValue, "data-select-input": "", readOnly: true }) : null), fieldMessage.message ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message) : null);
});
Select.displayName = "Select";
Select.platformContract = selectPlatformContract;
