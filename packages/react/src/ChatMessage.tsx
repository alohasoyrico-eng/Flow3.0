import React, {
  type ElementType,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefAttributes,
  forwardRef,
} from "react";
import { chatMessagePlatformContract } from "@design-system/components/platforms";
import { Avatar } from "./Avatar.js";
import { Button } from "./Button.js";
import { Surface } from "./Surface.js";
import type { SurfaceTone } from "./Surface.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowToneProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";

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

const validAuthors = new Set<ChatMessageAuthor>(["user", "agent", "system", "assistant"]);
const validStates = new Set<ChatMessageState>(["default", "sending", "sent", "delivered", "failed", "loading"]);
const validTones = new Set<ChatMessageTone>(["neutral", "info", "success", "warning", "danger"]);
const CompatibleAvatar = Avatar as ElementType;
const CompatibleButton = Button as ElementType;

function messageRoleForTone(tone: ChatMessageTone, state: ChatMessageState): "alert" | "status" | undefined {
  if (tone === "danger" || state === "failed") return "alert";
  if (tone === "warning" || state === "sending" || state === "loading") return "status";
  return undefined;
}

function surfaceToneForMessage(tone: ChatMessageTone): SurfaceTone {
  if (tone === "neutral" || tone === "info") return "default";
  return tone;
}

export const ChatMessage = forwardRef<HTMLElement, ChatMessageProps>(function ChatMessage({
  author = "agent",
  authorLabel,
  avatar,
  body,
  children,
  timestamp,
  meta,
  state = "default",
  tone = "neutral",
  density,
  action,
  className = "",
  ...rest
}, ref) {
  const resolvedAuthor = normalizeFlowValue(author, validAuthors, "agent");
  const resolvedState = normalizeFlowValue(state, validStates, "default");
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedDensity = normalizeFlowDensity(density);
  const role = messageRoleForTone(resolvedTone, resolvedState);
  const content: ReactNode = body ?? children;

  if (!content && resolvedState !== "loading") return null;

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["chat-message", className].filter(Boolean).join(" "),
      role,
      "aria-live": role === "alert" ? "assertive" : role === "status" ? "polite" : undefined,
      "data-flow-component": "chat-message",
      "data-author": resolvedAuthor,
      ...flowStateProps(resolvedState),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
    },
    resolvedAuthor !== "user" && avatar
      ? React.createElement(CompatibleAvatar, {
        ...(avatar as unknown as Record<string, unknown>),
        name: avatar.name ?? authorLabel ?? "Agent",
        className: ["chat-message__avatar", avatar.className].filter(Boolean).join(" "),
        ...(avatar.density ?? resolvedDensity ? { density: avatar.density ?? resolvedDensity } : {}),
      })
      : null,
    React.createElement(
      Surface,
      {
        className: "chat-message__bubble",
        surfaceRole: "inline",
        tone: surfaceToneForMessage(resolvedTone),
        state: resolvedState === "failed" ? "focused" : "default",
        "data-flow-slot": "message-bubble",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
      },
      authorLabel || timestamp || meta
        ? React.createElement(
          "header",
          { className: "chat-message__header" },
          authorLabel ? React.createElement("strong", { className: "chat-message__author" }, authorLabel) : null,
          timestamp ? React.createElement("time", { className: "chat-message__time" }, timestamp) : null,
          meta ? React.createElement("span", { className: "chat-message__meta" }, meta) : null,
        )
        : null,
      resolvedState === "loading"
        ? React.createElement("span", { className: "chat-message__typing", "aria-label": "Message loading" })
        : React.createElement("p", { className: "chat-message__body" }, content),
      action?.label
        ? React.createElement(CompatibleButton, {
          ...(action as unknown as Record<string, unknown>),
          label: action.label,
          variant: action.variant ?? "ghost",
          className: ["chat-message__action", action.className].filter(Boolean).join(" "),
          onClick: action.onClick,
          ...(action.density ?? resolvedDensity ? { density: action.density ?? resolvedDensity } : {}),
        })
        : null,
    ),
  );
}) as ChatMessageComponent;

ChatMessage.displayName = "ChatMessage";
ChatMessage.platformContract = chatMessagePlatformContract;
