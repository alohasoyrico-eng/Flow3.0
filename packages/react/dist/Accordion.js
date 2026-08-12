import React, { forwardRef, useId, useMemo, useState, } from "react";
import { accordionPlatformContract } from "#flow/platforms";
import { flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["single", "multiple"]);
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
export const Accordion = forwardRef(function Accordion({ items, variant, multiple = false, expandedIds, density, onExpandedChange, className = "", ...rest }, ref) {
    const reactId = useId();
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedVariant = variant && validVariants.has(variant) ? variant : multiple ? "multiple" : "single";
    const allowsMultiple = resolvedVariant === "multiple";
    const normalizedItems = useMemo(() => normalizeItems(items), [items]);
    const isExpandedIdsControlled = expandedIds !== undefined;
    const initialOpenIds = normalizedItems.filter((item) => item.open).map((item) => item.id);
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
        "data-multiple": String(allowsMultiple),
        ...flowDensityProps(resolvedDensity),
    }, normalizedItems.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${reactId}-${item.id}`;
        const triggerId = `${panelId}-trigger`;
        const { id, title, content, open: itemOpen, disabled, icon, meta, onClick, ...itemRest } = item;
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
        }, icon
            ? React.createElement("span", { className: "accordion__icon", "aria-hidden": "true" }, icon)
            : null, title ? React.createElement("span", { className: "accordion__title" }, title) : null, meta ? React.createElement("span", { className: "accordion__meta" }, meta) : null, React.createElement("span", { className: "accordion__chevron", "aria-hidden": "true" }, "expand_more")), React.createElement("div", {
            className: "accordion__panel",
            id: panelId,
            role: "region",
            "data-accordion-panel": "",
            "aria-labelledby": triggerId,
            hidden: !open,
        }, React.createElement("div", { className: "accordion__panel-clip" }, React.createElement("div", { className: "accordion__panel-body" }, renderContent(content)))));
    }));
});
Accordion.displayName = "Accordion";
Accordion.platformContract = accordionPlatformContract;
