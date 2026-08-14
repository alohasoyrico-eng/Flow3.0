import React, { forwardRef, useMemo, useState } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { CodeBlock } from "../CodeBlock.js";
import { Surface } from "../Surface.js";
import type { CardAction, CardProps } from "../Card.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

export type DocumentationPrimitiveDemoType =
  | "typography"
  | "stack"
  | "icon"
  | "swatch"
  | "radius"
  | "elevation"
  | "motionToken"
  | "breakpoint"
  | "focus"
  | "loading"
  | "disabled"
  | "chart"
  | "map"
  | "message"
  | "statGrid"
  | "surface";
export type DocumentationPrimitiveDemoDensity = SurfaceDensity;
export type DocumentationPrimitiveDemoState = "default" | "interactive" | "empty" | "mobile";
export type DocumentationPrimitiveDemoChoice = [string, string];
export type DocumentationPrimitiveDemoCardAction = [string, string?, string?, string?, string?];
export interface DocumentationPrimitiveDemoCard {
  title?: string;
  copy?: string;
  eyebrow?: string;
  actions?: DocumentationPrimitiveDemoCardAction[];
}

export interface DocumentationPrimitiveDemoProps extends FlowDataAttributes {
  type?: DocumentationPrimitiveDemoType;
  initial?: string;
  choices?: DocumentationPrimitiveDemoChoice[];
  ariaLabel?: string;
  samples?: Record<string, [string, string]>;
  staticSamples?: Array<[string, string]>;
  code?: string;
  items?: string[];
  icons?: string[];
  roles?: string[];
  labels?: Record<string, string>;
  states?: Record<string, string | [string, string]>;
  title?: string;
  copy?: string;
  targetLabel?: string;
  action?: string;
  initialLabel?: string;
  cards?: DocumentationPrimitiveDemoCard[];
  rows?: Array<[string, string]>;
  className?: string;
  density?: DocumentationPrimitiveDemoDensity;
  state?: DocumentationPrimitiveDemoState;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationPrimitiveDemoComponent extends ForwardRefExoticComponent<DocumentationPrimitiveDemoProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationPrimitiveDemo";
}

type DocumentationPrimitiveDemoRestProps = Record<string, unknown>;

