import React, { forwardRef } from "react";
import { cardPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const variants = new Set(["default", "minimal", "elevated", "ghost"]);
const compositions = new Set(["standard", "compact", "media", "stats"]);
const states = new Set(["default", "hover", "focus", "selected", "loading", "error", "disabled", "muted", "interactive"]);
const trends = new Set(["up", "down", "neutral"]);
const actionPlacements = new Set(["footer", "header"]);
function resolveState({ disabled, loading, selected, state }) {
    if (disabled)
        return "disabled";
    if (loading)
        return "loading";
    if (selected)
        return "selected";
    return state && states.has(state) ? state : "default";
}
function isValidCardAction(action) {
    if (!action)
        return false;
    const hasStableKey = action.key !== undefined && action.key !== null && action.key !== "";
    const isIconOnly = Boolean(action.iconOnly) || (!action.label && Boolean(action.icon));
    return hasStableKey && Boolean(action.label) && (!isIconOnly || Boolean(action.icon));
}
function cardAction(action, inheritedDensity, index, onAction) {
    const key = action.key;
    const isIconOnly = Boolean(action.iconOnly) || (!action.label && Boolean(action.icon));
    const { iconOnly, key: actionKey, variant, intent, density: actionDensity, state: actionState, ...actionProps } = action;
    const isDangerAction = variant === "danger" || intent === "danger";
    const resolvedDensity = actionDensity ?? inheritedDensity;
    const resolvedButtonState = actionState === "active" ? "pressed" : actionState;
    const iconButtonVariant = variant === "primary" ? "primary" : "ghost";
    const handleClick = (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented)
            return;
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
export const Card = forwardRef(function Card({ children, title, value, unit, detail, status, trend = "neutral", icon, media, mediaAlt, variant = "default", composition = "standard", state = "default", density, fullWidth = false, interactive = false, selected = false, disabled = false, loading = false, actionKey, actions, actionPlacement = "footer", onAction, className = "", ...rest }, ref) {
    const resolvedVariant = variants.has(variant) ? variant : "default";
    const resolvedComposition = compositions.has(composition) ? composition : "standard";
    const resolvedActionPlacement = actionPlacements.has(actionPlacement) ? actionPlacement : "footer";
    const resolvedState = resolveState({ disabled, loading, selected, state });
    const resolvedDensity = normalizeFlowDensity(density);
    const hasStableActionKey = actionKey !== undefined && actionKey !== null && actionKey !== "";
    const resolvedActionKey = actionKey;
    const sourceActions = Array.isArray(actions) ? actions : [];
    const validActions = sourceActions.filter(isValidCardAction);
    const hasActions = validActions.length > 0;
    const actionsNode = hasActions
        ? React.createElement("div", { className: "card__actions", "data-placement": resolvedActionPlacement, key: "actions" }, validActions.map((action, index) => cardAction(action, resolvedDensity, index, onAction)))
        : null;
    const hasCustomContent = children !== undefined && children !== null;
    const hasGeneratedContent = Boolean(title || value || detail || status || mediaAlt);
    const hasInteractiveContent = Boolean(hasCustomContent || hasGeneratedContent);
    const requestedInteraction = Boolean(interactive || resolvedState === "interactive" || onAction || rest.onClick);
    const canActivateCard = hasStableActionKey && Boolean(onAction || rest.onClick);
    const isInteractive = !hasActions && hasInteractiveContent && requestedInteraction && canActivateCard;
    const isDisabled = resolvedState === "disabled" || resolvedState === "loading";
    const RootElement = isInteractive ? "div" : "article";
    const hasIcon = Boolean(icon);
    const header = title || icon || status || (resolvedActionPlacement === "header" && actionsNode)
        ? React.createElement("div", { className: "card__header", key: "header" }, title || icon
            ? React.createElement("div", { className: "card__heading" }, icon ? React.createElement("span", { className: "card__icon", "aria-hidden": "true" }, icon) : null, title ? React.createElement("div", { className: "card__heading-content" }, React.createElement("h3", { className: "card__title" }, title)) : null)
            : null, status ? React.createElement("span", { className: "card__status", "data-trend": resolvedComposition === "stats" ? (trends.has(trend) ? trend : "neutral") : undefined }, status) : null, resolvedActionPlacement === "header" ? actionsNode : null)
        : null;
    const generatedBody = resolvedState === "loading"
        ? React.createElement("div", { className: "card__loading", key: "loading" }, React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true }), value ? React.createElement("span", null, value) : null)
        : value || detail
            ? React.createElement("div", { className: "card__content", key: "content" }, value ? React.createElement("p", { className: "card__value", key: "value" }, resolvedComposition === "stats" && unit ? `${unit}${value}` : value) : null, detail ? React.createElement("p", { className: "card__detail", key: "detail" }, detail) : null)
            : null;
    const generatedContent = [
        header,
        generatedBody,
        resolvedActionPlacement === "footer" ? actionsNode : null,
    ];
    const content = hasCustomContent
        ? [
            header,
            React.createElement("div", { className: "card__content", key: "children" }, children),
            resolvedActionPlacement === "footer" ? actionsNode : null,
        ]
        : generatedContent;
    return React.createElement(RootElement, {
        ...flowRestProps(rest),
        ref,
        className: ["card", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        "data-composition": resolvedComposition,
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
        "data-has-icon": String(hasIcon),
        "data-interactive": String(isInteractive),
        "data-action-placement": hasActions ? resolvedActionPlacement : undefined,
        tabIndex: isInteractive ? (isDisabled ? -1 : 0) : rest.tabIndex,
        role: isInteractive ? "button" : rest.role,
        "aria-pressed": isInteractive ? String(resolvedState === "selected") : rest["aria-pressed"],
        "aria-disabled": resolvedState === "disabled" ? "true" : rest["aria-disabled"],
        "aria-busy": resolvedState === "loading" ? "true" : rest["aria-busy"],
        onClick: isInteractive && !isDisabled
            ? (event) => {
                rest.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                if (resolvedActionKey)
                    onAction?.(resolvedActionKey, undefined, event);
            }
            : rest.onClick,
        onKeyDown: isInteractive && !isDisabled
            ? (event) => {
                if (event.key !== "Enter" && event.key !== " ")
                    return;
                rest.onKeyDown?.(event);
                if (event.defaultPrevented)
                    return;
                event.preventDefault();
                if (resolvedActionKey)
                    onAction?.(resolvedActionKey, undefined, event);
            }
            : rest.onKeyDown,
    }, resolvedComposition === "media" && media
        ? [
            React.createElement("img", { className: "card__media", src: media, alt: mediaAlt || "", "aria-hidden": mediaAlt ? undefined : "true", key: "media" }),
            React.createElement("div", { className: "card__body", key: "body" }, content),
        ]
        : content);
});
Card.displayName = "Card";
Card.platformContract = cardPlatformContract;
