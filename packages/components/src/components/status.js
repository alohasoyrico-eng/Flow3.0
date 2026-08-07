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
