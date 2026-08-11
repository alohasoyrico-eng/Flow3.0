import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { chatThreadPlatformContract } from "#flow/platforms";
import type { FlowDataAttributes } from "./internal/props.js";

export type ChatThreadState = "default" | "loading" | "empty" | "error" | "handoff" | "offline";
export type ChatThreadDensity = "sm" | "md" | "lg";
export type ChatThreadAuthor = "user" | "agent" | "system" | "assistant";
export type ChatThreadMessageState = "default" | "sending" | "sent" | "delivered" | "failed" | "loading";
export type ChatThreadTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ChatThreadAction {
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChatThreadMessage {
  key?: string;
  id?: string;
  author?: ChatThreadAuthor;
  authorLabel?: string;
  body?: string;
  children?: string;
  timestamp?: string;
  meta?: string;
  state?: ChatThreadMessageState;
  tone?: ChatThreadTone;
  density?: ChatThreadDensity;
  action?: ChatThreadAction;
  avatar?: {
    name?: string;
    src?: string;
    initials?: string;
    icon?: string;
    density?: ChatThreadDensity;
    className?: string;
  };
}

export interface ChatThreadEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: ChatThreadAction;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChatThreadProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label?: string;
  description?: string;
  messages?: ChatThreadMessage[];
  empty?: ChatThreadEmptyState;
  error?: ChatThreadEmptyState;
  state?: ChatThreadState;
  density?: ChatThreadDensity;
  selectedMessageKey?: string;
  onMessageAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChatThreadComponent extends ForwardRefExoticComponent<ChatThreadProps & RefAttributes<HTMLDivElement>> {
  displayName: "ChatThread";
  platformContract: typeof chatThreadPlatformContract;
}

export const ChatThread: ChatThreadComponent;
