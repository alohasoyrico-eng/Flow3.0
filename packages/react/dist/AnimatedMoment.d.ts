import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import type { animatedMomentPlatformContract } from "#flow/platforms";

export type AnimatedMomentVariant = "success" | "empty" | "loading" | "celebration";
export type AnimatedMomentState = "idle" | "playing" | "paused" | "complete" | "reduced-motion" | "disabled";
export type AnimatedMomentDensity = "sm" | "md" | "lg";
export type AnimatedMomentJsonValue =
  | string
  | number
  | boolean
  | null
  | AnimatedMomentJsonValue[]
  | { [key: string]: AnimatedMomentJsonValue };
export type AnimatedMomentAnimationData = { [key: string]: AnimatedMomentJsonValue };

export interface AnimatedMomentProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  description?: string;
  variant?: AnimatedMomentVariant;
  state?: AnimatedMomentState;
  density?: AnimatedMomentDensity;
  fullWidth?: boolean;
  icon?: string;
  animationSource?: string;
  animationData?: AnimatedMomentAnimationData;
  reducedMotionFallback?: string;
  stateLabel?: string;
}

export interface AnimatedMomentComponent extends ForwardRefExoticComponent<AnimatedMomentProps & RefAttributes<HTMLDivElement>> {
  displayName: "AnimatedMoment";
  platformContract: typeof animatedMomentPlatformContract;
}

export const AnimatedMoment: AnimatedMomentComponent;
