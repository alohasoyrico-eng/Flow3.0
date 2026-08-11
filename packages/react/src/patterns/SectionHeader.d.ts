import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { MenuProps } from "../Menu.js";
import type { SkeletonDensity } from "../Skeleton.js";
import type { TagProps } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { FormSectionProps } from "./FormSection.js";
import type { SettingsProps } from "./Settings.js";
import type { ToolbarProps } from "./Toolbar.js";

export type SectionHeaderState = "default" | "loading" | "actionable" | "disabled" | "permission-blocked" | "dirty";
export type SectionHeaderDensity = SkeletonDensity;
export type SectionHeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type SectionHeaderAction = ButtonProps & { key?: string };
export interface SectionHeaderOverflow extends Pick<MenuProps, "triggerLabel" | "label" | "items" | "open" | "variant" | "align" | "disabled" | "onOpenChange" | "onSelect"> {}

export interface SectionHeaderProps extends FlowDataAttributes {
  title: string;
  description?: string;
  headingLevel?: SectionHeaderHeadingLevel;
  density?: SectionHeaderDensity;
  state?: SectionHeaderState;
  loading?: boolean;
  disabled?: boolean;
  dirty?: boolean;
  permissionBlocked?: boolean;
  badge?: BadgeProps;
  tag?: TagProps;
  actions?: SectionHeaderAction[];
  overflow?: SectionHeaderOverflow;
  toolbar?: ToolbarProps;
  settings?: SettingsProps;
  formSection?: FormSectionProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SectionHeaderComponent extends ForwardRefExoticComponent<SectionHeaderProps & RefAttributes<HTMLDivElement>> {
  displayName: "SectionHeader";
}

export const SectionHeader: SectionHeaderComponent;
