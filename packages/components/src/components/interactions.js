import { createTransitionalActionButton } from "./actions.js?v=2";
import { createTransitionalBadge } from "./status.js?v=2";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

function setStyleProperty(node, name, value) {
  if (node?.style?.setProperty) {
    node.style.setProperty(name, value);
    return;
  }
  if (node?.style?.values) {
    node.style.values[name] = value;
    return;
  }
  const next = `${name}: ${value}`;
  node.style = [node?.style, next].filter(Boolean).join("; ");
}

export function createTabs({
  label = "Tabs",
  items = [],
  selectedKey = "",
  variant = "default",
  onValueChange,
} = {}) {
  const tabs = document.createElement("div");
  tabs.className = "tabs";
  tabs.dataset.variant = variant;
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", label);

  const itemKey = (item) => item?.key ?? item?.value ?? item?.label ?? "";
  const selected = selectedKey || itemKey(items.find((item) => item.selected)) || itemKey(items[0]) || "";
  const buttons = [];
  const enabledButtons = () => buttons.filter((button) => !button.disabled);
  const isSelectedTab = (button) => button?.attributes?.["aria-selected"] === "true" || button?.getAttribute?.("aria-selected") === "true";
  const updateIndicator = (button = buttons.find((candidate) => isSelectedTab(candidate))) => {
    if (!button) return;
    tabs.style = `--comp-tabs-indicator-left: ${button.offsetLeft ?? 0}px; --comp-tabs-indicator-width: ${button.offsetWidth ?? 0}px`;
    tabs.dataset.indicatorSynced = "true";
  };
  const selectTab = (button, notify = true) => {
    if (!button || button.disabled) return;
    for (const candidate of buttons) {
      const active = candidate === button;
      candidate.setAttribute("aria-selected", String(active));
      candidate.tabIndex = active ? 0 : -1;
    }
    updateIndicator(button);
    if (notify && typeof onValueChange === "function") onValueChange(button.dataset.key);
  };
  const moveTab = (current, direction) => {
    const enabled = enabledButtons();
    if (!enabled.length) return;
    const currentIndex = Math.max(0, enabled.indexOf(current));
    const next = enabled[(currentIndex + direction + enabled.length) % enabled.length];
    selectTab(next);
    if (typeof next.focus === "function") next.focus();
  };

  for (const item of items) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tabs__tab";
    tab.setAttribute("data-tabs-item", "");
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(item.key === selected));
    tab.tabIndex = item.key === selected ? 0 : -1;
    tab.disabled = Boolean(item.disabled);
    tab.dataset.key = item.key ?? item.label ?? "";
    if (item.icon) {
      const iconNode = document.createElement("span");
      iconNode.className = "tabs__icon";
      iconNode.setAttribute("aria-hidden", "true");
      setIconGlyph(iconNode, item.icon);
      tab.append(iconNode);
    }
    const labelNode = document.createElement("span");
    labelNode.className = "tabs__label";
    labelNode.textContent = item.label ?? item.key ?? "Tab";
    tab.append(labelNode);
    const badge = item.badge ?? (item.count != null ? { label: String(item.count), variant: "count", tone: "neutral" } : null);
    if (badge) {
      tab.append(createTransitionalBadge({
        label: badge.label ?? String(badge.count ?? ""),
        tone: badge.tone ?? "neutral",
        variant: badge.variant ?? "count",
        ariaLabel: badge.ariaLabel ?? "",
      }));
    }
    tab.addEventListener?.("click", () => selectTab(tab));
    tab.addEventListener?.("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault?.();
        moveTab(tab, 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault?.();
        moveTab(tab, -1);
      } else if (event.key === "Home") {
        event.preventDefault?.();
        const first = enabledButtons()[0];
        selectTab(first);
        first?.focus?.();
      } else if (event.key === "End") {
        event.preventDefault?.();
        const enabled = enabledButtons();
        const last = enabled[enabled.length - 1];
        selectTab(last);
        last?.focus?.();
      }
    });
    buttons.push(tab);
    tabs.append(tab);
  }
  updateIndicator(buttons.find((button) => isSelectedTab(button)) ?? buttons[0]);
  globalThis.ResizeObserver && new globalThis.ResizeObserver(() => updateIndicator()).observe(tabs);
  globalThis.window?.addEventListener?.("resize", () => updateIndicator());
  return tabs;
}
