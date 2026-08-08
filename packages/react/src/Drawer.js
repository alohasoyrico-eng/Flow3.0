import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { drawerPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";
import { ProgressIndicator } from "./ProgressIndicator.js";
import { flowStateProps, flowToneProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["side-sheet", "filter", "detail", "edit", "review"]);
const validStates = new Set(["closed", "default", "open", "focus", "closing"]);
const validTones = new Set(["neutral", "info", "danger"]);
const validSides = new Set(["left", "right"]);

function slug(value) {
  return String(value ?? "drawer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hasStableKey(item) {
  return item?.key !== undefined && item?.key !== null && item?.key !== "";
}

function hasStableFieldName(field) {
  return field?.name !== undefined && field?.name !== null && field?.name !== "";
}

function renderContentItem(item, density) {
  if (!hasStableKey(item)) return null;
  if (item?.type === "badge") {
    if (!item.label) return null;
    return React.createElement(
      "div",
      { className: "drawer__status-row", key: item.key },
      React.createElement(Badge, {
        label: item.label,
        tone: item.tone ?? "success",
        variant: item.variant ?? "status",
        live: Boolean(item.live),
        density: item.density ?? density,
      }),
    );
  }
  if (item?.type === "progress") {
    if (!item.label || item.value === undefined || item.value === null) return null;
    return React.createElement(
      "div",
      { className: "drawer__progress-row", key: item.key },
      React.createElement(ProgressIndicator, {
        label: item.label,
        value: item.value,
        max: item.max ?? 100,
        showValue: item.showValue ?? true,
        tone: item.tone ?? "accent",
        density: item.density ?? density,
        fullWidth: true,
      }),
    );
  }
  if (item?.type === "text") {
    const copy = item.copy ?? item.label;
    if (!copy) return null;
    return React.createElement(
      "p",
      { className: "drawer__supporting-copy", key: item.key },
      copy,
    );
  }
  return null;
}

export const Drawer = forwardRef(function Drawer({
  label,
  description,
  triggerLabel,
  closeLabel,
  variant = "side-sheet",
  state = "closed",
  tone = "neutral",
  density,
  side = "right",
  fields,
  content,
  actions,
  open: openProp,
  id,
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "side-sheet");
  const initialState = normalizeFlowValue(state, validStates, "closed");
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedSide = normalizeFlowValue(side, validSides, "right");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
  const drawerId = id || `drawer-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${drawerId}-title`;
  const sourceActions = Array.isArray(actions) ? actions : [];
  const resolvedActions = sourceActions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "");
  const hasTrigger = Boolean(triggerLabel);
  const sourceFields = Array.isArray(fields) ? fields : [];
  const sourceContent = Array.isArray(content) ? content : [];
  const visibleFields = sourceFields.filter((field) => field?.label && hasStableFieldName(field));

  useEffect(() => {
    if (!isOpenControlled) return;
    const normalizedOpen = Boolean(openProp);
    setInteractionState(normalizedOpen ? "open" : initialState === "default" ? "default" : "closed");
  }, [openProp, initialState, isOpenControlled]);

  if (!label) return null;

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
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(isOpen ? interactionState : interactionState === "default" ? "default" : "closed"),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
      "data-open": String(Boolean(isOpen)),
      "data-side": resolvedSide,
    },
    hasTrigger ? React.createElement(Button, {
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
    }) : null,
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
          closeLabel ? React.createElement(IconButton, {
            ref: closeRef,
            icon: "close",
            label: closeLabel,
            density: resolvedDensity,
            variant: "ghost",
            className: "drawer__close",
            "data-overlay-close": "",
            onClick: () => closeDrawer(),
          }) : null,
          description ? React.createElement("p", null, description) : null,
        ),
        React.createElement(
          "div",
          { className: "drawer__body" },
          sourceContent.map((item) => renderContentItem(item, resolvedDensity)),
          visibleFields.map((field) => {
            const normalized = field ?? {};
            return React.createElement(Input, {
              ...normalized,
              key: normalized.name,
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
              const actionLabel = action.label;
              const actionVariant = action.intent === "danger" || action.variant === "danger" ? "primary" : action.variant ?? (index === 0 ? "primary" : "secondary");
              return React.createElement(Button, {
                ...action,
                key: action.key,
                label: actionLabel,
                density: action.density ?? resolvedDensity,
                variant: actionVariant,
                intent: action.intent ?? (action.variant === "danger" ? "danger" : undefined),
                "data-overlay-close": "",
                "data-key": action.key,
                onClick: (event) => {
                  action.onClick?.(event);
                  onAction?.(action.key);
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
