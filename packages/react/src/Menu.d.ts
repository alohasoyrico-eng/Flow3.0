import type { AvatarSize, AvatarStatus } from "./Avatar.js";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { menuPlatformContract } from "@design-system/components/platforms";

export type MenuVariant = "actions" | "grouped" | "selection" | "danger" | "icon-trigger" | "avatar-trigger";
export type MenuDensity = "sm" | "md" | "lg";
export type MenuState = "default" | "closed" | "open" | "focus" | "disabled";
export type MenuAlign = "start" | "end" | "right";
export type MenuItemTone = "danger";

export interface MenuItem {
  label: string;
  icon?: string;
  key: string;
  disabled?: boolean;
  tone?: MenuItemTone;
  shortcut?: string;
}

export interface MenuSeparator {
  separator: true;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  triggerLabel: string;
  items: Array<MenuItem | MenuSeparator | "divider">;
  open?: boolean;
  label?: string;
  variant?: MenuVariant;
  avatarName?: string;
  avatarStatus?: AvatarStatus;
  avatarSize?: AvatarSize;
  density?: MenuDensity;
  state?: MenuState;
  align?: MenuAlign;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: MenuItem) => void;
}

export interface MenuComponent extends ForwardRefExoticComponent<MenuProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Menu";
  platformContract: typeof menuPlatformContract;
}

export const Menu: MenuComponent;
