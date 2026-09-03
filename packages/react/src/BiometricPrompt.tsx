import React, { forwardRef } from "react";
import { biometricPromptPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type BiometricPromptVariant = "fingerprint" | "face" | "passcode" | "fallback";
export type BiometricPromptMethod = "face" | "fingerprint";
export type BiometricPromptState = "default" | "idle" | "focus" | "authenticating" | "scanning" | "success" | "warning" | "error" | "disabled";
export type BiometricPromptDensity = FlowDensity;

export interface BiometricPromptProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label?: string;
  title?: string;
  description?: string;
  method?: BiometricPromptMethod;
  variant?: BiometricPromptVariant;
  state?: BiometricPromptState;
  actionLabel?: string;
  fallback?: string;
  fallbackLabel?: string;
  icon?: string;
  density?: BiometricPromptDensity;
  fullWidth?: boolean;
  onUse?: (event: MouseEvent<HTMLButtonElement>) => void;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFallback?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface BiometricPromptComponent extends ForwardRefExoticComponent<BiometricPromptProps & RefAttributes<HTMLElement>> {
  displayName: "BiometricPrompt";
  platformContract: typeof biometricPromptPlatformContract;
}

const validVariants = new Set<BiometricPromptVariant>(["fingerprint", "face", "passcode", "fallback"]);
const validMethods = new Set<BiometricPromptMethod>(["face", "fingerprint"]);
const validStates = new Set<BiometricPromptState>(["default", "idle", "focus", "authenticating", "scanning", "success", "warning", "error", "disabled"]);
const stateIcons: Partial<Record<BiometricPromptState, string>> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
};
const variantIcons: Record<BiometricPromptVariant, string> = {
  fingerprint: "fingerprint",
  face: "ar_on_you",
  passcode: "pin",
  fallback: "lock",
};

function promptIcon(variant: BiometricPromptVariant, state: BiometricPromptState, icon: string): string {
  if (icon) return icon;
  return stateIcons[state] ?? variantIcons[variant] ?? "fingerprint";
}

function normalizeBiometricState(state: BiometricPromptState): Exclude<BiometricPromptState, "idle" | "scanning"> {
  if (state === "idle") return "default";
  if (state === "scanning") return "authenticating";
  return state;
}

export const BiometricPrompt = forwardRef<HTMLElement, BiometricPromptProps>(function BiometricPrompt({
  label,
  title,
  description,
  method,
  variant = "face",
  state = "default",
  actionLabel,
  fallback,
  fallbackLabel = "Usar passcode",
  icon = "",
  density,
  fullWidth = false,
  onUse,
  onAction,
  onFallback,
  className = "",
  ...rest
}, ref) {
  const resolvedMethod = method && validMethods.has(method) ? method : undefined;
  const resolvedVariant = normalizeFlowValue(resolvedMethod ?? variant, validVariants, "face");
  const resolvedState = normalizeBiometricState(normalizeFlowValue(state, validStates, "default"));
  const resolvedDensity = normalizeFlowDensity(density);
  const visibleLabel = title ?? label;
  const actionHandler = onUse ?? onAction;
  const actionCopy = actionLabel ?? (resolvedState === "error" ? "Reintentar" : "Verificar");
  const fallbackCopy = fallback ?? fallbackLabel;
  if (!visibleLabel) return null;
  const disabled = resolvedState === "disabled";
  const canRenderAction = Boolean(actionHandler && resolvedState !== "success");
  const canRenderFallback = Boolean(fallbackCopy && onFallback);

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
      "aria-label": visibleLabel,
    },
    React.createElement(
      "span",
      { className: "biometric-prompt__icon material-symbol", "aria-hidden": "true" },
      promptIcon(resolvedVariant, resolvedState, icon),
    ),
    React.createElement(
      "div",
      { className: "biometric-prompt__content" },
      React.createElement("strong", null, visibleLabel),
      description ? React.createElement("p", { role: resolvedState === "error" ? "alert" : "status" }, description) : null,
    ),
    canRenderAction && actionHandler ? React.createElement(Button, {
        className: "biometric-prompt__action",
        label: actionCopy,
        disabled,
        loading: resolvedState === "authenticating",
        fullWidth: true,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-action": "",
        onClick: (event) => actionHandler(event),
      }) : null,
    canRenderFallback && onFallback ? React.createElement(Button, {
        className: "biometric-prompt__fallback",
        label: fallbackCopy,
        variant: "ghost",
        disabled,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-fallback": "",
        onClick: (event) => onFallback(event),
      }) : null,
  );
}) as BiometricPromptComponent;

BiometricPrompt.displayName = "BiometricPrompt";
BiometricPrompt.platformContract = biometricPromptPlatformContract;
