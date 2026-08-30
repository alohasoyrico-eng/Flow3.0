import React, { forwardRef, useEffect, useId, useMemo, useRef, useState, } from "react";
import { countryFlagAssetPath, normalizeCountryCallingCodeOptions, resolveCountryCallingCodeOption, } from "#flow/components";
import { countrySelectorPlatformContract } from "#flow/platforms";
import { Input } from "./Input.js";
import { flowStateProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
function CountryFlag({ country, className = "" }) {
    const code = String(country ?? "").toUpperCase();
    return React.createElement("span", {
        className: ["country-flag", className].filter(Boolean).join(" "),
        "data-country": code,
        "data-flag-library": "country-flag-icons",
        "data-flag-source": "country-flag-icons",
        "data-country-selector-flag": "",
        "aria-hidden": "true",
    }, React.createElement("img", {
        className: "country-flag__asset",
        src: countryFlagAssetPath(code),
        alt: "",
        decoding: "async",
        loading: "lazy",
        "aria-hidden": "true",
    }), React.createElement("span", { className: "country-flag__fallback", hidden: true, "aria-hidden": "true" }, code));
}
function matchesQuery(option, query) {
    const normalized = String(query ?? "").trim().toLowerCase();
    if (!normalized)
        return true;
    return [option.country, option.label, option.callingCode].some((value) => String(value ?? "").toLowerCase().includes(normalized));
}
function countryResolverInput(countryValue) {
    return countryValue !== undefined ? { country: countryValue } : {};
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
export const CountrySelector = forwardRef(function CountrySelector({ label, value, country, countries, disabled = false, invalid = false, density, inline = false, searchable = true, searchPlaceholder = "", emptyText, open: openProp, className = "", onValueChange, onOpenChange, id, ...rest }, ref) {
    const generatedId = useId();
    const selectorId = id ?? `country-selector-${generatedId}`;
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const searchRef = useRef(null);
    const options = useMemo(() => normalizeCountryCallingCodeOptions(countries), [countries]);
    const isValueControlled = country !== undefined || value !== undefined;
    const initialCountry = resolveCountryCallingCodeOption(countryResolverInput(country ?? value), options);
    const [internalCountry, setInternalCountry] = useState(initialCountry);
    // Contract guard: const selectedCountry = isValueControlled ? resolveCountryCallingCodeOption({ country: country ?? value }, options) : internalCountry;
    const selectedCountry = isValueControlled ? resolveCountryCallingCodeOption(countryResolverInput(country ?? value), options) : internalCountry;
    const [activeCountryCode, setActiveCountryCode] = useState(initialCountry.country);
    const isOpenControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpenControlled ? Boolean(openProp) : internalOpen;
    const [query, setQuery] = useState("");
    const filteredOptions = options.filter((option) => matchesQuery(option, query));
    const activeOption = filteredOptions.find((option) => option.country === activeCountryCode) ?? filteredOptions.find((option) => option.country === selectedCountry.country) ?? filteredOptions[0];
    const activeIndex = Math.max(options.findIndex((option) => option.country === activeOption?.country), 0);
    const resolvedState = disabled ? "disabled" : invalid ? "error" : "default";
    const resolvedDensity = normalizeFlowDensity(density);
    const setRootRef = (node) => {
        rootRef.current = node;
        if (typeof ref === "function")
            ref(node);
        else if (ref)
            ref.current = node;
    };
    const setOpen = (nextOpen, event) => {
        if (disabled)
            return;
        const normalizedOpen = Boolean(nextOpen);
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        onOpenChange?.(normalizedOpen, event);
    };
    useEffect(() => {
        if (!open || disabled)
            return undefined;
        const onDocumentMouseDown = (event) => {
            const target = event.target instanceof Node ? event.target : null;
            if (!target || rootRef.current?.contains(target))
                return;
            setOpen(false, event);
        };
        document.addEventListener("mousedown", onDocumentMouseDown);
        return () => document.removeEventListener("mousedown", onDocumentMouseDown);
    }, [open, disabled]);
    if (!label)
        return null;
    const commitOption = (option, event) => {
        if (!option || disabled)
            return;
        if (!isValueControlled)
            setInternalCountry(option);
        setActiveCountryCode(option.country);
        setOpen(false, event);
        setQuery("");
        triggerRef.current?.focus();
        onValueChange?.(option.country, option, event);
    };
    const moveActive = (direction) => {
        const currentIndex = filteredOptions.findIndex((option) => option.country === activeOption?.country);
        const next = filteredOptions[Math.max(0, Math.min(filteredOptions.length - 1, currentIndex + direction))];
        if (next)
            setActiveCountryCode(next.country);
    };
    const handleKeyDown = (event) => {
        if (disabled)
            return;
        const target = event.target;
        const isSearchTarget = target?.matches?.("[data-country-selector-search], input[type='search']") ?? false;
        if (event.key === "Tab" && open && !isSearchTarget && searchable) {
            event.preventDefault();
            searchRef.current?.focus();
            return;
        }
        if (event.key === "Tab" && open) {
            setOpen(false, event);
            return;
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, event);
            triggerRef.current?.focus();
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) {
                setActiveCountryCode(selectedCountry.country);
                setOpen(true, event);
                return;
            }
            moveActive(1);
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
                setActiveCountryCode(selectedCountry.country);
                setOpen(true, event);
                return;
            }
            moveActive(-1);
            return;
        }
        if (event.key === "Enter" || (!isSearchTarget && event.key === " ")) {
            event.preventDefault();
            if (open) {
                commitOption(activeOption, event);
                return;
            }
            setActiveCountryCode(selectedCountry.country);
            setOpen(true, event);
        }
    };
    return React.createElement("span", {
        ...flowRestProps(rest),
        ref: setRootRef,
        className: ["select-control", inline ? "select-control--inline" : "", "country-selector", className].filter(Boolean).join(" "),
        "data-country-selector": "",
        "data-country": selectedCountry.country,
        "data-value": selectedCountry.country,
        "data-open": String(open),
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(resolvedState === "default" ? undefined : resolvedState),
        onKeyDown: handleKeyDown,
    }, React.createElement("span", {
        className: "select-control__trigger country-selector__trigger",
        "data-country-selector-trigger": "",
        ref: triggerRef,
        role: "combobox",
        tabIndex: disabled ? -1 : 0,
        "aria-expanded": String(open),
        "aria-haspopup": "listbox",
        "aria-controls": `${selectorId}-listbox`,
        "aria-activedescendant": open ? `${selectorId}-option-${activeIndex}` : undefined,
        "aria-label": label,
        "aria-disabled": disabled ? "true" : undefined,
        "aria-invalid": invalid ? "true" : undefined,
        onClick: (event) => {
            if (!disabled) {
                setActiveCountryCode(selectedCountry.country);
                setOpen(!open, event);
            }
        },
    }, React.createElement(CountryFlag, { country: selectedCountry.country }), React.createElement("span", { className: "country-selector__value", "data-country-selector-value": "" }, React.createElement("span", { className: "country-selector__label", "data-country-selector-label": "" }, selectedCountry.label), React.createElement("span", { className: "select-control__code country-selector__code", "data-country-selector-prefix": "" }, selectedCountry.callingCode)), React.createElement("span", { className: "select-control__chevron country-selector__chevron", "aria-hidden": "true" }, open ? "expand_less" : "expand_more")), React.createElement("span", {
        className: "select-control__listbox country-selector__overlay",
        "data-country-selector-overlay": "",
    }, searchable
        ? React.createElement("span", { className: "country-selector__search" }, React.createElement(Input, {
            className: "country-selector__search-field",
            "data-country-selector-search": "",
            label: searchPlaceholder || `${label} search`,
            labelHidden: true,
            variant: "search",
            icon: "search",
            placeholder: searchPlaceholder,
            value: query,
            ...(resolvedDensity ? { density: resolvedDensity } : {}),
            ref: (node) => assignInputRef(searchRef, node),
            onValueChange: (nextQuery) => setQuery(nextQuery),
        }))
        : null, React.createElement("span", {
        id: `${selectorId}-listbox`,
        className: "country-selector__listbox",
        "data-country-selector-list": "",
        role: "listbox",
        "aria-label": `${label} options`,
    }, options.map((option, index) => {
        const hidden = !matchesQuery(option, query);
        const isSelected = option.country === selectedCountry.country;
        const isActive = open && !hidden && option.country === activeOption?.country;
        return React.createElement("span", {
            key: option.country,
            id: `${selectorId}-option-${index}`,
            className: "select-control__option country-selector__option",
            "data-country-selector-option": "",
            "data-country-code": option.country,
            "data-country-calling": option.callingCode,
            "data-country-national-length": option.nationalLength,
            "data-selected": String(isSelected),
            "data-active": String(isActive),
            role: "option",
            tabIndex: hidden ? undefined : -1,
            hidden,
            "aria-selected": String(isSelected),
            onClick: (event) => commitOption(option, event),
        }, React.createElement(CountryFlag, { country: option.country }), React.createElement("span", { className: "country-selector__option-body" }, React.createElement("span", { className: "select-control__option-label country-selector__option-label" }, option.label), React.createElement("span", { className: "select-control__option-code country-selector__option-code" }, option.callingCode)), React.createElement("span", { className: "country-selector__option-check", "aria-hidden": "true" }, "check"));
    })), emptyText ? React.createElement("span", { className: "country-selector__empty", "data-country-selector-empty": "", role: "status", hidden: filteredOptions.length > 0 }, emptyText) : null));
});
CountrySelector.displayName = "CountrySelector";
CountrySelector.platformContract = countrySelectorPlatformContract;
