import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { PopoverOpenChangeEvent, PopoverProps } from "../Popover.js";
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

export const AvatarGroup: AvatarGroupComponent;
