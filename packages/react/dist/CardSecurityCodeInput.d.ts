import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { cardSecurityCodeInputPlatformContract } from "../../components/src/platforms/index.js";

export type CardSecurityCodeInputDensity = "sm" | "md" | "lg";
export type CardSecurityCodeInputState = "default" | "filled" | "valid" | "loading" | "error" | "disabled";
export type CardSecurityCodeMeta = {
  validity: "empty" | "incomplete" | "valid";
  expectedLength: 3 | 4;
  complete: boolean;
};

export interface CardSecurityCodeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "onChange"> {
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
