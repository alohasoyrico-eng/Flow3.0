import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import type { buttonPlatformContract } from "@design-system/components/platforms";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type ButtonIntent = "default" | "danger" | "warning";
export type ButtonDensity = "sm" | "md" | "lg";
export type ButtonState = "default" | "hover" | "focus" | "pressed" | "disabled" | "loading";
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type"> {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  density?: ButtonDensity;
  state?: ButtonState;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  fullWidth?: boolean;
  type?: ButtonType;
}

export interface ButtonComponent {
  (props: ButtonProps & { ref?: Ref<HTMLButtonElement> }): ReactNode;
  displayName?: string;
  platformContract: typeof buttonPlatformContract;
}

export const Button: ButtonComponent;
