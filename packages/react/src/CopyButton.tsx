import React, { forwardRef, useRef, useState } from "react";
import { copyButtonPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowVariantProps, normalizeFlowDensity } from "./internal/props.js";

import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type CopyButtonVariant = "text" | "icon" | "inline";
export type CopyButtonState = "default" | "hover" | "focus" | "pressed" | "copied" | "error" | "disabled" | "loading";
export type CopyButtonDensity = FlowDensity;
export type CopyButtonType = "button" | "submit" | "reset";

export type CopyButtonMeta = {
  value: string;
  state: CopyButtonState;
};
export type CopyButtonEvent = React.MouseEvent<HTMLButtonElement>;

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "children" | "disabled" | "type" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  value: string;
  label?: string;
  ariaLabel?: string;
  variant?: CopyButtonVariant;
  state?: CopyButtonState;
  density?: CopyButtonDensity;
  feedbackDuration?: number;
  copiedLabel?: string;
  errorLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  type?: CopyButtonType;
  onCopied?: (meta: CopyButtonMeta, event: CopyButtonEvent) => void;
  onCopyError?: (meta: CopyButtonMeta, event: CopyButtonEvent) => void;
}

export interface CopyButtonComponent extends ForwardRefExoticComponent<CopyButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "CopyButton";
  platformContract: typeof copyButtonPlatformContract;
}

const validVariants = new Set<CopyButtonVariant>(["text", "icon", "inline"]);
const validStates = new Set<CopyButtonState>(["default", "hover", "focus", "pressed", "copied", "error", "disabled", "loading"]);
const allowedTypes = new Set<CopyButtonType>(["button", "submit", "reset"]);

function resolveVariant(variant: CopyButtonVariant | undefined): CopyButtonVariant {
  return variant && validVariants.has(variant) ? variant : "text";
}

function resolveState({ disabled, loading, state }: { disabled?: boolean; loading?: boolean; state?: CopyButtonState }): CopyButtonState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  return state && validStates.has(state) ? state : "default";
}

function canUseClipboard() {
  return typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText);
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton({
  value,
  label,
  ariaLabel,
  variant = "text",
  state = "default",
  density,
  feedbackDuration,
  copiedLabel,
  errorLabel,
  disabled = false,
  loading = false,
  icon = "content_copy",
  type = "button",
  className = "",
  onClick,
  onCopied,
  onCopyError,
  ...rest
}, ref) {
  const resolvedVariant = resolveVariant(variant);
  const [transientState, setTransientState] = useState<CopyButtonState | null>(null);
  const timer = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedState = resolveState({ disabled, loading, state: transientState ?? state });
  const fallbackLabel = `Copy ${value}`;
  const labelText = resolvedState === "copied" && copiedLabel ? copiedLabel : resolvedState === "error" && errorLabel ? errorLabel : label;
  const accessibleName = ariaLabel ?? labelText ?? fallbackLabel;

  if (!value) return null;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || loading) return;
    if (!canUseClipboard()) {
      const nextState: CopyButtonState = "error";
      setTransientState(nextState);
      onCopyError?.({ value, state: nextState }, event);
    } else {
      try {
        await navigator.clipboard.writeText(value);
        const nextState: CopyButtonState = "copied";
        setTransientState(nextState);
        onCopied?.({ value, state: nextState }, event);
      } catch (error) {
        const nextState: CopyButtonState = "error";
        void error;
        setTransientState(nextState);
        onCopyError?.({ value, state: nextState }, event);
      }
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTransientState(null), feedbackDuration ?? 1600);
  };

  const commonProps = {
    ...flowRestProps(rest),
    ref,
    type: allowedTypes.has(type) ? type : "button",
    disabled: resolvedState === "disabled" || resolvedState === "loading",
    className: ["copy-button", className].filter(Boolean).join(" "),
    "aria-label": accessibleName,
    "aria-busy": resolvedState === "loading" ? true : undefined,
    "data-copy-feedback": resolvedState === "copied" || resolvedState === "error" ? resolvedState : undefined,
    onClick: handleClick,
    ...flowVariantProps(resolvedVariant),
    ...flowStateProps(resolvedState),
    ...flowDensityProps(resolvedDensity),
  };

  if (resolvedVariant === "icon") {
    return React.createElement(IconButton, {
      ...commonProps,
      ariaLabel: accessibleName,
      icon,
      variant: "ghost",
      ...(resolvedDensity !== undefined ? { density: resolvedDensity } : {}),
    });
  }

  return React.createElement(Button, {
    ...commonProps,
    label: labelText ?? accessibleName,
    variant: resolvedVariant === "inline" ? "tertiary" : "secondary",
    state: resolvedState === "copied" || resolvedState === "error" ? "default" : resolvedState,
    ...(resolvedDensity !== undefined ? { density: resolvedDensity } : {}),
    loading: resolvedState === "loading",
  });
}) as CopyButtonComponent;

CopyButton.displayName = "CopyButton";
CopyButton.platformContract = copyButtonPlatformContract;
