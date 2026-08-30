import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { phoneInputPlatformContract } from "#flow/platforms";
import type { CountrySelectorValueChangeEvent } from "./CountrySelector.js";

export type PhoneInputDensity = "sm" | "md" | "lg";
export type PhoneInputVariant = "country-code" | "compact" | "otp-handoff" | "readonly";
export type PhoneInputState = "default" | "hover" | "focus" | "valid" | "warning" | "error" | "disabled";
export type PhoneCountry = {
  country: string;
  label: string;
  callingCode: string;
  nationalLength: number;
};
export type PhoneInputMeta = {
  country: string;
  callingCode: string;
  e164: string;
  nationalNumber: string;
};
export type PhoneInputValueChangeEvent = ChangeEvent<HTMLInputElement> | CountrySelectorValueChangeEvent;

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  prefix?: string;
  country?: string;
  countries?: PhoneCountry[];
  variant?: PhoneInputVariant;
  helper?: string;
  placeholder?: string;
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

export const PhoneInput: PhoneInputComponent;
