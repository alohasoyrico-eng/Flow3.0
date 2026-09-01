import type { ButtonHTMLAttributes, ChangeEvent, ForwardRefExoticComponent, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { selectPlatformContract } from "#flow/platforms";

export type SelectDensity = "sm" | "md" | "lg";
export type SelectVariant = "default" | "inline";
export type SelectState = "default" | "open" | "focus" | "filled" | "empty" | "loading" | "error" | "disabled";
export type SelectOption = {
  label: string;
  value?: string;
  meta?: string;
  disabled?: boolean;
};
export type SelectValueMeta = {
  label: string;
  meta: string;
  inputValue?: string;
  cleared?: boolean;
};
export type SelectValueChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | MouseEvent<HTMLSpanElement>
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLSpanElement>
  | KeyboardEvent<HTMLInputElement>;
export type SelectOpenChangeEvent =
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLSpanElement>
  | MouseEvent<HTMLSpanElement>
  | MouseEvent<HTMLInputElement>
  | KeyboardEvent<HTMLInputElement>
  | ChangeEvent<HTMLInputElement>
  | globalThis.MouseEvent;

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  icon?: string;
  options: SelectOption[];
  optionsLabel?: string;
  searchable?: boolean;
  clearable?: boolean;
  clearSelectionLabel?: string;
  value?: string;
  name?: string;
  placeholder?: string;
  emptyText?: string;
  loadingText?: string;
  disabled?: boolean;
  loading?: boolean;
  density?: SelectDensity;
  variant?: SelectVariant;
  state?: SelectState;
  open?: boolean;
  onValueChange?: (value: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: SelectOpenChangeEvent) => void;
}

export interface SelectComponent extends ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLButtonElement>> {
  displayName: "Select";
  platformContract: typeof selectPlatformContract;
}

export const Select: SelectComponent;
