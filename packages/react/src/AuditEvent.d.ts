import type {
  HTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { auditEventPlatformContract } from "@design-system/components/platforms";

export type AuditEventTone = "neutral" | "info" | "success" | "warning" | "danger" | "action";
export type AuditEventState = "default" | "hover" | "focus" | "verified" | "warning" | "critical" | "disabled";
export type AuditEventDensity = "sm" | "md" | "lg";

export interface AuditEventProps extends HTMLAttributes<HTMLElement> {
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
