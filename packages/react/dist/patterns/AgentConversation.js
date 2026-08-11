import React, { forwardRef } from "react";
import { ChatComposer } from "../ChatComposer.js";
import { ChatThread } from "../ChatThread.js";
import { Surface } from "../Surface.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";

const validStates = new Set(["default", "active", "composing", "sending", "handoff", "offline", "error", "disabled"]);

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeState({ state, disabled, sending, offline, error, handoff, composer }) {
  if (disabled) return "disabled";
  if (error) return "error";
  if (offline) return "offline";
  if (handoff?.active) return "handoff";
  if (sending || composer?.sending) return "sending";
  if (state && validStates.has(state)) return state;
  if (composer?.value || composer?.defaultValue) return "composing";
  return "active";
}

function surfaceStateFor(state) {
  if (state === "disabled") return "disabled";
  if (state === "error" || state === "offline") return "sunken";
  if (state === "handoff" || state === "sending") return "selected";
  return "default";
}

function threadStateFor(state, thread) {
  if (thread?.state) return thread.state;
  if (state === "offline") return "offline";
  if (state === "error") return "error";
  if (state === "handoff") return "handoff";
  return "default";
}

export const AgentConversation = forwardRef(function AgentConversation({
  label = "Agent conversation",
  description,
  density = "md",
  state,
  disabled = false,
  sending = false,
  offline = false,
  error,
  thread = {},
  composer,
  handoff,
  feedback,
  selectedMessageKey,
  className = "",
  onMessageAction,
  onComposerChange,
  onSend,
  onAttach,
  onHandoffAction,
  onFeedbackAction,
  ...rest
}, ref) {
  const messages = normalizeArray(thread.messages);
  const resolvedState = normalizeState({ state, disabled, sending, offline, error, handoff, composer });
  const isDisabled = disabled || resolvedState === "disabled";
  const isSending = sending || resolvedState === "sending";

  const handoffFeedback = handoff?.active
    ? {
      kind: handoff.action?.label ? "toast" : "inline",
      title: handoff.title ?? "Handoff in progress",
      message: handoff.description ?? "A teammate can join this conversation.",
      description: handoff.description ?? "A teammate can join this conversation.",
      state: "info",
      action: handoff.action,
    }
    : null;
  const resolvedFeedback = feedback ?? handoffFeedback;

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState),
      density,
      elevation: "none",
      focusMode: "within",
      role: "group",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isSending ? "true" : undefined,
      "data-flow-pattern": "agent-conversation",
      "data-flow-slot": "conversationSurface",
      "data-conversation-state": resolvedState,
      "data-density": density,
      "data-message-count": String(messages.length),
      ...sanitizeRestProps(rest),
    },
    React.createElement(ChatThread, {
      ...thread,
      label: thread.label ?? label,
      description: thread.description ?? description,
      messages,
      density: thread.density ?? density,
      state: threadStateFor(resolvedState, thread),
      selectedMessageKey: thread.selectedMessageKey ?? selectedMessageKey,
      onMessageAction: (key, event) => {
        thread.onMessageAction?.(key, event);
        if (event.defaultPrevented) return;
        onMessageAction?.(key, event);
      },
      "data-flow-slot": "thread",
    }),
    resolvedFeedback
      ? React.createElement(StatusFeedbackView, {
        ...resolvedFeedback,
        label: resolvedFeedback.label ?? `${label} status`,
        density: resolvedFeedback.density ?? density,
        onAction: (key, event) => {
          resolvedFeedback.onAction?.(key, event);
          if (event.defaultPrevented) return;
          if (handoff?.active) onHandoffAction?.(key, event);
          onFeedbackAction?.(key, event);
        },
        "data-flow-slot": "handoffFeedback",
        "data-flow-pattern-boundary": "status-feedback-view",
      })
      : null,
    composer
      ? React.createElement(ChatComposer, {
        ...composer,
        label: composer.label ?? `${label} message`,
        density: composer.density ?? density,
        disabled: isDisabled || composer.disabled,
        sending: isSending || composer.sending,
        onValueChange: (value, meta, event) => {
          composer.onValueChange?.(value, meta, event);
          onComposerChange?.(value, meta, event);
        },
        onSend: (value, event) => {
          composer.onSend?.(value, event);
          if (event.defaultPrevented) return;
          onSend?.(value, event);
        },
        onAttach: (event) => {
          composer.onAttach?.(event);
          if (event.defaultPrevented) return;
          onAttach?.(event);
        },
        "data-flow-slot": "composer",
      })
      : null,
  );
});

AgentConversation.displayName = "AgentConversation";
