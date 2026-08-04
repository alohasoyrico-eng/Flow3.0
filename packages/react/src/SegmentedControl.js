import React, { forwardRef, useId, useMemo, useRef, useState } from "react";
import { segmentedControlPlatformContract } from "@design-system/components/platforms";

function itemKey(item) {
  return item?.key ?? item?.value ?? item?.label ?? "";
}

function normalizeItems(items) {
  return (items?.length ? items : [
    { key: "first", label: "First" },
    { key: "second", label: "Second" },
    { key: "third", label: "Third" },
  ]).map((item) => ({
    ...item,
    key: itemKey(item),
    label: item?.label ?? itemKey(item) ?? "Option",
  }));
}

function selectedFromItems(items, selectedKey) {
  return selectedKey || itemKey(items.find((item) => item.selected)) || itemKey(items[0]) || "";
}

function nextEnabledKey(items, currentKey, direction) {
  const enabled = items.filter((item) => !item.disabled);
  if (!enabled.length) return currentKey;
  const currentIndex = Math.max(0, enabled.findIndex((item) => item.key === currentKey));
  return enabled[(currentIndex + direction + enabled.length) % enabled.length]?.key ?? currentKey;
}

export const SegmentedControl = forwardRef(function SegmentedControl({
  label,
  items,
  selectedKey = "",
  onValueChange,
  variant = "outlined",
  density,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const controlId = id ?? `segmented-control-${generatedId}`;
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const [currentKey, setCurrentKey] = useState(() => selectedFromItems(normalizedItems, selectedKey));
  const itemRefs = useRef(new Map());
  const activeKey = selectedKey || currentKey || selectedFromItems(normalizedItems, selectedKey);
  const activeIndex = Math.max(0, normalizedItems.findIndex((item) => item.key === activeKey));
  const resolvedLabel = label ?? "Options";

  const commitKey = (nextKey, restoreFocus = false) => {
    const option = normalizedItems.find((item) => item.key === nextKey);
    if (!option || option.disabled) return;
    setCurrentKey(nextKey);
    onValueChange?.(nextKey);
    if (restoreFocus) requestAnimationFrame(() => itemRefs.current.get(nextKey)?.focus());
  };

  const move = (direction) => {
    commitKey(nextEnabledKey(normalizedItems, activeKey, direction), true);
  };

  const moveToEdge = (edge) => {
    const enabled = normalizedItems.filter((item) => !item.disabled);
    const next = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
    if (next) commitKey(next.key, true);
  };

  return React.createElement(
    "div",
    {
      ...rest,
      ref,
      id: controlId,
      className: ["segmented-control", className].filter(Boolean).join(" "),
      role: "tablist",
      "aria-label": resolvedLabel,
      "data-variant": variant,
      "data-density": density || undefined,
      style: {
        ...(rest.style ?? {}),
        "--segmented-control-count": String(Math.max(normalizedItems.length, 1)),
      },
    },
    React.createElement("span", {
      className: "segmented-control__indicator",
      "aria-hidden": "true",
      style: {
        "--segmented-control-index": String(activeIndex),
        "--segmented-control-count": String(Math.max(normalizedItems.length, 1)),
      },
    }),
    normalizedItems.map((item) => {
      const selected = item.key === activeKey;
      const iconOnly = variant === "icon-only" && Boolean(item.icon);
      return React.createElement(
        "button",
        {
          key: item.key,
          ref: (node) => {
            if (node) itemRefs.current.set(item.key, node);
            else itemRefs.current.delete(item.key);
          },
          type: "button",
          className: "segmented-control__item",
          role: "tab",
          disabled: Boolean(item.disabled),
          tabIndex: selected ? 0 : -1,
          "aria-selected": String(selected),
          "aria-label": iconOnly ? item.label : undefined,
          "data-segmented-control-item": "",
          "data-key": item.key,
          "data-icon-only": iconOnly ? "true" : undefined,
          onClick: () => commitKey(item.key),
          onKeyDown: (event) => {
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
        item.icon
          ? React.createElement("span", { className: "segmented-control__icon", "aria-hidden": "true" }, item.icon)
          : null,
        React.createElement("span", { className: "segmented-control__label", "aria-hidden": iconOnly ? "true" : undefined }, item.label),
      );
    }),
  );
});

SegmentedControl.displayName = "SegmentedControl";
SegmentedControl.platformContract = segmentedControlPlatformContract;
