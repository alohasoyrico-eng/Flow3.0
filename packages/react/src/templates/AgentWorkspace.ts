import React, { forwardRef, useState } from "react";
import { Badge, type BadgeProps } from "../Badge.js";
import { Button, type ButtonProps } from "../Button.js";
import { Surface, type SurfaceDensity, type SurfaceRole, type SurfaceState, type SurfaceTone } from "../Surface.js";
import { AgentConversation, type AgentConversationProps } from "../patterns/AgentConversation.js";
import { StatusFeedbackView, type StatusFeedbackViewProps } from "../patterns/StatusFeedbackView.js";
import { Topbar, type TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";

export type AgentWorkspaceState = "loaded" | "loading" | "empty" | "handoff" | "error" | "permission" | "offline" | "disabled";
export type AgentWorkspaceDensity = SurfaceDensity;
export type AgentWorkspaceConversationKey = "handoff" | "route-help" | "receipt" | (string & {});

export interface AgentWorkspaceConversation {
  key: AgentWorkspaceConversationKey;
  label: string;
  meta?: string;
  unread?: number;
  tone?: BadgeProps["tone"];
}

export interface AgentWorkspaceProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: AgentWorkspaceDensity;
  tone?: SurfaceTone;
  state?: AgentWorkspaceState | undefined;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  handoff?: boolean;
  selectedConversation?: AgentWorkspaceConversationKey;
  defaultSelectedConversation?: AgentWorkspaceConversationKey;
  onSelectedConversationChange?: (
    key: string,
    conversation: AgentWorkspaceConversation,
    event: MouseEvent<HTMLButtonElement>,
  ) => void;
  topbar?: TopbarProps;
  conversations?: AgentWorkspaceConversation[];
  thread?: AgentConversationProps["thread"];
  composer?: AgentConversationProps["composer"];
  feedback?: StatusFeedbackViewProps;
  context?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface AgentWorkspaceComponent extends ForwardRefExoticComponent<AgentWorkspaceProps & RefAttributes<HTMLDivElement>> {
  displayName: "AgentWorkspace";
}

type SanitizedRestProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
} & {
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SanitizedRestProps {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as SanitizedRestProps;
}

function resolveTemplateState({
  disabled,
  loading,
  error,
  permissionBlocked,
  offline,
  handoff,
  state,
}: {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  handoff?: boolean;
  state?: AgentWorkspaceState | undefined;
}): AgentWorkspaceState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (permissionBlocked || state === "permission") return "permission";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (handoff || state === "handoff") return "handoff";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: AgentWorkspaceState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "error" || state === "offline" || state === "permission") return "raised";
  return "default";
}

function threadStateForTemplate(state: AgentWorkspaceState): NonNullable<ChatThreadState> {
  if (state === "loading") return "loading";
  if (state === "error") return "error";
  if (state === "offline") return "offline";
  if (state === "handoff") return "handoff";
  if (state === "permission" || state === "disabled") return "empty";
  return "default";
}

type ChatThreadState = NonNullable<NonNullable<AgentConversationProps["thread"]>["state"]>;
type ChatComposerState = NonNullable<NonNullable<AgentConversationProps["composer"]>["state"]>;

function composerStateForTemplate(state: AgentWorkspaceState, sending?: boolean): ChatComposerState | undefined {
  if (state === "disabled" || state === "permission" || state === "offline") return "disabled";
  if (sending || state === "loading") return "sending";
  if (state === "error") return "error";
  return undefined;
}

const defaultConversations: AgentWorkspaceConversation[] = [
  { key: "handoff", label: "Card dispute", meta: "Driver waiting", unread: 2, tone: "warning" },
  { key: "route-help", label: "Route help", meta: "Station guidance", unread: 1, tone: "info" },
  { key: "receipt", label: "Receipt review", meta: "Finance evidence", unread: 1, tone: "success" },
];

