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

export function createTreeView({
  label = "Tree view",
  nodes = [],
  state = "expanded",
  density = "md",
  onSelect,
  onExpandedChange,
} = {}) {
  const tree = document.createElement("ul");
  tree.className = "tree-view";
  tree.dataset.state = state;
  tree.dataset.density = density;
  tree.setAttribute("role", "tree");
  tree.setAttribute("aria-label", label);
  const entries = [];
  const visibleEntries = () => entries.filter(({ item }) => !item.hidden);
  const expandedKeys = () => entries
    .filter(({ item }) => item.getAttribute("aria-expanded") === "true")
    .map(({ key }) => key);
  const updateNestedVisibility = () => {
    const collapsedLevels = [];
    for (const entry of entries) {
      const level = Number(entry.item.getAttribute("aria-level") ?? 1);
      while (collapsedLevels.length && collapsedLevels[collapsedLevels.length - 1] >= level) collapsedLevels.pop();
      entry.item.hidden = collapsedLevels.length > 0;
      if (entry.item.getAttribute("aria-expanded") === "false") collapsedLevels.push(level);
    }
  };
  const setActive = (entry) => {
    if (!entry || entry.control.disabled || entry.item.hidden) return;
    for (const candidate of entries) candidate.control.tabIndex = candidate === entry ? 0 : -1;
    entry.control.focus?.();
  };
  const selectEntry = (entry) => {
    if (!entry || entry.control.disabled) return;
    for (const candidate of entries) {
      const active = candidate === entry;
      candidate.item.setAttribute("aria-selected", String(active));
      candidate.control.setAttribute("aria-selected", String(active));
    }
    setActive(entry);
    if (typeof onSelect === "function") onSelect(entry.key);
  };
  const setExpanded = (entry, expanded) => {
    if (!entry || !entry.item.hasAttribute("aria-expanded")) return;
    entry.item.setAttribute("aria-expanded", String(Boolean(expanded)));
    entry.control.setAttribute("aria-expanded", String(Boolean(expanded)));
    const disclosure = entry.control.querySelector?.(".button__icon--trailing");
    if (disclosure) setIconGlyph(disclosure, "expand_more");
    updateNestedVisibility();
    if (typeof onExpandedChange === "function") onExpandedChange(expandedKeys());
  };
  const moveActive = (entry, direction) => {
    const visible = visibleEntries();
    const index = Math.max(0, visible.indexOf(entry));
    setActive(visible[Math.max(0, Math.min(visible.length - 1, index + direction))]);
  };
  for (const [index, node] of nodes.entries()) {
    const item = document.createElement("li");
    const key = node.key ?? node.id ?? node.label ?? `tree-item-${index}`;
    item.className = "tree-view__item";
    item.setAttribute("data-tree-item", "");
    item.dataset.key = String(key);
    const level = Math.max(1, Math.min(5, Number(node.level ?? 1)));
    const expandable = node.expanded != null;
    item.dataset.level = String(level);
    if (item.style?.setProperty) item.style.setProperty("--comp-tree-view-depth-offset", String(level - 1));
    else item.style = `--comp-tree-view-depth-offset: ${level - 1}`;
    item.setAttribute("role", "none");
    item.setAttribute("aria-level", String(level));
    if (expandable) item.setAttribute("aria-expanded", String(Boolean(node.expanded)));
    item.setAttribute("aria-selected", String(Boolean(node.selected)));
    const control = createTransitionalActionButton({
      label: node.label ?? "Tree item",
      variant: "secondary",
      disabled: node.disabled,
      icon: expandable ? node.icon ?? "folder" : node.icon ?? "",
      trailingIcon: expandable ? "expand_more" : "",
      density,
    });
    control.className = `${control.className} tree-view__control`;
    control.setAttribute("data-tree-control", "");
    control.setAttribute("role", "treeitem");
    control.setAttribute("aria-level", String(level));
    if (expandable) control.setAttribute("aria-expanded", String(Boolean(node.expanded)));
    control.setAttribute("aria-selected", String(Boolean(node.selected)));
    control.tabIndex = node.selected ? 0 : -1;
    const entry = { item, control, key };
    control.addEventListener?.("click", () => {
      selectEntry(entry);
      if (item.hasAttribute("aria-expanded")) setExpanded(entry, item.getAttribute("aria-expanded") !== "true");
    });
    control.addEventListener?.("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault?.();
        moveActive(entry, 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault?.();
        moveActive(entry, -1);
      } else if (event.key === "Home") {
        event.preventDefault?.();
        setActive(visibleEntries()[0]);
      } else if (event.key === "End") {
        event.preventDefault?.();
        const visible = visibleEntries();
        setActive(visible[visible.length - 1]);
      } else if (event.key === "ArrowRight") {
        event.preventDefault?.();
        setExpanded(entry, true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault?.();
        setExpanded(entry, false);
      }
    });
    entries.push(entry);
    item.append(control);
    tree.append(item);
  }
  updateNestedVisibility();
  if (!entries.some((entry) => entry.control.tabIndex === 0) && entries[0]) entries[0].control.tabIndex = 0;
  return tree;
}
