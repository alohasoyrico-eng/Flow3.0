import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { checkboxPlatformContract } from "#flow/platforms";

export type CheckboxVariant = "default" | "descriptive" | "select-all" | "compact";
export type CheckboxState = "unchecked" | "checked" | "indeterminate" | "focus" | "error" | "disabled";
export type CheckboxDensity = "sm" | "md" | "lg";

export interface CheckboxValueMeta {
  indeterminate: boolean;
  value: string;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "type" | "checked" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
  onCheckedChange?: (checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface CheckboxComponent extends ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>> {
  displayName: "Checkbox";
  platformContract: typeof checkboxPlatformContract;
}

export const Checkbox: CheckboxComponent;
