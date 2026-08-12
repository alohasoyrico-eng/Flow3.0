import React, { forwardRef, useId, useRef, useState } from "react";
import { popoverPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { Input } from "./Input.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["information", "action", "form", "metric"]);
const validStates = new Set(["default", "closed", "open", "hover", "focus", "warning", "disabled"]);
const validPlacements = new Set(["top", "right", "bottom", "left"]);
function slug(value) {
    return String(value ?? "popover").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function buttonVariantForAction(action) {
    if (action.variant === "danger")
        return "primary";
    return action.variant ?? "secondary";
}
export const Popover = forwardRef(function Popover({ triggerLabel, title, description, id, open: openProp, variant = "information", state = "default", placement = "bottom", density, fullWidth = false, disabled = false, actions, field, onOpenChange, onAction, className = "", ...rest }, ref) {
    const reactId = useId();
    const triggerRef = useRef(null);
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "information");
    const resolvedPlacement = normalizeFlowValue(placement, validPlacements, "bottom");
    const resolvedDensity = normalizeFlowDensity(density);
    const initialState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
    const isOpenControlled = openProp !== undefined;
    const initiallyOpen = Boolean(openProp) || ["open", "focus", "warning"].includes(initialState);
    const [internalOpen, setInternalOpen] = useState(initiallyOpen);
    const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
    const [interactionState, setInteractionState] = useState(initiallyOpen ? "open" : initialState);
    const resolvedInteractionState = isOpenControlled ? (isOpen ? "open" : initialState) : interactionState;
    const panelId = id || `popover-${slug(triggerLabel)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const titleId = `${panelId}-title`;
    const sourceActions = Array.isArray(actions) ? actions : [];
    const resolvedActions = sourceActions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "");
    const isDisabled = disabled || resolvedInteractionState === "disabled";
    const hasTrigger = Boolean(triggerLabel);
    const hasField = Boolean(field?.label);
    if (!triggerLabel || !title)
        return null;
    const setOpen = (nextOpen, { restoreFocus = false, event } = {}) => {
        if (isDisabled)
            return;
        const normalizedOpen = Boolean(nextOpen);
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        if (!isOpenControlled)
            setInteractionState(normalizedOpen ? "open" : "closed");
        onOpenChange?.(normalizedOpen, event);
        if (restoreFocus)
            requestAnimationFrame(() => triggerRef.current?.focus());
    };
    const closeFromKeyboard = (event) => {
        if (event.key !== "Escape")
            return;
        event.preventDefault();
        setOpen(false, { restoreFocus: true, event });
    };
    return React.createElement("span", {
        ...flowRestProps(rest),
        ref,
        className: ["popover", className].filter(Boolean).join(" "),
        "data-open": String(Boolean(isOpen)),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(isDisabled ? "disabled" : resolvedInteractionState),
        "data-placement": resolvedPlacement,
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
    }, hasTrigger ? React.createElement(Button, {
        ref: triggerRef,
        label: triggerLabel,
        variant: resolvedVariant === "metric" ? "tertiary" : "secondary",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        trailingIcon: isOpen ? "expand_less" : "expand_more",
        disabled: isDisabled,
        fullWidth,
        className: "popover__trigger",
        "data-popover-trigger": "",
        "aria-haspopup": "dialog",
        "aria-expanded": Boolean(isOpen),
        "aria-controls": panelId,
        onClick: (event) => setOpen(!isOpen, { event }),
        onKeyDown: closeFromKeyboard,
    }) : null, React.createElement("section", {
        className: "popover__panel",
        hidden: !isOpen,
        id: panelId,
        role: "dialog",
        "aria-labelledby": titleId,
        onKeyDown: closeFromKeyboard,
    }, React.createElement("strong", { id: titleId }, title), description ? React.createElement("p", null, description) : null, resolvedVariant === "form" && hasField && field
        ? React.createElement(Input, {
            label: field.label,
            value: field?.value ?? "",
            ...(field?.placeholder ? { placeholder: field.placeholder } : {}),
            ...(field?.helper ? { helper: field.helper } : {}),
            ...(resolvedDensity ? { density: resolvedDensity } : {}),
            readOnly: true,
        })
        : null, resolvedActions.length
        ? React.createElement("footer", { className: "popover__actions" }, resolvedActions.map((action) => {
            const actionLabel = action.label;
            const { variant: actionVariantValue, intent: actionIntent, density: actionDensity, key: actionKey, ...actionProps } = action;
            return React.createElement(Button, {
                ...actionProps,
                key: action.key,
                label: actionLabel,
                ...(actionDensity ?? resolvedDensity ? { density: (actionDensity ?? resolvedDensity) } : {}),
                variant: buttonVariantForAction(action),
                ...(actionIntent ?? actionVariantValue === "danger" ? { intent: actionIntent ?? "danger" } : {}),
                "data-popover-action": "",
                "data-key": actionKey,
                onClick: (event) => {
                    action.onClick?.(event);
                    if (event.defaultPrevented)
                        return;
                    if (actionKey)
                        onAction?.(actionKey, event);
                    setOpen(false, { restoreFocus: true, event });
                },
            });
        }))
        : null));
});
Popover.displayName = "Popover";
Popover.platformContract = popoverPlatformContract;
