import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { quickActionPlatformContract } from "@design-system/components/platforms";

export type QuickActionVariant = "standard" | "destructive" | "compact" | "wide";
export type QuickActionState = "default" | "hover" | "focus" | "pressed" | "loading" | "warning" | "disabled";
export type QuickActionDensity = "sm" | "md" | "lg";
export type QuickActionTone = "neutral" | "danger";

export interface QuickActionMeta {
  label: string;
  variant: QuickActionVariant;
  state: QuickActionState;
}

export interface QuickActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: string;
  badge?: string;
  variant?: QuickActionVariant;
  state?: QuickActionState;
  density?: QuickActionDensity;
  loading?: boolean;
  disabled?: boolean;
  tone?: QuickActionTone;
  onAction?: (meta: QuickActionMeta) => void;
}

export interface QuickActionComponent extends ForwardRefExoticComponent<QuickActionProps & RefAttributes<HTMLButtonElement>> {
  displayName: "QuickAction";
  platformContract: typeof quickActionPlatformContract;
}

export const QuickAction: QuickActionComponent;
