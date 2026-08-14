import React, { forwardRef } from "react";
import type { ReactNode, ForwardRefExoticComponent, RefAttributes } from "react";
import { Surface, type SurfaceDensity } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { ArtifactMetadataBar, type ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";
import { DemoPreviewFrame } from "../patterns/DemoPreviewFrame.js";
import { DocumentationSection } from "../patterns/DocumentationSection.js";
import { SectionHeader } from "../patterns/SectionHeader.js";

export type TemplateDetailTemplateState = "default" | "loading" | "empty" | "error";
export type TemplateDetailTemplateDensity = SurfaceDensity;

export interface TemplateDetailTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  modulePreview?: ReactNode;
  children?: ReactNode;
  density?: TemplateDetailTemplateDensity;
  state?: TemplateDetailTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface TemplateDetailTemplateComponent extends ForwardRefExoticComponent<TemplateDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "TemplateDetailTemplate";
}

function sanitizeRestProps(rest: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

export const TemplateDetailTemplate = forwardRef<HTMLElement, TemplateDetailTemplateProps>(function TemplateDetailTemplate({
  title,
  description,
  metadata = [],
  modulePreview,
  children,
  density = "md",
  state = "default",
  className = "",
  ...rest
}, ref) {
  return React.createElement(
    "article",
    {
      ...sanitizeRestProps(rest),
      ref,
      className: ["template-detail-template", className].filter(Boolean).join(" "),
      "aria-label": rest["aria-label"] ?? title,
      "data-flow-template": "template-detail-template",
      "data-state": state,
      "data-density": density,
    },
    React.createElement(SectionHeader, { title, ...(description ? { description } : {}), headingLevel: 1, density, "data-flow-slot": "template-detail.header" }),
    metadata.length ? React.createElement(ArtifactMetadataBar, { items: metadata, density, "data-flow-slot": "template-detail.metadata" }) : null,
    React.createElement(
      Surface,
      { surfaceRole: "section", density, tone: "default", elevation: "none", state: state === "loading" ? "disabled" : "default", "data-flow-slot": "template-detail.main" },
      modulePreview ? React.createElement(DemoPreviewFrame, { kind: "template", density, preview: modulePreview, "data-flow-slot": "template-detail.preview" }) : null,
      React.createElement(DocumentationSection, { density, state: children ? "default" : "empty", "data-flow-slot": "template-detail.sections" }, children),
    ),
  );
}) as TemplateDetailTemplateComponent;

TemplateDetailTemplate.displayName = "TemplateDetailTemplate";
