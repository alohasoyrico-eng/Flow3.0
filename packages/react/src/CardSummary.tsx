import React, { forwardRef } from "react";
import { cardSummaryPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import type { BadgeTone } from "./Badge.js";

export type CardSummaryVariant = "physical" | "virtual" | "compact" | "limit";
export type CardSummaryState = "default" | "hover" | "focus" | "active" | "warning" | "frozen" | "disabled";
export type CardSummaryDensity = FlowDensity;

export interface CardSummaryMetric {
  key?: string;
  label: string;
  value: string;
}

export interface CardSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  meta?: string;
  number?: string;
  expires?: string;
  status?: string;
  metrics?: CardSummaryMetric[];
  variant?: CardSummaryVariant;
  state?: CardSummaryState;
  density?: CardSummaryDensity;
  icon?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export interface CardSummaryComponent extends ForwardRefExoticComponent<CardSummaryProps & RefAttributes<HTMLElement>> {
  displayName: "CardSummary";
  platformContract: typeof cardSummaryPlatformContract;
}

const validVariants = new Set<CardSummaryVariant>(["physical", "virtual", "compact", "limit"]);
const validStates = new Set<CardSummaryState>(["default", "hover", "focus", "active", "warning", "frozen", "disabled"]);

function statusToneFor(state: CardSummaryState): BadgeTone {
  if (state === "warning") return "warning";
  if (state === "frozen") return "info";
  if (state === "disabled") return "neutral";
  return "success";
}

export const CardSummary = forwardRef<HTMLElement, CardSummaryProps>(function CardSummary({
  label,
  meta,
  number,
  status,
  metrics,
  expires,
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
  if (!label) return null;
  const statusLabel = status;
  const resolvedIcon = icon || (resolvedVariant === "virtual" ? "smartphone" : resolvedState === "frozen" ? "ac_unit" : "contactless");
  const sourceMetrics = Array.isArray(metrics) ? metrics : [];
  const visibleMetrics = sourceMetrics.filter((metric) => metric?.key && metric?.label && metric?.value);

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["card-summary", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
      tabIndex: rest.tabIndex,
    },
    React.createElement(
      "header",
      null,
      React.createElement("strong", { className: "card-summary__brand" }, label),
      statusLabel ? React.createElement(Badge, {
          label: statusLabel,
          tone: statusToneFor(resolvedState),
          variant: "status",
          state: resolvedState === "disabled" ? "disabled" : "default",
          ...(resolvedDensity ? { density: resolvedDensity } : {}),
        }) : null,
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
    visibleMetrics.length && resolvedVariant === "limit"
      ? React.createElement(
          "div",
          { className: "card-summary__metrics" },
          visibleMetrics.map((metric) => React.createElement(
            "span",
            { key: metric.key },
            React.createElement("small", null, metric.label),
            React.createElement("strong", null, metric.value),
          )),
        )
      : null,
    resolvedState === "frozen" && statusLabel
      ? React.createElement(
          "span",
          { className: "card-summary__frost", "aria-hidden": "true" },
          React.createElement("span", { className: "card-summary__icon material-symbol" }, "ac_unit"),
          React.createElement("span", null, statusLabel),
        )
      : null,
  );
}) as CardSummaryComponent;

CardSummary.displayName = "CardSummary";
CardSummary.platformContract = cardSummaryPlatformContract;
