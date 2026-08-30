import React, { forwardRef, } from "react";
import { dateRangePickerPlatformContract } from "#flow/platforms";
import { DatePicker, } from "./DatePicker.js";
export const DateRangePicker = forwardRef(function DateRangePicker({ value, from, to, className = "", onValueChange, onOpenChange, ...props }, ref) {
    const rangeValue = value ?? { from: from ?? "", to: to ?? "" };
    return React.createElement(DatePicker, {
        ...props,
        ref,
        mode: "range",
        value: rangeValue,
        className: ["date-range-picker", className].filter(Boolean).join(" "),
        onValueChange: (nextValue, event) => onValueChange?.(nextValue, event),
        ...(onOpenChange ? { onOpenChange } : {}),
    });
});
DateRangePicker.displayName = "DateRangePicker";
DateRangePicker.platformContract = dateRangePickerPlatformContract;
