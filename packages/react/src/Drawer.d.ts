import type { ButtonProps } from "./Button.js";
import type { InputProps } from "./Input.js";
import type { drawerPlatformContract } from "@design-system/components/platforms";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";

export type DrawerVariant = "side-sheet" | "filter" | "detail" | "edit" | "review";
export type DrawerState = "closed" | "default" | "open" | "focus" | "closing";
export type DrawerTone = "neutral" | "info" | "danger";
export type DrawerDensity = "sm" | "md" | "lg";
export type DrawerSide = "left" | "right";

export interface DrawerAction extends ButtonProps {
  key?: string;
}

export interface DrawerField extends InputProps {}

export type DrawerContent =
  | { type: "badge"; key?: string; label?: string; tone?: "neutral" | "info" | "success" | "warning" | "danger" | "accent"; variant?: "count" | "dot" | "status" | "icon"; live?: boolean }
  | { type: "progress"; key?: string; label?: string; value?: number; max?: number; showValue?: boolean; tone?: "accent" | "success" | "warning" | "danger" | "ink" }
  | { type: "text"; key?: string; label?: string; copy?: string };

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  description?: string;
  triggerLabel?: string;
  variant?: DrawerVariant;
  state?: DrawerState;
  tone?: DrawerTone;
  density?: DrawerDensity;
  side?: DrawerSide;
  fields?: Array<DrawerField | string>;
  content?: DrawerContent[];
  actions?: DrawerAction[];
  open?: boolean;
  id?: string;
  onOpenChange?: (open: boolean) => void;
  onAction?: (key: string) => void;
}

export interface DrawerComponent extends ForwardRefExoticComponent<DrawerProps & RefAttributes<HTMLDivElement>> {
  displayName: "Drawer";
  platformContract: typeof drawerPlatformContract;
}

export const Drawer: DrawerComponent;
