import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceElevation, SurfaceProps, SurfaceTone } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { SectionHeader } from "./SectionHeader.js";
import type { SectionHeaderProps } from "./SectionHeader.js";

export type DocumentationSectionState = "default" | "dense" | "callout" | "matrix" | "empty" | "loading" | "error";
export type DocumentationSectionLayout = "stack" | "split" | "matrix" | "cards" | "callout";
export type DocumentationSectionDensity = SurfaceDensity;
export type DocumentationSectionTone = SurfaceTone | "info";

export interface DocumentationSectionHeader extends Omit<SectionHeaderProps, "title" | "description" | "density"> {
  title: string;
  description?: string;
}

export interface DocumentationSectionProps extends FlowDataAttributes {
  title?: string;
  description?: string;
  header?: DocumentationSectionHeader;
  children?: ReactNode;
  footer?: ReactNode;
  layout?: DocumentationSectionLayout;
  state?: DocumentationSectionState;
  density?: DocumentationSectionDensity;
  tone?: DocumentationSectionTone;
  elevation?: SurfaceElevation;
  surface?: Omit<SurfaceProps, "children" | "density" | "tone" | "elevation" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationSectionComponent extends ForwardRefExoticComponent<DocumentationSectionProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationSection";
}

type DocumentationSectionRestProps = Record<string, unknown>;

const validStates = new Set<DocumentationSectionState>(["default", "dense", "callout", "matrix", "empty", "loading", "error"]);
const validLayouts = new Set<DocumentationSectionLayout>(["stack", "split", "matrix", "cards", "callout"]);
const validTones = new Set<DocumentationSectionTone>(["default", "muted", "selected", "danger", "warning", "success", "info"]);

function sanitizeRestProps(rest: DocumentationSectionRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState(state: DocumentationSectionState | undefined, layout: DocumentationSectionLayout): DocumentationSectionState {
  if (state && validStates.has(state)) return state;
  if (layout === "matrix") return "matrix";
  if (layout === "callout") return "callout";
  return "default";
}

function resolveLayout(layout: DocumentationSectionLayout | undefined): DocumentationSectionLayout {
  return layout && validLayouts.has(layout) ? layout : "stack";
}

function resolveTone(tone: DocumentationSectionTone | undefined, state: DocumentationSectionState): SurfaceTone {
  if (tone === "info") return "selected";
  if (tone && validTones.has(tone)) return tone;
  if (state === "error") return "danger";
  if (state === "callout") return "muted";
  return "default";
}

export const DocumentationSection = forwardRef<HTMLDivElement, DocumentationSectionProps>(function DocumentationSection({
  title,
  description,
  header,
  children,
  footer,
  layout,
  state,
  density,
  tone,
  elevation = "none",
  surface,
  className = "",
  ...rest
}, ref) {
  const resolvedLayout = resolveLayout(layout);
  const resolvedState = resolveState(state, resolvedLayout);
  const resolvedTone = resolveTone(tone, resolvedState);
  const sectionTitle = header?.title ?? title;
  const sectionDescription = header?.description ?? description;
  const sectionHeader = sectionTitle
    ? React.createElement(SectionHeader, {
      ...header,
      title: sectionTitle,
      description: sectionDescription,
      density,
      state: resolvedState === "loading" ? "loading" : header?.state,
      "data-flow-slot": "documentation-section.header",
    } as ComponentProps<typeof SectionHeader>)
    : null;

  return React.createElement(
    Surface,
    {
      ...surface,
      ...sanitizeRestProps(rest),
      ref,
      className: ["documentation-section", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      density,
      elevation,
      tone: resolvedTone,
      state: resolvedState === "loading" ? "disabled" : "default",
      "data-flow-pattern": "documentation-section",
      "data-documentation-section-layout": resolvedLayout,
      "data-documentation-section-state": resolvedState,
    } as ComponentProps<typeof Surface>,
    sectionHeader,
    React.createElement(
      "div",
      {
        "data-flow-slot": "documentation-section.body",
      },
      children,
    ),
    footer
      ? React.createElement(
        "div",
        {
          "data-flow-slot": "documentation-section.footer",
        },
        footer,
      )
      : null,
  );
}) as DocumentationSectionComponent;

DocumentationSection.displayName = "DocumentationSection";
