import React, { forwardRef, useId, useMemo, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { segmentedControlPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowVariantProps, normalizeFlowValue, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";

export type SegmentedControlDensity = "sm" | "md" | "lg";
export type SegmentedControlVariant = "outlined" | "toolbar" | "compact" | "icon-only";
export type SegmentedControlValueChangeEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;

export interface SegmentedControlItem extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  key?: string;
  value?: string;
  label: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  items: SegmentedControlItem[];
  selectedKey?: string;
  onValueChange?: (key: string, event: SegmentedControlValueChangeEvent) => void;
  variant?: SegmentedControlVariant;
  density?: SegmentedControlDensity;
}

export interface SegmentedControlComponent extends ForwardRefExoticComponent<SegmentedControlProps & RefAttributes<HTMLDivElement>> {
  displayName: "SegmentedControl";
  platformContract: typeof segmentedControlPlatformContract;
}

type NormalizedSegmentedControlItem = SegmentedControlItem & { key: string; label: string };

const validVariants = new Set<SegmentedControlVariant>(["outlined", "toolbar", "compact", "icon-only"]);

function itemKey(item: SegmentedControlItem | undefined): string {
  return item?.key ?? item?.value ?? "";
}

function hasStableItemKey(item: SegmentedControlItem | undefined): boolean {
  const key = item?.key ?? item?.value;
  return key !== undefined && key !== null && key !== "";
}

function normalizeItems(items: SegmentedControlItem[] | undefined): NormalizedSegmentedControlItem[] {
  return (Array.isArray(items) ? items : []).filter((item) => item?.label && hasStableItemKey(item)).map((item) => ({
    ...item,
    key: itemKey(item),
    label: item.label,
  }));
}

function selectedFromItems(items: NormalizedSegmentedControlItem[], selectedKey: string | undefined): string {
  if (selectedKey !== undefined) return selectedKey;
  const selectedItemKey = itemKey(items.find((item) => item.selected));
  return selectedItemKey !== "" ? selectedItemKey : itemKey(items[0]);
}

function nextEnabledKey(items: NormalizedSegmentedControlItem[], currentKey: string, direction: number): string {
  const enabled = items.filter((item) => !item.disabled);
  if (!enabled.length) return currentKey;
  const currentIndex = Math.max(0, enabled.findIndex((item) => item.key === currentKey));
  return enabled[(currentIndex + direction + enabled.length) % enabled.length]?.key ?? currentKey;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl({
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
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const activeKey = isSelectedKeyControlled ? selectedKey : currentKey || selectedFromItems(normalizedItems, selectedKey);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "outlined");
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label || !normalizedItems.length) return null;

  const commitKey = (nextKey: string, restoreFocus = false, event?: SegmentedControlValueChangeEvent) => {
    const option = normalizedItems.find((item) => item.key === nextKey);
    if (!option || option.disabled) return;
    if (!isSelectedKeyControlled) setCurrentKey(nextKey);
    if (event) onValueChange?.(nextKey, event);
    const schedule = globalThis.requestAnimationFrame ?? ((callback) => globalThis.setTimeout?.(callback, 0));
    if (restoreFocus) schedule(() => itemRefs.current.get(nextKey)?.focus());
  };

  const move = (direction: number, event: KeyboardEvent<HTMLButtonElement>) => {
    commitKey(nextEnabledKey(normalizedItems, activeKey, direction), true, event);
  };

  const moveToEdge = (edge: "first" | "last", event: KeyboardEvent<HTMLButtonElement>) => {
    const enabled = normalizedItems.filter((item) => !item.disabled);
    const next = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
    if (next) commitKey(next.key, true, event);
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
      ...flowDensityProps(resolvedDensity),
    },
    normalizedItems.map((item) => {
      const selected = item.key === activeKey;
      const iconOnly = resolvedVariant === "icon-only" && Boolean(item.icon);
      const { key, value, label: itemLabel, icon, selected: itemSelected, disabled, onClick, onKeyDown, ...itemRest } = item;
      return React.createElement(
        "button",
        {
          ...itemRest,
          key: item.key,
          ref: (node: HTMLButtonElement | null): void => {
            if (node) itemRefs.current.set(item.key, node);
            else itemRefs.current.delete(item.key);
          },
          type: "button",
          className: "segmented-control__item",
          role: "tab",
          disabled: Boolean(disabled),
          tabIndex: selected ? 0 : -1,
          "aria-selected": String(selected),
          "aria-label": iconOnly ? itemLabel : undefined,
          "data-segmented-control-item": "",
          "data-key": item.key,
          "data-icon-only": iconOnly ? "true" : undefined,
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            if (event.defaultPrevented) return;
            commitKey(item.key, false, event);
          },
          onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "ArrowRight") {
              event.preventDefault();
              move(1, event);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              move(-1, event);
            } else if (event.key === "Home") {
              event.preventDefault();
              moveToEdge("first", event);
            } else if (event.key === "End") {
              event.preventDefault();
              moveToEdge("last", event);
            }
          },
        },
        selected ? React.createElement("span", { className: "segmented-control__indicator", "aria-hidden": "true" }) : null,
        icon
          ? React.createElement("span", { className: "segmented-control__icon", "aria-hidden": "true" }, icon)
          : null,
        React.createElement("span", { className: "segmented-control__label", "aria-hidden": iconOnly ? "true" : undefined }, itemLabel),
      );
    }),
  );
}) as SegmentedControlComponent;

SegmentedControl.displayName = "SegmentedControl";
SegmentedControl.platformContract = segmentedControlPlatformContract;
