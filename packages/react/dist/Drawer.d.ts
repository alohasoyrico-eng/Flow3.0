import type { drawerPlatformContract } from "#flow/platforms";
import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";

export type DrawerVariant = "side-sheet" | "filter" | "detail" | "edit" | "review";
export type DrawerState = "closed" | "default" | "open" | "focus" | "closing";
export type DrawerTone = "neutral" | "info" | "danger";
export type DrawerDensity = "sm" | "md" | "lg";
export type DrawerSide = "left" | "right";
export type DrawerOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface DrawerAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: DrawerDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DrawerField {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  density?: DrawerDensity;
  state?: "default" | "hover" | "focus" | "filled" | "success" | "warning" | "error" | "disabled" | "loading";
  variant?: "default" | "password" | "search" | "with-prefix" | "with-suffix" | "readonly";
}

export type DrawerContent =
  | { type: "badge"; key: string; label?: string; tone?: "neutral" | "info" | "success" | "warning" | "danger" | "accent"; variant?: "count" | "dot" | "status" | "icon"; live?: boolean }
  | { type: "progress"; key: string; label?: string; value?: number; max?: number; showValue?: boolean; tone?: "accent" | "success" | "warning" | "danger" | "ink" }
  | { type: "text"; key: string; label?: string; copy?: string };

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  variant?: DrawerVariant;
  state?: DrawerState;
  tone?: DrawerTone;
  density?: DrawerDensity;
  side?: DrawerSide;
  fields?: DrawerField[];
  content?: DrawerContent[];
  actions?: DrawerAction[];
  open?: boolean;
  showCloseButton?: boolean;
  id?: string;
  onOpenChange?: (open: boolean, event?: DrawerOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DrawerComponent extends ForwardRefExoticComponent<DrawerProps & RefAttributes<HTMLDivElement>> {
  displayName: "Drawer";
  platformContract: typeof drawerPlatformContract;
}

export const Drawer: DrawerComponent;
