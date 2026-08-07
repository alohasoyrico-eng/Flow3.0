import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { segmentedControlPlatformContract } from "#flow/platforms";

export type SegmentedControlDensity = "sm" | "md" | "lg";
export type SegmentedControlVariant = "outlined" | "toolbar" | "compact" | "icon-only";

export type SegmentedControlItem = {
  key?: string;
  value?: string;
  label: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
};

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onChange"> {
  label: string;
  items: SegmentedControlItem[];
  selectedKey?: string;
  onValueChange?: (key: string) => void;
  variant?: SegmentedControlVariant;
  density?: SegmentedControlDensity;
}

export interface SegmentedControlComponent extends ForwardRefExoticComponent<SegmentedControlProps & RefAttributes<HTMLDivElement>> {
  displayName: "SegmentedControl";
  platformContract: typeof segmentedControlPlatformContract;
}

export const SegmentedControl: SegmentedControlComponent;
