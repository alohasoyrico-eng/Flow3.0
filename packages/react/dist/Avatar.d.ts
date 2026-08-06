import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { avatarPlatformContract } from "#flow/platforms";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "none" | "online" | "busy" | "offline";
export type AvatarState = "default" | "online" | "busy" | "offline" | "disabled" | "unknown";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  size?: AvatarSize;
  density?: AvatarSize;
  status?: AvatarStatus;
  state?: AvatarState;
  ariaLabel?: string;
}

export interface AvatarComponent extends ForwardRefExoticComponent<AvatarProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Avatar";
  platformContract: typeof avatarPlatformContract;
}

export const Avatar: AvatarComponent;
