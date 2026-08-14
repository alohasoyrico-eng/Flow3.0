import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { SurfaceDensity, SurfaceElevation, SurfaceProps, SurfaceTone } from "../Surface.js";
import type { TagProps } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SectionHeaderHeadingLevel } from "./SectionHeader.js";

export type DocumentationHeroState = "default" | "with-actions" | "with-metadata" | "with-status" | "loading" | "dark" | "mobile";
export type DocumentationHeroDensity = SurfaceDensity;
export type DocumentationHeroTone = SurfaceTone | "brand";
export type DocumentationHeroBackground = "none" | "tint" | "gradient-grid";
export type DocumentationHeroMetadataKind = "badge" | "tag";

export interface DocumentationHeroMetadata extends FlowDataAttributes {
  key?: string;
  label: string;
  value?: string;
  kind?: DocumentationHeroMetadataKind;
  tone?: BadgeProps["tone"] | TagProps["tone"];
  variant?: BadgeProps["variant"] | TagProps["variant"];
  icon?: string;
}

export interface DocumentationHeroAction extends ButtonProps {
  key?: string;
  href?: string;
}

export interface DocumentationHeroProps extends FlowDataAttributes {
  kicker?: string;
  title: string;
  description?: string;
  headingLevel?: SectionHeaderHeadingLevel;
  metadata?: DocumentationHeroMetadata[];
  actions?: DocumentationHeroAction[];
  visual?: ReactNode;
  children?: ReactNode;
  density?: DocumentationHeroDensity;
  tone?: DocumentationHeroTone;
  elevation?: SurfaceElevation;
  state?: DocumentationHeroState;
  loading?: boolean;
  background?: DocumentationHeroBackground;
  surface?: Omit<SurfaceProps, "children" | "density" | "tone" | "elevation" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationHeroComponent extends ForwardRefExoticComponent<DocumentationHeroProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationHero";
}

export const DocumentationHero: DocumentationHeroComponent;
