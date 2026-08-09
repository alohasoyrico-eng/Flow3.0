import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { tabsPlatformContract } from "@design-system/components/platforms";
import type { BadgeState, BadgeTone, BadgeVariant } from "./Badge.js";

export type TabsVariant = "default" | "underline";
export type TabsDensity = "sm" | "md" | "lg";
export type TabsValueChangeEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;
export interface TabsBadge {
  label: string;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  state?: BadgeState;
  hidden?: boolean;
  live?: boolean;
  icon?: string;
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

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label?: string;
  items: TabsItem[];
  selectedKey?: string;
  variant?: TabsVariant;
  density?: TabsDensity;
  onValueChange?: (key: string, event: TabsValueChangeEvent) => void;
}

export interface TabsComponent extends ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLDivElement>> {
  displayName: "Tabs";
  platformContract: typeof tabsPlatformContract;
}

export const Tabs: TabsComponent;
