import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
import { ArtifactMetadataBar } from "../patterns/ArtifactMetadataBar.js";
import { DemoPreviewFrame } from "../patterns/DemoPreviewFrame.js";
import { DocumentationSection } from "../patterns/DocumentationSection.js";
import { OnThisPageNav } from "../patterns/OnThisPageNav.js";
import { SectionHeader } from "../patterns/SectionHeader.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
export const ComponentDetailTemplate = forwardRef(function ComponentDetailTemplate({ title, description, metadata = [], navItems = [], demo, children, aside, density = "md", state = "default", className = "", ...rest }, ref) {
    const hasMetadata = metadata.length > 0;
    const hasNav = navItems.length > 0;
    return React.createElement("article", {
        ...sanitizeRestProps(rest),
        ref,
        className: ["component-detail-template", className].filter(Boolean).join(" "),
        "aria-label": rest["aria-label"] ?? title,
        "data-flow-template": "component-detail-template",
        "data-state": state,
        "data-density": density,
    }, React.createElement(SectionHeader, { title, ...(description ? { description } : {}), headingLevel: 1, density, "data-flow-slot": "component-detail.header" }), hasMetadata ? React.createElement(ArtifactMetadataBar, { items: metadata, density, "data-flow-slot": "component-detail.metadata" }) : null, React.createElement("div", { "data-flow-slot": "component-detail.layout" }, React.createElement(Surface, { surfaceRole: "section", density, tone: "default", elevation: "none", state: state === "loading" ? "disabled" : "default", "data-flow-slot": "component-detail.main" }, demo ? React.createElement(DemoPreviewFrame, { kind: "demo", density, preview: demo, "data-flow-slot": "component-detail.demo" }) : null, React.createElement(DocumentationSection, { density, state: children ? "default" : "empty", "data-flow-slot": "component-detail.sections" }, children)), hasNav ? React.createElement(OnThisPageNav, { items: navItems, density, sticky: true, "data-flow-slot": "component-detail.nav" }) : null, aside));
});
ComponentDetailTemplate.displayName = "ComponentDetailTemplate";
