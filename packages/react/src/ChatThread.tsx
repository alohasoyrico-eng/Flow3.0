import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useMemo,
} from "react";
import { chatThreadPlatformContract } from "@design-system/components/platforms";
import { EmptyState } from "./EmptyState.js";
import { ChatMessage } from "./ChatMessage.js";
import { Surface } from "./Surface.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";

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

type NormalizedChatThreadMessage = ChatThreadMessage & { key: string };

const validStates = new Set<ChatThreadState>(["default", "loading", "empty", "error", "handoff", "offline"]);

function normalizeMessage(message: ChatThreadMessage, index: number): NormalizedChatThreadMessage | null {
  if (!message?.body && !message?.children && message?.state !== "loading") return null;
  return {
    ...message,
    key: String(message.key ?? message.id ?? `message-${index}`),
  };
}

export const ChatThread = forwardRef<HTMLDivElement, ChatThreadProps>(function ChatThread({
  label = "Conversation",
  description,
  messages = [],
  empty,
  error,
  state,
  density,
  selectedMessageKey,
  className = "",
  onMessageAction,
  ...rest
}, ref) {
  const normalizedMessages = useMemo(() => (Array.isArray(messages) ? messages : [])
    .map(normalizeMessage)
    .filter((message): message is NormalizedChatThreadMessage => Boolean(message)), [messages]);
  const resolvedState = state === undefined
    ? normalizedMessages.length ? "default" : "empty"
    : normalizeFlowValue(state, validStates, normalizedMessages.length ? "default" : "empty");
  const resolvedDensity = normalizeFlowDensity(density);
  const isUnavailable = resolvedState === "empty" || resolvedState === "error" || resolvedState === "loading" || resolvedState === "offline";

  return React.createElement(
    Surface,
    {
      ...flowRestProps(rest),
      ref,
      className: ["chat-thread", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      role: "log",
      "aria-label": label,
      "aria-live": "polite",
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-component": "chat-thread",
      "data-selected-message": selectedMessageKey,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
    },
    description ? React.createElement("p", { className: "chat-thread__description" }, description) : null,
    normalizedMessages.length && !isUnavailable
      ? React.createElement(
        "ol",
        { className: "chat-thread__list" },
        normalizedMessages.map((message) => {
          const messageDensity = message.density ?? resolvedDensity;
          const messageAction = message.action?.label ? message.action : undefined;
          return React.createElement(
            "li",
            {
              key: message.key,
              className: "chat-thread__item",
              "data-selected": message.key === selectedMessageKey ? "true" : undefined,
            },
            React.createElement(ChatMessage, {
              ...(message.author !== undefined ? { author: message.author } : {}),
              ...(message.authorLabel !== undefined ? { authorLabel: message.authorLabel } : {}),
              ...(message.body !== undefined ? { body: message.body } : {}),
              ...(message.children !== undefined ? { children: message.children } : {}),
              ...(message.timestamp !== undefined ? { timestamp: message.timestamp } : {}),
              ...(message.meta !== undefined ? { meta: message.meta } : {}),
              ...(message.state !== undefined ? { state: message.state } : {}),
              ...(message.tone !== undefined ? { tone: message.tone } : {}),
              ...(message.avatar !== undefined ? { avatar: message.avatar } : {}),
              ...(messageDensity ? { density: messageDensity } : {}),
              ...(messageAction
                ? { action: {
                  ...messageAction,
                  onClick: (event: MouseEvent<HTMLButtonElement>) => {
                    messageAction.onClick?.(event);
                    if (event.defaultPrevented) return;
                    onMessageAction?.(message.key, event);
                  },
                } }
                : {}),
            }),
          );
        }),
      )
      : (() => {
        const emptyAction = error?.action ?? empty?.action;
        const emptyOnAction = error?.onAction ?? empty?.onAction;
        return React.createElement(EmptyState, {
          title: error?.title ?? empty?.title ?? (resolvedState === "loading" ? "Loading conversation" : "No messages yet"),
          description: error?.description ?? empty?.description ?? (resolvedState === "offline" ? "Reconnect to continue the conversation." : "Messages will appear here."),
          icon: error?.icon ?? empty?.icon ?? (resolvedState === "offline" ? "wifi_off" : "chat"),
          variant: error ? "error" : resolvedState === "offline" ? "maintenance" : "first-use",
          state: error ? "error" : resolvedState === "loading" ? "loading" : "default",
          ...(resolvedDensity ? { density: resolvedDensity } : {}),
          ...(emptyAction ? { action: emptyAction } : {}),
          ...(emptyOnAction ? { onAction: emptyOnAction } : {}),
        });
      })(),
  );
}) as ChatThreadComponent;

ChatThread.displayName = "ChatThread";
ChatThread.platformContract = chatThreadPlatformContract;
