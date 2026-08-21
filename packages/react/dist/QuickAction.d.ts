import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  MouseEvent,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { quickActionPlatformContract } from "#flow/platforms";

export type QuickActionVariant = "standard" | "compact" | "wide";
export type QuickActionState = "default" | "hover" | "focus" | "pressed" | "loading" | "warning" | "disabled";
export type QuickActionDensity = "sm" | "md" | "lg";
export type QuickActionIntent = "default" | "danger" | "warning";

export interface QuickActionMeta {
  label: string;
  variant: QuickActionVariant;
  intent: QuickActionIntent;
  state: QuickActionState;
}

export interface QuickActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  icon?: string;
  badge?: string;
  variant?: QuickActionVariant;
  state?: QuickActionState;
  intent?: QuickActionIntent;
  density?: QuickActionDensity;
  loading?: boolean;
  disabled?: boolean;
  onAction?: (meta: QuickActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface QuickActionComponent extends ForwardRefExoticComponent<QuickActionProps & RefAttributes<HTMLButtonElement>> {
  displayName: "QuickAction";
  platformContract: typeof quickActionPlatformContract;
}

export const QuickAction: QuickActionComponent;
