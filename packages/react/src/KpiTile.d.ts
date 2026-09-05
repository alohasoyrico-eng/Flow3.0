import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { kpiTilePlatformContract } from "@design-system/components/platforms";

export type KpiTileVariant = "standard" | "compact" | "delta" | "threshold" | "sparkline" | "drill-in";
export type KpiTileState = "default" | "hover" | "focus" | "pressed" | "selected" | "loading" | "risk" | "disabled";
export type KpiTileDensity = "sm" | "md" | "lg";
export type KpiTileTone = "neutral" | "info" | "success" | "warning" | "danger";
export type KpiTileTrend = "up" | "down" | "flat";

export interface KpiTileMeta {
  label: string;
  value: string;
  delta?: string;
  tone: KpiTileTone;
  variant: KpiTileVariant;
}
export type KpiTileSelectEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface KpiTileProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value: string;
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
  onSelect?: (metric: KpiTileMeta, event: KpiTileSelectEvent) => void;
}

export interface KpiTileComponent extends ForwardRefExoticComponent<KpiTileProps & RefAttributes<HTMLElement>> {
  displayName: "KpiTile";
  platformContract: typeof kpiTilePlatformContract;
}

export const KpiTile: KpiTileComponent;
