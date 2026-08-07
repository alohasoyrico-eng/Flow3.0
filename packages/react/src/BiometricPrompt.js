import React, { forwardRef } from "react";
import { biometricPromptPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";

const validVariants = new Set(["fingerprint", "face", "passcode", "fallback"]);
const validStates = new Set(["default", "focus", "authenticating", "success", "warning", "error", "disabled"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

function normalizeState(state) {
  return state === "scanning" ? "authenticating" : normalize(state, validStates, "default");
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
  return {
    default: "Confirm your identity to continue.",
    focus: "Confirm your identity to continue.",
    authenticating: "Verifying identity...",
    success: "Identity confirmed.",
    warning: "Use the secure fallback if biometrics are not available.",
    error: "We could not verify you. Try again or use the fallback.",
    disabled: "Biometric authentication is not available right now.",
  }[state] ?? "Confirm your identity to continue.";
}

export const BiometricPrompt = forwardRef(function BiometricPrompt({
  label,
  description = "",
  variant = "fingerprint",
  state = "default",
  actionLabel = "Use biometrics",
  fallback = "Use passcode instead",
  icon = "",
  density,
  fullWidth = false,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalize(variant, validVariants, "fingerprint");
  const resolvedState = normalizeState(state);
  const resolvedDensity = validDensities.has(density) ? density : undefined;
  const disabled = resolvedState === "disabled";

  return React.createElement(
    "section",
    {
      ...rest,
      ref,
      className: ["biometric-prompt", className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity,
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
      React.createElement("strong", null, label ?? "Confirm it is you"),
      React.createElement("p", { role: "status" }, stateCopy(resolvedState, description)),
    ),
    React.createElement(Button, {
      className: "biometric-prompt__action",
      label: resolvedState === "error" ? "Try again" : actionLabel,
      disabled,
      loading: resolvedState === "authenticating",
      fullWidth: true,
      density: resolvedDensity,
      "data-biometric-action": "",
    }),
    React.createElement(Button, {
      className: "biometric-prompt__fallback",
      label: fallback,
      variant: "tertiary",
      disabled,
      density: "sm",
      "data-biometric-fallback": "",
    }),
  );
});

BiometricPrompt.displayName = "BiometricPrompt";
BiometricPrompt.platformContract = biometricPromptPlatformContract;
