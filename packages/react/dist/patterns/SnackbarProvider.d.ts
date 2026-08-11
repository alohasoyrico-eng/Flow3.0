import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { ToastProps } from "../Toast.js";

export type SnackbarProviderState =
  | "idle"
  | "queued"
  | "visible"
  | "dismissed"
  | "actionable"
  | "paused"
  | "error";

export type SnackbarProviderDensity = "sm" | "md" | "lg";

export interface SnackbarMessage extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "icon" | "actionLabel" | "dismissible" | "dismissLabel" | "dismissed"> {
  key?: string;
  id?: string;
  priority?: "low" | "normal" | "high";
}

export interface SnackbarQueueAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface SnackbarProviderProps {
  label?: string;
  messages?: SnackbarMessage[];
  density?: SnackbarProviderDensity;
  state?: SnackbarProviderState;
  maxVisible?: number;
  paused?: boolean;
  action?: SnackbarQueueAction;
  className?: string;
  onMessageAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onMessageDismiss?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onQueueAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface SnackbarProviderComponent extends ForwardRefExoticComponent<SnackbarProviderProps & RefAttributes<HTMLDivElement>> {
  displayName: "SnackbarProvider";
}

export const SnackbarProvider: SnackbarProviderComponent;
