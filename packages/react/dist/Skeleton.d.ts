import type { CSSProperties, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { skeletonPlatformContract } from "#flow/platforms";

export type SkeletonVariant = "text" | "title" | "circle" | "card" | "pill" | "row" | "media" | "chart" | "table";
export type SkeletonState = "default" | "loading" | "stale" | "paused" | "loaded" | "disabled";

export interface SkeletonStyle extends CSSProperties {
  "--skeleton-width"?: string;
  "--skeleton-height"?: string;
  "--skeleton-columns"?: number;
}

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  label?: string;
  variant?: SkeletonVariant;
  lines?: number;
  rows?: number;
  columns?: number;
  busy?: boolean;
  state?: SkeletonState;
  fullWidth?: boolean;
  width?: string | number;
  height?: string | number;
  style?: SkeletonStyle;
}

export interface SkeletonComponent extends ForwardRefExoticComponent<SkeletonProps & RefAttributes<HTMLDivElement>> {
  displayName: "Skeleton";
  platformContract: typeof skeletonPlatformContract;
}

export const Skeleton: SkeletonComponent;
