/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { dateRangePickerPlatformContract } from "@design-system/components/platforms";
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
