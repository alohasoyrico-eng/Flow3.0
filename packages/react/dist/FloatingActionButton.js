import React, { forwardRef } from "react";
import { floatingActionButtonPlatformContract } from "../../components/src/platforms/index.js";
import { Spinner } from "./Spinner.js";

const validVariants = new Set(["primary", "accent", "extended", "mini"]);
const validStates = new Set(["default", "hover", "focus", "pressed", "loading", "disabled"]);
const validTypes = new Set(["button", "submit", "reset"]);

function normalize(value, valid, fallback) {
  return valid.has(value) ? value : fallback;
}

export const FloatingActionButton = forwardRef(function FloatingActionButton({
  label,
  icon = "add",
  variant = "primary",
  state = "default",
  density = "md",
  extended = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalize(variant, validVariants, "primary");
  const resolvedState = loading || state === "loading" ? "loading" : disabled || state === "disabled" ? "disabled" : normalize(state, validStates, "default");
  const resolvedLabel = label ?? "Create";
  const isExtended = Boolean(extended) || resolvedVariant === "extended";

  return React.createElement(
    "button",
    {
      ...rest,
      ref,
      type: validTypes.has(type) ? type : "button",
      className: ["fab", className].filter(Boolean).join(" "),
      disabled: resolvedState === "disabled" || resolvedState === "loading",
      "aria-label": resolvedLabel,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": density,
      "data-extended": String(isExtended),
    },
    resolvedState === "loading"
      ? React.createElement(Spinner, { label: `${resolvedLabel} loading`, density: "sm", decorative: true })
      : React.createElement("span", { className: "fab__icon", "aria-hidden": "true" }, icon),
    isExtended ? React.createElement("span", { className: "fab__label" }, resolvedLabel) : null,
  );
});

FloatingActionButton.displayName = "FloatingActionButton";
FloatingActionButton.platformContract = floatingActionButtonPlatformContract;
