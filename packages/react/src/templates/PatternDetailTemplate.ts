import React, { forwardRef } from "react";
import type { ReactNode, ForwardRefExoticComponent, RefAttributes } from "react";
import { Surface, type SurfaceDensity } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { ArtifactMetadataBar, type ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";
import { DemoPreviewFrame } from "../patterns/DemoPreviewFrame.js";
import { DocumentationSection } from "../patterns/DocumentationSection.js";
import { OnThisPageNav, type OnThisPageNavItem } from "../patterns/OnThisPageNav.js";
import { SectionHeader } from "../patterns/SectionHeader.js";

export type PatternDetailTemplateState = "default" | "loading" | "empty" | "error";
export type PatternDetailTemplateDensity = SurfaceDensity;

export interface PatternDetailTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  navItems?: OnThisPageNavItem[];
  scenario?: ReactNode;
  demo?: ReactNode;
  children?: ReactNode;
  density?: PatternDetailTemplateDensity;
  state?: PatternDetailTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface PatternDetailTemplateComponent extends ForwardRefExoticComponent<PatternDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "PatternDetailTemplate";
}

function sanitizeRestProps(rest: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

export const PatternDetailTemplate = forwardRef<HTMLElement, PatternDetailTemplateProps>(function PatternDetailTemplate({
  title,
  description,
  metadata = [],
  navItems = [],
  scenario,
  demo,
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
      className: ["pattern-detail-template", className].filter(Boolean).join(" "),
      "aria-label": rest["aria-label"] ?? title,
      "data-flow-template": "pattern-detail-template",
      "data-state": state,
      "data-density": density,
    },
    React.createElement(SectionHeader, { title, ...(description ? { description } : {}), headingLevel: 1, density, "data-flow-slot": "pattern-detail.header" }),
    metadata.length ? React.createElement(ArtifactMetadataBar, { items: metadata, density, "data-flow-slot": "pattern-detail.metadata" }) : null,
    React.createElement(
      Surface,
      { surfaceRole: "section", density, tone: "default", elevation: "none", state: state === "loading" ? "disabled" : "default", "data-flow-slot": "pattern-detail.main" },
      scenario ? React.createElement(DocumentationSection, { title: "Scenario", density, "data-flow-slot": "pattern-detail.scenario" }, scenario) : null,
      demo ? React.createElement(DemoPreviewFrame, { kind: "demo", density, preview: demo, "data-flow-slot": "pattern-detail.demo" }) : null,
      React.createElement(DocumentationSection, { density, state: children ? "default" : "empty", "data-flow-slot": "pattern-detail.sections" }, children),
    ),
    navItems.length ? React.createElement(OnThisPageNav, { items: navItems, density, sticky: true, "data-flow-slot": "pattern-detail.nav" }) : null,
  );
}) as PatternDetailTemplateComponent;

PatternDetailTemplate.displayName = "PatternDetailTemplate";
