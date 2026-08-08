import React, { forwardRef } from "react";
import { cardPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps } from "./internal/props.js";

const variants = new Set(["default", "minimal", "elevated", "ghost"]);
const compositions = new Set(["standard", "compact", "media", "stats"]);
const states = new Set(["default", "hover", "focus", "selected", "loading", "error", "disabled", "muted", "interactive"]);
const trends = new Set(["up", "down", "neutral"]);

function resolveState({ disabled, loading, selected, state }) {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (selected) return "selected";
  return states.has(state) ? state : "default";
}

function isValidCardAction(action) {
  if (!action) return false;
  const isIconOnly = Boolean(action.iconOnly) || (!action.label && Boolean(action.icon));
  return isIconOnly ? Boolean(action.icon && (action.ariaLabel || action.label)) : Boolean(action.label);
}

function cardAction(action, density, index, onAction) {
  const key = action.key ?? action.label ?? action.icon ?? index;
  const isIconOnly = Boolean(action.iconOnly) || (!action.label && Boolean(action.icon));
  const { iconOnly, ...actionProps } = action;
  const handleClick = (event) => {
    action.onClick?.(event);
    onAction?.(key, action, event);
  };
  return isIconOnly
    ? React.createElement(IconButton, {
      key,
      ...actionProps,
      ariaLabel: action.ariaLabel ?? action.label,
      density,
      variant: action.variant ?? "ghost",
      onClick: handleClick,
    })
    : React.createElement(Button, {
      key,
      ...actionProps,
      density,
      onClick: handleClick,
    });
}

export const Card = forwardRef(function Card({
  title,
  value = "",
  unit = "",
  detail = "",
  status = "",
  trend = "neutral",
  icon = "",
  media = "",
  mediaAlt = "",
  variant = "default",
  composition = "standard",
  state = "default",
  density,
  fullWidth = false,
  interactive = false,
  selected = false,
  disabled = false,
  loading = false,
  actionKey,
  actions = [],
  onAction,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = variants.has(variant) ? variant : "default";
  const resolvedComposition = compositions.has(composition) ? composition : "standard";
  const resolvedState = resolveState({ disabled, loading, selected, state });
  const resolvedActionKey = actionKey ?? (typeof title === "string" ? title : "card");
  const validActions = Array.isArray(actions) ? actions.filter(isValidCardAction) : [];
  const hasActions = validActions.length > 0;
  const hasInteractiveContent = Boolean(title || value || detail || status || mediaAlt);
  const requestedInteraction = Boolean(interactive || resolvedState === "interactive" || resolvedState === "hover" || resolvedState === "focus" || selected || onAction);
  const isInteractive = !hasActions && hasInteractiveContent && requestedInteraction;
  const isDisabled = resolvedState === "disabled" || resolvedState === "loading";
  const header = React.createElement(
    "div",
    { className: "card__header", key: "header" },
    title || icon
      ? React.createElement(
        "div",
        { className: "card__heading" },
        icon ? React.createElement("span", { className: "card__icon", "aria-hidden": "true" }, icon) : null,
        title ? React.createElement("h3", { className: "card__title" }, title) : null,
      )
      : null,
    status ? React.createElement(
      "span",
      { className: "card__status", "data-trend": resolvedComposition === "stats" ? (trends.has(trend) ? trend : "neutral") : undefined },
      status,
    ) : null,
  );
  const content = [
    header,
    resolvedState === "loading"
      ? React.createElement(
        "div",
        { className: "card__loading", key: "loading" },
        React.createElement(Spinner, { density, decorative: true }),
        value ? React.createElement("span", null, value) : null,
      )
      : [
        value ? React.createElement("p", { className: "card__value", key: "value" }, resolvedComposition === "stats" ? `${unit}${value}` : value) : null,
        detail ? React.createElement("p", { className: "card__detail", key: "detail" }, detail) : null,
      ],
    hasActions ? React.createElement("div", { className: "card__actions", key: "actions" }, validActions.map((action, index) => cardAction(action, density, index, onAction))) : null,
  ];

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["card", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      "data-composition": resolvedComposition,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      "data-full-width": String(Boolean(fullWidth)),
      "data-interactive": String(isInteractive),
      tabIndex: isInteractive ? (isDisabled ? -1 : 0) : rest.tabIndex,
      role: isInteractive ? "button" : rest.role,
      "aria-pressed": isInteractive ? String(resolvedState === "selected") : rest["aria-pressed"],
      "aria-disabled": resolvedState === "disabled" ? "true" : rest["aria-disabled"],
      "aria-busy": resolvedState === "loading" ? "true" : rest["aria-busy"],
      onClick: isInteractive && !isDisabled
        ? (event) => {
          rest.onClick?.(event);
          onAction?.(resolvedActionKey, undefined, event);
        }
        : rest.onClick,
      onKeyDown: isInteractive && !isDisabled
        ? (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          rest.onKeyDown?.(event);
          onAction?.(resolvedActionKey, undefined, event);
        }
        : rest.onKeyDown,
    },
    resolvedComposition === "media" && media
      ? [
        React.createElement("img", { className: "card__media", src: media, alt: mediaAlt || "", "aria-hidden": mediaAlt ? undefined : "true", key: "media" }),
        React.createElement("div", { className: "card__body", key: "body" }, content),
      ]
      : content,
  );
});

Card.displayName = "Card";
Card.platformContract = cardPlatformContract;
