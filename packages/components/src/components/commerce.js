import { createSpinner } from "./feedback.js?v=8";
import { createTransitionalActionButton, createTransitionalActionIconButton } from "./actions.js?v=2";
import { createTransitionalBadge } from "./status.js?v=2";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createMovementRow({
  label,
  meta = "",
  amount = "",
  status = "",
  category = "transfer",
  variant = "standard",
  state = "default",
  density = "md",
  fullWidth = false,
  disabled = false,
} = {}) {
  const validVariants = new Set(["standard", "refund", "declined", "compact"]);
  const validStates = new Set(["default", "hover", "focus", "pending", "error", "disabled"]);
  const validDensities = new Set(["sm", "md", "lg"]);
  const categoryIcons = {
    fuel: "local_gas_station",
    charge: "bolt",
    toll: "toll",
    food: "restaurant",
    transfer: "sync_alt",
    income: "south_west",
  };
  const resolvedVariant = validVariants.has(variant) ? variant : "standard";
  const resolvedState = disabled ? "disabled" : validStates.has(state) ? state : status === "Pending" ? "pending" : status === "Declined" ? "error" : "default";
  const resolvedDensity = validDensities.has(density) ? density : "md";
  const row = document.createElement("button");
  row.type = "button";
  row.className = "movement-row";
  row.dataset.variant = resolvedVariant;
  row.dataset.state = resolvedState;
  row.dataset.density = resolvedDensity;
  row.dataset.category = category;
  row.dataset.fullWidth = String(Boolean(fullWidth));
  row.disabled = disabled || resolvedState === "disabled";
  const iconNode = document.createElement("span");
  iconNode.className = "movement-row__icon";
  iconNode.setAttribute("aria-hidden", "true");
  setIconGlyph(iconNode, categoryIcons[category] || categoryIcons.transfer);
  const content = document.createElement("span");
  content.className = "movement-row__content";
  const title = document.createElement("strong");
  title.textContent = label ?? "Movement";
  content.append(title);
  if (meta) {
    const metaNode = document.createElement("small");
    metaNode.textContent = meta;
    content.append(metaNode);
  }
  const value = document.createElement("span");
  value.className = "movement-row__value";
  const amountNode = document.createElement("strong");
  amountNode.className = "movement-row__amount";
  amountNode.textContent = amount;
  value.append(amountNode);
  if (status) {
    const statusNode = document.createElement("small");
    statusNode.className = "movement-row__status";
    statusNode.textContent = status;
    value.append(statusNode);
  }
  row.append(iconNode, content, value);
  return row;
}

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
