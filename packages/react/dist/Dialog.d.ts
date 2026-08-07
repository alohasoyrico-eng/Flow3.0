import type { ButtonProps } from "./Button.js";
import type { InputProps } from "./Input.js";
import type { HTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { dialogPlatformContract } from "#flow/platforms";

export type DialogVariant = "confirmation" | "destructive" | "form" | "review" | "success";
export type DialogTone = "neutral" | "info" | "success" | "danger";
export type DialogState = "open" | "focus" | "closing" | "default" | "closed";
export type DialogDensity = "sm" | "md" | "lg";

export interface DialogAction extends ButtonProps {
  key?: string;
}

export interface DialogField extends InputProps {}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  label: string;
  description?: string;
  triggerLabel?: string;
  actions?: DialogAction[];
  open?: boolean;
  tone?: DialogTone;
  variant?: DialogVariant;
  state?: DialogState;
  density?: DialogDensity;
  icon?: string;
  fields?: DialogField[];
  id?: string;
  onOpenChange?: (open: boolean) => void;
  onAction?: (key: string) => void;
}

export interface DialogComponent extends ForwardRefExoticComponent<DialogProps & RefAttributes<HTMLDivElement>> {
  displayName: "Dialog";
  platformContract: typeof dialogPlatformContract;
}

export const Dialog: DialogComponent;
