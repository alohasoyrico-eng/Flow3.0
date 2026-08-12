import React, { forwardRef } from "react";
import type { CSSProperties, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { skeletonPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type SkeletonVariant = "text" | "title" | "circle" | "card" | "pill" | "row" | "media" | "chart" | "table";
export type SkeletonState = "default" | "loading" | "stale" | "paused" | "loaded" | "disabled";
export type SkeletonDensity = "sm" | "md" | "lg";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
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

type SkeletonStyle = CSSProperties & Partial<Record<
  | "--comp-skeleton-bone-current-block-size"
  | "--comp-skeleton-bone-current-radius"
  | "--comp-skeleton-bone-current-inline-size"
  | "--comp-skeleton-current-width"
  | "--comp-skeleton-current-height"
  | "--comp-skeleton-current-columns",
  string | number
>>;

const validVariants = new Set<SkeletonVariant>(["text", "title", "circle", "card", "pill", "row", "media", "chart", "table"]);
const validStates = new Set<SkeletonState>(["default", "loading", "stale", "paused", "loaded", "disabled"]);
const singleBoneVariants = new Set<SkeletonVariant>(["circle", "pill", "title"]);

function normalizeVariant(variant: SkeletonVariant | undefined): SkeletonVariant {
  return variant && validVariants.has(variant) ? variant : "text";
}

function normalizeState(state: SkeletonState | undefined): SkeletonState {
  return state && validStates.has(state) ? state : "loading";
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function toCssLength(value: string | number | undefined): string | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : String(value);
}

function cleanStyle(style: SkeletonStyle): SkeletonStyle {
  return Object.fromEntries(Object.entries(style).filter(([, value]) => value !== undefined)) as SkeletonStyle;
}

function hasStyle(style: SkeletonStyle): boolean {
  return Object.keys(style).length > 0;
}

function skeletonBoneStyle({ resolvedVariant, index, boneCount }: { resolvedVariant: SkeletonVariant; index: number; boneCount: number }): SkeletonStyle {
  const style: SkeletonStyle = {};
  if (index === 0) {
    if (resolvedVariant === "card") {
      style["--comp-skeleton-bone-current-block-size"] = "var(--comp-skeleton-card-block-size)";
      style["--comp-skeleton-bone-current-radius"] = "var(--comp-skeleton-card-radius)";
    }
    if (resolvedVariant === "media") {
      style["--comp-skeleton-bone-current-block-size"] = "var(--comp-skeleton-media-block-size)";
      style["--comp-skeleton-bone-current-radius"] = "var(--comp-skeleton-card-radius)";
    }
    if (resolvedVariant === "chart") {
      style["--comp-skeleton-bone-current-block-size"] = "var(--comp-skeleton-chart-block-size)";
      style["--comp-skeleton-bone-current-radius"] = "var(--comp-skeleton-card-radius)";
    }
    if (resolvedVariant === "row") {
      style["--comp-skeleton-bone-current-block-size"] = "var(--comp-skeleton-circle-width)";
    }
  }
  if (index === 1 && ["text", "card", "media", "chart"].includes(resolvedVariant)) {
    style["--comp-skeleton-bone-current-inline-size"] = "var(--comp-skeleton-line-compact-inline)";
  }
  if (boneCount > 1 && index === boneCount - 1 && ["text", "card", "media", "chart"].includes(resolvedVariant)) {
    style["--comp-skeleton-bone-current-inline-size"] = "var(--comp-skeleton-line-short-inline)";
  }
  return cleanStyle(style);
}

function skeletonCellStyle({ rowIndex, columnIndex, columnCount }: { rowIndex: number; columnIndex: number; columnCount: number }): SkeletonStyle {
  const style: SkeletonStyle = {};
  if (rowIndex === 0) style["--comp-skeleton-bone-current-block-size"] = "var(--comp-skeleton-table-header-block-size)";
  if (rowIndex % 2 === 1 && columnIndex === columnCount - 1) {
    style["--comp-skeleton-bone-current-inline-size"] = "var(--comp-skeleton-cell-short-inline)";
  }
  if (rowIndex % 2 === 0 && columnIndex === 1) {
    style["--comp-skeleton-bone-current-inline-size"] = "var(--comp-skeleton-cell-medium-inline)";
  }
  return cleanStyle(style);
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({
  label,
  variant = "text",
  density,
  lines = 3,
  rows,
  columns = 4,
  busy = true,
  state,
  fullWidth = false,
  width = "",
  height = "",
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeState(state ?? (busy ? "loading" : "loaded"));
  const rowCount = clampNumber(rows ?? lines, 1, 8, 3);
  const columnCount = clampNumber(columns, 2, 6, 4);
  const isBusy = Boolean(busy) && !["loaded", "disabled"].includes(resolvedState);
  const style: SkeletonStyle = {};
  const currentWidth = toCssLength(width);
  const currentHeight = toCssLength(height);
  if (currentWidth) style["--comp-skeleton-current-width"] = currentWidth;
  if (currentHeight) style["--comp-skeleton-current-height"] = currentHeight;
  if (resolvedVariant === "table") style["--comp-skeleton-current-columns"] = columnCount;
  const boneCount = singleBoneVariants.has(resolvedVariant) ? 1 : clampNumber(lines, 1, 6, 3);
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["skeleton", `skeleton--${resolvedVariant}`, className].filter(Boolean).join(" "),
      role: "status",
      "aria-busy": String(isBusy),
      "aria-label": label,
      ...flowVariantProps(resolvedVariant),
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(resolvedState),
      "data-full-width": String(Boolean(fullWidth)),
      "data-rows": resolvedVariant === "table" ? String(rowCount) : undefined,
      "data-columns": resolvedVariant === "table" ? String(columnCount) : undefined,
      style: hasStyle(style) ? style : undefined,
    },
    resolvedVariant === "table"
      ? Array.from({ length: rowCount }, (_, rowIndex) => React.createElement(
        "span",
        { key: `row-${rowIndex}`, className: "skeleton__row", "aria-hidden": "true" },
        Array.from({ length: columnCount }, (_, columnIndex) => {
          const cellStyle = skeletonCellStyle({ rowIndex, columnIndex, columnCount });
          return React.createElement("span", {
            key: `cell-${rowIndex}-${columnIndex}`,
            className: "skeleton__bone skeleton__cell",
            "aria-hidden": "true",
            style: hasStyle(cellStyle) ? cellStyle : undefined,
          });
        }),
      ))
      : Array.from({ length: boneCount }, (_, index) => {
        const boneStyle = skeletonBoneStyle({ resolvedVariant, index, boneCount });
        return React.createElement("span", {
          key: `bone-${index}`,
          className: "skeleton__bone",
          "aria-hidden": "true",
          style: hasStyle(boneStyle) ? boneStyle : undefined,
        });
      }),
  );
}) as SkeletonComponent;

Skeleton.displayName = "Skeleton";
Skeleton.platformContract = skeletonPlatformContract;
