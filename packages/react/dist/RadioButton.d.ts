import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { radioButtonPlatformContract } from "#flow/platforms";

export type RadioButtonVariant = "default" | "descriptive" | "compact" | "critical";
export type RadioButtonState = "unselected" | "selected" | "focus" | "error" | "disabled";
export type RadioButtonDensity = "sm" | "md" | "lg";

export interface RadioButtonValueMeta {
  value: string;
}

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "value" | "onChange"> {
  label: string;
  description?: string;
  error?: string;
  variant?: RadioButtonVariant;
  state?: RadioButtonState;
  density?: RadioButtonDensity;
  checked?: boolean;
  disabled?: boolean;
  name: string;
  value?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean, meta: RadioButtonValueMeta) => void;
  className?: string;
}

export interface RadioButtonComponent extends ForwardRefExoticComponent<RadioButtonProps & RefAttributes<HTMLInputElement>> {
  displayName: "RadioButton";
  platformContract: typeof radioButtonPlatformContract;
}

export const RadioButton: RadioButtonComponent;
