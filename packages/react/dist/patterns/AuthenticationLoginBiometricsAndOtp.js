import React, { forwardRef, } from "react";
import { BiometricPrompt } from "../BiometricPrompt.js";
import { Button } from "../Button.js";
import { CodeInput } from "../CodeInput.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { PhoneInput } from "../PhoneInput.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
const validStates = new Set([
    "idle",
    "submitting",
    "otp-sent",
    "otp-invalid",
    "biometric-prompt",
    "locked",
    "rate-limited",
    "recovered",
]);
function definedProps(props) {
    return Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));
}
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ submitting, otpSent, otpInvalid, biometricPrompt, locked, rateLimited, recovered, state, }) {
    if (state === "locked" || locked)
        return "locked";
    if (state === "rate-limited" || rateLimited)
        return "rate-limited";
    if (state === "otp-invalid" || otpInvalid)
        return "otp-invalid";
    if (state === "biometric-prompt" || biometricPrompt)
        return "biometric-prompt";
    if (state === "recovered" || recovered)
        return "recovered";
    if (state === "otp-sent" || otpSent)
        return "otp-sent";
    if (state === "submitting" || submitting)
        return "submitting";
    return state && validStates.has(state) ? state : "idle";
}
function validationState(resolvedState, validation) {
    if (validation?.state)
        return validation.state;
    if (resolvedState === "otp-invalid" || resolvedState === "locked" || resolvedState === "rate-limited")
        return "error";
    if (resolvedState === "recovered")
        return "success";
    if (resolvedState === "otp-sent")
        return "info";
    return "default";
}
function recoveryTone(resolvedState, recovery) {
    if (recovery?.tone)
        return recovery.tone;
    if (resolvedState === "locked")
        return "critical";
    if (resolvedState === "rate-limited")
        return "warning";
    return "error";
}
function surfaceStateFor(resolvedState, isBusy, isBlocked) {
    if (isBlocked)
        return "disabled";
    if (isBusy)
        return "raised";
    if (resolvedState === "recovered")
        return "selected";
    return "default";
}
export const AuthenticationLoginBiometricsAndOtp = forwardRef(function AuthenticationLoginBiometricsAndOtp({ label = "Authentication", description, density, state, submitting = false, otpSent = false, otpInvalid = false, biometricPrompt = false, locked = false, rateLimited = false, recovered = false, credential, phone, otp, biometric, validation, primaryAction, secondaryAction, recovery, feedback, className = "", onSubmit, onRecover, ...rest }, ref) {
    const resolvedState = resolveState({
        submitting,
        otpSent,
        otpInvalid,
        biometricPrompt,
        locked,
        rateLimited,
        recovered,
        ...(state !== undefined ? { state } : {}),
    });
    const isBusy = resolvedState === "submitting";
    const isBlocked = resolvedState === "locked" || resolvedState === "rate-limited";
    const isDisabled = isBusy || isBlocked;
    const showOtp = resolvedState === "otp-sent" || resolvedState === "otp-invalid" || resolvedState === "submitting" || Boolean(otp?.value);
    const showBiometric = resolvedState === "biometric-prompt" || Boolean(biometric);
    const showRecovery = isBlocked || resolvedState === "otp-invalid" || Boolean(recovery);
    return React.createElement("div", {
        ref,
        className,
        role: "form",
        "aria-label": label,
        "aria-busy": isBusy ? "true" : undefined,
        "data-flow-pattern": "authentication-login-biometrics-and-otp",
        "data-state": resolvedState,
        "data-density": density,
        "data-has-otp": String(showOtp),
        "data-has-biometric": String(showBiometric),
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateFor(resolvedState, isBusy, isBlocked),
        ...definedProps({ density }),
        "data-flow-slot": "surface",
        "data-authentication-login-surface": "true",
    }, credential
        ? React.createElement(Input, {
            ...credential,
            label: credential.label ?? "Email or username",
            value: credential.value ?? "",
            variant: credential.variant ?? "text",
            density: credential.density ?? density,
            state: credential.state ?? (isDisabled ? "disabled" : "default"),
            disabled: Boolean(isDisabled || credential.disabled),
        })
        : null, React.createElement(PhoneInput, {
        ...(phone ?? {}),
        label: phone?.label ?? "Phone number",
        value: phone?.value ?? "",
        country: phone?.country,
        countries: phone?.countries,
        helper: phone?.helper ?? description,
        density: phone?.density ?? density,
        variant: phone?.variant ?? "otp-handoff",
        state: phone?.state ?? (isDisabled ? "disabled" : "default"),
        disabled: Boolean(isDisabled || phone?.disabled),
    }), React.createElement(InlineValidation, {
        label: validation?.label ?? `${label} status`,
        message: validation?.message ?? (resolvedState === "otp-sent" ? "Enter the code to continue." : ""),
        value: validation?.value,
        density,
        state: validationState(resolvedState, validation),
        fullWidth: true,
        live: validation?.live ?? true,
    }), showOtp
        ? React.createElement(CodeInput, {
            ...(otp ?? {}),
            label: otp?.label ?? "One-time code",
            value: otp?.value ?? "",
            length: otp?.length ?? 6,
            variant: otp?.variant ?? "otp",
            masked: otp?.masked ?? true,
            helper: otp?.helper ?? "Use the code sent to your trusted channel.",
            density: otp?.density ?? density,
            state: otp?.state ?? (resolvedState === "otp-invalid" ? "error" : isDisabled ? "disabled" : String(otp?.value ?? "").length >= (otp?.length ?? 6) ? "complete" : "default"),
            error: otp?.error ?? (resolvedState === "otp-invalid" ? "Code could not be verified." : undefined),
            disabled: Boolean(isDisabled || otp?.disabled),
        })
        : null, showBiometric
        ? React.createElement(BiometricPrompt, {
            ...(biometric ?? {}),
            label: biometric?.label ?? "Use biometrics",
            description: biometric?.description ?? "Use biometric authentication or continue with the code.",
            variant: biometric?.variant ?? "fallback",
            state: biometric?.state ?? (isDisabled ? "disabled" : resolvedState === "biometric-prompt" ? "authenticating" : "default"),
            actionLabel: biometric?.actionLabel ?? "Use biometrics",
            fallback: biometric?.fallback ?? "Use code instead",
            density: biometric?.density ?? density,
            fullWidth: true,
        })
        : null, React.createElement(Button, {
        ...(primaryAction ?? {}),
        label: primaryAction?.label ?? (showOtp ? "Verify code" : "Continue"),
        variant: primaryAction?.variant ?? "primary",
        density: primaryAction?.density ?? density,
        loading: primaryAction?.loading ?? isBusy,
        disabled: primaryAction?.disabled ?? isDisabled,
        onClick: (event) => {
            primaryAction?.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onSubmit?.(event);
        },
    }), secondaryAction
        ? React.createElement(Button, {
            ...secondaryAction,
            label: secondaryAction.label,
            variant: secondaryAction.variant ?? "secondary",
            density: secondaryAction.density ?? density,
            disabled: secondaryAction.disabled ?? isBusy,
        })
        : null, showRecovery
        ? React.createElement(ErrorPanel, {
            label: recovery?.label ?? (isBlocked ? "Authentication temporarily unavailable" : "Verification failed"),
            description: recovery?.description,
            tone: recoveryTone(resolvedState, recovery),
            variant: recovery?.variant ?? (isBlocked ? "blocking" : "inline"),
            state: recovery?.state ?? (isBlocked ? "critical" : "error"),
            density,
            fullWidth: true,
            icon: recovery?.icon,
            role: recovery?.role ?? "alert",
            action: recovery?.action,
            onAction: (key, event) => {
                recovery?.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onRecover?.(key, event);
            },
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            label: feedback.label,
            description: feedback.description,
            tone: feedback.tone ?? (resolvedState === "recovered" ? "success" : "info"),
            variant: feedback.variant ?? "status",
            state: feedback.state ?? "visible",
            density: feedback.density ?? density,
        })
        : null));
});
AuthenticationLoginBiometricsAndOtp.displayName = "AuthenticationLoginBiometricsAndOtp";
