import React, { forwardRef, useId, useState } from "react";
import { countryFlagAssetPath } from "@design-system/components";
import { phoneInputPlatformContract } from "@design-system/components/platforms";

const defaultCountries = Object.freeze([
  { country: "AR", label: "Argentina", callingCode: "+54", nationalLength: 10 },
  { country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 },
  { country: "CL", label: "Chile", callingCode: "+56", nationalLength: 9 },
  { country: "CO", label: "Colombia", callingCode: "+57", nationalLength: 10 },
  { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
  { country: "PE", label: "Peru", callingCode: "+51", nationalLength: 9 },
  { country: "ES", label: "Spain", callingCode: "+34", nationalLength: 9 },
  { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  { country: "CA", label: "Canada", callingCode: "+1", nationalLength: 10 },
  { country: "CU", label: "Cuba", callingCode: "+53", nationalLength: 8 },
]);

function resolveCountry({ country, prefix } = {}, countries = defaultCountries) {
  const countryCode = String(country ?? "").toUpperCase();
  return countries.find((item) => item.country === countryCode)
    ?? countries.find((item) => item.callingCode === prefix)
    ?? countries[0];
}

function normalizeCountries(countries) {
  return (countries?.length ? countries : defaultCountries).map((item) => ({
    ...resolveCountry(item),
    ...item,
    country: String(item.country ?? "").toUpperCase(),
  }));
}

function parsePhoneValue(value, initialCountry, countries = defaultCountries) {
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
  value = "",
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
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `phone-input-${generatedId}`;
  const countryOptions = normalizeCountries(countries);
  const initialCountry = resolveCountry({ country, prefix }, countryOptions);
  const parsed = parsePhoneValue(value, initialCountry, countryOptions);
  const [selectedCountry, setSelectedCountry] = useState(parsed.country);
  const [digits, setDigits] = useState(parsed.digits);
  const [open, setOpen] = useState(state === "open");
  const isReadonly = variant === "readonly";
  const resolvedState = disabled ? "disabled" : error ? "error" : state ?? "default";
  const resolvedHelper = error || helper;
  const formattedValue = formatPhoneValue(digits, selectedCountry.nationalLength);
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;

  const commitDigits = (nextValue, countryValue = selectedCountry) => {
    const parsedNext = parsePhoneValue(nextValue, countryValue, countryOptions);
    const nextCountry = parsedNext.country;
    const nextDigits = parsedNext.digits.slice(0, nextCountry.nationalLength);
    setSelectedCountry(nextCountry);
    setDigits(nextDigits);
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
      "data-state": resolvedState,
      "data-density": density || undefined,
      "data-variant": variant,
    },
    React.createElement("span", { className: "field__label", id: `${inputId}-label` }, label ?? "Phone number"),
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
          "data-density": density || undefined,
          "data-state": disabled || isReadonly ? "disabled" : error ? "error" : undefined,
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
            "aria-label": `${label ?? "Phone number"} country code, ${selectedCountry.label} ${selectedCountry.callingCode}`,
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
            "aria-label": `${label ?? "Phone number"} country options`,
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
          React.createElement("span", { className: "country-selector__empty", "data-country-selector-empty": "", role: "status", hidden: true }, "No results"),
        ),
      ),
      React.createElement("input", {
        ...rest,
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
        "aria-labelledby": `${inputId}-label`,
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
