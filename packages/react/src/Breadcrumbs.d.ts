import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  MouseEvent,
  RefAttributes,
} from "react";
import { breadcrumbsPlatformContract } from "@design-system/components/platforms";

export type BreadcrumbsVariant = "standard" | "compact" | "overflow" | "mobile";
export type BreadcrumbsState = "default" | "hover" | "focus" | "collapsed" | "current" | "disabled";
export type BreadcrumbsDensity = "sm" | "md" | "lg";

export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
  current?: boolean;
  collapsed?: boolean;
  onClick?: (item: BreadcrumbItem, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onClick" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  items: BreadcrumbItem[];
  label?: string;
  maxItems?: number;
  separator?: string;
  density?: BreadcrumbsDensity;
  variant?: BreadcrumbsVariant;
  state?: BreadcrumbsState;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface BreadcrumbsComponent extends ForwardRefExoticComponent<BreadcrumbsProps & RefAttributes<HTMLElement>> {
  displayName: "Breadcrumbs";
  platformContract: typeof breadcrumbsPlatformContract;
}

export const Breadcrumbs: BreadcrumbsComponent;
