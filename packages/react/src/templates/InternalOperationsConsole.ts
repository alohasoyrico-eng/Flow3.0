import React, { forwardRef, useState } from "react";
import { Surface, type SurfaceDensity, type SurfaceState, type SurfaceTone } from "../Surface.js";
import { AccountOperations, type AccountOperationsProps } from "../patterns/AccountOperations.js";
import { BackofficeApproval, type BackofficeApprovalProps } from "../patterns/BackofficeApproval.js";
import { CaseManagement, type CaseManagementProps } from "../patterns/CaseManagement.js";
import { DenseOperationalList, type DenseOperationalListProps } from "../patterns/DenseOperationalList.js";
import { PricingOperations, type PricingOperationsProps } from "../patterns/PricingOperations.js";
import { Sidebar, type SidebarGroup, type SidebarProps, type SidebarRoute } from "../patterns/Sidebar.js";
import { TicketQueue, type TicketQueueProps } from "../patterns/TicketQueue.js";
import { Topbar, type TopbarProps } from "../patterns/Topbar.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";

export type InternalOperationsConsoleState = "loaded" | "loading" | "empty" | "permission" | "error" | "offline" | "disabled";
export type InternalOperationsConsoleDensity = SurfaceDensity;
export type InternalOperationsConsoleModule = "cases" | "tickets" | "accounts" | "pricing" | "backoffice" | "growth" | (string & {});

export interface InternalOperationsConsoleProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: InternalOperationsConsoleDensity;
  tone?: SurfaceTone;
  state?: InternalOperationsConsoleState | undefined;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedModule?: InternalOperationsConsoleModule;
  defaultSelectedModule?: InternalOperationsConsoleModule;
  onSelectedModuleChange?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  drawerOpen?: boolean;
  defaultDrawerOpen?: boolean;
  onDrawerOpenChange?: SidebarProps["onDrawerOpenChange"];
  topbar?: TopbarProps;
  sidebar?: SidebarProps;
  cases?: CaseManagementProps;
  tickets?: TicketQueueProps;
  accounts?: AccountOperationsProps;
  pricing?: PricingOperationsProps;
  backoffice?: BackofficeApprovalProps;
  growth?: DenseOperationalListProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface InternalOperationsConsoleComponent extends ForwardRefExoticComponent<InternalOperationsConsoleProps & RefAttributes<HTMLDivElement>> {
  displayName: "InternalOperationsConsole";
}

type SanitizedRestProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
} & {
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

type SharedPatternState = "disabled" | "error" | "loading" | undefined;

function sanitizeRestProps(rest: Record<string, unknown>): SanitizedRestProps {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as SanitizedRestProps;
}

function resolveTemplateState({
  disabled,
  loading,
  error,
  permissionBlocked,
  offline,
  state,
}: {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  state?: InternalOperationsConsoleState | undefined;
}): InternalOperationsConsoleState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission") return "permission";
  if (loading || state === "loading") return "loading";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: InternalOperationsConsoleState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "error" || state === "offline") return "raised";
  if (state === "loading") return "sunken";
  return "default";
}

function patternStateForTemplate(state: InternalOperationsConsoleState): SharedPatternState {
  if (state === "disabled") return "disabled";
  if (state === "error" || state === "offline") return "error";
  if (state === "loading") return "loading";
  if (state === "permission") return "disabled";
  return undefined;
}

function defaultRoutes(activeKey: InternalOperationsConsoleModule): SidebarGroup[] {
  return [
    {
      title: "Internal operations",
      icon: "admin_panel_settings",
      routes: [
        { key: "cases", label: "Cases", icon: "fact_check", active: activeKey === "cases" },
        { key: "tickets", label: "Tickets", icon: "confirmation_number", active: activeKey === "tickets" },
        { key: "accounts", label: "Accounts", icon: "manage_accounts", active: activeKey === "accounts" },
        { key: "pricing", label: "Pricing", icon: "payments", active: activeKey === "pricing" },
        { key: "backoffice", label: "Backoffice", icon: "approval", active: activeKey === "backoffice" },
        { key: "growth", label: "Growth", icon: "trending_up", active: activeKey === "growth" },
      ],
    },
  ];
}

