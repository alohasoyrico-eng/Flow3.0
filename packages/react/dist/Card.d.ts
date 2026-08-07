import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, ReactNode, RefAttributes } from "react";
import type { cardPlatformContract } from "#flow/platforms";
import type { ButtonProps } from "./Button.js";
import type { IconButtonProps } from "./IconButton.js";

export type CardVariant = "default" | "minimal" | "elevated" | "ghost";
export type CardComposition = "standard" | "compact" | "media" | "stats";
export type CardState = "default" | "hover" | "focus" | "selected" | "loading" | "error" | "disabled" | "muted" | "interactive";
export type CardDensity = "sm" | "md" | "lg";
export type CardTrend = "up" | "down" | "neutral";
export type CardAction = (ButtonProps | (IconButtonProps & { iconOnly?: boolean })) & { key?: string };

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "title" | "onAction" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  title: ReactNode;
  value?: ReactNode;
  unit?: string;
  detail?: ReactNode;
  status?: ReactNode;
  trend?: CardTrend;
  icon?: string;
  media?: string;
  mediaAlt?: string;
  variant?: CardVariant;
  composition?: CardComposition;
  state?: CardState;
  density?: CardDensity;
  fullWidth?: boolean;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  actionKey?: string;
  actions?: CardAction[];
  onAction?: (key: string, action?: CardAction, event?: MouseEvent<HTMLElement>) => void;
}

export interface CardComponent extends ForwardRefExoticComponent<CardProps & RefAttributes<HTMLElement>> {
  displayName: "Card";
  platformContract: typeof cardPlatformContract;
}

export const Card: CardComponent;
