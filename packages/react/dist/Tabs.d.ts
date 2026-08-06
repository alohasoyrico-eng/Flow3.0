import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { tabsPlatformContract } from "#flow/platforms";
import type { BadgeProps } from "./Badge.js";

export type TabsVariant = "default" | "underline";

export interface TabsItem extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  key?: string;
  value?: string;
  label: string;
  icon?: string;
  count?: number;
  badge?: BadgeProps;
  selected?: boolean;
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  items: TabsItem[];
  selectedKey?: string;
  variant?: TabsVariant;
  onValueChange?: (key: string) => void;
}

export interface TabsComponent extends ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLDivElement>> {
  displayName: "Tabs";
  platformContract: typeof tabsPlatformContract;
}

export const Tabs: TabsComponent;
