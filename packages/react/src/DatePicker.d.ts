import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { datePickerPlatformContract } from "@design-system/components/platforms";

export type DatePickerDensity = "sm" | "md" | "lg";
export type DatePickerState = "default" | "hover" | "focus" | "selected" | "warning" | "error" | "disabled";

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  density?: DatePickerDensity;
  state?: DatePickerState;
  invalid?: boolean;
  locale?: string | string[];
  weekdays?: string[];
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  open?: boolean;
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export interface DatePickerComponent extends ForwardRefExoticComponent<DatePickerProps & RefAttributes<HTMLButtonElement>> {
  displayName: "DatePicker";
  platformContract: typeof datePickerPlatformContract;
}

export const DatePicker: DatePickerComponent;
