/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useMemo, useState } from "react";
import { paginationPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const allowedStates = new Set(["default", "hover", "focus", "selected", "disabled"]);
const defaultPaginationLabel = "Paginación";
const defaultPreviousLabel = "Página anterior";
const defaultNextLabel = "Página siguiente";
const defaultFirstLabel = "Primera página";
const defaultLastLabel = "Última página";
const defaultPreviousJumpLabel = (jumpSize) => `Retroceder ${jumpSize} páginas`;
const defaultNextJumpLabel = (jumpSize) => `Avanzar ${jumpSize} páginas`;
const defaultGetPageLabel = (page) => `Página ${page}`;
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
        }
        else if (items[items.length - 1] !== "...") {
            items.push("...");
        }
    }
    return items;
}
function PaginationButton({ label, children, icon, kind, page, current = false, disabled = false, onClick }) {
    if (!label)
        return null;
    return React.createElement("button", {
        className: "pagination__button",
        type: "button",
        "data-kind": kind,
        ...flowStateProps(current ? "selected" : "default"),
        "data-page": page ? String(page) : undefined,
        disabled,
        "aria-current": current ? "page" : undefined,
        "aria-label": label,
        onClick,
    }, icon
        ? React.createElement("span", { className: "pagination__icon", "aria-hidden": "true" }, icon)
        : children ?? label);
}
export const Pagination = forwardRef(function Pagination({ page, pageCount, pages, label = defaultPaginationLabel, previousLabel = defaultPreviousLabel, nextLabel = defaultNextLabel, firstLabel = defaultFirstLabel, lastLabel = defaultLastLabel, previousJumpLabel, nextJumpLabel, getPageLabel = defaultGetPageLabel, variant = "numbered", jumpSize = 10, state = "default", density, fullWidth = false, disabled = false, onPageChange, onKeyDown, tabIndex, className = "", ...rest }, ref) {
    const isPageControlled = page !== undefined;
    const resolvedPageCount = pageCount ?? pages ?? 1;
    const normalized = useMemo(() => normalizePage(page ?? 1, resolvedPageCount), [page, resolvedPageCount]);
    const [internalPage, setInternalPage] = useState(normalized.currentPage);
    const currentPage = isPageControlled ? normalized.currentPage : internalPage;
    const resolvedState = disabled ? "disabled" : allowedStates.has(state) ? state : "default";
    const resolvedVariant = variant === "jump" ? "jump" : "numbered";
    const totalPages = normalized.totalPages;
    const resolvedJumpSize = Math.max(1, Math.floor(Number(jumpSize) || 10));
    const visibleItems = useMemo(() => resolvePaginationItems(currentPage, totalPages), [currentPage, totalPages]);
    const hasPages = Number(resolvedPageCount) >= 1;
    const resolvedDensity = normalizeFlowDensity(density);
    if (!hasPages)
        return null;
    const requestPage = (nextPage, event) => {
        if (disabled)
            return;
        const next = normalizePage(nextPage, totalPages).currentPage;
        if (next === currentPage)
            return;
        if (!isPageControlled)
            setInternalPage(next);
        if (typeof onPageChange === "function")
            onPageChange(next, event);
    };
    const handleKeyDown = (event) => {
        if (typeof onKeyDown === "function")
            onKeyDown(event);
        if (event.defaultPrevented || disabled)
            return;
        const keyTargets = {
            ArrowLeft: currentPage - 1,
            ArrowRight: currentPage + 1,
            Home: 1,
            End: totalPages,
        };
        if (resolvedVariant === "jump") {
            keyTargets.PageUp = currentPage - resolvedJumpSize;
            keyTargets.PageDown = currentPage + resolvedJumpSize;
        }
        const nextPage = keyTargets[event.key];
        if (nextPage === undefined)
            return;
        event.preventDefault();
        requestPage(nextPage, event);
        event.currentTarget.focus({ preventScroll: true });
    };
    return React.createElement("nav", {
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
        tabIndex: disabled ? undefined : tabIndex ?? -1,
        onKeyDown: handleKeyDown,
    }, resolvedVariant === "jump" && React.createElement(PaginationButton, {
        icon: "first_page",
        label: firstLabel,
        kind: "prev",
        disabled: disabled || currentPage <= 1,
        onClick: (event) => requestPage(1, event),
    }), resolvedVariant === "jump" && React.createElement(PaginationButton, {
        icon: "keyboard_double_arrow_left",
        label: previousJumpLabel ?? defaultPreviousJumpLabel(resolvedJumpSize),
        kind: "prev",
        disabled: disabled || currentPage <= 1,
        onClick: (event) => requestPage(currentPage - resolvedJumpSize, event),
    }), React.createElement(PaginationButton, {
        icon: "chevron_left",
        label: previousLabel,
        kind: "prev",
        disabled: disabled || currentPage <= 1,
        onClick: (event) => requestPage(currentPage - 1, event),
    }), visibleItems.map((item, index) => item === "..."
        ? React.createElement("span", {
            key: `ellipsis-${index}`,
            className: "pagination__ellipsis",
            "aria-hidden": "true",
        }, "...")
        : React.createElement(PaginationButton, {
            key: item,
            label: getPageLabel(item),
            children: String(item),
            kind: "page",
            page: item,
            current: item === currentPage,
            disabled,
            onClick: (event) => requestPage(item, event),
        })), React.createElement(PaginationButton, {
        icon: "chevron_right",
        label: nextLabel,
        kind: "next",
        disabled: disabled || currentPage >= totalPages,
        onClick: (event) => requestPage(currentPage + 1, event),
    }), resolvedVariant === "jump" && React.createElement(PaginationButton, {
        icon: "keyboard_double_arrow_right",
        label: nextJumpLabel ?? defaultNextJumpLabel(resolvedJumpSize),
        kind: "next",
        disabled: disabled || currentPage >= totalPages,
        onClick: (event) => requestPage(currentPage + resolvedJumpSize, event),
    }), resolvedVariant === "jump" && React.createElement(PaginationButton, {
        icon: "last_page",
        label: lastLabel,
        kind: "next",
        disabled: disabled || currentPage >= totalPages,
        onClick: (event) => requestPage(totalPages, event),
    }));
});
Pagination.displayName = "Pagination";
Pagination.platformContract = paginationPlatformContract;
