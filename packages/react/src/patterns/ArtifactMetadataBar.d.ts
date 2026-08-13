import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { ChipProps } from "../Chip.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { TagProps } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type ArtifactMetadataBarState = "default" | "compact" | "overflow" | "interactive" | "loading" | "empty";
export type ArtifactMetadataBarDensity = SurfaceDensity;
export type ArtifactMetadataBarItemKind = "tag" | "badge" | "chip";

export interface ArtifactMetadataBarItem extends FlowDataAttributes {
  key?: string;
  label: string;
  value?: string;
  kind?: ArtifactMetadataBarItemKind;
  tone?: TagProps["tone"] | BadgeProps["tone"] | ChipProps["tone"];
  variant?: TagProps["variant"] | BadgeProps["variant"] | ChipProps["variant"];
  icon?: string;
  explanation?: string;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface ArtifactMetadataBarAction extends ButtonProps {
  key?: string;
}

export interface ArtifactMetadataBarProps extends FlowDataAttributes {
  label?: string;
  items?: ArtifactMetadataBarItem[];
  actions?: ArtifactMetadataBarAction[];
  density?: ArtifactMetadataBarDensity;
  state?: ArtifactMetadataBarState;
  compact?: boolean;
  loading?: boolean;
  emptyLabel?: string;
  children?: ReactNode;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ArtifactMetadataBarComponent extends ForwardRefExoticComponent<ArtifactMetadataBarProps & RefAttributes<HTMLDivElement>> {
  displayName: "ArtifactMetadataBar";
}

export const ArtifactMetadataBar: ArtifactMetadataBarComponent;
