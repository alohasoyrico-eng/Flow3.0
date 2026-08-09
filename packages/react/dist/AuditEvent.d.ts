import type {
  HTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { auditEventPlatformContract } from "#flow/platforms";

export type AuditEventTone = "neutral" | "info" | "success" | "warning" | "danger" | "action";
export type AuditEventState = "default" | "hover" | "focus" | "verified" | "warning" | "critical" | "disabled";
export type AuditEventDensity = "sm" | "md" | "lg";

export interface AuditEventProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  meta?: string;
  status?: string;
  icon?: string;
  tone?: AuditEventTone;
  state?: AuditEventState;
  density?: AuditEventDensity;
  timestamp?: string;
}

export interface AuditEventComponent extends ForwardRefExoticComponent<AuditEventProps & RefAttributes<HTMLElement>> {
  displayName: "AuditEvent";
  platformContract: typeof auditEventPlatformContract;
}

export const AuditEvent: AuditEventComponent;
