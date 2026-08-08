import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  MouseEvent,
  RefAttributes,
} from "react";
import type { movementRowPlatformContract } from "@design-system/components/platforms";

export type MovementRowVariant = "standard" | "refund" | "declined" | "compact";
export type MovementRowState = "default" | "hover" | "focus" | "pending" | "error" | "disabled";
export type MovementRowDensity = "sm" | "md" | "lg";
export type MovementRowCategory = "fuel" | "charge" | "toll" | "food" | "transfer" | "income";

export interface MovementRowMeta {
  label: string;
  meta?: string;
  amount?: string;
  status?: string;
  category: MovementRowCategory;
  variant: MovementRowVariant;
  state: MovementRowState;
}

export interface MovementRowProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
  type?: "button" | "submit" | "reset";
  onSelect?: (meta: MovementRowMeta, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface MovementRowComponent extends ForwardRefExoticComponent<MovementRowProps & RefAttributes<HTMLElement>> {
  displayName: "MovementRow";
  platformContract: typeof movementRowPlatformContract;
}

export const MovementRow: MovementRowComponent;
