import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type RadioGroupState = "unselected" | "selected" | "invalid" | "dirty" | "loading" | "permission-blocked" | "disabled";
export type RadioGroupDensity = "sm" | "md" | "lg";

export interface RadioGroupOption {
  key?: string;
  label: string;
  value?: string;
  description?: string;
  meta?: string;
  disabled?: boolean;
  variant?: "default" | "descriptive" | "compact" | "critical";
}

export interface RadioGroupValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface RadioGroupValueMeta {
  value: string;
  option?: RadioGroupOption;
  cleared?: boolean;
}

export interface RadioGroupProps extends FlowDataAttributes {
  label: string;
  helper?: string;
  density?: RadioGroupDensity;
  state?: RadioGroupState;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  name?: string;
  options?: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  clearLabel?: string;
  applyAction?: ButtonProps;
  validation?: RadioGroupValidation;
  className?: string;
  onValueChange?: (value: string, meta: RadioGroupValueMeta, event?: MouseEvent<HTMLElement>) => void;
  onApply?: (value: string | undefined, event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface RadioGroupComponent extends ForwardRefExoticComponent<RadioGroupProps & RefAttributes<HTMLDivElement>> {
  displayName: "RadioGroup";
}

export const RadioGroup: RadioGroupComponent;
