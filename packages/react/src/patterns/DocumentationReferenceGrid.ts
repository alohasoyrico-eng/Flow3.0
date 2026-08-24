import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Card } from "../Card.js";
import type { CardProps } from "../Card.js";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

export type DocumentationReferenceGridKind = "summary" | "rule" | "matrix";
export type DocumentationReferenceGridDensity = SurfaceDensity;
export type DocumentationReferenceGridState = "default" | "summary" | "rule" | "matrix" | "empty" | "mobile";

export interface DocumentationReferenceGridItem {
  key?: string;
  title?: ReactNode;
  value?: ReactNode;
  detail?: ReactNode;
  status?: ReactNode;
  composition?: CardProps["composition"];
  variant?: CardProps["variant"];
}

export interface DocumentationReferenceGridProps extends FlowDataAttributes {
  items?: DocumentationReferenceGridItem[];
  kind?: DocumentationReferenceGridKind;
  label?: string;
  density?: DocumentationReferenceGridDensity;
  state?: DocumentationReferenceGridState;
  className?: string;
  cardClassName?: string;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationReferenceGridComponent extends ForwardRefExoticComponent<DocumentationReferenceGridProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationReferenceGrid";
}

type DocumentationReferenceGridRestProps = Record<string, unknown>;

const validKinds = new Set<DocumentationReferenceGridKind>(["summary", "rule", "matrix"]);

function resolveKind(kind: DocumentationReferenceGridKind | undefined): DocumentationReferenceGridKind {
  return kind && validKinds.has(kind) ? kind : "matrix";
}

function normalizeItems(items: DocumentationReferenceGridItem[] | undefined): DocumentationReferenceGridItem[] {
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function cardCompositionFor(kind: DocumentationReferenceGridKind, item: DocumentationReferenceGridItem): CardProps["composition"] {
  if (item.composition) return item.composition;
  return kind === "summary" ? "compact" : "standard";
}

export const DocumentationReferenceGrid = forwardRef<HTMLDivElement, DocumentationReferenceGridProps>(function DocumentationReferenceGrid({
  items,
  kind,
  label = "Reference grid",
  density,
  state,
  className = "",
  cardClassName = "",
  surface,
  ...rest
}, ref) {
  const resolvedKind = resolveKind(kind);
  const normalizedItems = normalizeItems(items);

  return React.createElement(
    Surface,
    {
      ...surface,
      ...flowRestProps(rest as DocumentationReferenceGridRestProps),
      ref,
      className: ["documentation-reference-grid", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      density,
      elevation: surface?.elevation ?? "none",
      tone: surface?.tone ?? "default",
      state: state ?? (normalizedItems.length ? resolvedKind : "empty"),
      "aria-label": rest["aria-label"] ?? label,
      "data-flow-pattern": "documentation-reference-grid",
      "data-documentation-reference-grid-kind": resolvedKind,
      "data-doc-primitive": `reference-${resolvedKind}-grid`,
    } as ComponentProps<typeof Surface>,
    normalizedItems.map((item, index) => React.createElement(Card, {
      key: item.key ?? `${resolvedKind}-${index}`,
      className: cardClassName,
      title: item.title ?? "",
      value: item.value,
      detail: item.detail,
      status: item.status,
      variant: item.variant ?? "minimal",
      composition: cardCompositionFor(resolvedKind, item),
      state: "default",
      density,
      fullWidth: true,
      "data-flow-slot": "documentation-reference-grid.item",
    } as ComponentProps<typeof Card>)),
  );
}) as DocumentationReferenceGridComponent;

DocumentationReferenceGrid.displayName = "DocumentationReferenceGrid";
