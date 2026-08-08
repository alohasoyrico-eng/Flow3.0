import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { skeletonPlatformContract } from "#flow/platforms";

export type SkeletonVariant = "text" | "title" | "circle" | "card" | "pill" | "row" | "media" | "chart" | "table";
export type SkeletonState = "default" | "loading" | "stale" | "paused" | "loaded" | "disabled";
export type SkeletonDensity = "sm" | "md" | "lg";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  variant?: SkeletonVariant;
  density?: SkeletonDensity;
  lines?: number;
  rows?: number;
  columns?: number;
  busy?: boolean;
  state?: SkeletonState;
  fullWidth?: boolean;
  width?: string | number;
  height?: string | number;
}

export interface SkeletonComponent extends ForwardRefExoticComponent<SkeletonProps & RefAttributes<HTMLDivElement>> {
  displayName: "Skeleton";
  platformContract: typeof skeletonPlatformContract;
}

export const Skeleton: SkeletonComponent;
