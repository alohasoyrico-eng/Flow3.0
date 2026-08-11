import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AnimatedMomentProps } from "../AnimatedMoment.js";
import type { BiometricPromptProps } from "../BiometricPrompt.js";
import type { ButtonProps } from "../Button.js";
import type { CardProps } from "../Card.js";
import type { CardSummaryProps } from "../CardSummary.js";
import type { CodeInputProps } from "../CodeInput.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { PhoneInputProps } from "../PhoneInput.js";
import type { StepperProps } from "../Stepper.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { FormSectionProps } from "./FormSection.js";

export type DriverOnboardingMobileState = "not-started" | "in-progress" | "verifying" | "biometric" | "invalid" | "blocked" | "complete" | "disabled";
export type DriverOnboardingMobileDensity = ButtonProps["density"];

export interface DriverOnboardingMobileProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DriverOnboardingMobileDensity;
  state?: DriverOnboardingMobileState;
  disabled?: boolean;
  inProgress?: boolean;
  verifying?: boolean;
  biometric?: boolean;
  invalid?: boolean;
  blocked?: boolean;
  complete?: boolean;
  reducedMotion?: boolean;
  steps?: StepperProps["steps"];
  currentStep?: StepperProps["current"];
  summary?: Partial<CardSummaryProps>;
  identityCard?: Partial<CardProps>;
  formSection?: Partial<FormSectionProps>;
  identity?: Partial<InputProps>;
  phone?: Partial<PhoneInputProps>;
  code?: Partial<CodeInputProps>;
  validation?: Partial<InlineValidationProps>;
  biometricPrompt?: Partial<BiometricPromptProps>;
  primaryAction?: Omit<ButtonProps, "children" | "fullWidth">;
  secondaryAction?: Omit<ButtonProps, "children" | "fullWidth">;
  animatedMoment?: Partial<AnimatedMomentProps>;
  feedback?: Partial<ToastProps>;
  className?: string;
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DriverOnboardingMobileComponent extends ForwardRefExoticComponent<DriverOnboardingMobileProps & RefAttributes<HTMLDivElement>> {
  displayName: "DriverOnboardingMobile";
}

export const DriverOnboardingMobile: DriverOnboardingMobileComponent;
