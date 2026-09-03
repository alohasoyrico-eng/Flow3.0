import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
  forwardRef,
} from "react";
import { auditEventPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import { flowToneProps, flowStateProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

export type AuditEventTone = "neutral" | "info" | "success" | "warning" | "danger" | "action";
export type AuditEventState = "default" | "hover" | "focus" | "verified" | "warning" | "critical" | "disabled";
export type AuditEventDensity = FlowDensity;

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

const validTones = new Set<AuditEventTone>(["neutral", "info", "success", "warning", "danger", "action"]);
const validStates = new Set<AuditEventState>(["default", "hover", "focus", "verified", "warning", "critical", "disabled"]);

function statusFor(state: AuditEventState, tone: AuditEventTone, status: string | undefined) {
  const statusTone = state === "verified"
    ? "success"
    : state === "warning"
      ? "warning"
      : state === "critical"
        ? "danger"
        : normalizeFlowValue(tone, validTones, "neutral");
  return { statusText: status, statusTone };
}

export const AuditEvent = forwardRef<HTMLElement, AuditEventProps>(function AuditEvent({
  label,
  description,
  meta,
  status,
  icon = "",
  tone = "neutral",
  state = "default",
  density,
  timestamp,
  className = "",
  ...rest
}, ref) {
  const resolvedState = normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  if (!label) return null;
  const { statusText, statusTone } = statusFor(resolvedState, tone, status);

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["audit-event", className].filter(Boolean).join(" "),
      ...flowToneProps(statusTone),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    },
    icon ? React.createElement("span", { className: "audit-event__icon material-symbol", "aria-hidden": "true" }, icon) : null,
    React.createElement(
      "div",
      { className: "audit-event__content" },
      React.createElement(
        "span",
        { className: "audit-event__header" },
        React.createElement("strong", null, label),
        statusText ? React.createElement("em", null, statusText) : null,
      ),
      description ? React.createElement("p", null, description) : null,
      meta || timestamp
        ? React.createElement(
            "span",
            { className: "audit-event__meta" },
            meta ? React.createElement("small", null, meta) : null,
            timestamp ? React.createElement("time", { className: "audit-event__time" }, timestamp) : null,
          )
        : null,
    ),
  );
}) as AuditEventComponent;

AuditEvent.displayName = "AuditEvent";
AuditEvent.platformContract = auditEventPlatformContract;
