import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { selectPlatformContract } from "../../components/src/platforms/index.js";

export type SelectDensity = "sm" | "md" | "lg";
export type SelectVariant = "default" | "inline";
export type SelectState = "default" | "open" | "focus" | "filled" | "loading" | "error" | "disabled";
export type SelectOption = {
  label: string;
  value?: string;
  meta?: string;
  disabled?: boolean;
};
export type SelectValueMeta = {
  label: string;
  meta: string;
};

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "value" | "onChange"> {
  label: string;
  helper?: string;
  icon?: string;
  options: SelectOption[];
  value?: string;
  name?: string;
  disabled?: boolean;
  density?: SelectDensity;
  variant?: SelectVariant;
  state?: SelectState;
  onValueChange?: (value: string, meta: SelectValueMeta) => void;
}

export interface SelectComponent extends ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLButtonElement>> {
  displayName: "Select";
  platformContract: typeof selectPlatformContract;
}

export const Select: SelectComponent;
