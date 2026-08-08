import React, { forwardRef } from "react";
import { chipPlatformContract } from "#flow/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["filter", "input", "suggestion", "assist"]);
const validTones = new Set(["default", "danger", "warning"]);
const validStates = new Set(["default", "hover", "pressed", "selected", "focus", "disabled"]);
const validTypes = new Set(["button", "submit", "reset"]);

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : "filter";
}

function normalizeTone(tone) {
  return validTones.has(tone) ? tone : "default";
}

function normalizeState({ disabled = false, selected = false, state = "default" } = {}) {
  if (disabled) return "disabled";
  if (selected) return "selected";
  if (validStates.has(state)) return state;
  return "default";
}

export const Chip = forwardRef(function Chip({
  label,
  variant = "filter",
  tone = "default",
  state = "default",
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
  const canInteract = Boolean(rest.onClick || canRemove || typeof onSelectedChange === "function" || resolvedType === "submit" || resolvedType === "reset");
  const isInteractive = (Boolean(interactive) || isSelected || canRemove || typeof onSelectedChange === "function") && canInteract;
  const element = isInteractive ? "button" : "span";

  if (!label) return null;

  function handleClick(event) {
    rest.onClick?.(event);
    if (event.defaultPrevented || resolvedState === "disabled") return;
    if (canRemove) {
      onRemove?.(label);
      return;
    }
    if (typeof onSelectedChange === "function") {
      onSelectedChange(!isSelected);
    }
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
      ...flowStateProps(resolvedState),
      "data-selected": String(isSelected),
      "data-chip-remove": canRemove ? "true" : undefined,
    },
    icon ? React.createElement("span", { className: "chip__icon", "aria-hidden": "true" }, icon) : null,
    React.createElement("span", { className: "chip__label" }, label),
    canRemove ? React.createElement("span", { className: "chip__remove", "data-chip-remove-icon": "true", "aria-hidden": "true" }, "close") : null,
  );
});

Chip.displayName = "Chip";
Chip.platformContract = chipPlatformContract;
