import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { checkboxPlatformContract } from "../../components/src/platforms/index.js";

export type CheckboxVariant = "default" | "descriptive" | "select-all" | "compact";
export type CheckboxState = "unchecked" | "checked" | "indeterminate" | "focus" | "error" | "disabled";
export type CheckboxDensity = "sm" | "md" | "lg";

export interface CheckboxValueMeta {
  indeterminate: boolean;
  value: string;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "value" | "onChange"> {
  label: string;
  description?: string;
  error?: string;
  variant?: CheckboxVariant;
  state?: CheckboxState;
  density?: CheckboxDensity;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean, meta: CheckboxValueMeta) => void;
  className?: string;
}

export interface CheckboxComponent extends ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>> {
  displayName: "Checkbox";
  platformContract: typeof checkboxPlatformContract;
}

export const Checkbox: CheckboxComponent;
