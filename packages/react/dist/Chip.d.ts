import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { chipPlatformContract } from "#flow/platforms";

export type ChipVariant = "filter" | "input" | "suggestion" | "assist";
export type ChipTone = "default" | "danger" | "warning";
export type ChipState = "default" | "hover" | "pressed" | "selected" | "focus" | "disabled";
export type ChipDensity = "sm" | "md" | "lg";

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  variant?: ChipVariant;
  tone?: ChipTone;
  state?: ChipState;
  density?: ChipDensity;
  selected?: boolean;
  disabled?: boolean;
  removable?: boolean;
  icon?: string;
  interactive?: boolean;
  onRemoveLabel?: string;
  onRemove?: (label: string, event: MouseEvent<HTMLButtonElement>) => void;
  onSelectedChange?: (selected: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChipComponent extends ForwardRefExoticComponent<ChipProps & RefAttributes<HTMLSpanElement | HTMLButtonElement>> {
  displayName: "Chip";
  platformContract: typeof chipPlatformContract;
}

export const Chip: ChipComponent;
