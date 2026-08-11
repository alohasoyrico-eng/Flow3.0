import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { inputAmountPlatformContract } from "@design-system/components/platforms";

export type InputAmountDensity = "sm" | "md" | "lg";
export type InputAmountState = "default" | "filled" | "loading" | "error" | "disabled";
export type InputAmountMeta = {
  value: string;
  displayValue: string;
  rawValue: string;
  numericValue: number | null;
  currency: string;
  formatted: string;
};

export interface InputAmountProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  helper?: string;
  helperText?: string;
  error?: string;
  density?: InputAmountDensity;
  state?: InputAmountState;
  loading?: boolean;
  currency?: string;
  locale?: string | string[];
  prefix?: string;
  suffix?: string;
  validationMessage?: string;
  onValueChange?: (value: string, meta: InputAmountMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface InputAmountComponent extends ForwardRefExoticComponent<InputAmountProps & RefAttributes<HTMLInputElement>> {
  displayName: "InputAmount";
  platformContract: typeof inputAmountPlatformContract;
}

export const InputAmount: InputAmountComponent;
