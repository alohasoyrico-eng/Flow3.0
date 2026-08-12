import React, { forwardRef, useId, } from "react";
import { motionBoundaryPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, flowDensityProps, normalizeFlowValue, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["fade", "slide", "collapse", "route"]);
const validStates = new Set(["idle", "entering", "active", "exiting", "reduced-motion", "disabled"]);
function normalizeState(state, reducedMotion) {
    if (state === "disabled")
        return "disabled";
    if (reducedMotion || state === "reduced-motion")
        return "reduced-motion";
    return normalizeFlowValue(state, validStates, "active");
}
export const MotionBoundary = forwardRef(function MotionBoundary({ label, description, variant = "fade", state = "active", density, icon = "transition_slide", reducedMotion = false, stateLabel, className = "", ...rest }, ref) {
    const generatedId = useId();
    const id = `motion-boundary-${generatedId.replace(/:/g, "")}`;
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "fade");
    const resolvedState = normalizeState(state, reducedMotion);
    const isReducedMotion = Boolean(reducedMotion || resolvedState === "reduced-motion");
    if (!label)
        return null;
    const resolvedStateLabel = stateLabel;
    const describedBy = [description ? `${id}-description` : "", resolvedStateLabel ? `${id}-state` : ""].filter(Boolean).join(" ") || undefined;
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        className: ["motion-boundary", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(resolvedState),
        "data-reduced-motion": String(isReducedMotion),
        role: "group",
        "aria-labelledby": `${id}-label`,
        "aria-describedby": describedBy,
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    }, React.createElement("span", { className: "motion-boundary__icon material-symbol", "aria-hidden": "true" }, icon), React.createElement("div", { className: "motion-boundary__content" }, React.createElement("strong", { id: `${id}-label` }, label), description ? React.createElement("p", { id: `${id}-description` }, description) : null, resolvedStateLabel ? React.createElement("span", { className: "motion-boundary__state", id: `${id}-state`, hidden: true }, resolvedStateLabel) : null), React.createElement("span", { className: "motion-boundary__cue", "data-motion-cue": "", "aria-hidden": "true" }));
});
MotionBoundary.displayName = "MotionBoundary";
MotionBoundary.platformContract = motionBoundaryPlatformContract;
