import React, { forwardRef, useId, useMemo, useState } from "react";
import {
  countryCallingCodeOptions,
  normalizeCountryCallingCodeOptions,
  resolveCountryCallingCodeOption,
} from "@design-system/components";
import { phoneInputPlatformContract } from "@design-system/components/platforms";
import { CountrySelector } from "./CountrySelector.js";
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

export const PhoneInput = forwardRef(function PhoneInput({
  label,
  value,
  prefix = "",
  country,
  countries,
  variant = "country-code",
  helper = "",
  disabled = false,
  state,
  density,
  error = "",
  name = "",
  emptyText,
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
  const [internalCountry, setInternalCountry] = useState(parsed.country);
  const [internalDigits, setInternalDigits] = useState(parsed.digits);
  const selectedCountry = isValueControlled ? parsed.country : internalCountry;
  const digits = isValueControlled ? parsed.digits : internalDigits;
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "country-code");
  const isReadonly = resolvedVariant === "readonly";
  const resolvedState = disabled ? "disabled" : error ? "error" : normalizeFlowValue(state, validStates, "default");
  const resolvedHelper = error || helper;
  const formattedValue = formatPhoneValue(digits, selectedCountry.nationalLength);
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;

  if (!label) return null;

  const commitDigits = (nextValue, countryValue = selectedCountry, event) => {
    const parsedNext = parsePhoneValue(nextValue, countryValue, countryOptions);
    const nextCountry = parsedNext.country;
    const nextDigits = parsedNext.digits.slice(0, nextCountry.nationalLength);
    if (!isValueControlled) {
      setInternalCountry(nextCountry);
      setInternalDigits(nextDigits);
    }
    onValueChange?.(nextDigits, countryMeta(nextCountry, nextDigits), event);
  };

  const commitCountry = (nextCountry, event) => {
    const nextDigits = digits.slice(0, nextCountry.nationalLength);
    if (!isValueControlled) {
      setInternalCountry(nextCountry);
      setInternalDigits(nextDigits);
    }
    onValueChange?.(nextDigits, countryMeta(nextCountry, nextDigits), event);
  };

  return React.createElement(
    "label",
    {
      className: ["field", "phone-input", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      ...flowVariantProps(resolvedVariant),
    },
    React.createElement("span", { className: "field__label", id: `${inputId}-label` }, label),
    React.createElement(
      "span",
      { className: "field__control phone-input__control" },
      React.createElement(CountrySelector, {
        label,
        country: selectedCountry.country,
        countries: countryOptions,
        disabled: disabled || isReadonly,
        invalid: Boolean(error),
        density,
        inline: true,
        searchable: false,
        emptyText,
        className: "phone-input__country",
        onValueChange: (_countryCode, option, event) => commitCountry(option, event),
      }),
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
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : undefined,
        onChange: (event) => commitDigits(event.target.value, selectedCountry, event),
      }),
    ),
    resolvedHelper
      ? React.createElement("span", { className: "field__helper", id: `${inputId}-helper`, role: error ? "alert" : undefined }, resolvedHelper)
      : null,
  );
});

PhoneInput.displayName = "PhoneInput";
PhoneInput.platformContract = phoneInputPlatformContract;
