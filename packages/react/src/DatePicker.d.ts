import type { ButtonHTMLAttributes, ChangeEvent, ForwardRefExoticComponent, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { datePickerPlatformContract } from "@design-system/components/platforms";

export type DatePickerDensity = "sm" | "md" | "lg";
export type DatePickerState = "default" | "hover" | "focus" | "selected" | "warning" | "error" | "disabled";
export type DatePickerValueChangeEvent =
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLButtonElement>
  | ChangeEvent<HTMLInputElement>;
export type DatePickerOpenChangeEvent = DatePickerValueChangeEvent | KeyboardEvent<HTMLDivElement> | globalThis.MouseEvent;

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
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
  monthSelectLabel?: string;
  yearSelectLabel?: string;
  previousYearLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  nextYearLabel?: string;
  open?: boolean;
  onValueChange?: (value: string, event: DatePickerValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: DatePickerOpenChangeEvent) => void;
}

export interface DatePickerComponent extends ForwardRefExoticComponent<DatePickerProps & RefAttributes<HTMLButtonElement>> {
  displayName: "DatePicker";
  platformContract: typeof datePickerPlatformContract;
}

export const DatePicker: DatePickerComponent;
