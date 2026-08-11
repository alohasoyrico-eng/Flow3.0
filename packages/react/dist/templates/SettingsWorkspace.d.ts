import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { TabsItem } from "../Tabs.js";
import type { PreferenceManagementProps } from "../patterns/PreferenceManagement.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SettingsWorkspaceState = "loaded" | "loading" | "dirty" | "saving" | "danger-confirming" | "permission" | "error" | "offline" | "disabled";
export type SettingsWorkspaceDensity = SurfaceDensity;
export type SettingsWorkspaceSection = "profile" | "notifications" | "theme" | "danger" | (string & {});

export interface SettingsWorkspaceSectionItem extends TabsItem {
  key: SettingsWorkspaceSection;
}

export interface SettingsWorkspaceProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: SettingsWorkspaceDensity;
  tone?: SurfaceTone;
  state?: SettingsWorkspaceState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  dirty?: boolean;
  saving?: boolean;
  dangerConfirming?: boolean;
  selectedSection?: SettingsWorkspaceSection;
  defaultSelectedSection?: SettingsWorkspaceSection;
  onSelectedSectionChange?: (key: string, section: SettingsWorkspaceSectionItem, event: MouseEvent<HTMLButtonElement>) => void;
  sections?: SettingsWorkspaceSectionItem[];
  preferences?: PreferenceManagementProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SettingsWorkspaceComponent extends ForwardRefExoticComponent<SettingsWorkspaceProps & RefAttributes<HTMLDivElement>> {
  displayName: "SettingsWorkspace";
}

export const SettingsWorkspace: SettingsWorkspaceComponent;
