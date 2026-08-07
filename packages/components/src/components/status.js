import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createTransitionalBadge({
  label,
  tone = "neutral",
  variant = "status",
  state = "default",
  hidden = false,
  live = false,
  icon = "",
  ariaLabel = "",
} = {}) {
  const validTones = new Set(["neutral", "info", "success", "warning", "danger", "accent"]);
  const validVariants = new Set(["count", "dot", "status", "icon"]);
  const validStates = new Set(["default", "hover", "focus", "overflow", "hidden", "disabled"]);
  const resolvedTone = validTones.has(tone) ? tone : "neutral";
  const resolvedVariant = validVariants.has(variant) ? variant : "status";
  const resolvedState = hidden ? "hidden" : validStates.has(state) ? state : "default";
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.dataset.tone = resolvedTone;
  badge.dataset.variant = resolvedVariant;
  badge.dataset.state = resolvedState;
  badge.hidden = resolvedState === "hidden";
  if (ariaLabel) badge.setAttribute("aria-label", ariaLabel);
  if (resolvedState === "disabled") badge.setAttribute("aria-disabled", "true");
  if (live) {
    badge.setAttribute("role", "status");
    badge.setAttribute("aria-live", "polite");
    badge.dataset.live = "true";
  }
  if (live) {
    const liveNode = document.createElement("span");
    liveNode.className = "badge__live";
    liveNode.setAttribute("aria-hidden", "true");
    badge.append(liveNode);
  }
  if (resolvedVariant === "icon" && icon) {
    const iconNode = document.createElement("span");
    iconNode.className = "badge__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, icon);
    badge.append(iconNode);
  }
  const valueNode = document.createElement("span");
  valueNode.className = "badge__label";
  valueNode.textContent = resolvedVariant === "dot" ? "" : label ?? "Badge";
  badge.append(valueNode);
  return badge;
}

export function createTransitionalTag({
  label,
  variant = "metadata",
  tone = "neutral",
  state = "default",
  icon = "",
  interactive = false,
  disabled = false,
} = {}) {
  const validVariants = new Set(["metadata", "status", "platform", "link"]);
  const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
  const validStates = new Set(["default", "hover", "pressed", "focus", "disabled"]);
  const resolvedVariant = validVariants.has(variant) ? variant : "metadata";
  const resolvedTone = validTones.has(tone) ? tone : "neutral";
  const resolvedState = disabled ? "disabled" : validStates.has(state) ? state : "default";
  const isInteractive = Boolean(interactive) || resolvedVariant === "link";
  const tag = document.createElement(isInteractive ? "button" : "span");
  tag.className = "tag";
  tag.dataset.variant = resolvedVariant;
  tag.dataset.tone = resolvedTone;
  tag.dataset.state = resolvedState;
  if (isInteractive) {
    tag.type = "button";
    tag.disabled = resolvedState === "disabled";
    tag.dataset.interactive = "true";
  }
  if (icon) {
    const iconNode = document.createElement("span");
    iconNode.className = "tag__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, icon);
    tag.append(iconNode);
  }
  const labelNode = document.createElement("span");
  labelNode.className = "tag__label";
  labelNode.textContent = label ?? "Tag";
  tag.append(labelNode);
  return tag;
}
