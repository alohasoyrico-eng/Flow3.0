import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import {
  countryFlagAssetPath,
  normalizeCountryCallingCodeOptions,
  resolveCountryCallingCodeOption,
} from "@design-system/components";
import { countrySelectorPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowDensityProps, flowRestProps } from "./internal/props.js";

function CountryFlag({ country, className = "" }) {
  const code = String(country ?? "").toUpperCase();
  return React.createElement(
    "span",
    {
      className: ["country-flag", className].filter(Boolean).join(" "),
      "data-country": code,
      "data-flag-library": "country-flag-icons",
      "data-flag-source": "country-flag-icons",
      "data-country-selector-flag": "",
      "aria-hidden": "true",
    },
    React.createElement("img", {
      className: "country-flag__asset",
      src: countryFlagAssetPath(code),
      alt: "",
      decoding: "async",
      loading: "lazy",
      "aria-hidden": "true",
    }),
    React.createElement("span", { className: "country-flag__fallback", hidden: true, "aria-hidden": "true" }, code),
  );
}

function matchesQuery(option, query) {
  const normalized = String(query ?? "").trim().toLowerCase();
  if (!normalized) return true;
  return [option.country, option.label, option.callingCode].some((value) => String(value ?? "").toLowerCase().includes(normalized));
}

export const CountrySelector = forwardRef(function CountrySelector({
  label,
  value,
  country,
  countries,
  disabled = false,
  invalid = false,
  density,
  inline = false,
  searchable = true,
  searchPlaceholder = "",
  emptyText,
  open: openProp,
  className = "",
  onValueChange,
  onOpenChange,
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const selectorId = id ?? `country-selector-${generatedId}`;
  const options = useMemo(() => normalizeCountryCallingCodeOptions(countries), [countries]);
  const isValueControlled = country !== undefined || value !== undefined;
  const initialCountry = resolveCountryCallingCodeOption({ country: country ?? value }, options);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [activeCountryCode, setActiveCountryCode] = useState(initialCountry.country);
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [query, setQuery] = useState("");
  const filteredOptions = options.filter((option) => matchesQuery(option, query));
  const activeOption = filteredOptions.find((option) => option.country === activeCountryCode) ?? filteredOptions.find((option) => option.country === selectedCountry.country) ?? filteredOptions[0];
  const activeIndex = Math.max(options.findIndex((option) => option.country === activeOption?.country), 0);
  const resolvedState = disabled ? "disabled" : invalid ? "error" : "default";
  useEffect(() => {
    if (!isValueControlled) return;
    const nextCountry = resolveCountryCallingCodeOption({ country: country ?? value }, options);
    setSelectedCountry(nextCountry);
    setActiveCountryCode(nextCountry.country);
  }, [country, isValueControlled, options, value]);

  if (!label) return null;

  const setOpen = (nextOpen, event) => {
    if (disabled) return;
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    onOpenChange?.(normalizedOpen, event);
  };

  const commitOption = (option, event) => {
    if (!option || disabled) return;
    if (!isValueControlled) setSelectedCountry(option);
    setActiveCountryCode(option.country);
    setOpen(false, event);
    setQuery("");
    onValueChange?.(option.country, option, event);
  };
  const moveActive = (direction) => {
    const currentIndex = filteredOptions.findIndex((option) => option.country === activeOption?.country);
    const next = filteredOptions[Math.max(0, Math.min(filteredOptions.length - 1, currentIndex + direction))];
    if (next) setActiveCountryCode(next.country);
  };

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["select-control", inline ? "select-control--inline" : "", "country-selector", className].filter(Boolean).join(" "),
      "data-country-selector": "",
      "data-country": selectedCountry.country,
      "data-value": selectedCountry.country,
      "data-open": String(open),
      ...flowDensityProps(density),
      ...flowStateProps(resolvedState === "default" ? undefined : resolvedState),
    },
    React.createElement(
      "span",
      {
        className: "select-control__trigger country-selector__trigger",
        "data-country-selector-trigger": "",
        role: "combobox",
        tabIndex: disabled ? -1 : 0,
        "aria-expanded": String(open),
        "aria-haspopup": "listbox",
        "aria-controls": `${selectorId}-listbox`,
        "aria-activedescendant": `${selectorId}-option-${activeIndex}`,
        "aria-label": label,
        "aria-disabled": disabled ? "true" : undefined,
        "aria-invalid": invalid ? "true" : undefined,
        onClick: (event) => {
          if (!disabled) {
            setActiveCountryCode(selectedCountry.country);
            setOpen(!open, event);
          }
        },
        onKeyDown: (event) => {
          if (disabled) return;
          if (["Enter", " "].includes(event.key)) {
            event.preventDefault();
            setOpen(!open, event);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, event);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true, event);
            moveActive(1);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true, event);
            moveActive(-1);
          }
        },
      },
      React.createElement(CountryFlag, { country: selectedCountry.country }),
      React.createElement(
        "span",
        { className: "country-selector__value", "data-country-selector-value": "" },
        React.createElement("span", { className: "country-selector__label", "data-country-selector-label": "" }, selectedCountry.label),
        React.createElement("span", { className: "select-control__code country-selector__code", "data-country-selector-prefix": "" }, selectedCountry.callingCode),
      ),
      React.createElement("span", { className: "select-control__chevron country-selector__chevron", "aria-hidden": "true" }, open ? "expand_less" : "expand_more"),
    ),
    React.createElement(
      "span",
      {
        id: `${selectorId}-listbox`,
        className: "select-control__listbox country-selector__listbox",
        "data-country-selector-list": "",
        role: "listbox",
        "aria-label": `${label} options`,
      },
      searchable
        ? React.createElement(
          "span",
          { className: "country-selector__search" },
          React.createElement("input", {
            className: "country-selector__search-input",
            "data-country-selector-search": "",
            type: "search",
            placeholder: searchPlaceholder,
            value: query,
            onChange: (event) => setQuery(event.currentTarget.value),
            onKeyDown: (event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false, event);
              }
            },
          }),
        )
        : null,
      options.map((option, index) => {
        const hidden = !matchesQuery(option, query);
        const isSelected = option.country === selectedCountry.country;
        return React.createElement(
          "span",
          {
            key: option.country,
            id: `${selectorId}-option-${index}`,
            className: "select-control__option country-selector__option",
            "data-country-selector-option": "",
            "data-country-code": option.country,
            "data-country-calling": option.callingCode,
            "data-country-national-length": option.nationalLength,
            "data-selected": String(isSelected),
            role: "option",
            tabIndex: hidden ? undefined : -1,
            hidden,
            "aria-selected": String(isSelected),
            onClick: (event) => commitOption(option, event),
            onKeyDown: (event) => {
              if (["Enter", " "].includes(event.key)) {
                event.preventDefault();
                commitOption(option, event);
              }
              if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false, event);
              }
            },
          },
          React.createElement(CountryFlag, { country: option.country }),
          React.createElement(
            "span",
            { className: "country-selector__option-body" },
            React.createElement("span", { className: "select-control__option-label country-selector__option-label" }, option.label),
            React.createElement("span", { className: "select-control__option-code country-selector__option-code" }, option.callingCode),
          ),
          React.createElement("span", { className: "country-selector__option-check", "aria-hidden": "true" }, "check"),
        );
      }),
      emptyText ? React.createElement("span", { className: "country-selector__empty", "data-country-selector-empty": "", role: "status", hidden: filteredOptions.length > 0 }, emptyText) : null,
    ),
  );
});

CountrySelector.displayName = "CountrySelector";
CountrySelector.platformContract = countrySelectorPlatformContract;