const defaultGrowthRows = [
  { key: "activation", metric: "Activation", owner: "Growth", status: "review", delta: "+8%" },
  { key: "retention", metric: "Retention", owner: "Lifecycle", status: "active", delta: "+3%" },
  { key: "referrals", metric: "Referrals", owner: "Acquisition", status: "paused", delta: "-2%" },
];

const defaultGrowthColumns: NonNullable<DenseOperationalListProps["table"]>["columns"] = [
  { key: "metric", label: "Metric", priority: "primary" },
  { key: "owner", label: "Owner" },
  { key: "status", label: "Status" },
  { key: "delta", label: "Delta", align: "right" },
];

export const InternalOperationsConsole = forwardRef<HTMLDivElement, InternalOperationsConsoleProps>(function InternalOperationsConsole({
  label = "Internal operations console",
  description = "Coordinate cases, tickets, accounts, pricing, approvals, and growth operations.",
  density = "sm",
  tone,
  state,
  disabled = false,
  loading = false,
  error = false,
  permissionBlocked = false,
  offline = false,
  selectedModule,
  defaultSelectedModule = "cases",
  onSelectedModuleChange,
  drawerOpen,
  defaultDrawerOpen = false,
  onDrawerOpenChange,
  topbar,
  sidebar,
  cases,
  tickets,
  accounts,
  pricing,
  backoffice,
  growth,
  className = "",
  ...rest
}, ref) {
  const [internalSelectedModule, setInternalSelectedModule] = useState<InternalOperationsConsoleModule>(defaultSelectedModule);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(defaultDrawerOpen);
  const resolvedSelectedModule = selectedModule ?? internalSelectedModule;
  const resolvedDrawerOpen = drawerOpen ?? internalDrawerOpen;
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isBusy = loading || resolvedState === "loading";
  const patternState = patternStateForTemplate(resolvedState);
  const routes = sidebar?.groups ?? defaultRoutes(resolvedSelectedModule);

  const handleRouteSelect = (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => {
    sidebar?.onRouteSelect?.(key, route, event);
    if (event.defaultPrevented || isDisabled) return;
    if (selectedModule === undefined) setInternalSelectedModule(key);
    onSelectedModuleChange?.(key, route, event);
  };

  const handleDrawerOpenChange: NonNullable<SidebarProps["onDrawerOpenChange"]> = (open, event) => {
    sidebar?.onDrawerOpenChange?.(open, event);
    if (drawerOpen === undefined) setInternalDrawerOpen(open);
    onDrawerOpenChange?.(open, event);
  };

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "canvas",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "none",
      tone: tone ?? (resolvedState === "permission" ? "warning" : resolvedState === "error" || resolvedState === "offline" ? "danger" : "default"),
      focusMode: "within",
      role: "region",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-template": "internal-operations-console",
      "data-template-state": resolvedState,
      "data-state": resolvedState,
      "data-density": density,
      "data-selected-module": resolvedSelectedModule,
      ...sanitizeRestProps(rest),
    },
    React.createElement(Topbar, {
      ...(topbar ?? {}),
      label: topbar?.label ?? label,
      density: topbar?.density ?? density,
      state: topbar?.state ?? (isBusy ? "loading" : resolvedState === "permission" ? "permission-filtered" : undefined),
      loading: isBusy || topbar?.loading,
      disabled: isDisabled || topbar?.disabled,
      permissionFiltered: resolvedState === "permission" || topbar?.permissionFiltered,
      sidebar: {
        ...(sidebar ?? {}),
        groups: routes,
        drawerOpen: resolvedDrawerOpen,
        onDrawerOpenChange: handleDrawerOpenChange,
      },
      navigationAction: topbar?.navigationAction ?? { label: "Open navigation", icon: "menu" },
      "data-template-slot": "global-shell",
    } as TopbarProps),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: resolvedState === "permission" ? "raised" : "default",
      density,
      elevation: "raised",
      "data-template-slot": "operations-navigation",
    },
      React.createElement(Sidebar, {
        ...(sidebar ?? {}),
        label: sidebar?.label ?? "Internal operations navigation",
        density: sidebar?.density ?? density,
        drawer: sidebar?.drawer === false ? false : {
          ...(sidebar?.drawer ?? {}),
          closeLabel: sidebar?.drawer?.closeLabel ?? "Close navigation panel",
          showCloseButton: sidebar?.drawer?.showCloseButton ?? true,
        },
        groups: routes,
        activeKey: resolvedSelectedModule,
        drawerOpen: resolvedDrawerOpen,
        loading: isBusy || sidebar?.loading,
        disabled: isDisabled || sidebar?.disabled,
        permissionFiltered: resolvedState === "permission" || sidebar?.permissionFiltered,
        onRouteSelect: handleRouteSelect,
        onDrawerOpenChange: handleDrawerOpenChange,
      } as SidebarProps),
    ),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: surfaceStateForTemplate(resolvedState),
      density,
      elevation: "none",
      "data-template-slot": "operations-workspace",
    },
      React.createElement(CaseManagement, {
        ...(cases ?? {}),
        label: cases?.label ?? "Case operations",
        description: cases?.description ?? "Triage case queues, evidence, filters, and activity.",
        density: cases?.density ?? density,
        state: cases?.state ?? patternState,
        loading: isBusy || cases?.loading,
        disabled: isDisabled || cases?.disabled,
        error: cases?.error ?? (resolvedState === "error" || resolvedState === "offline"),
        "data-template-module": "case-operations",
      } as CaseManagementProps),
      React.createElement(TicketQueue, {
        ...(tickets ?? {}),
        label: tickets?.label ?? "Ticket operations",
        description: tickets?.description ?? "Resolve ticket queues with alerts and detail drawers.",
        density: tickets?.density ?? density,
        state: tickets?.state ?? patternState,
        loading: isBusy || tickets?.loading,
        disabled: isDisabled || tickets?.disabled,
        error: tickets?.error ?? (resolvedState === "error" || resolvedState === "offline"),
        "data-template-module": "ticket-operations",
      } as TicketQueueProps),
      React.createElement(AccountOperations, {
        ...(accounts ?? {}),
        label: accounts?.label ?? "Account operations",
        description: accounts?.description ?? "Review account records, detail drawers, and audit history.",
        density: accounts?.density ?? density,
        state: accounts?.state ?? patternState,
        loading: isBusy || accounts?.loading,
        disabled: isDisabled || accounts?.disabled,
        error: accounts?.error ?? (resolvedState === "error" || resolvedState === "offline"),
        "data-template-module": "account-operations",
      } as AccountOperationsProps),
      React.createElement(PricingOperations, {
        ...(pricing ?? {}),
        label: pricing?.label ?? "Pricing operations",
        description: pricing?.description ?? "Manage pricing rules, approval queues, and access policy.",
        density: pricing?.density ?? density,
        state: pricing?.state ?? patternState,
        loading: isBusy || pricing?.loading,
        disabled: isDisabled || pricing?.disabled,
        error: pricing?.error ?? (resolvedState === "error" || resolvedState === "offline"),
        "data-template-module": "pricing-operations",
      } as PricingOperationsProps),
      React.createElement(BackofficeApproval, {
        ...(backoffice ?? {}),
        label: backoffice?.label ?? "Backoffice approvals",
        description: backoffice?.description ?? "Approve documents and review pending backoffice decisions.",
        density: backoffice?.density ?? density,
        state: backoffice?.state ?? patternState,
        loading: isBusy || backoffice?.loading,
        disabled: isDisabled || backoffice?.disabled,
        error: backoffice?.error ?? (resolvedState === "error" || resolvedState === "offline"),
        "data-template-module": "backoffice-approvals",
      } as BackofficeApprovalProps),
      React.createElement(DenseOperationalList, {
        ...(growth ?? {}),
        label: growth?.label ?? "Growth operations",
        description: growth?.description ?? "Monitor growth experiments without creating a custom table shell.",
        density: growth?.density ?? density,
        state: growth?.state ?? patternState,
        loading: isBusy || growth?.loading,
        disabled: isDisabled || growth?.disabled,
        error: growth?.error ?? (resolvedState === "error" || resolvedState === "offline"),
        table: growth?.table ?? {
          columns: defaultGrowthColumns,
          rows: defaultGrowthRows,
          rowKey: "key",
        },
        "data-template-module": "growth-operations",
      } as DenseOperationalListProps),
    ),
  );
}) as InternalOperationsConsoleComponent;

InternalOperationsConsole.displayName = "InternalOperationsConsole";
