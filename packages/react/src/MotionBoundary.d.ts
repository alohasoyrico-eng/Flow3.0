import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { motionBoundaryPlatformContract } from "@design-system/components/platforms";

export type MotionBoundaryVariant = "fade" | "slide" | "collapse" | "route";
export type MotionBoundaryState = "idle" | "entering" | "active" | "exiting" | "reduced-motion" | "disabled";
export type MotionBoundaryDensity = "sm" | "md" | "lg";

export interface MotionBoundaryProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  variant?: MotionBoundaryVariant;
  state?: MotionBoundaryState;
  density?: MotionBoundaryDensity;
  icon?: string;
  reducedMotion?: boolean;
  stateLabel?: string;
}

export interface MotionBoundaryComponent extends ForwardRefExoticComponent<MotionBoundaryProps & RefAttributes<HTMLDivElement>> {
  displayName: "MotionBoundary";
  platformContract: typeof motionBoundaryPlatformContract;
}

export const MotionBoundary: MotionBoundaryComponent;