const validTypes = new Set<DocumentationPrimitiveDemoType>([
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

const demoClassByType: Record<DocumentationPrimitiveDemoType, string> = {
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

const demoDataAttributeByType: Partial<Record<DocumentationPrimitiveDemoType, string>> = {
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

function resolveType(type: DocumentationPrimitiveDemoType | undefined): DocumentationPrimitiveDemoType {
  return type && validTypes.has(type) ? type : "surface";
}

function firstChoice(choices: DocumentationPrimitiveDemoChoice[] | undefined, initial: string | undefined): string {
  if (initial) return initial;
  return Array.isArray(choices) && choices[0] ? choices[0][0] : "";
}

function choiceButtons(choices: DocumentationPrimitiveDemoChoice[] | undefined, active: string, setActive: (value: string) => void, density: DocumentationPrimitiveDemoDensity | undefined) {
  if (!Array.isArray(choices) || !choices.length) return null;
  return React.createElement(
    "div",
    { "data-flow-slot": "documentation-primitive-demo.controls" },
    choices.map(([value, label]) => React.createElement(Button, {
      key: value,
      label,
      variant: value === active ? "primary" : "secondary",
      state: value === active ? "pressed" : "default",
      ...(density !== undefined ? { density } : {}),
      onClick: () => setActive(value),
    })),
  );
}

function iconNode(name: string) {
  return React.createElement("div", { "data-doc-primitive": "material-symbol", "aria-hidden": "true" }, name);
}

function stateString(states: DocumentationPrimitiveDemoProps["states"], active: string): string {
  const value = states?.[active];
  return Array.isArray(value) ? value.join(" ") : value ?? "";
}

function cardActions(actions: DocumentationPrimitiveDemoCardAction[] | undefined): CardAction[] | undefined {
  if (!Array.isArray(actions)) return undefined;
  return actions.map(([label, variant, intent, , icon], index) => ({
    key: label || `action-${index}`,
    label,
    ...(icon !== undefined ? { icon } : {}),
    ...(variant !== undefined ? { variant: variant as NonNullable<CardAction["variant"]> } : {}),
    ...(intent !== undefined ? { intent: intent as NonNullable<CardAction["intent"]> } : {}),
  }));
}

export const DocumentationPrimitiveDemo = forwardRef<HTMLDivElement, DocumentationPrimitiveDemoProps>(function DocumentationPrimitiveDemo({
  type,
  initial,
  choices,
  ariaLabel,
  samples,
  staticSamples,
  code,
  items,
  icons,
  roles,
  labels,
  states,
  title,
  copy,
  targetLabel,
  action,
  initialLabel,
  cards,
  rows,
  className = "",
  density,
  state = "default",
  surface,
  ...rest
}, ref) {
  const resolvedType = resolveType(type);
  const [active, setActive] = useState(firstChoice(choices, initial));
  const dataAttribute = demoDataAttributeByType[resolvedType];
  const rootData = dataAttribute ? { [dataAttribute]: active } : {};
  const sample = samples?.[active]?.[0] ?? "";
  const sampleCode = samples?.[active]?.[1] ?? code ?? "";
  const controls = choiceButtons(choices, active, setActive, density);
  const body = useMemo<ReactNode>(() => {
    if (resolvedType === "typography") {
      return [
        controls,
        React.createElement("p", { "data-doc-primitive": "voice-display", "data-type-sample": "", key: "sample" }, sample),
        ...(staticSamples ?? []).map(([sampleClassName, value]) => React.createElement("p", { "data-doc-primitive": sampleClassName, key: sampleClassName }, value)),
        sampleCode ? React.createElement(CodeBlock, { key: "code", code: sampleCode, variant: "inline-group", state: "default", ...(density !== undefined ? { density } : {}), wrap: false }) : null,
      ];
    }
    if (resolvedType === "stack") {
      return [controls, ...(items ?? []).map((item, index) => React.createElement("div", { key: `${item}-${index}`, "data-doc-primitive": "stack-item" }, item))];
    }
    if (resolvedType === "icon") {
      return [controls, ...(icons ?? []).map((name) => React.createElement("div", { key: name, "data-doc-primitive": "primitive-icon-demo-item" }, iconNode(name), React.createElement("div", { "data-doc-primitive": "primitive-icon-demo-label" }, name)))];
    }
    if (resolvedType === "swatch") {
      return [controls, ...(roles ?? []).map((role) => React.createElement("div", { key: role, "data-doc-primitive": "primitive-color-swatch-demo" }, React.createElement("i", null), React.createElement("div", { "data-doc-primitive": "primitive-color-swatch-label" }, role)))];
    }
    if (resolvedType === "radius") {
      return [controls, React.createElement("div", { key: "radius", "data-doc-primitive": "primitive-radius-demo" }, React.createElement("div", { "data-doc-primitive": "primitive-radius-target" }, targetLabel), React.createElement("strong", { "data-radius-label": "" }, active))];
    }
    if (resolvedType === "elevation") {
      return [controls, React.createElement("div", { "data-doc-primitive": "depth-stage", key: "depth" }, React.createElement("div", { "data-doc-primitive": "primitive-depth-demo" }, React.createElement("div", { "data-doc-primitive": "primitive-depth-label", "data-depth-label": "" }, labels?.[active] ?? ""), React.createElement("strong", null, title), React.createElement("p", null, copy)))];
    }
    if (resolvedType === "motionToken") {
      return [controls, React.createElement("div", { "data-doc-primitive": "motion-token-track", key: "track" }, React.createElement("i", null)), React.createElement(CodeBlock, { key: "label", code: labels?.[active] ?? initialLabel ?? "", variant: "inline-group", state: "default", density, wrap: false, "data-motion-token-label": "" } as ComponentProps<typeof CodeBlock>)];
    }
    if (resolvedType === "breakpoint") {
      return [controls, React.createElement("div", { "data-doc-primitive": "breakpoint-stage", key: "breakpoint" }, React.createElement("div", { "data-doc-primitive": "primitive-breakpoint-demo" }, React.createElement("b", { "data-breakpoint-label": "" }, labels?.[active] ?? active), React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)))];
    }
    if (resolvedType === "focus") {
      return [controls, React.createElement(Button, { key: "focus", label: action ?? "", variant: "primary", state: "default", density, "data-focus-target": "" } as ComponentProps<typeof Button>), React.createElement("p", { key: "copy", "data-focus-copy": "" }, stateString(states, active))];
    }
    if (resolvedType === "loading") {
      return [controls, React.createElement("div", { key: "loading", "data-doc-primitive": "primitive-loading-demo" }, React.createElement("b", { "data-loading-title": "" }, stateString(states, active)), React.createElement("i", null), React.createElement("i", null), React.createElement("i", null))];
    }
    if (resolvedType === "disabled") {
      const value = states?.[active];
      const [buttonLabel, disabledCopy] = Array.isArray(value) ? value : [action ?? "", value ?? ""];
      return [controls, React.createElement(Button, { key: "disabled", label: buttonLabel ?? "", disabled: true, density, "data-disabled-action": "" } as ComponentProps<typeof Button>), React.createElement("p", { key: "copy", "data-disabled-copy": "" }, disabledCopy)];
    }
    if (resolvedType === "chart") {
      return [controls, React.createElement("div", { "data-doc-primitive": "chart-bars", key: "bars" }, React.createElement("i", null), React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)), React.createElement("p", { key: "copy", "data-chart-copy": "" }, stateString(states, active))];
    }
    if (resolvedType === "map") {
      return [controls, React.createElement("div", { "data-doc-primitive": "map-stage", key: "map" }, React.createElement("div", { "data-doc-primitive": "map-pin" }, iconNode("local_gas_station")), React.createElement("div", { "data-doc-primitive": "route-line" }), React.createElement("div", { "data-doc-primitive": "primitive-map-label", "data-map-label": "" }, stateString(states, active)))];
    }
    if (resolvedType === "message") {
      return (cards ?? []).map((card, index) => React.createElement(Card, {
        key: card.title ?? `card-${index}`,
        title: card.title ?? "",
        detail: card.copy,
        status: card.eyebrow,
        actions: cardActions(card.actions),
        variant: "minimal",
        state: "default",
        fullWidth: true,
        density,
      } as CardProps));
    }
    if (resolvedType === "statGrid") {
      return (rows ?? []).map(([label, value]) => React.createElement(Card, {
        key: label,
        title: label,
        value,
        variant: "minimal",
        state: "default",
        composition: "stats",
        fullWidth: true,
        density,
      } as CardProps));
    }
    return (roles ?? []).map((role) => React.createElement("div", { key: role, "data-doc-primitive": "primitive-surface-role-demo", "data-inverse": role === "inverse" ? "true" : undefined }, React.createElement("div", { "data-doc-primitive": "primitive-surface-role-label" }, role)));
  }, [action, active, cards, choices, code, controls, copy, density, icons, initialLabel, items, labels, roles, rows, resolvedType, sample, sampleCode, samples, states, staticSamples, targetLabel, title]);

  return React.createElement(
    Surface,
    {
      ...surface,
      ...flowRestProps(rest as DocumentationPrimitiveDemoRestProps),
      ...rootData,
      ref,
      surfaceRole: "section",
      density,
      elevation: surface?.elevation ?? "none",
      tone: surface?.tone ?? "default",
      state,
      "aria-label": rest["aria-label"] ?? ariaLabel,
      "data-flow-pattern": "documentation-primitive-demo",
      "data-documentation-primitive-demo-type": resolvedType,
      "data-doc-primitive": "primitive-demo",
      "data-doc-class": className || undefined,
    } as ComponentProps<typeof Surface>,
    body,
  );
}) as DocumentationPrimitiveDemoComponent;

DocumentationPrimitiveDemo.displayName = "DocumentationPrimitiveDemo";
