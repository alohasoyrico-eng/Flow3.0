import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { tagPlatformContract } from "@design-system/components/platforms";

export type TagVariant = "metadata" | "status" | "platform" | "link";
export type TagTone = "neutral" | "info" | "success" | "warning" | "danger";
export type TagState = "default" | "hover" | "pressed" | "focus" | "disabled";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled"> {
  label: string;
  variant?: TagVariant;
  tone?: TagTone;
  state?: TagState;
  icon?: string;
  interactive?: boolean;
  disabled?: boolean;
}

export interface TagComponent extends ForwardRefExoticComponent<TagProps & RefAttributes<HTMLSpanElement | HTMLButtonElement>> {
  displayName: "Tag";
  platformContract: typeof tagPlatformContract;
}

export const Tag: TagComponent;
