import React, { forwardRef } from "react";
import { iconButtonPlatformContract } from "#flow/platforms";
import { flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const allowedTypes = new Set(["button", "submit", "reset"]);
function iconButtonClassName({ variant = "ghost", className = "" } = {}) {
    return ["icon-button", `icon-button--${variant}`, className].filter(Boolean).join(" ");
}
export const IconButton = forwardRef(function IconButton({ ariaLabel, label, icon = "more_horiz", variant = "ghost", density, selected = false, badge = false, disabled = false, type = "button", className = "", ...rest }, ref) {
    const resolvedLabel = ariaLabel ?? label;
    if (!resolvedLabel)
        return null;
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("button", {
        ...flowRestProps(rest),
        ref,
        type: allowedTypes.has(type) ? type : "button",
        className: iconButtonClassName({ variant, className }),
        disabled,
        "aria-label": resolvedLabel,
        "aria-pressed": selected ? "true" : undefined,
        ...flowDensityProps(resolvedDensity),
    }, React.createElement("span", { className: "icon-button__icon", "aria-hidden": "true" }, icon), badge ? React.createElement("span", { className: "icon-button__badge", "aria-hidden": "true" }) : null);
});
IconButton.displayName = "IconButton";
IconButton.platformContract = iconButtonPlatformContract;
