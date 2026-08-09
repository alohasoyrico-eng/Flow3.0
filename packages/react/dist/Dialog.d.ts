import type { HTMLAttributes, ForwardRefExoticComponent, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { dialogPlatformContract } from "#flow/platforms";

export type DialogVariant = "confirmation" | "destructive" | "form" | "review" | "success";
export type DialogTone = "neutral" | "info" | "success" | "danger";
export type DialogState = "open" | "focus" | "closing" | "default" | "closed";
export type DialogDensity = "sm" | "md" | "lg";
export type DialogOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface DialogAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: DialogDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DialogField {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  density?: DialogDensity;
  state?: "default" | "hover" | "focus" | "filled" | "success" | "warning" | "error" | "disabled" | "loading";
  variant?: "default" | "password" | "search" | "with-prefix" | "with-suffix" | "readonly";
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  actions?: DialogAction[];
  open?: boolean;
  tone?: DialogTone;
  variant?: DialogVariant;
  state?: DialogState;
  density?: DialogDensity;
  icon?: string;
  fields?: DialogField[];
  id?: string;
  onOpenChange?: (open: boolean, event?: DialogOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DialogComponent extends ForwardRefExoticComponent<DialogProps & RefAttributes<HTMLDivElement>> {
  displayName: "Dialog";
  platformContract: typeof dialogPlatformContract;
}

export const Dialog: DialogComponent;
