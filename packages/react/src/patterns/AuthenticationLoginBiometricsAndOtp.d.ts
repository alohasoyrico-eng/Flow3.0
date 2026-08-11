import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BiometricPromptProps } from "../BiometricPrompt.js";
import type { ButtonProps } from "../Button.js";
import type { CodeInputProps } from "../CodeInput.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { PhoneInputProps } from "../PhoneInput.js";
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

export const AuthenticationLoginBiometricsAndOtp: AuthenticationLoginBiometricsAndOtpComponent;
