import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { chipPlatformContract } from "@design-system/components/platforms";

export type ChipVariant = "filter" | "input" | "suggestion" | "assist";
export type ChipTone = "default" | "danger" | "warning";
export type ChipState = "default" | "hover" | "pressed" | "selected" | "focus" | "disabled";

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onSelect"> {
  label: string;
  variant?: ChipVariant;
  tone?: ChipTone;
  state?: ChipState;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  icon?: string;
  interactive?: boolean;
  onRemoveLabel?: string;
  onRemove?: (label: string) => void;
  onSelectedChange?: (selected: boolean) => void;
}

export interface ChipComponent extends ForwardRefExoticComponent<ChipProps & RefAttributes<HTMLSpanElement | HTMLButtonElement>> {
  displayName: "Chip";
  platformContract: typeof chipPlatformContract;
}

export const Chip: ChipComponent;
