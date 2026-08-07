import React, { forwardRef, useState } from "react";
import { toastPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";

const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const validVariants = new Set(["status", "progress", "warning", "recovery", "undo"]);
const validStates = new Set(["default", "visible", "action", "stacked", "exiting"]);
const validDensities = new Set(["sm", "md", "lg"]);

const toneIcons = {
  neutral: "info",
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

function normalize(value, valid, fallback) {
  return valid.has(value) ? value : fallback;
}

export const Toast = forwardRef(function Toast({
  label = "Toast",
  description = "",
  tone = "neutral",
  variant = "status",
  state = "visible",
  density,
  icon = "",
  actionLabel = "",
  dismissible = false,
  onAction,
  onDismiss,
  className = "",
  ...rest
}, ref) {
  const resolvedTone = normalize(tone, validTones, "neutral");
  const resolvedVariant = normalize(variant, validVariants, "status");
  const resolvedState = normalize(state, validStates, "visible");
  const resolvedDensity = validDensities.has(density) ? density : undefined;
  const [dismissed, setDismissed] = useState(false);
  const hidden = dismissed || resolvedState === "default";
  const role = resolvedTone === "danger" || resolvedTone === "warning" ? "alert" : "status";

  return React.createElement(
    "article",
    {
      ...rest,
      ref,
      className: ["toast", className].filter(Boolean).join(" "),
      hidden,
      role,
      "aria-live": role === "alert" ? "assertive" : "polite",
      "data-tone": resolvedTone,
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity,
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
        density: "sm",
        className: "toast__action",
        "data-toast-action": "",
        onClick: () => onAction?.(),
      })
      : null,
    dismissible
      ? React.createElement(IconButton, {
        ariaLabel: "Dismiss notification",
        icon: "close",
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
