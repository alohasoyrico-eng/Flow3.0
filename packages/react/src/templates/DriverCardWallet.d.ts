import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import type { CardSummaryProps } from "../CardSummary.js";
import type { MovementRowProps } from "../MovementRow.js";
import type { QuickActionsGridAction, QuickActionsGridActionIntent, QuickActionsGridActionMeta, QuickActionsGridActionState, QuickActionsGridActionVariant } from "../patterns/QuickActionsGrid.js";
import type { SurfaceDensity, SurfaceTone } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DriverCardWalletState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type DriverCardWalletDensity = SurfaceDensity;
export type DriverCardWalletSection = "card" | "movements" | "limits" | "help" | (string & {});
export type DriverCardWalletActionVariant = QuickActionsGridActionVariant;
export type DriverCardWalletActionState = QuickActionsGridActionState;
export type DriverCardWalletActionIntent = QuickActionsGridActionIntent;

export interface DriverCardWalletSectionItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export type DriverCardWalletActionMeta = QuickActionsGridActionMeta;

export interface DriverCardWalletAction extends QuickActionsGridAction {
  key?: string;
}

export interface DriverCardWalletMovement extends MovementRowProps {
  key?: string;
}

export interface DriverCardWalletProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DriverCardWalletDensity;
  tone?: SurfaceTone;
  state?: DriverCardWalletState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedSection?: DriverCardWalletSection;
  defaultSelectedSection?: DriverCardWalletSection;
  onSelectedSectionChange?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  card?: Partial<CardSummaryProps>;
  actions?: DriverCardWalletAction[];
  movements?: DriverCardWalletMovement[];
  sections?: DriverCardWalletSectionItem[];
  dispute?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DriverCardWalletComponent extends ForwardRefExoticComponent<DriverCardWalletProps & RefAttributes<HTMLDivElement>> {
  displayName: "DriverCardWallet";
}

export const DriverCardWallet: DriverCardWalletComponent;
