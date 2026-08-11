import React, { forwardRef, useMemo } from "react";
import { chatThreadPlatformContract } from "@design-system/components/platforms";
import { EmptyState } from "./EmptyState.js";
import { ChatMessage } from "./ChatMessage.js";
import { Surface } from "./Surface.js";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";

const validStates = new Set(["default", "loading", "empty", "error", "handoff", "offline"]);

function normalizeMessage(message, index) {
  if (!message?.body && !message?.children && message?.state !== "loading") return null;
  return {
    ...message,
    key: String(message.key ?? message.id ?? `message-${index}`),
  };
}

export const ChatThread = forwardRef(function ChatThread({
  label = "Conversation",
  description,
  messages = [],
  empty,
  error,
  state = "default",
  density,
  selectedMessageKey,
  className = "",
  onMessageAction,
  ...rest
}, ref) {
  const normalizedMessages = useMemo(() => (Array.isArray(messages) ? messages : [])
    .map(normalizeMessage)
    .filter(Boolean), [messages]);
  const resolvedState = normalizeFlowValue(state, validStates, normalizedMessages.length ? "default" : "empty");
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
        normalizedMessages.map((message) => React.createElement(
          "li",
          {
            key: message.key,
            className: "chat-thread__item",
            "data-selected": message.key === selectedMessageKey ? "true" : undefined,
          },
          React.createElement(ChatMessage, {
            ...message,
            density: message.density ?? resolvedDensity,
            action: message.action?.label
              ? {
                ...message.action,
                onClick: (event) => {
                  message.action.onClick?.(event);
                  if (event.defaultPrevented) return;
                  onMessageAction?.(message.key, event);
                },
              }
              : undefined,
          }),
        )),
      )
      : React.createElement(EmptyState, {
        title: error?.title ?? empty?.title ?? (resolvedState === "loading" ? "Loading conversation" : "No messages yet"),
        description: error?.description ?? empty?.description ?? (resolvedState === "offline" ? "Reconnect to continue the conversation." : "Messages will appear here."),
        icon: error?.icon ?? empty?.icon ?? (resolvedState === "offline" ? "wifi_off" : "chat"),
        variant: error ? "error" : resolvedState === "offline" ? "maintenance" : "first-use",
        state: error ? "error" : resolvedState === "loading" ? "loading" : "default",
        density: resolvedDensity,
        action: error?.action ?? empty?.action,
        onAction: error?.onAction ?? empty?.onAction,
      }),
  );
});

ChatThread.displayName = "ChatThread";
ChatThread.platformContract = chatThreadPlatformContract;
