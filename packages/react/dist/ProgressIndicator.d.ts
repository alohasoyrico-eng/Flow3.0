import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { progressIndicatorPlatformContract } from "#flow/platforms";

export type ProgressIndicatorDensity = "sm" | "md" | "lg";
export type ProgressIndicatorVariant = "linear" | "circular";
export type ProgressIndicatorTone = "accent" | "success" | "warning" | "danger" | "ink";
export type ProgressIndicatorState = "default" | "active" | "indeterminate" | "paused" | "complete" | "error" | "disabled";

export interface ProgressIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  ariaValueText?: string;
  value?: number;
  max?: number;
  variant?: ProgressIndicatorVariant;
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
