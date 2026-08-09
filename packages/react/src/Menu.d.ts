import type { AvatarStatus } from "./Avatar.js";
import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { menuPlatformContract } from "@design-system/components/platforms";

export type MenuVariant = "actions" | "grouped" | "selection" | "danger" | "icon-trigger" | "avatar-trigger";
export type MenuDensity = "sm" | "md" | "lg";
export type MenuState = "default" | "closed" | "open" | "focus" | "disabled";
export type MenuAlign = "start" | "end";
export type MenuItemTone = "danger";
export type MenuOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface MenuItem extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "type" | "children" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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

export interface MenuProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  triggerLabel: string;
  items: Array<MenuItem | MenuSeparator | "divider">;
  open?: boolean;
  label?: string;
  variant?: MenuVariant;
  avatarName?: string;
  avatarStatus?: AvatarStatus;
  density?: MenuDensity;
  state?: MenuState;
  align?: MenuAlign;
  disabled?: boolean;
  onOpenChange?: (open: boolean, event?: MenuOpenChangeEvent) => void;
  onSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface MenuComponent extends ForwardRefExoticComponent<MenuProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Menu";
  platformContract: typeof menuPlatformContract;
}

export const Menu: MenuComponent;
