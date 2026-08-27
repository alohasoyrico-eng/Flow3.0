import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { avatarPlatformContract } from "@design-system/components/platforms";

export type AvatarDensity = "sm" | "md" | "lg";
export type AvatarStatus = "none" | "online" | "busy" | "offline";
export type AvatarState = "default" | "online" | "busy" | "offline" | "disabled" | "unknown";
export type AvatarIdentityTone = "auto" | "action" | "success" | "danger" | "warning" | "purple" | "teal";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  name: string;
  src?: string;
  density?: AvatarDensity;
  identityTone?: AvatarIdentityTone;
  status?: AvatarStatus;
  state?: AvatarState;
}

export interface AvatarComponent extends ForwardRefExoticComponent<AvatarProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Avatar";
  platformContract: typeof avatarPlatformContract;
}

export const Avatar: AvatarComponent;
