import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AvatarDensity, AvatarStatus } from "../Avatar.js";
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

export const AvatarMenu: AvatarMenuComponent;
