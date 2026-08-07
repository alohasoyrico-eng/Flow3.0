import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { dateRangePickerPlatformContract } from "#flow/platforms";

export type DateRangePickerDensity = "sm" | "md" | "lg";
export type DateRangePickerState = "default" | "hover" | "focus" | "selected" | "warning" | "error" | "disabled";
export type DateRangePickerValue = { from?: string; to?: string };
export type DateRangePickerPreset = { label: string; days: number };

export interface DateRangePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label?: string;
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
  onValueChange?: (value: DateRangePickerValue) => void;
  onOpenChange?: (open: boolean) => void;
}

export interface DateRangePickerComponent extends ForwardRefExoticComponent<DateRangePickerProps & RefAttributes<HTMLButtonElement>> {
  displayName: "DateRangePicker";
  platformContract: typeof dateRangePickerPlatformContract;
}

export const DateRangePicker: DateRangePickerComponent;
