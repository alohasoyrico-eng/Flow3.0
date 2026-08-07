import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import {
  countryFlagAssetPath,
  countryCallingCodeOptions,
  normalizeCountryCallingCodeOptions,
  resolveCountryCallingCodeOption,
} from "@design-system/components";
import { phoneInputPlatformContract } from "@design-system/components/platforms";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["country-code", "compact", "otp-handoff", "readonly"]);
const validStates = new Set(["default", "hover", "focus", "valid", "warning", "error", "disabled"]);

function resolveCountry({ country, prefix } = {}, countries = countryCallingCodeOptions) {
  return resolveCountryCallingCodeOption({ country, prefix }, countries);
}

function normalizeCountries(countries) {
  return normalizeCountryCallingCodeOptions(countries);
}

function parsePhoneValue(value, initialCountry, countries = countryCallingCodeOptions) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^\+(\d{1,3})/);
  if (!match) return { country: initialCountry, digits: raw.replace(/\D/g, "").slice(0, initialCountry.nationalLength) };
  const withPlus = `+${match[1]}`;
  const matched = countries.find((item) => withPlus.startsWith(item.callingCode)) ?? initialCountry;
  return {
    country: matched,
    digits: raw.slice(matched.callingCode.length).replace(/\D/g, "").slice(0, matched.nationalLength),
  };
}

