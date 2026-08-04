import type { radioButtonPlatformContract } from "@design-system/components/platforms";

export type RadioButtonVariant = "default" | "descriptive" | "compact" | "critical";
export type RadioButtonState = "unselected" | "selected" | "focus" | "error" | "disabled";
export type RadioButtonDensity = "sm" | "md" | "lg";

export interface RadioButtonValueMeta {
  value: string;
}

export interface RadioButtonProps {
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

export interface RadioButtonComponent {
  (props: RadioButtonProps): unknown;
  displayName?: string;
  platformContract: typeof radioButtonPlatformContract;
}

export const RadioButton: RadioButtonComponent;
