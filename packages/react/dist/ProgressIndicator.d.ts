import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { progressIndicatorPlatformContract } from "#flow/platforms";

export type ProgressIndicatorDensity = "sm" | "md";
export type ProgressIndicatorTone = "accent" | "success" | "warning" | "danger" | "ink";
export type ProgressIndicatorState = "default" | "active" | "indeterminate" | "paused" | "complete" | "error" | "disabled";

export interface ProgressIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: number;
  max?: number;
  indeterminate?: boolean;
  showValue?: boolean;
  tone?: ProgressIndicatorTone;
  state?: ProgressIndicatorState;
  density?: ProgressIndicatorDensity;
  fullWidth?: boolean;
}

export interface ProgressIndicatorComponent extends ForwardRefExoticComponent<ProgressIndicatorProps & RefAttributes<HTMLDivElement>> {
  displayName: "ProgressIndicator";
  platformContract: typeof progressIndicatorPlatformContract;
}

export const ProgressIndicator: ProgressIndicatorComponent;
