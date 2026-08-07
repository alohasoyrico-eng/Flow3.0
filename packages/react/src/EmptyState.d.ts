import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { emptyStatePlatformContract } from "@design-system/components/platforms";
import type { ButtonProps } from "./Button.js";

export type EmptyStateVariant = "first-use" | "search-empty" | "permission" | "error" | "maintenance";
export type EmptyStateState = "default" | "action" | "search-empty" | "permission" | "loading" | "error";
export type EmptyStateDensity = "sm" | "md" | "lg";

export interface EmptyStateAction extends ButtonProps {
  key?: string;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  title?: string;
  label?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  variant?: EmptyStateVariant;
  state?: EmptyStateState;
  density?: EmptyStateDensity;
  fullWidth?: boolean;
  onAction?: (key: string) => void;
}

export interface EmptyStateComponent extends ForwardRefExoticComponent<EmptyStateProps & RefAttributes<HTMLElement>> {
  displayName: "EmptyState";
  platformContract: typeof emptyStatePlatformContract;
}

export const EmptyState: EmptyStateComponent;
