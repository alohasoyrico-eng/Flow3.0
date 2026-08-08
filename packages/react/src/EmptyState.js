import React, { forwardRef, useId } from "react";
import { emptyStatePlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["first-use", "search-empty", "permission", "error", "maintenance"]);
const validStates = new Set(["default", "action", "search-empty", "permission", "loading", "error"]);

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : "first-use";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "default";
}

export const EmptyState = forwardRef(function EmptyState({
  title,
  label,
  description = "",
  icon = "",
  action,
  variant = "first-use",
  state = "default",
  density,
  fullWidth = false,
  onAction,
  className = "",
  id,
  ...rest
}, ref) {
  const reactId = useId();
  const titleId = id ? `${id}-title` : `empty-state-title-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedTitle = title ?? label ?? "";
  const showIcon = Boolean(icon) || resolvedState === "loading";
  const actionLabel = action?.label;
  const actionKey = action?.key;
  const canRenderAction = Boolean(actionLabel && actionKey !== undefined && actionKey !== null && actionKey !== "");

  return React.createElement(
    "section",
    {
      ...flowRestProps(rest),
      ref,
      id,
      className: ["empty-state", className].filter(Boolean).join(" "),
      "aria-labelledby": titleId,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
    },
    showIcon
      ? React.createElement(
        "span",
        { className: "empty-state__icon", "aria-hidden": "true" },
        resolvedState === "loading"
          ? React.createElement(Spinner, { density: resolvedDensity || undefined, decorative: true })
          : icon,
      )
      : null,
    React.createElement("h3", { className: "empty-state__title", id: titleId }, resolvedTitle),
    description
      ? React.createElement("p", { className: "empty-state__description" }, description)
      : null,
    canRenderAction
      ? React.createElement(Button, {
        ...action,
        label: actionLabel,
        density: action.density ?? (resolvedDensity || undefined),
        variant: action.variant ?? "primary",
        onClick: (event) => {
          action.onClick?.(event);
          onAction?.(actionKey);
        },
      })
      : null,
  );
});

EmptyState.displayName = "EmptyState";
EmptyState.platformContract = emptyStatePlatformContract;
