import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { inputPlatformContract } from "@design-system/components/platforms";

export type InputVariant = "text" | "email" | "password" | "number" | "currency" | "unit" | "search";
export type InputDensity = "sm" | "md" | "lg";
export type InputState = "default" | "focus" | "filled" | "info" | "success" | "warning" | "loading" | "error" | "disabled";
export type InputAlign = "start" | "end";
export type InputValueMeta = {
  value: string;
  displayValue: string;
  rawValue: string;
  numericValue?: number | null;
};

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  helperText?: string;
  error?: string;
  live?: boolean;
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
  revealed?: boolean;
  revealLabel?: string;
  hideLabel?: string;
  locale?: string | string[];
  autocomplete?: string;
  onValueChange?: (value: string, meta: InputValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onRevealChange?: (revealed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface InputComponent extends ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>> {
  displayName: "Input";
  platformContract: typeof inputPlatformContract;
}

export const Input: InputComponent;
