/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useId, useMemo, useState, } from "react";
import { accordionPlatformContract } from "@design-system/components/platforms";
import { flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["single", "multiple"]);
const validSurfaces = new Set(["solid", "transparent"]);
const hasStableItemId = function hasStableItemId(item) {
    return item?.id !== undefined && item?.id !== null && item?.id !== "";
};
function normalizeItems(items) {
    const sourceItems = Array.isArray(items) ? items : [];
    return sourceItems.filter((item) => item?.title && item?.content !== undefined && item?.content !== null && hasStableItemId(item)).map((item) => ({
        ...item,
        id: String(item.id),
        title: item.title,
        content: item.content,
        open: Boolean(item.open),
    }));
}
function renderContent(content) {
    if (content === undefined || content === null)
        return null;
    if (React.isValidElement(content))
        return content;
    if (Array.isArray(content))
        return content;
    return String(content);
}
function focusAccordionTrigger(event, target) {
    const root = event.currentTarget.closest(".accordion");
    if (!root)
        return;
    const triggers = Array.from(root.querySelectorAll("[data-accordion-trigger]")).filter((trigger) => !trigger.disabled);
    if (!triggers.length)
        return;
    const currentIndex = triggers.indexOf(event.currentTarget);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = target === "first" ? 0 :
        target === "last" ? triggers.length - 1 :
            target === "next" ? (safeIndex + 1) % triggers.length :
                (safeIndex - 1 + triggers.length) % triggers.length;
    triggers[nextIndex]?.focus();
}
export const Accordion = forwardRef(function Accordion({ items, variant, surface = "solid", defaultOpen, multiple = false, expandedIds, density, onExpandedChange, className = "", ...rest }, ref) {
    const reactId = useId();
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedVariant = variant && validVariants.has(variant) ? variant : multiple ? "multiple" : "single";
    const resolvedSurface = surface && validSurfaces.has(surface) ? surface : "solid";
    const allowsMultiple = resolvedVariant === "multiple";
    const normalizedItems = useMemo(() => normalizeItems(items), [items]);
    const isExpandedIdsControlled = expandedIds !== undefined;
    const defaultOpenIds = defaultOpen ? [String(defaultOpen)] : [];
    const itemOpenIds = normalizedItems.filter((item) => item.open).map((item) => item.id);
    const initialOpenIds = defaultOpenIds.length ? defaultOpenIds : itemOpenIds;
    const [internalOpenIds, setInternalOpenIds] = useState(() => {
        const initialIds = expandedIds ?? initialOpenIds;
        return allowsMultiple ? initialIds : initialIds.slice(0, 1);
    });
    const controlledOpenIds = Array.isArray(expandedIds) ? expandedIds.map(String) : [];
    const openIds = isExpandedIdsControlled
        ? allowsMultiple ? controlledOpenIds : controlledOpenIds.slice(0, 1)
        : internalOpenIds;
    const setItemOpen = (item, open, event) => {
        if (item.disabled)
            return;
        const next = open
            ? allowsMultiple
                ? [...new Set([...openIds, item.id])]
                : [item.id]
            : openIds.filter((id) => id !== item.id);
        if (!isExpandedIdsControlled)
            setInternalOpenIds(next);
        onExpandedChange?.(next, event);
    };
    if (!normalizedItems.length)
        return null;
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        className: ["accordion", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        "data-surface": resolvedSurface,
        "data-multiple": String(allowsMultiple),
        ...flowDensityProps(resolvedDensity),
    }, normalizedItems.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${reactId}-${item.id}`;
        const triggerId = `${panelId}-trigger`;
        const { id, title, content, open: itemOpen, disabled, icon, meta, onClick, onKeyDown, ...itemRest } = item;
        return React.createElement("section", {
            key: item.id,
            className: "accordion__item",
            "data-accordion-item": "",
            "data-open": String(open),
        }, React.createElement("button", {
            ...itemRest,
            type: "button",
            className: "accordion__trigger",
            id: triggerId,
            disabled: Boolean(disabled),
            "data-accordion-trigger": "",
            "aria-expanded": String(open),
            "aria-controls": panelId,
            onClick: (event) => {
                onClick?.(event);
                if (event.defaultPrevented)
                    return;
                setItemOpen(item, !open, event);
            },
            onKeyDown: (event) => {
                onKeyDown?.(event);
                if (event.defaultPrevented)
                    return;
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusAccordionTrigger(event, "next");
                }
                else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusAccordionTrigger(event, "previous");
                }
                else if (event.key === "Home") {
                    event.preventDefault();
                    focusAccordionTrigger(event, "first");
                }
                else if (event.key === "End") {
                    event.preventDefault();
                    focusAccordionTrigger(event, "last");
                }
                else if (event.key === "Escape" && open) {
                    event.preventDefault();
                    setItemOpen(item, false, event);
                }
            },
        }, icon
            ? React.createElement("span", { className: "accordion__icon", "aria-hidden": "true" }, icon)
            : null, title ? React.createElement("span", { className: "accordion__title" }, title) : null, meta ? React.createElement("span", { className: "accordion__meta" }, meta) : null, React.createElement("span", { className: "accordion__chevron", "aria-hidden": "true" }, "expand_more")), React.createElement("div", {
            className: "accordion__panel",
            id: panelId,
            role: "region",
            "data-accordion-panel": "",
            "data-open": String(open),
            "aria-labelledby": triggerId,
            "aria-hidden": String(!open),
            ...(!open ? { inert: "" } : {}),
        }, React.createElement("div", { className: "accordion__panel-clip" }, React.createElement("div", { className: "accordion__panel-body" }, renderContent(content)))));
    }));
});
Accordion.displayName = "Accordion";
Accordion.platformContract = accordionPlatformContract;
