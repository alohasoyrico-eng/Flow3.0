/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
import { ArtifactMetadataBar } from "../patterns/ArtifactMetadataBar.js";
import { DocumentationSection } from "../patterns/DocumentationSection.js";
import { Search } from "../patterns/Search.js";
import { SectionHeader } from "../patterns/SectionHeader.js";
import { Toolbar } from "../patterns/Toolbar.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
export const DocsCollectionTemplate = forwardRef(function DocsCollectionTemplate({ title, description, metadata = [], search, toolbar, children, density = "md", state = "default", className = "", ...rest }, ref) {
    return React.createElement("article", {
        ...sanitizeRestProps(rest),
        ref,
        className: ["docs-collection-template", className].filter(Boolean).join(" "),
        "aria-label": rest["aria-label"] ?? title,
        "data-flow-template": "docs-collection-template",
        "data-state": state,
        "data-density": density,
    }, React.createElement(SectionHeader, { title, ...(description ? { description } : {}), headingLevel: 1, density, "data-flow-slot": "docs-collection.header" }), metadata.length ? React.createElement(ArtifactMetadataBar, { items: metadata, density, "data-flow-slot": "docs-collection.metadata" }) : null, React.createElement(Surface, { surfaceRole: "section", density, tone: "default", elevation: "none", "data-flow-slot": "docs-collection.controls" }, search ? React.createElement(Search, { ...search, density: search.density ?? density, "data-flow-slot": "docs-collection.search" }) : null, toolbar ? React.createElement(Toolbar, { ...toolbar, density: toolbar.density ?? density, "data-flow-slot": "docs-collection.toolbar" }) : null), React.createElement(DocumentationSection, { density, state: children ? "default" : "empty", "data-flow-slot": "docs-collection.grid" }, children));
});
DocsCollectionTemplate.displayName = "DocsCollectionTemplate";
