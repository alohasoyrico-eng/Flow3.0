import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { cardExpiryInputPlatformContract } from "#flow/platforms";

export type CardExpiryInputDensity = "sm" | "md" | "lg";
export type CardExpiryInputState = "default" | "filled" | "valid" | "loading" | "error" | "disabled";
export type CardExpiryMeta = {
  digits: string;
  month: string;
  year: string;
  validity: "empty" | "incomplete" | "valid" | "invalid" | "expired";
  expired: boolean;
};

export interface CardExpiryInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  helper?: string;
  error?: string;
  value?: string;
  density?: CardExpiryInputDensity;
  state?: CardExpiryInputState;
  loading?: boolean;
  validationMessage?: string;
  expiredMessage?: string;
  onValueChange?: (value: string, meta: CardExpiryMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CardExpiryInputComponent extends ForwardRefExoticComponent<CardExpiryInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CardExpiryInput";
  platformContract: typeof cardExpiryInputPlatformContract;
}

export const CardExpiryInput: CardExpiryInputComponent;
