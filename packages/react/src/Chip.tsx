import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { chipPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type ChipVariant = "filter" | "input";
export type ChipTone = "default" | "danger" | "warning";
export type ChipState = "default" | "hover" | "pressed" | "selected" | "focus" | "disabled";
export type ChipDensity = "sm" | "md" | "lg";

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  variant?: ChipVariant;
  tone?: ChipTone;
  state?: ChipState;
  density?: ChipDensity;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  icon?: string;
  interactive?: boolean;
  onRemoveLabel?: string;
  onRemove?: (label: string, event: MouseEvent<HTMLButtonElement>) => void;
  onSelectedChange?: (selected: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChipComponent extends ForwardRefExoticComponent<ChipProps & RefAttributes<HTMLSpanElement | HTMLButtonElement>> {
  displayName: "Chip";
  platformContract: typeof chipPlatformContract;
}

const validVariants = new Set<ChipVariant>(["filter", "input"]);
const validTones = new Set<ChipTone>(["default", "danger", "warning"]);
const validStates = new Set<ChipState>(["default", "hover", "pressed", "selected", "focus", "disabled"]);
const validTypes = new Set<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["type"]>>(["button", "submit", "reset"]);

function normalizeVariant(variant: ChipVariant | undefined): ChipVariant {
  return variant && validVariants.has(variant) ? variant : "filter";
}

function normalizeTone(tone: ChipTone | undefined): ChipTone {
  return tone && validTones.has(tone) ? tone : "default";
}

function normalizeState({ disabled = false, selected = false, state = "default" }: { disabled?: boolean; selected?: boolean; state?: ChipState } = {}): ChipState {
  if (disabled) return "disabled";
  if (selected) return "selected";
  if (validStates.has(state)) return state;
  return "default";
}

export const Chip = forwardRef<HTMLSpanElement | HTMLButtonElement, ChipProps>(function Chip({
  label,
  variant = "filter",
  tone = "default",
  state = "default",
  density,
  selected = false,
  disabled = false,
  removable = false,
  icon = "",
  interactive = false,
  onRemoveLabel,
  onRemove,
  onSelectedChange,
  className = "",
  type = "button",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedTone = normalizeTone(tone);
  const isSelected = Boolean(selected) || state === "selected";
  const resolvedState = normalizeState({ disabled, selected: isSelected, state });
  const canRemove = Boolean(removable && onRemoveLabel && onRemove);
  const resolvedType = validTypes.has(type) ? type : "button";
  const canSelect = Boolean(rest.onClick || typeof onSelectedChange === "function" || resolvedType === "submit" || resolvedType === "reset");
  const isInteractive = !canRemove && (Boolean(interactive) || isSelected || typeof onSelectedChange === "function") && canSelect;
  const element = isInteractive ? "button" : "span";
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    rest.onClick?.(event);
    if (event.defaultPrevented || resolvedState === "disabled") return;
    if (typeof onSelectedChange === "function") {
      onSelectedChange(!isSelected, event);
    }
  }

  function handleRemove(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (event.defaultPrevented || resolvedState === "disabled") return;
    onRemove?.(label, event);
  }

  const iconNode = icon ? React.createElement("span", { className: "chip__icon", "aria-hidden": "true" }, icon) : null;
  const labelNode = React.createElement("span", { className: "chip__label" }, label);

  if (canRemove) {
    const { onClick: _rootOnClick, ...removableRest } = flowRestProps(rest);

    return React.createElement(
      "span",
      {
        ...removableRest,
        ref,
        className: ["chip", className].filter(Boolean).join(" "),
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        ...flowVariantProps(resolvedVariant),
        ...flowToneProps(resolvedTone),
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(resolvedState),
        "data-selected": String(isSelected),
        "data-chip-remove": "true",
        "data-interactive": canSelect ? "true" : undefined,
      },
      canSelect
        ? React.createElement(
            "button",
            {
              className: "chip__action",
              type: resolvedType,
              disabled: resolvedState === "disabled",
              onClick: handleClick,
              "aria-pressed": String(isSelected),
            },
            iconNode,
            labelNode,
          )
        : React.createElement(React.Fragment, null, iconNode, labelNode),
      React.createElement(
        "button",
        {
          className: "chip__remove",
          type: "button",
          disabled: resolvedState === "disabled",
          onClick: handleRemove,
          "aria-label": onRemoveLabel,
        },
        React.createElement("span", { className: "chip__remove-icon", "data-chip-remove-icon": "true", "aria-hidden": "true" }, "close"),
      ),
    );
  }

  return React.createElement(
    element,
    {
      ...flowRestProps(rest),
      ref,
      className: ["chip", className].filter(Boolean).join(" "),
      type: isInteractive ? resolvedType : undefined,
      disabled: isInteractive ? resolvedState === "disabled" : undefined,
      onClick: isInteractive ? handleClick : rest.onClick,
      "aria-label": canRemove ? onRemoveLabel : rest["aria-label"],
      "aria-pressed": isInteractive ? String(isSelected) : undefined,
      "aria-disabled": !isInteractive && resolvedState === "disabled" ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(resolvedState),
      "data-selected": String(isSelected),
    },
    iconNode,
    labelNode,
  );
}) as ChipComponent;

Chip.displayName = "Chip";
Chip.platformContract = chipPlatformContract;
