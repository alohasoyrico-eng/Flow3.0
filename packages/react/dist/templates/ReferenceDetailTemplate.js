import React, { forwardRef } from "react";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
import { DemoPreviewFrame } from "../patterns/DemoPreviewFrame.js";
import { DocumentationHero } from "../patterns/DocumentationHero.js";
import { DocumentationSection } from "../patterns/DocumentationSection.js";
import { OnThisPageNav } from "../patterns/OnThisPageNav.js";
import { SectionHeader } from "../patterns/SectionHeader.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
export const ReferenceDetailTemplate = forwardRef(function ReferenceDetailTemplate({ title, description, navItems = [], specimen, children, density = "md", state = "default", className = "", ...rest }, ref) {
    return React.createElement("article", {
        ...sanitizeRestProps(rest),
        ref,
        className: ["reference-detail-template", className].filter(Boolean).join(" "),
        "aria-label": rest["aria-label"] ?? title,
        "data-flow-template": "reference-detail-template",
        "data-state": state,
        "data-density": density,
    }, React.createElement(DocumentationHero, { kicker: "Reference", title, ...(description ? { description } : {}), density, background: "none", "data-flow-slot": "reference-detail.hero" }), React.createElement(SectionHeader, { title: "Reference structure", density, headingLevel: 2, "data-flow-slot": "reference-detail.header" }), React.createElement(Surface, { surfaceRole: "section", density, tone: "default", elevation: "none", state: state === "loading" ? "disabled" : "default", "data-flow-slot": "reference-detail.main" }, specimen ? React.createElement(DemoPreviewFrame, { kind: "specimen", density, preview: specimen, "data-flow-slot": "reference-detail.specimen" }) : null, React.createElement(DocumentationSection, { density, state: children ? "default" : "empty", "data-flow-slot": "reference-detail.sections" }, children)), navItems.length ? React.createElement(OnThisPageNav, { items: navItems, density, sticky: true, "data-flow-slot": "reference-detail.nav" }) : null);
});
ReferenceDetailTemplate.displayName = "ReferenceDetailTemplate";
