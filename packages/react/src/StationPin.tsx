import React, { forwardRef } from "react";
import { createMapsPrimitive } from "@design-system/components";
import { stationPinPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ButtonHTMLAttributes, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type StationPinVariant = "fuel" | "ev" | "service" | "cluster";
export type StationPinState = "default" | "hover" | "focus" | "selected" | "unavailable" | "disabled";
export type StationPinDensity = FlowDensity;

export interface StationPinMeta {
  label: string;
  value: string;
  variant: StationPinVariant;
  state: StationPinState;
}

export interface StationPinProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable" | "onSelect">, FlowDataAttributes {
  label: string;
  value?: string;
  meta?: string;
  icon?: string;
  count?: number;
  variant?: StationPinVariant;
  state?: StationPinState;
  density?: StationPinDensity;
  selected?: boolean;
  unavailable?: boolean;
  disabled?: boolean;
  onSelect?: (meta: StationPinMeta, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface StationPinComponent extends ForwardRefExoticComponent<StationPinProps & RefAttributes<HTMLButtonElement>> {
  displayName: "StationPin";
  platformContract: typeof stationPinPlatformContract;
}

const validVariants = new Set<StationPinVariant>(["fuel", "ev", "service", "cluster"]);
const validStates = new Set<StationPinState>(["default", "hover", "focus", "selected", "unavailable", "disabled"]);

export const StationPin = forwardRef<HTMLButtonElement, StationPinProps>(function StationPin({
  label,
  value = "",
  meta,
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
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "fuel");
  const resolvedState = disabled ? "disabled" : unavailable ? "unavailable" : selected ? "selected" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const markerCount = count != null || resolvedVariant === "cluster" ? count ?? 6 : null;
  if (!label) return null;
  const visibleValue = markerCount != null ? String(markerCount) : value || label;
  const blocked = resolvedState === "disabled" || resolvedState === "unavailable";
  const mapPin = {
      label,
      ...(value && value !== label ? { value } : {}),
      ...(meta ? { meta } : {}),
      variant: resolvedVariant,
      state: resolvedState,
      selected: resolvedState === "selected",
      unavailable: resolvedState === "unavailable",
  };
  const mapPrimitive = createMapsPrimitive({
    permission: "granted",
    pins: [mapPin],
  });
  const accessibleLabel = mapPrimitive.mapLayerModel.pins[0]?.accessibleLabel ?? String(label);
  if (!accessibleLabel) return null;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (blocked) return;
    onClick?.(event);
    if (event.defaultPrevented) return;
    onSelect?.({ label, value: visibleValue, variant: resolvedVariant, state: resolvedState }, event);
  }

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: rest.type ?? "button",
      className: ["station-pin", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
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
    markerCount == null && visibleValue ? React.createElement("span", { className: "station-pin__value" }, visibleValue) : null,
  );
}) as StationPinComponent;

StationPin.displayName = "StationPin";
StationPin.platformContract = stationPinPlatformContract;
