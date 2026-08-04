import type { switchPlatformContract } from "@design-system/components/platforms";

export type SwitchState = "off" | "on" | "focus" | "pressed" | "error" | "disabled";
export type SwitchDensity = "sm" | "md" | "lg";

export interface SwitchValueMeta {
  name: string;
}

export interface SwitchProps {
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

export interface SwitchComponent {
  (props: SwitchProps): unknown;
  displayName?: string;
  platformContract: typeof switchPlatformContract;
}

export const Switch: SwitchComponent;
