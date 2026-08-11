import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type CheckboxGroupState = "none-selected" | "partial" | "all-selected" | "invalid" | "dirty" | "loading" | "disabled";
export type CheckboxGroupDensity = "sm" | "md" | "lg";

export interface CheckboxGroupOption {
  key?: string;
  label: string;
  value?: string;
  description?: string;
  meta?: string;
  disabled?: boolean;
  variant?: "default" | "descriptive" | "select-all" | "compact";
}

export interface CheckboxGroupValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface CheckboxGroupValueMeta {
  value: string;
  checked: boolean;
  indeterminate?: boolean;
  cleared?: boolean;
}

export interface CheckboxGroupProps extends FlowDataAttributes {
  label: string;
  helper?: string;
  density?: CheckboxGroupDensity;
  state?: CheckboxGroupState;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  options?: CheckboxGroupOption[];
  value?: string[];
  defaultValue?: string[];
  selectAllLabel?: string;
  clearLabel?: string;
  applyAction?: ButtonProps;
  validation?: CheckboxGroupValidation;
  className?: string;
  onValueChange?: (value: string[], meta: CheckboxGroupValueMeta, event?: MouseEvent<HTMLElement>) => void;
  onApply?: (value: string[], event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface CheckboxGroupComponent extends ForwardRefExoticComponent<CheckboxGroupProps & RefAttributes<HTMLDivElement>> {
  displayName: "CheckboxGroup";
}

export const CheckboxGroup: CheckboxGroupComponent;
