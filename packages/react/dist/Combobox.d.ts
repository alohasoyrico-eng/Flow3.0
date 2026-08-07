import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import type { comboboxPlatformContract } from "#flow/platforms";

export type ComboboxDensity = "sm" | "md" | "lg";
export type ComboboxState = "default" | "open" | "focus" | "filled" | "empty" | "error" | "disabled";

export interface ComboboxOption {
  label: string;
  value?: string;
  meta?: string;
  disabled?: boolean;
}

export interface ComboboxValueMeta {
  label: string;
  meta: string;
  inputValue?: string;
  cleared?: boolean;
}

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "onChange" | "value" | "size"> {
  label: string;
  helper?: string;
  icon?: string;
  options: ComboboxOption[];
  value?: string;
  name?: string;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  density?: ComboboxDensity;
  state?: ComboboxState;
  onValueChange?: (value: string, meta: ComboboxValueMeta) => void;
}

export interface ComboboxComponent extends ForwardRefExoticComponent<ComboboxProps & RefAttributes<HTMLInputElement>> {
  displayName: "Combobox";
  platformContract: typeof comboboxPlatformContract;
}

export const Combobox: ComboboxComponent;
