import React, { forwardRef, useId, useMemo, useState } from "react";
import { accordionPlatformContract } from "@design-system/components/platforms";

const validDensities = new Set(["sm", "md", "lg"]);

function normalizeDensity(density) {
  return validDensities.has(density) ? density : undefined;
}

function normalizeItems(items) {
  const sourceItems = Array.isArray(items) && items.length ? items : [{ title: "Section 1", content: "" }];
  return sourceItems.map((item, index) => ({
    ...item,
    id: item.id || `accordion-panel-${index}`,
    title: item.title ?? item.label ?? `Section ${index + 1}`,
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
  multiple = false,
  density,
  onExpandedChange,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const resolvedDensity = normalizeDensity(density);
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const initialOpenIds = normalizedItems.filter((item) => item.open).map((item) => item.id);
  const [openIds, setOpenIds] = useState(() => multiple ? initialOpenIds : initialOpenIds.slice(0, 1));

  const setItemOpen = (item, open) => {
    if (item.disabled) return;
    setOpenIds((current) => {
      const next = open
        ? multiple
          ? [...new Set([...current, item.id])]
          : [item.id]
        : current.filter((id) => id !== item.id);
      onExpandedChange?.(next);
      return next;
    });
  };

  return React.createElement(
    "div",
    {
      ...rest,
      ref,
      className: ["accordion", className].filter(Boolean).join(" "),
      "data-multiple": String(Boolean(multiple)),
      "data-density": resolvedDensity,
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
            onClick: () => setItemOpen(item, !open),
          },
          item.icon
            ? React.createElement("span", { className: "accordion__icon", "aria-hidden": "true" }, item.icon)
            : null,
          React.createElement("span", { className: "accordion__title" }, item.title),
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
