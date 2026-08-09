import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { cardNumberInputPlatformContract } from "#flow/platforms";

export type CardNumberInputDensity = "sm" | "md" | "lg";
export type CardNumberInputState = "default" | "filled" | "valid" | "loading" | "error" | "disabled";
export type CardNumberMeta = {
  formatted: string;
  validity: "empty" | "incomplete" | "valid" | "invalid";
  brand: string;
  luhnValid: boolean;
};

export interface CardNumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  error?: string;
  value?: string;
  density?: CardNumberInputDensity;
  state?: CardNumberInputState;
  loading?: boolean;
  validationMessage?: string;
  onValueChange?: (digits: string, meta: CardNumberMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CardNumberInputComponent extends ForwardRefExoticComponent<CardNumberInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CardNumberInput";
  platformContract: typeof cardNumberInputPlatformContract;
}

export const CardNumberInput: CardNumberInputComponent;
