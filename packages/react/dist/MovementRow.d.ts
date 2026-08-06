import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { movementRowPlatformContract } from "../../components/src/platforms/index.js";

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

export interface MovementRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
