import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { AgentConversationProps } from "../patterns/AgentConversation.js";
import type { StatusFeedbackViewProps } from "../patterns/StatusFeedbackView.js";
import type { TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";

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
  state?: AgentWorkspaceState;
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
    event: MouseEvent<HTMLButtonElement>
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

export const AgentWorkspace: AgentWorkspaceComponent;
