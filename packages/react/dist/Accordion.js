import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import { accordionPlatformContract } from "#flow/platforms";
import { flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["single", "multiple"]);

function hasStableItemId(item) {
  return item?.id !== undefined && item?.id !== null && item?.id !== "";
}

function normalizeItems(items) {
  const sourceItems = Array.isArray(items) ? items : [];
  return sourceItems.filter((item) => (item?.title || item?.label) && hasStableItemId(item)).map((item) => ({
    ...item,
    id: String(item.id),
    title: item.title ?? item.label ?? "",
    ariaLabel: item.ariaLabel ?? item["aria-label"],
    content: item.content ?? item.description ?? "",
    open: Boolean(item.open),
  }));
}

function renderContent(content) {
  if (React.isValidElement(content)) return content;
  if (Array.isArray(content)) return content;
  return String(content ?? "");
}

export const Accordion = forwardRef(function Accordion({
  items = [],
  variant,
  multiple = false,
  expandedIds,
  density,
  onExpandedChange,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedVariant = validVariants.has(variant) ? variant : multiple ? "multiple" : "single";
  const allowsMultiple = resolvedVariant === "multiple";
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const isExpandedIdsControlled = expandedIds !== undefined;
  const initialOpenIds = normalizedItems.filter((item) => item.open).map((item) => item.id);
  const [openIds, setOpenIds] = useState(() => {
    const initialIds = expandedIds ?? initialOpenIds;
    return allowsMultiple ? initialIds : initialIds.slice(0, 1);
  });

  useEffect(() => {
    if (!isExpandedIdsControlled) return;
    const nextIds = expandedIds ?? [];
    setOpenIds(allowsMultiple ? nextIds : nextIds.slice(0, 1));
  }, [allowsMultiple, expandedIds, isExpandedIdsControlled]);

  const setItemOpen = (item, open) => {
    if (item.disabled) return;
    const next = open
      ? allowsMultiple
        ? [...new Set([...openIds, item.id])]
        : [item.id]
      : openIds.filter((id) => id !== item.id);
    if (!isExpandedIdsControlled) setOpenIds(next);
    onExpandedChange?.(next);
  };

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["accordion", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      "data-multiple": String(allowsMultiple),
      ...flowDensityProps(resolvedDensity),
    },
    normalizedItems.map((item, index) => {
      const open = openIds.includes(item.id);
      const panelId = `${reactId}-${item.id}`;
      const triggerId = `${panelId}-trigger`;
      return React.createElement(
        "section",
        {
          key: item.id,
          className: "accordion__item",
          "data-accordion-item": "",
          "data-open": String(open),
        },
        React.createElement(
          "button",
          {
            type: "button",
            className: "accordion__trigger",
            id: triggerId,
            disabled: Boolean(item.disabled),
            "data-accordion-trigger": "",
            "aria-expanded": String(open),
            "aria-controls": panelId,
            "aria-label": item.title ? undefined : item.ariaLabel || undefined,
            onClick: () => setItemOpen(item, !open),
          },
          item.icon
            ? React.createElement("span", { className: "accordion__icon", "aria-hidden": "true" }, item.icon)
            : null,
          item.title ? React.createElement("span", { className: "accordion__title" }, item.title) : null,
          item.meta ? React.createElement("span", { className: "accordion__meta" }, item.meta) : null,
          React.createElement("span", { className: "accordion__chevron", "aria-hidden": "true" }, "expand_more"),
        ),
        React.createElement(
          "div",
          {
            className: "accordion__panel",
            id: panelId,
            role: "region",
            "data-accordion-panel": "",
            "aria-labelledby": triggerId,
            hidden: !open,
          },
          React.createElement(
            "div",
            { className: "accordion__panel-clip" },
            React.createElement("div", { className: "accordion__panel-body" }, renderContent(item.content)),
          ),
        ),
      );
    }),
  );
});

Accordion.displayName = "Accordion";
Accordion.platformContract = accordionPlatformContract;
