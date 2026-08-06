import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import type { motionBoundaryPlatformContract } from "../../components/src/platforms/index.js";

export type MotionBoundaryVariant = "fade" | "slide" | "collapse" | "route";
export type MotionBoundaryState = "idle" | "entering" | "active" | "exiting" | "reduced-motion" | "disabled";

export interface MotionBoundaryProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
  variant?: MotionBoundaryVariant;
  state?: MotionBoundaryState;
  icon?: string;
  reducedMotion?: boolean;
}

export interface MotionBoundaryComponent extends ForwardRefExoticComponent<MotionBoundaryProps & RefAttributes<HTMLDivElement>> {
  displayName: "MotionBoundary";
  platformContract: typeof motionBoundaryPlatformContract;
}

export const MotionBoundary: MotionBoundaryComponent;
