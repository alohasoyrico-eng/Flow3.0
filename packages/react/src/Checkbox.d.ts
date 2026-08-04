import type { checkboxPlatformContract } from "@design-system/components/platforms";

export type CheckboxVariant = "default" | "descriptive" | "select-all" | "compact";
export type CheckboxState = "unchecked" | "checked" | "indeterminate" | "focus" | "error" | "disabled";
export type CheckboxDensity = "sm" | "md" | "lg";

export interface CheckboxValueMeta {
  indeterminate: boolean;
  value: string;
}

export interface CheckboxProps {
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

export interface CheckboxComponent {
  (props: CheckboxProps): unknown;
  displayName?: string;
  platformContract: typeof checkboxPlatformContract;
}

export const Checkbox: CheckboxComponent;
