import React, { forwardRef, useId, useState } from "react";
import { tooltipPlatformContract } from "#flow/platforms";

const validPlacements = new Set(["top", "right", "bottom", "left"]);
const validVariants = new Set(["default", "icon-help", "metric", "disabled-help"]);
const validDensities = new Set(["sm", "md", "lg"]);
const validStates = new Set(["default", "hover", "focus", "open", "disabled", "dismissed"]);

function normalizeState({ disabled, state }) {
  if (disabled) return "disabled";
  return validStates.has(state) ? state : "default";
}

export const Tooltip = forwardRef(function Tooltip({
  triggerLabel,
  content,
  id,
  placement = "top",
  variant = "default",
  density = "md",
  state = "default",
  disabled = false,
  onOpenChange,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const tooltipId = id || `tooltip-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedPlacement = validPlacements.has(placement) ? placement : "top";
  const resolvedVariant = validVariants.has(variant) ? variant : "default";
  const resolvedDensity = validDensities.has(density) ? density : "md";
  const resolvedState = normalizeState({ disabled, state });
  const initiallyOpen = ["hover", "focus", "open", "disabled"].includes(resolvedState);
  const [open, setOpenState] = useState(initiallyOpen);
  const [interactionState, setInteractionState] = useState(resolvedState);
  const isDisabled = resolvedState === "disabled" || interactionState === "disabled";
  const isDismissed = interactionState === "dismissed";
  const isOpen = Boolean(open) && !isDismissed;

  const setOpen = (nextOpen, nextState) => {
    if (isDisabled) return;
    const normalizedNextOpen = Boolean(nextOpen);
    setOpenState(normalizedNextOpen);
    if (nextState) setInteractionState(nextState);
    onOpenChange?.(normalizedNextOpen);
  };

  return React.createElement(
    "span",
    {
      ...rest,
      ref,
      className: ["tooltip", className].filter(Boolean).join(" "),
      "data-placement": resolvedPlacement,
      "data-variant": resolvedVariant,
      "data-density": resolvedDensity,
      "data-state": interactionState,
      "data-open": String(isOpen),
    },
    React.createElement(
      "button",
      {
        type: "button",
        className: "tooltip__trigger",
        "data-tooltip-trigger": "",
        disabled: isDisabled,
        "aria-disabled": isDisabled ? "true" : undefined,
        "aria-describedby": isOpen ? tooltipId : undefined,
        onMouseEnter: () => setOpen(true, "hover"),
        onMouseLeave: () => setOpen(false, "default"),
        onFocus: () => setOpen(true, "focus"),
        onBlur: () => setOpen(false, "default"),
        onKeyDown: (event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          setInteractionState("dismissed");
          setOpenState(false);
          onOpenChange?.(false);
        },
      },
      triggerLabel ?? "Info",
    ),
    React.createElement(
      "span",
      {
        id: tooltipId,
        className: "tooltip__bubble",
        "data-tooltip-bubble": "",
        role: "tooltip",
        hidden: !isOpen,
        "aria-hidden": String(!isOpen),
      },
      content ?? "Tooltip",
    ),
  );
});

Tooltip.displayName = "Tooltip";
Tooltip.platformContract = tooltipPlatformContract;
