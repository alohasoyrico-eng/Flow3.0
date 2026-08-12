import React, { forwardRef } from "react";
import { biometricPromptPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type BiometricPromptVariant = "fingerprint" | "face" | "passcode" | "fallback";
export type BiometricPromptState = "default" | "focus" | "authenticating" | "success" | "warning" | "error" | "disabled";
export type BiometricPromptDensity = FlowDensity;

export interface BiometricPromptProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  variant?: BiometricPromptVariant;
  state?: BiometricPromptState;
  actionLabel?: string;
  fallback?: string;
  icon?: string;
  density?: BiometricPromptDensity;
  fullWidth?: boolean;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFallback?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface BiometricPromptComponent extends ForwardRefExoticComponent<BiometricPromptProps & RefAttributes<HTMLElement>> {
  displayName: "BiometricPrompt";
  platformContract: typeof biometricPromptPlatformContract;
}

const validVariants = new Set<BiometricPromptVariant>(["fingerprint", "face", "passcode", "fallback"]);
const validStates = new Set<BiometricPromptState>(["default", "focus", "authenticating", "success", "warning", "error", "disabled"]);
const stateIcons: Partial<Record<BiometricPromptState, string>> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
};
const variantIcons: Record<BiometricPromptVariant, string> = {
  fingerprint: "fingerprint",
  face: "face",
  passcode: "pin",
  fallback: "lock",
};

function promptIcon(variant: BiometricPromptVariant, state: BiometricPromptState, icon: string): string {
  if (icon) return icon;
  return stateIcons[state] ?? variantIcons[variant] ?? "fingerprint";
}

export const BiometricPrompt = forwardRef<HTMLElement, BiometricPromptProps>(function BiometricPrompt({
  label,
  description,
  variant = "fingerprint",
  state = "default",
  actionLabel,
  fallback,
  icon = "",
  density,
  fullWidth = false,
  onAction,
  onFallback,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "fingerprint");
  const resolvedState = normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  if (!label) return null;
  const disabled = resolvedState === "disabled";
  const canRenderAction = Boolean(actionLabel && onAction);
  const canRenderFallback = Boolean(fallback && onFallback);

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
      "aria-label": label,
    },
    React.createElement(
      "span",
      { className: "biometric-prompt__icon material-symbol", "aria-hidden": "true" },
      promptIcon(resolvedVariant, resolvedState, icon),
    ),
    React.createElement(
      "div",
      { className: "biometric-prompt__content" },
      React.createElement("strong", null, label),
      description ? React.createElement("p", { role: "status" }, description) : null,
    ),
    canRenderAction && actionLabel && onAction ? React.createElement(Button, {
        className: "biometric-prompt__action",
        label: actionLabel,
        disabled,
        loading: resolvedState === "authenticating",
        fullWidth: true,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-action": "",
        onClick: (event) => onAction(event),
      }) : null,
    canRenderFallback && fallback && onFallback ? React.createElement(Button, {
        className: "biometric-prompt__fallback",
        label: fallback,
        variant: "tertiary",
        disabled,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-fallback": "",
        onClick: (event) => onFallback(event),
      }) : null,
  );
}) as BiometricPromptComponent;

BiometricPrompt.displayName = "BiometricPrompt";
BiometricPrompt.platformContract = biometricPromptPlatformContract;
