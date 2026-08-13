import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import { Skeleton } from "../Skeleton.js";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceElevation, SurfaceProps, SurfaceTone } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

export type DemoPreviewFrameState = "default" | "interactive" | "static" | "viewport-mobile" | "viewport-desktop" | "loading" | "error" | "unsupported";
export type DemoPreviewFrameKind = "demo" | "viewport" | "playground" | "template" | "specimen";
export type DemoPreviewFrameDensity = SurfaceDensity;
export type DemoPreviewFrameTone = SurfaceTone | "info";

export interface DemoPreviewFrameFallback extends Pick<ErrorPanelProps, "label" | "description" | "action" | "icon"> {
  tone?: ErrorPanelProps["tone"];
}

export interface DemoPreviewFrameProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  kind?: DemoPreviewFrameKind;
  state?: DemoPreviewFrameState;
  density?: DemoPreviewFrameDensity;
  tone?: DemoPreviewFrameTone;
  elevation?: SurfaceElevation;
  compact?: boolean;
  fullWidth?: boolean;
  preview?: ReactNode;
  controls?: ReactNode;
  source?: ReactNode;
  fallback?: DemoPreviewFrameFallback;
  children?: ReactNode;
  surface?: Omit<SurfaceProps, "children" | "density" | "tone" | "elevation" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DemoPreviewFrameComponent extends ForwardRefExoticComponent<DemoPreviewFrameProps & RefAttributes<HTMLDivElement>> {
  displayName: "DemoPreviewFrame";
}

type DemoPreviewFrameRestProps = Record<string, unknown>;

const validStates = new Set<DemoPreviewFrameState>(["default", "interactive", "static", "viewport-mobile", "viewport-desktop", "loading", "error", "unsupported"]);
const validKinds = new Set<DemoPreviewFrameKind>(["demo", "viewport", "playground", "template", "specimen"]);
const validTones = new Set<DemoPreviewFrameTone>(["default", "muted", "selected", "danger", "warning", "success", "info"]);

function sanitizeRestProps(rest: DemoPreviewFrameRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(flowRestProps(rest)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveKind(kind: DemoPreviewFrameKind | undefined): DemoPreviewFrameKind {
  return kind && validKinds.has(kind) ? kind : "demo";
}

function resolveState(state: DemoPreviewFrameState | undefined, kind: DemoPreviewFrameKind, controls?: ReactNode, source?: ReactNode): DemoPreviewFrameState {
  if (state && validStates.has(state)) return state;
  if (kind === "viewport") return "viewport-desktop";
  if (kind === "playground" || controls || source) return "interactive";
  return "default";
}

function resolveTone(tone: DemoPreviewFrameTone | undefined, state: DemoPreviewFrameState): SurfaceTone {
  if (tone === "info") return "selected";
  if (tone && validTones.has(tone)) return tone;
  if (state === "error") return "danger";
  if (state === "unsupported") return "warning";
  return "muted";
}

function renderFallback(state: DemoPreviewFrameState, fallback: DemoPreviewFrameFallback | undefined, density: DemoPreviewFrameDensity | undefined) {
  if (state === "loading") {
    return React.createElement(Skeleton, {
      label: fallback?.label ?? "Loading demo preview",
      variant: "card",
      density,
      fullWidth: true,
      busy: true,
      state: "loading",
      "data-flow-slot": "demo-preview-frame.fallback",
    } as ComponentProps<typeof Skeleton>);
  }

  if (state !== "error" && state !== "unsupported") return null;

  return React.createElement(ErrorPanel, {
    label: fallback?.label ?? (state === "unsupported" ? "Demo not supported" : "Demo failed to load"),
    description: fallback?.description,
    action: fallback?.action,
    tone: fallback?.tone ?? (state === "unsupported" ? "warning" : "error"),
    variant: "panel",
    state: state === "unsupported" ? "warning" : "error",
    density,
    fullWidth: true,
    icon: fallback?.icon,
    "data-flow-slot": "demo-preview-frame.fallback",
  } as ComponentProps<typeof ErrorPanel>);
}

export const DemoPreviewFrame = forwardRef<HTMLDivElement, DemoPreviewFrameProps>(function DemoPreviewFrame({
  label = "Demo preview",
  description,
  kind,
  state,
  density,
  tone,
  elevation = "none",
  compact = false,
  fullWidth = false,
  preview,
  controls,
  source,
  fallback,
  children,
  surface,
  className = "",
  ...rest
}, ref) {
  const resolvedKind = resolveKind(kind);
  const resolvedState = resolveState(state, resolvedKind, controls, source);
  const resolvedTone = resolveTone(tone, resolvedState);
  const fallbackNode = renderFallback(resolvedState, fallback, density);
  const previewContent = fallbackNode ?? preview ?? children;

  return React.createElement(
    Surface,
    {
      ...surface,
      ...sanitizeRestProps(rest),
      ref,
      className: ["demo-preview-frame", className].filter(Boolean).join(" "),
      surfaceRole: "panel",
      density,
      elevation,
      tone: resolvedTone,
      state: resolvedState === "loading" ? "disabled" : "default",
      "aria-label": rest["aria-label"] ?? label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "demo-preview-frame",
      "data-demo-preview-frame-kind": resolvedKind,
      "data-demo-preview-frame-state": resolvedState,
      "data-demo-preview-frame-compact": String(Boolean(compact)),
      "data-demo-preview-frame-full-width": String(Boolean(fullWidth)),
    } as ComponentProps<typeof Surface>,
    label || description
      ? React.createElement(
        "header",
        { "data-flow-slot": "demo-preview-frame.header" },
        label ? React.createElement("strong", null, label) : null,
        description ? React.createElement("p", null, description) : null,
      )
      : null,
    controls
      ? React.createElement(
        "div",
        { "data-flow-slot": "demo-preview-frame.controls" },
        controls,
      )
      : null,
    React.createElement(
      "div",
      { "data-flow-slot": "demo-preview-frame.preview" },
      previewContent,
    ),
    source
      ? React.createElement(
        "div",
        { "data-flow-slot": "demo-preview-frame.source" },
        source,
      )
      : null,
  );
}) as DemoPreviewFrameComponent;

DemoPreviewFrame.displayName = "DemoPreviewFrame";
