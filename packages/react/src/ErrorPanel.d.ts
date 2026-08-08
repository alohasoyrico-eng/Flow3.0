import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { errorPanelPlatformContract } from "@design-system/components/platforms";

export type ErrorPanelVariant = "inline" | "panel" | "blocking" | "empty-recovery";
export type ErrorPanelState = "default" | "warning" | "error" | "critical" | "loading" | "disabled";
export type ErrorPanelTone = "warning" | "error" | "critical";
export type ErrorPanelDensity = "sm" | "md" | "lg";
export type ErrorPanelRole = "status" | "alert";

export interface ErrorPanelAction {
  key: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: ErrorPanelDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ErrorPanelProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  description?: string;
  action?: ErrorPanelAction;
  tone?: ErrorPanelTone;
  variant?: ErrorPanelVariant;
  state?: ErrorPanelState;
  density?: ErrorPanelDensity;
  fullWidth?: boolean;
  icon?: string;
  role?: ErrorPanelRole;
  onAction?: (key: string) => void;
}

export interface ErrorPanelComponent extends ForwardRefExoticComponent<ErrorPanelProps & RefAttributes<HTMLElement>> {
  displayName: "ErrorPanel";
  platformContract: typeof errorPanelPlatformContract;
}

export const ErrorPanel: ErrorPanelComponent;
