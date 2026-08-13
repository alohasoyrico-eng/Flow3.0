import React, { forwardRef, useMemo, useState } from "react";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { CodeBlock } from "../CodeBlock.js";
import { Surface } from "../Surface.js";
import { flowRestProps } from "../internal/props.js";
const validTypes = new Set([
    "typography",
    "stack",
    "icon",
    "swatch",
    "radius",
    "elevation",
    "motionToken",
    "breakpoint",
    "focus",
    "loading",
    "disabled",
    "chart",
    "map",
    "message",
    "statGrid",
    "surface",
]);
const demoClassByType = {
    typography: "typography-demo",
    stack: "stack-demo",
    icon: "icon-demo",
    swatch: "swatch-demo",
    radius: "radius-demo",
    elevation: "depth-explorer",
    motionToken: "motion-primitive-demo",
    breakpoint: "breakpoint-demo",
    focus: "focus-demo",
    loading: "loading-demo",
    disabled: "disabled-demo",
    chart: "chart-demo",
    map: "map-demo",
    message: "message-demo",
    statGrid: "",
    surface: "surface-demo",
};
const demoDataAttributeByType = {
    typography: "data-type-demo",
    stack: "data-density-demo",
    icon: "data-icon-size-demo",
    swatch: "data-color-demo",
    radius: "data-radius-demo",
    elevation: "data-depth-demo",
    motionToken: "data-motion-token-demo",
    breakpoint: "data-breakpoint-demo",
    focus: "data-focus-demo",
    loading: "data-loading-demo",
    disabled: "data-disabled-demo",
    chart: "data-chart-demo",
    map: "data-map-demo",
};
function resolveType(type) {
    return type && validTypes.has(type) ? type : "surface";
}
function firstChoice(choices, initial) {
    if (initial)
        return initial;
    return Array.isArray(choices) && choices[0] ? choices[0][0] : "";
}
function choiceButtons(choices, active, setActive, density) {
    if (!Array.isArray(choices) || !choices.length)
        return null;
    return React.createElement("div", { className: "density-switch" }, choices.map(([value, label]) => React.createElement(Button, {
        key: value,
        label,
        variant: value === active ? "primary" : "secondary",
        state: value === active ? "pressed" : "default",
        density,
        onClick: () => setActive(value),
    })));
}
function iconNode(name) {
    return React.createElement("span", { className: "material-symbol", "aria-hidden": "true" }, name);
}
function stateString(states, active) {
    const value = states?.[active];
    return Array.isArray(value) ? value.join(" ") : value ?? "";
}
function cardActions(actions) {
    if (!Array.isArray(actions))
        return undefined;
    return actions.map(([label, variant, intent, , icon], index) => ({
        key: label || `action-${index}`,
        label,
        icon,
        variant: variant,
        intent: intent,
    }));
}
export const DocumentationPrimitiveDemo = forwardRef(function DocumentationPrimitiveDemo({ type, initial, choices, ariaLabel, samples, staticSamples, code, items, icons, roles, labels, states, title, copy, targetLabel, action, initialLabel, cards, rows, className = "", density, surface, ...rest }, ref) {
    const resolvedType = resolveType(type);
    const [active, setActive] = useState(firstChoice(choices, initial));
    const dataAttribute = demoDataAttributeByType[resolvedType];
    const rootData = dataAttribute ? { [dataAttribute]: active } : {};
    const sample = samples?.[active]?.[0] ?? "";
    const sampleCode = samples?.[active]?.[1] ?? code ?? "";
    const controls = choiceButtons(choices, active, setActive, density);
    const body = useMemo(() => {
        if (resolvedType === "typography") {
            return [
                controls,
                React.createElement("p", { className: "voice-display", "data-type-sample": "", key: "sample" }, sample),
                ...(staticSamples ?? []).map(([sampleClassName, value]) => React.createElement("p", { className: sampleClassName, key: sampleClassName }, value)),
                sampleCode ? React.createElement(CodeBlock, { key: "code", code: sampleCode, variant: "inline", density, className: "documentation-primitive-demo__code", wrap: false }) : null,
            ];
        }
        if (resolvedType === "stack") {
            return [controls, ...(items ?? []).map((item, index) => React.createElement("div", { key: `${item}-${index}` }, item))];
        }
        if (resolvedType === "icon") {
            return [controls, ...(icons ?? []).map((name) => React.createElement("article", { key: name, "data-doc-primitive": "primitive-icon-demo-item" }, iconNode(name), React.createElement("span", null, name)))];
        }
        if (resolvedType === "swatch") {
            return [controls, ...(roles ?? []).map((role) => React.createElement("article", { key: role, "data-doc-primitive": "primitive-color-swatch-demo" }, React.createElement("i", null), React.createElement("span", null, role)))];
        }
        if (resolvedType === "radius") {
            return [controls, React.createElement("article", { key: "radius", "data-doc-primitive": "primitive-radius-demo" }, React.createElement("span", null, targetLabel), React.createElement("strong", { "data-radius-label": "" }, active))];
        }
        if (resolvedType === "elevation") {
            return [controls, React.createElement("div", { className: "depth-stage", key: "depth" }, React.createElement("article", { className: "depth-surface", "data-doc-primitive": "primitive-depth-demo" }, React.createElement("span", { "data-depth-label": "" }, labels?.[active] ?? ""), React.createElement("strong", null, title), React.createElement("p", null, copy)))];
        }
        if (resolvedType === "motionToken") {
            return [controls, React.createElement("div", { className: "motion-token-track", key: "track" }, React.createElement("i", null)), React.createElement(CodeBlock, { key: "label", code: labels?.[active] ?? initialLabel ?? "", variant: "inline", density, className: "documentation-primitive-demo__code", wrap: false, "data-motion-token-label": "" })];
        }
        if (resolvedType === "breakpoint") {
            return [controls, React.createElement("div", { className: "breakpoint-stage", key: "breakpoint" }, React.createElement("article", { "data-doc-primitive": "primitive-breakpoint-demo" }, React.createElement("b", { "data-breakpoint-label": "" }, labels?.[active] ?? active), React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)))];
        }
        if (resolvedType === "focus") {
            return [controls, React.createElement(Button, { key: "focus", label: action ?? "", variant: "primary", density, "data-focus-target": "" }), React.createElement("p", { key: "copy", "data-focus-copy": "" }, stateString(states, active))];
        }
        if (resolvedType === "loading") {
            return [controls, React.createElement("article", { key: "loading", "data-doc-primitive": "primitive-loading-demo" }, React.createElement("b", { "data-loading-title": "" }, stateString(states, active)), React.createElement("i", null), React.createElement("i", null), React.createElement("i", null))];
        }
        if (resolvedType === "disabled") {
            const value = states?.[active];
            const [buttonLabel, disabledCopy] = Array.isArray(value) ? value : [action ?? "", value ?? ""];
            return [controls, React.createElement(Button, { key: "disabled", label: buttonLabel ?? "", disabled: true, density, "data-disabled-action": "" }), React.createElement("p", { key: "copy", "data-disabled-copy": "" }, disabledCopy)];
        }
        if (resolvedType === "chart") {
            return [controls, React.createElement("div", { className: "chart-bars", key: "bars" }, React.createElement("i", null), React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)), React.createElement("p", { key: "copy", "data-chart-copy": "" }, stateString(states, active))];
        }
        if (resolvedType === "map") {
            return [controls, React.createElement("div", { className: "map-stage", key: "map" }, React.createElement("span", { className: "map-pin" }, iconNode("local_gas_station")), React.createElement("span", { className: "route-line" }), React.createElement("article", { "data-doc-primitive": "primitive-map-label", "data-map-label": "" }, stateString(states, active)))];
        }
        if (resolvedType === "message") {
            return (cards ?? []).map((card, index) => React.createElement(Card, {
                key: card.title ?? `card-${index}`,
                title: card.title ?? "",
                detail: card.copy,
                status: card.eyebrow,
                actions: cardActions(card.actions),
                variant: "minimal",
                fullWidth: true,
                density,
            }));
        }
        if (resolvedType === "statGrid") {
            return (rows ?? []).map(([label, value]) => React.createElement(Card, {
                key: label,
                title: label,
                value,
                variant: "minimal",
                composition: "stats",
                fullWidth: true,
                density,
            }));
        }
        return (roles ?? []).map((role) => React.createElement("article", { key: role, "data-doc-primitive": "primitive-surface-role-demo", className: role === "inverse" ? "inverse" : "" }, React.createElement("span", null, role)));
    }, [action, active, cards, choices, code, controls, copy, density, icons, initialLabel, items, labels, roles, rows, resolvedType, sample, sampleCode, samples, states, staticSamples, targetLabel, title]);
    return React.createElement(Surface, {
        ...surface,
        ...flowRestProps(rest),
        ...rootData,
        ref,
        className: ["primitive-demo", demoClassByType[resolvedType], className].filter(Boolean).join(" "),
        surfaceRole: "section",
        density,
        elevation: surface?.elevation ?? "none",
        tone: surface?.tone ?? "default",
        state: "default",
        "aria-label": rest["aria-label"] ?? ariaLabel,
        "data-flow-pattern": "documentation-primitive-demo",
        "data-documentation-primitive-demo-type": resolvedType,
        "data-doc-primitive": "primitive-demo",
    }, body);
});
DocumentationPrimitiveDemo.displayName = "DocumentationPrimitiveDemo";
