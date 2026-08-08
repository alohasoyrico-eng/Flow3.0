import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { tabsPlatformContract } from "#flow/platforms";
import { Badge } from "./Badge.js";
import { flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const allowedVariants = new Set(["default", "underline"]);

function itemKey(item) {
  return item?.key ?? item?.value ?? "";
}

function hasStableItemKey(item) {
  const key = item?.key ?? item?.value;
  return key !== undefined && key !== null && key !== "";
}

function normalizeItems(items) {
  const sourceItems = Array.isArray(items) ? items : [];
  return sourceItems.filter((item) => item?.label && hasStableItemKey(item)).map((item) => ({
    ...item,
    key: itemKey(item),
    label: item.label,
  }));
}

function selectedFromItems(items, selectedKey) {
  if (selectedKey !== undefined) return selectedKey;
  const selectedItemKey = itemKey(items.find((item) => item.selected));
  return selectedItemKey !== "" ? selectedItemKey : itemKey(items[0]);
}

export const Tabs = forwardRef(function Tabs({
  label,
  items,
  selectedKey,
  variant = "default",
  density,
  onValueChange,
  className = "",
  ...rest
}, ref) {
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const isSelectedKeyControlled = selectedKey !== undefined;
  const [currentKey, setCurrentKey] = useState(() => selectedFromItems(normalizedItems, selectedKey));
  const rootRef = useRef(null);
  const tabRefs = useRef(new Map());
  const resolvedVariant = allowedVariants.has(variant) ? variant : "default";
  const resolvedDensity = normalizeFlowDensity(density);
  const activeKey = isSelectedKeyControlled ? selectedKey : currentKey || selectedFromItems(normalizedItems, selectedKey);

  const syncIndicator = (key = activeKey) => {
    const root = rootRef.current;
    const tab = tabRefs.current.get(key);
    if (!root || !tab) return;
    root.style.setProperty("--comp-tabs-indicator-left", `${tab.offsetLeft ?? 0}px`);
    root.style.setProperty("--comp-tabs-indicator-width", `${tab.offsetWidth ?? 0}px`);
  };

  useEffect(() => {
    if (isSelectedKeyControlled) setCurrentKey(selectedFromItems(normalizedItems, selectedKey));
  }, [isSelectedKeyControlled, normalizedItems, selectedKey]);

  useEffect(() => {
    syncIndicator(activeKey);
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => syncIndicator(activeKey));
    observer.observe(root);
    return () => observer.disconnect();
  }, [activeKey, normalizedItems]);

  const commitKey = (nextKey, restoreFocus = false) => {
    const tab = normalizedItems.find((item) => item.key === nextKey);
    if (!tab || tab.disabled) return;
    if (!isSelectedKeyControlled) setCurrentKey(nextKey);
    onValueChange?.(nextKey);
    const schedule = globalThis.requestAnimationFrame ?? ((callback) => globalThis.setTimeout?.(callback, 0));
    schedule(() => syncIndicator(nextKey));
    if (restoreFocus) schedule(() => tabRefs.current.get(nextKey)?.focus());
  };

  const enabled = normalizedItems.filter((item) => !item.disabled);
  const move = (direction) => {
    if (!enabled.length) return;
    const currentIndex = Math.max(0, enabled.findIndex((item) => item.key === activeKey));
    commitKey(enabled[(currentIndex + direction + enabled.length) % enabled.length]?.key, true);
  };
  const moveToEdge = (edge) => {
    const next = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
    if (next) commitKey(next.key, true);
  };

  if (!normalizedItems.length) return null;

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref: (node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      className: ["tabs", className].filter(Boolean).join(" "),
      role: "tablist",
      "aria-label": label,
      ...flowVariantProps(resolvedVariant),
      ...flowDensityProps(resolvedDensity),
    },
    normalizedItems.map((item) => {
      const selected = item.key === activeKey;
      const badge = item.badge?.label ? item.badge : null;
      const { key, value, label: itemLabel, icon, badge: itemBadge, selected: itemSelected, disabled, onClick, onKeyDown, ...itemRest } = item;
      return React.createElement(
        "button",
        {
          ...itemRest,
          key: item.key,
          ref: (node) => {
            if (node) tabRefs.current.set(item.key, node);
            else tabRefs.current.delete(item.key);
          },
          type: "button",
          className: "tabs__tab",
          role: "tab",
          disabled: Boolean(disabled),
          tabIndex: selected ? 0 : -1,
          "aria-selected": String(selected),
          "data-tabs-item": "",
          "data-key": item.key,
          onClick: (event) => {
            onClick?.(event);
            if (event.defaultPrevented) return;
            commitKey(item.key);
          },
          onKeyDown: (event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1);
            } else if (event.key === "Home") {
              event.preventDefault();
              moveToEdge("first");
            } else if (event.key === "End") {
              event.preventDefault();
              moveToEdge("last");
            }
          },
        },
        icon ? React.createElement("span", { className: "tabs__icon", "aria-hidden": "true" }, icon) : null,
        React.createElement("span", { className: "tabs__label" }, itemLabel),
        badge ? React.createElement(Badge, {
          label: badge.label,
          tone: badge.tone ?? "neutral",
          variant: badge.variant ?? "count",
          density: resolvedDensity || undefined,
        }) : null,
      );
    }),
  );
});

Tabs.displayName = "Tabs";
Tabs.platformContract = tabsPlatformContract;
