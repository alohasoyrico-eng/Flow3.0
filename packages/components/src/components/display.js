import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createTransitionalAvatar({
  name,
  src = "",
  size = "md",
  density,
  status = "none",
  state = "default",
} = {}) {
  const resolvedSize = ["sm", "md", "lg", "xl"].includes(density ?? size) ? density ?? size : "md";
  const resolvedStatus = ["none", "online", "busy", "offline"].includes(status) ? status : "none";
  const resolvedState = state === "disabled" ? "disabled" : resolvedStatus !== "none" ? resolvedStatus : state === "unknown" ? "unknown" : "default";
  const sourceName = String(name ?? "");
  let hash = 0;
  for (let index = 0; index < sourceName.length; index += 1) hash = (hash * 31 + sourceName.charCodeAt(index)) | 0;
  const colorIndex = String(Math.abs(hash) % 6);
  const avatar = document.createElement("span");
  avatar.className = ["avatar", `avatar--${resolvedSize}`].join(" ");
  avatar.dataset.status = resolvedStatus;
  avatar.dataset.state = resolvedState;
  avatar.dataset.colorIndex = colorIndex;
  avatar.setAttribute("aria-label", sourceName || "Unknown avatar");

  if (src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = sourceName;
    avatar.append(image);
  } else {
    const initials = sourceName
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
    const initialsNode = document.createElement("span");
    initialsNode.className = "avatar__initials";
    initialsNode.setAttribute("aria-hidden", "true");
    initialsNode.textContent = initials;
    avatar.append(initialsNode);
  }

  if (resolvedStatus !== "none") {
    const statusNode = document.createElement("span");
    statusNode.className = "avatar__status";
    statusNode.setAttribute("aria-hidden", "true");
    avatar.append(statusNode);
  }
  return avatar;
}
