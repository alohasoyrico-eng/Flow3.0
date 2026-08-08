import React, { forwardRef } from "react";
import { movementRowPlatformContract } from "#flow/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "refund", "declined", "compact"]);
const validStates = new Set(["default", "hover", "focus", "pending", "error", "disabled"]);
const validCategories = new Set(["fuel", "charge", "toll", "food", "transfer", "income"]);
const categoryIcons = {
  fuel: "local_gas_station",
  charge: "bolt",
  toll: "toll",
  food: "restaurant",
  transfer: "sync_alt",
  income: "south_west",
};

export const MovementRow = forwardRef(function MovementRow({
  label,
  meta,
  amount,
  status,
  category = "transfer",
  variant = "standard",
  state = "default",
  density,
  fullWidth = false,
  disabled = false,
  onSelect,
  className = "",
  type = "button",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
  const resolvedCategory = normalizeFlowValue(category, validCategories, "transfer");
  const resolvedState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  if (!label) return null;
  const canInteract = Boolean(onSelect || rest.onClick);
  const blocked = disabled || resolvedState === "disabled";
  const Element = canInteract ? "button" : "article";
  const selectMeta = {
    label,
    meta,
    amount,
    status,
    category: resolvedCategory,
    variant: resolvedVariant,
    state: resolvedState,
  };

  return React.createElement(
    Element,
    {
      ...flowRestProps(rest),
      ref,
      type: canInteract && ["button", "submit", "reset"].includes(type) ? type : undefined,
      className: ["movement-row", className].filter(Boolean).join(" "),
      disabled: canInteract ? blocked : undefined,
      "aria-disabled": !canInteract && blocked ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-category": resolvedCategory,
      "data-full-width": String(Boolean(fullWidth)),
      onClick: canInteract
        ? (event) => {
          if (blocked) return;
          rest.onClick?.(event);
          if (event.defaultPrevented) return;
          onSelect?.(selectMeta);
        }
        : undefined,
    },
    React.createElement("span", { className: "movement-row__icon material-symbol", "aria-hidden": "true" }, categoryIcons[resolvedCategory]),
    React.createElement(
      "span",
      { className: "movement-row__content" },
      React.createElement("strong", null, label),
      meta ? React.createElement("small", null, meta) : null,
    ),
    React.createElement(
      "span",
      { className: "movement-row__value" },
      amount ? React.createElement("strong", { className: "movement-row__amount" }, amount) : null,
      status ? React.createElement("small", { className: "movement-row__status" }, status) : null,
    ),
  );
});

MovementRow.displayName = "MovementRow";
MovementRow.platformContract = movementRowPlatformContract;
