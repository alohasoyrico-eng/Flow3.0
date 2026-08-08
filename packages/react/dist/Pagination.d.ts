import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { paginationPlatformContract } from "#flow/platforms";

export type PaginationVariant = "numbered";
export type PaginationState = "default" | "hover" | "focus" | "selected" | "disabled";
export type PaginationDensity = "sm" | "md" | "lg";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  page?: number;
  pageCount: number;
  label: string;
  previousLabel: string;
  nextLabel: string;
  getPageLabel: (page: number) => string;
  variant?: PaginationVariant;
  state?: PaginationState;
  density?: PaginationDensity;
  fullWidth?: boolean;
  disabled?: boolean;
  onPageChange?: (page: number, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PaginationComponent extends ForwardRefExoticComponent<PaginationProps & RefAttributes<HTMLElement>> {
  displayName: "Pagination";
  platformContract: typeof paginationPlatformContract;
}

export const Pagination: PaginationComponent;
