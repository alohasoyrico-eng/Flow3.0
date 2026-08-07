import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { drawerPlatformContract } from "#flow/platforms";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";
import { ProgressIndicator } from "./ProgressIndicator.js";
import { flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["side-sheet", "filter", "detail", "edit", "review"]);
const validStates = new Set(["closed", "default", "open", "focus", "closing"]);
const validTones = new Set(["neutral", "info", "danger"]);
const validDensities = new Set(["sm", "md", "lg"]);
const validSides = new Set(["left", "right"]);

function normalize(value, valid, fallback) {
  return valid.has(value) ? value : fallback;
}

function slug(value) {
  return String(value ?? "drawer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeField(field) {
  return typeof field === "string" ? { label: field } : field ?? {};
}

function renderContentItem(item, density, index) {
  if (item?.type === "badge") {
    return React.createElement(
      "div",
      { className: "drawer__status-row", key: item.key ?? item.label ?? index },
      React.createElement(Badge, {
        label: item.label,
        tone: item.tone ?? "success",
        variant: item.variant ?? "status",
        live: Boolean(item.live),
      }),
    );
  }
  if (item?.type === "progress") {
    return React.createElement(
      "div",
      { className: "drawer__progress-row", key: item.key ?? item.label ?? index },
      React.createElement(ProgressIndicator, {
        label: item.label ?? "Progress",
        value: item.value ?? 0,
        max: item.max ?? 100,
        showValue: item.showValue ?? true,
        tone: item.tone ?? "accent",
        density: density === "lg" ? "md" : density,
        fullWidth: true,
      }),
    );
  }
  if (item?.type === "text") {
    return React.createElement(
      "p",
      { className: "drawer__supporting-copy", key: item.key ?? item.copy ?? item.label ?? index },
      item.copy ?? item.label ?? "",
    );
  }
  return null;
}

export const Drawer = forwardRef(function Drawer({
  label = "Drawer",
  description = "",
  triggerLabel = "Open drawer",
  variant = "side-sheet",
  state = "closed",
  tone = "neutral",
  density,
  side = "right",
  fields = [],
  content = [],
  actions = [],
  open: openProp,
  id = "",
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const resolvedVariant = normalize(variant, validVariants, "side-sheet");
  const initialState = normalize(state, validStates, "closed");
  const resolvedTone = normalize(tone, validTones, "neutral");
  const resolvedDensity = validDensities.has(density) ? density : undefined;
  const resolvedSide = normalize(side, validSides, "right");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
  const drawerId = id || `drawer-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${drawerId}-title`;
  const resolvedActions = actions.length ? actions : [
    { label: "Save", key: "save", variant: "primary" },
    { label: "Cancel", key: "cancel", variant: "ghost" },
  ];

  useEffect(() => {
    if (!isOpenControlled) return;
    const normalizedOpen = Boolean(openProp);
    setInteractionState(normalizedOpen ? "open" : initialState === "default" ? "default" : "closed");
  }, [openProp, initialState, isOpenControlled]);

  const setOpen = (nextOpen, { restoreFocus = false } = {}) => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen);
    if (normalizedOpen) requestAnimationFrame(() => closeRef.current?.focus());
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const closeDrawer = ({ restoreFocus = true } = {}) => setOpen(false, { restoreFocus });

  const onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeDrawer();
  };

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["drawer", `drawer--${resolvedTone}`, className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": isOpen ? interactionState : interactionState === "default" ? "default" : "closed",
      "data-tone": resolvedTone,
      ...flowDensityProps(resolvedDensity),
      "data-open": String(Boolean(isOpen)),
      "data-side": resolvedSide,
    },
    React.createElement(Button, {
      ref: triggerRef,
      label: triggerLabel,
      variant: "secondary",
      density: resolvedDensity,
      className: "drawer__trigger",
      "data-overlay-open": "",
      "aria-haspopup": "dialog",
      "aria-expanded": String(Boolean(isOpen)),
      "aria-controls": drawerId,
      onClick: () => setOpen(true),
    }),
    React.createElement(
      "div",
      {
        className: "drawer__overlay",
        hidden: !isOpen,
        "data-overlay-dismiss": "",
        onClick: (event) => {
          if (event.target === event.currentTarget) closeDrawer();
        },
        onKeyDown,
      },
      React.createElement(
        "aside",
        {
          className: "drawer__panel",
          id: drawerId,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          onClick: (event) => event.stopPropagation(),
        },
        React.createElement(
          "header",
          null,
          React.createElement("strong", { id: titleId }, label),
          React.createElement(IconButton, {
            ref: closeRef,
            icon: "close",
            ariaLabel: "Close drawer",
            density: resolvedDensity,
            variant: "ghost",
            className: "drawer__close",
            "data-overlay-close": "",
            onClick: () => closeDrawer(),
          }),
          description ? React.createElement("p", null, description) : null,
        ),
        React.createElement(
          "div",
          { className: "drawer__body" },
          content.map((item, index) => renderContentItem(item, resolvedDensity, index)),
          fields.map((field, index) => {
            const normalized = normalizeField(field);
            return React.createElement(Input, {
              ...normalized,
              key: normalized.name ?? normalized.label ?? index,
              density: normalized.density ?? resolvedDensity,
              value: normalized.value ?? "",
              readOnly: normalized.readOnly ?? true,
            });
          }),
        ),
        resolvedActions.length
          ? React.createElement(
            "footer",
            null,
            resolvedActions.map((action, index) => {
              const actionLabel = action.label ?? "Action";
              const actionVariant = action.intent === "danger" || action.variant === "danger" ? "primary" : action.variant ?? (index === 0 ? "primary" : "secondary");
              return React.createElement(Button, {
                ...action,
                key: action.key ?? actionLabel,
                label: actionLabel,
                density: action.density ?? resolvedDensity,
                variant: actionVariant,
                intent: action.intent ?? (action.variant === "danger" ? "danger" : undefined),
                "data-overlay-close": "",
                "data-key": action.key ?? actionLabel,
                onClick: (event) => {
                  action.onClick?.(event);
                  onAction?.(action.key ?? actionLabel);
                  closeDrawer();
                },
              });
            }),
          )
          : null,
      ),
    ),
  );
});

Drawer.displayName = "Drawer";
Drawer.platformContract = drawerPlatformContract;
