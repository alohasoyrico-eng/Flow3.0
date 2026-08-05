import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { kpiTilePlatformContract } from "@design-system/components/platforms";

export type KpiTileVariant = "standard" | "delta" | "threshold" | "sparkline" | "drill-in";
export type KpiTileState = "default" | "hover" | "focus" | "selected" | "loading" | "risk" | "disabled";
export type KpiTileDensity = "sm" | "md" | "lg";
export type KpiTileTone = "neutral" | "info" | "success" | "warning" | "danger";
export type KpiTileTrend = "up" | "down" | "flat";

export interface KpiTileMeta {
  label?: string;
  value?: string;
  delta?: string;
  tone: KpiTileTone;
  variant: KpiTileVariant;
}

export interface KpiTileProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  label?: string;
  value?: string;
  delta?: string;
  trend?: KpiTileTrend;
  tone?: KpiTileTone;
  icon?: string;
  variant?: KpiTileVariant;
  state?: KpiTileState;
  density?: KpiTileDensity;
  values?: number[];
  href?: string;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  onSelect?: (metric: KpiTileMeta) => void;
}

export interface KpiTileComponent extends ForwardRefExoticComponent<KpiTileProps & RefAttributes<HTMLElement>> {
  platformContract: typeof kpiTilePlatformContract;
}

export const KpiTile: KpiTileComponent;
