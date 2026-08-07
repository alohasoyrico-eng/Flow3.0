import type {
  HTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { cardSummaryPlatformContract } from "#flow/platforms";

export type CardSummaryVariant = "physical" | "virtual" | "compact" | "limit";
export type CardSummaryState = "default" | "hover" | "focus" | "active" | "warning" | "frozen" | "disabled";
export type CardSummaryDensity = "sm" | "md" | "lg";

export interface CardSummaryMetric {
  key?: string;
  label: string;
  value: string;
}

export interface CardSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  label: string;
  meta?: string;
  number?: string;
  expires?: string;
  status?: string;
  metrics?: CardSummaryMetric[];
  variant?: CardSummaryVariant;
  state?: CardSummaryState;
  density?: CardSummaryDensity;
  icon?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export interface CardSummaryComponent extends ForwardRefExoticComponent<CardSummaryProps & RefAttributes<HTMLElement>> {
  displayName: "CardSummary";
  platformContract: typeof cardSummaryPlatformContract;
}

export const CardSummary: CardSummaryComponent;
