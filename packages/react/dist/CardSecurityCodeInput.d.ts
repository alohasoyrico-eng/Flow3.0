import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { cardSecurityCodeInputPlatformContract } from "#flow/platforms";

export type CardSecurityCodeInputDensity = "sm" | "md" | "lg";
export type CardSecurityCodeInputState = "default" | "filled" | "valid" | "loading" | "error" | "disabled";
export type CardSecurityCodeMeta = {
  validity: "empty" | "incomplete" | "valid";
  expectedLength: 3 | 4;
  complete: boolean;
};

export interface CardSecurityCodeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange"> {
  label: string;
  helper?: string;
  error?: string;
  value?: string;
  density?: CardSecurityCodeInputDensity;
  state?: CardSecurityCodeInputState;
  loading?: boolean;
  expectedLength?: 3 | 4;
  validationMessage?: string;
  revealable?: boolean;
  revealed?: boolean;
  onValueChange?: (digits: string, meta: CardSecurityCodeMeta) => void;
}

export interface CardSecurityCodeInputComponent extends ForwardRefExoticComponent<CardSecurityCodeInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CardSecurityCodeInput";
  platformContract: typeof cardSecurityCodeInputPlatformContract;
}

export const CardSecurityCodeInput: CardSecurityCodeInputComponent;
