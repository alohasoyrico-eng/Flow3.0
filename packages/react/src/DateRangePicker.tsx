import React, {
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
  forwardRef,
} from "react";
import { dateRangePickerPlatformContract } from "@design-system/components/platforms";
import {
  DatePicker,
  type DatePickerDensity,
  type DatePickerOpenChangeEvent,
  type DatePickerPreset,
  type DatePickerRangeValue,
  type DatePickerState,
  type DatePickerValueChangeEvent,
} from "./DatePicker.js";
import { type FlowDataAttributes } from "./internal/props.js";

export type DateRangePickerDensity = DatePickerDensity;
export type DateRangePickerState = DatePickerState;
export type DateRangePickerValue = DatePickerRangeValue;
export type DateRangePickerPreset = DatePickerPreset;
export type DateRangePickerLocale = string | string[] | undefined;
export type DateRangePickerValueChangeEvent = DatePickerValueChangeEvent;
export type DateRangePickerOpenChangeEvent = DatePickerOpenChangeEvent;

export interface DateRangePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: DateRangePickerValue;
  from?: string;
  to?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  density?: DateRangePickerDensity;
  state?: DateRangePickerState;
  invalid?: boolean;
  locale?: string | string[];
  weekdays?: string[];
  calendarLabel?: string;
  monthSelectLabel?: string;
  yearSelectLabel?: string;
  previousYearLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  nextYearLabel?: string;
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

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(function DateRangePicker({
  value,
  from,
  to,
  className = "",
  onValueChange,
  onOpenChange,
  ...props
}, ref) {
  const rangeValue = value ?? { from: from ?? "", to: to ?? "" };
  return React.createElement(DatePicker, {
    ...props,
    ref,
    mode: "range",
    value: rangeValue,
    className: ["date-range-picker", className].filter(Boolean).join(" "),
    onValueChange: (nextValue, event) => onValueChange?.(nextValue as DateRangePickerValue, event),
    ...(onOpenChange ? { onOpenChange } : {}),
  });
}) as DateRangePickerComponent;

DateRangePicker.displayName = "DateRangePicker";
DateRangePicker.platformContract = dateRangePickerPlatformContract;
