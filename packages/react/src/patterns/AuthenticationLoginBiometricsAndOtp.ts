import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { BiometricPrompt } from "../BiometricPrompt.js";
import type { BiometricPromptProps } from "../BiometricPrompt.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { CodeInput } from "../CodeInput.js";
import type { CodeInputProps } from "../CodeInput.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Input } from "../Input.js";
import type { InputProps } from "../Input.js";
import { PhoneInput } from "../PhoneInput.js";
import type { PhoneInputProps } from "../PhoneInput.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type AuthenticationLoginBiometricsAndOtpState =
  | "idle"
  | "submitting"
  | "otp-sent"
  | "otp-invalid"
  | "biometric-prompt"
  | "locked"
  | "rate-limited"
  | "recovered";
export type AuthenticationLoginBiometricsAndOtpDensity = PhoneInputProps["density"];

export interface AuthenticationLoginBiometricsAndOtpRecovery extends Partial<ErrorPanelProps> {}

export interface AuthenticationLoginBiometricsAndOtpProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: AuthenticationLoginBiometricsAndOtpDensity;
  state?: AuthenticationLoginBiometricsAndOtpState;
  submitting?: boolean;
  otpSent?: boolean;
  otpInvalid?: boolean;
  biometricPrompt?: boolean;
  locked?: boolean;
  rateLimited?: boolean;
  recovered?: boolean;
  credential?: Partial<InputProps>;
  phone?: Partial<PhoneInputProps>;
  otp?: Partial<CodeInputProps>;
  biometric?: Partial<BiometricPromptProps>;
  validation?: Partial<InlineValidationProps>;
  primaryAction?: Partial<ButtonProps> & { label?: string };
  secondaryAction?: Partial<ButtonProps> & { label: string };
  recovery?: AuthenticationLoginBiometricsAndOtpRecovery;
  feedback?: Partial<ToastProps> & { label: string };
  className?: string;
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRecover?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface AuthenticationLoginBiometricsAndOtpComponent extends ForwardRefExoticComponent<AuthenticationLoginBiometricsAndOtpProps & RefAttributes<HTMLDivElement>> {
  displayName: "AuthenticationLoginBiometricsAndOtp";
}

type SafeRootProps = FlowDataAttributes & {
  [key: `aria-${string}`]: string | undefined;
};

const validStates = new Set<AuthenticationLoginBiometricsAndOtpState>([
  "idle",
  "submitting",
  "otp-sent",
  "otp-invalid",
  "biometric-prompt",
  "locked",
  "rate-limited",
  "recovered",
]);

function definedProps<TProps extends Record<string, unknown>>(props: TProps) {
  return Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as {
    [TKey in keyof TProps as undefined extends TProps[TKey] ? TKey : never]?: Exclude<TProps[TKey], undefined>;
  } & {
    [TKey in keyof TProps as undefined extends TProps[TKey] ? never : TKey]: TProps[TKey];
  };
}

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  submitting,
  otpSent,
  otpInvalid,
  biometricPrompt,
  locked,
  rateLimited,
  recovered,
  state,
}: {
  submitting: boolean;
  otpSent: boolean;
  otpInvalid: boolean;
  biometricPrompt: boolean;
  locked: boolean;
  rateLimited: boolean;
  recovered: boolean;
  state?: AuthenticationLoginBiometricsAndOtpState;
}): AuthenticationLoginBiometricsAndOtpState {
  if (state === "locked" || locked) return "locked";
  if (state === "rate-limited" || rateLimited) return "rate-limited";
  if (state === "otp-invalid" || otpInvalid) return "otp-invalid";
  if (state === "biometric-prompt" || biometricPrompt) return "biometric-prompt";
  if (state === "recovered" || recovered) return "recovered";
  if (state === "otp-sent" || otpSent) return "otp-sent";
  if (state === "submitting" || submitting) return "submitting";
  return state && validStates.has(state) ? state : "idle";
}

function validationState(resolvedState: AuthenticationLoginBiometricsAndOtpState, validation?: Partial<InlineValidationProps>): NonNullable<InlineValidationProps["state"]> {
  if (validation?.state) return validation.state;
  if (resolvedState === "otp-invalid" || resolvedState === "locked" || resolvedState === "rate-limited") return "error";
  if (resolvedState === "recovered") return "success";
  if (resolvedState === "otp-sent") return "info";
  return "default";
}

