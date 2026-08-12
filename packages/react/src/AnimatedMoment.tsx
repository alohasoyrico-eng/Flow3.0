import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
  forwardRef,
} from "react";
import { animatedMomentPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

export type AnimatedMomentVariant = "success" | "empty" | "loading" | "celebration";
export type AnimatedMomentState = "idle" | "playing" | "paused" | "complete" | "reduced-motion" | "disabled";
export type AnimatedMomentDensity = FlowDensity;
export type AnimatedMomentJsonValue =
  | string
  | number
  | boolean
  | null
  | AnimatedMomentJsonValue[]
  | { [key: string]: AnimatedMomentJsonValue };
export type AnimatedMomentAnimationData = { [key: string]: AnimatedMomentJsonValue };

export interface AnimatedMomentProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
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

const validVariants = new Set<AnimatedMomentVariant>(["success", "empty", "loading", "celebration"]);
const validStates = new Set<AnimatedMomentState>(["idle", "playing", "paused", "complete", "reduced-motion", "disabled"]);

function variantIcon(variant: AnimatedMomentVariant, icon: string) {
  if (icon) return icon;
  return {
    success: "shield",
    empty: "account_balance_wallet",
    loading: "sync",
    celebration: "auto_awesome",
  }[variant] ?? "auto_awesome";
}

export const AnimatedMoment = forwardRef<HTMLDivElement, AnimatedMomentProps>(function AnimatedMoment({
  label,
  description,
  variant = "success",
  state = "playing",
  density,
  fullWidth = false,
  icon = "",
  animationSource,
  animationData,
  reducedMotionFallback,
  stateLabel,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "success");
  const resolvedState = normalizeFlowValue(state, validStates, "idle");
  const resolvedDensity = normalizeFlowDensity(density);
  if (!label) return null;
  const resolvedIcon = variantIcon(resolvedVariant, icon);
  const resolvedStateLabel = stateLabel;
  const hasAsset = Boolean(animationSource || animationData);
  const canAnimate = hasAsset && resolvedState !== "reduced-motion" && resolvedState !== "disabled";
  const accessibleLabel = resolvedStateLabel ? `${label}: ${resolvedStateLabel}` : label;
  const supportingCopy = description || reducedMotionFallback;

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["animated-moment", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      role: "img",
      "aria-label": accessibleLabel,
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    },
    React.createElement("span", { className: "animated-moment__icon material-symbol", "aria-hidden": "true" }, resolvedIcon),
    React.createElement(
      "span",
      { className: "animated-moment__stage", "data-animated-moment-stage": "", "aria-hidden": "true" },
      React.createElement(
        "span",
        {
          className: "animation-asset animated-moment__asset",
          "data-animation-library": "lottie-web",
          "data-animation-runtime": canAnimate ? "available" : "fallback",
          ...flowStateProps(resolvedState),
          "data-renderer": "svg",
          "data-animated-moment-asset": "",
          role: "img",
          "aria-label": label,
        },
        React.createElement("span", { className: "animation-asset__viewport", "aria-hidden": "true" }),
        React.createElement(
          "span",
          { className: "animation-asset__fallback", "aria-hidden": "true", hidden: canAnimate || undefined },
          React.createElement("span", { className: "animation-asset__fallback-icon material-symbol" }, resolvedIcon),
          reducedMotionFallback ? React.createElement("span", { className: "animation-asset__fallback-label" }, reducedMotionFallback) : null,
        ),
      ),
    ),
    React.createElement("strong", null, label),
    resolvedStateLabel ? React.createElement("span", { className: "animated-moment__state", hidden: true }, resolvedStateLabel) : null,
    supportingCopy ? React.createElement("small", null, supportingCopy) : null,
    React.createElement("span", { className: "animated-moment__cue", "data-animated-moment-cue": "", "aria-hidden": "true" }),
  );
}) as AnimatedMomentComponent;

AnimatedMoment.displayName = "AnimatedMoment";
AnimatedMoment.platformContract = animatedMomentPlatformContract;
