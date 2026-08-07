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

export function createAuditEvent({
  label,
  description = "",
  meta = "",
  status = "",
  icon = "",
  tone = "neutral",
  state = "default",
  density = "md",
  timestamp = "",
} = {}) {
  const validTones = new Set(["neutral", "info", "success", "warning", "danger", "action"]);
  const validStates = new Set(["default", "hover", "focus", "verified", "warning", "critical", "disabled"]);
  const resolvedState = validStates.has(state) ? state : "default";
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const statusText = status || (resolvedState === "verified" ? "Verified" : resolvedState === "warning" ? "Review" : resolvedState === "critical" ? "Critical" : "");
  const statusTone = resolvedState === "verified"
    ? "success"
    : resolvedState === "warning"
      ? "warning"
      : resolvedState === "critical"
        ? "danger"
        : validTones.has(tone)
          ? tone
          : "neutral";
  const event = document.createElement("article");
  event.className = "audit-event";
  event.dataset.tone = statusTone;
  event.dataset.state = resolvedState;
  event.dataset.density = resolvedDensity;
  if (resolvedState === "disabled") event.setAttribute("aria-disabled", "true");

  if (icon) {
    const iconNode = document.createElement("span");
    iconNode.className = "audit-event__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, icon);
    event.append(iconNode);
  }

  const content = document.createElement("div");
  content.className = "audit-event__content";
  const title = document.createElement("strong");
  title.textContent = label ?? "Audit event";
  content.append(title);
  if (description) {
    const descriptionNode = document.createElement("p");
    descriptionNode.textContent = description;
    content.append(descriptionNode);
  }
  const eventMeta = timestamp || "";
  if (meta || eventMeta || statusText) {
    const metaRow = document.createElement("span");
    metaRow.className = "audit-event__meta";
    if (meta) {
      const metaNode = document.createElement("small");
      metaNode.textContent = meta;
      metaRow.append(metaNode);
    }
    if (eventMeta) {
      const timeNode = document.createElement("time");
      timeNode.className = "audit-event__time";
      timeNode.textContent = eventMeta;
      metaRow.append(timeNode);
    }
    if (statusText) {
      const statusNode = document.createElement("em");
      statusNode.textContent = statusText;
      metaRow.append(statusNode);
    }
    content.append(metaRow);
  }
  event.append(content);
  return event;
}
