import React, { forwardRef } from "react";
import type { ChangeEvent, ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { ChatComposer } from "../ChatComposer.js";
import type { ChatComposerProps } from "../ChatComposer.js";
import { ChatThread } from "../ChatThread.js";
import type { ChatThreadProps } from "../ChatThread.js";
import { Surface } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { TextAreaChangeMeta } from "../TextArea.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";

export type AgentConversationState = "default" | "active" | "composing" | "sending" | "handoff" | "offline" | "error" | "disabled";
export type AgentConversationDensity = "sm" | "md" | "lg";

export interface AgentConversationHandoff {
  active?: boolean;
  title?: string;
  description?: string;
  action?: StatusFeedbackViewProps["action"];
}

export interface AgentConversationProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: AgentConversationDensity;
  state?: AgentConversationState;
  disabled?: boolean;
  sending?: boolean;
  offline?: boolean;
  error?: ChatThreadProps["error"];
  thread?: Partial<ChatThreadProps>;
  composer?: Partial<ChatComposerProps>;
  handoff?: AgentConversationHandoff;
  feedback?: Partial<StatusFeedbackViewProps>;
  selectedMessageKey?: string;
  className?: string;
  onMessageAction?: ChatThreadProps["onMessageAction"];
  onComposerChange?: (value: string, meta: TextAreaChangeMeta, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: ChatComposerProps["onSend"];
  onAttach?: ChatComposerProps["onAttach"];
  onHandoffAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface AgentConversationComponent extends ForwardRefExoticComponent<AgentConversationProps & RefAttributes<HTMLDivElement>> {
  displayName: "AgentConversation";
}

const validStates = new Set<AgentConversationState>(["default", "active", "composing", "sending", "handoff", "offline", "error", "disabled"]);

type AgentConversationRestProps = Record<string, unknown>;

function sanitizeRestProps(rest: AgentConversationRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

interface NormalizeStateInput {
  state?: AgentConversationState | undefined;
  disabled?: boolean | undefined;
  sending?: boolean | undefined;
  offline?: boolean | undefined;
  error?: ChatThreadProps["error"] | undefined;
  handoff?: AgentConversationHandoff | undefined;
  composer?: Partial<ChatComposerProps> | undefined;
}

function normalizeState({ state, disabled, sending, offline, error, handoff, composer }: NormalizeStateInput): AgentConversationState {
  if (disabled) return "disabled";
  if (error) return "error";
  if (offline) return "offline";
  if (handoff?.active) return "handoff";
  if (sending || composer?.sending) return "sending";
  if (state && validStates.has(state)) return state;
  if (composer?.value || composer?.defaultValue) return "composing";
  return "active";
}

function surfaceStateFor(state: AgentConversationState): ComponentProps<typeof Surface>["state"] {
  if (state === "disabled") return "disabled";
  if (state === "error" || state === "offline") return "sunken";
  if (state === "handoff" || state === "sending") return "selected";
  return "default";
}

function threadStateFor(state: AgentConversationState, thread: Partial<ChatThreadProps>): ChatThreadProps["state"] {
  if (thread?.state) return thread.state;
  if (state === "offline") return "offline";
  if (state === "error") return "error";
  if (state === "handoff") return "handoff";
  return "default";
}

export const AgentConversation = forwardRef<HTMLDivElement, AgentConversationProps>(function AgentConversation({
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

  const handoffFeedback: Partial<StatusFeedbackViewProps> | null = handoff?.active
    ? {
      kind: handoff.action?.label ? "toast" : "inline",
      title: handoff.title ?? "Handoff in progress",
      message: handoff.description ?? "A teammate can join this conversation.",
      description: handoff.description ?? "A teammate can join this conversation.",
      state: "info",
      ...(handoff.action ? { action: handoff.action } : {}),
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
    } as ComponentProps<typeof Surface>,
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
    } as ComponentProps<typeof ChatThread>),
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
      } as ComponentProps<typeof StatusFeedbackView>)
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
      } as ComponentProps<typeof ChatComposer>)
      : null,
  );
}) as AgentConversationComponent;

AgentConversation.displayName = "AgentConversation";
