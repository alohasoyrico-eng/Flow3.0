import type { ButtonHTMLAttributes, ForwardRefExoticComponent, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { selectPlatformContract } from "@design-system/components/platforms";

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
export type SelectValueChangeEvent = MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>;

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  helper?: string;
  icon?: string;
  options: SelectOption[];
  optionsLabel?: string;
  value?: string;
  name?: string;
  disabled?: boolean;
  density?: SelectDensity;
  variant?: SelectVariant;
  state?: SelectState;
  onValueChange?: (value: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => void;
}

export interface SelectComponent extends ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLButtonElement>> {
  displayName: "Select";
  platformContract: typeof selectPlatformContract;
}

export const Select: SelectComponent;
