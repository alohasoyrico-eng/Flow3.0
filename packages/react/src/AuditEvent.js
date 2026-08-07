import React, { forwardRef } from "react";
import { auditEventPlatformContract } from "@design-system/components/platforms";
import { flowRestProps } from "./internal/props.js";

const validTones = new Set(["neutral", "info", "success", "warning", "danger", "action"]);
const validStates = new Set(["default", "hover", "focus", "verified", "warning", "critical", "disabled"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

function statusFor(state, tone, status) {
  const statusText = status || (state === "verified" ? "Verified" : state === "warning" ? "Review" : state === "critical" ? "Critical" : "");
  const statusTone = state === "verified"
    ? "success"
    : state === "warning"
      ? "warning"
      : state === "critical"
        ? "danger"
        : normalize(tone, validTones, "neutral");
  return { statusText, statusTone };
}

export const AuditEvent = forwardRef(function AuditEvent({
  label,
  description = "",
  meta = "",
  status = "",
  icon = "",
  tone = "neutral",
  state = "default",
  density,
  timestamp = "",
  className = "",
  ...rest
}, ref) {
  const resolvedState = normalize(state, validStates, "default");
  const resolvedDensity = validDensities.has(density) ? density : "";
  const { statusText, statusTone } = statusFor(resolvedState, tone, status);

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["audit-event", className].filter(Boolean).join(" "),
      "data-tone": statusTone,
      "data-state": resolvedState,
      "data-density": resolvedDensity || undefined,
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    },
    icon ? React.createElement("span", { className: "audit-event__icon material-symbol", "aria-hidden": "true" }, icon) : null,
    React.createElement(
      "div",
      { className: "audit-event__content" },
      React.createElement("strong", null, label ?? "Audit event"),
      description ? React.createElement("p", null, description) : null,
      meta || timestamp || statusText
        ? React.createElement(
            "span",
            { className: "audit-event__meta" },
            meta ? React.createElement("small", null, meta) : null,
            timestamp ? React.createElement("time", { className: "audit-event__time" }, timestamp) : null,
            statusText ? React.createElement("em", null, statusText) : null,
          )
        : null,
    ),
  );
});

AuditEvent.displayName = "AuditEvent";
AuditEvent.platformContract = auditEventPlatformContract;
