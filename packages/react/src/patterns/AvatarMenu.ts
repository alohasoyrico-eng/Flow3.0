import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Avatar } from "../Avatar.js";
import type { AvatarDensity, AvatarStatus } from "../Avatar.js";
import { Menu } from "../Menu.js";
import type { MenuAlign, MenuItem, MenuOpenChangeEvent, MenuSeparator } from "../Menu.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type AvatarMenuState = "closed" | "open" | "loading" | "permission-blocked" | "disabled" | "signing-out";
export type AvatarMenuDensity = AvatarDensity;
export type AvatarMenuItem = MenuItem | MenuSeparator | "divider";

export interface AvatarMenuProps extends FlowDataAttributes {
  name: string;
  src?: string;
  status?: AvatarStatus;
  label?: string;
  triggerLabel?: string;
  density?: AvatarMenuDensity;
  state?: AvatarMenuState;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  permissionBlocked?: boolean;
  signingOut?: boolean;
  items?: AvatarMenuItem[];
  align?: MenuAlign;
  onOpenChange?: (open: boolean, event?: MenuOpenChangeEvent) => void;
  onSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface AvatarMenuComponent extends ForwardRefExoticComponent<AvatarMenuProps & RefAttributes<HTMLDivElement>> {
  displayName: "AvatarMenu";
}

type AvatarMenuRestProps = Record<string, unknown>;

function sanitizeRestProps(rest: AvatarMenuRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function isMenuSeparator(item: AvatarMenuItem): item is MenuSeparator | "divider" {
  return item === "divider" || (typeof item === "object" && item !== null && "separator" in item && item.separator === true);
}

function hasMenuLabel(item: AvatarMenuItem): item is MenuItem {
  return typeof item === "object" && item !== null && "label" in item && typeof item.label === "string";
}

function normalizeItems(items: AvatarMenuItem[] | undefined, signingOut: boolean): AvatarMenuItem[] {
  return (Array.isArray(items) ? items : [])
    .filter((item) => isMenuSeparator(item) || hasMenuLabel(item))
    .map((item) => {
      if (isMenuSeparator(item)) return item;
      const key = String(item.key ?? item.label);
      const tone = item.tone ?? (signingOut && key === "sign-out" ? "danger" : undefined);
      return {
        ...item,
        key,
        ...(tone ? { tone } : {}),
        disabled: Boolean(item.disabled || signingOut),
      };
    });
}

interface AvatarMenuStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  signingOut?: boolean | undefined;
  permissionBlocked?: boolean | undefined;
  open?: boolean | undefined;
  state?: AvatarMenuState | undefined;
}

function resolveState({
  disabled,
  loading,
  signingOut,
  permissionBlocked,
  open,
  state,
}: AvatarMenuStateInput): AvatarMenuState {
  if (disabled) return "disabled";
  if (signingOut) return "signing-out";
  if (loading) return "loading";
  if (permissionBlocked) return "permission-blocked";
  if (state) return state;
  return open ? "open" : "closed";
}

export const AvatarMenu = forwardRef<HTMLDivElement, AvatarMenuProps>(function AvatarMenu({
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
  const actionCount = normalizedItems.filter((item) => !isMenuSeparator(item)).length;

  if (!name || actionCount === 0) return null;

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
      "data-action-count": String(actionCount),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Avatar, {
      name,
      src,
      status,
      density,
      state: isDisabled ? "disabled" : undefined,
      "aria-hidden": "true",
    } as ComponentProps<typeof Avatar>),
    React.createElement(Menu, {
      triggerLabel: triggerLabel ?? resolvedLabel,
      label: resolvedLabel,
      items: normalizedItems,
      ...(open === undefined ? {} : { open }),
      variant: "avatar-trigger",
      avatarName: name,
      avatarStatus: status,
      ...(density ? { density } : {}),
      state: isDisabled ? "disabled" : resolvedState === "open" ? "open" : "closed",
      align,
      disabled: isDisabled,
      ...(onOpenChange ? { onOpenChange } : {}),
      ...(onSelect ? { onSelect } : {}),
    }),
  );
}) as AvatarMenuComponent;

AvatarMenu.displayName = "AvatarMenu";
