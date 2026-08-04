import React, { forwardRef } from "react";
import { buttonPlatformContract } from "@design-system/components/platforms";

const allowedTypes = new Set(["button", "submit", "reset"]);

function spinnerNode(label) {
  return React.createElement(
    "span",
    {
      className: "spinner",
      "data-density": "sm",
      "data-tone": "accent",
      "data-state": "loading",
      "aria-hidden": "true",
    },
    React.createElement(
      "svg",
      {
        className: "spinner__svg",
        viewBox: "0 0 40 40",
        focusable: "false",
        "aria-hidden": "true",
      },
      React.createElement("circle", { className: "spinner__track", cx: "20", cy: "20", r: "16", pathLength: "100" }),
      React.createElement("circle", { className: "spinner__arc", cx: "20", cy: "20", r: "16", pathLength: "100" }),
    ),
  );
}

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
      ...rest,
      ref,
      type: allowedTypes.has(type) ? type : "button",
      className: buttonClassName({ variant, intent, className }),
      disabled: resolvedState === "disabled" || resolvedState === "loading",
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-density": density || undefined,
      "data-state": resolvedState,
      "data-full-width": String(Boolean(fullWidth)),
    },
    resolvedState !== "loading" && icon
      ? React.createElement("span", { className: "button__icon", "aria-hidden": "true" }, icon)
      : null,
    resolvedState === "loading"
      ? spinnerNode(`${label ?? "Button"} loading`)
      : null,
    React.createElement("span", { className: "button__label" }, buttonLabel),
    resolvedState !== "loading" && trailingIcon
      ? React.createElement("span", { className: "button__icon button__icon--trailing", "aria-hidden": "true" }, trailingIcon)
      : null,
  );
});

Button.displayName = "Button";
Button.platformContract = buttonPlatformContract;