function recoveryTone(resolvedState: AuthenticationLoginBiometricsAndOtpState, recovery?: AuthenticationLoginBiometricsAndOtpRecovery): NonNullable<ErrorPanelProps["tone"]> {
  if (recovery?.tone) return recovery.tone;
  if (resolvedState === "locked") return "critical";
  if (resolvedState === "rate-limited") return "warning";
  return "error";
}

function surfaceStateFor(resolvedState: AuthenticationLoginBiometricsAndOtpState, isBusy: boolean, isBlocked: boolean): NonNullable<SurfaceProps["state"]> {
  if (isBlocked) return "disabled";
  if (isBusy) return "raised";
  if (resolvedState === "recovered") return "selected";
  return "default";
}

export const AuthenticationLoginBiometricsAndOtp = forwardRef<HTMLDivElement, AuthenticationLoginBiometricsAndOtpProps>(function AuthenticationLoginBiometricsAndOtp({
  label = "Authentication",
  description,
  density,
  state,
  submitting = false,
  otpSent = false,
  otpInvalid = false,
  biometricPrompt = false,
  locked = false,
  rateLimited = false,
  recovered = false,
  credential,
  phone,
  otp,
  biometric,
  validation,
  primaryAction,
  secondaryAction,
  recovery,
  feedback,
  className = "",
  onSubmit,
  onRecover,
  ...rest
}, ref) {
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

  return React.createElement(
    "div",
    {
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
    },
    React.createElement(Surface, {
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState, isBusy, isBlocked),
      ...definedProps({ density }),
      "data-flow-slot": "surface",
      "data-authentication-login-surface": "true",
    },
    credential
      ? React.createElement(Input, {
        ...credential,
        label: credential.label ?? "Email or username",
        value: credential.value ?? "",
        variant: credential.variant ?? "text",
        density: credential.density ?? density,
        state: credential.state ?? (isDisabled ? "disabled" : "default"),
        disabled: Boolean(isDisabled || credential.disabled),
      } as InputProps)
      : null,
    React.createElement(PhoneInput, {
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
    } as PhoneInputProps),
    React.createElement(InlineValidation, {
      label: validation?.label ?? `${label} status`,
      message: validation?.message ?? (resolvedState === "otp-sent" ? "Enter the code to continue." : ""),
      value: validation?.value,
      density,
      state: validationState(resolvedState, validation),
      fullWidth: true,
      live: validation?.live ?? true,
    } as InlineValidationProps),
    showOtp
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
      } as CodeInputProps)
      : null,
    showBiometric
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
      } as BiometricPromptProps)
      : null,
    React.createElement(Button, {
      ...(primaryAction ?? {}),
      label: primaryAction?.label ?? (showOtp ? "Verify code" : "Continue"),
      variant: primaryAction?.variant ?? "primary",
      density: primaryAction?.density ?? density,
      loading: primaryAction?.loading ?? isBusy,
      disabled: primaryAction?.disabled ?? isDisabled,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        primaryAction?.onClick?.(event);
        if (event.defaultPrevented) return;
        onSubmit?.(event);
      },
    } as ButtonProps),
    secondaryAction
      ? React.createElement(Button, {
        ...secondaryAction,
        label: secondaryAction.label,
        variant: secondaryAction.variant ?? "secondary",
        density: secondaryAction.density ?? density,
        disabled: secondaryAction.disabled ?? isBusy,
      } as ButtonProps)
      : null,
    showRecovery
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
        onAction: (key: string, event: MouseEvent<HTMLButtonElement>) => {
          recovery?.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onRecover?.(key, event);
        },
      } as ErrorPanelProps)
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? (resolvedState === "recovered" ? "success" : "info"),
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
      } as ToastProps)
      : null,
    ),
  );
}) as AuthenticationLoginBiometricsAndOtpComponent;

AuthenticationLoginBiometricsAndOtp.displayName = "AuthenticationLoginBiometricsAndOtp";
