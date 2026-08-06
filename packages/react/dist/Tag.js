import React, { forwardRef } from "react";
import { tagPlatformContract } from "#flow/platforms";

const validVariants = new Set(["metadata", "status", "platform", "link"]);
const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const validStates = new Set(["default", "hover", "pressed", "focus", "disabled"]);

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
  const isInteractive = Boolean(interactive) || resolvedVariant === "link";
  const element = isInteractive ? "button" : "span";

  return React.createElement(
    element,
    {
      ...rest,
      ref,
      className: ["tag", className].filter(Boolean).join(" "),
      type: isInteractive ? type : undefined,
      disabled: isInteractive ? resolvedState === "disabled" : undefined,
      "aria-disabled": !isInteractive && resolvedState === "disabled" ? "true" : undefined,
      "data-variant": resolvedVariant,
      "data-tone": resolvedTone,
      "data-state": resolvedState,
      "data-interactive": isInteractive ? "true" : undefined,
    },
    icon ? React.createElement("span", { className: "tag__icon", "aria-hidden": "true" }, icon) : null,
    React.createElement("span", { className: "tag__label" }, label ?? "Tag"),
  );
});

Tag.displayName = "Tag";
Tag.platformContract = tagPlatformContract;
