import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { movementRowPlatformContract } from "@design-system/components/platforms";

export type MovementRowVariant = "standard" | "refund" | "declined" | "compact";
export type MovementRowState = "default" | "hover" | "focus" | "pending" | "error" | "disabled";
export type MovementRowDensity = "sm" | "md" | "lg";
export type MovementRowCategory = "fuel" | "charge" | "toll" | "food" | "transfer" | "income";

export interface MovementRowMeta {
  label: string;
  meta: string;
  amount: string;
  status: string;
  category: MovementRowCategory;
  variant: MovementRowVariant;
  state: MovementRowState;
}

export interface MovementRowProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  label: string;
  meta?: string;
  amount?: string;
  status?: string;
  category?: MovementRowCategory;
  variant?: MovementRowVariant;
  state?: MovementRowState;
  density?: MovementRowDensity;
  fullWidth?: boolean;
  disabled?: boolean;
  onSelect?: (meta: MovementRowMeta) => void;
}

export interface MovementRowComponent extends ForwardRefExoticComponent<MovementRowProps & RefAttributes<HTMLButtonElement>> {
  displayName: "MovementRow";
  platformContract: typeof movementRowPlatformContract;
}

export const MovementRow: MovementRowComponent;
