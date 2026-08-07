import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { popoverPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { Input } from "./Input.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["information", "action", "form", "metric"]);
const validStates = new Set(["default", "closed", "open", "hover", "focus", "warning", "disabled"]);
const validPlacements = new Set(["top", "right", "bottom", "left"]);

function slug(value) {
  return String(value ?? "popover").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const Popover = forwardRef(function Popover({
  triggerLabel = "",
  triggerAriaLabel,
  popoverAriaLabel,
  title = "",
  description = "",
  id = "",
  open: openProp,
  variant = "information",
  state = "default",
  placement = "bottom",
  density,
  fullWidth = false,
  disabled = false,
  actions = [],
  field,
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef(null);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "information");
  const resolvedPlacement = normalizeFlowValue(placement, validPlacements, "bottom");
  const resolvedDensity = normalizeFlowDensity(density);
  const initialState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || ["open", "focus", "warning"].includes(initialState);
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? "open" : initialState);
  const panelId = id || `popover-${slug(triggerLabel)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedActions = actions;
  const isDisabled = disabled || interactionState === "disabled";

  useEffect(() => {
    if (!isOpenControlled) return;
    const normalizedOpen = Boolean(openProp);
    setInteractionState(normalizedOpen ? "open" : initialState);
  }, [openProp, initialState, isOpenControlled]);

  const setOpen = (nextOpen, { restoreFocus = false } = {}) => {
    if (isDisabled) return;
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const closeFromKeyboard = (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    setOpen(false, { restoreFocus: true });
  };

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["popover", className].filter(Boolean).join(" "),
      "data-open": String(Boolean(isOpen)),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(isDisabled ? "disabled" : interactionState),
      "data-placement": resolvedPlacement,
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
    },
    React.createElement(Button, {
      ref: triggerRef,
      label: triggerLabel,
      variant: resolvedVariant === "metric" ? "tertiary" : "secondary",
      density: resolvedDensity,
      trailingIcon: isOpen ? "expand_less" : "expand_more",
      disabled: isDisabled,
      fullWidth,
      className: "popover__trigger",
      "data-popover-trigger": "",
      "aria-label": triggerLabel ? undefined : triggerAriaLabel,
      "aria-haspopup": "dialog",
      "aria-expanded": String(Boolean(isOpen)),
      "aria-controls": panelId,
      onClick: () => setOpen(!isOpen),
      onKeyDown: closeFromKeyboard,
    }),
    React.createElement(
      "section",
      {
        className: "popover__panel",
        hidden: !isOpen,
        id: panelId,
        role: "dialog",
        "aria-label": popoverAriaLabel || title || triggerLabel || undefined,
        onKeyDown: closeFromKeyboard,
      },
      title ? React.createElement("strong", null, title) : null,
      description ? React.createElement("p", null, description) : null,
      resolvedVariant === "form"
        ? React.createElement(Input, {
          label: field?.label ?? "",
          value: field?.value ?? "",
          placeholder: field?.placeholder ?? "",
          helper: field?.helper ?? "",
          density: resolvedDensity,
          readOnly: true,
        })
        : null,
      resolvedActions.length
        ? React.createElement(
          "footer",
          { className: "popover__actions" },
          resolvedActions.filter((action) => action?.label).map((action) => {
            const actionLabel = action.label;
            return React.createElement(Button, {
              ...action,
              key: action.key ?? actionLabel,
              label: actionLabel,
              density: action.density ?? resolvedDensity,
              variant: action.variant ?? "secondary",
              "data-popover-action": "",
              "data-key": action.key ?? actionLabel,
              onClick: (event) => {
                action.onClick?.(event);
                onAction?.(action.key ?? actionLabel);
                setOpen(false, { restoreFocus: true });
              },
            });
          }),
        )
        : null,
    ),
  );
});

Popover.displayName = "Popover";
Popover.platformContract = popoverPlatformContract;
