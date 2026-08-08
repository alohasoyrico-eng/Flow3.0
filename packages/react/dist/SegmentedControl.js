import React, { forwardRef, useId, useMemo, useRef, useState } from "react";
import { segmentedControlPlatformContract } from "#flow/platforms";
import { flowVariantProps, normalizeFlowValue, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["outlined", "toolbar", "compact", "icon-only"]);

function itemKey(item) {
  return item?.key ?? item?.value ?? "";
}

function hasStableItemKey(item) {
  const key = item?.key ?? item?.value;
  return key !== undefined && key !== null && key !== "";
}

function normalizeItems(items) {
  return (Array.isArray(items) ? items : []).filter((item) => item?.label && hasStableItemKey(item)).map((item) => ({
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

function nextEnabledKey(items, currentKey, direction) {
  const enabled = items.filter((item) => !item.disabled);
  if (!enabled.length) return currentKey;
  const currentIndex = Math.max(0, enabled.findIndex((item) => item.key === currentKey));
  return enabled[(currentIndex + direction + enabled.length) % enabled.length]?.key ?? currentKey;
}

export const SegmentedControl = forwardRef(function SegmentedControl({
  label,
  items,
  selectedKey,
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
  const isSelectedKeyControlled = selectedKey !== undefined;
  const [currentKey, setCurrentKey] = useState(() => selectedFromItems(normalizedItems, selectedKey));
  const itemRefs = useRef(new Map());
  const activeKey = isSelectedKeyControlled ? selectedKey : currentKey || selectedFromItems(normalizedItems, selectedKey);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "outlined");

  if (!label || !normalizedItems.length) return null;

  const commitKey = (nextKey, restoreFocus = false) => {
    const option = normalizedItems.find((item) => item.key === nextKey);
    if (!option || option.disabled) return;
    if (!isSelectedKeyControlled) setCurrentKey(nextKey);
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
      ...flowRestProps(rest),
      ref,
      id: controlId,
      className: ["segmented-control", className].filter(Boolean).join(" "),
      role: "tablist",
      "aria-label": label,
      ...flowVariantProps(resolvedVariant),
      ...flowDensityProps(density),
    },
    normalizedItems.map((item) => {
      const selected = item.key === activeKey;
      const iconOnly = resolvedVariant === "icon-only" && Boolean(item.icon);
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
        selected ? React.createElement("span", { className: "segmented-control__indicator", "aria-hidden": "true" }) : null,
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
