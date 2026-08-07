import React, { forwardRef } from "react";
import { errorPanelPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { Spinner } from "./Spinner.js";

const validVariants = new Set(["inline", "panel", "blocking", "empty-recovery"]);
const validStates = new Set(["default", "warning", "error", "critical", "loading", "disabled"]);
const validTones = new Set(["warning", "error", "critical"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : "panel";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "error";
}

function resolveTone(state, tone) {
  if (state === "warning") return "warning";
  if (state === "critical") return "critical";
  if (validTones.has(tone)) return tone;
  return "error";
}

export const ErrorPanel = forwardRef(function ErrorPanel({
  label = "Something needs attention",
  description = "",
  action,
  tone = "error",
  variant = "panel",
  state = "error",
  density,
  fullWidth = false,
  icon = "",
  role,
  onAction,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeState(state);
  const resolvedDensity = validDensities.has(density) ? density : "";
  const resolvedTone = resolveTone(resolvedState, tone);
  const resolvedRole = role ?? (resolvedTone === "warning" || resolvedState === "loading" ? "status" : "alert");
  const actionLabel = action?.label;

  return React.createElement(
    "section",
    {
      ...rest,
      ref,
      className: ["error-panel", `error-panel--${resolvedTone}`, className].filter(Boolean).join(" "),
      role: resolvedRole,
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity || undefined,
      "data-full-width": String(Boolean(fullWidth)),
    },
    React.createElement(
      "span",
      { className: "error-panel__icon", "aria-hidden": "true" },
      resolvedState === "loading"
        ? React.createElement(Spinner, { label: "Loading error panel", density: "sm", decorative: true })
        : icon || (resolvedTone === "warning" ? "warning" : "error"),
    ),
    React.createElement(
      "div",
      { className: "error-panel__content" },
      React.createElement("strong", null, label),
      description ? React.createElement("p", null, description) : null,
    ),
    actionLabel
      ? React.createElement(Button, {
        ...action,
        label: actionLabel,
        density: action.density ?? (resolvedDensity || undefined),
        variant: action.variant ?? "secondary",
        disabled: resolvedState === "disabled" || action.disabled,
        loading: resolvedState === "loading" || action.loading,
        onClick: (event) => {
          action.onClick?.(event);
          onAction?.(action.key ?? actionLabel);
        },
      })
      : null,
  );
});

ErrorPanel.displayName = "ErrorPanel";
ErrorPanel.platformContract = errorPanelPlatformContract;
