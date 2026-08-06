import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { spinnerPlatformContract } from "../../components/src/platforms/index.js";

export type SpinnerDensity = "sm" | "md" | "lg";
export type SpinnerTone = "accent" | "ink" | "success" | "warning" | "danger";
export type SpinnerState = "default" | "loading" | "decorative" | "subtle" | "disabled";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
  density?: SpinnerDensity;
  tone?: SpinnerTone;
  state?: SpinnerState;
  decorative?: boolean;
}

export interface SpinnerComponent extends ForwardRefExoticComponent<SpinnerProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Spinner";
  platformContract: typeof spinnerPlatformContract;
}

export const Spinner: SpinnerComponent;
