import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import type { listPlatformContract } from "../../components/src/platforms/index.js";

export type ListVariant = "standard" | "compact" | "action" | "status" | "media";
export type ListState = "default" | "hover" | "selected" | "loading" | "error" | "disabled";
export type ListDensity = "sm" | "md" | "lg";

export interface ListItem {
  key?: string;
  label?: ReactNode;
  meta?: ReactNode;
  value?: ReactNode;
  icon?: string;
  state?: ListState | string;
  tone?: string;
  disabled?: boolean;
}

export interface ListProps extends Omit<HTMLAttributes<HTMLUListElement>, "onSelect"> {
  items: ListItem[];
  variant?: ListVariant;
  state?: ListState;
  interactive?: boolean;
  label?: string;
  density?: ListDensity;
  onSelect?: (key: string) => void;
}

export interface ListComponent extends ForwardRefExoticComponent<ListProps & RefAttributes<HTMLUListElement>> {
  platformContract: typeof listPlatformContract;
}

export const List: ListComponent;
