import { createSpinner } from "./feedback.js?v=8";
import { createTransitionalBadge } from "./status.js?v=2";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createQuickAction({
  label,
  icon = "",
  badge = "",
  variant = "standard",
  state = "default",
  density = "md",
  loading = false,
  tone = "neutral",
  disabled = false,
} = {}) {
  const validVariants = new Set(["standard", "destructive", "compact", "wide"]);
  const validStates = new Set(["default", "hover", "focus", "pressed", "loading", "warning", "disabled"]);
  const resolvedVariant = validVariants.has(variant) ? variant : tone === "danger" ? "destructive" : "standard";
  const resolvedState = disabled ? "disabled" : loading ? "loading" : validStates.has(state) ? state : "default";
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const action = document.createElement("div");
  action.className = "quick-action";
  action.dataset.variant = resolvedVariant;
  action.dataset.state = resolvedState;
  action.dataset.density = resolvedDensity;
  const control = document.createElement("button");
  control.type = "button";
  control.className = "quick-action__control";
  control.disabled = disabled;
  control.setAttribute("aria-label", label ?? "Action");
  if (resolvedState === "loading") control.setAttribute("aria-busy", "true");
  if (icon || resolvedState === "loading") {
    const iconNode = document.createElement("span");
    iconNode.className = "quick-action__icon";
    iconNode.setAttribute("aria-hidden", "true");
    if (resolvedState === "loading") {
      iconNode.append(createSpinner({ label: `${label ?? "Action"} loading`, density: "sm", decorative: true }));
    } else {
      setIconGlyph(iconNode, icon);
    }
    control.append(iconNode);
  }
  const labelNode = document.createElement("span");
  labelNode.className = "quick-action__label";
  labelNode.textContent = label ?? "Action";
  action.append(control, labelNode);
  if (badge) action.append(createTransitionalBadge({ label: badge, variant: "count" }));
  return action;
}
