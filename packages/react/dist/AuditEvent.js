import React, { forwardRef, } from "react";
import { auditEventPlatformContract } from "#flow/platforms";
import { flowToneProps, flowStateProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validTones = new Set(["neutral", "info", "success", "warning", "danger", "action"]);
const validStates = new Set(["default", "hover", "focus", "verified", "warning", "critical", "disabled"]);
function statusFor(state, tone, status) {
    const statusTone = state === "verified"
        ? "success"
        : state === "warning"
            ? "warning"
            : state === "critical"
                ? "danger"
                : normalizeFlowValue(tone, validTones, "neutral");
    return { statusText: status, statusTone };
}
export const AuditEvent = forwardRef(function AuditEvent({ label, description, meta, status, icon = "", tone = "neutral", state = "default", density, timestamp, className = "", ...rest }, ref) {
    const resolvedState = normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    const { statusText, statusTone } = statusFor(resolvedState, tone, status);
    return React.createElement("article", {
        ...flowRestProps(rest),
        ref,
        className: ["audit-event", className].filter(Boolean).join(" "),
        ...flowToneProps(statusTone),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    }, icon ? React.createElement("span", { className: "audit-event__icon material-symbol", "aria-hidden": "true" }, icon) : null, React.createElement("div", { className: "audit-event__content" }, React.createElement("strong", null, label), description ? React.createElement("p", null, description) : null, meta || timestamp || statusText
        ? React.createElement("span", { className: "audit-event__meta" }, meta ? React.createElement("small", null, meta) : null, timestamp ? React.createElement("time", { className: "audit-event__time" }, timestamp) : null, statusText ? React.createElement("em", null, statusText) : null)
        : null));
});
AuditEvent.displayName = "AuditEvent";
AuditEvent.platformContract = auditEventPlatformContract;
