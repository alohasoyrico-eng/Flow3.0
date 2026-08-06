import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { stepperPlatformContract } from "#flow/platforms";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperDensity = "sm" | "md" | "lg";

export interface StepperStep {
  id?: string;
  label: string;
  description?: string;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  current?: number;
  label?: string;
  orientation?: StepperOrientation;
  density?: StepperDensity;
}

export interface StepperComponent extends ForwardRefExoticComponent<StepperProps & RefAttributes<HTMLOListElement>> {
  displayName: "Stepper";
  platformContract: typeof stepperPlatformContract;
}

export const Stepper: StepperComponent;
