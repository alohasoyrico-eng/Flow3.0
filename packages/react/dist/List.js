import React, { forwardRef, useEffect, useId, useState, } from "react";
import { listPlatformContract } from "#flow/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["standard", "compact", "action", "status", "media"]);
const validStates = new Set(["default", "hover", "selected", "loading", "error", "disabled"]);
const validItemTones = new Set(["danger"]);
export const List = forwardRef(function List({ items, interactive = false, label, variant = "standard", state = "default", selectedKey, density, onSelect, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
    const resolvedState = normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    const requestedInteraction = Boolean(interactive || resolvedVariant === "action" || typeof onSelect === "function");
    const isInteractive = requestedInteraction && typeof onSelect === "function";
    const sourceItems = Array.isArray(items) ? items : [];
    const resolvedItems = sourceItems.filter((item) => item?.key !== undefined && item?.key !== null && item?.key !== "" && item?.label);
    const initialSelectedKey = selectedKey ?? resolvedItems.find((item) => item.state === "selected")?.key ?? "";
    const isSelectedKeyControlled = selectedKey !== undefined;
    const [internalSelectedKey, setInternalSelectedKey] = useState(String(initialSelectedKey));
    const currentSelectedKey = isSelectedKeyControlled ? String(selectedKey ?? "") : internalSelectedKey;
    const listId = useId();
    const itemIsDisabled = (item) => {
        const rowState = normalizeFlowValue(item.state ?? resolvedState, validStates, resolvedState);
        return Boolean(item.disabled) || rowState === "disabled" || resolvedState === "disabled";
    };
    const firstEnabledKey = resolvedItems.find((item) => !itemIsDisabled(item))?.key;
    const selectedEnabledKey = resolvedItems.find((item) => String(item.key) === currentSelectedKey && !itemIsDisabled(item))?.key;
    const [activeKey, setActiveKey] = useState(String(selectedEnabledKey ?? firstEnabledKey ?? ""));
    const activeIndex = resolvedItems.findIndex((item) => String(item.key) === activeKey);
    useEffect(() => {
        if (!isInteractive)
            return;
        const activeItem = resolvedItems.find((item) => String(item.key) === activeKey);
        if (activeItem && !itemIsDisabled(activeItem))
            return;
        setActiveKey(String(selectedEnabledKey ?? firstEnabledKey ?? ""));
    }, [activeKey, firstEnabledKey, isInteractive, resolvedItems, selectedEnabledKey]);
    if (!resolvedItems.length)
        return null;
    const optionId = (index) => `${listId}-option-${index}`;
    const moveActive = (direction) => {
        if (!resolvedItems.length)
            return;
        const startIndex = activeIndex >= 0 ? activeIndex : direction > 0 ? -1 : resolvedItems.length;
        for (let offset = 1; offset <= resolvedItems.length; offset += 1) {
            const nextIndex = (startIndex + direction * offset + resolvedItems.length) % resolvedItems.length;
            const item = resolvedItems[nextIndex];
            if (item && !itemIsDisabled(item)) {
                setActiveKey(String(item.key));
                return;
            }
        }
    };
    const setEdgeActive = (edge) => {
        const candidates = edge === "start" ? resolvedItems : [...resolvedItems].reverse();
        const item = candidates.find((candidate) => !itemIsDisabled(candidate));
        if (item)
            setActiveKey(String(item.key));
    };
    const selectActive = (event) => {
        const item = resolvedItems.find((candidate) => String(candidate.key) === activeKey);
        if (!item || itemIsDisabled(item))
            return;
        const key = String(item.key);
        if (!isSelectedKeyControlled)
            setInternalSelectedKey(key);
        onSelect?.(key, event);
    };
    const handleKeyDown = (event) => {
        rest.onKeyDown?.(event);
        if (event.defaultPrevented || !isInteractive)
            return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            moveActive(1);
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            moveActive(-1);
            return;
        }
        if (event.key === "Home") {
            event.preventDefault();
            setEdgeActive("start");
            return;
        }
        if (event.key === "End") {
            event.preventDefault();
            setEdgeActive("end");
            return;
        }
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectActive(event);
            return;
        }
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
            const query = event.key.toLocaleLowerCase();
            const startIndex = activeIndex >= 0 ? activeIndex : -1;
            for (let offset = 1; offset <= resolvedItems.length; offset += 1) {
                const nextIndex = (startIndex + offset) % resolvedItems.length;
                const item = resolvedItems[nextIndex];
                const labelText = typeof item?.label === "string" ? item.label.toLocaleLowerCase() : "";
                if (item && !itemIsDisabled(item) && labelText.startsWith(query)) {
                    event.preventDefault();
                    setActiveKey(String(item.key));
                    return;
                }
            }
        }
    };
    return React.createElement("ul", {
        ...flowRestProps(rest),
        ref,
        className: ["list", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-interactive": String(isInteractive),
        role: isInteractive ? "listbox" : "list",
        "aria-label": label,
        "aria-activedescendant": isInteractive && activeIndex >= 0 ? optionId(activeIndex) : undefined,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        tabIndex: isInteractive ? rest.tabIndex ?? 0 : rest.tabIndex,
        onKeyDown: handleKeyDown,
    }, resolvedItems.map((item, index) => {
        const key = String(item.key);
        const isSelected = currentSelectedKey === key;
        const rowState = normalizeFlowValue(isSelected ? "selected" : item.state ?? resolvedState, validStates, resolvedState);
        const rowTone = normalizeFlowValue(item.tone ?? (rowState === "error" ? "danger" : ""), validItemTones, "");
        const disabled = itemIsDisabled(item);
        const isActive = isInteractive && activeKey === key && !disabled;
        const itemCanInteract = isInteractive;
        const { key: itemKey, label: itemLabel, meta, value, icon, state: itemState, tone, disabled: itemDisabled, onClick, ...itemRest } = item;
        return React.createElement("li", {
            className: "list__row",
            id: isInteractive ? optionId(index) : undefined,
            key,
            role: isInteractive ? "option" : undefined,
            "aria-selected": isInteractive ? String(isSelected) : undefined,
            "aria-disabled": isInteractive && disabled ? "true" : undefined,
            ...(itemCanInteract ? flowRestProps(itemRest) : {}),
            "data-key": itemCanInteract ? key : undefined,
            onMouseEnter: itemCanInteract ? () => {
                if (!disabled)
                    setActiveKey(key);
            } : undefined,
            onClick: itemCanInteract ? (event) => {
                if (disabled)
                    return;
                onClick?.(event);
                if (event.defaultPrevented)
                    return;
                if (!isSelectedKeyControlled)
                    setInternalSelectedKey(key);
                onSelect?.(key, event);
            } : undefined,
        }, React.createElement("span", {
            className: "list__item",
            ...flowStateProps(rowState),
            ...flowToneProps(rowTone || undefined),
            "data-active": isActive ? "true" : undefined,
            "aria-current": rowState === "selected" ? "true" : undefined,
            "aria-busy": rowState === "loading" ? "true" : undefined,
        }, icon
            ? React.createElement("span", { className: "list__icon material-symbol", "aria-hidden": "true" }, icon)
            : null, React.createElement("span", { className: "list__content" }, React.createElement("strong", null, itemLabel), meta ? React.createElement("small", null, meta) : null), value ? React.createElement("span", { className: "list__value" }, value) : null));
    }));
});
List.displayName = "List";
List.platformContract = listPlatformContract;
