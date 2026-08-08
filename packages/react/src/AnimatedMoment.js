import React, { forwardRef } from "react";
import { animatedMomentPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["success", "empty", "loading", "celebration"]);
const validStates = new Set(["idle", "playing", "paused", "complete", "reduced-motion", "disabled"]);

function variantIcon(variant, icon) {
  if (icon) return icon;
  return {
    success: "shield",
    empty: "account_balance_wallet",
    loading: "sync",
    celebration: "auto_awesome",
  }[variant] ?? "auto_awesome";
}

export const AnimatedMoment = forwardRef(function AnimatedMoment({
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
});

AnimatedMoment.displayName = "AnimatedMoment";
AnimatedMoment.platformContract = animatedMomentPlatformContract;
