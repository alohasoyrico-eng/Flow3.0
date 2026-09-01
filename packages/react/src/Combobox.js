/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { comboboxPlatformContract } from "@design-system/components/platforms";
import { Select } from "./Select.js";
function selectStateFor(state) {
    return state;
}
export const Combobox = forwardRef(function Combobox({ label, helper = "", icon = "search", options, optionsLabel, clearSelectionLabel, value, name = "", placeholder = "", emptyText, loadingText = "Loading results", disabled = false, loading = false, density, state, open, onValueChange, onOpenChange, className = "", id, ...rest }, ref) {
    if (!label)
        return null;
    const SelectCompat = Select;
    return React.createElement(SelectCompat, {
        ...rest,
        ref,
        id,
        className,
        label,
        helper,
        icon,
        options: options,
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
        onValueChange: (nextValue, meta, event) => {
            onValueChange?.(nextValue, meta, event);
        },
        onOpenChange: (nextOpen, event) => {
            onOpenChange?.(nextOpen, event);
        },
    });
});
Combobox.displayName = "Combobox";
Combobox.platformContract = comboboxPlatformContract;
