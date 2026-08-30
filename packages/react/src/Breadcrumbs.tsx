import React, { forwardRef, useMemo } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { breadcrumbsPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";

export type BreadcrumbsVariant = "standard" | "compact" | "overflow" | "mobile";
export type BreadcrumbsState = "default" | "hover" | "focus" | "collapsed" | "current" | "disabled";
export type BreadcrumbsDensity = "sm" | "md" | "lg";

export interface BreadcrumbItem {
  id?: string;
  label: string;
  icon?: string;
  iconOnly?: boolean;
  href?: string;
  current?: boolean;
  collapsed?: boolean;
  onClick?: (item: BreadcrumbItem, event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "onClick" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  items: BreadcrumbItem[];
  label?: string;
  collapsedLabel?: string;
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

const allowedVariants = new Set<BreadcrumbsVariant>(["standard", "compact", "overflow", "mobile"]);
const allowedStates = new Set<BreadcrumbsState>(["default", "hover", "focus", "collapsed", "current", "disabled"]);
const defaultBreadcrumbsLabel = "Ruta";
const defaultCollapsedLabel = "Rutas intermedias ocultas";

function resolveBreadcrumbItems(items: BreadcrumbItem[], { variant, maxItems, collapsedLabel }: { variant: BreadcrumbsVariant; maxItems?: number | undefined; collapsedLabel?: string | undefined }) {
  if (variant === "mobile" && items.length > 2) {
    const penultimate = items[items.length - 2];
    const last = items[items.length - 1];
    if (!penultimate || !last) return items;
    return [
      { ...penultimate, current: false },
      { ...last, current: true },
    ];
  }
  const limit = Number(maxItems ?? (variant === "overflow" ? 4 : items.length));
  if (!Number.isFinite(limit) || limit < 3 || items.length <= limit) return items;
  const head = items[0];
  if (!head) return items;
  const tailCount = Math.max(1, limit - 2);
  const tail = items.slice(-tailCount);
  return [
    { ...head, current: false },
    { id: "__collapsed", label: collapsedLabel ?? defaultCollapsedLabel, collapsed: true, current: false },
    ...tail.map((item, index) => ({ ...item, current: index === tail.length - 1 })),
  ];
}

function normalizeItems(items: BreadcrumbItem[] | undefined): BreadcrumbItem[] {
  const sourceItems = Array.isArray(items) ? items : [];
  const labeledItems = sourceItems.filter((item) => item?.label);
  return labeledItems.map((item, index) => ({
    ...item,
    label: item.label,
    current: Boolean(item.current) || index === labeledItems.length - 1,
  }));
}

function renderBreadcrumbContent(item: BreadcrumbItem) {
  return React.createElement(
    React.Fragment,
    null,
    item.icon
      ? React.createElement(
          "span",
          {
            className: "breadcrumbs__icon",
            "aria-hidden": "true",
          },
          item.icon,
        )
      : null,
    React.createElement(
      "span",
      { className: item.iconOnly ? "breadcrumbs__label breadcrumbs__label--hidden" : "breadcrumbs__label" },
      item.label,
    ),
  );
}

function breadcrumbTargetClassName(item: BreadcrumbItem) {
  return ["breadcrumbs__target", item.iconOnly ? "breadcrumbs__target--icon-only" : ""].filter(Boolean).join(" ");
}

function breadcrumbTargetAriaLabel(item: BreadcrumbItem) {
  return item.iconOnly ? item.label : undefined;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs({
  items,
  label = defaultBreadcrumbsLabel,
  collapsedLabel,
  variant = "standard",
  state = "default",
  density,
  maxItems,
  separator = "chevron_right",
  disabled = false,
  fullWidth = false,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = allowedVariants.has(variant) ? variant : "standard";
  const resolvedState = disabled ? "disabled" : allowedStates.has(state) ? state : "default";
  const visibleItems = useMemo(
    () => resolveBreadcrumbItems(normalizeItems(items), { variant: resolvedVariant, maxItems, collapsedLabel }),
    [items, maxItems, resolvedVariant, collapsedLabel],
  );
  const resolvedDensity = normalizeFlowDensity(density);

  if (!visibleItems.length) return null;

  return React.createElement(
    "nav",
    {
      ...flowRestProps(rest),
      ref,
      className: ["breadcrumbs", className].filter(Boolean).join(" "),
      "aria-label": label,
      "aria-disabled": disabled ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": fullWidth ? "true" : undefined,
    },
    React.createElement(
      "ol",
      null,
      visibleItems.map((item, index) => {
        const key = item.id ?? item.href ?? item.label;
        const isLast = index === visibleItems.length - 1;
        const hasAction = typeof item.onClick === "function";
        const target = item.collapsed
          ? React.createElement(
              "span",
              {
                className: "breadcrumbs__target breadcrumbs__target--collapsed",
                "aria-label": item.label,
              },
              "...",
              )
            : item.current || disabled || (!item.href && !hasAction)
            ? React.createElement(
                "span",
                {
                  className: breadcrumbTargetClassName(item),
                  "aria-label": breadcrumbTargetAriaLabel(item),
                  "aria-current": item.current ? "page" : undefined,
                },
                renderBreadcrumbContent(item),
              )
            : !item.href && hasAction
            ? React.createElement(
                "button",
                {
                  type: "button",
                  className: breadcrumbTargetClassName(item),
                  "aria-label": breadcrumbTargetAriaLabel(item),
                  onClick: (event: MouseEvent<HTMLButtonElement>) => item.onClick?.(item, event),
                },
                renderBreadcrumbContent(item),
              )
            : React.createElement(
                "a",
                {
                  className: breadcrumbTargetClassName(item),
                  href: item.href,
                  "aria-label": breadcrumbTargetAriaLabel(item),
                  onClick: hasAction
                    ? (event: MouseEvent<HTMLAnchorElement>) => {
                        event.preventDefault();
                        item.onClick?.(item, event);
                      }
                    : undefined,
                },
                renderBreadcrumbContent(item),
              );
        return React.createElement(
          "li",
          {
            key,
            className: "breadcrumbs__item",
            "data-collapsed": item.collapsed ? "true" : undefined,
          },
          target,
          !isLast
            ? React.createElement(
                "span",
                { className: "breadcrumbs__separator", "aria-hidden": "true" },
                separator,
              )
            : null,
        );
      }),
    ),
  );
}) as BreadcrumbsComponent;

Breadcrumbs.displayName = "Breadcrumbs";
Breadcrumbs.platformContract = breadcrumbsPlatformContract;
