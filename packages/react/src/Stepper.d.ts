import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { stepperPlatformContract } from "@design-system/components/platforms";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperDensity = "sm" | "md" | "lg";

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  steps: StepperStep[];
  current?: number;
  label: string;
  orientation?: StepperOrientation;
  density?: StepperDensity;
}

export interface StepperComponent extends ForwardRefExoticComponent<StepperProps & RefAttributes<HTMLOListElement>> {
  displayName: "Stepper";
  platformContract: typeof stepperPlatformContract;
}

export const Stepper: StepperComponent;
