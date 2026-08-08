import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import type { listPlatformContract } from "@design-system/components/platforms";

export type ListVariant = "standard" | "compact" | "action" | "status" | "media";
export type ListState = "default" | "hover" | "selected" | "loading" | "error" | "disabled";
export type ListDensity = "sm" | "md" | "lg";
export type ListItemTone = "danger";

export interface ListItem {
  key: string;
  label: ReactNode;
  meta?: ReactNode;
  value?: ReactNode;
  icon?: string;
  state?: ListState;
  tone?: ListItemTone;
  disabled?: boolean;
}

export interface ListProps extends Omit<HTMLAttributes<HTMLUListElement>, "style" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  items: ListItem[];
  variant?: ListVariant;
  state?: ListState;
  interactive?: boolean;
  label?: string;
  selectedKey?: string;
  density?: ListDensity;
  onSelect?: (key: string) => void;
}

export interface ListComponent extends ForwardRefExoticComponent<ListProps & RefAttributes<HTMLUListElement>> {
  displayName: "List";
  platformContract: typeof listPlatformContract;
}

export const List: ListComponent;
