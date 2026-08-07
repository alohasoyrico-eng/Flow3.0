import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createTransitionalActionIconButton({
  label,
  ariaLabel,
  icon,
  variant = "ghost",
  density,
  selected = false,
  badge = false,
  disabled = false,
  type = "button",
} = {}) {
  const resolvedLabel = ariaLabel ?? label ?? icon ?? "Action";
  const canToggle = typeof selected === "boolean" && selected;
  const button = document.createElement("button");
  button.type = type;
  button.className = [
    "icon-button",
    `icon-button--${variant}`,
  ].filter(Boolean).join(" ");
  button.disabled = disabled;
  button.setAttribute("aria-label", resolvedLabel);
  if (density) button.dataset.density = density;
  if (canToggle) button.setAttribute("aria-pressed", "true");

  const iconNode = document.createElement("span");
  iconNode.className = "icon-button__icon";
  iconNode.setAttribute("aria-hidden", "true");
  setIconGlyph(iconNode, icon ?? "more_horiz");
  button.append(iconNode);

  if (badge) {
    const badgeNode = document.createElement("span");
    badgeNode.className = "icon-button__badge";
    badgeNode.setAttribute("aria-hidden", "true");
    button.append(badgeNode);
  }

  return button;
}
