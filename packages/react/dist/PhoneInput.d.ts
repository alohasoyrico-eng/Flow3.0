import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { phoneInputPlatformContract } from "#flow/platforms";

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

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
  countryTriggerLabel?: string;
  countryOptionsLabel?: string;
  onValueChange?: (nationalNumber: string, meta: PhoneInputMeta) => void;
}

export interface PhoneInputComponent extends ForwardRefExoticComponent<PhoneInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "PhoneInput";
  platformContract: typeof phoneInputPlatformContract;
}

export const PhoneInput: PhoneInputComponent;
