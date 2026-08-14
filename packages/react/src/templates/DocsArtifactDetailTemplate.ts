import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../Breadcrumbs.js";
import { Surface, type SurfaceDensity, type SurfaceProps } from "../Surface.js";
import { Tabs, type TabsItem, type TabsValueChangeEvent } from "../Tabs.js";
import { flowDefinedProps, flowRestProps } from "../internal/props.js";
import { ArtifactMetadataBar, type ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";
import { DocumentationHero } from "../patterns/DocumentationHero.js";

import type { FlowDataAttributes } from "../internal/props.js";

export type DocsArtifactDetailTemplateState = "default" | "loading" | "empty" | "error";
export type DocsArtifactDetailTemplateDensity = SurfaceDensity;

export interface DocsArtifactDetailTemplateProps extends FlowDataAttributes {
  label?: string;
  artifactType?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  metadata?: ArtifactMetadataBarItem[];
  tabs?: TabsItem[];
  selectedTabKey?: string;
  onSelectedTabChange?: (key: string, event: TabsValueChangeEvent) => void;
  body?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  density?: DocsArtifactDetailTemplateDensity;
  state?: DocsArtifactDetailTemplateState;
  loading?: boolean;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocsArtifactDetailTemplateComponent extends ForwardRefExoticComponent<DocsArtifactDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "DocsArtifactDetailTemplate";
}

type SanitizedRestProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
} & {
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SanitizedRestProps {
  return Object.fromEntries(
    Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as SanitizedRestProps;
}

function resolveState({
  loading,
  state,
  body,
}: {
  loading?: boolean;
  state?: DocsArtifactDetailTemplateState;
  body?: ReactNode;
}): DocsArtifactDetailTemplateState {
  if (loading || state === "loading") return "loading";
  if (state === "error") return "error";
  if (state === "empty" || !body) return "empty";
  return state ?? "default";
}

export const DocsArtifactDetailTemplate = forwardRef<HTMLElement, DocsArtifactDetailTemplateProps>(function DocsArtifactDetailTemplate({
  label,
  artifactType,
  title,
  description,
  breadcrumbs = [],
  metadata = [],
  tabs = [],
  selectedTabKey,
  onSelectedTabChange,
  body,
  aside,
  footer,
  density,
  state,
  loading = false,
  surface,
  className = "",
  contentClassName = "",
  ...rest
}, ref) {
  const resolvedState = resolveState({
    loading,
    ...(state !== undefined ? { state } : {}),
    body,
  });
  const resolvedLabel = label ?? title;
  const hasBreadcrumbs = breadcrumbs.length > 0;
  const hasMetadata = metadata.length > 0;
  const hasTabs = tabs.length > 0;

  return React.createElement(
    "article",
    {
      ...sanitizeRestProps(rest),
      ref,
      className: ["docs-artifact-detail-template", className].filter(Boolean).join(" "),
      "aria-label": rest["aria-label"] ?? resolvedLabel,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-template": "docs-artifact-detail-template",
      "data-state": resolvedState,
      "data-density": density,
    },
    React.createElement(
      Surface,
      flowDefinedProps({
        ...surface,
        surfaceRole: "section",
        density,
        tone: "default",
        elevation: "none",
        state: resolvedState === "loading" ? "disabled" : "default",
        className: "docs-artifact-detail-template__intro",
        "data-flow-slot": "artifact-detail.intro",
      }) as ComponentProps<typeof Surface>,
      hasBreadcrumbs
        ? React.createElement(Breadcrumbs, {
          items: breadcrumbs,
          label: `${resolvedLabel} breadcrumbs`,
          density: "sm",
          variant: "compact",
          "data-flow-slot": "artifact-detail.breadcrumbs",
        } as ComponentProps<typeof Breadcrumbs>)
        : null,
      React.createElement(DocumentationHero, {
        kicker: artifactType,
        title,
        description,
        density,
        background: "none",
        elevation: "none",
        state: hasMetadata ? "with-metadata" : undefined,
        className: "docs-artifact-detail-template__hero",
        "data-flow-slot": "artifact-detail.hero",
      } as ComponentProps<typeof DocumentationHero>),
      hasMetadata
        ? React.createElement(ArtifactMetadataBar, {
          label: `${resolvedLabel} metadata`,
          items: metadata,
          density: "sm",
          className: "docs-artifact-detail-template__metadata",
          "data-flow-slot": "artifact-detail.metadata",
        } as ComponentProps<typeof ArtifactMetadataBar>)
        : null,
    ),
    React.createElement(
      "div",
      { className: "docs-artifact-detail-template__layout", "data-flow-slot": "artifact-detail.layout" },
      React.createElement(
        "div",
        { className: ["docs-artifact-detail-template__content", contentClassName].filter(Boolean).join(" "), "data-flow-slot": "artifact-detail.content" },
        hasTabs
          ? React.createElement(Tabs, {
            label: `${resolvedLabel} sections`,
            items: tabs,
            selectedKey: selectedTabKey,
            variant: "default",
            density: "md",
            onValueChange: onSelectedTabChange,
            className: "docs-artifact-detail-template__tabs",
            "data-doc-template": "artifact-detail",
            "data-doc-control-bridge": "artifact-detail-tabs",
            "data-flow-slot": "artifact-detail.tabs",
          } as ComponentProps<typeof Tabs>)
          : null,
        React.createElement(Surface, {
          surfaceRole: "inline",
          density,
          tone: "default",
          elevation: "none",
          className: "tab-panel",
          id: "tabPanel",
          "data-flow-slot": "artifact-detail.body",
        } as ComponentProps<typeof Surface>, body),
      ),
      aside ? React.createElement("aside", { "data-flow-slot": "artifact-detail.aside" }, aside) : null,
    ),
    footer ? React.createElement("footer", { "data-flow-slot": "artifact-detail.footer" }, footer) : null,
  );
}) as DocsArtifactDetailTemplateComponent;

DocsArtifactDetailTemplate.displayName = "DocsArtifactDetailTemplate";
