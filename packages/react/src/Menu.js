import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { menuPlatformContract } from "@design-system/components/platforms";
import { Avatar } from "./Avatar.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["actions", "grouped", "selection", "danger", "icon-trigger", "avatar-trigger"]);
const validStates = new Set(["default", "closed", "open", "focus", "disabled"]);
const validItemTones = new Set(["danger"]);

function slug(value) {
  return String(value ?? "menu").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function enabledItems(panel) {
  return [...(panel?.querySelectorAll?.('[role="menuitem"]:not(:disabled)') ?? [])];
}

export const Menu = forwardRef(function Menu({
  triggerLabel = "",
  triggerAriaLabel,
  menuAriaLabel,
  avatarTriggerAriaLabel,
  items = [],
  open: openProp,
  label = "",
  variant = "actions",
  avatarName = "",
  avatarStatus = "none",
  avatarSize = "md",
  density,
  state = "default",
  align = "start",
  disabled = false,
  onOpenChange,
  onSelect,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "actions");
  const resolvedDensity = normalizeFlowDensity(density);
  const initialState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? "open" : initialState);
  const menuId = `menu-${slug(label || triggerLabel)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const isDisabled = disabled || interactionState === "disabled";
  const resolvedAlign = align === "end" || align === "right" ? "end" : "start";
  const resolvedItems = items;

  useEffect(() => {
    if (!isOpenControlled) return;
    const normalizedOpen = Boolean(openProp);
    setInteractionState(normalizedOpen ? "open" : initialState);
  }, [openProp, initialState, isOpenControlled]);

  const setOpen = (nextOpen, { restoreFocus = false, focusFirst = false } = {}) => {
    if (isDisabled) return;
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
    if (focusFirst) requestAnimationFrame(() => enabledItems(panelRef.current)[0]?.focus());
  };
  const moveItem = (event, direction) => {
    const enabled = enabledItems(panelRef.current);
    if (!enabled.length) return;
    event.preventDefault();
    const index = Math.max(0, enabled.indexOf(event.target));
    enabled[(index + direction + enabled.length) % enabled.length]?.focus();
  };
  const onPanelKeyDown = (event) => {
    if (event.key === "ArrowDown") moveItem(event, 1);
    else if (event.key === "ArrowUp") moveItem(event, -1);
    else if (event.key === "Home") { event.preventDefault(); enabledItems(panelRef.current)[0]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); enabledItems(panelRef.current).at(-1)?.focus(); }
    else if (event.key === "Escape") { event.preventDefault(); setOpen(false, { restoreFocus: true }); }
  };
  const triggerProps = {
    ref: triggerRef,
    disabled: isDisabled,
    className: "menu__trigger",
    "data-menu-trigger": "",
    "aria-haspopup": "menu",
    "aria-label": triggerLabel ? undefined : triggerAriaLabel,
    "aria-expanded": String(Boolean(isOpen)),
    "aria-controls": menuId,
    onClick: () => setOpen(!isOpen, { focusFirst: !isOpen }),
    onKeyDown: (event) => {
      if (event.key === "ArrowDown") { event.preventDefault(); setOpen(true, { focusFirst: true }); }
      if (event.key === "Escape") { event.preventDefault(); setOpen(false, { restoreFocus: true }); }
    },
  };
  const iconTriggerLabel = triggerAriaLabel || triggerLabel || label || undefined;
  const avatarAccessibleLabel = avatarTriggerAriaLabel || triggerAriaLabel || triggerLabel || label || undefined;

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["menu", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(isDisabled ? "disabled" : interactionState),
      "data-align": resolvedAlign,
      "data-open": String(Boolean(isOpen)),
    },
    resolvedVariant === "icon-trigger"
      ? React.createElement(IconButton, { ...triggerProps, ariaLabel: iconTriggerLabel, icon: "more_horiz", variant: "ghost", density: resolvedDensity })
      : resolvedVariant === "avatar-trigger"
        ? React.createElement("button", { ...triggerProps, type: "button", className: "menu__trigger menu__trigger--avatar", "aria-label": avatarAccessibleLabel }, React.createElement(Avatar, { name: avatarName, status: avatarStatus, size: avatarSize, density: resolvedDensity }))
        : React.createElement(Button, { ...triggerProps, label: triggerLabel, variant: "secondary", density: resolvedDensity, trailingIcon: isOpen ? "expand_less" : "expand_more" }),
    React.createElement(
      "div",
      {
        ref: panelRef,
        className: "menu__panel",
        "data-menu-panel": "",
        hidden: !isOpen,
        id: menuId,
        role: "menu",
        "aria-label": menuAriaLabel || label || undefined,
        onKeyDown: onPanelKeyDown,
      },
      resolvedItems.map((item, index) => {
        if (item === "divider" || item?.separator) return React.createElement("span", { key: `separator-${index}`, className: "menu__separator", role: "separator" });
        const key = item.key ?? item.label ?? String(index);
        return React.createElement(
          "button",
          {
            key,
            type: "button",
            className: "menu__item",
            disabled: Boolean(item.disabled),
            role: "menuitem",
            tabIndex: -1,
            "data-key": key,
            ...flowToneProps(normalizeFlowValue(item.tone, validItemTones, undefined)),
            "aria-disabled": item.disabled ? "true" : undefined,
            onClick: () => {
              if (item.disabled) return;
              onSelect?.(item);
              setOpen(false, { restoreFocus: true });
            },
          },
          item.icon ? React.createElement("span", { className: "menu__item-icon", "aria-hidden": "true" }, item.icon) : null,
          React.createElement("span", { className: "menu__item-label" }, item.label ?? ""),
          item.shortcut ? React.createElement("kbd", { className: "menu__item-shortcut" }, item.shortcut) : null,
        );
      }),
    ),
  );
});

Menu.displayName = "Menu";
Menu.platformContract = menuPlatformContract;
