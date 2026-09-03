/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useState } from "react";
import { avatarPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validStatuses = new Set(["none", "online", "busy", "offline"]);
const validStates = new Set(["default", "online", "busy", "offline", "disabled", "unknown"]);
const validIdentityTones = new Set(["auto", "action", "success", "danger", "warning", "purple", "teal"]);
const avatarDensityExtensions = ["xl"];
const statusLabels = {
    online: "En linea",
    busy: "Ocupado",
    offline: "Desconectado",
};
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
    let hash = 2166136261;
    for (let index = 0; index < sourceName.length; index += 1) {
        hash ^= sourceName.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    hash ^= hash >>> 15;
    hash = Math.imul(hash, 2246822507);
    hash ^= hash >>> 13;
    return (hash >>> 0) % 6;
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
function identityColorFromTone(tone, name) {
    if (!validIdentityTones.has(tone) || tone === "auto")
        return identityColorFromName(name);
    const toneMap = {
        action: { bg: "var(--comp-avatar-identity-action-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        success: { bg: "var(--comp-avatar-identity-success-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        danger: { bg: "var(--comp-avatar-identity-danger-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        warning: { bg: "var(--comp-avatar-identity-warning-bg)", fg: "var(--comp-avatar-identity-warning-fg)" },
        purple: { bg: "var(--comp-avatar-identity-purple-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
        teal: { bg: "var(--comp-avatar-identity-teal-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
    };
    return toneMap[tone];
}
export const Avatar = forwardRef(function Avatar({ name, src = "", density, identityTone = "auto", status = "none", state = "default", className = "", ...rest }, ref) {
    const resolvedDensity = normalizeFlowDensity(density, avatarDensityExtensions);
    const resolvedStatus = validStatuses.has(status) ? status : "none";
    const resolvedState = state === "disabled" ? "disabled" : resolvedStatus !== "none" ? resolvedStatus : validStates.has(state) ? state : "default";
    const sourceName = String(name ?? "");
    const imageSrc = String(src ?? "");
    const [failedSrc, setFailedSrc] = useState("");
    const shouldRenderImage = Boolean(imageSrc) && failedSrc !== imageSrc;
    if (!sourceName)
        return null;
    const identityColor = identityColorFromTone(identityTone, sourceName);
    return React.createElement("span", {
        ...flowRestProps(rest),
        ref,
        className: ["avatar", className].filter(Boolean).join(" "),
        "aria-label": sourceName,
        ...flowDensityProps(resolvedDensity, avatarDensityExtensions),
        "data-identity-tone": validIdentityTones.has(identityTone) ? identityTone : "auto",
        "data-status": resolvedStatus,
        ...flowStateProps(resolvedState),
        style: {
            "--comp-avatar-identity-bg": identityColor.bg,
            "--comp-avatar-identity-fg": identityColor.fg,
        },
    }, shouldRenderImage
        ? React.createElement("img", { src: imageSrc, alt: sourceName, onError: () => setFailedSrc(imageSrc) })
        : React.createElement("span", { className: "avatar__initials", "aria-hidden": "true" }, initialsFromName(sourceName)), resolvedStatus !== "none" ? React.createElement("span", { className: "avatar__status", role: "img", "aria-label": statusLabels[resolvedStatus] }) : null);
});
Avatar.displayName = "Avatar";
Avatar.platformContract = avatarPlatformContract;
