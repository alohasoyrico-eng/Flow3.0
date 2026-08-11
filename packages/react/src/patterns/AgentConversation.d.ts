import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ChatComposerProps } from "../ChatComposer.js";
import type { ChatThreadProps } from "../ChatThread.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { TextAreaChangeMeta } from "../TextArea.js";
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

export const AgentConversation: AgentConversationComponent;