const defaultMessages: NonNullable<NonNullable<AgentConversationProps["thread"]>["messages"]> = [
  {
    key: "agent-1",
    author: "agent",
    authorLabel: "Flow agent",
    body: "I found the failed authorization. I can open a support case with the receipt evidence.",
    timestamp: "10:24",
    avatar: { name: "Flow agent", status: "online" } as NonNullable<
      NonNullable<NonNullable<AgentConversationProps["thread"]>["messages"]>[number]["avatar"]
    >,
    tone: "info",
  },
  {
    key: "driver-1",
    author: "user",
    authorLabel: "Driver",
    body: "Please start the case and keep the station details attached.",
    timestamp: "10:26",
    state: "sent",
  },
];

export const AgentWorkspace = forwardRef<HTMLDivElement, AgentWorkspaceProps>(function AgentWorkspace(
  {
    label = "Agent workspace",
    description = "Resolve driver conversations with context, handoff, and recovery.",
    density = "md",
    tone,
    state,
    disabled = false,
    loading = false,
    error = false,
    permissionBlocked = false,
    offline = false,
    handoff = false,
    selectedConversation,
    defaultSelectedConversation = "handoff",
    onSelectedConversationChange,
    topbar,
    conversations = defaultConversations,
    thread,
    composer,
    feedback,
    context,
    className = "",
    ...rest
  },
  ref,
) {
  const [internalSelectedConversation, setInternalSelectedConversation] = useState<AgentWorkspaceConversationKey>(defaultSelectedConversation);
  const resolvedSelectedConversation = selectedConversation ?? internalSelectedConversation;
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, handoff, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission";
  const isBusy = loading || resolvedState === "loading";
  const selectedConversationModel = conversations.find((item) => item.key === resolvedSelectedConversation) ?? conversations[0];

  const handleConversationSelect = (conversation: AgentWorkspaceConversation, event: MouseEvent<HTMLButtonElement>) => {
    const key = conversation.key;
    if (isDisabled || event.defaultPrevented) return;
    if (selectedConversation === undefined) setInternalSelectedConversation(key);
    onSelectedConversationChange?.(key, conversation, event);
  };

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "canvas",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "none",
      tone: tone ?? (resolvedState === "error" || resolvedState === "offline" ? "danger" : resolvedState === "handoff" ? "warning" : "default"),
      focusMode: "within",
      role: "region",
      "aria-label": label,
      "aria-describedby": description ? "agent-workspace-description" : undefined,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-template": "agent-workspace",
      "data-template-state": resolvedState,
      "data-state": resolvedState,
      "data-density": density,
      "data-selected-conversation": resolvedSelectedConversation,
      ...sanitizeRestProps(rest),
    },
    React.createElement(Topbar, {
      ...(topbar ?? {}),
      label: topbar?.label ?? label,
      density: topbar?.density ?? density,
      state: topbar?.state ?? (isBusy ? "loading" : resolvedState === "permission" ? "permission-filtered" : undefined),
      loading: isBusy || topbar?.loading,
      disabled: isDisabled || topbar?.disabled,
      permissionFiltered: resolvedState === "permission" || topbar?.permissionFiltered,
      search: topbar?.search ?? { label: "Search conversations", placeholder: "Search conversations" },
      actions: topbar?.actions ?? [{ key: "handoff", label: "Handoff", icon: "support_agent" }],
      account: topbar?.account ?? { name: "Agent", status: "online" },
      "data-template-slot": "global-shell",
    } as TopbarProps),
    description ? React.createElement("p", { id: "agent-workspace-description", "data-template-module": "workspace-context" }, description) : null,
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-slot": "conversation-list",
        "data-template-module": "conversation-queue",
        "aria-label": "Conversation queue",
      },
      conversations.map((conversation) =>
        React.createElement(Button, {
          key: conversation.key,
          label: conversation.label,
          description: conversation.meta,
          density,
          variant: conversation.key === resolvedSelectedConversation ? "primary" : "ghost",
          state: (isDisabled ? "disabled" : conversation.key === resolvedSelectedConversation ? "active" : "default") as ButtonProps["state"],
          disabled: isDisabled,
          onClick: (event: MouseEvent<HTMLButtonElement>) => handleConversationSelect(conversation, event),
          "data-template-conversation": conversation.key,
        } as ButtonProps & { description?: string }),
      ),
      selectedConversationModel?.unread
        ? React.createElement(Badge, {
            label: String(selectedConversationModel.unread),
            ariaLabel: `${selectedConversationModel.unread} unread conversation updates`,
            tone: selectedConversationModel.tone ?? "info",
            variant: "count",
            density,
            live: true,
            "data-template-module": "agent-state",
          })
        : null,
    ),
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-slot": "conversation-workspace",
      },
      React.createElement(AgentConversation, {
        label: selectedConversationModel?.label ?? "Conversation thread",
        description: "Conversation history and recovery evidence.",
        density,
        state: (resolvedState === "loaded" ? "active" : resolvedState === "permission" ? "disabled" : resolvedState) as AgentConversationProps["state"],
        disabled: isDisabled,
        sending: isBusy || composer?.sending,
        offline: resolvedState === "offline",
        error: resolvedState === "error" ? (thread?.error ?? { title: "Conversation unavailable", description: "Message delivery is unavailable." }) : thread?.error,
        thread: {
          ...(thread ?? {}),
          label: thread?.label ?? selectedConversationModel?.label ?? "Conversation thread",
          description: thread?.description ?? "Conversation history and recovery evidence.",
          density: thread?.density ?? density,
          state: thread?.state ?? threadStateForTemplate(resolvedState),
          messages: thread?.messages ?? defaultMessages,
          selectedMessageKey: thread?.selectedMessageKey,
        } as AgentConversationProps["thread"],
        composer: {
          ...(composer ?? {}),
          label: composer?.label ?? "Reply",
          placeholder: composer?.placeholder ?? "Write a reply",
          helper: composer?.helper ?? "Replies keep the selected conversation context.",
          density: composer?.density ?? density,
          state: composer?.state ?? composerStateForTemplate(resolvedState, composer?.sending),
          disabled: Boolean(isDisabled || resolvedState === "offline" || composer?.disabled),
          sending: Boolean(isBusy || composer?.sending),
          error: resolvedState === "error" ? composer?.error ?? "Message delivery is unavailable." : composer?.error,
          attachLabel: composer?.attachLabel ?? "Attach evidence",
          sendLabel: composer?.sendLabel ?? "Send reply",
        } as AgentConversationProps["composer"],
        "data-template-module": "agent-conversation",
      } as AgentConversationProps),
    ),
    React.createElement(
      Surface,
      {
        surfaceRole: "aside" as SurfaceRole,
        state: resolvedState === "handoff" ? "raised" : "default",
        density,
        elevation: "raised",
        "data-template-slot": "context-panel",
      },
      context ??
        React.createElement(StatusFeedbackView, {
          kind:
            feedback?.kind ??
            (resolvedState === "error"
              ? "error"
              : resolvedState === "offline"
                ? "maintenance"
                : resolvedState === "permission"
                  ? "permission"
                  : "inline"),
          label: feedback?.label ?? "Conversation context",
          title: feedback?.title ?? (resolvedState === "handoff" ? "Handoff ready" : "Context attached"),
          description: feedback?.description ?? "Driver, card, station, and support evidence stay attached to this conversation.",
          state: (feedback?.state ?? (resolvedState === "handoff" ? "warning" : resolvedState)) as NonNullable<StatusFeedbackViewProps["state"]>,
          tone: feedback?.tone,
          density: feedback?.density ?? density,
          action: feedback?.action,
          onAction: feedback?.onAction,
          "data-template-module": "handoff-recovery",
        } as StatusFeedbackViewProps),
    ),
  );
}) as AgentWorkspaceComponent;

AgentWorkspace.displayName = "AgentWorkspace";
