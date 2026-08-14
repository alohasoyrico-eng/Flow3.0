import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
import { CodeBlock } from "../CodeBlock.js";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

export type DocumentationTokenGridDensity = SurfaceDensity;
export type DocumentationTokenGridVariant = "tokens" | "values" | "compact";
export type DocumentationTokenGridState = "default" | "tokens" | "values" | "compact" | "empty" | "mobile";

export interface DocumentationTokenGridItem {
  key?: string;
  token: string;
  label?: string;
  helper?: string;
}

export interface DocumentationTokenGridProps extends FlowDataAttributes {
  items?: Array<string | DocumentationTokenGridItem>;
  label?: string;
  variant?: DocumentationTokenGridVariant;
  density?: DocumentationTokenGridDensity;
  state?: DocumentationTokenGridState;
  className?: string;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationTokenGridComponent extends ForwardRefExoticComponent<DocumentationTokenGridProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationTokenGrid";
}

type DocumentationTokenGridRestProps = Record<string, unknown>;

const validVariants = new Set<DocumentationTokenGridVariant>(["tokens", "values", "compact"]);

function resolveVariant(variant: DocumentationTokenGridVariant | undefined): DocumentationTokenGridVariant {
  return variant && validVariants.has(variant) ? variant : "tokens";
}

function normalizeItems(items: Array<string | DocumentationTokenGridItem> | undefined): DocumentationTokenGridItem[] {
  return (Array.isArray(items) ? items : [])
    .map((item, index) => typeof item === "string" ? { key: `token-${index}`, token: item } : item)
    .filter((item): item is DocumentationTokenGridItem => Boolean(item?.token));
}

export const DocumentationTokenGrid = forwardRef<HTMLDivElement, DocumentationTokenGridProps>(function DocumentationTokenGrid({
  items,
  label = "Token reference",
  variant = "tokens",
  density,
  state,
  className = "",
  surface,
  ...rest
}, ref) {
  const resolvedVariant = resolveVariant(variant);
  const normalizedItems = normalizeItems(items);

  if (!normalizedItems.length) return null;

  return React.createElement(
    Surface,
    {
      ...surface,
      ...flowRestProps(rest as DocumentationTokenGridRestProps),
      ref,
      className: ["documentation-token-grid", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      density,
      elevation: surface?.elevation ?? "none",
      tone: surface?.tone ?? "default",
      state: state ?? resolvedVariant,
      "aria-label": rest["aria-label"] ?? label,
      "data-flow-pattern": "documentation-token-grid",
      "data-documentation-token-grid-variant": resolvedVariant,
      "data-doc-primitive": "reference-token-grid",
    } as ComponentProps<typeof Surface>,
    normalizedItems.map((item, index) => React.createElement(CodeBlock, {
      key: item.key ?? item.token ?? `token-${index}`,
      code: item.token,
      label: item.label,
      helper: item.helper,
      variant: "inline-group",
      state: "default",
      density,
      "data-flow-slot": "documentation-token-grid.item",
      wrap: false,
    } as ComponentProps<typeof CodeBlock>)),
  );
}) as DocumentationTokenGridComponent;

DocumentationTokenGrid.displayName = "DocumentationTokenGrid";
