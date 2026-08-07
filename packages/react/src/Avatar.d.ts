import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { avatarPlatformContract } from "@design-system/components/platforms";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "none" | "online" | "busy" | "offline";
export type AvatarState = "default" | "online" | "busy" | "offline" | "disabled" | "unknown";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
