import React, { forwardRef } from "react";
import { avatarPlatformContract } from "#flow/platforms";
import { normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validSizes = new Set(["sm", "md", "lg", "xl"]);
const validStatuses = new Set(["none", "online", "busy", "offline"]);
const validStates = new Set(["default", "disabled", "unknown"]);

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
  for (let index = 0; index < sourceName.length; index += 1) hash = (hash * 31 + sourceName.charCodeAt(index)) | 0;
  return String(Math.abs(hash) % 6);
}

export const Avatar = forwardRef(function Avatar({
  name,
  src = "",
  size,
  density,
  status = "none",
  state = "default",
  ariaLabel = "",
  className = "",
  ...rest
}, ref) {
  const resolvedSize = validSizes.has(size) ? size : "";
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedStatus = validStatuses.has(status) ? status : "none";
  const resolvedState = state === "disabled" ? "disabled" : resolvedStatus !== "none" ? resolvedStatus : validStates.has(state) ? state : "default";
  const sourceName = String(name ?? "");

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["avatar", resolvedSize ? `avatar--${resolvedSize}` : "", className].filter(Boolean).join(" "),
      "aria-label": ariaLabel || sourceName || "Unknown avatar",
      ...flowDensityProps(resolvedDensity),
      "data-status": resolvedStatus,
      "data-state": resolvedState,
      "data-color-index": colorIndexFromName(sourceName),
    },
    src
      ? React.createElement("img", { src, alt: sourceName })
      : React.createElement("span", { className: "avatar__initials", "aria-hidden": "true" }, initialsFromName(sourceName)),
    resolvedStatus !== "none" ? React.createElement("span", { className: "avatar__status", "aria-hidden": "true" }) : null,
  );
});

Avatar.displayName = "Avatar";
Avatar.platformContract = avatarPlatformContract;
