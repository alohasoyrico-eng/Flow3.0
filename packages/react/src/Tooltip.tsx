import React, { forwardRef, useId, useState } from "react";
import { tooltipPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { FocusEvent, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";
export type TooltipVariant = "default" | "icon-help" | "metric" | "disabled-help";
export type TooltipDensity = FlowDensity;
export type TooltipState = "default" | "hover" | "focus" | "open" | "disabled" | "dismissed";
export type TooltipOpenChangeEvent = MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  triggerLabel: string;
  content: string;
  id?: string;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  density?: TooltipDensity;
  state?: TooltipState;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean, event?: TooltipOpenChangeEvent) => void;
}

export interface TooltipComponent extends ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Tooltip";
  platformContract: typeof tooltipPlatformContract;
}

const validPlacements = new Set<TooltipPlacement>(["top", "right", "bottom", "left"]);
const validVariants = new Set<TooltipVariant>(["default", "icon-help", "metric", "disabled-help"]);
const validStates = new Set<TooltipState>(["default", "hover", "focus", "open", "disabled", "dismissed"]);

function normalizeState({ disabled, state }: { disabled?: boolean; state?: TooltipState }): TooltipState {
  if (disabled) return "disabled";
  return state && validStates.has(state) ? state : "default";
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip({
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
  if (!triggerLabel || !content) return null;

  const setOpen = (nextOpen: boolean, nextState: TooltipState | undefined, event: TooltipOpenChangeEvent) => {
    if (isDisabled) return;
    const normalizedNextOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedNextOpen);
    if (nextState) setInteractionState(nextState);
    onOpenChange?.(normalizedNextOpen, event);
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
        "aria-describedby": isOpen ? tooltipId : undefined,
        onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => setOpen(true, "hover", event),
        onMouseLeave: (event: MouseEvent<HTMLButtonElement>) => setOpen(false, "default", event),
        onFocus: (event: FocusEvent<HTMLButtonElement>) => setOpen(true, "focus", event),
        onBlur: (event: FocusEvent<HTMLButtonElement>) => setOpen(false, "default", event),
        onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          if (!isOpenControlled) {
            setInteractionState("dismissed");
            setInternalOpen(false);
          }
          onOpenChange?.(false, event);
        },
      },
      triggerLabel,
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
      content,
    ),
  );
}) as TooltipComponent;

Tooltip.displayName = "Tooltip";
Tooltip.platformContract = tooltipPlatformContract;
