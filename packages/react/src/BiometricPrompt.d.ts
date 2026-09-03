import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  MouseEvent,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { biometricPromptPlatformContract } from "@design-system/components/platforms";

export type BiometricPromptVariant = "fingerprint" | "face" | "passcode" | "fallback";
export type BiometricPromptMethod = "face" | "fingerprint";
export type BiometricPromptState = "default" | "idle" | "focus" | "authenticating" | "scanning" | "success" | "warning" | "error" | "disabled";
export type BiometricPromptDensity = "sm" | "md" | "lg";

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

export const BiometricPrompt: BiometricPromptComponent;
