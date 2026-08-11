import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { IconButton } from "../IconButton.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import { Surface } from "../Surface.js";
import { DrawerAdapter } from "./DrawerAdapter.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeActions(actions) {
  return (Array.isArray(actions) ? actions : []).filter((action) => action?.label);
}

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter((item) => item?.label);
}

function resolveState({ open, dragging, loading, invalid, destructive, permissionBlocked, disabled, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (invalid || state === "invalid") return "invalid";
  if (destructive || state === "destructive") return "destructive";
  if (dragging || state === "dragging") return "dragging";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

export const BottomSheet = forwardRef(function BottomSheet({
  label,
  description,
  density,
  state,
  open = false,
  dragging = false,
  loading = false,
  invalid = false,
  destructive = false,
  permissionBlocked = false,
  disabled = false,
  triggerLabel,
  closeLabel = "Close",
  items = [],
  actions = [],
  validation,
  drawer,
  className = "",
  onOpenChange,
  onAction,
  onSelect,
  ...rest
}, ref) {
  const normalizedItems = normalizeItems(items);
  const normalizedActions = normalizeActions(actions);
  const resolvedState = resolveState({ open, dragging, loading, invalid: invalid || Boolean(validation?.message), destructive, permissionBlocked, disabled, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";

  if (!label) return null;

  return React.createElement(
    Surface,
    {
      ref,
      surfaceRole: "overlay",
      elevation: open ? "overlay" : "none",
      state: open ? "overlay" : "default",
      density,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": loading ? "true" : undefined,
      "data-flow-pattern": "bottom-sheet",
      "data-state": resolvedState,
      "data-open": String(Boolean(open)),
      ...sanitizeRestProps(rest),
    },
    React.createElement(DrawerAdapter, {
      label,
      description,
      density,
      open,
      modal: true,
      loading,
      disabled: isDisabled,
      state: open ? "modal" : "closed",
      drawer: {
        triggerLabel,
        closeLabel,
        side: "right",
        variant: "detail",
        tone: destructive ? "danger" : "neutral",
        ...drawer,
      },
      list: normalizedItems.length
        ? {
          label: `${label} content`,
          items: normalizedItems,
          interactive: true,
          density,
          onSelect,
        }
        : undefined,
      actions: normalizedActions.map((action) => ({
        ...action,
        disabled: isDisabled || action.disabled,
        onClick: (event) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(action.key ?? action.label, event);
        },
      })),
      onOpenChange,
      onAction,
      "data-bottom-sheet-boundary": "drawer-adapter",
    }),
    closeLabel && open
      ? React.createElement(IconButton, {
        label: closeLabel,
        icon: "close",
        variant: "ghost",
        density,
        disabled: isDisabled,
        onClick: (event) => onOpenChange?.(false, event),
        "data-flow-slot": "close",
      })
      : null,
    normalizedItems.length && !open
      ? React.createElement(List, {
        label: `${label} preview`,
        items: normalizedItems.slice(0, 3),
        density,
        state: isDisabled ? "disabled" : "default",
        onSelect,
      })
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? "error",
        density,
        live: validation.live,
      })
      : null,
    normalizedActions.length && !open
      ? React.createElement(
        "div",
        { "data-flow-slot": "actions" },
        normalizedActions.map((action) => React.createElement(Button, {
          ...action,
          key: action.key ?? action.label,
          label: action.label,
          density: action.density ?? density,
          disabled: isDisabled || action.disabled,
          onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented) return;
            onAction?.(action.key ?? action.label, event);
          },
        })),
      )
      : null,
  );
});

BottomSheet.displayName = "BottomSheet";
