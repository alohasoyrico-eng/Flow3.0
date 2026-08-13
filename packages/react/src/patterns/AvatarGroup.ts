import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useMemo,
} from "react";
import { Avatar } from "../Avatar.js";
import type { AvatarProps, AvatarState, AvatarStatus } from "../Avatar.js";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { List } from "../List.js";
import type { ListItem, ListProps } from "../List.js";
import { Popover } from "../Popover.js";
import type { PopoverOpenChangeEvent, PopoverProps } from "../Popover.js";
import { Tooltip } from "../Tooltip.js";
import type { TooltipProps } from "../Tooltip.js";

export type AvatarGroupState =
  | "default"
  | "overflow"
  | "interactive"
  | "loading"
  | "permission-blocked"
  | "invalid"
  | "disabled";

export type AvatarGroupDensity = "sm" | "md" | "lg";

export interface AvatarGroupIdentity {
  key?: string;
  id?: string;
  name: string;
  src?: string;
  status?: "none" | "online" | "busy" | "offline";
  meta?: string;
  role?: string;
  email?: string;
  disabled?: boolean;
  permissionBlocked?: boolean;
}

export interface AvatarGroupOverflow extends Pick<PopoverProps, "open" | "state" | "density" | "onOpenChange"> {
  count?: number;
  triggerLabel?: string;
  title?: string;
  description?: string;
  listLabel?: string;
}

export interface AvatarGroupTooltip extends Pick<TooltipProps, "triggerLabel" | "content" | "placement" | "state" | "density" | "disabled"> {}

export interface AvatarGroupValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface AvatarGroupAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface AvatarGroupProps {
  label?: string;
  identities?: AvatarGroupIdentity[];
  maxVisible?: number;
  density?: AvatarGroupDensity;
  state?: AvatarGroupState;
  disabled?: boolean;
  overflow?: AvatarGroupOverflow;
  action?: AvatarGroupAction;
  validation?: AvatarGroupValidation;
  tooltip?: AvatarGroupTooltip;
  className?: string;
  onIdentitySelect?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onOverflowOpenChange?: (open: boolean, event?: PopoverOpenChangeEvent) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface AvatarGroupComponent extends ForwardRefExoticComponent<AvatarGroupProps & RefAttributes<HTMLDivElement>> {
  displayName: "AvatarGroup";
}

type NormalizedIdentity = {
  key: string;
  name: string;
  src?: string;
  status: AvatarStatus;
  meta: string;
  disabled: boolean;
};

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function normalizeIdentity(identity: AvatarGroupIdentity | null | undefined): NormalizedIdentity | null {
  if (!identity?.name) return null;
  const key = identity.key ?? identity.id ?? identity.name;
  return {
    key: String(key),
    name: identity.name,
    ...(identity.src !== undefined ? { src: identity.src } : {}),
    status: identity.status ?? "none",
    meta: identity.meta ?? identity.role ?? identity.email ?? "",
    disabled: Boolean(identity.disabled || identity.permissionBlocked),
  };
}

function isNormalizedIdentity(identity: NormalizedIdentity | null): identity is NormalizedIdentity {
  return Boolean(identity);
}

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function avatarStateFor(identity: NormalizedIdentity, disabled: boolean): AvatarState {
  if (disabled || identity.disabled) return "disabled";
  if (identity.status === "none") return "default";
  return identity.status;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup({
  label = "People",
  identities,
  maxVisible = 3,
  density,
  state = "default",
  disabled = false,
  overflow,
  action,
  validation,
  tooltip,
  onIdentitySelect,
  onAction,
  onOverflowOpenChange,
  className = "",
  ...rest
}, ref) {
  const normalizedIdentities = useMemo(() => (Array.isArray(identities) ? identities : [])
    .map(normalizeIdentity)
    .filter(isNormalizedIdentity), [identities]);
  const visibleCount = Math.max(0, Number(maxVisible) || 0);
  const visibleIdentities = normalizedIdentities.slice(0, visibleCount);
  const overflowIdentities = normalizedIdentities.slice(visibleCount);
  const overflowCount = overflow?.count ?? overflowIdentities.length;
  const resolvedState = disabled ? "disabled" : overflowCount > 0 ? "overflow" : state;

  if (!normalizedIdentities.length && !validation?.message) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "data-flow-pattern": "avatar-group",
      "data-state": resolvedState,
      "data-density": density,
      "data-avatar-count": String(normalizedIdentities.length),
      ...sanitizeRestProps(rest),
    },
    visibleIdentities.map((identity) => React.createElement(Avatar, {
      key: identity.key,
      name: identity.name,
      src: identity.src,
      status: identity.status,
      state: avatarStateFor(identity, disabled),
      density,
      "data-identity-key": identity.key,
    } as AvatarProps)),
    overflowCount > 0
      ? React.createElement(Badge, {
        label: `+${overflowCount}`,
        ariaLabel: `${overflowCount} additional people`,
        tone: disabled ? "neutral" : "info",
        variant: "count",
        state: "overflow",
        density,
      } as BadgeProps)
      : null,
    tooltip?.content
      ? React.createElement(Tooltip, {
        triggerLabel: tooltip.triggerLabel ?? `${label} details`,
        content: tooltip.content,
        placement: tooltip.placement ?? "top",
        state: tooltip.state,
        density: tooltip.density ?? density,
        disabled: disabled || tooltip.disabled,
      } as TooltipProps)
      : null,
    overflowCount > 0
      ? React.createElement(Popover, {
        triggerLabel: overflow?.triggerLabel ?? `View ${overflowCount} more`,
        title: overflow?.title ?? label,
        description: overflow?.description ?? `${normalizedIdentities.length} people in this group.`,
        open: overflow?.open,
        state: disabled ? "disabled" : overflow?.state ?? "default",
        density: overflow?.density ?? density,
        disabled,
        onOpenChange: onOverflowOpenChange ?? overflow?.onOpenChange,
      } as PopoverProps)
      : null,
    overflowIdentities.length
      ? React.createElement(List, {
        label: overflow?.listLabel ?? `${label} overflow`,
        items: overflowIdentities.map((identity): ListItem => ({
          key: identity.key,
          label: identity.name,
          meta: identity.meta,
          state: identity.disabled ? "disabled" : "default",
          disabled: identity.disabled || disabled,
        })),
        variant: "media",
        density,
        interactive: Boolean(onIdentitySelect),
        onSelect: onIdentitySelect,
      } as ListProps)
      : null,
    action?.label
      ? (() => {
        const actionLabel = action.label;
        return React.createElement(Button, {
          ...action,
          label: actionLabel,
          density: action.density ?? density,
          variant: action.variant ?? "ghost",
          disabled: disabled || action.disabled,
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            action.onClick?.(event);
            if (event.defaultPrevented) return;
            onAction?.(action.key ?? actionLabel, event);
          },
        } as ButtonProps);
      })()
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "default"),
        density,
        live: validation.live,
      } as InlineValidationProps)
      : null,
  );
}) as AvatarGroupComponent;

AvatarGroup.displayName = "AvatarGroup";
