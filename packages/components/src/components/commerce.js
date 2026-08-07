import { createTransitionalActionButton, createTransitionalActionIconButton } from "./actions.js?v=2";
import { createSpinner } from "./feedback.js?v=8";
import { createTransitionalBadge } from "./status.js?v=2";
import { createMapsPrimitive } from "../primitives/maps.js?v=1";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createStationPin({
  label,
  value = "",
  meta = "",
  icon = "local_gas_station",
  count,
  variant = "fuel",
  state = "default",
  density = "md",
  selected = false,
  unavailable = false,
  disabled = false,
} = {}) {
  const validVariants = new Set(["fuel", "ev", "service", "cluster"]);
  const validStates = new Set(["default", "hover", "focus", "selected", "unavailable", "disabled"]);
  const resolvedVariant = validVariants.has(variant) ? variant : "fuel";
  const resolvedState = disabled ? "disabled" : unavailable ? "unavailable" : selected ? "selected" : validStates.has(state) ? state : "default";
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const markerCount = count != null || resolvedVariant === "cluster" ? count ?? 6 : null;
  const pin = document.createElement("button");
  pin.type = "button";
  pin.className = "station-pin";
  pin.dataset.variant = resolvedVariant;
  pin.dataset.state = resolvedState;
  pin.dataset.density = resolvedDensity;
  pin.disabled = resolvedState === "disabled" || resolvedState === "unavailable";
  if (resolvedState === "selected") pin.setAttribute("aria-pressed", "true");
  const visibleValue = markerCount != null ? String(markerCount) : value || label || "Station";
  const mapPrimitive = createMapsPrimitive({
    permission: "granted",
    pins: [
      {
        label: label ?? visibleValue,
        value: value && value !== label ? value : "",
        meta,
        variant: resolvedVariant,
        state: resolvedState,
        selected: resolvedState === "selected",
        unavailable: resolvedState === "unavailable",
      },
    ],
  });
  pin.dataset.mapPrimitive = "maps";
  pin.setAttribute("aria-label", mapPrimitive.mapLayerModel.pins[0]?.accessibleLabel ?? String(label ?? visibleValue));
  const marker = document.createElement("span");
  marker.className = "station-pin__marker";
  marker.setAttribute("aria-hidden", "true");
  marker.dataset.kind = markerCount != null ? "count" : "icon";
  marker.textContent = markerCount != null ? String(markerCount) : icon;
  pin.append(marker);
  if (markerCount == null) {
    const valueNode = document.createElement("span");
    valueNode.className = "station-pin__value";
    valueNode.textContent = visibleValue;
    pin.append(valueNode);
  }
  return pin;
}

export function createRouteSummary({
  label,
  description = "",
  metrics = [],
  actions = [],
  variant = "standard",
  state = "default",
  density = "md",
  tone = "neutral",
  icon = "navigation",
  selected = false,
  disabled = false,
  fullWidth = false,
} = {}) {
  const summary = document.createElement("article");
  summary.className = "route-summary";
  const resolvedState = disabled ? "disabled" : selected ? "selected" : state;
  summary.dataset.variant = variant;
  summary.dataset.state = resolvedState;
  summary.dataset.density = density;
  summary.dataset.tone = tone;
  if (fullWidth) summary.dataset.fullWidth = "true";
  if (selected || resolvedState === "selected") summary.setAttribute("aria-selected", "true");
  if (disabled || resolvedState === "disabled") summary.setAttribute("aria-disabled", "true");
  if (resolvedState === "focus") summary.tabIndex = 0;
  const header = document.createElement("header");
  if (icon) {
    const iconNode = document.createElement("span");
    iconNode.className = "route-summary__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, icon);
    header.append(iconNode);
  }
  const labelNode = document.createElement("div");
  labelNode.className = "route-summary__label";
  const title = document.createElement("strong");
  title.textContent = label ?? "Route";
  labelNode.append(title);
  if (description) {
    const desc = document.createElement("small");
    desc.textContent = description;
    labelNode.append(desc);
  }
  header.append(labelNode);
  summary.append(header);
  const metricRow = document.createElement("div");
  metricRow.className = "route-summary__metrics";
  for (const metric of metrics) {
    const item = document.createElement("span");
    const metricLabel = document.createElement("small");
    metricLabel.textContent = metric.label ?? "";
    const metricValue = document.createElement("strong");
    metricValue.textContent = metric.value ?? "";
    item.append(metricLabel, metricValue);
    metricRow.append(item);
  }
  summary.append(metricRow);
  if (actions.length) {
    const footer = document.createElement("footer");
    for (const action of actions) {
      if (variant === "compact") {
        footer.append(createTransitionalActionIconButton({
          icon: action.icon ?? "close",
          ariaLabel: action.ariaLabel ?? action.label ?? "Cancel route",
          variant: action.variant ?? "ghost",
          density: action.density ?? "sm",
          disabled: disabled || resolvedState === "disabled" || action.disabled,
        }));
      } else {
        footer.append(createTransitionalActionButton({ ...action, disabled: disabled || resolvedState === "disabled" || action.disabled }));
      }
    }
    summary.append(footer);
  }
  return summary;
}

