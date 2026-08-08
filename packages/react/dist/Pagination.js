import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { paginationPlatformContract } from "#flow/platforms";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps } from "./internal/props.js";

const allowedStates = new Set(["default", "hover", "focus", "selected", "disabled"]);

function normalizePage(page, pageCount) {
  const totalPages = Math.max(1, Number(pageCount) || 1);
  const currentPage = Math.max(1, Math.min(Number(page) || 1, totalPages));
  return { currentPage, totalPages };
}

function resolvePaginationItems(page, pages) {
  const items = [];
  for (let index = 1; index <= pages; index += 1) {
    if (index === 1 || index === pages || Math.abs(index - page) <= 1) {
      items.push(index);
    } else if (items[items.length - 1] !== "...") {
      items.push("...");
    }
  }
  return items;
}

function PaginationButton({ label, ariaLabel, icon, kind, page, current = false, disabled = false, onClick }) {
  if (!label && !ariaLabel) return null;
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
      "aria-label": ariaLabel || undefined,
      onClick,
    },
    icon
      ? React.createElement("span", { className: "pagination__icon", "aria-hidden": "true" }, icon)
      : label,
  );
}

export const Pagination = forwardRef(function Pagination({
  page,
  pageCount = 1,
  label = "",
  previousLabel = "",
  nextLabel = "",
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
  const [currentPage, setCurrentPage] = useState(normalized.currentPage);
  const resolvedState = disabled ? "disabled" : allowedStates.has(state) ? state : "default";
  const resolvedVariant = "numbered";
  const totalPages = normalized.totalPages;

  useEffect(() => {
    if (isPageControlled) setCurrentPage(normalized.currentPage);
  }, [isPageControlled, normalized.currentPage]);

  const visibleItems = useMemo(
    () => resolvePaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const requestPage = (nextPage) => {
    if (disabled) return;
    const next = normalizePage(nextPage, totalPages).currentPage;
    if (next === currentPage) return;
    if (!isPageControlled) setCurrentPage(next);
    if (typeof onPageChange === "function") onPageChange(next);
  };

  return React.createElement(
    "nav",
    {
      ...flowRestProps(rest),
      ref,
      className: ["pagination", className].filter(Boolean).join(" "),
      "aria-label": label || undefined,
      "aria-disabled": disabled ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      "data-page": String(currentPage),
      "data-page-count": String(totalPages),
      "data-full-width": fullWidth ? "true" : undefined,
    },
    React.createElement(PaginationButton, {
      icon: "chevron_left",
      label: previousLabel,
      ariaLabel: previousLabel,
      kind: "prev",
      disabled: disabled || currentPage <= 1,
      onClick: () => requestPage(currentPage - 1),
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
          label: String(item),
          ariaLabel: typeof getPageLabel === "function" ? getPageLabel(item) : undefined,
          kind: "page",
          page: item,
          current: item === currentPage,
          disabled,
          onClick: () => requestPage(item),
        })),
    React.createElement(PaginationButton, {
      icon: "chevron_right",
      label: nextLabel,
      ariaLabel: nextLabel,
      kind: "next",
      disabled: disabled || currentPage >= totalPages,
      onClick: () => requestPage(currentPage + 1),
    }),
  );
});

Pagination.displayName = "Pagination";
Pagination.platformContract = paginationPlatformContract;
