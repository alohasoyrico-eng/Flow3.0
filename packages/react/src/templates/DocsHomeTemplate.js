/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
import { ArtifactMetadataBar } from "../patterns/ArtifactMetadataBar.js";
import { DocumentationHero } from "../patterns/DocumentationHero.js";
import { DocumentationSection } from "../patterns/DocumentationSection.js";
import { SectionHeader } from "../patterns/SectionHeader.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
export const DocsHomeTemplate = forwardRef(function DocsHomeTemplate({ title, description, metadata = [], heroVisual, coverage, status, children, density = "md", state = "default", className = "", ...rest }, ref) {
    return React.createElement("article", {
        ...sanitizeRestProps(rest),
        ref,
        className: ["docs-home-template", className].filter(Boolean).join(" "),
        "aria-label": rest["aria-label"] ?? title,
        "data-flow-template": "docs-home-template",
        "data-state": state,
        "data-density": density,
    }, React.createElement(DocumentationHero, { title, ...(description ? { description } : {}), density, background: "gradient-grid", visual: heroVisual, "data-flow-slot": "docs-home.hero" }), React.createElement(Surface, { surfaceRole: "section", density, tone: "default", elevation: "none", "data-flow-slot": "docs-home.main" }, React.createElement(SectionHeader, { title: "Documentation status", density, headingLevel: 2, "data-flow-slot": "docs-home.status-header" }), React.createElement(DocumentationSection, { title: "Coverage", density, "data-flow-slot": "docs-home.coverage" }, coverage), React.createElement(DocumentationSection, { title: "Status", density, "data-flow-slot": "docs-home.status" }, status), metadata.length ? React.createElement(ArtifactMetadataBar, { items: metadata, density, "data-flow-slot": "docs-home.metadata" }) : null, children));
});
DocsHomeTemplate.displayName = "DocsHomeTemplate";