export function createCardSummary({
  label,
  meta = "",
  number = "",
  status = "",
  metrics = [],
  expires = "",
  variant = "physical",
  state = "default",
  density = "md",
  icon = "",
  fullWidth = false,
  disabled = false,
} = {}) {
  const validVariants = new Set(["physical", "virtual", "compact", "limit"]);
  const validStates = new Set(["default", "hover", "focus", "active", "warning", "frozen", "disabled"]);
  const validDensities = new Set(["sm", "md", "lg"]);
  const resolvedVariant = validVariants.has(variant) ? variant : "physical";
  const resolvedState = disabled ? "disabled" : validStates.has(state) ? state : "default";
  const resolvedDensity = validDensities.has(density) ? density : "md";
  const statusLabel = status || (resolvedState === "frozen" ? "Frozen" : resolvedState === "warning" ? "Review" : "Active");
  const statusTone = resolvedState === "warning" ? "warning" : resolvedState === "frozen" ? "info" : resolvedState === "disabled" ? "neutral" : "success";
  const summary = document.createElement("article");
  summary.className = "card-summary";
  summary.dataset.variant = resolvedVariant;
  summary.dataset.state = resolvedState;
  summary.dataset.density = resolvedDensity;
  summary.dataset.fullWidth = String(Boolean(fullWidth));
  if (resolvedState === "disabled") summary.setAttribute("aria-disabled", "true");
  if (["hover", "focus", "active"].includes(resolvedState)) summary.tabIndex = 0;
  const header = document.createElement("header");
  const brand = document.createElement("strong");
  brand.className = "card-summary__brand";
  brand.textContent = label ?? "Card";
  header.append(brand);
  header.append(createTransitionalBadge({ label: statusLabel, tone: statusTone, variant: "status", state: resolvedState === "disabled" ? "disabled" : "default" }));
  summary.append(header);
  const tech = document.createElement("div");
  tech.className = "card-summary__tech";
  const chip = document.createElement("span");
  chip.className = "card-summary__chip";
  chip.setAttribute("aria-hidden", "true");
  tech.append(chip);
  const contactless = document.createElement("span");
  contactless.className = "card-summary__icon";
  contactless.setAttribute("aria-hidden", "true");
  setIconGlyph(contactless, icon || (resolvedVariant === "virtual" ? "smartphone" : resolvedState === "frozen" ? "ac_unit" : "contactless"));
  tech.append(contactless);
  summary.append(tech);
  if (number) {
    const numberRow = document.createElement("p");
    numberRow.className = "card-summary__number-row";
    const numberNode = document.createElement("span");
    numberNode.className = "card-summary__number";
    numberNode.textContent = number;
    numberRow.append(numberNode);
    if (expires) {
      const expiryNode = document.createElement("span");
      expiryNode.className = "card-summary__expires";
      expiryNode.textContent = expires;
      numberRow.append(expiryNode);
    }
    summary.append(numberRow);
  }
  if (meta) {
    const metaNode = document.createElement("small");
    metaNode.className = "card-summary__holder";
    metaNode.textContent = meta;
    summary.append(metaNode);
  }
  if (metrics.length && resolvedVariant === "limit") {
    const metricRow = document.createElement("div");
    metricRow.className = "card-summary__metrics";
    for (const metric of metrics) {
      const item = document.createElement("span");
      const metricLabel = document.createElement("small");
      metricLabel.textContent = metric.label ?? "";
      const metricValue = document.createElement("strong");
      metricValue.textContent = metric.value ?? "";
      item.append(metricLabel, metricValue);
      metricRow.append(item);
    }
    summary.append(metricRow);
  }
  if (resolvedState === "frozen") {
    const frozenLayer = document.createElement("span");
    frozenLayer.className = "card-summary__frost";
    frozenLayer.setAttribute("aria-hidden", "true");
    const frostIcon = document.createElement("span");
    frostIcon.className = "card-summary__icon";
    setIconGlyph(frostIcon, "ac_unit");
    const frostText = document.createElement("span");
    frostText.textContent = statusLabel;
    frozenLayer.append(frostIcon, frostText);
    summary.append(frozenLayer);
  }
  return summary;
}

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
