import React, { forwardRef, useMemo, useState } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, ReactNode, RefAttributes } from "react";
import { paginationPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";

export type PaginationVariant = "numbered";
export type PaginationState = "default" | "hover" | "focus" | "selected" | "disabled";
export type PaginationDensity = "sm" | "md" | "lg";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
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

interface PaginationButtonProps {
  label: string;
  children?: ReactNode;
  icon?: string;
  kind: "prev" | "next" | "page";
  page?: number;
  current?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PaginationComponent extends ForwardRefExoticComponent<PaginationProps & RefAttributes<HTMLElement>> {
  displayName: "Pagination";
  platformContract: typeof paginationPlatformContract;
}

const allowedStates = new Set<PaginationState>(["default", "hover", "focus", "selected", "disabled"]);

function normalizePage(page: number | undefined, pageCount: number) {
  const totalPages = Math.max(1, Number(pageCount) || 1);
  const currentPage = Math.max(1, Math.min(Number(page) || 1, totalPages));
  return { currentPage, totalPages };
}

function resolvePaginationItems(page: number, pages: number): Array<number | "..."> {
  const items: Array<number | "..."> = [];
  for (let index = 1; index <= pages; index += 1) {
    if (index === 1 || index === pages || Math.abs(index - page) <= 1) {
      items.push(index);
    } else if (items[items.length - 1] !== "...") {
      items.push("...");
    }
  }
  return items;
}

function PaginationButton({ label, children, icon, kind, page, current = false, disabled = false, onClick }: PaginationButtonProps) {
  if (!label) return null;
  return React.createElement(
    "button",
    {
      className: "pagination__button",
      type: "button",
      "data-kind": kind,
      ...flowStateProps(current ? "selected" : "default"),
      "data-page": page ? String(page) : undefined,
      disabled,
      "aria-current": current ? "page" : undefined,
      "aria-label": label,
      onClick,
    },
    icon
      ? React.createElement("span", { className: "pagination__icon", "aria-hidden": "true" }, icon)
      : children ?? label,
  );
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({
  page,
  pageCount,
  label,
  previousLabel,
  nextLabel,
  getPageLabel,
  variant = "numbered",
  state = "default",
  density,
  fullWidth = false,
  disabled = false,
  onPageChange,
  className = "",
  ...rest
}, ref) {
  const isPageControlled = page !== undefined;
  const normalized = useMemo(() => normalizePage(page ?? 1, pageCount), [page, pageCount]);
  const [internalPage, setInternalPage] = useState(normalized.currentPage);
  const currentPage = isPageControlled ? normalized.currentPage : internalPage;
  const resolvedState = disabled ? "disabled" : allowedStates.has(state) ? state : "default";
  const resolvedVariant: PaginationVariant = "numbered";
  const totalPages = normalized.totalPages;

  const visibleItems = useMemo(
    () => resolvePaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );
  const hasLabels = Boolean(label && previousLabel && nextLabel && typeof getPageLabel === "function");
  const hasPages = Number(pageCount) >= 1;
  const resolvedDensity = normalizeFlowDensity(density);

  if (!hasLabels || !hasPages) return null;

  const requestPage = (nextPage: number, event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const next = normalizePage(nextPage, totalPages).currentPage;
    if (next === currentPage) return;
    if (!isPageControlled) setInternalPage(next);
    if (typeof onPageChange === "function") onPageChange(next, event);
  };

  return React.createElement(
    "nav",
    {
      ...flowRestProps(rest),
      ref,
      className: ["pagination", className].filter(Boolean).join(" "),
      "aria-label": label,
      "aria-disabled": disabled ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-page": String(currentPage),
      "data-page-count": String(totalPages),
      "data-full-width": fullWidth ? "true" : undefined,
    },
    React.createElement(PaginationButton, {
      icon: "chevron_left",
      label: previousLabel,
      kind: "prev",
      disabled: disabled || currentPage <= 1,
      onClick: (event) => requestPage(currentPage - 1, event),
    }),
    visibleItems.map((item, index) => item === "..."
      ? React.createElement(
          "span",
          {
            key: `ellipsis-${index}`,
            className: "pagination__ellipsis",
            "aria-hidden": "true",
          },
          "...",
        )
      : React.createElement(PaginationButton, {
          key: item,
          label: getPageLabel(item),
          children: String(item),
          kind: "page",
          page: item,
          current: item === currentPage,
          disabled,
          onClick: (event) => requestPage(item, event),
        })),
    React.createElement(PaginationButton, {
      icon: "chevron_right",
      label: nextLabel,
      kind: "next",
      disabled: disabled || currentPage >= totalPages,
      onClick: (event) => requestPage(currentPage + 1, event),
    }),
  );
}) as PaginationComponent;

Pagination.displayName = "Pagination";
Pagination.platformContract = paginationPlatformContract;
