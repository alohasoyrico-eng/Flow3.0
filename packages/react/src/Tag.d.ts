import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { tagPlatformContract } from "@design-system/components/platforms";

export type TagVariant = "metadata" | "status" | "platform" | "link";
export type TagTone = "neutral" | "info" | "success" | "warning" | "danger";
export type TagState = "default" | "hover" | "pressed" | "focus" | "disabled";
export type TagDensity = "sm" | "md" | "lg";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  variant?: TagVariant;
  tone?: TagTone;
  state?: TagState;
  density?: TagDensity;
  icon?: string;
  interactive?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface TagComponent extends ForwardRefExoticComponent<TagProps & RefAttributes<HTMLSpanElement | HTMLButtonElement>> {
  displayName: "Tag";
  platformContract: typeof tagPlatformContract;
}

export const Tag: TagComponent;
