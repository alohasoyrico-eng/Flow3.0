import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { tabsPlatformContract } from "#flow/platforms";
import type { BadgeState, BadgeTone, BadgeVariant } from "./Badge.js";

export type TabsVariant = "default" | "underline";
export type TabsDensity = "sm" | "md" | "lg";
export interface TabsBadge {
  label: string;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  state?: BadgeState;
  hidden?: boolean;
  live?: boolean;
  icon?: string;
  ariaLabel?: string;
}

export interface TabsItem extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  key?: string;
  value?: string;
  label: string;
  icon?: string;
  badge?: TabsBadge;
  selected?: boolean;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label?: string;
  items: TabsItem[];
  selectedKey?: string;
  variant?: TabsVariant;
  density?: TabsDensity;
  onValueChange?: (key: string) => void;
}

export interface TabsComponent extends ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLDivElement>> {
  displayName: "Tabs";
  platformContract: typeof tabsPlatformContract;
}

export const Tabs: TabsComponent;
