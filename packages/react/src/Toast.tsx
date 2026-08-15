import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useState,
} from "react";
import { toastPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import type { ButtonProps } from "./Button.js";
import { IconButton } from "./IconButton.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastVariant = "status" | "progress" | "warning" | "recovery" | "undo";
export type ToastState = "default" | "visible" | "action" | "stacked" | "exiting";
export type ToastDensity = "sm" | "md" | "lg";

export interface ToastProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  tone?: ToastTone;
  variant?: ToastVariant;
  state?: ToastState;
  density?: ToastDensity;
  icon?: string;
  actionLabel?: string;
  dismissible?: boolean;
  dismissLabel?: string;
  dismissed?: boolean;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDismissChange?: (dismissed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastComponent extends ForwardRefExoticComponent<ToastProps & RefAttributes<HTMLElement>> {
  displayName: "Toast";
  platformContract: typeof toastPlatformContract;
}

const validTones = new Set<ToastTone>(["neutral", "info", "success", "warning", "danger"]);
const validVariants = new Set<ToastVariant>(["status", "progress", "warning", "recovery", "undo"]);
const validStates = new Set<ToastState>(["default", "visible", "action", "stacked", "exiting"]);

const toneIcons: Record<ToastTone, string> = {
  neutral: "info",
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

export const Toast = forwardRef<HTMLElement, ToastProps>(function Toast({
  label,
  description,
  tone = "neutral",
  variant = "status",
  state = "visible",
  density,
  icon = "",
  actionLabel,
  dismissible = false,
  dismissLabel,
  dismissed: dismissedProp,
  onAction,
  onDismiss,
  onDismissChange,
  className = "",
  ...rest
}, ref) {
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "status");
  const resolvedState = normalizeFlowValue(state, validStates, "visible");
  const resolvedDensity = normalizeFlowDensity(density);
  const isDismissedControlled = dismissedProp !== undefined;
  const [internalDismissed, setInternalDismissed] = useState(false);
  const dismissed = isDismissedControlled ? Boolean(dismissedProp) : internalDismissed;
  const hidden = dismissed || resolvedState === "default";
  const role = resolvedTone === "danger" || resolvedTone === "warning" ? "alert" : "status";
  const canRenderAction = Boolean(actionLabel && onAction);

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["toast", className].filter(Boolean).join(" "),
      hidden,
      role,
      "aria-live": role === "alert" ? "assertive" : "polite",
      ...flowToneProps(resolvedTone),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
    },
    React.createElement("span", { className: "toast__icon", "aria-hidden": "true" }, icon || toneIcons[resolvedTone]),
    React.createElement(
      "div",
      { className: "toast__content" },
      React.createElement("strong", null, label),
      description ? React.createElement("p", null, description) : null,
    ),
    canRenderAction && actionLabel && onAction
      ? React.createElement(Button, {
        label: actionLabel,
        variant: "ghost",
        className: "toast__action",
        "data-toast-action": "",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        onClick: (event) => onAction(event),
      })
      : null,
    dismissible && dismissLabel
      ? React.createElement(IconButton, {
        label: dismissLabel,
        icon: "close",
        className: "toast__dismiss",
        "data-toast-dismiss": "",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          onDismiss?.(event);
          if (event.defaultPrevented) return;
          if (!isDismissedControlled) setInternalDismissed(true);
          onDismissChange?.(true, event);
        },
      })
      : null,
  );
}) as ToastComponent;

Toast.displayName = "Toast";
Toast.platformContract = toastPlatformContract;
