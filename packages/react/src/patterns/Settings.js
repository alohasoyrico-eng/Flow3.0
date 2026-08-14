/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { Dialog } from "../Dialog.js";
import { Input } from "../Input.js";
import { Select } from "../Select.js";
import { Surface } from "../Surface.js";
import { Switch } from "../Switch.js";
import { Toast } from "../Toast.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeGroups(groups) {
    return (Array.isArray(groups) ? groups : [])
        .filter((group) => Boolean(group?.title))
        .map((group) => ({
        ...group,
        key: String(group.key ?? group.title),
        controls: (Array.isArray(group.controls) ? group.controls : []).filter((control) => Boolean(control?.label)),
    }));
}
function resolveState({ disabled, permissionBlocked, saving, resetting, validation, dirty, state }) {
    if (disabled)
        return "disabled";
    if (permissionBlocked)
        return "permission-blocked";
    if (validation?.state === "error" || state === "invalid")
        return "invalid";
    if (saving || state === "saving")
        return "saving";
    if (resetting || state === "resetting")
        return "resetting";
    if (state)
        return state;
    return dirty ? "dirty" : "idle";
}
function renderControl(control, inheritedDensity, isDisabled, onControlChange) {
    const key = String(control.key ?? control.name ?? control.label);
    const disabled = isDisabled || control.disabled;
    if (control.kind === "select") {
        return React.createElement(Select, {
            key,
            label: control.label,
            helper: control.description,
            options: control.options ?? [],
            value: control.value,
            name: control.name,
            disabled,
            density: control.density ?? inheritedDensity,
            state: disabled ? "disabled" : control.error ? "error" : control.value ? "filled" : "default",
            onValueChange: (value, meta, event) => onControlChange?.(key, value, meta, event),
        });
    }
    if (control.kind === "switch") {
        return React.createElement(Switch, {
            key,
            label: control.label,
            description: control.description,
            checked: Boolean(control.checked),
            name: control.name,
            disabled,
            density: control.density ?? inheritedDensity,
            state: disabled ? "disabled" : control.error ? "error" : control.checked ? "on" : "off",
            error: control.error,
            onCheckedChange: (checked, meta, event) => onControlChange?.(key, checked, meta, event),
        });
    }
    return React.createElement(Input, {
        key,
        label: control.label,
        helper: control.description,
        value: control.value ?? "",
        name: control.name ?? key,
        placeholder: control.placeholder,
        disabled,
        density: control.density ?? inheritedDensity,
        variant: control.variant ?? "text",
        state: disabled ? "disabled" : control.error ? "error" : control.value ? "filled" : "default",
        error: control.error,
        onValueChange: (value, meta, event) => onControlChange?.(key, value, meta, event),
    });
}
export const Settings = forwardRef(function Settings({ label = "Settings", description, density, state, dirty = false, saving = false, resetting = false, disabled = false, permissionBlocked = false, groups = [], summary, validation, confirmation, feedback, saveAction, resetAction, onControlChange, onSave, onReset, className = "", ...rest }, ref) {
    const normalizedGroups = normalizeGroups(groups);
    const resolvedState = resolveState({ disabled, permissionBlocked, saving, resetting, validation, dirty, state });
    const isDisabled = disabled || permissionBlocked || resolvedState === "saving" || resolvedState === "resetting";
    const visibleControlCount = normalizedGroups.reduce((total, group) => total + group.controls.length, 0);
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "saving" || resolvedState === "resetting" ? "true" : undefined,
        "data-flow-pattern": "settings",
        "data-state": resolvedState,
        "data-density": density,
        "data-group-count": String(normalizedGroups.length),
        "data-control-count": String(visibleControlCount),
        ...sanitizeRestProps(rest),
    }, summary?.title
        ? React.createElement(Card, {
            title: summary.title,
            value: summary.value,
            detail: summary.detail ?? description,
            status: summary.status ?? (dirty ? "Unsaved changes" : "Saved"),
            density,
            composition: "compact",
            variant: "minimal",
            state: resolvedState === "invalid" ? "error" : isDisabled ? "disabled" : dirty ? "selected" : "default",
            fullWidth: true,
        })
        : null, normalizedGroups.map((group) => React.createElement(Surface, {
        key: group.key,
        surfaceRole: "section",
        density,
        state: isDisabled ? "disabled" : dirty ? "selected" : "default",
        "data-flow-slot": "groups",
        "data-settings-group": group.key,
        "aria-label": group.title,
    }, React.createElement(Card, {
        title: group.title,
        detail: group.description,
        density,
        composition: "compact",
        variant: "ghost",
        state: isDisabled ? "disabled" : "default",
        fullWidth: true,
    }), group.controls.map((control) => renderControl(control, density, isDisabled, onControlChange)))), confirmation?.label
        ? React.createElement(Dialog, {
            label: confirmation.label,
            description: confirmation.description,
            open: confirmation.open,
            closeLabel: confirmation.closeLabel ?? "Close",
            actions: confirmation.actions ?? [],
            tone: confirmation.tone ?? "neutral",
            variant: confirmation.variant ?? "review",
            density,
            onOpenChange: confirmation.onOpenChange,
            onAction: confirmation.onAction,
        })
        : null, saveAction?.label
        ? React.createElement(Button, {
            ...saveAction,
            label: saveAction.label,
            variant: saveAction.variant ?? "primary",
            density: saveAction.density ?? density,
            disabled: isDisabled || !dirty || saveAction.disabled,
            loading: saving || saveAction.loading,
            onClick: (event) => {
                saveAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onSave?.(event);
            },
        })
        : null, resetAction?.label
        ? React.createElement(Button, {
            ...resetAction,
            label: resetAction.label,
            variant: resetAction.variant ?? "secondary",
            density: resetAction.density ?? density,
            disabled: isDisabled || !dirty || resetAction.disabled,
            loading: resetting || resetAction.loading,
            onClick: (event) => {
                resetAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onReset?.(event);
            },
        })
        : null, validation?.message
        ? React.createElement(Toast, {
            label: validation.message,
            description: validation.description,
            tone: validation.state === "error" ? "danger" : validation.state ?? "info",
            variant: "warning",
            state: "visible",
            density,
        })
        : null, feedback?.label
        ? React.createElement(Toast, {
            ...feedback,
            label: feedback.label,
            tone: feedback.tone ?? "info",
            variant: feedback.variant ?? "status",
            state: feedback.state ?? "visible",
            density: feedback.density ?? density,
        })
        : null);
});
Settings.displayName = "Settings";
