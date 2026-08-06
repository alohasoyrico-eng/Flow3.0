import React, { forwardRef, useId } from "react";
import { emptyStatePlatformContract } from "../../components/src/platforms/index.js";
import { Button } from "./Button.js";
import { Spinner } from "./Spinner.js";

const validVariants = new Set(["first-use", "search-empty", "permission", "error", "maintenance"]);
const validStates = new Set(["default", "action", "search-empty", "permission", "loading", "error"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : "first-use";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "default";
}

function normalizeDensity(density) {
  return validDensities.has(density) ? density : "md";
}

export const EmptyState = forwardRef(function EmptyState({
  title,
  label,
  description = "",
  icon = "",
  action,
  variant = "first-use",
  state = "default",
  density = "md",
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
  const resolvedDensity = normalizeDensity(density);
  const resolvedTitle = title ?? label ?? "No results";
  const showIcon = Boolean(icon) || resolvedState === "loading";
  const actionLabel = action?.label;

  return React.createElement(
    "section",
    {
      ...rest,
      ref,
      id,
      className: ["empty-state", className].filter(Boolean).join(" "),
      "aria-labelledby": titleId,
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity,
      "data-full-width": String(Boolean(fullWidth)),
    },
    showIcon
      ? React.createElement(
        "span",
        { className: "empty-state__icon", "aria-hidden": "true" },
        resolvedState === "loading"
          ? React.createElement(Spinner, { label: "Loading empty state", density: "sm", decorative: true })
          : icon,
      )
      : null,
    React.createElement("h3", { className: "empty-state__title", id: titleId }, resolvedTitle),
    description
      ? React.createElement("p", { className: "empty-state__description" }, description)
      : null,
    actionLabel
      ? React.createElement(Button, {
        ...action,
        label: actionLabel,
        density: action.density ?? resolvedDensity,
        variant: action.variant ?? "primary",
        onClick: (event) => {
          action.onClick?.(event);
          onAction?.(action.key ?? actionLabel);
        },
      })
      : null,
  );
});

EmptyState.displayName = "EmptyState";
EmptyState.platformContract = emptyStatePlatformContract;
