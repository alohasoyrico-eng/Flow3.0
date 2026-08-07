import React, { forwardRef } from "react";
import { createMapsPrimitive } from "#flow/components";
import { stationPinPlatformContract } from "#flow/platforms";
import { flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["fuel", "ev", "service", "cluster"]);
const validStates = new Set(["default", "hover", "focus", "selected", "unavailable", "disabled"]);
const validDensities = new Set(["sm", "md", "lg"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

export const StationPin = forwardRef(function StationPin({
  label,
  value = "",
  meta = "",
  icon = "local_gas_station",
  count,
  variant = "fuel",
  state = "default",
  density,
  selected = false,
  unavailable = false,
  disabled = false,
  className = "",
  onSelect,
  onClick,
  ...rest
}, ref) {
  const resolvedVariant = normalize(variant, validVariants, "fuel");
  const resolvedState = disabled ? "disabled" : unavailable ? "unavailable" : selected ? "selected" : normalize(state, validStates, "default");
  const resolvedDensity = validDensities.has(density) ? density : "";
  const markerCount = count != null || resolvedVariant === "cluster" ? count ?? 6 : null;
  const visibleValue = markerCount != null ? String(markerCount) : value || label || "Station";
  const blocked = resolvedState === "disabled" || resolvedState === "unavailable";
  const mapPrimitive = createMapsPrimitive({
    permission: "granted",
    pins: [{
      label: label ?? visibleValue,
      value: value && value !== label ? value : "",
      meta,
      variant: resolvedVariant,
      state: resolvedState,
      selected: resolvedState === "selected",
      unavailable: resolvedState === "unavailable",
    }],
  });
  const accessibleLabel = mapPrimitive.mapLayerModel.pins[0]?.accessibleLabel ?? String(label ?? visibleValue);

  function handleClick(event) {
    if (blocked) return;
    onSelect?.({ label, value: visibleValue, variant: resolvedVariant, state: resolvedState });
    onClick?.(event);
  }

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: rest.type ?? "button",
      className: ["station-pin", className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      ...flowDensityProps(resolvedDensity),
      "data-map-primitive": "maps",
      disabled: blocked,
      "aria-pressed": resolvedState === "selected" ? "true" : undefined,
      "aria-label": accessibleLabel,
      onClick: handleClick,
    },
    React.createElement(
      "span",
      {
        className: ["station-pin__marker", markerCount == null ? "material-symbol" : ""].filter(Boolean).join(" "),
        "aria-hidden": "true",
        "data-kind": markerCount != null ? "count" : "icon",
      },
      markerCount != null ? String(markerCount) : icon,
    ),
    markerCount == null ? React.createElement("span", { className: "station-pin__value" }, visibleValue) : null,
  );
});

StationPin.displayName = "StationPin";
StationPin.platformContract = stationPinPlatformContract;
