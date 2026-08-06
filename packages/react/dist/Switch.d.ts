import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { switchPlatformContract } from "#flow/platforms";

export type SwitchState = "off" | "on" | "focus" | "pressed" | "error" | "disabled";
export type SwitchDensity = "sm" | "md" | "lg";

export interface SwitchValueMeta {
  name: string;
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "checked" | "value" | "onChange"> {
  label: string;
  description?: string;
  error?: string;
  state?: SwitchState;
  density?: SwitchDensity;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean, meta: SwitchValueMeta) => void;
  className?: string;
}

export interface SwitchComponent extends ForwardRefExoticComponent<SwitchProps & RefAttributes<HTMLInputElement>> {
  displayName: "Switch";
  platformContract: typeof switchPlatformContract;
}

export const Switch: SwitchComponent;
