/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { avatarPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validStatuses = new Set(["none", "online", "busy", "offline"]);
const validStates = new Set(["default", "online", "busy", "offline", "disabled", "unknown"]);
function initialsFromName(name) {
    return String(name ?? "")
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?";
}
function colorIndexFromName(name) {
    const sourceName = String(name ?? "");
    let hash = 0;
    for (let index = 0; index < sourceName.length; index += 1)
        hash = (hash * 31 + sourceName.charCodeAt(index)) | 0;
    return Math.abs(hash) % 6;
}
function identityColorFromName(name) {
    const palettes = [
        { bg: "var(--comp-avatar-identity-danger-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        { bg: "var(--comp-avatar-identity-success-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        { bg: "var(--comp-avatar-identity-action-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        { bg: "var(--comp-avatar-identity-warning-bg)", fg: "var(--comp-avatar-identity-warning-fg)" },
        { bg: "var(--comp-avatar-identity-purple-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        { bg: "var(--comp-avatar-identity-teal-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
    ];
    return palettes[colorIndexFromName(name)] ?? { bg: "var(--comp-avatar-identity-action-bg)", fg: "var(--comp-avatar-identity-default-fg)" };
}
export const Avatar = forwardRef(function Avatar({ name, src = "", density, status = "none", state = "default", className = "", ...rest }, ref) {
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedStatus = validStatuses.has(status) ? status : "none";
    const resolvedState = state === "disabled" ? "disabled" : resolvedStatus !== "none" ? resolvedStatus : validStates.has(state) ? state : "default";
    const sourceName = String(name ?? "");
    if (!sourceName)
        return null;
    const identityColor = identityColorFromName(sourceName);
    return React.createElement("span", {
        ...flowRestProps(rest),
        ref,
        className: ["avatar", className].filter(Boolean).join(" "),
        "aria-label": sourceName,
        ...flowDensityProps(resolvedDensity),
        "data-status": resolvedStatus,
        ...flowStateProps(resolvedState),
        style: {
            "--comp-avatar-identity-bg": identityColor.bg,
            "--comp-avatar-identity-fg": identityColor.fg,
        },
    }, src
        ? React.createElement("img", { src, alt: sourceName })
        : React.createElement("span", { className: "avatar__initials", "aria-hidden": "true" }, initialsFromName(sourceName)), resolvedStatus !== "none" ? React.createElement("span", { className: "avatar__status", "aria-hidden": "true" }) : null);
});
Avatar.displayName = "Avatar";
Avatar.platformContract = avatarPlatformContract;
