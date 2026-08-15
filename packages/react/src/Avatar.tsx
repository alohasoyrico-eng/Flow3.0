import React, { forwardRef } from "react";
import type { CSSProperties, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { avatarPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type AvatarDensity = "sm" | "md" | "lg";
export type AvatarStatus = "none" | "online" | "busy" | "offline";
export type AvatarState = "default" | "online" | "busy" | "offline" | "disabled" | "unknown";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  name: string;
  src?: string;
  density?: AvatarDensity;
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
  let hash = 0;
  for (let index = 0; index < sourceName.length; index += 1) hash = (hash * 31 + sourceName.charCodeAt(index)) | 0;
  return Math.abs(hash) % 6;
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

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar({
  name,
  src = "",
  density,
  status = "none",
  state = "default",
  className = "",
  ...rest
}, ref) {
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedStatus = validStatuses.has(status) ? status : "none";
  const resolvedState = state === "disabled" ? "disabled" : resolvedStatus !== "none" ? resolvedStatus : validStates.has(state) ? state : "default";
  const sourceName = String(name ?? "");

  if (!sourceName) return null;
  const identityColor = identityColorFromName(sourceName);

  return React.createElement(
    "span",
    {
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
      } satisfies AvatarIdentityStyle,
    },
    src
      ? React.createElement("img", { src, alt: sourceName })
      : React.createElement("span", { className: "avatar__initials", "aria-hidden": "true" }, initialsFromName(sourceName)),
    resolvedStatus !== "none" ? React.createElement("span", { className: "avatar__status", "aria-hidden": "true" }) : null,
  );
}) as AvatarComponent;

Avatar.displayName = "Avatar";
Avatar.platformContract = avatarPlatformContract;
