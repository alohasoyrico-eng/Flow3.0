import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { floatingActionButtonPlatformContract } from "#flow/platforms";

export type FloatingActionButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type FloatingActionButtonIntent = "default" | "danger" | "warning";
export type FloatingActionButtonState = "default" | "hover" | "focus" | "pressed" | "loading" | "disabled";
export type FloatingActionButtonDensity = "sm" | "md" | "lg";
export type FloatingActionButtonType = "button" | "submit" | "reset";

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  icon?: string;
  variant?: FloatingActionButtonVariant;
  intent?: FloatingActionButtonIntent;
  state?: FloatingActionButtonState;
  density?: FloatingActionButtonDensity;
  extended?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: FloatingActionButtonType;
}

export interface FloatingActionButtonComponent extends ForwardRefExoticComponent<FloatingActionButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "FloatingActionButton";
  platformContract: typeof floatingActionButtonPlatformContract;
}

export const FloatingActionButton: FloatingActionButtonComponent;
