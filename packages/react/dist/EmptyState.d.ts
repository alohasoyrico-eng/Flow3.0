import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { emptyStatePlatformContract } from "#flow/platforms";

export type EmptyStateVariant = "first-use" | "search-empty" | "permission" | "error" | "maintenance";
export type EmptyStateState = "default" | "action" | "search-empty" | "permission" | "loading" | "error";
export type EmptyStateDensity = "sm" | "md" | "lg";

export interface EmptyStateAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: EmptyStateDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  title: string;
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
