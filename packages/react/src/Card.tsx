import React, { forwardRef } from "react";
import { cardPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type CardVariant = "default" | "minimal" | "elevated" | "ghost";
export type CardComposition = "standard" | "compact" | "media" | "stats";
export type CardState = "default" | "hover" | "focus" | "selected" | "loading" | "error" | "disabled" | "muted" | "interactive";
export type CardDensity = FlowDensity;
export type CardTrend = "up" | "down" | "neutral";
export type CardAction = {
  key?: string;
  label?: string;
  icon?: string;
  trailingIcon?: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  state?: "default" | "hover" | "active" | "focus" | "loading" | "disabled";
  density?: CardDensity;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  iconOnly?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "title" | "onAction" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  title: ReactNode;
  value?: ReactNode;
  unit?: string;
  detail?: ReactNode;
  status?: ReactNode;
  trend?: CardTrend;
  icon?: ReactNode;
  media?: string;
  mediaAlt?: string;
  variant?: CardVariant;
  composition?: CardComposition;
  state?: CardState;
  density?: CardDensity;
  fullWidth?: boolean;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  actionKey?: string;
  actions?: CardAction[];
  onAction?: (key: string, action?: CardAction, event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
}

export interface CardComponent extends ForwardRefExoticComponent<CardProps & RefAttributes<HTMLElement>> {
  displayName: "Card";
  platformContract: typeof cardPlatformContract;
}

const variants = new Set<CardVariant>(["default", "minimal", "elevated", "ghost"]);
const compositions = new Set<CardComposition>(["standard", "compact", "media", "stats"]);
const states = new Set<CardState>(["default", "hover", "focus", "selected", "loading", "error", "disabled", "muted", "interactive"]);
const trends = new Set<CardTrend>(["up", "down", "neutral"]);

function resolveState({ disabled, loading, selected, state }: {
  disabled?: boolean;
  loading?: boolean;
  selected?: boolean;
  state?: CardState;
}): CardState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (selected) return "selected";
  return state && states.has(state) ? state : "default";
}

function isValidCardAction(action: CardAction | null | undefined): action is CardAction & { key: string; label: string } {
  if (!action) return false;
  const hasStableKey = action.key !== undefined && action.key !== null && action.key !== "";
  const isIconOnly = Boolean(action.iconOnly) || (!action.label && Boolean(action.icon));
  return hasStableKey && Boolean(action.label) && (!isIconOnly || Boolean(action.icon));
}

function cardAction(action: CardAction & { key: string; label: string }, inheritedDensity: FlowDensity | undefined, index: number, onAction: CardProps["onAction"]) {
  const key = action.key;
  const isIconOnly = Boolean(action.iconOnly) || (!action.label && Boolean(action.icon));
  const { iconOnly, key: actionKey, variant, intent, density: actionDensity, state: actionState, ...actionProps } = action;
  const isDangerAction = variant === "danger" || intent === "danger";
  const resolvedDensity = actionDensity ?? inheritedDensity;
  const resolvedButtonState = actionState === "active" ? "pressed" : actionState;
  const iconButtonVariant = variant === "primary" ? "primary" : "ghost";
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    action.onClick?.(event);
    if (event.defaultPrevented) return;
    onAction?.(key, action, event);
  };
  return isIconOnly
    ? React.createElement(IconButton, {
      key,
      label: action.label,
      icon: action.icon ?? "more_horiz",
      ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
      ...(action.type ? { type: action.type } : {}),
      ...(resolvedDensity ? { density: resolvedDensity } : {}),
      variant: isDangerAction ? "ghost" : iconButtonVariant,
      onClick: handleClick,
    })
    : React.createElement(Button, {
      key,
      ...actionProps,
      ...(resolvedDensity ? { density: resolvedDensity } : {}),
      ...(resolvedButtonState ? { state: resolvedButtonState } : {}),
      ...(isDangerAction ? { variant: "primary", intent: "danger" } : variant ? { variant } : {}),
      ...(!isDangerAction && intent ? { intent } : {}),
      onClick: handleClick,
    });
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card({
  title,
  value,
  unit,
  detail,
  status,
  trend = "neutral",
  icon,
  media,
  mediaAlt,
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
  actions,
  onAction,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = variants.has(variant) ? variant : "default";
  const resolvedComposition = compositions.has(composition) ? composition : "standard";
  const resolvedState = resolveState({ disabled, loading, selected, state });
  const resolvedDensity = normalizeFlowDensity(density);
  const hasStableActionKey = actionKey !== undefined && actionKey !== null && actionKey !== "";
  const resolvedActionKey = actionKey;
  const sourceActions = Array.isArray(actions) ? actions : [];
  const validActions = sourceActions.filter(isValidCardAction);
  const hasActions = validActions.length > 0;
  const hasInteractiveContent = Boolean(title || value || detail || status || mediaAlt);
  const requestedInteraction = Boolean(interactive || resolvedState === "interactive" || onAction || rest.onClick);
  const canActivateCard = hasStableActionKey && Boolean(onAction || rest.onClick);
  const isInteractive = !hasActions && hasInteractiveContent && requestedInteraction && canActivateCard;
  const isDisabled = resolvedState === "disabled" || resolvedState === "loading";
  const RootElement = isInteractive ? "div" : "article";
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
        React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true }),
        value ? React.createElement("span", null, value) : null,
      )
      : [
        value ? React.createElement("p", { className: "card__value", key: "value" }, resolvedComposition === "stats" && unit ? `${unit}${value}` : value) : null,
        detail ? React.createElement("p", { className: "card__detail", key: "detail" }, detail) : null,
      ],
    hasActions ? React.createElement("div", { className: "card__actions", key: "actions" }, validActions.map((action, index) => cardAction(action, resolvedDensity, index, onAction))) : null,
  ];

  return React.createElement(
    RootElement,
    {
      ...flowRestProps(rest),
      ref,
      className: ["card", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      "data-composition": resolvedComposition,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "data-interactive": String(isInteractive),
      tabIndex: isInteractive ? (isDisabled ? -1 : 0) : rest.tabIndex,
      role: isInteractive ? "button" : rest.role,
      "aria-pressed": isInteractive ? String(resolvedState === "selected") : rest["aria-pressed"],
      "aria-disabled": resolvedState === "disabled" ? "true" : rest["aria-disabled"],
      "aria-busy": resolvedState === "loading" ? "true" : rest["aria-busy"],
      onClick: isInteractive && !isDisabled
        ? (event: MouseEvent<HTMLElement>) => {
          rest.onClick?.(event);
          if (event.defaultPrevented) return;
          if (resolvedActionKey) onAction?.(resolvedActionKey, undefined, event);
        }
        : rest.onClick,
      onKeyDown: isInteractive && !isDisabled
        ? (event: KeyboardEvent<HTMLElement>) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          rest.onKeyDown?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          if (resolvedActionKey) onAction?.(resolvedActionKey, undefined, event);
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
}) as CardComponent;

Card.displayName = "Card";
Card.platformContract = cardPlatformContract;
