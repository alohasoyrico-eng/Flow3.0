import type { ChangeEvent, FocusEvent, ForwardRefExoticComponent, InputHTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { comboboxPlatformContract } from "@design-system/components/platforms";

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

export type ComboboxValueChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | KeyboardEvent<HTMLInputElement>
  | MouseEvent<HTMLSpanElement>
  | MouseEvent<HTMLButtonElement>;
export type ComboboxOpenChangeEvent =
  | FocusEvent<HTMLInputElement>
  | ChangeEvent<HTMLInputElement>
  | KeyboardEvent<HTMLInputElement>
  | MouseEvent<HTMLSpanElement>
  | MouseEvent<HTMLButtonElement>;

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "onChange" | "value" | "size" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  icon?: string;
  options: ComboboxOption[];
  optionsLabel?: string;
  clearSelectionLabel?: string;
  value?: string;
  name?: string;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  density?: ComboboxDensity;
  state?: ComboboxState;
  open?: boolean;
  onValueChange?: (value: string, meta: ComboboxValueMeta, event: ComboboxValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: ComboboxOpenChangeEvent) => void;
}

export interface ComboboxComponent extends ForwardRefExoticComponent<ComboboxProps & RefAttributes<HTMLInputElement>> {
  displayName: "Combobox";
  platformContract: typeof comboboxPlatformContract;
}

export const Combobox: ComboboxComponent;
