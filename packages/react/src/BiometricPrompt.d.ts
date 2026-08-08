import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  MouseEvent,
  RefAttributes,
} from "react";
import type { biometricPromptPlatformContract } from "@design-system/components/platforms";

export type BiometricPromptVariant = "fingerprint" | "face" | "passcode" | "fallback";
export type BiometricPromptState = "default" | "focus" | "authenticating" | "success" | "warning" | "error" | "disabled";
export type BiometricPromptDensity = "sm" | "md" | "lg";

export interface BiometricPromptProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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

export const BiometricPrompt: BiometricPromptComponent;
