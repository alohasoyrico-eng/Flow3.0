import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { inputPlatformContract } from "#flow/platforms";

export type InputVariant = "text" | "email" | "password" | "number" | "currency" | "unit" | "search";
export type InputDensity = "sm" | "md" | "lg";
export type InputState = "default" | "focus" | "filled" | "loading" | "error" | "disabled";
export type InputAlign = "start" | "end";
export type InputValueMeta = {
  value: string;
  displayValue: string;
  rawValue: string;
  numericValue?: number | null;
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label?: string;
  helper?: string;
  helperText?: string;
  error?: string;
  value?: string;
  density?: InputDensity;
  state?: InputState;
  variant?: InputVariant;
  icon?: string;
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  loading?: boolean;
  align?: InputAlign;
  revealable?: boolean;
  revealLabel?: string;
  hideLabel?: string;
  locale?: string | string[];
  autocomplete?: string;
  onValueChange?: (value: string, meta: InputValueMeta) => void;
}

export interface InputComponent extends ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>> {
  displayName: "Input";
  platformContract: typeof inputPlatformContract;
}

export const Input: InputComponent;
