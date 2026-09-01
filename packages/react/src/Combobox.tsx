import React, {
  type ChangeEvent,
  type FocusEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { comboboxPlatformContract } from "@design-system/components/platforms";
import { Select } from "./Select.js";
import type {
  SelectOpenChangeEvent,
  SelectOption,
  SelectValueChangeEvent,
  SelectValueMeta,
} from "./Select.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type ComboboxDensity = "sm" | "md" | "lg";
export type ComboboxState = "default" | "open" | "focus" | "filled" | "empty" | "loading" | "error" | "disabled";

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
  | MouseEvent<HTMLInputElement>
  | MouseEvent<HTMLSpanElement>
  | MouseEvent<HTMLButtonElement>
  | globalThis.MouseEvent;

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
  loadingText?: string;
  disabled?: boolean;
  loading?: boolean;
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

function selectStateFor(state: ComboboxState | undefined): "default" | "open" | "focus" | "filled" | "empty" | "loading" | "error" | "disabled" | undefined {
  return state;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox({
  label,
  helper = "",
  icon = "search",
  options,
  optionsLabel,
  clearSelectionLabel,
  value,
  name = "",
  placeholder = "",
  emptyText,
  loadingText = "Loading results",
  disabled = false,
  loading = false,
  density,
  state,
  open,
  onValueChange,
  onOpenChange,
  className = "",
  id,
  ...rest
}, ref) {
  if (!label) return null;

  const SelectCompat = Select as unknown as ForwardRefExoticComponent<Record<string, unknown> & RefAttributes<HTMLInputElement>>;

  return React.createElement(SelectCompat, {
    ...(rest as Record<string, unknown>),
    ref,
    id,
    className,
    label,
    helper,
    icon,
    options: options as SelectOption[],
    optionsLabel,
    clearSelectionLabel,
    value,
    name,
    placeholder,
    searchable: true,
    clearable: Boolean(clearSelectionLabel),
    emptyText,
    loadingText,
    disabled,
    loading,
    density,
    state: selectStateFor(state),
    open,
    "data-combobox-compat": "",
    onValueChange: (nextValue: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => {
      onValueChange?.(nextValue, meta, event as ComboboxValueChangeEvent);
    },
    onOpenChange: (nextOpen: boolean, event?: SelectOpenChangeEvent) => {
      onOpenChange?.(nextOpen, event as ComboboxOpenChangeEvent | undefined);
    },
  });
}) as ComboboxComponent;

Combobox.displayName = "Combobox";
Combobox.platformContract = comboboxPlatformContract;
