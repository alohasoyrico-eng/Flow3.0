/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useId, useRef, useState } from "react";
import { dialogPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";
import { focusableElements } from "./internal/focus.js";
import { flowStateProps, flowToneProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["confirmation", "destructive", "form", "review", "success"]);
const validStates = new Set(["open", "focus", "closing", "default", "closed"]);
const validTones = new Set(["neutral", "info", "success", "danger"]);
function slug(value) {
    return String(value ?? "dialog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function resolveTone(tone, variant) {
    if (tone && validTones.has(tone))
        return tone;
    if (variant === "success")
        return "success";
    if (variant === "destructive")
        return "danger";
    return "neutral";
}
function hasStableFieldName(field) {
    return field?.name !== undefined && field?.name !== null && field?.name !== "";
}
function inputVariantForField(variant) {
    if (variant === "password" || variant === "search")
        return variant;
    return undefined;
}
function inputStateForField(state) {
    if (state === "default" || state === "focus" || state === "filled" || state === "loading" || state === "error" || state === "disabled")
        return state;
    return undefined;
}
function buttonVariantForAction(action, fallback) {
    if (action.variant === "danger")
        return "primary";
    return action.variant ?? fallback;
}
export const Dialog = forwardRef(function Dialog({ label, description, triggerLabel, closeLabel, actions, open: openProp, tone, variant = "confirmation", state = "closed", density, icon, fields, children, id, onOpenChange, onAction, className = "", ...rest }, ref) {
    const reactId = useId();
    const triggerRef = useRef(null);
    const closeRef = useRef(null);
    const panelRef = useRef(null);
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "confirmation");
    const resolvedTone = resolveTone(tone, resolvedVariant);
    const resolvedDensity = normalizeFlowDensity(density);
    const initialState = normalizeFlowValue(state, validStates, "closed");
    const isOpenControlled = openProp !== undefined;
    const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
    const [internalOpen, setInternalOpen] = useState(initiallyOpen);
    const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
    const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
    const controlledInteractionState = isOpen ? "open" : initialState === "default" ? "default" : "closed";
    const resolvedInteractionState = isOpenControlled ? controlledInteractionState : interactionState;
    const resolvedState = isOpen ? resolvedInteractionState : resolvedInteractionState === "default" ? "default" : "closed";
    const dialogId = id || `dialog-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const titleId = `${dialogId}-title`;
    const resolvedIcon = icon || { danger: "warning", info: "info", success: "check_circle", neutral: "" }[resolvedTone];
    const hasTrigger = Boolean(triggerLabel);
    const sourceFields = Array.isArray(fields) ? fields : [];
    const visibleFields = sourceFields.filter((field) => field?.label && hasStableFieldName(field));
    const focusInitialElement = () => {
        if (closeRef.current) {
            closeRef.current?.focus();
            return;
        }
        const target = focusableElements(panelRef.current)[0] ?? panelRef.current;
        target?.focus();
    };
    const setOpen = (nextOpen, { restoreFocus = false, event } = {}) => {
        const normalizedOpen = Boolean(nextOpen);
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        if (!isOpenControlled)
            setInteractionState(normalizedOpen ? "open" : "closed");
        onOpenChange?.(normalizedOpen, event);
        if (normalizedOpen)
            requestAnimationFrame(focusInitialElement);
        if (restoreFocus)
            requestAnimationFrame(() => triggerRef.current?.focus());
    };
    const closeDialog = ({ restoreFocus = true, event } = {}) => setOpen(false, { restoreFocus, event });
    const onKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeDialog({ event });
            return;
        }
        if (event.key !== "Tab" || !isOpen)
            return;
        const focusables = focusableElements(panelRef.current);
        if (!focusables.length) {
            event.preventDefault();
            panelRef.current?.focus();
            return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
            event.preventDefault();
            last.focus();
            return;
        }
        if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    };
    const sourceActions = Array.isArray(actions) ? actions : [];
    const resolvedActions = sourceActions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "");
    if (!label)
        return null;
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        className: ["dialog", `dialog--${resolvedTone}`, className].filter(Boolean).join(" "),
        "data-open": String(Boolean(isOpen)),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowToneProps(resolvedTone),
        ...flowDensityProps(resolvedDensity),
    }, hasTrigger ? React.createElement(Button, {
        ref: triggerRef,
        label: triggerLabel ?? "",
        variant: "secondary",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        className: "dialog__trigger",
        "data-overlay-open": "",
        "aria-haspopup": "dialog",
        "aria-expanded": Boolean(isOpen),
        "aria-controls": dialogId,
        onClick: (event) => setOpen(true, { event }),
    }) : null, React.createElement("div", {
        className: "dialog__overlay",
        hidden: !isOpen,
        "data-overlay-dismiss": "",
        onClick: (event) => {
            if (event.target === event.currentTarget)
                closeDialog({ event });
        },
        onKeyDown,
    }, React.createElement("section", {
        ref: panelRef,
        className: "dialog__panel",
        id: dialogId,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        tabIndex: -1,
        onClick: (event) => event.stopPropagation(),
    }, React.createElement("header", { className: "dialog__header" }, resolvedIcon ? React.createElement("span", { className: "dialog__icon", "aria-hidden": "true" }, resolvedIcon) : null, React.createElement("div", { className: "dialog__content" }, React.createElement("h3", { id: titleId }, label), description ? React.createElement("p", null, description) : null), closeLabel ? React.createElement(IconButton, {
        ref: closeRef,
        label: closeLabel,
        icon: "close",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        variant: "ghost",
        className: "dialog__close",
        "data-overlay-close": "",
        onClick: (event) => closeDialog({ event }),
    }) : null), visibleFields.length
        ? React.createElement("div", { className: "dialog__body dialog__fields" }, visibleFields.map((field) => {
            const { variant: fieldVariant, state: fieldState, density: fieldDensity, readOnly, ...fieldProps } = field;
            const mappedVariant = inputVariantForField(fieldVariant);
            const mappedState = inputStateForField(fieldState);
            return React.createElement(Input, {
                ...fieldProps,
                key: field.name,
                ...(fieldDensity ?? resolvedDensity ? { density: (fieldDensity ?? resolvedDensity) } : {}),
                ...(mappedVariant ? { variant: mappedVariant } : {}),
                ...(mappedState ? { state: mappedState } : {}),
                readOnly: readOnly ?? true,
            });
        }))
        : null, children
        ? React.createElement("div", { className: "dialog__body" }, children)
        : null, resolvedActions.length
        ? React.createElement("footer", null, resolvedActions.map((action, index) => {
            const actionLabel = action.label;
            const needsDangerIntent = action.intent == null && resolvedTone === "danger" && index === resolvedActions.length - 1;
            const { variant: actionVariantValue, intent: actionIntent, density: actionDensity, key: actionKey, ...actionProps } = action;
            return React.createElement(Button, {
                ...actionProps,
                key: action.key,
                label: actionLabel,
                ...(actionDensity ?? resolvedDensity ? { density: (actionDensity ?? resolvedDensity) } : {}),
                variant: buttonVariantForAction(action, index === resolvedActions.length - 1 ? "primary" : "secondary"),
                ...(actionVariantValue === "danger" || needsDangerIntent || actionIntent ? { intent: actionVariantValue === "danger" ? "danger" : needsDangerIntent ? "danger" : actionIntent } : {}),
                "data-overlay-close": "",
                "data-key": actionKey,
                onClick: (event) => {
                    action.onClick?.(event);
                    if (event.defaultPrevented)
                        return;
                    if (actionKey)
                        onAction?.(actionKey, event);
                    closeDialog({ event });
                },
            });
        }))
        : null)));
});
Dialog.displayName = "Dialog";
Dialog.platformContract = dialogPlatformContract;
