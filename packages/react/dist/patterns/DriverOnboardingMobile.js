import React, { forwardRef, } from "react";
import { AnimatedMoment } from "../AnimatedMoment.js";
import { BiometricPrompt } from "../BiometricPrompt.js";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { CardSummary } from "../CardSummary.js";
import { CodeInput } from "../CodeInput.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { PhoneInput } from "../PhoneInput.js";
import { Stepper } from "../Stepper.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
import { FormSection } from "./FormSection.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, complete, blocked, invalid, biometric, verifying, inProgress, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (blocked || state === "blocked")
        return "blocked";
    if (invalid || state === "invalid")
        return "invalid";
    if (biometric || state === "biometric")
        return "biometric";
    if (verifying || state === "verifying")
        return "verifying";
    if (complete || state === "complete")
        return "complete";
    if (inProgress || state === "in-progress")
        return "in-progress";
    return state ?? "not-started";
}
function validationState(resolvedState, validation) {
    if (validation?.state)
        return validation.state;
    if (resolvedState === "invalid" || resolvedState === "blocked")
        return "error";
    if (resolvedState === "complete")
        return "success";
    if (resolvedState === "verifying" || resolvedState === "biometric")
        return "info";
    return "default";
}
export const DriverOnboardingMobile = forwardRef(function DriverOnboardingMobile({ label = "Driver onboarding", description, density, state, disabled = false, inProgress = false, verifying = false, biometric = false, invalid = false, blocked = false, complete = false, reducedMotion = false, steps = [], currentStep = 0, summary, identityCard, formSection, identity, phone, code, validation, biometricPrompt, primaryAction, secondaryAction, animatedMoment, feedback, className = "", onSubmit, ...rest }, ref) {
    const resolvedState = resolveState({ disabled, complete, blocked, invalid, biometric, verifying, inProgress, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "blocked";
    const isBusy = resolvedState === "verifying";
    const showCode = resolvedState === "verifying" || resolvedState === "invalid" || Boolean(code?.value);
    const showBiometric = resolvedState === "biometric" || Boolean(biometricPrompt);
    const normalizedSteps = Array.isArray(steps) && steps.length ? steps : [
        { id: "identity", label: "Identity" },
        { id: "verification", label: "Verification" },
        { id: "complete", label: "Complete" },
    ];
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": isBusy ? "true" : undefined,
        "aria-disabled": isDisabled ? "true" : undefined,
        "data-flow-pattern": "driver-onboarding-mobile",
        "data-state": resolvedState,
        "data-density": density,
        "data-step-count": String(normalizedSteps.length),
        "data-reduced-motion": String(Boolean(reducedMotion)),
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : isBusy ? "raised" : resolvedState === "complete" ? "selected" : "default",
        density,
        "data-driver-onboarding-surface": "true",
    }, React.createElement(Stepper, {
        label: `${label} progress`,
        steps: normalizedSteps,
        current: currentStep,
        orientation: "horizontal",
        density,
    }), React.createElement(CardSummary, {
        ...(summary ?? {}),
        label: summary?.label ?? label,
        meta: summary?.meta ?? description,
        number: summary?.number ?? `${Number(currentStep) + 1}/${normalizedSteps.length}`,
        status: summary?.status ?? (complete ? "Complete" : blocked ? "Blocked" : "In progress"),
        variant: summary?.variant ?? "compact",
        state: summary?.state ?? (isDisabled ? "disabled" : invalid || blocked ? "warning" : "default"),
        density: summary?.density ?? density,
        fullWidth: summary?.fullWidth ?? true,
    }), React.createElement(Card, {
        ...(identityCard ?? {}),
        title: identityCard?.title ?? "Driver profile",
        value: identityCard?.value ?? identity?.value ?? phone?.value,
        detail: identityCard?.detail ?? "Mobile setup",
        status: identityCard?.status ?? (complete ? "Complete" : "Pending"),
        icon: identityCard?.icon ?? "badge",
        variant: identityCard?.variant ?? "minimal",
        composition: identityCard?.composition ?? "compact",
        state: identityCard?.state ?? (isDisabled ? "disabled" : invalid ? "error" : "default"),
        density,
        fullWidth: true,
    }), formSection
        ? React.createElement(FormSection, {
            ...formSection,
            title: formSection.title ?? "Driver details",
            density: formSection.density ?? density,
            disabled: isDisabled || formSection.disabled,
            "data-form-section-boundary": "true",
        })
        : null, identity
        ? React.createElement(Input, {
            ...identity,
            label: identity.label ?? "Driver name",
            value: identity.value ?? "",
            density: identity.density ?? density,
            state: identity.state ?? (isDisabled ? "disabled" : invalid ? "error" : "default"),
            disabled: isDisabled || identity.disabled,
        })
        : null, React.createElement(PhoneInput, {
        ...(phone ?? {}),
        label: phone?.label ?? "Phone number",
        value: phone?.value ?? "",
        country: phone?.country,
        density: phone?.density ?? density,
        state: phone?.state ?? (isDisabled ? "disabled" : "default"),
        disabled: isDisabled || phone?.disabled,
    }), React.createElement(InlineValidation, {
        label: validation?.label ?? `${label} status`,
        message: validation?.message ?? (resolvedState === "invalid" ? "Review the highlighted onboarding details." : ""),
        state: validationState(resolvedState, validation),
        density,
        fullWidth: true,
        live: validation?.live ?? true,
    }), showCode
        ? React.createElement(CodeInput, {
            ...(code ?? {}),
            label: code?.label ?? "Verification code",
            value: code?.value ?? "",
            length: code?.length ?? 6,
            density: code?.density ?? density,
            state: code?.state ?? (invalid ? "error" : isDisabled ? "disabled" : "default"),
            disabled: isDisabled || code?.disabled,
        })
        : null, showBiometric
        ? React.createElement(BiometricPrompt, {
            ...(biometricPrompt ?? {}),
            label: biometricPrompt?.label ?? "Use biometrics",
            description: biometricPrompt?.description ?? "Use biometric verification or continue with code.",
            fallback: biometricPrompt?.fallback ?? "Use code instead",
            density: biometricPrompt?.density ?? density,
            state: biometricPrompt?.state ?? (isDisabled ? "disabled" : "authenticating"),
            fullWidth: true,
        })
        : null, animatedMoment
        ? React.createElement(AnimatedMoment, {
            ...animatedMoment,
            label: animatedMoment.label ?? (complete ? "Onboarding complete" : "Onboarding update"),
            variant: animatedMoment.variant ?? (complete ? "success" : isBusy ? "loading" : "empty"),
            state: reducedMotion ? "reduced-motion" : animatedMoment.state ?? (complete ? "complete" : isBusy ? "playing" : "idle"),
            density: animatedMoment.density ?? density,
            fullWidth: true,
            reducedMotionFallback: animatedMoment.reducedMotionFallback ?? "Animation reduced.",
        })
        : null, React.createElement(Button, {
        ...(primaryAction ?? {}),
        label: primaryAction?.label ?? (complete ? "Done" : "Continue"),
        variant: primaryAction?.variant ?? "primary",
        density: primaryAction?.density ?? density,
        loading: primaryAction?.loading ?? isBusy,
        disabled: isDisabled || primaryAction?.disabled,
        onClick: (event) => {
            primaryAction?.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onSubmit?.(event);
        },
    }), secondaryAction?.label
        ? React.createElement(Button, {
            ...secondaryAction,
            label: secondaryAction.label,
            variant: secondaryAction.variant ?? "secondary",
            density: secondaryAction.density ?? density,
            disabled: isBusy || secondaryAction.disabled,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            label: feedback.label,
            tone: feedback.tone ?? (complete ? "success" : invalid || blocked ? "warning" : "info"),
            variant: feedback.variant ?? "status",
            state: feedback.state ?? "visible",
            density: feedback.density ?? density,
        })
        : null));
});
DriverOnboardingMobile.displayName = "DriverOnboardingMobile";
