import React, { forwardRef } from "react";
import { Avatar } from "../Avatar.js";
import { Menu } from "../Menu.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeItems(items, signingOut) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item === "divider" || item?.separator || item?.label)
    .map((item) => {
      if (item === "divider" || item?.separator) return item;
      const key = String(item.key ?? item.label);
      return {
        ...item,
        key,
        tone: item.tone ?? (signingOut && key === "sign-out" ? "danger" : undefined),
        disabled: Boolean(item.disabled || signingOut),
      };
    });
}

function resolveState({ disabled, loading, signingOut, permissionBlocked, open, state }) {
  if (disabled) return "disabled";
  if (signingOut) return "signing-out";
  if (loading) return "loading";
  if (permissionBlocked) return "permission-blocked";
  if (state) return state;
  return open ? "open" : "closed";
}

export const AvatarMenu = forwardRef(function AvatarMenu({
  name,
  src,
  status = "none",
  label,
  triggerLabel,
  density,
  state,
  open,
  disabled = false,
  loading = false,
  permissionBlocked = false,
  signingOut = false,
  items = [],
  align = "end",
  onOpenChange,
  onSelect,
  className = "",
  ...rest
}, ref) {
  const resolvedLabel = label ?? (name ? `${name} account menu` : "Account menu");
  const resolvedState = resolveState({ disabled, loading, signingOut, permissionBlocked, open, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";
  const normalizedItems = normalizeItems(items, signingOut);

  if (!name || !normalizedItems.some((item) => item !== "divider" && !item?.separator)) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": resolvedLabel,
      "aria-busy": resolvedState === "loading" || resolvedState === "signing-out" ? "true" : undefined,
      "data-flow-pattern": "avatar-menu",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedItems.filter((item) => item !== "divider" && !item?.separator).length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Avatar, {
      name,
      src,
      status,
      density,
      state: isDisabled ? "disabled" : undefined,
      "aria-hidden": "true",
    }),
    React.createElement(Menu, {
      triggerLabel: triggerLabel ?? resolvedLabel,
      label: resolvedLabel,
      items: normalizedItems,
      open,
      variant: "avatar-trigger",
      avatarName: name,
      avatarStatus: status,
      density,
      state: isDisabled ? "disabled" : resolvedState === "open" ? "open" : "closed",
      align,
      disabled: isDisabled,
      onOpenChange,
      onSelect,
    }),
  );
});

AvatarMenu.displayName = "AvatarMenu";
