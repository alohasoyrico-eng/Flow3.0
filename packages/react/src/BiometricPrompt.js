import React, { forwardRef } from "react";
import { biometricPromptPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["fingerprint", "face", "passcode", "fallback"]);
const validStates = new Set(["default", "focus", "authenticating", "success", "warning", "error", "disabled"]);

function normalizeState(state) {
  return state === "scanning" ? "authenticating" : normalizeFlowValue(state, validStates, "default");
}

function promptIcon(variant, state, icon) {
  if (icon) return icon;
  return {
    success: "check_circle",
    error: "error",
    warning: "warning",
  }[state] ?? {
    fingerprint: "fingerprint",
    face: "face",
    passcode: "pin",
    fallback: "lock",
  }[variant] ?? "fingerprint";
}

function stateCopy(state, description) {
  if (description) return description;
  return "";
}

export const BiometricPrompt = forwardRef(function BiometricPrompt({
  label,
  description = "",
  variant = "fingerprint",
  state = "default",
  actionLabel = "",
  fallback = "",
  icon = "",
  density,
  fullWidth = false,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "fingerprint");
  const resolvedState = normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  const disabled = resolvedState === "disabled";

  return React.createElement(
    "section",
    {
      ...flowRestProps(rest),
      ref,
      className: ["biometric-prompt", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      role: "group",
      "aria-label": label ?? "Biometric authentication",
    },
    React.createElement(
      "span",
      { className: "biometric-prompt__icon material-symbol", "aria-hidden": "true" },
      promptIcon(resolvedVariant, resolvedState, icon),
    ),
    React.createElement(
      "div",
      { className: "biometric-prompt__content" },
      label ? React.createElement("strong", null, label) : null,
      stateCopy(resolvedState, description) ? React.createElement("p", { role: "status" }, stateCopy(resolvedState, description)) : null,
    ),
    actionLabel ? React.createElement(Button, {
        className: "biometric-prompt__action",
        label: actionLabel,
        disabled,
        loading: resolvedState === "authenticating",
        fullWidth: true,
        density: resolvedDensity,
        "data-biometric-action": "",
      }) : null,
    fallback ? React.createElement(Button, {
        className: "biometric-prompt__fallback",
        label: fallback,
        variant: "tertiary",
        disabled,
        density: resolvedDensity,
        "data-biometric-fallback": "",
      }) : null,
  );
});

BiometricPrompt.displayName = "BiometricPrompt";
BiometricPrompt.platformContract = biometricPromptPlatformContract;
