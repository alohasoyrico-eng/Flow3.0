import React, { forwardRef, useEffect, useState } from "react";
import { listPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "compact", "action", "status", "media"]);
const validStates = new Set(["default", "hover", "selected", "loading", "error", "disabled"]);
const validItemTones = new Set(["danger"]);

export const List = forwardRef(function List({
  items = [],
  interactive = false,
  label = "",
  variant = "standard",
  state = "default",
  selectedKey,
  density,
  onSelect,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
  const resolvedState = normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const isInteractive = Boolean(interactive || resolvedVariant === "action" || typeof onSelect === "function");
  const initialSelectedKey = selectedKey ?? items.find((item) => item.state === "selected")?.key ?? "";
  const isSelectedKeyControlled = selectedKey !== undefined;
  const [currentSelectedKey, setCurrentSelectedKey] = useState(String(initialSelectedKey));

  useEffect(() => {
    if (isSelectedKeyControlled) setCurrentSelectedKey(String(selectedKey ?? ""));
  }, [isSelectedKeyControlled, selectedKey]);

  return React.createElement(
    "ul",
    {
      ...flowRestProps(rest),
      ref,
      className: ["list", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-interactive": String(isInteractive),
      role: "list",
      "aria-label": label || undefined,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
    },
    items.map((item, index) => {
      const key = String(item.key ?? item.label ?? index);
      const hasStableKey = item.key !== undefined && item.key !== null && item.key !== "";
      const isSelected = currentSelectedKey === key;
      const rowState = normalizeFlowValue(isSelected ? "selected" : item.state ?? resolvedState, validStates, resolvedState);
      const rowTone = normalizeFlowValue(item.tone ?? (rowState === "error" ? "danger" : ""), validItemTones, "");
      const disabled = Boolean(item.disabled) || rowState === "disabled" || resolvedState === "disabled";
      const itemCanInteract = isInteractive && hasStableKey && Boolean(item.label || item.meta || item.value);
      const Control = itemCanInteract ? "button" : "span";
      return React.createElement(
        "li",
        { className: "list__row", key },
        React.createElement(
          Control,
          {
            className: "list__item",
            type: itemCanInteract ? "button" : undefined,
            disabled: itemCanInteract ? disabled : undefined,
            ...flowStateProps(rowState),
            ...flowToneProps(rowTone || undefined),
            "data-key": itemCanInteract ? key : undefined,
            "aria-current": rowState === "selected" ? "true" : undefined,
            "aria-busy": rowState === "loading" ? "true" : undefined,
            onClick: itemCanInteract ? () => {
              if (disabled) return;
              if (!isSelectedKeyControlled) setCurrentSelectedKey(key);
              onSelect?.(key);
            } : undefined,
          },
          item.icon
            ? React.createElement("span", { className: "list__icon material-symbol", "aria-hidden": "true" }, item.icon)
            : null,
          React.createElement(
            "span",
            { className: "list__content" },
            item.label ? React.createElement("strong", null, item.label) : null,
            item.meta ? React.createElement("small", null, item.meta) : null,
          ),
          item.value ? React.createElement("span", { className: "list__value" }, item.value) : null,
        ),
      );
    }),
  );
});

List.displayName = "List";
List.platformContract = listPlatformContract;
