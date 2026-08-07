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
  meta = "",
  amount = "",
  status = "",
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
  const inferredState = status === "Pending" ? "pending" : status === "Declined" ? "error" : "default";
  const resolvedState = disabled ? "disabled" : validStates.has(state) ? state : inferredState;
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedLabel = label ?? "Movement";
  const blocked = disabled || resolvedState === "disabled";
  const selectMeta = {
    label: resolvedLabel,
    meta,
    amount,
    status,
    category: resolvedCategory,
    variant: resolvedVariant,
    state: resolvedState,
  };

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: ["button", "submit", "reset"].includes(type) ? type : "button",
      className: ["movement-row", className].filter(Boolean).join(" "),
      disabled: blocked,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-category": resolvedCategory,
      "data-full-width": String(Boolean(fullWidth)),
      onClick: (event) => {
        if (blocked) return;
        onSelect?.(selectMeta);
        rest.onClick?.(event);
      },
    },
    React.createElement("span", { className: "movement-row__icon material-symbol", "aria-hidden": "true" }, categoryIcons[resolvedCategory]),
    React.createElement(
      "span",
      { className: "movement-row__content" },
      React.createElement("strong", null, resolvedLabel),
      meta ? React.createElement("small", null, meta) : null,
    ),
    React.createElement(
      "span",
      { className: "movement-row__value" },
      React.createElement("strong", { className: "movement-row__amount" }, amount),
      status ? React.createElement("small", { className: "movement-row__status" }, status) : null,
    ),
  );
});

MovementRow.displayName = "MovementRow";
MovementRow.platformContract = movementRowPlatformContract;
