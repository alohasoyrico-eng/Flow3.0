import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import type { animatedMomentPlatformContract } from "@design-system/components/platforms";

export type AnimatedMomentVariant = "success" | "empty" | "loading" | "celebration";
export type AnimatedMomentState = "idle" | "playing" | "paused" | "complete" | "reduced-motion" | "disabled";
export type AnimatedMomentDensity = "sm" | "md" | "lg";

export interface AnimatedMomentProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
  variant?: AnimatedMomentVariant;
  state?: AnimatedMomentState;
  density?: AnimatedMomentDensity;
  fullWidth?: boolean;
  icon?: string;
  animationSource?: string;
  animationData?: unknown;
  reducedMotionFallback?: string;
}

export interface AnimatedMomentComponent extends ForwardRefExoticComponent<AnimatedMomentProps & RefAttributes<HTMLDivElement>> {
  displayName: "AnimatedMoment";
  platformContract: typeof animatedMomentPlatformContract;
}

export const AnimatedMoment: AnimatedMomentComponent;
