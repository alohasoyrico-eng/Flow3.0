import React, { forwardRef, useState } from "react";
import { toastPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const validVariants = new Set(["status", "progress", "warning", "recovery", "undo"]);
const validStates = new Set(["default", "visible", "action", "stacked", "exiting"]);

const toneIcons = {
  neutral: "info",
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

export const Toast = forwardRef(function Toast({
  label,
  description,
  tone = "neutral",
  variant = "status",
  state = "visible",
  density,
  icon = "",
  actionLabel = "",
  dismissible = false,
  dismissLabel,
  onAction,
  onDismiss,
  className = "",
  ...rest
}, ref) {
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "status");
  const resolvedState = normalizeFlowValue(state, validStates, "visible");
  const resolvedDensity = normalizeFlowDensity(density);
  const [dismissed, setDismissed] = useState(false);
  const hidden = dismissed || resolvedState === "default";
  const role = resolvedTone === "danger" || resolvedTone === "warning" ? "alert" : "status";

  if (!label) return null;

  return React.createElement(
    "article",
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
    actionLabel
      ? React.createElement(Button, {
        label: actionLabel,
        variant: "ghost",
        density: resolvedDensity,
        className: "toast__action",
        "data-toast-action": "",
        onClick: () => onAction?.(),
      })
      : null,
    dismissible && dismissLabel
      ? React.createElement(IconButton, {
        label: dismissLabel,
        icon: "close",
        density: resolvedDensity,
        className: "toast__dismiss",
        "data-toast-dismiss": "",
        onClick: () => {
          setDismissed(true);
          onDismiss?.();
        },
      })
      : null,
  );
});

Toast.displayName = "Toast";
Toast.platformContract = toastPlatformContract;
