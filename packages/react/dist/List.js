import React, { forwardRef, useEffect, useState } from "react";
import { listPlatformContract } from "#flow/platforms";
import { flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "compact", "action", "status", "media"]);
const validStates = new Set(["default", "hover", "selected", "loading", "error", "disabled"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

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
  const resolvedVariant = normalize(variant, validVariants, "standard");
  const resolvedState = normalize(state, validStates, "default");
  const resolvedDensity = validDensities.has(density) ? density : "";
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
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity || undefined,
      "data-interactive": String(isInteractive),
      role: "list",
      "aria-label": label || undefined,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
    },
    items.map((item, index) => {
      const key = String(item.key ?? item.label ?? index);
      const isSelected = currentSelectedKey === key;
      const rowState = normalize(isSelected ? "selected" : item.state ?? resolvedState, validStates, resolvedState);
      const rowTone = item.tone ?? (rowState === "error" ? "danger" : "");
      const disabled = Boolean(item.disabled) || rowState === "disabled" || resolvedState === "disabled";
      const Control = isInteractive ? "button" : "span";
      return React.createElement(
        "li",
        { className: "list__row", key },
        React.createElement(
          Control,
          {
            className: "list__item",
            type: isInteractive ? "button" : undefined,
            disabled: isInteractive ? disabled : undefined,
            "data-state": rowState,
            "data-tone": rowTone || undefined,
            "data-key": isInteractive ? key : undefined,
            "aria-current": rowState === "selected" ? "true" : undefined,
            "aria-busy": rowState === "loading" ? "true" : undefined,
            onClick: isInteractive ? () => {
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
            React.createElement("strong", null, rowState === "loading" ? "Loading item" : item.label ?? "List item"),
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
