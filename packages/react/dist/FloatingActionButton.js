import React, { forwardRef } from "react";
import { floatingActionButtonPlatformContract } from "#flow/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["primary", "accent", "extended", "mini"]);
const validStates = new Set(["default", "hover", "focus", "pressed", "loading", "disabled"]);
const validTypes = new Set(["button", "submit", "reset"]);

export const FloatingActionButton = forwardRef(function FloatingActionButton({
  label,
  icon = "add",
  variant = "primary",
  state = "default",
  density,
  extended = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "primary");
  const resolvedState = loading || state === "loading" ? "loading" : disabled || state === "disabled" ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedLabel = label ?? "Create";
  const isExtended = Boolean(extended) || resolvedVariant === "extended";

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: validTypes.has(type) ? type : "button",
      className: ["fab", className].filter(Boolean).join(" "),
      disabled: resolvedState === "disabled" || resolvedState === "loading",
      "aria-label": resolvedLabel,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-extended": String(isExtended),
    },
    resolvedState === "loading"
      ? React.createElement(Spinner, { label: `${resolvedLabel} loading`, density: resolvedDensity || undefined, decorative: true })
      : React.createElement("span", { className: "fab__icon", "aria-hidden": "true" }, icon),
    isExtended ? React.createElement("span", { className: "fab__label" }, resolvedLabel) : null,
  );
});

FloatingActionButton.displayName = "FloatingActionButton";
FloatingActionButton.platformContract = floatingActionButtonPlatformContract;
