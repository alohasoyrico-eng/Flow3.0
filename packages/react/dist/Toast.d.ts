import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { toastPlatformContract } from "@design-system/components/platforms";

export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastVariant = "status" | "progress" | "warning" | "recovery" | "undo";
export type ToastState = "default" | "visible" | "action" | "stacked" | "exiting";
export type ToastDensity = "sm" | "md" | "lg";

export interface ToastProps extends HTMLAttributes<HTMLElement> {
  label?: string;
  description?: string;
  tone?: ToastTone;
  variant?: ToastVariant;
  state?: ToastState;
  density?: ToastDensity;
  icon?: string;
  actionLabel?: string;
  dismissible?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

export interface ToastComponent extends ForwardRefExoticComponent<ToastProps & RefAttributes<HTMLElement>> {
  displayName: "Toast";
  platformContract: typeof toastPlatformContract;
}

export const Toast: ToastComponent;
