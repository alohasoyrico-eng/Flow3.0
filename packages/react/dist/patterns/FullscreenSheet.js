import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { CardSummary } from "../CardSummary.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { Select } from "../Select.js";
import { Stepper } from "../Stepper.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
import { ActionSheet } from "./ActionSheet.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ open, dirty, validating, saving, error, dismissConfirming, disabled, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (dismissConfirming || state === "dismiss-confirming")
        return "dismiss-confirming";
    if (error || state === "error")
        return "error";
    if (saving || state === "saving")
        return "saving";
    if (validating || state === "validating")
        return "validating";
    if (dirty || state === "dirty")
        return "dirty";
    if (open || state === "open")
        return "open";
    return state ?? "closed";
}
function fieldKey(field, index) {
    return field.key ?? field.name ?? `${field.kind ?? "input"}-${index}`;
}
function renderField(field, index, density, isDisabled, validating) {
    const common = {
        key: fieldKey(field, index),
        label: field.label,
        helper: field.helper,
        name: field.name,
        density: field.density ?? density,
        disabled: isDisabled || field.disabled,
    };
    if (field.kind === "select") {
        const selectField = field;
        return React.createElement(Select, {
            ...common,
            options: field.options ?? [],
            value: field.value,
            open: field.open,
            state: field.state ?? (selectField.error ? "error" : field.value ? "filled" : "default"),
            onValueChange: field.onValueChange,
            onOpenChange: field.onOpenChange,
        });
    }
    return React.createElement(Input, {
        ...common,
        value: field.value,
        placeholder: field.placeholder,
        error: field.error,
        readOnly: field.readOnly,
        variant: field.variant ?? "default",
        state: field.state ?? (validating ? "loading" : field.error ? "error" : field.value ? "filled" : "default"),
        onValueChange: field.onValueChange,
    });
}
export const FullscreenSheet = forwardRef(function FullscreenSheet({ label = "Fullscreen sheet", description, density, state, open = false, dirty = false, validating = false, saving = false, disabled = false, dismissConfirming = false, summary, steps = [], currentStep = 0, fields = [], validation, primaryAction, secondaryAction, closeAction, actionSheet, feedback, error, className = "", onClose, ...rest }, ref) {
    const normalizedFields = (Array.isArray(fields) ? fields : []).filter((field) => field?.label);
    const resolvedState = resolveState({
        open,
        dirty,
        validating,
        saving,
        error: Boolean(error || validation?.state === "error" || feedback?.tone === "danger"),
        dismissConfirming,
        disabled,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "saving";
    const isBusy = resolvedState === "validating" || resolvedState === "saving";
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": isBusy ? "true" : undefined,
        "data-flow-pattern": "fullscreen-sheet",
        "data-state": resolvedState,
        "data-density": density,
        "data-field-count": String(normalizedFields.length),
        "data-action-sheet-boundary": actionSheet ? "true" : "false",
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "overlay",
        state: (open ? "overlay" : isDisabled ? "disabled" : "default"),
        ...(density ? { density: density } : {}),
        "data-sheet-open": open ? "true" : "false",
    }, summary
        ? React.createElement(CardSummary, {
            ...summary,
            label: summary.label ?? label,
            density: summary.density ?? density,
            state: summary.state ?? (isDisabled ? "disabled" : resolvedState === "error" ? "warning" : "default"),
            fullWidth: summary.fullWidth ?? true,
        })
        : null, steps.length
        ? React.createElement(Stepper, {
            label: `${label} progress`,
            steps,
            current: currentStep,
            orientation: "horizontal",
            density,
        })
        : null, description ? React.createElement("p", null, description) : null, normalizedFields.map((field, index) => renderField(field, index, density, isDisabled, resolvedState === "validating")), validation
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            value: validation.value,
            message: validation.message,
            state: validation.state ?? (resolvedState === "error" ? "error" : "info"),
            density,
            fullWidth: true,
            field: validation.field ?? true,
            live: validation.live ?? true,
        })
        : null, primaryAction
        ? React.createElement(Button, {
            ...primaryAction,
            label: primaryAction.label,
            variant: primaryAction.variant ?? "primary",
            density: primaryAction.density ?? density,
            disabled: isDisabled || primaryAction.disabled,
            loading: resolvedState === "saving" || primaryAction.loading,
        })
        : null, secondaryAction
        ? React.createElement(Button, {
            ...secondaryAction,
            label: secondaryAction.label,
            variant: secondaryAction.variant ?? "secondary",
            density: secondaryAction.density ?? density,
            disabled: isDisabled || secondaryAction.disabled,
        })
        : null, closeAction
        ? React.createElement(Button, {
            ...closeAction,
            label: closeAction.label ?? "Close",
            variant: closeAction.variant ?? "ghost",
            density: closeAction.density ?? density,
            disabled: closeAction.disabled,
            onClick: closeAction.onClick ?? onClose,
        })
        : null, actionSheet
        ? React.createElement(ActionSheet, {
            ...actionSheet,
            density: actionSheet.density ?? density,
            open: actionSheet.open ?? false,
        })
        : null, error
        ? React.createElement(Toast, {
            label: error.label ?? "Sheet error",
            description: error.description,
            tone: "danger",
            variant: "recovery",
            state: "visible",
            density,
            actionLabel: error.actionLabel,
            dismissible: error.dismissible ?? true,
            onAction: error.onAction,
            onDismiss: error.onDismiss,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null));
});
FullscreenSheet.displayName = "FullscreenSheet";
