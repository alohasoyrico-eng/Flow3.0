import type { ButtonHTMLAttributes, ChangeEvent, ForwardRefExoticComponent, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { dateRangePickerPlatformContract } from "#flow/platforms";

export type DateRangePickerDensity = "sm" | "md" | "lg";
export type DateRangePickerState = "default" | "hover" | "focus" | "selected" | "warning" | "error" | "disabled";
export type DateRangePickerValue = { from?: string; to?: string };
export type DateRangePickerPreset = { key: string; label: string; days: number };
export type DateRangePickerValueChangeEvent =
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLButtonElement>
  | ChangeEvent<HTMLInputElement>;
export type DateRangePickerOpenChangeEvent = DateRangePickerValueChangeEvent | globalThis.MouseEvent;

export interface DateRangePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: DateRangePickerValue;
  from?: string;
  to?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  density?: DateRangePickerDensity;
  state?: DateRangePickerState;
  invalid?: boolean;
  locale?: string | string[];
  weekdays?: string[];
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  presets?: boolean;
  presetItems?: DateRangePickerPreset[];
  open?: boolean;
  onValueChange?: (value: DateRangePickerValue, event: DateRangePickerValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: DateRangePickerOpenChangeEvent) => void;
}

export interface DateRangePickerComponent extends ForwardRefExoticComponent<DateRangePickerProps & RefAttributes<HTMLButtonElement>> {
  displayName: "DateRangePicker";
  platformContract: typeof dateRangePickerPlatformContract;
}

export const DateRangePicker: DateRangePickerComponent;
