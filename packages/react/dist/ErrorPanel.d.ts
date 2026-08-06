import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { errorPanelPlatformContract } from "#flow/platforms";
import type { ButtonProps } from "./Button.js";

export type ErrorPanelVariant = "inline" | "panel" | "blocking" | "empty-recovery";
export type ErrorPanelState = "default" | "warning" | "error" | "critical" | "loading" | "disabled";
export type ErrorPanelTone = "warning" | "error" | "critical";
export type ErrorPanelDensity = "sm" | "md" | "lg";
export type ErrorPanelRole = "status" | "alert";

export interface ErrorPanelAction extends ButtonProps {
  key?: string;
}

export interface ErrorPanelProps extends HTMLAttributes<HTMLElement> {
  label?: string;
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
