import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { CardExpiryInput } from "../CardExpiryInput.js";
import { CardNumberInput } from "../CardNumberInput.js";
import { CardSecurityCodeInput } from "../CardSecurityCodeInput.js";
import { InlineValidation } from "../InlineValidation.js";
import { InputAmount } from "../InputAmount.js";
import { Surface } from "../Surface.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, loading, error, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (error || state === "error")
        return "error";
    if (state === "success")
        return "success";
    if (state === "review")
        return "review";
    return state ?? "default";
}
function surfaceStateFor(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "error" || resolvedState === "review")
        return "raised";
    if (resolvedState === "loading")
        return "sunken";
    return "default";
}
function fieldStateFor(resolvedState, field = {}) {
    if (resolvedState === "disabled" || field.disabled)
        return "disabled";
    if (resolvedState === "loading" || field.loading)
        return "loading";
    if (field.error || field.state === "error")
        return "error";
    if (field.state)
        return field.state;
    if (field.value)
        return "filled";
    return "default";
}
function actionStateFor(resolvedState, action = {}) {
    if (resolvedState === "loading" || action.loading)
        return "loading";
    if (resolvedState === "disabled" || action.disabled)
        return "disabled";
    return action.state ?? "default";
}
export const PaymentForm = forwardRef(function PaymentForm({ label = "Payment form", description, density, state, disabled = false, loading = false, error, cardNumber = {}, expiry = {}, securityCode = {}, amount = {}, validation, feedback, submitAction = { key: "submit", label: "Continue" }, secondaryAction, onCardNumberChange, onExpiryChange, onSecurityCodeChange, onAmountChange, onSubmit, onSecondaryAction, onFeedbackAction, className = "", ...rest }, ref) {
    const resolvedState = resolveState({ disabled, loading, error, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isLoading = loading || resolvedState === "loading";
    return React.createElement(Surface, {
        ref,
        className,
        surfaceRole: "section",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        focusMode: "within",
        role: "group",
        "aria-label": label,
        "aria-description": description,
        "aria-busy": isLoading ? "true" : undefined,
        "data-flow-pattern": "payment-form",
        "data-flow-slot": "paymentSurface",
        "data-state": resolvedState,
        "data-density": density,
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "panel",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        "data-flow-slot": "card-fields",
        "data-payment-section": "card",
    }, React.createElement(CardNumberInput, {
        ...cardNumber,
        label: cardNumber.label ?? "Card number",
        value: cardNumber.value,
        helper: cardNumber.helper,
        error: cardNumber.error,
        density: cardNumber.density ?? density,
        state: fieldStateFor(resolvedState, cardNumber),
        loading: isLoading || cardNumber.loading,
        disabled: isDisabled || cardNumber.disabled,
        onValueChange: (digits, meta, event) => {
            cardNumber.onValueChange?.(digits, meta, event);
            if (event.defaultPrevented)
                return;
            onCardNumberChange?.(digits, meta, event);
        },
    }), React.createElement(CardExpiryInput, {
        ...expiry,
        label: expiry.label ?? "Expiry date",
        value: expiry.value,
        helper: expiry.helper,
        error: expiry.error,
        density: expiry.density ?? density,
        state: fieldStateFor(resolvedState, expiry),
        loading: isLoading || expiry.loading,
        disabled: isDisabled || expiry.disabled,
        onValueChange: (value, meta, event) => {
            expiry.onValueChange?.(value, meta, event);
            if (event.defaultPrevented)
                return;
            onExpiryChange?.(value, meta, event);
        },
    }), React.createElement(CardSecurityCodeInput, {
        ...securityCode,
        label: securityCode.label ?? "Security code",
        value: securityCode.value,
        helper: securityCode.helper,
        error: securityCode.error,
        density: securityCode.density ?? density,
        state: fieldStateFor(resolvedState, securityCode),
        loading: isLoading || securityCode.loading,
        disabled: isDisabled || securityCode.disabled,
        onValueChange: (digits, meta, event) => {
            securityCode.onValueChange?.(digits, meta, event);
            if (event.defaultPrevented)
                return;
            onSecurityCodeChange?.(digits, meta, event);
        },
    })), amount
        ? React.createElement(Surface, {
            surfaceRole: "panel",
            state: surfaceStateFor(resolvedState),
            density,
            elevation: "none",
            "data-flow-slot": "amount-fields",
            "data-payment-section": "amount",
        }, React.createElement(InputAmount, {
            ...amount,
            label: amount.label ?? "Amount",
            value: amount.value,
            helper: amount.helper,
            error: amount.error,
            currency: amount.currency ?? "MXN",
            density: amount.density ?? density,
            state: fieldStateFor(resolvedState, amount),
            loading: isLoading || amount.loading,
            disabled: isDisabled || amount.disabled,
            onValueChange: (value, meta, event) => {
                amount.onValueChange?.(value, meta, event);
                if (event.defaultPrevented)
                    return;
                onAmountChange?.(value, meta, event);
            },
        }))
        : null, validation?.message
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            state: validation.state ?? (error ? "error" : "info"),
            field: validation.field ?? false,
            live: validation.live ?? true,
            density: validation.density ?? density,
            "data-flow-slot": "validation",
        })
        : null, feedback?.kind || feedback?.title || feedback?.description
        ? React.createElement(StatusFeedbackView, {
            ...feedback,
            label: feedback.label ?? `${label} status`,
            density: feedback.density ?? density,
            state: feedback.state ?? (error ? "error" : resolvedState),
            onAction: (key, event) => {
                feedback.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onFeedbackAction?.(key, event);
            },
            "data-flow-pattern-boundary": "status-feedback-view",
        })
        : null, React.createElement(Surface, {
        surfaceRole: "inline",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        "data-flow-slot": "actions",
    }, secondaryAction?.label
        ? React.createElement(Button, {
            ...secondaryAction,
            label: secondaryAction.label,
            variant: secondaryAction.variant ?? "secondary",
            density: secondaryAction.density ?? density,
            state: actionStateFor(resolvedState, secondaryAction),
            disabled: isDisabled || secondaryAction.disabled,
            loading: isLoading || secondaryAction.loading,
            onClick: (event) => {
                secondaryAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onSecondaryAction?.(secondaryAction.key ?? secondaryAction.label, event);
            },
        })
        : null, submitAction?.label
        ? React.createElement(Button, {
            ...submitAction,
            label: submitAction.label,
            variant: submitAction.variant ?? "primary",
            density: submitAction.density ?? density,
            state: actionStateFor(resolvedState, submitAction),
            disabled: isDisabled || submitAction.disabled,
            loading: isLoading || submitAction.loading,
            onClick: (event) => {
                submitAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onSubmit?.(submitAction.key ?? submitAction.label, event);
            },
        })
        : null));
});
PaymentForm.displayName = "PaymentForm";
