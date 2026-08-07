import React, { forwardRef, useId, useState } from "react";
import { tooltipPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validPlacements = new Set(["top", "right", "bottom", "left"]);
const validVariants = new Set(["default", "icon-help", "metric", "disabled-help"]);
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
  density,
  state = "default",
  disabled = false,
  open: openProp,
  onOpenChange,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const tooltipId = id || `tooltip-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedPlacement = validPlacements.has(placement) ? placement : "top";
  const resolvedVariant = validVariants.has(variant) ? variant : "default";
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedState = normalizeState({ disabled, state });
  const initiallyOpen = ["hover", "focus", "open", "disabled"].includes(resolvedState);
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const [interactionState, setInteractionState] = useState(resolvedState);
  const isDisabled = resolvedState === "disabled" || interactionState === "disabled";
  const isDismissed = !isOpenControlled && interactionState === "dismissed";
  const openValue = isOpenControlled ? Boolean(openProp) : internalOpen;
  const isOpen = Boolean(openValue) && !isDismissed;

  const setOpen = (nextOpen, nextState) => {
    if (isDisabled) return;
    const normalizedNextOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedNextOpen);
    if (nextState) setInteractionState(nextState);
    onOpenChange?.(normalizedNextOpen);
  };

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["tooltip", className].filter(Boolean).join(" "),
      "data-placement": resolvedPlacement,
      ...flowVariantProps(resolvedVariant),
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(interactionState),
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
        "aria-describedby": isOpen && content ? tooltipId : undefined,
        "aria-label": triggerLabel ? undefined : "Tooltip trigger",
        onMouseEnter: () => setOpen(true, "hover"),
        onMouseLeave: () => setOpen(false, "default"),
        onFocus: () => setOpen(true, "focus"),
        onBlur: () => setOpen(false, "default"),
        onKeyDown: (event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          if (!isOpenControlled) {
            setInteractionState("dismissed");
            setInternalOpen(false);
          }
          onOpenChange?.(false);
        },
      },
      triggerLabel ?? "?",
    ),
    content ? React.createElement(
      "span",
      {
        id: tooltipId,
        className: "tooltip__bubble",
        "data-tooltip-bubble": "",
        role: "tooltip",
        hidden: !isOpen,
        "aria-hidden": String(!isOpen),
      },
      content,
    ) : null,
  );
});

Tooltip.displayName = "Tooltip";
Tooltip.platformContract = tooltipPlatformContract;
