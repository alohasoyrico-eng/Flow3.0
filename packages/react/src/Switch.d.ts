import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { switchPlatformContract } from "@design-system/components/platforms";

export type SwitchState = "off" | "on" | "focus" | "pressed" | "error" | "disabled";
export type SwitchDensity = "sm" | "md" | "lg";

export interface SwitchValueMeta {
  name: string;
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "type" | "checked" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  error?: string;
  state?: SwitchState;
  density?: SwitchDensity;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean, meta: SwitchValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface SwitchComponent extends ForwardRefExoticComponent<SwitchProps & RefAttributes<HTMLInputElement>> {
  displayName: "Switch";
  platformContract: typeof switchPlatformContract;
}

export const Switch: SwitchComponent;
