import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { toastPlatformContract } from "#flow/platforms";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastVariant = "status" | "progress" | "warning" | "recovery" | "undo";
export type ToastState = "default" | "visible" | "action" | "stacked" | "exiting";
export type ToastDensity = "sm" | "md" | "lg";

export interface ToastProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  tone?: ToastTone;
  variant?: ToastVariant;
  state?: ToastState;
  density?: ToastDensity;
  icon?: string;
  actionLabel?: string;
  dismissible?: boolean;
  dismissLabel?: string;
  dismissed?: boolean;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDismiss?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDismissChange?: (dismissed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ToastComponent extends ForwardRefExoticComponent<ToastProps & RefAttributes<HTMLElement>> {
  displayName: "Toast";
  platformContract: typeof toastPlatformContract;
}

export const Toast: ToastComponent;
