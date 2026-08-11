import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, ReactNode, RefAttributes } from "react";
import { chatMessagePlatformContract } from "#flow/platforms";
import type { FlowDataAttributes } from "./internal/props.js";

export type ChatMessageAuthor = "user" | "agent" | "system" | "assistant";
export type ChatMessageState = "default" | "sending" | "sent" | "delivered" | "failed" | "loading";
export type ChatMessageTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ChatMessageDensity = "sm" | "md" | "lg";

export interface ChatMessageAction {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  intent?: "default" | "action" | "success" | "warning" | "danger";
  density?: ChatMessageDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChatMessageAvatar {
  name?: string;
  src?: string;
  initials?: string;
  icon?: string;
  density?: ChatMessageDensity;
  className?: string;
}

export interface ChatMessageProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  author?: ChatMessageAuthor;
  authorLabel?: string;
  avatar?: ChatMessageAvatar;
  body?: string;
  timestamp?: ReactNode;
  meta?: ReactNode;
  state?: ChatMessageState;
  tone?: ChatMessageTone;
  density?: ChatMessageDensity;
  action?: ChatMessageAction;
}

export interface ChatMessageComponent extends ForwardRefExoticComponent<ChatMessageProps & RefAttributes<HTMLElement>> {
  displayName: "ChatMessage";
  platformContract: typeof chatMessagePlatformContract;
}

export const ChatMessage: ChatMessageComponent;
