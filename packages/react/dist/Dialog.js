import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { dialogPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";

const validVariants = new Set(["confirmation", "destructive", "form", "review", "success"]);
const validStates = new Set(["open", "focus", "closing", "default", "closed"]);
const validTones = new Set(["neutral", "info", "success", "danger"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalize(value, valid, fallback) {
  return valid.has(value) ? value : fallback;
}

function slug(value) {
  return String(value ?? "dialog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function resolveTone(tone, variant) {
  if (validTones.has(tone)) return tone;
  if (variant === "success") return "success";
  if (variant === "destructive") return "danger";
  return "neutral";
}

export const Dialog = forwardRef(function Dialog({
  label = "Dialog",
  description = "",
  triggerLabel = "Open dialog",
  actions = [],
  open: openProp,
  tone = "neutral",
  variant = "confirmation",
  state = "closed",
  density,
  icon = "",
  fields = [],
  id = "",
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const resolvedVariant = normalize(variant, validVariants, "confirmation");
  const resolvedTone = resolveTone(tone, resolvedVariant);
  const resolvedDensity = validDensities.has(density) ? density : undefined;
  const initialState = normalize(state, validStates, "closed");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
  const dialogId = id || `dialog-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${dialogId}-title`;
  const resolvedIcon = icon || { danger: "warning", info: "info", success: "check_circle", neutral: "" }[resolvedTone];

  const setOpen = (nextOpen, { restoreFocus = false } = {}) => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen);
    if (normalizedOpen) requestAnimationFrame(() => closeRef.current?.focus());
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const closeDialog = ({ restoreFocus = true } = {}) => setOpen(false, { restoreFocus });

  const onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeDialog();
  };

  const resolvedActions = actions.length ? actions : [
    { label: resolvedTone === "danger" ? "Confirm" : "Continue", key: "confirm", variant: "primary" },
    { label: "Cancel", key: "cancel", variant: "secondary" },
  ];

  useEffect(() => {
    if (!isOpenControlled) return;
    const normalizedOpen = Boolean(openProp);
    setInteractionState(normalizedOpen ? "open" : initialState === "default" ? "default" : "closed");
  }, [openProp, initialState, isOpenControlled]);

  return React.createElement(
    "div",
    {
      ...rest,
      ref,
      className: ["dialog", `dialog--${resolvedTone}`, className].filter(Boolean).join(" "),
      "data-open": String(Boolean(isOpen)),
      "data-variant": resolvedVariant,
      "data-state": isOpen ? interactionState : interactionState === "default" ? "default" : "closed",
      "data-tone": resolvedTone,
      "data-density": resolvedDensity,
    },
    React.createElement(Button, {
      ref: triggerRef,
      label: triggerLabel,
      variant: "secondary",
      density: resolvedDensity,
      className: "dialog__trigger",
      "data-overlay-open": "",
      "aria-haspopup": "dialog",
      "aria-expanded": String(Boolean(isOpen)),
      "aria-controls": dialogId,
      onClick: () => setOpen(true),
    }),
    React.createElement(
      "div",
      {
        className: "dialog__overlay",
        hidden: !isOpen,
        "data-overlay-dismiss": "",
        onClick: (event) => {
          if (event.target === event.currentTarget) closeDialog();
        },
        onKeyDown,
      },
      React.createElement(
        "section",
        {
          className: "dialog__panel",
          id: dialogId,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          onClick: (event) => event.stopPropagation(),
        },
        React.createElement(
          "header",
          { className: "dialog__header" },
          resolvedIcon ? React.createElement("span", { className: "dialog__icon", "aria-hidden": "true" }, resolvedIcon) : null,
          React.createElement(
            "div",
            { className: "dialog__content" },
            React.createElement("h3", { id: titleId }, label),
            description ? React.createElement("p", null, description) : null,
          ),
          React.createElement(IconButton, {
            ref: closeRef,
            ariaLabel: "Close dialog",
            icon: "close",
            density: resolvedDensity,
            variant: "ghost",
            className: "dialog__close",
            "data-overlay-close": "",
            onClick: () => closeDialog(),
          }),
        ),
        fields.length
          ? React.createElement(
            "div",
            { className: "dialog__body dialog__fields" },
            fields.map((field, index) => React.createElement(Input, {
              ...field,
              key: field.name ?? field.label ?? index,
              density: field.density ?? resolvedDensity,
              readOnly: field.readOnly ?? true,
            })),
          )
          : null,
        resolvedActions.length
          ? React.createElement(
            "footer",
            null,
            resolvedActions.map((action, index) => {
              const actionLabel = action.label ?? "Action";
              const needsDangerIntent = action.intent == null && resolvedTone === "danger" && index === 0;
              return React.createElement(Button, {
                ...action,
                key: action.key ?? actionLabel,
                label: actionLabel,
                density: action.density ?? resolvedDensity,
                variant: action.variant === "danger" ? "primary" : action.variant ?? (index === 0 ? "primary" : "secondary"),
                intent: action.variant === "danger" ? "danger" : needsDangerIntent ? "danger" : action.intent,
                "data-overlay-close": "",
                "data-key": action.key ?? actionLabel,
                onClick: (event) => {
                  action.onClick?.(event);
                  onAction?.(action.key ?? actionLabel);
                  closeDialog();
                },
              });
            }),
          )
          : null,
      ),
    ),
  );
});

Dialog.displayName = "Dialog";
Dialog.platformContract = dialogPlatformContract;
