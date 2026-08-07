import React, { forwardRef } from "react";
import { animatedMomentPlatformContract } from "@design-system/components/platforms";
import { flowRestProps } from "./internal/props.js";

const validVariants = new Set(["success", "empty", "loading", "celebration"]);
const validStates = new Set(["idle", "playing", "paused", "complete", "reduced-motion", "disabled"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

function stateLabel(state) {
  return {
    idle: "Idle",
    playing: "Playing",
    paused: "Paused",
    complete: "Complete",
    "reduced-motion": "Reduced motion",
    disabled: "Disabled",
  }[state] ?? "Idle";
}

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
  description = "",
  variant = "success",
  state = "playing",
  density,
  fullWidth = false,
  icon = "",
  animationSource = "",
  animationData,
  reducedMotionFallback = "Short controlled animation with reduced-motion fallback.",
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalize(variant, validVariants, "success");
  const resolvedState = normalize(state, validStates, "idle");
  const resolvedDensity = validDensities.has(density) ? density : undefined;
  const resolvedLabel = label ?? "Animated moment";
  const resolvedIcon = variantIcon(resolvedVariant, icon);
  const hasAsset = Boolean(animationSource || animationData);
  const canAnimate = hasAsset && resolvedState !== "reduced-motion" && resolvedState !== "disabled";

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["animated-moment", className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity,
      "data-full-width": String(Boolean(fullWidth)),
      role: "img",
      "aria-label": `${resolvedLabel}: ${stateLabel(resolvedState)}`,
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
          "data-state": resolvedState,
          "data-renderer": "svg",
          "data-animated-moment-asset": "",
          role: "img",
          "aria-label": resolvedLabel,
        },
        React.createElement("span", { className: "animation-asset__viewport", "aria-hidden": "true" }),
        React.createElement(
          "span",
          { className: "animation-asset__fallback", "aria-hidden": "true", hidden: canAnimate || undefined },
          React.createElement("span", { className: "animation-asset__fallback-icon material-symbol" }, resolvedIcon),
          React.createElement("span", { className: "animation-asset__fallback-label" }, reducedMotionFallback),
        ),
      ),
    ),
    React.createElement("strong", null, label ?? "Action complete"),
    React.createElement("span", { className: "animated-moment__state" }, stateLabel(resolvedState)),
    React.createElement("small", null, description || reducedMotionFallback),
    React.createElement("span", { className: "animated-moment__cue", "data-animated-moment-cue": "", "aria-hidden": "true" }),
  );
});

AnimatedMoment.displayName = "AnimatedMoment";
AnimatedMoment.platformContract = animatedMomentPlatformContract;
