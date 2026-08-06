import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import type { stationPinPlatformContract } from "../../components/src/platforms/index.js";

export type StationPinVariant = "fuel" | "ev" | "service" | "cluster";
export type StationPinState = "default" | "hover" | "focus" | "selected" | "unavailable" | "disabled";
export type StationPinDensity = "sm" | "md" | "lg";

export interface StationPinMeta {
  label?: string;
  value?: string;
  variant?: StationPinVariant;
  state?: StationPinState;
}

export interface StationPinProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  onSelect?: (meta: StationPinMeta) => void;
}

export interface StationPinComponent extends ForwardRefExoticComponent<StationPinProps & RefAttributes<HTMLButtonElement>> {
  displayName: "StationPin";
  platformContract: typeof stationPinPlatformContract;
}

export const StationPin: StationPinComponent;
