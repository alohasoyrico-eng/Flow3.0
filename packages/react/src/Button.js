import React, { forwardRef } from "react";
import { buttonPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowDensityProps, flowRestProps } from "./internal/props.js";

const allowedTypes = new Set(["button", "submit", "reset"]);

function buttonClassName({ variant = "primary", intent = "default", className = "" } = {}) {
  return [
    "button",
    `button--${variant}`,
    intent !== "default" ? `button--${intent}` : "",
    className,
  ].filter(Boolean).join(" ");
}

export const Button = forwardRef(function Button({
  label,
  children,
  variant = "primary",
  intent = "default",
  density,
  state = "default",
  disabled = false,
  loading = false,
  icon,
  trailingIcon,
  fullWidth = false,
  type = "button",
  className = "",
  ...rest
}, ref) {
  const resolvedState = loading || state === "loading" ? "loading" : disabled || state === "disabled" ? "disabled" : state;
  const buttonLabel = children ?? label ?? "Button";

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: allowedTypes.has(type) ? type : "button",
      className: buttonClassName({ variant, intent, className }),
      disabled: resolvedState === "disabled" || resolvedState === "loading",
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      ...flowDensityProps(density),
      "data-state": resolvedState,
      "data-full-width": String(Boolean(fullWidth)),
    },
    resolvedState !== "loading" && icon
      ? React.createElement("span", { className: "button__icon", "aria-hidden": "true" }, icon)
      : null,
    resolvedState === "loading"
      ? React.createElement(Spinner, { label: `${label ?? "Button"} loading`, density, decorative: true })
      : null,
    React.createElement("span", { className: "button__label" }, buttonLabel),
    resolvedState !== "loading" && trailingIcon
      ? React.createElement("span", { className: "button__icon button__icon--trailing", "aria-hidden": "true" }, trailingIcon)
      : null,
  );
});

Button.displayName = "Button";
Button.platformContract = buttonPlatformContract;
