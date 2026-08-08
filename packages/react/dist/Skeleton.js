import React, { forwardRef } from "react";
import { skeletonPlatformContract } from "#flow/platforms";
import { flowStateProps, flowVariantProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["text", "title", "circle", "card", "pill", "row", "media", "chart", "table"]);
const validStates = new Set(["default", "loading", "stale", "paused", "loaded", "disabled"]);
const singleBoneVariants = new Set(["circle", "pill", "title"]);

function normalizeVariant(variant) {
  return validVariants.has(variant) ? variant : "text";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "loading";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function toCssLength(value) {
  if (value === "" || value === null || value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : String(value);
}

export const Skeleton = forwardRef(function Skeleton({
  label,
  variant = "text",
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
  const style = {
    "--skeleton-width": toCssLength(width),
    "--skeleton-height": toCssLength(height),
    "--skeleton-columns": resolvedVariant === "table" ? columnCount : undefined,
  };
  const hasStyle = Object.values(style).some((value) => value !== undefined);
  const boneCount = singleBoneVariants.has(resolvedVariant) ? 1 : clampNumber(lines, 1, 6, 3);

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
      ...flowStateProps(resolvedState),
      "data-full-width": String(Boolean(fullWidth)),
      "data-rows": resolvedVariant === "table" ? String(rowCount) : undefined,
      "data-columns": resolvedVariant === "table" ? String(columnCount) : undefined,
      style: hasStyle ? style : undefined,
    },
    resolvedVariant === "table"
      ? Array.from({ length: rowCount }, (_, rowIndex) => React.createElement(
        "span",
        { key: `row-${rowIndex}`, className: "skeleton__row", "aria-hidden": "true" },
        Array.from({ length: columnCount }, (_, columnIndex) => React.createElement("span", {
          key: `cell-${rowIndex}-${columnIndex}`,
          className: "skeleton__bone skeleton__cell",
          "aria-hidden": "true",
        })),
      ))
      : Array.from({ length: boneCount }, (_, index) => React.createElement("span", {
        key: `bone-${index}`,
        className: "skeleton__bone",
        "aria-hidden": "true",
      })),
  );
});

Skeleton.displayName = "Skeleton";
Skeleton.platformContract = skeletonPlatformContract;
