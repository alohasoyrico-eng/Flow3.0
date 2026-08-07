import React, { forwardRef } from "react";
import { cardSummaryPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["physical", "virtual", "compact", "limit"]);
const validStates = new Set(["default", "hover", "focus", "active", "warning", "frozen", "disabled"]);

function statusToneFor(state) {
  if (state === "warning") return "warning";
  if (state === "frozen") return "info";
  if (state === "disabled") return "neutral";
  return "success";
}

export const CardSummary = forwardRef(function CardSummary({
  label,
  meta = "",
  number = "",
  status = "",
  metrics = [],
  expires = "",
  variant = "physical",
  state = "default",
  density,
  icon = "",
  fullWidth = false,
  disabled = false,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "physical");
  const resolvedState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const statusLabel = status || (resolvedState === "frozen" ? "Frozen" : resolvedState === "warning" ? "Review" : "Active");
  const resolvedIcon = icon || (resolvedVariant === "virtual" ? "smartphone" : resolvedState === "frozen" ? "ac_unit" : "contactless");

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["card-summary", className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
      tabIndex: ["hover", "focus", "active"].includes(resolvedState) ? 0 : rest.tabIndex,
    },
    React.createElement(
      "header",
      null,
      React.createElement("strong", { className: "card-summary__brand" }, label ?? "Card"),
      React.createElement(Badge, {
        label: statusLabel,
        tone: statusToneFor(resolvedState),
        variant: "status",
        state: resolvedState === "disabled" ? "disabled" : "default",
        density: resolvedDensity || undefined,
      }),
    ),
    React.createElement(
      "div",
      { className: "card-summary__tech" },
      React.createElement("span", { className: "card-summary__chip", "aria-hidden": "true" }),
      React.createElement("span", { className: "card-summary__icon material-symbol", "aria-hidden": "true" }, resolvedIcon),
    ),
    number
      ? React.createElement(
          "p",
          { className: "card-summary__number-row" },
          React.createElement("span", { className: "card-summary__number" }, number),
          expires ? React.createElement("span", { className: "card-summary__expires" }, expires) : null,
        )
      : null,
    meta ? React.createElement("small", { className: "card-summary__holder" }, meta) : null,
    metrics.length && resolvedVariant === "limit"
      ? React.createElement(
          "div",
          { className: "card-summary__metrics" },
          metrics.map((metric, index) => React.createElement(
            "span",
            { key: metric?.key ?? `${metric?.label ?? "metric"}-${index}` },
            React.createElement("small", null, metric?.label ?? ""),
            React.createElement("strong", null, metric?.value ?? ""),
          )),
        )
      : null,
    resolvedState === "frozen"
      ? React.createElement(
          "span",
          { className: "card-summary__frost", "aria-hidden": "true" },
          React.createElement("span", { className: "card-summary__icon material-symbol" }, "ac_unit"),
          React.createElement("span", null, statusLabel),
        )
      : null,
  );
});

CardSummary.displayName = "CardSummary";
CardSummary.platformContract = cardSummaryPlatformContract;