function formatPhoneValue(value, nationalLength = 10) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, nationalLength);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`.trim();
}

function countryMeta(country, digits) {
  return {
    country: country.country,
    callingCode: country.callingCode,
    e164: `${country.callingCode}${digits}`,
    nationalNumber: digits,
  };
}

function flagNode(country) {
  const code = String(country.country ?? "MX").toUpperCase();
  return React.createElement(
    "span",
    {
      className: "country-flag phone-input__flag",
      "data-country": code,
      "data-flag-library": "country-flag-icons",
      "data-flag-source": "country-flag-icons",
      "data-phone-country-flag": "",
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

export const PhoneInput = forwardRef(function PhoneInput({
  label,
  value,
  prefix = "+1",
  country,
  countries,
  variant = "country-code",
  helper = "",
  disabled = false,
  state,
  density,
  error = "",
  name = "",
  emptyText = "",
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `phone-input-${generatedId}`;
  const countryOptions = useMemo(() => normalizeCountries(countries), [countries]);
  const initialCountry = useMemo(() => resolveCountry({ country, prefix }, countryOptions), [country, countryOptions, prefix]);
  const isValueControlled = value !== undefined;
  const parsed = parsePhoneValue(value ?? "", initialCountry, countryOptions);
  const [selectedCountry, setSelectedCountry] = useState(parsed.country);
  const [digits, setDigits] = useState(parsed.digits);
  const [open, setOpen] = useState(state === "open");
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "country-code");
  const isReadonly = resolvedVariant === "readonly";
  const resolvedState = disabled ? "disabled" : error ? "error" : normalizeFlowValue(state, validStates, "default");
  const resolvedHelper = error || helper;
  const formattedValue = formatPhoneValue(digits, selectedCountry.nationalLength);
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;

  useEffect(() => {
    if (!isValueControlled) return;
    const nextParsed = parsePhoneValue(value ?? "", initialCountry, countryOptions);
    setSelectedCountry(nextParsed.country);
    setDigits(nextParsed.digits);
  }, [countryOptions, initialCountry, isValueControlled, value]);

  const commitDigits = (nextValue, countryValue = selectedCountry) => {
    const parsedNext = parsePhoneValue(nextValue, countryValue, countryOptions);
    const nextCountry = parsedNext.country;
    const nextDigits = parsedNext.digits.slice(0, nextCountry.nationalLength);
    if (!isValueControlled) {
      setSelectedCountry(nextCountry);
      setDigits(nextDigits);
    }
    onValueChange?.(nextDigits, countryMeta(nextCountry, nextDigits));
  };

  const commitCountry = (nextCountry) => {
    setSelectedCountry(nextCountry);
    const nextDigits = digits.slice(0, nextCountry.nationalLength);
    setDigits(nextDigits);
    setOpen(false);
    onValueChange?.(nextDigits, countryMeta(nextCountry, nextDigits));
  };

  return React.createElement(
    "label",
    {
      className: ["field", "phone-input", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      ...flowVariantProps(resolvedVariant),
    },
    label ? React.createElement("span", { className: "field__label", id: `${inputId}-label` }, label) : null,
    React.createElement(
      "span",
      { className: "field__control phone-input__control" },
      React.createElement(
        "span",
        {
          className: "select-control select-control--inline country-selector phone-input__country",
          "data-country-selector": "",
          "data-phone-country-control": "",
          "data-phone-country": "",
          "data-country": selectedCountry.country,
          "data-value": selectedCountry.country,
          "data-open": String(open),
          ...flowDensityProps(density),
          ...flowStateProps(disabled || isReadonly ? "disabled" : error ? "error" : undefined),
        },
        React.createElement(
          "span",
          {
            className: "select-control__trigger country-selector__trigger phone-input__country-trigger",
            "data-country-selector-trigger": "",
            "data-phone-country-trigger": "",
            role: "combobox",
            tabIndex: disabled || isReadonly ? -1 : 0,
            "aria-expanded": String(open),
            "aria-haspopup": "listbox",
            "aria-controls": `${inputId}-country-list`,
            "aria-label": label ? `${label} country code, ${selectedCountry.label} ${selectedCountry.callingCode}` : `Country code, ${selectedCountry.label} ${selectedCountry.callingCode}`,
            "aria-disabled": disabled || isReadonly ? "true" : undefined,
            onClick: () => {
              if (!disabled && !isReadonly) setOpen((current) => !current);
            },
            onKeyDown: (event) => {
              if (disabled || isReadonly) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen((current) => !current);
              }
              if (event.key === "Escape") setOpen(false);
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                setOpen(true);
              }
            },
          },
          flagNode(selectedCountry),
          React.createElement(
            "span",
            { className: "country-selector__value" },
            React.createElement("span", { className: "country-selector__label" }, selectedCountry.label),
            React.createElement("span", { className: "select-control__code country-selector__code phone-input__prefix", "data-phone-prefix": "" }, selectedCountry.callingCode),
          ),
          React.createElement("span", { className: "select-control__chevron country-selector__chevron", "aria-hidden": "true" }, open ? "expand_less" : "expand_more"),
        ),
        React.createElement(
          "span",
          {
            className: "select-control__listbox country-selector__listbox phone-input__country-listbox",
            id: `${inputId}-country-list`,
            "data-country-selector-list": "",
            "data-phone-country-list": "",
            role: "listbox",
            "aria-label": label ? `${label} country options` : "Country options",
          },
          countryOptions.map((option) => {
            const selected = option.country === selectedCountry.country;
            return React.createElement(
              "span",
              {
                key: option.country,
                className: "select-control__option country-selector__option phone-input__country-option",
                id: `${inputId}-${option.country.toLowerCase()}`,
                "data-country-selector-option": "",
                "data-phone-country-option": "",
                "data-country-code": option.country,
                "data-calling-code": option.callingCode,
                "data-national-length": String(option.nationalLength),
                "data-selected": String(selected),
                "data-active": String(selected),
                role: "option",
                tabIndex: -1,
                "aria-selected": String(selected),
                onClick: () => commitCountry(option),
              },
              flagNode(option),
              React.createElement(
                "span",
                { className: "country-selector__option-body" },
                React.createElement("span", { className: "select-control__option-label country-selector__option-label" }, option.label),
                React.createElement("span", { className: "select-control__option-code country-selector__option-code" }, option.callingCode),
              ),
              React.createElement("span", { className: "country-selector__option-check", "aria-hidden": "true" }, "check"),
            );
          }),
          emptyText ? React.createElement("span", { className: "country-selector__empty", "data-country-selector-empty": "", role: "status", hidden: true }, emptyText) : null,
        ),
      ),
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        className: "input phone-input__input",
        name,
        type: "tel",
        inputMode: "tel",
        autoComplete: "tel-national",
        value: formattedValue,
        disabled,
        readOnly: isReadonly,
        "data-phone-input": "",
        "aria-labelledby": label ? `${inputId}-label` : undefined,
        "aria-label": label ? undefined : "Phone input",
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : undefined,
        onChange: (event) => commitDigits(event.target.value),
      }),
    ),
    resolvedHelper
      ? React.createElement("span", { className: "field__helper", id: `${inputId}-helper`, role: error ? "alert" : undefined }, resolvedHelper)
      : null,
  );
});

PhoneInput.displayName = "PhoneInput";
PhoneInput.platformContract = phoneInputPlatformContract;
