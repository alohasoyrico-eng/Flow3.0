import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { dialogPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";
import { flowStateProps, flowToneProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["confirmation", "destructive", "form", "review", "success"]);
const validStates = new Set(["open", "focus", "closing", "default", "closed"]);
const validTones = new Set(["neutral", "info", "success", "danger"]);

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
  label = "",
  description = "",
  triggerLabel = "",
  triggerAriaLabel,
  dialogAriaLabel,
  closeLabel,
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
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "confirmation");
  const resolvedTone = resolveTone(tone, resolvedVariant);
  const resolvedDensity = normalizeFlowDensity(density);
  const initialState = normalizeFlowValue(state, validStates, "closed");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
  const dialogId = id || `dialog-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = label ? `${dialogId}-title` : undefined;
  const resolvedIcon = icon || { danger: "warning", info: "info", success: "check_circle", neutral: "" }[resolvedTone];
  const hasTrigger = Boolean(triggerLabel);
  const visibleFields = Array.isArray(fields) ? fields.filter((field) => field?.label) : [];

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

  const resolvedActions = Array.isArray(actions)
    ? actions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "")
    : [];

  useEffect(() => {
    if (!isOpenControlled) return;
    const normalizedOpen = Boolean(openProp);
    setInteractionState(normalizedOpen ? "open" : initialState === "default" ? "default" : "closed");
  }, [openProp, initialState, isOpenControlled]);

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["dialog", `dialog--${resolvedTone}`, className].filter(Boolean).join(" "),
      "data-open": String(Boolean(isOpen)),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(isOpen ? interactionState : interactionState === "default" ? "default" : "closed"),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
    },
    hasTrigger ? React.createElement(Button, {
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
    }) : null,
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
          "aria-label": label ? undefined : dialogAriaLabel,
          onClick: (event) => event.stopPropagation(),
        },
        React.createElement(
          "header",
          { className: "dialog__header" },
          resolvedIcon ? React.createElement("span", { className: "dialog__icon", "aria-hidden": "true" }, resolvedIcon) : null,
          React.createElement(
            "div",
            { className: "dialog__content" },
            label ? React.createElement("h3", { id: titleId }, label) : null,
            description ? React.createElement("p", null, description) : null,
          ),
          closeLabel ? React.createElement(IconButton, {
            ref: closeRef,
            ariaLabel: closeLabel,
            icon: "close",
            density: resolvedDensity,
            variant: "ghost",
            className: "dialog__close",
            "data-overlay-close": "",
            onClick: () => closeDialog(),
          }) : null,
        ),
        visibleFields.length
          ? React.createElement(
            "div",
            { className: "dialog__body dialog__fields" },
            visibleFields.map((field, index) => React.createElement(Input, {
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
              const actionLabel = action.label;
              const needsDangerIntent = action.intent == null && resolvedTone === "danger" && index === 0;
              return React.createElement(Button, {
                ...action,
                key: action.key,
                label: actionLabel,
                density: action.density ?? resolvedDensity,
                variant: action.variant === "danger" ? "primary" : action.variant ?? (index === 0 ? "primary" : "secondary"),
                intent: action.variant === "danger" ? "danger" : needsDangerIntent ? "danger" : action.intent,
                "data-overlay-close": "",
                "data-key": action.key,
                onClick: (event) => {
                  action.onClick?.(event);
                  onAction?.(action.key);
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
