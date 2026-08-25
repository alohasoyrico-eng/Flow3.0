import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type RefAttributes,
  forwardRef,
  useId,
  useMemo,
  useState,
} from "react";
import {
  countryCallingCodeOptions,
  normalizeCountryCallingCodeOptions,
  resolveCountryCallingCodeOption,
} from "@design-system/components";
import { phoneInputPlatformContract } from "@design-system/components/platforms";
import { CountrySelector } from "./CountrySelector.js";
import type { CountrySelectorCountry, CountrySelectorValueChangeEvent } from "./CountrySelector.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";

export type PhoneInputDensity = FlowDensity;
export type PhoneInputVariant = "country-code" | "compact" | "otp-handoff" | "readonly";
export type PhoneInputState = "default" | "hover" | "focus" | "valid" | "warning" | "error" | "disabled";
export type PhoneCountry = CountrySelectorCountry;
export type PhoneInputMeta = {
  country: string;
  callingCode: string;
  e164: string;
  nationalNumber: string;
};
export type PhoneInputValueChangeEvent = ChangeEvent<HTMLInputElement> | CountrySelectorValueChangeEvent;
type PhoneResolverInput = { country?: string; prefix?: string };

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  prefix?: string;
  country?: string;
  countries?: PhoneCountry[];
  variant?: PhoneInputVariant;
  helper?: string;
  disabled?: boolean;
  state?: PhoneInputState;
  density?: PhoneInputDensity;
  error?: string;
  emptyText?: string;
  onValueChange?: (nationalNumber: string, meta: PhoneInputMeta, event: PhoneInputValueChangeEvent) => void;
}

export interface PhoneInputComponent extends ForwardRefExoticComponent<PhoneInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "PhoneInput";
  platformContract: typeof phoneInputPlatformContract;
}

const validVariants = new Set<PhoneInputVariant>(["country-code", "compact", "otp-handoff", "readonly"]);
const validStates = new Set<PhoneInputState>(["default", "hover", "focus", "valid", "warning", "error", "disabled"]);

function phoneResolverInput(countryValue: string | undefined, prefixValue: string | undefined): PhoneResolverInput {
  return {
    ...(countryValue !== undefined ? { country: countryValue } : {}),
    ...(prefixValue !== undefined ? { prefix: prefixValue } : {}),
  };
}

function resolveCountry({ country, prefix }: PhoneResolverInput = {}, countries: readonly PhoneCountry[] = countryCallingCodeOptions) {
  return resolveCountryCallingCodeOption(phoneResolverInput(country, prefix), countries);
}

function normalizeCountries(countries: readonly PhoneCountry[] | undefined) {
  return normalizeCountryCallingCodeOptions(countries);
}

function parsePhoneValue(value: unknown, initialCountry: PhoneCountry, countries: readonly PhoneCountry[] = countryCallingCodeOptions) {
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

function formatPhoneValue(value: unknown, nationalLength = 10) {
  const digits = String(value ?? "").replace(/\D/g, "").slice(0, nationalLength);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`.trim();
}

function countryMeta(country: PhoneCountry, digits: string): PhoneInputMeta {
  return {
    country: country.country,
    callingCode: country.callingCode,
    e164: `${country.callingCode}${digits}`,
    nationalNumber: digits,
  };
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput({
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
  const initialCountry = useMemo(() => resolveCountry(phoneResolverInput(country, prefix), countryOptions), [country, countryOptions, prefix]);
  const isValueControlled = value !== undefined;
  const parsed = parsePhoneValue(value ?? "", initialCountry, countryOptions);
  const [internalCountry, setInternalCountry] = useState(parsed.country);
  const [internalDigits, setInternalDigits] = useState(parsed.digits);
  const selectedCountry = isValueControlled ? parsed.country : internalCountry;
  const digits = isValueControlled ? parsed.digits : internalDigits;
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "country-code");
  const isReadonly = resolvedVariant === "readonly";
  const resolvedState = disabled ? "disabled" : error ? "error" : normalizeFlowValue(state ?? "default", validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const formattedValue = formatPhoneValue(digits, selectedCountry.nationalLength);
  const fieldMessage = resolveFieldMessage({
    controlId: inputId,
    describedBy: rest["aria-describedby"],
    error,
    helper,
    state: resolvedState === "error" ? "error" : resolvedState === "warning" ? "warning" : resolvedState === "valid" ? "success" : resolvedState === "disabled" ? "disabled" : "default",
  });

  if (!label) return null;

  const commitDigits = (nextValue: string, countryValue = selectedCountry, event: PhoneInputValueChangeEvent) => {
    const parsedNext = parsePhoneValue(nextValue, countryValue, countryOptions);
    const nextCountry = parsedNext.country;
    const nextDigits = parsedNext.digits.slice(0, nextCountry.nationalLength);
    if (!isValueControlled) {
      setInternalCountry(nextCountry);
      setInternalDigits(nextDigits);
    }
    onValueChange?.(nextDigits, countryMeta(nextCountry, nextDigits), event);
  };

  const commitCountry = (nextCountry: PhoneCountry, event: CountrySelectorValueChangeEvent) => {
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
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
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
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        inline: true,
        searchPlaceholder: "Search country or code",
        ...(emptyText !== undefined ? { emptyText } : {}),
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
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        onChange: (event) => commitDigits(event.target.value, selectedCountry, event),
      }),
    ),
    fieldMessage.message
      ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message)
      : null,
  );
}) as PhoneInputComponent;

PhoneInput.displayName = "PhoneInput";
PhoneInput.platformContract = phoneInputPlatformContract;
