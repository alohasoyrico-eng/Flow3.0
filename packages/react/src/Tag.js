import React, { forwardRef } from "react";
import { tagPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["metadata", "status", "platform", "link"]);
const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const validStates = new Set(["default", "hover", "pressed", "focus", "disabled"]);
const validTypes = new Set(["button", "submit", "reset"]);

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : "metadata";
}

function normalizeTone(tone) {
  return validTones.has(tone) ? tone : "neutral";
}

function normalizeState({ disabled = false, state = "default" } = {}) {
  if (disabled) return "disabled";
  return validStates.has(state) ? state : "default";
}

export const Tag = forwardRef(function Tag({
  label,
  variant = "metadata",
  tone = "neutral",
  state = "default",
  icon = "",
  interactive = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedTone = normalizeTone(tone);
  const resolvedState = normalizeState({ disabled, state });
  const resolvedType = validTypes.has(type) ? type : "button";
  const canInteract = Boolean(rest.onClick || resolvedType === "submit" || resolvedType === "reset");
  const isInteractive = (Boolean(interactive) || resolvedVariant === "link") && canInteract;
  const element = isInteractive ? "button" : "span";

  if (!label) return null;

  return React.createElement(
    element,
    {
      ...flowRestProps(rest),
      ref,
      className: ["tag", className].filter(Boolean).join(" "),
      type: isInteractive ? resolvedType : undefined,
      disabled: isInteractive ? resolvedState === "disabled" : undefined,
      "aria-disabled": !isInteractive && resolvedState === "disabled" ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowToneProps(resolvedTone),
      ...flowStateProps(resolvedState),
      "data-interactive": isInteractive ? "true" : undefined,
    },
    icon ? React.createElement("span", { className: "tag__icon", "aria-hidden": "true" }, icon) : null,
    React.createElement("span", { className: "tag__label" }, label),
  );
});

Tag.displayName = "Tag";
Tag.platformContract = tagPlatformContract;
