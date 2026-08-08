import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { segmentedControlPlatformContract } from "#flow/platforms";

export type SegmentedControlDensity = "sm" | "md" | "lg";
export type SegmentedControlVariant = "outlined" | "toolbar" | "compact" | "icon-only";
export type SegmentedControlValueChangeEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;

export interface SegmentedControlItem extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  key?: string;
  value?: string;
  label: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  items: SegmentedControlItem[];
  selectedKey?: string;
  onValueChange?: (key: string, event: SegmentedControlValueChangeEvent) => void;
  variant?: SegmentedControlVariant;
  density?: SegmentedControlDensity;
}

export interface SegmentedControlComponent extends ForwardRefExoticComponent<SegmentedControlProps & RefAttributes<HTMLDivElement>> {
  displayName: "SegmentedControl";
  platformContract: typeof segmentedControlPlatformContract;
}

export const SegmentedControl: SegmentedControlComponent;
