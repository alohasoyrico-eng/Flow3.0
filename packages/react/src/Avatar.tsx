import React, { forwardRef, useState } from "react";
import type { CSSProperties, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { avatarPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type AvatarDensity = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "none" | "online" | "busy" | "offline";
export type AvatarState = "default" | "online" | "busy" | "offline" | "disabled" | "unknown";
export type AvatarIdentityTone = "auto" | "action" | "success" | "danger" | "warning" | "purple" | "teal";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  name: string;
  src?: string;
  density?: AvatarDensity;
  identityTone?: AvatarIdentityTone;
  status?: AvatarStatus;
  state?: AvatarState;
}

export interface AvatarComponent extends ForwardRefExoticComponent<AvatarProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Avatar";
  platformContract: typeof avatarPlatformContract;
}

type AvatarIdentityStyle = CSSProperties & {
  "--comp-avatar-identity-bg": string;
  "--comp-avatar-identity-fg": string;
};

const validStatuses = new Set<AvatarStatus>(["none", "online", "busy", "offline"]);
const validStates = new Set<AvatarState>(["default", "online", "busy", "offline", "disabled", "unknown"]);
const validIdentityTones = new Set<AvatarIdentityTone>(["auto", "action", "success", "danger", "warning", "purple", "teal"]);
const avatarDensityExtensions = ["xl"] as const;
const statusLabels: Record<Exclude<AvatarStatus, "none">, string> = {
  online: "En linea",
  busy: "Ocupado",
  offline: "Desconectado",
};

function initialsFromName(name: string): string {
  return String(name ?? "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";
}

function colorIndexFromName(name: string): number {
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

function identityColorFromName(name: string): { bg: string; fg: string } {
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

function identityColorFromTone(tone: AvatarIdentityTone, name: string): { bg: string; fg: string } {
  if (!validIdentityTones.has(tone) || tone === "auto") return identityColorFromName(name);
  const toneMap: Record<Exclude<AvatarIdentityTone, "auto">, { bg: string; fg: string }> = {
    action: { bg: "var(--comp-avatar-identity-action-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
    success: { bg: "var(--comp-avatar-identity-success-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
    danger: { bg: "var(--comp-avatar-identity-danger-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
    warning: { bg: "var(--comp-avatar-identity-warning-bg)", fg: "var(--comp-avatar-identity-warning-fg)" },
    purple: { bg: "var(--comp-avatar-identity-purple-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
    teal: { bg: "var(--comp-avatar-identity-teal-bg)", fg: "var(--comp-avatar-identity-default-fg)" },
  };
  return toneMap[tone];
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar({
  name,
  src = "",
  density,
  identityTone = "auto",
  status = "none",
  state = "default",
  className = "",
  ...rest
}, ref) {
  const resolvedDensity = normalizeFlowDensity(density, avatarDensityExtensions) as AvatarDensity | undefined;
  const resolvedStatus = validStatuses.has(status) ? status : "none";
  const resolvedState = state === "disabled" ? "disabled" : resolvedStatus !== "none" ? resolvedStatus : validStates.has(state) ? state : "default";
  const sourceName = String(name ?? "");
  const imageSrc = String(src ?? "");
  const [failedSrc, setFailedSrc] = useState("");
  const shouldRenderImage = Boolean(imageSrc) && failedSrc !== imageSrc;

  if (!sourceName) return null;
  const identityColor = identityColorFromTone(identityTone, sourceName);

  return React.createElement(
    "span",
    {
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
      } satisfies AvatarIdentityStyle,
    },
    shouldRenderImage
      ? React.createElement("img", { src: imageSrc, alt: sourceName, onError: () => setFailedSrc(imageSrc) })
      : React.createElement("span", { className: "avatar__initials", "aria-hidden": "true" }, initialsFromName(sourceName)),
    resolvedStatus !== "none" ? React.createElement("span", { className: "avatar__status", role: "img", "aria-label": statusLabels[resolvedStatus] }) : null,
  );
}) as AvatarComponent;

Avatar.displayName = "Avatar";
Avatar.platformContract = avatarPlatformContract;
